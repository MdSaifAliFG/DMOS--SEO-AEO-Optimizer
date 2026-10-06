import sys
import asyncio
import urllib.request
import urllib.error
import json

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(line_buffering=True)

# Ensure SelectorEventLoop on Windows
if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

from app.core.auth import create_access_token
from app.core.database import AsyncSessionLocal
from app.models.user import User
from app.models.project import Project
from app.models.scan import Scan
from app.models.geo import GeoProject
from app.models.aeo import AeoProject
from sqlalchemy import select

API_BASE = "http://127.0.0.1:8000/api/v1"
FRONTEND_BASE = "http://localhost:3000"

def api_get(endpoint, token=None):
    url = f"{API_BASE}{endpoint}"
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data = resp.read().decode()
            return resp.status, json.loads(data) if data else None
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        return e.code, body
    except Exception as e:
        return 0, str(e)

def http_get_redirect(url, cookie=None):
    class NoRedirectHandler(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, req, fp, code, msg, headers, newurl):
            return None
    opener = urllib.request.build_opener(NoRedirectHandler)
    req = urllib.request.Request(url)
    if cookie:
        req.add_header("Cookie", cookie)
    try:
        resp = opener.open(req)
        return resp.status, resp.headers.get("Location")
    except urllib.error.HTTPError as e:
        return e.code, e.headers.get("Location")

async def run_all_tests():
    print("=" * 60)
    print("STARTING COMPREHENSIVE SECURITY & DATA ISOLATION VERIFICATION")
    print("=" * 60)

    # 1. Fetch User A and User B from DB
    async with AsyncSessionLocal() as s:
        res = await s.execute(select(User).where(User.email == "mds650386@gmail.com"))
        user_a = res.scalar_one_or_none()
        
        res = await s.execute(select(User).where(User.email == "sunithahr176@gmail.com"))
        user_b = res.scalar_one_or_none()
        
        if not user_a or not user_b:
            print("ERROR: Test users not found in DB")
            return

        # Get User A's project
        res_p = await s.execute(select(Project).where(Project.user_id == user_a.id))
        user_a_project = res_p.scalars().first()

        # Get User A's scan
        user_a_scan = None
        if user_a_project:
            res_sc = await s.execute(select(Scan).where(Scan.project_id == user_a_project.id))
            user_a_scan = res_sc.scalars().first()

    token_a = create_access_token(user_a.id)
    token_b = create_access_token(user_b.id)

    print(f"\n[+] User A: {user_a.email} (ID: {user_a.id})")
    print(f"[+] User B: {user_b.email} (ID: {user_b.id})")
    if user_a_project:
        print(f"[+] User A Project ID: {user_a_project.id} ({user_a_project.name})")
    if user_a_scan:
        print(f"[+] User A Scan ID: {user_a_scan.id}")

    # ========================================================
    # TEST SUITE 1: Unauthenticated Endpoint Protection
    # ========================================================
    print("\n--- TEST SUITE 1: Unauthenticated Endpoint Protection ---")
    protected_endpoints = [
        "/projects",
        f"/projects/{user_a_project.id}/scans" if user_a_project else "/projects/test/scans",
        f"/scans/{user_a_scan.id}" if user_a_scan else "/scans/test",
        "/seo/actions",
        "/seo/technical/diagnostics",
        "/seo/links",
        "/aeo/questions",
        "/aeo/citations",
        "/aeo/answers",
        "/aeo/actions",
        "/geo/projects",
        "/geo/questions?project_id=test",
        "/geo/citations?project_id=test",
        "/geo/actions?project_id=test",
        "/notifications/feed",
        "/settings",
    ]
    for ep in protected_endpoints:
        status, body = api_get(ep, token=None)
        assert status == 401, f"Expected 401 for {ep}, got {status}: {body}"
        print(f"  [PASS] Unauthenticated {ep} -> 401 Unauthorized")

    # ========================================================
    # TEST SUITE 2: Cross-Account Data Isolation
    # ========================================================
    print("\n--- TEST SUITE 2: Cross-Account Data Isolation ---")

    # 2.1 Projects Isolation
    status_a, projs_a = api_get("/projects", token=token_a)
    status_b, projs_b = api_get("/projects", token=token_b)
    assert status_a == 200 and status_b == 200
    a_proj_ids = {p["id"] for p in projs_a.get("projects", [])}
    b_proj_ids = {p["id"] for p in projs_b.get("projects", [])}
    overlap = a_proj_ids.intersection(b_proj_ids)
    assert len(overlap) == 0, f"DATA LEAK DETECTED: Projects overlap: {overlap}"
    print(f"  [PASS] /projects: User A has {len(a_proj_ids)} projects, User B has {len(b_proj_ids)} projects. Zero overlap.")

    # 2.2 Scans Isolation
    if user_a_project:
        status_a, scans_a = api_get(f"/projects/{user_a_project.id}/scans", token=token_a)
        assert status_a == 200, f"Expected 200 for User A scans, got {status_a}"
        a_scan_ids = {s["id"] for s in scans_a.get("scans", [])}
        
        status_b, cross_scans_b = api_get(f"/projects/{user_a_project.id}/scans", token=token_b)
        assert status_b in (403, 404), f"DATA LEAK: User B accessed User A's scans: {status_b}"
        print(f"  [PASS] /projects/{{id}}/scans: User A accessed their {len(a_scan_ids)} scans; User B received {status_b} Forbidden/NotFound.")

    # 2.3 SEO Technical Diagnostics Isolation
    status_a, diag_a = api_get("/seo/technical/diagnostics", token=token_a)
    status_b, diag_b = api_get("/seo/technical/diagnostics", token=token_b)
    assert status_a == 200 and status_b == 200
    assert diag_b.get("discovered_pages") == 0 and diag_b.get("technical_score") == 0, f"DATA LEAK: User B got non-zero diagnostics: {diag_b}"
    print(f"  [PASS] /seo/technical/diagnostics: User A technical score = {diag_a.get('technical_score')}, User B technical score = {diag_b.get('technical_score')} (0 discovered pages). Zero leak.")

    # 2.4 SEO Links Isolation
    status_a, links_a = api_get("/seo/links", token=token_a)
    status_b, links_b = api_get("/seo/links", token=token_b)
    assert status_a == 200 and status_b == 200
    assert len(links_b.get("links", [])) == 0, f"DATA LEAK: User B got links: {links_b}"
    print(f"  [PASS] /seo/links: User B received {len(links_b.get('links', []))} links. Zero leak.")

    # 2.5 SEO Actions Isolation
    status_a, actions_a = api_get("/seo/actions", token=token_a)
    status_b, actions_b = api_get("/seo/actions", token=token_b)
    assert status_a == 200 and status_b == 200
    a_act_ids = {r["id"] for r in actions_a.get("recommendations", [])}
    b_act_ids = {r["id"] for r in actions_b.get("recommendations", [])}
    overlap_acts = a_act_ids.intersection(b_act_ids)
    assert len(overlap_acts) == 0, f"DATA LEAK: Actions overlap: {overlap_acts}"
    print(f"  [PASS] /seo/actions: User A has {len(a_act_ids)} actions, User B has {len(b_act_ids)} actions. Zero overlap.")

    # 2.6 AEO Questions without project_id
    status_a, aeo_q_a = api_get("/aeo/questions", token=token_a)
    status_b, aeo_q_b = api_get("/aeo/questions", token=token_b)
    assert status_a == 200 and status_b == 200
    a_q_ids = {q["id"] for q in aeo_q_a.get("questions", [])}
    b_q_ids = {q["id"] for q in aeo_q_b.get("questions", [])}
    overlap_q = a_q_ids.intersection(b_q_ids)
    assert len(overlap_q) == 0, f"DATA LEAK: AEO questions overlap: {overlap_q}"
    print(f"  [PASS] /aeo/questions: User A has {len(a_q_ids)} questions, User B has {len(b_q_ids)} questions. Zero overlap.")

    # 2.7 AEO Citations without project_id
    status_a, aeo_c_a = api_get("/aeo/citations", token=token_a)
    status_b, aeo_c_b = api_get("/aeo/citations", token=token_b)
    assert status_a == 200 and status_b == 200
    a_c_ids = {c["id"] for c in aeo_c_a.get("citations", [])}
    b_c_ids = {c["id"] for c in aeo_c_b.get("citations", [])}
    overlap_c = a_c_ids.intersection(b_c_ids)
    assert len(overlap_c) == 0, f"DATA LEAK: AEO citations overlap: {overlap_c}"
    print(f"  [PASS] /aeo/citations: User A has {len(a_c_ids)} citations, User B has {len(b_c_ids)} citations. Zero overlap.")

    # 2.8 Cross-User Resource Access Authorization
    if user_a_project:
        status_cross_p, body_p = api_get(f"/projects/{user_a_project.id}", token=token_b)
        assert status_cross_p in (403, 404), f"SECURITY FAILURE: User B accessed User A's project: {status_cross_p}"
        print(f"  [PASS] User B cannot access User A's Project: returned {status_cross_p}")

    if user_a_scan:
        status_cross_s, body_s = api_get(f"/scans/{user_a_scan.id}", token=token_b)
        assert status_cross_s in (403, 404), f"SECURITY FAILURE: User B accessed User A's scan: {status_cross_s}"
        print(f"  [PASS] User B cannot access User A's Scan: returned {status_cross_s}")

    # 2.9 Real-time Notification Feed Isolation
    status_feed_a, feed_a = api_get("/notifications/feed", token=token_a)
    status_feed_b, feed_b = api_get("/notifications/feed", token=token_b)
    assert status_feed_a == 200 and status_feed_b == 200
    # Any scan notifications in feed_b must not belong to User A
    user_a_scan_notif_ids = {n["id"] for n in feed_a if "seo_scan_" in n["id"]}
    user_b_scan_notif_ids = {n["id"] for n in feed_b if "seo_scan_" in n["id"]}
    overlap_feed = user_a_scan_notif_ids.intersection(user_b_scan_notif_ids)
    assert len(overlap_feed) == 0, f"DATA LEAK: Notification feed overlap: {overlap_feed}"
    print(f"  [PASS] /notifications/feed: User A has {len(feed_a)} notifications, User B has {len(feed_b)} notifications. Zero scan leaks.")

    # ========================================================
    # TEST SUITE 3: Frontend Route Protection (Next.js Middleware)
    # ========================================================
    print("\n--- TEST SUITE 3: Frontend Route Protection ---")
    protected_frontend_routes = [
        "/overview",
        "/projects",
        "/seo/dashboard",
        "/aeo/dashboard",
        "/geo/dashboard",
        "/settings",
    ]
    for route in protected_frontend_routes:
        status, loc = http_get_redirect(f"{FRONTEND_BASE}{route}")
        assert status == 307, f"Expected 307 redirect for {route}, got {status}"
        assert "/login" in loc, f"Expected redirect to /login for {route}, got {loc}"
        print(f"  [PASS] Direct URL navigation to {route} without session -> 307 Redirect to {loc}")

    # Authenticated frontend route access
    valid_cookie = f"zobayrank_auth_token={token_b}"
    for route in protected_frontend_routes:
        status, loc = http_get_redirect(f"{FRONTEND_BASE}{route}", cookie=valid_cookie)
        assert status == 200, f"Expected 200 OK for {route} with valid cookie, got {status}"
        print(f"  [PASS] Authenticated navigation to {route} -> 200 OK")

    print("\n" + "=" * 60)
    print("ALL TESTS PASSED! DATA ISOLATION & ROUTE PROTECTION CONFIRMED.")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(run_all_tests())

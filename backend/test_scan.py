import urllib.request
import json

url = 'http://127.0.0.1:8000/api/v1/public/scan'
payload = {'url': 'https://python.org', 'mode': 'page'}
req = urllib.request.Request(
    url,
    data=json.dumps(payload).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)

try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        print(f"Overall Score: {data['overall_score']} (Grade: {data['grade']})")
        print(f"SEO: {data['seo']}")
        print(f"AEO: {data['aeo']}")
        print(f"GEO: {data['geo']}")
        print("\n--- ISSUES FLAGGED ---")
        for issue in data.get('issues', []):
            print(f"[{issue['pillar'].upper()}] [{issue['severity'].upper()}] {issue['code']}: {issue['label']}")
except Exception as e:
    print("Error:", e)

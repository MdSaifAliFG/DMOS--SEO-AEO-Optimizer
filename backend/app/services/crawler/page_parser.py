import json
import logging
import re
from typing import Any, Dict, List, Optional
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
from app.services.crawler.url_normalizer import is_internal_url, normalize_url

logger = logging.getLogger(__name__)


class ParsedPageData:
    """Structured data extracted from an HTML webpage."""

    def __init__(
        self,
        title: Optional[str] = None,
        meta_description: Optional[str] = None,
        canonical_url: Optional[str] = None,
        robots_directive: Optional[str] = None,
        x_robots_tag: Optional[str] = None,
        language: Optional[str] = None,
        h1_count: int = 0,
        h2_count: int = 0,
        h3_count: int = 0,
        headings: Optional[Dict[str, List[str]]] = None,
        word_count: int = 0,
        is_indexable: bool = True,
        images: Optional[List[Dict[str, Any]]] = None,
        links: Optional[List[Dict[str, Any]]] = None,
        open_graph: Optional[Dict[str, Any]] = None,
        twitter_card: Optional[Dict[str, Any]] = None,
        structured_data: Optional[List[Dict[str, Any]]] = None,
        mixed_content_resources: Optional[List[str]] = None,
    ):
        self.title = title
        self.meta_description = meta_description
        self.canonical_url = canonical_url
        self.robots_directive = robots_directive
        self.x_robots_tag = x_robots_tag
        self.language = language
        self.h1_count = h1_count
        self.h2_count = h2_count
        self.h3_count = h3_count
        self.headings = headings or {"h1": [], "h2": [], "h3": []}
        self.word_count = word_count
        self.is_indexable = is_indexable
        self.images = images or []
        self.links = links or []
        self.open_graph = open_graph or {}
        self.twitter_card = twitter_card or {}
        self.structured_data = structured_data or []
        self.mixed_content_resources = mixed_content_resources or []


class HTMLPageParser:
    """Extracts SEO metadata, headings, images, links, and structured data from HTML."""

    @staticmethod
    def parse(
        html_content: str,
        current_url: str,
        project_domain: str,
        headers: Optional[Dict[str, str]] = None,
    ) -> ParsedPageData:
        headers = headers or {}
        if not html_content:
            return ParsedPageData(is_indexable=True)

        try:
            soup = BeautifulSoup(html_content, "html.parser")
        except Exception as e:
            logger.warning("Error parsing HTML with BeautifulSoup: %s", e)
            return ParsedPageData(is_indexable=True)

        # 1. Title
        title_tag = soup.find("title")
        title = title_tag.get_text().strip() if title_tag else None

        # 2. Meta Description
        meta_desc_tag = soup.find("meta", attrs={"name": re.compile(r"^description$", re.I)})
        meta_description = meta_desc_tag.get("content", "").strip() if meta_desc_tag else None
        if meta_description == "":
            meta_description = None

        # 3. Canonical URL
        canonical_tag = soup.find("link", attrs={"rel": re.compile(r"^canonical$", re.I)})
        raw_canonical = canonical_tag.get("href", "").strip() if canonical_tag else None
        canonical_url = None
        if raw_canonical:
            canonical_url = urljoin(current_url, raw_canonical)

        # 4. Robots Directives
        robots_tag = soup.find("meta", attrs={"name": re.compile(r"^(robots|googlebot)$", re.I)})
        robots_directive = robots_tag.get("content", "").strip().lower() if robots_tag else None

        x_robots_tag = None
        for h_key, h_val in headers.items():
            if h_key.lower() == "x-robots-tag":
                x_robots_tag = h_val.strip().lower()
                break

        # Check indexability
        is_indexable = True
        if robots_directive and "noindex" in robots_directive:
            is_indexable = False
        if x_robots_tag and "noindex" in x_robots_tag:
            is_indexable = False

        # 5. Language
        html_tag = soup.find("html")
        language = html_tag.get("lang", "").strip() if html_tag else None
        if not language:
            language = None

        # 6. Headings
        h1_tags = [h.get_text().strip() for h in soup.find_all("h1") if h.get_text().strip()]
        h2_tags = [h.get_text().strip() for h in soup.find_all("h2") if h.get_text().strip()]
        h3_tags = [h.get_text().strip() for h in soup.find_all("h3") if h.get_text().strip()]
        headings = {
            "h1": h1_tags,
            "h2": h2_tags,
            "h3": h3_tags,
        }

        # 7. Word Count
        # Extract visible text from body
        body_tag = soup.find("body") or soup
        # Remove script and style tags
        for element in body_tag(["script", "style", "noscript", "svg"]):
            element.extract()
        visible_text = body_tag.get_text(separator=" ", strip=True)
        words = re.findall(r"\b\w+\b", visible_text)
        word_count = len(words)

        # 8. Images
        images: List[Dict[str, Any]] = []
        is_page_https = current_url.startswith("https://")
        mixed_content_resources: List[str] = []

        for img in soup.find_all("img"):
            src = img.get("src", "").strip()
            if not src:
                continue
            abs_src = urljoin(current_url, src)

            # Check mixed content
            if is_page_https and abs_src.startswith("http://"):
                mixed_content_resources.append(abs_src)

            # Check alt: None means missing, "" means empty decorative
            raw_alt = img.get("alt")
            alt_val = raw_alt.strip() if raw_alt is not None else None

            # Parse width/height if available
            width = None
            height = None
            try:
                if img.get("width"):
                    width = int(re.sub(r"\D", "", img.get("width")))
                if img.get("height"):
                    height = int(re.sub(r"\D", "", img.get("height")))
            except Exception:
                pass

            images.append({
                "src": abs_src,
                "alt": alt_val,
                "width": width,
                "height": height,
                "is_internal": is_internal_url(abs_src, project_domain),
            })

        # Check script / link mixed content
        if is_page_https:
            for tag in soup.find_all(["script", "link"]):
                src = tag.get("src") or tag.get("href")
                if src:
                    abs_res = urljoin(current_url, src.strip())
                    if abs_res.startswith("http://") and abs_res not in mixed_content_resources:
                        mixed_content_resources.append(abs_res)

        # 9. Links
        links: List[Dict[str, Any]] = []
        for a_tag in soup.find_all("a", href=True):
            raw_href = a_tag.get("href", "").strip()
            if not raw_href or raw_href.startswith("#") or raw_href.startswith("javascript:") or raw_href.startswith("mailto:") or raw_href.startswith("tel:"):
                continue

            abs_target = urljoin(current_url, raw_href)
            norm_target = normalize_url(abs_target)
            if not norm_target:
                continue

            anchor_text = a_tag.get_text().strip()
            rel = a_tag.get("rel", [])
            rel_str = " ".join(rel).lower() if isinstance(rel, list) else str(rel).lower()
            is_follow = "nofollow" not in rel_str

            is_internal = is_internal_url(norm_target, project_domain)

            links.append({
                "target_url": norm_target,
                "anchor_text": anchor_text[:500] if anchor_text else None,
                "link_type": "internal" if is_internal else "external",
                "is_internal": is_internal,
                "is_follow": is_follow,
            })

        # 10. Open Graph Metadata
        open_graph: Dict[str, Any] = {}
        for og in soup.find_all("meta", property=re.compile(r"^og:", re.I)):
            prop = og.get("property", "").lower()
            val = og.get("content", "").strip()
            if prop and val:
                open_graph[prop] = val

        # 11. Twitter Card Metadata
        twitter_card: Dict[str, Any] = {}
        for tw in soup.find_all("meta", attrs={"name": re.compile(r"^twitter:", re.I)}):
            name = tw.get("name", "").lower()
            val = tw.get("content", "").strip()
            if name and val:
                twitter_card[name] = val

        # 12. Structured Data (JSON-LD)
        structured_data: List[Dict[str, Any]] = []
        for s_tag in soup.find_all("script", attrs={"type": "application/ld+json"}):
            try:
                content = s_tag.string or s_tag.get_text()
                if content:
                    parsed_json = json.loads(content.strip())
                    structured_data.append(parsed_json)
            except Exception:
                pass

        return ParsedPageData(
            title=title,
            meta_description=meta_description,
            canonical_url=canonical_url,
            robots_directive=robots_directive,
            x_robots_tag=x_robots_tag,
            language=language,
            h1_count=len(h1_tags),
            h2_count=len(h2_tags),
            h3_count=len(h3_tags),
            headings=headings,
            word_count=word_count,
            is_indexable=is_indexable,
            images=images,
            links=links,
            open_graph=open_graph,
            twitter_card=twitter_card,
            structured_data=structured_data,
            mixed_content_resources=mixed_content_resources,
        )

"""Check the generated site for broken local links and fragment identifiers."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import sys


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.ids = set()
        self.links = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("id"):
            self.ids.add(attrs["id"])
        for key in ("href", "src"):
            if attrs.get(key):
                self.links.append(attrs[key])


root = Path("_site").resolve()
baseurl = "/tech-notes"
pages = {path: Page(path.read_text(encoding="utf-8")) for path in root.rglob("*.html")}
errors = []
if not pages or not (root / "index.html").exists():
    sys.exit("Missing generated site. Run Jekyll first.")

for path, page in pages.items():
    for link in page.links:
        parsed = urlsplit(link)
        if parsed.scheme or parsed.netloc:
            continue
        raw_path = unquote(parsed.path)
        if raw_path.startswith("/"):
            if raw_path == baseurl or raw_path.startswith(baseurl + "/"):
                target = root / raw_path[len(baseurl):].lstrip("/")
            else:
                errors.append(f"{path.relative_to(root)}: missing baseurl in {link}")
                continue
        else:
            target = path.parent / raw_path if raw_path else path
        target = target.resolve()
        if not target.is_relative_to(root):
            errors.append(f"{path.relative_to(root)}: path outside site: {link}")
            continue
        if target.is_dir():
            target /= "index.html"
        if not target.exists():
            errors.append(f"{path.relative_to(root)}: missing target: {link}")
        elif parsed.fragment and target in pages:
            if unquote(parsed.fragment) not in pages[target].ids:
                errors.append(f"{path.relative_to(root)}: missing anchor: {link}")

if errors:
    sys.exit("\n".join(errors))
print(f"Checked {len(pages)} HTML pages: internal links, assets, and anchors passed.")

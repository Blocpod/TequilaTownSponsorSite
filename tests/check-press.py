"""Check the press page and its downloadable pack using only Python's standard library."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import zipfile
import xml.etree.ElementTree as ET

repo = Path(__file__).resolve().parents[1]
site = repo / 'dist' if (repo / 'dist').is_dir() else repo

class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.links=[]; self.assets=[]; self.ids=[]; self.footer=False; self.press_footer=0; self.press_other=0; self.downloads=[]
    def handle_starttag(self, tag, items):
        attrs=dict(items)
        if tag=='footer': self.footer=True
        if 'id' in attrs: self.ids.append(attrs['id'])
        if tag=='a':
            href=attrs.get('href',''); self.links.append(href)
            if href=='press.html':
                if self.footer: self.press_footer+=1
                else: self.press_other+=1
            if 'download' in attrs: self.downloads.append(href)
        if tag in ('img','script') and attrs.get('src'): self.assets.append(attrs['src'])
        if tag=='img': assert 'alt' in attrs, 'Missing image alternative text'
        if tag=='link' and attrs.get('rel')=='stylesheet': self.assets.append(attrs['href'])
    def handle_endtag(self, tag):
        if tag=='footer': self.footer=False

page=Page(); page.feed((site/'press.html').read_text())
assert len(page.ids)==len(set(page.ids)), 'Duplicate IDs'
for url in page.links+page.assets:
    parsed=urlsplit(url)
    if parsed.scheme or parsed.netloc: continue
    if parsed.path: assert (site/unquote(parsed.path)).is_file(), f'Missing local target: {url}'
    if not parsed.path and parsed.fragment: assert parsed.fragment in page.ids, f'Broken section link: {url}'
assert len(page.downloads)==15, f'Unexpected download count: {len(page.downloads)}'
home=Page(); home.feed((site/'index.html').read_text())
assert home.press_footer==1 and home.press_other==0, 'Press page must be linked only in the homepage footer'
pack=site/'assets/press/tequila-town-press-pack.zip'
with zipfile.ZipFile(pack) as archive:
    assert archive.testzip() is None, 'Damaged ZIP'
    names=archive.namelist()
    assert len(names)==14 and len(names)==len(set(names)), 'Missing or duplicate pack files'
    assert sum(n.endswith('.jpg') for n in names)==4
    assert sum(n.endswith('.ttf') for n in names)==2
    for name in names:
        relative=Path(name).relative_to('Tequila-Town-Press-Pack')
        assert '..' not in relative.parts
        assert archive.read(name)==(site/'assets/press'/relative).read_bytes(), f'ZIP copy differs: {relative}'
for filename in ('tequila-town-white.svg','tequila-town-dark.svg'):
    assert ET.parse(site/'assets/press/logos'/filename).getroot().tag.endswith('svg')
print('PASS: press links, images, unique IDs, footer-only entry, 15 downloads, 14-file ZIP and SVG logos')

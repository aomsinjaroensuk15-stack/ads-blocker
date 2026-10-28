#!/usr/bin/env python3
"""ShieldMark build script.

Bundles src/selectors.js + src/core.js into:
  dist/bookmarklet.txt   -> one-line bookmarklet ready for Chrome
  dist/shieldmark.min.js -> the raw minified JS (for debugging)

Usage:  python build.py
Requires only the Python standard library.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
DIST = ROOT / "dist"


def strip_comments(code: str) -> str:
    """Remove /* */ blocks and full-line // comments only.

    IMPORTANT: source files must never use INLINE // comments
    (a comment at the end of a code line), because minification
    joins lines with spaces and would corrupt them.
    """
    code = re.sub(r"/\*.*?\*/", "", code, flags=re.S)
    kept = [ln.rstrip() for ln in code.splitlines()
            if not ln.lstrip().startswith("//")]
    return "\n".join(kept)


def minify(code: str) -> str:
    """Collapse to a single line, joining statements with spaces.

    Safe because the source style guarantees every statement ends
    with ';' and no statement spans multiple lines.
    """
    code = strip_comments(code)
    parts = [ln.strip() for ln in code.splitlines() if ln.strip()]
    return " ".join(parts)


def main() -> None:
    DIST.mkdir(exist_ok=True)
    bundle = (SRC / "selectors.js").read_text(encoding="utf-8") + "\n" \
        + (SRC / "core.js").read_text(encoding="utf-8")
    tiny = minify(bundle)
    bookmarklet = "javascript:(function(){" + tiny + "})();"
    (DIST / "bookmarklet.txt").write_text(bookmarklet + "\n",
                                          encoding="utf-8")
    (DIST / "shieldmark.min.js").write_text(tiny + "\n",
                                            encoding="utf-8")
    print(f"OK -> dist/bookmarklet.txt   ({len(bookmarklet)} chars)")
    print(f"OK -> dist/shieldmark.min.js ({len(tiny)} chars)")


if __name__ == "__main__":
    main()

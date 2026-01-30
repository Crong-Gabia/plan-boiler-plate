#!/usr/bin/env python3
import argparse
import os
import re
import sys
from pathlib import Path

HANGUL_RE = re.compile(r"[가-힣]")


def strip_markdown_noise(text: str) -> str:
    # Remove fenced code blocks
    text = re.sub(r"```[\s\S]*?```", " ", text)
    # Remove inline code
    text = re.sub(r"`[^`]*`", " ", text)
    # Remove markdown links but keep visible text
    text = re.sub(r"\[([^\]]+)\]\([^\)]+\)", r"\1", text)
    # Remove HTML tags
    text = re.sub(r"<[^>]+>", " ", text)
    return text


def iter_md_files(root: Path):
    for p in root.rglob("*.md"):
        # basic ignores
        parts = set(p.parts)
        if "node_modules" in parts or ".idea" in parts:
            continue
        yield p


def extract_korean_lines(text: str):
    cleaned = strip_markdown_noise(text)
    lines = [ln.strip() for ln in cleaned.splitlines()]
    for ln in lines:
        if not ln:
            continue
        if HANGUL_RE.search(ln):
            # Skip headings-only or list markers with no content
            yield ln


def main() -> int:
    ap = argparse.ArgumentParser(description="Korean spellcheck for Markdown (online-dependent).")
    ap.add_argument("path", nargs="?", default=".", help="Root directory to scan (default: .)")
    ap.add_argument("--max-lines", type=int, default=300, help="Max Korean lines to check")
    args = ap.parse_args()

    root = Path(args.path).resolve()
    if not root.exists():
        print(f"Path not found: {root}", file=sys.stderr)
        return 1

    try:
        from hanspell import spell_checker  # type: ignore
    except Exception as e:
        print("Missing dependency: py-hanspell", file=sys.stderr)
        print("Install via: pip install -r scripts/requirements-ko-spellcheck.txt", file=sys.stderr)
        print(str(e), file=sys.stderr)
        return 1

    checked = 0
    had_errors = False

    for md in iter_md_files(root):
        try:
            content = md.read_text(encoding="utf-8")
        except Exception:
            continue

        for line in extract_korean_lines(content):
            if checked >= args.max_lines:
                break
            checked += 1
            try:
                result = spell_checker.check(line)
                fixed = result.checked
            except Exception as e:
                # Online-dependent libraries can fail (rate limit / network)
                print(f"[ERROR] {md}: online spellcheck failed: {e}", file=sys.stderr)
                had_errors = True
                continue

            if fixed != line:
                had_errors = True
                print(f"[DIFF] {md}")
                print(f"  - {line}")
                print(f"  + {fixed}")

    if checked == 0:
        print("No Korean text found to check.")
        return 0

    if had_errors:
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

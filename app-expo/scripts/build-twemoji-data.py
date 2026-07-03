#!/usr/bin/env python3
"""Regenerate lib/twemojiData.ts with Twemoji SVGs for every emoji the app uses.

On Android the app renders Twemoji SVGs (inlined here) instead of the device's
stock emoji, so the look is consistent. Any emoji missing from the table falls
back to the ugly pixelated stock glyph — so whenever meals/emoji change, rerun:

    python3 scripts/build-twemoji-data.py

Downloads missing glyphs from the jdecked/twemoji CDN and keeps existing ones.
"""
import json
import os
import re
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MEALS = os.path.join(ROOT, 'data', 'meals.json')
OUT = os.path.join(ROOT, 'lib', 'twemojiData.ts')
CDN = 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/{}.svg'

# Emoji used in the UI chrome that don't come from meals.json.
EXTRA_EMOJI = ['🥗', '💅', '😂', '🧸', '🇧🇬', '🎲', '🌅', '🍽', '🍎', '🍰', '☕', '🌊']


def tokenize(s):
    """Mirror of tokenizeEmoji() in twemojiData.ts."""
    out, chars, i = [], [c for c in s], 0
    while i < len(chars):
        cp = ord(chars[i])
        if cp == 0xfe0f:  # strip variation selector
            i += 1
            continue
        if 0x1f1e6 <= cp <= 0x1f1ff and i + 1 < len(chars):
            cp2 = ord(chars[i + 1])
            if 0x1f1e6 <= cp2 <= 0x1f1ff:
                out.append(f'{cp:x}-{cp2:x}')
                i += 2
                continue
        out.append(f'{cp:x}')
        i += 1
    return out


def collect_tokens():
    with open(MEALS, encoding='utf-8') as f:
        data = json.load(f)
    emojis = [m['emoji'] for m in data['meals']]
    emojis += [m['emoji'] for m in data.get('moods', [])]
    emojis += EXTRA_EMOJI
    tokens = []
    for e in emojis:
        for t in tokenize(e):
            if t not in tokens:
                tokens.append(t)
    return sorted(tokens)


def load_existing():
    """Parse the current TWEMOJI_SVG map so we don't re-download glyphs."""
    if not os.path.exists(OUT):
        return {}
    text = open(OUT, encoding='utf-8').read()
    out = {}
    for m in re.finditer(r'"([0-9a-f\-]+)":\s*"(.*?)",?\n', text):
        out[m.group(1)] = m.group(2)
    return out


def fetch(token):
    url = CDN.format(token)
    try:
        with urllib.request.urlopen(url, timeout=20) as r:
            svg = r.read().decode('utf-8').strip()
        # Escape for embedding in a TS double-quoted string.
        return svg.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '')
    except Exception as e:
        print(f'  ! failed {token}: {e}')
        return None


def main():
    tokens = collect_tokens()
    existing = load_existing()
    svgs = {}
    downloaded = 0
    missing = []
    for t in tokens:
        if t in existing and existing[t]:
            svgs[t] = existing[t]
        else:
            svg = fetch(t)
            if svg:
                svgs[t] = svg
                downloaded += 1
                print(f'  + {t}')
            else:
                missing.append(t)
    # Preserve any existing glyphs not in our token list (flags etc.)
    for t, v in existing.items():
        svgs.setdefault(t, v)

    total_kb = sum(len(v) for v in svgs.values()) // 1024
    lines = [
        '// Auto-generated from Twemoji SVG assets. Do not edit by hand.',
        '// See scripts/build-twemoji-data.py to regenerate.',
        '',
        f'// {len(svgs)} emoji glyphs · {total_kb} KB of inlined SVG',
        '',
        'export const TWEMOJI_SVG: Record<string, string> = {',
    ]
    for t in sorted(svgs):
        lines.append(f'  "{t}": "{svgs[t]}",')
    lines.append('};')
    lines.append('')

    # Re-append the tokenizeEmoji function from the old file (it lives below the map).
    old = open(OUT, encoding='utf-8').read() if os.path.exists(OUT) else ''
    fn_idx = old.find('export function tokenizeEmoji')
    if fn_idx != -1:
        # find the JSDoc comment start before it
        doc_idx = old.rfind('/**', 0, fn_idx)
        lines.append(old[doc_idx if doc_idx != -1 else fn_idx:].rstrip())
        lines.append('')

    with open(OUT, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))

    print(f'\nDone: {len(svgs)} glyphs ({downloaded} newly downloaded).')
    if missing:
        print(f'WARNING — no Twemoji for: {missing}')
        sys.exit(1)


if __name__ == '__main__':
    main()

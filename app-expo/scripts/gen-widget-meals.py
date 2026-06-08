#!/usr/bin/env python3
"""Generate ios/KakvoWidget/WidgetMeals.swift from data/meals.json.

The iOS widget can't read the app's JS bundle, so we compile the meal data
into a Swift source file. Run this whenever meals.json changes:

    python3 scripts/gen-widget-meals.py
"""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'data', 'meals.json')
OUT = os.path.join(ROOT, 'ios', 'KakvoWidget', 'WidgetMeals.swift')

# Mood -> (badge label, glow RGB 0..1) — glow derived from app mood colors.
MOOD_INFO = {
    'healthy_ish': ('🥗 Healthy', (0.30, 0.72, 0.32)),
    'fancy':       ('💅 Fancy',   (0.85, 0.45, 0.55)),
    'honest':      ('😂 Honest',  (0.85, 0.55, 0.15)),
    'comfort':     ('🧸 Comfort', (0.80, 0.55, 0.30)),
    'bulgarian':   ('🇧🇬 BG',      (0.80, 0.25, 0.20)),
}


def esc(s):
    return s.replace('\\', '\\\\').replace('"', '\\"')


def main():
    with open(SRC, encoding='utf-8') as f:
        data = json.load(f)

    lines = [
        '// AUTO-GENERATED from data/meals.json — do not edit by hand.',
        '// Regenerate with: python3 scripts/gen-widget-meals.py',
        '',
        'import SwiftUI',
        '',
        'struct WidgetMoodOption {',
        '    let badge: String',
        '    let glow: (Double, Double, Double)',
        '    let reasons: [String]',
        '}',
        '',
        'struct WidgetMeal {',
        '    let emoji: String',
        '    let name: String',
        '    let moods: [WidgetMoodOption]',
        '}',
        '',
        'enum Meals {',
        '    static let all: [WidgetMeal] = [',
    ]

    count = 0
    for m in data['meals']:
        reasons = m.get('reasons', {})
        mood_opts = [
            (mid, reasons.get(mid, []))
            for mid in m.get('moods', [])
            if mid in MOOD_INFO and reasons.get(mid)
        ]
        if not mood_opts:
            continue
        count += 1
        lines.append(f'        WidgetMeal(emoji: "{esc(m["emoji"])}", name: "{esc(m["name"])}", moods: [')
        for mid, rs in mood_opts:
            badge, (r, g, b) = MOOD_INFO[mid]
            items = ', '.join(f'"{esc(x)}"' for x in rs)
            lines.append(f'            WidgetMoodOption(badge: "{badge}", glow: ({r}, {g}, {b}), reasons: [{items}]),')
        lines.append('        ]),')

    lines += ['    ]', '}', '']

    with open(OUT, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))

    print(f'Generated {OUT} with {count} meals')


if __name__ == '__main__':
    main()

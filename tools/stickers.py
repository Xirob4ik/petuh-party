#!/usr/bin/env python3
"""
Генератор стикеров Petuh Party.

Рисует весь набор в едином стиле: персонаж Петя (петух), цыплёнок Цыпа,
предметы для кино и фразы про совместный просмотр. Подписи набраны шрифтом
Unbounded и переведены в кривые, поэтому выглядят одинаково на любом устройстве.

Запуск (нужен Python 3 и fontTools):  python3 tools/stickers.py
Результат: public/stickers/*.svg и shared/stickers.ts
"""
from __future__ import annotations

import json
import math
import os
from dataclasses import dataclass, field

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'stickers')

# ── палитра ────────────────────────────────────────────────────
YOLK = '#F6C445'
YOLK_D = '#E3A82B'
COMB = '#FF6150'
COMB_D = '#E0463A'
BEAK = '#FF9A3C'
BEAK_D = '#E07A22'
INK = '#1E1A24'
WHITE = '#FFFFFF'
CHEEK = '#FF8FA3'
TEAR = '#5CC8FF'
CHICK = '#FFE27A'
CHICK_D = '#F2C94C'
RED = '#FF4D5E'
GREEN = '#7BD389'
SKY = '#6CC4FF'
PURPLE = '#B48CFF'

# ── шрифт для подписей ─────────────────────────────────────────
_font = TTFont(os.path.join(ROOT, 'public', 'fonts', 'unbounded.woff'))
_font = instantiateVariableFont(_font, {'wght': 800})
_glyphs = _font.getGlyphSet()
_cmap = _font.getBestCmap()
_upm = _font['head'].unitsPerEm
_hmtx = _font['hmtx']


def text_path(text: str, cx: float, baseline: float, size: float, max_w: float) -> tuple[str, float]:
    """Набирает строку кривыми по центру. Возвращает (d, фактический кегль)."""
    def adv(ch, sz):
        # пробел в Unbounded узкий — в крупных подписях слова слипаются
        extra = sz * 0.14 if ch == ' ' else 0
        return _hmtx[_cmap.get(ord(ch), _cmap[ord('?')])][0] * sz / _upm + extra

    def width(sz):
        return sum(adv(ch, sz) for ch in text)

    while width(size) > max_w and size > 8:
        size -= 0.5
    w = width(size)
    x = cx - w / 2
    k = size / _upm
    pen = SVGPathPen(_glyphs)
    for ch in text:
        g = _cmap.get(ord(ch), _cmap[ord('?')])
        _glyphs[g].draw(TransformPen(pen, (k, 0, 0, -k, x, baseline)))
        x += adv(ch, size)
    return pen.getCommands(), size


def caption(text: str, y: float = 186, size: float = 26, color: str = WHITE, outline: str = INK) -> str:
    d, _ = text_path(text, 100, y, size, 184)
    return (
        f'<path d="{d}" fill="{outline}" stroke="{outline}" stroke-width="7" stroke-linejoin="round"/>'
        f'<path d="{d}" fill="{color}"/>'
    )


def small_text(text: str, x: float, y: float, size: float, color: str, rot: float = 0) -> str:
    d, _ = text_path(text, x, y, size, 200)
    tr = f' transform="rotate({rot} {x} {y})"' if rot else ''
    return f'<path d="{d}" fill="{color}"{tr}/>'


# ── обёртка: белая высечка + мягкая тень ───────────────────────
def wrap(body: str) -> str:
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">'
        '<defs><filter id="cut" x="-15%" y="-15%" width="130%" height="130%">'
        '<feMorphology in="SourceAlpha" operator="dilate" radius="5" result="d"/>'
        '<feFlood flood-color="#fff"/><feComposite in2="d" operator="in" result="w"/>'
        '<feGaussianBlur in="d" stdDeviation="3" result="b"/><feOffset in="b" dy="3" result="o"/>'
        '<feFlood flood-color="#000" flood-opacity=".28"/><feComposite in2="o" operator="in" result="s"/>'
        '<feMerge><feMergeNode in="s"/><feMergeNode in="w"/><feMergeNode in="SourceGraphic"/></feMerge>'
        '</filter></defs>'
        f'<g filter="url(#cut)">{body}</g></svg>'
    )


# ── детали персонажа ───────────────────────────────────────────
def comb(dx=0.0, dy=0.0, color=COMB) -> str:
    return (
        f'<g transform="translate({dx} {dy})">'
        f'<circle cx="78" cy="56" r="15" fill="{color}"/>'
        f'<circle cx="100" cy="44" r="18" fill="{color}"/>'
        f'<circle cx="122" cy="56" r="15" fill="{color}"/>'
        '</g>'
    )


def head(color=YOLK, shade=YOLK_D) -> str:
    return (
        f'<ellipse cx="100" cy="112" rx="62" ry="60" fill="{color}"/>'
        f'<path d="M48 132 Q100 186 152 132 Q150 170 100 172 Q50 170 48 132Z" fill="{shade}" opacity=".45"/>'
    )


def cheeks(op=0.55) -> str:
    return (
        f'<ellipse cx="66" cy="124" rx="10" ry="6" fill="{CHEEK}" opacity="{op}"/>'
        f'<ellipse cx="134" cy="124" rx="10" ry="6" fill="{CHEEK}" opacity="{op}"/>'
    )


def eye(kind: str, x: float, y: float, side: int) -> str:
    """side = -1 левый, +1 правый (для бровей и подмигивания)."""
    if kind == 'open':
        return (
            f'<ellipse cx="{x}" cy="{y}" rx="11" ry="13" fill="{WHITE}"/>'
            f'<circle cx="{x + 1.5}" cy="{y + 2}" r="6.5" fill="{INK}"/>'
            f'<circle cx="{x + 4}" cy="{y - 1}" r="2.2" fill="{WHITE}"/>'
        )
    if kind == 'big':
        return (
            f'<ellipse cx="{x}" cy="{y}" rx="15" ry="17" fill="{WHITE}"/>'
            f'<circle cx="{x}" cy="{y}" r="4.5" fill="{INK}"/>'
        )
    if kind == 'happy':
        return f'<path d="M{x - 10} {y + 3} Q{x} {y - 10} {x + 10} {y + 3}" fill="none" stroke="{INK}" stroke-width="5" stroke-linecap="round"/>'
    if kind == 'closed':
        return f'<path d="M{x - 10} {y} Q{x} {y + 7} {x + 10} {y}" fill="none" stroke="{INK}" stroke-width="5" stroke-linecap="round"/>'
    if kind == 'squint':  # >  <
        a = 9 * side
        return f'<path d="M{x - a} {y - 8} L{x + a} {y} L{x - a} {y + 8}" fill="none" stroke="{INK}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'
    if kind == 'x':
        return (
            f'<path d="M{x - 8} {y - 8} L{x + 8} {y + 8} M{x + 8} {y - 8} L{x - 8} {y + 8}" '
            f'stroke="{INK}" stroke-width="5" stroke-linecap="round"/>'
        )
    if kind == 'heart':
        return heart(x, y + 1, 1.0, RED)
    if kind == 'star':
        return star(x, y, 13, '#FFE45C', INK)
    if kind == 'dot':
        return f'<circle cx="{x}" cy="{y + 2}" r="5" fill="{INK}"/>'
    if kind == 'tired':
        return (
            f'<ellipse cx="{x}" cy="{y + 2}" rx="11" ry="9" fill="{WHITE}"/>'
            f'<circle cx="{x}" cy="{y + 5}" r="5" fill="{INK}"/>'
            f'<path d="M{x - 13} {y - 1} L{x + 13} {y - 1}" stroke="{YOLK_D}" stroke-width="7" stroke-linecap="round"/>'
        )
    if kind == 'side':
        return (
            f'<ellipse cx="{x}" cy="{y}" rx="11" ry="13" fill="{WHITE}"/>'
            f'<circle cx="{x + 5 * side}" cy="{y + 2}" r="6" fill="{INK}"/>'
        )
    if kind == 'up':
        return (
            f'<ellipse cx="{x}" cy="{y}" rx="11" ry="13" fill="{WHITE}"/>'
            f'<circle cx="{x + 2}" cy="{y - 6}" r="5.5" fill="{INK}"/>'
        )
    raise ValueError(kind)


def eyes(kind: str, kind_r: str | None = None, y: float = 98) -> str:
    return eye(kind, 78, y, -1) + eye(kind_r or kind, 122, y, 1)


def brows(kind: str, y: float = 80) -> str:
    if kind == 'angry':
        return (
            f'<path d="M64 {y - 4} L90 {y + 6}" stroke="{INK}" stroke-width="6" stroke-linecap="round"/>'
            f'<path d="M136 {y - 4} L110 {y + 6}" stroke="{INK}" stroke-width="6" stroke-linecap="round"/>'
        )
    if kind == 'sad':
        return (
            f'<path d="M66 {y + 4} L90 {y - 4}" stroke="{INK}" stroke-width="5" stroke-linecap="round"/>'
            f'<path d="M134 {y + 4} L110 {y - 4}" stroke="{INK}" stroke-width="5" stroke-linecap="round"/>'
        )
    if kind == 'up':
        return (
            f'<path d="M66 {y - 6} Q78 {y - 14} 90 {y - 6}" fill="none" stroke="{INK}" stroke-width="5" stroke-linecap="round"/>'
            f'<path d="M110 {y - 6} Q122 {y - 14} 134 {y - 6}" fill="none" stroke="{INK}" stroke-width="5" stroke-linecap="round"/>'
        )
    if kind == 'think':
        return (
            f'<path d="M66 {y + 2} L90 {y - 2}" stroke="{INK}" stroke-width="5" stroke-linecap="round"/>'
            f'<path d="M110 {y - 8} Q122 {y - 16} 134 {y - 8}" fill="none" stroke="{INK}" stroke-width="5" stroke-linecap="round"/>'
        )
    return ''


def beak(kind: str = 'closed') -> str:
    if kind == 'closed':
        return (
            f'<path d="M86 116 Q100 108 114 116 L100 134 Z" fill="{BEAK}"/>'
            f'<path d="M92 126 L100 134 L108 126 Z" fill="{BEAK_D}"/>'
        )
    if kind == 'smile':
        return (
            f'<path d="M86 114 Q100 106 114 114 L100 128 Z" fill="{BEAK}"/>'
            f'<path d="M90 127 Q100 140 110 127 Z" fill="{BEAK_D}"/>'
        )
    if kind == 'open':
        return (
            f'<path d="M84 112 Q100 104 116 112 L100 124 Z" fill="{BEAK}"/>'
            f'<path d="M88 128 Q100 124 112 128 L100 146 Z" fill="{BEAK_D}"/>'
            f'<path d="M90 123 L110 123 L108 129 L92 129 Z" fill="#9B2C2C"/>'
        )
    if kind == 'wide':
        return (
            f'<path d="M82 110 Q100 100 118 110 L100 122 Z" fill="{BEAK}"/>'
            f'<path d="M84 132 Q100 126 116 132 L100 156 Z" fill="{BEAK_D}"/>'
            f'<path d="M86 121 L114 121 L113 133 Q100 128 87 133 Z" fill="#9B2C2C"/>'
            f'<ellipse cx="100" cy="129" rx="8" ry="3" fill="{COMB}"/>'
        )
    if kind == 'small':
        return f'<path d="M92 116 Q100 112 108 116 L100 126 Z" fill="{BEAK}"/>'
    if kind == 'wavy':
        return (
            f'<path d="M86 116 Q100 108 114 116 L100 130 Z" fill="{BEAK}"/>'
            f'<path d="M84 140 Q90 134 96 140 Q102 146 108 140 Q114 134 118 140" fill="none" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>'
        )
    if kind == 'side':
        return f'<path d="M98 112 Q118 112 128 120 Q116 128 98 126 Z" fill="{BEAK}"/>'
    raise ValueError(kind)


def wattle(y: float = 140) -> str:
    return f'<path d="M100 {y - 6} Q92 {y + 6} 100 {y + 14} Q108 {y + 6} 100 {y - 6}Z" fill="{COMB}"/>'


def wing(side: int, pose: str = 'down', color=YOLK_D) -> str:
    """side -1 левое, +1 правое крыло."""
    cx = 100 + 64 * side
    if pose == 'down':
        return f'<ellipse cx="{cx}" cy="138" rx="15" ry="24" fill="{color}" transform="rotate({-18 * side} {cx} 138)"/>'
    if pose == 'up':
        return f'<ellipse cx="{cx + 6 * side}" cy="96" rx="14" ry="26" fill="{color}" transform="rotate({28 * side} {cx} 110)"/>'
    if pose == 'wave':
        return (
            f'<ellipse cx="{cx + 10 * side}" cy="88" rx="14" ry="26" fill="{color}" transform="rotate({40 * side} {cx} 104)"/>'
            f'<path d="M{cx + 30 * side} 58 q{6 * side} -6 {12 * side} 0 M{cx + 34 * side} 70 q{8 * side} -4 {14 * side} 2" '
            f'stroke="{INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>'
        )
    raise ValueError(pose)


def rooster(e='open', e2=None, b='closed', br='', blush=True, wings=('down', 'down'), dy=0.0, extra_face='') -> str:
    parts = [
        f'<g transform="translate(0 {dy})">',
        comb(),
        wing(-1, wings[0]) if wings[0] else '',
        wing(1, wings[1]) if wings[1] else '',
        head(),
        cheeks() if blush else '',
        eyes(e, e2),
        brows(br),
        wattle(),
        beak(b),
        extra_face,
        '</g>',
    ]
    return ''.join(parts)


def chick(e='open', b='small', extra='', dy=0.0, shell=False) -> str:
    out = [f'<g transform="translate(0 {dy})">']
    out.append(f'<path d="M96 46 Q92 30 100 26 Q102 36 108 34 Q106 44 100 48Z" fill="{CHICK_D}"/>')
    out.append(f'<ellipse cx="100" cy="112" rx="58" ry="58" fill="{CHICK}"/>')
    out.append(f'<ellipse cx="44" cy="124" rx="12" ry="18" fill="{CHICK_D}" transform="rotate(20 44 124)"/>')
    out.append(f'<ellipse cx="156" cy="124" rx="12" ry="18" fill="{CHICK_D}" transform="rotate(-20 156 124)"/>')
    out.append(cheeks(0.6))
    out.append(eyes(e, y=104))
    out.append(beak(b))
    if shell:
        out.append(
            f'<path d="M36 138 L52 124 L66 140 L82 122 L100 140 L118 122 L134 140 L148 124 L164 138 '
            f'Q164 182 100 182 Q36 182 36 138Z" fill="#FFF8EC"/>'
            f'<path d="M36 138 L52 124 L66 140 L82 122 L100 140 L118 122 L134 140 L148 124 L164 138" '
            f'fill="none" stroke="#E8DCC6" stroke-width="3" stroke-linejoin="round"/>'
        )
    out.append(extra)
    out.append('</g>')
    return ''.join(out)


# ── эффекты и предметы ─────────────────────────────────────────
def heart(x, y, s=1.0, color=RED) -> str:
    return (
        f'<path transform="translate({x} {y}) scale({s})" '
        f'd="M0 9 C-14 -1 -13 -13 -5.5 -13 C-2 -13 0 -10 0 -8 C0 -10 2 -13 5.5 -13 C13 -13 14 -1 0 9Z" fill="{color}"/>'
    )


def star(x, y, r, fill, stroke=None) -> str:
    pts = []
    for i in range(10):
        a = -math.pi / 2 + i * math.pi / 5
        rr = r if i % 2 == 0 else r * 0.45
        pts.append(f'{x + rr * math.cos(a):.1f},{y + rr * math.sin(a):.1f}')
    st = f' stroke="{stroke}" stroke-width="2.5" stroke-linejoin="round"' if stroke else ''
    return f'<polygon points="{" ".join(pts)}" fill="{fill}"{st}/>'


def sparkle(x, y, s, color='#FFE45C') -> str:
    return (
        f'<path transform="translate({x} {y}) scale({s})" d="M0 -10 Q1.5 -1.5 10 0 Q1.5 1.5 0 10 Q-1.5 1.5 -10 0 Q-1.5 -1.5 0 -10Z" fill="{color}"/>'
    )


def tears_stream() -> str:
    return (
        f'<path d="M70 108 Q62 140 72 176 L84 176 Q76 140 82 110Z" fill="{TEAR}" opacity=".9"/>'
        f'<path d="M130 108 Q138 140 128 176 L116 176 Q124 140 118 110Z" fill="{TEAR}" opacity=".9"/>'
    )


def tear(x, y, s=1.0) -> str:
    return f'<path transform="translate({x} {y}) scale({s})" d="M0 -10 Q8 2 0 8 Q-8 2 0 -10Z" fill="{TEAR}"/>'


def sweat(x=146, y=70) -> str:
    return f'<path d="M{x} {y - 14} Q{x + 12} {y + 4} {x} {y + 10} Q{x - 12} {y + 4} {x} {y - 14}Z" fill="{TEAR}"/>'


def zzz() -> str:
    return small_text('Z', 158, 52, 26, SKY, -12) + small_text('Z', 176, 30, 18, SKY, -12) + small_text('Z', 188, 14, 12, SKY, -12)


def anger(x=150, y=50) -> str:
    return (
        f'<g transform="translate({x} {y})" stroke="{RED}" stroke-width="5" stroke-linecap="round" fill="none">'
        '<path d="M-10 -3 Q-3 -3 -3 -10"/><path d="M10 -3 Q3 -3 3 -10"/>'
        '<path d="M-10 3 Q-3 3 -3 10"/><path d="M10 3 Q3 3 3 10"/></g>'
    )


def confetti() -> str:
    bits = [(30, 40, RED, 20), (170, 46, SKY, -30), (40, 150, GREEN, 40), (166, 150, PURPLE, -10), (24, 96, '#FFE45C', 60), (180, 98, RED, 15)]
    return ''.join(f'<rect x="{x - 5}" y="{y - 3}" width="10" height="6" rx="2" fill="{c}" transform="rotate({r} {x} {y})"/>' for x, y, c, r in bits)


def party_hat() -> str:
    return (
        f'<path d="M100 2 L124 54 Q100 62 76 54Z" fill="{PURPLE}"/>'
        f'<path d="M88 30 L112 30 M82 44 L118 44" stroke="#FFE45C" stroke-width="5"/>'
        f'<circle cx="100" cy="4" r="7" fill="#FFE45C"/>'
    )


def popcorn(x=100, y=150, s=1.0) -> str:
    return (
        f'<g transform="translate({x} {y}) scale({s})">'
        f'<circle cx="-18" cy="-28" r="12" fill="#FFF6DD"/><circle cx="0" cy="-34" r="14" fill="#FFF6DD"/>'
        f'<circle cx="18" cy="-28" r="12" fill="#FFF6DD"/><circle cx="-8" cy="-40" r="9" fill="#FFE9A8"/>'
        f'<circle cx="10" cy="-42" r="9" fill="#FFF6DD"/>'
        f'<path d="M-30 -24 L30 -24 L22 34 L-22 34Z" fill="{WHITE}"/>'
        f'<path d="M-18 -24 L-12 34 L-4 34 L-7 -24Z M7 -24 L4 34 L12 34 L18 -24Z" fill="{RED}"/>'
        f'<rect x="-32" y="-28" width="64" height="8" rx="3" fill="{RED}"/>'
        '</g>'
    )


def sign(text: str, x=100, y=150, w=120, h=44, color=WHITE, tcolor=INK, rot=-4) -> str:
    d, _ = text_path(text, x, y + 9, 22, w - 14)
    return (
        f'<g transform="rotate({rot} {x} {y})">'
        f'<rect x="{x - 3}" y="{y + h / 2 - 4}" width="6" height="34" fill="#B07A3A"/>'
        f'<rect x="{x - w / 2}" y="{y - h / 2}" width="{w}" height="{h}" rx="8" fill="{color}" stroke="{INK}" stroke-width="3"/>'
        f'<path d="{d}" fill="{tcolor}"/></g>'
    )


def play_btn(x, y, r, fill=COMB) -> str:
    return (
        f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}"/>'
        f'<path d="M{x - r * 0.3} {y - r * 0.45} L{x + r * 0.5} {y} L{x - r * 0.3} {y + r * 0.45}Z" fill="{WHITE}"/>'
    )


def pause_btn(x, y, r, fill=SKY) -> str:
    return (
        f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}"/>'
        f'<rect x="{x - r * 0.38}" y="{y - r * 0.42}" width="{r * 0.26}" height="{r * 0.84}" rx="2" fill="{WHITE}"/>'
        f'<rect x="{x + r * 0.12}" y="{y - r * 0.42}" width="{r * 0.26}" height="{r * 0.84}" rx="2" fill="{WHITE}"/>'
    )


def ff_btn(x, y, r, fill=PURPLE) -> str:
    return (
        f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}"/>'
        f'<path d="M{x - r * 0.5} {y - r * 0.4} L{x} {y} L{x - r * 0.5} {y + r * 0.4}Z M{x} {y - r * 0.4} L{x + r * 0.5} {y} L{x} {y + r * 0.4}Z" fill="{WHITE}"/>'
    )


def sunglasses(y=96) -> str:
    return (
        f'<path d="M58 {y - 10} L96 {y - 10} L92 {y + 8} Q76 {y + 14} 62 {y + 6}Z" fill="{INK}"/>'
        f'<path d="M104 {y - 10} L142 {y - 10} L138 {y + 6} Q124 {y + 14} 108 {y + 8}Z" fill="{INK}"/>'
        f'<rect x="94" y="{y - 10}" width="12" height="4" fill="{INK}"/>'
        f'<path d="M64 {y - 6} L74 {y - 6} L66 {y + 2}Z M110 {y - 6} L120 {y - 6} L112 {y + 2}Z" fill="#FFFFFF" opacity=".5"/>'
    )


def clock(x, y, r) -> str:
    return (
        f'<circle cx="{x}" cy="{y}" r="{r}" fill="{WHITE}" stroke="{INK}" stroke-width="4"/>'
        f'<path d="M{x} {y} L{x} {y - r * 0.6} M{x} {y} L{x + r * 0.45} {y + r * 0.2}" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>'
    )


def spinner(x, y, r) -> str:
    out = []
    for i in range(8):
        a = i * math.pi / 4
        op = 0.2 + 0.8 * (i / 7)
        out.append(f'<circle cx="{x + r * math.cos(a):.1f}" cy="{y + r * math.sin(a):.1f}" r="{r * 0.22:.1f}" fill="{WHITE}" opacity="{op:.2f}"/>')
    return f'<circle cx="{x}" cy="{y}" r="{r * 1.45}" fill="{INK}"/>' + ''.join(out)


def speed_lines() -> str:
    return ''.join(
        f'<path d="M{x} {y} L{x - 34} {y}" stroke="{INK}" stroke-width="4" stroke-linecap="round" opacity=".5"/>'
        for x, y in [(36, 90), (30, 116), (40, 142)]
    )


def blanket() -> str:
    return (
        f'<path d="M20 128 Q100 108 180 128 L184 196 L16 196Z" fill="{PURPLE}"/>'
        f'<path d="M20 128 Q100 108 180 128" fill="none" stroke="#9670E0" stroke-width="6"/>'
        f'<circle cx="60" cy="160" r="6" fill="#9670E0"/><circle cx="104" cy="170" r="6" fill="#9670E0"/><circle cx="146" cy="158" r="6" fill="#9670E0"/>'
    )


def remote(x, y, rot=-20) -> str:
    return (
        f'<g transform="rotate({rot} {x} {y})">'
        f'<rect x="{x - 14}" y="{y - 34}" width="28" height="68" rx="10" fill="#3A3442"/>'
        f'<circle cx="{x}" cy="{y - 20}" r="6" fill="{RED}"/>'
        f'<circle cx="{x - 6}" cy="{y}" r="3.5" fill="#9A93A3"/><circle cx="{x + 6}" cy="{y}" r="3.5" fill="#9A93A3"/>'
        f'<circle cx="{x - 6}" cy="{y + 12}" r="3.5" fill="#9A93A3"/><circle cx="{x + 6}" cy="{y + 12}" r="3.5" fill="#9A93A3"/>'
        '</g>'
    )


# ── набор ──────────────────────────────────────────────────────
@dataclass
class S:
    id: str
    name: str
    category: str
    tags: str
    svg: str = field(repr=False)


STICKERS: list[S] = []


def add(id_, name, category, tags, body):
    STICKERS.append(S(id_, name, category, tags, wrap(body)))


# Эмоции Пети
add('petya-hi', 'Привет', 'petya', 'привет,хай,здарова,hello,hi',
    rooster('happy', b='smile', wings=('down', 'wave')) + caption('ПРИВЕТ'))
add('petya-lol', 'Ору', 'petya', 'ор,ору,смех,ахаха,лол,кек,lol,laugh',
    rooster('squint', b='wide', wings=('up', 'up')) + tear(54, 92) + tear(146, 92) + caption('ОРУ'))
add('petya-ahaha', 'Ахаха', 'petya', 'ахаха,смешно,хаха,смех,lol',
    rooster('happy', b='wide') + tear(56, 104, 0.8) + tear(144, 104, 0.8) + caption('АХАХА'))
add('petya-cry', 'Шедевр', 'petya', 'шедевр,плачу,рыдаю,слёзы,трогательно,cry,tears',
    rooster('closed', b='open', br='sad', blush=False) + tears_stream() + caption('ШЕДЕВР', y=190))
add('petya-sad', 'Грустно', 'petya', 'грустно,печаль,sad,эх',
    rooster('open', b='closed', br='sad') + tear(68, 118, 0.9) + caption('ЭХ'))
add('petya-shock', 'Что?!', 'petya', 'что,шок,чтооо,ужас,omg,what,shock',
    rooster('big', b='open', br='up', wings=('up', 'up')) + caption('ЧТО?!'))
add('petya-angry', 'Бесит', 'petya', 'бесит,злой,злюсь,angry,гнев',
    rooster('open', b='closed', br='angry', blush=False) + anger() + caption('БЕСИТ', color=RED))
add('petya-love', 'Люблю', 'petya', 'люблю,любовь,краш,сердечки,love,heart',
    rooster('heart', b='smile') + heart(36, 54, 1.0) + heart(168, 40, 0.7) + caption('ЛЮБЛЮ', color='#FFB3C0'))
add('petya-cool', 'База', 'petya', 'база,крутой,очки,гигачад,сигма,cool,chad',
    rooster('open', b='smile', extra_face=sunglasses()) + caption('БАЗА'))
add('petya-think', 'Хмм', 'petya', 'хмм,думаю,подозрительно,think,hmm',
    rooster('side', b='closed', br='think', wings=('down', 'up')) + small_text('?', 164, 60, 40, PURPLE, 12) + caption('ХММ'))
add('petya-cringe', 'Кринж', 'petya', 'кринж,испанский стыд,фейспалм,cringe,стыдно',
    rooster('closed', b='wavy', blush=False,
            wings=(None, None),
            extra_face=f'<ellipse cx="74" cy="100" rx="24" ry="30" fill="{YOLK_D}" stroke="{INK}" stroke-width="3" transform="rotate(-35 74 100)"/>'
                       f'<ellipse cx="126" cy="100" rx="24" ry="30" fill="{YOLK_D}" stroke="{INK}" stroke-width="3" transform="rotate(35 126 100)"/>'
                       f'<path d="M60 92 l12 6 M64 104 l12 4 M140 92 l-12 6 M136 104 l-12 4" stroke="{INK}" stroke-width="2.5" stroke-linecap="round" opacity=".5"/>')
    + '<path d="M60 70 L58 58 M100 64 L100 52 M140 70 L142 58" stroke="#7FB5FF" stroke-width="4" stroke-linecap="round"/>'
    + caption('КРИНЖ'))
add('petya-dead', 'Всё', 'petya', 'всё,умер,помер,dead,rip,капут',
    rooster('x', b='open', blush=False) + '<ellipse cx="100" cy="20" rx="26" ry="7" fill="none" stroke="#FFE45C" stroke-width="5"/>' + caption('ВСЁ'))
add('petya-wink', 'Хе-хе', 'petya', 'хехе,подмигнул,хитрый,wink',
    rooster('open', 'happy', b='smile') + sparkle(160, 70, 1.2) + caption('ХЕ-ХЕ'))
add('petya-awkward', 'Неловко', 'petya', 'неловко,упс,awkward,oops,ой',
    rooster('side', b='wavy', br='sad') + sweat() + caption('НЕЛОВКО'))
add('petya-sleep', 'Скучно', 'petya', 'скучно,сплю,сон,zzz,boring,sleep',
    rooster('closed', b='closed', blush=False) + zzz() + caption('СКУЧНО'))
add('petya-yuck', 'Фу', 'petya', 'фу,мерзко,отстой,yuck,гадость',
    rooster('squint', b='wavy', blush=False) + f'<ellipse cx="100" cy="128" rx="40" ry="14" fill="{GREEN}" opacity=".5"/>' + caption('ФУ', color=GREEN))
add('petya-scream', 'Кукареку', 'petya', 'кукареку,крик,ура,ору,scream',
    rooster('happy', b='wide', wings=('up', 'up'))
    + '<path d="M150 104 L184 92 M154 124 L190 124 M150 144 L184 156 M50 104 L16 92 M46 124 L10 124 M50 144 L16 156" stroke="#FFE45C" stroke-width="5" stroke-linecap="round"/>'
    + caption('КУКАРЕКУ'))
add('petya-top', 'Топ', 'petya', 'топ,лайк,класс,одобряю,like,top',
    rooster('happy', b='smile', wings=('down', 'up')) + star(164, 52, 14, '#FFE45C', INK) + caption('ТОП'))
add('petya-star', 'Вау', 'petya', 'вау,восторг,звёзды,wow,amazing',
    rooster('star', b='open') + sparkle(30, 60, 1.3) + sparkle(172, 80, 1) + caption('ВАУ'))

# Кино
add('cinema-popcorn', 'Где попкорн', 'cinema', 'попкорн,кино,еда,popcorn,snack',
    rooster('happy', b='smile', wings=('up', 'up'), dy=-14) + popcorn(100, 150, 0.95) + caption('ПОПКОРН', y=192, size=22))
add('cinema-scared', 'Страшно', 'cinema', 'страшно,хоррор,ужас,боюсь,scary,horror',
    rooster('big', b='closed', br='up', blush=False, dy=6) + blanket() + caption('СТРАШНО', y=186))
add('cinema-pause', 'Пауза!', 'cinema', 'пауза,стоп,подожди,pause,wait',
    rooster('open', b='open', br='up', wings=('down', 'up'), dy=-8) + pause_btn(156, 64, 22) + caption('ПАУЗА!'))
add('cinema-play', 'Го смотреть', 'cinema', 'го,смотреть,погнали,старт,play,go',
    rooster('happy', b='smile') + play_btn(160, 62, 24) + caption('ГО СМОТРЕТЬ', size=22))
add('cinema-ff', 'Перемотай', 'cinema', 'перемотай,скучно,дальше,промотай,skip,forward',
    rooster('tired', b='closed', blush=False) + ff_btn(160, 60, 22) + caption('ПЕРЕМОТАЙ', size=22))
add('cinema-spoiler', 'Без спойлеров', 'cinema', 'спойлер,тихо,тсс,не говори,spoiler,shh',
    rooster('side', b='closed', wings=('down', None),
            extra_face=f'<ellipse cx="128" cy="124" rx="13" ry="26" fill="{YOLK_D}" transform="rotate(-10 128 124)"/>')
    + small_text('ТСС', 160, 56, 22, RED, 8) + caption('БЕЗ СПОЙЛЕРОВ', size=20))
add('cinema-next', 'Ещё серию', 'cinema', 'ещё серию,следующая,сериал,next episode,ещё',
    rooster('star', b='smile', wings=('up', 'up')) + caption('ЕЩЁ СЕРИЮ', size=22))
add('cinema-remote', 'Пульт мой', 'cinema', 'пульт,мой,главный,remote,управление',
    rooster('open', b='smile', br='angry', wings=('down', None)) + remote(156, 128) + caption('ПУЛЬТ МОЙ', size=22))
add('cinema-tissues', 'Дайте салфетку', 'cinema', 'салфетки,плачу,трогательно,tissue,слёзы',
    rooster('closed', b='open', br='sad', blush=False, dy=-10) + tears_stream()
    + f'<rect x="56" y="146" width="88" height="40" rx="6" fill="{SKY}"/><path d="M84 146 Q100 120 116 146" fill="{WHITE}" stroke="#D6E8F5" stroke-width="2"/>'
    + caption('САЛФЕТКУ', y=192, size=22))
add('cinema-ticket', 'Билет', 'cinema', 'билет,кино,сеанс,ticket,cinema',
    f'<g transform="rotate(-10 100 100)"><path d="M24 60 H176 V86 a14 14 0 0 0 0 28 V140 H24 V114 a14 14 0 0 0 0 -28Z" fill="{YOLK}"/>'
    f'<path d="M132 64 V136" stroke="{YOLK_D}" stroke-width="4" stroke-dasharray="6 6"/>'
    + small_text('КИНО', 76, 112, 30, INK) + star(152, 100, 12, COMB) + '</g>' + caption('СЕАНС', y=186))
add('cinema-clapper', 'Дубль', 'cinema', 'хлопушка,дубль,мотор,снято,clapper',
    f'<g transform="rotate(-6 100 110)"><rect x="34" y="70" width="132" height="84" rx="8" fill="{INK}"/>'
    f'<g transform="rotate(-14 34 70)"><rect x="34" y="46" width="132" height="22" rx="4" fill="{WHITE}"/>'
    + ''.join(f'<path d="M{50 + i * 28} 46 L{64 + i * 28} 46 L{52 + i * 28} 68 L{38 + i * 28} 68Z" fill="{INK}"/>' for i in range(5))
    + '</g>' + small_text('ДУБЛЬ 2', 100, 124, 22, WHITE) + '</g>' + caption('МОТОР!'))
add('cinema-3d', '3D', 'cinema', '3d,очки,кино,imax,эффекты',
    rooster('open', b='smile',
            extra_face='<rect x="56" y="84" width="88" height="28" rx="6" fill="#F4F0E8" stroke="#3A3442" stroke-width="3"/>'
                       '<rect x="62" y="89" width="34" height="18" rx="4" fill="#FF4D5E" opacity=".85"/>'
                       '<rect x="104" y="89" width="34" height="18" rx="4" fill="#4DB8FF" opacity=".85"/>')
    + caption('В 3D'))
add('cinema-fire', 'Огонь', 'cinema', 'огонь,жара,топ,fire,lit,имба',
    f'<path d="M100 22 Q140 62 136 104 Q150 92 148 74 Q178 112 164 148 Q148 184 100 184 Q52 184 36 148 Q24 112 52 80 Q54 104 68 110 Q58 60 100 22Z" fill="#FF7A45"/>'
    f'<path d="M100 74 Q128 104 124 132 Q132 126 134 116 Q146 140 136 158 Q124 178 100 178 Q76 178 66 158 Q56 138 72 116 Q76 132 86 134 Q80 104 100 74Z" fill="#FFC23D"/>'
    + f'<ellipse cx="88" cy="146" rx="5" ry="7" fill="{INK}"/><ellipse cx="112" cy="146" rx="5" ry="7" fill="{INK}"/>'
    + caption('ОГОНЬ', y=190))
add('cinema-heart', 'Сердечко', 'cinema', 'сердце,любовь,мило,heart,love',
    heart(100, 104, 6.0, RED) + '<ellipse cx="66" cy="68" rx="12" ry="7" fill="#fff" opacity=".45" transform="rotate(-30 66 68)"/>' + caption('МИЛОТА', y=190))
add('cinema-broken', 'Разбитое сердце', 'cinema', 'разбитое сердце,больно,грусть,broken heart,обидно',
    f'<g transform="translate(-8 0) rotate(-8 100 100)">{heart(100, 104, 6.0, RED)}</g>'
    f'<path d="M100 40 L90 70 L108 92 L92 118 L104 150" fill="none" stroke="{WHITE}" stroke-width="9" stroke-linejoin="round"/>'
    + caption('БОЛЬНО', y=190))
add('cinema-skull', 'Череп', 'cinema', 'череп,умер,кринж,смешно,skull,dead',
    f'<path d="M100 26 C146 26 168 58 166 96 C165 116 156 126 150 132 L150 156 Q150 168 138 168 L62 168 Q50 168 50 156 L50 132 C44 126 35 116 34 96 C32 58 54 26 100 26Z" fill="#F4F0E8"/>'
    f'<ellipse cx="72" cy="100" rx="17" ry="19" fill="{INK}"/><ellipse cx="128" cy="100" rx="17" ry="19" fill="{INK}"/>'
    f'<path d="M100 120 L92 136 L108 136Z" fill="{INK}"/>'
    f'<path d="M76 150 V168 M92 150 V168 M108 150 V168 M124 150 V168" stroke="#CFC8BC" stroke-width="4"/>'
    + caption('ПОМЕР', y=192))
add('cinema-ghost', 'Бу', 'cinema', 'призрак,бу,страшно,хоррор,ghost,boo',
    f'<path d="M100 22 C144 22 160 58 160 96 L160 168 L144 156 L128 170 L112 156 L100 170 L88 156 L72 170 L56 156 L40 168 L40 96 C40 58 56 22 100 22Z" fill="#F7F4FF"/>'
    f'<ellipse cx="80" cy="88" rx="9" ry="13" fill="{INK}"/><ellipse cx="120" cy="88" rx="9" ry="13" fill="{INK}"/>'
    f'<ellipse cx="100" cy="122" rx="12" ry="15" fill="{INK}"/>'
    + caption('БУ!', y=190))

# Фразы про просмотр вместе
add('sync-lag', 'Лагает', 'phrases', 'лагает,тормозит,грузится,буфер,lag,loading',
    rooster('tired', b='closed', blush=False) + spinner(160, 58, 14) + caption('ЛАГАЕТ'))
add('sync-catchup', 'Догоняю', 'phrases', 'догоняю,отстаю,бегу,подожди,catch up',
    f'<g transform="rotate(10 100 110)">{rooster("open", b="open", br="up", wings=("up", "down"))}</g>' + speed_lines()
    + sweat(150, 60) + caption('ДОГОНЯЮ'))
add('sync-where', 'Ты где?', 'phrases', 'ты где,где ты,на какой минуте,where',
    rooster('side', b='closed', br='think') + clock(160, 60, 20) + caption('ТЫ ГДЕ?'))
add('sync-wait', 'Жду', 'phrases', 'жду,подожди,скоро,wait,ждём',
    rooster('tired', b='closed', wings=('down', 'down')) + clock(160, 60, 20) + caption('ЖДУ'))
add('sync-ready', 'Готов', 'phrases', 'готов,я тут,погнали,ready,здесь',
    rooster('happy', b='smile', wings=('up', 'up')) + sparkle(30, 56, 1.2) + sparkle(170, 56, 1.2) + caption('ГОТОВ'))
add('sync-sound', 'Нет звука', 'phrases', 'звук,не слышно,громче,sound,mute',
    rooster('side', b='open', br='up')
    + f'<g transform="translate(150 56)"><path d="M-14 -6 h8 l10 -10 v32 l-10 -10 h-8z" fill="{INK}"/>'
      f'<path d="M10 -8 L22 8 M22 -8 L10 8" stroke="{RED}" stroke-width="4" stroke-linecap="round"/></g>'
    + caption('НЕТ ЗВУКА', size=22))
add('sync-sleep', 'Спать', 'phrases', 'спать,спокойной ночи,ночь,sleep,night',
    rooster('closed', b='closed', blush=True)
    + f'<path d="M160 28 A26 26 0 1 0 186 64 A20 20 0 1 1 160 28Z" fill="#FFE45C"/>'
    + star(30, 40, 8, '#FFE45C') + star(46, 18, 5, '#FFE45C')
    + caption('СПАТЬ'))
add('sync-gg', 'ГГ', 'phrases', 'гг,конец,всё,финал,gg,the end',
    rooster('happy', b='smile', extra_face=sunglasses()) + confetti() + caption('ГГ', size=34))
add('sync-again', 'Ещё раз', 'phrases', 'ещё раз,повтори,не понял,replay,again',
    rooster('big', b='closed', br='up')
    + f'<g transform="translate(160 60)"><path d="M14 0 A14 14 0 1 1 4 -13" fill="none" stroke="{PURPLE}" stroke-width="6" stroke-linecap="round"/>'
      f'<path d="M-2 -22 L10 -13 L-2 -4Z" fill="{PURPLE}"/></g>'
    + caption('ЕЩЁ РАЗ', size=24))
add('sync-party', 'Пати', 'phrases', 'пати,вечеринка,праздник,party,ура',
    rooster('happy', b='wide', wings=('up', 'up'), dy=6) + party_hat() + confetti() + caption('ПАТИ', y=190))

# Цыпа
add('chick-hatch', 'Вылупился', 'chicks', 'цыплёнок,вылупился,привет,новенький,chick,hatch',
    chick('open', 'small', shell=True) + caption('Я ТУТ', y=196, size=22))
add('chick-cute', 'Мимими', 'chicks', 'мимими,мило,цыплёнок,cute,aww',
    chick('happy', 'small', extra=heart(160, 50, 1.2, '#FF8FA3') + heart(40, 60, 0.8, '#FF8FA3')) + caption('МИМИМИ'))
add('chick-cry', 'Плачет', 'chicks', 'цыплёнок,плачу,грустно,cry,sad',
    chick('closed', 'small', extra=tear(70, 120) + tear(130, 120)) + caption('ПЛАК'))
add('chick-shock', 'Ой', 'chicks', 'ой,шок,испугался,oh,shock',
    chick('big', 'small') + caption('ОЙ'))
add('chick-love', 'Обнимашки', 'chicks', 'обнимашки,обнять,люблю,hug,love',
    chick('happy', 'small', extra=f'<path d="M46 132 Q100 170 154 132" fill="none" stroke="{CHICK_D}" stroke-width="16" stroke-linecap="round"/>' + heart(100, 40, 1.2)) + caption('ОБНИМУ'))
add('chick-angry', 'Злюка', 'chicks', 'злой,злюка,бесит,angry',
    chick('open', 'small', extra=brows('angry', 86) + anger(156, 50)) + caption('ГРР', color=RED))


# ── запись файлов ──────────────────────────────────────────────
CATEGORIES = [
    ('all', 'Все'),
    ('petya', 'Петя'),
    ('cinema', 'Кино'),
    ('phrases', 'Фразы'),
    ('chicks', 'Цыпа'),
    ('classic', 'Классика'),
]

# Стикеры из прошлой версии проекта — оставляем разделом «Классика»
CLASSIC = [
    ('petuh-cool', 'Petuh Boss', 'петух,босс,очки,крутой,boss,cool'),
    ('petuh-popcorn', 'Петух-киноман', 'петух,попкорн,киноман,фильм'),
    ('petuh-shock', 'Петух в шоке', 'петух,шок,чтооо,ужас'),
    ('petuh-cry', 'Шедевр', 'петух,шедевр,слёзы,плач'),
    ('petuh-cringe', 'Петух-кринж', 'петух,кринж,испанский стыд'),
    ('petuh-party', 'Petuh Party', 'петух,пати,праздник,вечеринка'),
    ('petuh-sleep', 'Петух заснул', 'петух,заснул,сон,скучно'),
    ('petuh-chad', 'Гигачад-петух', 'петух,база,гигачад,сигма'),
    ('petuh-dj', 'DJ Петух', 'петух,dj,музыка,трек'),
    ('popcorn-gold', 'Топ контент', 'попкорн,топ контент,огонь,кино'),
]


def main():
    os.makedirs(OUT, exist_ok=True)
    keep = {f'{c[0]}.svg' for c in CLASSIC}
    for f in os.listdir(OUT):
        if f.endswith(('.svg', '.webp')) and f not in keep:
            os.remove(os.path.join(OUT, f))
    lic = os.path.join(OUT, 'LICENSE-fluentui-emoji.txt')
    if os.path.exists(lic):
        os.remove(lic)

    ids = set()
    for s in STICKERS:
        assert s.id not in ids, s.id
        ids.add(s.id)
        with open(os.path.join(OUT, f'{s.id}.svg'), 'w', encoding='utf-8') as fh:
            fh.write(s.svg)

    entries = [
        {'id': s.id, 'name': s.name, 'file': f'{s.id}.svg', 'category': s.category, 'tags': s.tags.split(',')}
        for s in STICKERS
    ] + [
        {'id': i, 'name': n, 'file': f'{i}.svg', 'category': 'classic', 'tags': t.split(',')}
        for i, n, t in CLASSIC
    ]
    cats = [c for c, _ in CATEGORIES if c != 'all']
    ts = f"""// Файл создан скриптом tools/stickers.py — правьте скрипт, а не этот файл.
// Все стикеры нарисованы для Petuh Party и лежат в /public/stickers.

export type StickerCategory = {' | '.join(f"'{c}'" for c in cats)};

export interface Sticker {{
  id: string;
  name: string;
  file: string;
  category: StickerCategory;
  tags: string[];
}}

export const STICKER_CATEGORIES: {{ id: 'all' | StickerCategory; name: string }}[] = {json.dumps([{'id': c, 'name': n} for c, n in CATEGORIES], ensure_ascii=False)};

export const STICKERS: Sticker[] = {json.dumps(entries, ensure_ascii=False, indent=2)};

const BY_ID = new Map(STICKERS.map((x) => [x.id, x]));

export const getSticker = (id: string | undefined) => (id ? BY_ID.get(id) : undefined);
export const stickerUrl = (x: Sticker) => `/stickers/${{x.file}}`;

export function searchStickers(query: string, category: 'all' | StickerCategory): Sticker[] {{
  const q = query.trim().toLowerCase();
  return STICKERS.filter(
    (x) =>
      (category === 'all' || x.category === category) &&
      (!q || x.name.toLowerCase().includes(q) || x.tags.some((t) => t.includes(q))),
  );
}}
"""
    with open(os.path.join(ROOT, 'shared', 'stickers.ts'), 'w', encoding='utf-8') as fh:
        fh.write(ts)
    print(f'{len(STICKERS)} новых стикеров + {len(CLASSIC)} классических')


if __name__ == '__main__':
    main()

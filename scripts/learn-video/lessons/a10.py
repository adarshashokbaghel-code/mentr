"""A10 · Debugging — Finding the Mistake — visuals."""
from __future__ import annotations

import math

import build as K

IF_COL = K.BOTH_COLOR
THEN_COL = (13, 148, 136)
ELSE_COL = K.CORAL
GREEN = (46, 178, 92)
LIGHT_OFF = (78, 86, 102)
LADY = (226, 58, 52)
MOTH = (178, 160, 136)
MOTH_DARK = (120, 102, 82)
PATH = (226, 216, 200)
WOOD = (176, 120, 76)
WOOD_DARK = (132, 86, 52)
BLANKET = (120, 160, 230)
BEAM = (255, 242, 180)
SOCK = (250, 250, 252)
SHOE = (72, 118, 214)
PAPER = (255, 250, 238)
TAPE = (250, 226, 150)
BOOK_COLS = ((72, 118, 214), (13, 148, 136), (255, 186, 60))


def _shade(col, k: float):
    return tuple(max(0, min(255, int(c * k))) for c in col)


def _tint(col, k: float):
    return tuple(int(c + (255 - c) * k) for c in col)


def text_mid(draw, text: str, x: float, cy: float, font, fill) -> float:
    """Left-aligned text vertically centred on cy. Returns the right edge."""
    bb = draw.textbbox((0, 0), text, font=font)
    draw.text((x, cy - (bb[1] + bb[3]) / 2), text, fill=fill, font=font)
    return x + bb[2]


def kw_badge(draw, x0: float, y: float, kw: str, col, wd: int = 190, ht: int = 72, size: int = 38) -> None:
    draw.rounded_rectangle((x0, y, x0 + wd, y + ht), radius=ht // 2, fill=col)
    f = K.load_font(size, bold=True)
    bb = draw.textbbox((0, 0), kw, font=f)
    draw.text((x0 + wd / 2 - (bb[0] + bb[2]) / 2, y + ht / 2 - (bb[1] + bb[3]) / 2), kw, font=f,
              fill=(255, 255, 255))


def rule_row(draw, x0: float, y: float, kw: str, text: str, col, ink, size: int = 48, wd: int = 200,
             ht: int = 80) -> float:
    kw_badge(draw, x0, y, kw, col, wd, ht, int(size * 0.8))
    return text_mid(draw, text, x0 + wd + 28, y + ht / 2, K.load_font(size, bold=True), ink)


def draw_signal(draw, cx: float, cy: float, s: float, state: str | None, pole: float = 200) -> None:
    def S(v: float) -> float:
        return v * s
    draw.rectangle((cx - S(12), cy + S(160), cx + S(12), cy + S(160) + S(pole)), fill=K.DEV_MID)
    draw.rounded_rectangle((cx - S(70) + S(8), cy - S(180) + S(10), cx + S(70) + S(8), cy + S(170) + S(10)),
                           radius=S(30), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(70), cy - S(180), cx + S(70), cy + S(170)), radius=S(30), fill=K.DEV_DARK)
    for i, (name, col) in enumerate((("red", K.DANGER), ("amber", K.GOLD), ("green", GREEN))):
        ly = cy - S(110) + i * S(108)
        on = state == name
        if on:
            draw.ellipse((cx - S(56), ly - S(56), cx + S(56), ly + S(56)), fill=_tint(col, 0.45))
        draw.ellipse((cx - S(42), ly - S(42), cx + S(42), ly + S(42)), fill=col if on else LIGHT_OFF)


def draw_beetle(draw, cx: float, cy: float, s: float, t: float = 0.0, col=LADY) -> None:
    """Friendly ladybug. Spans cx±100s, cy-170s .. cy+86s."""
    def S(v: float) -> float:
        return v * s
    lw = max(2, int(S(8)))
    draw.ellipse((cx - S(84), cy + S(64), cx + S(84), cy + S(92)), fill=K.SHADOW)
    for side in (-1, 1):
        for k in range(3):
            ly = cy - S(30) + k * S(40)
            wig = S(6) * math.sin(t * 30 + k * 2 + side)
            draw.line((cx + side * S(50), ly, cx + side * S(98), ly + S(16) * (k - 1) + wig), fill=K.DEV_DEEP, width=lw)
    for side in (-1, 1):
        draw.line((cx + side * S(16), cy - S(110), cx + side * S(44), cy - S(158)), fill=K.DEV_DEEP, width=lw)
        draw.ellipse((cx + side * S(44) - S(10), cy - S(168), cx + side * S(44) + S(10), cy - S(148)),
                     fill=K.DEV_DEEP)
    draw.ellipse((cx - S(46), cy - S(122), cx + S(46), cy - S(44)), fill=K.DEV_DEEP)
    draw.ellipse((cx - S(72), cy - S(70), cx + S(72), cy + S(82)), fill=col)
    draw.line((cx, cy - S(66), cx, cy + S(80)), fill=K.DEV_DEEP, width=max(2, int(S(5))))
    for dx, dy, r in ((-36, -24, 15), (36, -24, 15), (-40, 30, 13), (40, 30, 13), (-16, 60, 9), (16, 60, 9)):
        draw.ellipse((cx + S(dx) - S(r), cy + S(dy) - S(r), cx + S(dx) + S(r), cy + S(dy) + S(r)), fill=K.DEV_DEEP)
    for side in (-1, 1):
        ex = cx + side * S(18)
        draw.ellipse((ex - S(13), cy - S(104), ex + S(13), cy - S(78)), fill=(255, 255, 255))
        draw.ellipse((ex - S(6), cy - S(96), ex + S(6), cy - S(84)), fill=K.DEV_DEEP)
    draw.arc((cx - S(16), cy - S(84), cx + S(16), cy - S(58)), 20, 160, fill=(255, 255, 255), width=max(2, int(S(4))))


def draw_moth(draw, cx: float, cy: float, s: float) -> None:
    def S(v: float) -> float:
        return v * s
    for side in (-1, 1):
        up = [(cx, cy - S(14)), (cx + side * S(110), cy - S(80)), (cx + side * S(136), cy - S(10)),
              (cx + side * S(50), cy + S(14))]
        lo = [(cx, cy + S(4)), (cx + side * S(90), cy + S(20)), (cx + side * S(76), cy + S(84)), (cx + side * S(16), cy + S(50))]
        draw.polygon(up, fill=MOTH)
        draw.polygon(lo, fill=_shade(MOTH, 0.9))
        draw.ellipse((cx + side * S(84) - S(14), cy - S(46) - S(14), cx + side * S(84) + S(14), cy - S(46) + S(14)),
                     fill=MOTH_DARK)
        draw.line((cx + side * S(5), cy - S(46), cx + side * S(38), cy - S(104)), fill=MOTH_DARK,
                  width=max(2, int(S(5))))
        draw.ellipse((cx + side * S(38) - S(7), cy - S(111), cx + side * S(38) + S(7), cy - S(97)), fill=MOTH_DARK)
    draw.ellipse((cx - S(14), cy - S(50), cx + S(14), cy + S(64)), fill=MOTH_DARK)


def draw_old_computer(draw, box, t: float) -> None:
    x0, y0, x1, y1 = box
    cw = (x1 - x0 - 40) / 3
    for i in range(3):
        bx = x0 + i * (cw + 20)
        draw.rectangle((bx + 10, y0 + 12, bx + cw + 10, y1 + 12), fill=K.SHADOW)
        draw.rectangle((bx, y0, bx + cw, y1), fill=(206, 200, 188), outline=K.DEV_DARK, width=4)
        if i == 1:
            for k, ry in enumerate((y0 + 100, y0 + 240)):
                rx = bx + cw / 2
                draw.ellipse((rx - 58, ry - 58, rx + 58, ry + 58), fill=K.DEV_DARK)
                draw.ellipse((rx - 22, ry - 22, rx + 22, ry + 22), fill=K.STEEL)
                for j in range(3):
                    a = t * 8 * (1 if k == 0 else -1) + j * math.tau / 3
                    draw.line((rx + math.cos(a) * 24, ry + math.sin(a) * 24, rx + math.cos(a) * 52,
                               ry + math.sin(a) * 52), fill=K.STEEL_DARK, width=6)
        else:
            for r in range(6):
                for c in range(4):
                    lx = bx + 36 + c * (cw - 72) / 3
                    ly = y0 + 50 + r * 46
                    on = (int(t * 7) + r * 3 + c * 5 + i) % 3 != 0
                    col = (K.GOLD, K.LED_ON, K.DANGER)[(r + c) % 3] if on else (130, 136, 148)
                    draw.ellipse((lx - 10, ly - 10, lx + 10, ly + 10), fill=col)
        draw.rounded_rectangle((bx + 20, y1 - 110, bx + cw - 20, y1 - 30), radius=10, fill=K.DEV_MID)
        for k in range(3):
            dx = bx + 50 + k * (cw - 100) / 2
            draw.ellipse((dx - 16, y1 - 86, dx + 16, y1 - 54), fill=K.STEEL)


def draw_books(draw, cx: float, by: float, s: float) -> None:
    def S(v: float) -> float:
        return v * s
    for k, col in enumerate(BOOK_COLS):
        y1 = by - k * S(42)
        off = S(10) * (1 if k % 2 else -1)
        draw.rounded_rectangle((cx - S(100) + off + S(6), y1 - S(40) + S(6), cx + S(100) + off + S(6), y1 + S(6)),
                               radius=S(8), fill=K.SHADOW)
        draw.rounded_rectangle((cx - S(100) + off, y1 - S(40), cx + S(100) + off, y1), radius=S(8), fill=col)
        draw.rectangle((cx + S(70) + off, y1 - S(32), cx + S(92) + off, y1 - S(8)), fill=(255, 255, 255))


def draw_school_bag(draw, cx: float, cy: float, s: float, open_: bool) -> None:
    def S(v: float) -> float:
        return v * s
    K.draw_bag(draw, cx, cy, s)
    if open_:
        draw.ellipse((cx - S(76), cy - S(112), cx + S(76), cy - S(64)), fill=K.DEV_DEEP)
        draw.rounded_rectangle((cx - S(40), cy - S(140), cx + S(10), cy - S(84)), radius=S(6), fill=BOOK_COLS[0])
        draw.rounded_rectangle((cx + S(4), cy - S(128), cx + S(48), cy - S(84)), radius=S(6), fill=K.STEEL)
    else:
        draw.line((cx - S(70), cy - S(70), cx + S(70), cy - S(70)), fill=K.DEV_DARK, width=max(2, int(S(8))))
        draw.rounded_rectangle((cx + S(40), cy - S(78), cx + S(60), cy - S(46)), radius=S(4), fill=K.GOLD)


def step_row(draw, brand, x0: float, x1: float, y: float, h: float, num, label: str, state: str,
             size: int = 40) -> None:
    ink = K.hex_rgb(brand["ink"])
    muted = K.hex_rgb(brand["muted"])
    sage = K.hex_rgb(brand["sage"])
    coral = K.hex_rgb(brand["coral"])
    fills = {"normal": (246, 243, 238), "ok": K.hex_rgb(brand["sageSoft"]), "bad": K.DANGER_SOFT,
             "new": K.hex_rgb(brand["sageSoft"]), "focus": K.hex_rgb(brand["coralSoft"])}
    outs = {"bad": K.DANGER, "new": sage, "focus": coral}
    draw.rounded_rectangle((x0, y, x1, y + h), radius=26, fill=fills.get(state, fills["normal"]),
                           outline=outs.get(state), width=5 if state in outs else 0)
    pcol = {"ok": sage, "new": sage, "bad": K.DANGER, "focus": coral}.get(state, muted)
    if num is not None:
        K.pill(draw, 0, y + h / 2 - 23, str(num), pcol, size=28, left=x0 + 20)
    text_mid(draw, label, x0 + 100, y + h / 2, K.load_font(size, bold=True), ink)
    if state == "ok":
        K.draw_check(draw, x1 - 46, y + h / 2, 24, sage)
    elif state == "bad":
        K.draw_cross(draw, x1 - 46, y + h / 2, 24, K.DANGER)
    elif state == "new":
        K.pill(draw, 0, y + h / 2 - 22, "NEW", sage, size=26, left=x1 - 130)


def draw_leg(draw, lx: float, ay: float, s: float, mode: str) -> None:
    """Leg + foot facing right. mode: 'silly' (sock over shoe) or 'right' (sock, then shoe)."""
    def S(v: float) -> float:
        return v * s
    draw.ellipse((lx - S(80), ay + S(76), lx + S(250), ay + S(100)), fill=K.SHADOW)
    draw.rectangle((lx - S(40), ay - S(330), lx + S(40), ay - S(100)), fill=K.SKIN)
    draw.rounded_rectangle((lx - S(56), ay - S(380), lx + S(56), ay - S(300)), radius=S(20), fill=K.ROAD)
    shoe = [(lx - S(60), ay - S(40)), (lx + S(50), ay - S(40)), (lx + S(120), ay - S(8)), (lx + S(196), ay + S(14)),
            (lx + S(210), ay + S(66)), (lx - S(60), ay + S(66))]
    sole = (lx - S(64), ay + S(58), lx + S(214), ay + S(84))

    def sock(big: bool) -> None:
        k = 1.12 if big else 1.0
        toe = 0.8 if big else 1.0
        pts = [(lx - S(48) * k, ay - S(190)), (lx + S(48) * k, ay - S(190)), (lx + S(48) * k, ay - S(30) * k),
               (lx + S(150) * toe, ay - S(4)), (lx + S(186) * toe, ay + S(40)), (lx + S(150) * toe, ay + S(70)),
               (lx - S(48) * k, ay + S(70))]
        draw.polygon(pts, fill=SOCK, outline=K.DEV_MID, width=max(2, int(S(4))))
        for j in range(3):
            yy = ay - S(176) + j * S(24)
            draw.rectangle((lx - S(48) * k + S(3), yy, lx + S(48) * k - S(3), yy + S(12)), fill=IF_COL)

    def shoe_draw() -> None:
        draw.polygon(shoe, fill=SHOE, outline=K.DEV_DARK, width=max(2, int(S(4))))
        draw.rounded_rectangle(sole, radius=S(10), fill=K.DEV_DARK)
        for j in range(3):
            x = lx + S(10) + j * S(30)
            draw.line((x, ay - S(30) + j * S(8), x + S(26), ay - S(14) + j * S(8)), fill=(255, 255, 255),
                      width=max(2, int(S(6))))

    if mode == "silly":
        shoe_draw()
        sock(True)
        draw.rounded_rectangle(sole, radius=S(10), fill=K.DEV_DARK)
    else:
        sock(False)
        draw.rectangle((lx - S(60), ay - S(40), lx + S(50), ay - S(20)), fill=SOCK)
        shoe_draw()


def draw_paste(draw, cx: float, cy: float, s: float) -> None:
    def S(v: float) -> float:
        return v * s
    body = [(cx - S(110), cy - S(46)), (cx + S(60), cy - S(30)), (cx + S(60), cy + S(30)), (cx - S(110), cy + S(46))]
    draw.polygon([(x + S(6), y + S(8)) for x, y in body], fill=K.SHADOW)
    draw.polygon(body, fill=(255, 255, 255), outline=K.DEV_DARK)
    draw.rectangle((cx - S(124), cy - S(48), cx - S(104), cy + S(48)), fill=K.STEEL_DARK)
    draw.rectangle((cx - S(60), cy - S(18), cx + S(30), cy + S(18)), fill=THEN_COL)
    draw.rounded_rectangle((cx + S(58), cy - S(20), cx + S(104), cy + S(20)), radius=S(8), fill=K.CORAL)
    draw.ellipse((cx + S(108), cy - S(70), cx + S(150), cy - S(40)), fill=(220, 244, 240), outline=THEN_COL,
                 width=max(2, int(S(4))))


def draw_tooth(draw, cx: float, cy: float, s: float, t: float = 0.0) -> None:
    def S(v: float) -> float:
        return v * s
    draw.ellipse((cx - S(80) + S(6), cy - S(80) + S(8), cx + S(80) + S(6), cy + S(30) + S(8)), fill=K.SHADOW)
    for side in (-1, 1):
        draw.rounded_rectangle((cx + side * S(44) - S(28), cy - S(10), cx + side * S(44) + S(28), cy + S(100)),
                               radius=S(26), fill=(255, 255, 255), outline=K.DEV_DARK, width=max(2, int(S(4))))
    draw.ellipse((cx - S(80), cy - S(80), cx + S(80), cy + S(40)), fill=(255, 255, 255), outline=K.DEV_DARK,
                 width=max(2, int(S(4))))
    draw.rectangle((cx - S(64), cy + S(10), cx + S(64), cy + S(36)), fill=(255, 255, 255))
    for side in (-1, 1):
        ex = cx + side * S(26)
        draw.ellipse((ex - S(7), cy - S(32), ex + S(7), cy - S(18)), fill=K.DEV_DEEP)
    draw.arc((cx - S(22), cy - S(22), cx + S(22), cy + S(10)), 20, 160, fill=K.DEV_DEEP, width=max(2, int(S(4))))
    K.draw_star(draw, cx + S(92), cy - S(70), S(18), K.GOLD, rot=t * 4)


def draw_bed(draw, cx: float, by: float, s: float) -> None:
    def S(v: float) -> float:
        return v * s
    draw.rounded_rectangle((cx - S(250), by - S(220), cx - S(210), by), radius=S(12), fill=WOOD_DARK)
    draw.rounded_rectangle((cx + S(214), by - S(140), cx + S(250), by), radius=S(12), fill=WOOD_DARK)
    draw.rectangle((cx - S(214), by - S(110), cx + S(214), by - S(50)), fill=WOOD)
    draw.rounded_rectangle((cx - S(214), by - S(140), cx + S(214), by - S(100)), radius=S(14), fill=(255, 255, 255))
    draw.rounded_rectangle((cx - S(200), by - S(178), cx - S(80), by - S(130)), radius=S(22), fill=(236, 240, 250))
    draw.rounded_rectangle((cx - S(60), by - S(150), cx + S(214), by - S(100)), radius=S(22), fill=BLANKET)


def draw_torch(draw, cx: float, cy: float, s: float, on: bool, t: float = 0.0) -> None:
    def S(v: float) -> float:
        return v * s
    if on:
        draw.polygon([(cx + S(230), cy - S(80)), (cx + S(620), cy - S(200)), (cx + S(620), cy + S(200)),
                      (cx + S(230), cy + S(80))], fill=BEAM)
    draw.rounded_rectangle((cx - S(260) + S(8), cy - S(50) + S(10), cx + S(130) + S(8), cy + S(50) + S(10)),
                           radius=S(26), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(260), cy - S(50), cx + S(130), cy + S(50)), radius=S(26), fill=K.CORAL)
    for k in range(4):
        gx = cx - S(220) + k * S(30)
        draw.line((gx, cy - S(36), gx, cy + S(36)), fill=_shade(K.CORAL, 0.85), width=max(2, int(S(8))))
    draw.rounded_rectangle((cx - S(80), cy - S(72), cx - S(20), cy - S(46)), radius=S(8),
                           fill=K.LED_ON if on else K.DEV_MID)
    draw.polygon([(cx + S(120), cy - S(50)), (cx + S(220), cy - S(90)), (cx + S(220), cy + S(90)),
                  (cx + S(120), cy + S(50))], fill=K.STEEL, outline=K.STEEL_DARK)
    draw.ellipse((cx + S(204), cy - S(90), cx + S(240), cy + S(90)), fill=(255, 236, 150) if on else (200, 204, 212),
                 outline=K.STEEL_DARK, width=max(2, int(S(5))))


def draw_battery(draw, cx: float, cy: float, s: float, col=K.GOLD) -> None:
    def S(v: float) -> float:
        return v * s
    draw.rounded_rectangle((cx - S(70) + S(6), cy - S(32) + S(8), cx + S(70) + S(6), cy + S(32) + S(8)), radius=S(12),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(70), cy - S(32), cx + S(70), cy + S(32)), radius=S(12), fill=K.DEV_DARK)
    draw.rounded_rectangle((cx - S(70), cy - S(32), cx + S(10), cy + S(32)), radius=S(12), fill=col)
    draw.rounded_rectangle((cx + S(70), cy - S(14), cx + S(86), cy + S(14)), radius=S(4), fill=K.STEEL_DARK)
    draw.line((cx + S(30), cy, cx + S(54), cy), fill=(255, 255, 255), width=max(2, int(S(6))))
    draw.line((cx + S(42), cy - S(12), cx + S(42), cy + S(12)), fill=(255, 255, 255), width=max(2, int(S(6))))


def draw_bulb(draw, cx: float, cy: float, s: float, on: bool = True) -> None:
    def S(v: float) -> float:
        return v * s
    if on:
        draw.ellipse((cx - S(70), cy - S(90), cx + S(70), cy + S(50)), fill=(255, 246, 200))
    draw.ellipse((cx - S(50), cy - S(70), cx + S(50), cy + S(30)), fill=(255, 236, 150) if on else (230, 234, 240),
                 outline=K.DEV_DARK, width=max(2, int(S(4))))
    draw.rectangle((cx - S(26), cy + S(20), cx + S(26), cy + S(56)), fill=K.STEEL_DARK)
    for k in range(2):
        yy = cy + S(30) + k * S(12)
        draw.line((cx - S(26), yy, cx + S(26), yy), fill=K.STEEL, width=max(2, int(S(4))))
    draw.line((cx - S(14), cy - S(10), cx, cy - S(30), cx + S(14), cy - S(10)), fill=K.CORAL, width=max(2, int(S(4))))


def draw_switch(draw, cx: float, cy: float, s: float, on: bool = True) -> None:
    def S(v: float) -> float:
        return v * s
    draw.rounded_rectangle((cx - S(56) + S(6), cy - S(56) + S(8), cx + S(56) + S(6), cy + S(56) + S(8)), radius=S(16),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(56), cy - S(56), cx + S(56), cy + S(56)), radius=S(16), fill=(255, 255, 255),
                           outline=K.DEV_DARK, width=max(2, int(S(4))))
    draw.rounded_rectangle((cx - S(22), cy - S(40), cx + S(22), cy + S(40)), radius=S(12), fill=K.DEV_MID)
    ky = cy - S(18) if on else cy + S(18)
    draw.rounded_rectangle((cx - S(18), ky - S(18), cx + S(18), ky + S(18)), radius=S(10),
                           fill=K.LED_ON if on else K.STEEL)


def draw_trophy(draw, cx: float, cy: float, s: float) -> None:
    def S(v: float) -> float:
        return v * s
    gold, dark = K.GOLD, (222, 146, 30)
    for side in (-1, 1):
        draw.arc((cx + side * S(110) - S(50), cy - S(100), cx + side * S(110) + S(50), cy), 0, 360, fill=dark,
                 width=max(3, int(S(14))))
    draw.pieslice((cx - S(110), cy - S(200), cx + S(110), cy + S(40)), 0, 180, fill=gold)
    draw.rectangle((cx - S(110), cy - S(110), cx + S(110), cy - S(80)), fill=gold)
    draw.rounded_rectangle((cx - S(120), cy - S(122), cx + S(120), cy - S(96)), radius=S(10), fill=dark)
    draw.rectangle((cx - S(18), cy + S(36), cx + S(18), cy + S(80)), fill=dark)
    draw.rounded_rectangle((cx - S(80), cy + S(76), cx + S(80), cy + S(110)), radius=S(10), fill=K.DEV_DARK)
    K.draw_star(draw, cx, cy - S(36), S(38), (255, 248, 220))


def render(draw, brand, visual, focus, progress, w, h) -> bool:
    if not visual.startswith("a10-"):
        return False
    ink = K.hex_rgb(brand["ink"])
    muted = K.hex_rgb(brand["muted"])
    coral = K.hex_rgb(brand["coral"])
    sage = K.hex_rgb(brand["sage"])
    panel = K.hex_rgb(brand["panel"])
    line = K.hex_rgb(brand["line"])
    coral_soft = K.hex_rgb(brand["coralSoft"])
    sage_soft = K.hex_rgb(brand["sageSoft"])
    lav_soft = K.hex_rgb("#EFEAFB")
    blue_soft = K.hex_rgb("#E6EEFB")
    appear = K.ease_out_cubic(min(1.0, progress * 3.0))
    bounce = int(10 * math.sin(progress * math.pi * 3))
    pulse = 0.5 + 0.5 * math.sin(progress * math.pi * 8)
    lift = int((1 - appear) * 40)
    cx = w / 2
    t = progress
    F = K.load_font
    text_at = K.text_at

    def stars_around(y: float, spread: float, n: int = 6) -> None:
        for i in range(n):
            side = -1 if i % 2 == 0 else 1
            sx = cx + side * (spread + 80 * (i // 2))
            sy = y + 90 * (i // 2) + 14 * math.sin(progress * 9 + i)
            K.draw_star(draw, sx, sy, 22 + 6 * pulse, [coral, sage, K.BOTH_COLOR, K.GOLD][i % 4], rot=progress * 3 + i)

    def stars_at(x: float, y: float, r: float, n: int = 4) -> None:
        for i in range(n):
            a = i * 2 * math.pi / n + 0.4
            sx = x + math.cos(a) * r
            sy = y + math.sin(a) * r * 0.7 + 10 * math.sin(progress * 9 + i)
            K.draw_star(draw, sx, sy, 20 + 6 * pulse, [coral, sage, K.BOTH_COLOR, K.GOLD][i % 4], rot=progress * 3 + i)

    def qmarks(pts, size: int = 80) -> None:
        for k, (qx, qy) in enumerate(pts):
            text_at(draw, "?", qx, qy, F(int(size + 20 * (pulse if k % 2 else 1 - pulse)), bold=True), K.GOLD)

    def confetti(regions, n: int = 18) -> None:
        cols = [coral, sage, K.BOTH_COLOR, K.GOLD]
        for i in range(n):
            x0, y0, x1, y1 = regions[i % len(regions)]
            x = x0 + ((i * 131) % 97) / 97 * (x1 - x0)
            y = y0 + ((t * 0.9 + i * 0.173) % 1) * (y1 - y0)
            a = t * 9 + i
            dx, dy = math.cos(a) * 14, math.sin(a) * 6
            draw.polygon([(x - dx, y - dy - 7), (x + dx, y + dy - 7), (x + dx, y + dy + 7), (x - dx, y - dy + 7)],
                         fill=cols[i % 4])

    def list_card(box, title: str) -> None:
        K.shadow_card(draw, box, brand, radius=32)
        text_at(draw, title, (box[0] + box[2]) / 2, box[1] + 26, F(40, bold=True), coral)

    def mini_box(x: float, y: float, sz: float, label: str, col, fill=None, dashed: bool = False) -> None:
        if dashed:
            draw.rounded_rectangle((x - sz / 2, y - sz / 2, x + sz / 2, y + sz / 2), radius=18, fill=fill or coral_soft)
            for (ax, ay, bx, by) in ((x - sz / 2 + 18, y - sz / 2, x + sz / 2 - 18, y - sz / 2),
                                     (x - sz / 2 + 18, y + sz / 2, x + sz / 2 - 18, y + sz / 2),
                                     (x - sz / 2, y - sz / 2 + 18, x - sz / 2, y + sz / 2 - 18),
                                     (x + sz / 2, y - sz / 2 + 18, x + sz / 2, y + sz / 2 - 18)):
                K.draw_dashed(draw, ax, ay, bx, by, col, width=4, dash=14, gap=10, phase=progress * 80)
        else:
            draw.rounded_rectangle((x - sz / 2, y - sz / 2, x + sz / 2, y + sz / 2), radius=18, fill=fill or panel,
                                   outline=col, width=4)
        text_at(draw, label, x, y - sz * 0.32, F(int(sz * 0.5), bold=True), col)

    BAG_STEPS = ["Open the bag", "Put the books in", "Put the tiffin in", "Walk to school"]

    # ---- opening -----------------------------------------------------------
    if visual == "a10-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 300), 450, 110, sage, panel, bounce)
            K.draw_robot(draw, cx + 300, 500, 0.85, t, mood="happy", wave=t)
            text_at(draw, "Welcome back, champ!", cx, 740, F(60, bold=True), ink)
            stars_around(330, 520)
            return True
        if focus == "bridge":
            K.shadow_card(draw, (240, 240 + lift, w - 240, 850 + lift), brand, radius=40, accent=sage)
            text_at(draw, "LAST TIME · CHAPTER 4 · IF, THEN, ELSE", cx, 320 + lift, F(34, bold=True), sage)
            rows = [("IF", "the light is red", IF_COL), ("THEN", "stop", THEN_COL), ("ELSE", "go", ELSE_COL)]
            for i, (kw, lab, col) in enumerate(rows):
                a = K.stagger(progress, i, step=0.15, speed=4)
                if a > 0:
                    rule_row(draw, 400, 410 + i * 130 + lift + int((1 - a) * 20), kw, lab, col, ink, size=50,
                             wd=210, ht=86)
            draw_signal(draw, 1460, 560 + lift, 0.7, "red" if progress < 0.55 else "green", pole=180)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (300, 240 + lift, w - 300, 590 + lift), brand, radius=40, accent=coral)
            text_at(draw, "CHAPTER 5 OF 5 · THE LAST ONE!", cx, 300 + lift, F(32, bold=True), coral)
            text_at(draw, "Debugging", cx, 345 + lift, F(96, bold=True), ink)
            text_at(draw, "Finding the Mistake", cx, 475 + lift, F(46, bold=True), muted)
            for i in range(5):
                a = K.stagger(progress, i + 2, step=0.08, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 2) * 190
                y = 715 + int((1 - a) * 20)
                if i < 4:
                    K.draw_check(draw, x, y, 50, sage)
                else:
                    r = 54 + 6 * pulse
                    draw.ellipse((x - r - 10, y - r - 10, x + r + 10, y + r + 10), fill=coral_soft)
                    draw.ellipse((x - r, y - r, x + r, y + r), fill=coral)
                    text_at(draw, "5", x, y - 34, F(56, bold=True), (255, 255, 255))
            text_at(draw, "Unit 2 · chapter by chapter", cx, 800, F(30, bold=True), muted)
            return True
        # word
        for i, (syl, col) in enumerate((("De", coral), ("bug", K.DANGER), ("ging", sage))):
            a = K.stagger(progress, i, step=0.12, speed=5)
            if a <= 0:
                continue
            x = cx + (i - 1) * 380
            y = 300 + int((1 - a) * 50)
            draw.rounded_rectangle((x - 170, y, x + 170, y + 200), radius=40, fill=panel, outline=col, width=6)
            text_at(draw, syl, x, y + 40, F(100, bold=True), col)
        a = K.stagger(progress, 4, step=0.12, speed=4)
        if a > 0:
            qmarks(((cx - 680, 320), (cx + 690, 350)), 70)
            text_at(draw, "Bugs?!", cx, 560, F(54, bold=True), muted)
            bx = K.lerp(300, 1620, K.clamp01((progress - 0.45) / 0.55))
            draw_beetle(draw, bx, 770, 0.55, t)
        return True

    # ---- Robo's bag bug -------------------------------------------------------------
    if visual == "a10-bag":
        if focus == "steps":
            list_card((140, 250, 900, 840), "Robo's steps")
            shown = progress * 5.2 - 0.4
            for i, lab in enumerate(BAG_STEPS):
                a = K.ease_out_cubic(K.clamp01((shown - i) * 2.5))
                if a <= 0:
                    continue
                step_row(draw, brand, 180, 860, 360 + i * 115 + int((1 - a) * 30), 95, i + 1, lab, "normal")
            draw.ellipse((1400 - 270, 580 - 270, 1400 + 270, 580 + 270), fill=blue_soft)
            hx, hy = K.draw_robot(draw, 1360, 610, 0.85, t, mood="happy", hold=True)
            draw_school_bag(draw, hx + 20, hy + 100, 0.5, True)
            if shown > 1:
                draw_books(draw, 1730, 840, 0.4)
            if shown > 2:
                K.draw_tiffin(draw, 1730, 720, 0.4)
            return True
        draw.rounded_rectangle((100, 760, 1820, 850), radius=24, fill=PATH)
        if focus == "walk":
            k = K.ease_in_out(K.clamp01(progress * 1.25))
            rx = K.lerp(420, 1300, k)
            for at, kind in ((0.32, "books"), (0.5, "tiffin")):
                if progress > at:
                    fx = K.lerp(420, 1300, K.ease_in_out(K.clamp01(at * 1.25))) + 180
                    fall = K.ease_out_cubic(K.clamp01((progress - at) * 8))
                    fy = K.lerp(640, 820, fall)
                    if kind == "books":
                        draw_books(draw, fx, fy, 0.42)
                    else:
                        K.draw_tiffin(draw, fx, fy - 60, 0.4)
            hx, hy = K.draw_robot(draw, rx, 560, 0.72, t, mood="confused" if progress > 0.55 else "idle", hold=True)
            draw_school_bag(draw, hx + 14, hy + 84, 0.42, True)
            if progress > 0.55:
                text_at(draw, "Oh no!", 480, 270, F(90, bold=True), K.DANGER)
            return True
        if focus == "ask":
            text_at(draw, "Is Robo being naughty?", cx, 226, F(52, bold=True), ink)
            draw.ellipse((cx - 260, 580 - 260, cx + 260, 580 + 260), fill=lav_soft)
            K.draw_robot(draw, cx, 600, 0.88, t, mood="blank")
            draw_books(draw, 560, 830, 0.45)
            K.draw_tiffin(draw, 1380, 780, 0.42)
            qmarks(((cx - 420, 380), (cx + 420, 400)), 80)
            K.draw_stopwatch(draw, 1680, 420, 44, progress, brand)
            return True
        # because
        K.draw_robot(draw, 430, 600, 0.85, t, mood="idle")
        reasons = [("Not naughty", sage, True), ("Did every step exactly", sage, True),
                   ("So a STEP is wrong!", K.DANGER, False)]
        for i, (lab, col, ok) in enumerate(reasons):
            a = K.stagger(progress, i, step=0.22, speed=4)
            if a <= 0:
                continue
            y = 270 + i * 165 + int((1 - a) * 30)
            draw.rounded_rectangle((820, y, 1720, y + 135), radius=36, fill=sage_soft if ok else K.DANGER_SOFT,
                                   outline=col, width=5)
            (K.draw_check if ok else K.draw_cross)(draw, 900, y + 67, 38, col)
            text_mid(draw, lab, 970, y + 67, F(50, bold=True), ink)
        return True

    # ---- what is a bug ----------------------------------------------------------
    if visual == "a10-define":
        if focus == "bug":
            draw.ellipse((560 - 260, 560 - 260, 560 + 260, 560 + 260), fill=coral_soft)
            draw_beetle(draw, 560, 640, 1.5, t)
            text_at(draw, "It's called a", 1300, 320 + lift, F(46, bold=True), muted)
            a = K.ease_out_cubic(K.clamp01((progress - 0.35) * 2.5))
            if a > 0:
                text_at(draw, "BUG", 1300, 390 + int((1 - a) * 30), F(int(150 * (0.8 + 0.2 * a)), bold=True), K.DANGER)
                K.pill(draw, 1300, 640, "a mistake in the steps", coral, size=40)
            return True
        if focus == "moth":
            draw_old_computer(draw, (160, 290, 940, 760), t)
            K.draw_magnifier(draw, 800, 420, 0.9, coral)
            draw_moth(draw, 800, 420, 0.42)
            K.pill(draw, 550, 790, "As big as a room!", K.BOTH_COLOR, size=34)
            draw.rounded_rectangle((1060 + 10, 270 + 12, 1760 + 10, 840 + 12), radius=20, fill=K.SHADOW)
            draw.rounded_rectangle((1060, 270, 1760, 840), radius=20, fill=PAPER)
            draw.line((1120, 280, 1120, 830), fill=(240, 170, 170), width=3)
            for k in range(7):
                yy = 370 + k * 66
                draw.line((1080, yy, 1740, yy), fill=(220, 210, 232), width=2)
            text_at(draw, "Notebook · 1947", 1430, 300, F(34, bold=True), muted)
            a = K.stagger(progress, 2, step=0.15, speed=4)
            if a > 0:
                draw_moth(draw, 1430, 500, 0.9)
                for dx, ang in ((-130, 0.3), (130, -0.3)):
                    tx, ty = 1430 + dx, 470
                    pts = [(-50, -16), (50, -16), (50, 16), (-50, 16)]
                    ca, sa = math.cos(ang), math.sin(ang)
                    draw.polygon([(tx + x * ca - y * sa, ty + x * sa + y * ca) for x, y in pts], fill=TAPE)
            b = K.stagger(progress, 4, step=0.15, speed=4)
            if b > 0:
                text_at(draw, "First actual case of", 1430, 660, F(38, bold=True), ink)
                text_at(draw, "bug being found.", 1430, 710, F(38, bold=True), ink)
            return True
        if focus == "not":
            panels = [("A real insect?", False), ("A naughty computer?", False), ("A mistake in the steps!", True)]
            for i, (lab, ok) in enumerate(panels):
                a = K.stagger(progress, i, step=0.25, speed=4)
                if a <= 0:
                    continue
                x0 = 150 + i * 560
                y0 = 270 + int((1 - a) * 30)
                K.shadow_card(draw, (x0, y0, x0 + 500, y0 + 560), brand, radius=36,
                              outline=sage if ok else None, outline_w=6 if ok else 3)
                mx = x0 + 250
                if i == 0:
                    draw_beetle(draw, mx, y0 + 280, 0.95, t)
                elif i == 1:
                    K.draw_device(draw, "laptop", mx, y0 + 270, 1.0, brand)
                    fy = y0 + 250
                    for sx in (-1, 1):
                        ex = mx + sx * 40
                        draw.ellipse((ex - 12, fy - 12, ex + 12, fy + 12), fill=K.DEV_DEEP)
                        draw.line((ex - 22 * sx, fy - 34, ex + 18 * sx, fy - 22), fill=K.DEV_DEEP, width=7)
                    draw.arc((mx - 30, fy + 10, mx + 30, fy + 50), 200, 340, fill=K.DEV_DEEP, width=7)
                else:
                    for k in range(3):
                        yy = y0 + 150 + k * 90
                        bad = k == 1
                        draw.rounded_rectangle((mx - 170, yy, mx + 170, yy + 70), radius=20,
                                               fill=K.DANGER_SOFT if bad else (246, 243, 238),
                                               outline=K.DANGER if bad else None, width=4 if bad else 0)
                        draw.ellipse((mx - 150, yy + 15, mx - 110, yy + 55), fill=K.DANGER if bad else muted)
                        draw.rounded_rectangle((mx - 90, yy + 27, mx + 120, yy + 43), radius=8, fill=line)
                font = F(38, bold=True)
                lines = K.wrap_text(lab, font, 440)
                for j, ln in enumerate(lines):
                    text_at(draw, ln, mx, y0 + 450 + j * 46 - (len(lines) - 1) * 23, font, sage if ok else ink)
                if ok:
                    K.draw_check(draw, x0 + 450, y0 + 50, 30, sage)
                elif progress > 0.2 + i * 0.25:
                    K.draw_cross(draw, x0 + 450, y0 + 50, 30, K.DANGER)
            return True
        # debug
        list_card((160, 260, 900, 820), "The steps")
        fixed = progress > 0.55
        for i in range(4):
            y = 360 + i * 110
            bad = i == 2
            st = ("ok" if fixed else "bad") if bad else "normal"
            draw.rounded_rectangle((200, y, 860, y + 90), radius=24,
                                   fill={"ok": sage_soft, "bad": K.DANGER_SOFT}.get(st, (246, 243, 238)),
                                   outline={"ok": sage, "bad": K.DANGER}.get(st), width=4 if bad else 0)
            K.pill(draw, 0, y + 22, str(i + 1), {"ok": sage, "bad": K.DANGER}.get(st, muted), size=28, left=220)
            draw.rounded_rectangle((310, y + 36, 700 - i * 40, y + 54), radius=9, fill=line)
            if bad and fixed:
                K.draw_check(draw, 814, y + 45, 24, sage)
        fly = K.clamp01((progress - 0.25) / 0.45)
        if fly < 1:
            bx, by = K.lerp(760, 820, fly), K.lerp(640, 330, fly)
            draw_beetle(draw, bx, by, 0.32, t)
        text_at(draw, "DEBUGGING", 1360, 270, F(84, bold=True), coral)
        for i, (lab, col, soft) in enumerate((("FIND the bug", IF_COL, lav_soft), ("FIX the bug", sage, sage_soft))):
            a = K.stagger(progress, i + 1, step=0.2, speed=4)
            if a <= 0:
                continue
            y = 440 + i * 170 + int((1 - a) * 20)
            draw.rounded_rectangle((1000, y, 1740, y + 130), radius=36, fill=soft, outline=col, width=5)
            if i == 0:
                K.draw_magnifier(draw, 1076, y + 58, 0.38, col)
            else:
                K.draw_check(draw, 1080, y + 65, 36, col)
            text_mid(draw, f"{i + 1} · {lab}", 1150, y + 65, F(48, bold=True), ink)
        return True

    # ---- hunting the bag bug -------------------------------------------------------
    if visual == "a10-hunt":
        if focus == "intro":
            K.draw_magnifier(draw, 460, 520, 1.8, coral)
            draw_beetle(draw, 460, 560, 0.42, t)
            text_at(draw, "Bug hunt!", 1330, 240 + lift, F(76, bold=True), coral)
            rows = ["Read slowly", "Find the wrong step", "Change one thing, test"]
            for i, lab in enumerate(rows):
                a = K.stagger(progress, i + 1, step=0.18, speed=4)
                if a <= 0:
                    continue
                y = 380 + i * 150 + int((1 - a) * 20)
                draw.rounded_rectangle((880, y, 1780, y + 120), radius=34, fill=panel, outline=line, width=3)
                col = [coral, IF_COL, sage][i]
                draw.ellipse((910, y + 20, 990, y + 100), fill=col)
                text_at(draw, str(i + 1), 950, y + 28, F(48, bold=True), (255, 255, 255))
                text_mid(draw, lab, 1020, y + 60, F(46, bold=True), ink)
            return True
        list_card((140, 240, 960, 860), "Robo's steps")
        if focus in ("read", "find"):
            cur = min(3, int(progress * 4.4))
            for i, lab in enumerate(BAG_STEPS):
                y = 340 + i * 125
                if focus == "read":
                    st = "focus" if i == cur else "normal"
                else:
                    st = "ok" if (i < 3 and progress * 5 > i + 0.6) else "normal"
                    if i == 3 and progress > 0.6:
                        st = "bad"
                step_row(draw, brand, 180, 920, y, 100, i + 1, lab, st)
            if focus == "read":
                y = 340 + cur * 125
                K.draw_magnifier(draw, 820, y + 46, 0.42, coral)
                K.pill(draw, 1390, 260, "STEP 1", coral, size=34)
                text_at(draw, "Read the steps", 1390, 340, F(62, bold=True), ink)
                text_at(draw, "slowly, one by one", 1390, 425, F(46, bold=True), muted)
                K.draw_snail(draw, 1390, 620, 2.0, brand)
                text_at(draw, "Don't rush!", 1390, 730, F(46, bold=True), coral)
            else:
                K.pill(draw, 1390, 260, "STEP 2", IF_COL, size=34)
                text_at(draw, "Find where it", 1390, 340, F(56, bold=True), ink)
                text_at(draw, "goes wrong", 1390, 410, F(56, bold=True), ink)
                if progress > 0.6:
                    draw_school_bag(draw, 1390, 600, 0.8, True)
                    draw_books(draw, 1210, 760, 0.42)
                    K.draw_tiffin(draw, 1580, 700, 0.4)
                    text_at(draw, "The bag was never closed!", 1390, 790, F(42, bold=True), K.DANGER)
            return True
        ins = K.clamp01((progress - 0.4) * 3) if focus == "fix" else 1.0
        steps5 = BAG_STEPS[:3] + ["Close the bag"] + BAG_STEPS[3:]
        for i, lab in enumerate(steps5):
            if i == 3:
                if ins <= 0.05:
                    continue
                y = 330 + 3 * 104 + int((1 - ins) * 20)
                st = "new" if focus == "fix" else ("ok" if progress * 6 > i + 0.5 else "new")
                step_row(draw, brand, 180, 920, y, 88, 4, lab, st, size=38)
                continue
            j = i if i < 3 else 4
            y0 = 330 + (3 if i == 4 else j) * 104
            y = K.lerp(y0, 330 + j * 104, ins)
            num = (j + 1) if (i < 3 or ins > 0.5) else 4
            st = "ok" if (focus == "test" and progress * 6 > j + 0.5) else "normal"
            step_row(draw, brand, 180, 920, y, 88, num, lab, st, size=38)
        if focus == "fix":
            K.pill(draw, 1390, 260, "STEP 3", sage, size=34)
            text_at(draw, "Change ONE thing", 1390, 340, F(58, bold=True), ink)
            text_at(draw, "then test again", 1390, 420, F(46, bold=True), muted)
            closed = ins > 0.5
            draw_school_bag(draw, 1390, 680, 0.85, not closed)
            if closed:
                K.draw_check(draw, 1520, 560, 30, sage)
            return True
        # test
        text_at(draw, "It works!", 1400, 236, F(64, bold=True), sage)
        draw.rounded_rectangle((1000, 760, 1800, 850), radius=24, fill=PATH)
        k = K.ease_in_out(K.clamp01(progress * 1.3))
        hx, hy = K.draw_robot(draw, K.lerp(1150, 1560, k), 600, 0.55, t, mood="happy", hold=True)
        draw_school_bag(draw, hx + 12, hy + 66, 0.34, False)
        if progress > 0.6:
            K.pill(draw, 1400, 320, "Bug squashed!", coral, size=36)
        return True

    # ---- three kinds of bugs ------------------------------------------------------
    if visual == "a10-kinds":
        kinds = [("Missing step", coral, coral_soft, "Forgot: close the bag"),
                 ("Wrong order", K.BOTH_COLOR, lav_soft, "Pour, then open the bottle"),
                 ("Extra step", sage, sage_soft, "Do a little dance")]
        active = {"missing": 0, "order": 1, "extra": 2}.get(focus, -1)
        for i, (title, col, soft, ex) in enumerate(kinds):
            a = K.stagger(progress, i, step=0.18, speed=4) if focus == "intro" else 1.0
            if a <= 0:
                continue
            on = i == active
            seen = active >= i
            x = cx + (i - 1) * 560
            y0 = 270 + int((1 - a) * 40) - (int(10 * pulse) if on else 0)
            draw.rounded_rectangle((x - 250 + 10, y0 + 12, x + 250 + 10, y0 + 560 + 12), radius=40,
                                   fill=K.SHADOW)
            draw.rounded_rectangle((x - 250, y0, x + 250, y0 + 560), radius=40, fill=soft if on else panel,
                                   outline=col if (on or focus == "intro") else line, width=6 if on else 3)
            iy = y0 + 180
            if i == 0:
                for k, xx in enumerate((x - 140, x, x + 140)):
                    if k == 1:
                        mini_box(xx, iy, 110, "?", coral, dashed=True)
                    else:
                        mini_box(xx, iy, 110, str(k + 1 if k == 0 else 3), muted)
            elif i == 1:
                mini_box(x - 90, iy, 120, "2", col)
                mini_box(x + 90, iy, 120, "1", col)
                K.draw_curve(draw, (x - 90, iy - 74), (x, iy - 140), (x + 80, iy - 80), col, width=7)
                K.draw_arrow(draw, x + 60, iy - 96, x + 86, iy - 70, col, width=7, head=22)
                K.draw_curve(draw, (x + 90, iy + 74), (x, iy + 140), (x - 80, iy + 80), col, width=7)
                K.draw_arrow(draw, x - 60, iy + 96, x - 86, iy + 70, col, width=7, head=22)
            else:
                mini_box(x - 140, iy, 100, "1", muted)
                mini_box(x + 140, iy, 100, "2", muted)
                rise = 40 + 10 * pulse if on else 40
                mini_box(x, iy - rise, 100, "", K.DANGER, fill=K.DANGER_SOFT)
                K.draw_cross(draw, x, iy - rise, 28, K.DANGER)
                K.draw_dashed(draw, x - 50, iy + 50, x + 50, iy + 50, K.DANGER, width=4, dash=12, gap=8)
            text_at(draw, title, x, y0 + 340, F(52, bold=True), col)
            if seen:
                font = F(32, bold=True)
                for j, ln in enumerate(K.wrap_text(ex, font, 420)):
                    text_at(draw, ln, x, y0 + 430 + j * 40, font, ink if on else muted)
        return True

    # ---- socks and shoes ------------------------------------------------------------
    if visual == "a10-socks":
        steps = ["Wear shoes", "Wear socks", "Go outside"]
        ans = focus == "answer"
        sorted_pos = {0: 1, 1: 0, 2: 2}
        move = K.ease_in_out(K.clamp01((progress - 0.05) * 1.6)) if ans else 0.0
        list_card((140, 260, 900, 820), "Aarav's steps")
        for i, lab in enumerate(steps):
            pos = K.lerp(i, sorted_pos[i], move)
            y = 370 + pos * 140
            placed = ans and move > 0.95
            rank = sorted_pos[i] if ans and move > 0.5 else i
            st = "ok" if placed else "normal"
            step_row(draw, brand, 180, 860, y, 115, rank + 1, lab, st, size=44)
        if ans:
            draw_leg(draw, 1290, 640, 1.0, "right")
            K.pill(draw, 1620, 290, "WRONG ORDER", K.BOTH_COLOR, size=34)
            if progress > 0.5:
                K.pill(draw, 1340, 790, "Swap: socks first!", sage, size=36)
                stars_at(1620, 520, 110, 3)
        else:
            draw_leg(draw, 1290, 620, 1.0, "silly")
            text_at(draw, "Huh?!", 1660, 300, F(60, bold=True), coral)
            K.draw_stopwatch(draw, 1680, 500, 42, progress, brand)
            for k, lab in enumerate(("Missing?", "Wrong order?", "Extra?")):
                K.pill(draw, [1080, 1360, 1650][k], 780, lab, [coral, K.BOTH_COLOR, sage][k], size=32)
        return True

    # ---- brushing teeth -----------------------------------------------------------
    if visual == "a10-brush":
        cards = [("brush", "Pick up the brush"), ("paste", "Put paste on it"), ("dance", "Dance on the bed"),
                 ("teeth", "Brush your teeth")]
        ans = focus == "answer"
        out = K.ease_out_cubic(K.clamp01((progress - 0.15) * 3)) if ans else 0.0
        cw, gap = 380, 40
        x_start = cx - (4 * cw + 3 * gap) / 2
        for i, (kind, lab) in enumerate(cards):
            a = 1.0 if ans else K.stagger(progress, i, step=0.12, speed=4)
            if a <= 0:
                continue
            x0 = x_start + i * (cw + gap)
            extra = i == 2
            dy = -28 * out if extra else 0
            y0 = 318 - int((1 - a) * 24) + dy
            y1 = 790 - int((1 - a) * 24) + dy
            bad = ans and extra
            win = ans and not extra and out > 0.6
            K.shadow_card(draw, (x0, y0, x0 + cw, y1), brand, radius=28,
                          outline=K.DANGER if bad else (sage if win else None), outline_w=6 if (bad or win) else 3)
            if bad:
                draw.rounded_rectangle((x0 + 6, y0 + 6, x0 + cw - 6, y1 - 6), radius=24, fill=K.DANGER_SOFT)
            K.pill(draw, 0, y0 + 20, str(i + 1), K.DANGER if bad else (sage if win else coral), size=28, left=x0 + 20)
            mx, iy = x0 + cw / 2, y0 + 210
            if kind == "brush":
                K.draw_toothbrush(draw, mx - 6, iy + 30, 1.0)
            elif kind == "paste":
                draw_paste(draw, mx - 10, iy + 10, 1.0)
            elif kind == "dance":
                draw_bed(draw, mx, iy + 120, 0.6)
                hop = abs(math.sin(t * math.pi * 6)) * 24
                K.draw_person(draw, mx + 10, iy - 40 - hop, 0.42, "kid", t)
                K.draw_notes(draw, mx + 120, iy - 70, 0.6, t)
            else:
                draw_tooth(draw, mx, iy - 10, 1.0, t)
            font = F(34, bold=True)
            lines = K.wrap_text(lab, font, cw - 40)
            for j, ln in enumerate(lines):
                text_at(draw, ln, mx, y1 - 32 - len(lines) * 42 + j * 42, font, ink)
            if bad:
                K.draw_cross(draw, x0 + cw - 44, y0 + 44, 28, K.DANGER)
            elif win:
                K.draw_check(draw, x0 + cw - 44, y0 + 44, 26, sage)
            if i < 3:
                ax = x0 + cw + 4
                K.draw_arrow(draw, ax, 555, ax + gap - 8, 555, line if ans and i in (1, 2) else muted, width=7, head=18)
        if ans:
            if out > 0.6:
                x1 = x_start + 1 * (cw + gap) + cw / 2
                x3 = x_start + 3 * (cw + gap) + cw / 2
                K.draw_curve(draw, (x1, 812), (cx + 210, 880), (x3 - 10, 812), sage, width=8)
                K.draw_arrow(draw, x3 - 40, 828, x3 - 6, 806, sage, width=8, head=24)
            K.pill(draw, cx, 226, "EXTRA STEP · take it out!", K.DANGER, size=30)
        else:
            K.draw_stopwatch(draw, cx, 846, 28, progress, brand)
        return True

    # ---- one change at a time ------------------------------------------------------
    if visual == "a10-one":
        if focus == "intro":
            K.draw_person(draw, 360, 480, 1.2, "kid", t)
            K.draw_bubble(draw, (520, 250, 1080, 400), brand, "My torch won't switch on!", tail="left", size=40)
            draw_torch(draw, 1200, 640, 1.2, False, t)
            qmarks(((1640, 470), (1620, 730)), 70)
            return True
        if focus == "many":
            on = progress > 0.35
            draw_torch(draw, 720, 620, 1.1, on, t)
            parts = [("battery", 450), ("bulb", 760), ("switch", 1060)]
            for i, (kind, x) in enumerate(parts):
                a = K.stagger(progress, i, step=0.08, speed=6)
                if a <= 0:
                    continue
                y = 360 + int((1 - a) * 20)
                if kind == "battery":
                    draw_battery(draw, x, y, 1.0)
                elif kind == "bulb":
                    draw_bulb(draw, x, y + 10, 0.9, True)
                else:
                    draw_switch(draw, x, y, 0.9, True)
                K.pill(draw, x, 248, "NEW", sage, size=28)
                if progress > 0.55:
                    text_at(draw, "?", x + 96, y - 70, F(int(60 + 14 * pulse), bold=True), K.GOLD)
            if progress > 0.55:
                text_at(draw, "Which one", 1610, 430, F(54, bold=True), ink)
                text_at(draw, "fixed it?", 1610, 500, F(54, bold=True), coral)
            return True
        # single
        parts = [("battery", "Batteries", True), ("bulb", "Bulb", False), ("switch", "Switch", False)]
        for i, (kind, lab, changed) in enumerate(parts):
            x = 560 + i * 400
            box = (x - 160, 250, x + 160, 500)
            K.shadow_card(draw, box, brand, radius=28, outline=sage if changed else None, outline_w=6 if changed else 3)
            if kind == "battery":
                draw_battery(draw, x, 345, 0.9)
            elif kind == "bulb":
                draw_bulb(draw, x, 345, 0.75, False)
            else:
                draw_switch(draw, x, 345, 0.7, False)
            text_at(draw, lab, x, 432, F(36, bold=True), ink if changed else muted)
            K.pill(draw, x + 96, 266, "NEW" if changed else "same", sage if changed else line, size=24,
                   fg=(255, 255, 255) if changed else muted)
        on = progress > 0.45
        draw_torch(draw, 700, 700, 0.85, on, t)
        chain = [("1 · Change one thing", coral), ("2 · Test", K.BOTH_COLOR), ("3 · It works!", sage)]
        for i, (lab, col) in enumerate(chain):
            a = K.stagger(progress, i + 1, step=0.15, speed=4)
            if a > 0:
                K.pill(draw, 1560, 560 + i * 100 + int((1 - a) * 16), lab, col, size=34)
        return True

    # ---- true or false -----------------------------------------------------------------
    if visual == "a10-tf":
        ans = focus == "answer"
        K.shadow_card(draw, (300, 270 + lift, 1620, 560 + lift), brand, radius=36, accent=K.BOTH_COLOR)
        K.pill(draw, cx, 300 + lift, "TRUE or FALSE?", K.BOTH_COLOR, size=34)
        font = F(50, bold=True)
        for j, ln in enumerate(K.wrap_text("When the steps don't work, the computer is being naughty.", font, 1180)):
            text_at(draw, ln, cx, 380 + lift + j * 64, font, ink)
        reveal = ans and progress > 0.08
        for k, (lab, col) in enumerate((("TRUE", sage), ("FALSE", K.DANGER))):
            bx = cx + (k * 2 - 1) * 250
            win = reveal and k == 1
            dim = reveal and k == 0
            fill = (226, 222, 216) if dim else col
            grow = int(8 * pulse) if win else 0
            draw.rounded_rectangle((bx - 190 + 8, 610 + 10, bx + 190 + 8, 730 + 10), radius=34, fill=K.SHADOW)
            draw.rounded_rectangle((bx - 190 - grow, 610 - grow, bx + 190 + grow, 730 + grow), radius=34, fill=fill)
            bfont = F(56, bold=True)
            bb = draw.textbbox((0, 0), lab, font=bfont)
            text_mid(draw, lab, bx - (bb[0] + bb[2]) / 2, 670, bfont, muted if dim else (255, 255, 255))
            if win:
                K.draw_check(draw, bx + 230, 670, 34, sage)
            elif dim:
                K.draw_cross(draw, bx - 230, 670, 30, K.DANGER)
        if ans:
            if progress > 0.3:
                text_at(draw, "The computer follows the steps exactly.", cx, 772, F(40, bold=True), sage)
        else:
            K.draw_stopwatch(draw, cx, 810, 34, progress, brand)
            qmarks(((200, 600), (1720, 600)), 80)
        return True

    # ---- celebrate bugs --------------------------------------------------------------
    if visual == "a10-cheer":
        if focus == "every":
            text_at(draw, "Every programmer finds bugs!", cx, 236, F(58, bold=True), ink)
            for i, kind in enumerate(("kid", "teacher", "mom")):
                a = K.stagger(progress, i, step=0.15, speed=4)
                if a <= 0:
                    continue
                x = 480 + i * 480
                yy = int((1 - a) * 30)
                K.draw_person(draw, x, 430 + yy, 0.85, kind, t)
                K.draw_device(draw, "laptop", x, 660 + yy, 0.8, brand, t=t)
                draw_beetle(draw, x + 150, 520 + yy, 0.28, t)
                if progress > 0.4 + i * 0.12:
                    K.draw_check(draw, x - 160, 500 + yy, 28, sage)
            a = K.stagger(progress, 5, step=0.12, speed=4)
            if a > 0:
                K.pill(draw, cx, 790 + int((1 - a) * 16), "Every single day!", coral, size=38)
            return True
        # celebrate
        text_at(draw, "BUG SQUASHED!", cx, 236, F(92, bold=True), coral)
        confetti([(140, 340, 520, 720), (1400, 340, 1780, 720)], n=22)
        K.draw_mascot(draw, int(cx - 380), 540, 100, sage, panel, bounce)
        K.draw_robot(draw, cx + 380, 560, 0.62, t, mood="happy", wave=t)
        draw_beetle(draw, cx, 580, 0.75, t)
        chain = [("Fix it", coral), ("Test it", K.BOTH_COLOR), ("Cheer!", sage)]
        for i, (lab, col) in enumerate(chain):
            a = K.stagger(progress, i + 2, step=0.15, speed=4)
            if a <= 0:
                continue
            x = cx + (i - 1) * 330
            K.pill(draw, x, 770 + int((1 - a) * 16), lab, col, size=40)
            if i < 2:
                K.draw_arrow(draw, x + 100, 800, x + 220, 800, muted, width=8, head=22)
        return True

    # ---- checkpoint -------------------------------------------------------------------
    if visual == "a10-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 280 + lift, w - 460, 740 + lift), brand, radius=40, accent=sage)
            text_at(draw, "PRACTICE CHECK", cx, 360 + lift, F(40, bold=True), sage)
            text_at(draw, "Spot the bug!", cx, 440 + lift, F(64, bold=True), ink)
            K.draw_magnifier(draw, cx - 90, 620 + lift, 0.6, coral)
            draw_beetle(draw, cx + 100, 660 + lift, 0.35, t)
            return True
        ans = focus == "answer"
        draw.rounded_rectangle((140 + 10, 230 + 12, 1080 + 10, 870 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((140, 230, 1080, 870), radius=24, fill=PAPER)
        text_at(draw, "Tea steps", 610, 262, F(44, bold=True), coral)
        steps = ["Add tea leaves to the water", "Add milk and sugar", "Pour into a cup"]
        ins = K.clamp01(progress * 3 - 0.2) if ans else 0.0
        for i, lab in enumerate(steps):
            y = K.lerp(360 + i * 130, 350 + (i + 1) * 120, ins)
            num = i + 2 if ins > 0.5 else i + 1
            step_row(draw, brand, 180, 1040, y, 100, num, lab, "ok" if ins >= 1 else "normal", size=40)
        if ins >= 1:
            slide = K.ease_out_cubic(K.clamp01((progress - 0.4) * 6))
            off = int((1 - slide) * 60)
            step_row(draw, brand, 180 - off, 1040 - off, 350, 100, 1, "Boil the water", "new", size=40)
        if ans:
            K.draw_pot(draw, 1360, 540, 0.9, t, liquid=K.WATER)
            K.draw_cup(draw, 1640, 690, 0.9, t)
            K.pill(draw, 1500, 250, "Missing step!", sage, size=38)
            if progress > 0.8:
                K.pill(draw, 1500, 800, "Bug squashed!", coral, size=36)
        else:
            K.draw_cup(draw, 1400, 560, 1.4, t, fill=(206, 196, 176), steam=False)
            for k, (dx, dy) in enumerate(((-50, -92), (-6, -96), (34, -90), (60, -96))):
                x, y = 1400 + dx, 560 + dy
                draw.polygon([(x - 14, y), (x, y - 7), (x + 14, y), (x, y + 7)], fill=(74, 110, 60))
            for sx, sy in ((1180, 420), (1620, 400), (1640, 640)):
                for k in range(3):
                    a = k * math.pi / 3
                    draw.line((sx - math.cos(a) * 20, sy - math.sin(a) * 20, sx + math.cos(a) * 20,
                               sy + math.sin(a) * 20), fill=K.WATER_DEEP, width=5)
            text_at(draw, "Cold and yucky!", 1400, 720, F(44, bold=True), K.WATER_DEEP)
            K.pill(draw, 1400, 250, "Pause & try!", coral, size=36)
            K.draw_stopwatch(draw, 1720, 560, 44, progress, brand)
        return True

    # ---- recap -------------------------------------------------------------------------
    if visual == "a10-recap":
        recap = [("Bug = a mistake in the steps", K.DANGER, "bug"), ("Debugging = find it & fix it", coral, "debug"),
                 ("Missing · Extra · Wrong order", K.BOTH_COLOR, "kinds"), ("Change one thing, then test", sage, "one")]
        if focus in ("r1", "r2", "r3", "r4"):
            n = int(focus[1])
            text_at(draw, "Remember", cx, 220, F(50, bold=True), ink)
            for i, (lab, col, kind) in enumerate(recap[:n]):
                active = i == n - 1
                a = K.ease_out_cubic(K.clamp01(progress * 3)) if active else 1.0
                x0 = 110 + i * 435
                y0 = 300 + int((1 - a) * 50) - (int(10 * pulse) if active else 0)
                draw.rounded_rectangle((x0, y0, x0 + 400, y0 + 520), radius=36,
                                       fill=coral_soft if active else panel, outline=col if active else line,
                                       width=6 if active else 3)
                ix, iy = x0 + 200, y0 + 200
                if kind == "bug":
                    draw_beetle(draw, ix, iy + 40, 0.75, t)
                elif kind == "debug":
                    K.draw_magnifier(draw, ix - 30, iy - 10, 0.7, coral)
                    K.draw_check(draw, ix + 90, iy + 70, 30, sage)
                elif kind == "kinds":
                    mini_box(ix - 115, iy, 90, "?", coral, dashed=True)
                    mini_box(ix, iy, 90, "2", K.BOTH_COLOR)
                    mini_box(ix + 115, iy, 90, "", K.DANGER, fill=K.DANGER_SOFT)
                    K.draw_cross(draw, ix + 115, iy, 24, K.DANGER)
                else:
                    draw.ellipse((ix - 130, iy - 56, ix - 18, iy + 56), fill=coral)
                    text_at(draw, "1", ix - 74, iy - 40, F(64, bold=True), (255, 255, 255))
                    K.draw_arrow(draw, ix - 8, iy, ix + 50, iy, muted, width=8, head=22)
                    K.draw_check(draw, ix + 100, iy, 42, sage)
                font = F(36, bold=True)
                lines = K.wrap_text(lab, font, 340)
                for j, ln in enumerate(lines):
                    text_at(draw, ln, x0 + 200, y0 + 400 + j * 44, font, ink)
            return True
        if focus == "done":
            text_at(draw, "Chapter 5 done!", cx, 228, F(44, bold=True), ink)
            text_at(draw, "Unit 2 complete!", cx, 285, F(76, bold=True), coral)
            draw_trophy(draw, cx, 540, 1.0)
            K.draw_mascot(draw, int(cx - 430), 520, 100, sage, panel, bounce)
            K.draw_robot(draw, cx + 430, 540, 0.58, t, mood="happy", wave=t)
            for i, (sx, sy) in enumerate(((cx - 230, 450), (cx + 230, 450), (cx - 200, 610), (cx + 200, 610))):
                K.draw_star(draw, sx, sy + 10 * math.sin(progress * 9 + i), 20 + 6 * pulse,
                            [coral, sage, K.BOTH_COLOR, K.GOLD][i], rot=progress * 3 + i)
            chapters = ["Algorithms", "Order", "Loops", "If-Then", "Debugging"]
            for i, lab in enumerate(chapters):
                a = K.stagger(progress, i, step=0.1, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 2) * 300
                y = 730 + int((1 - a) * 20)
                K.draw_check(draw, x, y, 40, coral if i == 4 else sage)
                text_at(draw, lab, x, y + 52, F(30, bold=True), ink)
            return True
        text_at(draw, "Next up: Quiz time!", cx, 380, F(64, bold=True), coral)
        text_at(draw, "Tap Finish and let's go, champ!", cx, 500, F(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False

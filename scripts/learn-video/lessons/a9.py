"""A9 · If This, Then That — visuals."""
from __future__ import annotations

import math

import build as K

IF_COL = K.BOTH_COLOR
THEN_COL = (13, 148, 136)
ELSE_COL = K.CORAL
GREEN = (46, 178, 92)
LIGHT_OFF = (78, 86, 102)
SKY = (198, 228, 250)
SKY_GREY = (188, 196, 210)
CLOUD = (250, 250, 252)
CLOUD_DARK = (138, 146, 164)
WOOD = (176, 120, 76)
WOOD_DARK = (132, 86, 52)
AUTO_GREEN = (36, 120, 78)
ASPHALT = (104, 112, 126)
MANGO = (255, 176, 40)
BALL = (196, 40, 52)
GRASS = (110, 190, 100)
NIGHT = (44, 56, 104)
BLANKET = (120, 160, 230)


def _shade(col, k: float):
    return tuple(max(0, min(255, int(c * k))) for c in col)


def _tint(col, k: float):
    return tuple(int(c + (255 - c) * k) for c in col)


def _rot(pts, ang: float, ox: float, oy: float):
    ca, sa = math.cos(ang), math.sin(ang)
    return [(ox + x * ca - y * sa, oy + x * sa + y * ca) for x, y in pts]


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


def inline_width(draw, parts, size: int, wd: int) -> float:
    f = K.load_font(size, bold=True)
    total = 0.0
    for i, (_, _, text) in enumerate(parts):
        total += wd + 24 + draw.textbbox((0, 0), text, font=f)[2]
        if i < len(parts) - 1:
            total += 40
    return total


def inline_rule(draw, x0: float, y: float, parts, ink, size: int = 44, wd: int = 170, ht: int = 72) -> None:
    f = K.load_font(size, bold=True)
    x = x0
    for kw, col, text in parts:
        kw_badge(draw, x, y, kw, col, wd, ht, int(size * 0.8))
        x = text_mid(draw, text, x + wd + 24, y + ht / 2, f, ink) + 40


def draw_cloud(draw, cx: float, cy: float, s: float, col=CLOUD) -> None:
    def S(v: float) -> float:
        return v * s
    draw.ellipse((cx - S(130), cy - S(30), cx - S(30), cy + S(50)), fill=col)
    draw.ellipse((cx - S(70), cy - S(90), cx + S(50), cy + S(30)), fill=col)
    draw.ellipse((cx + S(10), cy - S(60), cx + S(120), cy + S(40)), fill=col)
    draw.rounded_rectangle((cx - S(110), cy, cx + S(110), cy + S(50)), radius=S(25), fill=col)


def draw_rain(draw, x0: float, x1: float, y0: float, y1: float, t: float, n: int = 16,
              col=K.WATER_DEEP) -> None:
    for k in range(n):
        x = x0 + ((k * 97) % 1000) / 1000 * (x1 - x0)
        p = (t * 2.2 + k * 0.411) % 1
        y = y0 + (y1 - y0 - 30) * p
        draw.line((x, y, x - 8, y + 30), fill=col, width=6)


def draw_sun(draw, cx: float, cy: float, r: float, t: float, face: bool = True) -> None:
    for k in range(10):
        a = k * math.tau / 10 + t * 1.5
        draw.line((cx + math.cos(a) * (r + 18), cy + math.sin(a) * (r + 18),
                   cx + math.cos(a) * (r + 58), cy + math.sin(a) * (r + 58)), fill=K.GOLD,
                  width=max(4, int(r * 0.14)))
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=K.GOLD)
    if face:
        er = max(3, r * 0.1)
        for sx in (-1, 1):
            ex = cx + sx * r * 0.34
            draw.ellipse((ex - er, cy - r * 0.18 - er, ex + er, cy - r * 0.18 + er), fill=K.DEV_DARK)
        draw.arc((cx - r * 0.42, cy - r * 0.2, cx + r * 0.42, cy + r * 0.45), 20, 160, fill=K.DEV_DARK,
                 width=max(3, int(r * 0.08)))


def draw_umbrella(draw, cx: float, cy: float, s: float, col, closed: bool = False) -> None:
    """cy = rim of the open canopy; tip ≈ cy-172s, hook bottom ≈ cy+170s."""
    def S(v: float) -> float:
        return v * s
    dark = _shade(col, 0.8)
    draw.line((cx, cy - S(150), cx, cy - S(172)), fill=K.DEV_DARK, width=max(2, int(S(8))))
    if closed:
        draw.polygon([(cx, cy - S(150)), (cx + S(26), cy + S(30)), (cx - S(26), cy + S(30))], fill=col)
        draw.rounded_rectangle((cx - S(24), cy - S(40), cx + S(24), cy - S(24)), radius=S(6), fill=dark)
        top = cy + S(30)
    else:
        draw.pieslice((cx - S(170), cy - S(150), cx + S(170), cy + S(150)), 180, 360, fill=col)
        for k in range(4):
            x0 = cx - S(170) + k * S(85)
            draw.chord((x0, cy - S(18), x0 + S(85), cy + S(18)), 0, 180, fill=col)
        for k in (-2, -1, 1, 2):
            draw.line((cx, cy - S(148), cx + k * S(70), cy), fill=dark, width=max(2, int(S(5))))
        top = cy
    draw.line((cx, top, cx, cy + S(150)), fill=K.DEV_DARK, width=max(3, int(S(10))))
    draw.arc((cx - S(46), cy + S(124), cx + S(2), cy + S(170)), 0, 180, fill=K.DEV_DARK, width=max(3, int(S(10))))


def draw_signal(draw, cx: float, cy: float, s: float, state: str | None, pole: float = 200) -> None:
    """cy = centre of the light box (box spans cy-180s .. cy+170s)."""
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


def draw_auto(draw, cx: float, cy: float, s: float, t: float, moving: bool = False) -> None:
    """Auto-rickshaw facing right. Canopy top ≈ cy-190s, wheels bottom ≈ cy+144s."""
    def S(v: float) -> float:
        return v * s
    draw.ellipse((cx - S(220), cy + S(118), cx + S(220), cy + S(146)), fill=K.SHADOW)
    if moving:
        for k in range(3):
            yy = cy - S(60) + k * S(50)
            draw.line((cx - S(330) + k * S(20), yy, cx - S(240), yy), fill=(200, 192, 180), width=max(3, int(S(8))))
    draw.rounded_rectangle((cx - S(170), cy - S(100), cx - S(110), cy - S(20)), radius=S(14), fill=K.DEV_DEEP)
    K.draw_face(draw, cx + S(10), cy - S(80), S(34), "kid", 0.6)
    draw.chord((cx - S(44), cy - S(52), cx + S(64), cy + S(40)), 180, 360, fill=K.ROAD)
    draw.polygon([(cx + S(44), cy - S(150)), (cx + S(90), cy - S(150)), (cx + S(150), cy - S(24)),
                  (cx + S(100), cy - S(24))], fill=(206, 232, 246), outline=AUTO_GREEN, width=max(2, int(S(6))))
    draw.rounded_rectangle((cx - S(214), cy - S(190), cx + S(96), cy - S(132)), radius=S(28), fill=AUTO_GREEN)
    draw.line((cx - S(196), cy - S(140), cx - S(196), cy - S(20)), fill=AUTO_GREEN, width=max(3, int(S(14))))
    body = [(cx - S(212), cy + S(84)), (cx - S(212), cy - S(24)), (cx + S(150), cy - S(24)),
            (cx + S(212), cy + S(34)), (cx + S(216), cy + S(84))]
    draw.polygon(body, fill=K.GOLD)
    draw.rectangle((cx - S(212), cy + S(24), cx + S(206), cy + S(38)), fill=AUTO_GREEN)
    draw.ellipse((cx + S(158), cy - S(14), cx + S(186), cy + S(14)), fill=(255, 244, 200), outline=K.DEV_DARK,
                 width=max(1, int(S(3))))
    spin = t * 24 if moving else 0.4
    for wx, r in ((cx - S(120), S(52)), (cx + S(150), S(46))):
        wy = cy + S(92)
        draw.ellipse((wx - r, wy - r, wx + r, wy + r), fill=K.DEV_DEEP)
        draw.ellipse((wx - r * 0.52, wy - r * 0.52, wx + r * 0.52, wy + r * 0.52), fill=K.STEEL)
        for k in range(3):
            a = spin + k * math.tau / 3
            draw.line((wx, wy, wx + math.cos(a) * r * 0.5, wy + math.sin(a) * r * 0.5), fill=K.DEV_DARK,
                      width=max(2, int(S(6))))


def draw_bell(draw, cx: float, cy: float, s: float, t: float, ring: bool = False) -> None:
    def S(v: float) -> float:
        return v * s
    sw = S(10) * math.sin(t * 60) if ring else 0
    draw.rounded_rectangle((cx - S(70), cy - S(156), cx + S(70), cy - S(130)), radius=S(10), fill=WOOD_DARK)
    draw.rectangle((cx - S(10), cy - S(134), cx + S(10), cy - S(110)), fill=K.DEV_DARK)
    x = cx + sw
    draw.ellipse((x - S(18), cy + S(72), x + S(18), cy + S(108)), fill=K.DEV_DARK)
    draw.ellipse((x - S(66), cy - S(120), x + S(66), cy + S(10)), fill=K.GOLD)
    draw.polygon([(x - S(66), cy - S(54)), (x + S(66), cy - S(54)), (x + S(100), cy + S(64)),
                  (x - S(100), cy + S(64))], fill=K.GOLD)
    draw.rounded_rectangle((x - S(112), cy + S(52), x + S(112), cy + S(80)), radius=S(14), fill=(222, 146, 30))
    draw.arc((x - S(44), cy - S(100), x + S(10), cy + S(10)), 190, 250, fill=(255, 236, 180), width=max(2, int(S(10))))
    if ring:
        K.sound_waves(draw, x + S(124), cy, s, K.GOLD, t, "right")
        K.sound_waves(draw, x - S(124), cy, s, K.GOLD, t, "left")


def draw_window(draw, box, t: float, weather: str) -> None:
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=20, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=20, fill=WOOD)
    ix0, iy0, ix1, iy1 = x0 + 24, y0 + 24, x1 - 24, y1 - 24
    draw.rectangle((ix0, iy0, ix1, iy1), fill=SKY if weather == "sun" else SKY_GREY)
    iw, ih = ix1 - ix0, iy1 - iy0
    if weather == "sun":
        draw_sun(draw, ix0 + iw * 0.66, iy0 + ih * 0.38, ih * 0.13, t)
    else:
        if weather == "rain":
            draw_rain(draw, ix0 + 20, ix1 - 10, iy0 + ih * 0.3, iy1, t, n=18)
        cs = iw / 640
        draw_cloud(draw, ix0 + iw * 0.3, iy0 + ih * 0.26, cs, CLOUD_DARK)
        draw_cloud(draw, ix0 + iw * 0.72, iy0 + ih * 0.2, cs * 0.9, (160, 168, 184))
    mx, my = (x0 + x1) / 2, (y0 + y1) / 2
    draw.rectangle((mx - 10, iy0, mx + 10, iy1), fill=WOOD)
    draw.rectangle((ix0, my - 10, ix1, my + 10), fill=WOOD)
    draw.rounded_rectangle((x0 - 24, y1 - 10, x1 + 24, y1 + 18), radius=8, fill=WOOD_DARK)


def draw_door(draw, cx: float, by: float, s: float) -> None:
    def S(v: float) -> float:
        return v * s
    draw.rectangle((cx - S(130), by - S(440), cx + S(130), by), fill=WOOD_DARK)
    draw.rectangle((cx - S(110), by - S(420), cx + S(110), by), fill=WOOD)
    for yy in (by - S(390), by - S(190)):
        draw.rounded_rectangle((cx - S(80), yy, cx + S(80), yy + S(160)), radius=S(10), outline=WOOD_DARK,
                               width=max(2, int(S(6))))
    draw.ellipse((cx + S(62), by - S(222), cx + S(90), by - S(194)), fill=K.GOLD)


def draw_notebook(draw, cx: float, cy: float, s: float, done: bool, brand) -> None:
    def S(v: float) -> float:
        return v * s
    ink = K.hex_rgb(brand["ink"])
    draw.rectangle((cx - S(110) + S(8), cy - S(140) + S(10), cx + S(110) + S(8), cy + S(140) + S(10)), fill=K.SHADOW)
    draw.rectangle((cx - S(110), cy - S(140), cx + S(110), cy + S(140)), fill=(255, 255, 255), outline=ink,
                   width=max(2, int(S(5))))
    for k in range(6):
        yy = cy - S(90) + k * S(40)
        draw.line((cx - S(70), yy, cx + S(90), yy), fill=(200, 210, 232), width=max(1, int(S(4))))
    for k in range(6):
        yy = cy - S(120) + k * S(48)
        draw.ellipse((cx - S(124), yy, cx - S(96), yy + S(28)), outline=K.DEV_MID, width=max(2, int(S(5))))
    if done:
        K.draw_check(draw, cx + S(10), cy, S(64), THEN_COL)
    else:
        for k in range(2):
            yy = cy - S(90) + k * S(40)
            draw.line((cx - S(60), yy - S(6), cx + S(40 - k * 40), yy - S(6)), fill=K.DEV_DARK, width=max(2, int(S(6))))
        pencil = [(-14, -110), (14, -110), (14, 60), (0, 96), (-14, 60)]
        pts = _rot(pencil, 0.7, cx + S(40), cy + S(10))
        draw.polygon([(x, y) for x, y in pts], fill=K.GOLD, outline=K.DEV_DARK)
        tip = _rot([(0, 96)], 0.7, cx + S(40), cy + S(10))[0]
        draw.ellipse((tip[0] - S(7), tip[1] - S(7), tip[0] + S(7), tip[1] + S(7)), fill=K.DEV_DARK)


def draw_bat(draw, cx: float, cy: float, s: float, ang: float = -0.6) -> None:
    def S(v: float) -> float:
        return v * s
    blade = [(-34 * s, -30 * s), (34 * s, -30 * s), (34 * s, 190 * s), (0, 210 * s), (-34 * s, 190 * s)]
    handle = [(-11 * s, -150 * s), (11 * s, -150 * s), (11 * s, -26 * s), (-11 * s, -26 * s)]
    draw.polygon(_rot([(x + S(8), y + S(10)) for x, y in blade], ang, cx, cy), fill=K.SHADOW)
    draw.polygon(_rot(blade, ang, cx, cy), fill=(236, 200, 140), outline=(180, 130, 70))
    draw.polygon(_rot(handle, ang, cx, cy), fill=K.DEV_DARK)


def draw_ball(draw, cx: float, cy: float, r: float) -> None:
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=BALL)
    draw.arc((cx - r * 0.6, cy - r * 1.2, cx + r * 1.6, cy + r * 1.2), 140, 220, fill=(255, 255, 255),
             width=max(2, int(r * 0.12)))


def arrow_board(draw, x: float, y: float, wd: float, ht: float, label: str, col, right: bool = True) -> None:
    if right:
        pts = [(x, y), (x + wd - ht / 2, y), (x + wd, y + ht / 2), (x + wd - ht / 2, y + ht), (x, y + ht)]
    else:
        pts = [(x, y + ht / 2), (x + ht / 2, y), (x + wd, y), (x + wd, y + ht), (x + ht / 2, y + ht)]
    draw.polygon([(px + 8, py + 10) for px, py in pts], fill=K.SHADOW)
    draw.polygon(pts, fill=col)
    f = K.load_font(38, bold=True)
    bb = draw.textbbox((0, 0), label, font=f)
    mx = x + wd / 2 + (-ht / 4 if right else ht / 4)
    draw.text((mx - (bb[0] + bb[2]) / 2, y + ht / 2 - (bb[1] + bb[3]) / 2), label, font=f, fill=(255, 255, 255))


def diamond(draw, cx: float, cy: float, hw: float, hh: float, fill, outline, lines, size: int, fg) -> None:
    pts = [(cx, cy - hh), (cx + hw, cy), (cx, cy + hh), (cx - hw, cy)]
    draw.polygon([(x + 8, y + 10) for x, y in pts], fill=K.SHADOW)
    draw.polygon(pts, fill=fill, outline=outline, width=6)
    f = K.load_font(size, bold=True)
    lh = size * 1.15
    y0 = cy - len(lines) * lh / 2
    for j, ln in enumerate(lines):
        K.text_at(draw, ln, cx, y0 + j * lh, f, fg)


def loop_icon(draw, cx: float, cy: float, r: float, col, t: float = 0.0) -> None:
    rot = t * 120
    a0, a1 = 30 + rot, 320 + rot
    draw.arc((cx - r, cy - r, cx + r, cy + r), a0, a1, fill=col, width=max(4, int(r * 0.22)))
    th = math.radians(a1)
    ex, ey = cx + r * math.cos(th), cy + r * math.sin(th)
    dx, dy = -math.sin(th), math.cos(th)
    hl = r * 0.55
    nx, ny = -dy, dx
    draw.polygon([(ex + dx * hl, ey + dy * hl), (ex + nx * hl * 0.6, ey + ny * hl * 0.6),
                  (ex - nx * hl * 0.6, ey - ny * hl * 0.6)], fill=col)


def draw_game(draw, box, brand, t: float, lives: int, max_lives: int = 3, over: bool = False,
              bump: float = 0.0) -> None:
    ink = K.hex_rgb(brand["ink"])
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=48, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=48, fill=K.DEV_DARK)
    sx0, sy0, sx1, sy1 = x0 + 28, y0 + 28, x1 - 28, y1 - 28
    draw.rounded_rectangle((sx0, sy0, sx1, sy1), radius=28, fill=(196, 228, 250))
    gy = sy1 - 100
    draw.rounded_rectangle((sx0, gy, sx1, sy1), radius=28, fill=GRASS)
    draw.rectangle((sx0, gy, sx1, gy + 30), fill=GRASS)
    draw.rectangle((sx0, gy, sx1, gy + 10), fill=(80, 160, 76))
    sw = sx1 - sx0
    for k in range(2):
        ccx = sx0 + ((0.3 + k * 0.45 - t * 0.3) % 1) * sw
        if sx0 + 80 < ccx < sx1 - 80:
            draw_cloud(draw, ccx, sy0 + 150 + k * 40, 0.38, (255, 255, 255))
    rx = sx1 - 60 - ((t * 1.3) % 1) * (sw - 120)
    draw.polygon([(rx - 40, gy), (rx - 18, gy - 50), (rx + 20, gy - 58), (rx + 40, gy)], fill=K.DEV_MID)
    px = sx0 + sw * 0.3
    jump = abs(math.sin(t * math.pi * 6)) * 60 if not over else 0
    py = gy - 50 - jump
    draw.ellipse((px - 30, gy - 8, px + 30, gy + 8), fill=(80, 160, 76))
    draw.ellipse((px - 46, py - 46, px + 46, py + 46), fill=K.CORAL)
    for sx in (-1, 1):
        ex = px + sx * 16 + 6
        draw.ellipse((ex - 11, py - 22, ex + 11, py), fill=(255, 255, 255))
        draw.ellipse((ex - 4, py - 15, ex + 6, py - 5), fill=K.DEV_DEEP)
    draw.arc((px - 14, py - 4, px + 24, py + 22), 20, 160, fill=K.DEV_DEEP, width=4)
    if bump > 0:
        for k in range(5):
            a = k * math.tau / 5 + t * 4
            K.draw_star(draw, px + math.cos(a) * 80, py + math.sin(a) * 70, 18 * bump, K.GOLD, rot=t * 6)
    for i in range(max_lives):
        hx = sx0 + 56 + i * 76
        K.draw_heart(draw, hx, sy0 + 56, 28, K.DANGER if i < lives else (196, 198, 208))
    f = K.load_font(34, bold=True)
    label = f"LIVES: {lives}"
    bb = draw.textbbox((0, 0), label, font=f)
    draw.rounded_rectangle((sx1 - bb[2] - 56, sy0 + 22, sx1 - 20, sy0 + 86), radius=24, fill=(255, 255, 255))
    draw.text((sx1 - bb[2] - 38, sy0 + 54 - (bb[1] + bb[3]) / 2), label, font=f, fill=ink)
    if over:
        draw.rounded_rectangle((sx0, sy0, sx1, sy1), radius=28, fill=(30, 36, 48))
        K.text_at(draw, "GAME OVER", (sx0 + sx1) / 2, (sy0 + sy1) / 2 - 44, K.load_font(80, bold=True), K.DANGER)


def draw_mango(draw, cx: float, cy: float, s: float) -> None:
    def S(v: float) -> float:
        return v * s
    draw.ellipse((cx - S(70) + S(6), cy - S(56) + S(8), cx + S(70) + S(6), cy + S(62) + S(8)), fill=K.SHADOW)
    draw.ellipse((cx - S(70), cy - S(56), cx + S(70), cy + S(62)), fill=MANGO)
    draw.ellipse((cx - S(40), cy - S(36), cx + S(4), cy + S(4)), fill=(255, 210, 110))
    draw.line((cx + S(30), cy - S(52), cx + S(40), cy - S(80)), fill=WOOD_DARK, width=max(2, int(S(8))))
    draw.polygon([(cx + S(40), cy - S(76)), (cx + S(96), cy - S(96)), (cx + S(70), cy - S(60))], fill=K.LEAF)


def draw_bed(draw, cx: float, by: float, s: float, kid: bool = False, t: float = 0.0) -> None:
    """by = floor line; bed spans cx±250s, by-220s .. by."""
    def S(v: float) -> float:
        return v * s
    draw.ellipse((cx - S(260), by - S(16), cx + S(260), by + S(14)), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(250), by - S(220), cx - S(210), by), radius=S(12), fill=WOOD_DARK)
    draw.rounded_rectangle((cx + S(214), by - S(140), cx + S(250), by), radius=S(12), fill=WOOD_DARK)
    draw.rectangle((cx - S(214), by - S(110), cx + S(214), by - S(50)), fill=WOOD)
    draw.rounded_rectangle((cx - S(214), by - S(140), cx + S(214), by - S(100)), radius=S(14), fill=(255, 255, 255))
    draw.rounded_rectangle((cx - S(200), by - S(178), cx - S(80), by - S(130)), radius=S(22), fill=(236, 240, 250))
    if kid:
        K.draw_face(draw, cx - S(140), by - S(180), S(42), "kid", 0.2)
        for sx in (-1, 1):
            ex = cx - S(140) + sx * S(16)
            draw.rectangle((ex - S(9), by - S(190), ex + S(9), by - S(178)), fill=K.SKIN)
            draw.arc((ex - S(8), by - S(192), ex + S(8), by - S(178)), 20, 160, fill=K.DEV_DARK, width=max(2, int(S(4))))
    draw.rounded_rectangle((cx - S(90), by - S(168), cx + S(214), by - S(96)), radius=S(26), fill=BLANKET)
    draw.line((cx - S(70), by - S(150), cx + S(190), by - S(150)), fill=_tint(BLANKET, 0.4), width=max(2, int(S(6))))


def draw_book(draw, cx: float, cy: float, s: float) -> None:
    def S(v: float) -> float:
        return v * s
    draw.polygon([(cx, cy - S(60)), (cx - S(120), cy - S(80)), (cx - S(120), cy + S(60)), (cx, cy + S(80))],
                 fill=(255, 255, 255), outline=K.DEV_DARK)
    draw.polygon([(cx, cy - S(60)), (cx + S(120), cy - S(80)), (cx + S(120), cy + S(60)), (cx, cy + S(80))],
                 fill=(250, 246, 236), outline=K.DEV_DARK)
    for k in range(3):
        yy = cy - S(40) + k * S(30)
        draw.line((cx - S(100), yy - S(14), cx - S(20), yy), fill=(190, 196, 214), width=max(2, int(S(5))))
        draw.line((cx + S(20), yy, cx + S(100), yy - S(14)), fill=(190, 196, 214), width=max(2, int(S(5))))


def draw_sky_tile(draw, cx: float, cy: float, s: float, t: float) -> None:
    def S(v: float) -> float:
        return v * s
    draw.rounded_rectangle((cx - S(90), cy - S(70), cx + S(90), cy + S(70)), radius=S(22), fill=SKY)
    draw.ellipse((cx + S(14), cy - S(54), cx + S(70), cy + S(2)), fill=K.GOLD)
    draw_cloud(draw, cx - S(20), cy + S(16), 0.42 * s, (255, 255, 255))


def render(draw, brand, visual, focus, progress, w, h) -> bool:
    if not visual.startswith("a9-"):
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

    def centred_rule(y: float, parts, size: int = 44, wd: int = 170) -> float:
        x0 = cx - inline_width(draw, parts, size, wd) / 2
        inline_rule(draw, x0, y, parts, ink, size, wd)
        return x0

    # ---- opening -----------------------------------------------------------
    if visual == "a9-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 300), 450, 110, sage, panel, bounce)
            K.draw_robot(draw, cx + 300, 500, 0.85, t, mood="happy", wave=t)
            text_at(draw, "Welcome back, champ!", cx, 740, F(60, bold=True), ink)
            stars_around(330, 520)
            return True
        if focus == "bridge":
            K.shadow_card(draw, (240, 240 + lift, w - 240, 850 + lift), brand, radius=40, accent=sage)
            text_at(draw, "LAST TIME · CHAPTER 3 · LOOPS", cx, 320 + lift, F(34, bold=True), sage)
            for i in range(5):
                a = K.stagger(progress, i, step=0.06, speed=6)
                if a <= 0:
                    continue
                x = cx - 380 + i * 190
                y = 410 + lift + int((1 - a) * 20)
                draw.rounded_rectangle((x - 80, y, x + 80, y + 70), radius=35, fill=(246, 243, 238))
                text_at(draw, "clap", x, y + 14, F(36, bold=True), muted)
            strike = K.clamp01((progress - 0.4) * 3)
            if strike > 0:
                draw.line((480, 445 + lift, 480 + 960 * strike, 445 + lift), fill=K.DANGER, width=8)
            b = K.stagger(progress, 6, step=0.08, speed=4)
            if b > 0:
                y = 540 + lift + int((1 - b) * 30)
                draw.rounded_rectangle((420, y, w - 420, y + 160), radius=40, fill=coral_soft, outline=coral, width=5)
                loop_icon(draw, 540, y + 80, 46, coral, t)
                text_mid(draw, "Repeat 5 times: clap", 630, y + 80, F(60, bold=True), ink)
            c = K.stagger(progress, 8, step=0.08, speed=4)
            if c > 0:
                K.pill(draw, cx, 740 + lift + int((1 - c) * 20), "Do it again!", sage, size=36)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (300, 240 + lift, w - 300, 560 + lift), brand, radius=40, accent=coral)
            text_at(draw, "CHAPTER 4 OF 5", cx, 300 + lift, F(32, bold=True), coral)
            text_at(draw, "If This, Then That", cx, 350 + lift, F(88, bold=True), ink)
            text_at(draw, "Unit 2 · Thinking Like a Computer", cx, 478 + lift, F(32, bold=True), muted)
            for i, (lab, col) in enumerate((("If", IF_COL), ("Then", THEN_COL), ("Else", ELSE_COL))):
                a = K.stagger(progress, i + 2, step=0.12, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 320
                y = 640 + int((1 - a) * 30)
                draw.rounded_rectangle((x - 120, y, x + 120, y + 130), radius=30, fill=panel, outline=line, width=3)
                K.pill(draw, x, y + 34, lab, col, size=38)
                if i < 2:
                    K.draw_arrow(draw, x + 130, y + 65, x + 190, y + 65, muted, width=8, head=22)
            return True
        # choice
        draw.ellipse((480 - 260, 600 - 260, 480 + 260, 600 + 260), fill=blue_soft)
        K.draw_robot(draw, 480, 620, 0.9, t, mood="confused" if progress < 0.55 else "happy")
        text_at(draw, "Robo makes a choice!", 1290, 250, F(64, bold=True), ink)
        draw.rectangle((1290 - 12, 420, 1290 + 12, 850), fill=WOOD_DARK)
        a = K.stagger(progress, 1, step=0.15, speed=4)
        b = K.stagger(progress, 2, step=0.15, speed=4)
        if a > 0:
            arrow_board(draw, 1270, 440 + int((1 - a) * 20), 380, 100, "THIS WAY", coral, right=True)
        if b > 0:
            arrow_board(draw, 1310 - 380, 600 + int((1 - b) * 20), 380, 100, "THAT WAY", sage, right=False)
        if progress > 0.55:
            qmarks(((780, 330),), 70)
        return True

    # ---- Aarav and the umbrella ---------------------------------------------------
    if visual == "a9-rain":
        if focus == "morning":
            draw.ellipse((520 - 240, 560 - 240, 520 + 240, 560 + 240), fill=coral_soft)
            K.pill(draw, 520, 240, "Monday morning", sage, size=34)
            K.draw_bag(draw, 300, 700, 0.5)
            K.draw_person(draw, 520, 470, 1.25, "kid", t)
            K.draw_tiffin(draw, 750, 720, 0.45)
            K.pill(draw, 520, 790, "Aarav", coral, size=34)
            K.shadow_card(draw, (1000, 260, 1760, 820), brand, radius=36)
            text_at(draw, "Ready for school?", 1380, 300, F(48, bold=True), ink)
            for i, lab in enumerate(("Bag packed", "Tiffin packed", "Shoes on")):
                a = K.stagger(progress, i + 1, step=0.2, speed=4)
                if a <= 0:
                    continue
                y = 410 + i * 125 + int((1 - a) * 20)
                draw.rounded_rectangle((1060, y, 1700, y + 100), radius=28, fill=sage_soft)
                K.draw_check(draw, 1120, y + 50, 30, sage)
                text_mid(draw, lab, 1180, y + 50, F(44, bold=True), ink)
            return True
        if focus == "ask":
            text_at(draw, "Take the umbrella?", cx, 232, F(56, bold=True), ink)
            draw_door(draw, 1150, 840, 1.0)
            draw_umbrella(draw, 1400, 640, 0.9, coral, closed=True)
            K.draw_person(draw, 420, 480, 1.2, "kid", t)
            K.draw_bubble(draw, (560, 320, 860, 440), brand, "Hmm…", tail="left", size=48)
            qmarks(((1560, 420), (1620, 620)), 80)
            K.draw_stopwatch(draw, 1720, 800, 44, progress, brand)
            return True
        if focus == "depends":
            K.draw_person(draw, 380, 500, 1.15, "kid", t)
            draw_window(draw, (700, 280, 1250, 740), t, "cloud")
            if progress > 0.45:
                K.draw_dashed(draw, 500, 470, 690, 470, muted, width=6, phase=progress * 120)
            text_at(draw, "It depends!", 1580, 270, F(64, bold=True), coral)
            text_at(draw, "Check first:", 1580, 370, F(40, bold=True), muted)
            a = K.stagger(progress, 3, step=0.15, speed=4)
            if a > 0:
                diamond(draw, 1580, 610, 220 * (0.85 + 0.15 * a), 150 * (0.85 + 0.15 * a), lav_soft, IF_COL,
                        ["Is it", "raining?"], 42, IF_COL)
            return True
        # yes
        draw_rain(draw, 120, 390, 230, 840, t, n=10)
        draw_rain(draw, 730, 860, 230, 840, t, n=6)
        draw.ellipse((180, 800, 780, 848), fill=(206, 230, 248))
        draw_umbrella(draw, 560, 400, 0.9, coral)
        K.draw_person(draw, 470, 520, 1.1, "kid", t)
        K.shadow_card(draw, (920, 290, 1780, 720), brand, radius=36, accent=IF_COL)
        text_at(draw, "THAT'S A RULE!", 1350, 380, F(36, bold=True), IF_COL)
        a = K.stagger(progress, 1, step=0.2, speed=4)
        b = K.stagger(progress, 3, step=0.2, speed=4)
        if a > 0:
            rule_row(draw, 980, 450 + int((1 - a) * 20), "IF", "it rains", IF_COL, ink, size=50)
        if b > 0:
            rule_row(draw, 980, 580 + int((1 - b) * 20), "THEN", "take an umbrella", THEN_COL, ink, size=50)
        if progress > 0.8:
            stars_at(1350, 790, 300, 4)
        return True

    # ---- the shape of a rule -------------------------------------------------------
    if visual == "a9-define":
        if focus == "rule":
            text_at(draw, "Every rule has this shape", cx, 240, F(48, bold=True), muted)
            a = K.stagger(progress, 0, step=0.25, speed=4)
            b = K.stagger(progress, 2, step=0.2, speed=4)
            if a > 0:
                y = 340 + int((1 - a) * 30)
                kw_badge(draw, 300, y + 15, "IF", IF_COL, wd=220, ht=90, size=48)
                draw.rounded_rectangle((560, y, 1500, y + 120), radius=36, fill=lav_soft, outline=IF_COL, width=5)
                text_at(draw, "something is true", 1030, y + 30, F(56, bold=True), IF_COL)
                draw_cloud(draw, 1660, y + 50, 0.5, CLOUD_DARK)
                draw_rain(draw, 1610, 1720, y + 80, y + 150, t, n=5)
            if b > 0:
                K.draw_arrow(draw, 1030, 475, 1030, 475 + 60 * b, muted, width=10, head=26)
                y = 545 + int((1 - b) * 30)
                kw_badge(draw, 300, y + 15, "THEN", THEN_COL, wd=220, ht=90, size=48)
                draw.rounded_rectangle((560, y, 1500, y + 120), radius=36, fill=sage_soft, outline=THEN_COL, width=5)
                text_at(draw, "do something", 1030, y + 30, F(56, bold=True), THEN_COL)
                draw_umbrella(draw, 1660, y + 60, 0.4, coral)
            c = K.stagger(progress, 5, step=0.12, speed=4)
            if c > 0:
                K.pill(draw, cx, 760 + int((1 - c) * 20), "an IF-THEN rule", coral, size=40)
            return True
        if focus == "condition":
            diamond(draw, 600, 470, 330, 210, lav_soft, IF_COL, ["Is it", "raining?"], 58, IF_COL)
            a = K.stagger(progress, 3, step=0.12, speed=4)
            if a > 0:
                for k, (x, lab, ok) in enumerate(((440, "YES", True), (760, "NO", False))):
                    draw.line((600, 680, x, 740), fill=muted, width=6)
                    col = sage if ok else K.DANGER
                    draw.rounded_rectangle((x - 130, 740, x + 130, 840), radius=40,
                                           fill=sage_soft if ok else K.DANGER_SOFT, outline=col, width=5)
                    (K.draw_check if ok else K.draw_cross)(draw, x - 70, 790, 28, col)
                    text_mid(draw, lab, x - 30, 790, F(44, bold=True), col)
            K.shadow_card(draw, (1040, 270, 1780, 830), brand, radius=36)
            text_at(draw, "CONDITION", 1410, 320, F(62, bold=True), IF_COL)
            text_at(draw, "= the thing you check", 1410, 420, F(42, bold=True), ink)
            b = K.stagger(progress, 5, step=0.1, speed=4)
            if b > 0:
                text_at(draw, "The answer is either…", 1410, 520, F(36, bold=True), muted)
                K.draw_check(draw, 1150, 625, 30, sage)
                text_mid(draw, "true", 1200, 625, F(46, bold=True), ink)
                K.draw_cross(draw, 1150, 725, 30, K.DANGER)
                text_mid(draw, "not true", 1200, 725, F(46, bold=True), ink)
            return True
        # then
        K.shadow_card(draw, (170, 250, 910, 860), brand, radius=36, outline=sage, outline_w=5)
        K.pill(draw, 540, 280, "Raining? YES", sage, size=36)
        draw_cloud(draw, 540, 450, 0.8, CLOUD_DARK)
        draw_rain(draw, 440, 650, 490, 560, t, n=8)
        draw_umbrella(draw, 540, 680, 0.65, coral)
        text_at(draw, "THEN: take umbrella", 540, 795, F(38, bold=True), sage)
        K.draw_check(draw, 850, 310, 28, sage)
        a = K.stagger(progress, 4, step=0.12, speed=4)
        if a > 0:
            dy = int((1 - a) * 30)
            K.shadow_card(draw, (1010, 250 + dy, 1750, 860 + dy), brand, radius=36)
            K.pill(draw, 1380, 280 + dy, "Raining? NO", K.DANGER, size=36)
            draw_sun(draw, 1380, 460 + dy, 45, t)
            draw_umbrella(draw, 1380, 640 + dy, 0.65, (196, 198, 208), closed=True)
            K.draw_cross(draw, 1490, 600 + dy, 32, K.DANGER)
            text_at(draw, "THEN is skipped", 1380, 795 + dy, F(38, bold=True), muted)
        return True

    # ---- else ---------------------------------------------------------------------------
    if visual == "a9-else":
        if focus == "sunny":
            draw_sun(draw, 1250, 450, 110, t)
            K.draw_person(draw, 600, 480, 1.25, "kid", t)
            gy = 480 + 7.5 * math.sin(t * math.pi * 4) - 4
            for sx in (-1, 1):
                gx = 600 + sx * 30
                draw.rounded_rectangle((gx - 26, gy - 16, gx + 26, gy + 16), radius=10, fill=K.DEV_DEEP)
            draw.line((574, gy - 6, 626, gy - 6), fill=K.DEV_DEEP, width=6)
            qmarks(((900, 330), (880, 620), (1580, 560)), 80)
            text_at(draw, "Sunny day… now what?", 1250, 700, F(52, bold=True), ink)
            K.draw_stopwatch(draw, 1700, 380, 44, progress, brand)
            return True
        if focus == "else":
            K.shadow_card(draw, (140, 250, 1200, 830), brand, radius=36)
            a = K.stagger(progress, 3, step=0.12, speed=4)
            rule_row(draw, 190, 300, "IF", "it rains", IF_COL, ink, size=48, wd=210, ht=84)
            rule_row(draw, 190, 440, "THEN", "take an umbrella", THEN_COL, ink, size=48, wd=210, ht=84)
            if a > 0:
                y = 580 + int((1 - a) * 20)
                draw.rounded_rectangle((165, y - 18, 1175, y + 102), radius=36, fill=coral_soft)
                rule_row(draw, 190, y, "ELSE", "leave it at home", ELSE_COL, ink, size=48, wd=210, ht=84)
                K.pill(draw, 670, 735, "ELSE = otherwise", ELSE_COL, size=36)
            draw_sun(draw, 1500, 320, 36, t)
            K.draw_house(draw, 1500, 600, 0.9, brand)
            draw_umbrella(draw, 1730, 680, 0.6, coral, closed=True)
            return True
        # fork
        main = [(140, 560), (760, 560)]
        up = [(760, 560), (1580, 370)]
        down = [(760, 560), (1580, 750)]
        for seg in (main, up, down):
            draw.line(seg, fill=ASPHALT, width=110)
        for seg in (main, up, down):
            K.draw_dashed(draw, seg[0][0], seg[0][1], seg[1][0], seg[1][1], (255, 255, 255), width=6,
                          phase=progress * 80)
        draw.ellipse((760 - 55, 560 - 55, 760 + 55, 560 + 55), fill=ASPHALT)
        text_at(draw, "A BRANCH", 450, 300, F(60, bold=True), IF_COL)
        text_at(draw, "one way OR the other", 450, 384, F(36, bold=True), muted)
        diamond(draw, 760, 560, 180, 110, lav_soft, IF_COL, ["Raining?"], 40, IF_COL)
        K.pill(draw, 1170, 330, "YES · THEN", THEN_COL, size=34)
        K.pill(draw, 1170, 740, "NO · ELSE", ELSE_COL, size=34)
        draw_umbrella(draw, 1700, 400, 0.5, coral)
        K.draw_house(draw, 1700, 760, 0.42, brand)
        p = progress
        if p < 0.35:
            k = p / 0.35
            tx, ty = K.lerp(180, 560, k), 560
        else:
            k = K.ease_in_out(K.clamp01((p - 0.35) / 0.5))
            tx, ty = K.lerp(900, 1520, k), K.lerp(528, 384, k)
        draw.ellipse((tx - 36, ty - 36, tx + 36, ty + 36), fill=panel, outline=coral, width=5)
        K.draw_face(draw, tx, ty + 4, 26, "kid", 0.8)
        if p > 0.6:
            K.draw_cross(draw, 1460, 690, 26, muted)
        return True

    # ---- traffic light ------------------------------------------------------------------
    if visual == "a9-traffic":
        if focus == "meet":
            draw.rounded_rectangle((100, 720, 1820, 850), radius=20, fill=ASPHALT)
            K.draw_dashed(draw, 120, 785, 1800, 785, (255, 255, 255), width=6)
            draw_signal(draw, 1600, 420, 0.8, "amber", pole=230)
            k = K.ease_out_cubic(K.clamp01(progress * 1.5))
            ax = K.lerp(420, 1150, k)
            draw_auto(draw, ax, 640, 0.9, t, moving=k < 0.98)
            K.pill(draw, ax - 60, 380, "Raju bhaiya", coral, size=34)
            if progress > 0.6:
                K.draw_dashed(draw, ax + 30, 560, 1520, 420, muted, width=5, phase=progress * 100)
                draw_bubble_q = K.stagger(progress, 6, step=0.1, speed=4)
                if draw_bubble_q > 0:
                    K.pill(draw, 1600, 250, "Check!", IF_COL, size=34)
            return True
        if focus == "rule":
            state = "red" if progress < 0.55 else "green"
            draw_signal(draw, 380, 450, 0.95, state, pole=250)
            K.shadow_card(draw, (700, 270, 1790, 800), brand, radius=36)
            rows = [("IF", "the light is red", IF_COL), ("THEN", "stop", THEN_COL), ("ELSE", "go carefully", ELSE_COL)]
            for i, (kw, lab, col) in enumerate(rows):
                a = K.stagger(progress, i, step=0.2, speed=4)
                if a <= 0:
                    continue
                y = 320 + i * 150 + int((1 - a) * 20)
                active = (i == 1 and state == "red") or (i == 2 and state == "green")
                if active:
                    draw.rounded_rectangle((725, y - 18, 1765, y + 104), radius=36,
                                           fill=sage_soft if i == 1 else coral_soft)
                rule_row(draw, 760, y, kw, lab, col, ink, size=50, wd=210, ht=86)
            if progress > 0.25:
                K.draw_stop_sign(draw, 1660, 513, 48)
            if progress > 0.45:
                K.pill(draw, 1660, 640, "GO", GREEN, size=34)
            return True
        draw.rounded_rectangle((100, 730, 1820, 850), radius=20, fill=ASPHALT)
        K.draw_dashed(draw, 120, 790, 1800, 790, (255, 255, 255), width=6)
        draw_signal(draw, 300, 430, 0.85, "green", pole=210)
        if focus == "ask":
            draw_auto(draw, 720, 650, 0.9, t, moving=False)
            text_at(draw, "The light is green…", 1290, 240, F(56, bold=True), ink)
            K.pill(draw, 1110, 340, "STOP?", K.DANGER, size=46)
            K.pill(draw, 1430, 340, "GO?", GREEN, size=46)
            K.draw_stopwatch(draw, 1700, 380, 44, progress, brand)
            return True
        # answer
        k = K.ease_in_out(K.clamp01((progress - 0.1) / 0.9))
        draw_auto(draw, K.lerp(720, 1500, k), 650, 0.9, t, moving=0.0 < k < 1.0)
        b1 = K.pill(draw, 1110, 280, "STOP", line, size=46, fg=muted)
        K.draw_cross(draw, b1[2] + 34, (b1[1] + b1[3]) / 2, 24, muted)
        b2 = K.pill(draw, 1430, 280, "GO!", GREEN, size=46)
        K.draw_check(draw, b2[2] + 34, (b2[1] + b2[3]) / 2, 24, sage)
        text_at(draw, "Not red, so ELSE: go carefully", 1290, 400, F(40, bold=True), ELSE_COL)
        if progress > 0.75:
            text_at(draw, "Beep beep!", 600, 360, F(52, bold=True), coral)
        return True

    # ---- rules in a story -------------------------------------------------------------
    if visual == "a9-story":
        if focus == "tiffin":
            K.shadow_card(draw, (160, 240, 1760, 380), brand, radius=36)
            centred_rule(274, [("IF", IF_COL, "Aarav is hungry"), ("THEN", THEN_COL, "he eats his tiffin")])
            K.draw_person(draw, 720, 570, 1.0, "kid", t)
            K.draw_bubble(draw, (330, 430, 620, 530), brand, "Hungry?", tail="right", size=40)
            a = K.clamp01((progress - 0.3) * 3)
            if a > 0:
                K.draw_arrow(draw, 840, 680, 840 + 130 * a, 680, coral, width=12, head=32)
            K.draw_tiffin(draw, 1110, 690, 0.8)
            if progress > 0.6:
                text_at(draw, "Yum!", 1380, 560, F(64, bold=True), coral)
                K.draw_heart(draw, 1380, 690 + bounce, 34, coral)
            return True
        if focus == "bell":
            K.shadow_card(draw, (160, 240, 1760, 380), brand, radius=36)
            centred_rule(274, [("IF", IF_COL, "the bell rings"), ("THEN", THEN_COL, "go to class")])
            draw_bell(draw, 440, 620, 1.0, t, ring=progress < 0.6)
            K.draw_school(draw, 1480, 680, 0.95, brand)
            kx = K.lerp(860, 1180, K.ease_in_out(K.clamp01((progress - 0.35) / 0.6)))
            K.draw_person(draw, kx, 590, 0.8, "kid", t)
            if kx + 90 < 1230:
                K.draw_arrow(draw, kx + 90, 720, 1240, 720, sage, width=10, head=28)
            return True
        # homework
        K.shadow_card(draw, (160, 240, 1760, 520), brand, radius=36)
        parts = [("IF", IF_COL, "homework is done"), ("THEN", THEN_COL, "play cricket")]
        x0 = centred_rule(272, parts)
        a = K.stagger(progress, 3, step=0.12, speed=4)
        if a > 0:
            inline_rule(draw, x0, 412 + int((1 - a) * 16), [("ELSE", ELSE_COL, "finish homework first!")], ink)
        draw_notebook(draw, 420, 700, 0.55, True, brand)
        K.draw_arrow(draw, 510, 700, 600, 700, sage, width=10, head=26)
        draw_bat(draw, 720, 700, 0.55, -0.6)
        draw_ball(draw, 820, 760, 22)
        text_at(draw, "Done? Cricket!", 600, 820, F(34, bold=True), sage)
        K.draw_dashed(draw, 960, 560, 960, 860, line, width=5)
        if a > 0:
            draw_notebook(draw, 1300, 700, 0.55, False, brand)
            text_at(draw, "Not done? Homework first!", 1340, 820, F(34, bold=True), ELSE_COL)
            K.draw_person(draw, 1560, 640, 0.6, "mom", t)
        return True

    # ---- which is an if-then rule? ----------------------------------------------------
    if visual == "a9-which":
        opts = [("mango", "I like mangoes"), ("sky", "The sky is blue"), ("chai", "Chai is hot"),
                ("tiffin", "If I'm hungry, then I eat my tiffin")]
        ans = focus == "answer"
        for i, (kind, lab) in enumerate(opts):
            a = 1.0 if ans else K.stagger(progress, i, step=0.12, speed=4)
            if a <= 0:
                continue
            x0 = 160 + (i % 2) * 830
            y0 = 250 + (i // 2) * 310 + int((1 - a) * 30)
            win = ans and i == 3
            K.shadow_card(draw, (x0, y0, x0 + 770, y0 + 280), brand, radius=32,
                          outline=sage if win else None, outline_w=6 if win else 3)
            if win:
                draw.rounded_rectangle((x0 + 6, y0 + 6, x0 + 764, y0 + 274), radius=28, fill=sage_soft)
            K.pill(draw, 0, y0 + 20, "ABCD"[i], K.BOTH_COLOR if not ans else (sage if win else muted), size=28,
                   left=x0 + 20)
            ix, iy = x0 + 150, y0 + 150
            if kind == "mango":
                draw_mango(draw, ix, iy + 10, 0.9)
            elif kind == "sky":
                draw_sky_tile(draw, ix, iy, 0.9, t)
            elif kind == "chai":
                K.draw_cup(draw, ix, iy + 20, 0.6, t)
            else:
                K.draw_tiffin(draw, ix, iy + 14, 0.6)
            font = F(44, bold=True)
            lines = K.wrap_text(lab, font, 470)
            fg = muted if (ans and not win) else ink
            ty = y0 + (120 if ans and not win else 140) - len(lines) * 27
            for j, ln in enumerate(lines):
                draw.text((x0 + 270, ty + j * 54), ln, fill=fg, font=font)
            if ans and not win:
                K.pill(draw, 0, y0 + 180, "just a fact", line, size=28, fg=muted, left=x0 + 270)
            if win:
                K.draw_check(draw, x0 + 720, y0 + 50, 28, sage)
        return True

    # ---- make your own rule -------------------------------------------------------------
    if visual == "a9-make":
        ans = focus == "answer"
        K.shadow_card(draw, (140, 250, 1120, 830), brand, radius=36, accent=IF_COL)
        text_at(draw, "My bedtime rule", 630, 330, F(40, bold=True), IF_COL)
        rule_row(draw, 190, 410, "IF", "I'm sleepy", IF_COL, ink, size=46, wd=200, ht=80)
        for i, (kw, col, answer) in enumerate((("THEN", THEN_COL, "I go to bed"),
                                               ("ELSE", ELSE_COL, "I read one more story"))):
            y = 550 + i * 140
            kw_badge(draw, 190, y, kw, col, wd=200, ht=80, size=37)
            shown = ans and progress * 3.2 - 0.3 > i
            if shown:
                text_mid(draw, answer, 418, y + 40, F(46, bold=True), col)
            else:
                K.draw_dashed(draw, 418, y + 64, 1060, y + 64, muted, width=5)
        draw.rounded_rectangle((1220, 250, 1780, 540), radius=32, fill=NIGHT)
        draw.ellipse((1560, 290, 1680, 410), fill=K.GOLD)
        draw.ellipse((1596, 276, 1716, 396), fill=NIGHT)
        for k, (sx, sy) in enumerate(((1300, 310), (1400, 450), (1480, 330), (1700, 480), (1330, 480))):
            K.draw_star(draw, sx, sy, 14 + 4 * (pulse if k % 2 else 1 - pulse), (255, 236, 170), rot=k)
        sleeping = ans and progress > 0.35
        draw_bed(draw, 1500, 840, 1.0, kid=sleeping, t=t)
        if sleeping:
            for k in range(3):
                zy = 600 - k * 40 - ((t * 2) % 1) * 20
                text_at(draw, "z", 1400 + k * 34, zy, F(34 + k * 8, bold=True), IF_COL)
        if ans and progress * 3.2 - 0.3 > 1:
            draw_book(draw, 1000, 560 + 140 + 40, 0.5)
        if not ans:
            qmarks(((1420, 562), (1600, 572)), 64)
        return True

    # ---- game character -------------------------------------------------------------
    if visual == "a9-game":
        if focus == "intro":
            draw_game(draw, (460, 250, 1460, 830), brand, t, lives=3)
            K.draw_robot(draw, 1660, 600, 0.6, t, mood="happy")
            stars_at(290, 520, 150, 4)
            return True
        if focus == "rule":
            draw_game(draw, (140, 270, 960, 820), brand, t, lives=3)
            K.shadow_card(draw, (1020, 280, 1790, 810), brand, radius=36)
            rows = [("IF", "lives = 0", IF_COL), ("THEN", "Game over", THEN_COL), ("ELSE", "keep playing", ELSE_COL)]
            for i, (kw, lab, col) in enumerate(rows):
                a = K.stagger(progress, i, step=0.22, speed=4)
                if a <= 0:
                    continue
                rule_row(draw, 1070, 340 + i * 150 + int((1 - a) * 20), kw, lab, col, ink, size=50, wd=200, ht=84)
            return True
        hit = 0.3 <= progress < 0.45
        lives = 3 if (focus == "again" and progress < 0.3) else 2
        draw_game(draw, (140, 270, 1060, 830), brand, t, lives=lives,
                  bump=1.0 if (focus == "again" and hit) else 0.0)
        if focus == "again":
            loop_icon(draw, 1440, 420, 110, IF_COL, t)
            text_at(draw, "CHECK", 1440, 398, F(40, bold=True), IF_COL)
            text_at(draw, "lives = 0 ?", 1440, 590, F(54, bold=True), ink)
            if progress > 0.55:
                K.pill(draw, 1440, 690, "No · keep playing!", sage, size=38)
            return True
        if focus == "ask":
            text_at(draw, "2 lives left", 1440, 280, F(60, bold=True), ink)
            K.pill(draw, 1440, 410, "GAME OVER?", K.DANGER, size=44)
            K.pill(draw, 1440, 540, "KEEP PLAYING?", sage, size=44)
            K.draw_stopwatch(draw, 1440, 760, 50, progress, brand)
            return True
        # answer
        b1 = K.pill(draw, 1420, 300, "GAME OVER", line, size=44, fg=muted)
        K.draw_cross(draw, b1[2] + 36, (b1[1] + b1[3]) / 2, 24, muted)
        b2 = K.pill(draw, 1420, 440, "KEEP PLAYING", sage, size=44)
        K.draw_check(draw, b2[2] + 36, (b2[1] + b2[3]) / 2, 24, sage)
        text_at(draw, "2 is not 0", 1440, 600, F(50, bold=True), ink)
        K.pill(draw, 1440, 680, "so ELSE runs", ELSE_COL, size=38)
        return True

    # ---- checkpoint -----------------------------------------------------------------------
    if visual == "a9-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 280 + lift, w - 460, 740 + lift), brand, radius=40, accent=sage)
            text_at(draw, "PRACTICE CHECK", cx, 360 + lift, F(40, bold=True), sage)
            text_at(draw, "Fill in the blanks!", cx, 440 + lift, F(64, bold=True), ink)
            for i, (lab, col) in enumerate((("IF", IF_COL), ("THEN", THEN_COL), ("ELSE", ELSE_COL))):
                a = K.stagger(progress, i + 1, step=0.12, speed=4)
                if a > 0:
                    kw_badge(draw, cx - 330 + i * 230 - 100, 600 + lift + int((1 - a) * 20), lab, col, wd=200, ht=76)
            return True
        ans = focus == "answer"
        draw.rounded_rectangle((140 + 10, 230 + 12, 1080 + 10, 870 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((140, 230, 1080, 870), radius=24, fill=(255, 250, 238))
        draw.line((180, 250, 180, 850), fill=(240, 170, 170), width=3)
        text_at(draw, "Fill in the blanks", 610, 262, F(42, bold=True), coral)
        rows = [("IF", IF_COL, "the light is red,", None), ("THEN", THEN_COL, None, "stop."),
                ("ELSE", ELSE_COL, None, "go carefully.")]
        for i, (kw, col, fixed, answer) in enumerate(rows):
            y = 370 + i * 150
            draw.line((200, y + 110, 1040, y + 110), fill=(220, 210, 232), width=3)
            if fixed:
                rule_row(draw, 210, y, kw, fixed, col, ink, size=48, wd=200, ht=80)
                continue
            kw_badge(draw, 210, y, kw, col, wd=200, ht=80, size=38)
            shown = ans and progress * 4 - 0.6 > i
            if shown:
                text_mid(draw, answer, 440, y + 40, F(54, bold=True), sage)
                K.draw_check(draw, 1000, y + 40, 22, sage)
            else:
                K.draw_dashed(draw, 440, y + 66, 900, y + 66, muted, width=5)
        if ans:
            state = "red" if progress < 0.5 else "green"
            draw_signal(draw, 1330, 470, 0.85, state, pole=220)
            if progress > 0.3:
                K.draw_stop_sign(draw, 1640, 380, 70)
            if progress > 0.55:
                K.pill(draw, 1640, 560, "GO!", GREEN, size=46)
                stars_at(1640, 780, 110, 3)
        else:
            draw_signal(draw, 1330, 470, 0.85, "red", pole=220)
            K.pill(draw, 1640, 300, "Pause & try!", coral, size=36)
            K.draw_stopwatch(draw, 1640, 500, 50, progress, brand)
        return True

    # ---- recap -------------------------------------------------------------------------
    if visual == "a9-recap":
        recap = [("IF = check a condition", IF_COL, "if"), ("THEN = do it if true", THEN_COL, "then"),
                 ("ELSE = do it if not", ELSE_COL, "else"), ("Red: stop. Else: go!", K.DANGER, "signal")]
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
                if kind == "if":
                    diamond(draw, ix, iy, 130, 90, lav_soft, IF_COL, ["?"], 70, IF_COL)
                elif kind == "then":
                    draw_umbrella(draw, ix - 20, iy + 10, 0.5, coral)
                    K.draw_check(draw, ix + 110, iy - 70, 28, THEN_COL)
                elif kind == "else":
                    draw.line((ix, iy + 110, ix, iy + 10), fill=col, width=14)
                    K.draw_arrow(draw, ix, iy + 16, ix - 100, iy - 80, col, width=14, head=36)
                    K.draw_arrow(draw, ix, iy + 16, ix + 100, iy - 80, col, width=14, head=36)
                    draw.ellipse((ix - 22, iy - 6, ix + 22, iy + 38), fill=col)
                else:
                    draw_signal(draw, ix, iy - 10, 0.62, "red" if (t * 3) % 1 < 0.5 else "green", pole=60)
                font = F(36, bold=True)
                lines = K.wrap_text(lab, font, 340)
                for j, ln in enumerate(lines):
                    text_at(draw, ln, x0 + 200, y0 + 400 + j * 44, font, ink)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 430, 110, sage, panel, bounce)
            K.draw_robot(draw, cx + 300, 490, 0.8, t, mood="happy", wave=t)
            text_at(draw, "Chapter 4 done!", cx, 670, F(68, bold=True), ink)
            K.pill(draw, cx, 770, "Making choices like a computer", coral, size=36)
            stars_around(320, 520, 8)
            return True
        text_at(draw, "Next up: Quiz time!", cx, 380, F(64, bold=True), coral)
        text_at(draw, "Tap Finish and let's go, champ!", cx, 500, F(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False

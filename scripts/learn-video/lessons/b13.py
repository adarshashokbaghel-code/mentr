"""B13 · Chatting With Computers — visuals."""
import math

import build as K

PIP = (13, 148, 136)
PIP_DARK = (8, 104, 96)
CHAT_BG = (246, 243, 238)
PANDA_INK = (38, 38, 46)
BAMBOO = (128, 186, 92)
BAMBOO_DARK = (88, 146, 66)
SPIDER = (74, 62, 86)
ANT = (150, 72, 52)
BOOK = (72, 118, 214)
BOOK_DARK = (50, 84, 156)
MAT = (196, 140, 92)
MAT_DARK = (150, 98, 60)
DRAGON = (92, 172, 108)
DRAGON_DARK = (60, 128, 76)
SOFA = (196, 186, 232)
SOFA_DARK = (160, 146, 206)
TRUNK = (150, 104, 66)
CAKE = (255, 214, 226)
WHITE = (255, 255, 255)


def S_(s):
    return lambda v: v * s


def pip(draw, cx, cy, r, t=0.0, mood="smile"):
    """Pip the chat helper: a round speech-bubble bot. Antenna tip ≈ cy-1.5r, tail ≈ cy+1.25r."""
    y = cy + r * 0.04 * math.sin(t * math.pi * 4)
    draw.ellipse((cx - r + r * 0.07, y - r + r * 0.09, cx + r + r * 0.07, y + r + r * 0.09), fill=K.SHADOW)
    draw.polygon([(cx - r * 0.62, y + r * 0.62), (cx - r * 0.05, y + r * 0.92), (cx - r * 0.8, y + r * 1.25)],
                 fill=PIP)
    draw.ellipse((cx - r, y - r, cx + r, y + r), fill=PIP)
    draw.line((cx, y - r * 0.96, cx, y - r * 1.3), fill=PIP_DARK, width=max(2, int(r * 0.08)))
    draw.ellipse((cx - r * 0.14, y - r * 1.48, cx + r * 0.14, y - r * 1.2), fill=K.GOLD)
    draw.rounded_rectangle((cx - r * 0.7, y - r * 0.44, cx + r * 0.7, y + r * 0.4), radius=r * 0.32, fill=K.DEV_DEEP)
    ew = max(2, int(r * 0.09))
    ey = y - r * 0.1
    er = r * 0.12
    if mood == "blank":
        for sx in (-1, 1):
            ex = cx + sx * r * 0.3
            draw.line((ex - er, ey, ex + er, ey), fill=K.LED_ON, width=ew)
        draw.line((cx - r * 0.16, ey + r * 0.22, cx + r * 0.16, ey + r * 0.22), fill=K.LED_ON, width=ew)
    elif mood == "confused":
        draw.ellipse((cx - r * 0.3 - er * 1.3, ey - er * 1.3, cx - r * 0.3 + er * 1.3, ey + er * 1.3), fill=K.LED_ON)
        draw.ellipse((cx + r * 0.3 - er * 0.6, ey - er * 0.6, cx + r * 0.3 + er * 0.6, ey + er * 0.6), fill=K.LED_ON)
        pts = [(cx - r * 0.2 + k * r * 0.1, ey + r * 0.24 + (r * 0.04 if k % 2 else -r * 0.04)) for k in range(5)]
        draw.line(pts, fill=K.LED_ON, width=ew)
    elif mood == "think":
        for sx in (-1, 1):
            ex = cx + sx * r * 0.3 + r * 0.06
            draw.ellipse((ex - er, ey - er - r * 0.06, ex + er, ey + er - r * 0.06), fill=K.LED_ON)
        draw.ellipse((cx - r * 0.06, ey + r * 0.16, cx + r * 0.08, ey + r * 0.3), fill=K.LED_ON)
    else:
        for sx in (-1, 1):
            ex = cx + sx * r * 0.3
            draw.ellipse((ex - er, ey - er, ex + er, ey + er), fill=K.LED_ON)
        draw.arc((cx - r * 0.22, ey + r * 0.02, cx + r * 0.22, ey + r * 0.3), 20, 160, fill=K.LED_ON, width=ew)


def anaya(draw, cx, cy, s, t=0.0):
    """Anaya: kid with two pigtails. Same anchor as K.draw_person (cy = face centre)."""
    S = S_(s)
    y = cy + S(6) * math.sin(t * math.pi * 4)
    for sx in (-1, 1):
        px = cx + sx * S(76)
        draw.ellipse((px - S(24), y - S(30), px + S(24), y + S(40)), fill=K.HAIR)
        draw.ellipse((px - S(13), y - S(42), px + S(13), y - S(18)), fill=K.CORAL)
    K.draw_person(draw, cx, cy, s, "kid", t)


def panda_head(draw, cx, cy, s):
    S = S_(s)
    for sx in (-1, 1):
        draw.ellipse((cx + sx * S(72) - S(34), cy - S(104), cx + sx * S(72) + S(34), cy - S(36)), fill=PANDA_INK)
    draw.ellipse((cx - S(100), cy - S(84), cx + S(100), cy + S(76)), fill=WHITE, outline=PANDA_INK,
                 width=max(2, int(S(4))))
    for sx in (-1, 1):
        ex = cx + sx * S(40)
        draw.ellipse((ex - S(26), cy - S(28), ex + S(26), cy + S(22)), fill=PANDA_INK)
        draw.ellipse((ex - S(9), cy - S(12), ex + S(9), cy + S(6)), fill=WHITE)
    draw.ellipse((cx - S(14), cy + S(22), cx + S(14), cy + S(40)), fill=PANDA_INK)
    draw.arc((cx - S(20), cy + S(30), cx + S(20), cy + S(56)), 20, 160, fill=PANDA_INK, width=max(2, int(S(4))))


def bamboo(draw, x0, y0, x1, y1, w):
    draw.line((x0, y0, x1, y1), fill=BAMBOO, width=max(3, int(w)))
    for k in range(1, 4):
        mx, my = K.lerp(x0, x1, k / 4), K.lerp(y0, y1, k / 4)
        draw.line((mx - w * 0.6, my, mx + w * 0.6, my), fill=BAMBOO_DARK, width=max(2, int(w * 0.25)))
    for dx, dy in ((-1, -0.4), (1, -0.6)):
        draw.polygon([(x1, y1), (x1 + dx * w * 2.6, y1 + dy * w * 2.2), (x1 + dx * w * 1.2, y1 + w * 0.6)], fill=BAMBOO)


def panda(draw, cx, cy, s, t=0.0):
    """Sitting panda with bamboo. Ears ≈ cy-174s, feet ≈ cy+196s."""
    S = S_(s)
    draw.ellipse((cx - S(110) + S(8), cy - S(10) + S(10), cx + S(110) + S(8), cy + S(180) + S(10)), fill=K.SHADOW)
    draw.ellipse((cx - S(110), cy - S(10), cx + S(110), cy + S(180)), fill=WHITE, outline=PANDA_INK,
                 width=max(2, int(S(4))))
    bamboo(draw, cx + S(70), cy + S(150), cx + S(140), cy - S(130) + S(6) * math.sin(t * 8), S(16))
    draw.rounded_rectangle((cx - S(112), cy + S(24), cx + S(112), cy + S(74)), radius=S(25), fill=PANDA_INK)
    for sx in (-1, 1):
        draw.ellipse((cx + sx * S(66) - S(44), cy + S(124), cx + sx * S(66) + S(44), cy + S(196)), fill=PANDA_INK)
    panda_head(draw, cx, cy - S(70), s)


def spider(draw, cx, cy, s, t=0.0, legs=8):
    """Friendly spider; returns foot points (left side top→bottom, then right side)."""
    S = S_(s)
    lw = max(2, int(S(9)))
    per = legs // 2
    feet = []
    for side in (-1, 1):
        for k in range(per):
            f = k - (per - 1) / 2
            wig = S(6) * math.sin(t * 10 + k + side)
            hip = (cx + side * S(30), cy + f * S(14))
            knee = (cx + side * S(108), cy - S(66) + f * S(42) + wig)
            foot = (cx + side * S(168), cy + S(36) + f * S(50))
            draw.line([hip, knee, foot], fill=SPIDER, width=lw, joint="curve")
            feet.append(foot)
    draw.ellipse((cx - S(62), cy + S(18), cx + S(62), cy + S(140)), fill=SPIDER)
    draw.ellipse((cx - S(20), cy + S(58), cx + S(20), cy + S(98)), fill=(110, 96, 124))
    draw.ellipse((cx - S(46), cy - S(46), cx + S(46), cy + S(42)), fill=SPIDER)
    for sx in (-1, 1):
        ex = cx + sx * S(18)
        draw.ellipse((ex - S(12), cy - S(22), ex + S(12), cy + S(2)), fill=WHITE)
        draw.ellipse((ex - S(5), cy - S(14), ex + S(5), cy - S(4)), fill=K.DEV_DEEP)
    draw.arc((cx - S(16), cy + S(2), cx + S(16), cy + S(22)), 20, 160, fill=WHITE, width=max(2, int(S(4))))
    return feet


def ant(draw, cx, cy, s, t=0.0):
    """Insect with six legs, facing right."""
    S = S_(s)
    lw = max(2, int(S(8)))
    for k in range(3):
        bx = cx - S(20) + k * S(20)
        wig = S(5) * math.sin(t * 10 + k)
        for side in (-1, 1):
            knee = (bx + (k - 1) * S(30), cy + side * S(60) + wig)
            foot = (bx + (k - 1) * S(70), cy + side * S(104))
            draw.line([(bx, cy), knee, foot], fill=ANT, width=lw, joint="curve")
    draw.ellipse((cx - S(150), cy - S(46), cx - S(40), cy + S(46)), fill=ANT)
    draw.ellipse((cx - S(46), cy - S(30), cx + S(30), cy + S(30)), fill=ANT)
    draw.ellipse((cx + S(24), cy - S(40), cx + S(100), cy + S(36)), fill=ANT)
    for sy in (-1, 1):
        draw.line([(cx + S(84), cy - S(26)), (cx + S(120), cy - S(80) + sy * S(14)), (cx + S(150), cy - S(76) + sy * S(30))],
                  fill=ANT, width=max(2, int(S(6))), joint="curve")
    draw.ellipse((cx + S(66), cy - S(20), cx + S(84), cy - S(2)), fill=WHITE)
    draw.ellipse((cx + S(72), cy - S(14), cx + S(80), cy - S(6)), fill=K.DEV_DEEP)


def open_book(draw, cx, cy, wd, ht, panel):
    x0, y0, x1, y1 = cx - wd / 2, cy - ht / 2, cx + wd / 2, cy + ht / 2
    draw.rounded_rectangle((x0 - 10, y0 + 18, x1 + 30, y1 + 30), radius=22, fill=K.SHADOW)
    draw.rounded_rectangle((x0 - 18, y0 + 10, x1 + 18, y1 + 20), radius=22, fill=BOOK)
    draw.rounded_rectangle((x0, y0, cx - 3, y1), radius=16, fill=panel)
    draw.rounded_rectangle((cx + 3, y0, x1, y1), radius=16, fill=panel)
    draw.line((cx, y0 + 4, cx, y1), fill=BOOK_DARK, width=6)


def closed_book(draw, cx, cy, s, label="BOOK"):
    S = S_(s)
    draw.rounded_rectangle((cx - S(80) + S(8), cy - S(100) + S(10), cx + S(80) + S(8), cy + S(100) + S(10)),
                           radius=S(12), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(80), cy - S(100), cx + S(80), cy + S(100)), radius=S(12), fill=BOOK)
    draw.rectangle((cx + S(60), cy - S(96), cx + S(74), cy + S(96)), fill=(236, 230, 220))
    draw.rounded_rectangle((cx - S(60), cy - S(50), cx + S(46), cy - S(6)), radius=S(8), fill=WHITE)
    K.text_at(draw, label, cx - S(7), cy - S(46), K.load_font(max(10, int(S(28))), bold=True), BOOK_DARK)


def dragon(draw, cx, cy, s, t=0.0):
    S = S_(s)
    draw.polygon([(cx - S(70), cy + S(20)), (cx - S(170), cy + S(70)), (cx - S(190), cy + S(40)),
                  (cx - S(70), cy - S(10))], fill=DRAGON)
    draw.polygon([(cx - S(190), cy + S(40)), (cx - S(224), cy + S(20)), (cx - S(200), cy + S(66))], fill=K.GOLD)
    draw.polygon([(cx - S(30), cy - S(30)), (cx - S(100), cy - S(130) - S(10) * math.sin(t * 8)),
                  (cx + S(20), cy - S(70))], fill=(170, 220, 170))
    draw.ellipse((cx - S(90), cy - S(46), cx + S(70), cy + S(70)), fill=DRAGON)
    for k in range(4):
        sx = cx - S(70) + k * S(34)
        draw.polygon([(sx, cy - S(36) + k * S(2)), (sx + S(16), cy - S(70)), (sx + S(30), cy - S(36))], fill=K.GOLD)
    for lx in (cx - S(50), cx + S(30)):
        draw.rounded_rectangle((lx - S(16), cy + S(50), lx + S(16), cy + S(96)), radius=S(10), fill=DRAGON_DARK)
    draw.ellipse((cx + S(30), cy - S(120), cx + S(140), cy - S(30)), fill=DRAGON)
    draw.ellipse((cx + S(88), cy - S(98), cx + S(114), cy - S(72)), fill=WHITE)
    draw.ellipse((cx + S(98), cy - S(90), cx + S(110), cy - S(78)), fill=K.DEV_DEEP)
    draw.arc((cx + S(80), cy - S(70), cx + S(134), cy - S(42)), 20, 140, fill=DRAGON_DARK, width=max(2, int(S(5))))
    for k in range(3):
        fx = cx + S(160) + k * S(30)
        r = S(16) + k * S(4) + S(3) * math.sin(t * 12 + k)
        draw.ellipse((fx - r, cy - S(70) - r, fx + r, cy - S(70) + r), fill=K.GOLD if k % 2 else K.CORAL)


def doormat(draw, cx, cy, s, key=True):
    S = S_(s)
    if key:
        K.draw_key(draw, cx - S(176), cy + S(18), 0.46 * s, K.GOLD)
    draw.rounded_rectangle((cx - S(180) + S(8), cy - S(60) + S(10), cx + S(180) + S(8), cy + S(60) + S(10)),
                           radius=S(16), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(180), cy - S(60), cx + S(180), cy + S(60)), radius=S(16), fill=MAT,
                           outline=MAT_DARK, width=max(2, int(S(5))))
    draw.rounded_rectangle((cx - S(158), cy - S(40), cx + S(158), cy + S(40)), radius=S(10), outline=MAT_DARK,
                           width=max(2, int(S(4))))
    K.text_at(draw, "WELCOME", cx, cy - S(24), K.load_font(max(10, int(S(40))), bold=True), MAT_DARK)


def gamepad(draw, cx, cy, s):
    S = S_(s)
    draw.rounded_rectangle((cx - S(90) + S(6), cy - S(46) + S(8), cx + S(90) + S(6), cy + S(46) + S(8)),
                           radius=S(40), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(90), cy - S(46), cx + S(90), cy + S(46)), radius=S(40), fill=K.DEV_DARK)
    draw.rectangle((cx - S(62), cy - S(8), cx - S(26), cy + S(8)), fill=WHITE)
    draw.rectangle((cx - S(52), cy - S(18), cx - S(36), cy + S(18)), fill=WHITE)
    draw.ellipse((cx + S(30), cy - S(22), cx + S(50), cy - S(2)), fill=K.CORAL)
    draw.ellipse((cx + S(52), cy - S(2), cx + S(72), cy + S(18)), fill=K.GOLD)


def train(draw, cx, cy, s, t=0.0):
    S = S_(s)
    draw.line((cx - S(200), cy + S(70), cx + S(170), cy + S(70)), fill=K.STEEL_DARK, width=max(2, int(S(6))))
    draw.rounded_rectangle((cx - S(196), cy - S(50), cx - S(30), cy + S(50)), radius=S(14), fill=K.BOT)
    for wx in (cx - S(160), cx - S(110), cx - S(60)):
        draw.rounded_rectangle((wx - S(18), cy - S(30), wx + S(18), cy), radius=S(5), fill=K.DEV_SCREEN)
    draw.rounded_rectangle((cx - S(20), cy - S(50), cx + S(130), cy + S(50)), radius=S(14), fill=K.CORAL)
    draw.polygon([(cx + S(130), cy - S(10)), (cx + S(170), cy + S(30)), (cx + S(170), cy + S(50)),
                  (cx + S(130), cy + S(50))], fill=K.CORAL)
    draw.rounded_rectangle((cx - S(10), cy - S(96), cx + S(70), cy - S(44)), radius=S(10), fill=K.DEV_DARK)
    draw.rounded_rectangle((cx + S(4), cy - S(86), cx + S(56), cy - S(56)), radius=S(5), fill=K.DEV_SCREEN)
    draw.rectangle((cx + S(90), cy - S(86), cx + S(112), cy - S(50)), fill=K.DEV_DARK)
    for k in range(2):
        r = S(10) + S(5) * k
        px = cx + S(100) + S(16) * k
        py = cy - S(104) - S(22) * k - S(6) * math.sin(t * 6 + k)
        draw.ellipse((px - r, py - r, px + r, py + r), fill=(220, 220, 226))
    for wx in (cx - S(160), cx - S(70), cx + S(20), cx + S(100)):
        draw.ellipse((wx - S(20), cy + S(40), wx + S(20), cy + S(80)), fill=K.DEV_DARK)
        draw.ellipse((wx - S(7), cy + S(53), wx + S(7), cy + S(67)), fill=K.STEEL)


def cake(draw, cx, cy, s, t=0.0):
    S = S_(s)
    draw.ellipse((cx - S(100), cy + S(60), cx + S(100), cy + S(90)), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(90), cy, cx + S(90), cy + S(76)), radius=S(14), fill=CAKE)
    draw.rounded_rectangle((cx - S(60), cy - S(56), cx + S(60), cy + S(4)), radius=S(12), fill=(255, 236, 242))
    for k in range(5):
        dx = cx - S(72) + k * S(36)
        draw.ellipse((dx - S(12), cy - S(6), dx + S(12), cy + S(18)), fill=K.CORAL)
    draw.rounded_rectangle((cx - S(6), cy - S(100), cx + S(6), cy - S(56)), radius=S(3), fill=K.BOT)
    fh = S(16) + S(4) * math.sin(t * 20)
    draw.polygon([(cx - S(9), cy - S(100)), (cx + S(9), cy - S(100)), (cx, cy - S(100) - fh)], fill=K.GOLD)


def bowl(draw, cx, cy, s):
    S = S_(s)
    draw.chord((cx - S(50), cy - S(40), cx + S(50), cy + S(40)), 0, 180, fill=K.CORAL)
    draw.rectangle((cx - S(52), cy - S(4), cx + S(52), cy + S(4)), fill=(200, 80, 20))
    for k in range(3):
        bx = cx - S(26) + k * S(26)
        draw.line((bx, cy - S(6), bx + S(10), cy - S(40)), fill=BAMBOO, width=max(2, int(S(8))))


def chat_window(draw, brand, box, msgs, reveal=1.0, t=0.0, size=34, typing=False, typed=1.0):
    """msgs: (side 'me'|'bot'|'bad', text). Returns the y below the last bubble."""
    ink = K.hex_rgb(brand["ink"])
    panel = K.hex_rgb(brand["panel"])
    coral = K.hex_rgb(brand["coral"])
    line = K.hex_rgb(brand["line"])
    muted = K.hex_rgb(brand["muted"])
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=44, fill=K.SHADOW)
    draw.rounded_rectangle((x0, y0, x1, y1), radius=44, fill=K.DEV_DARK)
    sx0, sy0, sx1, sy1 = x0 + 16, y0 + 16, x1 - 16, y1 - 16
    draw.rounded_rectangle((sx0, sy0, sx1, sy1), radius=32, fill=CHAT_BG)
    draw.rounded_rectangle((sx0, sy0, sx1, sy0 + 88), radius=32, fill=panel)
    draw.rectangle((sx0, sy0 + 50, sx1, sy0 + 88), fill=panel)
    draw.line((sx0, sy0 + 88, sx1, sy0 + 88), fill=line, width=3)
    pip(draw, sx0 + 54, sy0 + 48, 26, t)
    draw.text((sx0 + 96, sy0 + 10), "Pip", fill=ink, font=K.load_font(32, bold=True))
    draw.text((sx0 + 96, sy0 + 48), "chat helper", fill=muted, font=K.load_font(26))
    font = K.load_font(size, bold=True)
    lh = int(size * 1.25)
    max_w = int((sx1 - sx0) * 0.78)
    y = sy0 + 118
    for i, (side, text) in enumerate(msgs):
        a = K.stagger(reveal, i, step=0.22, speed=4)
        if a <= 0:
            continue
        if i == len(msgs) - 1 and typed < 1.0:
            text = text[: int(round(len(text) * K.clamp01(typed)))] or " "
        lines = K.wrap_text(text, font, max_w - 48)
        tw = max(draw.textbbox((0, 0), ln, font=font)[2] for ln in lines)
        bw, bh = tw + 48, len(lines) * lh + 28
        bx = sx1 - 28 - bw if side == "me" else sx0 + 28
        by = y + (1 - a) * 24
        if side == "me":
            fill, fg, out = coral, WHITE, None
        elif side == "bad":
            fill, fg, out = K.DANGER_SOFT, ink, K.DANGER
        else:
            fill, fg, out = panel, ink, line
        draw.rounded_rectangle((bx, by, bx + bw, by + bh), radius=24, fill=fill, outline=out, width=3 if out else 0)
        for j, ln in enumerate(lines):
            draw.text((bx + 24, by + 14 + j * lh), ln, fill=fg, font=font)
        y += bh + 22
    if typing:
        draw.rounded_rectangle((sx0 + 28, y, sx0 + 140, y + 60), radius=24, fill=panel, outline=line, width=3)
        for k in range(3):
            on = int(t * 12 + k) % 3 == 0
            draw.ellipse((sx0 + 52 + k * 26, y + 22, sx0 + 68 + k * 26, y + 38), fill=muted if on else line)
    return y


def render(draw, brand, visual, focus, progress, w, h) -> bool:
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
    font = K.load_font

    def stars_around(y, spread, n=6):
        for i in range(n):
            side = -1 if i % 2 == 0 else 1
            sx = cx + side * (spread + 80 * (i // 2))
            sy = y + 90 * (i // 2) + 14 * math.sin(progress * 9 + i)
            K.draw_star(draw, sx, sy, 22 + 6 * pulse, [coral, sage, K.BOTH_COLOR, K.GOLD][i % 4], rot=progress * 3 + i)

    def star_spots(spots):
        for k, (sx, sy) in enumerate(spots):
            K.draw_star(draw, sx, sy + 10 * math.sin(progress * 9 + k), 22 + 6 * pulse,
                        [coral, sage, K.BOTH_COLOR, K.GOLD][k % 4], rot=progress * 3 + k)

    def question_marks(spots, size=84):
        for k, (qx, qy) in enumerate(spots):
            K.text_at(draw, "?", qx, qy, font(int(size + 22 * (pulse if k % 2 else 1 - pulse)), bold=True), K.GOLD)

    def dashed_box(bx, color, width=5):
        x0, y0, x1, y1 = bx
        ph = progress * 120
        K.draw_dashed(draw, x0 + 30, y0, x1 - 30, y0, color, width=width, phase=ph)
        K.draw_dashed(draw, x0 + 30, y1, x1 - 30, y1, color, width=width, phase=ph)
        K.draw_dashed(draw, x0, y0 + 30, x0, y1 - 30, color, width=width, phase=ph)
        K.draw_dashed(draw, x1, y0 + 30, x1, y1 - 30, color, width=width, phase=ph)
        for ax, ay, a0 in ((x0, y0, 180), (x1 - 60, y0, 270), (x1 - 60, y1 - 60, 0), (x0, y1 - 60, 90)):
            draw.arc((ax, ay, ax + 60, ay + 60), a0, a0 + 90, fill=color, width=width)

    def label_lines(lines, x, y, size=36, col=None, gap=1.22):
        f = font(size, bold=True)
        for j, ln in enumerate(lines):
            K.text_at(draw, ln, x, y + j * int(size * gap), f, col or ink)

    def sofa():
        draw.rounded_rectangle((150 + 8, 450 + 10, 790 + 8, 720 + 10), radius=50, fill=K.SHADOW)
        draw.rounded_rectangle((150, 450, 790, 720), radius=50, fill=SOFA)

    def sofa_front():
        draw.rounded_rectangle((120, 650, 820, 780), radius=36, fill=SOFA_DARK)
        for ax in (120, 740):
            draw.rounded_rectangle((ax, 560, ax + 80, 790), radius=36, fill=SOFA_DARK)

    def badge(box, title, col, soft, icon, sub=None):
        x0, y0, x1, y1 = box
        draw.rounded_rectangle((x0 + 8, y0 + 10, x1 + 8, y1 + 10), radius=36, fill=K.SHADOW)
        draw.rounded_rectangle(box, radius=36, fill=soft, outline=col, width=5)
        icon(x0 + 90, (y0 + y1) / 2)
        if sub:
            draw.text((x0 + 170, y0 + (y1 - y0) / 2 - 50), title, fill=col, font=font(40, bold=True))
            draw.text((x0 + 170, y0 + (y1 - y0) / 2 + 4), sub, fill=ink, font=font(32, bold=True))
        else:
            draw.text((x0 + 170, (y0 + y1) / 2 - 24), title, fill=col, font=font(40, bold=True))

    # ---- opening ------------------------------------------------------------
    if visual == "b13-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 280), 460, 110, sage, panel, bounce)
            pip(draw, cx + 260, 480, 120, t)
            K.draw_bubble(draw, (cx + 400, 250, cx + 620, 350), brand, "Hi!", tail="left", size=48)
            K.text_at(draw, "Welcome back, champ!", cx, 730, font(60, bold=True), ink)
            star_spots([(460, 330), (560, 620), (1500, 600), (1660, 420)])
            return True
        if focus == "bridge":
            K.shadow_card(draw, (300, 250 + lift, w - 300, 840 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · CAN COMPUTERS LISTEN?", cx, 326 + lift, font(34, bold=True), sage)
            specs = [("HEAR", coral, coral_soft), ("WORDS", K.BOTH_COLOR, lav_soft), ("MATCH", sage, sage_soft)]
            for i, (lab, col, soft) in enumerate(specs):
                a = K.stagger(progress, i, step=0.16, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 380
                y = 510 + int((1 - a) * 40)
                draw.ellipse((x - 105, y - 105, x + 105, y + 105), fill=soft)
                if i == 0:
                    K.draw_device(draw, "mic", x - 20, y, 0.62, brand)
                    K.sound_waves(draw, x + 30, y - 30, 0.8, coral, t)
                elif i == 1:
                    draw.rounded_rectangle((x - 80, y - 46, x + 80, y + 46), radius=22, fill=panel, outline=K.BOTH_COLOR,
                                           width=4)
                    K.text_at(draw, "Hi!", x, y - 30, font(48, bold=True), K.BOTH_COLOR)
                else:
                    for k in range(9):
                        r_, c_ = divmod(k, 3)
                        col_ = [coral, sage, K.GOLD][(r_ + c_) % 3]
                        px, py = x - 50 + c_ * 50, y - 50 + r_ * 50
                        draw.ellipse((px - 17, py - 17, px + 17, py + 17), fill=col_)
                K.text_at(draw, lab, x, y + 124, font(36, bold=True), col)
                if i < 2:
                    K.draw_arrow(draw, x + 122, y, x + 258, y, muted, width=8, head=22)
            a = K.stagger(progress, 4, step=0.12, speed=4)
            if a > 0:
                K.pill(draw, cx, 730 + int((1 - a) * 20), "Sound → Words → Patterns", coral, size=36)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (260, 240 + lift, w - 260, 500 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 3 OF 5", cx, 300 + lift, font(32, bold=True), coral)
            K.text_at(draw, "Chatting With Computers", cx, 360 + lift, font(84, bold=True), ink)
            msgs = [(cx + 120, 580, "Hi Pip!", True), (cx - 120, 680, "Hello! How can I help?", False)]
            for i, (bx, by, txt, me) in enumerate(msgs):
                a = K.stagger(progress, i + 2, step=0.14, speed=4)
                if a <= 0:
                    continue
                f = font(40, bold=True)
                tw = draw.textbbox((0, 0), txt, font=f)[2]
                yy = by + int((1 - a) * 30)
                x0 = bx - tw / 2 - 30
                draw.rounded_rectangle((x0, yy, x0 + tw + 60, yy + 76), radius=30, fill=coral if me else panel,
                                       outline=None if me else line, width=0 if me else 3)
                draw.text((x0 + 30, yy + 14), txt, fill=WHITE if me else ink, font=f)
            a = K.stagger(progress, 2, step=0.14, speed=4)
            if a > 0:
                anaya(draw, cx + 470, 640 + int((1 - a) * 30), 0.75, t)
                pip(draw, cx - 560, 690 + int((1 - a) * 30), 74, t)
            return True
        # word
        K.draw_device(draw, "keyboard", 420, 690, 0.9, brand)
        rows = [("me", "Why is the sky blue?", 320), ("bot", "Sunlight bounces off tiny bits of air!", 450)]
        for i, (side, txt, y) in enumerate(rows):
            a = K.stagger(progress, i, step=0.2, speed=4)
            if a <= 0:
                continue
            f = font(40, bold=True)
            tw = draw.textbbox((0, 0), txt, font=f)[2]
            yy = y + int((1 - a) * 30)
            x0 = 1500 - tw - 60 if side == "me" else 420
            draw.rounded_rectangle((x0, yy, x0 + tw + 60, yy + 80), radius=30, fill=coral if side == "me" else panel,
                                   outline=None if side == "me" else line, width=0 if side == "me" else 3)
            draw.text((x0 + 30, yy + 16), txt, fill=WHITE if side == "me" else ink, font=f)
            if side == "bot":
                pip(draw, 330, yy + 40, 40, t)
        a = K.stagger(progress, 3, step=0.14, speed=4)
        if a > 0:
            K.text_at(draw, "How does it decide?", 1220, 640, font(58, bold=True), muted)
            question_marks([(1660, 600), (1760, 700)], size=70)
        return True

    # ---- Anaya and Pip ---------------------------------------------------------
    if visual == "b13-hook":
        if focus == "meet":
            draw.ellipse((560 - 290, 560 - 290, 560 + 290, 560 + 290), fill=coral_soft)
            anaya(draw, 560, 500, 1.5, t)
            K.text_at(draw, "Meet", 1320, 290 + lift, font(60, bold=True), muted)
            K.text_at(draw, "Anaya!", 1320, 360 + lift, font(130, bold=True), coral)
            a = K.stagger(progress, 2, step=0.12, speed=4)
            if a > 0:
                yy = int((1 - a) * 30)
                K.shadow_card(draw, (1110, 560 + yy, 1530, 850 + yy), brand, radius=28, accent=sage)
                K.text_at(draw, "PANDA PROJECT", 1320, 588 + yy, font(30, bold=True), sage)
                panda(draw, 1320, 740 + yy, 0.42, t)
            star_spots([(1060, 330), (1590, 320), (1620, 560)])
            return True
        if focus in ("ask", "reply"):
            sofa()
            K.draw_person(draw, 320, 480, 1.05, "dad", t)
            anaya(draw, 580, 520, 1.1, t)
            sofa_front()
            K.text_at(draw, "Papa", 320, 800, font(32, bold=True), muted)
            if focus == "ask":
                chat_window(draw, brand, (960, 250, 1720, 860), [("me", "What do pandas eat?")],
                            typed=K.clamp01(progress * 1.8), t=t)
            else:
                chat_window(draw, brand, (960, 250, 1720, 860),
                            [("me", "What do pandas eat?"), ("bot", "Pandas mostly eat bamboo!")],
                            reveal=0.22 + progress, t=t)
                a = K.stagger(progress, 3, step=0.12, speed=4)
                if a > 0:
                    panda(draw, 1340, 680 + int((1 - a) * 30), 0.52, t)
            return True
        if focus == "why":
            x0, y0, x1, y1 = 620, 270, 1300, 830
            draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=48, fill=K.SHADOW)
            draw.rounded_rectangle((x0, y0, x1, y1), radius=48, fill=K.DEV_DARK)
            draw.rounded_rectangle((x0 + 24, y0 + 24, x1 - 24, y1 - 24), radius=30, fill=CHAT_BG)
            K.draw_person(draw, 960, 540, 1.0, "mystery", t)
            kx = 960
            draw.rounded_rectangle((kx - 160, 690, kx + 160, 750), radius=12, fill=K.DEV_MID)
            for r_ in range(2):
                for c_ in range(8):
                    on = int(t * 20 + c_ + r_ * 3) % 5 == 0
                    draw.rounded_rectangle((kx - 148 + c_ * 37, 698 + r_ * 26, kx - 120 + c_ * 37, 718 + r_ * 26),
                                           radius=4, fill=K.GOLD if on else K.DEV_KEY)
            question_marks([(420, 330), (1500, 300), (450, 600), (1490, 580)], size=96)
            K.draw_stopwatch(draw, 1640, 780, 46, progress, brand)
            return True
        # truth
        K.shadow_card(draw, (200, 300, 760, 800), brand, radius=36, outline=K.DANGER, outline_w=5)
        K.draw_person(draw, 480, 500, 1.2, "mystery", 0)
        a = K.stagger(progress, 1, step=0.12, speed=5)
        if a > 0:
            K.draw_cross(draw, 660, 380, 44 * a, K.DANGER)
        K.text_at(draw, "Tiny person?", 480, 700, font(46, bold=True), K.DANGER)
        K.draw_arrow(draw, 800, 550, 1000, 550, muted, width=10, head=30)
        draw.ellipse((1300 - 230, 530 - 230, 1300 + 230, 530 + 230), fill=sage_soft)
        pip(draw, 1300, 540, 150, t)
        K.pill(draw, 1300, 790, "Pip is a chatbot!", sage, size=40)
        return True

    # ---- what is a chatbot -----------------------------------------------------
    if visual == "b13-define":
        if focus == "name":
            draw.ellipse((420 - 250, 560 - 250, 420 + 250, 560 + 250), fill=sage_soft)
            pip(draw, 420, 590, 160, t)
            K.shadow_card(draw, (780, 260 + lift, 1780, 840 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "A CHATBOT is…", 1280, 330 + lift, font(44, bold=True), muted)
            parts = [("a computer program", coral), ("that chats with you", ink), ("by typing replies", sage)]
            for i, (txt, col) in enumerate(parts):
                a = K.stagger(progress, i, step=0.2, speed=4)
                if a <= 0:
                    continue
                K.text_at(draw, txt, 1280, 440 + i * 120 + lift + int((1 - a) * 30), font(66, bold=True), col)
            return True
        if focus == "where":
            specs = [("Homework help", coral_soft), ("Game help", lav_soft), ("Train tickets", blue_soft)]
            cw, gap = 520, 40
            x_start = cx - (3 * cw + 2 * gap) / 2
            for i, (title, soft) in enumerate(specs):
                a = K.stagger(progress, i, step=0.2, speed=4)
                if a <= 0:
                    continue
                x0 = x_start + i * (cw + gap)
                yy = int((1 - a) * 40)
                K.shadow_card(draw, (x0, 260 + yy, x0 + cw, 840 + yy), brand, radius=36)
                ib = (x0 + 24, 284 + yy, x0 + cw - 24, 640 + yy)
                draw.rounded_rectangle(ib, radius=26, fill=soft)
                mx = x0 + cw / 2
                if i == 0:
                    open_book(draw, mx - 20, 500 + yy, 300, 170, panel)
                    for k in range(3):
                        draw.rounded_rectangle((mx - 150, 450 + yy + k * 36, mx - 50, 462 + yy + k * 36), radius=6,
                                               fill=line)
                    draw.line((mx + 60, 600 + yy, mx + 150, 440 + yy), fill=K.GOLD, width=18)
                    draw.polygon([(mx + 52, 596 + yy), (mx + 68, 606 + yy), (mx + 50, 624 + yy)], fill=K.DEV_DARK)
                elif i == 1:
                    gamepad(draw, mx - 20, 520 + yy, 1.4)
                    draw.ellipse((mx + 120, 400 + yy, mx + 190, 470 + yy), fill=K.BOTH_COLOR)
                    K.text_at(draw, "?", mx + 155, 404 + yy, font(48, bold=True), WHITE)
                else:
                    train(draw, mx + 10, 520 + yy, 0.95, t)
                pip(draw, x0 + 70, 340 + yy, 30, t)
                draw.rounded_rectangle((x0 + 110, 312 + yy, x0 + 250, 362 + yy), radius=22, fill=panel, outline=line,
                                       width=3)
                for k in range(3):
                    draw.ellipse((x0 + 140 + k * 30, 330 + yy, x0 + 154 + k * 30, 344 + yy), fill=muted)
                K.text_at(draw, title, mx, 690 + yy, font(48, bold=True), ink)
                K.pill(draw, mx, 765 + yy, "has a chatbot", sage, size=28)
            return True
        # not
        K.draw_device(draw, "laptop", 520, 560, 1.5, brand, t=t)
        ix0, iy0 = 520 - 220, 560 - 156
        for k, (wd, col) in enumerate(((260, coral), (180, K.BOTH_COLOR), (300, sage), (140, coral), (220, K.ROAD))):
            yy = iy0 + 26 + k * 40
            indent = 40 if k in (1, 2, 4) else 0
            draw.rounded_rectangle((ix0 + 20 + indent, yy, ix0 + 20 + indent + wd * 0.8, yy + 18), radius=9, fill=col)
        pip(draw, 520 + 150, 560 - 40, 40, t)
        K.pill(draw, 520, 780, "just code", K.DEV_MID, size=30)
        rows = [("A program", sage, True), ("Not a person", K.DANGER, False), ("Not magic", K.DANGER, False)]
        for i, (lab, col, ok) in enumerate(rows):
            a = K.stagger(progress, i, step=0.2, speed=4)
            if a <= 0:
                continue
            y = 290 + i * 170 + int((1 - a) * 30)
            draw.rounded_rectangle((1000, y, 1760, y + 130), radius=40, fill=sage_soft if ok else K.DANGER_SOFT,
                                   outline=col, width=5)
            (K.draw_check if ok else K.draw_cross)(draw, 1070, y + 65, 36, col)
            draw.text((1130, y + 36), lab, fill=ink, font=font(54, bold=True))
        return True

    # ---- how a chatbot picks a reply ---------------------------------------------
    if visual == "b13-how":
        if focus == "keys":
            f = font(80, bold=True)
            sent = "What do pandas eat?"
            tw = draw.textbbox((0, 0), sent, font=f)[2]
            sx = cx - tw / 2
            draw.rounded_rectangle((sx - 60 + 8, 270 + 10, sx + tw + 60 + 8, 420 + 10), radius=40, fill=K.SHADOW)
            draw.rounded_rectangle((sx - 60, 270, sx + tw + 60, 420), radius=40, fill=panel, outline=ink, width=4)
            spans = []
            for k, word in enumerate(("pandas", "eat")):
                pre = sent[: sent.index(word)]
                x0 = sx + draw.textbbox((0, 0), pre, font=f)[2]
                x1 = sx + draw.textbbox((0, 0), pre + word, font=f)[2]
                spans.append((x0, x1))
                a = K.stagger(progress, k + 1, step=0.18, speed=5)
                if a > 0:
                    draw.rounded_rectangle((x0 - 10, 296, x0 - 10 + (x1 - x0 + 20) * a, 398), radius=16,
                                           fill=(255, 226, 150))
            draw.text((sx, 296), sent, fill=ink, font=f)
            pip(draw, cx, 730, 80, t, mood="think")
            for k, ((x0, x1), lab) in enumerate(zip(spans, ("pandas", "eat"))):
                a = K.stagger(progress, k + 3, step=0.14, speed=4)
                if a <= 0:
                    continue
                chip_x = cx + (k * 2 - 1) * 400
                yy = 520 + int((1 - a) * 30)
                draw.rounded_rectangle((chip_x - 170, yy, chip_x + 170, yy + 110), radius=55, fill=sage_soft,
                                       outline=sage, width=4)
                if k == 0:
                    panda_head(draw, chip_x - 95, yy + 62, 0.36)
                else:
                    bowl(draw, chip_x - 95, yy + 50, 0.7)
                draw.text((chip_x - 40, yy + 28), lab, fill=sage, font=font(46, bold=True))
                K.draw_arrow(draw, (x0 + x1) / 2, 430, chip_x, yy - 6, line, width=6, head=18)
                K.draw_arrow(draw, chip_x + (1 - 2 * k) * 120, yy + 120, cx + (k * 2 - 1) * 110, 700, muted, width=8,
                             head=24)
            return True
        if focus == "patterns":
            sents = ["Pandas eat bamboo.", "The panda ate bamboo.", "Pandas eat lots of bamboo.",
                     "Baby pandas eat bamboo too."]
            f = font(40, bold=True)
            for i, s_ in enumerate(sents):
                a = K.stagger(progress, i, step=0.12, speed=4)
                if a <= 0:
                    continue
                y = 270 + i * 140 + int((1 - a) * 30)
                x0 = 140 + (i % 2) * 40
                draw.rounded_rectangle((x0 + 6, y + 8, x0 + 760 + 6, y + 110 + 8), radius=24, fill=K.SHADOW)
                draw.rounded_rectangle((x0, y, x0 + 760, y + 110), radius=24, fill=panel, outline=line, width=3)
                pre = s_[: s_.index("bamboo")]
                bx0 = x0 + 36 + draw.textbbox((0, 0), pre, font=f)[2]
                bx1 = x0 + 36 + draw.textbbox((0, 0), pre + "bamboo", font=f)[2]
                if progress > 0.45:
                    draw.rounded_rectangle((bx0 - 6, y + 26, bx1 + 6, y + 84), radius=12, fill=(214, 240, 196))
                draw.text((x0 + 36, y + 30), s_, fill=ink, font=f)
            K.text_at(draw, "lots of examples", 520, 836, font(30, bold=True), muted)
            a = K.stagger(progress, 4, step=0.12, speed=4)
            if a > 0:
                K.draw_arrow(draw, 960, 540, 960 + 150 * a, 540, muted, width=10, head=30)
            draw.ellipse((1380 - 220, 500 - 220, 1380 + 220, 500 + 220), fill=sage_soft)
            pip(draw, 1380, 520, 130, t, mood="think")
            a = K.stagger(progress, 5, step=0.12, speed=4)
            if a > 0:
                K.pill(draw, 1380, 760 + int((1 - a) * 20), "pandas + eat → bamboo", sage, size=38)
            return True
        if focus == "predict":
            draw.rounded_rectangle((330 + 8, 250 + 10, 1590 + 8, 390 + 10), radius=36, fill=K.SHADOW)
            draw.rounded_rectangle((330, 250, 1590, 390), radius=36, fill=panel, outline=ink, width=4)
            f = font(64, bold=True)
            draw.text((400, 280), "Pandas mostly eat", fill=ink, font=f)
            bx = 400 + draw.textbbox((0, 0), "Pandas mostly eat ", font=f)[2]
            K.draw_dashed(draw, bx, 360, bx + 300, 360, coral, width=6, phase=t * 100)
            if progress > 0.7:
                draw.text((bx, 280), "bamboo", fill=sage, font=f)
            pip(draw, 250, 640, 96, t, mood="think")
            opts = [("bamboo", 0.9, sage), ("pizza", 0.07, K.STEEL_DARK), ("shoes", 0.03, K.STEEL_DARK)]
            for i, (lab, v, col) in enumerate(opts):
                a = K.stagger(progress, i, step=0.12, speed=3)
                y = 450 + i * 130
                draw.text((450, y + 14), lab, fill=ink, font=font(48, bold=True))
                draw.rounded_rectangle((720, y + 10, 1560, y + 80), radius=35, fill=(240, 234, 226))
                ln = max(70, 840 * v * a)
                draw.rounded_rectangle((720, y + 10, 720 + ln, y + 80), radius=35, fill=col)
                if i == 0 and progress > 0.6:
                    K.draw_check(draw, 1620, y + 45, 32, sage)
            return True
        if focus in ("try", "star"):
            anaya(draw, 330, 520, 1.15, t)
            K.draw_notes(draw, 480, 330, 0.8, t, coral)
            txt = "Twinkle, twinkle, little ___?" if focus == "try" else "Twinkle, twinkle, little star!"
            K.draw_bubble(draw, (590, 250, 1720, 420), brand, txt, tail="left", size=56)
            bx = (760, 520, 1160, 820)
            if focus == "try":
                draw.rounded_rectangle(bx, radius=40, fill=coral_soft)
                dashed_box(bx, coral)
                K.text_at(draw, "?", 960, 560, font(int(160 + 24 * pulse), bold=True), coral)
                K.draw_stopwatch(draw, 1460, 680, 60, progress, brand)
            else:
                draw.rounded_rectangle(bx, radius=40, fill=sage_soft, outline=sage, width=6)
                K.draw_star(draw, 960, 680, 120 * K.ease_out_cubic(K.clamp01(progress * 3)), K.GOLD, rot=0.0)
                K.pill(draw, 1480, 620, "You predicted it!", sage, size=38)
                star_spots([(1300, 760), (1700, 760), (640, 600)])
            return True

    # ---- chat tree ------------------------------------------------------------------
    if visual == "b13-tree":
        if focus == "intro":
            draw.polygon([(cx - 50, 860), (cx + 50, 860), (cx + 24, 600), (cx - 24, 600)], fill=TRUNK)
            for ex, ey in ((560, 510), (cx, 460), (1360, 510)):
                K.draw_curve(draw, (cx, 660), ((cx + ex) / 2, (ey + 660) / 2 + 60), (ex, ey + 70), TRUNK, width=22)
            draw.ellipse((cx - 300, 820, cx + 300, 876), fill=(214, 236, 200))
            leaves = [(560, 510, "Hi!", "Hello there!"), (cx, 460, "Thanks!", "You're welcome!"),
                      (1360, 510, "Bye!", "See you soon!")]
            for i, (lx, ly, said, reply) in enumerate(leaves):
                a = K.stagger(progress, i + 1, step=0.16, speed=4)
                if a <= 0:
                    continue
                yy = ly + int((1 - a) * 30)
                draw.ellipse((lx - 200, yy - 150, lx + 200, yy + 110), fill=(214, 236, 200))
                f = font(32, bold=True)
                tw1 = draw.textbbox((0, 0), said, font=f)[2]
                tw2 = draw.textbbox((0, 0), reply, font=f)[2]
                draw.rounded_rectangle((lx + 150 - tw1 - 40, yy - 120, lx + 150, yy - 60), radius=26, fill=coral)
                draw.text((lx + 150 - tw1 - 20, yy - 110), said, fill=WHITE, font=f)
                draw.rounded_rectangle((lx - 160, yy - 40, lx - 160 + tw2 + 40, yy + 20), radius=26, fill=panel,
                                       outline=line, width=3)
                draw.text((lx - 140, yy - 30), reply, fill=ink, font=f)
            K.pill(draw, cx, 226, "If the user says THIS → reply with THAT", K.BOTH_COLOR, size=34)
            return True
        # bored / branches: a vertical tree
        def node(bx, text, kind, a=1.0, ghost=False):
            x0, y0, x1, y1 = bx
            yy = int((1 - a) * 24)
            if ghost:
                draw.rounded_rectangle((x0, y0, x1, y1), radius=30, fill=(246, 241, 233))
                dashed_box((x0, y0, x1, y1), line, width=4)
                return
            if kind == "me":
                draw.rounded_rectangle((x0, y0 + yy, x1, y1 + yy), radius=30, fill=coral)
                f = font(38, bold=True)
                K.text_at(draw, text, (x0 + x1) / 2, (y0 + y1) / 2 - 24 + yy, f, WHITE)
            else:
                draw.rounded_rectangle((x0 + 6, y0 + 8 + yy, x1 + 6, y1 + 8 + yy), radius=30, fill=K.SHADOW)
                draw.rounded_rectangle((x0, y0 + yy, x1, y1 + yy), radius=30, fill=panel, outline=sage, width=4)
                pip(draw, x0 + 56, (y0 + y1) / 2 + yy + 4, 28, t)
                f = font(36, bold=True)
                K.text_at(draw, text, (x0 + 100 + x1) / 2, (y0 + y1) / 2 - 23 + yy, f, ink)

        branches = focus == "branches"
        node((700, 240, 1220, 330), "I feel bored.", "me")
        K.draw_arrow(draw, cx, 336, cx, 394, muted, width=8, head=22)
        a2 = 1.0 if branches else K.stagger(progress, 1, step=0.2, speed=4)
        if a2 > 0:
            node((560, 400, 1360, 500), "Want a fun animal fact?", "bot", a2)
        ay = K.stagger(progress, 0, step=0.2, speed=4) if branches else 0
        an = K.stagger(progress, 2, step=0.2, speed=4) if branches else 0
        for k, (lab, reply, cxk, a) in enumerate((("Yes!", "An octopus has three hearts!", 530, ay),
                                                   ("No.", "How about a riddle instead?", 1390, an))):
            K.draw_curve(draw, (cx + (k * 2 - 1) * 60, 506), (cxk, 520), (cxk, 556), line if a <= 0 else muted, width=6)
            node((cxk - 140, 560, cxk + 140, 640), lab, "me", a, ghost=a <= 0)
            K.draw_arrow(draw, cxk, 646, cxk, 714, line if a <= 0 else muted, width=6, head=18)
            a4 = K.clamp01(a * 2 - 1) if branches else 0
            node((cxk - 380, 720, cxk + 380, 820), reply, "bot", a4, ghost=a4 <= 0)
        return True

    # ---- pick the better reply -----------------------------------------------------
    if visual == "b13-pick":
        ans = focus == "answer"
        K.draw_face(draw, 700, 285, 42, "kid", 1.0)
        draw.rounded_rectangle((770, 240, 1170, 330), radius=36, fill=coral)
        K.text_at(draw, "I feel bored.", 970, 262, font(42, bold=True), WHITE)
        opts = [("A", "“Want to hear a fun animal fact?”", "win"), ("B", "“The capital of France is Paris.”", "dim"),
                ("C", "“Please type your phone number.”", "bad"), ("D", "“Goodbye.”", "dim")]
        f = font(36, bold=True)
        for i, (letter, txt, st) in enumerate(opts):
            r_, c_ = divmod(i, 2)
            x0 = 230 + c_ * 750
            y0 = 390 + r_ * 190
            bx = (x0, y0, x0 + 710, y0 + 160)
            if ans and st == "win":
                K.shadow_card(draw, bx, brand, radius=30, outline=sage, outline_w=6)
                draw.rounded_rectangle((x0 + 6, y0 + 6, x0 + 704, y0 + 154), radius=26, fill=sage_soft)
                col = sage
            elif ans and st == "bad":
                K.shadow_card(draw, bx, brand, radius=30, outline=K.DANGER, outline_w=6)
                draw.rounded_rectangle((x0 + 6, y0 + 6, x0 + 704, y0 + 154), radius=26, fill=K.DANGER_SOFT)
                col = K.DANGER
            elif ans:
                draw.rounded_rectangle(bx, radius=30, fill=(246, 241, 233), outline=line, width=3)
                col = K.STEEL_DARK
            else:
                K.shadow_card(draw, bx, brand, radius=30)
                col = K.BOTH_COLOR
            draw.ellipse((x0 + 24, y0 + 44, x0 + 96, y0 + 116), fill=col)
            K.text_at(draw, letter, x0 + 60, y0 + 52, font(44, bold=True), WHITE)
            lines = K.wrap_text(txt, f, 540)
            ty = y0 + 80 - len(lines) * 23
            for j, ln in enumerate(lines):
                draw.text((x0 + 120, ty + j * 46), ln, fill=ink if not (ans and st == "dim") else muted, font=f)
            if ans and st == "win":
                K.draw_check(draw, x0 + 660, y0 + 40, 26, sage)
            if ans and st == "bad":
                K.draw_cross(draw, x0 + 660, y0 + 40, 26, K.DANGER)
        if ans:
            K.pill(draw, cx, 780, "Matches what they said, and it's safe!", sage, size=36)
        else:
            K.draw_stopwatch(draw, 1330, 290, 40, progress, brand)
        return True

    # ---- "I'm your best friend!" ----------------------------------------------------
    if visual == "b13-friend":
        if focus == "says":
            chat_window(draw, brand, (220, 250, 1000, 860),
                        [("me", "Thanks for the help, Pip!"), ("bot", "I'm your best friend!")], reveal=0.22 + progress,
                        t=t, size=36)
            anaya(draw, 1400, 500, 1.3, t)
            for k, (hx, hy) in enumerate(((1170, 330), (1640, 300), (1660, 560))):
                K.draw_heart(draw, hx, hy + 10 * math.sin(t * 8 + k), 30 + 6 * pulse, coral)
            K.text_at(draw, "Aww!", 1400, 760, font(56, bold=True), coral)
            return True
        if focus == "ask":
            draw.ellipse((520 - 210, 560 - 210, 520 + 210, 560 + 210), fill=sage_soft)
            pip(draw, 520, 570, 140, t)
            draw.ellipse((1400 - 210, 560 - 210, 1400 + 210, 560 + 210), fill=coral_soft)
            anaya(draw, 1400, 520, 1.2, t)
            K.draw_dashed(draw, 720, 560, 1180, 560, muted, width=6, phase=t * 120)
            K.draw_heart(draw, cx, 480, 50, coral)
            question_marks([(cx - 90, 330), (cx + 90, 310)], size=80)
            K.draw_stopwatch(draw, cx, 720, 50, progress, brand)
            return True
        if focus == "truth":
            draw.ellipse((360 - 210, 560 - 210, 360 + 210, 560 + 210), fill=sage_soft)
            pip(draw, 360, 580, 130, t, mood="think")
            words = ["I'm", "your", "best", "friend!"]
            for i, wd in enumerate(words):
                a = K.stagger(progress, i, step=0.1, speed=5)
                if a <= 0:
                    continue
                x = 680 + i * 290
                y = 290 + int((1 - a) * 30)
                draw.rounded_rectangle((x - 125, y, x + 125, y + 100), radius=26, fill=panel, outline=K.BOTH_COLOR,
                                       width=4)
                K.text_at(draw, wd, x, y + 24, font(44, bold=True), K.BOTH_COLOR)
                if i < 3:
                    K.draw_arrow(draw, x + 130, y + 50, x + 162, y + 50, muted, width=6, head=14)
            K.text_at(draw, "predicting one word at a time", 1115, 410, font(32, bold=True), muted)
            items = [((600, 500, 1140, 680), "No feelings", "heart"), ((1200, 500, 1780, 680), "Doesn't know you", "face")]
            for k, (bx, lab, kind) in enumerate(items):
                a = K.stagger(progress, k + 4, step=0.1, speed=4)
                if a <= 0:
                    continue

                def icon(x, y, kind=kind):
                    if kind == "heart":
                        K.draw_heart(draw, x, y, 46, coral)
                    else:
                        K.draw_face(draw, x, y + 6, 40, "kid", 1.0)
                    K.draw_cross(draw, x + 40, y - 40, 22, K.DANGER)
                badge(bx, lab, K.DANGER, K.DANGER_SOFT, icon)
            a = K.stagger(progress, 6, step=0.1, speed=4)
            if a > 0:
                K.pill(draw, 1190, 740 + int((1 - a) * 20), "Friendly words fit the pattern", sage, size=34)
            return True
        # real
        cards = [((140, 290, 820, 530), ("Can't come to", "your birthday"), "cake"),
                 ((140, 580, 820, 820), ("Won't keep", "your secrets"), "lock")]
        for k, (bx, lab, kind) in enumerate(cards):
            x0, y0, x1, y1 = bx
            draw.rounded_rectangle((x0 + 8, y0 + 10, x1 + 8, y1 + 10), radius=36, fill=K.SHADOW)
            draw.rounded_rectangle(bx, radius=36, fill=K.DANGER_SOFT, outline=K.DANGER, width=4)
            if kind == "cake":
                cake(draw, x0 + 130, y0 + 120, 0.85, t)
            else:
                K.draw_padlock(draw, x0 + 130, y0 + 110, 0.62, K.GOLD, open_t=0.6 + 0.4 * pulse)
            pip(draw, x0 + 210, y0 + 70, 24, t, mood="blank")
            draw.text((x0 + 260, y0 + 66), lab[0], fill=ink, font=font(40, bold=True))
            draw.text((x0 + 260, y0 + 120), lab[1], fill=K.DANGER, font=font(40, bold=True))
        draw.ellipse((940, 700, 1800, 790), fill=(214, 236, 200))
        people = [("friend", 1020), ("kid", 1190), ("nani", 1360), ("mom", 1530), ("dad", 1700)]
        for i, (kind, x) in enumerate(people):
            a = K.stagger(progress, i, step=0.1, speed=4)
            if a <= 0:
                continue
            if kind == "kid":
                anaya(draw, x, 600 + int((1 - a) * 30), 0.8, t)
            else:
                K.draw_person(draw, x, 600 + int((1 - a) * 30), 0.8, kind, t)
        for k, hx in enumerate((1105, 1445, 1615)):
            if progress > 0.4:
                K.draw_heart(draw, hx, 470 + 8 * math.sin(t * 8 + k), 24, coral)
        K.pill(draw, 1360, 300, "Real friends = real people", sage, size=38)
        return True

    # ---- chatbots can be wrong --------------------------------------------------------
    if visual == "b13-wrong":
        if focus == "ask":
            chat_window(draw, brand, (180, 250, 960, 860),
                        [("me", "How many legs does a spider have?"), ("bot", "A spider has six legs.")],
                        reveal=0.22 + progress, t=t, size=36)
            draw.ellipse((1380 - 260, 540 - 230, 1380 + 260, 540 + 230), fill=lav_soft)
            spider(draw, 1380, 520, 1.25, t)
            question_marks([(1110, 280), (1680, 300)], size=90)
            return True
        if focus == "check":
            draw.rounded_rectangle((180, 300, 820, 410), radius=30, fill=K.DANGER_SOFT, outline=K.DANGER, width=4)
            draw.text((220, 328), "A spider has six legs.", fill=ink, font=font(40, bold=True))
            K.draw_cross(draw, 820, 300, 30, K.DANGER)
            pip(draw, 500, 640, 110, t, mood="confused")
            open_book(draw, 1360, 555, 800, 540, panel)
            K.text_at(draw, "SPIDERS", 1160, 304, font(40, bold=True), BOOK)
            feet = spider(draw, 1360, 520, 1.05, 0.0)
            order = feet[:4] + feet[4:]
            for i, (fx, fy) in enumerate(order):
                a = K.stagger(progress, i, step=0.07, speed=6)
                if a <= 0:
                    continue
                side = -1 if i < 4 else 1
                nx, ny = fx + side * 34, fy
                draw.ellipse((nx - 22 * a, ny - 22 * a, nx + 22 * a, ny + 22 * a), fill=coral)
                if a > 0.6:
                    K.text_at(draw, str(i + 1), nx, ny - 17, font(28, bold=True), WHITE)
            if progress > 0.65:
                K.pill(draw, 1560, 300, "8 legs!", sage, size=38)
            return True
        if focus == "why":
            for k, lab in enumerate(("Lying?", "Sleepy?")):
                x = 640 + k * 640
                bx = K.pill(draw, x, 236, lab, K.STEEL_DARK, size=40)
                a = K.stagger(progress, k + 1, step=0.12, speed=5)
                if a > 0:
                    K.draw_cross(draw, bx[2] + 30, (bx[1] + bx[3]) / 2, 26 * a, K.DANGER)
            cards = [((180, 360, 860, 830), "Insects: 6 legs", coral_soft, coral),
                     ((1060, 360, 1740, 830), "Spiders: 8 legs", lav_soft, K.BOTH_COLOR)]
            for k, (bx, lab, soft, col) in enumerate(cards):
                a = K.stagger(progress, k + 3, step=0.12, speed=4)
                if a <= 0:
                    continue
                x0, y0, x1, y1 = bx
                yy = int((1 - a) * 30)
                draw.rounded_rectangle((x0, y0 + yy, x1, y1 + yy), radius=36, fill=soft, outline=col, width=5)
                if k == 0:
                    ant(draw, (x0 + x1) / 2 + 10, 560 + yy, 1.3, t)
                else:
                    spider(draw, (x0 + x1) / 2, 520 + yy, 1.0, t)
                K.text_at(draw, lab, (x0 + x1) / 2, 740 + yy, font(46, bold=True), col)
            pip(draw, cx, 560, 56, t, mood="confused")
            K.text_at(draw, "mixed up!", cx, 650, font(30, bold=True), K.DANGER)
            return True
        # tip
        K.draw_person(draw, 480, 470, 1.1, "dad", t)
        anaya(draw, 740, 520, 0.95, t)
        open_book(draw, 610, 760, 420, 150, panel)
        for k in range(3):
            draw.rounded_rectangle((430, 720 + k * 30, 580, 732 + k * 30), radius=6, fill=line)
        spider(draw, 720, 750, 0.32, t)
        K.shadow_card(draw, (1040, 270, 1760, 830), brand, radius=36, accent=coral)
        K.text_at(draw, "Big fact?", 1400, 304, font(44, bold=True), coral)
        rows = [("Ask a grown-up", "face"), ("Check a good book", "book")]
        for i, (lab, kind) in enumerate(rows):
            a = K.stagger(progress, i, step=0.2, speed=4)
            if a <= 0:
                continue
            y = 400 + i * 200 + int((1 - a) * 20)
            draw.rounded_rectangle((1080, y, 1720, y + 160), radius=32, fill=sage_soft, outline=sage, width=4)
            if kind == "face":
                K.draw_face(draw, 1160, y + 86, 46, "kid", 1.0)
            else:
                closed_book(draw, 1160, y + 80, 0.55, "FACTS")
            draw.text((1230, y + 52), lab, fill=ink, font=font(42, bold=True))
            K.draw_check(draw, 1680, y + 30, 22, sage)
        return True

    # ---- safe or unsafe to type -------------------------------------------------------
    items = [("panda", ("What do", "pandas eat?"), True), ("house", ("My home", "address"), False),
             ("dragon", ("A dragon", "story"), True), ("lock", ("My", "password"), False),
             ("school", ("My school", "name"), False), ("mat", ("Where the", "keys hide"), False)]

    def item_icon(kind, x, y):
        if kind == "panda":
            panda_head(draw, x, y + 20, 0.62)
        elif kind == "house":
            K.draw_house(draw, x, y + 10, 0.42, brand)
        elif kind == "dragon":
            dragon(draw, x - 10, y + 20, 0.5, t)
        elif kind == "lock":
            K.draw_padlock(draw, x, y + 10, 0.62, K.GOLD)
        elif kind == "school":
            K.draw_school(draw, x, y + 10, 0.44, brand)
        else:
            doormat(draw, x + 22, y + 30, 0.56)

    if visual == "b13-safe":
        if focus == "intro":
            chat_window(draw, brand, (580, 250, 1340, 850), [("bot", "Hi! Ask me anything.")], t=t, size=36)
            draw.rounded_rectangle((620, 740, 1300, 810), radius=35, fill=panel, outline=line, width=3)
            draw.text((656, 754), "Type a message…", fill=muted, font=font(32, bold=True))
            if int(t * 6) % 2 == 0:
                draw.line((1000, 754, 1000, 796), fill=coral, width=4)
            for k, (x, col, soft, lab) in enumerate(((310, sage, sage_soft, "SAFE"), (1610, K.DANGER, K.DANGER_SOFT, "PRIVATE"))):
                a = K.stagger(progress, k + 1, step=0.18, speed=4)
                if a <= 0:
                    continue
                y = 520 + int((1 - a) * 30)
                draw.ellipse((x - 150, y - 150, x + 150, y + 150), fill=soft)
                if k == 0:
                    K.draw_check(draw, x, y - 20, 80, sage)
                else:
                    K.draw_padlock(draw, x, y - 10, 0.8, K.DANGER)
                K.text_at(draw, lab, x, y + 100, font(42, bold=True), col)
            return True
        if focus in ("ask", "answer"):
            ans = focus == "answer"
            cw, ch = 250, 440
            row_x = [cx - (6 * cw + 5 * 30) / 2 + i * (cw + 30) for i in range(6)]
            safe_x = [120, 390]
            bad_x = [720, 990, 1260, 1530]
            y_card = 350
            if ans:
                for (bx0, bx1, col, soft, lab) in ((100, 660, sage, sage_soft, "SAFE to type"),
                                                   (700, 1800, K.DANGER, K.DANGER_SOFT, "NEVER type")):
                    draw.rounded_rectangle((bx0, 310, bx1, 830), radius=40, fill=soft, outline=col, width=4)
                    K.pill(draw, (bx0 + bx1) / 2, 228, lab, col, size=36)
            else:
                K.pill(draw, cx - 40, 228, "Safe or never?", K.BOTH_COLOR, size=36)
                K.draw_stopwatch(draw, cx + 210, 258, 32, progress, brand)
            si = bi = 0
            for i, (kind, lab, safe) in enumerate(items):
                if safe:
                    tx = safe_x[si]
                    si += 1
                else:
                    tx = bad_x[bi]
                    bi += 1
                m = K.ease_in_out(K.clamp01(progress * 2.2 - i * 0.12)) if ans else 0.0
                x0 = K.lerp(row_x[i], tx, m)
                y0 = y_card if not ans else K.lerp(y_card - 30, y_card, m)
                col = (sage if safe else K.DANGER) if m > 0.95 else None
                K.shadow_card(draw, (x0, y0, x0 + cw, y0 + ch), brand, radius=28, outline=col,
                              outline_w=5 if col else 3)
                item_icon(kind, x0 + cw / 2, y0 + 150)
                label_lines(lab, x0 + cw / 2, y0 + ch - 110, size=32)
                if m > 0.95:
                    (K.draw_check if safe else K.draw_cross)(draw, x0 + cw - 34, y0 + 34, 22, col)
            return True
        # saved
        draw.rounded_rectangle((160, 320, 780, 430), radius=30, fill=K.DANGER_SOFT, outline=K.DANGER, width=4)
        draw.text((196, 348), "My keys are under the mat", fill=ink, font=font(36, bold=True))
        a = K.stagger(progress, 1, step=0.14, speed=4)
        if a > 0:
            K.draw_arrow(draw, 800, 375, 800 + 130 * a, 375, muted, width=8, head=24)
            K.draw_server(draw, 1050, 380, 0.62, t)
            K.text_at(draw, "Saved", 1050, 480, font(36, bold=True), muted)
        a = K.stagger(progress, 2, step=0.14, speed=4)
        if a > 0:
            K.draw_arrow(draw, 1140, 375, 1140 + 130 * a, 375, muted, width=8, head=24)
            K.draw_person(draw, 1400, 350, 0.6, "mystery", t)
            K.draw_person(draw, 1580, 370, 0.6, "mystery", t)
            K.text_at(draw, "Seen by others", 1490, 480, font(36, bold=True), K.DANGER)
        a = K.stagger(progress, 4, step=0.12, speed=4)
        if a > 0:
            yy = int((1 - a) * 30)
            draw.ellipse((150, 560 + yy, 820, 860 + yy), fill=lav_soft)
            K.draw_person(draw, 350, 640 + yy, 0.85, "mom", t)
            anaya(draw, 590, 680 + yy, 0.72, t)
            K.draw_bubble(draw, (640, 540 + yy, 980, 620 + yy), brand, "Can I use it?", tail="left", size=32)
        for k, (lab, col) in enumerate((("Ask a grown-up first", sage), ("Stop & tell a trusted adult", coral))):
            a = K.stagger(progress, k + 5, step=0.12, speed=4)
            if a <= 0:
                continue
            bx = K.pill(draw, 1380, 600 + k * 120 + int((1 - a) * 20), lab, col, size=38)
            K.draw_shield(draw, bx[0] - 50, (bx[1] + bx[3]) / 2, 0.3, col)
        return True

    # ---- checkpoint ---------------------------------------------------------------------
    if visual == "b13-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 280 + lift, w - 460, 780 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 360 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Keep it private?", cx, 440 + lift, font(64, bold=True), ink)
            doormat(draw, cx + 40, 650 + lift, 0.8)
            return True
        ans = focus == "answer"
        draw.rounded_rectangle((130 + 10, 240 + 12, 1080 + 10, 860 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((130, 240, 1080, 860), radius=24, fill=(255, 250, 238))
        label_lines(("Should you tell a chatbot", "your keys hide under the mat?"), 605, 270, size=44, col=coral)
        rows = ["No! That's private info.", "A chatbot isn't a friend.", "Chats can be saved or seen."]
        for i, lab in enumerate(rows):
            y = 440 + i * 130
            draw.line((180, y + 96, 1030, y + 96), fill=(220, 210, 232), width=3)
            shown = ans and progress * 3.2 - 0.3 > i
            if shown:
                K.draw_check(draw, 210, y + 50, 24, sage)
                draw.text((250, y + 26), lab, fill=ink, font=font(42, bold=True))
            elif not ans and i == 1:
                K.text_at(draw, "Why?", 605, y + 10, font(70, bold=True), line)
        # door + mat
        draw.rounded_rectangle((1290 + 10, 300 + 12, 1610 + 10, 720 + 12), radius=16, fill=K.SHADOW)
        draw.rounded_rectangle((1290, 300, 1610, 720), radius=16, fill=sage, outline=K.DEV_DARK, width=5)
        for k in range(2):
            draw.rounded_rectangle((1330, 340 + k * 190, 1570, 500 + k * 190 - 20), radius=10, outline=(10, 120, 110),
                                   width=5)
        draw.ellipse((1546, 500, 1576, 530), fill=K.GOLD)
        doormat(draw, 1450, 790, 0.72, key=not ans)
        if ans:
            K.draw_shield(draw, 1450, 500, 0.9, coral, mark="lock")
            K.pill(draw, 1450, 236, "Keep home secrets at home", sage, size=32)
        else:
            K.draw_stopwatch(draw, 1740, 380, 44, progress, brand)
            question_marks([(1200, 330)], size=90)
        return True

    # ---- recap ----------------------------------------------------------------------------
    if visual == "b13-recap":
        recap = [(("Predicts replies", "from patterns"), sage, "predict"), (("No feelings,", "doesn't know you"), coral, "heart"),
                 (("Can be wrong:", "check big facts"), K.BOTH_COLOR, "wrong"), (("Never share", "private info"), K.DANGER, "lock")]
        if focus in ("r1", "r2", "r3", "r4"):
            n = int(focus[1])
            K.text_at(draw, "Remember", cx, 220, font(50, bold=True), ink)
            for i, (lab, col, kind) in enumerate(recap[:n]):
                active = i == n - 1
                a = K.ease_out_cubic(K.clamp01(progress * 3)) if active else 1.0
                x0 = 110 + i * 435
                y0 = 300 + int((1 - a) * 50) - (int(10 * pulse) if active else 0)
                draw.rounded_rectangle((x0, y0, x0 + 400, y0 + 520), radius=36,
                                       fill=coral_soft if active else panel, outline=col if active else line,
                                       width=6 if active else 3)
                ix, iy = x0 + 200, y0 + 200
                if kind == "predict":
                    pip(draw, ix - 70, iy + 40, 70, t, mood="think")
                    for k, wd in enumerate(("bam", "boo")):
                        draw.rounded_rectangle((ix + 30, iy - 70 + k * 70, ix + 170, iy - 14 + k * 70), radius=16,
                                               fill=panel, outline=sage, width=3)
                        K.text_at(draw, wd, ix + 100, iy - 62 + k * 70, font(32, bold=True), sage)
                elif kind == "heart":
                    pip(draw, ix - 60, iy + 40, 70, t, mood="blank")
                    K.draw_heart(draw, ix + 90, iy - 30, 50, coral)
                    K.draw_cross(draw, ix + 130, iy - 70, 26, K.DANGER)
                elif kind == "wrong":
                    spider(draw, ix - 50, iy, 0.56, t)
                    closed_book(draw, ix + 120, iy + 50, 0.42, "")
                else:
                    K.draw_padlock(draw, ix, iy + 10, 0.9, K.GOLD)
                label_lines(lab, x0 + 200, y0 + 390, size=36)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 430, 110, sage, panel, bounce)
            pip(draw, cx + 300, 450, 100, t)
            K.text_at(draw, "Chapter 3 done!", cx, 670, font(68, bold=True), ink)
            K.pill(draw, cx, 770, "Chat smart, chat safe!", coral, size=36)
            stars_around(320, 540, 8)
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False

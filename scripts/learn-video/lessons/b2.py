"""B2 · Smart vs. Simple — visuals."""
import math

import build as K

PIXI = (112, 92, 226)
PIXI_DARK = (76, 58, 176)
PIXI_LIGHT = (206, 198, 252)
SCREEN = (30, 28, 60)
GLOW = (110, 232, 255)
PINK = (250, 170, 180)
PINK_DARK = (226, 110, 130)
MINI = (236, 96, 150)
CAT_ORANGE = (244, 160, 70)
CAT_GREY = (150, 156, 168)
CAT_BLACK = (70, 70, 82)
DOG_BROWN = (196, 140, 90)
DOG_GOLD = (232, 190, 120)
DOG_DARK = (120, 84, 56)
GRASS = (122, 194, 108)
PITCH = (226, 204, 150)
WOOD = (214, 170, 120)
WOOD_DARK = (176, 128, 84)
LCD = (196, 226, 200)
BEAM = (255, 240, 168)
NIGHT = (44, 50, 78)
NIGHT_DEEP = (32, 36, 58)
BLANKET = (96, 160, 200)
BLANKET_DARK = (70, 126, 166)


def S_(s):
    return lambda v: v * s


def pixi(draw, cx, cy, s, t, face="smile", wave=0.0):
    """Floating AI helper. cy = body centre; top ≈ cy-230s, hover shadow ≈ cy+206s, hands ≈ ±226s."""
    S = S_(s)
    y = cy + S(10) * math.sin(t * math.pi * 4)
    draw.ellipse((cx - S(110), cy + S(182), cx + S(110), cy + S(206)), fill=K.SHADOW)
    for k in range(2):
        r = S(70 + k * 24)
        draw.arc((cx - r, y + S(150 + k * 8), cx + r, y + S(178 + k * 12)), 25, 155, fill=PIXI_LIGHT,
                 width=max(2, int(S(6))))
    draw.line((cx, y - S(140), cx, y - S(186)), fill=PIXI_DARK, width=max(2, int(S(8))))
    gr = S(28) + S(5) * math.sin(t * math.pi * 10)
    draw.ellipse((cx - gr, y - S(206) - gr, cx + gr, y - S(206) + gr), fill=(255, 238, 196))
    K.draw_star(draw, cx, y - S(206), S(22), K.GOLD, rot=t * 2)
    for sx in (-1, 1):
        ex = cx + sx * S(150)
        draw.rounded_rectangle((ex - S(16), y - S(40), ex + S(16), y + S(40)), radius=S(14), fill=PIXI_DARK)
    draw.ellipse((cx - S(150) + S(8), y - S(150) + S(10), cx + S(150) + S(8), y + S(150) + S(10)), fill=K.SHADOW)
    draw.ellipse((cx - S(150), y - S(150), cx + S(150), y + S(150)), fill=PIXI)
    draw.arc((cx - S(128), y - S(128), cx + S(128), y + S(128)), 200, 250, fill=PIXI_LIGHT, width=max(2, int(S(10))))
    draw.rounded_rectangle((cx - S(104), y - S(96), cx + S(104), y + S(40)), radius=S(52), fill=SCREEN)
    ey = y - S(42)
    ew = max(2, int(S(9)))
    blink = face == "smile" and (t * 2.3) % 1 > 0.92
    for i, sx in enumerate((-1, 1)):
        ex = cx + sx * S(38)
        if face == "happy":
            draw.arc((ex - S(20), ey - S(10), ex + S(20), ey + S(24)), 200, 340, fill=GLOW, width=ew)
        elif face == "think":
            if i == 0:
                draw.ellipse((ex - S(14), ey - S(18), ex + S(14), ey + S(18)), fill=GLOW)
            else:
                draw.line((ex - S(16), ey - S(2), ex + S(16), ey - S(8)), fill=GLOW, width=ew)
        elif face == "oops":
            r = S(20) if i == 0 else S(12)
            draw.ellipse((ex - r, ey - r, ex + r, ey + r), outline=GLOW, width=ew)
        elif face == "wow":
            draw.ellipse((ex - S(20), ey - S(22), ex + S(20), ey + S(22)), fill=GLOW)
            draw.ellipse((ex - S(7), ey - S(14), ex + S(5), ey - S(2)), fill=SCREEN)
        elif blink:
            draw.line((ex - S(16), ey, ex + S(16), ey), fill=GLOW, width=ew)
        else:
            draw.ellipse((ex - S(14), ey - S(20), ex + S(14), ey + S(20)), fill=GLOW)
    my = y + S(2)
    if face in ("smile", "happy"):
        draw.arc((cx - S(36), my - S(26), cx + S(36), my + S(14)), 20, 160, fill=GLOW, width=ew)
    elif face == "think":
        draw.line((cx - S(16), my, cx + S(22), my - S(4)), fill=GLOW, width=ew)
    elif face == "oops":
        pts = [(cx - S(28) + k * S(14), my + (S(5) if k % 2 else -S(5))) for k in range(5)]
        draw.line(pts, fill=GLOW, width=ew)
    else:
        draw.ellipse((cx - S(12), my - S(14), cx + S(12), my + S(12)), outline=GLOW, width=ew)
    draw.line((cx - S(40), y + S(88), cx + S(40), y + S(88)), fill=PIXI_LIGHT, width=max(2, int(S(5))))
    for k, col in enumerate((K.CORAL, K.GOLD, GLOW)):
        dx = cx + (k - 1) * S(40)
        on = int(t * 10 + k) % 3 != 0
        draw.ellipse((dx - S(10), y + S(78), dx + S(10), y + S(98)), fill=col if on else PIXI_LIGHT)
    lh = (cx - S(198), y + S(52) + S(6) * math.sin(t * 9))
    if wave > 0:
        rh = (cx + S(204) + S(16) * math.sin(wave * math.pi * 6), y - S(90))
    else:
        rh = (cx + S(198), y + S(52) + S(6) * math.sin(t * 9 + 1))
    for hx, hy in (lh, rh):
        draw.ellipse((hx - S(28), hy - S(28), hx + S(28), hy + S(28)), fill=PIXI_DARK)
        draw.ellipse((hx - S(16), hy - S(20), hx + S(4), hy - S(4)), fill=PIXI)
    return rh


def mini(draw, cx, cy, s, t=0.0):
    """Kabir's little sister. cy = face centre (like K.draw_person)."""
    S = S_(s)
    cy = cy + S(6) * math.sin(t * math.pi * 4)
    draw.chord((cx - S(96) + S(6), cy + S(46) + S(8), cx + S(96) + S(6), cy + S(236) + S(8)), 180, 360, fill=K.SHADOW)
    draw.chord((cx - S(96), cy + S(46), cx + S(96), cy + S(236)), 180, 360, fill=MINI)
    r = S(64)
    for sx in (-1, 1):
        px = cx + sx * r * 1.12
        draw.ellipse((px - r * 0.36, cy - r * 0.2, px + r * 0.36, cy + r * 0.56), fill=K.HAIR)
        draw.ellipse((px - r * 0.16, cy - r * 0.36, px + r * 0.16, cy - r * 0.08), fill=K.GOLD)
    K.draw_face(draw, cx, cy, r, "kid", 0.8)


def sleepy_face(draw, cx, cy, r):
    K.draw_face(draw, cx, cy, r, "kid", 0.0)
    for sx in (-1, 1):
        ex, ey = cx + sx * r * 0.38, cy - r * 0.05
        draw.ellipse((ex - r * 0.17, ey - r * 0.17, ex + r * 0.17, ey + r * 0.17), fill=K.SKIN)
        draw.arc((ex - r * 0.16, ey - r * 0.1, ex + r * 0.16, ey + r * 0.16), 200, 340, fill=(40, 44, 56),
                 width=max(2, int(r * 0.08)))


def bed(draw, x0, x1, y, t, awake=False):
    draw.rounded_rectangle((x0 - 20, y - 170, x0 + 30, y + 150), radius=20, fill=WOOD_DARK)
    draw.rounded_rectangle((x0 + 10, y + 10, x1 + 10, y + 110), radius=24, fill=K.SHADOW)
    draw.rounded_rectangle((x0, y, x1, y + 100), radius=24, fill=WOOD)
    draw.rounded_rectangle((x0 + 40, y - 70, x0 + 240, y + 10), radius=36, fill=(255, 255, 255), outline=(220, 214, 204),
                           width=3)
    if awake:
        K.draw_face(draw, x0 + 140, y - 70, 66, "kid", 0.0)
    else:
        sleepy_face(draw, x0 + 140, y - 70, 66)
    draw.rounded_rectangle((x0 + 200, y - 60, x1 - 10, y + 40), radius=40, fill=BLANKET)
    for k in range(3):
        bx = x0 + 280 + k * 140
        if bx + 60 < x1:
            draw.line((bx, y - 50, bx + 40, y + 30), fill=BLANKET_DARK, width=6)


def alarm_clock(draw, cx, cy, s, t, ringing=False):
    S = S_(s)
    dx = S(9) * math.sin(t * 70) if ringing else 0
    c = cx + dx
    for sx in (-1, 1):
        draw.line((c + sx * S(60), cy + S(100), c + sx * S(90), cy + S(150)), fill=K.DEV_DARK, width=max(3, int(S(14))))
    draw.line((c, cy - S(150), c, cy - S(124)), fill=K.DEV_DARK, width=max(3, int(S(12))))
    draw.rounded_rectangle((c - S(40), cy - S(166), c + S(40), cy - S(146)), radius=S(8), fill=K.DEV_DARK)
    for sx in (-1, 1):
        bx = c + sx * S(84)
        draw.chord((bx - S(52), cy - S(150), bx + S(52), cy - S(46)), 180, 360, fill=K.GOLD)
    draw.ellipse((c - S(124) + S(8), cy - S(120) + S(10), c + S(124) + S(8), cy + S(128) + S(10)), fill=K.SHADOW)
    draw.ellipse((c - S(124), cy - S(120), c + S(124), cy + S(128)), fill=K.CORAL)
    fx, fy, fr = c, cy + S(4), S(98)
    draw.ellipse((fx - fr, fy - fr, fx + fr, fy + fr), fill=(255, 255, 255))
    for k in range(12):
        a = k * math.pi / 6
        r0 = fr * (0.8 if k % 3 == 0 else 0.86)
        draw.line((fx + math.sin(a) * r0, fy - math.cos(a) * r0, fx + math.sin(a) * fr * 0.94, fy - math.cos(a) * fr * 0.94),
                  fill=K.DEV_DARK, width=max(2, int(S(6 if k % 3 == 0 else 3))))
    ha, ma = math.radians(195), math.radians(180)
    draw.line((fx, fy, fx + math.sin(ha) * fr * 0.5, fy - math.cos(ha) * fr * 0.5), fill=K.DEV_DEEP, width=max(3, int(S(12))))
    draw.line((fx, fy, fx + math.sin(ma) * fr * 0.76, fy - math.cos(ma) * fr * 0.76), fill=K.DEV_DEEP,
              width=max(2, int(S(8))))
    draw.ellipse((fx - S(10), fy - S(10), fx + S(10), fy + S(10)), fill=K.CORAL)
    if ringing:
        for sx in (-1, 1):
            for k in range(2):
                r = S(150 + k * 34)
                a0 = -40 if sx > 0 else 140
                draw.arc((cx - r, cy - r, cx + r, cy + r), a0 + 10, a0 + 70, fill=K.DANGER, width=max(3, int(S(9))))


def torch(draw, cx, cy, s, on=True, beam=420, spread=0.42):
    S = S_(s)
    if on:
        hx = cx + S(124)
        draw.polygon([(hx, cy - S(54)), (hx + beam, cy - S(54) - beam * spread),
                      (hx + beam, cy + S(54) + beam * spread), (hx, cy + S(54))], fill=BEAM)
    draw.rounded_rectangle((cx - S(150) + S(6), cy - S(34) + S(8), cx + S(60) + S(6), cy + S(34) + S(8)), radius=S(18),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(150), cy - S(34), cx + S(60), cy + S(34)), radius=S(18), fill=K.DEV_DARK)
    for k in range(4):
        gx = cx - S(130) + k * S(22)
        draw.line((gx, cy - S(26), gx, cy + S(26)), fill=K.DEV_MID, width=max(2, int(S(6))))
    draw.polygon([(cx + S(50), cy - S(34)), (cx + S(124), cy - S(60)), (cx + S(124), cy + S(60)), (cx + S(50), cy + S(34))],
                 fill=K.STEEL_DARK)
    draw.ellipse((cx + S(110), cy - S(60), cx + S(138), cy + S(60)), fill=K.GOLD if on else (220, 222, 228))
    draw.rounded_rectangle((cx - S(40), cy - S(50), cx + S(4), cy - S(30)), radius=S(6), fill=K.CORAL if on else K.DEV_MID)


def door(draw, x0, y0, x1, y1):
    draw.rectangle((x0 - 24, y0 - 24, x1 + 24, y1), fill=(236, 226, 210))
    draw.rectangle((x0, y0, x1, y1), fill=WOOD)
    pw = (x1 - x0 - 60) / 2
    for r in range(2):
        for c in range(2):
            px = x0 + 20 + c * (pw + 20)
            py = y0 + 30 + r * ((y1 - y0 - 80) / 2 + 10)
            draw.rounded_rectangle((px, py, px + pw, py + (y1 - y0 - 100) / 2), radius=8, outline=WOOD_DARK, width=5)
    draw.ellipse((x1 - 46, (y0 + y1) / 2 - 12, x1 - 22, (y0 + y1) / 2 + 12), fill=K.GOLD)


def doorbell(draw, cx, cy, s, pressed=False):
    S = S_(s)
    draw.rounded_rectangle((cx - S(50) + S(5), cy - S(80) + S(7), cx + S(50) + S(5), cy + S(80) + S(7)), radius=S(20),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(50), cy - S(80), cx + S(50), cy + S(80)), radius=S(20), fill=(250, 248, 244),
                           outline=K.DEV_MID, width=max(2, int(S(4))))
    r = S(26) if pressed else S(32)
    draw.ellipse((cx - S(36), cy - S(36), cx + S(36), cy + S(36)), fill=K.STEEL)
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(200, 70, 20) if pressed else K.CORAL)
    draw.rounded_rectangle((cx - S(26), cy + S(48), cx + S(26), cy + S(62)), radius=S(6), fill=K.DEV_MID)


def finger(draw, x, y, s):
    S = S_(s)
    draw.rounded_rectangle((x - S(18), y, x + S(18), y + S(110)), radius=S(18), fill=K.SKIN)
    draw.rounded_rectangle((x - S(36), y + S(70), x + S(36), y + S(180)), radius=S(30), fill=K.SKIN)
    draw.rounded_rectangle((x - S(10), y + S(8), x + S(10), y + S(30)), radius=S(6), fill=(250, 220, 200))


def cat(draw, cx, cy, r, col):
    for sx in (-1, 1):
        draw.polygon([(cx + sx * r * 0.98, cy - r * 0.2), (cx + sx * r * 0.78, cy - r * 1.28),
                      (cx + sx * r * 0.16, cy - r * 0.78)], fill=col)
        draw.polygon([(cx + sx * r * 0.82, cy - r * 0.42), (cx + sx * r * 0.74, cy - r * 1.02),
                      (cx + sx * r * 0.4, cy - r * 0.76)], fill=PINK)
    draw.ellipse((cx - r, cy - r * 0.92, cx + r, cy + r * 0.86), fill=col)
    draw.ellipse((cx - r * 0.44, cy + r * 0.12, cx + r * 0.44, cy + r * 0.66), fill=(255, 250, 244))
    for sx in (-1, 1):
        ex, ey = cx + sx * r * 0.4, cy - r * 0.12
        draw.ellipse((ex - r * 0.16, ey - r * 0.2, ex + r * 0.16, ey + r * 0.2), fill=(132, 196, 92))
        draw.ellipse((ex - r * 0.05, ey - r * 0.17, ex + r * 0.05, ey + r * 0.17), fill=K.DEV_DEEP)
    draw.polygon([(cx - r * 0.11, cy + r * 0.16), (cx + r * 0.11, cy + r * 0.16), (cx, cy + r * 0.29)], fill=PINK_DARK)
    ww = max(2, int(r * 0.04))
    for sx in (-1, 1):
        for k in (-1, 0, 1):
            draw.line((cx + sx * r * 0.34, cy + r * 0.34 + k * r * 0.07, cx + sx * r * 1.2, cy + r * 0.24 + k * r * 0.22),
                      fill=K.DEV_DARK, width=ww)


def dog(draw, cx, cy, r, col):
    dark = DOG_DARK if col != DOG_DARK else (80, 56, 40)
    for sx in (-1, 1):
        draw.ellipse((cx + sx * r * 0.7 - r * 0.32, cy - r * 0.7, cx + sx * r * 0.7 + r * 0.32, cy + r * 0.5), fill=dark)
    draw.ellipse((cx - r * 0.82, cy - r * 0.9, cx + r * 0.82, cy + r * 0.7), fill=col)
    draw.ellipse((cx - r * 0.46, cy + r * 0.02, cx + r * 0.46, cy + r * 0.74), fill=(250, 236, 214))
    for sx in (-1, 1):
        ex, ey = cx + sx * r * 0.34, cy - r * 0.22
        draw.ellipse((ex - r * 0.12, ey - r * 0.12, ex + r * 0.12, ey + r * 0.12), fill=K.DEV_DEEP)
        draw.ellipse((ex - r * 0.04, ey - r * 0.08, ex + r * 0.03, ey - r * 0.01), fill=(255, 255, 255))
    draw.ellipse((cx - r * 0.18, cy + r * 0.1, cx + r * 0.18, cy + r * 0.32), fill=K.DEV_DEEP)
    draw.line((cx, cy + r * 0.32, cx, cy + r * 0.46), fill=K.DEV_DEEP, width=max(2, int(r * 0.05)))
    draw.arc((cx - r * 0.24, cy + r * 0.3, cx + r * 0.24, cy + r * 0.6), 20, 160, fill=K.DEV_DEEP,
             width=max(2, int(r * 0.05)))
    draw.chord((cx - r * 0.12, cy + r * 0.46, cx + r * 0.12, cy + r * 0.76), 0, 180, fill=PINK_DARK)


def photo(draw, box, bg=(214, 236, 250)):
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 8, y0 + 10, x1 + 8, y1 + 10), radius=16, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=16, fill=(255, 255, 255), outline=(222, 214, 200), width=2)
    pad = max(8, int((x1 - x0) * 0.05))
    inner = (x0 + pad, y0 + pad, x1 - pad, y1 - pad * 2.4)
    draw.rectangle(inner, fill=bg)
    return inner


def pet_photo(draw, box, kind, col, bg=(214, 236, 250)):
    ix0, iy0, ix1, iy1 = photo(draw, box, bg)
    r = min(ix1 - ix0, iy1 - iy0) * 0.32
    mx, my = (ix0 + ix1) / 2, (iy0 + iy1) / 2
    if kind == "cat":
        cat(draw, mx, my + r * 0.25, r * 0.95, col)
    else:
        dog(draw, mx, my + r * 0.05, r * 1.05, col)


def phone(draw, cx, cy, s):
    S = S_(s)
    W, H = S(130), S(240)
    draw.rounded_rectangle((cx - W + S(8), cy - H + S(10), cx + W + S(8), cy + H + S(10)), radius=S(34), fill=K.SHADOW)
    draw.rounded_rectangle((cx - W, cy - H, cx + W, cy + H), radius=S(34), fill=K.DEV_DARK)
    box = (cx - W + S(14), cy - H + S(36), cx + W - S(14), cy + H - S(30))
    draw.rectangle(box, fill=(250, 250, 252))
    draw.rounded_rectangle((cx - S(30), cy - H + S(14), cx + S(30), cy - H + S(24)), radius=S(5), fill=K.DEV_MID)
    draw.rounded_rectangle((cx - S(40), cy + H - S(18), cx + S(40), cy + H - S(10)), radius=S(4), fill=K.DEV_MID)
    return box


def thumb(draw, box, t, kind="cricket"):
    x0, y0, x1, y1 = box
    w, h = x1 - x0, y1 - y0
    if kind == "cricket":
        draw.rounded_rectangle(box, radius=int(min(w, h) * 0.12), fill=GRASS)
        draw.polygon([(x0 + w * 0.38, y0 + h * 0.18), (x0 + w * 0.62, y0 + h * 0.18), (x0 + w * 0.72, y1 - h * 0.06),
                      (x0 + w * 0.28, y1 - h * 0.06)], fill=PITCH)
        sw = max(2, int(w * 0.022))
        for k in (-1, 0, 1):
            sx = x0 + w * 0.5 + k * w * 0.04
            draw.line((sx, y0 + h * 0.3, sx, y0 + h * 0.62), fill=(255, 255, 255), width=sw)
        bx = x0 + w * (0.22 + 0.18 * ((t * 2) % 1))
        br = max(3, w * 0.045)
        draw.ellipse((bx - br, y0 + h * 0.7 - br, bx + br, y0 + h * 0.7 + br), fill=(226, 64, 72))
    else:
        draw.rounded_rectangle(box, radius=int(min(w, h) * 0.12), fill=(250, 226, 200) if kind == "cat" else (214, 232, 250))
        r = min(w, h) * 0.3
        if kind == "cat":
            cat(draw, x0 + w / 2, y0 + h / 2 + r * 0.2, r, CAT_ORANGE)
        else:
            dog(draw, x0 + w / 2, y0 + h / 2, r * 1.1, DOG_GOLD)


def calculator(draw, cx, cy, s, display, font):
    S = S_(s)
    W, H = S(150), S(230)
    draw.rounded_rectangle((cx - W + S(8), cy - H + S(10), cx + W + S(8), cy + H + S(10)), radius=S(30), fill=K.SHADOW)
    draw.rounded_rectangle((cx - W, cy - H, cx + W, cy + H), radius=S(30), fill=K.DEV_DARK)
    sx0, sy0, sx1, sy1 = cx - S(120), cy - S(200), cx + S(120), cy - S(96)
    draw.rounded_rectangle((sx0, sy0, sx1, sy1), radius=S(12), fill=LCD)
    if display:
        f = font(max(26, int(S(66))), bold=True)
        bb = draw.textbbox((0, 0), display, font=f)
        draw.text((sx1 - S(18) - (bb[2] - bb[0]), (sy0 + sy1) / 2 - (bb[3] + bb[1]) / 2), display, font=f,
                  fill=K.DEV_DEEP)
    for i in range(16):
        r, c = divmod(i, 4)
        kx = cx - S(120) + c * S(62)
        ky = cy - S(72) + r * S(62)
        col = K.CORAL if i == 11 else (13, 148, 136) if c == 3 else K.DEV_MID
        draw.rounded_rectangle((kx, ky, kx + S(52), ky + S(52)), radius=S(12), fill=col)


def speaker(draw, cx, cy, s, t):
    S = S_(s)
    draw.ellipse((cx - S(100), cy + S(120), cx + S(100), cy + S(150)), fill=K.SHADOW)
    draw.rectangle((cx - S(90), cy - S(110), cx + S(90), cy + S(130)), fill=K.DEV_DARK)
    draw.ellipse((cx - S(90), cy + S(104), cx + S(90), cy + S(156)), fill=K.DEV_DARK)
    for r_ in range(5):
        for c_ in range(6):
            dx = cx - S(62) + c_ * S(25) + (S(12) if r_ % 2 else 0)
            dy = cy - S(40) + r_ * S(30)
            if dx < cx + S(72):
                draw.ellipse((dx - S(5), dy - S(5), dx + S(5), dy + S(5)), fill=K.DEV_MID)
    draw.ellipse((cx - S(90), cy - S(136), cx + S(90), cy - S(84)), fill=K.DEV_MID)
    on = 0.5 + 0.5 * math.sin(t * 16)
    ring = tuple(int(K.lerp(a, b, on)) for a, b in ((60, 110), (160, 232), (200, 255)))
    draw.ellipse((cx - S(80), cy - S(130), cx + S(80), cy - S(90)), outline=ring, width=max(3, int(S(10))))


def calendar(draw, cx, cy, s, top, big, col):
    S = S_(s)
    draw.rounded_rectangle((cx - S(110) + S(8), cy - S(110) + S(10), cx + S(110) + S(8), cy + S(110) + S(10)),
                           radius=S(24), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(110), cy - S(110), cx + S(110), cy + S(110)), radius=S(24), fill=(255, 255, 255),
                           outline=(220, 214, 204), width=3)
    draw.rounded_rectangle((cx - S(110), cy - S(110), cx + S(110), cy - S(40)), radius=S(24), fill=col)
    draw.rectangle((cx - S(110), cy - S(64), cx + S(110), cy - S(40)), fill=col)
    for sx in (-1, 1):
        draw.rounded_rectangle((cx + sx * S(56) - S(8), cy - S(128), cx + sx * S(56) + S(8), cy - S(92)), radius=S(6),
                               fill=K.DEV_DARK)
    K.text_at(draw, top, cx, cy - S(100), K.load_font(max(26, int(S(36))), bold=True), (255, 255, 255))
    K.text_at(draw, big, cx, cy - S(22), K.load_font(max(26, int(S(80))), bold=True), K.DEV_DEEP)


def book_stack(draw, cx, by, s):
    S = S_(s)
    cols = [K.ROAD, K.CORAL, (13, 148, 136), K.BOTH_COLOR, K.GOLD]
    for k in range(5):
        y1 = by - k * S(46)
        off = S(14) * ((k % 3) - 1)
        draw.rounded_rectangle((cx - S(130) + off, y1 - S(42), cx + S(130) + off, y1), radius=S(8), fill=cols[k])
        draw.rectangle((cx + S(96) + off, y1 - S(36), cx + S(122) + off, y1 - S(6)), fill=(250, 246, 236))
        draw.line((cx - S(100) + off, y1 - S(21), cx + S(40) + off, y1 - S(21)), fill=(255, 255, 255),
                  width=max(2, int(S(5))))


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
    AIC = K.BOTH_COLOR

    def stars_around(y, spread, n=6):
        for i in range(n):
            side = -1 if i % 2 == 0 else 1
            sx = cx + side * (spread + 80 * (i // 2))
            sy = y + 90 * (i // 2) + 14 * math.sin(progress * 9 + i)
            K.draw_star(draw, sx, sy, 22 + 6 * pulse, [coral, sage, AIC, K.GOLD][i % 4], rot=progress * 3 + i)

    def star_spots(spots):
        for k, (sx, sy) in enumerate(spots):
            K.draw_star(draw, sx, sy + 10 * math.sin(progress * 9 + k), 22 + 6 * pulse,
                        [coral, sage, AIC, K.GOLD][k % 4], rot=progress * 3 + k)

    def question_marks(spots, size=84):
        for k, (qx, qy) in enumerate(spots):
            K.text_at(draw, "?", qx, qy, font(int(size + 22 * (pulse if k % 2 else 1 - pulse)), bold=True), K.GOLD)

    def label_lines(lines, x, y, size=36, col=None, gap=1.22):
        f = font(size, bold=True)
        for j, ln in enumerate(lines):
            K.text_at(draw, ln, x, y + j * int(size * gap), f, col or ink)

    def ring_text(x, y, size=54):
        K.text_at(draw, "RING!", x + 6 * math.sin(t * 60), y, font(size, bold=True), K.DANGER)

    def gadget(kind, x, y, s=1.0):
        if kind == "alarm":
            alarm_clock(draw, x, y + 10 * s, 0.62 * s, t)
        elif kind == "doorbell":
            doorbell(draw, x, y, 0.95 * s)
        elif kind == "torch":
            torch(draw, x - 30 * s, y, 0.75 * s, on=True, beam=60 * s)
        elif kind == "calc":
            calculator(draw, x, y, 0.5 * s, "10", font)
        elif kind == "voice":
            speaker(draw, x, y + 6 * s, 0.7 * s, t)
        elif kind == "spell":
            draw.rounded_rectangle((x - 120 * s, y - 70 * s, x + 120 * s, y + 70 * s), radius=int(16 * s), fill=panel,
                                   outline=line, width=3)
            f = font(max(26, int(34 * s)), bold=True)
            K.text_at(draw, "becuase", x, y - 46 * s, f, ink)
            pts = [(x - 80 * s + k * 12 * s, y - 2 * s + (5 * s if k % 2 else -3 * s)) for k in range(14)]
            draw.line(pts, fill=K.DANGER, width=max(2, int(4 * s)))
            K.pill(draw, x, y + 14 * s, "because", sage, size=max(26, int(28 * s)))
        elif kind == "photos":
            draw.rounded_rectangle((x - 110 * s, y - 100 * s, x + 110 * s, y + 100 * s), radius=int(18 * s), fill=panel,
                                   outline=line, width=3)
            for k in range(4):
                r_, c_ = divmod(k, 2)
                bx0 = x - 96 * s + c_ * 100 * s
                by0 = y - 86 * s + r_ * 92 * s
                thumb(draw, (bx0, by0, bx0 + 92 * s, by0 + 84 * s), t, "dog" if k != 2 else "cat")
        elif kind == "remote":
            K.draw_device(draw, "remote", x, y, 0.8 * s, brand)

    # ---- opening -----------------------------------------------------------
    if visual == "b2-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 300), 470, 110, sage, panel, bounce)
            pixi(draw, cx + 300, 480, 0.82, t, face="happy", wave=t)
            K.text_at(draw, "Welcome back, champ!", cx, 740, font(64, bold=True), ink)
            stars_around(330, 560)
            return True
        if focus == "bridge":
            K.shadow_card(draw, (280, 250 + lift, w - 280, 850 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · MEET AI", cx, 314 + lift, font(34, bold=True), sage)
            specs = [("EXAMPLES", coral, coral_soft), ("PATTERN", AIC, lav_soft), ("GUESS", sage, sage_soft)]
            for i, (lab, col, soft) in enumerate(specs):
                a = K.stagger(progress, i, step=0.14, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 400
                y = 500 + int((1 - a) * 40)
                draw.ellipse((x - 110, y - 110, x + 110, y + 110), fill=soft)
                if i == 0:
                    for k in range(3):
                        pet_photo(draw, (x - 90 + k * 26, y - 70 - k * 16, x + 20 + k * 26, y + 50 - k * 16), "cat",
                                  [CAT_GREY, CAT_ORANGE, CAT_BLACK][k])
                elif i == 1:
                    cat(draw, x - 30, y + 20, 52, CAT_ORANGE)
                    K.draw_magnifier(draw, x + 30, y - 20, 0.55, AIC)
                else:
                    K.draw_bubble(draw, (x - 90, y - 70, x + 90, y + 20), brand, "Cat?", tail="left", size=40)
                K.text_at(draw, lab, x, y + 130, font(36, bold=True), col)
                if i < 2:
                    K.draw_arrow(draw, x + 128, y, x + 272, y, muted, width=8, head=22)
            a = K.stagger(progress, 4, step=0.12, speed=4)
            if a > 0:
                K.pill(draw, cx, 740 + int((1 - a) * 20), "…and sometimes the guess is wrong!", coral, size=34)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (300, 236 + lift, w - 300, 500 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 2 OF 5", cx, 296 + lift, font(32, bold=True), coral)
            K.text_at(draw, "Smart vs. Simple", cx, 352 + lift, font(92, bold=True), ink)
            a = K.stagger(progress, 2, step=0.14, speed=4)
            if a > 0:
                yy = int((1 - a) * 30)
                draw.ellipse((cx - 420 - 150, 710 - 150 + yy, cx - 420 + 150, 710 + 150 + yy), fill=sage_soft)
                doorbell(draw, cx - 490, 710 + yy, 0.9)
                torch(draw, cx - 360, 710 + yy, 0.45, on=False)
                K.text_at(draw, "Simple", cx - 420, 560 + yy, font(44, bold=True), sage)
            a = K.stagger(progress, 3, step=0.14, speed=4)
            if a > 0:
                draw.ellipse((cx - 64, 700 - 64, cx + 64, 700 + 64), fill=coral)
                K.text_at(draw, "VS", cx, 674, font(48, bold=True), panel)
            a = K.stagger(progress, 4, step=0.14, speed=4)
            if a > 0:
                yy = int((1 - a) * 30)
                draw.ellipse((cx + 420 - 150, 710 - 150 + yy, cx + 420 + 150, 710 + 150 + yy), fill=lav_soft)
                pixi(draw, cx + 420, 730 + yy, 0.42, t, face="happy")
                K.text_at(draw, "Smart", cx + 420, 560 + yy, font(44, bold=True), AIC)
            return True
        # question
        K.text_at(draw, "Is every gadget with a button AI?", cx, 250 + lift, font(60, bold=True), ink)
        kinds = ["doorbell", "torch", "alarm", "remote", "voice"]
        for i, kind in enumerate(kinds):
            a = K.stagger(progress, i, step=0.1, speed=5)
            if a <= 0:
                continue
            x = cx + (i - 2) * 330
            y = 590 + int((1 - a) * 40)
            draw.ellipse((x - 130, y - 130, x + 130, y + 130), fill=[coral_soft, sage_soft, blue_soft, lav_soft, coral_soft][i])
            gadget(kind, x, y)
            K.pill(draw, x, 400, "AI?", AIC, size=32)
        return True

    # ---- Kabir's Saturday & Mini's torch ----------------------------------------------
    if visual == "b2-hook":
        if focus == "alarm":
            bed(draw, 180, 1020, 640, t, awake=progress > 0.3)
            draw.rounded_rectangle((1120, 640, 1420, 680), radius=10, fill=WOOD)
            draw.rectangle((1150, 680, 1390, 860), fill=WOOD_DARK)
            draw.rounded_rectangle((1170, 710, 1370, 770), radius=8, fill=WOOD)
            alarm_clock(draw, 1270, 470, 0.95, t, ringing=True)
            ring_text(1270, 236)
            calendar(draw, 1620, 520, 0.9, "SAT", "", K.ROAD)
            K.text_at(draw, "Holiday!", 1620, 520, font(40, bold=True), coral)
            K.text_at(draw, "Kabir", 400, 790, font(36, bold=True), muted)
            return True
        if focus == "torch":
            draw.rounded_rectangle((150, 236, 1770, 866), radius=36, fill=NIGHT)
            grow = K.ease_out_cubic(K.clamp01((progress - 0.1) * 3))
            mini(draw, 420, 560, 1.15, t)
            torch(draw, 620, 690, 0.8, on=progress > 0.1, beam=820 * grow, spread=0.16)
            if progress > 0.1:
                ex = 719 + 820 * grow
                draw.ellipse((ex - 70, 690 - 170 * (0.3 + 0.7 * grow), ex + 70, 690 + 170 * (0.3 + 0.7 * grow)),
                             fill=(255, 248, 210))
            K.draw_bubble(draw, (600, 256, 1640, 410), brand, "Wow! This torch is so smart. It must be AI!",
                          tail="left", size=40)
            for k, (sx, sy) in enumerate(((240, 300), (1680, 320), (1650, 520))):
                K.draw_star(draw, sx, sy, 10 + 4 * pulse, (220, 224, 240), rot=t + k)
            K.text_at(draw, "Mini", 420, 790, font(36, bold=True), (220, 224, 240))
            return True
        if focus == "ask":
            mini(draw, 360, 540, 1.1, t)
            draw.ellipse((cx - 250, 560 - 250, cx + 250, 560 + 250), fill=lav_soft)
            torch(draw, cx - 80, 560, 1.3, on=True, beam=150)
            K.text_at(draw, "AI?", cx, 300, font(int(80 + 10 * pulse), bold=True), AIC)
            pixi(draw, 1530, 620, 0.8, t, face="think")
            question_marks([(1300, 330), (1760, 300)], 70)
            K.draw_stopwatch(draw, cx, 800, 46, progress, brand)
            return True
        # two
        for k, (title, col, soft) in enumerate((("SIMPLE", sage, sage_soft), ("SMART", AIC, lav_soft))):
            a = K.stagger(progress, k, step=0.25, speed=4)
            if a <= 0:
                continue
            x0 = 200 if k == 0 else 1010
            yy = int((1 - a) * 40)
            draw.rounded_rectangle((x0 + 10, 250 + yy + 12, x0 + 710 + 10, 850 + yy + 12), radius=40, fill=K.SHADOW)
            draw.rounded_rectangle((x0, 250 + yy, x0 + 710, 850 + yy), radius=40, fill=soft, outline=col, width=5)
            K.text_at(draw, title, x0 + 355, 286 + yy, font(66, bold=True), col)
            if k == 0:
                doorbell(draw, x0 + 180, 560 + yy, 1.2)
                alarm_clock(draw, x0 + 420, 570 + yy, 0.6, t)
                torch(draw, x0 + 280, 740 + yy, 0.6, on=False)
            else:
                pixi(draw, x0 + 250, 580 + yy, 0.62, t, face="happy")
                speaker(draw, x0 + 540, 560 + yy, 0.75, t)
        K.draw_magnifier(draw, cx, 560, 0.7, coral)
        return True

    # ---- simple programs: fixed rules ---------------------------------------------------
    if visual == "b2-simple":
        if focus == "rule":
            K.text_at(draw, "FIXED RULE", cx, 236 + lift, font(100, bold=True), coral)
            K.text_at(draw, "an instruction that never changes", cx, 360 + lift, font(46, bold=True), muted)
            a = K.stagger(progress, 1, step=0.15, speed=4)
            if a > 0:
                yy = int((1 - a) * 30)
                K.shadow_card(draw, (300, 470 + yy, 1520, 820 + yy), brand, radius=40, outline=coral, outline_w=5)
                K.pill(draw, 0, 520 + yy, "IF", coral, size=40, left=350)
                draw.text((470, 522 + yy), "the button is pressed", fill=ink, font=font(52, bold=True))
                K.pill(draw, 0, 650 + yy, "THEN", sage, size=40, left=350)
                draw.text((540, 652 + yy), "play a sound", fill=ink, font=font(52, bold=True))
                doorbell(draw, 1320, 630 + yy, 1.1)
                K.draw_padlock(draw, 1660, 610 + yy, 0.75, K.GOLD)
            return True
        if focus == "doorbell":
            door(draw, 220, 330, 560, 860)
            pressed = int(t * 6) % 2 == 0
            doorbell(draw, 690, 560, 1.1, pressed=pressed)
            finger(draw, 690, 580 + (0 if pressed else 24), 0.9)
            K.draw_notes(draw, 790, 380, 1.1, t, coral)
            rows = [("Today", "Ding dong!"), ("Next week", "Ding dong!"), ("Next year", "Ding dong!")]
            for i, (when, snd) in enumerate(rows):
                a = K.stagger(progress, i, step=0.2, speed=4)
                if a <= 0:
                    continue
                y = 290 + i * 150 + int((1 - a) * 20)
                draw.rounded_rectangle((950, y, 1740, y + 120), radius=60, fill=panel, outline=line, width=3)
                draw.text((1000, y + 36), when, fill=muted, font=font(44, bold=True))
                draw.text((1340, y + 36), snd, fill=coral, font=font(44, bold=True))
            a = K.stagger(progress, 4, step=0.15, speed=4)
            if a > 0:
                K.pill(draw, 1345, 770 + int((1 - a) * 20), "Exactly the same!", sage, size=38)
            return True
        if focus == "alarm":
            alarm_clock(draw, 420, 540, 1.15, t, ringing=True)
            K.pill(draw, 420, 760, "6:30 → ring", coral, size=40)
            days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Birthday!"]
            for i, d in enumerate(days):
                a = K.stagger(progress, i, step=0.08, speed=5)
                if a <= 0:
                    continue
                r_, c_ = divmod(i, 4)
                x0 = 800 + c_ * 240
                y0 = 290 + r_ * 260 + int((1 - a) * 20)
                special = d == "Birthday!"
                draw.rounded_rectangle((x0 + 6, y0 + 8, x0 + 216 + 6, y0 + 220 + 8), radius=28, fill=K.SHADOW)
                draw.rounded_rectangle((x0, y0, x0 + 216, y0 + 220), radius=28, fill=coral_soft if special else panel,
                                       outline=coral if special else line, width=4 if special else 2)
                K.text_at(draw, d, x0 + 108, y0 + 22, font(34 if special else 42, bold=True), coral if special else ink)
                alarm_clock(draw, x0 + 108, y0 + 132, 0.3, t + i * 0.1)
                K.text_at(draw, "RING!", x0 + 108, y0 + 176, font(28, bold=True), K.DANGER)
            return True
        if focus == "torch":
            for k, (lab, on) in enumerate((("Switch on", True), ("Switch off", False))):
                x0 = 200 if k == 0 else 1010
                bgc = (255, 250, 230) if on else (232, 234, 242)
                draw.rounded_rectangle((x0 + 10, 300 + 12, x0 + 710 + 10, 850 + 12), radius=40, fill=K.SHADOW)
                draw.rounded_rectangle((x0, 300, x0 + 710, 850), radius=40, fill=bgc, outline=K.GOLD if on else K.DEV_MID,
                                       width=5)
                torch(draw, x0 + 210, 520, 1.0, on=on, beam=330, spread=0.3)
                K.text_at(draw, lab, x0 + 355, 670, font(52, bold=True), ink)
                K.text_at(draw, "Light", x0 + 200, 750, font(44, bold=True), muted)
                K.draw_arrow(draw, x0 + 290, 776, x0 + 360, 776, muted, width=8, head=22)
                K.text_at(draw, "ON" if on else "OFF", x0 + 450, 750, font(44, bold=True), coral if on else K.DEV_MID)
            K.pill(draw, cx, 228, "One fixed rule", coral, size=34)
            return True
        # never
        bed(draw, 160, 900, 640, t)
        for k in range(3):
            zx, zy = 380 + k * 56, 440 - k * 56 + 6 * math.sin(t * 8 + k)
            K.text_at(draw, "z", zx, zy, font(40 + k * 10, bold=True), AIC)
        K.draw_bubble(draw, (330, 236, 900, 340), brand, "Let me sleep on Saturdays!", tail="left", size=36)
        alarm_clock(draw, 1250, 600, 0.95, t, ringing=False)
        K.draw_bubble(draw, (1080, 236, 1760, 400), brand, "I only know one rule: 6:30 → ring.", tail="left", size=38)
        a = K.stagger(progress, 3, step=0.15, speed=4)
        if a > 0:
            y = 790 + int((1 - a) * 20)
            bx = K.pill(draw, 1560, y, "learns: never", K.DANGER, size=34)
            K.draw_cross(draw, bx[0] - 34, (bx[1] + bx[3]) / 2, 24, K.DANGER)
        return True

    # ---- predict: Sunday morning ---------------------------------------------------------
    if visual == "b2-predict":
        ans = focus == "answer"
        bed(draw, 160, 900, 640, t, awake=ans)
        calendar(draw, 1100, 400, 0.8, "SUN", "", K.DANGER)
        K.text_at(draw, "Sleep in!", 1100, 400, font(34, bold=True), coral)
        if ans:
            alarm_clock(draw, 1500, 560, 1.0, t, ringing=True)
            ring_text(1500, 236, 60)
            K.pill(draw, 1500, 790, "Fixed rule: 6:30 → ring", coral, size=34)
            K.text_at(draw, "Poor Kabir!", 530, 790, font(40, bold=True), muted)
        else:
            alarm_clock(draw, 1500, 560, 1.0, t)
            K.text_at(draw, "What will it do?", 1500, 236, font(48, bold=True), ink)
            for k in range(3):
                zx, zy = 380 + k * 56, 440 - k * 56 + 6 * math.sin(t * 8 + k)
                K.text_at(draw, "z", zx, zy, font(40 + k * 10, bold=True), AIC)
            K.draw_stopwatch(draw, 1100, 680, 50, progress, brand)
            question_marks([(1740, 400)], 70)
        return True

    # ---- smart programs learn ------------------------------------------------------------
    if visual == "b2-smart":
        if focus == "intro":
            draw.text((180, 270 + lift), "SMART", fill=AIC, font=font(100, bold=True))
            parts = [("learns from examples", ink), ("and changes what it does", ink), ("after seeing more!", sage)]
            for i, (txt, col) in enumerate(parts):
                a = K.stagger(progress, i, step=0.16, speed=4)
                if a <= 0:
                    continue
                draw.text((184, 430 + i * 80 + int((1 - a) * 20)), txt, fill=col, font=font(54, bold=True))
            draw.ellipse((1380 - 260, 560 - 260, 1380 + 260, 560 + 260), fill=lav_soft)
            pixi(draw, 1380, 590, 0.9, t, face="wow")
            for k in range(6):
                ang = t * 2.4 + k * math.pi / 3
                px = 1380 + math.cos(ang) * 330
                py = 560 + math.sin(ang) * 250
                if py > 790:
                    py = 790
                pet_photo(draw, (px - 52, py - 56, px + 52, py + 56), "cat" if k % 2 else "dog",
                          [CAT_ORANGE, DOG_GOLD, CAT_GREY, DOG_BROWN, CAT_BLACK, DOG_GOLD][k])
            return True
        if focus == "learn":
            K.shadow_card(draw, (160, 250, 1100, 850), brand, radius=40, accent=AIC)
            K.text_at(draw, "Gets better at its job", 630, 310, font(48, bold=True), AIC)
            bars = [("a few", 0.3), ("more", 0.6), ("lots!", 0.92)]
            for i, (lab, hgt) in enumerate(bars):
                a = K.stagger(progress, i, step=0.2, speed=4)
                x = 370 + i * 260
                base = 740
                hh = 330 * hgt * a
                draw.rounded_rectangle((x - 70, base - hh, x + 70, base), radius=18,
                                       fill=[K.DANGER, K.GOLD, sage][i] if a > 0 else line)
                K.text_at(draw, lab, x, 760, font(36, bold=True), muted)
            draw.line((240, 740, 1020, 740), fill=K.DEV_MID, width=4)
            K.text_at(draw, "examples seen →", 630, 806, font(30, bold=True), muted)
            a = K.stagger(progress, 3, step=0.18, speed=4)
            if a > 0:
                yy = int((1 - a) * 20)
                draw.rounded_rectangle((1180, 300 + yy, 1760, 520 + yy), radius=40, fill=K.DANGER_SOFT, outline=K.DANGER,
                                       width=4)
                K.draw_cross(draw, 1240, 410 + yy, 30, K.DANGER)
                label_lines(("Not thinking", "like you"), 1500, 352 + yy, size=44)
                draw.rounded_rectangle((1180, 580 + yy, 1760, 800 + yy), radius=40, fill=sage_soft, outline=sage, width=4)
                K.draw_check(draw, 1240, 690 + yy, 30, sage)
                label_lines(("Better from", "more examples"), 1500, 632 + yy, size=44)
            return True
        if focus == "voice":
            speaker(draw, cx, 590, 1.3, t)
            cities = [("Delhi", 420, 300), ("Chennai", 360, 560), ("Kolkata", 480, 790 - 40), ("Mumbai", 1500, 300),
                      ("Jaipur", 1560, 560), ("Guwahati", 1440, 750)]
            for i, (city, x, y) in enumerate(cities):
                a = K.stagger(progress, i, step=0.1, speed=5)
                if a <= 0:
                    continue
                K.draw_dashed(draw, x + (120 if x < cx else -120), y, cx + (-130 if x < cx else 130), 560, PIXI_LIGHT,
                              width=4, phase=t * 100)
                fx = x - 120 if x < cx else x + 120
                K.draw_face(draw, fx, y, 42 * a, "nani" if i % 3 == 2 else "kid", 0.5)
                K.pill(draw, x + (10 if x < cx else -10), y - 26, city, [coral, sage, AIC, K.ROAD, coral, sage][i], size=32)
            K.pill(draw, cx, 236, "Millions of voices!", AIC, size=36)
            return True
        # better
        K.text_at(draw, "Understanding accents", cx, 250, font(52, bold=True), ink)
        x0, x1, y = 360, 1560, 350
        draw.rounded_rectangle((x0, y, x1, y + 60), radius=30, fill=line)
        lvl = 0.25 + 0.7 * K.ease_out_cubic(K.clamp01(progress * 1.4))
        draw.rounded_rectangle((x0, y, x0 + (x1 - x0) * lvl, y + 60), radius=30,
                               fill=K.DANGER if lvl < 0.4 else K.GOLD if lvl < 0.7 else sage)
        K.text_at(draw, "more examples → better", cx, 430, font(36, bold=True), muted)
        for k, (title, ok) in enumerate((("At first", False), ("After millions of voices", True))):
            a = 1.0 if k == 0 else K.stagger(progress, 3, step=0.15, speed=4)
            if a <= 0:
                continue
            bx0 = 240 if k == 0 else 1000
            yy = int((1 - a) * 20)
            col = sage if ok else K.DANGER
            draw.rounded_rectangle((bx0, 510 + yy, bx0 + 680, 850 + yy), radius=36, fill=sage_soft if ok else K.DANGER_SOFT,
                                   outline=col, width=4)
            K.text_at(draw, title, bx0 + 340, 534 + yy, font(36, bold=True), col)
            speaker(draw, bx0 + 120, 720 + yy, 0.5, t)
            K.draw_bubble(draw, (bx0 + 230, 610 + yy, bx0 + 650, 720 + yy), brand, "Got it!" if ok else "Huh? Pardon?",
                          tail="left", size=36)
            (K.draw_check if ok else K.draw_cross)(draw, bx0 + 440, 790 + yy, 26, col)
        return True

    # ---- spellcheck, photo search, video suggestions ------------------------------------
    if visual == "b2-spell":
        if focus in ("typo", "fix"):
            fix = focus == "fix"
            cx0, cx1 = (180, 1180) if fix else (360, 1560)
            K.shadow_card(draw, (cx0, 250, cx1, 850), brand, radius=36)
            draw.rounded_rectangle((cx0, 250, cx1, 340), radius=36, fill=sage)
            draw.rectangle((cx0, 300, cx1, 340), fill=sage)
            K.draw_heart(draw, cx0 + 60, 300, 20, (255, 255, 255))
            draw.text((cx0 + 100, 274), "To: Nani", fill=(255, 255, 255), font=font(40, bold=True))
            mx = cx0 + 60
            draw.rounded_rectangle((mx - 10, 390, cx1 - 60, 580), radius=30, fill=coral_soft)
            draw.text((mx + 20, 412), "Sorry Nani, I'm late", fill=ink, font=font(48, bold=True))
            f = font(48, bold=True)
            word = "because" if fix and progress > 0.3 else "becuase"
            draw.text((mx + 20, 494), word, fill=ink, font=f)
            wb = draw.textbbox((mx + 20, 494), word, font=f)
            draw.text((wb[2] + 14, 494), "of the rain!", fill=ink, font=f)
            if not (fix and progress > 0.3):
                pts = [(wb[0] + k * 14, wb[3] + 10 + (6 if k % 2 else -2)) for k in range(int((wb[2] - wb[0]) / 14) + 1)]
                draw.line(pts, fill=K.DANGER, width=5, joint="curve")
            if fix:
                bx = K.pill(draw, (wb[0] + wb[2]) / 2, 610, "because", sage, size=40)
                K.draw_check(draw, bx[2] + 34, (bx[1] + bx[3]) / 2, 24, sage)
                K.draw_arrow(draw, (wb[0] + wb[2]) / 2, 606, (wb[0] + wb[2]) / 2, 566, sage, width=6, head=18)
                book_stack(draw, 1460, 690, 1.1)
                for k in range(3):
                    K.draw_page(draw, 1290 + k * 160, 330 + (k % 2) * 30, 0.7, brand)
                K.text_at(draw, "Learned from", 1460, 730, font(40, bold=True), ink)
                K.text_at(draw, "lots of writing", 1460, 780, font(40, bold=True), sage)
            else:
                K.draw_device(draw, "keyboard", (cx0 + cx1) / 2, 740, 1.0, brand, t=t)
                K.text_at(draw, "Oops!", cx1 + 120, 470, font(52, bold=True), K.DANGER)
            return True
        if focus == "photos":
            scr = phone(draw, 480, 555, 1.32)
            sx0, sy0, sx1, sy1 = scr
            draw.rounded_rectangle((sx0 + 10, sy0 + 12, sx1 - 10, sy0 + 70), radius=29, fill=(238, 240, 246))
            K.draw_magnifier(draw, sx0 + 44, sy0 + 40, 0.16, K.DEV_MID)
            draw.text((sx0 + 80, sy0 + 20), "dog", fill=ink, font=font(36, bold=True))
            for k in range(6):
                a = K.stagger(progress, k, step=0.06, speed=5)
                if a <= 0:
                    continue
                r_, c_ = divmod(k, 2)
                bx0 = sx0 + 12 + c_ * 152
                by0 = sy0 + 88 + r_ * 146
                thumb(draw, (bx0, by0, bx0 + 140, by0 + 134), t, "dog")
            K.draw_arrow(draw, 1080, 560, 700, 560, muted, width=12, head=34)
            for k in range(5):
                pet_photo(draw, (1160 + k * 90, 300 + (k % 2) * 60, 1360 + k * 90, 510 + (k % 2) * 60), "dog",
                          [DOG_GOLD, DOG_BROWN, DOG_DARK, DOG_GOLD, DOG_BROWN][k], [(214, 236, 250), (232, 244, 220)][k % 2])
            K.text_at(draw, "Learned from", 1440, 680, font(44, bold=True), ink)
            K.text_at(draw, "lots of dog photos", 1440, 736, font(44, bold=True), sage)
            return True
        # videos
        for k, (title, kinds) in enumerate((("Before", ["cricket", "cricket", "cricket"]),
                                            ("After watching animals", ["cat", "dog", "cat"]))):
            x = 520 if k == 0 else 1400
            if k == 1:
                a = K.stagger(progress, 2, step=0.15, speed=4)
                if a <= 0:
                    continue
            scr = phone(draw, x, 575, 1.1)
            sx0, sy0, sx1, sy1 = scr
            K.text_at(draw, title, x, 236, font(38, bold=True), [muted, sage][k])
            for j, kind in enumerate(kinds):
                yy = sy0 + 16 + j * 140
                thumb(draw, (sx0 + 12, yy, sx0 + 140, yy + 120), t + j * 0.3, kind)
                draw.rounded_rectangle((sx0 + 154, yy + 24, sx1 - 12, yy + 40), radius=8, fill=line)
                draw.rounded_rectangle((sx0 + 154, yy + 60, sx1 - 40, yy + 74), radius=7, fill=line)
        K.draw_arrow(draw, 760, 560, 1150, 560, coral, width=14, head=40)
        label_lines(("watch more", "animal videos"), cx, 600, size=36, col=coral)
        return True

    # ---- the super question ---------------------------------------------------------------
    if visual == "b2-test":
        if focus == "ask":
            K.shadow_card(draw, (200, 260 + lift, 1300, 820 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "THE SUPER QUESTION", 750, 320 + lift, font(38, bold=True), coral)
            label_lines(("Does it change", "what it does,", "after more examples?"), 750, 420 + lift, size=66)
            pixi(draw, 1560, 600, 0.85, t, face="think")
            K.draw_magnifier(draw, 1380, 690, 0.8, coral)
            return True
        draw.rounded_rectangle((140 + 8, 380 + 10, 640 + 8, 700 + 10), radius=36, fill=K.SHADOW)
        draw.rounded_rectangle((140, 380, 640, 700), radius=36, fill=panel, outline=coral, width=5)
        label_lines(("Does it change", "after more", "examples?"), 390, 430, size=46)
        K.draw_curve(draw, (640, 480), (760, 380), (890, 380), sage, width=12)
        draw.polygon([(890, 360), (930, 380), (890, 400)], fill=sage)
        K.pill(draw, 720, 300, "YES", sage, size=34)
        yb = (950, 250, 1770, 520)
        draw.rounded_rectangle((yb[0] + 8, yb[1] + 10, yb[2] + 8, yb[3] + 10), radius=36, fill=K.SHADOW)
        draw.rounded_rectangle(yb, radius=36, fill=lav_soft, outline=AIC, width=5)
        K.text_at(draw, "It may be AI", 1360, 276, font(52, bold=True), AIC)
        gadget("voice", 1120, 430, 0.75)
        gadget("spell", 1360, 430, 0.75)
        pixi(draw, 1620, 430, 0.32, t, face="happy")
        if focus == "no":
            K.draw_curve(draw, (640, 600), (760, 700), (890, 700), coral, width=12)
            draw.polygon([(890, 680), (930, 700), (890, 720)], fill=coral)
            K.pill(draw, 720, 730, "NO", coral, size=34)
            nb = (950, 570, 1770, 840)
            draw.rounded_rectangle((nb[0] + 8, nb[1] + 10, nb[2] + 8, nb[3] + 10), radius=36, fill=K.SHADOW)
            draw.rounded_rectangle(nb, radius=36, fill=sage_soft, outline=sage, width=5)
            K.text_at(draw, "Simple, fixed rule", 1360, 596, font(52, bold=True), sage)
            gadget("doorbell", 1140, 750, 0.7)
            gadget("alarm", 1360, 750, 0.75)
            gadget("torch", 1600, 750, 0.85)
            for k, lab in enumerate(("Has a screen?", "Expensive?")):
                a = K.stagger(progress, 3 + k, step=0.12, speed=4)
                if a <= 0:
                    continue
                x = 250 + k * 290
                bx = K.pill(draw, x, 780, lab, K.DEV_MID, size=28)
                draw.line((bx[0] - 6, (bx[1] + bx[3]) / 2, bx[2] + 6, (bx[1] + bx[3]) / 2), fill=K.DANGER, width=6)
            K.text_at(draw, "don't help:", 390, 730, font(30, bold=True), muted)
        return True

    # ---- sort it ------------------------------------------------------------------------
    if visual == "b2-sort":
        items = [("alarm", ("Alarm", "clock"), False), ("spell", ("Spellcheck",), True),
                 ("doorbell", ("Doorbell",), False), ("voice", ("Voice", "assistant"), True),
                 ("calc", ("Calculator",), False), ("photos", ("Photo", "search"), True)]
        if focus == "intro":
            for k, (lab, sub, col, soft) in enumerate((("FIXED RULE", "same thing every time", sage, sage_soft),
                                                       ("LEARNS", "from examples", AIC, lav_soft))):
                a = K.stagger(progress, k, step=0.2, speed=4)
                if a <= 0:
                    continue
                x = cx + (k * 2 - 1) * 480
                y = 330 + int((1 - a) * 40)
                draw.rounded_rectangle((x - 300 + 8, y + 10, x + 300 + 8, y + 420 + 10), radius=44, fill=K.SHADOW)
                draw.rounded_rectangle((x - 300, y, x + 300, y + 420), radius=44, fill=soft, outline=col, width=6)
                K.text_at(draw, lab, x, y + 40, font(60, bold=True), col)
                K.text_at(draw, sub, x, y + 120, font(36, bold=True), muted)
                if k == 0:
                    doorbell(draw, x - 100, y + 290, 0.9)
                    torch(draw, x + 60, y + 300, 0.55, on=False)
                else:
                    speaker(draw, x - 100, y + 290, 0.6, t)
                    pixi(draw, x + 120, y + 290, 0.3, t, face="happy")
            pixi(draw, cx, 560, 0.5, t, face="think")
            return True
        ans = focus == "answer"
        cw = 260
        gap = 22
        ask_x0 = cx - (6 * cw + 5 * gap) / 2
        if ans:
            for k, (lab, col, soft) in enumerate((("FIXED RULE", sage, sage_soft), ("LEARNS FROM EXAMPLES", AIC, lav_soft))):
                bx0 = 130 if k == 0 else 990
                draw.rounded_rectangle((bx0, 240, bx0 + 800, 866), radius=40, fill=soft, outline=col, width=5)
                K.text_at(draw, lab, bx0 + 400, 262, font(42, bold=True), col)
        li, ri = 0, 0
        for i, (kind, lab, learns) in enumerate(items):
            if ans:
                slot = ri if learns else li
                a = K.stagger(progress, slot + (4 if learns else 0), step=0.08, speed=5)
                if learns:
                    ri += 1
                else:
                    li += 1
                if a <= 0:
                    continue
                x0 = (990 if learns else 130) + 22 + slot * (cw + 4)
                y0 = 340 + (1 - a) * 50
            else:
                x0 = ask_x0 + i * (cw + gap)
                y0 = 330
            col = (AIC if learns else sage) if ans else line
            K.shadow_card(draw, (x0, y0, x0 + cw, y0 + 470), brand, radius=28, outline=col, outline_w=5 if ans else 3)
            mx = x0 + cw / 2
            gadget(kind, mx, y0 + 170, 0.82)
            label_lines(lab, mx, y0 + 330, size=36)
            if not ans:
                K.pill(draw, mx, y0 + 20 - 70, "?", AIC, size=30)
        if not ans:
            K.pill(draw, cx - 40, 222, "Which ones learn from examples?", AIC, size=32)
            K.draw_stopwatch(draw, cx + 330, 252, 32, progress, brand)
        return True

    # ---- people design programs -----------------------------------------------------------
    if visual == "b2-people":
        if focus == "design":
            draw.rounded_rectangle((180, 650, 900, 690), radius=12, fill=WOOD)
            draw.rectangle((220, 690, 250, 860), fill=WOOD_DARK)
            draw.rectangle((830, 690, 860, 860), fill=WOOD_DARK)
            K.draw_person(draw, 360, 470, 1.15, "teacher", t)
            K.draw_device(draw, "laptop", 680, 560, 0.8, brand, t=t)
            for k in range(3):
                draw.rounded_rectangle((570, 490 + k * 26, 570 + [180, 130, 160][k], 504 + k * 26), radius=7,
                                       fill=[AIC, coral, sage][k])
            draw.rounded_rectangle((430, 250, 900, 400), radius=20, fill=(230, 240, 252), outline=K.ROAD, width=4)
            for k in range(3):
                draw.rounded_rectangle((460 + k * 150, 290, 560 + k * 150, 360), radius=12, outline=K.ROAD, width=4)
                if k < 2:
                    K.draw_arrow(draw, 562 + k * 150, 325, 608 + k * 150, 325, K.ROAD, width=4, head=12)
            K.shadow_card(draw, (1000, 280 + lift, 1760, 800 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "DESIGNER", 1380, 350 + lift, font(72, bold=True), coral)
            K.text_at(draw, "the person who", 1380, 480 + lift, font(46, bold=True), muted)
            K.text_at(draw, "writes and plans", 1380, 550 + lift, font(52, bold=True), ink)
            K.text_at(draw, "a program", 1380, 620 + lift, font(52, bold=True), ink)
            return True
        if focus == "both":
            for k, (title, col, soft) in enumerate((("Simple program", sage, sage_soft), ("AI program", AIC, lav_soft))):
                a = K.stagger(progress, k, step=0.3, speed=4)
                if a <= 0:
                    continue
                x0 = 200 if k == 0 else 1010
                yy = int((1 - a) * 40)
                draw.rounded_rectangle((x0 + 10, 250 + yy + 12, x0 + 710 + 10, 850 + yy + 12), radius=40, fill=K.SHADOW)
                draw.rounded_rectangle((x0, 250 + yy, x0 + 710, 850 + yy), radius=40, fill=soft, outline=col, width=5)
                K.text_at(draw, title, x0 + 355, 280 + yy, font(52, bold=True), col)
                K.draw_person(draw, x0 + 170, 480 + yy, 0.85, "teacher" if k == 0 else "mom", t)
                if k == 0:
                    doorbell(draw, x0 + 500, 520 + yy, 1.2)
                else:
                    pixi(draw, x0 + 500, 540 + yy, 0.55, t, face="happy")
                K.draw_dashed(draw, x0 + 260, 520 + yy, x0 + 390, 520 + yy, col, width=6, phase=t * 100)
                K.pill(draw, x0 + 355, 740 + yy, "made by people", col, size=36)
            return True
        if focus == "examples":
            K.draw_person(draw, 300, 470, 1.15, "mom", t)
            photos = [("cat", CAT_ORANGE, True), ("cat", CAT_GREY, True), ("dog", DOG_GOLD, False),
                      ("cat", CAT_BLACK, True)]
            for k, (kind, col, keep) in enumerate(photos):
                a = K.stagger(progress, k, step=0.15, speed=4)
                if a <= 0:
                    continue
                x0 = 520 + k * 220
                y0 = 290 + int((1 - a) * 30)
                pet_photo(draw, (x0, y0, x0 + 190, y0 + 200), kind, col)
                (K.draw_check if keep else K.draw_cross)(draw, x0 + 170, y0 + 20, 26, sage if keep else K.DANGER)
            draw.rounded_rectangle((560, 620, 1300, 840), radius=30, fill=K.GOLD)
            draw.rounded_rectangle((560, 600, 820, 650), radius=20, fill=K.GOLD)
            K.text_at(draw, "Cat examples", 930, 690, font(52, bold=True), ink)
            K.draw_arrow(draw, 1330, 720, 1440, 720, muted, width=12, head=34)
            pixi(draw, 1600, 620, 0.62, t, face="wow")
            return True
        # charge
        for k, kind in enumerate(("dad", "mom", "teacher")):
            K.draw_person(draw, 260 + k * 230, 480 + (k % 2) * 30, 0.95, kind, t + k * 0.2)
        K.pill(draw, 490, 740, "People are in charge!", sage, size=40)
        draw.ellipse((1400 - 230, 560 - 230, 1400 + 230, 560 + 230), fill=lav_soft)
        pixi(draw, 1400, 580, 0.75, t, face="smile")
        a = K.stagger(progress, 1, step=0.2, speed=4)
        if a > 0:
            bx = K.pill(draw, 1400, 236, "builds itself?", K.DEV_MID, size=34)
            draw.line((bx[0] - 6, (bx[1] + bx[3]) / 2, bx[2] + 6, (bx[1] + bx[3]) / 2), fill=K.DANGER, width=7)
            K.draw_cross(draw, bx[2] + 40, (bx[1] + bx[3]) / 2, 24, K.DANGER)
        K.draw_arrow(draw, 900, 560, 1110, 560, sage, width=12, head=34)
        return True

    # ---- checkpoint -------------------------------------------------------------------
    if visual == "b2-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 270 + lift, w - 460, 790 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 350 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Smart or simple?", cx, 430 + lift, font(60, bold=True), ink)
            torch(draw, cx - 80, 650 + lift, 0.8, on=True, beam=140)
            return True
        ans = focus == "answer"
        draw.rounded_rectangle((130 + 10, 230 + 12, 1100 + 10, 870 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((130, 230, 1100, 870), radius=24, fill=(255, 250, 238))
        label_lines(("Is a torch AI?", "Why or why not?"), 615, 262, size=48, col=coral)
        rows = [("No, it is not AI!", ""), ("One fixed rule:", "switch on, light on"),
                ("It never learns from", "examples or changes")]
        for i, (l1, l2) in enumerate(rows):
            y = 420 + i * 146
            draw.line((180, y + 128, 1050, y + 128), fill=(220, 210, 232), width=3)
            shown = ans and progress * 3.2 - 0.3 > i
            if shown:
                K.draw_check(draw, 210, y + 44, 24, sage)
                draw.text((250, y + 10 + (24 if not l2 else 0)), l1, fill=sage if i == 0 else ink,
                          font=font(44 if i == 0 else 40, bold=True))
                if l2:
                    draw.text((250, y + 62), l2, fill=muted, font=font(38, bold=True))
            elif not ans and i == 1:
                K.text_at(draw, "?", 615, y - 40, font(120, bold=True), line)
        mini(draw, 1300, 470, 0.95, t)
        torch(draw, 1450, 700, 0.75, on=True, beam=200)
        if ans:
            K.pill(draw, 1480, 790, "fixed rule", sage, size=32)
        else:
            K.draw_stopwatch(draw, 1640, 330, 48, progress, brand)
        return True

    # ---- recap ----------------------------------------------------------------------
    if visual == "b2-recap":
        recap = [(("Simple =", "fixed rules"), sage, "simple"), (("AI changes with", "more examples"), AIC, "smart"),
                 (("A torch is", "not AI"), K.DANGER, "torch"), (("People design", "both"), coral, "people")]
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
                ix, iy = x0 + 200, y0 + 190
                if kind == "simple":
                    doorbell(draw, ix - 70, iy, 1.0)
                    K.draw_notes(draw, ix + 80, iy - 30, 0.9, t, coral)
                elif kind == "smart":
                    for k in range(3):
                        hh = 60 + k * 50
                        draw.rounded_rectangle((ix - 150 + k * 60, iy + 100 - hh, ix - 110 + k * 60, iy + 100), radius=10,
                                               fill=[K.DANGER, K.GOLD, sage][k])
                    pixi(draw, ix + 80, iy + 10, 0.36, t, face="happy")
                elif kind == "torch":
                    torch(draw, ix - 40, iy, 0.7, on=True, beam=80)
                    draw.line((ix - 150, iy - 110, ix + 150, iy + 110), fill=K.DANGER, width=14)
                else:
                    K.draw_person(draw, ix - 80, iy - 20, 0.7, "teacher", t)
                    pixi(draw, ix + 90, iy + 20, 0.3, t, face="happy")
                label_lines(lab, x0 + 200, y0 + 390, size=36)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 450, 110, sage, panel, bounce)
            pixi(draw, cx + 300, 470, 0.6, t, face="happy", wave=t)
            K.text_at(draw, "Chapter 2 done!", cx, 670, font(68, bold=True), ink)
            K.pill(draw, cx, 770, "Smart vs. simple: sorted!", AIC, size=36)
            stars_around(320, 560, 8)
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False

"""B1 · Meet AI — Magic or Math? — visuals."""
import math

import build as K

PIXI = (112, 92, 226)
PIXI_DARK = (76, 58, 176)
PIXI_LIGHT = (206, 198, 252)
SCREEN = (30, 28, 60)
GLOW = (110, 232, 255)
PINK = (250, 170, 180)
PINK_DARK = (226, 110, 130)
CAT_ORANGE = (244, 160, 70)
CAT_GREY = (150, 156, 168)
CAT_BLACK = (70, 70, 82)
CAT_CREAM = (250, 232, 206)
FOX = (232, 112, 40)
FOX_DARK = (120, 60, 30)
GRASS = (122, 194, 108)
GRASS_DARK = (92, 164, 84)
PITCH = (226, 204, 150)
WOOD = (214, 170, 120)
WOOD_DARK = (176, 128, 84)
LCD = (196, 226, 200)
BEAD_RED = (226, 64, 72)
BEAD_YELLOW = (255, 196, 50)
BEAD_BLUE = (62, 132, 226)
SOFA = (96, 160, 200)
SOFA_DARK = (70, 126, 166)


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


def cat(draw, cx, cy, r, col, eyes="open", stripes=True):
    dark = tuple(int(c * 0.72) for c in col)
    for sx in (-1, 1):
        draw.polygon([(cx + sx * r * 0.98, cy - r * 0.2), (cx + sx * r * 0.78, cy - r * 1.28),
                      (cx + sx * r * 0.16, cy - r * 0.78)], fill=col)
        draw.polygon([(cx + sx * r * 0.82, cy - r * 0.42), (cx + sx * r * 0.74, cy - r * 1.02),
                      (cx + sx * r * 0.4, cy - r * 0.76)], fill=PINK)
    draw.ellipse((cx - r, cy - r * 0.92, cx + r, cy + r * 0.86), fill=col)
    if stripes:
        for k in (-1, 0, 1):
            draw.line((cx + k * r * 0.24, cy - r * 0.88, cx + k * r * 0.18, cy - r * 0.52), fill=dark,
                      width=max(2, int(r * 0.09)))
    draw.ellipse((cx - r * 0.44, cy + r * 0.12, cx + r * 0.44, cy + r * 0.66), fill=(255, 250, 244))
    for sx in (-1, 1):
        ex, ey = cx + sx * r * 0.4, cy - r * 0.12
        if eyes == "sleep":
            draw.arc((ex - r * 0.18, ey - r * 0.14, ex + r * 0.18, ey + r * 0.14), 20, 160, fill=K.DEV_DEEP,
                     width=max(2, int(r * 0.07)))
        else:
            draw.ellipse((ex - r * 0.16, ey - r * 0.2, ex + r * 0.16, ey + r * 0.2), fill=(132, 196, 92))
            draw.ellipse((ex - r * 0.05, ey - r * 0.17, ex + r * 0.05, ey + r * 0.17), fill=K.DEV_DEEP)
    draw.polygon([(cx - r * 0.11, cy + r * 0.16), (cx + r * 0.11, cy + r * 0.16), (cx, cy + r * 0.29)], fill=PINK_DARK)
    mw = max(2, int(r * 0.05))
    draw.arc((cx - r * 0.16, cy + r * 0.2, cx, cy + r * 0.42), 0, 180, fill=K.DEV_DEEP, width=mw)
    draw.arc((cx, cy + r * 0.2, cx + r * 0.16, cy + r * 0.42), 0, 180, fill=K.DEV_DEEP, width=mw)
    ww = max(2, int(r * 0.04))
    for sx in (-1, 1):
        for k in (-1, 0, 1):
            draw.line((cx + sx * r * 0.34, cy + r * 0.34 + k * r * 0.07, cx + sx * r * 1.2, cy + r * 0.24 + k * r * 0.22),
                      fill=K.DEV_DARK, width=ww)


def fox(draw, cx, cy, r):
    draw.ellipse((cx + r * 0.5, cy + r * 0.3, cx + r * 2.1, cy + r * 1.0), fill=FOX)
    draw.ellipse((cx + r * 1.6, cy + r * 0.42, cx + r * 2.12, cy + r * 0.9), fill=(255, 250, 244))
    for sx in (-1, 1):
        draw.polygon([(cx + sx * r * 0.95, cy - r * 0.3), (cx + sx * r * 0.88, cy - r * 1.5),
                      (cx + sx * r * 0.22, cy - r * 0.78)], fill=FOX)
        draw.polygon([(cx + sx * r * 0.92, cy - r * 1.1), (cx + sx * r * 0.88, cy - r * 1.5),
                      (cx + sx * r * 0.62, cy - r * 1.22)], fill=FOX_DARK)
    draw.ellipse((cx - r, cy - r * 0.95, cx + r, cy + r * 0.25), fill=FOX)
    draw.polygon([(cx - r * 0.98, cy - r * 0.3), (cx + r * 0.98, cy - r * 0.3), (cx + r * 0.3, cy + r * 0.82),
                  (cx, cy + r * 1.02), (cx - r * 0.3, cy + r * 0.82)], fill=FOX)
    for sx in (-1, 1):
        draw.polygon([(cx + sx * r * 0.96, cy - r * 0.12), (cx + sx * r * 0.08, cy + r * 0.18),
                      (cx, cy + r * 1.0), (cx + sx * r * 0.32, cy + r * 0.8)], fill=(255, 250, 244))
    draw.ellipse((cx - r * 0.14, cy + r * 0.86, cx + r * 0.14, cy + r * 1.06), fill=K.DEV_DEEP)
    for sx in (-1, 1):
        ex, ey = cx + sx * r * 0.4, cy - r * 0.28
        draw.polygon([(ex - r * 0.18, ey), (ex, ey - r * 0.12), (ex + r * 0.18, ey), (ex, ey + r * 0.1)],
                     fill=K.DEV_DEEP)
    ww = max(2, int(r * 0.035))
    for sx in (-1, 1):
        for k in (-1, 1):
            draw.line((cx + sx * r * 0.12, cy + r * 0.82 + k * r * 0.04, cx + sx * r * 0.7, cy + r * 0.74 + k * r * 0.14),
                      fill=K.DEV_DARK, width=ww)


def photo(draw, box, bg=(214, 236, 250), tilt=0):
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 8, y0 + 10, x1 + 8, y1 + 10), radius=16, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=16, fill=(255, 255, 255), outline=(222, 214, 200), width=2)
    pad = max(8, int((x1 - x0) * 0.05))
    inner = (x0 + pad, y0 + pad, x1 - pad, y1 - pad * 2.4)
    draw.rectangle(inner, fill=bg)
    return inner


def cat_photo(draw, box, col, bg=(214, 236, 250), eyes="open"):
    ix0, iy0, ix1, iy1 = photo(draw, box, bg)
    r = min(ix1 - ix0, iy1 - iy0) * 0.3
    cat(draw, (ix0 + ix1) / 2, (iy0 + iy1) / 2 + r * 0.25, r, col, eyes=eyes, stripes=col != CAT_BLACK)


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


def thumb(draw, box, t, play=True):
    x0, y0, x1, y1 = box
    w, h = x1 - x0, y1 - y0
    draw.rounded_rectangle(box, radius=int(min(w, h) * 0.12), fill=GRASS)
    draw.polygon([(x0 + w * 0.38, y0 + h * 0.18), (x0 + w * 0.62, y0 + h * 0.18), (x0 + w * 0.72, y1 - h * 0.06),
                  (x0 + w * 0.28, y1 - h * 0.06)], fill=PITCH)
    sw = max(2, int(w * 0.022))
    for k in (-1, 0, 1):
        sx = x0 + w * 0.5 + k * w * 0.04
        draw.line((sx, y0 + h * 0.3, sx, y0 + h * 0.62), fill=(255, 255, 255), width=sw)
    draw.line((x0 + w * 0.45, y0 + h * 0.3, x0 + w * 0.55, y0 + h * 0.3), fill=K.GOLD, width=sw)
    bx = x0 + w * (0.22 + 0.18 * ((t * 2) % 1))
    by = y0 + h * (0.8 - 0.3 * math.sin(((t * 2) % 1) * math.pi))
    br = max(3, w * 0.045)
    draw.ellipse((bx - br, by - br, bx + br, by + br), fill=BEAD_RED)
    if play:
        pr = min(w, h) * 0.16
        px, py = x1 - pr * 1.5, y0 + pr * 1.5
        draw.ellipse((px - pr, py - pr, px + pr, py + pr), fill=(255, 255, 255))
        draw.polygon([(px - pr * 0.3, py - pr * 0.45), (px - pr * 0.3, py + pr * 0.45), (px + pr * 0.5, py)],
                     fill=K.CORAL)


def bat_ball(draw, cx, cy, s, t):
    S = S_(s)
    ang = math.radians(-35 + 8 * math.sin(t * 8))
    ca, sa = math.cos(ang), math.sin(ang)

    def rot(px, py):
        return (cx + px * ca - py * sa, cy + px * sa + py * ca)
    blade = [rot(-S(26), -S(10)), rot(S(26), -S(10)), rot(S(22), S(150)), rot(-S(22), S(150))]
    handle = [rot(-S(9), -S(80)), rot(S(9), -S(80)), rot(S(9), -S(8)), rot(-S(9), -S(8))]
    draw.polygon(handle, fill=K.DEV_DARK)
    draw.polygon(blade, fill=WOOD, outline=WOOD_DARK)
    bx, by = cx + S(110), cy + S(90)
    draw.ellipse((bx - S(30), by - S(30), bx + S(30), by + S(30)), fill=BEAD_RED)
    draw.arc((bx - S(20), by - S(30), bx + S(40), by + S(30)), 120, 240, fill=(255, 255, 255), width=max(2, int(S(4))))


def calculator(draw, cx, cy, s, display, font, hi=None):
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
    labels = ["7", "8", "9", "+", "4", "5", "6", "-", "1", "2", "3", "=", "C", "0", ".", "x"]
    kf = font(max(26, int(S(32))), bold=True) if S(32) >= 26 else None
    for i, lab in enumerate(labels):
        r, c = divmod(i, 4)
        kx = cx - S(120) + c * S(62)
        ky = cy - S(72) + r * S(62)
        col = K.CORAL if lab == "=" else (13, 148, 136) if c == 3 else K.DEV_MID
        if hi is not None and lab in hi:
            col = K.GOLD
        draw.rounded_rectangle((kx, ky, kx + S(52), ky + S(52)), radius=S(12), fill=col)
        if kf:
            K.text_at(draw, lab, kx + S(26), ky + S(6), kf, (255, 255, 255))


def wand(draw, cx, cy, s, t):
    S = S_(s)
    draw.line((cx - S(90), cy + S(90), cx + S(40), cy - S(40)), fill=K.DEV_DEEP, width=max(3, int(S(18))))
    draw.line((cx + S(14), cy - S(14), cx + S(40), cy - S(40)), fill=(255, 255, 255), width=max(3, int(S(18))))
    K.draw_star(draw, cx + S(62), cy - S(62), S(44), K.GOLD, rot=t * 2)
    for k, (dx, dy, r) in enumerate(((140, -120, 16), (150, 10, 12), (20, -150, 14), (-40, -60, 10))):
        tw = 0.6 + 0.4 * math.sin(t * 14 + k * 1.7)
        K.draw_star(draw, cx + S(dx), cy + S(dy), S(r) * tw + 2, PIXI if k % 2 else K.CORAL, rot=t * 3 + k)


def bulb(draw, cx, cy, s, lit=True):
    S = S_(s)
    if lit:
        for k in range(8):
            a = k * math.pi / 4
            draw.line((cx + math.cos(a) * S(66), cy + math.sin(a) * S(66), cx + math.cos(a) * S(88),
                       cy + math.sin(a) * S(88)), fill=K.GOLD, width=max(2, int(S(7))))
    draw.ellipse((cx - S(50), cy - S(54), cx + S(50), cy + S(46)), fill=K.GOLD if lit else (230, 226, 216))
    draw.rounded_rectangle((cx - S(26), cy + S(40), cx + S(26), cy + S(76)), radius=S(6), fill=K.STEEL_DARK)
    draw.line((cx - S(26), cy + S(54), cx + S(26), cy + S(54)), fill=K.STEEL, width=max(1, int(S(4))))


def gear(draw, cx, cy, r, col, rot=0.0, teeth=8, hole=(255, 255, 255)):
    pts = []
    n = teeth * 4
    for i in range(n):
        a = rot + i * 2 * math.pi / n
        rr = r if (i % 4) in (0, 1) else r * 0.78
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    draw.polygon(pts, fill=col)
    draw.ellipse((cx - r * 0.34, cy - r * 0.34, cx + r * 0.34, cy + r * 0.34), fill=hole)


def bead(draw, x, y, r, col):
    draw.ellipse((x - r + 5, y - r + 7, x + r + 5, y + r + 7), fill=K.SHADOW)
    draw.ellipse((x - r, y - r, x + r, y + r), fill=col)
    draw.ellipse((x - r * 0.55, y - r * 0.6, x - r * 0.1, y - r * 0.2), fill=tuple(min(255, c + 60) for c in col))


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


def sofa(draw, x0, x1, y):
    draw.rounded_rectangle((x0 + 30, y - 150, x1 - 30, y + 10), radius=40, fill=SOFA_DARK)
    draw.rounded_rectangle((x0 + 10, y + 10, x1 + 10, y + 110), radius=30, fill=K.SHADOW)
    draw.rounded_rectangle((x0, y, x1, y + 100), radius=30, fill=SOFA)
    for ax in (x0 - 20, x1 - 50):
        draw.rounded_rectangle((ax, y - 60, ax + 70, y + 100), radius=30, fill=SOFA_DARK)
    draw.rectangle((x0 + 40, y + 100, x0 + 70, y + 140), fill=WOOD_DARK)
    draw.rectangle((x1 - 70, y + 100, x1 - 40, y + 140), fill=WOOD_DARK)


def ruler(draw, cx, cy, s):
    S = S_(s)
    draw.rounded_rectangle((cx - S(150) + S(6), cy - S(36) + S(8), cx + S(150) + S(6), cy + S(36) + S(8)), radius=S(8),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(150), cy - S(36), cx + S(150), cy + S(36)), radius=S(8), fill=K.GOLD)
    for k in range(15):
        x = cx - S(136) + k * S(19.5)
        draw.line((x, cy - S(36), x, cy - S(36) + (S(30) if k % 5 == 0 else S(16))), fill=K.DEV_DARK,
                  width=max(2, int(S(4))))


def switch(draw, cx, cy, s, on=True):
    S = S_(s)
    draw.rounded_rectangle((cx - S(60) + S(6), cy - S(90) + S(8), cx + S(60) + S(6), cy + S(90) + S(8)), radius=S(16),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(60), cy - S(90), cx + S(60), cy + S(90)), radius=S(16), fill=(250, 248, 244),
                           outline=K.DEV_MID, width=max(2, int(S(4))))
    draw.rounded_rectangle((cx - S(26), cy - S(52), cx + S(26), cy + S(52)), radius=S(10), fill=K.STEEL)
    ky = cy - S(24) if on else cy + S(24)
    draw.rounded_rectangle((cx - S(22), ky - S(24), cx + S(22), ky + S(24)), radius=S(8), fill=K.DEV_DARK)


def render(draw, brand, visual, focus, progress, w, h) -> bool:
    ink = K.hex_rgb(brand["ink"])
    muted = K.hex_rgb(brand["muted"])
    coral = K.hex_rgb(brand["coral"])
    sage = K.hex_rgb(brand["sage"])
    panel = K.hex_rgb(brand["panel"])
    line = K.hex_rgb(brand["line"])
    coral_soft = K.hex_rgb(brand["coralSoft"])
    sage_soft = K.hex_rgb(brand["sageSoft"])
    bg = K.hex_rgb(brand["bg"])
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

    def label_lines(lines, x, y, size=36, col=None, gap=1.22):
        f = font(size, bold=True)
        for j, ln in enumerate(lines):
            K.text_at(draw, ln, x, y + j * int(size * gap), f, col or ink)

    def tick_row(x, y, label, col, shown, size=40):
        if shown:
            K.draw_check(draw, x + 26, y + size * 0.62, 26, col)
            draw.text((x + 68, y), label, fill=ink, font=font(size, bold=True))

    # ---- opening -----------------------------------------------------------
    if visual == "b1-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 300), 470, 110, sage, panel, bounce)
            pixi(draw, cx + 300, 480, 0.82, t, face="happy", wave=t)
            K.text_at(draw, "Hello, champ!", cx, 740, font(68, bold=True), ink)
            stars_around(330, 560)
            return True
        if focus == "track":
            a0 = K.stagger(progress, 0, step=0.1, speed=4)
            K.shadow_card(draw, (170, 300, 810, 820), brand, radius=36, accent=sage)
            K.text_at(draw, "Computer lessons", 490, 360, font(42, bold=True), sage)
            K.draw_device(draw, "computer", 490, 520, 0.95, brand, t=t)
            steps_y = 650
            for k in range(3):
                K.pill(draw, 0, steps_y, str(k + 1), sage, size=26, left=290 + k * 150)
                if k < 2:
                    K.draw_arrow(draw, 350 + k * 150, steps_y + 24, 428 + k * 150, steps_y + 24, muted, width=6, head=16)
            K.text_at(draw, "follow steps", 490, 730, font(36, bold=True), muted)
            a = K.stagger(progress, 3, step=0.12, speed=4)
            if a > 0:
                K.draw_arrow(draw, 840, 560, 840 + 150 * a, 560, coral, width=14, head=40)
            a = K.stagger(progress, 4, step=0.12, speed=4)
            if a > 0:
                yy = int((1 - a) * 40)
                K.shadow_card(draw, (1040, 250 + yy, 1750, 850 + yy), brand, radius=40, accent=coral)
                K.text_at(draw, "THE AI TRACK", 1395, 312 + yy, font(56, bold=True), coral)
                draw.ellipse((1395 - 170, 590 - 170 + yy, 1395 + 170, 590 + 170 + yy), fill=lav_soft)
                pixi(draw, 1395, 600 + yy, 0.6, t, face="happy")
                K.pill(draw, 1395, 760 + yy, "NEW!", K.GOLD, size=36, fg=ink)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (250, 236 + lift, w - 250, 500 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "WHAT IS AI? · CHAPTER 1 OF 5", cx, 296 + lift, font(32, bold=True), coral)
            K.text_at(draw, "Meet AI — Magic or Math?", cx, 356 + lift, font(82, bold=True), ink)
            a = K.stagger(progress, 2, step=0.14, speed=4)
            if a > 0:
                yy = int((1 - a) * 30)
                draw.ellipse((cx - 400 - 140, 700 - 140 + yy, cx - 400 + 140, 700 + 140 + yy), fill=lav_soft)
                wand(draw, cx - 410, 720 + yy, 0.85, t)
                K.text_at(draw, "Magic?", cx - 400, 580 + yy - 30, font(44, bold=True), K.BOTH_COLOR)
            a = K.stagger(progress, 3, step=0.14, speed=4)
            if a > 0:
                K.text_at(draw, "or", cx, 680, font(54, bold=True), muted)
            a = K.stagger(progress, 4, step=0.14, speed=4)
            if a > 0:
                yy = int((1 - a) * 30)
                draw.ellipse((cx + 400 - 140, 700 - 140 + yy, cx + 400 + 140, 700 + 140 + yy), fill=sage_soft)
                for k, (sym, dx, dy) in enumerate((("2", -70, -60), ("+", 0, -60), ("3", 70, -60), ("=", -30, 20),
                                                    ("5", 50, 20))):
                    K.text_at(draw, sym, cx + 400 + dx, 680 + dy + yy, font(64, bold=True), [sage, coral][k % 2])
                K.text_at(draw, "Maths?", cx + 400, 550 + yy, font(44, bold=True), sage)
            return True
        # question
        draw.ellipse((cx - 260, 590 - 260, cx + 260, 590 + 260), fill=lav_soft)
        pixi(draw, cx, 600, 1.0, t, face="think")
        a = K.stagger(progress, 1, step=0.15, speed=4)
        if a > 0:
            yy = int((1 - a) * 30)
            wand(draw, 420, 560 + yy, 1.1, t)
            K.text_at(draw, "Magic?", 400, 760 + yy, font(56, bold=True), K.BOTH_COLOR)
        a = K.stagger(progress, 2, step=0.15, speed=4)
        if a > 0:
            yy = int((1 - a) * 30)
            for k, (sym, dx, dy) in enumerate((("7", -90, -100), ("+", 0, -110), ("2", 90, -100), ("=", -50, 0),
                                                ("9", 60, 0))):
                K.text_at(draw, sym, 1500 + dx, 470 + dy + yy + 8 * math.sin(t * 8 + k), font(80, bold=True),
                          [sage, coral][k % 2])
            K.text_at(draw, "Maths?", 1500, 760 + yy, font(56, bold=True), sage)
        question_marks([(cx - 330, 280), (cx + 310, 260)])
        return True

    # ---- Kabir's cricket cartoons ----------------------------------------------
    if visual == "b1-hook":
        if focus == "watch":
            sofa(draw, 200, 760, 640)
            K.draw_person(draw, 430, 500, 1.3, "kid", t)
            scr = phone(draw, 720, 560, 0.7)
            thumb(draw, (scr[0] + 8, scr[1] + 60, scr[2] - 8, scr[1] + 200), t)
            for k in range(3):
                yy = scr[1] + 222 + k * 30
                draw.rounded_rectangle((scr[0] + 10, yy, scr[2] - 10 - k * 30, yy + 14), radius=7, fill=line)
            K.text_at(draw, "Meet", 1360, 300 + lift, font(56, bold=True), muted)
            K.text_at(draw, "Kabir!", 1360, 366 + lift, font(124, bold=True), coral)
            K.pill(draw, 1360, 548, "age 9 · loves cricket", sage, size=36)
            bat_ball(draw, 1330, 690, 0.8, t)
            star_spots([(1060, 330), (1660, 330)])
            return True
        if focus == "suggest":
            scr = phone(draw, 600, 555, 1.32)
            sx0, sy0, sx1, sy1 = scr
            K.text_at(draw, "Up next", (sx0 + sx1) / 2, sy0 + 14, font(34, bold=True), ink)
            for k in range(3):
                a = K.stagger(progress, k, step=0.2, speed=4)
                if a <= 0:
                    continue
                yy = sy0 + 70 + k * 168 + int((1 - a) * 30)
                tb = (sx0 + 14, yy, sx0 + 170, yy + 140)
                thumb(draw, tb, t + k * 0.3, play=False)
                draw.rounded_rectangle((sx0 + 186, yy + 20, sx1 - 14, yy + 40), radius=10, fill=line)
                draw.rounded_rectangle((sx0 + 186, yy + 60, sx1 - 50, yy + 78), radius=9, fill=line)
                draw.ellipse((sx0 + 186, yy + 96, sx0 + 216, yy + 126), fill=BEAD_RED)
            K.draw_person(draw, 1340, 470, 1.15, "kid", t)
            labels = ["Another!", "And another!", "And another!"]
            for k, lab in enumerate(labels):
                a = K.stagger(progress, k, step=0.2, speed=4)
                if a <= 0:
                    continue
                K.pill(draw, 1340, 650 + k * 74, lab, [coral, K.BOTH_COLOR, sage][k], size=32)
            return True
        if focus == "magic":
            K.draw_person(draw, 470, 520, 1.3, "kid", t)
            K.draw_bubble(draw, (640, 236, 1260, 400), brand, "How did it know?!", tail="left", size=50)
            scr = phone(draw, 1500, 600, 0.95)
            thumb(draw, (scr[0] + 10, scr[1] + 30, scr[2] - 10, scr[1] + 200), t)
            wand(draw, 1250, 620, 0.6, t)
            question_marks([(1700, 300), (1300, 440)], 70)
            K.draw_stopwatch(draw, 900, 740, 52, progress, brand)
            K.text_at(draw, "Magic? Mind reading?", 470, 790, font(36, bold=True), muted)
            return True
        # tease
        draw.ellipse((560 - 220, 540 - 220, 560 + 220, 540 + 220), fill=coral_soft)
        wand(draw, 560, 560, 1.2, t)
        a = K.stagger(progress, 1, step=0.15, speed=4)
        if a > 0:
            draw.line((560 - 170 * a, 380, 560 + 170 * a, 720), fill=K.DANGER, width=26)
        K.text_at(draw, "Not magic!", 560, 790, font(52, bold=True), K.DANGER)
        a = K.stagger(progress, 2, step=0.15, speed=4)
        if a > 0:
            K.draw_arrow(draw, 840, 540, 840 + 220 * a, 540, muted, width=12, head=36)
        a = K.stagger(progress, 3, step=0.15, speed=4)
        if a > 0:
            yy = int((1 - a) * 30)
            draw.ellipse((1380 - 220, 540 - 220 + yy, 1380 + 220, 540 + 220 + yy), fill=sage_soft)
            K.draw_magnifier(draw, 1360, 520 + yy, 1.3, sage)
            K.text_at(draw, "?", 1345, 470 + yy, font(80, bold=True), sage)
            K.text_at(draw, "Let's find out how!", 1380, 790, font(48, bold=True), sage)
        return True

    # ---- what is AI ---------------------------------------------------------------
    if visual == "b1-define":
        if focus == "name":
            for i, (letter, word, col) in enumerate((("A", "Artificial", coral), ("I", "Intelligence", K.BOTH_COLOR))):
                a = K.stagger(progress, i, step=0.2, speed=4)
                if a <= 0:
                    continue
                x = cx + (i * 2 - 1) * 300
                y = 270 + int((1 - a) * 40)
                draw.rounded_rectangle((x - 150 + 10, y + 12, x + 150 + 10, y + 270 + 12), radius=44, fill=K.SHADOW)
                draw.rounded_rectangle((x - 150, y, x + 150, y + 270), radius=44, fill=col)
                K.text_at(draw, letter, x, y + 30, font(190, bold=True), panel)
                K.text_at(draw, word, x, y + 320, font(62, bold=True), col)
            star_spots([(300, 360), (1620, 380), (330, 720), (1600, 720)])
            return True
        if focus == "words":
            cards = [("Artificial", "made by people", coral), ("Intelligence", "being clever", K.BOTH_COLOR)]
            for i, (title, sub, col) in enumerate(cards):
                a = K.stagger(progress, i, step=0.3, speed=4)
                if a <= 0:
                    continue
                x0 = 190 if i == 0 else 1010
                yy = int((1 - a) * 40)
                K.shadow_card(draw, (x0, 250 + yy, x0 + 720, 850 + yy), brand, radius=40, outline=col, outline_w=5)
                K.text_at(draw, title, x0 + 360, 286 + yy, font(62, bold=True), col)
                mx = x0 + 360
                if i == 0:
                    K.draw_person(draw, mx - 150, 520 + yy, 0.95, "teacher", t)
                    gear(draw, mx + 110, 470 + yy, 70, coral, rot=t * 5, hole=panel)
                    gear(draw, mx + 190, 570 + yy, 46, K.GOLD, rot=-t * 7, teeth=7, hole=panel)
                else:
                    bulb(draw, mx, 520 + yy, 1.35)
                K.text_at(draw, sub, mx, 740 + yy, font(50, bold=True), ink)
            return True
        if focus == "meaning":
            K.shadow_card(draw, (150, 240, 1770, 860), brand, radius=40, accent=K.BOTH_COLOR)
            K.text_at(draw, "AI is a computer program that…", cx, 300, font(46, bold=True), ink)
            cols = [("learns from", "examples", coral), ("finds a", "pattern", K.BOTH_COLOR), ("makes a", "guess", sage)]
            for i, (top, big, col) in enumerate(cols):
                a = K.stagger(progress, i, step=0.22, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 520
                yy = int((1 - a) * 30)
                draw.ellipse((x - 130, 530 - 130 + yy, x + 130, 530 + 130 + yy), fill=[coral_soft, lav_soft, sage_soft][i])
                if i == 0:
                    for k in range(3):
                        cat_photo(draw, (x - 100 + k * 30, 430 - k * 22 + yy, x + 30 + k * 30, 590 - k * 22 + yy),
                                  [CAT_GREY, CAT_ORANGE, CAT_BLACK][k])
                elif i == 1:
                    cat(draw, x - 40, 560 + yy, 62, CAT_ORANGE)
                    K.draw_magnifier(draw, x + 30, 480 + yy, 0.62, K.BOTH_COLOR)
                else:
                    K.draw_bubble(draw, (x - 120, 418 + yy, x + 100, 512 + yy), brand, "Cat!", tail="left", size=44)
                    pixi(draw, x + 50, 594 + yy, 0.3, t, face="happy")
                K.text_at(draw, top, x, 690 + yy, font(36, bold=True), muted)
                K.text_at(draw, big, x, 736 + yy, font(56, bold=True), col)
                if i < 2:
                    K.draw_arrow(draw, x + 170, 530, x + 340, 530, muted, width=10, head=28)
            return True
        if focus == "pixi":
            draw.ellipse((560 - 280, 580 - 280, 560 + 280, 580 + 280), fill=blue_soft)
            pixi(draw, 560, 600, 1.1, t, face="happy", wave=t)
            K.text_at(draw, "Say hi to", 1300, 290 + lift, font(56, bold=True), muted)
            K.text_at(draw, "Pixi!", 1300, 356 + lift, font(130, bold=True), K.BOTH_COLOR)
            K.pill(draw, 1300, 540, "just a cartoon helper", sage, size=38)
            a = K.stagger(progress, 3, step=0.14, speed=4)
            if a > 0:
                y = 660 + int((1 - a) * 20)
                draw.rounded_rectangle((960, y, 1640, y + 120), radius=60, fill=panel, outline=line, width=3)
                K.text_at(draw, "Real AI: no face,", 1300, y + 14, font(36, bold=True), ink)
                K.text_at(draw, "no feelings", 1300, y + 60, font(36, bold=True), ink)
            star_spots([(1000, 330), (1620, 320)])
            return True
        # notalive
        items = ["Not alive", "Doesn't think like you", "Doesn't feel"]
        for i, lab in enumerate(items):
            a = K.stagger(progress, i, step=0.16, speed=4)
            if a <= 0:
                continue
            y = 270 + i * 140 + int((1 - a) * 30)
            draw.rounded_rectangle((170 + 8, y + 10, 900 + 8, y + 110 + 10), radius=55, fill=K.SHADOW)
            draw.rounded_rectangle((170, y, 900, y + 110), radius=55, fill=K.DANGER_SOFT, outline=K.DANGER, width=4)
            K.draw_cross(draw, 230, y + 55, 30, K.DANGER)
            draw.text((290, y + 28), lab, fill=ink, font=font(46, bold=True))
        a = K.stagger(progress, 3, step=0.16, speed=4)
        if a > 0:
            K.text_at(draw, "No spells inside!", 535, 720 + int((1 - a) * 20), font(54, bold=True), coral)
        K.draw_device(draw, "laptop", 1390, 520, 1.3, brand)
        for k in range(5):
            yy = 400 + k * 38
            ww = [260, 190, 300, 160, 230][k]
            xx = 1210 + (40 if k in (1, 2) else 0)
            draw.rounded_rectangle((xx, yy, xx + ww, yy + 18), radius=9, fill=[K.BOTH_COLOR, coral, sage, K.GOLD, K.ROAD][k])
        for k, (sym, sx, sy) in enumerate((("+", 1090, 330), ("×", 1700, 330), ("=", 1060, 560), ("÷", 1720, 560))):
            K.text_at(draw, sym, sx, sy + 8 * math.sin(t * 8 + k), font(76, bold=True), [sage, coral][k % 2])
        K.text_at(draw, "A program,", 1390, 700, font(46, bold=True), ink)
        K.text_at(draw, "written by people", 1390, 760, font(46, bold=True), sage)
        return True

    # ---- patterns ---------------------------------------------------------------------
    if visual == "b1-pattern":
        if focus == "what":
            K.text_at(draw, "PATTERN", cx, 236 + lift, font(104, bold=True), K.BOTH_COLOR)
            K.text_at(draw, "something that repeats or looks alike", cx, 370 + lift, font(46, bold=True), muted)
            for i, lab in enumerate(("Beads", "Floor tiles", "Rangoli")):
                a = K.stagger(progress, i + 1, step=0.14, speed=4)
                if a <= 0:
                    continue
                x0 = 210 + i * 520
                yy = int((1 - a) * 40)
                K.shadow_card(draw, (x0, 460 + yy, x0 + 460, 860 + yy), brand, radius=32)
                mx = x0 + 230
                if i == 0:
                    for k in range(6):
                        bead(draw, x0 + 60 + k * 68, 620 + yy + 18 * math.sin(k * 0.9), 28,
                             [BEAD_RED, BEAD_YELLOW, BEAD_BLUE][k % 3])
                elif i == 1:
                    for r_ in range(4):
                        for c_ in range(6):
                            col = K.ROAD if (r_ + c_) % 2 == 0 else panel
                            draw.rectangle((x0 + 50 + c_ * 60, 510 + r_ * 50 + yy, x0 + 110 + c_ * 60, 560 + r_ * 50 + yy),
                                           fill=col, outline=line)
                else:
                    ry = 620 + yy
                    for k in range(8):
                        ang = k * math.pi / 4 + t
                        px, py = mx + math.cos(ang) * 76, ry + math.sin(ang) * 76
                        draw.ellipse((px - 34, py - 34, px + 34, py + 34), fill=[coral, K.GOLD][k % 2])
                    for k in range(8):
                        ang = k * math.pi / 4 + math.pi / 8 + t
                        px, py = mx + math.cos(ang) * 40, ry + math.sin(ang) * 40
                        draw.ellipse((px - 18, py - 18, px + 18, py + 18), fill=K.BOTH_COLOR)
                    draw.ellipse((mx - 22, ry - 22, mx + 22, ry + 22), fill=sage)
                K.text_at(draw, lab, mx, 780 + yy, font(40, bold=True), ink)
            return True
        if focus in ("beads", "beadsans"):
            ans = focus == "beadsans"
            cols = [BEAD_RED, BEAD_YELLOW, BEAD_BLUE] * 3
            xs = [300 + k * 165 for k in range(9)]
            ys = [520 + 26 * math.sin(k * 0.8) for k in range(9)]
            draw.line(list(zip(xs, ys)), fill=K.DEV_MID, width=6, joint="curve")
            for k in range(9):
                a = 1.0 if ans else K.stagger(progress, k, step=0.06, speed=6)
                if k == 8 and not ans:
                    r = 64
                    draw.ellipse((xs[k] - r, ys[k] - r, xs[k] + r, ys[k] + r), fill=coral_soft)
                    K.draw_dashed(draw, xs[k] - r, ys[k] - r - 6, xs[k] + r, ys[k] - r - 6, coral, width=5, phase=t * 100)
                    K.draw_dashed(draw, xs[k] - r, ys[k] + r + 6, xs[k] + r, ys[k] + r + 6, coral, width=5, phase=t * 100)
                    K.text_at(draw, "?", xs[k], ys[k] - 60, font(int(92 + 16 * pulse), bold=True), coral)
                    continue
                if a <= 0:
                    continue
                bead(draw, xs[k], ys[k] - (1 - a) * 40, 58 if k < 8 else 58 + 6 * pulse, cols[k])
            if ans:
                for g in range(3):
                    gx0, gx1 = xs[g * 3] - 60, xs[g * 3 + 2] + 60
                    draw.rounded_rectangle((gx0, 640, gx1, 656), radius=8, fill=sage)
                    K.text_at(draw, ["1", "2", "3"][g], (gx0 + gx1) / 2, 670, font(36, bold=True), sage)
                K.draw_check(draw, xs[8] + 50, ys[8] - 70, 26, sage)
                K.text_at(draw, "You spotted the pattern!", cx, 760, font(58, bold=True), sage)
                K.text_at(draw, "Red · Yellow · Blue, again and again", cx, 300, font(46, bold=True), ink)
            else:
                K.text_at(draw, "What comes next?", cx, 290, font(60, bold=True), ink)
                K.draw_stopwatch(draw, cx, 760, 56, progress, brand)
            return True
        # cats
        specs = [(CAT_ORANGE, "open"), (CAT_GREY, "sleep"), (CAT_BLACK, "open")]
        for i, (col, eyes) in enumerate(specs):
            a = K.stagger(progress, i, step=0.12, speed=4)
            if a <= 0:
                continue
            x = cx + (i - 1) * 500
            yy = int((1 - a) * 40)
            draw.ellipse((x - 190, 500 - 190 + yy, x + 190, 500 + 190 + yy), fill=[coral_soft, blue_soft, lav_soft][i])
            cat(draw, x, 520 + yy, 125, col, eyes=eyes, stripes=col != CAT_BLACK)
        for i, lab in enumerate(("whiskers", "fur", "pointy ears")):
            a = K.stagger(progress, i + 3, step=0.12, speed=4)
            if a <= 0:
                continue
            x = cx + (i - 1) * 420
            bx = K.pill(draw, x - 26, 750 + int((1 - a) * 20), lab, K.BOTH_COLOR, size=40)
            my = (bx[1] + bx[3]) / 2
            K.draw_check(draw, bx[2] + 36, my, 26, sage)
        return True

    # ---- how AI learns "cat" --------------------------------------------------------
    if visual == "b1-cat":
        cols = [CAT_ORANGE, CAT_GREY, CAT_BLACK, CAT_CREAM]
        bgs = [(214, 236, 250), (232, 244, 220), (250, 232, 226), (240, 232, 250)]
        if focus == "photos":
            n = 0
            for r_ in range(3):
                for c_ in range(6):
                    i = r_ * 6 + c_
                    a = K.stagger(progress, i, step=0.035, speed=6)
                    if a <= 0:
                        continue
                    n += 1
                    x0 = 150 + c_ * 196
                    y0 = 250 + r_ * 200 + int((1 - a) * 40)
                    cat_photo(draw, (x0, y0, x0 + 170, y0 + 180), cols[i % 4], bgs[(i + r_) % 4],
                              eyes="sleep" if i % 5 == 3 else "open")
            draw.ellipse((1560 - 190, 520 - 190, 1560 + 190, 520 + 190), fill=lav_soft)
            pixi(draw, 1560, 540, 0.68, t, face="wow")
            K.text_at(draw, "Thousands!", 1560, 750, font(56, bold=True), coral)
            return True
        if focus == "notice":
            for k in range(3):
                cat_photo(draw, (150 + k * 26, 330 + k * 40, 400 + k * 26, 590 + k * 40), cols[(k + 1) % 4], bgs[k])
            ix0, iy0, ix1, iy1 = photo(draw, (520, 260, 1060, 840), bgs[0])
            ccx, ccy = (ix0 + ix1) / 2, (iy0 + iy1) / 2 + 30
            cat(draw, ccx, ccy, 160, CAT_ORANGE)
            spots = [("pointy ears", (ccx + 118, ccy - 160), 0), ("whiskers", (ccx + 150, ccy + 52), 1),
                     ("fur", (ccx - 70, ccy - 110), 2)]
            for k, (_lab, (px, py), _i) in enumerate(spots):
                a = K.stagger(progress, k, step=0.2, speed=4)
                if a <= 0:
                    continue
                r = 46 + 6 * pulse
                draw.ellipse((px - r, py - r, px + r, py + r), outline=K.BOTH_COLOR, width=6)
            K.shadow_card(draw, (1160, 280, 1760, 820), brand, radius=36, accent=K.BOTH_COLOR)
            K.text_at(draw, "Cat pattern", 1460, 340, font(48, bold=True), K.BOTH_COLOR)
            for k, lab in enumerate(("Pointy ears", "Whiskers", "Fur")):
                a = K.stagger(progress, k, step=0.2, speed=4)
                tick_row(1220, 450 + k * 110, lab, sage, a > 0.3, size=46)
            a = K.stagger(progress, 3, step=0.2, speed=4)
            if a > 0:
                K.text_at(draw, "again and again!", 1460, 750, font(36, bold=True), muted)
            return True
        if focus == "guess":
            K.pill(draw, 500, 236, "NEW PHOTO", coral, size=34)
            cat_photo(draw, (250, 310, 750, 840), CAT_CREAM, (250, 238, 214))
            a = K.stagger(progress, 1, step=0.15, speed=4)
            if a > 0:
                K.draw_arrow(draw, 790, 570, 790 + 190 * a, 570, muted, width=12, head=36)
            pixi(draw, 1250, 640, 0.8, t, face="happy" if progress > 0.5 else "think")
            if progress > 0.45:
                K.draw_bubble(draw, (1140, 250, 1760, 400), brand, "This looks like a cat!", tail="left", size=44)
            else:
                dots = int(progress * 10) % 4
                K.draw_bubble(draw, (1140, 250, 1400, 380), brand, "." * max(1, dots), tail="left", size=56)
            return True
        # maths
        for k in range(5):
            a = K.stagger(progress, k, step=0.06, speed=6)
            if a <= 0:
                continue
            cat_photo(draw, (150 + k * 34, 330 + k * 46 - int((1 - a) * 30), 380 + k * 34, 560 + k * 46 - int((1 - a) * 30)),
                      cols[k % 4], bgs[k % 4])
        K.text_at(draw, "Examples", 330, 800, font(42, bold=True), coral)
        K.draw_arrow(draw, 580, 560, 700, 560, muted, width=12, head=34)
        draw.ellipse((960 - 200, 540 - 200, 960 + 200, 540 + 200), fill=lav_soft)
        gear(draw, 900, 580, 110, K.BOTH_COLOR, rot=t * 4, hole=lav_soft)
        gear(draw, 1040, 450, 70, coral, rot=-t * 6, teeth=7, hole=lav_soft)
        for k, (sym, sx, sy) in enumerate((("+", 790, 380), ("×", 1120, 640), ("=", 1080, 330))):
            K.text_at(draw, sym, sx, sy + 8 * math.sin(t * 8 + k), font(60, bold=True), [sage, coral, K.GOLD][k])
        K.text_at(draw, "Pattern + maths", 960, 800, font(42, bold=True), K.BOTH_COLOR)
        a = K.stagger(progress, 2, step=0.15, speed=4)
        if a > 0:
            K.draw_arrow(draw, 1210, 560, 1210 + 120 * a, 560, muted, width=12, head=34)
        a = K.stagger(progress, 3, step=0.15, speed=4)
        if a > 0:
            K.draw_bubble(draw, (1400, 400, 1720, 540), brand, "Cat!", tail="left", size=60)
            K.text_at(draw, "A good guess", 1560, 800, font(42, bold=True), sage)
        return True

    # ---- calculator vs AI -----------------------------------------------------------
    if visual == "b1-calc":
        if focus == "calc":
            cur = "_" if int(t * 8) % 2 == 0 else " "
            calculator(draw, 580, 560, 1.15, "7+2" + cur, font, hi=("7", "+", "2"))
            K.text_at(draw, "What does it show?", 1300, 320, font(60, bold=True), ink)
            K.text_at(draw, "?", 1300, 400, font(int(170 + 20 * pulse), bold=True), K.GOLD)
            K.draw_stopwatch(draw, 1300, 740, 56, progress, brand)
            return True
        if focus == "rule":
            calculator(draw, 470, 560, 1.1, "9", font, hi=("=",))
            rows = ["Today", "Again", "Tomorrow", "Next year"]
            for i, lab in enumerate(rows):
                a = K.stagger(progress, i, step=0.13, speed=5)
                if a <= 0:
                    continue
                y = 260 + i * 118 + int((1 - a) * 20)
                draw.rounded_rectangle((860, y, 1720, y + 96), radius=48, fill=panel, outline=line, width=3)
                draw.text((910, y + 22), lab, fill=muted, font=font(44, bold=True))
                draw.text((1300, y + 22), "7 + 2 = 9", fill=ink, font=font(44, bold=True))
                K.draw_check(draw, 1660, y + 48, 24, sage)
            a = K.stagger(progress, 5, step=0.12, speed=4)
            if a > 0:
                K.pill(draw, 1290, 760 + int((1 - a) * 20), "A FIXED RULE · same answer", coral, size=40)
            return True
        if focus == "ai":
            K.text_at(draw, "AI makes a guess", 560, 260 + lift, font(72, bold=True), K.BOTH_COLOR)
            K.text_at(draw, "from what it has seen before", 560, 360 + lift, font(42, bold=True), muted)
            cols = [CAT_ORANGE, CAT_GREY, CAT_BLACK]
            for k in range(3):
                a = K.stagger(progress, k, step=0.14, speed=4)
                if a <= 0:
                    continue
                x0 = 210 + k * 250
                y0 = 490 + int((1 - a) * 30)
                cat_photo(draw, (x0, y0, x0 + 210, y0 + 220), cols[k])
                K.draw_dashed(draw, x0 + 215, y0 + 110, 1200, 640, PIXI_LIGHT, width=5, phase=t * 120)
            pixi(draw, 1420, 610, 0.95, t, face="think")
            a = K.stagger(progress, 3, step=0.14, speed=4)
            if a > 0:
                K.draw_bubble(draw, (1060, 236, 1580, 356), brand, "I think… a cat?", tail="left", size=44)
            return True
        # compare
        for k, (title, col, soft) in enumerate((("Calculator", sage, sage_soft), ("AI", K.BOTH_COLOR, lav_soft))):
            x0 = 170 if k == 0 else 1000
            draw.rounded_rectangle((x0 + 10, 250 + 12, x0 + 750 + 10, 850 + 12), radius=40, fill=K.SHADOW)
            draw.rounded_rectangle((x0, 250, x0 + 750, 850), radius=40, fill=soft, outline=col, width=5)
            K.text_at(draw, title, x0 + 375, 280, font(60, bold=True), col)
        calculator(draw, 360, 560, 0.72, "9", font)
        K.text_at(draw, "Fixed rule", 700, 440, font(48, bold=True), ink)
        K.text_at(draw, "7 + 2 → 9", 700, 520, font(42, bold=True), muted)
        K.text_at(draw, "every time", 700, 580, font(42, bold=True), muted)
        pixi(draw, 1200, 580, 0.62, t, face="think")
        K.text_at(draw, "A guess", 1560, 440, font(48, bold=True), ink)
        K.text_at(draw, "from patterns", 1560, 520, font(42, bold=True), muted)
        K.text_at(draw, "it has seen", 1560, 580, font(42, bold=True), muted)
        draw.ellipse((cx - 64, 520 - 64, cx + 64, 520 + 64), fill=coral)
        K.text_at(draw, "VS", cx, 494, font(48, bold=True), panel)
        a = K.stagger(progress, 3, step=0.15, speed=4)
        if a > 0:
            K.pill(draw, 545, 760, "same answer", sage, size=34)
            K.pill(draw, 1375, 760, "can change", K.BOTH_COLOR, size=34)
        return True

    # ---- wrong guess: the fox -------------------------------------------------------
    if visual == "b1-wrong":
        if focus == "oops":
            ix0, iy0, ix1, iy1 = photo(draw, (240, 250, 860, 850), (226, 240, 214))
            fox(draw, (ix0 + ix1) / 2 - 50, (iy0 + iy1) / 2 + 10, 120)
            K.draw_magnifier(draw, 820, 720, 0.9, coral)
            pixi(draw, 1380, 640, 0.85, t, face="happy")
            K.draw_bubble(draw, (1240, 250, 1560, 380), brand, "Cat!", tail="left", size=60)
            question_marks([(1050, 380), (1640, 470)], 70)
            return True
        if focus == "fox":
            ix0, iy0, ix1, iy1 = photo(draw, (170, 250, 750, 830), (226, 240, 214))
            fox(draw, (ix0 + ix1) / 2 - 50, (iy0 + iy1) / 2 + 10, 110)
            K.pill(draw, 460, 236, "It's a FOX!", coral, size=38)
            for k, lab in enumerate(("fur", "pointy ears", "whiskers")):
                a = K.stagger(progress, k, step=0.14, speed=4)
                if a <= 0:
                    continue
                y = 330 + k * 120 + int((1 - a) * 20)
                draw.rounded_rectangle((820, y, 1260, y + 92), radius=46, fill=panel, outline=line, width=3)
                K.draw_check(draw, 870, y + 46, 24, sage)
                draw.text((910, y + 22), lab, fill=ink, font=font(42, bold=True))
            K.text_at(draw, "a lot like a cat!", 1040, 700, font(40, bold=True), muted)
            pixi(draw, 1530, 650, 0.7, t, face="oops")
            K.draw_bubble(draw, (1390, 250, 1700, 370), brand, "Cat?", tail="left", size=54)
            K.draw_cross(draw, 1660, 290, 30, K.DANGER)
            return True
        # why
        results = [(CAT_ORANGE, True), (CAT_GREY, True), (None, False), (CAT_BLACK, True), (CAT_CREAM, True)]
        for k, (col, ok) in enumerate(results):
            a = K.stagger(progress, k, step=0.08, speed=5)
            if a <= 0:
                continue
            x0 = 230 + k * 300
            y0 = 250 + int((1 - a) * 30)
            ix0, iy0, ix1, iy1 = photo(draw, (x0, y0, x0 + 240, y0 + 240), (226, 240, 214) if col is None else (214, 236, 250))
            if col is None:
                fox(draw, (ix0 + ix1) / 2 - 22, (iy0 + iy1) / 2 + 10, 48)
            else:
                cat(draw, (ix0 + ix1) / 2, (iy0 + iy1) / 2 + 14, 54, col, stripes=col != CAT_BLACK)
            (K.draw_check if ok else K.draw_cross)(draw, x0 + 220, y0 + 20, 28, sage if ok else K.DANGER)
        K.text_at(draw, "Often right… but not always!", cx, 540, font(52, bold=True), K.BOTH_COLOR)
        a = K.stagger(progress, 5, step=0.1, speed=4)
        if a > 0:
            yy = int((1 - a) * 20)
            draw.rounded_rectangle((330, 640 + yy, 1590, 850 + yy), radius=40, fill=sage_soft, outline=sage, width=4)
            calculator(draw, 470, 745 + yy, 0.4, "9", font)
            K.text_at(draw, "A calculator doesn't guess.", 1060, 676 + yy, font(46, bold=True), ink)
            K.text_at(draw, "7 + 2 is always 9!", 1060, 750 + yy, font(46, bold=True), sage)
        return True

    # ---- AI around you ----------------------------------------------------------------
    if visual == "b1-around":
        if focus == "video":
            scr = phone(draw, 440, 555, 1.32)
            sx0, sy0, sx1, sy1 = scr
            K.text_at(draw, "Watched", (sx0 + sx1) / 2, sy0 + 14, font(34, bold=True), muted)
            for k in range(3):
                yy = sy0 + 66 + k * 130
                thumb(draw, (sx0 + 14, yy, sx0 + 150, yy + 110), t, play=False)
                K.draw_check(draw, sx1 - 44, yy + 55, 22, sage)
            yy = sy0 + 66 + 3 * 130
            draw.rounded_rectangle((sx0 + 8, yy - 6, sx1 - 8, yy + 84), radius=14, fill=coral_soft, outline=coral, width=3)
            K.text_at(draw, "Up next: cricket!", (sx0 + sx1) / 2, yy + 22, font(28, bold=True), coral)
            K.draw_arrow(draw, 650, 560, 760, 560, muted, width=12, head=34)
            K.shadow_card(draw, (800, 250, 1760, 850), brand, radius=40, accent=sage)
            K.text_at(draw, "Pattern found!", 1280, 310, font(54, bold=True), sage)
            for k in range(4):
                a = K.stagger(progress, k, step=0.1, speed=5)
                if a <= 0:
                    continue
                bx = 960 + k * 210
                bat_ball(draw, bx - 30, 440 + int((1 - a) * 20), 0.45, t + k * 0.2)
            K.text_at(draw, "cricket · cricket · cricket · cricket", 1280, 560, font(36, bold=True), muted)
            a = K.stagger(progress, 4, step=0.12, speed=4)
            if a > 0:
                K.text_at(draw, "Guess: he'll like more cricket!", 1280, 640, font(44, bold=True), ink)
                K.pill(draw, 1280, 730, "Not mind reading. Patterns!", coral, size=36)
            return True
        # voice
        K.draw_person(draw, 360, 500, 1.2, "kid", t)
        K.draw_bubble(draw, (470, 236, 900, 360), brand, "Play a song!", tail="left", size=46)
        speaker(draw, 960, 590, 1.25, t)
        K.sound_waves(draw, 760, 590, 1.2, sage, t, facing="right")
        faces = [(1340, 330, 50), (1520, 300, 44), (1690, 360, 50), (1400, 490, 44), (1590, 470, 54),
                 (1730, 560, 40), (1350, 650, 46), (1540, 640, 42)]
        for k, (fx, fy, fr) in enumerate(faces):
            a = K.stagger(progress, k, step=0.06, speed=5)
            if a <= 0:
                continue
            K.draw_dashed(draw, fx - fr, fy, 1100, 560, PIXI_LIGHT, width=4, phase=t * 100)
            K.draw_face(draw, fx, fy, fr * a, "nani" if k % 3 == 1 else "kid", 0.5)
        K.text_at(draw, "Heard many voices before", 1530, 760, font(40, bold=True), K.BOTH_COLOR)
        K.text_at(draw, "Guesses your words", 960, 790, font(36, bold=True), muted)
        return True

    # ---- Riya says "magic" -----------------------------------------------------------
    if visual == "b1-riya":
        if focus == "ask":
            K.draw_person(draw, 440, 520, 1.3, "friend", t)
            K.draw_bubble(draw, (600, 236, 1220, 380), brand, "AI works by magic!", tail="left", size=50)
            wand(draw, 760, 620, 0.75, t)
            pixi(draw, 1460, 640, 0.85, t, face="oops")
            question_marks([(1240, 450), (1700, 330)], 70)
            K.draw_stopwatch(draw, 1060, 760, 50, progress, brand)
            K.text_at(draw, "Riya", 440, 790, font(40, bold=True), muted)
            return True
        # answer
        K.draw_person(draw, 360, 520, 1.25, "kid", t)
        K.draw_bubble(draw, (500, 236, 1360, 420), brand, "No, Riya! AI uses maths to find patterns in examples.",
                      tail="left", size=44)
        K.draw_person(draw, 1600, 520, 1.1, "friend", t)
        K.text_at(draw, "Kabir", 360, 790, font(36, bold=True), muted)
        K.text_at(draw, "Riya", 1600, 790, font(36, bold=True), muted)
        for k, (lab, col) in enumerate((("maths", sage), ("patterns", K.BOTH_COLOR), ("examples", coral),
                                         ("made by people", K.ROAD))):
            a = K.stagger(progress, k + 1, step=0.1, speed=4)
            if a <= 0:
                continue
            K.pill(draw, [640, 860, 1100, 960][k], 520 + (k // 3) * 0 + (100 if k == 3 else 0) + int((1 - a) * 20),
                   lab, col, size=36)
        if progress > 0.5:
            star_spots([(1420, 560), (1780, 300)])
        return True

    # ---- which is most like AI? -----------------------------------------------------
    if visual == "b1-sort":
        ans = focus == "answer"
        items = [("ruler", ("A ruler measuring", "a line")), ("video", ("A video app", "suggesting a cartoon")),
                 ("calc", ("A calculator", "adding 5 + 5")), ("switch", ("A switch turning", "on a bulb"))]
        cw, gap = 390, 30
        x_start = cx - (4 * cw + 3 * gap) / 2
        for i, (kind, lab) in enumerate(items):
            x0 = x_start + i * (cw + gap)
            win = ans and kind == "video"
            dim = ans and not win and progress > 0.35
            K.shadow_card(draw, (x0, 300, x0 + cw, 830), brand, radius=30, outline=sage if win else line,
                          outline_w=6 if win else 3)
            if win:
                draw.rounded_rectangle((x0 + 6, 306, x0 + cw - 6, 824), radius=26, fill=sage_soft)
            mx = x0 + cw / 2
            if kind == "ruler":
                ruler(draw, mx, 520, 1.05)
                draw.line((mx - 150, 610, mx + 150, 610), fill=K.ROAD, width=8)
            elif kind == "video":
                scr = phone(draw, mx, 545, 0.56)
                thumb(draw, (scr[0] + 6, scr[1] + 16, scr[2] - 6, scr[1] + 116), t)
                for k in range(2):
                    draw.rounded_rectangle((scr[0] + 8, scr[1] + 136 + k * 30, scr[2] - 8, scr[1] + 150 + k * 30),
                                           radius=7, fill=line)
            elif kind == "calc":
                calculator(draw, mx, 545, 0.56, "10", font)
            else:
                switch(draw, mx - 70, 530, 0.8)
                bulb(draw, mx + 80, 500, 0.75)
            label_lines(lab, mx, 706, size=34)
            if win:
                K.pill(draw, mx, 320, "AI!", sage, size=32)
            elif dim:
                K.pill(draw, mx, 320, "fixed rule", muted, size=28)
            elif not ans:
                K.pill(draw, mx, 320, "?", K.BOTH_COLOR, size=32)
        if ans:
            K.pill(draw, cx, 222, "The video suggestion: a guess from patterns!", sage, size=32)
        else:
            K.pill(draw, cx - 40, 222, "Which is most like AI?", K.BOTH_COLOR, size=32)
            K.draw_stopwatch(draw, cx + 290, 252, 32, progress, brand)
        return True

    # ---- checkpoint -------------------------------------------------------------------
    if visual == "b1-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 270 + lift, w - 460, 790 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 350 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Think like an AI expert!", cx, 430 + lift, font(60, bold=True), ink)
            pixi(draw, cx, 640 + lift, 0.42, t, face="happy")
            return True
        ans = focus == "answer"
        draw.rounded_rectangle((130 + 10, 230 + 12, 1100 + 10, 870 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((130, 230, 1100, 870), radius=24, fill=(255, 250, 238))
        label_lines(("Why is suggesting a cartoon", "closer to AI than 7 + 2?"), 615, 262, size=44, col=coral)
        rows = [("7 + 2: one fixed rule,", "always 9"), ("A cartoon: a guess from", "patterns you watched"),
                ("Guessing from patterns", "= what AI does!")]
        for i, (l1, l2) in enumerate(rows):
            y = 420 + i * 146
            draw.line((180, y + 128, 1050, y + 128), fill=(220, 210, 232), width=3)
            shown = ans and progress * 3.2 - 0.3 > i
            if shown:
                K.draw_check(draw, 210, y + 44, 24, sage)
                draw.text((250, y + 10), l1, fill=ink, font=font(40, bold=True))
                draw.text((250, y + 62), l2, fill=sage if i == 2 else muted, font=font(38, bold=True))
            elif not ans and i == 1:
                K.text_at(draw, "?", 615, y - 40, font(120, bold=True), line)
        calculator(draw, 1300, 560, 0.62, "9" if ans else "7+2", font)
        scr = phone(draw, 1610, 560, 0.62)
        thumb(draw, (scr[0] + 6, scr[1] + 20, scr[2] - 6, scr[1] + 130), t)
        for k in range(2):
            draw.rounded_rectangle((scr[0] + 8, scr[1] + 150 + k * 34, scr[2] - 8, scr[1] + 166 + k * 34), radius=8,
                                   fill=line)
        if ans:
            K.pill(draw, 1300, 740, "fixed rule", sage, size=30)
            K.pill(draw, 1610, 740, "AI guess", K.BOTH_COLOR, size=30)
        else:
            K.draw_stopwatch(draw, 1455, 300, 44, progress, brand)
        return True

    # ---- recap ----------------------------------------------------------------------
    if visual == "b1-recap":
        recap = [(("Maths,", "not magic"), coral, "magic"), (("Finds patterns", "in examples"), K.BOTH_COLOR, "pattern"),
                 (("Calculator: rule", "AI: a guess"), sage, "calc"), (("Not alive,", "can be wrong"), K.DANGER, "wrong")]
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
                if kind == "magic":
                    wand(draw, ix - 30, iy + 20, 0.8, t)
                    draw.line((ix - 120, iy - 110, ix + 110, iy + 120), fill=K.DANGER, width=16)
                elif kind == "pattern":
                    for k in range(3):
                        cat_photo(draw, (ix - 140 + k * 70, iy - 90 + k * 20, ix - 10 + k * 70, iy + 40 + k * 20),
                                  [CAT_GREY, CAT_ORANGE, CAT_BLACK][k])
                elif kind == "calc":
                    calculator(draw, ix - 80, iy + 10, 0.42, "9", font)
                    pixi(draw, ix + 90, iy + 30, 0.36, t, face="think")
                else:
                    ixx0, iyy0, ixx1, iyy1 = photo(draw, (ix - 110, iy - 120, ix + 110, iy + 110), (226, 240, 214))
                    fox(draw, (ixx0 + ixx1) / 2 - 20, (iyy0 + iyy1) / 2 + 10, 44)
                    K.draw_cross(draw, ix + 100, iy - 110, 26, K.DANGER)
                label_lines(lab, x0 + 200, y0 + 390, size=36)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 300), 450, 110, sage, panel, bounce)
            pixi(draw, cx + 300, 470, 0.6, t, face="happy", wave=t)
            K.text_at(draw, "Chapter 1 done!", cx, 670, font(68, bold=True), ink)
            K.pill(draw, cx, 770, "AI explorer!", K.BOTH_COLOR, size=36)
            stars_around(320, 560, 8)
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False

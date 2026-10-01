"""B5 · AI Helpers Around the World — visuals."""
import math

import build as K

WHITE = (255, 255, 255)
MAP_BG = (238, 241, 232)
PARK = (198, 228, 182)
LAKE = (178, 214, 242)
OCEAN = (126, 186, 238)
OCEAN_DARK = (92, 156, 220)
LAND = (122, 188, 118)
LAND_DARK = (92, 156, 92)
CITY = (222, 214, 238)
CITY_DARK = (196, 186, 222)
ASPHALT = (92, 100, 116)
GRASS = (124, 186, 96)
GRASS_DARK = (98, 160, 76)
PITCH = (222, 196, 140)
WOOD = (214, 170, 120)
WOOD_DARK = (176, 128, 84)
SOFA = (123, 97, 214)
SOFA_DARK = (98, 76, 186)
BLACKBOARD = (44, 84, 72)
MUFFIN = (170, 112, 64)
MUFFIN_CUP = (240, 196, 120)
FUR = (186, 132, 84)
FUR_DARK = (120, 80, 46)
CAR_BLUE = (72, 118, 214)
SUITCASE = (255, 106, 26)


def S_(s):
    return lambda v: v * s


# ---------------------------------------------------------------------------
# people & small props
# ---------------------------------------------------------------------------

def meera(draw, cx, cy, s, t=0.0):
    """Girl with two braids. cy = head centre (same anchor as draw_person)."""
    S = S_(s)
    yy = cy + S(6) * math.sin(t * math.pi * 4)
    for sx in (-1, 1):
        bx = cx + sx * S(60)
        draw.rounded_rectangle((bx - S(15), yy - S(16), bx + S(15), yy + S(74)), radius=S(14), fill=K.HAIR)
    K.draw_person(draw, cx, cy, s, "kid", t)
    for sx in (-1, 1):
        bx = cx + sx * S(60)
        draw.ellipse((bx - S(15), yy + S(60), bx + S(15), yy + S(84)), fill=K.GOLD)


def arjun(draw, cx, cy, s, t=0.0):
    S = S_(s)
    K.draw_person(draw, cx, cy, s, "friend", t)
    yy = cy + S(6) * math.sin(t * math.pi * 4)
    draw.chord((cx - S(66), yy - S(80), cx + S(66), yy - S(10)), 180, 360, fill=K.ROAD)
    draw.rounded_rectangle((cx - S(6), yy - S(48), cx + S(96), yy - S(34)), radius=S(7), fill=K.ROAD)


def bat(draw, x, y, s, ang=-0.35):
    """x, y = handle top."""
    S = S_(s)
    dx, dy = math.sin(ang), math.cos(ang)
    hx, hy = x + dx * S(60), y + dy * S(60)
    draw.line((x, y, hx, hy), fill=K.DEV_DARK, width=max(3, int(S(14))))
    ex, ey = x + dx * S(230), y + dy * S(230)
    nx, ny = dy * S(22), -dx * S(22)
    draw.polygon([(hx + nx, hy + ny), (ex + nx, ey + ny), (ex - nx, ey - ny), (hx - nx, hy - ny)], fill=WOOD,
                 outline=WOOD_DARK)


def ball(draw, x, y, r):
    draw.ellipse((x - r, y - r, x + r, y + r), fill=K.DANGER)
    draw.arc((x - r * 0.6, y - r, x + r * 1.4, y + r), 120, 240, fill=WHITE, width=max(1, int(r * 0.14)))


def house(draw, cx, by, s, wall=(255, 244, 228), roof=K.CORAL, door=(13, 148, 136)):
    S = S_(s)
    draw.rectangle((cx - S(150) + S(10), by - S(200) + S(12), cx + S(150) + S(10), by + S(12)), fill=K.SHADOW)
    draw.rectangle((cx - S(150), by - S(200), cx + S(150), by), fill=wall, outline=K.DEV_DARK, width=max(2, int(S(5))))
    draw.polygon([(cx - S(190), by - S(196)), (cx, by - S(330)), (cx + S(190), by - S(196))], fill=roof)
    draw.rectangle((cx - S(34), by - S(110), cx + S(34), by), fill=door, outline=K.DEV_DARK, width=max(2, int(S(4))))
    for wx in (cx - S(120), cx + S(62)):
        draw.rectangle((wx, by - S(170), wx + S(58), by - S(116)), fill=K.DEV_SCREEN, outline=K.DEV_DARK,
                       width=max(2, int(S(4))))


def box(draw, cx, by, s):
    S = S_(s)
    draw.rectangle((cx - S(60) + S(5), by - S(84) + S(6), cx + S(60) + S(5), by + S(6)), fill=K.SHADOW)
    draw.rectangle((cx - S(60), by - S(84), cx + S(60), by), fill=(214, 166, 110), outline=(170, 120, 70),
                   width=max(2, int(S(4))))
    draw.rectangle((cx - S(12), by - S(84), cx + S(12), by), fill=(236, 210, 160))


def phone(draw, cx, cy, s=1.0):
    S = S_(s)
    draw.rounded_rectangle((cx - S(130) + S(8), cy - S(240) + S(10), cx + S(130) + S(8), cy + S(240) + S(10)),
                           radius=S(36), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(130), cy - S(240), cx + S(130), cy + S(240)), radius=S(36), fill=K.DEV_DARK)
    scr = (cx - S(112), cy - S(204), cx + S(112), cy + S(204))
    draw.rounded_rectangle(scr, radius=S(12), fill=(250, 250, 252))
    draw.rounded_rectangle((cx - S(30), cy - S(226), cx + S(30), cy - S(214)), radius=S(6), fill=K.DEV_MID)
    return scr


def lines_c(draw, lines, cx, y, size, col, gap=1.22):
    f = K.load_font(size, bold=True)
    for j, ln in enumerate(lines):
        K.text_at(draw, ln, cx, y + j * int(size * gap), f, col)


def wrap_c(draw, text, cx, y, maxw, size, col, gap=1.22):
    f = K.load_font(size, bold=True)
    lines = K.wrap_text(text, f, int(maxw))
    for j, ln in enumerate(lines):
        K.text_at(draw, ln, cx, y + j * int(size * gap), f, col)
    return y + len(lines) * int(size * gap)


def chip(draw, cx, y, label, col, size=26):
    return K.pill(draw, cx, y, label, col, size=size, fg=K.DEV_DEEP if col == K.GOLD else WHITE)


def translate_screen(draw, scr, src, dst, typed=1.0, out=1.0, src_lang="TAMIL", dst_lang="HINDI"):
    x0, y0, x1, y1 = scr
    mx = (x0 + x1) / 2
    wd = x1 - x0
    draw.rounded_rectangle((x0, y0, x1, y0 + 64), radius=12, fill=K.ROAD)
    draw.rectangle((x0, y0 + 40, x1, y0 + 64), fill=K.ROAD)
    K.text_at(draw, "Translate", mx, y0 + 14, K.load_font(32, bold=True), WHITE)
    chip(draw, mx, y0 + 84, src_lang, K.CORAL)
    shown = src[: int(round(len(src) * K.clamp01(typed)))]
    if shown:
        wrap_c(draw, shown, mx, y0 + 140, wd - 30, 30, K.DEV_DEEP)
    my = y0 + (y1 - y0) * 0.52
    K.draw_arrow(draw, mx, my - 10, mx, my + 46, K.DEV_MID, width=8, head=22)
    if out > 0:
        oy = my + 66 + int((1 - out) * 20)
        chip(draw, mx, oy, dst_lang, (13, 148, 136))
        wrap_c(draw, dst, mx, oy + 56, wd - 30, 30, (13, 148, 136))


def partial(path, f):
    seg = [math.dist(path[i], path[i + 1]) for i in range(len(path) - 1)]
    left = sum(seg) * K.clamp01(f)
    pts = [path[0]]
    for i, sl in enumerate(seg):
        if left <= 0:
            break
        r = min(1.0, left / sl)
        pts.append((K.lerp(path[i][0], path[i + 1][0], r), K.lerp(path[i][1], path[i + 1][1], r)))
        left -= sl
    return pts


def map_screen(draw, scr, t, route=1.0, jam=False, reroute=0.0, banner=None, banner_col=K.DANGER, dest="house"):
    x0, y0, x1, y1 = scr
    wd, ht = x1 - x0, y1 - y0

    def P(fx, fy):
        return (x0 + wd * fx, y0 + ht * fy)
    draw.rectangle(scr, fill=MAP_BG)
    draw.ellipse((x0 + wd * 0.38, y0 + ht * 0.42, x0 + wd * 0.62, y0 + ht * 0.58), fill=PARK)
    draw.ellipse((x0 + wd * 0.02, y0 + ht * 0.14, x0 + wd * 0.2, y0 + ht * 0.26), fill=LAKE)
    rw = max(8, int(wd * 0.06))
    for fx in (0.25, 0.75):
        draw.line((P(fx, 0.0), P(fx, 1.0)), fill=WHITE, width=rw)
    for fy in (0.34, 0.66, 0.9):
        draw.line((P(0.0, fy), P(1.0, fy)), fill=WHITE, width=rw)
    path_a = [P(0.25, 0.9), P(0.25, 0.34), P(0.75, 0.34), P(0.75, 0.27)]
    path_b = [P(0.25, 0.9), P(0.25, 0.66), P(0.75, 0.66), P(0.75, 0.27)]
    lw = max(6, int(wd * 0.045))
    if jam:
        draw.line(partial(path_a, 1.0), fill=(200, 206, 216), width=lw, joint="curve")
        draw.line((P(0.25, 0.62), P(0.25, 0.38)), fill=K.DANGER, width=lw)
        for k in range(3):
            cx_, cy_ = P(0.25, 0.42 + k * 0.08)
            draw.rounded_rectangle((cx_ - 9, cy_ - 13, cx_ + 9, cy_ + 13), radius=5, fill=K.DEV_DARK)
        if reroute > 0:
            draw.line(partial(path_b, reroute), fill=K.CORAL, width=lw, joint="curve")
        end = path_b if reroute > 0 else path_a
        car_f = 0.0
    else:
        if route > 0:
            draw.line(partial(path_a, route), fill=K.CORAL, width=lw, joint="curve")
        end = path_a
        car_f = 0.0
    sx, sy = partial(end, car_f)[-1]
    draw.ellipse((sx - 16, sy - 16, sx + 16, sy + 16), fill=CAR_BLUE, outline=WHITE, width=5)
    ex, ey = path_a[-1]
    if dest == "hotel":
        hotel(draw, ex, ey + 10, 0.2)
    elif route >= 0.98 or jam:
        house(draw, ex, ey + 6, 0.2)
        if not banner:
            K.draw_map_pin(draw, ex + 34, ey - 30, 0.34, K.DANGER)
    if banner:
        draw.rounded_rectangle((x0 + 8, y0 + 8, x1 - 8, y0 + 58), radius=16, fill=banner_col)
        K.text_at(draw, banner, (x0 + x1) / 2, y0 + 18, K.load_font(26, bold=True), WHITE)


def tv(draw, box):
    x0, y0, x1, y1 = box
    mx = (x0 + x1) / 2
    draw.rounded_rectangle((mx - 120, y1 + 4, mx + 120, y1 + 24), radius=8, fill=K.DEV_DARK)
    draw.rectangle((mx - 20, y1 - 4, mx + 20, y1 + 8), fill=K.DEV_DARK)
    draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=24, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=24, fill=K.DEV_DARK)
    return (x0 + 20, y0 + 20, x1 - 20, y1 - 20)


def cricket_view(draw, scr, t, caption=None, cc=False, cap_size=34):
    x0, y0, x1, y1 = scr
    wd, ht = x1 - x0, y1 - y0
    draw.rectangle(scr, fill=(196, 226, 248))
    gy = y0 + ht * 0.42
    draw.rectangle((x0, gy, x1, y1), fill=GRASS)
    for k in range(6):
        sx0 = x0 + k * wd / 6
        if k % 2:
            draw.rectangle((sx0, gy, sx0 + wd / 6, y1), fill=GRASS_DARK)
    draw.rectangle((x0, gy - ht * 0.1, x1, gy), fill=(232, 232, 240))
    for k in range(12):
        px = x0 + 20 + k * (wd - 40) / 11
        draw.ellipse((px - 10, gy - ht * 0.08, px + 10, gy - ht * 0.08 + 20),
                     fill=[K.CORAL, K.GOLD, K.ROAD, SOFA][k % 4])
    mx = x0 + wd * 0.5
    draw.polygon([(mx - wd * 0.06, gy + 6), (mx + wd * 0.06, gy + 6), (mx + wd * 0.12, y1), (mx - wd * 0.12, y1)],
                 fill=PITCH)
    s = ht / 520
    K.draw_person(draw, mx - wd * 0.02, gy + ht * 0.2, 0.62 * s, "dad", 0)
    bat(draw, mx + wd * 0.04, gy + ht * 0.28, 0.6 * s, ang=0.5 + 0.25 * math.sin(t * 6))
    bx = x0 + wd * (0.62 + 0.3 * ((t * 1.2) % 1))
    by = gy - ht * 0.18 - ht * 0.12 * math.sin(((t * 1.2) % 1) * math.pi)
    ball(draw, bx, by, max(6, 10 * s))
    draw.rounded_rectangle((x0 + 14, y0 + 14, x0 + 14 + 170, y0 + 60), radius=10, fill=K.DEV_DEEP)
    K.text_at(draw, "IND 210/3", x0 + 99, y0 + 22, K.load_font(26, bold=True), WHITE)
    if cc:
        draw.rounded_rectangle((x1 - 84, y0 + 14, x1 - 14, y0 + 60), radius=8, fill=WHITE, outline=K.DEV_DEEP, width=3)
        K.text_at(draw, "CC", x1 - 49, y0 + 20, K.load_font(28, bold=True), K.DEV_DEEP)
    if caption:
        f = K.load_font(cap_size, bold=True)
        tw = draw.textbbox((0, 0), caption, font=f)[2]
        cy0 = y1 - cap_size - 40
        draw.rounded_rectangle((mx - tw / 2 - 22, cy0, mx + tw / 2 + 22, cy0 + cap_size + 24), radius=10,
                               fill=(20, 24, 32))
        K.text_at(draw, caption, mx, cy0 + 10, f, WHITE)


def sofa(draw, x0, x1, top):
    draw.rounded_rectangle((x0 + 10, top + 12, x1 + 10, top + 230), radius=30, fill=K.SHADOW)
    draw.rounded_rectangle((x0, top, x1, top + 160), radius=40, fill=SOFA)
    draw.rounded_rectangle((x0 - 30, top + 80, x0 + 70, top + 230), radius=30, fill=SOFA_DARK)
    draw.rounded_rectangle((x1 - 70, top + 80, x1 + 30, top + 230), radius=30, fill=SOFA_DARK)
    draw.rounded_rectangle((x0 + 50, top + 130, x1 - 50, top + 220), radius=24, fill=(150, 128, 228))


def cooker(draw, cx, by, s, t):
    S = S_(s)
    draw.ellipse((cx - S(140), by - S(16), cx + S(140), by + S(16)), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(120), by - S(170), cx + S(120), by), radius=S(30), fill=K.STEEL)
    draw.rectangle((cx - S(120), by - S(150), cx + S(120), by - S(130)), fill=K.STEEL_DARK)
    draw.chord((cx - S(124), by - S(214), cx + S(124), by - S(130)), 180, 360, fill=K.STEEL_DARK)
    draw.rounded_rectangle((cx + S(90), by - S(184), cx + S(260), by - S(160)), radius=S(10), fill=K.DEV_DARK)
    draw.rectangle((cx - S(12), by - S(240), cx + S(12), by - S(206)), fill=K.DEV_DARK)
    jig = S(6) * math.sin(t * 60)
    draw.ellipse((cx - S(22) + jig, by - S(272), cx + S(22) + jig, by - S(232)), fill=K.DEV_DEEP)
    for k in range(4):
        p = (t * 2.4 + k / 4) % 1
        r = S(18) + S(30) * p
        px = cx + S(20) * math.sin(k * 2.1 + t * 5) + S(40) * p * (1 if k % 2 else -1)
        py = by - S(290) - S(170) * p
        draw.ellipse((px - r, py - r, px + r, py + r), fill=(232, 232, 238))


def globe(draw, cx, cy, r, t, pins=None):
    draw.ellipse((cx - r + 12, cy - r + 14, cx + r + 12, cy + r + 14), fill=K.SHADOW)
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=OCEAN)

    def blob(pts, col):
        draw.polygon([(cx + x * r, cy + y * r) for x, y in pts], fill=col)
    blob([(-0.62, -0.5), (-0.3, -0.62), (-0.18, -0.36), (-0.34, -0.1), (-0.52, -0.16), (-0.7, -0.3)], LAND)
    blob([(-0.42, 0.02), (-0.16, 0.0), (-0.12, 0.3), (-0.3, 0.72), (-0.4, 0.4)], LAND)
    blob([(0.02, -0.4), (0.22, -0.42), (0.3, -0.12), (0.2, 0.34), (0.08, 0.36), (-0.02, 0.0)], LAND)
    blob([(0.24, -0.66), (0.68, -0.6), (0.82, -0.3), (0.62, -0.12), (0.5, 0.06), (0.4, -0.2), (0.26, -0.36)], LAND)
    blob([(0.44, -0.16), (0.56, -0.12), (0.5, 0.12)], LAND_DARK)
    blob([(0.56, 0.36), (0.78, 0.34), (0.76, 0.54), (0.58, 0.52)], LAND)
    for k in range(3):
        ph = (t * 0.6 + k / 3) % 1
        hw = r * abs(math.cos(ph * math.pi))
        if hw > 6:
            draw.ellipse((cx - hw, cy - r, cx + hw, cy + r), outline=OCEAN_DARK, width=3)
    for fy in (-0.5, 0.0, 0.5):
        hw = r * math.sqrt(1 - fy * fy)
        draw.line((cx - hw, cy + fy * r, cx + hw, cy + fy * r), fill=OCEAN_DARK, width=3)
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), outline=K.DEV_DARK, width=6)
    if pins:
        for k, (fx, fy, col) in enumerate(pins):
            K.draw_map_pin(draw, cx + fx * r, cy + fy * r, 0.42, col)


def squiggles(draw, x0, y, wd, col, rows=2, gap=56, seed=0):
    for row in range(rows):
        x = x0
        k = seed + row * 3
        while x < x0 + wd - 40:
            ln = 50 + (k * 37) % 70
            pts = [(x + i * ln / 12, y + row * gap + 10 * math.sin(i * 1.3 + k)) for i in range(13)]
            draw.line(pts, fill=col, width=7, joint="curve")
            draw.ellipse((x + ln * 0.3 - 6, y + row * gap - 26, x + ln * 0.3 + 6, y + row * gap - 14), fill=col)
            x += ln + 26
            k += 1


def hotel(draw, cx, by, s):
    S = S_(s)
    draw.rectangle((cx - S(120) + S(10), by - S(380) + S(12), cx + S(120) + S(10), by + S(12)), fill=K.SHADOW)
    draw.rectangle((cx - S(120), by - S(380), cx + S(120), by), fill=(236, 226, 250), outline=K.DEV_DARK,
                   width=max(2, int(S(5))))
    draw.rounded_rectangle((cx - S(100), by - S(440), cx + S(100), by - S(384)), radius=S(10), fill=K.CORAL)
    if S(38) >= 26:
        K.text_at(draw, "HOTEL", cx, by - S(434), K.load_font(int(S(38)), bold=True), WHITE)
    else:
        K.draw_star(draw, cx, by - S(412), S(22), WHITE)
    for row in range(4):
        for col in range(3):
            wx = cx - S(90) + col * S(66)
            wy = by - S(350) + row * S(70)
            draw.rectangle((wx, wy, wx + S(48), wy + S(44)), fill=K.DEV_SCREEN, outline=K.DEV_DARK,
                           width=max(1, int(S(3))))
    draw.rectangle((cx - S(40), by - S(70), cx + S(40), by), fill=(13, 148, 136), outline=K.DEV_DARK,
                   width=max(2, int(S(4))))


def trophy(draw, cx, cy, s, label=None):
    S = S_(s)
    draw.rounded_rectangle((cx - S(110) + S(8), cy + S(120) + S(10), cx + S(110) + S(8), cy + S(170) + S(10)),
                           radius=S(10), fill=K.SHADOW)
    for sx, a0, a1 in ((-1, 90, 270), (1, -90, 90)):
        draw.arc((cx + sx * S(110) - S(60), cy - S(110), cx + sx * S(110) + S(60), cy + S(10)), a0, a1,
                 fill=K.GOLD, width=max(3, int(S(20))))
    draw.chord((cx - S(130), cy - S(240), cx + S(130), cy + S(70)), 0, 180, fill=K.GOLD)
    draw.rectangle((cx - S(130), cy - S(150), cx + S(130), cy - S(86)), fill=K.GOLD)
    draw.rectangle((cx - S(26), cy + S(60), cx + S(26), cy + S(124)), fill=(232, 160, 40))
    draw.rounded_rectangle((cx - S(110), cy + S(120), cx + S(110), cy + S(170)), radius=S(10), fill=K.DEV_DARK)
    K.draw_star(draw, cx, cy - S(70), S(46), WHITE)
    if label:
        K.text_at(draw, label, cx, cy + S(126), K.load_font(max(14, int(S(32))), bold=True), WHITE)


def suitcase(draw, cx, cy, s):
    S = S_(s)
    draw.rounded_rectangle((cx - S(50), cy - S(150), cx + S(50), cy - S(100)), radius=S(16), outline=K.DEV_DARK,
                           width=max(3, int(S(14))))
    draw.rounded_rectangle((cx - S(130) + S(8), cy - S(110) + S(10), cx + S(130) + S(8), cy + S(110) + S(10)),
                           radius=S(26), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(130), cy - S(110), cx + S(130), cy + S(110)), radius=S(26), fill=SUITCASE)
    for sx in (-1, 1):
        draw.rectangle((cx + sx * S(70) - S(10), cy - S(110), cx + sx * S(70) + S(10), cy + S(110)),
                       fill=(232, 86, 16))
    draw.ellipse((cx - S(40), cy - S(30), cx + S(40), cy + S(50)), fill=K.GOLD)
    K.draw_star(draw, cx, cy + S(10), S(26), WHITE)


def plane(draw, cx, cy, s, ang=0.0, col=K.ROAD):
    S = S_(s)
    ca, sa = math.cos(ang), math.sin(ang)

    def R(x, y):
        return (cx + S(x) * ca - S(y) * sa, cy + S(x) * sa + S(y) * ca)
    draw.polygon([R(-70, -12), R(60, -12), R(84, 0), R(60, 12), R(-70, 12)], fill=col)
    draw.polygon([R(-6, -10), R(-36, -70), R(-16, -70), R(28, -10)], fill=col)
    draw.polygon([R(-6, 10), R(-36, 70), R(-16, 70), R(28, 10)], fill=col)
    draw.polygon([R(-70, -6), R(-88, -36), R(-74, -36), R(-54, -6)], fill=col)


def dog_face(draw, cx, cy, r):
    draw.ellipse((cx - r * 1.2, cy - r * 0.7, cx - r * 0.55, cy + r * 0.6), fill=FUR_DARK)
    draw.ellipse((cx + r * 0.55, cy - r * 0.7, cx + r * 1.2, cy + r * 0.6), fill=FUR_DARK)
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=FUR)
    draw.ellipse((cx - r * 0.5, cy + r * 0.05, cx + r * 0.5, cy + r * 0.8), fill=(222, 184, 140))
    for sx in (-1, 1):
        draw.ellipse((cx + sx * r * 0.38 - r * 0.12, cy - r * 0.32, cx + sx * r * 0.38 + r * 0.12, cy - r * 0.08),
                     fill=K.DEV_DEEP)
    draw.ellipse((cx - r * 0.18, cy + r * 0.12, cx + r * 0.18, cy + r * 0.38), fill=K.DEV_DEEP)


def muffin(draw, cx, cy, r):
    draw.polygon([(cx - r * 0.85, cy), (cx + r * 0.85, cy), (cx + r * 0.62, cy + r), (cx - r * 0.62, cy + r)],
                 fill=MUFFIN_CUP)
    for k in range(5):
        lx = cx - r * 0.6 + k * r * 0.3
        draw.line((lx, cy + 4, lx * 0.96 + cx * 0.04, cy + r - 4), fill=(214, 166, 90), width=max(2, int(r * 0.06)))
    draw.ellipse((cx - r, cy - r * 0.9, cx + r, cy + r * 0.3), fill=MUFFIN)
    for dx, dy in ((-0.4, -0.4), (0.2, -0.55), (0.45, -0.15), (-0.1, -0.1), (-0.55, -0.05)):
        draw.ellipse((cx + dx * r - r * 0.1, cy + dy * r - r * 0.1, cx + dx * r + r * 0.1, cy + dy * r + r * 0.1),
                     fill=K.DEV_DEEP)


def translate_icon(draw, cx, cy, s):
    S = S_(s)
    draw.rounded_rectangle((cx - S(150), cy - S(110), cx + S(10), cy - S(10)), radius=S(26), fill=K.CORAL)
    draw.polygon([(cx - S(120), cy - S(14)), (cx - S(80), cy - S(14)), (cx - S(130), cy + S(24))], fill=K.CORAL)
    draw.rounded_rectangle((cx - S(30), cy + S(4), cx + S(170), cy + S(104)), radius=S(26), fill=(13, 148, 136))
    draw.polygon([(cx + S(110), cy + S(100)), (cx + S(150), cy + S(100)), (cx + S(160), cy + S(138))],
                 fill=(13, 148, 136))
    if S(36) >= 26:
        K.text_at(draw, "Hi", cx - S(70), cy - S(86), K.load_font(int(S(46)), bold=True), WHITE)
        K.text_at(draw, "Namaste", cx + S(70), cy + S(34), K.load_font(int(S(36)), bold=True), WHITE)
    else:
        draw.rounded_rectangle((cx - S(110), cy - S(68), cx - S(30), cy - S(52)), radius=S(8), fill=WHITE)
        draw.rounded_rectangle((cx + S(10), cy + S(46), cx + S(130), cy + S(62)), radius=S(8), fill=WHITE)


def map_icon(draw, cx, cy, s):
    S = S_(s)
    pts = [(cx - S(150), cy - S(90)), (cx - S(50), cy - S(110)), (cx + S(50), cy - S(90)), (cx + S(150), cy - S(110)),
           (cx + S(150), cy + S(100)), (cx + S(50), cy + S(120)), (cx - S(50), cy + S(100)), (cx - S(150), cy + S(120))]
    draw.polygon([(x + S(8), y + S(10)) for x, y in pts], fill=K.SHADOW)
    draw.polygon(pts, fill=MAP_BG, outline=K.DEV_DARK)
    draw.line((cx - S(50), cy - S(110), cx - S(50), cy + S(100)), fill=(214, 214, 200), width=max(2, int(S(4))))
    draw.line((cx + S(50), cy - S(90), cx + S(50), cy + S(120)), fill=(214, 214, 200), width=max(2, int(S(4))))
    K.draw_dashed(draw, cx - S(120), cy + S(70), cx + S(20), cy + S(10), K.CORAL, width=max(3, int(S(10))),
                  dash=int(S(20)), gap=int(S(14)))
    K.draw_dashed(draw, cx + S(20), cy + S(10), cx + S(80), cy - S(20), K.CORAL, width=max(3, int(S(10))),
                  dash=int(S(20)), gap=int(S(14)))
    K.draw_map_pin(draw, cx + S(90), cy - S(14), 0.9 * s, K.DANGER)


def cc_icon(draw, cx, cy, s, t=0.0):
    S = S_(s)
    scr = tv(draw, (cx - S(160), cy - S(110), cx + S(160), cy + S(90)))
    x0, y0, x1, y1 = scr
    draw.rectangle(scr, fill=(196, 226, 248))
    draw.rectangle((x0, y0 + (y1 - y0) * 0.5, x1, y1), fill=GRASS)
    draw.rounded_rectangle((x0 + S(20), y1 - S(56), x1 - S(20), y1 - S(14)), radius=S(8), fill=(20, 24, 32))
    for k, lw in enumerate((0.55, 0.25)):
        lx = x0 + S(36) + k * S(170)
        draw.rounded_rectangle((lx, y1 - S(42), lx + (x1 - x0) * lw * 0.6, y1 - S(28)), radius=S(5), fill=WHITE)
    draw.rounded_rectangle((x1 - S(70), y0 + S(10), x1 - S(10), y0 + S(50)), radius=S(6), fill=WHITE,
                           outline=K.DEV_DEEP, width=max(2, int(S(3))))
    if S(28) >= 26:
        K.text_at(draw, "CC", x1 - S(40), y0 + S(14), K.load_font(int(S(28)), bold=True), K.DEV_DEEP)
    else:
        for k in range(2):
            ox = x1 - S(54) + k * S(26)
            draw.arc((ox - S(9), y0 + S(20), ox + S(9), y0 + S(40)), 40, 320, fill=K.DEV_DEEP, width=max(2, int(S(5))))


def steering(draw, cx, cy, r):
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), outline=K.DEV_DARK, width=max(4, int(r * 0.16)))
    draw.ellipse((cx - r * 0.24, cy - r * 0.24, cx + r * 0.24, cy + r * 0.24), fill=K.DEV_DARK)
    for a in (math.pi / 2, math.pi * 7 / 6, -math.pi / 6):
        draw.line((cx, cy, cx + math.cos(a) * r * 0.9, cy + math.sin(a) * r * 0.9), fill=K.DEV_DARK,
                  width=max(4, int(r * 0.12)))


def car_side(draw, cx, by, s, col=CAR_BLUE, rider=True, t=0.0):
    S = S_(s)
    draw.ellipse((cx - S(170), by - S(14), cx + S(170), by + S(14)), fill=K.SHADOW)
    draw.polygon([(cx - S(90), by - S(100)), (cx - S(56), by - S(170)), (cx + S(70), by - S(170)),
                  (cx + S(110), by - S(100))], fill=col)
    win = (214, 236, 250)
    draw.polygon([(cx - S(72), by - S(104)), (cx - S(48), by - S(156)), (cx + S(6), by - S(156)), (cx + S(6), by - S(104))],
                 fill=win)
    draw.polygon([(cx + S(18), by - S(104)), (cx + S(18), by - S(156)), (cx + S(64), by - S(156)),
                  (cx + S(94), by - S(104))], fill=win)
    if rider:
        meera_face = (cx - S(24), by - S(128))
        draw.ellipse((meera_face[0] - S(24), meera_face[1] - S(26), meera_face[0] + S(24), meera_face[1] + S(22)),
                     fill=K.HAIR)
        draw.ellipse((meera_face[0] - S(20), meera_face[1] - S(18), meera_face[0] + S(20), meera_face[1] + S(22)),
                     fill=K.SKIN)
        K.draw_face(draw, cx + S(50), by - S(126), S(20), "kid", 1.0)
    draw.rounded_rectangle((cx - S(160), by - S(108), cx + S(160), by - S(30)), radius=S(26), fill=col)
    draw.rounded_rectangle((cx + S(128), by - S(90), cx + S(158), by - S(70)), radius=S(6), fill=K.GOLD)
    for wx in (cx - S(96), cx + S(96)):
        draw.ellipse((wx - S(36), by - S(70), wx + S(36), by + S(2)), fill=K.DEV_DARK)
        draw.ellipse((wx - S(15), by - S(49), wx + S(15), by - S(19)), fill=K.STEEL)
        a = t * 30
        draw.line((wx, by - S(34), wx + S(13) * math.cos(a), by - S(34) + S(13) * math.sin(a)), fill=K.DEV_DARK,
                  width=max(2, int(S(4))))


def skyline(draw, x0, x1, base):
    specs = [(0, 120, 260), (130, 90, 180), (230, 140, 320), (390, 100, 220), (500, 160, 280), (680, 110, 200),
             (800, 130, 340), (950, 100, 240), (1060, 150, 300), (1230, 110, 210), (1350, 140, 280),
             (1500, 100, 230)]
    for dx, wd, ht in specs:
        bx = x0 + dx
        if bx + wd > x1:
            continue
        draw.rectangle((bx, base - ht, bx + wd, base), fill=CITY)
        for row in range(int(ht / 60)):
            for col in range(int(wd / 46)):
                wx = bx + 16 + col * 46
                wy = base - ht + 20 + row * 60
                draw.rectangle((wx, wy, wx + 20, wy + 26), fill=CITY_DARK)


def mini_car(draw, cx, cy, s, col):
    S = S_(s)
    draw.rounded_rectangle((cx - S(60), cy - S(26), cx + S(60), cy + S(20)), radius=S(14), fill=col)
    draw.rounded_rectangle((cx - S(36), cy - S(52), cx + S(32), cy - S(20)), radius=S(10), fill=col)
    draw.rectangle((cx - S(28), cy - S(46), cx + S(24), cy - S(26)), fill=(214, 236, 250))
    for wx in (cx - S(34), cx + S(34)):
        draw.ellipse((wx - S(16), cy + S(4), wx + S(16), cy + S(36)), fill=K.DEV_DARK)


# ---------------------------------------------------------------------------
# scenes
# ---------------------------------------------------------------------------

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

    # ---- opening ------------------------------------------------------------
    if visual == "b5-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 300), 450, 110, sage, panel, bounce)
            meera(draw, cx + 300, 410, 1.2, t)
            K.text_at(draw, "Welcome back, champ!", cx, 720, font(60, bold=True), ink)
            stars_around(330, 540)
            return True
        if focus == "bridge":
            K.shadow_card(draw, (300, 250 + lift, w - 300, 850 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · AI CAN BE WRONG", cx, 326 + lift, font(34, bold=True), sage)
            a = K.stagger(progress, 0, step=0.14, speed=5)
            y = 540 + lift
            draw.rounded_rectangle((440, y - 130, 700, y + 130), radius=24, fill=blue_soft)
            dog_face(draw, 570, y, 78)
            K.text_at(draw, "=", 790, y - 50, font(80, bold=True), muted)
            draw.rounded_rectangle((880, y - 130, 1140, y + 130), radius=24, fill=coral_soft)
            muffin(draw, 1010, y - 10, 90)
            K.draw_cross(draw, 1140, y - 130, 30, K.DANGER)
            K.text_at(draw, "Dog or muffin?", 790, y + 150, font(38, bold=True), ink)
            a = K.stagger(progress, 2, step=0.14, speed=4)
            if a > 0:
                yy = int((1 - a) * 30)
                K.draw_person(draw, 1400, 470 + yy + lift, 1.0, "mom", t)
                K.draw_check(draw, 1500, 380 + yy + lift, 34, sage)
                K.pill(draw, 1400, 690 + yy + lift, "Ask a grown-up", sage, size=32)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (240, 240 + lift, w - 240, 500 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 5 OF 5 · LAST ONE IN UNIT 1", cx, 300 + lift, font(32, bold=True), coral)
            K.text_at(draw, "AI Helpers Around the World", cx, 364 + lift, font(80, bold=True), ink)
            specs = [("Translate", lambda x, y: translate_icon(draw, x, y, 0.72)),
                     ("Find the way", lambda x, y: map_icon(draw, x, y, 0.72)),
                     ("Captions", lambda x, y: cc_icon(draw, x, y, 0.72, t))]
            for i, (lab, fn) in enumerate(specs):
                a = K.stagger(progress, i + 1, step=0.12, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 470
                y = 680 + int((1 - a) * 30)
                fn(x, y)
                K.text_at(draw, lab, x, y + 110, font(36, bold=True), muted)
            return True
        # trip
        K.text_at(draw, "Let's go on a trip!", cx, 240 + lift, font(66, bold=True), coral)
        suitcase(draw, cx - 560, 620, 1.0)
        globe(draw, cx + 80, 590, 220, t)
        p = K.ease_in_out(K.clamp01(progress * 1.2))
        p0, p1, p2 = (cx - 560, 470), (cx - 300, 300), (cx + 520, 420)
        K.draw_curve(draw, p0, p1, p2, muted, width=5, dashed=True, phase=t * 100)
        px, py = K.qbez(p0, p1, p2, p)
        nx, ny = K.qbez(p0, p1, p2, min(1.0, p + 0.02))
        plane(draw, px, py, 0.8, math.atan2(ny - py, nx - px + 1e-6))
        star_spots([(cx + 520, 760), (cx + 700, 330), (cx - 760, 340)])
        return True

    # ---- Meera & Arjun ----------------------------------------------------------
    if visual == "b5-hook":
        if focus == "meet":
            draw.ellipse((560 - 290, 560 - 290, 560 + 290, 560 + 290), fill=coral_soft)
            meera(draw, 560, 480, 1.6, t)
            bat(draw, 760, 520, 1.1, ang=-0.25)
            K.text_at(draw, "Meet", 1320, 300 + lift, font(60, bold=True), muted)
            K.text_at(draw, "Meera!", 1320, 370 + lift, font(130, bold=True), coral)
            K.pill(draw, 1320, 560, "Lives in Chennai", K.ROAD, size=36)
            K.pill(draw, 1320, 660, "Speaks Tamil", sage, size=36)
            star_spots([(1000, 330), (1650, 320), (1640, 760)])
            return True
        if focus == "arjun":
            house(draw, 420, 760, 1.0)
            house(draw, 1500, 760, 1.0, wall=(232, 240, 252), roof=K.ROAD, door=K.CORAL)
            meera(draw, 700, 600, 0.9, t)
            a = K.ease_out_cubic(K.clamp01(progress * 2.5))
            ax = K.lerp(1900, 1200, a)
            arjun(draw, ax, 600, 0.9, t)
            for k, (bx, by) in enumerate(((1700, 860), (1800, 860), (1750, 776))):
                box(draw, bx, by, 0.8)
            K.pill(draw, 700, 800, "Meera · Tamil", coral, size=30)
            if a > 0.6:
                K.pill(draw, 1200, 800, "Arjun · Hindi", K.GOLD, fg=ink, size=30)
            K.pill(draw, cx, 236, "New neighbours!", K.BOTH_COLOR, size=34)
            return True
        if focus == "try":
            meera(draw, 420, 560, 1.3, t)
            bat(draw, 600, 560, 1.0, ang=-0.3)
            K.draw_bubble(draw, (540, 250, 1180, 420), brand, "Vaa, cricket vilaiyaadalaam!", tail="left", size=40)
            K.pill(draw, 0, 226, "TAMIL", coral, size=26, left=580)
            arjun(draw, 1460, 580, 1.3, t)
            question_marks([(1300, 330), (1640, 300), (1700, 480)])
            return True
        # ask
        meera(draw, 460, 560, 1.25, t)
        arjun(draw, 1460, 560, 1.25, t)
        K.draw_dashed(draw, 650, 600, 1270, 600, muted, width=6, phase=t * 120)
        draw.ellipse((cx - 110, 490, cx + 110, 710), fill=lav_soft)
        K.text_at(draw, "?", cx, 520, font(int(140 + 20 * pulse), bold=True), K.BOTH_COLOR)
        K.pill(draw, 460, 810, "Tamil", coral, size=30)
        K.pill(draw, 1460, 810, "Hindi", K.GOLD, fg=ink, size=30)
        K.draw_stopwatch(draw, cx, 300, 50, progress, brand)
        return True

    # ---- translation ----------------------------------------------------------------
    if visual == "b5-translate":
        src, dst = "Vaa, cricket vilaiyaadalaam!", "Aao, cricket khelein!"
        if focus == "app":
            meera(draw, 360, 560, 1.15, t)
            K.sound_waves(draw, 470, 540, 1.2, coral, t)
            scr = phone(draw, 900, 548, 1.3)
            translate_screen(draw, scr, src, dst, typed=K.clamp01((progress - 0.35) * 2.2), out=0.0)
            K.draw_person(draw, 1440, 500, 1.2, "dad", t)
            K.pill(draw, 1440, 760, "Appa", K.ROAD, size=32)
            return True
        if focus == "turn":
            meera(draw, 300, 580, 1.0, t)
            scr = phone(draw, 820, 548, 1.3)
            translate_screen(draw, scr, src, dst, typed=1.0, out=K.clamp01(progress * 3))
            K.sound_waves(draw, 1010, 600, 1.2, sage, t)
            happy = progress > 0.4
            arjun(draw, 1440, 500, 1.2, t)
            if happy:
                ball(draw, 1600, 700 + bounce, 24)
                K.draw_heart(draw, 1620, 330 + bounce, 30, coral)
                star_spots([(1250, 300), (1760, 460)])
            return True
        if focus == "define":
            K.shadow_card(draw, (220, 250 + lift, w - 220, 850 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "TRANSLATION", cx, 316 + lift, font(90, bold=True), coral)
            K.text_at(draw, "Changing words from one language to another", cx, 440 + lift, font(46, bold=True), ink)
            rows = [("Tamil", coral, "Hindi", K.GOLD), ("English", K.ROAD, "Bengali", sage)]
            for i, (a_l, a_c, b_l, b_c) in enumerate(rows):
                a = K.stagger(progress, i + 1, step=0.18, speed=4)
                if a <= 0:
                    continue
                y = 560 + i * 130 + lift + int((1 - a) * 30)
                K.pill(draw, cx - 230 - 120, y, a_l, a_c, size=44)
                K.draw_arrow(draw, cx - 90, y + 40, cx + 70, y + 40, muted, width=10, head=28)
                K.pill(draw, cx + 230 + 110 - 100, y, b_l, b_c, size=44, fg=ink if b_c == K.GOLD else WHITE)
            return True
        # how
        for k in range(6):
            a = K.stagger(progress, k, step=0.06, speed=6)
            if a <= 0:
                continue
            x0 = 200 + (k % 3) * 30 + (k // 3) * 260
            y0 = 300 + (k % 3) * 120 + int((1 - a) * 30)
            draw.rounded_rectangle((x0 + 6, y0 + 8, x0 + 300 + 6, y0 + 150 + 8), radius=18, fill=K.SHADOW)
            draw.rounded_rectangle((x0, y0, x0 + 300, y0 + 150), radius=18, fill=panel, outline=line, width=3)
            draw.rounded_rectangle((x0 + 24, y0 + 30, x0 + 200 - (k % 2) * 40, y0 + 50), radius=10, fill=coral)
            K.draw_arrow(draw, x0 + 40, y0 + 64, x0 + 40, y0 + 96, muted, width=5, head=12)
            draw.rounded_rectangle((x0 + 24, y0 + 104, x0 + 230 - (k % 3) * 30, y0 + 124), radius=10, fill=sage)
        K.text_at(draw, "Millions of examples", 480, 790, font(38, bold=True), ink)
        K.draw_arrow(draw, 830, 540, 980, 540, muted, width=12, head=32)
        scr = phone(draw, 1110, 540, 0.9)
        x0, y0, x1, y1 = scr
        for k in range(4):
            for j in range(3):
                px, py = x0 + 40 + j * 64, y0 + 90 + k * 70
                draw.ellipse((px - 14, py - 14, px + 14, py + 14), fill=[coral, sage, K.ROAD][(k + j) % 3])
                if j < 2:
                    draw.line((px + 14, py, px + 50, py), fill=line, width=4)
        K.pill(draw, 1110, 790, "Learned patterns", K.BOTH_COLOR, size=32)
        a = K.stagger(progress, 3, step=0.14, speed=4)
        if a > 0:
            y = 300 + int((1 - a) * 30)
            draw.rounded_rectangle((1340, y, 1780, y + 200), radius=30, fill=sage_soft, outline=sage, width=4)
            K.text_at(draw, "Not magic!", 1560, y + 70, font(52, bold=True), sage)
        a = K.stagger(progress, 5, step=0.12, speed=4)
        if a > 0:
            y = 560 + int((1 - a) * 30)
            draw.rounded_rectangle((1340, y, 1780, y + 260), radius=30, fill=K.DANGER_SOFT, outline=K.DANGER, width=4)
            muffin(draw, 1430, y + 130, 54)
            lines_c(draw, ["Can still", "make funny", "mistakes"], 1620, y + 50, 36, K.DANGER)
        return True

    # ---- map app ----------------------------------------------------------------------
    if visual == "b5-map":
        if focus == "trip":
            skyline(draw, 140, 1300, 700)
            draw.rectangle((100, 700, w - 100, 830), fill=ASPHALT)
            K.draw_dashed(draw, 120, 765, w - 120, 765, WHITE, width=8, dash=60, gap=40, phase=t * 300)
            house(draw, 1580, 700, 0.95, wall=(255, 236, 214), roof=K.BOTH_COLOR)
            K.pill(draw, 1580, 300, "Nani's house", K.BOTH_COLOR, size=32)
            car_x = K.lerp(300, 1150, K.ease_in_out(progress))
            car_side(draw, car_x, 800, 1.0, t=t)
            K.pill(draw, 0, 236, "Far, far away…", ink, size=32, left=160)
            return True
        scr_box = (700, 550, 1.3)
        if focus == "route":
            scr = phone(draw, *scr_box)
            map_screen(draw, scr, t, route=K.clamp01(progress * 1.4))
            K.shadow_card(draw, (1080, 300 + lift, 1780, 780 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "NAVIGATION", 1430, 380 + lift, font(76, bold=True), coral)
            K.text_at(draw, "Finding the way", 1430, 490 + lift, font(50, bold=True), ink)
            K.text_at(draw, "from one place to another", 1430, 560 + lift, font(36, bold=True), muted)
            K.draw_map_pin(draw, 1610, 740 + lift, 0.7, K.DANGER)
            K.draw_dashed(draw, 1250, 700 + lift, 1580, 700 + lift, coral, width=8, phase=t * 120)
            draw.ellipse((1230, 684 + lift, 1262, 716 + lift), fill=CAR_BLUE)
            return True
        if focus == "traffic":
            scr = phone(draw, *scr_box)
            rr = K.clamp01((progress - 0.45) * 2.2)
            map_screen(draw, scr, t, jam=True, reroute=rr, banner="Traffic jam ahead!")
            for k in range(3):
                mini_car(draw, 1200 + k * 150, 400, 0.9, [K.CORAL, K.GOLD, sage][k])
            draw.rounded_rectangle((1110, 300, 1740, 480), radius=30, outline=K.DANGER, width=5)
            K.text_at(draw, "Lots of slow cars!", 1425, 500, font(42, bold=True), K.DANGER)
            if rr > 0:
                y = 620 + int((1 - min(1.0, rr * 2)) * 30)
                draw.rounded_rectangle((1110, y, 1740, y + 150), radius=40, fill=sage_soft, outline=sage, width=4)
                K.draw_check(draw, 1190, y + 75, 36, sage)
                K.text_at(draw, "Another way!", 1460, y + 46, font(52, bold=True), sage)
            return True
        # speak
        scr = phone(draw, *scr_box)
        map_screen(draw, scr, t, route=1.0, banner="Turn left", banner_col=sage)
        K.sound_waves(draw, 890, 420, 1.3, sage, t)
        K.draw_bubble(draw, (1060, 250, 1780, 420), brand, "Turn left in 200 metres", tail="left", size=46)
        K.draw_person(draw, 1460, 600, 1.0, "dad", t)
        steering(draw, 1460, 790, 100)
        K.pill(draw, 1420, 460, "Eyes on the road!", K.ROAD, size=30)
        return True

    # ---- captions -----------------------------------------------------------------------
    if visual == "b5-captions":
        if focus == "nani":
            scr = tv(draw, (180, 280, 980, 730))
            cricket_view(draw, scr, t)
            sofa(draw, 1220, 1720, 560)
            K.draw_person(draw, 1470, 520, 1.15, "nani", t)
            K.pill(draw, 1470, 236, "Nani", K.BOTH_COLOR, size=34)
            K.sound_waves(draw, 990, 500, 1.4, (200, 196, 210), t)
            question_marks([(1300, 330), (1650, 360)])
            return True
        if focus == "cc":
            scr = tv(draw, (140, 260, 1140, 790))
            cricket_view(draw, scr, t, caption="What a shot! It's a SIX!" if progress > 0.25 else None,
                         cc=progress > 0.25, cap_size=40)
            sofa(draw, 1300, 1740, 560)
            K.draw_person(draw, 1520, 520, 1.1, "nani", t)
            K.pill(draw, 1520, 236, "Captions ON", sage, size=34)
            if progress > 0.4:
                K.draw_heart(draw, 1700, 360 + bounce, 30, coral)
                K.draw_check(draw, 1340, 380, 30, sage)
            return True
        if focus == "noisy":
            scr = tv(draw, (140, 280, 900, 720))
            cricket_view(draw, scr, t, caption="Six! India wins!", cc=True, cap_size=34)
            cooker(draw, 1460, 830, 1.0, t)
            K.text_at(draw, "WHEEE!", 1460, 280 + bounce, font(int(70 + 10 * pulse), bold=True), K.DANGER)
            K.sound_waves(draw, 1620, 560, 1.4, K.DANGER, t)
            K.sound_waves(draw, 1300, 560, 1.4, K.DANGER, t, facing="left")
            K.pill(draw, 520, 800, "Still easy to read!", sage, size=32)
            return True
        # look
        scr = tv(draw, (180, 300, 860, 680))
        cricket_view(draw, scr, t, caption="Hello, champ!", cc=True, cap_size=32)
        K.text_at(draw, "Look down here!", 1330, 300 + lift, font(76, bold=True), coral)
        by = int(14 * math.sin(progress * math.pi * 6))
        K.draw_arrow(draw, 1330, 470 + by, 1330, 830 + by, coral, width=26, head=70)
        K.draw_arrow(draw, 1080, 560 + by, 1080, 800 + by, K.GOLD, width=16, head=46)
        K.draw_arrow(draw, 1580, 560 + by, 1580, 800 + by, K.GOLD, width=16, head=46)
        return True

    # ---- around the world ------------------------------------------------------------
    pins = [(0.62, -0.2, K.CORAL), (0.74, -0.42, K.DANGER), (0.2, 0.06, K.BOTH_COLOR), (-0.28, 0.32, sage)]
    if visual == "b5-world":
        if focus == "globe":
            r = int(170 + 120 * appear)
            globe(draw, cx, 560, r, t)
            plane(draw, cx + 300 * math.cos(t * 4), 560 + 290 * math.sin(t * 4) * 0.4 - 220, 0.6, 0.0)
            star_spots([(cx - 600, 340), (cx + 600, 360), (cx - 640, 760), (cx + 640, 740)])
            return True
        globe(draw, cx, 530, 200, t, pins=pins)
        cards = [("Japan", "Map to school", "Konnichiwa!", K.DANGER, 130, 260, "map"),
                 ("Brazil", "Cartoon captions", "Olá!", sage, 1270, 260, "cc"),
                 ("Kenya", "Translates a menu", "Jambo!", K.BOTH_COLOR, 130, 590, "tr"),
                 ("India", "Watching this!", "Namaste!", K.CORAL, 1270, 590, "cc")]
        cw = 520
        for i, (name, sub, hello, col, x0, y0, icon) in enumerate(cards):
            a = K.stagger(progress, i, step=0.12, speed=5) if focus == "kids" else 1.0
            if a <= 0:
                continue
            yy = y0 + int((1 - a) * 30)
            K.shadow_card(draw, (x0, yy, x0 + cw, yy + 250), brand, radius=30, outline=col, outline_w=4)
            K.draw_face(draw, x0 + 80, yy + 130, 46, "kid", 1.0)
            draw.text((x0 + 150, yy + 36), name, fill=col, font=font(48, bold=True))
            if focus == "kids":
                draw.text((x0 + 150, yy + 116), sub, fill=ink, font=font(32, bold=True))
                if icon == "map":
                    K.draw_map_pin(draw, x0 + cw - 60, yy + 216, 0.55, col)
                elif icon == "cc":
                    draw.rounded_rectangle((x0 + cw - 130, yy + 170, x0 + cw - 30, yy + 222), radius=10, fill=panel,
                                           outline=ink, width=3)
                    K.text_at(draw, "CC", x0 + cw - 80, yy + 178, font(30, bold=True), ink)
                else:
                    draw.rounded_rectangle((x0 + cw - 146, yy + 166, x0 + cw - 30, yy + 226), radius=18, fill=col)
                    K.text_at(draw, "A > B", x0 + cw - 88, yy + 178, font(28, bold=True), WHITE)
            else:
                draw.text((x0 + 150, yy + 116), hello, fill=ink, font=font(50, bold=True))
        if focus == "same":
            K.pill(draw, cx, 806, "Same idea · local languages", K.ROAD, size=30)
        return True

    # ---- helpers, not replacements -------------------------------------------------------
    if visual == "b5-helper":
        if focus == "ask":
            K.draw_person(draw, 400, 500, 1.3, "teacher", t)
            K.pill(draw, 400, 760, "Teacher", sage, size=32)
            K.draw_person(draw, 1520, 500, 1.3, "mom", t)
            K.pill(draw, 1520, 760, "Parents", K.BOTH_COLOR, size=32)
            scr = phone(draw, cx, 540, 0.9)
            x0, y0, x1, y1 = scr
            draw.rectangle(scr, fill=blue_soft)
            for sx in (-1, 1):
                draw.ellipse((cx + sx * 50 - 22, 470, cx + sx * 50 + 22, 514), fill=K.ROAD)
            draw.arc((cx - 50, 520, cx + 50, 590), 20, 160, fill=K.ROAD, width=10)
            K.pill(draw, cx, 236, "Replace them?", K.DANGER, size=34)
            question_marks([(cx - 260, 360), (cx + 260, 380)])
            return True
        if focus == "drive":
            draw.rounded_rectangle((160, 640, 1000, 860), radius=40, fill=(226, 220, 210))
            K.draw_person(draw, 480, 470, 1.25, "dad", t)
            steering(draw, 480, 730, 130)
            scr = phone(draw, 840, 560, 0.62)
            map_screen(draw, scr, t, route=1.0)
            K.draw_cup(draw, 250, 600, 0.6, t)
            cards = [("The app", "shows the way", K.ROAD, blue_soft), ("Appa", "drives and decides", sage, sage_soft)]
            for k, (title, sub, col, soft) in enumerate(cards):
                a = K.stagger(progress, k, step=0.25, speed=4)
                if a <= 0:
                    continue
                y = 290 + k * 280 + int((1 - a) * 30)
                draw.rounded_rectangle((1100 + 8, y + 10, 1780 + 8, y + 220 + 10), radius=40, fill=K.SHADOW)
                draw.rounded_rectangle((1100, y, 1780, y + 220), radius=40, fill=soft, outline=col, width=5)
                draw.text((1150, y + 40), title, fill=col, font=font(56, bold=True))
                draw.text((1150, y + 124), sub, fill=ink, font=font(42, bold=True))
            return True
        # people
        specs = [("Teachers", "guide you", sage, sage_soft), ("Parents", "make big decisions", K.BOTH_COLOR, lav_soft),
                 ("AI", "just helps", K.ROAD, blue_soft)]
        for i, (title, sub, col, soft) in enumerate(specs):
            a = K.stagger(progress, i, step=0.14, speed=4)
            if a <= 0:
                continue
            x0 = 150 + i * 560
            y0 = 300 + int((1 - a) * 30)
            draw.rounded_rectangle((x0 + 8, y0 + 10, x0 + 500 + 8, y0 + 540 + 10), radius=40, fill=K.SHADOW)
            draw.rounded_rectangle((x0, y0, x0 + 500, y0 + 540), radius=40, fill=soft, outline=col, width=5)
            mx = x0 + 250
            if i == 0:
                draw.rounded_rectangle((x0 + 40, y0 + 40, x0 + 300, y0 + 200), radius=12, fill=BLACKBOARD,
                                       outline=WOOD_DARK, width=8)
                K.text_at(draw, "A B C", x0 + 170, y0 + 90, font(40, bold=True), WHITE)
                K.draw_person(draw, x0 + 380, y0 + 190, 0.9, "teacher", t)
            elif i == 1:
                K.draw_person(draw, mx - 90, y0 + 170, 0.95, "dad", t)
                K.draw_person(draw, mx + 90, y0 + 180, 0.9, "mom", t)
            else:
                ph = phone(draw, mx, y0 + 200, 0.6)
                draw.rectangle(ph, fill=WHITE)
                K.draw_heart(draw, mx, y0 + 200, 50, coral)
            K.text_at(draw, title, mx, y0 + 360, font(56, bold=True), col)
            K.text_at(draw, sub, mx, y0 + 440, font(38, bold=True), ink)
        return True

    # ---- match the helper -----------------------------------------------------------------
    helpers = [("Map app", K.ROAD, "map"), ("Captions", sage, "cc"), ("Translation", coral, "tr")]
    jobs = [("Words on a video", 1), ("Hindi into Tamil", 2), ("Turn left in 200 m", 0)]

    def helper_icon(kind, x, y, s):
        if kind == "map":
            map_icon(draw, x, y, s)
        elif kind == "cc":
            cc_icon(draw, x, y, s, t)
        else:
            translate_icon(draw, x, y, s)

    if visual == "b5-match":
        if focus == "intro":
            for i, (lab, col, kind) in enumerate(helpers):
                a = K.stagger(progress, i, step=0.15, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 560
                y0 = 280 + int((1 - a) * 40)
                K.shadow_card(draw, (x - 240, y0, x + 240, y0 + 540), brand, radius=36, outline=col, outline_w=5)
                helper_icon(kind, x, y0 + 220, 1.0)
                K.text_at(draw, lab, x, y0 + 420, font(52, bold=True), col)
            return True
        ans = focus == "answer"
        for i, (lab, col, kind) in enumerate(helpers):
            y0 = 270 + i * 200
            K.shadow_card(draw, (180, y0, 780, y0 + 170), brand, radius=30, outline=col, outline_w=4)
            helper_icon(kind, 330, y0 + 85, 0.48)
            draw.text((470, y0 + 56), lab, fill=col, font=font(46, bold=True))
        for j, (lab, target) in enumerate(jobs):
            y0 = 270 + j * 200
            col = helpers[target][1]
            reveal = ans and progress > 0.28 + 0.18 * target
            K.shadow_card(draw, (1140, y0, 1740, y0 + 170), brand, radius=30, outline=col if reveal else line,
                          outline_w=5 if reveal else 3)
            K.text_at(draw, lab, 1440, y0 + 60, font(42, bold=True), ink)
            if reveal:
                K.draw_check(draw, 1740, y0 + 20, 26, col)
        for j, (lab, target) in enumerate(jobs):
            if ans and progress > 0.08 + 0.18 * target:
                ly = 270 + target * 200 + 85
                ry = 270 + j * 200 + 85
                f = K.clamp01((progress - 0.08 - 0.18 * target) * 5)
                ex = K.lerp(790, 1130, f)
                ey = K.lerp(ly, ry, f)
                draw.line((790, ly, ex, ey), fill=helpers[target][1], width=10)
                draw.ellipse((780, ly - 14, 808, ly + 14), fill=helpers[target][1])
                if f >= 1:
                    draw.ellipse((1116, ry - 14, 1144, ry + 14), fill=helpers[target][1])
        if not ans:
            for j in range(3):
                K.text_at(draw, "?", 960, 300 + j * 200, font(int(80 + 14 * pulse), bold=True), K.GOLD)
            K.draw_stopwatch(draw, 960, 256, 30, progress, brand)
        return True

    # ---- new city: two helpers ------------------------------------------------------------
    if visual == "b5-trip":
        if focus == "ask":
            draw.rectangle((100, 820, w - 100, 860), fill=(226, 220, 210))
            K.draw_person(draw, 240, 560, 1.0, "dad", t)
            K.draw_person(draw, 420, 570, 0.95, "mom", t)
            meera(draw, 580, 640, 0.75, t)
            draw.rectangle((960, 470, 980, 820), fill=K.DEV_MID)
            draw.rounded_rectangle((760 + 8, 290 + 10, 1180 + 8, 490 + 10), radius=20, fill=K.SHADOW)
            draw.rounded_rectangle((760, 290, 1180, 490), radius=20, fill=(46, 120, 90), outline=WHITE, width=6)
            squiggles(draw, 800, 360, 340, WHITE, rows=2, gap=70, seed=2)
            hotel(draw, 1560, 820, 0.9)
            question_marks([(1560, 270), (970, 210), (420, 330)], size=70)
            K.draw_stopwatch(draw, 1240, 720, 48, progress, brand)
            return True
        # answer
        for k, (x, lab, col) in enumerate(((520, "Translation", coral), (1400, "Map app", sage))):
            a = K.stagger(progress, k, step=0.25, speed=4)
            if a <= 0:
                continue
            yy = int((1 - a) * 30)
            scr = phone(draw, x, 570 + yy, 1.15)
            x0, y0, x1, y1 = scr
            if k == 0:
                draw.rectangle(scr, fill=WHITE)
                draw.rounded_rectangle((x0 + 12, y0 + 16, x1 - 12, y0 + 170), radius=16, fill=(46, 120, 90))
                squiggles(draw, x0 + 30, y0 + 74, x1 - x0 - 60, WHITE, rows=2, gap=56, seed=2)
                K.draw_arrow(draw, (x0 + x1) / 2, y0 + 196, (x0 + x1) / 2, y0 + 270, K.DEV_MID, width=8, head=22)
                draw.rounded_rectangle((x0 + 12, y0 + 290, x1 - 12, y1 - 20), radius=16, fill=coral_soft,
                                       outline=coral, width=4)
                lines_c(draw, ["Hotel:", "this way!"], (x0 + x1) / 2, y0 + 320, 40, coral)
            else:
                map_screen(draw, scr, t, route=K.clamp01((progress - 0.25) * 2), dest="hotel")
            K.pill(draw, x, 236 + yy, lab, col, size=36)
        if progress > 0.3:
            K.text_at(draw, "+", cx, 470, font(150, bold=True), K.BOTH_COLOR)
        return True

    # ---- checkpoint ---------------------------------------------------------------------------
    if visual == "b5-check":
        if focus == "intro":
            K.shadow_card(draw, (420, 280 + lift, w - 420, 760 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 360 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Help two friends talk!", cx, 440 + lift, font(62, bold=True), ink)
            meera(draw, cx - 220, 600 + lift, 0.7, t)
            arjun(draw, cx + 220, 600 + lift, 0.7, t)
            K.draw_heart(draw, cx, 620 + lift + bounce, 36, coral)
            return True
        ans = focus == "answer"
        draw.rounded_rectangle((130 + 10, 230 + 12, 1080 + 10, 870 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((130, 230, 1080, 870), radius=24, fill=(255, 250, 238))
        lines_c(draw, ["How could translation AI help", "two children who speak", "different languages?"], 605, 262,
                42, coral)
        rows = ["Turns one child's words", "into the other's language", "So they can talk and play!"]
        for i, lab in enumerate(rows):
            y = 470 + i * 130
            draw.line((180, y + 96, 1030, y + 96), fill=(220, 210, 232), width=3)
            shown = ans and progress * 3.2 - 0.3 > i
            if shown:
                K.draw_check(draw, 210, y + 50, 24, sage)
                draw.text((250, y + 26), lab, fill=ink, font=font(42, bold=True))
            elif not ans and i == 1:
                K.text_at(draw, "?", 605, y - 30, font(110, bold=True), line)
        meera(draw, 1260, 640, 0.9, t)
        arjun(draw, 1640, 640, 0.9, t)
        scr = phone(draw, 1450, 400, 0.72)
        x0, y0, x1, y1 = scr
        draw.rectangle(scr, fill=WHITE)
        chip(draw, 1450, y0 + 40, "TAMIL", coral)
        K.draw_arrow(draw, 1450, y0 + 116, 1450, y0 + 176, K.DEV_MID, width=6, head=16)
        chip(draw, 1450, y0 + 200, "HINDI", K.GOLD)
        if ans:
            K.draw_heart(draw, 1450, 780 + bounce, 34, coral)
        else:
            K.draw_stopwatch(draw, 1450, 780, 40, progress, brand)
        return True

    # ---- recap ---------------------------------------------------------------------------------
    if visual == "b5-recap":
        recap = [(("Translation:", "across languages"), coral, "tr"), (("Map apps:", "find the way"), K.ROAD, "map"),
                 (("Captions: read", "what is said"), sage, "cc"), (("AI helps, not", "replaces people"),
                                                                   K.BOTH_COLOR, "help")]
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
                if kind == "tr":
                    translate_icon(draw, ix, iy, 0.95)
                elif kind == "map":
                    map_icon(draw, ix, iy, 0.95)
                elif kind == "cc":
                    cc_icon(draw, ix, iy, 0.95, t)
                else:
                    K.draw_person(draw, ix - 70, iy - 20, 0.8, "teacher", t)
                    ph = phone(draw, ix + 100, iy + 10, 0.42)
                    draw.rectangle(ph, fill=WHITE)
                    K.draw_heart(draw, ix + 100, iy + 10, 30, coral)
                lines_c(draw, lab, x0 + 200, y0 + 390, 36, ink)
            return True
        if focus == "done":
            trophy(draw, cx, 450, 1.0, label="UNIT 1")
            K.draw_mascot(draw, int(cx - 420), 470, 100, sage, panel, bounce)
            meera(draw, cx + 420, 430, 1.0, t)
            K.text_at(draw, "Chapter 5 done!", cx, 670, font(68, bold=True), ink)
            K.pill(draw, cx, 770, "Unit 1 complete!", coral, size=38)
            stars_around(300, 620, 8)
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False

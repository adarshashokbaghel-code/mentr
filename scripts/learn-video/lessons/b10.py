"""B10 · Practice Makes Perfect — visuals."""
import math

import build as K

SKY = (222, 238, 251)
GRASS = (176, 214, 140)
BOW = (236, 84, 140)
CAT_ORANGE = (240, 160, 80)
CAT_GREY = (150, 152, 164)
CAT_BLACK = (72, 68, 74)
CAT_WHITE = (246, 242, 236)
CAT_CREAM = (236, 206, 160)
CUSHION = (178, 156, 232)
CUSHION_DARK = (140, 116, 206)
BIKE = (13, 148, 136)
ROAD_GREY = (206, 200, 190)
BOARD = (44, 92, 72)
BOARD_FRAME = (176, 128, 84)
PAPER = (255, 250, 238)
TROPHY = (255, 190, 60)
TROPHY_DARK = (222, 150, 30)


def S_(s):
    return lambda v: v * s


def shade(col, f):
    return tuple(max(0, min(255, int(c * f))) for c in col)


def meera(draw, cx, cy, s, t=0.0):
    """Kid with a pink bow. cy = head centre; bust spans cy-72s .. cy+141s."""
    K.draw_person(draw, cx, cy, s, "kid", t)
    S = S_(s)
    y = cy + S(6) * math.sin(t * math.pi * 4)
    bx, by = cx - S(50), y - S(58)
    draw.polygon([(bx, by), (bx - S(30), by - S(18)), (bx - S(30), by + S(18))], fill=BOW)
    draw.polygon([(bx, by), (bx + S(30), by - S(18)), (bx + S(30), by + S(18))], fill=BOW)
    draw.ellipse((bx - S(9), by - S(9), bx + S(9), by + S(9)), fill=shade(BOW, 0.8))


def photo(draw, cx, cy, s, sky=SKY, ground=GRASS):
    """Polaroid photo, 220s × 260s. Returns the inner picture box."""
    S = S_(s)
    w, h = S(110), S(130)
    draw.rectangle((cx - w + S(6), cy - h + S(8), cx + w + S(6), cy + h + S(8)), fill=K.SHADOW)
    draw.rectangle((cx - w, cy - h, cx + w, cy + h), fill=(255, 255, 255), outline=(220, 212, 200),
                   width=max(1, int(S(3))))
    ib = (cx - w + S(12), cy - h + S(12), cx + w - S(12), cy + h - S(44))
    draw.rectangle(ib, fill=sky)
    if ground:
        draw.rectangle((ib[0], ib[3] - (ib[3] - ib[1]) * 0.3, ib[2], ib[3]), fill=ground)
    return ib


def cat(draw, cx, cy, s, col=CAT_ORANGE, tail=True):
    """Sitting cat. Spans ≈ cx-60s..cx+90s, cy-80s..cy+84s."""
    S = S_(s)
    dark = shade(col, 0.8)
    if tail:
        draw.arc((cx + S(10), cy + S(20), cx + S(96), cy + S(96)), 270, 90, fill=dark, width=max(2, int(S(12))))
    draw.ellipse((cx - S(52), cy + S(4), cx + S(52), cy + S(84)), fill=col)
    for sx in (-1, 1):
        draw.polygon([(cx + sx * S(46), cy - S(30)), (cx + sx * S(40), cy - S(80)), (cx + sx * S(10), cy - S(50))],
                     fill=col)
        draw.polygon([(cx + sx * S(40), cy - S(38)), (cx + sx * S(38), cy - S(66)), (cx + sx * S(20), cy - S(48))],
                     fill=(250, 190, 190))
    draw.ellipse((cx - S(50), cy - S(56), cx + S(50), cy + S(30)), fill=col)
    eye = (250, 250, 250) if col == CAT_BLACK else K.DEV_DEEP
    for sx in (-1, 1):
        draw.ellipse((cx + sx * S(20) - S(7), cy - S(22), cx + sx * S(20) + S(7), cy - S(6)), fill=eye)
        for k in (-1, 1):
            draw.line((cx + sx * S(16), cy + S(6), cx + sx * S(60), cy + S(2) + k * S(8)), fill=K.DEV_DARK,
                      width=max(1, int(S(3))))
    draw.polygon([(cx - S(7), cy - S(2)), (cx + S(7), cy - S(2)), (cx, cy + S(6))], fill=(226, 90, 100))


def cat_photo(draw, cx, cy, s, col=CAT_ORANGE):
    ib = photo(draw, cx, cy, s)
    cat(draw, (ib[0] + ib[2]) / 2 - 12 * s, (ib[1] + ib[3]) / 2 - 4 * s, 0.82 * s, col)
    return ib


def cushion(draw, cx, cy, s):
    S = S_(s)
    draw.rounded_rectangle((cx - S(80) + S(6), cy - S(62) + S(8), cx + S(80) + S(6), cy + S(62) + S(8)), radius=S(40),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(80), cy - S(62), cx + S(80), cy + S(62)), radius=S(40), fill=CUSHION)
    for sx in (-1, 1):
        for sy in (-1, 1):
            draw.ellipse((cx + sx * S(80) - S(12), cy + sy * S(62) - S(12), cx + sx * S(80) + S(12),
                          cy + sy * S(62) + S(12)), fill=CUSHION_DARK)
    draw.ellipse((cx - S(12), cy - S(12), cx + S(12), cy + S(12)), fill=CUSHION_DARK)
    for k in range(6):
        a = k * math.pi / 3
        draw.line((cx + math.cos(a) * S(14), cy + math.sin(a) * S(14), cx + math.cos(a) * S(50),
                   cy + math.sin(a) * S(38)), fill=CUSHION_DARK, width=max(1, int(S(3))))


def tablet(draw, cx, cy, s):
    """Portrait tablet, 340s × 460s. Returns the screen box."""
    S = S_(s)
    w, h = S(170), S(230)
    draw.rounded_rectangle((cx - w + S(8), cy - h + S(10), cx + w + S(8), cy + h + S(10)), radius=S(30), fill=K.SHADOW)
    draw.rounded_rectangle((cx - w, cy - h, cx + w, cy + h), radius=S(30), fill=K.DEV_DARK)
    draw.ellipse((cx - S(6), cy - h + S(10), cx + S(6), cy - h + S(22)), fill=K.DEV_MID)
    sb = (cx - w + S(16), cy - h + S(32), cx + w - S(16), cy + h - S(32))
    draw.rectangle(sb, fill=(250, 252, 255))
    return sb


def finder(draw, sb, s, color, verdict=None, ground=True):
    """Cat Finder app chrome. Returns the viewfinder box."""
    x0, y0, x1, y1 = sb
    hh = 56 * s
    draw.rectangle((x0, y0, x1, y0 + hh), fill=color)
    K.text_at(draw, "Cat Finder", (x0 + x1) / 2, y0 + hh / 2 - 18 * s, K.load_font(max(26, int(32 * s)), bold=True),
              (255, 255, 255))
    vb = (x0 + 14 * s, y0 + hh + 14 * s, x1 - 14 * s, y1 - 92 * s)
    draw.rectangle(vb, fill=SKY if ground else (244, 238, 250))
    if ground:
        draw.rectangle((vb[0], vb[3] - (vb[3] - vb[1]) * 0.3, vb[2], vb[3]), fill=GRASS)
    if verdict:
        lab, col = verdict
        my = y1 - 46 * s
        f = K.load_font(max(26, int(34 * s)), bold=True)
        bb = draw.textbbox((0, 0), lab, font=f)
        tw = bb[2] - bb[0]
        draw.rounded_rectangle(((x0 + x1) / 2 - tw / 2 - 22, my - 28, (x0 + x1) / 2 + tw / 2 + 22, my + 28), radius=28,
                               fill=col)
        K.text_at(draw, lab, (x0 + x1) / 2, my - 20, f, (255, 255, 255))
    return vb


def ai_chip(draw, cx, cy, s, t=0.0):
    S = S_(s)
    hw = S(110)
    for k in range(5):
        off = -hw + S(30) + k * S(40)
        for (x0, y0, x1, y1) in ((cx + off - S(8), cy - hw - S(28), cx + off + S(8), cy - hw),
                                 (cx + off - S(8), cy + hw, cx + off + S(8), cy + hw + S(28)),
                                 (cx - hw - S(28), cy + off - S(8), cx - hw, cy + off + S(8)),
                                 (cx + hw, cy + off - S(8), cx + hw + S(28), cy + off + S(8))):
            draw.rectangle((x0, y0, x1, y1), fill=K.STEEL_DARK)
    draw.rounded_rectangle((cx - hw + S(8), cy - hw + S(10), cx + hw + S(8), cy + hw + S(10)), radius=S(26),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - hw, cy - hw, cx + hw, cy + hw), radius=S(26), fill=K.DEV_DARK)
    draw.rounded_rectangle((cx - S(78), cy - S(78), cx + S(78), cy + S(78)), radius=S(18), fill=K.DEV_DEEP)
    glow = K.LED_ON if int(t * 8) % 2 == 0 else (60, 190, 140)
    K.text_at(draw, "AI", cx, cy - S(48), K.load_font(max(12, int(S(84))), bold=True), glow)


def data_tile(draw, kind, x, y, s, brand):
    S = S_(s)
    hw = S(46)
    draw.rounded_rectangle((x - hw + S(4), y - hw + S(6), x + hw + S(4), y + hw + S(6)), radius=S(14), fill=K.SHADOW)
    draw.rounded_rectangle((x - hw, y - hw, x + hw, y + hw), radius=S(14), fill=(255, 255, 255),
                           outline=K.hex_rgb(brand["line"]), width=max(1, int(S(3))))
    if kind == "pic":
        draw.rectangle((x - S(32), y - S(30), x + S(32), y + S(30)), fill=SKY)
        draw.polygon([(x - S(32), y + S(30)), (x - S(6), y - S(6)), (x + S(14), y + S(30))], fill=K.LEAF)
        draw.polygon([(x - S(2), y + S(30)), (x + S(18), y + S(4)), (x + S(32), y + S(30))], fill=(50, 130, 80))
        draw.ellipse((x + S(10), y - S(24), x + S(26), y - S(8)), fill=K.CORAL)
    elif kind == "word":
        K.text_at(draw, "Aa", x, y - S(30), K.load_font(max(12, int(S(46))), bold=True), K.BOTH_COLOR)
    else:
        K.draw_notes(draw, x - S(4), y - S(6), 0.62 * s, 0.0, color=K.hex_rgb(brand["sage"]))


def cycle(draw, cx, gy, s, t=0.0, col=BIKE, bow=False):
    """Side-view bicycle facing right. gy = ground line; top of handlebar ≈ gy-220s; spans cx-185s..cx+185s."""
    S = S_(s)
    wr = S(72)
    rear, front = (cx - S(112), gy - wr), (cx + S(112), gy - wr)
    draw.ellipse((cx - S(190), gy - S(8), cx + S(190), gy + S(10)), fill=K.SHADOW)
    for hx, hy in (rear, front):
        draw.ellipse((hx - wr, hy - wr, hx + wr, hy + wr), outline=K.DEV_DARK, width=max(3, int(S(14))))
        for k in range(6):
            a = t * 20 + k * math.pi / 3
            draw.line((hx, hy, hx + math.cos(a) * wr * 0.86, hy + math.sin(a) * wr * 0.86), fill=K.STEEL,
                      width=max(1, int(S(3))))
        draw.ellipse((hx - S(9), hy - S(9), hx + S(9), hy + S(9)), fill=K.DEV_MID)
    crank = (cx - S(12), gy - wr)
    seat = (cx - S(44), gy - S(186))
    head = (cx + S(74), gy - S(178))
    fw = max(3, int(S(14)))
    for a, b in ((rear, crank), (rear, seat), (seat, crank), (crank, head), (seat, head), (head, front)):
        draw.line((a, b), fill=col, width=fw)
    bar = (cx + S(86), gy - S(214))
    draw.line((head, bar), fill=K.DEV_DARK, width=fw)
    draw.line((bar[0] - S(10), bar[1], bar[0] + S(34), bar[1] - S(4)), fill=K.DEV_DARK, width=max(3, int(S(12))))
    draw.ellipse((bar[0] + S(2), bar[1] - S(22), bar[0] + S(22), bar[1] - S(4)), fill=K.GOLD)
    draw.rounded_rectangle((seat[0] - S(34), seat[1] - S(16), seat[0] + S(26), seat[1]), radius=S(8), fill=K.DEV_DARK)
    pa = t * 14
    for sgn in (1, -1):
        px, py = crank[0] + sgn * math.cos(pa) * S(30), crank[1] + sgn * math.sin(pa) * S(30)
        draw.line((crank, (px, py)), fill=K.DEV_MID, width=max(2, int(S(7))))
        draw.rounded_rectangle((px - S(14), py - S(5), px + S(14), py + S(5)), radius=S(3), fill=K.DEV_DARK)
    draw.ellipse((crank[0] - S(16), crank[1] - S(16), crank[0] + S(16), crank[1] + S(16)), fill=K.STEEL_DARK)
    if bow:
        bx, by = (seat[0] + head[0]) / 2, (seat[1] + head[1]) / 2 - S(6)
        for sx in (-1, 1):
            draw.polygon([(bx, by), (bx + sx * S(40), by - S(26)), (bx + sx * S(40), by + S(26))], fill=K.CORAL)
        draw.ellipse((bx - S(12), by - S(12), bx + S(12), by + S(12)), fill=shade(K.CORAL, 0.8))
        draw.line((bx, by, bx - S(20), by + S(50)), fill=K.CORAL, width=max(2, int(S(8))))
        draw.line((bx, by, bx + S(22), by + S(48)), fill=K.CORAL, width=max(2, int(S(8))))
    return seat, bar, crank


def rider(draw, cx, gy, s, t=0.0):
    seat, bar, crank = cycle(draw, cx, gy, s, t)
    S = S_(s)
    ms = 0.78 * s
    hx, hy = seat[0] + S(10), seat[1] - 141 * ms + S(26)
    pa = t * 14
    px, py = crank[0] + math.cos(pa) * S(30), crank[1] + math.sin(pa) * S(30)
    draw.line((seat[0] + S(6), seat[1] - S(6), px, py), fill=K.ROAD, width=max(3, int(S(18))), joint="curve")
    meera(draw, hx, hy, ms, 0.0)
    draw.line((hx + 50 * ms, hy + 90 * ms, bar[0] + S(14), bar[1]), fill=K.SKIN, width=max(3, int(S(14))))
    return hx, hy


def notebook(draw, box, red=(240, 170, 170)):
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=20, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=20, fill=PAPER)
    for yy in range(int(y0) + 80, int(y1) - 20, 76):
        draw.line((x0 + 20, yy, x1 - 20, yy), fill=(220, 210, 232), width=2)
    draw.line((x0 + 90, y0 + 10, x0 + 90, y1 - 10), fill=red, width=3)
    for k in range(int((y1 - y0) / 80)):
        ry = y0 + 40 + k * 80
        draw.ellipse((x0 + 24, ry - 10, x0 + 44, ry + 10), fill=K.hex_rgb("#F3EDE3"))


def blackboard(draw, box):
    x0, y0, x1, y1 = box
    draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=16, fill=K.SHADOW)
    draw.rounded_rectangle(box, radius=16, fill=BOARD_FRAME)
    draw.rectangle((x0 + 18, y0 + 18, x1 - 18, y1 - 18), fill=BOARD)


def trophy(draw, cx, cy, s, col=TROPHY, label=None, mark=None):
    """Trophy cup. cy = cup centre; spans cy-110s .. cy+190s."""
    S = S_(s)
    dark = shade(col, 0.86)
    for sx in (-1, 1):
        draw.arc((cx + sx * S(96) - S(50), cy - S(80), cx + sx * S(96) + S(50), cy + S(20)),
                 90 if sx > 0 else 270, 270 if sx > 0 else 90, fill=dark, width=max(3, int(S(16))))
    draw.chord((cx - S(110), cy - S(220), cx + S(110), cy + S(90)), 0, 180, fill=col)
    draw.rectangle((cx - S(110), cy - S(110), cx + S(110), cy - S(64)), fill=col)
    draw.ellipse((cx - S(110), cy - S(130), cx + S(110), cy - S(90)), fill=dark)
    draw.polygon([(cx - S(22), cy + S(80)), (cx + S(22), cy + S(80)), (cx + S(14), cy + S(130)),
                  (cx - S(14), cy + S(130))], fill=dark)
    draw.rounded_rectangle((cx - S(80), cy + S(126), cx + S(80), cy + S(190)), radius=S(12), fill=K.DEV_DARK)
    draw.ellipse((cx - S(70), cy - S(70), cx - S(40), cy - S(10)), fill=shade(col, 1.12))
    if mark:
        K.text_at(draw, mark, cx, cy - S(70), K.load_font(max(26, int(S(110))), bold=True), (255, 255, 255))
    if label:
        K.text_at(draw, label, cx, cy + S(138), K.load_font(max(26, int(S(36))), bold=True), K.GOLD)


def target(draw, cx, cy, r, hit=None):
    for k, col in enumerate((K.DANGER, (255, 255, 255), K.DANGER, (255, 255, 255), K.DANGER)):
        rr = r * (1 - k * 0.2)
        draw.ellipse((cx - rr, cy - rr, cx + rr, cy + rr), fill=col)
    if hit:
        hx, hy = cx + hit[0] * r, cy + hit[1] * r
        draw.line((hx, hy, hx + r * 0.7, hy - r * 0.5), fill=K.DEV_DARK, width=max(3, int(r * 0.08)))
        tx, ty = hx + r * 0.7, hy - r * 0.5
        draw.polygon([(tx, ty), (tx + r * 0.28, ty - r * 0.06), (tx + r * 0.1, ty + r * 0.14)], fill=K.GOLD)
        draw.ellipse((hx - r * 0.06, hy - r * 0.06, hx + r * 0.06, hy + r * 0.06), fill=K.DEV_DEEP)


def loop_ring(draw, cx, cy, r, col, t, width=24):
    a0 = t * 200
    draw.arc((cx - r, cy - r, cx + r, cy + r), a0, a0 + 300, fill=col, width=width)
    ae = math.radians(a0 + 300)
    ex, ey = cx + r * math.cos(ae), cy + r * math.sin(ae)
    tx, ty = -math.sin(ae), math.cos(ae)
    nx, ny = math.cos(ae), math.sin(ae)
    hl = width * 1.6
    draw.polygon([(ex + tx * hl, ey + ty * hl), (ex + nx * hl * 0.8, ey + ny * hl * 0.8),
                  (ex - nx * hl * 0.8, ey - ny * hl * 0.8)], fill=col)


def pencil(draw, x0, y0, x1, y1, s=1.0):
    ang = math.atan2(y1 - y0, x1 - x0)
    nx, ny = -math.sin(ang) * 14 * s, math.cos(ang) * 14 * s
    tip = 40 * s
    bx, by = x1 - math.cos(ang) * tip, y1 - math.sin(ang) * tip
    draw.polygon([(x0 + nx, y0 + ny), (bx + nx, by + ny), (bx - nx, by - ny), (x0 - nx, y0 - ny)], fill=K.GOLD)
    draw.polygon([(bx + nx, by + ny), (x1, y1), (bx - nx, by - ny)], fill=(240, 210, 170))
    draw.polygon([(x1 - math.cos(ang) * tip * 0.35 + nx * 0.35, y1 - math.sin(ang) * tip * 0.35 + ny * 0.35), (x1, y1),
                  (x1 - math.cos(ang) * tip * 0.35 - nx * 0.35, y1 - math.sin(ang) * tip * 0.35 - ny * 0.35)],
                 fill=K.DEV_DARK)
    draw.polygon([(x0 + nx, y0 + ny), (x0 - nx, y0 - ny), (x0 - nx - math.cos(ang) * 22 * s, y0 - ny - math.sin(ang) * 22 * s),
                  (x0 + nx - math.cos(ang) * 22 * s, y0 + ny - math.sin(ang) * 22 * s)], fill=(240, 130, 150))


def trash(draw, cx, by, s):
    S = S_(s)
    draw.polygon([(cx - S(80), by - S(170)), (cx + S(80), by - S(170)), (cx + S(64), by), (cx - S(64), by)],
                 fill=K.STEEL_DARK)
    for k in (-1, 0, 1):
        draw.line((cx + k * S(34), by - S(150), cx + k * S(28), by - S(20)), fill=K.STEEL, width=max(2, int(S(8))))
    draw.rounded_rectangle((cx - S(96), by - S(196), cx + S(96), by - S(168)), radius=S(10), fill=K.DEV_MID)
    draw.rounded_rectangle((cx - S(26), by - S(214), cx + S(26), by - S(194)), radius=S(8), fill=K.DEV_MID)


def stack(draw, cx, cy, s, cols=(CAT_ORANGE, CAT_GREY, CAT_BLACK)):
    for k, col in enumerate(cols):
        cat_photo(draw, cx + (k - 1) * 18 * s, cy - (k - 1) * 18 * s, s, col)


def house(draw, cx, by, s, col):
    S = S_(s)
    draw.rectangle((cx - S(80), by - S(120), cx + S(80), by), fill=col)
    draw.polygon([(cx - S(100), by - S(116)), (cx, by - S(196)), (cx + S(100), by - S(116))], fill=shade(col, 0.8))
    draw.rectangle((cx - S(20), by - S(60), cx + S(20), by), fill=(150, 104, 70))
    for wx in (cx - S(60), cx + S(32)):
        draw.rectangle((wx, by - S(100), wx + S(28), by - S(72)), fill=(214, 236, 250))


STEPS = [("train", "Train"), ("try", "Try a guess"), ("fix", "Fix labels"), ("again", "Try again")]


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
    gold_soft = K.hex_rgb("#FFF4DA")
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

    def notepad(box):
        x0, y0, x1, y1 = box
        draw.rounded_rectangle((x0 + 10, y0 + 12, x1 + 10, y1 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle(box, radius=24, fill=PAPER)

    def wavy(x0, x1, y, amp, col, width=8, phase=0.0):
        pts = [(x0 + (x1 - x0) * k / 40, y + amp * math.sin(k / 40 * math.pi * 4 + phase)) for k in range(41)]
        draw.line(pts, fill=col, width=width, joint="curve")

    def step_icon(kind, x, y, s=1.0):
        if kind == "train":
            stack(draw, x, y, 0.42 * s)
        elif kind == "try":
            sb = tablet(draw, x, y, 0.3 * s)
            K.text_at(draw, "?", (sb[0] + sb[2]) / 2, (sb[1] + sb[3]) / 2 - 44 * s, font(max(26, int(70 * s)), bold=True),
                      coral)
        elif kind == "fix":
            draw.rounded_rectangle((x - 70 * s, y - 34 * s, x + 50 * s, y + 30 * s), radius=14 * s, fill=sage_soft,
                                   outline=sage, width=4)
            K.text_at(draw, "cat", x - 10 * s, y - 22 * s, font(max(26, int(36 * s)), bold=True), sage)
            pencil(draw, x + 70 * s, y - 70 * s, x + 30 * s, y + 10 * s, 0.8 * s)
        else:
            loop_ring(draw, x, y, 52 * s, K.BOTH_COLOR, t, width=max(6, int(14 * s)))
            K.draw_check(draw, x, y, 22 * s, sage)

    # ---- opening -----------------------------------------------------------
    if visual == "b10-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 300), 450, 110, sage, panel, bounce)
            draw.ellipse((cx + 300 - 150, 440 - 150, cx + 300 + 150, 440 + 150), fill=gold_soft)
            trophy(draw, cx + 300, 450, 0.7, col=(214, 208, 198), mark="?")
            K.text_at(draw, "Welcome back, champ!", cx, 730, font(60, bold=True), ink)
            stars_around(330, 560)
            return True
        if focus == "bridge":
            K.shadow_card(draw, (300, 250 + lift, w - 300, 840 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · DATA, THE FOOD AI EATS", cx, 326 + lift, font(34, bold=True), sage)
            kinds = [("pic", "Pictures", coral_soft), ("word", "Words", lav_soft), ("sound", "Sounds", sage_soft)]
            for i, (kind, lab, soft) in enumerate(kinds):
                a = K.stagger(progress, i, step=0.12, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 330
                y = 500 + int((1 - a) * 40) + lift
                draw.ellipse((x - 95, y - 95, x + 95, y + 95), fill=soft)
                data_tile(draw, kind, x, y, 1.3, brand)
                K.text_at(draw, lab, x, y + 108, font(34, bold=True), ink)
            a = K.stagger(progress, 4, step=0.12, speed=4)
            if a > 0:
                K.pill(draw, cx, 740 + int((1 - a) * 20) + lift, "Variety helps AI learn!", coral, size=36)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (260, 240 + lift, w - 260, 500 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 5 OF 5", cx, 300 + lift, font(32, bold=True), coral)
            K.text_at(draw, "Practice Makes Perfect", cx, 360 + lift, font(86, bold=True), ink)
            hits = [(-0.75, -0.55), (0.32, 0.36), (0.0, 0.0)]
            for i, hit in enumerate(hits):
                a = K.stagger(progress, i + 2, step=0.12, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 360
                y = 690 + int((1 - a) * 30)
                target(draw, x, y, 90, hit)
                K.text_at(draw, f"Try {i + 1}", x - 10, y + 106, font(32, bold=True), sage if i == 2 else muted)
            if progress > 0.7:
                star_spots([(cx + 500, 640)])
            return True
        # question
        K.text_at(draw, "Is AI born smart?", cx, 226 + lift, font(66, bold=True), ink)
        draw.ellipse((cx - 230, 560 - 230, cx + 230, 560 + 230), fill=lav_soft)
        ai_chip(draw, cx, 560, 1.1, t)
        draw.rounded_rectangle((cx - 640, 420, cx - 380, 700), radius=24, fill=panel, outline=line, width=4)
        draw.rounded_rectangle((cx - 640, 420, cx - 380, 500), radius=24, fill=coral)
        draw.rectangle((cx - 640, 470, cx - 380, 500), fill=coral)
        K.text_at(draw, "DAY", cx - 510, 438, font(36, bold=True), panel)
        K.text_at(draw, "1", cx - 510, 520, font(130, bold=True), ink)
        question_marks([(cx + 420, 380), (cx + 600, 520), (cx + 440, 660)])
        K.draw_stopwatch(draw, cx + 640, 800, 44, progress, brand)
        return True

    # ---- Meera's new cycle ------------------------------------------------------
    if visual == "b10-cycle":
        if focus == "gift":
            draw.ellipse((470 - 270, 540 - 270, 470 + 270, 540 + 270), fill=blue_soft)
            meera(draw, 470, 470, 1.25, t)
            K.draw_heart(draw, 630, 330 + bounce, 30, coral)
            cycle(draw, 1250, 800, 1.35, 0.0, bow=True)
            K.text_at(draw, "A shiny new cycle!", 1250, 260 + lift, font(60, bold=True), coral)
            star_spots([(920, 380), (1660, 380)])
            return True
        if focus == "wobble":
            draw.rectangle((0, 800, w, 812), fill=ROAD_GREY)
            fall = K.clamp01((progress - 0.7) / 0.3)
            wob = math.sin(progress * math.pi * 10) * (1 - fall)
            rx = K.lerp(620, 1100, K.clamp01(progress / 0.7))
            wavy(260, rx - 150, 806, 26, K.STEEL_DARK, width=6, phase=0)
            rider(draw, rx + wob * 30, 800, 1.1, t * (1 - fall))
            for k in range(3):
                side = -1 if wob < 0 else 1
                x = rx + side * (260 + k * 26)
                draw.arc((x - 30, 440 + k * 60, x + 30, 500 + k * 60), 300 if side > 0 else 120,
                         60 if side > 0 else 240, fill=muted, width=6)
            lab = "Wobble!" if fall <= 0 else "Oops!"
            K.pill(draw, rx - 80 + 60 * (1 if wob > 0 else -1) * (1 - fall), 250, lab, K.DANGER if fall > 0 else K.BOTH_COLOR,
                   size=40)
            if fall > 0:
                for k in range(3):
                    a = t * 8 + k * 2.1
                    K.draw_star(draw, rx + math.cos(a) * 90, 330 + math.sin(a) * 26, 20, K.GOLD, rot=a)
                K.pill(draw, 1560, 700, "She's okay!", sage, size=34)
            return True
        if focus == "practice":
            days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
            for i, d in enumerate(days):
                a = K.stagger(progress, i, step=0.1, speed=5)
                if a <= 0:
                    continue
                x0 = 150 + i * 275
                y0 = 300 + int((1 - a) * 30)
                draw.rounded_rectangle((x0 + 8, y0 + 10, x0 + 245 + 8, y0 + 380 + 10), radius=26, fill=K.SHADOW)
                draw.rounded_rectangle((x0, y0, x0 + 245, y0 + 380), radius=26, fill=panel, outline=line, width=3)
                draw.rounded_rectangle((x0, y0, x0 + 245, y0 + 70), radius=26, fill=coral)
                draw.rectangle((x0, y0 + 40, x0 + 245, y0 + 70), fill=coral)
                K.text_at(draw, d, x0 + 122, y0 + 14, font(36, bold=True), panel)
                amp = 46 * (1 - i / 5)
                wavy(x0 + 24, x0 + 221, y0 + 190, amp, BIKE, width=8, phase=i)
                draw.ellipse((x0 + 210, y0 + 180, x0 + 232, y0 + 202), fill=BIKE)
                K.draw_check(draw, x0 + 122, y0 + 310, 28, sage)
            K.text_at(draw, "wobbly", 272, 730, font(34, bold=True), K.DANGER)
            K.text_at(draw, "steady!", 1647, 730, font(34, bold=True), sage)
            K.draw_arrow(draw, 400, 750, 1500, 750, line, width=10, head=28)
            return True
        # ride
        for k, col in enumerate(((236, 200, 170), (200, 220, 240), (240, 210, 210), (210, 230, 200))):
            house(draw, 260 + k * 470, 700, 1.1, col)
        draw.rectangle((0, 700, w, 860), fill=ROAD_GREY)
        K.draw_dashed(draw, 0, 790, w, 790, panel, width=8, dash=50, gap=40, phase=t * 600)
        rx = K.lerp(500, 1300, progress)
        for k in range(4):
            yy = 560 + k * 50
            draw.line((rx - 380 - k * 40, yy, rx - 240 - k * 20, yy), fill=muted, width=6)
        hx, hy = rider(draw, rx, 840, 1.0, t * 3)
        K.draw_bubble(draw, (rx + 120, 250, rx + 470, 370), brand, "Tring, tring!", tail="left", size=40)
        star_spots([(rx - 320, 300), (rx + 560, 460)])
        return True

    # ---- AI's wobbly first tries ---------------------------------------------------
    if visual == "b10-wobbly":
        if focus == "intro":
            draw.ellipse((520 - 250, 560 - 250, 520 + 250, 560 + 250), fill=blue_soft)
            rider(draw, 520 + 20 * math.sin(t * 20), 760, 0.9, t)
            draw.ellipse((1400 - 250, 560 - 250, 1400 + 250, 560 + 250), fill=lav_soft)
            wob = 14 * math.sin(t * 24)
            ai_chip(draw, 1400 + wob, 560, 1.0, t)
            for sx in (-1, 1):
                for k in range(2):
                    x = 1400 + sx * (190 + k * 30)
                    draw.arc((x - 26, 520 + k * 30, x + 26, 576 + k * 30), 300 if sx > 0 else 120,
                             60 if sx > 0 else 240, fill=muted, width=6)
            draw.ellipse((cx - 60, 500, cx + 60, 620), fill=panel, outline=line, width=4)
            K.text_at(draw, "=", cx, 516, font(80, bold=True), K.BOTH_COLOR)
            K.pill(draw, cx, 790, "Wobbly first tries!", coral, size=40)
            return True
        if focus == "guesses":
            for k, (kind, verdict) in enumerate((("cat", "Dog?"), ("cushion", "Cat?"))):
                a = K.stagger(progress, k, step=0.4, speed=3)
                if a <= 0:
                    continue
                x = cx + (k * 2 - 1) * 380
                y = 560 + int((1 - a) * 40)
                sb = tablet(draw, x, y, 1.0)
                vb = finder(draw, sb, 1.0, coral, verdict=(verdict, K.DANGER), ground=kind == "cat")
                mx, my = (vb[0] + vb[2]) / 2, (vb[1] + vb[3]) / 2
                if kind == "cat":
                    cat(draw, mx - 14, my, 1.0, CAT_ORANGE)
                else:
                    cushion(draw, mx, my + 10, 1.1)
                K.draw_cross(draw, x + 170, y - 230, 36, K.DANGER)
                K.text_at(draw, "a cat" if kind == "cat" else "a cushion", x, y + 248, font(36, bold=True), muted)
            return True
        if focus == "practice":
            K.text_at(draw, "PRACTICE", 560, 270 + lift, font(96, bold=True), coral)
            label_lines(("= trying again", "and again"), 560, 400 + lift, size=50)
            a = K.stagger(progress, 2, step=0.2, speed=3)
            if a > 0:
                K.pill(draw, 560, 600, "more examples", sage, size=36)
                K.pill(draw, 560, 690, "more tries", K.BOTH_COLOR, size=36)
            cols = [CAT_ORANGE, CAT_GREY, CAT_BLACK, CAT_WHITE, CAT_CREAM]
            for k in range(5):
                c = (t * 1.5 + k / 5) % 1
                x = K.lerp(1060, 1380, K.ease_in_out(c))
                y = K.lerp(300 + k * 30, 540, K.ease_in_out(c))
                if c < 0.88:
                    cat_photo(draw, x, y, 0.5 * (1 - 0.4 * c), cols[k])
            loop_ring(draw, 1480, 560, 200, K.BOTH_COLOR, t, width=18)
            ai_chip(draw, 1480, 560, 0.75, t)
            return True
        # better
        res = [False, False, True, True, True]
        for i, ok in enumerate(res):
            a = K.stagger(progress, i, step=0.12, speed=5)
            if a <= 0:
                continue
            x = cx + (i - 2) * 320
            y = 320 + int((1 - a) * 30)
            col = sage if ok else K.DANGER
            draw.rounded_rectangle((x - 140, y, x + 140, y + 300), radius=30, fill=sage_soft if ok else K.DANGER_SOFT,
                                   outline=col, width=5)
            K.text_at(draw, f"Round {i + 1}", x, y + 24, font(34, bold=True), ink)
            cat_photo(draw, x, y + 160, 0.5, [CAT_ORANGE, CAT_GREY, CAT_BLACK, CAT_CREAM, CAT_WHITE][i])
            (K.draw_check if ok else K.draw_cross)(draw, x + 110, y + 260, 28, col)
        a = K.stagger(progress, 5, step=0.1, speed=4)
        if a > 0:
            K.draw_meter(draw, cx - 300, 690, 600, 0.3 + 0.7 * K.clamp01((progress - 0.5) * 2))
            K.pill(draw, cx, 760, "Nobody is born perfect!", coral, size=36)
        return True

    # ---- maths sums -------------------------------------------------------------------
    if visual == "b10-sums":
        if focus in ("first", "fix"):
            fixed = focus == "fix"
            notebook(draw, (200, 250, 1050, 860))
            sums = [("2 + 2 =", "4", True), ("3 + 4 =", "6", False), ("5 + 3 =", "9", False)]
            for i, (q, a_, ok) in enumerate(sums):
                y = 300 + i * 160
                draw.text((330, y + 20), q, fill=ink, font=font(80, bold=True))
                show_fix = fixed and not ok and progress > 0.2 + i * 0.15
                ans = a_ if not show_fix else ("7" if i == 1 else "8")
                draw.text((690, y + 20), ans, fill=ink if not show_fix else sage, font=font(80, bold=True))
                if show_fix:
                    draw.line((780, y + 40, 830, y + 100), fill=K.DANGER, width=5)
                    draw.text((790, y + 20), a_, fill=(220, 160, 160), font=font(48, bold=True))
                    K.draw_check(draw, 960, y + 70, 30, sage)
                elif ok:
                    K.draw_check(draw, 960, y + 70, 30, sage)
                else:
                    draw.ellipse((660, y + 10, 790, y + 130), outline=K.DANGER, width=6)
                    K.draw_cross(draw, 960, y + 70, 30, K.DANGER)
            if fixed:
                pencil(draw, 1170, 300, 1085, 470, 1.4)
                for k, (lab, col) in enumerate((("Practise", coral), ("Fix mistakes", K.BOTH_COLOR), ("Get better", sage))):
                    a = K.stagger(progress, k + 1, step=0.18, speed=4)
                    if a <= 0:
                        continue
                    y = 330 + k * 160 + int((1 - a) * 20)
                    draw.rounded_rectangle((1200, y, 1720, y + 120), radius=60, fill=panel, outline=col, width=5)
                    draw.ellipse((1224, y + 22, 1300, y + 98), fill=col)
                    K.text_at(draw, str(k + 1), 1262, y + 32, font(46, bold=True), panel)
                    draw.text((1330, y + 34), lab, fill=ink, font=font(46, bold=True))
                    if k < 2:
                        K.draw_arrow(draw, 1460, y + 124, 1460, y + 156, muted, width=6, head=16)
            else:
                meera(draw, 1450, 520, 1.25, t)
                K.draw_bubble(draw, (1120, 250, 1420, 370), brand, "Oops!", tail="right", size=48)
                K.text_at(draw, "My first sums", 1450, 760, font(40, bold=True), muted)
            return True
        # improve
        K.text_at(draw, "IMPROVE", cx, 222 + lift, font(90, bold=True), coral)
        K.text_at(draw, "= get better, step by step", cx, 340 + lift, font(44, bold=True), ink)
        for side, (x0, col, lab) in enumerate(((180, coral, "Kids"), (1060, K.BOTH_COLOR, "AI"))):
            for k in range(4):
                a = K.stagger(progress, k + 1, step=0.1, speed=5)
                if a <= 0:
                    continue
                sx = x0 + k * 160
                top = 840 - (k + 1) * 70
                draw.rectangle((sx, top + int((1 - a) * 20), sx + 160, 850), fill=shade(col, 1.0 - 0.06 * (3 - k)))
            K.text_at(draw, lab, x0 + 80, 784, font(36, bold=True), panel)
            p = K.clamp01(progress * 1.3)
            k = min(3, int(p * 4))
            px = x0 + k * 160 + 80
            py = 840 - (k + 1) * 70
            if side == 0:
                meera(draw, px, py - 84, 0.62, t)
            else:
                ai_chip(draw, px, py - 72, 0.5, t)
            K.draw_star(draw, x0 + 720, 500, 26 + 6 * pulse, K.GOLD, rot=t * 3)
        return True

    # ---- testing -----------------------------------------------------------------------
    if visual == "b10-test":
        if focus == "how":
            meera(draw, 360, 470, 1.15, t)
            sb = tablet(draw, 760, 560, 0.8)
            vb = finder(draw, sb, 0.8, coral)
            cat(draw, (vb[0] + vb[2]) / 2 - 10, (vb[1] + vb[3]) / 2, 0.8, CAT_GREY)
            K.text_at(draw, "Has it really learned?", 1420, 300 + lift, font(52, bold=True), ink)
            draw.rounded_rectangle((1220, 420, 1620, 820), radius=24, fill=K.hex_rgb("#C9925A"))
            draw.rounded_rectangle((1250, 460, 1590, 800), radius=12, fill=panel)
            draw.rounded_rectangle((1350, 400, 1490, 450), radius=14, fill=K.STEEL_DARK)
            K.text_at(draw, "TEST", 1420, 480, font(56, bold=True), coral)
            for k in range(3):
                y = 580 + k * 70
                draw.rounded_rectangle((1290, y, 1330, y + 40), radius=8, outline=muted, width=4)
                draw.rounded_rectangle((1350, y + 12, 1550, y + 28), radius=8, fill=line)
                if K.stagger(progress, k + 1, step=0.15, speed=5) > 0.5:
                    K.draw_check(draw, 1310, y + 20, 18, sage)
            return True
        if focus == "define":
            K.shadow_card(draw, (160, 260 + lift, 1100, 820 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "A TEST means…", 630, 330 + lift, font(46, bold=True), muted)
            parts = [("checking what", ink), ("the AI learned,", ink), ("with NEW examples", sage)]
            for i, (txt, col) in enumerate(parts):
                a = K.stagger(progress, i, step=0.16, speed=4)
                if a <= 0:
                    continue
                K.text_at(draw, txt, 630, 430 + i * 100 + lift + int((1 - a) * 30), font(62, bold=True), col)
            sb = tablet(draw, 1480, 560, 0.85)
            vb = finder(draw, sb, 0.85, coral, verdict=("Cat!", sage) if progress > 0.5 else None)
            c = K.clamp01(progress * 2)
            cat_photo(draw, K.lerp(1800, (vb[0] + vb[2]) / 2, K.ease_out_cubic(c)), (vb[1] + vb[3]) / 2, 0.68, CAT_GREY)
            return True
        # new
        draw.rounded_rectangle((120, 250, 980, 860), radius=40, fill=blue_soft, outline=K.ROAD, width=4)
        K.text_at(draw, "Training photos", 550, 280, font(48, bold=True), K.ROAD)
        cols = [CAT_ORANGE, CAT_BLACK, CAT_WHITE, CAT_CREAM, CAT_ORANGE, CAT_BLACK]
        for k in range(6):
            r, c = divmod(k, 3)
            cat_photo(draw, 300 + c * 250, 470 + r * 230, 0.72, cols[k])
        K.pill(draw, 550, 790, "seen many times", K.ROAD, size=30)
        a = K.stagger(progress, 1, step=0.25, speed=3)
        if a > 0:
            yy = int((1 - a) * 40)
            draw.rounded_rectangle((1060, 250 + yy, 1800, 860 + yy), radius=40, fill=sage_soft, outline=sage, width=5)
            K.text_at(draw, "A NEW example", 1430, 280 + yy, font(48, bold=True), sage)
            cat_photo(draw, 1330, 540 + yy, 1.2, CAT_GREY)
            K.draw_star(draw, 1460, 390 + yy, 50, K.GOLD, rot=0.2)
            K.text_at(draw, "NEW", 1460, 376 + yy, font(26, bold=True), ink)
            K.draw_person(draw, 1640, 560 + yy, 0.75, "nani", t)
            K.text_at(draw, "Billu", 1330, 720 + yy, font(40, bold=True), ink)
            K.pill(draw, 1430, 780 + yy, "never seen before", sage, size=30)
        return True

    # ---- why new examples -------------------------------------------------------------
    if visual == "b10-trick":
        if focus == "same":
            draw.rounded_rectangle((120, 270, 760, 830), radius=36, fill=blue_soft, outline=K.ROAD, width=4)
            K.text_at(draw, "Practice photos", 440, 296, font(42, bold=True), K.ROAD)
            for k in range(4):
                r, c = divmod(k, 2)
                cat_photo(draw, 320 + c * 240, 480 + r * 210, 0.66, [CAT_ORANGE, CAT_BLACK, CAT_WHITE, CAT_CREAM][k])
            K.draw_arrow(draw, 790, 550, 930, 550, muted, width=12, head=34)
            draw.rounded_rectangle((960, 270, 1600, 830), radius=36, fill=K.DANGER_SOFT, outline=K.DANGER, width=4)
            K.text_at(draw, "Test photos", 1280, 296, font(42, bold=True), K.DANGER)
            for k in range(4):
                r, c = divmod(k, 2)
                x, y = 1160 + c * 240, 480 + r * 210
                cat_photo(draw, x, y, 0.66, [CAT_ORANGE, CAT_BLACK, CAT_WHITE, CAT_CREAM][k])
                if K.stagger(progress, k + 1, step=0.12, speed=5) > 0.5:
                    K.pill(draw, x, y - 104, "same!", K.DANGER, size=26)
            ai_chip(draw, 1730, 400, 0.5, t)
            K.text_at(draw, "Just", 1730, 520, font(32, bold=True), muted)
            K.text_at(draw, "remembers?", 1730, 560, font(32, bold=True), muted)
            return True
        if focus == "school":
            blackboard(draw, (620, 250, 1460, 640))
            K.text_at(draw, "TEST", 1040, 280, font(46, bold=True), K.GOLD)
            for k, s_ in enumerate(("6 + 7 = ?", "9 + 5 = ?")):
                a = K.stagger(progress, k + 1, step=0.15, speed=4)
                if a > 0:
                    K.text_at(draw, s_, 1040, 370 + k * 110, font(70, bold=True), (240, 244, 236))
            K.draw_person(draw, 1660, 470, 1.15, "teacher", t)
            notebook(draw, (140, 320, 540, 800))
            K.text_at(draw, "Practice", 360, 340, font(40, bold=True), coral)
            for k, s_ in enumerate(("3 + 4 = 7", "2 + 5 = 7", "4 + 4 = 8")):
                draw.text((210, 430 + k * 110), s_, fill=ink, font=font(48, bold=True))
            a = K.stagger(progress, 3, step=0.15, speed=4)
            if a > 0:
                K.pill(draw, 1040, 700 + int((1 - a) * 20), "New sums, not the practice ones!", sage, size=36)
            return True
        # check
        for k, (title, col, soft) in enumerate((("New sums for you", coral, coral_soft),
                                                ("New photos for AI", K.BOTH_COLOR, lav_soft))):
            a = K.stagger(progress, k, step=0.2, speed=4)
            if a <= 0:
                continue
            x0 = 160 if k == 0 else 1000
            yy = int((1 - a) * 30)
            draw.rounded_rectangle((x0, 260 + yy, x0 + 760, 820 + yy), radius=40, fill=soft, outline=col, width=5)
            K.text_at(draw, title, x0 + 380, 290 + yy, font(48, bold=True), col)
            if k == 0:
                blackboard(draw, (x0 + 60, 390 + yy, x0 + 460, 640 + yy))
                K.text_at(draw, "8 + 6 = ?", x0 + 260, 480 + yy, font(56, bold=True), (240, 244, 236))
                meera(draw, x0 + 600, 500 + yy, 0.9, t)
            else:
                cat_photo(draw, x0 + 240, 520 + yy, 0.95, CAT_GREY)
                ai_chip(draw, x0 + 560, 520 + yy, 0.7, t)
            K.draw_check(draw, x0 + 380, 740 + yy, 40, sage)
        return True

    # ---- detective puzzle -----------------------------------------------------------
    if visual == "b10-puzzle":
        if focus == "ask":
            draw.rounded_rectangle((140, 270, 760, 830), radius=40, fill=sage_soft, outline=sage, width=5)
            K.text_at(draw, "Training photos", 450, 300, font(44, bold=True), sage)
            K.text_at(draw, "100", 450, 380, font(120, bold=True), sage)
            K.text_at(draw, "right!", 450, 520, font(48, bold=True), ink)
            for k in range(5):
                K.draw_check(draw, 250 + k * 100, 680, 30, sage)
            draw.rounded_rectangle((1160, 270, 1780, 830), radius=40, fill=K.DANGER_SOFT, outline=K.DANGER, width=5)
            K.text_at(draw, "New photos", 1470, 300, font(44, bold=True), K.DANGER)
            for k in range(3):
                x = 1270 + k * 200
                cat_photo(draw, x, 520, 0.7, [CAT_GREY, CAT_CREAM, CAT_WHITE][k])
                K.draw_cross(draw, x, 700, 32, K.DANGER)
            ai_chip(draw, cx, 520, 0.7, t)
            question_marks([(cx - 30, 260), (cx + 120, 680)])
            K.draw_stopwatch(draw, cx - 80, 760, 40, progress, brand)
            return True
        # answer
        K.text_at(draw, "It only remembered!", 520, 250 + lift, font(56, bold=True), K.DANGER)
        draw.rounded_rectangle((140, 360, 900, 840), radius=36, fill=blue_soft, outline=K.ROAD, width=4)
        for k in range(3):
            x = 270 + k * 250
            cat_photo(draw, x, 540, 0.7, [CAT_ORANGE, CAT_BLACK, CAT_WHITE][k])
        K.text_at(draw, "Same old photos", 520, 740, font(38, bold=True), K.ROAD)
        draw.rounded_rectangle((1000, 250, 1790, 840), radius=36, fill=panel, outline=sage, width=5)
        K.text_at(draw, "What a cat looks like", 1395, 280, font(44, bold=True), sage)
        ccx, ccy = 1250, 600
        cat(draw, ccx, ccy, 1.8, CAT_GREY)
        feats = [("pointy ears", (ccx - 72, ccy - 120), (1440, 380)), ("whiskers", (ccx + 100, ccy + 6), (1480, 540)),
                 ("long tail", (ccx + 168, ccy + 120), (1480, 700))]
        for i, (lab, (px, py), (lx, ly)) in enumerate(feats):
            a = K.stagger(progress, i + 1, step=0.15, speed=5)
            if a <= 0:
                continue
            K.draw_dashed(draw, px, py, lx, ly + 34, muted, width=4, dash=14, gap=10)
            draw.ellipse((px - 9, py - 9, px + 9, py + 9), fill=ink)
            K.pill(draw, 0, ly, lab, sage, size=34, left=lx)
        return True

    # ---- the improve loop ----------------------------------------------------------
    def loop_diagram(n_shown, active=None, dot=None):
        lcx, lcy, rx, ry = cx, 560, 470, 240
        draw.ellipse((lcx - rx, lcy - ry, lcx + rx, lcy + ry), outline=K.BOTH_COLOR, width=12)
        for k in range(4):
            th = math.radians(45 + k * 90)
            px, py = lcx + rx * math.cos(th), lcy + ry * math.sin(th)
            tx, ty = -rx * math.sin(th), ry * math.cos(th)
            ln = math.hypot(tx, ty)
            tx, ty = tx / ln, ty / ln
            nx, ny = -ty, tx
            draw.polygon([(px + tx * 30, py + ty * 30), (px - tx * 10 + nx * 22, py - ty * 10 + ny * 22),
                          (px - tx * 10 - nx * 22, py - ty * 10 - ny * 22)], fill=K.BOTH_COLOR)
        if dot is not None:
            th = dot * 2 * math.pi - math.pi / 2
            draw.ellipse((lcx + rx * math.cos(th) - 18, lcy + ry * math.sin(th) - 18,
                          lcx + rx * math.cos(th) + 18, lcy + ry * math.sin(th) + 18), fill=K.GOLD)
        pos = [(lcx, lcy - ry), (lcx + rx, lcy), (lcx, lcy + ry), (lcx - rx, lcy)]
        cols = [coral, K.ROAD, sage, K.BOTH_COLOR]
        for i, ((kind, lab), (px, py)) in enumerate(zip(STEPS, pos)):
            a = K.ease_out_cubic(K.clamp01((n_shown - i) * 2.5))
            if a <= 0:
                continue
            on = active == i
            yy = int((1 - a) * 20)
            bw = 330
            box = (px - bw / 2, py - 56 + yy, px + bw / 2, py + 56 + yy)
            draw.rounded_rectangle((box[0] + 8, box[1] + 10, box[2] + 8, box[3] + 10), radius=56, fill=K.SHADOW)
            draw.rounded_rectangle(box, radius=56, fill=coral_soft if on else panel, outline=cols[i], width=6 if on else 4)
            draw.ellipse((box[0] + 16, py - 38 + yy, box[0] + 92, py + 38 + yy), fill=cols[i])
            K.text_at(draw, str(i + 1), box[0] + 54, py - 28 + yy, font(44, bold=True), panel)
            draw.text((box[0] + 108, py - 24 + yy), lab, fill=ink, font=font(40, bold=True))

    if visual == "b10-loop":
        if focus == "intro":
            trash(draw, 520, 840, 1.3)
            sb = tablet(draw, 520, 470, 0.66)
            vb = finder(draw, sb, 0.66, coral, verdict=None)
            cat(draw, (vb[0] + vb[2]) / 2 - 8, (vb[1] + vb[3]) / 2 + 4, 0.6, CAT_ORANGE)
            K.draw_cross(draw, 720, 380, 46, K.DANGER)
            K.text_at(draw, "Throw it away?", 520, 222, font(48, bold=True), muted)
            a = K.stagger(progress, 2, step=0.2, speed=3)
            if a > 0:
                K.text_at(draw, "No!", 520 + 260, 520, font(int(80 * a), bold=True), K.DANGER)
                draw.ellipse((1380 - 260, 540 - 260, 1380 + 260, 540 + 260), fill=lav_soft)
                loop_ring(draw, 1380, 540, 190, K.BOTH_COLOR, t, width=26)
                ai_chip(draw, 1380, 540, 0.7, t)
                K.pill(draw, 1380, 800, "The improve loop!", K.BOTH_COLOR, size=38)
            return True
        if focus == "steps":
            n = progress * 5.0 - 0.2
            loop_diagram(n, active=max(0, min(3, int(n))))
            ai_chip(draw, cx, 560, 0.75, t)
            return True
        # round
        loop_diagram(4, dot=(t * 3) % 1)
        ai_chip(draw, cx, 500, 0.6, t)
        lvl = 0.25 + 0.75 * K.clamp01(progress * 1.2)
        K.draw_meter(draw, cx - 170, 620, 340, lvl)
        K.text_at(draw, "better and better!", cx, 660, font(32, bold=True), sage)
        return True

    # ---- put the loop in order ---------------------------------------------------------
    if visual == "b10-order":
        ans = focus == "answer"
        mixed = [3, 2, 0, 1]
        order = [0, 1, 2, 3] if ans else mixed
        cw, gap = 390, 30
        x_start = cx - (4 * cw + 3 * gap) / 2
        for slot, si in enumerate(order):
            kind, lab = STEPS[si]
            a = 1.0 if not ans else K.ease_out_cubic(K.clamp01((progress * 5.0 - slot) * 2.5))
            x0 = x_start + slot * (cw + gap)
            yy = int((1 - a) * 40)
            bx = (x0, 300 + yy, x0 + cw, 820 + yy)
            K.shadow_card(draw, bx, brand, radius=28, outline=sage if ans and a > 0.9 else None, outline_w=5)
            mx = x0 + cw / 2
            step_icon(kind, mx, 500 + yy, 1.3)
            label_lines((lab,), mx, 700 + yy, size=40)
            if ans:
                K.pill(draw, 0, 320 + yy, str(slot + 1), sage, size=30, left=x0 + 20)
                if slot < 3:
                    K.draw_arrow(draw, x0 + cw + 2, 560, x0 + cw + gap - 2, 560, muted, width=6, head=14)
            else:
                K.pill(draw, 0, 320, "?", K.BOTH_COLOR, size=30, left=x0 + 20)
        if ans:
            K.pill(draw, cx, 214, "Train → Try → Fix → Try again", sage, size=32)
        else:
            K.pill(draw, cx - 40, 214, "Which comes first?", K.BOTH_COLOR, size=32)
            K.draw_stopwatch(draw, cx + 230, 244, 30, progress, brand)
        return True

    # ---- checkpoint -------------------------------------------------------------------
    if visual == "b10-check":
        if focus == "intro":
            K.shadow_card(draw, (440, 290 + lift, w - 440, 760 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 370 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Think like an AI tester!", cx, 450 + lift, font(60, bold=True), ink)
            cat(draw, cx - 20, 640 + lift, 0.8, CAT_GREY)
            return True
        ans = focus == "answer"
        notepad((120, 230, 1060, 870))
        label_lines(("Why test a cat finder on a", "NEW cat photo, not only", "the training photos?"), 590, 262, size=44,
                    col=coral)
        rows = ["It may just remember old photos", "A new photo is a fair test", "It shows if it really learned"]
        for i, lab in enumerate(rows):
            y = 470 + i * 120
            draw.line((170, y + 90, 1010, y + 90), fill=(220, 210, 232), width=3)
            shown = ans and progress * 3.2 - 0.3 > i
            if shown:
                K.draw_check(draw, 196, y + 42, 22, sage)
                draw.text((236, y + 20), lab, fill=ink, font=font(40, bold=True))
            elif not ans and i == 1:
                K.text_at(draw, "?", 590, y - 30, font(110, bold=True), line)
        draw.rounded_rectangle((1140, 250, 1790, 520), radius=30, fill=blue_soft, outline=K.ROAD, width=4)
        K.text_at(draw, "Training photos", 1465, 266, font(32, bold=True), K.ROAD)
        for k in range(3):
            cat_photo(draw, 1290 + k * 175, 410, 0.58, [CAT_ORANGE, CAT_BLACK, CAT_WHITE][k])
        draw.rounded_rectangle((1140, 560, 1790, 860), radius=30, fill=sage_soft, outline=sage, width=4)
        K.text_at(draw, "New photo", 1360, 576, font(32, bold=True), sage)
        cat_photo(draw, 1360, 730, 0.62, CAT_GREY)
        if ans:
            K.pill(draw, 0, 680, "Cat!", sage, size=34, left=1520)
            K.draw_check(draw, 1720, 712, 26, sage)
        else:
            K.draw_stopwatch(draw, 1640, 720, 44, progress, brand)
        return True

    # ---- recap ----------------------------------------------------------------------
    if visual == "b10-recap":
        recap = [(("Practice makes", "AI better"), coral, "better"), (("First tries are", "wobbly. Okay!"), K.BOTH_COLOR, "wobbly"),
                 (("Test with NEW", "examples"), sage, "new"), (("Train · Try ·", "Fix · Try again"), K.ROAD, "loop")]
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
                if kind == "better":
                    for k in range(4):
                        bh = 50 + k * 45
                        draw.rounded_rectangle((ix - 150 + k * 78, iy + 110 - bh, ix - 90 + k * 78, iy + 110), radius=10,
                                               fill=shade(col, 0.8 + 0.07 * k))
                    K.draw_star(draw, ix + 120, iy - 120, 26, K.GOLD, rot=t * 3)
                elif kind == "wobbly":
                    wavy(ix - 150, ix + 150, iy + 100, 30, col, width=8)
                    rider(draw, ix, iy + 90, 0.6, t)
                elif kind == "new":
                    cat_photo(draw, ix - 10, iy + 10, 0.85, CAT_GREY)
                    K.draw_star(draw, ix + 100, iy - 90, 44, K.GOLD, rot=0.2)
                    K.text_at(draw, "NEW", ix + 100, iy - 104, font(26, bold=True), ink)
                else:
                    loop_ring(draw, ix, iy, 120, col, t, width=18)
                    ai_chip(draw, ix, iy, 0.45, t)
                label_lines(lab, x0 + 200, y0 + 390, size=36)
            return True
        if focus == "done":
            draw.ellipse((cx - 210, 470 - 210, cx + 210, 470 + 210), fill=gold_soft)
            trophy(draw, cx, 440, 0.95, label="UNIT 2", mark="2")
            K.draw_mascot(draw, int(cx - 470), 470, 100, sage, panel, bounce)
            meera(draw, cx + 470, 440, 0.95, t)
            K.text_at(draw, "Chapter 5 done!", cx, 690, font(64, bold=True), ink)
            K.pill(draw, cx, 780, "Unit 2 · How Machines Learn · complete!", coral, size=34)
            for k in range(18):
                fx = 160 + (k * 97) % 1600
                fy = 250 + ((k * 53 + t * 400) % 360)
                if abs(fx - cx) < 260 or abs(fx - (cx - 470)) < 140 or abs(fx - (cx + 470)) < 140:
                    continue
                col = [coral, sage, K.BOTH_COLOR, K.GOLD][k % 4]
                draw.rectangle((fx, fy, fx + 16, fy + 26), fill=col)
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False

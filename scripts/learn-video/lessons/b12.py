"""B12 · Can Computers Listen? — visuals."""
import math

import build as K

FABRIC = (92, 104, 128)
FABRIC_DOT = (112, 124, 148)
RING_LISTEN = (70, 200, 240)
GINGER = (238, 152, 70)
PINK = (244, 150, 170)
WOOD = (214, 170, 120)
WOOD_DARK = (176, 128, 84)
GRASS = (120, 190, 90)
TIGER = (246, 140, 40)
WHISPER = (176, 180, 192)


def S_(s):
    return lambda v: v * s


# ---------------------------------------------------------------------------
# Characters & things
# ---------------------------------------------------------------------------

def smart_speaker(draw, cx, cy, s, t=0.0, state="idle"):
    """Round smart speaker. cy = body centre; top ≈ cy-130s, base ≈ cy+140s."""
    S = S_(s)
    draw.ellipse((cx - S(112), cy + S(108), cx + S(124), cy + S(142)), fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(100), cy - S(100), cx + S(100), cy + S(122)), radius=S(56), fill=FABRIC)
    for r in range(5):
        for c in range(7):
            dx = (c - 3) * S(24) + (S(12) if r % 2 else 0)
            dy = S(48) + r * S(14)
            if abs(dx) < S(84):
                draw.ellipse((cx + dx - S(4), cy + dy - S(4), cx + dx + S(4), cy + dy + S(4)), fill=FABRIC_DOT)
    draw.ellipse((cx - S(100), cy - S(130), cx + S(100), cy - S(70)), fill=K.DEV_DARK)
    ring = {"idle": K.DEV_MID, "sleep": K.DEV_MID, "listen": RING_LISTEN, "play": (13, 148, 136),
            "confused": K.GOLD, "happy": (13, 148, 136)}[state]
    if state == "listen":
        g = 0.5 + 0.5 * math.sin(t * 30)
        ring = tuple(int(K.lerp(c, 255, 0.35 * g)) for c in ring)
        draw.ellipse((cx - S(108), cy - S(140), cx + S(108), cy - S(60)), outline=(200, 236, 250), width=max(2, int(S(6))))
    draw.ellipse((cx - S(84), cy - S(122), cx + S(84), cy - S(78)), outline=ring, width=max(3, int(S(12))))
    fx0, fy0, fx1, fy1 = cx - S(60), cy - S(46), cx + S(60), cy + S(26)
    draw.rounded_rectangle((fx0, fy0, fx1, fy1), radius=S(26), fill=K.DEV_DEEP)
    ey = cy - S(14)
    ew = max(2, int(S(6)))
    led = ring if state not in ("idle", "sleep") else K.LED_ON
    for i, sx in enumerate((-1, 1)):
        ex = cx + sx * S(26)
        if state in ("play", "happy"):
            draw.arc((ex - S(12), ey - S(6), ex + S(12), ey + S(16)), 200, 340, fill=led, width=ew)
        elif state == "sleep":
            draw.line((ex - S(10), ey + S(4), ex + S(10), ey + S(4)), fill=led, width=ew)
        elif state == "confused":
            r = S(11) if i == 0 else S(6)
            draw.ellipse((ex - r, ey - r, ex + r, ey + r), fill=led)
        elif state == "listen":
            draw.ellipse((ex - S(12), ey - S(12), ex + S(12), ey + S(12)), fill=led)
        else:
            draw.ellipse((ex - S(9), ey - S(9), ex + S(9), ey + S(9)), fill=led)
    if state in ("play", "happy"):
        draw.arc((cx - S(18), cy - S(4), cx + S(18), cy + S(16)), 20, 160, fill=led, width=ew)
    if state == "play":
        K.draw_notes(draw, cx - S(170), cy - S(150), s * 0.9, t, color=K.BOTH_COLOR)
        K.draw_notes(draw, cx + S(170), cy - S(120), s * 0.8, t + 0.3, color=K.CORAL)
        K.sound_waves(draw, cx + S(110), cy + S(30), s, (13, 148, 136), t, "right")
        K.sound_waves(draw, cx - S(110), cy + S(30), s, (13, 148, 136), t, "left")
    if state == "sleep":
        for k in range(3):
            zx, zy = cx + S(110) + k * S(34), cy - S(140) - k * S(40) + S(6) * math.sin(t * 8 + k)
            K.text_at(draw, "z", zx, zy, K.load_font(max(14, int(S(36 + k * 10))), bold=True), K.BOTH_COLOR)


def riya(draw, x, y, s, t):
    S = S_(s)
    yy = y + S(6) * math.sin(t * math.pi * 4)
    for sx in (-1, 1):
        draw.ellipse((x + sx * S(80) - S(28), yy - S(6), x + sx * S(80) + S(28), yy + S(64)), fill=K.HAIR)
        draw.ellipse((x + sx * S(70) - S(14), yy - S(18), x + sx * S(70) + S(14), yy + S(10)), fill=K.CORAL)
    K.draw_person(draw, x, y, s, "friend", t)


def aarav(draw, x, y, s, t):
    K.draw_person(draw, x, y, s, "kid", t)


def big_ear(draw, cx, cy, s):
    S = S_(s)
    draw.ellipse((cx - S(60) + S(6), cy - S(90) + S(8), cx + S(60) + S(6), cy + S(90) + S(8)), fill=K.SHADOW)
    draw.ellipse((cx - S(60), cy - S(90), cx + S(60), cy + S(90)), fill=K.SKIN)
    draw.arc((cx - S(36), cy - S(64), cx + S(40), cy + S(40)), 160, 420, fill=(214, 160, 126), width=max(3, int(S(14))))
    draw.ellipse((cx - S(14), cy - S(6), cx + S(14), cy + S(28)), fill=(214, 160, 126))


def phone(draw, cx, cy, s, screen=(255, 255, 255)):
    S = S_(s)
    hw, hh = S(190), S(300)
    draw.rounded_rectangle((cx - hw + S(10), cy - hh + S(12), cx + hw + S(10), cy + hh + S(12)), radius=S(44),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - hw, cy - hh, cx + hw, cy + hh), radius=S(44), fill=K.DEV_DARK)
    box = (cx - hw + S(16), cy - hh + S(44), cx + hw - S(16), cy + hh - S(44))
    draw.rounded_rectangle(box, radius=S(14), fill=screen)
    draw.rounded_rectangle((cx - S(40), cy - hh + S(18), cx + S(40), cy - hh + S(28)), radius=S(5), fill=K.DEV_MID)
    return box


def mixer(draw, cx, by, s, t, on=True):
    """Mixer-grinder. by = base bottom; jar top ≈ by-310s."""
    S = S_(s)
    sh = S(5) * math.sin(t * 90) if on else 0
    draw.rounded_rectangle((cx - S(96) + S(8), by - S(116) + S(10), cx + S(96) + S(8), by + S(10)), radius=S(22),
                           fill=K.SHADOW)
    draw.rounded_rectangle((cx - S(96), by - S(116), cx + S(96), by), radius=S(22), fill=(244, 244, 248),
                           outline=K.DEV_DARK, width=max(2, int(S(5))))
    draw.ellipse((cx - S(26), by - S(80), cx + S(26), by - S(28)), fill=K.DEV_DARK)
    draw.line((cx, by - S(54), cx + S(18) * math.cos(t * 40 if on else 0), by - S(54) + S(18) * math.sin(t * 40 if on else 0)),
              fill=(255, 255, 255), width=max(2, int(S(5))))
    draw.ellipse((cx + S(52), by - S(70), cx + S(72), by - S(50)), fill=K.DANGER if on else K.DEV_MID)
    jar = [(cx - S(56) + sh, by - S(116)), (cx + S(56) + sh, by - S(116)), (cx + S(78) + sh, by - S(290)),
           (cx - S(78) + sh, by - S(290))]
    draw.polygon(jar, fill=(222, 238, 248), outline=K.DEV_DARK)
    if on:
        for k in range(3):
            a = t * 60 + k * 2.1
            draw.arc((cx - S(50) + sh, by - S(250) + k * S(40), cx + S(50) + sh, by - S(200) + k * S(40)),
                     math.degrees(a), math.degrees(a) + 200, fill=(255, 200, 120), width=max(2, int(S(8))))
    else:
        draw.rectangle((cx - S(54), by - S(170), cx + S(54), by - S(120)), fill=(255, 210, 140))
    draw.rounded_rectangle((cx - S(84) + sh, by - S(316), cx + S(84) + sh, by - S(286)), radius=S(10), fill=K.DEV_DARK)
    draw.arc((cx + S(50) + sh, by - S(270), cx + S(130) + sh, by - S(150)), 270, 90, fill=K.DEV_DARK,
             width=max(3, int(S(14))))
    if on:
        for sx in (-1, 1):
            for k in range(3):
                x = cx + sx * (S(120) + k * S(22))
                y0 = by - S(260) + k * S(30)
                draw.line((x, y0, x + sx * S(10), y0 + S(50)), fill=K.DEV_MID, width=max(2, int(S(6))))


def tiger_face(draw, cx, cy, r):
    for sx in (-1, 1):
        draw.ellipse((cx + sx * r * 0.7 - r * 0.3, cy - r * 1.0, cx + sx * r * 0.7 + r * 0.3, cy - r * 0.4), fill=TIGER)
        draw.ellipse((cx + sx * r * 0.7 - r * 0.15, cy - r * 0.85, cx + sx * r * 0.7 + r * 0.15, cy - r * 0.55),
                     fill=PINK)
    draw.ellipse((cx - r, cy - r * 0.85, cx + r, cy + r * 0.85), fill=TIGER)
    draw.ellipse((cx - r * 0.55, cy + r * 0.05, cx + r * 0.55, cy + r * 0.75), fill=(255, 250, 240))
    w = max(2, int(r * 0.09))
    for k in (-1, 0, 1):
        draw.line((cx + k * r * 0.22, cy - r * 0.84, cx + k * r * 0.18, cy - r * 0.5), fill=K.DEV_DEEP, width=w)
    for sx in (-1, 1):
        for k in range(2):
            y = cy - r * 0.1 + k * r * 0.24
            draw.line((cx + sx * r, y, cx + sx * r * 0.7, y + r * 0.06), fill=K.DEV_DEEP, width=w)
        ex = cx + sx * r * 0.36
        draw.ellipse((ex - r * 0.12, cy - r * 0.32, ex + r * 0.12, cy - r * 0.08), fill=K.DEV_DEEP)
    draw.polygon([(cx - r * 0.14, cy + r * 0.12), (cx + r * 0.14, cy + r * 0.12), (cx, cy + r * 0.28)], fill=PINK)
    draw.arc((cx - r * 0.24, cy + r * 0.2, cx + r * 0.24, cy + r * 0.56), 20, 160, fill=K.DEV_DEEP, width=w)


def waveform(draw, x0, x1, cy, amp, t, col, dense=1.0, width=8, step=16):
    n = int((x1 - x0) / step)
    for i in range(n + 1):
        x = x0 + i * step
        hgt = amp * (0.25 + 0.75 * abs(math.sin(i * 0.55 * dense + t * 12) * math.sin(i * 0.21 + 1.3)))
        draw.line((x, cy - hgt, x, cy + hgt), fill=col, width=width)


def sun_icon(draw, cx, cy, r, t=0.0):
    for k in range(8):
        a = k * math.pi / 4 + t
        draw.line((cx + math.cos(a) * r * 1.25, cy + math.sin(a) * r * 1.25, cx + math.cos(a) * r * 1.6,
                   cy + math.sin(a) * r * 1.6), fill=K.GOLD, width=max(2, int(r * 0.16)))
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=K.GOLD)


def cloud(draw, cx, cy, r, col=(255, 255, 255)):
    for dx, dy, rr in ((-0.6, 0.1, 0.55), (0.0, -0.2, 0.75), (0.65, 0.1, 0.55)):
        draw.ellipse((cx + dx * r - rr * r, cy + dy * r - rr * r, cx + dx * r + rr * r, cy + dy * r + rr * r), fill=col)
    draw.rectangle((cx - r * 0.6, cy + r * 0.1, cx + r * 0.65, cy + r * 0.62), fill=col)


def alarm_clock(draw, cx, cy, r, t=0.0):
    shake = r * 0.06 * math.sin(t * 60)
    for sx in (-1, 1):
        draw.ellipse((cx + sx * r * 0.62 - r * 0.32 + shake, cy - r * 1.12, cx + sx * r * 0.62 + r * 0.32 + shake,
                      cy - r * 0.5), fill=K.CORAL)
    draw.ellipse((cx - r + shake, cy - r, cx + r + shake, cy + r), fill=K.CORAL)
    draw.ellipse((cx - r * 0.8 + shake, cy - r * 0.8, cx + r * 0.8 + shake, cy + r * 0.8), fill=(255, 255, 255))
    draw.line((cx + shake, cy, cx + shake, cy - r * 0.55), fill=K.DEV_DARK, width=max(2, int(r * 0.1)))
    draw.line((cx + shake, cy, cx + r * 0.4 + shake, cy), fill=K.DEV_DARK, width=max(2, int(r * 0.1)))
    for sx in (-1, 1):
        draw.line((cx + sx * r * 0.5, cy + r * 0.8, cx + sx * r * 0.75, cy + r * 1.1), fill=K.DEV_DARK,
                  width=max(2, int(r * 0.12)))


def mini_grid(draw, x0, y0, cell, n=6):
    cols = [GINGER, (255, 250, 242), (60, 50, 50), PINK, (200, 226, 246), (120, 190, 90)]
    for r in range(n):
        for c in range(n):
            col = cols[(r * 3 + c * 5 + r * c) % len(cols)]
            draw.rectangle((x0 + c * cell + 2, y0 + r * cell + 2, x0 + (c + 1) * cell - 2, y0 + (r + 1) * cell - 2),
                           fill=col)


def word_tile(draw, cx, y, text, col, size=32, fg=(255, 255, 255)):
    return K.pill(draw, cx, y, text, col, size=size, fg=fg)


def mute_tv(draw, cx, cy, s, brand):
    K.draw_device(draw, "tv", cx, cy, s, brand, lit=False)
    K.draw_cross(draw, cx + 130 * s, cy - 100 * s, 30 * s, K.DANGER)


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

    def label_lines(lines, x, y, size=36, col=None, gap=1.22):
        f = font(size, bold=True)
        for j, ln in enumerate(lines):
            K.text_at(draw, ln, x, y + j * int(size * gap), f, col or ink)

    def progressive(specs, n, illus, numbers=False):
        cw, gap = 520, 40
        x_start = cx - (3 * cw + 2 * gap) / 2
        y0 = 250
        for i, (title, sub, col) in enumerate(specs):
            x0 = x_start + i * (cw + gap)
            if i >= n:
                draw.rounded_rectangle((x0, y0, x0 + cw, 860), radius=36, fill=(246, 241, 233), outline=line, width=3)
                if numbers:
                    a = K.stagger(progress, i, step=0.18, speed=4)
                    if a > 0:
                        r = 70 * a
                        draw.ellipse((x0 + cw / 2 - r, 470 - r, x0 + cw / 2 + r, 470 + r), fill=col)
                        K.text_at(draw, str(i + 1), x0 + cw / 2, 470 - 52 * a, font(max(12, int(90 * a)), bold=True),
                                  panel)
                        K.text_at(draw, title, x0 + cw / 2, 600, font(42, bold=True), muted)
                else:
                    K.text_at(draw, "?", x0 + cw / 2, 470, font(120, bold=True), line)
                continue
            active = i == n - 1
            a = K.ease_out_cubic(K.clamp01(progress * 3)) if active else 1.0
            yy = int((1 - a) * 40)
            K.shadow_card(draw, (x0, y0 + yy, x0 + cw, 860 + yy), brand, radius=36, outline=col if active else line,
                          outline_w=6 if active else 3)
            ib = (x0 + 24, y0 + 24 + yy, x0 + cw - 24, y0 + 390 + yy)
            draw.rounded_rectangle(ib, radius=24, fill=[coral_soft, lav_soft, sage_soft][i])
            illus(i, ib, active)
            if numbers:
                K.pill(draw, 0, ib[1] + 14, str(i + 1), col, size=30, left=ib[0] + 14)
            K.text_at(draw, title, x0 + cw / 2, y0 + 418 + yy, font(46, bold=True), col)
            K.text_at(draw, sub, x0 + cw / 2, y0 + 484 + yy, font(34, bold=True), muted)

    # ---- opening -----------------------------------------------------------
    if visual == "b12-welcome":
        if focus == "hello":
            K.draw_mascot(draw, int(cx - 320), 450, 110, sage, panel, bounce)
            riya(draw, cx + 160, 410, 1.0, t)
            smart_speaker(draw, cx + 400, 530, 0.55, t, "happy")
            K.text_at(draw, "Welcome back, champ!", cx, 730, font(60, bold=True), ink)
            stars_around(320, 640)
            return True
        if focus == "bridge":
            K.shadow_card(draw, (300, 250 + lift, w - 300, 840 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · CAN COMPUTERS SEE?", cx, 326 + lift, font(34, bold=True), sage)
            specs = [("Pixels", coral, coral_soft), ("Patterns", K.BOTH_COLOR, lav_soft), ("Coco found!", sage, sage_soft)]
            for i, (lab, col, soft) in enumerate(specs):
                a = K.stagger(progress, i, step=0.14, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 380
                y = 510 + int((1 - a) * 40)
                draw.ellipse((x - 105, y - 105, x + 105, y + 105), fill=soft)
                if i == 0:
                    mini_grid(draw, x - 66, y - 66, 22)
                elif i == 1:
                    draw.ellipse((x - 80, y - 40, x - 4, y + 36), fill=K.BOTH_COLOR)
                    draw.polygon([(x + 10, y + 36), (x + 48, y - 46), (x + 86, y + 36)], fill=coral)
                else:
                    draw.polygon([(x + 10, y - 40), (x + 22, y - 92), (x + 52, y - 52)], fill=GINGER)
                    draw.line([(x + 50, y + 50), (x + 86, y + 30), (x + 92, y - 10)], fill=(204, 112, 44), width=14,
                              joint="curve")
                    K.draw_bag(draw, x - 6, y + 10, 0.62, coral)
                K.text_at(draw, lab, x, y + 124, font(36, bold=True), col)
                if i < 2:
                    K.draw_arrow(draw, x + 122, y, x + 258, y, muted, width=8, head=22)
            a = K.stagger(progress, 4, step=0.12, speed=4)
            if a > 0:
                K.pill(draw, cx, 730 + int((1 - a) * 20), "Seeing = matching patterns", coral, size=36)
            return True
        if focus == "chapter":
            K.shadow_card(draw, (300, 240 + lift, w - 300, 520 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 2 OF 5", cx, 302 + lift, font(32, bold=True), coral)
            K.text_at(draw, "Can Computers Listen?", cx, 362 + lift, font(86, bold=True), ink)
            a = K.stagger(progress, 2, step=0.12, speed=4)
            if a > 0:
                yy = int((1 - a) * 30)
                K.draw_face(draw, cx - 440, 700 + yy, 56, "kid", 1.0)
                K.sound_waves(draw, cx - 370, 700 + yy, 1.2, sage, t, "right")
                smart_speaker(draw, cx, 710 + yy, 0.52, t, "listen")
                K.draw_bubble(draw, (cx + 260, 630 + yy, cx + 520, 750 + yy), brand, "?", tail="left", size=60)
            return True
        # ears
        smart_speaker(draw, cx, 560, 1.4, t, "idle")
        big_ear(draw, cx + 330, 430, 0.9)
        K.draw_cross(draw, cx + 390, 350, 36, K.DANGER)
        K.text_at(draw, "No ears!", cx, 236, font(64, bold=True), coral)
        question_marks([(cx - 520, 380), (cx - 600, 600), (cx + 580, 620)])
        a = K.stagger(progress, 3, step=0.15, speed=4)
        if a > 0:
            K.pill(draw, cx, 790 + int((1 - a) * 20), "So how can it hear?", K.BOTH_COLOR, size=36)
        return True

    # ---- Riya & the smart speaker ----------------------------------------------------
    if visual == "b12-hook":
        if focus == "meet":
            draw.ellipse((560 - 290, 580 - 290, 560 + 290, 580 + 290), fill=blue_soft)
            riya(draw, 450, 470, 1.25, t)
            draw.rounded_rectangle((640, 790, 880, 812), radius=10, fill=WOOD)
            smart_speaker(draw, 760, 660, 0.72, t, "listen" if (t * 2) % 1 < 0.5 else "idle")
            K.text_at(draw, "Meet", 1330, 270 + lift, font(60, bold=True), muted)
            K.text_at(draw, "Riya!", 1330, 340 + lift, font(124, bold=True), coral)
            K.pill(draw, 1330, 510, "and her smart speaker", sage, size=38)
            for k, (lab, col) in enumerate((("round", K.BOTH_COLOR), ("glows when listening", RING_LISTEN))):
                a = K.stagger(progress, k + 1, step=0.18, speed=4)
                if a <= 0:
                    continue
                y = 640 + k * 100 + int((1 - a) * 20)
                draw.ellipse((1060, y + 6, 1110, y + 56), fill=col)
                draw.text((1136, y + 6), lab, fill=ink, font=font(42, bold=True))
            return True
        if focus == "song":
            sway = 30 * math.sin(t * math.pi * 6)
            riya(draw, 400 + sway, 480, 1.2, t)
            K.draw_bubble(draw, (560, 240, 1220, 420), brand, "Hey helper, play my favourite song!", tail="left",
                          size=44)
            smart_speaker(draw, 1460, 620, 1.0, t, "play")
            star_spots([(220, 300), (640, 560)])
            return True
        if focus == "brother":
            riya(draw, 200, 520, 0.85, t)
            aarav(draw, 500, 520, 1.0, t)
            K.draw_bubble(draw, (620, 280, 1000, 400), brand, "Play music.", tail="left", size=46)
            smart_speaker(draw, 1400, 640, 1.0, t, "idle")
            dots = int(progress * 6) % 4
            K.draw_bubble(draw, (1520, 330, 1760, 440), brand, "." * max(1, dots), tail="left", size=56)
            K.pill(draw, 1400, 820, "silent…", muted, size=32)
            return True
        # why
        smart_speaker(draw, cx, 600, 0.95, t, "idle")
        for k, (lines, who) in enumerate(((("How did it", "hear Riya?"), "riya"), (("Why did it", "ignore Aarav?"), "aarav"))):
            x0 = 130 if k == 0 else 1210
            draw.rounded_rectangle((x0 + 8, 300 + 10, x0 + 580 + 8, 540 + 10), radius=36, fill=K.SHADOW)
            draw.rounded_rectangle((x0, 300, x0 + 580, 540), radius=36, fill=[coral_soft, lav_soft][k],
                                   outline=[coral, K.BOTH_COLOR][k], width=5)
            if who == "riya":
                riya(draw, x0 + 100, 400, 0.6, t)
            else:
                aarav(draw, x0 + 100, 400, 0.6, t)
            label_lines(lines, x0 + 360, 360, size=44, col=[coral, K.BOTH_COLOR][k])
        question_marks([(cx - 220, 280), (cx + 220, 300)])
        K.draw_stopwatch(draw, cx, 810, 40, progress, brand)
        return True

    # ---- three steps of listening ------------------------------------------------------
    if visual == "b12-steps":
        specs = [("Hear the sound", "a mic catches it", coral), ("Sound → words", "speech recognition", K.BOTH_COLOR),
                 ("Match patterns", "work out the ask", sage)]
        n = {"intro": 0, "hear": 1, "words": 2, "match": 3}[focus]

        def illus(i, ib, active):
            mx, my = (ib[0] + ib[2]) / 2, (ib[1] + ib[3]) / 2
            p = progress if active else 1.0
            if i == 0:
                K.draw_face(draw, ib[0] + 100, my + 10, 54, "kid", 1.0)
                waveform(draw, ib[0] + 170, ib[0] + 300, my + 10, 40, t, coral, step=18, width=7)
                K.draw_device(draw, "mic", ib[2] - 100, my + 6, 0.85, brand)
            elif i == 1:
                waveform(draw, ib[0] + 96, ib[2] - 50, ib[1] + 80, 34, t, K.BOTH_COLOR, step=14, width=6)
                K.draw_arrow(draw, mx, ib[1] + 130, mx, ib[1] + 180, muted, width=8, head=22)
                words = [("play", 0, -120), ("my", 0, 60), ("favourite", 1, -80), ("song", 1, 110)]
                for k, (wd, row, dx) in enumerate(words):
                    a = K.stagger(p, k, step=0.12, speed=5)
                    if a <= 0:
                        continue
                    word_tile(draw, mx + dx, ib[1] + 200 + row * 76 + int((1 - a) * 16), wd, K.BOTH_COLOR, size=32)
            else:
                word_tile(draw, mx - 100, ib[1] + 96, "play", sage, size=34)
                K.text_at(draw, "+", mx + 10, ib[1] + 96, font(50, bold=True), ink)
                word_tile(draw, mx + 120, ib[1] + 96, "song", sage, size=34)
                K.draw_arrow(draw, mx, ib[1] + 160, mx, ib[1] + 205, muted, width=8, head=22)
                a = K.stagger(p, 2, step=0.15, speed=4)
                if a > 0:
                    K.pill(draw, mx + 40, ib[1] + 250, "Start the music!", coral, size=34)
                    K.draw_notes(draw, ib[0] + 60, ib[1] + 290, 0.7, t)
        progressive(specs, n, illus, numbers=True)
        return True

    # ---- learning from examples ----------------------------------------------------------
    if visual == "b12-learn":
        if focus == "examples":
            K.draw_device(draw, "laptop", 1450, 600, 1.1, brand, t=t)
            K.draw_spinner(draw, 1450, 545, 46, t, sage)
            rows = [("kid", "Play a song!"), ("nani", "Set a timer."), ("kid", "What's the weather?")]
            for k, (who, txt) in enumerate(rows):
                a = K.stagger(progress, k, step=0.16, speed=4)
                if a <= 0:
                    continue
                y = 280 + k * 180 + int((1 - a) * 20)
                K.draw_face(draw, 210, y + 60, 50, who, 1.0)
                K.draw_bubble(draw, (300, y, 900, y + 106), brand, txt, tail="left", size=40)
                K.draw_dashed(draw, 920, y + 53, 1250, 560, line, width=5, phase=t * 160)
                ph = (t * 1.5 + k / 3) % 1
                px, py = K.lerp(920, 1250, ph), K.lerp(y + 53, 560, ph)
                draw.ellipse((px - 10, py - 10, px + 10, py + 10), fill=coral)
            K.pill(draw, 1450, 790, "1000s of examples!", coral, size=36)
            return True
        if focus == "voices":
            people = [("kid", "Kids", 1.4), ("dad", "Grown-ups", 0.8), ("friend", "Fast", 2.6), ("nani", "Slow", 0.5),
                      ("teacher", "Accents", 1.8)]
            for i, (kind, lab, dense) in enumerate(people):
                a = K.stagger(progress, i, step=0.1, speed=5)
                if a <= 0:
                    continue
                x = cx + (i - 2) * 340
                y = 390 + int((1 - a) * 30)
                draw.ellipse((x - 130, y - 110, x + 130, y + 150), fill=[coral_soft, blue_soft, lav_soft, sage_soft,
                                                                        coral_soft][i])
                K.draw_person(draw, x, y, 0.85, kind, t)
                waveform(draw, x - 110, x + 110, 600, 34, t * dense, [coral, K.ROAD, K.BOTH_COLOR, sage, K.GOLD][i],
                         dense=dense, step=12, width=5)
                K.text_at(draw, lab, x, 650, font(38, bold=True), ink)
            a = K.stagger(progress, 6, step=0.1, speed=4)
            if a > 0:
                y = 760 + int((1 - a) * 20)
                bx = K.pill(draw, cx - 60, y, "More examples → better listening", sage, size=36)
                for k in range(3):
                    bh_ = 24 + k * 18
                    draw.rounded_rectangle((bx[2] + 30 + k * 30, bx[3] - bh_, bx[2] + 52 + k * 30, bx[3]), radius=5,
                                           fill=sage)
            return True
        # notmagic
        specs = [("Mind reading?", K.DANGER, K.DANGER_SOFT, False), ("Alive?", K.DANGER, K.DANGER_SOFT, False),
                 ("Patterns!", sage, sage_soft, True)]
        for i, (title, col, soft, ok) in enumerate(specs):
            a = K.stagger(progress, i, step=0.22, speed=4)
            if a <= 0:
                continue
            x0 = 150 + i * 560
            y0 = 270 + int((1 - a) * 50)
            draw.rounded_rectangle((x0 + 8, y0 + 10, x0 + 508, y0 + 570), radius=40, fill=K.SHADOW)
            draw.rounded_rectangle((x0, y0, x0 + 500, y0 + 560), radius=40, fill=soft, outline=col, width=5)
            ix, iy = x0 + 250, y0 + 250
            if i == 0:
                K.draw_face(draw, ix - 60, iy + 40, 70, "kid", 1.0)
                for k, (dx, dy, r) in enumerate(((20, -60, 12), (50, -100, 18))):
                    draw.ellipse((ix + dx - r, iy + dy - r, ix + dx + r, iy + dy + r), fill=panel, outline=ink, width=3)
                draw.ellipse((ix + 40, iy - 230, ix + 200, iy - 110), fill=panel, outline=ink, width=4)
                K.text_at(draw, "?", ix + 120, iy - 214, font(70, bold=True), K.BOTH_COLOR)
            elif i == 1:
                K.draw_heart(draw, ix, iy - 20, 90, coral)
            else:
                waveform(draw, ix - 150, ix + 150, iy - 90, 40, t, sage, step=14, width=6)
                K.draw_arrow(draw, ix, iy - 30, ix, iy + 20, muted, width=7, head=20)
                word_tile(draw, ix - 70, iy + 40, "play", sage, size=30)
                word_tile(draw, ix + 80, iy + 40, "song", sage, size=30)
            if ok:
                K.draw_check(draw, x0 + 440, y0 + 60, 34, sage)
            else:
                K.draw_cross(draw, x0 + 440, y0 + 60, 34, K.DANGER)
            K.text_at(draw, title, ix, y0 + 450, font(56, bold=True), col)
        return True

    # ---- voice assistants -----------------------------------------------------------------
    if visual == "b12-helpers":
        if focus == "intro":
            K.text_at(draw, "VOICE ASSISTANT", cx, 240 + lift, font(92, bold=True), coral)
            K.text_at(draw, "a helper that listens and answers", cx, 360 + lift, font(44, bold=True), muted)
            aarav(draw, 500, 580, 0.95, t)
            K.draw_bubble(draw, (620, 450, 960, 560), brand, "Hey helper!", tail="left", size=42)
            smart_speaker(draw, 1160, 680, 0.8, t, "listen")
            a = K.stagger(progress, 2, step=0.15, speed=4)
            if a > 0:
                K.draw_bubble(draw, (1290, 470, 1780, 580), brand, "How can I help?", tail="left", size=42,
                              color=sage_soft)
            return True
        specs = [("Smart speaker", "songs and weather", coral), ("Phone helper", "alarms, call nani", K.BOTH_COLOR),
                 ("Voice typing", "talk, words appear", sage)]
        n = {"speaker": 1, "phone": 2, "typing": 3}[focus]

        def illus(i, ib, active):
            mx, my = (ib[0] + ib[2]) / 2, (ib[1] + ib[3]) / 2
            p = progress if active else 1.0
            if i == 0:
                smart_speaker(draw, mx - 70, my + 50, 0.78, t, "play")
                cloud(draw, mx + 150, my - 70, 44)
                sun_icon(draw, mx + 120, my - 110, 32, t)
                cloud(draw, mx + 170, my - 60, 40)
            elif i == 1:
                sb = phone(draw, mx - 80, my, 0.52)
                K.draw_face(draw, (sb[0] + sb[2]) / 2, sb[1] + 90, 44, "nani", 1.0)
                K.text_at(draw, "Nani", (sb[0] + sb[2]) / 2, sb[1] + 160, font(28, bold=True), ink)
                draw.ellipse(((sb[0] + sb[2]) / 2 - 24, sb[3] - 70, (sb[0] + sb[2]) / 2 + 24, sb[3] - 22), fill=sage)
                alarm_clock(draw, mx + 130, my + 30, 62, t)
            else:
                K.draw_face(draw, ib[0] + 80, my - 70, 46, "kid", 1.0)
                K.sound_waves(draw, ib[0] + 130, my - 70, 0.9, sage, t, "right")
                box = (ib[0] + 40, my + 10, ib[2] - 40, ib[3] - 30)
                draw.rounded_rectangle(box, radius=18, fill=panel, outline=line, width=3)
                txt = "I love mangoes!"
                shown = txt[: int(round(len(txt) * K.clamp01(p * 1.6)))]
                f = font(40, bold=True)
                draw.text((box[0] + 24, box[1] + 30), shown, fill=ink, font=f)
                if int(t * 6) % 2 == 0 or p < 0.6:
                    tx = draw.textbbox((box[0] + 24, box[1] + 30), shown or " ", font=f)[2] + 4 if shown else box[0] + 26
                    draw.line((tx, box[1] + 30, tx, box[1] + 80), fill=coral, width=4)
                K.draw_device(draw, "mic", ib[2] - 90, my - 90, 0.42, brand)
        progressive(specs, n, illus)
        return True

    # ---- wake word ------------------------------------------------------------------------
    if visual == "b12-wake":
        if focus == "name":
            aarav(draw, 380, 500, 1.1, t)
            K.draw_bubble(draw, (520, 270, 900, 390), brand, "Play music.", tail="left", size=46)
            smart_speaker(draw, 1080, 640, 0.85, t, "sleep")
            K.text_at(draw, "Forgot the", 1550, 330 + lift, font(46, bold=True), muted)
            K.text_at(draw, "WAKE WORD!", 1550, 396 + lift, font(76, bold=True), coral)
            a = K.stagger(progress, 3, step=0.12, speed=4)
            if a > 0:
                K.pill(draw, 1550, 560 + int((1 - a) * 20), "\"Hey helper\"", K.BOTH_COLOR, size=40)
            return True
        if focus == "meaning":
            riya(draw, 330, 500, 1.0, t)
            K.draw_bubble(draw, (450, 260, 840, 370), brand, "Hey helper!", tail="left", size=46, color=coral,
                          fg=panel)
            a = K.ease_out_cubic(K.clamp01(progress * 2.5))
            K.draw_arrow(draw, 760, 480, 760 + 110 * a, 520, muted, width=8, head=24)
            smart_speaker(draw, 1000, 650, 0.85, t, "listen" if progress > 0.25 else "sleep")
            K.shadow_card(draw, (1220, 260, 1780, 830), brand, radius=36, accent=coral)
            K.text_at(draw, "WAKE WORD", 1500, 330, font(56, bold=True), coral)
            label_lines(("a special word", "or name that", "tells the helper:"), 1500, 430, size=40)
            b = K.stagger(progress, 3, step=0.12, speed=4)
            if b > 0:
                K.pill(draw, 1500, 690 + int((1 - b) * 20), "Start listening now!", sage, size=34)
            return True
        if focus == "like":
            draw.rounded_rectangle((120, 720, 1800, 860), radius=40, fill=GRASS)
            for x0_, x1_ in ((800, 900), (1120, 1020)):
                draw.line((x0_, 860, 960, 520), fill=WOOD_DARK, width=14)
                draw.line((x1_, 860, 960, 520), fill=WOOD_DARK, width=14)
            draw.line((900, 520, 1020, 520), fill=WOOD_DARK, width=16)
            sw = 20 * math.sin(t * 8)
            draw.line((935, 525, 935 + sw, 700), fill=K.DEV_MID, width=5)
            draw.line((985, 525, 985 + sw, 700), fill=K.DEV_MID, width=5)
            draw.rounded_rectangle((920 + sw, 696, 1000 + sw, 714), radius=6, fill=coral)
            aarav(draw, 420, 540, 1.05, t)
            K.draw_bubble(draw, (540, 290, 820, 400), brand, "Meera!", tail="left", size=48)
            K.draw_person(draw, 1480, 560, 1.0, "friend", t)
            a = K.stagger(progress, 3, step=0.12, speed=4)
            if a > 0:
                K.draw_bubble(draw, (1560, 300, 1780, 410), brand, "Yes?", tail="left", size=46)
                K.text_at(draw, "!", 1400, 380, font(80, bold=True), K.GOLD)
            K.pill(draw, cx, 236, "Call the name first!", K.BOTH_COLOR, size=34)
            return True
        # fixed
        aarav(draw, 420, 500, 1.1, t)
        K.draw_bubble(draw, (540, 250, 1110, 400), brand, "Hey helper, play music!", tail="left", size=44)
        smart_speaker(draw, 1360, 620, 0.95, t, "play")
        riya(draw, 1720, 540, 0.8, t)
        if progress > 0.4:
            star_spots([(200, 300), (760, 560), (1120, 760)])
            K.pill(draw, 1360, 820, "Dance party!", coral, size=34)
        return True

    # ---- what makes it harder --------------------------------------------------------------
    if visual == "b12-noise":
        if focus == "intro":
            K.text_at(draw, "Listening gets harder when…", cx, 236, font(54, bold=True), ink)
            smart_speaker(draw, cx, 600, 1.1, t, "confused")
            for sx in (-1, 1):
                for k in range(3):
                    r = 200 + k * 60
                    a0 = (-40 if sx > 0 else 140) + k * 6
                    for j in range(3):
                        s0 = a0 + j * 28
                        draw.arc((cx - r, 600 - r, cx + r, 600 + r), s0, s0 + 14, fill=WHISPER, width=8)
            question_marks([(cx - 520, 420), (cx + 500, 440)])
            return True
        specs = [("Noise", "TV, mixer, market", coral), ("Whispers, mumbles", "too soft, too fast", K.BOTH_COLOR),
                 ("Mistakes!", "timer → tiger?", sage)]
        n = {"noise": 1, "whisper": 2, "oops": 3}[focus]

        def illus(i, ib, active):
            mx, my = (ib[0] + ib[2]) / 2, (ib[1] + ib[3]) / 2
            p = progress if active else 1.0
            if i == 0:
                K.draw_device(draw, "tv", mx - 100, my - 50, 0.6, brand, t=t)
                mixer(draw, mx + 130, ib[3] - 24, 0.62, t, on=True)
                for k in range(4):
                    zx = ib[0] + 40 + k * 40
                    pts = [(zx + j * 10, ib[3] - 70 + (14 if j % 2 else -14) + 4 * math.sin(t * 30 + k)) for j in range(6)]
                    draw.line(pts, fill=K.DANGER, width=4)
            elif i == 1:
                K.draw_face(draw, ib[0] + 100, my - 40, 60, "kid", 0.0)
                K.text_at(draw, "psst…", mx + 80, my - 120, font(46, bold=True), WHISPER)
                K.sound_waves(draw, ib[0] + 170, my - 40, 0.6, WHISPER, t, "right", count=2)
                K.text_at(draw, "talkingsuperfast", mx, my + 90, font(34, bold=True), K.BOTH_COLOR)
                for k in range(3):
                    yy = my + 150 + k * 10
                    draw.line((ib[0] + 60, yy, ib[0] + 120 + k * 20, yy), fill=K.BOTH_COLOR, width=4)
            else:
                K.draw_stopwatch(draw, mx - 120, my - 20, 64, t, brand)
                K.text_at(draw, "timer", mx - 120, my + 70, font(34, bold=True), ink)
                K.draw_arrow(draw, mx - 40, my - 20, mx + 20, my - 20, muted, width=8, head=22)
                a = K.stagger(p, 1, step=0.15, speed=4)
                if a > 0:
                    tiger_face(draw, mx + 120, my - 20, 80 * (0.6 + 0.4 * a))
                    K.text_at(draw, "tiger?!", mx + 120, my + 70, font(34, bold=True), K.DANGER)
        progressive(specs, n, illus)
        return True

    # ---- Riya and the mixer ---------------------------------------------------------------
    if visual == "b12-mixer":
        ans = focus == "answer"
        draw.rounded_rectangle((120 + 8, 640 + 10, 640 + 8, 690 + 10), radius=12, fill=K.SHADOW)
        draw.rounded_rectangle((120, 640, 640, 690), radius=12, fill=WOOD)
        mixer(draw, 360, 640, 0.95, t, on=not ans)
        if not ans:
            K.text_at(draw, "WHIRR!", 360, 250 + int(6 * math.sin(t * 40)), font(60, bold=True), K.DANGER)
            riya(draw, 820, 470, 1.15, t)
            K.draw_bubble(draw, (930, 250, 1300, 350), brand, "hey helper… weather?", tail="left", size=28,
                          fg=WHISPER)
            smart_speaker(draw, 1540, 640, 0.95, t, "confused")
            K.text_at(draw, "?", 1540, 360, font(int(90 + 20 * pulse), bold=True), K.GOLD)
            K.draw_stopwatch(draw, 1180, 790, 40, progress, brand)
        else:
            bx = K.pill(draw, 360, 250, "Mixer off", sage, size=38)
            K.draw_check(draw, bx[2] + 34, (bx[1] + bx[3]) / 2, 24, sage)
            riya(draw, 820, 470, 1.15, t)
            K.draw_bubble(draw, (930, 240, 1480, 400), brand, "Hey helper, what's the weather today?", tail="left",
                          size=40)
            smart_speaker(draw, 1290, 690, 0.8, t, "happy")
            a = K.stagger(progress, 3, step=0.14, speed=4)
            if a > 0:
                draw.rounded_rectangle((1440, 500, 1790, 700), radius=30, fill=sage_soft, outline=sage, width=4)
                sun_icon(draw, 1520, 580, 34, t)
                draw.text((1580, 540), "Sunny,", fill=ink, font=font(36, bold=True))
                draw.text((1580, 590), "breezy!", fill=ink, font=font(36, bold=True))
            for k, lab in enumerate(("1 · Wait for quiet", "2 · Say it clearly, in full")):
                b = K.stagger(progress, k + 1, step=0.18, speed=4)
                if b <= 0:
                    continue
                K.pill(draw, 0, 724 + k * 76 + int((1 - b) * 16), lab, [K.BOTH_COLOR, coral][k], size=32, left=140)
        return True

    # ---- good or poor command ---------------------------------------------------------------
    if visual == "b12-commands":
        if focus in ("ask", "answer"):
            ans = focus == "answer"
            cmds = [("Umm… do that thing.", False, "Do what thing?"),
                    ("Hey helper, set a timer for 10 minutes.", True, "Wake word + clear ask"),
                    ("Do the stuff from yesterday.", False, "What stuff?")]
            cw, gap = 520, 40
            x_start = cx - (3 * cw + 2 * gap) / 2
            for i, (txt, good, note) in enumerate(cmds):
                x0 = x_start + i * (cw + gap)
                mx = x0 + cw / 2
                reveal = ans and progress > (0.05 if good else 0.45)
                col = (sage if good else K.DANGER) if reveal else line
                K.shadow_card(draw, (x0, 300, x0 + cw, 840), brand, radius=32, outline=col, outline_w=6 if reveal else 3)
                K.draw_face(draw, mx, 422, 50, "kid", 1.0 if good else 0.0)
                bb = (x0 + 34, 496, x0 + cw - 34, 696)
                draw.rounded_rectangle(bb, radius=28, fill=(246, 243, 238))
                f = font(38, bold=True)
                lines = K.wrap_text(txt, f, int(bb[2] - bb[0] - 40))
                ty = (bb[1] + bb[3]) / 2 - len(lines) * 24
                for j, ln in enumerate(lines):
                    if good and j == 0 and ln.startswith("Hey helper,"):
                        rest = ln[len("Hey helper,"):]
                        wa = draw.textbbox((0, 0), "Hey helper,", font=f)[2]
                        wb = draw.textbbox((0, 0), rest, font=f)[2]
                        lx = mx - (wa + wb) / 2
                        draw.text((lx, ty + j * 48), "Hey helper,", fill=coral, font=f)
                        draw.text((lx + wa, ty + j * 48), rest, fill=ink, font=f)
                    else:
                        K.text_at(draw, ln, mx, ty + j * 48, f, ink)
                if reveal:
                    K.pill(draw, mx, 318, "GOOD" if good else "POOR", sage if good else K.DANGER, size=30)
                    K.text_at(draw, note, mx, 734, font(34, bold=True), sage if good else K.DANGER)
                    (K.draw_check if good else K.draw_cross)(draw, x0 + cw - 50, 360, 28, sage if good else K.DANGER)
                elif not ans:
                    K.pill(draw, mx, 318, "?", K.BOTH_COLOR, size=30)
            if not ans:
                K.pill(draw, cx - 40, 226, "Which command is good?", K.BOTH_COLOR, size=32)
                K.draw_stopwatch(draw, cx + 260, 256, 32, progress, brand)
            return True
        # tips
        tips = [(("Wake word", "first"), coral), (("Speak", "clearly"), K.BOTH_COLOR), (("Quieter", "room"), sage),
                (("One ask", "at a time"), K.ROAD)]
        cw, gap = 390, 30
        x_start = cx - (4 * cw + 3 * gap) / 2
        K.text_at(draw, "Your tips", cx, 220, font(50, bold=True), ink)
        for i, (lab, col) in enumerate(tips):
            a = K.stagger(progress, i, step=0.16, speed=4)
            if a <= 0:
                continue
            x0 = x_start + i * (cw + gap)
            y0 = 300 + int((1 - a) * 40)
            mx = x0 + cw / 2
            K.shadow_card(draw, (x0, y0, x0 + cw, y0 + 520), brand, radius=32, outline=col, outline_w=5)
            iy = y0 + 200
            if i == 0:
                smart_speaker(draw, mx, iy + 20, 0.7, t, "listen")
            elif i == 1:
                K.draw_face(draw, mx - 50, iy, 60, "kid", 1.0)
                K.sound_waves(draw, mx + 20, iy, 1.1, col, t, "right")
            elif i == 2:
                mute_tv(draw, mx, iy + 10, 0.7, brand)
            else:
                draw.ellipse((mx - 80, iy - 80, mx + 80, iy + 80), fill=K.ROAD_SOFT)
                K.text_at(draw, "1", mx, iy - 70, font(120, bold=True), col)
            label_lines(lab, mx, y0 + 380, size=40, col=col)
        return True

    # ---- checkpoint ------------------------------------------------------------------------
    if visual == "b12-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 270 + lift, w - 460, 760 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 350 + lift, font(40, bold=True), sage)
            K.text_at(draw, "Talk like a pro!", cx, 430 + lift, font(60, bold=True), ink)
            smart_speaker(draw, cx, 640 + lift, 0.5, t, "listen")
            return True
        ans = focus == "answer"
        draw.rounded_rectangle((130 + 10, 240 + 12, 1080 + 10, 870 + 12), radius=24, fill=K.SHADOW)
        draw.rounded_rectangle((130, 240, 1080, 870), radius=24, fill=(255, 250, 238))
        label_lines(("Write one clear command", "for a voice helper."), 605, 270, size=44, col=coral)
        for k in range(4):
            draw.line((180, 520 + k * 90, 1030, 520 + k * 90), fill=(220, 210, 232), width=3)
        if ans:
            rows = [("Hey helper,", coral), ("what's the weather", ink), ("in Delhi today?", ink)]
            for i, (txt, col) in enumerate(rows):
                a = K.stagger(progress, i, step=0.14, speed=5)
                if a <= 0:
                    continue
                draw.text((200, 452 + i * 90), txt, fill=col, font=font(52, bold=True))
            b = K.stagger(progress, 3, step=0.14, speed=4)
            if b > 0:
                p1 = K.pill(draw, 0, 460, "wake word", coral, size=28, left=560)
                K.draw_check(draw, p1[2] + 30, (p1[1] + p1[3]) / 2, 18, sage)
            c = K.stagger(progress, 4, step=0.14, speed=4)
            if c > 0:
                p2 = K.pill(draw, 0, 740, "one clear ask", sage, size=28, left=200)
                K.draw_check(draw, p2[2] + 30, (p2[1] + p2[3]) / 2, 18, sage)
            smart_speaker(draw, 1450, 640, 1.0, t, "happy")
            d = K.stagger(progress, 5, step=0.12, speed=4)
            if d > 0:
                draw.rounded_rectangle((1180, 260, 1760, 400), radius=30, fill=sage_soft, outline=sage, width=4)
                sun_icon(draw, 1270, 330, 32, t)
                draw.text((1340, 300), "Sunny in Delhi!", fill=ink, font=font(40, bold=True))
        else:
            K.text_at(draw, "?", 605, 520, font(130, bold=True), line)
            smart_speaker(draw, 1450, 640, 1.0, t, "listen")
            K.text_at(draw, "?", 1640, 330, font(int(90 + 16 * pulse), bold=True), K.GOLD)
            K.draw_stopwatch(draw, 1260, 360, 44, progress, brand)
        return True

    # ---- recap -----------------------------------------------------------------------------
    if visual == "b12-recap":
        recap = [(("Sound → words", "→ patterns"), coral, "steps"), (("Wake word", "first"), K.BOTH_COLOR, "wake"),
                 (("Speak clearly,", "quiet room"), sage, "clear"), (("Noise & whispers", "make it harder"), K.DANGER,
                                                                    "noise")]
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
                if kind == "steps":
                    waveform(draw, ix - 140, ix - 30, iy - 60, 34, t, coral, step=12, width=5)
                    K.draw_arrow(draw, ix - 20, iy - 60, ix + 20, iy - 60, muted, width=6, head=16)
                    word_tile(draw, ix + 90, iy - 84, "abc", K.BOTH_COLOR, size=26)
                    K.draw_arrow(draw, ix + 90, iy - 20, ix + 90, iy + 20, muted, width=6, head=16)
                    K.draw_check(draw, ix + 90, iy + 70, 36, sage)
                elif kind == "wake":
                    smart_speaker(draw, ix, iy + 10, 0.7, t, "listen")
                elif kind == "clear":
                    K.draw_face(draw, ix - 60, iy - 40, 50, "kid", 1.0)
                    K.sound_waves(draw, ix - 4, iy - 40, 0.9, sage, t, "right")
                    mute_tv(draw, ix + 70, iy + 90, 0.32, brand)
                else:
                    mixer(draw, ix - 60, iy + 110, 0.55, t, on=True)
                    K.text_at(draw, "psst…", ix + 90, iy - 60, font(36, bold=True), WHISPER)
                    K.text_at(draw, "?", ix + 90, iy + 10, font(80, bold=True), K.GOLD)
                label_lines(lab, x0 + 200, y0 + 390, size=36)
            return True
        if focus == "done":
            K.draw_mascot(draw, int(cx - 320), 430, 110, sage, panel, bounce)
            smart_speaker(draw, cx + 320, 470, 0.7, t, "play")
            K.text_at(draw, "Chapter 2 done!", cx, 670, font(68, bold=True), ink)
            K.pill(draw, cx, 770, "Sound → words → patterns", coral, size=36)
            stars_around(320, 600, 8)
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, font(64, bold=True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, font(44, bold=True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        smart_speaker(draw, cx + 480, 640, 0.6, t, "happy")
        K.draw_mascot(draw, int(cx - 480), 600, 90, sage, panel, bounce)
        return True

    return False

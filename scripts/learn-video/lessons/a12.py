"""A12 · Making a Character Move — visuals (uses the block kit from a11.py)."""
from __future__ import annotations

import math

import build as K

A = K.lesson_plugin("a11-kit")
BH = A.BH
MILK_BLUE = (92, 150, 230)
WOOL, WOOL_D = (236, 96, 150), (196, 60, 112)
STAGE_BOX = (760, 250, 1800, 860)
STEP_PX = 30
L_START = (930, 410)
WOOL_START = (910, 420)


def draw_bowl(draw, cx: float, cy: float, s: float) -> None:
    draw.ellipse((cx - 70 * s, cy + 24 * s, cx + 70 * s, cy + 40 * s), fill=K.SHADOW)
    draw.chord((cx - 64 * s, cy - 50 * s, cx + 64 * s, cy + 36 * s), 0, 180, fill=MILK_BLUE)
    draw.rectangle((cx - 64 * s, cy - 8 * s, cx + 64 * s, cy - 6 * s), fill=MILK_BLUE)
    draw.ellipse((cx - 64 * s, cy - 22 * s, cx + 64 * s, cy + 6 * s), fill=(255, 255, 255), outline=MILK_BLUE,
                 width=max(2, int(6 * s)))
    draw.rounded_rectangle((cx - 30 * s, cy + 6 * s, cx + 30 * s, cy + 18 * s), radius=5 * s, fill=(255, 255, 255))


def draw_wool(draw, cx: float, cy: float, r: float) -> None:
    draw.line([(cx + r * 0.6, cy + r * 0.7), (cx + r * 1.2, cy + r * 0.9), (cx + r * 1.5, cy + r * 0.6)],
              fill=WOOL_D, width=max(2, int(r * 0.12)), joint="curve")
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=WOOL, outline=WOOL_D, width=max(2, int(r * 0.08)))
    for k in range(3):
        o = (k - 1) * r * 0.45
        draw.arc((cx - r * 0.9 + o, cy - r * 1.4, cx + r * 0.9 + o, cy + r * 0.9), 200, 330, fill=WOOL_D,
                 width=max(2, int(r * 0.07)))


def draw_bell(draw, cx: float, cy: float, s: float, t: float = 0.0) -> None:
    sw = 10 * math.sin(t * 30) * s
    draw.rounded_rectangle((cx - 14 * s, cy - 150 * s, cx + 14 * s, cy - 100 * s), radius=8 * s, fill=K.DEV_DARK)
    pts = [(cx - 30 * s, cy - 104 * s), (cx + 30 * s, cy - 104 * s), (cx + 60 * s, cy - 40 * s),
           (cx + 70 * s, cy + 30 * s), (cx + 96 * s, cy + 50 * s), (cx - 96 * s, cy + 50 * s), (cx - 70 * s, cy + 30 * s),
           (cx - 60 * s, cy - 40 * s)]
    draw.polygon([(x + sw + 8, y + 10) for x, y in pts], fill=K.SHADOW)
    draw.polygon([(x + sw, y) for x, y in pts], fill=K.GOLD, outline=K.DEV_DARK, width=max(2, int(5 * s)))
    draw.ellipse((cx - 22 * s - sw, cy + 44 * s, cx + 22 * s - sw, cy + 88 * s), fill=K.DEV_DARK)
    draw.line((cx - 30 * s + sw, cy - 70 * s, cx - 40 * s + sw, cy + 10 * s), fill=(255, 230, 160), width=max(2, int(8 * s)))


def draw_pie(draw, cx: float, cy: float, r: float, quarters: float, col, ring) -> None:
    draw.ellipse((cx - r + 8, cy - r + 10, cx + r + 8, cy + r + 10), fill=K.SHADOW)
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(255, 255, 255), outline=ring, width=6)
    if quarters > 0:
        draw.pieslice((cx - r + 6, cy - r + 6, cx + r - 6, cy + r - 6), -90, -90 + 90 * quarters, fill=col)
    draw.line((cx, cy - r, cx, cy + r), fill=ring, width=3)
    draw.line((cx - r, cy, cx + r, cy), fill=ring, width=3)
    draw.ellipse((cx - 10, cy - 10, cx + 10, cy + 10), fill=K.DEV_DARK)


def run_program(cmds, start, h0: float, f: float, unit: float = STEP_PX):
    """Play cmds up to step f (fractional). Returns x, y, heading, current index, walking flag, trail points."""
    x, y = start
    hd = h0
    trail = [(x, y)]
    cur = 0
    walking = False
    for i, (kind, val) in enumerate(cmds):
        frac = K.clamp01(f - i)
        if frac <= 0:
            break
        cur = i
        e = K.ease_in_out(frac)
        if kind == "move":
            d = val * unit * e
            x += math.cos(math.radians(hd)) * d
            y += math.sin(math.radians(hd)) * d
            walking = frac < 1
            trail.append((x, y))
        elif kind == "turn":
            hd += val * e
            walking = False
        else:
            walking = False
    return x, y, hd, cur, walking, trail


def dashed_path(draw, pts, color, width: int = 6) -> None:
    for a, b in zip(pts, pts[1:]):
        K.draw_dashed(draw, a[0], a[1], b[0], b[1], color, width=width, dash=18, gap=14)


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
    gold_soft = K.hex_rgb("#FFF4D6")
    appear = K.ease_out_cubic(min(1.0, progress * 3.0))
    bounce = int(10 * math.sin(progress * math.pi * 3))
    pulse = 0.5 + 0.5 * math.sin(progress * math.pi * 8)
    lift = int((1 - appear) * 40)
    cx = w / 2
    t = progress
    F = K.load_font

    def stars_around(y: float, spread: float, n: int = 6) -> None:
        for i in range(n):
            side = -1 if i % 2 == 0 else 1
            sx = cx + side * (spread + 80 * (i // 2))
            sy = y + 90 * (i // 2) + 14 * math.sin(progress * 9 + i)
            K.draw_star(draw, sx, sy, 22 + 6 * pulse, [coral, sage, K.BOTH_COLOR, K.GOLD][i % 4], rot=progress * 3 + i)

    def stars_pts(pts) -> None:
        for k, (sx, sy) in enumerate(pts):
            K.draw_star(draw, sx, sy + 10 * math.sin(progress * 9 + k), 20 + 6 * pulse,
                        [coral, sage, K.BOTH_COLOR, K.GOLD][k % 4], rot=progress * 3 + k)

    def qmarks(pts) -> None:
        for k, (qx, qy) in enumerate(pts):
            K.text_at(draw, "?", qx, qy, F(int(76 + 18 * (pulse if k % 2 else 1 - pulse)), True), K.GOLD)

    def map_stage(lit: bool = False):
        return A.draw_stage(draw, STAGE_BOX, brand, lit=lit, grid=100)

    def grid_cat(x, y, hd, walking=False, s=0.7, mood="happy"):
        A.draw_cat(draw, x, y, s, heading=hd, walk=t if walking else 0, mood=mood, shadow=False)

    def tag_block(tag: str, col, kind: str, val, job: str, s: float = 1.5, state: str = "normal") -> None:
        K.pill(draw, 0, 262, tag, col, size=34, left=170)
        A.draw_block(draw, 170, 400, kind, val, s, state=state)
        font = F(40, True)
        for j, ln in enumerate(K.wrap_text(job, font, 540)):
            draw.text((170, 560 + j * 52), ln, fill=ink, font=font)

    # ---- opening ----------------------------------------------------------------
    if visual == "a12-welcome":
        if focus == "hello":
            A.draw_cat(draw, cx - 300, 490 + bounce, 1.6, walk=t)
            K.draw_mascot(draw, int(cx + 330), 450, 110, sage, panel, bounce)
            K.text_at(draw, "Welcome back, champ!", cx, 690, F(60, True), ink)
            K.pill(draw, cx, 780, "Unit 3 · Building With Blocks", coral, size=32)
            stars_around(330, 520)
            return True
        if focus == "bridge":
            K.shadow_card(draw, (240, 250 + lift, w - 240, 840 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "LAST TIME · MEET BLOCK CODING", cx, 330 + lift, F(34, True), sage)
            items = [("flag", None, "Start"), ("move", 10, "Move"), ("wait", 1, "Wait"), ("say", "Hello!", "Say")]
            widths = [A.block_width(draw, k, v, 0.85) for k, v, _ in items]
            x = cx - (sum(widths) + 50 * 3) / 2
            for i, (kind, val, lab) in enumerate(items):
                a = K.stagger(progress, i, step=0.12, speed=5)
                if a > 0:
                    A.draw_block(draw, x, 470 + int((1 - a) * 40) + lift, kind, val, 0.85)
                    mx = x + widths[i] / 2
                    K.draw_check(draw, mx, 640 + lift, 34, sage)
                    K.text_at(draw, lab, mx, 690 + lift, F(36, True), ink)
                x += widths[i] + 50
            return True
        if focus == "chapter":
            K.shadow_card(draw, (240, 240 + lift, w - 240, 520 + lift), brand, radius=40, accent=coral)
            K.text_at(draw, "CHAPTER 2 OF 5", cx, 302 + lift, F(32, True), coral)
            K.text_at(draw, "Making a Character Move", cx, 362 + lift, F(88, True), ink)
            K.draw_dashed(draw, 560, 760, 1300, 760, line, width=8, dash=22, gap=16)
            mv = K.ease_in_out(K.clamp01((progress - 0.1) * 1.4))
            A.draw_cat(draw, K.lerp(560, 1220, mv), 740, 0.9, walk=t if mv < 1 else 0)
            draw_bowl(draw, 1400, 770, 1.1)
            return True
        # promise
        for i, (title, kind, val, col, soft) in enumerate((("Walk", "move", 10, A.MOTION_D, blue_soft),
                                                         ("Turn", "turn", 90, A.MOTION_D, lav_soft))):
            a = K.stagger(progress, i, step=0.25, speed=4)
            if a <= 0:
                continue
            x0 = 220 + i * 800
            y0 = 260 + int((1 - a) * 40)
            draw.rounded_rectangle((x0, y0, x0 + 680, y0 + 580), radius=40, fill=soft, outline=col, width=5)
            bw = A.block_width(draw, kind, val, 1.1)
            A.draw_block(draw, x0 + 340 - bw / 2, y0 + 60, kind, val, 1.1)
            K.text_at(draw, title + "!", x0 + 340, y0 + 190, F(60, True), col)
            if i == 0:
                mv = K.ease_in_out(K.clamp01(progress * 1.5))
                A.draw_cat(draw, x0 + 200 + 160 * mv, y0 + 430, 0.9, walk=t)
                K.draw_arrow(draw, x0 + 150, y0 + 530, x0 + 520, y0 + 530, col, width=10, head=28)
            else:
                hd = 90 * K.ease_in_out(K.clamp01(progress * 1.5))
                A.draw_cat(draw, x0 + 340, y0 + 410, 0.85, heading=hd, shadow=False)
                draw.arc((x0 + 170, y0 + 240, x0 + 510, y0 + 580), 300, 60, fill=col, width=10)
                K.draw_arrow(draw, x0 + 470, y0 + 540, x0 + 440, y0 + 565, col, width=10, head=30)
        return True

    # ---- Billu is hungry -----------------------------------------------------------
    corner = (L_START[0] + 300, L_START[1])
    bowl_pos = (corner[0], L_START[1] + 300 + 95)
    if visual == "a12-hook":
        map_stage()
        if focus == "meet":
            A.draw_cat(draw, 420, 640, 1.5, walk=t)
            A.say_bubble(draw, brand, 470, 490, "I'm hungry!", 40)
            grid_cat(*L_START, 0)
            return True
        path = [L_START, corner, (corner[0], L_START[1] + 300)]
        dashed_path(draw, path, coral)
        draw_bowl(draw, *bowl_pos, 0.8)
        grid_cat(*L_START, 0)
        if focus == "bowl":
            draw.ellipse((420 - 190, 560 - 190, 420 + 190, 560 + 190), fill=blue_soft)
            draw_bowl(draw, 420, 580, 2.2)
            K.text_at(draw, "Milk!", 420, 760, F(48, True), A.MOTION_D)
            for k, (lab, px, py) in enumerate((("walk", 1080, 450), ("turn", 1330, 340), ("walk", 1330, 560))):
                a = K.stagger(progress, k, step=0.2, speed=4)
                if a > 0:
                    K.pill(draw, px, py, lab, [A.MOTION_D, coral, A.MOTION_D][k], size=28)
            return True
        for k in range(3):
            A.draw_block(draw, 180, 380 + k * BH * 1.0, "move", "?", 1.0, state="ghost", wd=340)
        K.draw_stopwatch(draw, 350, 760, 44, progress, brand)
        qmarks(((1060, 470), (1400, 540)))
        return True

    # ---- event block ---------------------------------------------------------------------
    if visual == "a12-event":
        if focus == "name":
            tag_block("EVENT", A.EVENT_D, "flag", None, "Starts things when something happens", s=1.6)
            inner = A.draw_stage(draw, (1000, 260, 1800, 850), brand)
            A.draw_cat(draw, 1400, 730, 1.0, mood="blink")
            K.text_at(draw, "Waiting for the event…", 1400, 450, F(40, True), muted)
            for k in range(3):
                K.text_at(draw, "z", 1530 + k * 40, 560 - k * 40 + bounce, F(36 + k * 8, True), A.LOOKS_D)
            return True
        if focus == "bell":
            K.text_at(draw, "When the bell rings…", 470, 250, F(46, True), ink)
            draw.ellipse((470 - 180, 520 - 180, 470 + 180, 520 + 180), fill=gold_soft)
            draw_bell(draw, 470, 540, 1.3, t)
            K.sound_waves(draw, 620, 470, 1.2, K.GOLD, t, facing="right")
            K.sound_waves(draw, 320, 470, 1.2, K.GOLD, t, facing="left")
            a = K.ease_out_cubic(K.clamp01((progress - 0.25) * 3))
            if a > 0:
                K.draw_arrow(draw, 760, 560, 760 + 180 * a, 560, coral, width=14, head=40)
            b = K.ease_out_cubic(K.clamp01((progress - 0.4) * 2.5))
            if b > 0:
                K.text_at(draw, "…everyone goes to class!", 1400, 250, F(46, True), sage)
                K.draw_school(draw, 1520, 620, 1.0, brand)
                for k, kind in enumerate(("kid", "friend")):
                    px = K.lerp(950, 1110, b) + k * 110
                    K.draw_person(draw, px, 640, 0.6, kind, t)
            return True
        # flag
        draw.rounded_rectangle((260 + 10, 360 + 12, 620 + 10, 720 + 12), radius=50, fill=K.SHADOW)
        press = K.clamp01((progress - 0.15) * 3)
        draw.rounded_rectangle((260, 360, 620, 720), radius=50, fill=(206, 240, 212) if press > 0 else panel,
                               outline=A.FLAG, width=8)
        A.draw_flag(draw, 360, 560, 5.0)
        A.draw_cursor(draw, 560, 640, 1.3, press=press)
        K.text_at(draw, "Click!", 440, 770, F(44, True), A.FLAG_D)
        a = K.ease_out_cubic(K.clamp01((progress - 0.3) * 3))
        if a > 0:
            K.draw_arrow(draw, 680, 540, 680 + 200 * a, 540, coral, width=14, head=40)
        states = ["glow" if press > 0 else "normal", "normal", "normal"]
        A.draw_stack(draw, 1060, 420, [("flag", None), ("move", 10), ("turn", 90)], 1.2, states=states)
        if progress > 0.5:
            K.pill(draw, 1290, 770, "Always on top!", A.EVENT_D, size=36)
            K.pill(draw, 0, 432, "1st", coral, size=30, left=1450)
        return True

    # ---- move block ------------------------------------------------------------------------
    if visual == "a12-move":
        if focus in ("block", "steps"):
            tag_block("MOTION", A.MOTION_D, "move", 10, "Moves or turns the character",
                      state="glow" if focus == "steps" else "normal")
            map_stage()
            start = (930, 483)
            if focus == "block":
                grid_cat(*start, 0)
                K.draw_arrow(draw, 1010, 560, 1110, 560, A.MOTION_D, width=8, head=24)
                return True
            mv = K.ease_in_out(K.clamp01((progress - 0.1) * 1.6))
            for k in range(3):
                if 0 < mv < 1:
                    draw.line((start[0] + 300 * mv - 110 - k * 26, 450 + k * 30, start[0] + 300 * mv - 80 - k * 26,
                               450 + k * 30), fill=A.MOTION, width=6)
            grid_cat(start[0] + 300 * mv, start[1], 0, walking=0 < mv < 1)
            K.draw_arrow(draw, start[0], 600, start[0] + 300 * max(mv, 0.05), 600, A.MOTION_D, width=8, head=24)
            K.text_at(draw, "10 steps", start[0] + 150, 620, F(36, True), A.MOTION_D)
            return True
        # double
        mv = K.ease_in_out(K.clamp01((progress - 0.1) * 1.5))
        for i, val in enumerate((10, 20)):
            y0 = 280 + i * 300
            A.draw_block(draw, 150, y0 + 80, "move", val, 1.0, state="glow" if i == 1 else "normal")
            draw.rounded_rectangle((560, y0, 1800, y0 + 250), radius=30, fill=panel, outline=line, width=3)
            for k in range(10):
                tx = 660 + k * 120
                draw.line((tx, y0 + 196, tx, y0 + 214), fill=line, width=4)
            end = 660 + 360 * (i + 1) * mv
            A.draw_cat(draw, end, y0 + 120, 0.7, walk=t if 0 < mv < 1 else 0)
            K.draw_arrow(draw, 660, y0 + 228, max(end, 690), y0 + 228, A.MOTION_D, width=8, head=22)
            if mv > 0.6:
                draw.text((max(end, 690) + 30, y0 + 206), f"{val} steps", fill=A.MOTION_D, font=F(32, True))
        if mv >= 1:
            K.pill(draw, 1640, 600, "2× as far!", coral, size=36)
        return True

    # ---- turn block ---------------------------------------------------------------------------
    if visual == "a12-turn":
        if focus == "block":
            tag_block("MOTION", A.MOTION_D, "turn", 90, "Turns the character")
            map_stage()
            grid_cat(1280, 583, 0, s=0.9)
            return True
        if focus == "quarter":
            q = K.ease_in_out(K.clamp01((progress - 0.1) * 2))
            draw_pie(draw, 480, 540, 200, q, (255, 204, 170), line)
            draw.arc((480 - 240, 540 - 240, 480 + 240, 540 + 240), -90, -90 + 90 * max(q, 0.05), fill=coral, width=12)
            ang = math.radians(-90 + 90 * max(q, 0.05))
            ex, ey = 480 + math.cos(ang) * 240, 540 + math.sin(ang) * 240
            tx, ty = -math.sin(ang), math.cos(ang)
            K.draw_arrow(draw, ex - tx * 30, ey - ty * 30, ex + tx * 14, ey + ty * 14, coral, width=12, head=34)
            K.text_at(draw, "90°", 560, 420, F(56, True), coral)
            K.text_at(draw, "a quarter turn", 480, 790, F(44, True), ink)
            road = (200, 196, 190)
            draw.rectangle((960, 380, 1600, 500), fill=road)
            draw.rectangle((1480, 380, 1600, 840), fill=road)
            K.draw_dashed(draw, 980, 440, 1530, 440, (255, 255, 255), width=5)
            K.draw_dashed(draw, 1540, 460, 1540, 830, (255, 255, 255), width=5)
            K.draw_house(draw, 1180, 660, 0.55, brand)
            K.text_at(draw, "Your street", 1180, 280, F(36, True), muted)
            p = K.clamp01(progress * 1.2)
            if p < 0.5:
                px, py = K.lerp(1000, 1540, p * 2), 440
            else:
                px, py = 1540, K.lerp(440, 780, (p - 0.5) * 2)
            draw.ellipse((px - 30, py - 30, px + 30, py + 30), fill=coral, outline=(255, 255, 255), width=5)
            draw.arc((1400, 300, 1680, 580), 270, 360, fill=K.BOTH_COLOR, width=8)
            K.draw_arrow(draw, 1680, 430, 1680, 470, K.BOTH_COLOR, width=8, head=26)
            return True
        # watch
        A.draw_block(draw, 170, 420, "turn", 90, 1.3, state="glow")
        K.text_at(draw, "Before", 330, 610, F(36, True), muted)
        A.draw_cat(draw, 330, 730, 0.55, heading=0, shadow=False)
        K.text_at(draw, "After", 580, 610, F(36, True), coral)
        A.draw_cat(draw, 580, 730, 0.55, heading=90, shadow=False)
        map_stage()
        r = K.ease_in_out(K.clamp01((progress - 0.15) * 2))
        c = (1280, 583)
        K.draw_dashed(draw, c[0] + 110, c[1], c[0] + 300, c[1], muted, width=6)
        hd = 90 * r
        grid_cat(c[0], c[1], hd, s=1.0)
        if r > 0.05:
            draw.arc((c[0] - 210, c[1] - 210, c[0] + 210, c[1] + 210), -20, -20 + 120 * r, fill=coral, width=10)
        if r >= 1:
            K.draw_arrow(draw, c[0], c[1] + 130, c[0], c[1] + 240, coral, width=10, head=30)
        return True

    # ---- turning around ----------------------------------------------------------------------
    if visual == "a12-around":
        upto = {"one": 1, "two": 2, "four": 4}[focus]
        labels = ["Start", "1 turn", "2 turns", "3 turns", "4 turns"]
        for i in range(5):
            x = 240 + i * 360
            y = 500
            on = i <= upto
            hot = i == upto
            fill = coral_soft if hot else (panel if on else (246, 242, 236))
            draw.ellipse((x - 130 + 8, y - 130 + 10, x + 130 + 8, y + 130 + 10), fill=K.SHADOW)
            draw.ellipse((x - 130, y - 130, x + 130, y + 130), fill=fill, outline=coral if hot else line,
                         width=6 if hot else 3)
            if on:
                a = K.ease_out_cubic(K.clamp01(progress * 3)) if hot else 1.0
                hd = 90 * (i - 1 + a) if hot and i > 0 else 90 * i
                A.draw_cat(draw, x, y + 10, 0.62, heading=hd, shadow=False)
                ang = math.radians(hd)
                K.draw_arrow(draw, x + math.cos(ang) * 92, y + math.sin(ang) * 92, x + math.cos(ang) * 124,
                             y + math.sin(ang) * 124, A.MOTION_D, width=8, head=20)
            else:
                K.text_at(draw, "?", x, y - 50, F(80, True), line)
            K.text_at(draw, labels[i], x, 660, F(38, True), coral if hot else (ink if on else muted))
            if i < 4:
                ac = A.MOTION_D if i < upto else line
                K.draw_arrow(draw, x + 140, y, x + 220, y, ac, width=8, head=22)
                A.draw_rot(draw, x + 180, y - 50, 1.4, col=ac)
        msg = {"one": ("A corner!", A.MOTION_D), "two": ("Facing the other way!", coral),
               "four": ("Back where he started!", sage)}[focus]
        a = K.stagger(progress, 3, step=0.1, speed=4)
        if a > 0:
            K.pill(draw, cx, 750 + int((1 - a) * 20), msg[0], msg[1], size=40)
        return True

    # ---- small numbers first ------------------------------------------------------------------
    if visual == "a12-small":
        if focus == "rule":
            A.draw_stack(draw, 170, 380, [("flag", None), ("move", 10), ("turn", 90)], 1.2)
            K.pill(draw, 0, 262, "SMART TIP", sage, size=34, left=170)
            K.pill(draw, 0, 720, "Small numbers first!", sage, size=36, left=170)
            map_stage()
            mv = K.ease_in_out(K.clamp01((progress - 0.1) * 1.6))
            grid_cat(930 + 300 * mv, 483, 90 * K.ease_in_out(K.clamp01((progress - 0.75) * 4)), walking=0 < mv < 1)
            K.draw_check(draw, 1700, 380, 36, sage)
            return True
        if focus == "big":
            A.draw_block(draw, 150, 400, "move", 1000, 1.3, state="glow")
            K.pill(draw, 0, 600, "Too big!", K.DANGER, size=38, left=150)
            inner = A.draw_stage(draw, (900, 250, 1800, 860), brand, lit=True)
            z = K.clamp01(progress / 0.4)
            if z < 1:
                px = K.lerp(1100, 1660, K.ease_in_out(z))
                for k in range(4):
                    draw.line((px - 140 - k * 60, 680 + k * 22 - 40, px - 60 - k * 60, 680 + k * 22 - 40),
                              fill=A.MOTION, width=8)
                A.draw_cat(draw, px, 730, 1.0, walk=t)
                K.text_at(draw, "Zoom!", 1260, 420, F(64, True), coral)
            else:
                K.text_at(draw, "Where did he go?", 1350, 440, F(52, True), K.DANGER)
                qmarks(((1150, 580), (1350, 620), (1550, 580)))
            return True
        cards = [("eye", "Easy to watch"), ("check", "Easy to check"), ("plus", "Add more later")]
        for i, (kind, lab) in enumerate(cards):
            a = K.stagger(progress, i, step=0.18, speed=4)
            if a <= 0:
                continue
            x = cx + (i - 1) * 540
            y = 290 + int((1 - a) * 40)
            draw.rounded_rectangle((x - 240, y, x + 240, y + 500), radius=40, fill=sage_soft, outline=sage, width=5)
            if kind == "eye":
                A.draw_eye(draw, x, y + 190, 1.2, A.MOTION)
            elif kind == "check":
                K.draw_check(draw, x, y + 190, 90, sage)
            else:
                draw.ellipse((x - 90, y + 100, x + 90, y + 280), fill=coral)
                draw.rectangle((x - 50, y + 180, x + 50, y + 200), fill=(255, 255, 255))
                draw.rectangle((x - 10, y + 140, x + 10, y + 240), fill=(255, 255, 255))
            K.text_at(draw, lab, x, y + 360, F(46, True), ink)
        return True

    # ---- build Billu's path ---------------------------------------------------------------------
    path_prog = [("flag", None), ("move", 10), ("turn", 90), ("move", 10)]
    path_pts = [L_START, corner, (corner[0], L_START[1] + 300)]
    if visual == "a12-path":
        if focus == "build":
            A.draw_stack(draw, 150, 370, path_prog, 1.1, shown=progress * 5.2 - 0.3)
            map_stage()
            dashed_path(draw, path_pts, line)
            draw_bowl(draw, *bowl_pos, 0.8)
            grid_cat(*L_START, 0)
            return True
        if focus == "go":
            f = progress * 4.6
            x, y, hd, cur, walking, trail = run_program(path_prog, L_START, 0, f)
            done = f >= 4
            states = ["glow" if (i == cur and not done) else "normal" for i in range(4)]
            A.draw_stack(draw, 150, 370, path_prog, 1.1, states=states)
            map_stage(lit=True)
            dashed_path(draw, path_pts, line)
            if len(trail) > 1:
                draw.line(trail, fill=coral, width=8, joint="curve")
            draw_bowl(draw, *bowl_pos, 0.8)
            grid_cat(x, y, hd, walking=walking)
            if done:
                K.draw_heart(draw, bowl_pos[0] + 150, bowl_pos[1] - 120 + bounce, 30, coral)
                K.text_at(draw, "Yum!", bowl_pos[0] + 280, bowl_pos[1] - 110, F(48, True), coral)
            return True
        # order
        for i, (title, col, items, ok) in enumerate((
                ("Wrong order", K.DANGER, [("move", 10), ("turn", 90), ("move", 10)], False),
                ("Right order", sage, path_prog, True))):
            x0 = 130 + i * 890
            draw.rounded_rectangle((x0, 250, x0 + 770, 860), radius=40, fill=K.DANGER_SOFT if not ok else sage_soft,
                                   outline=col, width=5)
            K.text_at(draw, title, x0 + 385, 280, F(48, True), col)
            (K.draw_check if ok else K.draw_cross)(draw, x0 + 700, 310, 34, col)
            if ok:
                A.draw_stack(draw, x0 + 120, 420, items, 1.1)
                K.pill(draw, 0, 432, "1st", coral, size=28, left=x0 + 520)
            else:
                a = K.ease_out_cubic(K.clamp01(progress * 3))
                A.draw_stack(draw, x0 + 120, 420, items, 1.1)
                A.draw_block(draw, x0 + 120, 420 + 3 * BH * 1.1 + 40 + 40 * (1 - a), "flag", None, 1.1)
                K.draw_cross(draw, x0 + 560, 420 + 3 * BH * 1.1 + 80, 30, K.DANGER)
        return True

    # ---- try, watch, change one block -------------------------------------------------------------
    wrong = [("flag", None), ("move", 10), ("turn", 90), ("move", 10)]
    fixed = [("flag", None), ("move", 20), ("turn", 90), ("move", 10)]
    wool_pos = (WOOL_START[0] + 600, WOOL_START[1] + 300 + 100)
    if visual == "a12-debug":
        if focus == "intro":
            cards = [("Try", "flag", A.FLAG_D), ("Watch", "eye", A.MOTION_D), ("Change one block", "change", coral)]
            for i, (lab, kind, col) in enumerate(cards):
                a = K.stagger(progress, i, step=0.22, speed=4)
                if a <= 0:
                    continue
                x = cx + (i - 1) * 540
                y = 270 + int((1 - a) * 40)
                draw.rounded_rectangle((x - 240, y, x + 240, y + 540), radius=40, fill=panel, outline=col, width=5)
                K.pill(draw, 0, y + 24, str(i + 1), col, size=30, left=x - 216)
                if kind == "flag":
                    A.draw_flag(draw, x - 60, y + 220, 4.0)
                elif kind == "eye":
                    A.draw_eye(draw, x, y + 220, 1.3, A.MOTION)
                else:
                    A.draw_block(draw, x - 150, y + 150, "move", 20, 1.0, state="glow")
                    K.text_at(draw, "10 → 20", x, y + 280, F(40, True), coral)
                K.text_at(draw, lab, x, y + 410, F(46, True), ink)
            return True
        if focus == "whyone":
            for i, (title, col, items, states, ok) in enumerate((
                    ("Lots of changes", K.DANGER, [("flag", None), ("move", 50), ("turn", 180), ("move", 30)],
                     ["normal", "glow", "glow", "glow"], False),
                    ("One change", sage, fixed, ["normal", "glow", "normal", "normal"], True))):
                x0 = 130 + i * 890
                draw.rounded_rectangle((x0, 250, x0 + 770, 860), radius=40,
                                       fill=K.DANGER_SOFT if not ok else sage_soft, outline=col, width=5)
                K.text_at(draw, title, x0 + 385, 280, F(48, True), col)
                A.draw_stack(draw, x0 + 150, 400, items, 1.05, states=states)
                if ok:
                    K.draw_check(draw, x0 + 620, 520, 50, sage)
                    K.text_at(draw, "Now you know!", x0 + 385, 770, F(40, True), sage)
                else:
                    qmarks(((x0 + 600, 440), (x0 + 660, 580)))
                    K.text_at(draw, "Which one fixed it?", x0 + 385, 770, F(40, True), K.DANGER)
            return True
        prog = fixed if focus == "change" else wrong
        if focus == "try":
            press = K.clamp01((progress - 0.3) * 3)
            states = ["glow" if press > 0 else "normal"] + ["normal"] * 3
            A.draw_stack(draw, 150, 370, prog, 1.1, states=states)
            map_stage(lit=press > 0)
            draw_wool(draw, *wool_pos, 42)
            grid_cat(*WOOL_START, 0, s=0.65)
            A.draw_cursor(draw, 800, 290, 1.0, press=press)
            return True
        f = progress * 4.6
        x, y, hd, cur, walking, trail = run_program(prog, WOOL_START, 0, f)
        done = f >= 4
        states = ["glow" if (i == cur and not done) else "normal" for i in range(4)]
        if focus == "change" and progress < 0.15:
            states[1] = "glow"
        A.draw_stack(draw, 150, 370, prog, 1.1, states=states)
        if focus == "change":
            K.pill(draw, 0, 760, "10 → 20", coral, size=36, left=150)
        map_stage(lit=True)
        if len(trail) > 1:
            draw.line(trail, fill=coral if focus == "change" else K.DANGER, width=8, joint="curve")
        draw_wool(draw, *wool_pos, 42)
        grid_cat(x, y, hd, walking=walking, s=0.65, mood="confused" if done and focus == "watch" else "happy")
        if done and focus == "watch":
            K.draw_cross(draw, x + 90, y - 20, 30, K.DANGER)
            K.text_at(draw, "Too early!", 1440, 520, F(44, True), K.DANGER)
        if done and focus == "change":
            K.draw_heart(draw, wool_pos[0] - 150, wool_pos[1] - 110 + bounce, 28, coral)
            stars_pts(((wool_pos[0] - 260, wool_pos[1] - 60), (wool_pos[0] + 120, wool_pos[1] - 140)))
        return True

    # ---- go straight puzzle ----------------------------------------------------------------------
    if visual == "a12-straight":
        goal = (L_START[0] + 600 + 110, L_START[1])
        ans = focus == "answer"
        out = K.ease_in_out(K.clamp01((progress - 0.05) * 4)) if ans else 0.0
        close = K.ease_in_out(K.clamp01((progress - 0.3) * 4)) if ans else 0.0
        s = 1.1
        bx, by = 150, 370
        A.draw_block(draw, bx, by, "flag", None, s)
        A.draw_block(draw, bx, by + BH * s, "move", 10, s)
        A.draw_block(draw, bx, by + BH * s * (3 - close), "move", 10, s)
        map_stage(lit=ans)
        if close <= 0:
            tw = A.block_width(draw, "turn", 90, s)
            A.draw_block(draw, bx + 420 * out, by + 2 * BH * s, "turn", 90, s, state="glow" if ans else "normal")
            if ans and out > 0.5:
                K.draw_cross(draw, bx + 420 * out + tw + 40, by + 2 * BH * s + 42, 30, K.DANGER)
        if ans:
            f = K.clamp01((progress - 0.45) / 0.45) * 3
            x, y, hd, cur, walking, trail = run_program([("flag", None), ("move", 10), ("move", 10)], L_START, 0, f)
            if len(trail) > 1:
                draw.line(trail, fill=coral, width=8)
            draw_wool(draw, *goal, 40)
            grid_cat(x, y, 0, walking=walking)
            if f >= 3:
                K.text_at(draw, "Straight!", 1230, 520, F(52, True), sage)
        else:
            dashed_path(draw, path_pts, line)
            dashed_path(draw, [L_START, goal], coral)
            draw_wool(draw, *goal, 40)
            grid_cat(*L_START, 0)
            K.draw_stopwatch(draw, 400, 790, 40, progress, brand)
            qmarks(((1230, 520), (1460, 560)))
        return True

    # ---- checkpoint -------------------------------------------------------------------------------
    if visual == "a12-check":
        if focus == "intro":
            K.shadow_card(draw, (460, 300 + lift, w - 460, 700 + lift), brand, radius=40, accent=sage)
            K.text_at(draw, "PRACTICE CHECK", cx, 380 + lift, F(40, True), sage)
            K.text_at(draw, "Face the other way?", cx, 470 + lift, F(64, True), ink)
            K.draw_check(draw, cx, 620 + lift, 44, sage)
            return True
        if focus == "ask":
            draw.rounded_rectangle((140 + 10, 240 + 12, 1000 + 10, 860 + 12), radius=24, fill=K.SHADOW)
            draw.rounded_rectangle((140, 240, 1000, 860), radius=24, fill=(255, 250, 238))
            for k in range(6):
                draw.line((180, 460 + k * 70, 960, 460 + k * 70), fill=(220, 210, 232), width=2)
            draw.line((240, 250, 240, 850), fill=(240, 170, 170), width=3)
            font = F(50, True)
            for j, ln in enumerate(K.wrap_text("To face the other way, how many 90° turns?", font, 680)):
                draw.text((280, 290 + j * 64), ln, fill=coral, font=font)
            A.draw_block(draw, 300, 560, "turn", 90, 1.1)
            K.text_at(draw, "× ?", 830, 556, F(64, True), coral)
            A.draw_cat(draw, 1200, 520, 0.9, heading=0)
            K.draw_arrow(draw, 1350, 520, 1450, 520, muted, width=10, head=28)
            A.draw_cat(draw, 1610, 520, 0.9, heading=180)
            K.text_at(draw, "?", 1610, 300, F(90, True), K.GOLD)
            K.pill(draw, 1400, 700, "Pause & think!", coral, size=36)
            K.draw_stopwatch(draw, 1760, 300, 40, progress, brand)
            return True
        # answer
        K.text_at(draw, "Two turns!", cx, 240, F(80, True), coral)
        heads = [(0, "Start"), (90, "1 turn"), (180, "2 turns")]
        for i, (hd, lab) in enumerate(heads):
            a = K.stagger(progress, i, step=0.2, speed=4)
            if a <= 0:
                continue
            x = 420 + i * 440
            hot = i == 2
            draw.ellipse((x - 140, 540 - 140, x + 140, 540 + 140), fill=coral_soft if hot else panel,
                         outline=coral if hot else line, width=6 if hot else 3)
            A.draw_cat(draw, x, 550, 0.66, heading=hd, shadow=False)
            K.text_at(draw, lab, x, 700, F(40, True), coral if hot else ink)
            if i < 2:
                K.draw_arrow(draw, x + 155, 540, x + 285, 540, A.MOTION_D, width=10, head=26)
                A.draw_rot(draw, x + 220, 480, 1.6, col=A.MOTION_D)
        b = K.stagger(progress, 3, step=0.2, speed=4)
        if b > 0:
            draw_pie(draw, 1680, 520, 120, 2, (255, 204, 170), line)
            K.text_at(draw, "½ turn", 1680, 670, F(40, True), coral)
            K.pill(draw, 1280, 780, "Facing the other way!", sage, size=36)
        return True

    # ---- recap -------------------------------------------------------------------------------------
    if visual == "a12-recap":
        recap = [("Event on top", A.EVENT_D, "event"), ("Move & turn blocks", A.MOTION_D, "motion"),
                 ("2 turns = other way", coral, "two"), ("Try · Watch · Change one", sage, "twc")]
        if focus in ("r1", "r2", "r3", "r4"):
            n = int(focus[1])
            K.text_at(draw, "Remember", cx, 220, F(50, True), ink)
            for i, (lab, col, kind) in enumerate(recap[:n]):
                active = i == n - 1
                a = K.ease_out_cubic(K.clamp01(progress * 3)) if active else 1.0
                x0 = 110 + i * 435
                y0 = 300 + int((1 - a) * 50) - (int(10 * pulse) if active else 0)
                draw.rounded_rectangle((x0, y0, x0 + 400, y0 + 520), radius=36, fill=coral_soft if active else panel,
                                       outline=col if active else line, width=6 if active else 3)
                ix, iy = x0 + 200, y0 + 200
                if kind == "event":
                    A.draw_flag(draw, ix - 60, iy - 70, 2.4)
                    A.mini_block(draw, ix - 110, iy + 10, 220, "flag", 0.8)
                    A.mini_block(draw, ix - 110, iy + 10 + BH * 0.8, 190, "move", 0.8)
                elif kind == "motion":
                    A.mini_block(draw, ix - 130, iy - 90, 200, "move", 0.8)
                    K.draw_arrow(draw, ix + 90, iy - 60, ix + 160, iy - 60, A.MOTION_D, width=8, head=22)
                    A.mini_block(draw, ix - 130, iy + 30, 200, "turn", 0.8)
                    draw.arc((ix + 80, iy + 30, ix + 160, iy + 110), 270, 90, fill=A.MOTION_D, width=8)
                elif kind == "two":
                    A.draw_cat(draw, ix - 95, iy, 0.55, heading=0, shadow=False)
                    K.draw_arrow(draw, ix - 30, iy + 80, ix + 30, iy + 80, coral, width=8, head=22)
                    A.draw_cat(draw, ix + 95, iy, 0.55, heading=180, shadow=False)
                    K.text_at(draw, "2 ×", ix, iy - 120, F(40, True), coral)
                else:
                    A.draw_flag(draw, ix - 165, iy + 20, 2.2)
                    A.draw_eye(draw, ix - 10, iy, 0.6, A.MOTION)
                    A.mini_block(draw, ix + 66, iy - 26, 100, "move", 0.7)
                font = F(36, True)
                for j, ln in enumerate(K.wrap_text(lab, font, 340)):
                    K.text_at(draw, ln, x0 + 200, y0 + 380 + j * 46, font, ink)
            return True
        if focus == "done":
            A.draw_cat(draw, cx - 260, 480 + bounce, 1.4, walk=t)
            draw_bowl(draw, cx - 20, 520, 1.0)
            K.draw_mascot(draw, int(cx + 320), 440, 110, sage, panel, bounce)
            K.text_at(draw, "Chapter 2 done!", cx, 660, F(68, True), ink)
            K.pill(draw, cx, 760, "Billu walked and turned!", coral, size=36)
            stars_around(320, 600, 6)
            return True
        K.text_at(draw, "Next up: Quiz time!", cx, 380, F(64, True), coral)
        K.text_at(draw, "Tap Finish and let's go, champ!", cx, 500, F(44, True), ink)
        K.draw_arrow(draw, cx - 120, 650, cx + 120 + 20 * pulse, 650, sage, width=16, head=46)
        return True

    return False

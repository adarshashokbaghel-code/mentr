from PIL import Image

im = Image.open("/Users/adarshsinghj/Desktop/champs/public/learn/learn-dino-hold.png")
cw, ch = im.size
ap = im.split()[3].load()

print(f"size {cw}x{ch}")
for y in range(0, ch, 16):
    mx = -1
    for x in range(cw - 1, -1, -1):
        if ap[x, y] > 40:
            mx = x
            break
    # also count solid runs on the right half to see arm vs body separation
    runs = []
    inrun = False
    for x in range(int(cw * 0.55), cw):
        on = ap[x, y] > 40
        if on and not inrun:
            start = x
            inrun = True
        elif not on and inrun:
            runs.append((start, x - 1))
            inrun = False
    if inrun:
        runs.append((start, cw - 1))
    print(f"y={y:4d} ({y/ch:.3f})  right={mx:4d} ({mx/cw:.3f})  runs={runs}")

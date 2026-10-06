import math, random, os
from PIL import Image, ImageDraw, ImageFilter

random.seed(7)
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ICONS = os.path.join(ROOT, "public", "icons")
PHOTOS = os.path.join(ROOT, "public", "photos")
os.makedirs(ICONS, exist_ok=True)
os.makedirs(PHOTOS, exist_ok=True)

BG = (10, 10, 11)
ACCENT = (231, 161, 61)
INK = (243, 239, 232)

def add_grain(img, amount=14):
    w, h = img.size
    noise = Image.effect_noise((w, h), amount).convert("L")
    n = Image.merge("RGB", (noise, noise, noise))
    return Image.blend(img, n, 0.06)

def aperture(draw, cx, cy, r, blades=8, color=INK, width=3):
    pts = []
    for i in range(blades):
        a = (i / blades) * 2 * math.pi
        pts.append((cx + math.cos(a) * r, cy + math.sin(a) * r))
    for i in range(blades):
        x1, y1 = pts[i]
        x2, y2 = pts[(i + 2) % blades]
        draw.line([(x1, y1), (x2, y2)], fill=color, width=width)

def make_icon(size, maskable=False):
    img = Image.new("RGB", (size, size), BG)
    d = ImageDraw.Draw(img)
    # subtle radial glow
    glow = Image.new("RGB", (size, size), BG)
    gd = ImageDraw.Draw(glow)
    gd.ellipse([size*0.2, size*0.2, size*0.8, size*0.8], fill=(40, 30, 14))
    glow = glow.filter(ImageFilter.GaussianBlur(size*0.18))
    img = Image.blend(img, glow, 0.6)
    d = ImageDraw.Draw(img)
    pad = size * (0.30 if maskable else 0.22)
    r = (size - 2 * pad) / 2
    cx = cy = size / 2
    d.ellipse([cx-r, cy-r, cx+r, cy+r], outline=ACCENT, width=max(2, size//64))
    aperture(d, cx, cy, r*0.92, blades=8, color=INK, width=max(2, size//90))
    d.ellipse([cx-r*0.16, cy-r*0.16, cx+r*0.16, cy+r*0.16], fill=ACCENT)
    img = add_grain(img)
    return img

make_icon(192).save(os.path.join(ICONS, "icon-192.png"))
make_icon(512).save(os.path.join(ICONS, "icon-512.png"))
make_icon(512, maskable=True).save(os.path.join(ICONS, "maskable-512.png"))
make_icon(180).save(os.path.join(ICONS, "apple-touch-icon.png"))
# favicon
make_icon(64).save(os.path.join(ROOT, "app", "icon.png"))
print("icons done")

# ---- placeholder "photographs": moody duotone gradients + shapes ----
PALETTES = [
    ((28, 18, 10), (231, 161, 61)),   # amber
    ((10, 14, 28), (122, 162, 255)),  # blue
    ((10, 22, 18), (154, 215, 194)),  # green
    ((26, 12, 10), (255, 138, 92)),   # orange
    ((18, 12, 26), (201, 160, 255)),  # violet
    ((8, 18, 22), (111, 208, 232)),   # cyan
    ((22, 18, 12), (216, 180, 138)),  # sand
    ((24, 20, 8), (255, 209, 102)),   # gold
]

def lerp(a, b, t):
    return tuple(int(a[i] + (b[i]-a[i]) * t) for i in range(3))

def make_photo(idx, dark, light, w=1400, h=1050):
    img = Image.new("RGB", (w, h), dark)
    px = img.load()
    # diagonal gradient
    ang = random.uniform(0, math.pi)
    dx, dy = math.cos(ang), math.sin(ang)
    for y in range(h):
        for x in range(0, w, 2):
            t = ((x*dx + y*dy) / (w*abs(dx) + h*abs(dy) + 1))
            t = max(0.0, min(1.0, t))
            t = t ** 1.3
            c = lerp(dark, light, t*0.85)
            px[x, y] = c
            if x+1 < w:
                px[x+1, y] = c
    d = ImageDraw.Draw(img, "RGBA")
    # soft light orbs
    for _ in range(3):
        rad = random.randint(w//6, w//3)
        ox = random.randint(0, w); oy = random.randint(0, h)
        orb = Image.new("RGBA", (w, h), (0,0,0,0))
        od = ImageDraw.Draw(orb)
        od.ellipse([ox-rad, oy-rad, ox+rad, oy+rad], fill=light+(46,))
        orb = orb.filter(ImageFilter.GaussianBlur(rad*0.5))
        img = Image.alpha_composite(img.convert("RGBA"), orb).convert("RGB")
    d = ImageDraw.Draw(img, "RGBA")
    # a thin geometric line motif
    for _ in range(random.randint(1,2)):
        y0 = random.randint(int(h*0.2), int(h*0.8))
        d.line([(0, y0), (w, y0 + random.randint(-120,120))], fill=INK+(30,), width=2)
    img = img.filter(ImageFilter.GaussianBlur(0.6))
    img = add_grain(img, amount=20)
    # subtle vignette
    vig = Image.new("L", (w, h), 0)
    vd = ImageDraw.Draw(vig)
    vd.ellipse([-w*0.2, -h*0.2, w*1.2, h*1.2], fill=255)
    vig = vig.filter(ImageFilter.GaussianBlur(w*0.15))
    black = Image.new("RGB", (w, h), (0,0,0))
    img = Image.composite(img, black, vig)
    return img

for i, (dark, light) in enumerate(PALETTES, start=1):
    make_photo(i, dark, light).save(os.path.join(PHOTOS, f"p{i}.jpg"), quality=82)
    print(f"photo p{i}.jpg done")

print("ALL ASSETS DONE")

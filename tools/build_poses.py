"""Build lightweight deterministic prototype poses from one supplied mascot still.
Production: replace output with WebP frames from independently authored multi-angle animation.
"""
from pathlib import Path
import math
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
ASSET = ROOT / 'assets'
SOURCE = ASSET / 'mascot-source.png'
if not SOURCE.exists():
    raise RuntimeError('Provide a source mascot still at assets/mascot-source.png')
im = Image.open(SOURCE).convert('RGBA')
w, h = im.size

# Warp head and gaze locality, keep chest/scarf approximately anchored.
rgba=np.asarray(im).copy()
xx,yy=np.meshgrid(np.arange(w,dtype=np.float32),np.arange(h,dtype=np.float32))
# Note: we are deliberately not pretending this is true video-based 3D rotation.
head=np.exp(-(((xx - 342)/310)**4 + ((yy - 165)/240)**4))
# eye centres measured from this source crop
left_eye=np.exp(-(((xx-258)/55)**2+((yy-95)/39)**2))
right_eye=np.exp(-(((xx-372)/55)**2+((yy-98)/39)**2))
eyes=np.clip(left_eye+right_eye,0,1)
for row in range(5):
    for col in range(5):
        dx=(col-2)/2
        dy=(row-2)/2
        mapx=xx - (dx*18*head + dx*7*eyes)
        mapy=yy - (dy*13*head + dy*5*eyes)
        frame=cv2.remap(rgba,mapx,mapy,cv2.INTER_CUBIC,borderMode=cv2.BORDER_CONSTANT,borderValue=(0,0,0,0))
        Image.fromarray(frame,'RGBA').save(ASSET/'poses'/f'pose-{row}-{col}.webp', 'WEBP', quality=86, method=3)

# Thumbnail preview background matches design system, not a claim of identical source.
back=Image.new('RGB',(1200,630),(19,43,65))
poster=im.resize((835,583),Image.Resampling.LANCZOS)
back.paste(poster,(390,55),poster)
back.save(ASSET/'og-preview.jpg',quality=88,optimize=True)
print('Created',len(list((ASSET/'poses').glob('*.webp'))),'pose frames')

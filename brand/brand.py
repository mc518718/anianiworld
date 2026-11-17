from PIL import Image, ImageDraw, ImageFont
D='/usr/share/fonts/opentype/inter/'
def font(w,s): return ImageFont.truetype(D+f'Inter-{w}.otf', int(s))
BG=(14,15,20); TEXT=(242,241,236); Y=(255,207,63); C=(255,107,94); MUTE=(154,159,173); PANEL=(23,25,34); INK=(20,19,12)

def mark(size):
    """The eared screen with 'aa', on a transparent square of the given size (mark fills ~60% width, as in the logo)."""
    K=3; S=size*K
    im=Image.new('RGBA',(S,S),(0,0,0,0)); d=ImageDraw.Draw(im)
    d.polygon([(S*0.24,S*0.42),(S*0.27,S*0.17),(S*0.47,S*0.36)],fill=Y)
    d.polygon([(S*0.76,S*0.42),(S*0.73,S*0.17),(S*0.53,S*0.36)],fill=Y)
    d.polygon([(S*0.285,S*0.36),(S*0.30,S*0.245),(S*0.39,S*0.345)],fill=C)
    d.polygon([(S*0.715,S*0.36),(S*0.70,S*0.245),(S*0.61,S*0.345)],fill=C)
    d.rounded_rectangle((int(S*0.2),int(S*0.33),int(S*0.8),int(S*0.8)),radius=int(S*0.13),fill=Y)
    f=font('ExtraBold',S*0.40); w=d.textlength('a',font=f); off=int(w*0.80); bb=d.textbbox((0,0),'a',font=f)
    x=(S-(w+off))/2; y=S*0.565-(bb[3]-bb[1])/2-bb[1]
    d.text((x+off,y),'a',font=f,fill=C)
    d.text((x,y),'a',font=f,fill=INK,stroke_width=int(S*0.010),stroke_fill=Y)
    return im.resize((size,size),Image.LANCZOS)

def wordmark(d,x,y,size,centre_w=None):
    f=font('ExtraBold',size); parts=(('ani',TEXT),('ani',Y),('world',TEXT))
    if centre_w: x=(centre_w-sum(d.textlength(p,font=f) for p,_ in parts))/2
    for p,col in parts:
        d.text((x,y),p,font=f,fill=col); x+=d.textlength(p,font=f)

def pills(d,x,y,centre_w=None):
    f=font('Bold',28); items=(('Vietsub',Y,INK),('Lồng tiếng',C,INK),('anianiworld.com',PANEL,TEXT))
    ws=[d.textlength(l,font=f)+44 for l,_,_ in items]
    if centre_w: x=(centre_w-sum(ws)-32)/2
    for (label,bg,fg),w in zip(items,ws):
        d.rounded_rectangle((x,y,x+w,y+58),radius=29,fill=bg,outline=(69,75,95) if bg==PANEL else None,width=2)
        d.text((x+22,y+11),label,font=f,fill=fg); x+=w+16

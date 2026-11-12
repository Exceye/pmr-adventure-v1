import { showLeaderboard } from "./leaderboard.js";

onerror=(m,s,l)=>{const e=document.getElementById('er');e.style.display='block';e.textContent='Error: '+m+' (baris '+l+')'};
const $=i=>document.getElementById(i),cv=$('c'),g=cv.getContext('2d'),buf=document.createElement('canvas'),b=buf.getContext('2d');
let W,H,D,S,LW,LH;
function rs(){D=devicePixelRatio||1;W=innerWidth;H=innerHeight;cv.width=W*D;cv.height=H*D;S=Math.max(2,Math.round(Math.min(W,H)/190));LW=Math.ceil(W/S);LH=Math.ceil(H/S);buf.width=LW;buf.height=LH}
addEventListener('resize',rs);rs();
/* ---------- helper gambar pixel ---------- */
let X=b;
const B=(c,x,y,w,h)=>{X.fillStyle=c;X.fillRect(x,y,w,h)};
const R=(x,y,w,h)=>({x,y,w,h}),hit=(a,c)=>a.x<c.x+c.w&&a.x+a.w>c.x&&a.y<c.y+c.h&&a.y+a.h>c.y;
function draw(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;const o=X;X=c.getContext('2d');fn();X=o;return c}
const dk=(c,a)=>{const n=parseInt(c.slice(1),16);return'rgb('+[n>>16,n>>8&255,n&255].map(v=>Math.round(v*a)).join()+')'};
const circ=(cx,cy,rx,ry,c)=>{for(let y=-ry;y<=ry;y++){const w=Math.round(rx*Math.sqrt(Math.max(0,1-y*y/(ry*ry+.01))));B(c,cx-w,cy+y,w*2,1)}};
/* ---------- karakter ---------- */
function chr(gd,dir,f,p){return draw(16,24,()=>{
 if(dir==3){X.translate(16,0);X.scale(-1,1)}
 const fm=gd=='f',A=f==1?1:0,Q=f==3?1:0,fl=f==1?-1:f==3?1:0,sh=p.shirt,vs=p.vest,cl=p.cl,hr=p.hair,sk=p.skin,sd=dir==1||dir==3;
 if(sd){B(cl,6+fl,18,3,4);B(cl,8-fl,18,3,4);if(fm)B(cl,4,17,9,5);B('#e8e8ee',6+fl,22,4,2);B('#e8e8ee',8-fl,22,4,2);
  B(sh,5,11,7,7);B(vs,5,12,6,6);if(p.pt){B('#fff',8,13,3,3);B(vs,9,13,1,3);B(vs,8,14,3,1)}
  B(sh,6+fl,12,3,5);B(sk,6+fl,17,3,1);
  B(sk,6,4,7,7);if(fm){B(hr,3,1,10,4);B(hr,3,4,5,9);B(hr,6,3,3,2)}else{B(hr,4,1,9,4);B(hr,4,4,3,5);B(hr,10,3,3,2)}
  B('#1b1b25',10,7,2,2);B('#f0a6a0',9,9,1,1)}
 else{B(cl,4,18,4,4-A);B(cl,8,18,4,4-Q);if(fm)B(cl,3,17,10,5);B('#e8e8ee',4,22-A,4,2);B('#e8e8ee',8,22-Q,4,2);
  B(sh,2,12+Q,2,5);B(sh,12,12+A,2,5);B(sk,2,17+Q,2,1);B(sk,12,17+A,2,1);B(sh,4,11,8,7);B(vs,4,12,8,6);
  if(dir==0){B(sh,6,11,4,2);if(p.pt){B('#fff',9,13,3,3);B(vs,10,13,1,3);B(vs,9,14,3,1)}
   B(sk,4,4,8,7);if(fm){B(hr,3,1,10,4);B(hr,3,4,2,9);B(hr,11,4,2,9);B(hr,3,11,10,2)}else{B(hr,3,1,10,4);B(hr,3,4,1,3);B(hr,12,4,1,3);B(hr,4,4,3,1);B(hr,9,4,3,1)}
   B('#1b1b25',5,7,2,2);B('#1b1b25',9,7,2,2);B('#fff',5,7,1,1);B('#fff',9,7,1,1);B('#f0a6a0',4,9,1,1);B('#f0a6a0',11,9,1,1)}
  else{if(p.pt){B('#fff',5,12,6,5);B(vs,7,13,2,4);B(vs,6,14,4,2)}
   if(fm){B(hr,3,1,10,12)}else{B(hr,3,1,10,9);B(sk,5,10,6,1)}}}})}
const PAL={m:{hair:'#2b1c18',skin:'#f3c99f',shirt:'#f4f4f4',vest:'#c8283a',cl:'#243060',pt:1},f:{hair:'#262f5e',skin:'#f3c99f',shirt:'#f4f4f4',vest:'#c8283a',cl:'#243060',pt:1}};
const SP={};for(const q of'mf')SP[q]=[0,1,2,3].map(d=>[0,1,2,3].map(f=>chr(q,d,f,PAL[q])));
const NPCS=[['Bu Sari','f','#6b3b5a','#e8a9c0','#6a4a7a','#e8b890'],['Pak Budi','m','#2a2a2a','#6fa0d8','#5a4a3a','#d9a373'],['Mbak Rina','f','#2e7d5a','#f2e6a0','#3a5a4a','#f0c8a0'],
 ['Pak Joko','m','#8a8a8a','#8fbf6a','#4a3a2a','#c8956a'],['Nenek Ani','f','#b8b8c8','#c99ad8','#5a4a6a','#e0b088'],['Dik Rafi','m','#4a2a1a','#f0a050','#2a4a8a','#f0c090']]
 .map(n=>({n:n[0],img:chr(n[1],0,0,{hair:n[2],shirt:n[3],vest:n[3],cl:n[4],skin:n[5],pt:0})}));
/* ---------- sprite dunia ---------- */
function houseSpr(rc,wc){return draw(80,72,()=>{
 B('rgba(0,0,0,.25)',6,66,72,5);B('#7a7a84',50,4,8,18);B('#5f5f69',50,4,8,3);
 B(wc,6,32,68,36);B('rgba(0,0,0,.1)',6,56,68,4);B('#8d8d96',6,62,68,6);B('#74747e',6,62,68,1);
 for(let r=0;r<32;r++){const w=Math.round(4+r*2.35);B(r%5==4?dk(rc,.78):rc,40-w/2,2+r,w,1);if(r%5!=4)B(dk(rc,1.12),40-w/2,2+r,Math.min(w,3),1)}
 B(dk(rc,.55),0,33,80,3);B('rgba(0,0,0,.2)',6,36,68,3);
 B('#5b3a22',35,16,10,10);B('#8fd0f0',36,17,8,8);B('#5b3a22',39,17,2,8);
 B('#3a2418',33,43,14,25);B('#7b4a26',34,44,12,24);B('#5b3a22',39,44,2,24);B('#ffd23f',43,56,2,2);
 for(const x of[12,54]){B('#5b3a22',x,40,14,13);B('#8fd0f0',x+1,41,12,11);B('#5b3a22',x+6,41,2,11);B('#5b3a22',x+1,46,12,1);B('#d6f1ff',x+2,42,3,2);B('#7b4a26',x,54,14,4);B('#ff6b8a',x+2,53,2,2);B('#ffd23f',x+6,53,2,2);B('#fff',x+10,53,2,2)}
 B('#9a9aa4',31,66,18,3);B('#fff',37,33,6,6);B('#d62828',39,34,2,4);B('#d62828',38,35,4,2)})}
function mansionSpr(){return draw(224,128,()=>{
 B('rgba(0,0,0,.25)',8,118,212,8);const nv='#2f3d6b';
 B('#e3d9c4',8,56,208,64);B('#ece3d0',64,42,96,78);B('rgba(0,0,0,.08)',8,112,208,8);
 for(const x of[4,144]){B(nv,x,30,76,28);for(let y=34;y<56;y+=4)B('#27345c',x,y,76,1);B('#1f2a50',x,56,76,3)}
 for(let r=0;r<38;r++){const w=Math.round(40+r*2.95);B(r%4==3?'#27345c':'#33427a',112-w/2,4+r,w,1)}
 B('#1f2a50',0,42,224,0);B('#1f2a50',62,42,100,4);B('#7a7a84',24,18,8,14);B('#7a7a84',192,18,8,14);
 B('#fff',107,16,10,10);B('#d62828',110,17,4,8);B('#d62828',108,19,8,4);
 for(const x of[80,104,128]){B('#fff7e8',x,52,16,18);B('#8fd0f0',x+2,54,12,14);B('#fff7e8',x+7,54,2,14)}
 for(const x of[16,40,168,192]){B('#fff7e8',x,70,16,20);B('#8fd0f0',x+2,72,12,16);B('#fff7e8',x+7,72,2,16)}
 for(const x of[76,140]){B('#fff7e8',x,86,16,22);B('#8fd0f0',x+2,88,12,18);B('#fff7e8',x+7,88,2,18)}
 B('#bdb4a0',70,76,84,3);for(let x=72;x<154;x+=5)B('#d8d0be',x,70,2,6);
 B('#cfc7b3',94,78,5,40);B('#cfc7b3',125,78,5,40);
 B('#3a2418',98,86,28,34);B('#7b4a26',100,88,11,32);B('#7b4a26',113,88,11,32);B('#ffd23f',108,104,2,3);B('#ffd23f',114,104,2,3);B('#8fd0f0',102,82,20,4);
 B('#9a9aa4',90,118,44,5);B('#c8283a',103,118,18,10)})}
function treeSpr(){return draw(32,44,()=>{circ(16,41,11,3,'rgba(0,0,0,.25)');B('#6b4423',13,28,6,14);B('#54351b',13,28,2,14);
 circ(16,20,15,16,'#2b7a3a');circ(15,17,12,12,'#349a48');circ(11,12,7,6,'#4fb85a');B('#2b7a3a',20,26,6,2)})}
function pineSpr(){return draw(24,40,()=>{circ(12,37,8,2,'rgba(0,0,0,.25)');B('#6b4423',10,30,4,8);
 for(let i=0;i<3;i++){const y=4+i*9,w=7+i*3;for(let r=0;r<14;r++){const ww=Math.round(2+r*(w-2)/13);B(r%4==3?'#1f5e2e':'#2b7a3a',12-ww,y+r,ww*2,1)}}})}
function fountainSpr(){return draw(32,34,()=>{circ(16,28,15,5,'rgba(0,0,0,.2)');circ(16,24,15,7,'#9a9aa4');circ(16,23,13,6,'#c8c8d0');circ(16,23,11,5,'#3a9be0');circ(14,22,5,2,'#8fd4f5');
 B('#9a9aa4',14,10,4,12);circ(16,10,6,2,'#c8c8d0');circ(16,9,4,1,'#6cc0f0');B('#8fd4f5',15,2,2,8);B('#8fd4f5',11,6,1,5);B('#8fd4f5',20,6,1,5)})}
function wellSpr(){return draw(24,28,()=>{circ(12,25,10,3,'rgba(0,0,0,.2)');B('#8d8d96',3,14,18,11);B('#6e6e78',3,14,18,2);B('#3a8fd1',5,16,14,3);
 B('#6b4423',3,4,2,12);B('#6b4423',19,4,2,12);B('#c8452f',1,0,22,5);B('#a8321f',1,4,22,2)})}
function lampSpr(){return draw(8,28,()=>{B('#3a3a44',3,10,2,17);B('#3a3a44',1,26,6,2);B('#3a3a44',0,2,8,2);B('#ffd23f',1,4,6,7);B('#fff3a0',3,5,2,4)})}
function bushSpr(){return draw(18,12,()=>{circ(9,6,8,5,'#2b7a3a');circ(8,5,6,4,'#3c9a48');B('#ff6b8a',4,3,2,2);B('#fff',11,5,2,2)})}
/* ---------- tata letak kampung ---------- */
const HS=[[72,24,'#c8452f','#efe3c8'],[616,24,'#e07a2f','#e8dcc0'],[168,140,'#3f6fc4','#f0e4cc'],[520,140,'#8a4fb8','#e8dcc0'],[136,300,'#e0a62a','#efe3c8'],[552,300,'#8a5232','#f0e4cc']];
const PATHS=[R(352,144,64,396),R(64,208,640,32),R(64,400,640,32),R(104,92,16,116),R(648,92,16,116),R(168,368,16,32),R(584,368,16,32)];
const MX=272,MY=16,GARD=R(600,452,120,56),PEN=R(48,448,120,64);
const OUT={w:768,h:576,bx:[44,724,24,520],solids:[],objs:[],doors:[],id:'out'};
const ospr=(img,x,y,ox,oy,by)=>({y:by,d:(cx,cy)=>b.drawImage(img,Math.round(x-cx),Math.round(y-cy))});
const mans=mansionSpr(),fnt=fountainSpr(),wl=wellSpr(),lp=lampSpr(),bsh=bushSpr(),T1=treeSpr(),T2=pineSpr();
OUT.solids.push(R(MX+4,0,216,MY+120),R(368+2,182,28,14),R(686,176,20,10),GARD,PEN,R(344,148,6,8),R(426,148,6,8));
OUT.objs.push(ospr(mans,MX,MY,0,0,MY+120),ospr(fnt,368,168,0,0,200),ospr(wl,684,160,0,0,186),ospr(lp,342,128,0,0,156),ospr(lp,424,128,0,0,156));
OUT.doors.push({r:R(MX+98,MY+118,28,6),to:6,sx:MX+112,sy:MY+138});
HS.forEach((h,i)=>{const sp=houseSpr(h[2],h[3]);OUT.solids.push(R(h[0]+2,h[1],76,68));OUT.objs.push(ospr(sp,h[0],h[1],0,0,h[1]+68));
 OUT.doors.push({r:R(h[0]+33,h[1]+66,14,6),to:i,sx:h[0]+40,sy:h[1]+84})});
{let s=5;const rn=()=>(s=s*16807%2147483647)/2147483647,blk=[...OUT.solids,GARD,PEN,...PATHS,R(MX,MY,224,150),R(360,160,48,50)].map(r=>R(r.x-18,r.y-24,r.w+36,r.h+48));
 for(let i=0;i<260&&OUT.objs.length<75;i++){const x=40+rn()*690,y=40+rn()*480,t=R(x-16,y-34,32,40);if(blk.some(r=>hit(t,r)))continue;
  const pine=rn()<.3;OUT.solids.push(R(x-4,y-5,8,5));OUT.objs.push(ospr(pine?T2:T1,x-(pine?12:16),y-(pine?38:42),0,0,y));blk.push(R(x-24,y-30,48,36))}
 for(let y=60;y<540;y+=46){OUT.objs.push(ospr(T1,-4,y-42,0,0,y),ospr(T1,740,y-42,0,0,y+10))}
 OUT.objs.sort((a,c)=>a.y-c.y);
 const free=(x,y)=>!PATHS.some(p=>x>=p.x-4&&x<p.x+p.w+4&&y>=p.y-4&&y<p.y+p.h+4)&&!OUT.solids.some(r=>x>=r.x-4&&x<r.x+r.w+4&&y>=r.y-4&&y<r.y+r.h+4);
 OUT.layer=draw(768,576,()=>{
  for(let y=0;y<576;y+=16)for(let x=0;x<768;x+=16)B(((x+y)>>4)%2?'#62a84c':'#5ba046',x,y,16,16);
  for(let i=0;i<650;i++){const x=rn()*768|0,y=rn()*576|0;B('#4c8f3c',x,y,2,1);B('#4c8f3c',x+1,y-1,1,1)}
  B('#7a5a3a',0,546,768,6);B('#3a8fd1',0,552,768,24);for(let i=0;i<40;i++)B('#7cc4ec',rn()*760|0,556+(rn()*16|0),8,1);
  PATHS.forEach(p=>B('#b8934f',p.x-1,p.y-1,p.w+2,p.h+2));PATHS.forEach(p=>B('#dcbd7e',p.x,p.y,p.w,p.h));
  for(let i=0;i<900;i++){const p=PATHS[rn()*PATHS.length|0];B('#c9a566',p.x+(rn()*p.w|0),p.y+(rn()*p.h|0),2,1)}
  for(let i=0;i<260;i++){const x=rn()*740+14|0,y=rn()*510+14|0;if(free(x,y)){B(['#fff','#ffd166','#ff8fab','#c9a0ff'][i%4],x,y,2,2);B('#3d8f35',x,y+2,1,2)}}
  B('#7a4f2a',GARD.x,GARD.y,GARD.w,GARD.h);for(let r=0;r<4;r++)for(let c=0;c<10;c++){B('#3f9a38',GARD.x+6+c*11,GARD.y+6+r*12,7,6);B('#ffb02e',GARD.x+8+c*11,GARD.y+4+r*12,3,3)}
  B('#6fae52',PEN.x,PEN.y,PEN.w,PEN.h);for(let x=PEN.x;x<PEN.x+PEN.w;x+=8){B('#8a5a2b',x,PEN.y,3,10);B('#8a5a2b',x,PEN.y+PEN.h-10,3,10)}
  for(let y=PEN.y;y<PEN.y+PEN.h;y+=8){B('#8a5a2b',PEN.x,y,3,10);B('#8a5a2b',PEN.x+PEN.w-3,y,3,10)}B('#a8723a',PEN.x,PEN.y+3,PEN.w,2);B('#a8723a',PEN.x,PEN.y+PEN.h-6,PEN.w,2);
  B('#c8283a',60,462,34,20);B('#8a1f2a',56,458,42,6);B('#3a2418',72,470,10,12);
  for(const c of[[110,486],[126,476],[100,500]]){B('#fff',c[0],c[1],7,5);B('#fff',c[0]+5,c[1]-3,3,4);B('#e63946',c[0]+6,c[1]-5,2,2);B('#ffb02e',c[0]+8,c[1]-2,2,1)}
  const post=(x,y)=>{B('#6b4423',x,y,4,14);B('#a8723a',x,y,2,14);B('#c98f52',x,y,4,2)};
  for(let x=32;x<736;x+=16){post(x,8);if(x<344||x>=424)post(x,524)}
  for(let y=24;y<524;y+=16){post(32,y);post(732,y)}
  B('#8a5a2b',32,12,708,3);B('#8a5a2b',32,18,708,3);B('#8a5a2b',32,528,312,3);B('#8a5a2b',32,534,312,3);B('#8a5a2b',424,528,316,3);B('#8a5a2b',424,534,316,3);
  B('#8a5a2b',34,8,3,520);B('#8a5a2b',733,8,3,520);
  for(const x of[340,414]){B('#8d8d96',x,508,14,32);B('#6e6e78',x,508,14,3);B('#ffd23f',x+4,500,6,8)}
  B('#a8723a',368,552,32,24);for(let y=552;y<576;y+=4)B('#7b4a26',368,y,32,1);
  for(const bs of[[56,150],[700,300],[250,500],[480,500],[40,330],[690,430],[470,120]])if(free(bs[0],bs[1]))X.drawImage(bsh,bs[0],bs[1])})}
/* ---------- interior ---------- */
const frame=(w,h,gp)=>{B('#a8723a',0,0,w,8);B('#8a5a2b',0,6,w,2);B('#a8723a',0,0,8,h);B('#a8723a',w-8,0,8,h);B('#8a5a2b',7,8,1,h);B('#8a5a2b',w-9,8,1,h);
 for(const s of[[0,gp[0]],[gp[1],w]]){B('#a8723a',s[0],h-16,s[1]-s[0],16);B('#7b4a26',s[0],h-4,s[1]-s[0],4);B('#c98f52',s[0],h-16,s[1]-s[0],2)}};
const floor=(w,h,y0,c1,c2)=>{for(let y=y0;y<h;y+=8){const o=((y-y0)/8)%2;B(o?c2:c1,0,y,w,8);B('rgba(0,0,0,.12)',0,y,w,1);for(let x=o?24:4;x<w;x+=40)B('rgba(0,0,0,.12)',x,y,1,8)}};
const wall=(w,y0)=>{B('#f1e0c2',0,0,w,y0);B('#e6d3b0',8,8,w-16,4);B('#8a5a2b',8,y0-8,w-16,8);B('#a8723a',8,y0-8,w-16,2)};
const win=(x,y,w,h)=>{B('#5b3a22',x,y,w,h);B('#8fd0f0',x+2,y+2,w-4,h-4);B('#4da05a',x+2,y+h-8,w-4,6);B('#6dbb74',x+4,y+h-10,10,4);B('#5b3a22',x+w/2-1,y,2,h);B('#5b3a22',x,y+h/2-1,w,2);B('#d6f1ff',x+4,y+4,4,2)};
const plant=(x,y)=>{B('rgba(0,0,0,.2)',x+1,y+20,14,2);B('#d8d8e0',x+3,y+14,10,8);B('#b0b0ba',x+3,y+14,10,2);B('#6b4423',x+4,y+14,8,2);circ(x+8,y+8,7,6,'#3a8f3a');circ(x+6,y+6,4,4,'#4fb85a');B('#2b7a3a',x+11,y+11,3,3)};
const bed=(x,y,c)=>{B('#7b4a26',x,y,56,50);B('#5b3a22',x,y+46,56,4);B('#f4f4f4',x+3,y+3,50,14);B('#dcdce4',x+3,y+14,50,3);B(c,x+3,y+18,50,28);B(dk(c,.75),x+3,y+18,50,3)};
const table=(x,y,w,h)=>{B('rgba(0,0,0,.18)',x+2,y+h,w,4);B('#6b4423',x+2,y+h-6,4,6);B('#6b4423',x+w-6,y+h-6,4,6);B('#a8723a',x,y,w,h-8);B('#c98f52',x,y,w,2);B('#7b4a26',x,y+h-8,w,4)};
const shelf=(x,y,w,h)=>{B('#7b4a26',x,y,w,h);B('#5b3a22',x+2,y+2,w-4,h-4);const cs=['#c8283a','#3f6fc4','#e0a62a','#4da05a','#8a4fb8'];for(let r=0;r<Math.floor((h-4)/12);r++){for(let k=0;k<(w-6)/3;k++)B(cs[(k+r*2)%5],x+3+k*3,y+4+r*12,2,9);B('#7b4a26',x+2,y+13+r*12,w-4,2)}};
const rug=(x,y,w,h,c,bc)=>{B(bc,x,y,w,h);B(c,x+3,y+3,w-6,h-6);B(bc,x+6,y+6,w-12,1);B(bc,x+6,y+h-7,w-12,1)};
const lantern=(x,y)=>{B('#3a3a44',x+3,y,2,4);B('#ffd23f',x,y+4,8,10);B('#fff3a0',x+2,y+6,4,6);B('#3a3a44',x,y+14,8,2)};
const painting=(x,y,w,h)=>{B('#7b4a26',x,y,w,h);B('#9ed0f0',x+2,y+2,w-4,h-4);for(let r=0;r<h/3;r++)B('#7a8fb0',x+w/2-r-1,y+h-8-r,r*2+2,1);B('#4da05a',x+2,y+h-8,w-4,6)};
function houseRoom(i){const w=320,h=208,L=draw(w,h,()=>{floor(w,h,40,'#c99a5b','#c08f50');wall(w,48);win(136,12,48,26);painting(222,14,26,20);
 B('#7b4a26',16,16,70,3);B('#cfd2d8',16,20,70,3);B('#f1e0c2',18,10,6,8);B('#c8283a',28,10,6,8);plant(64,2);
 B('#8a5a2b',16,32,64,22);B('#cfd2d8',16,30,64,6);B('#7d8794',22,31,18,4);B('#2d2d35',52,31,20,4);B('#8a5a2b',20,40,26,1);B('#8a5a2b',50,40,26,1);
 B('#aeb7c6',84,18,20,36);B('#8e98a8',84,32,20,1);B('#6b7584',100,24,2,6);B('#6b7584',100,36,2,8);
 frame(w,h,[144,176]);
 bed(240,48,['#3f6fc4','#c8283a','#4da05a','#8a4fb8','#e0a62a','#e07a2f'][i]);B('#a8723a',222,46,16,14);B('#7b4a26',222,56,16,4);plant(222,28);
 shelf(14,88,24,40);plant(16,160);plant(284,160);rug(108,100,104,60,'#3f6fc4','#2a4a8a');table(128,108,64,32);B('#e8e8f0',152,102,10,8);B('#fff',154,98,2,2);B('#ff8fab',158,98,2,2);
 table(112,122,12,12);table(196,122,12,12);B('#a8723a',148,184,24,8)}),
 sol=[R(0,0,w,48),R(0,0,8,h),R(w-8,0,8,h),R(0,192,144,16),R(176,192,144,16),R(16,48,64,6),R(84,48,20,6),R(240,48,56,48),R(222,48,16,12),R(14,100,24,28),R(128,112,64,28),R(112,126,12,10),R(196,126,12,10),R(18,178,12,6),R(286,178,12,6),R(62,48,12,4),R(226,48,12,2)];
 const n=NPCS[i],np={x:160,y:92};sol.push(R(154,88,12,5));
 return{w,h,layer:L,solids:sol,bx:[10,w-10,30,208],spawn:[160,178],doors:[{r:R(144,190,32,16),to:'out'}],npc:np,n,
  objs:[{y:np.y,d:(cx,cy)=>{circ(Math.round(np.x-cx),Math.round(np.y-cy),6,2,'rgba(0,0,0,.25)');b.drawImage(n.img,Math.round(np.x-8-cx),Math.round(np.y-23-cy));
   const bo=Math.round(Math.sin(Date.now()/250)*2),bx=Math.round(np.x-cx),by=Math.round(np.y-cy-32+bo);circ(bx,by,5,5,'#ffd23f');B('#222',bx-1,by-3,2,4);B('#222',bx-1,by+2,2,1)}}]}}
function mansionRoom(){const w=448,h=288,L=draw(w,h,()=>{floor(w,h,40,'#c99a5b','#c08f50');wall(w,48);win(80,12,40,24);win(328,12,40,24);painting(200,10,48,28);lantern(176,16);lantern(264,16);
 rug(144,64,160,118,'#b8202e','#d9a82a');rug(208,176,32,100,'#b8202e','#d9a82a');
 B('rgba(0,0,0,.25)',190,138,68,4);B('#9a9aa4',192,106,64,32);B('#c8c8d0',192,106,64,6);B('#b0b0ba',196,112,56,22);B('#8d8d96',192,134,64,4);
 frame(w,h,[208,240]);
 bed(24,52,'#c8283a');B('#a8723a',84,56,16,14);B('#ffd23f',88,46,8,8);B('#fff3a0',89,47,6,6);
 B('#e6d3b0',330,50,64,26);B('#cbbd9a',330,60,64,16);B('#e6d3b0',326,56,8,20);B('#e6d3b0',390,56,8,20);B('#8a5a2b',340,82,44,16);B('#a8723a',340,82,44,3);
 B('#6b4423',404,60,30,16);B('#2d2d35',408,38,22,22);B('#4a90c8',410,40,18,16);
 plant(146,64);plant(286,64);shelf(24,138,26,36);shelf(398,150,26,36);table(56,210,64,32);table(44,222,12,12);table(120,222,12,12);plant(22,246);plant(408,246);plant(150,236);plant(282,236)}),
 sol=[R(0,0,w,48),R(0,0,8,h),R(w-8,0,8,h),R(0,272,208,16),R(240,272,208,16),R(24,52,56,44),R(84,56,16,12),R(330,50,64,26),R(404,58,30,18),R(148,78,12,8),R(288,78,12,8),R(24,142,26,30),R(398,154,26,30),R(56,218,64,24),R(44,230,12,8),R(120,230,12,8),R(24,260,12,6),R(410,260,12,6),R(152,250,12,6),R(284,250,12,6),R(190,114,68,22)];
 const cp={x:224,y:130};
 return{w,h,layer:L,solids:sol,bx:[10,w-10,30,288],spawn:[224,244],doors:[{r:R(208,262,32,16),to:'out'}],chest:cp,
  objs:[{y:cp.y,d:(cx,cy)=>{const x=Math.round(cp.x-cx),y=Math.round(cp.y-cy),t=Date.now();X=b;
   if(opened){const a=.18+.08*Math.sin(t/200);circ(x,y-16,34,22,`rgba(255,235,120,${a})`);B('#a8202e',x-11,y-23,22,5);B('#3a0d0a',x-10,y-18,20,4);B('#fff3a0',x-9,y-16,18,3)}else B('#a8202e',x-11,y-18,22,8);
   B('#5b1a12',x-11,y-11,22,12);B('#c8283a',x-10,y-10,20,10);B('#ffd23f',x-10,y-10,3,10);B('#ffd23f',x+7,y-10,3,10);if(!opened){B('#ffd23f',x-11,y-18,22,2);B('#ffd23f',x-5,y-18,3,8);B('#ffd23f',x+3,y-18,3,8)}B('#ffd23f',x-2,y-13,4,5);B('#5b1a12',x-1,y-11,2,2);
   if(opened)for(let k=0;k<6;k++){const an=t/500+k*1.05,sx=Math.round(x+Math.cos(an)*(16+k*2)),sy=Math.round(y-18+Math.sin(an*1.3)*(12+k)),on=Math.floor(t/150+k)%2;B('#fff6a0',sx,sy,2,2);if(on){B('#fff6a0',sx-1,sy,4,1);B('#fff6a0',sx,sy-1,2,4)}}}}]}}
/* ---------- game ---------- */
const P={x:384,y:300,d:0,st:0};
const QUESTIONS=[
 {type:'essay',q:'Apa manfaat wedang bagi tubuh?',answer:'Menghangatkan tubuh dan memberikan rasa nyaman.',groups:[['menghangatkan'],['tubuh'],['nyaman']]},
 {type:'essay',q:'Sebutkan 3 ciri-ciri tanaman sereh!',answer:'Daunnya panjang dan runcing, batangnya putih kehijauan, serta memiliki aroma khas seperti lemon.',groups:[['daun','daunnya'],['batang'],['aroma','bau','lemon']]},
 {type:'essay',q:'Apa saja kandungan yang terdapat pada daun salam?',answer:'Minyak atsiri, tanin, flavonoid, kalsium, dan zat besi.',groups:[['minyak atsiri','minyak'],['tanin','flavonoid'],['kalsium','zat besi','besi']] },
 {type:'mc',q:'Apa ciri khas tanaman sereh?',options:['Memiliki daun lebar dan bulat','Memiliki aroma segar seperti lemon','Memilih batang berwarna merah','Memiliki bunga berwarna ungu'],correct:1},
 {type:'mc',q:'Apa nama ilmiah dari daun salam?',options:['Syzygium polyanthum','Cymbopogon citratus','Aloe vera','Piper betle'],correct:0},
 {type:'mc',q:'Kandungan utama yang memberikan aroma khas seperti lemon pada sereh adalah ....',options:['Sitral','Gingerol','Kurkumin','Saponin'],correct:0}
];
const shuffle=a=>{const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x};
let houseQuestions=shuffle(QUESTIONS),answered=Array(6).fill(false),score=0,activeHouse=-1;
let lastDoor=null,sc=OUT,gender='m',keys={},joy={x:0,y:0},dlg=false,cool=0,opened=false,playing=false,near=null,fa=0,pend=null,last=0,lastLockToast=0,treasureShown=false;
const rooms=[],fb=(x,y)=>R(x-5,y-6,10,6);
function completedCount(){return answered.filter(Boolean).length}
function updateHud(){if($('score'))$('score').textContent='⭐ '+score+' poin';if($('progress'))$('progress').textContent='🏠 '+completedCount()+'/6 rumah selesai'}
function showDialog(html){$('dlg').innerHTML=html;$('dlg').style.display='block';dlg=true;$('act').style.display='none'}
function closeDialog(){dlg=false;$('dlg').style.display='none'}
function normalized(v){return v.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim()}
function checkEssay(q,answer){
 const a=normalized(answer);
 const words=new Set(a.split(' '));
 const matched=q.groups.filter(group=>group.some(k=>{
  const key=normalized(k);
  return key.includes(' ')?a.includes(key):words.has(key);
 })).length;
 return {matched,total:q.groups.length,points:matched*5};
}

function setScene(id,x,y){sc=id==='out'?OUT:(rooms[id]=rooms[id]||(id==6?mansionRoom():houseRoom(id)));
 if(x==null){x=sc.spawn[0];y=sc.spawn[1]}P.x=x;P.y=y;cool=30;
 $('loc').textContent=id==='out'?'📍 Kampung Harapan':id==6?'📍 Mansion Pusat':'📍 Rumah '+(id+1)+' · '+NPCS[id].n;sc.id=id}
function mv(dx,dy){const bx=sc.bx;let nx=P.x+dx;if(nx>bx[0]&&nx<bx[1]&&!sc.solids.some(r=>hit(fb(nx,P.y),r)))P.x=nx;
 let ny=P.y+dy;if(ny>bx[2]&&ny<bx[3]&&!sc.solids.some(r=>hit(fb(P.x,ny),r)))P.y=ny}
function step(dt){
 if(pend){fa+=dt*6;if(fa>=1){fa=1;if(sc===OUT){lastDoor=pend;setScene(pend.to)}else setScene('out',lastDoor.sx,lastDoor.sy);pend=null}}else if(fa>0)fa=Math.max(0,fa-dt*5);
 near=null;if(sc.npc&&Math.hypot(P.x-sc.npc.x,P.y-sc.npc.y)<30)near='npc';if(sc.chest&&Math.hypot(P.x-sc.chest.x,P.y-sc.chest.y)<34)near='chest';
 $('act').style.display=near&&!dlg&&playing?'block':'none';$('act').textContent=near=='chest'?'Buka Peti':'Bicara';
 if(dlg||!playing||pend)return;
 let dx=joy.x+((keys.ArrowRight||keys.d)?1:0)-((keys.ArrowLeft||keys.a)?1:0),dy=joy.y+((keys.ArrowDown||keys.s)?1:0)-((keys.ArrowUp||keys.w)?1:0);
 const m=Math.hypot(dx,dy);if(m>1){dx/=m;dy/=m}
 if(m>.12){const v=62*dt;mv(dx*v,dy*v);P.st+=dt*8;{const ax=Math.abs(dx),ay=Math.abs(dy);if(P.d==1||P.d==3){if(ay>ax*1.3)P.d=dy>0?0:2;else if(ax>.25)P.d=dx>0?1:3}else{if(ax>ay*1.3)P.d=dx>0?1:3;else if(ay>.25)P.d=dy>0?0:2}}}else P.st=0;
 if(cool>0){cool--;return}
 for(const d of sc.doors)if(hit(fb(P.x,P.y),d.r)){
  if(sc===OUT&&d.to===6&&completedCount()<6){const now=Date.now();if(now-lastLockToast>2200){toast('Mansion masih terkunci! Selesaikan semua 6 pertanyaan di rumah.');lastLockToast=now}break}
  if(sc===OUT&&typeof d.to==='number'&&d.to<6&&answered[d.to]){const now=Date.now();if(now-lastLockToast>2200){toast('Rumah ini sudah selesai kamu jawab. Cari rumah lain!');lastLockToast=now}break}
  pend=d;break}}
function startQuiz(i){
 if(answered[i]){showDialog(`<b>Rumah sudah selesai</b>Kamu sudah menjawab pertanyaan di rumah ini. Silakan cari rumah lain.<p><button type="button" data-close>Tutup</button></p>`);return}
 activeHouse=i;const q=houseQuestions[i];let body='';
 if(q.type==='essay')body=`<label for="essayAnswer">Tulis jawabanmu:</label><textarea id="essayAnswer" rows="3" placeholder="Ketik jawaban di sini..." required></textarea>`;
 else body=`<div class="quiz-options">${q.options.map((v,n)=>`<label><input type="radio" name="mcAnswer" value="${n}"> ${String.fromCharCode(65+n)}. ${v}</label>`).join('')}</div>`;
 showDialog(`<b>📚 Pertanyaan Rumah ${i+1} · ${q.type==='essay'?'Esai':'Pilihan Ganda'}</b><p>${q.q}</p><form id="quizForm">${body}<p><button type="submit">Kirim Jawaban</button></p></form><small>${q.type==='essay'?'Esai dinilai bertahap: setiap poin jawaban yang cocok bernilai 5 poin (maksimal 15).':'Jawaban benar: +15 poin.'} Setiap rumah hanya bisa dijawab satu kali.</small>`);
 const form=$('quizForm');form.onsubmit=e=>{e.preventDefault();let ok=false,earned=0,feedback='';
  if(q.type==='essay'){
   const v=$('essayAnswer').value.trim();if(!v){$('essayAnswer').focus();return}
   const result=checkEssay(q,v);earned=result.points;ok=earned===15;
   feedback=`<p>Bagian jawaban yang cocok: <strong>${result.matched} dari ${result.total}</strong>.</p><p>Kamu mendapatkan <strong>${earned} poin</strong> dari maksimal 15 poin.</p><p>Contoh jawaban lengkap: ${q.answer}</p>`;
  } else {
   const v=form.querySelector('input[name=mcAnswer]:checked');if(!v){toast('Pilih salah satu jawaban dulu.');return}
   ok=Number(v.value)===q.correct;earned=ok?15:0;
   feedback=`<p>${ok?'Kamu mendapatkan 15 poin.':`Jawaban yang benar: ${String.fromCharCode(65+q.correct)}. ${q.options[q.correct]}`}</p>`;
  }
  answered[i]=true;score+=earned;updateHud();
  const all=completedCount()===6;
  const heading=q.type==='essay'?(earned===15?'🎉 Jawaban lengkap!':earned>0?'👍 Sebagian jawaban benar!':'Belum tepat, tetap semangat!'):(ok?'🎉 Jawaban benar!':'Belum tepat, tetap semangat!');
  showDialog(`<b>${heading}</b>${feedback}<p>Skor: <strong>${score} poin</strong> · ${completedCount()}/6 rumah selesai</p>${all?'<p>🔓 Semua pertanyaan selesai! Mansion sekarang terbuka!</p>':''}<p><button type="button" data-close>Lanjutkan</button></p>`);
 };
}
function act(){
 if(dlg){closeDialog();return}
 if(!near||!playing)return;
 if(near==='npc'){startQuiz(Number(sc.id));return}
 if(near==='chest'){
  if(completedCount()<6){showDialog('<b>🔒 Peti masih terkunci</b>Selesaikan semua 6 pertanyaan di enam rumah terlebih dahulu.<p><button type="button" data-close>Tutup</button></p>');return}
  opened=true;
  if(!treasureShown){
   treasureShown=true;
   const reveal=$('treasureReveal');
   const message=$('treasureMessage');
   if(reveal&&message){
    message.hidden=true;
    reveal.classList.remove('show-message','show-jumacare');
    reveal.style.display='flex';
    void reveal.offsetWidth;
    reveal.classList.add('show-jumacare');
    // Beri waktu agar gambar Jumacare dan animasi kejutannya terlihat dulu.
    setTimeout(()=>{
     reveal.classList.remove('show-jumacare');
     message.hidden=false;
     reveal.classList.add('show-message');
    },1900);
   }
  }
  toast('🎉 Peti terbuka! Ada pesan rahasia dari developer!');
 }
}
$('dlg').onclick=e=>{if(e.target.closest('[data-close]'))closeDialog()};$('act').onclick=act;
$('treasureContinue').onclick=()=>{const reveal=$('treasureReveal');if(reveal){reveal.classList.remove('show-message','show-jumacare');reveal.style.display='none'}};
addEventListener('keydown',e=>{keys[e.key]=true;if(!dlg&&!['INPUT','TEXTAREA','BUTTON'].includes(e.target.tagName)&&['e',' ','Enter'].includes(e.key)&&playing)act()});
addEventListener('keyup',e=>keys[e.key]=false);
let jp=null,jo={x:0,y:0};const jb=$('jb'),jk=$('jk');
cv.addEventListener('pointerdown',e=>{if(jp!==null||!playing||dlg)return;jp=e.pointerId;jo={x:e.clientX,y:e.clientY};
 jb.style.cssText=`display:block;left:${jo.x-50}px;top:${jo.y-50}px`;jk.style.cssText=`display:block;left:${jo.x-22}px;top:${jo.y-22}px`});
addEventListener('pointermove',e=>{if(e.pointerId!==jp)return;let vx=e.clientX-jo.x,vy=e.clientY-jo.y;const l=Math.hypot(vx,vy),k=l>50?50/l:1;
 vx*=k;vy*=k;joy={x:vx/50,y:vy/50};jk.style.left=jo.x+vx-22+'px';jk.style.top=jo.y+vy-22+'px'});
const up=e=>{if(e.pointerId!==jp)return;jp=null;joy={x:0,y:0};jb.style.display=jk.style.display='none'};
addEventListener('pointerup',up);addEventListener('pointercancel',up);
function player(cx,cy){X=b;const f=P.st>0?[0,1,0,3][Math.floor(P.st)%4]:0,x=Math.round(P.x)-cx,y=Math.round(P.y)-cy;
 circ(x,y,6,2,'rgba(0,0,0,.25)');b.drawImage(SP[gender][P.d][f],x-8,y-23)}
function loop(t){const dt=Math.min(.05,(t-last)/1000||0);last=t;step(dt);X=b;
 b.fillStyle='#14311f';b.fillRect(0,0,LW,LH);
 const px=Math.round(P.x),py=Math.round(P.y);
 const cx=sc.w<=LW?Math.round((sc.w-LW)/2):Math.max(0,Math.min(sc.w-LW,px-(LW>>1))),cy=sc.h<=LH?Math.round((sc.h-LH)/2):Math.max(0,Math.min(sc.h-LH,py-12-(LH>>1)));
 b.drawImage(sc.layer,-cx,-cy);
 let done=false;for(const o of sc.objs){if(!done&&o.y>P.y){player(cx,cy);done=true}o.d(cx,cy)}if(!done)player(cx,cy);
 if(fa>0){b.fillStyle=`rgba(0,0,0,${fa})`;b.fillRect(0,0,LW,LH)}
 g.imageSmoothingEnabled=false;g.setTransform(1,0,0,1,0,0);g.fillStyle='#14311f';g.fillRect(0,0,cv.width,cv.height);g.drawImage(buf,0,0,LW*S*D,LH*S*D);
 requestAnimationFrame(loop)}
document.querySelectorAll('.g').forEach(x=>x.onclick=()=>{document.querySelectorAll('.g').forEach(y=>y.classList.remove('on'));x.classList.add('on');gender=x.dataset.g});
try{$('ni').value=localStorage.getItem('pmrName')||'';const sg=localStorage.getItem('pmrG');if(sg)document.querySelector(`.g[data-g=${sg}]`).click()}catch(e){}
$('go').onclick=()=>{const n=$('ni').value.trim();if(!n){$('ni').focus();$('ni').placeholder='Nama wajib diisi';return}
 try{localStorage.setItem('pmrName',n);localStorage.setItem('pmrG',gender)}catch(e){}
 $('nm').textContent='🩺 Petugas '+n;$('nm').dataset.n=n;$('st').style.display='none';$('hud').style.display='block';houseQuestions=shuffle(QUESTIONS);answered=Array(6).fill(false);score=0;opened=false;treasureShown=false;updateHud();setScene('out',384,300);playing=true};
$('lb').onclick=async()=>{await showLeaderboard($);};
$('lbx').onclick=()=>{$('lbp').style.display='none';};
$('pm').src=SP.m[0][0].toDataURL();$('pf').src=SP.f[0][0].toDataURL();
$('loc').textContent='📍 Kampung Harapan';P.x=384;P.y=300;requestAnimationFrame(loop);

/* ---------- layar penuh ---------- */
const fsb=$('fs'),de=document.documentElement;let tt;
function toast(m){const t=$('ts');t.textContent=m;t.style.display='block';clearTimeout(tt);tt=setTimeout(()=>t.style.display='none',3500)}
const fsOn=()=>document.fullscreenElement||document.webkitFullscreenElement;
function toggleFS(){try{if(!fsOn()){const f=de.requestFullscreen||de.webkitRequestFullscreen;if(!f)throw 0;const p=f.call(de);if(p&&p.catch)p.catch(fsFail)}
 else(document.exitFullscreen||document.webkitExitFullscreen).call(document)}catch(e){fsFail()}}
function fsFail(){toast('Layar penuh tidak didukung di sini. Di iPhone: Bagikan > Tambah ke Layar Utama.')}
fsb.onclick=toggleFS;
['fullscreenchange','webkitfullscreenchange'].forEach(ev=>document.addEventListener(ev,()=>{fsb.textContent=fsOn()?'✕':'⛶';rs()}));

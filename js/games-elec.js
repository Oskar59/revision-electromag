/* ============ Atlas Arcade — vrais jeux d'électronique (ch. 1 à 4) ============ */
(function(){
const K=window.GKINDS, D=window.GDEFS, C=window.GC; const {text,arrow,circle,glow,line,rrect,col,pick,ri,rnd,shuffle,clamp}=C;
// les anciens jeux restent disponibles en « entraînement »
['el1','el2','el3'].forEach(k=>{ if(D[k]) D[k+'q']=D[k]; });
const fr=(v,d=2)=>(+v.toFixed(d)).toString().replace('.',',');

/* =================================================================== */
/*  CH.1 — COURT-CIRCUIT : vrai circuit résolu (analyse nodale)          */
/* =================================================================== */
function solve(L,vals){ // vals: slotId -> R (Ω) | 'fil' | null
  const ids=Object.keys(L.nodes), idx={}; ids.forEach((k,i)=>idx[k]=i); const gnd=idx[L.gnd];
  const edges=L.edges.map(e=>{ let R=null; if(e.t==='R'||e.t==='L') R=e.R; if(e.t==='W') R=1e-4; if(e.t==='F') R=1e-3; if(e.t==='S'){ const v=vals[e.id]; R=v==null?null:v==='fil'?1e-4:v; } return {...e,Rv:R}; });
  const nv=ids.length, vs=edges.filter(e=>e.t==='V'); const n=nv+vs.length; const A=Array.from({length:n},()=>new Array(n+1).fill(0));
  edges.forEach(e=>{ if(e.Rv==null||e.t==='V') return; const g=1/e.Rv, a=idx[e.a], b=idx[e.b]; A[a][a]+=g; A[b][b]+=g; A[a][b]-=g; A[b][a]-=g; });
  for(let i=0;i<nv;i++) A[i][i]+=1e-9;
  vs.forEach((e,k)=>{ const r=nv+k, a=idx[e.a], b=idx[e.b]; A[b][r]+=1; A[a][r]-=1; A[r][b]+=1; A[r][a]-=1; A[r][n]=e.E; });
  // masse : remplacer l'équation du nœud gnd
  A[gnd]=new Array(n+1).fill(0); A[gnd][gnd]=1;
  for(let c=0;c<n;c++){ let p=c; for(let r=c+1;r<n;r++) if(Math.abs(A[r][c])>Math.abs(A[p][c])) p=r; [A[c],A[p]]=[A[p],A[c]]; const d=A[c][c]; if(Math.abs(d)<1e-15) continue;
    for(let r=0;r<n;r++){ if(r===c) continue; const f=A[r][c]/d; if(f) for(let k=c;k<=n;k++) A[r][k]-=f*A[c][k]; } }
  const V={}; ids.forEach((k,i)=>V[k]=Math.abs(A[i][i])>1e-15?A[i][n]/A[i][i]:0);
  return edges.map(e=>{ if(e.t==='V'){ return {...e,U:e.E,I:null}; } if(e.Rv==null) return {...e,U:V[e.a]-V[e.b],I:0,open:true}; const U=V[e.a]-V[e.b]; return {...e,U,I:U/e.Rv,P:U*U/e.Rv}; }); }
const W=(a,b)=>({t:'W',a,b}), Rr=(a,b,R)=>({t:'R',a,b,R}), Lp=(a,b,R,name,cond)=>({t:'L',a,b,R,name,...cond}), S=(a,b,id)=>({t:'S',a,b,id}), Fu=(a,b,Imax)=>({t:'F',a,b,Imax}), Vs=(a,b,E)=>({t:'V',a,b,E});
const CIRC=[
 {goal:'La lampe (6 Ω) doit briller normalement : P entre 5 et 7 W.',hint:'Diviseur de tension : la résistance et la lampe se partagent les 12 V.',nodes:{a:[150,390],b:[150,110],c:[650,110],d:[650,390]},gnd:'a',
  edges:[Vs('a','b',12),S('b','c','s1'),Lp('c','d',6,'Lampe',{pmin:5,pmax:7}),W('d','a')],inv:[3,6,12]},
 {goal:'Lampe 4 Ω : P entre 18 et 22,5 W. Aucune résistance seule ne convient…',hint:'Deux résistances en parallèle donnent une résistance plus PETITE que la plus petite.',nodes:{a:[120,400],b:[120,110],c:[300,110],d:[500,110],c2:[300,230],d2:[500,230],e:[680,110],f:[680,400]},gnd:'a',
  edges:[Vs('a','b',12),W('b','c'),S('c','d','s1'),W('c','c2'),S('c2','d2','s2'),W('d2','d'),W('d','e'),Lp('e','f',4,'Lampe',{pmin:18,pmax:22.5}),W('f','a')],inv:[2,4,8,8]},
 {goal:'Deux lampes de 12 Ω en parallèle, chacune entre 2,5 et 3,6 W — sans faire sauter le fusible de 1,2 A.',hint:'Deux lampes de 12 Ω en parallèle valent 6 Ω. Et le fusible voit le courant TOTAL.',nodes:{a:[120,400],b:[120,110],c:[260,110],d:[470,110],e:[690,110],h:[470,400],i:[690,400]},gnd:'a',
  edges:[Vs('a','b',12),Fu('b','c',1.2),S('c','d','s1'),W('d','e'),Lp('d','h',12,'Lampe A',{pmin:2.5,pmax:3.6}),Lp('e','i',12,'Lampe B',{pmin:2.5,pmax:3.6}),W('i','h'),W('h','a')],inv:[3,6,12]},
 {goal:'Lampe A (6 Ω) à pleine puissance (21 à 27 W) et lampe B ÉTEINTE. Fusible 2,5 A.',hint:'Un fil en parallèle sur une lampe la court-circuite : tout le courant passe par le fil.',nodes:{a:[120,400],b:[120,110],c:[260,110],d:[540,110],e:[690,110],f:[690,400],h:[540,400]},gnd:'a',
  edges:[Vs('a','b',12),Fu('b','c',2.5),Lp('c','d',6,'Lampe A',{pmin:21,pmax:27}),W('d','e'),Lp('e','f',6,'Lampe B',{pmax:0.3}),S('d','h','s1'),W('f','h'),W('h','a')],inv:['fil',6,12]},
 {goal:'Pont : la lampe témoin du milieu doit rester ÉTEINTE, avec les deux emplacements remplis.',hint:'Pont équilibré : même rapport des deux côtés, R₁/R₂ = S₁/S₂. Les deux nœuds du milieu sont alors au même potentiel.',nodes:{a:[120,420],b:[120,100],p:[330,100],q:[610,100],m1:[330,260],m2:[610,260],r:[330,420],s:[610,420]},gnd:'a',
  edges:[Vs('a','b',12),W('b','p'),W('p','q'),Rr('p','m1',100),Rr('m1','r',200),S('q','m2','s1'),S('m2','s','s2'),Lp('m1','m2',50,'Témoin',{pmax:1e-5}),W('r','a'),W('s','r')],inv:[50,100,150,200,300],fill:true},
 {goal:'24 V : lampe A (12 Ω) entre 10,5 et 13,5 W, lampe B (6 Ω) entre 5 et 7 W. Fusible 2,5 A.',hint:'Commence par la lampe B : 6 W dans 6 Ω ⇒ 1 A ⇒ 6 V. Puis la tension de la branche, puis le courant total.',nodes:{a:[110,420],b:[110,100],c:[250,100],d:[430,100],e:[430,420],f:[650,100],g:[650,260],h:[650,420]},gnd:'a',
  edges:[Vs('a','b',24),Fu('b','c',2.5),S('c','d','s1'),Lp('d','e',12,'Lampe A',{pmin:10.5,pmax:13.5}),W('d','f'),S('f','g','s2'),Lp('g','h',6,'Lampe B',{pmin:5,pmax:7}),W('h','e'),W('e','a')],inv:[3,6,6,12]}];
const rlab=v=>v==='fil'?'fil (0 Ω)':v+' Ω';
K.circuit={
  round(G,i,retry){ const L=G.def.levels[i]; if(!retry){ const N={}; Object.entries(L.nodes).forEach(([k,[x,y]])=>N[k]=[x,152+(y-100)*0.76]); G.ci={L,N,vals:{},att:0,sel:null}; } const S0=G.ci; S0.res=null; S0.t=0; S0.state='edit';
    G.prompt(`<b>Objectif :</b> ${L.goal}`); K.circuit.ui(G); },
  used(S0){ const u={}; Object.values(S0.vals).forEach(v=>{ if(v!=null) u[v]=(u[v]||0)+1; }); return u; },
  ui(G){ const S0=G.ci, L=S0.L;
    if(S0.sel){ const used=K.circuit.used(S0), cnt={}; L.inv.forEach(v=>cnt[v]=(cnt[v]||0)+1); const cur=S0.vals[S0.sel];
      const opts=[...new Set(L.inv)].map(v=>({label:`${rlab(v)} <small>×${cnt[v]-(used[v]||0)+(cur===v?1:0)}</small>`,on:()=>{ const left=cnt[v]-(used[v]||0)+(cur===v?1:0); if(left<=0){ G.toast('Plus en stock',col.gold); return; } S0.vals[S0.sel]=v; S0.sel=null; S0.res=null; S0.state='edit'; K.circuit.ui(G); }}));
      G.panel([...opts,{label:'Vider',on:()=>{ S0.vals[S0.sel]=null; S0.sel=null; K.circuit.ui(G); }},{label:'✕',on:()=>{S0.sel=null;K.circuit.ui(G);}}]); return; }
    G.panel([{label:'⚡ Mettre sous tension',cls:'sel',on:()=>K.circuit.test(G)},{label:'💡 Indice',on:()=>G.toast('Indice affiché',col.gold)||G.expl(L.hint+'<div style="margin-top:6px"><button class="gbtn" style="padding:6px 12px;font-size:13px">OK</button></div>')||(G.root.querySelector('.expl button').onclick=()=>G.expl(null))},{label:'↺ Tout retirer',on:()=>{ S0.vals={}; S0.res=null; S0.state='edit'; }}]); },
  test(G){ const S0=G.ci, L=S0.L; if(G.busy||S0.state==='run') return; S0.att++; S0.res=solve(L,S0.vals); S0.state='run'; S0.t=0; G.sfx('click'); },
  verdict(G){ const S0=G.ci, L=S0.L, R=S0.res; const msgs=[]; let ok=true;
    R.filter(e=>e.t==='F').forEach(e=>{ if(Math.abs(e.I)>e.Imax){ ok=false; msgs.push(`💥 Fusible grillé : I = ${fr(Math.abs(e.I))} A &gt; ${fr(e.Imax)} A.`); } });
    R.filter(e=>e.t==='L').forEach(e=>{ const P=e.P||0; if(e.pmin!=null&&P<e.pmin){ ok=false; msgs.push(`${e.name} trop faible : U = ${fr(Math.abs(e.U))} V, P = ${fr(P)} W (il faut ≥ ${fr(e.pmin)} W).`); } else if(P>e.pmax){ ok=false; msgs.push(`${e.name} ${e.pmin==null?'devrait être éteinte':'trop forte'} : U = ${fr(Math.abs(e.U))} V, P = ${fr(P)} W.`); } });
    if(L.fill&&L.edges.some(e=>e.t==='S'&&S0.vals[e.id]==null)){ ok=false; msgs.push('Les deux emplacements doivent être remplis.'); }
    if(ok){ G.burst(400,250,col.gold,60); G.success(Math.max(40,100-20*(S0.att-1)),S0.att===1?'Du premier coup !':'Circuit validé !'); }
    else { G.fail('Pas encore…',msgs.join('<br>')+`<br><span style="opacity:.8">Les valeurs mesurées sont affichées sur le schéma.</span>`,{retry:true,life:false}); } },
  pointer(G,t,x,y){ const S0=G.ci; if(t!=='down'||!S0||G.busy) return; const L=S0.L;
    const N=S0.N; const hit=L.edges.find(e=>e.t==='S'&&Math.hypot(x-(N[e.a][0]+N[e.b][0])/2,y-(N[e.a][1]+N[e.b][1])/2)<34);
    if(hit){ S0.sel=hit.id; S0.state='edit'; S0.res=null; G.sfx('click'); K.circuit.ui(G); } },
  update(G,dt){ const S0=G.ci; if(!S0) return; S0.t+=dt; if(S0.state==='run'&&S0.t>2.2&&!G.busy){ S0.state='shown'; K.circuit.verdict(G); } },
  draw(G,c){ const S0=G.ci; if(!S0) return; const L=S0.L, R=S0.res, N=S0.N, run=S0.state!=='edit'&&R;
    const blown=run&&R.some(e=>e.t==='F'&&Math.abs(e.I)>e.Imax)&&S0.t>0.8;
    (R||L.edges).forEach((e,k)=>{ const [x1,y1]=N[e.a],[x2,y2]=N[e.b]; const mx=(x1+x2)/2,my=(y1+y2)/2, hz=y1===y2;
      const I=run&&!blown?(e.I||0):0; const wcol=run&&Math.abs(I)>1e-3?'#ffd45c':'#8790b8';
      const comp=e.t!=='W'; const g=comp?30:0, ux=(x2-x1)/(Math.hypot(x2-x1,y2-y1)||1), uy=(y2-y1)/(Math.hypot(x2-x1,y2-y1)||1);
      line(c,x1,y1,mx-ux*g,my-uy*g,wcol,3); line(c,mx+ux*g,my+uy*g,x2,y2,wcol,3);
      if(run&&Math.abs(I)>1e-3){ const L2=Math.hypot(x2-x1,y2-y1), sp=Math.sign(I)*Math.min(260,40+Math.abs(I)*90); for(let d=((S0.t*sp)%28+28)%28;d<L2;d+=28){ circle(c,x1+ux*d,y1+uy*d,3,'#fff4c2'); } }
      if(e.t==='V'){ circle(c,mx,my,22,'#151a33','#fff',2.5); text(c,'+',mx,my-34,col.p,18); text(c,`${e.E} V`,mx-34,my,'#fff',15,'right'); line(c,mx,my-12,mx,my+12,'#fff',2); }
      if(e.t==='R'){ c.save(); c.translate(mx,my); c.rotate(hz?0:Math.PI/2); rrect(c,-30,-11,60,22,4,'#1d2342','#c0c4d8'); c.restore(); text(c,e.R+' Ω',hz?mx:mx+38,hz?my-24:my,'#c0c4d8',13,hz?'center':'left'); }
      if(e.t==='F'){ c.save(); c.translate(mx,my); c.rotate(hz?0:Math.PI/2); rrect(c,-26,-9,52,18,9,blown&&Math.abs(e.I)>e.Imax?'#5a1020':'#2a2f55','#ff9aa8'); if(!(blown&&Math.abs(e.I)>e.Imax)) line(c,-20,0,20,0,'#ff9aa8',1.5); c.restore(); text(c,`fusible ${fr(e.Imax)} A`,hz?mx:mx+34,hz?my-22:my,'#ff9aa8',12,hz?'center':'left'); if(blown&&Math.abs(e.I)>e.Imax&&S0.t<1.2) G.burst(mx,my,'#ff7a4d',6); }
      if(e.t==='L'){ const P=run&&!blown?(e.P||0):0; const on=Math.min(1,P/((e.pmax||1)*0.9)); if(P>0.01){ glow(c,mx,my,30+50*on,`rgba(255,214,92,${.25+.55*on})`); } circle(c,mx,my,20,P>0.01?`rgba(255,226,140,${.3+.7*on})`:'#1d2342','#fff',2.5);
        const k2=12; line(c,mx-k2,my-k2,mx+k2,my+k2,'#fff',2); line(c,mx+k2,my-k2,mx-k2,my+k2,'#fff',2); text(c,`${e.name} · ${e.R} Ω`,hz?mx:mx+30,hz?my-34:my-10,'#fff',13,hz?'center':'left'); }
      if(e.t==='S'){ const v=S0.vals[e.id], sel=S0.sel===e.id; c.save(); c.translate(mx,my); c.rotate(hz?0:Math.PI/2);
        if(v==null) rrect(c,-30,-14,60,28,8,sel?'rgba(164,139,255,.35)':'rgba(255,255,255,.06)',sel?'#fff':'#a48bff'); else if(v==='fil'){ line(c,-30,0,30,0,'#9fd3ff',4); } else rrect(c,-30,-11,60,22,4,'#2a2152','#a48bff'); c.restore();
        text(c,v==null?'? clique':rlab(v),hz?mx:mx+38,hz?my-26:my,v==null?'#a48bff':'#d8ccff',13,hz?'center':'left',800); if(v==null) { c.globalAlpha=.5+.5*Math.sin(G.t*4); circle(c,mx,my,4,'#a48bff'); c.globalAlpha=1; } }
      if(run&&S0.t>0.6&&e.t!=='W'&&e.t!=='V'&&!e.open){ const tx=hz?mx:mx-44, ty=hz?my+28:my+20; text(c,`${fr(Math.abs(e.I))} A · ${fr(Math.abs(e.U))} V`,tx,ty,'#9fe8c0',11.5,hz?'center':'right',700); }
    });
    Object.values(N).forEach(([x,y])=>circle(c,x,y,3.5,'#c0c4d8'));
    text(c,`stock : ${L.inv.map(rlab).join(' · ')}`,400,424,col.dim,12,'center',600);
  }
};
K.circuit.solve=solve;
K.circuit.ok=(L,vals)=>{ const R=solve(L,vals); if(R.some(e=>e.t==='F'&&Math.abs(e.I)>e.Imax)) return false; if(L.fill&&L.edges.some(e=>e.t==='S'&&vals[e.id]==null)) return false;
  return R.filter(e=>e.t==='L').every(e=>{ const P=e.P||0; return !(e.pmin!=null&&P<e.pmin)&&!(P>e.pmax); }); };
D.el1={kind:'circuit',rounds:6,lives:0,maxPerRound:100,successDelay:1500,levels:CIRC,
 intro:'Un vrai circuit, calculé en direct. Clique sur les emplacements ? pour y placer une résistance de ton stock (ou un fil), puis mets sous tension : le courant circule, les lampes s’allument selon leur puissance… et les fusibles sautent si tu exagères.',
 outro:'Série : les résistances s’ajoutent et se partagent la tension. Parallèle : la résistance équivalente diminue et les courants s’ajoutent. Un fil court-circuite. Pont équilibré : rapports égaux, aucun courant au milieu.'};

/* =================================================================== */
/*  CH.2 — CONDENSATOR : canon alimenté par un condensateur               */
/* =================================================================== */
const RCH=[{lab:'1,5 kΩ',R:1.5,tau:0.33},{lab:'4,7 kΩ',R:4.7,tau:1.03},{lab:'10 kΩ',R:10,tau:2.2}];
const WMAX=11; // mJ : ½·220 µF·(10 V)²
K.capshoot={
  start(G){ G.cs={x:400,keys:{},ri:1}; },
  round(G,i){ const S0=G.cs; Object.assign(S0,{u:0,heat:0,cut:0,shots:[],bombs:[],en:[],fx:[],flash:0,inv:0});
    const n=5+i, rows=Math.ceil(n/6); const lev=[[.15,.3],[.2,.4],[.3,.6],[.3,.75],[.4,.85],[.5,.9]][Math.min(i,5)];
    for(let k=0;k<n;k++){ const sh=Math.round(rnd(lev[0],lev[1])*20)/20; S0.en.push({x:110+(k%6)*115,y:115+Math.floor(k/6)*62,s:sh,ph:Math.random()*6,v:8+i*3}); }
    G.prompt(`Vague ${i+1} — un tir libère W = ½Cu². Chaque ennemi demande une énergie minimale.`); clearTimeout(G._ph); G._ph=setTimeout(()=>G.state==='play'&&G.prompt(null),3500);
    G.panel(RCH.map((r,k)=>({label:`R = ${r.lab}`,cls:k===S0.ri?'sel':'',on:()=>K.capshoot.setR(G,k)})).concat([{label:'⚡ Tir (espace)',on:()=>K.capshoot.fire(G)}])); },
  setR(G,k){ const S0=G.cs; S0.ri=k; G.root.querySelectorAll('.panel button').forEach((b,j)=>{ if(j<3) b.classList.toggle('sel',j===k); }); },
  fire(G){ const S0=G.cs; if(G.busy||S0.u<0.3) return; const W=WMAX*(S0.u/10)**2; S0.shots.push({x:S0.x,y:430,W,u:S0.u}); S0.flash=.15; S0.u=0; G.sfx('click'); },
  pointer(G,t,x){ if(t==='move') G.cs.x=clamp(x,40,760); if(t==='down'){ G.cs.x=clamp(x,40,760); K.capshoot.fire(G); } },
  key(G,k,d){ const S0=G.cs; S0.keys[k]=d; if(d&&k===' ') K.capshoot.fire(G); if(d&&['1','2','3'].includes(k)) K.capshoot.setR(G,+k-1); },
  update(G,dt){ const S0=G.cs; if(!S0||!S0.en) return; if(S0.keys.ArrowLeft) S0.x-=400*dt; if(S0.keys.ArrowRight) S0.x+=400*dt; S0.x=clamp(S0.x,40,760);
    const r=RCH[S0.ri]; if(S0.cut>0) S0.cut-=dt; else { S0.u+=(10-S0.u)/r.tau*dt; const i=(10-S0.u)/10; S0.heat+=dt*(1.25*i*i*(1.5/r.R)); }
    S0.heat=Math.max(0,S0.heat-0.22*dt); if(S0.heat>=1&&S0.cut<=0){ S0.cut=2.5; S0.heat=0.6; S0.u=0; G.shake(); G.sfx('bad'); G.toast('Fusible ! courant de charge trop fort',col.bad); }
    S0.inv=Math.max(0,S0.inv-dt); S0.flash=Math.max(0,S0.flash-dt);
    if(G.busy) return;
    S0.shots.forEach(s=>s.y-=520*dt); S0.shots=S0.shots.filter(s=>s.y>-20&&!s.dead);
    S0.en.forEach(e=>{ e.ph+=dt; e.y+=e.v*dt; e.dx=Math.sin(e.ph)*30; if(Math.random()<dt*(0.04+G.i*0.02)) S0.bombs.push({x:e.x+e.dx,y:e.y+18}); });
    S0.shots.forEach(s=>{ S0.en.forEach(e=>{ if(e.dead||s.dead) return; if(Math.abs(s.x-(e.x+e.dx))<30&&Math.abs(s.y-e.y)<22){ s.dead=true; const need=e.s*WMAX;
      if(s.W>=need){ e.dead=true; G.burst(e.x+e.dx,e.y,'#ffd45c',26); G.sfx('good'); G.score+=Math.round(20+e.s*40); G.combo++; G.hud(); }
      else { S0.fx.push({x:e.x+e.dx,y:e.y,t:1,txt:`${fr(s.W,1)} mJ < ${fr(need,1)} mJ`}); G.sfx('tick'); G.combo=0; G.hud(); } } }); });
    S0.en=S0.en.filter(e=>!e.dead);
    S0.bombs.forEach(b=>b.y+=170*dt); S0.bombs=S0.bombs.filter(b=>{ if(b.y>500) return false; if(S0.inv<=0&&Math.abs(b.x-S0.x)<26&&Math.abs(b.y-448)<16){ S0.inv=1.2; G.lives--; G.shake(); G.sfx('bad'); G.burst(S0.x,448,col.bad); G.hud(); if(G.lives<=0) G.finish(false); return false; } return true; });
    S0.en.forEach(e=>{ if(e.y>415&&!e.dead){ e.dead=true; G.lives--; G.shake(); G.sfx('bad'); G.toast('Un parasite est passé !',col.bad); G.hud(); if(G.lives<=0) G.finish(false); } }); S0.en=S0.en.filter(e=>!e.dead);
    S0.fx.forEach(f=>f.t-=dt); S0.fx=S0.fx.filter(f=>f.t>0);
    if(!S0.en.length&&G.state==='play') G.success(60,'Vague nettoyée !'); },
  draw(G,c){ const S0=G.cs; if(!S0||!S0.en) return;
    S0.en.forEach(e=>{ const x=e.x+e.dx; glow(c,x,e.y,40,'rgba(255,84,112,.25)'); rrect(c,x-26,e.y-16,52,32,10,'#3a1530','#ff5470'); text(c,'👾',x,e.y-1,'#fff',18);
      text(c,`${fr(e.s*WMAX,1)} mJ`,x,e.y+28,'#ffb3c0',12); });
    S0.bombs.forEach(b=>{ c.strokeStyle='#ff7a4d'; c.lineWidth=2.5; c.beginPath(); c.moveTo(b.x,b.y-10); c.lineTo(b.x+5,b.y-3); c.lineTo(b.x-4,b.y+2); c.lineTo(b.x+2,b.y+10); c.stroke(); });
    S0.shots.forEach(s=>{ const r=6+s.W*1.6; glow(c,s.x,s.y,r*3,'rgba(120,220,255,.45)'); circle(c,s.x,s.y,r,'#bff2ff'); });
    S0.fx.forEach(f=>text(c,f.txt,f.x,f.y-30-(1-f.t)*20,`rgba(255,212,92,${f.t})`,13));
    // vaisseau
    const x=S0.x; c.globalAlpha=S0.inv>0&&Math.floor(S0.inv*10)%2?0.35:1; rrect(c,x-30,440,60,18,8,'#2a2f55','#3cc7d6'); rrect(c,x-8,426,16,16,4,'#3cc7d6'); c.globalAlpha=1; if(S0.flash>0) glow(c,x,420,60,'rgba(190,240,255,.8)');
    // jauges
    const gx=16,gy=120,gh=300; rrect(c,gx,gy,26,gh,8,'rgba(255,255,255,.08)'); const fu=S0.u/10; rrect(c,gx,gy+gh*(1-fu),26,gh*fu,8,S0.cut>0?'#555':'#3cc7d6');
    [[6.32,'τ'],[8.65,'2τ'],[9.5,'3τ']].forEach(([v,l])=>{ const yy=gy+gh*(1-v/10); line(c,gx-4,yy,gx+30,yy,'rgba(255,255,255,.4)',1); text(c,l,gx+36,yy,col.dim,10,'left'); });
    text(c,'u_C',gx+13,gy-14,'#fff',12); text(c,`${fr(S0.u,1)} V`,gx+13,gy+gh+14,'#fff',13); text(c,`W = ${fr(WMAX*(S0.u/10)**2,1)} mJ`,gx+13,gy+gh+32,'#bff2ff',12);
    const hx=760; rrect(c,hx,gy,22,gh,8,'rgba(255,255,255,.08)'); rrect(c,hx,gy+gh*(1-Math.min(1,S0.heat)),22,gh*Math.min(1,S0.heat),8,S0.heat>.75?'#ff5470':'#ff9a3c'); text(c,'🔥',hx+11,gy-14,'#fff',13);
    if(S0.cut>0) text(c,'FUSIBLE COUPÉ',400,300,col.bad,26,'center',800);
    text(c,`C = 220 µF · E = 10 V · R = ${RCH[S0.ri].lab} ⇒ τ = RC = ${fr(RCH[S0.ri].tau)} s   (touches 1 2 3)`,400,486,col.dim,12,'center',600);
  }
};
D.el2={kind:'capshoot',rounds:6,lives:4,maxPerRound:160,successDelay:1500,
 intro:'Ton canon tire l’énergie d’un condensateur de 220 µF chargé à travers R. Chaque parasite demande une énergie minimale (en mJ). Attention : W = ½Cu², donc tirer à mi-charge ne donne qu’un QUART de l’énergie ! Petite R = charge rapide… mais gros courant qui chauffe le fusible. Déplace-toi (souris / ← →), tire (clic / espace), change R (1 2 3).',
 outro:'u_C(t) = E(1 − e^(−t/τ)) : 63 % à τ, 95 % à 3τ. Mais l’énergie ½Cu² ne vaut que 40 % à τ et 90 % à 3τ. Le courant de charge E/R est maximal au début : une petite R charge vite mais chauffe.'};

/* =================================================================== */
/*  CH.3 — FILTRE-DÉFENSE : bloquer le bruit, laisser passer les données  */
/* =================================================================== */
const FT={pb:['Passe-bas',(x)=>1/Math.sqrt(1+x*x)],ph:['Passe-haut',(x)=>x/Math.sqrt(1+x*x)],pbd:['Passe-bande',(x)=>1/Math.sqrt(1+2.25*(x-1/x)**2)],cb:['Coupe-bande',(x)=>{const q=1.5*(x-1/x); return Math.abs(q)/Math.sqrt(1+q*q);}]};
const lf2s=l=>{ const f=10**l; return f>=1000?fr(f/1000,f>=1e4?0:1)+' kHz':Math.round(f)+' Hz'; };
const WAVES=[
 {need:'ph',sig:()=>[[1,1.9,'en'],[3.7,4.6,'al']]},{need:'pb',sig:()=>[[1,2,'al'],[3.6,4.6,'en']]},
 {need:'mix',sig:()=>[[1,1.8,'en'],[3.8,4.6,'al']],sig2:()=>[[1,1.9,'al'],[3.8,4.6,'en']]},
 {need:'pbd',sig:()=>[[2.8,3.2,'al'],[1,1.6,'en'],[4.4,4.9,'en']]},{need:'cb',sig:()=>[[2.8,3.2,'en'],[1,1.6,'al'],[4.4,4.9,'al']]},
 {need:'all',sig:null}];
K.filterdef={
  start(G){ G.fd={ty:'pb',lc:3,keys:{}}; },
  round(G,i){ const S0=G.fd; Object.assign(S0,{sigs:[],q:[],t:0,done:0}); const W=WAVES[Math.min(i,5)]; const n=10+i*2, sp=65+i*12;
    for(let k=0;k<n;k++){ let pool; if(W.need==='all'){ pool=pick([WAVES[0],WAVES[1],WAVES[3],WAVES[4]]).sig(); } else if(W.need==='mix') pool=(k<n/2?W.sig:W.sig2)(); else pool=W.sig();
      const band=pick(pool); S0.q.push({at:k*(W.need==='all'?1.5:1.7)+(W.need==='all'?0:(W.need==='mix'&&k>=n/2?2.5:0)),lf:rnd(band[0],band[1]),en:band[2]==='en',lane:ri(0,3),sp:sp*(W.need==='all'?1.2:1)}); }
    S0.total=n; G.prompt(`Vague ${i+1} : bloque le <b style="color:#ff5470">bruit</b> (rouge), laisse passer les <b style="color:#3cc7d6">données</b> (bleu).`); clearTimeout(G._ph); G._ph=setTimeout(()=>G.state==='play'&&G.prompt(null),3500);
    G.panel(Object.entries(FT).map(([k,v],j)=>({label:`${j+1} · ${v[0]}`,cls:k===S0.ty?'sel':'',on:()=>K.filterdef.setT(G,k)}))); },
  setT(G,k){ G.fd.ty=k; G.root.querySelectorAll('.panel button').forEach((b,j)=>b.classList.toggle('sel',Object.keys(FT)[j]===k)); },
  H(S0,lf){ return FT[S0.ty][1](10**(lf-S0.lc)); },
  pointer(G,t,x,y){ const S0=G.fd; if((t==='down'||(t==='move'&&S0.drag))&&y>316){ S0.drag=true; S0.lc=clamp(1+(x-60)/680*4,0.8,5.2); } if(t==='up') S0.drag=false; if(t==='down'&&y>316) S0.drag=true; },
  key(G,k,d){ const S0=G.fd; S0.keys[k]=d; if(d&&['1','2','3','4'].includes(k)) K.filterdef.setT(G,Object.keys(FT)[+k-1]); },
  update(G,dt){ const S0=G.fd; if(!S0||!S0.q) return; if(S0.keys.ArrowLeft) S0.lc-=1.6*dt; if(S0.keys.ArrowRight) S0.lc+=1.6*dt; S0.lc=clamp(S0.lc,0.8,5.2);
    if(G.busy) return; S0.t+=dt; while(S0.q.length&&S0.q[0].at<=S0.t){ const s=S0.q.shift(); S0.sigs.push({...s,x:830,amp:1}); }
    S0.sigs.forEach(s=>{ s.x-=s.sp*dt; if(s.x<210&&!s.filtered){ s.filtered=true; s.amp=K.filterdef.H(S0,s.lf); }
      if(s.x<120&&!s.done){ s.done=true; S0.done++; const a=s.amp;
        if(s.en&&a>0.3){ G.lives--; G.shake(); G.sfx('bad'); G.toast(`Bruit ${lf2s(s.lf)} passé (${Math.round(20*Math.log10(a))} dB)`,col.bad); G.combo=0; G.hud(); if(G.lives<=0) G.finish(false); }
        else if(!s.en&&a<0.7){ G.lives--; G.shake(); G.sfx('bad'); G.toast(`Données ${lf2s(s.lf)} perdues (${Math.round(20*Math.log10(Math.max(a,1e-3)))} dB)`,col.bad); G.combo=0; G.hud(); if(G.lives<=0) G.finish(false); }
        else { G.score+=10+Math.min(G.combo,5)*2; G.combo++; G.sfx('tick'); G.hud(); } } });
    S0.sigs=S0.sigs.filter(s=>s.x>60);
    if(S0.done>=S0.total&&G.state==='play') G.success(50,'Vague filtrée !'); },
  draw(G,c){ const S0=G.fd; if(!S0||!S0.sigs) return; const lanes=[100,158,216,274];
    rrect(c,10,70,95,230,14,'rgba(60,199,214,.12)','rgba(60,199,214,.5)'); text(c,'🏰',57,170,'#fff',34); text(c,'récepteur',57,212,col.dim,12);
    c.fillStyle='rgba(164,139,255,.18)'; c.fillRect(200,70,16,230); text(c,FT[S0.ty][0],208,60,col.vio,13); text(c,'fc = '+lf2s(S0.lc),208,308,col.vio,12);
    S0.sigs.forEach(s=>{ const y=lanes[s.lane], colr=s.en?'#ff5470':'#3cc7d6', k=0.04+0.06*(s.lf-1); c.strokeStyle=colr; c.lineWidth=3; c.beginPath();
      for(let d=0;d<=90;d+=2){ const x=s.x+d; const a=(x<210?s.amp:1)*18; const yy=y-a*Math.sin((x+G.t*80)*k*Math.PI); d?c.lineTo(x,yy):c.moveTo(x,yy); } c.stroke();
      text(c,(s.en?'bruit ':'data ')+lf2s(s.lf),s.x+45,y+30,colr,11.5); });
    // diagramme de Bode
    const bx=60,bw=680,by=326,bh=86; rrect(c,bx-10,by-6,bw+20,bh+12,12,'rgba(10,12,30,.8)','rgba(255,255,255,.15)');
    const X=l=>bx+(l-1)/4*bw, Y=db=>by+(-db)/40*bh;
    for(let l=1;l<=5;l++){ line(c,X(l),by,X(l),by+bh,'rgba(255,255,255,.08)',1); text(c,['10 Hz','100 Hz','1 kHz','10 kHz','100 kHz'][l-1],X(l),by+bh+2,col.dim,10,'center',600,'top'); }
    line(c,bx,Y(-3),bx+bw,Y(-3),'rgba(60,199,214,.6)',1,[5,4]); line(c,bx,Y(-10),bx+bw,Y(-10),'rgba(255,84,112,.6)',1,[5,4]); text(c,'−3 dB',bx+bw+4,Y(-3),'#3cc7d6',10,'left'); text(c,'−10 dB',bx+bw+4,Y(-10),'#ff5470',10,'left');
    c.strokeStyle=col.vio; c.lineWidth=3; c.beginPath(); for(let k=0;k<=200;k++){ const l=1+4*k/200; const db=Math.max(-40,20*Math.log10(Math.max(1e-4,K.filterdef.H(S0,l)))); k?c.lineTo(X(l),Y(db)):c.moveTo(X(l),Y(db)); } c.stroke();
    S0.sigs.filter(s=>!s.done).forEach(s=>circle(c,X(s.lf),by+bh-6,4,s.en?'#ff5470':'#3cc7d6'));
    line(c,X(S0.lc),by,X(S0.lc),by+bh,'#fff',1.5,[3,3]); text(c,'⇆ glisse ici',X(S0.lc),by+12,'#fff',11);
  }
};
D.el3={kind:'filterdef',rounds:6,lives:5,maxPerRound:170,successDelay:1500,
 intro:'Des signaux foncent vers ton récepteur. Les ROUGES sont du bruit : ils doivent être atténués sous −10 dB. Les BLEUS sont des données : ils doivent passer au-dessus de −3 dB. Choisis le type de filtre (1 à 4) et fais glisser la fréquence de coupure sur le diagramme de Bode (ou ← →).',
 outro:'Passe-bas : garde les basses fréquences ; passe-haut : les hautes ; passe-bande : une zone autour de fc ; coupe-bande : élimine une zone. 1ᵉʳ ordre : −3 dB à fc puis −20 dB/décade, il faut donc une marge d’une demi-décade.'};

/* =================================================================== */
/*  CH.4 — SATURATION : ton vaisseau EST la sortie de l'AOP               */
/* =================================================================== */
const RAT=[0.5,1,2,3,4,5,9];
const MODES={suiv:'Suiveur',inv:'Inverseur',ninv:'Non-inverseur',comp:'Comparateur'};
const VSAT=12, YV=v=>250-v*16;
const gainOf=(m,r)=>m==='suiv'?1:m==='inv'?-r:m==='ninv'?1+r:null;
const outOf=(m,r,ve)=>m==='comp'?(ve>0?VSAT:-VSAT):clamp(gainOf(m,r)*ve,-VSAT,VSAT);
const AOPLV=[{A:2,cfg:[['suiv',1],['ninv',1],['ninv',2]]},{A:2,cfg:[['inv',1],['inv',2],['suiv',1]]},{A:1.5,cfg:[['inv',3],['ninv',3],['inv',0.5],['ninv',2]]},
 {A:2.5,cfg:[['ninv',9],['inv',9],['inv',2],['ninv',1]]},{A:1,cfg:[['comp',1],['inv',4],['ninv',4],['comp',1]]},{A:2,cfg:[['suiv',1],['inv',0.5],['inv',4],['ninv',3],['comp',1],['ninv',9]]}];
K.opamp={
  start(G){ G.op={m:'suiv',ri:1}; },
  round(G,i){ const S0=G.op, L=AOPLV[Math.min(i,5)]; Object.assign(S0,{L,X:0,gates:[],passed:0,inv:0,crash:0}); const lam=320;
    S0.ve=x=>L.A*Math.sin(2*Math.PI*x/lam);
    let x=700; for(let k=0;k<6;k++){ const [m,r]=pick(L.cfg); let xg=x+rnd(0,160); for(let t=0;t<40&&Math.abs(S0.ve(xg))<0.45*L.A&&m!=='comp';t++) xg+=8; const v=outOf(m,r,S0.ve(xg)); S0.gates.push({x:xg,lo:clamp(v-1.3,-14.5,14.5),hi:clamp(v+1.3,-14.5,14.5),m,r}); x=xg+430-i*20; }
    S0.end=x+100; G.prompt(`Niveau ${i+1} — ve = ${fr(L.A,1)}·sin(ωt). Passe dans chaque ouverture.`); clearTimeout(G._ph); G._ph=setTimeout(()=>G.state==='play'&&G.prompt(null),3500); K.opamp.ui(G); },
  ui(G){ const S0=G.op; G.panel([...Object.entries(MODES).map(([k,v])=>({label:v,cls:k===S0.m?'sel':'',on:()=>{S0.m=k;K.opamp.ui(G);}})),{label:'R₂/R₁ −',on:()=>{S0.ri=Math.max(0,S0.ri-1);K.opamp.ui(G);}},{label:'R₂/R₁ +',on:()=>{S0.ri=Math.min(RAT.length-1,S0.ri+1);K.opamp.ui(G);}}]); },
  key(G,k,d){ const S0=G.op; if(!d) return; const map={s:'suiv',i:'inv',n:'ninv',c:'comp',S:'suiv',I:'inv',N:'ninv',C:'comp'}; if(map[k]){S0.m=map[k];K.opamp.ui(G);} if(k==='ArrowUp'){S0.ri=Math.min(RAT.length-1,S0.ri+1);K.opamp.ui(G);} if(k==='ArrowDown'){S0.ri=Math.max(0,S0.ri-1);K.opamp.ui(G);} },
  vout(S0,x){ return outOf(S0.m,RAT[S0.ri],S0.ve(x)); },
  update(G,dt){ const S0=G.op; if(!S0||!S0.gates||G.busy) return; const sp=110+G.i*12; const prev=S0.X; S0.X+=sp*dt; S0.inv=Math.max(0,S0.inv-dt); S0.crash=Math.max(0,S0.crash-dt);
    const shipX=S0.X+200; S0.gates.forEach(g=>{ if(g.done) return; if(prev+200<g.x&&shipX>=g.x){ g.done=true; const v=K.opamp.vout(S0,g.x);
      if(v>=g.lo&&v<=g.hi){ G.score+=20+Math.min(G.combo,5)*4; G.combo++; G.sfx('good'); G.burst(200,YV(v),col.ok,14); G.hud(); }
      else { G.combo=0; G.lives--; G.shake(); G.sfx('bad'); G.burst(200,YV(v),col.bad,30); S0.crash=.6; const need=g.m==='comp'?'un comparateur (sortie ±Vsat)':`${MODES[g.m].toLowerCase()}${g.m==='suiv'?'':` avec R₂/R₁ = ${fr(g.r)}`} (G = ${fr(gainOf(g.m,g.r))})`;
        G.toast('Crash !',col.bad); G.expl(`Il fallait Vs ∈ [${fr(g.lo,1)} ; ${fr(g.hi,1)}] V alors que ve = ${fr(S0.ve(g.x))} V. Une solution : ${need}.`); setTimeout(()=>G.expl(null),3200); G.hud(); if(G.lives<=0) G.finish(false); } } });
    if(shipX>S0.end&&G.state==='play') G.success(60,'Niveau franchi !'); },
  draw(G,c){ const S0=G.op; if(!S0||!S0.gates) return; const X0=S0.X;
    c.fillStyle='rgba(255,84,112,.08)'; c.fillRect(0,0,800,YV(VSAT)); c.fillRect(0,YV(-VSAT),800,500-YV(-VSAT)); line(c,0,YV(VSAT),800,YV(VSAT),'rgba(255,84,112,.6)',1.5,[6,5]); line(c,0,YV(-VSAT),800,YV(-VSAT),'rgba(255,84,112,.6)',1.5,[6,5]);
    text(c,'+Vsat = +12 V',790,YV(VSAT)-10,'#ff8a9b',11,'right'); text(c,'−Vsat',790,YV(-VSAT)+10,'#ff8a9b',11,'right'); line(c,0,250,800,250,'rgba(255,255,255,.12)',1);
    c.strokeStyle='rgba(200,205,240,.45)'; c.lineWidth=2; c.beginPath(); for(let sx=0;sx<=800;sx+=4){ const y=YV(S0.ve(X0+sx)); sx?c.lineTo(sx,y):c.moveTo(sx,y);} c.stroke(); text(c,'ve (entrée)',20,YV(S0.L.A)-12,'rgba(200,205,240,.7)',11,'left');
    S0.gates.forEach(g=>{ const sx=g.x-X0; if(sx<-30||sx>830) return; const cl=g.done?'rgba(255,255,255,.12)':'#5b4bd6'; c.fillStyle=cl; c.fillRect(sx-9,0,18,YV(g.hi)); c.fillRect(sx-9,YV(g.lo),18,500-YV(g.lo));
      glow(c,sx,(YV(g.hi)+YV(g.lo))/2,30,'rgba(61,220,132,.25)'); if(!g.done){ text(c,`[${fr(g.lo,1)} ; ${fr(g.hi,1)}] V`,sx,YV(g.hi)-12,'#c9c2ff',11); circle(c,sx,YV(S0.ve(g.x)),4,'rgba(200,205,240,.9)'); text(c,`ve = ${fr(S0.ve(g.x),1)}`,sx+12,YV(S0.ve(g.x))+12,'rgba(200,205,240,.85)',10,'left'); } });
    // trace passée et phares
    c.strokeStyle='#3cc7d6'; c.lineWidth=3.5; c.beginPath(); for(let sx=0;sx<=200;sx+=3){ const y=YV(K.opamp.vout(S0,X0+sx)); sx?c.lineTo(sx,y):c.moveTo(sx,y);} c.stroke();
    c.strokeStyle='rgba(60,199,214,.35)'; c.setLineDash([6,6]); c.beginPath(); for(let sx=200;sx<=330;sx+=3){ const y=YV(K.opamp.vout(S0,X0+sx)); sx===200?c.moveTo(sx,y):c.lineTo(sx,y);} c.stroke(); c.setLineDash([]);
    const vy=YV(K.opamp.vout(S0,X0+200)); glow(c,200,vy,34,S0.crash>0?'rgba(255,84,112,.6)':'rgba(60,199,214,.5)'); text(c,'🛸',200,vy,'#fff',26);
    const g=gainOf(S0.m,RAT[S0.ri]); rrect(c,14,48,250,92,12,'rgba(10,12,30,.8)','rgba(255,255,255,.15)');
    text(c,MODES[S0.m],139,66,'#fff',15); text(c,S0.m==='comp'?'Vs = ±12 V (signe de ve)':S0.m==='suiv'?'Vs = ve':`R₂/R₁ = ${fr(RAT[S0.ri])}   G = ${fr(g)}`,139,90,'#c9c2ff',13);
    text(c,S0.m==='inv'?'Vs = −(R₂/R₁)·ve':S0.m==='ninv'?'Vs = (1 + R₂/R₁)·ve':S0.m==='suiv'?'(gain 1)':'(pas de contre-réaction)',139,112,col.dim,12); text(c,'S I N C · ↑ ↓',139,132,col.dim,10.5);
  }
};
D.el4={kind:'opamp',rounds:6,lives:4,maxPerRound:200,successDelay:1500,
 intro:'Ton vaisseau EST la sortie de l’AOP : son altitude vaut Vs. L’entrée ve (courbe grise) défile. Change de montage (S suiveur, I inverseur, N non-inverseur, C comparateur) et de rapport R₂/R₁ (↑ ↓) pour que Vs passe dans chaque ouverture. Au-delà de ±12 V, la sortie sature.',
 outro:'Suiveur : Vs = ve. Inverseur : −R₂/R₁ (peut être < 1, inverse le signe). Non-inverseur : 1 + R₂/R₁ (≥ 1). Saturation à ±Vsat. Comparateur (sans contre-réaction) : ±Vsat selon le signe de ε.'};
})();

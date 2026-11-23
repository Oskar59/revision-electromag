/* ============ Générateur d'exercices de mathématiques (corrigés pas à pas) ============ */
(function(){
const r=String.raw;
/* ---------- outils ---------- */
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const nz=(a,b)=>{let v;do{v=ri(a,b);}while(v===0);return v;};
const pick=a=>a[Math.floor(Math.random()*a.length)];
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a||1;};
class Fr{constructor(n,d=1){ if(d===0) throw new Error('div0'); if(d<0){n=-n;d=-d;} const g=gcd(n,d); this.n=n/g; this.d=d/g; }
  add(o){o=F(o);return new Fr(this.n*o.d+o.n*this.d,this.d*o.d);} sub(o){o=F(o);return new Fr(this.n*o.d-o.n*this.d,this.d*o.d);}
  mul(o){o=F(o);return new Fr(this.n*o.n,this.d*o.d);} div(o){o=F(o);return new Fr(this.n*o.d,this.d*o.n);} neg(){return new Fr(-this.n,this.d);}
  get z(){return this.n===0;} get one(){return this.n===this.d;} get s(){return Math.sign(this.n);} abs(){return new Fr(Math.abs(this.n),this.d);}
  get int(){return this.d===1;} val(){return this.n/this.d;}
  tex(){ if(this.d===1) return ''+this.n; return (this.n<0?'-':'')+r`\frac{${Math.abs(this.n)}}{${this.d}}`; } }
const F=x=>x instanceof Fr?x:new Fr(x);
/* terme c·v dans une somme */
function term(c,v,first){ c=F(c); if(c.z) return ''; const a=c.abs(); const body=(v&&a.one)?v:(a.tex()+(v?v:''));
  return first?((c.s<0?'-':'')+body):((c.s<0?' - ':' + ')+body); }
function sum(terms){ let s='',first=true; terms.forEach(([c,v])=>{ const t=term(c,v,first); if(t){ s+=t; first=false; } }); return s||'0'; }
/* nombre complexe re + im·i */
const ctex=(re,im)=>{ re=F(re); im=F(im); if(im.z) return re.tex(); const it=(im.abs().one?'':im.abs().tex())+'i'; if(re.z) return (im.s<0?'-':'')+it; return re.tex()+(im.s<0?' - ':' + ')+it; };
const par=s=>/^-|[+\-]/.test(s.slice(1))||s.startsWith('-')?`(${s})`:s;
const mat=M=>r`\begin{pmatrix}${M.map(row=>row.map(x=>F(x).tex()).join('&')).join('\\\\')}\end{pmatrix}`;
const dmat=M=>r`\begin{vmatrix}${M.map(row=>row.map(x=>F(x).tex()).join('&')).join('\\\\')}\end{vmatrix}`;
const aug=M=>r`\left(\begin{array}{${'c'.repeat(M[0].length-1)}|c}${M.map(row=>row.map(x=>F(x).tex()).join('&')).join('\\\\')}\end{array}\right)`;
const piTex=fr=>{ fr=F(fr); if(fr.z) return '0'; const a=fr.abs(); const num=a.n===1?'\\pi':a.n+'\\pi'; return (fr.s<0?'-':'')+(a.d===1?num:r`\frac{${num}}{${a.d}}`); };
const pw=(b,e)=>e===1?b:`${b}^{${e}}`;
const sgn=n=>n<0?`- ${-n}`:`+ ${n}`;
const xm=(v,a)=>a===0?v:(a>0?`${v} - ${a}`:`${v} + ${-a}`); // v − a
const fact=n=>n<=1?1:n*fact(n-1);

const G={};   // id -> {ch, t, gen() -> {q, hint, steps[], ans}}
/* =============================== CH.1 COMPLEXES =============================== */
G['c-alg']={ch:'ma1',t:'Forme algébrique d’un quotient',gen(){
  let a=nz(-5,5),b=nz(-5,5),c=nz(-4,4),d=nz(-4,4); const N=c*c+d*d; const re=new Fr(a*c+b*d,N), im=new Fr(b*c-a*d,N);
  return {q:r`Mettre sous forme algébrique $x+iy$ : $\quad z=\dfrac{${ctex(a,b)}}{${ctex(c,d)}}$`,
    hint:'Multiplie en haut ET en bas par le conjugué du dénominateur : il devient un réel.',
    steps:[r`Conjugué du dénominateur : $\overline{${ctex(c,d)}}=${ctex(c,-d)}$. On écrit $z=\dfrac{(${ctex(a,b)})(${ctex(c,-d)})}{(${ctex(c,d)})(${ctex(c,-d)})}$.`,
      r`Dénominateur : $(${ctex(c,d)})(${ctex(c,-d)})=${c}^2+${par(''+d)}^2=${N}$ (c’est $|w|^2$, toujours réel positif).`,
      r`Numérateur (développer, avec $i^2=-1$) : $${a}\cdot${par(''+c)}${sgn(-a*d)}i${sgn(b*c)}i${sgn(-b*d)}i^2=${ctex(a*c+b*d,b*c-a*d)}$.`,
      r`On divise chaque partie par ${N}.`],
    ans:r`$z=${ctex(re,im)}$`};}};
const A6={1:['\\sqrt3','1'],2:['1','\\sqrt3'],4:['-1','\\sqrt3'],5:['-\\sqrt3','1'],7:['-\\sqrt3','-1'],8:['-1','-\\sqrt3'],10:['1','-\\sqrt3'],11:['\\sqrt3','-1']};
G['c-exp']={ch:'ma1',t:'Forme exponentielle',gen(){
  const k=ri(1,3); let a,b,rT,r2,m,cosT,sinT,th;
  const kk=s=>{ const neg=s.startsWith('-'); s=s.replace('-',''); const v=k===1?s:(s==='1'?''+k:k+s); return (neg?'-':'')+v; };
  if(Math.random()<0.55){ m=pick([1,2,4,5,7,8,10,11]); const [ca,sb]=A6[m]; a=kk(ca); b=kk(sb); rT=''+(2*k); r2=4*k*k; th=new Fr(m>6?m-12:m,6);
    cosT=ca.includes('sqrt')?(ca.startsWith('-')?r`-\frac{\sqrt3}{2}`:r`\frac{\sqrt3}{2}`):(ca.startsWith('-')?r`-\frac12`:r`\frac12`);
    sinT=sb.includes('sqrt')?(sb.startsWith('-')?r`-\frac{\sqrt3}{2}`:r`\frac{\sqrt3}{2}`):(sb.startsWith('-')?r`-\frac12`:r`\frac12`); }
  else { m=pick([1,3,5,7]); const sa=(m===1||m===7)?1:-1, sb=(m<4)?1:-1; a=''+(sa*k); b=''+(sb*k); rT=k===1?r`\sqrt2`:k+r`\sqrt2`; r2=2*k*k; th=new Fr(m>4?m-8:m,4);
    cosT=(sa<0?'-':'')+r`\frac{\sqrt2}{2}`; sinT=(sb<0?'-':'')+r`\frac{\sqrt2}{2}`; }
  const bA=b.replace('-',''); const im=bA==='1'?'i':bA.includes('sqrt')?bA.replace('\\sqrt3','')+'i\\sqrt3':bA+'i';
  const zt=`${a}${b.startsWith('-')?' - ':' + '}${im}`;
  return {q:r`Écrire sous forme trigonométrique et exponentielle : $\quad z=${zt}$`,
    hint:'Module = longueur = √(a² + b²). Puis cos θ = a/|z| et sin θ = b/|z| ; les signes de a et b donnent le quadrant.',
    steps:[r`Module : $|z|=\sqrt{a^2+b^2}=\sqrt{${r2}}=${rT}$.`,
      r`$\cos\theta=\dfrac{a}{|z|}=${cosT}$ et $\sin\theta=\dfrac{b}{|z|}=${sinT}$.`,
      r`On reconnaît un angle remarquable (cercle trigo) ; ${'Re'} ${a.startsWith('-')?'< 0':'> 0'} et Im ${b.startsWith('-')?'< 0':'> 0'} : quadrant ${a.startsWith('-')?(b.startsWith('-')?'en bas à gauche':'en haut à gauche'):(b.startsWith('-')?'en bas à droite':'en haut à droite')} ⇒ $\theta=${piTex(th)}$ (mod $2\pi$).`,
      r`Forme trigonométrique : $z=${rT}\left(\cos\left(${piTex(th)}\right)+i\sin\left(${piTex(th)}\right)\right)$.`],
    ans:r`$z=${rT}\,e^{i${piTex(th)}}$`};}};
G['c-sqrt']={ch:'ma1',t:'Racines carrées d’un complexe',gen(){
  const p=ri(1,4), q=nz(-4,4); const X=p*p-q*q, Y=2*p*q, M=p*p+q*q;
  return {q:r`Calculer les racines carrées de $\quad c=${ctex(X,Y)}$`,
    hint:'Pose w = a + ib et écris w² = c : deux équations (parties réelle et imaginaire) + une troisième gratuite avec les modules.',
    steps:[r`On cherche $w=a+ib$ tel que $w^2=c$ : $a^2-b^2+2iab=${ctex(X,Y)}$, donc $a^2-b^2=${X}$ et $2ab=${Y}$.`,
      r`Modules : $|w|^2=|c|$ ⇒ $a^2+b^2=\sqrt{${par(""+X)}^2+${par(""+Y)}^2}=\sqrt{${X*X+Y*Y}}=${M}$.`,
      r`On additionne : $2a^2=${X}+${M}=${X+M}$ ⇒ $a^2=${p*p}$ ⇒ $a=\pm${p}$. On soustrait : $2b^2=${M-X}$ ⇒ $b^2=${q*q}$ ⇒ $b=\pm${Math.abs(q)}$.`,
      r`Le signe de $2ab=${Y}$ est ${Y>0?'positif : a et b de MÊME signe':'négatif : a et b de signes CONTRAIRES'}.`],
    ans:r`$w_1=${ctex(p,q)}$ et $w_2=${ctex(-p,-q)}$`};}};
const cm=(a,b)=>[a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]];
G['c-eq2']={ch:'ma1',t:'Équation du 2ᵈ degré dans ℂ',gen(){
  if(Math.random()<0.45){ const al=ri(-3,3), be=ri(1,4); const b=-2*al, c=al*al+be*be;
    return {q:r`Résoudre dans $\mathbb C$ : $\quad z^2${b?term(b,'z'):''}${sgn(c)}=0$`,hint:'Discriminant négatif : sa racine carrée est imaginaire pure.',
      steps:[r`$\Delta=b^2-4ac=${b*b}-${4*c}=${b*b-4*c}<0$.`,r`$\Delta=${-4*be*be}=(${2*be}i)^2$ : on prend $\delta=${2*be}i$.`,r`$z=\dfrac{-b\pm\delta}{2}=\dfrac{${-b}\pm${2*be}i}{2}$.`,r`Les racines sont conjuguées (coefficients réels).`],
      ans:r`$z_1=${ctex(al,be)},\quad z_2=${ctex(al,-be)}$`}; }
  let z1,z2; do{ z1=[ri(-3,3),ri(-3,3)]; z2=[ri(-3,3),ri(-3,3)]; }while((z1[0]===z2[0]&&z1[1]===z2[1])||(z1[1]===0&&z2[1]===0));
  const S=[z1[0]+z2[0],z1[1]+z2[1]], P=cm(z1,z2), d=[z1[0]-z2[0],z1[1]-z2[1]], D=cm(d,d);
  const Sq=cm(S,S);
  return {q:r`Résoudre dans $\mathbb C$ : $\quad z^2-(${ctex(S[0],S[1])})z+(${ctex(P[0],P[1])})=0$`,hint:'Même formule qu’en réel : Δ = b² − 4ac, puis on cherche δ tel que δ² = Δ (méthode des racines carrées).',
    steps:[r`$\Delta=(${ctex(S[0],S[1])})^2-4(${ctex(P[0],P[1])})=(${ctex(Sq[0],Sq[1])})-(${ctex(4*P[0],4*P[1])})=${ctex(D[0],D[1])}$.`,
      r`Racine carrée de Δ : $\delta=a+ib$ avec $a^2-b^2=${D[0]}$, $2ab=${D[1]}$, $a^2+b^2=|\Delta|=${d[0]*d[0]+d[1]*d[1]}$ ⇒ $\delta=${ctex(d[0],d[1])}$ (ou son opposé).`,
      r`$z=\dfrac{(${ctex(S[0],S[1])})\pm(${ctex(d[0],d[1])})}{2}$.`],
    ans:r`$z_1=${ctex(z1[0],z1[1])},\quad z_2=${ctex(z2[0],z2[1])}$ (vérif : somme $=${ctex(S[0],S[1])}$, produit $=${ctex(P[0],P[1])}$)`};}};
G['c-nroot']={ch:'ma1',t:'Racines n-ièmes',gen(){
  const n=pick([3,4,3,6]), k=pick([1,2]), c=pick([[0,'1'],[1,'-1'],[new Fr(1,2),'i'],[new Fr(-1,2),'-i']]); const R=k**n;
  const ct=c[1]==='1'?''+R:c[1]==='-1'?'-'+R:(c[1]==='i'?(R===1?'i':R+'i'):(R===1?'-i':'-'+R+'i'));
  const t=F(c[0]); const roots=[]; for(let j=0;j<n;j++){ roots.push(t.add(2*j).div(n)); }
  return {q:r`Résoudre dans $\mathbb C$ : $\quad z^{${n}}=${ct}$`,hint:'Mets le second membre sous forme exponentielle, puis : module^(1/n) et (argument + 2kπ)/n.',
    steps:[r`$${ct}=${R}\,e^{i${piTex(t)}}$ (module ${R}, argument $${piTex(t)}$).`,
      r`On pose $z=\rho e^{i\theta}$ : $\rho^{${n}}e^{i${n}\theta}=${R}e^{i${piTex(t)}}$ ⇒ $\rho^{${n}}=${R}$ et $${n}\theta=${piTex(t)}+2k\pi$.`,
      r`$\rho=${k}$ et $\theta_k=\dfrac{${piTex(t)}+2k\pi}{${n}}$, $k=0,\dots,${n-1}$ : ${n} racines sur le cercle de rayon ${k}, espacées de $${piTex(new Fr(2,n))}$.`],
    ans:roots.map((a,j)=>r`$z_${j}=${k===1?'':k}e^{i${piTex(a)}}$`).join(', ')};}};
const LIN=[
 ['\\cos^2x',r`\left(\frac{e^{ix}+e^{-ix}}{2}\right)^2=\frac{e^{2ix}+2+e^{-2ix}}{4}`,r`\frac{2\cos2x+2}{4}`,r`\frac{1+\cos 2x}{2}`],
 ['\\sin^2x',r`\left(\frac{e^{ix}-e^{-ix}}{2i}\right)^2=\frac{e^{2ix}-2+e^{-2ix}}{-4}`,r`\frac{2\cos2x-2}{-4}`,r`\frac{1-\cos 2x}{2}`],
 ['\\cos^3x',r`\frac{(e^{ix}+e^{-ix})^3}{8}=\frac{e^{3ix}+3e^{ix}+3e^{-ix}+e^{-3ix}}{8}`,r`\frac{2\cos3x+6\cos x}{8}`,r`\frac{3\cos x+\cos3x}{4}`],
 ['\\sin^3x',r`\frac{(e^{ix}-e^{-ix})^3}{(2i)^3}=\frac{e^{3ix}-3e^{ix}+3e^{-ix}-e^{-3ix}}{-8i}`,r`\frac{2i\sin3x-6i\sin x}{-8i}`,r`\frac{3\sin x-\sin3x}{4}`],
 ['\\cos x\\sin^2x',r`\frac{e^{ix}+e^{-ix}}{2}\cdot\frac{e^{2ix}-2+e^{-2ix}}{-4}=\frac{e^{3ix}-e^{ix}-e^{-ix}+e^{-3ix}}{-8}`,r`\frac{2\cos3x-2\cos x}{-8}`,r`\frac{\cos x-\cos3x}{4}`],
 ['\\cos^4x',r`\frac{(e^{ix}+e^{-ix})^4}{16}=\frac{e^{4ix}+4e^{2ix}+6+4e^{-2ix}+e^{-4ix}}{16}`,r`\frac{2\cos4x+8\cos2x+6}{16}`,r`\frac{3+4\cos2x+\cos4x}{8}`],
 ['\\sin^2x\\cos^2x',r`\left(\frac{\sin2x}{2}\right)^2=\frac{\sin^2 2x}{4}`,r`\frac14\cdot\frac{1-\cos4x}{2}`,r`\frac{1-\cos4x}{8}`]];
G['c-lin']={ch:'ma1',t:'Linéariser (Euler)',gen(){ const [f,e1,e2,res]=pick(LIN);
  return {q:r`Linéariser $\;${f}\;$ (l’écrire comme somme de $\cos(kx)$ / $\sin(kx)$), puis en déduire une primitive.`,hint:'Remplace cos et sin par les formules d’Euler, développe (binôme), puis regroupe chaque e^{ikx} avec son conjugué e^{−ikx}.',
    steps:[r`Euler : $\cos x=\frac{e^{ix}+e^{-ix}}{2}$, $\sin x=\frac{e^{ix}-e^{-ix}}{2i}$.`,r`$${f}=${e1}$`,r`On regroupe : $e^{ikx}+e^{-ikx}=2\cos kx$ et $e^{ikx}-e^{-ikx}=2i\sin kx$ : $${f}=${e2}$.`,r`Une primitive s’obtient terme à terme ($\int\cos kx=\frac{\sin kx}{k}$, $\int\sin kx=-\frac{\cos kx}{k}$).`],
    ans:r`$${f}=${res}$`};}};
/* =============================== CH.2 INTÉGRALES =============================== */
G['i-poly']={ch:'ma2',t:'Intégrale d’un polynôme',gen(){
  const a=nz(-3,3),b=ri(-4,4),c=ri(-5,5),p=ri(-2,1),q=p+ri(1,3);
  const Fx=x=>new Fr(a*x**3,3).add(new Fr(b*x*x,2)).add(c*x);
  const prim=sum([[new Fr(a,3),'x^3'],[new Fr(b,2),'x^2'],[c,'x']]);
  return {q:r`Calculer $\displaystyle I=\int_{${p}}^{${q}}\left(${sum([[a,'x^2'],[b,'x'],[c,'']])}\right)\mathrm dx$`,hint:'Primitive terme à terme (xⁿ → xⁿ⁺¹/(n+1)), puis F(borne haute) − F(borne basse).',
    steps:[r`Primitive : $F(x)=${prim}$.`,r`$F(${q})=${Fx(q).tex()}$ et $F(${p})=${Fx(p).tex()}$.`,r`$I=F(${q})-F(${p})$.`],ans:r`$I=${Fx(q).sub(Fx(p)).tex()}$`};}};
G['i-ipp']={ch:'ma2',t:'Intégration par parties',gen(){
  const v=pick(['exp','cos','sin','ln']);
  if(v==='exp'){ const k=pick([1,2,3,-1,-2]); const kt=k===1?'':k===-1?'-':k;
    return {q:r`Calculer $\displaystyle I=\int_0^1 x\,e^{${kt}x}\,\mathrm dx$`,hint:'Produit polynôme × exponentielle : on DÉRIVE le polynôme (u = x), on INTÈGRE l’exponentielle.',
      steps:[r`$u=x$, $v'=e^{${kt}x}$ ⇒ $u'=1$, $v=\frac{1}{${k}}e^{${kt}x}$.`,r`$I=\left[\frac{x\,e^{${kt}x}}{${k}}\right]_0^1-\frac1{${k}}\int_0^1e^{${kt}x}\mathrm dx=\frac{e^{${k}}}{${k}}-\frac{1}{${k}}\cdot\frac{e^{${k}}-1}{${k}}$.`,r`On met au même dénominateur $${k*k}$.`],
      ans:k===1?r`$I=1$`:r`$I=\dfrac{${k-1===1?'':k-1===-1?'-':k-1}e^{${k}}+1}{${k*k}}$`}; }
  if(v==='ln'){ const n=pick([0,1,2]); const N=n+1;
    return {q:r`Calculer $\displaystyle I=\int_1^e ${n?pw('x',n):''}\ln x\,\mathrm dx$`,hint:'ln x ne s’intègre pas directement mais se DÉRIVE très bien (1/x) : prends u = ln x.',
      steps:[r`$u=\ln x$, $v'=${n?pw('x',n):'1'}$ ⇒ $u'=\frac1x$, $v=\frac{x^{${N}}}{${N}}$.`,r`$I=\left[\frac{x^{${N}}\ln x}{${N}}\right]_1^e-\int_1^e\frac{x^{${N}}}{${N}}\cdot\frac1x\mathrm dx=\frac{e^{${N}}}{${N}}-\frac{1}{${N}}\int_1^e x^{${n}}\mathrm dx$.`,r`$\int_1^e x^{${n}}\mathrm dx=\frac{e^{${N}}-1}{${N}}$.`],
      ans:r`$I=\dfrac{${n?n+'e^{'+N+'}+1':'1'}}{${N*N}}$`}; }
  const k=pick([1,2,3]); const kx=k===1?'x':k+'x';
  if(v==='cos') return {q:r`Calculer $\displaystyle I=\int_0^{${piTex(new Fr(1,k))}} x\cos(${kx})\,\mathrm dx$`,hint:'u = x (se simplifie en dérivant), v′ = cos.',
    steps:[r`$u=x$, $v'=\cos(${kx})$ ⇒ $v=\frac{\sin(${kx})}{${k}}$.`,r`$I=\left[\frac{x\sin(${kx})}{${k}}\right]_0^{${piTex(new Fr(1,k))}}-\frac1{${k}}\int_0^{${piTex(new Fr(1,k))}}\sin(${kx})\mathrm dx=0-\frac1{${k}}\left[-\frac{\cos(${kx})}{${k}}\right]_0^{${piTex(new Fr(1,k))}}$.`,r`$=\frac{1}{${k*k}}(\cos\pi-\cos0)=\frac{-2}{${k*k}}$.`],ans:r`$I=${new Fr(-2,k*k).tex()}$`};
  return {q:r`Calculer $\displaystyle I=\int_0^{${piTex(new Fr(1,k))}} x\sin(${kx})\,\mathrm dx$`,hint:'u = x, v′ = sin (attention au signe de la primitive de sin).',
    steps:[r`$u=x$, $v'=\sin(${kx})$ ⇒ $v=-\frac{\cos(${kx})}{${k}}$.`,r`$I=\left[-\frac{x\cos(${kx})}{${k}}\right]_0^{${piTex(new Fr(1,k))}}+\frac1{${k}}\int_0^{${piTex(new Fr(1,k))}}\cos(${kx})\mathrm dx=-\frac{${piTex(new Fr(1,k))}\cos\pi}{${k}}+0$.`],ans:r`$I=${piTex(new Fr(1,k*k))}$`};}};
G['i-sub']={ch:'ma2',t:'Changement de variable',gen(){
  const v=pick(['pow','sin','log']);
  if(v==='pow'){ const n=ri(1,4); return {q:r`Calculer $\displaystyle I=\int_0^1 x\,(x^2+1)^{${n}}\,\mathrm dx$`,hint:'On reconnaît (presque) u′·uⁿ avec u = x² + 1.',
    steps:[r`$u=x^2+1$ ⇒ $\mathrm du=2x\,\mathrm dx$ ⇒ $x\,\mathrm dx=\frac12\mathrm du$. Bornes : $x=0\to u=1$, $x=1\to u=2$.`,r`$I=\frac12\int_1^2u^{${n}}\mathrm du=\frac12\left[\frac{u^{${n+1}}}{${n+1}}\right]_1^2=\frac{2^{${n+1}}-1}{${2*(n+1)}}$.`],ans:r`$I=${new Fr(2**(n+1)-1,2*(n+1)).tex()}$`}; }
  if(v==='sin'){ const n=ri(1,5); return {q:r`Calculer $\displaystyle I=\int_0^{\pi/2}\cos x\,\sin^{${n}}x\,\mathrm dx$`,hint:'cos x est la dérivée de sin x : pose u = sin x.',
    steps:[r`$u=\sin x$, $\mathrm du=\cos x\,\mathrm dx$ ; $x=0\to u=0$, $x=\frac\pi2\to u=1$.`,r`$I=\int_0^1u^{${n}}\mathrm du=\frac1{${n+1}}$.`],ans:r`$I=\frac1{${n+1}}$`}; }
  const a=ri(1,4); return {q:r`Calculer $\displaystyle I=\int_0^1 \frac{x}{x^2+${a}}\,\mathrm dx$`,hint:'Le numérateur est (à un facteur près) la dérivée du dénominateur : forme u′/u.',
    steps:[r`$u=x^2+${a}$, $\mathrm du=2x\,\mathrm dx$ ; $u$ va de ${a} à ${a+1}.`,r`$I=\frac12\int_{${a}}^{${a+1}}\frac{\mathrm du}{u}=\frac12\left[\ln u\right]_{${a}}^{${a+1}}$.`],ans:r`$I=\frac12\ln\frac{${a+1}}{${a}}${a===1?'=\\frac{\\ln2}{2}':''}$`};}};
G['i-frac']={ch:'ma2',t:'Fraction rationnelle (éléments simples)',gen(){
  let a,b; do{a=ri(-3,3);b=ri(-3,3);}while(a===b); const A=nz(-3,3),B=nz(-3,3); const al=A+B, be=-(A*b+B*a);
  const m=Math.max(a,b), x0=m+1, x1=m+ri(2,3);
  const den=`(${xm('x',a)})(${xm('x',b)})`;
  const ln=(c,p,q)=>`${term(c,'',true)===''?'':''}`;
  return {q:r`Calculer $\displaystyle I=\int_{${x0}}^{${x1}}\frac{${sum([[al,'x'],[be,'']])}}{${den}}\,\mathrm dx$`,hint:'Décompose en A/(x − a) + B/(x − b) ; « méthode du cache » : A = numérateur évalué en x = a, divisé par le reste du dénominateur.',
    steps:[r`On cherche $\frac{${sum([[al,'x'],[be,'']])}}{${den}}=\frac{A}{${xm('x',a)}}+\frac{B}{${xm('x',b)}}$.`,
      r`On multiplie par $(${xm('x',a)})$ et on fait $x=${a}$ : $A=\frac{${al}\cdot${par(''+a)}${sgn(be)}}{${a}-${par(''+b)}}=${A}$. De même en $x=${b}$ : $B=${B}$.`,
      r`$\int\frac{\mathrm dx}{x-c}=\ln|x-c|$ : $I=${A}\left[\ln|${xm('x',a)}|\right]_{${x0}}^{${x1}}${B<0?'-':'+'}${Math.abs(B)}\left[\ln|${xm('x',b)}|\right]_{${x0}}^{${x1}}$.`],
    ans:r`$I=${term(A,r`\ln\frac{${x1-a}}{${x0-a}}`,true)}${term(B,r`\ln\frac{${x1-b}}{${x0-b}}`,false)}$`};}};
/* =============================== CH.3 EDO =============================== */
G['e-o1']={ch:'ma3',t:'EDO du 1ᵉʳ ordre + Cauchy',gen(){
  const k=pick([1,2,3,-1,2]); const u0=ri(-3,4); const kt=k===1?'':k===-1?'-':''+k; const eq=`u'${k>0?'+':'-'}${Math.abs(k)===1?'':Math.abs(k)}u`;
  const hom=r`u_h(t)=Ce^{${k===1?'-':k===-1?'':-k}t}`; const ek=k===1?'e^{-t}':k===-1?'e^{t}':`e^{${-k}t}`;
  const v=pick(['c','exp','res','poly']);
  if(v==='c'){ const c=nz(-6,6); const up=new Fr(c,k); const C=F(u0).sub(up);
    return {q:r`Résoudre $\;${eq}=${c}\;$ avec $u(0)=${u0}$.`,hint:'Solution = homogène (exponentielle) + particulière (ici une constante).',
      steps:[r`Homogène $${eq}=0$ : $${hom}$.`,r`Second membre constant ⇒ on cherche $u_p=K$ : $${k}K=${c}$ ⇒ $K=${up.tex()}$.`,r`Solution générale : $u(t)=C${ek}${term(up,'',false)}$.`,r`$u(0)=C${term(up,'',false)}=${u0}$ ⇒ $C=${C.tex()}$.`],
      ans:r`$u(t)=${sum([[C,ek],[up,'']])}$`}; }
  if(v==='exp'){ let m; do{m=nz(-3,3);}while(m===-k); const P=nz(-5,5); const A=new Fr(P,m+k); const C=F(u0).sub(A); const em=m===1?'e^{t}':m===-1?'e^{-t}':`e^{${m}t}`;
    return {q:r`Résoudre $\;${eq}=${P===1?'':P===-1?'-':P}${em}\;$ avec $u(0)=${u0}$.`,hint:`Second membre exponentiel e^{mt} avec m ≠ ${-k} (pas racine) : cherche u_p = A·e^{mt}.`,
      steps:[r`Homogène : $${hom}$.`,r`$u_p=A${em}$ ⇒ $u_p'=${m}A${em}$ ; on remplace : $(${m}${sgn(k)})A=${P}$ ⇒ $A=${A.tex()}$.`,r`$u(t)=C${ek}${term(A,em,false)}$.`,r`$u(0)=C${term(A,'',false)}=${u0}$ ⇒ $C=${C.tex()}$.`],
      ans:r`$u(t)=${sum([[C,ek],[A,em]])}$`}; }
  if(v==='res'){ const P=nz(-4,4);
    return {q:r`Résoudre $\;${eq}=${P===1?'':P===-1?'-':P}${ek}\;$ avec $u(0)=${u0}$.`,hint:'Attention : l’exponentielle du second membre est AUSSI solution de l’homogène (résonance) → on cherche u_p = A·t·e^{mt}.',
      steps:[r`Homogène : $${hom}$. Le second membre est proportionnel à $u_h$ : cas « résonant ».`,r`$u_p=At${ek}$ ⇒ $u_p'=A${ek}${-k>0?'+':'-'}${Math.abs(k)===1?'':Math.abs(k)}At${ek}$ ; dans l’équation les termes en $t$ s’annulent : $A=${P}$.`,r`$u(t)=(C${sgn(P)}t)${ek}$ et $u(0)=C=${u0}$.`],
      ans:r`$u(t)=(${sum([[u0,''],[P,'t']])})${ek}$`}; }
  const al=nz(-4,4), be=ri(-4,4); const a=new Fr(al,k), b=F(be).sub(a).div(k); const C=F(u0).sub(b);
  return {q:r`Résoudre $\;${eq}=${sum([[al,'t'],[be,'']])}\;$ avec $u(0)=${u0}$.`,hint:'Second membre polynôme de degré 1 (et le coefficient de u est non nul) : cherche u_p = at + b.',
    steps:[r`Homogène : $${hom}$.`,r`$u_p=at+b$ : $a${k>0?'+':'-'}${Math.abs(k)===1?'':Math.abs(k)}(at+b)=${sum([[al,'t'],[be,'']])}$. On identifie : $${k}a=${al}$ et $a${sgn(k)}b=${be}$.`,r`$a=${a.tex()}$, $b=${b.tex()}$.`,r`$u(0)=C${term(b,'',false)}=${u0}$ ⇒ $C=${C.tex()}$.`],
    ans:r`$u(t)=${sum([[C,ek],[a,'t'],[b,'']])}$`};}};
const eexp=(r0,t='t')=>{ r0=F(r0); if(r0.z) return ''; return r0.one?`e^{${t}}`:(r0.n===-1&&r0.d===1)?`e^{-${t}}`:`e^{${r0.tex()}${t}}`; };
G['e-o2h']={ch:'ma3',t:'EDO du 2ᵈ ordre homogène + Cauchy',gen(){
  const kind=pick(['r','d','c','c']); const u0=ri(-2,3), v0=ri(-3,3);
  let p,q,ans,steps,char,gen;
  if(kind==='r'){ let r1,r2; do{r1=ri(-4,2);r2=ri(-4,2);}while(r1===r2); p=-(r1+r2); q=r1*r2; const A=new Fr(v0-r2*u0,r1-r2), B=F(u0).sub(A);
    char=r`r^2${term(p,'r')}${q?sgn(q):''}=0`; gen=r`u(t)=A${eexp(r1)||''}+B${eexp(r2)||''}`;
    steps=[r`Équation caractéristique : $${char}$, racines $r_1=${r1}$, $r_2=${r2}$ (réelles distinctes).`,r`$${gen}$.`,r`$u(0)=A+B=${u0}$ et $u'(0)=${r1}A${sgn(r2).replace(/ (\d+)/,' $1')}B=${v0}$.`,r`On résout : $A=${A.tex()}$, $B=${B.tex()}$.`];
    ans=r`$u(t)=${sum([[A,eexp(r1)],[B,eexp(r2)]])}$`; }
  else if(kind==='d'){ const r0=ri(-3,2); p=-2*r0; q=r0*r0; const B=v0-r0*u0;
    char=r`r^2${term(p,'r')}${q?sgn(q):''}=0`; gen=r`u(t)=(A+Bt)${eexp(r0)}`;
    steps=[r`$${char}$ : $\Delta=0$, racine double $r=${r0}$.`,r`$${gen}$.`,r`$u(0)=A=${u0}$ ; $u'(t)=(B+${r0}(A+Bt))${eexp(r0)}$ ⇒ $u'(0)=B${sgn(r0)}A=${v0}$ ⇒ $B=${B}$.`];
    ans=r`$u(t)=(${sum([[u0,''],[B,'t']])})${eexp(r0)}$`; }
  else { const al=ri(-2,1), be=ri(1,3); p=-2*al; q=al*al+be*be; const B=new Fr(v0-al*u0,be);
    char=r`r^2${term(p,'r')}${sgn(q)}=0`; const bt=be===1?'t':be+'t';
    steps=[r`$${char}$ : $\Delta=${p*p-4*q}<0$, racines $r=${ctex(al,be)}$ et $${ctex(al,-be)}$ (forme $\alpha\pm i\beta$).`,r`Solution réelle : $u(t)=${eexp(al)}\left(A\cos ${bt}+B\sin ${bt}\right)$ (α = ${al} amortit, β = ${be} fait osciller).`,r`$u(0)=A=${u0}$ ; $u'(0)=${al}A+${be}B=${v0}$ ⇒ $B=${B.tex()}$.`];
    ans=r`$u(t)=${eexp(al)}\left(${sum([[u0,`\\cos ${bt}`],[B,`\\sin ${bt}`]])}\right)$`; }
  return {q:r`Résoudre $\;u''${term(p,"u'")}${q?term(q,'u'):''}=0\;$ avec $u(0)=${u0}$, $u'(0)=${v0}$.`,hint:'Équation caractéristique r² + pr + q = 0 : le signe de Δ décide de la FORME de la solution (2 exponentielles, (A + Bt)e^{rt}, ou e^{αt}(A cos + B sin)).',steps,ans};}};
G['e-o2s']={ch:'ma3',t:'EDO du 2ᵈ ordre avec second membre',gen(){
  let r1,r2; do{r1=ri(-4,1);r2=ri(-4,1);}while(r1===r2); const p=-(r1+r2), q=r1*r2;
  let m; do{m=nz(-3,3);}while(m===r1||m===r2); const K=nz(-6,6); const den=m*m+p*m+q; const A=new Fr(K,den);
  const em=eexp(m);
  return {q:r`Donner toutes les solutions de $\;u''${term(p,"u'")}${q?term(q,'u'):''}=${K===1?'':K===-1?'-':K}${em}$.`,hint:'Solution générale = solution homogène (2 constantes) + UNE solution particulière ; e^{mt} avec m non racine ⇒ u_p = A e^{mt}.',
    steps:[r`Caractéristique : $r^2${term(p,'r')}${q?sgn(q):''}=0$ ⇒ $r_1=${r1}$, $r_2=${r2}$ ⇒ $u_h=\lambda${eexp(r1)||''}+\mu${eexp(r2)||''}$.`,
      r`$${m}$ n’est pas racine ⇒ $u_p=A${em}$ : $(${par(''+m)}^2${term(p,'\\cdot'+par(''+m))}${q?sgn(q):''})A=${K}$ soit $${den}A=${K}$.`,r`$A=${A.tex()}$.`],
    ans:r`$u(t)=\lambda${eexp(r1)||''}+\mu${eexp(r2)||''}${term(A,em,false)}$, $\;(\lambda,\mu)\in\mathbb R^2$`};}};
/* =============================== CH.4 INTÉGRALES MULTIPLES =============================== */
const mono=(v,n)=>n===0?'':n===1?v:`${v}^{${n}}`;
G['d-rect']={ch:'ma4',t:'Intégrale double sur un rectangle',gen(){
  const m=ri(0,2),n=ri(0,2),a=ri(1,3),b=ri(1,3); const I1=new Fr(a**(m+1),m+1), I2=new Fr(b**(n+1),n+1); const f=(mono('x',m)+mono('y',n))||'1';
  return {q:r`Calculer $\displaystyle\iint_D ${f}\,\mathrm dx\,\mathrm dy$ avec $D=[0,${a}]\times[0,${b}]$.`,hint:'Domaine rectangle + fonction produit g(x)h(y) : l’intégrale double = produit de deux intégrales simples.',
    steps:[r`Bornes constantes : $\displaystyle\int_0^{${a}}\left(\int_0^{${b}}${f}\,\mathrm dy\right)\mathrm dx$.`,r`La fonction se sépare : $\displaystyle\left(\int_0^{${a}}${mono('x',m)||'1'}\,\mathrm dx\right)\left(\int_0^{${b}}${mono('y',n)||'1'}\,\mathrm dy\right)=${I1.tex()}\times${I2.tex()}$.`],ans:r`$${I1.mul(I2).tex()}$`};}};
G['d-tri']={ch:'ma4',t:'Intégrale double sur un triangle',gen(){
  const L=ri(1,3); const f=pick(['1','x','xy','x+y']);
  const inner={'1':r`L-x`,'x':r`x(L-x)`,'xy':r`\frac{x(L-x)^2}{2}`,'x+y':r`\frac{L^2-x^2}{2}`}[f].replace(/L/g,L);
  const val={'1':new Fr(L*L,2),'x':new Fr(L**3,6),'xy':new Fr(L**4,24),'x+y':new Fr(L**3,3)}[f];
  return {q:r`Calculer $\displaystyle\iint_D (${f})\,\mathrm dx\,\mathrm dy$ avec $D=\{x\ge0,\ y\ge0,\ x+y\le ${L}\}$.`,hint:'Dessine le triangle. Fixe x (tranche verticale) : y va de 0 jusqu’à la droite y = L − x.',
    steps:[r`Description : $0\le x\le ${L}$ et, $x$ fixé, $0\le y\le ${L}-x$.`,r`Intégrale intérieure (en $y$) : $\displaystyle\int_0^{${L}-x}(${f})\,\mathrm dy=${inner}$.`,r`Intégrale extérieure : $\displaystyle\int_0^{${L}}${inner}\,\mathrm dx$.`],ans:r`$${val.tex()}$`};}};
G['d-pol']={ch:'ma4',t:'Intégrale double en polaires',gen(){
  const dom=pick([['disque',2,'D=\\{x^2+y^2\\le R^2\\}'],['demi',1,'D=\\{x^2+y^2\\le R^2,\\ y\\ge0\\}'],['quart',new Fr(1,2),'D=\\{x^2+y^2\\le R^2,\\ x\\ge0,\\ y\\ge0\\}'],['couronne',2,'D=\\{R_1^2\\le x^2+y^2\\le R^2\\}']]);
  const R=ri(1,3), R1=dom[0]==='couronne'?ri(1,R)-1||1:0; const R2=dom[0]==='couronne'?R1+ri(1,2):R; const Th=F(dom[1]);
  const f=pick(['1','x^2+y^2','\\sqrt{x^2+y^2}','1/(1+x^2+y^2)']);
  let g,rad,ins;
  if(f==='1'){ g='r'; rad=new Fr(R2*R2-R1*R1,2); ins=r`\left[\frac{r^2}{2}\right]`; }
  else if(f==='x^2+y^2'){ g='r^3'; rad=new Fr(R2**4-R1**4,4); ins=r`\left[\frac{r^4}{4}\right]`; }
  else if(f==='\\sqrt{x^2+y^2}'){ g='r^2'; rad=new Fr(R2**3-R1**3,3); ins=r`\left[\frac{r^3}{3}\right]`; }
  else { g=r`\frac{r}{1+r^2}`; ins=r`\left[\frac12\ln(1+r^2)\right]`; }
  const Dt=dom[2].replace('R_1',R1).replace('R^2',R2*R2).replace('R^2',R2*R2);
  const ft=f==='1/(1+x^2+y^2)'?r`\frac{1}{1+x^2+y^2}`:f;
  const ans=f==='1/(1+x^2+y^2)'?r`${piTex(Th.div(2))}\ln\frac{${1+R2*R2}}{${1+R1*R1}}`:piTex(Th.mul(rad));
  return {q:r`Calculer $\displaystyle\iint_D ${ft}\,\mathrm dx\,\mathrm dy$ avec $${Dt}$.`,hint:'Domaine rond + x² + y² dans la fonction ⇒ polaires : x = r cos θ, y = r sin θ, dx dy = r dr dθ (ne pas oublier le r !).',
    steps:[r`Polaires : $${R1}\le r\le ${R2}$, $\theta\in[0,${piTex(Th)}]$ ; $x^2+y^2=r^2$ et $\mathrm dx\,\mathrm dy=r\,\mathrm dr\,\mathrm d\theta$.`,r`L’intégrande devient $${g}$ ; tout se sépare : $\displaystyle\int_0^{${piTex(Th)}}\mathrm d\theta\times\int_{${R1}}^{${R2}}${g}\,\mathrm dr$.`,r`$\displaystyle\int_{${R1}}^{${R2}}${g}\,\mathrm dr=${ins}_{${R1}}^{${R2}}${rad?'='+rad.tex():''}$.`],ans:r`$${ans}$`};}};
G['d-cyl']={ch:'ma4',t:'Intégrale triple (cylindriques)',gen(){
  const R=ri(1,3),h=ri(1,4); const f=pick(['1','z','x^2+y^2']);
  const val={'1':new Fr(R*R*h),'z':new Fr(R*R*h*h,2),'x^2+y^2':new Fr(R**4*h,2)}[f];
  const g={'1':'r','z':'rz','x^2+y^2':'r^3'}[f];
  return {q:r`Calculer $\displaystyle\iiint_V ${f}\,\mathrm dx\,\mathrm dy\,\mathrm dz$ où $V$ est le cylindre $x^2+y^2\le ${R*R}$, $0\le z\le ${h}$.`,hint:'Axe de symétrie Oz ⇒ cylindriques : dx dy dz = r dr dθ dz.',
    steps:[r`$0\le r\le ${R}$, $0\le\theta\le2\pi$, $0\le z\le ${h}$ ; $\mathrm dV=r\,\mathrm dr\,\mathrm d\theta\,\mathrm dz$.`,r`Intégrande × r : $${g}$ ; les trois intégrales se séparent.`,r`$\displaystyle 2\pi\times\int_0^{${R}}${f==='x^2+y^2'?'r^3':'r'}\,\mathrm dr\times\int_0^{${h}}${f==='z'?'z':'1'}\,\mathrm dz$.`],ans:r`$${piTex(val)}$${f==='1'?' (= πR²h, le volume du cylindre ✓)':''}`};}};
/* =============================== CH.5 MATRICES =============================== */
const rmat=(n,m,a=-3,b=3)=>Array.from({length:n},()=>Array.from({length:m},()=>ri(a,b)));
const mmul=(A,B)=>A.map(row=>B[0].map((_,j)=>row.reduce((s,x,k)=>s+x*B[k][j],0)));
const det2=M=>M[0][0]*M[1][1]-M[0][1]*M[1][0];
const det3=M=>M[0][0]*(M[1][1]*M[2][2]-M[1][2]*M[2][1])-M[0][1]*(M[1][0]*M[2][2]-M[1][2]*M[2][0])+M[0][2]*(M[1][0]*M[2][1]-M[1][1]*M[2][0]);
G['m-prod']={ch:'ma5',t:'Produit de matrices',gen(){
  const [n,p,m]=pick([[2,2,2],[2,3,2],[3,3,1],[3,2,3],[2,3,3]]); const A=rmat(n,p),B=rmat(p,m),C=mmul(A,B);
  const ex=A[0].map((x,k)=>`${par(''+x)}\\times${par(''+B[k][0])}`).join('+');
  return {q:r`Calculer $AB$ avec $A=${mat(A)}$ et $B=${mat(B)}$.`,hint:'Coefficient (i, j) = ligne i de A « scalaire » colonne j de B. Vérifie d’abord les tailles.',
    steps:[r`Tailles : $(${n}\times${p})\cdot(${p}\times${m})$ ⇒ le produit existe et $AB$ est de taille $${n}\times${m}$.`,r`Exemple : $c_{11}=${ex}=${C[0][0]}$.`,r`On fait de même pour chaque case (ligne de A, colonne de B).`],ans:r`$AB=${mat(C)}$`};}};
G['m-det']={ch:'ma5',t:'Déterminant 2×2 / 3×3',gen(){
  if(Math.random()<0.3){ const M=rmat(2,2,-5,6); return {q:r`Calculer $\det A$ pour $A=${mat(M)}$.`,hint:'ad − bc (diagonale moins anti-diagonale).',steps:[r`$${dmat(M)}=${par(''+M[0][0])}\times${par(''+M[1][1])}-${par(''+M[0][1])}\times${par(''+M[1][0])}$.`],ans:r`$\det A=${det2(M)}$`}; }
  const M=rmat(3,3,-2,3); const m=j=>[[M[1][(j+1)%3],M[1][(j+2)%3]],[M[2][(j+1)%3],M[2][(j+2)%3]]].map(r0=>r0);
  const minor=j=>{ const cols=[0,1,2].filter(c=>c!==j); return [[M[1][cols[0]],M[1][cols[1]]],[M[2][cols[0]],M[2][cols[1]]]]; };
  const d=[0,1,2].map(j=>det2(minor(j)));
  return {q:r`Calculer $\det A$ pour $A=${mat(M)}$.`,hint:'Développe selon la 1ʳᵉ ligne (signes + − +), ou selon la ligne/colonne qui a le plus de zéros. Sarrus marche aussi en 3×3.',
    steps:[r`$\det A=${par(''+M[0][0])}${dmat(minor(0))}-${par(''+M[0][1])}${dmat(minor(1))}+${par(''+M[0][2])}${dmat(minor(2))}$.`,r`Mineurs : $${d[0]}$, $${d[1]}$, $${d[2]}$.`,r`$\det A=${par(''+M[0][0])}\times${par(''+d[0])}-${par(''+M[0][1])}\times${par(''+d[1])}+${par(''+M[0][2])}\times${par(''+d[2])}$.`],ans:r`$\det A=${det3(M)}$ ${det3(M)===0?'⇒ A n’est PAS inversible':'≠ 0 ⇒ A inversible'}`};}};
G['m-inv2']={ch:'ma5',t:'Inverse d’une matrice 2×2',gen(){
  let M; do{M=rmat(2,2,-4,5);}while(det2(M)===0); const d=det2(M); const Inv=[[new Fr(M[1][1],d),new Fr(-M[0][1],d)],[new Fr(-M[1][0],d),new Fr(M[0][0],d)]];
  return {q:r`Inverser $A=${mat(M)}$ si possible.`,hint:'det ≠ 0 ? Puis : échanger la diagonale, changer le signe de l’anti-diagonale, diviser par le déterminant.',
    steps:[r`$\det A=${d}\neq0$ ⇒ $A$ est inversible.`,r`$A^{-1}=\frac{1}{\det A}\begin{pmatrix}d&-b\\-c&a\end{pmatrix}=\frac{1}{${d}}${mat([[M[1][1],-M[0][1]],[-M[1][0],M[0][0]]])}$.`,r`Vérification conseillée : $AA^{-1}=I_2$.`],ans:r`$A^{-1}=${mat(Inv)}$`};}};
G['m-gauss']={ch:'ma5',t:'Système 3×3 par le pivot de Gauss',gen(){
  let M,sol; do{ M=rmat(3,3,-3,3); M[0][0]=pick([1,1,2,-1]); sol=[ri(-3,3),ri(-3,3),ri(-3,3)]; }while(det3(M)===0||M.flat().filter(x=>x===0).length>3);
  const b=M.map(row=>row.reduce((s,x,k)=>s+x*sol[k],0)); let T=M.map((row,i)=>[...row,b[i]]); const st=[];
  const v=['x','y','z']; const eqs=T.map(row=>sum(row.slice(0,3).map((c,k)=>[c,v[k]]))+' = '+row[3]);
  st.push(r`Matrice augmentée : $${aug(T)}$.`);
  const red=row=>{ const g=row.reduce((a,x)=>gcd(a,x),0); return g>1?row.map(x=>x/g):row; };
  // pivot 1
  const p=T[0][0]; let ops=[];
  for(let i=1;i<3;i++){ const c=T[i][0]; if(c===0) continue; T[i]=T[i].map((x,k)=>p*x-c*T[0][k]); ops.push(r`L_${i+1}\leftarrow ${p===1?'':p===-1?'-':p}L_${i+1}${c>0?'-':'+'}${Math.abs(c)===1?'':Math.abs(c)}L_1`); }
  T=T.map((row,i)=>i?red(row):row);
  st.push(r`On annule la 1ʳᵉ colonne sous le pivot ${p} : $${ops.join(',\\ ')||'(déjà fait)'}$ (et on simplifie) : $${aug(T)}$.`);
  if(T[1][1]===0){ [T[1],T[2]]=[T[2],T[1]]; st.push(r`Pivot nul : on échange $L_2$ et $L_3$ : $${aug(T)}$.`); }
  const q=T[1][1], c2=T[2][1]; if(c2!==0){ T[2]=red(T[2].map((x,k)=>q*x-c2*T[1][k])); st.push(r`$L_3\leftarrow ${q===1?'':q===-1?'-':q}L_3${c2>0?'-':'+'}${Math.abs(c2)===1?'':Math.abs(c2)}L_2$ : système échelonné $${aug(T)}$.`); }
  const z=new Fr(T[2][3],T[2][2]); const y=F(T[1][3]).sub(z.mul(T[1][2])).div(T[1][1]); const x=F(T[0][3]).sub(y.mul(T[0][1])).sub(z.mul(T[0][2])).div(T[0][0]);
  st.push(r`Remontée : $L_3$ ⇒ $z=${z.tex()}$ ; $L_2$ ⇒ $y=${y.tex()}$ ; $L_1$ ⇒ $x=${x.tex()}$.`);
  return {q:r`Résoudre par la méthode du pivot de Gauss : $\left\{\begin{array}{l}${eqs.join('\\\\')}\end{array}\right.$`,hint:'Échelonner : on se sert de L₁ pour éliminer x de L₂ et L₃, puis de L₂ pour éliminer y de L₃. Ensuite on remonte de z vers x.',steps:st,ans:r`$(x,y,z)=(${sol.join(',\\ ')})$ — solution unique (déterminant non nul)`};}};
G['m-cramer']={ch:'ma5',t:'Système 2×2 par Cramer',gen(){
  let M; do{M=rmat(2,2,-5,5);}while(det2(M)===0); const s=[ri(-4,4),ri(-4,4)]; const b=M.map(r0=>r0[0]*s[0]+r0[1]*s[1]); const d=det2(M);
  const Dx=det2([[b[0],M[0][1]],[b[1],M[1][1]]]), Dy=det2([[M[0][0],b[0]],[M[1][0],b[1]]]);
  return {q:r`Résoudre avec les formules de Cramer : $\left\{\begin{array}{l}${sum([[M[0][0],'x'],[M[0][1],'y']])}=${b[0]}\\${sum([[M[1][0],'x'],[M[1][1],'y']])}=${b[1]}\end{array}\right.$`,hint:'x = det(A avec la colonne des x remplacée par le second membre) / det A ; idem pour y.',
    steps:[r`$\det A=${dmat(M)}=${d}\neq0$ : système de Cramer.`,r`$x=\dfrac{${dmat([[b[0],M[0][1]],[b[1],M[1][1]]])}}{${d}}=\dfrac{${Dx}}{${d}}$.`,r`$y=\dfrac{${dmat([[M[0][0],b[0]],[M[1][0],b[1]]])}}{${d}}=\dfrac{${Dy}}{${d}}$.`],ans:r`$x=${new Fr(Dx,d).tex()},\quad y=${new Fr(Dy,d).tex()}$`};}};
G['m-param']={ch:'ma5',t:'Matrice à paramètre : quand est-elle inversible ?',gen(){
  let r1,r2; do{r1=ri(-3,3);r2=ri(-3,3);}while(r1===r2); const a=ri(-2,2), d=-(r1+r2)-a, c=a*d-r1*r2;
  const e=(k)=>k===0?'\\alpha':(k>0?r`\alpha+${k}`:r`\alpha-${-k}`);
  return {q:r`Pour quelles valeurs de $\alpha$ la matrice $A=\begin{pmatrix}${e(a)}&1\\${c}&${e(d)}\end{pmatrix}$ est-elle inversible ?`,hint:'Inversible ⇔ det ≠ 0 : calcule le déterminant (polynôme en α) et cherche ses racines.',
    steps:[r`$\det A=(${e(a)})(${e(d)})-${par(''+c)}=\alpha^2${term(a+d,'\\alpha')}${sgn(a*d-c)}$.`,r`Racines : $\alpha=${r1}$ et $\alpha=${r2}$ (vérifie : somme $${r1+r2}$, produit $${r1*r2}$).`],ans:r`$A$ inversible $\iff \alpha\notin\{${Math.min(r1,r2)},\ ${Math.max(r1,r2)}\}$`};}};
/* =============================== CH.6 SÉRIES DE FOURIER =============================== */
G['f-serie']={ch:'ma6',t:'Développement en série de Fourier',gen(){
  const k=pick(['sq','sq01','saw','tri','par']); const A=ri(1,4);
  if(k==='sq') return {q:r`$f$ est $2\pi$-périodique, $f(t)=${A}$ sur $]0,\pi[$ et $f(t)=-${A}$ sur $]-\pi,0[$ (créneau). Coefficients de Fourier, série, valeur en $t=0$, puis Parseval.`,hint:'f est IMPAIRE ⇒ aₙ = 0 et a₀ = 0 : seuls les bₙ = (2/T)∫ sur une période… = (4/T)∫ sur une demi-période.',
    steps:[r`$f$ impaire ⇒ $a_0=0$, $a_n=0$.`,r`$b_n=\frac{2}{\pi}\int_0^\pi ${A}\sin(nt)\,\mathrm dt=\frac{${2*A}}{\pi}\left[-\frac{\cos nt}{n}\right]_0^\pi=\frac{${2*A}(1-(-1)^n)}{n\pi}$.`,r`$b_n=0$ si $n$ pair, $b_n=\frac{${4*A}}{n\pi}$ si $n$ impair.`,r`Dirichlet : en $t=0$ (saut de $-${A}$ à $${A}$) la série vaut la moyenne $0$.`,r`Parseval : $\frac1{2\pi}\int_{-\pi}^{\pi}f^2=${A*A}=\frac12\sum b_n^2=\frac{${8*A*A}}{\pi^2}\sum_{p\ge0}\frac1{(2p+1)^2}$ ⇒ $\sum\frac1{(2p+1)^2}=\frac{\pi^2}{8}$.`],
    ans:r`$f(t)=\dfrac{${4*A}}{\pi}\displaystyle\sum_{p\ge0}\frac{\sin((2p+1)t)}{2p+1}$ aux points de continuité`};
  if(k==='sq01') return {q:r`$f$ est $2\pi$-périodique, $f(t)=${A}$ sur $]0,\pi[$ et $f(t)=0$ sur $]-\pi,0[$. Calculer ses coefficients de Fourier.`,hint:'Pas de parité… mais f − (valeur moyenne) est impaire. Ou calcule directement avec les formules.',
    steps:[r`$a_0=\frac1{2\pi}\int_0^{\pi}${A}\,\mathrm dt=\frac{${A}}{2}$ (valeur moyenne).`,r`$a_n=\frac1\pi\int_0^\pi ${A}\cos nt\,\mathrm dt=0$.`,r`$b_n=\frac1\pi\int_0^\pi ${A}\sin nt\,\mathrm dt=\frac{${A}(1-(-1)^n)}{n\pi}$ : $\frac{${2*A}}{n\pi}$ si $n$ impair, 0 sinon.`],
    ans:r`$f(t)=${new Fr(A,2).tex()}+\dfrac{${2*A}}{\pi}\displaystyle\sum_{p\ge0}\frac{\sin((2p+1)t)}{2p+1}$`};
  if(k==='saw') return {q:r`$f$ est $2\pi$-périodique et $f(t)=${A===1?'':A}t$ sur $]-\pi,\pi[$. Développer $f$ en série de Fourier, puis appliquer Parseval.`,hint:'f impaire ⇒ seuls les bₙ ; intégrale de t sin(nt) par parties.',
    steps:[r`Impaire ⇒ $a_n=0$.`,r`$b_n=\frac2\pi\int_0^\pi ${A===1?'':A}t\sin nt\,\mathrm dt$. IPP ($u=t$, $v'=\sin nt$) : $\int_0^\pi t\sin nt=\left[-\frac{t\cos nt}{n}\right]_0^\pi+\frac1n\int_0^\pi\cos nt=-\frac{\pi(-1)^n}{n}$.`,r`$b_n=\frac{${2*A}(-1)^{n+1}}{n}$.`,r`Parseval : $\frac1{2\pi}\int_{-\pi}^\pi ${A*A===1?'':A*A}t^2=\frac{${A*A===1?'':A*A}\pi^2}{3}=\frac12\sum\frac{${4*A*A}}{n^2}$ ⇒ $\sum_{n\ge1}\frac1{n^2}=\frac{\pi^2}6$.`],
    ans:r`$f(t)=${2*A}\displaystyle\sum_{n\ge1}\frac{(-1)^{n+1}}{n}\sin(nt)$ ; en $t=\pi$ (saut) : la série vaut 0`};
  if(k==='tri') return {q:r`$f$ est $2\pi$-périodique et $f(t)=${A===1?'':A}|t|$ sur $[-\pi,\pi]$. Coefficients de Fourier.`,hint:'f PAIRE ⇒ bₙ = 0 ; aₙ = (2/π)∫₀^π f(t)cos(nt)dt, par parties.',
    steps:[r`Paire ⇒ $b_n=0$. $a_0=\frac1\pi\int_0^\pi ${A===1?'':A}t\,\mathrm dt=\frac{${A===1?'':A}\pi}{2}$.`,r`$a_n=\frac2\pi\int_0^\pi${A===1?'':A}t\cos nt\,\mathrm dt$ ; IPP : $\int_0^\pi t\cos nt=\left[\frac{t\sin nt}{n}\right]_0^\pi-\frac1n\int_0^\pi\sin nt=\frac{(-1)^n-1}{n^2}$.`,r`$a_n=\frac{${2*A}((-1)^n-1)}{\pi n^2}$ : $-\frac{${4*A}}{\pi n^2}$ si $n$ impair, 0 sinon.`],
    ans:r`$f(t)=\dfrac{${A===1?'':A}\pi}{2}-\dfrac{${4*A}}{\pi}\displaystyle\sum_{p\ge0}\frac{\cos((2p+1)t)}{(2p+1)^2}$ (continue : égalité partout)`};
  return {q:r`$f$ est $2\pi$-périodique et $f(t)=t^2$ sur $[-\pi,\pi[$. Série de Fourier ; en déduire $\sum\frac1{n^2}$ (prendre $t=\pi$).`,hint:'f paire ⇒ bₙ = 0. Deux IPP pour ∫t²cos(nt).',
    steps:[r`$a_0=\frac1\pi\int_0^\pi t^2=\frac{\pi^2}3$.`,r`$a_n=\frac2\pi\int_0^\pi t^2\cos nt\,\mathrm dt=\frac{4(-1)^n}{n^2}$ (deux IPP).`,r`$f$ continue ⇒ égalité partout. En $t=\pi$ : $\pi^2=\frac{\pi^2}3+\sum\frac{4}{n^2}$ (car $(-1)^n\cos n\pi=1$).`],
    ans:r`$t^2=\dfrac{\pi^2}{3}+4\displaystyle\sum_{n\ge1}\frac{(-1)^n}{n^2}\cos nt$ et $\displaystyle\sum_{n\ge1}\frac1{n^2}=\frac{\pi^2}6$`};}};
G['f-cplx']={ch:'ma6',t:'Coefficients complexes cₙ',gen(){
  const A=ri(1,3);
  return {q:r`$f$ est $2\pi$-périodique, $f(t)=${A}$ sur $]0,\pi[$, $f(t)=-${A}$ sur $]-\pi,0[$. Calculer les coefficients complexes $c_n$, puis retrouver $a_n$ et $b_n$.`,hint:'cₙ = (1/T)∫ f(t)e^{−inωt}dt ; et aₙ = cₙ + c₋ₙ, bₙ = i(cₙ − c₋ₙ).',
    steps:[r`$c_n=\frac1{2\pi}\left(\int_0^\pi ${A}e^{-int}\mathrm dt-\int_{-\pi}^0 ${A}e^{-int}\mathrm dt\right)$, $n\ne0$.`,r`$\int_0^\pi e^{-int}=\frac{1-(-1)^n}{in}$ et $\int_{-\pi}^0e^{-int}=\frac{(-1)^n-1}{in}$.`,r`$c_n=\frac{${A}}{2\pi}\cdot\frac{2(1-(-1)^n)}{in}=\frac{${A}(1-(-1)^n)}{i\pi n}$ ; $c_0=0$.`,r`$a_n=c_n+c_{-n}=0$ et $b_n=i(c_n-c_{-n})=\frac{${2*A}(1-(-1)^n)}{\pi n}$.`],
    ans:r`$c_n=-\dfrac{${2*A}i}{\pi n}$ si $n$ impair, $0$ si $n$ pair ; $b_n=\dfrac{${4*A}}{\pi n}$ ($n$ impair)`};}};
/* =============================== CH.7 TRANSFORMÉE DE FOURIER =============================== */
G['t-ft']={ch:'ma7',t:'Calculer une transformée de Fourier',gen(){
  const v=pick(['rect','shift','exp','causal']); const A=ri(1,3), a=ri(1,4);
  if(v==='rect') return {q:r`Transformée de Fourier de $f(t)=${A}$ si $|t|<${new Fr(a,2).tex()}$, $0$ sinon.`,hint:'f̂(λ) = ∫ f(t)e^{−2iπλt}dt, réduite à l’intervalle où f ≠ 0. Puis Euler : (e^{ix} − e^{−ix})/(2i) = sin x.',
    steps:[r`$\hat f(\lambda)=\int_{-${new Fr(a,2).tex()}}^{${new Fr(a,2).tex()}}${A}e^{-2i\pi\lambda t}\mathrm dt=${A}\left[\frac{e^{-2i\pi\lambda t}}{-2i\pi\lambda}\right]_{-${new Fr(a,2).tex()}}^{${new Fr(a,2).tex()}}$ ($\lambda\ne0$).`,r`$=${A}\cdot\frac{e^{i\pi ${a}\lambda}-e^{-i\pi ${a}\lambda}}{2i\pi\lambda}=${A}\frac{\sin(${a}\pi\lambda)}{\pi\lambda}$.`,r`En $\lambda=0$ : $\hat f(0)=\int f=${A*a}$ (limite cohérente).`],
    ans:r`$\hat f(\lambda)=\dfrac{${A===1?'':A}\sin(${a===1?'':a}\pi\lambda)}{\pi\lambda}$, $\hat f(0)=${A*a}$`};
  if(v==='shift'){ const t0=nz(-3,3); return {q:r`Sachant que $\Pi(t)$ (1 sur $]-\frac12,\frac12[$) a pour transformée $\frac{\sin\pi\lambda}{\pi\lambda}$, donner la transformée de $g(t)=\Pi(t${t0>0?'-':'+'}${Math.abs(t0)})$.`,hint:'Retard : f(t − t₀) → e^{−2iπλt₀} f̂(λ). Le module ne change pas, seule la phase tourne.',
    steps:[r`$g(t)=\Pi(t-t_0)$ avec $t_0=${t0}$.`,r`Propriété du retard : $\widehat{f(t-t_0)}=e^{-2i\pi\lambda t_0}\hat f(\lambda)$ (changement de variable $u=t-t_0$).`],ans:r`$\hat g(\lambda)=e^{${t0>0?'-':''}${2*Math.abs(t0)}i\pi\lambda}\,\dfrac{\sin\pi\lambda}{\pi\lambda}$`}; }
  if(v==='exp') return {q:r`Transformée de Fourier de $f(t)=e^{-${a===1?'':a}|t|}$.`,hint:'Coupe en deux : t < 0 et t > 0, chaque morceau est l’intégrale d’une exponentielle.',
    steps:[r`$\hat f(\lambda)=\int_{-\infty}^0e^{(${a}-2i\pi\lambda)t}\mathrm dt+\int_0^{+\infty}e^{-(${a}+2i\pi\lambda)t}\mathrm dt$.`,r`$=\frac{1}{${a}-2i\pi\lambda}+\frac{1}{${a}+2i\pi\lambda}$ (les exponentielles → 0 aux infinis car ${a} > 0).`,r`Même dénominateur : $\frac{2\cdot${a}}{${a*a}+4\pi^2\lambda^2}$.`],ans:r`$\hat f(\lambda)=\dfrac{${2*a}}{${a*a}+4\pi^2\lambda^2}$ (réelle et paire, comme f)`};
  return {q:r`Transformée de Fourier de $f(t)=e^{-${a===1?'':a}t}\,U(t)$ ($U$ = échelon).`,hint:'Une seule intégrale de 0 à +∞ d’une exponentielle complexe.',
    steps:[r`$\hat f(\lambda)=\int_0^{+\infty}e^{-(${a}+2i\pi\lambda)t}\mathrm dt=\left[\frac{e^{-(${a}+2i\pi\lambda)t}}{-(${a}+2i\pi\lambda)}\right]_0^{+\infty}$.`,r`$|e^{-(${a}+2i\pi\lambda)t}|=e^{-${a}t}\to0$.`],ans:r`$\hat f(\lambda)=\dfrac{1}{${a}+2i\pi\lambda}$ (complexe : f n’est pas paire)`};}};
G['t-imp']={ch:'ma7',t:'Intégrale généralisée : nature et valeur',gen(){
  const v=pick(['inf','zero','exp','texp']);
  if(v==='inf'){ const al=pick([new Fr(2),new Fr(3),new Fr(1,2),new Fr(3,2),new Fr(1)]); const conv=al.val()>1;
    return {q:r`Nature (et valeur si elle converge) de $\displaystyle\int_1^{+\infty}\frac{\mathrm dt}{t^{${al.tex()}}}$.`,hint:'Riemann en +∞ : converge ⇔ α > 1. On calcule ∫₁^X puis on fait X → +∞.',
      steps:[al.one?r`$\int_1^X\frac{\mathrm dt}{t}=\ln X\to+\infty$.`:r`$\int_1^X t^{-${al.tex()}}\mathrm dt=\left[\frac{t^{1-${al.tex()}}}{1-${al.tex()}}\right]_1^X=\frac{X^{${F(1).sub(al).tex()}}-1}{${F(1).sub(al).tex()}}$.`,
        r`Quand $X\to+\infty$ : $X^{${F(1).sub(al).tex()}}\to${conv?'0':'+\\infty'}$.`],ans:conv?r`Converge, vaut $${F(1).div(al.sub(1)).tex()}$ ($\alpha=${al.tex()}>1$)`:r`Diverge ($\alpha=${al.tex()}\le1$)`}; }
  if(v==='zero'){ const al=pick([new Fr(1,2),new Fr(1,3),new Fr(2),new Fr(1)]); const conv=al.val()<1;
    return {q:r`Nature (et valeur) de $\displaystyle\int_0^1\frac{\mathrm dt}{t^{${al.tex()}}}$.`,hint:'Riemann en 0 : converge ⇔ α < 1 (le critère est inversé par rapport à +∞).',
      steps:[al.one?r`$\int_\varepsilon^1\frac{\mathrm dt}t=-\ln\varepsilon\to+\infty$.`:r`$\int_\varepsilon^1t^{-${al.tex()}}\mathrm dt=\frac{1-\varepsilon^{${F(1).sub(al).tex()}}}{${F(1).sub(al).tex()}}$.`,r`Quand $\varepsilon\to0^+$ : $\varepsilon^{${F(1).sub(al).tex()}}\to${conv?'0':'+\\infty'}$.`],ans:conv?r`Converge, vaut $${F(1).div(F(1).sub(al)).tex()}$`:r`Diverge`}; }
  const k=ri(1,4);
  if(v==='exp') return {q:r`Calculer $\displaystyle\int_0^{+\infty}e^{-${k===1?'':k}t}\,\mathrm dt$.`,hint:'Intègre jusqu’à X, puis X → +∞.',steps:[r`$\int_0^Xe^{-${k}t}\mathrm dt=\frac{1-e^{-${k}X}}{${k}}\to\frac1{${k}}$.`],ans:r`Converge, vaut $\frac1{${k}}$`};
  return {q:r`Calculer $\displaystyle\int_0^{+\infty}t\,e^{-${k===1?'':k}t}\,\mathrm dt$.`,hint:'Par parties sur [0, X], puis limite (te^{−kt} → 0 : l’exponentielle gagne).',
    steps:[r`IPP : $\int_0^Xte^{-${k}t}=\left[-\frac{te^{-${k}t}}{${k}}\right]_0^X+\frac1{${k}}\int_0^Xe^{-${k}t}\mathrm dt$.`,r`$Xe^{-${k}X}\to0$ (croissances comparées) et $\int_0^{+\infty}e^{-${k}t}=\frac1{${k}}$.`],ans:r`Converge, vaut $\frac1{${k*k}}$ (c’est aussi $\mathcal L[t](${k})$ !)`};}};
/* =============================== CH.8 LAPLACE =============================== */
const lapT=()=>{ const t=pick(['c','tn','exp','cos','sin','ecos']); const a=nz(-4,4), c=nz(-3,3), w=ri(1,4), n=ri(1,3);
  switch(t){
    case 'c': return {f:''+a,F:r`\frac{${a}}{p}`,s:0,w:r`\mathcal L[1]=\frac1p`};
    case 'tn': return {f:`${a===1?'':a===-1?'-':a}t${n>1?'^{'+n+'}':''}`,F:r`\frac{${a*fact(n)}}{p^{${n+1}}}`,s:0,w:r`\mathcal L[t^n]=\frac{n!}{p^{n+1}}`};
    case 'exp': return {f:`${a===1?'':a===-1?'-':a}${eexp(c)}`,F:r`\frac{${a}}{${xm('p',c)}}`,s:c,w:r`\mathcal L[e^{ct}]=\frac1{p-c}`};
    case 'cos': return {f:`${a===1?'':a===-1?'-':a}\\cos(${w===1?'':w}t)`,F:r`\frac{${a===1?'':a===-1?'-':a}p}{p^2+${w*w}}`,s:0,w:r`\mathcal L[\cos\omega t]=\frac{p}{p^2+\omega^2}`};
    case 'sin': return {f:`${a===1?'':a===-1?'-':a}\\sin(${w===1?'':w}t)`,F:r`\frac{${a*w}}{p^2+${w*w}}`,s:0,w:r`\mathcal L[\sin\omega t]=\frac{\omega}{p^2+\omega^2}`};
    default: return {f:`${eexp(c)}\\cos(${w===1?'':w}t)`,F:r`\frac{${xm('p',c)}}{(${xm('p',c)})^2+${w*w}}`,s:c,w:r`\mathcal L[e^{ct}f(t)]=F(p-c)`};
  } };
G['l-dir']={ch:'ma8',t:'Transformée de Laplace (dictionnaire)',gen(){
  const t1=lapT(); let t2; do{t2=lapT();}while(t2.f===t1.f); const fx=`${t1.f}${t2.f.startsWith('-')?'':'+'}${t2.f}`;
  return {q:r`Calculer la transformée de Laplace de $f(t)=\left(${fx}\right)U(t)$ et préciser son domaine de définition.`,hint:'Linéarité : on transforme chaque morceau avec le dictionnaire. Domaine : Re p > la plus grande « abscisse » des morceaux.',
    steps:[r`Linéarité : $\mathcal L[f]=\mathcal L[${t1.f}]+\mathcal L[${t2.f}]$.`,r`Dictionnaire : $${t1.w}$ ; $${t2.w}$.`,r`Abscisses de convergence : $${t1.s}$ et $${t2.s}$ ⇒ on garde la plus grande.`],
    ans:r`$F(p)=${t1.F}+${t2.F}$ pour $\mathrm{Re}\,p>${Math.max(t1.s,t2.s)}$`};}};
G['l-inv']={ch:'ma8',t:'Original (transformée inverse)',gen(){
  const v=pick(['2p','2p','osc','pow']);
  if(v==='2p'){ let a,b; do{a=ri(-4,3);b=ri(-4,3);}while(a===b); const A=nz(-3,3),B=nz(-3,3); const al=A+B, be=-(A*b+B*a);
    return {q:r`Trouver l’original de $F(p)=\dfrac{${sum([[al,'p'],[be,'']])}}{(${xm('p',a)})(${xm('p',b)})}$.`,hint:'Décomposer en éléments simples A/(p − a) + B/(p − b), puis 1/(p − a) ↔ e^{at}.',
      steps:[r`$F(p)=\frac{A}{${xm('p',a)}}+\frac{B}{${xm('p',b)}}$.`,r`Méthode du cache : $A=\frac{${al}\cdot${par(''+a)}${sgn(be)}}{${a}-${par(''+b)}}=${A}$, $B=\frac{${al}\cdot${par(''+b)}${sgn(be)}}{${b}-${par(''+a)}}=${B}$.`,r`$\mathcal L^{-1}\left[\frac1{p-c}\right]=e^{ct}U(t)$.`],
      ans:r`$f(t)=\left(${sum([[A,eexp(a)],[B,eexp(b)]])}\right)U(t)$`}; }
  if(v==='pow'){ const a=ri(-3,3), n=ri(1,3), K=fact(n)*ri(1,3);
    return {q:r`Trouver l’original de $F(p)=\dfrac{${K}}{(${xm('p',a)})^{${n+1}}}$.`,hint:'n!/p^{n+1} ↔ tⁿ, et un décalage p → p − a correspond à une multiplication par e^{at}.',
      steps:[r`$\frac{${K}}{p^{${n+1}}}=${K/fact(n)}\cdot\frac{${n}!}{p^{${n+1}}}\leftrightarrow ${K/fact(n)===1?'':K/fact(n)}t^{${n}}$.`,r`Décalage : $F(p-a)\leftrightarrow e^{at}f(t)$ avec $a=${a}$.`],ans:r`$f(t)=${K/fact(n)===1?'':K/fact(n)}t^{${n}}${eexp(a)}\,U(t)$`}; }
  const c=ri(-3,2), w=ri(1,3), al=nz(-3,3), be=ri(-5,5); const k=al*c+be; const B=new Fr(k,w);
  return {q:r`Trouver l’original de $F(p)=\dfrac{${sum([[al,'p'],[be,'']])}}{(${xm('p',c)})^2+${w*w}}$.`,hint:'Le dénominateur ne se factorise pas dans ℝ : fais apparaître (p − c) au numérateur. Puis (p − c)/((p − c)² + ω²) ↔ e^{ct}cos ωt et ω/(...) ↔ e^{ct} sin ωt.',
    steps:[r`Numérateur : $${sum([[al,'p'],[be,'']])}=${al}(${xm('p',c)})${sgn(k)}$.`,r`$F(p)=${al}\frac{${xm('p',c)}}{(${xm('p',c)})^2+${w*w}}${term(B,'',false)}\cdot\frac{${w}}{(${xm('p',c)})^2+${w*w}}$.`,r`Dictionnaire + décalage.`],
    ans:r`$f(t)=${eexp(c)}\left(${sum([[al,`\\cos ${w===1?'':w}t`],[B,`\\sin ${w===1?'':w}t`]])}\right)U(t)$`};}};
G['l-edo']={ch:'ma8',t:'Résoudre une EDO avec Laplace',gen(){
  if(Math.random()<0.45){ const k=nz(-3,3), c=nz(-5,5), y0=ri(-3,3); const ck=new Fr(c,k);
    return {q:r`Résoudre avec la transformée de Laplace : $y'${term(k,'y')}=${c}$, $y(0)=${y0}$.`,hint:'L[y′] = pY − y(0). On isole Y(p), on décompose, on revient avec le dictionnaire.',
      steps:[r`$pY-${par(''+y0)}${term(k,'Y')}=\frac{${c}}{p}$ ⇒ $Y(p)=\frac{${y0}}{${xm('p',-k)}}+\frac{${c}}{p(${xm('p',-k)})}$.`,r`$\frac{${c}}{p(${xm('p',-k)})}=\frac{${ck.tex()}}{p}-\frac{${ck.tex()}}{${xm('p',-k)}}$.`,r`Retour : $\frac1p\leftrightarrow1$, $\frac1{${xm('p',-k)}}\leftrightarrow ${eexp(-k)}$.`],
      ans:r`$y(t)=${sum([[ck,''],[F(y0).sub(ck),eexp(-k)]])}$`}; }
  let r1,r2; do{r1=ri(-3,2);r2=ri(-3,2);}while(r1===r2); const s=-(r1+r2), q=r1*r2, y0=ri(-2,2), y1=ri(-3,3);
  const N0=y0, N1=y1+s*y0; const A=new Fr(y0*r1+N1,r1-r2), B=new Fr(y0*r2+N1,r2-r1);
  return {q:r`Résoudre avec Laplace : $y''${term(s,"y'")}${q?term(q,'y'):''}=0$, $y(0)=${y0}$, $y'(0)=${y1}$.`,hint:'L[y″] = p²Y − p·y(0) − y′(0). Le polynôme devant Y est l’équation caractéristique !',
    steps:[r`$p^2Y-${par(''+y0)}p-${par(''+y1)}${term(s,'(pY-'+par(''+y0)+')')}${q?term(q,'Y'):''}=0$.`,r`$Y(p)=\frac{${sum([[N0,'p'],[N1,'']])}}{p^2${term(s,'p')}${q?sgn(q):''}}=\frac{${sum([[N0,'p'],[N1,'']])}}{(${xm('p',r1)})(${xm('p',r2)})}$.`,r`Éléments simples : $A=${A.tex()}$ (en $p=${r1}$), $B=${B.tex()}$ (en $p=${r2}$).`],
    ans:r`$y(t)=${sum([[A,eexp(r1)],[B,eexp(r2)]])}$`};}};
G['l-ret']={ch:'ma8',t:'Retard et échelons',gen(){
  const v=pick(['win','pow','t2']); const a=ri(1,3);
  if(v==='win'){ const b=a+ri(1,3), K=ri(1,3); return {q:r`Laplace de la fenêtre $f(t)=${K===1?'':K}\left(U(t-${a})-U(t-${b})\right)$ (vaut ${K} entre ${a} et ${b}, 0 ailleurs).`,hint:'L[U(t − a)] = e^{−ap}/p (théorème du retard).',
    steps:[r`$\mathcal L[U(t-a)]=\frac{e^{-ap}}p$.`,r`Linéarité.`],ans:r`$F(p)=\dfrac{${K===1?'':K}\left(e^{-${a}p}-e^{-${b}p}\right)}{p}$`}; }
  if(v==='pow'){ const n=ri(1,3); return {q:r`Laplace de $f(t)=(t-${a})^{${n}}\,U(t-${a})$.`,hint:'C’est tⁿU(t) retardé de a : on multiplie par e^{−ap}.',
    steps:[r`$\mathcal L[t^{${n}}U(t)]=\frac{${fact(n)}}{p^{${n+1}}}$.`,r`Retard de ${a} : $\times e^{-${a}p}$.`],ans:r`$F(p)=\dfrac{${fact(n)}\,e^{-${a}p}}{p^{${n+1}}}$`}; }
  return {q:r`Laplace de $f(t)=t^2\,U(t-${a})$.`,hint:'Le retard ne s’applique que si la fonction est écrite en (t − a) : fais apparaître t − a dans t².',
    steps:[r`$t^2=(t-${a})^2+${2*a}(t-${a})+${a*a}$.`,r`$f(t)=\left[(t-${a})^2+${2*a}(t-${a})+${a*a}\right]U(t-${a})$, chaque terme est un « retardé ».`,r`$\mathcal L=e^{-${a}p}\left(\frac2{p^3}+\frac{${2*a}}{p^2}+\frac{${a*a}}{p}\right)$.`],ans:r`$F(p)=e^{-${a}p}\left(\dfrac{2}{p^3}+\dfrac{${2*a}}{p^2}+\dfrac{${a*a}}{p}\right)$`};}};

/* ======================= rendu ======================= */
const CHN={ma1:'Complexes',ma2:'Intégrales',ma3:'Équations différentielles',ma4:'Intégrales multiples',ma5:'Matrices',ma6:'Séries de Fourier',ma7:'Transformée de Fourier',ma8:'Laplace'};
window.EM_GEN={G,CHN};
const LSg=(k,d)=>{try{const v=localStorage.getItem('em:'+k);return v===null?d:JSON.parse(v);}catch(e){return d;}};
const LSs=(k,v)=>{try{localStorage.setItem('em:'+k,JSON.stringify(v));}catch(e){}};
function make(id){ for(let i=0;i<30;i++){ try{ const x=G[id].gen(); if(x) return x; }catch(e){ if(i===29) console.warn(id,e); } } return {q:'(erreur de génération)',steps:[],ans:''}; }
function render(box,ids,opts={}){
  const id=pick(ids); const ex=make(id); const g=G[id];
  box.innerHTML=`<div class="gh"><span>⚄ ${g.t}</span><span class="lvl">${CHN[g.ch]}</span></div><div class="gq">${ex.q}</div><div class="ghint">💡 ${ex.hint||''}</div>
   <div class="gbar"><button class="btn ghost" data-a="hint">💡 Indice</button><button class="btn" data-a="step">Correction pas à pas</button><button class="btn ghost" data-a="all">Tout afficher</button><button class="btn ghost" data-a="new">🎲 Nouveau</button></div>
   <div class="gsol"><ol>${ex.steps.map(s=>`<li style="display:none">${s}</li>`).join('')}</ol><div class="ans" style="display:none"><b>Résultat :</b> ${ex.ans}</div>
   <div class="gen-self" style="display:none">Tu l’avais trouvé ? <button class="btn ghost" data-a="ok">✓ Oui</button><button class="btn ghost" data-a="ko">✗ Non, à retravailler</button><span class="gen-tally"></span></div></div>`;
  let k=0; const lis=[...box.querySelectorAll('.gsol li')], ans=box.querySelector('.ans'), self=box.querySelector('.gen-self'), stepB=box.querySelector('[data-a=step]');
  const tally=()=>{ const st=LSg('gen:'+id,{ok:0,ko:0}); box.querySelector('.gen-tally').textContent=`Ce type : ${st.ok} réussi${st.ok>1?'s':''}, ${st.ko} raté${st.ko>1?'s':''}`; };
  const upd=()=>{ lis.forEach((l,i)=>l.style.display=i<k?'':'none'); const done=k>lis.length; ans.style.display=done?'':'none'; self.style.display=done?'':'none'; stepB.textContent=k===0?'Correction pas à pas':done?'Terminé ✓':`Étape suivante (${Math.min(k+1,lis.length+1)}/${lis.length+1})`; stepB.disabled=done; if(done) tally(); };
  box.querySelector('.gbar').onclick=e=>{ const a=e.target.dataset.a; if(!a) return;
    if(a==='hint') box.classList.toggle('hinted');
    if(a==='step'){ box.classList.add('open'); k++; upd(); }
    if(a==='all'){ box.classList.add('open'); k=lis.length+1; upd(); }
    if(a==='new'){ render(box,ids,opts); return; } };
  self.onclick=e=>{ const a=e.target.dataset.a; if(!a) return; const st=LSg('gen:'+id,{ok:0,ko:0}); st[a]++; LSs('gen:'+id,st); self.querySelectorAll('button').forEach(b=>b.disabled=true); tally(); };
  window.EM_renderMath&&EM_renderMath(box);
}
window.EM_genRender=render;
function boot(){
  document.querySelectorAll('.inline-gen[data-gen]').forEach(el=>{ const ids=el.dataset.gen.split(',').filter(x=>G[x]);
    const tag=document.createElement('span'); tag.className='tag'; tag.textContent='🎲 Exercice généré — un nouvel énoncé à chaque clic'; const box=document.createElement('div'); box.className='genbox'; el.append(tag,box); render(box,ids); });
  const page=document.querySelector('#genpage'); if(page) bootPage(page);
}
function bootPage(root){
  const chips=root.querySelector('.gen-pick'), list=root.querySelector('.gen-list'); let sel=new Set(Object.keys(CHN));
  const types=root.querySelector('.gen-types');
  chips.innerHTML=`<button data-c="all" class="on">Tout le programme</button>`+Object.entries(CHN).map(([k,v])=>`<button data-c="${k}" class="on">${v}</button>`).join('');
  const sync=()=>{ chips.querySelectorAll('button[data-c]').forEach(b=>{ if(b.dataset.c==='all') b.classList.toggle('on',sel.size===8); else b.classList.toggle('on',sel.has(b.dataset.c)); });
    types.innerHTML=Object.entries(G).filter(([k,g])=>sel.has(g.ch)).map(([k,g])=>{ const st=LSg('gen:'+k,{ok:0,ko:0}); return `<button data-t="${k}" title="Générer ce type">${g.t}${st.ok+st.ko?` <small>(${st.ok}✓ ${st.ko}✗)</small>`:''}</button>`; }).join(''); };
  chips.onclick=e=>{ const c=e.target.closest('button')?.dataset.c; if(!c) return; if(c==='all') sel=new Set(Object.keys(CHN)); else { if(sel.size===8) sel=new Set([c]); else sel.has(c)?sel.delete(c):sel.add(c); if(!sel.size) sel=new Set(Object.keys(CHN)); } sync(); };
  const ids=()=>Object.keys(G).filter(k=>sel.has(G[k].ch));
  const add=(pool)=>{ const b=document.createElement('div'); b.className='genbox'; list.prepend(b); render(b,pool); };
  root.querySelector('[data-a=one]').onclick=()=>add(ids());
  root.querySelector('[data-a=five]').onclick=()=>{ list.innerHTML=''; for(let i=0;i<5;i++) add(ids()); };
  root.querySelector('[data-a=weak]').onclick=()=>{ const w=ids().filter(k=>{const s=LSg('gen:'+k,{ok:0,ko:0}); return s.ko>s.ok||s.ok+s.ko===0;}); add(w.length?w:ids()); };
  root.querySelector('[data-a=clear]').onclick=()=>{ list.innerHTML=''; };
  types.onclick=e=>{ const t=e.target.closest('button')?.dataset.t; if(t) add([t]); };
  sync(); add(ids());
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,0)); else setTimeout(boot,0);
})();

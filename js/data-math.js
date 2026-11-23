/* ============ Mathématiques : quiz & flashcards ============ */
(function(){
const r=String.raw;
window.EM_DATA=window.EM_DATA||{quiz:{},cards:{}};
const Q=window.EM_DATA.quiz, C=window.EM_DATA.cards;

Q.ma1=[
{q:r`$|3-4i|$ vaut…`,o:[`5`,`7`,`−1`,`√7`],a:0,e:r`$\sqrt{9+16}=5$ : la longueur de la flèche (Pythagore).`},
{q:r`$\frac{1}{i}$ vaut…`,o:[`$-i$`,`$i$`,`1`,`−1`],a:0,e:r`$\frac1i=\frac{\bar i}{|i|^2}=-i$ (ou : $i\times(-i)=1$).`},
{q:r`Un argument de $-1-i$ est…`,o:[r`$-\frac{3\pi}4$`,r`$\frac\pi4$`,r`$\frac{3\pi}4$`,r`$-\frac\pi4$`],a:0,e:`Partie réelle ET imaginaire négatives : quadrant en bas à gauche. arctan(1) = π/4 serait faux.`},
{q:r`Multiplier un complexe par $i$, c'est…`,o:[`le tourner de 90° (sens direct)`,`le symétriser par rapport à l'axe réel`,`doubler son module`,`changer son signe`],a:0,e:r`$i=e^{i\pi/2}$ : module 1, argument π/2.`},
{q:r`$z\bar z$ est toujours…`,o:[`un réel positif ou nul`,`un imaginaire pur`,`égal à 1`,`égal à $z^2$`],a:0,e:r`$z\bar z=a^2+b^2=|z|^2$.`},
{q:r`$\cos\theta$ s'écrit…`,o:[r`$\frac{e^{i\theta}+e^{-i\theta}}2$`,r`$\frac{e^{i\theta}-e^{-i\theta}}{2i}$`,r`$e^{i\theta}+e^{-i\theta}$`,r`$\mathrm{Im}(e^{i\theta})$`],a:0,e:`Formule d'Euler : la somme de deux flèches conjuguées est réelle.`},
{q:r`Combien de solutions a $z^5=1$ dans ℂ ?`,o:[`5`,`1`,`2`,`une infinité`],a:0,e:`n racines n-ièmes, sommets d'un pentagone régulier sur le cercle unité.`},
{q:r`$\arg(z^3)$ vaut…`,o:[r`$3\arg z$`,r`$(\arg z)^3$`,r`$\arg z+3$`,r`$\arg z$`],a:0,e:`Les arguments s'ajoutent quand on multiplie.`},
{q:r`Pour les racines carrées de $X+iY$, la 3ᵉ équation « gratuite » est…`,o:[r`$a^2+b^2=\sqrt{X^2+Y^2}$`,r`$a+b=X+Y$`,r`$ab=XY$`,r`$a^2b^2=XY$`],a:0,e:r`Égalité des modules : $|w|^2=|c|$.`},
{q:r`$z^2+2z+5=0$ a pour solutions…`,o:[`$-1\pm2i$`,`$1\pm2i$`,`$-2\pm i$`,`aucune`],a:0,e:r`$\Delta=4-20=-16=(4i)^2$ ⇒ $z=\frac{-2\pm4i}2$.`},
{q:r`Linéariser $\sin^2x$ :`,o:[r`$\frac{1-\cos2x}2$`,r`$\frac{1+\cos2x}2$`,r`$2\sin x\cos x$`,r`$1-\cos^2 2x$`],a:0,e:`Euler ou cos 2x = 1 − 2sin²x.`},
{q:`Le symbole √ appliqué à un complexe non réel…`,o:[`n'a pas de sens : on dit « une racine carrée δ »`,`donne la racine de partie réelle positive`,`donne le module`,`est toujours i`],a:0,e:`Chaque complexe non nul a deux racines carrées opposées, aucune n'est « la » racine.`}];
Q.ma2=[
{q:r`Une primitive de $\frac{2x}{x^2+1}$ :`,o:[r`$\ln(x^2+1)$`,r`$\arctan x$`,r`$\frac{1}{x^2+1}$`,r`$2\ln x$`],a:0,e:`Forme u′/u.`},
{q:r`$\int_{-2}^{2}x^3\cos x\,\mathrm dx$ vaut…`,o:[`0`,`4`,`2 sin 2`,`on ne peut pas savoir sans calcul`],a:0,e:`Fonction impaire sur un intervalle symétrique : les aires s'annulent.`},
{q:r`Pour $\int x e^{2x}\mathrm dx$ par parties, on choisit…`,o:[r`$u=x$, $v'=e^{2x}$`,r`$u=e^{2x}$, $v'=x$`,`peu importe`,`pas d'IPP possible`],a:0,e:`u = ce qui se simplifie en dérivant (le polynôme).`},
{q:r`Pour $\int\ln x\,\mathrm dx$ :`,o:[r`IPP avec $u=\ln x$, $v'=1$`,`c'est 1/x`,`changement de variable u = ln x seul`,`impossible`],a:0,e:r`$x\ln x-x$.`},
{q:`Dans un changement de variable, on oublie souvent…`,o:[`de changer les bornes et de transformer dt`,`de dériver f`,`la constante d'intégration`,`de mettre au carré`],a:0,e:r`$\mathrm dt=\varphi'(u)\,\mathrm du$ et les nouvelles bornes en u.`},
{q:r`$F(x)=\int_a^xf(t)\,\mathrm dt$ vérifie…`,o:[`F′ = f et F(a) = 0`,`F′ = f et F(0) = 0`,`F = f′`,`F(a) = f(a)`],a:0,e:`L'aire accumulée depuis a est la primitive qui s'annule en a.`},
{q:r`La décomposition de $\frac{1}{x(x-1)}$ :`,o:[r`$\frac{1}{x-1}-\frac1x$`,r`$\frac1x+\frac1{x-1}$`,r`$\frac1x-\frac1{x-1}$`,r`$\frac{1}{x^2}-\frac1x$`],a:0,e:`Cache : en x = 0 on trouve −1, en x = 1 on trouve 1.`},
{q:r`Avant de décomposer $\frac{x^3+1}{x^2-1}$, il faut…`,o:[`faire la division euclidienne (degré du haut ≥ degré du bas)`,`dériver`,`intégrer directement`,`rien de spécial`],a:0,e:`Partie entière d'abord.`},
{q:r`Une primitive de $\frac1{1+x^2}$ :`,o:[r`$\arctan x$`,r`$\ln(1+x^2)$`,r`$\arcsin x$`,r`$\frac{-2x}{(1+x^2)^2}$`],a:0,e:`À connaître par cœur.`},
{q:r`$\int_0^\pi\sin x\,\mathrm dx$ vaut…`,o:[`2`,`0`,`1`,`π`],a:0,e:r`$[-\cos x]_0^\pi=1+1$.`}];
Q.ma3=[
{q:r`Solutions de $u'+3u=0$ :`,o:[r`$Ce^{-3t}$`,r`$Ce^{3t}$`,r`$C-3t$`,r`$e^{-3t}+C$`],a:0,e:r`$u'/u=-3$.`},
{q:`La solution générale d'une EDO linéaire est…`,o:[`solution homogène générale + UNE solution particulière`,`la solution particulière seule`,`la somme de deux solutions particulières`,`le produit des deux`],a:0,e:`Linéarité : la différence de deux solutions est solution de l'homogène.`},
{q:r`Pour $u'+2u=\sin t$, on cherche $u_p$ de la forme…`,o:[r`$A\cos t+B\sin t$`,r`$A\sin t$`,r`$At\sin t$`,r`$Ae^{t}$`],a:0,e:`La dérivée fait apparaître du cosinus : il faut les deux.`},
{q:r`Pour $u'+u=e^{-t}$, on cherche…`,o:[r`$u_p=Ate^{-t}$`,r`$u_p=Ae^{-t}$`,r`$u_p=A$`,r`$u_p=At^2$`],a:0,e:r`$e^{-t}$ est déjà solution de l'homogène (résonance) : on multiplie par t.`},
{q:r`$u''-5u'+6u=0$ : les racines caractéristiques sont…`,o:[`2 et 3`,`−2 et −3`,`1 et 6`,`5 et 6`],a:0,e:r`$r^2-5r+6=(r-2)(r-3)$.`},
{q:r`$u''+4u=0$ a pour solutions…`,o:[r`$\lambda\cos2t+\mu\sin2t$`,r`$\lambda e^{2t}+\mu e^{-2t}$`,r`$(\lambda+\mu t)e^{2t}$`,r`$\lambda\cos4t$`],a:0,e:r`$r=\pm2i$ : α = 0, β = 2.`},
{q:r`$u''+2u'+u=0$ (Δ = 0) a pour solutions…`,o:[r`$(\lambda+\mu t)e^{-t}$`,r`$\lambda e^{-t}$`,r`$\lambda e^{-t}+\mu e^{t}$`,r`$e^{-t}(\lambda\cos t+\mu\sin t)$`],a:0,e:`Racine double −1 : un seul exponentielle ne suffit pas, on ajoute t·e^{rt}.`},
{q:`Racines caractéristiques −1 ± 3i. La solution…`,o:[`oscille (pulsation 3) en s'amortissant (e^(−t))`,`explose`,`ne fait que décroître`,`oscille sans s'amortir`],a:0,e:`Partie réelle = amortissement, partie imaginaire = pulsation.`},
{q:`Un problème de Cauchy du 2ᵈ ordre nécessite…`,o:[`u(t₀) et u′(t₀)`,`u(t₀) seulement`,`u′(t₀) seulement`,`aucune condition`],a:0,e:`Deux constantes ⇒ deux conditions.`},
{q:r`Avec un second membre $6e^{-t}-10e^{-2t}\cos t$, on utilise…`,o:[`le principe de superposition`,`seulement le premier terme`,`la variation de la constante obligatoirement`,`un polynôme`],a:0,e:`Une solution particulière par morceau, puis on additionne.`}];
Q.ma4=[
{q:r`Dans $\int_a^b\int_{\varphi_1(x)}^{\varphi_2(x)}f\,\mathrm dy\,\mathrm dx$, les bornes extérieures a et b sont…`,o:[`des nombres`,`des fonctions de y`,`des fonctions de x`,`toujours 0 et 1`],a:0,e:`Les bornes intérieures peuvent dépendre de x, jamais les extérieures.`},
{q:r`En polaires, $\mathrm dx\,\mathrm dy=$`,o:[r`$r\,\mathrm dr\,\mathrm d\theta$`,r`$\mathrm dr\,\mathrm d\theta$`,r`$r^2\,\mathrm dr\,\mathrm d\theta$`,r`$\frac{\mathrm dr\,\mathrm d\theta}{r}$`],a:0,e:`Le carreau polaire a pour côtés dr et r dθ.`},
{q:r`$\iint_D 1\,\mathrm dx\,\mathrm dy$ représente…`,o:[`l'aire de D`,`le périmètre de D`,`le volume`,`0`],a:0,e:``},
{q:r`Le disque $x^2+y^2\le2x$ en polaires :`,o:[r`$0\le r\le2\cos\theta$, $\theta\in[-\frac\pi2,\frac\pi2]$`,r`$0\le r\le2$, $\theta\in[0,2\pi]$`,r`$0\le r\le1$`,r`$r\le2\sin\theta$`],a:0,e:r`$r^2\le2r\cos\theta$.`},
{q:`Fubini permet…`,o:[`d'intégrer dans l'ordre qu'on veut (en redécrivant le domaine)`,`de dériver sous l'intégrale`,`de supprimer les bornes`,`de passer en polaires`],a:0,e:``},
{q:r`$\iint_{[0,1]\times[0,2]}xy\,\mathrm dx\,\mathrm dy$ =`,o:[`1`,`2`,`1/2`,`4`],a:0,e:r`$\int_0^1x\cdot\int_0^2y=\frac12\cdot2$.`},
{q:`En cylindriques, dV =`,o:[`r dr dθ dz`,`dr dθ dz`,`r² dr dθ dz`,`r² cos φ dr dθ dφ`],a:0,e:``},
{q:`En sphériques (φ latitude, convention du cours), dV =`,o:[`r² cos φ dr dθ dφ`,`r² sin φ dr dθ dφ`,`r dr dθ dφ`,`r² dr dθ dφ`],a:0,e:`Avec la colatitude de la physique ce serait sin.`},
{q:`Le moment d'inertie par rapport à Oz s'écrit…`,o:[`∭(x² + y²)ρ dV`,`∭ z² ρ dV`,`∭ ρ dV`,`∭(x² + y² + z²)ρ dV`],a:0,e:`d² = carré de la distance à l'axe Oz.`},
{q:r`L'aire d'un disque de rayon R en polaires :`,o:[r`$\int_0^{2\pi}\int_0^Rr\,\mathrm dr\,\mathrm d\theta=\pi R^2$`,r`$\int_0^{2\pi}\int_0^R\mathrm dr\,\mathrm d\theta=2\pi R$`,r`$\pi R$`,r`$\frac43\pi R^3$`],a:0,e:`Sans le r on trouverait le mauvais résultat 2πR.`}];
Q.ma5=[
{q:`Le produit d'une matrice 2×3 par une matrice 3×4 est de taille…`,o:[`2×4`,`3×3`,`4×2`,`impossible`],a:0,e:`(n×p)(p×m) = n×m.`},
{q:`En général, AB et BA…`,o:[`sont différentes`,`sont égales`,`sont transposées l'une de l'autre`,`ont le même déterminant mais pas toujours`],a:0,e:`Le produit n'est pas commutatif (même si det(AB) = det(BA)).`},
{q:r`$\begin{vmatrix}2&3\\1&4\end{vmatrix}=$`,o:[`5`,`11`,`−5`,`8`],a:0,e:`8 − 3.`},
{q:`A est inversible si et seulement si…`,o:[`det A ≠ 0`,`A a des coefficients non nuls`,`A est symétrique`,`det A = 1`],a:0,e:``},
{q:`Échanger deux lignes d'une matrice…`,o:[`change le signe du déterminant`,`ne change rien`,`annule le déterminant`,`double le déterminant`],a:0,e:``},
{q:r`$L_2\leftarrow L_2-3L_1$ modifie le déterminant…`,o:[`pas du tout`,`le multiplie par −3`,`le change de signe`,`l'annule`],a:0,e:`C'est la base de la méthode Gauss-cofacteur.`},
{q:`Au pivot de Gauss, on obtient la ligne 0 = 5. Le système…`,o:[`n'a aucune solution`,`a une infinité de solutions`,`a une solution unique`,`a 5 solutions`],a:0,e:`Équation impossible.`},
{q:r`$\begin{pmatrix}a&b\\c&d\end{pmatrix}^{-1}=$`,o:[r`$\frac1{ad-bc}\begin{pmatrix}d&-b\\-c&a\end{pmatrix}$`,r`$\frac1{ad-bc}\begin{pmatrix}a&-b\\-c&d\end{pmatrix}$`,r`$\begin{pmatrix}1/a&1/b\\1/c&1/d\end{pmatrix}$`,r`$\frac1{ad+bc}\begin{pmatrix}d&b\\c&a\end{pmatrix}$`],a:0,e:``},
{q:`Géométriquement, |det A| (2×2) est…`,o:[`le facteur par lequel A multiplie les aires`,`la longueur de la 1ʳᵉ colonne`,`l'angle de rotation`,`la trace`],a:0,e:`Aire du parallélogramme formé par les colonnes.`},
{q:r`$(AB)^{-1}=$`,o:[r`$B^{-1}A^{-1}$`,r`$A^{-1}B^{-1}$`,r`$BA$`,r`$\frac{1}{AB}$`],a:0,e:`On défait dans l'ordre inverse.`},
{q:`Formule de Cramer : x₁ =`,o:[`det(A avec la colonne 1 remplacée par B) / det A`,`det A / det B`,`B₁ / a₁₁`,`det(A) × B₁`],a:0,e:``}];
Q.ma6=[
{q:`Pour un signal T-périodique, a₀ représente…`,o:[`la valeur moyenne`,`l'amplitude du fondamental`,`la valeur maximale`,`la période`],a:0,e:r`$a_0=\frac1T\int_Tf$.`},
{q:`f impaire ⇒`,o:[`aₙ = 0 et a₀ = 0 (série de sinus)`,`bₙ = 0`,`tous les coefficients sont nuls`,`seul a₀ est non nul`],a:0,e:``},
{q:`f paire ⇒`,o:[`bₙ = 0 (série de cosinus)`,`aₙ = 0`,`a₀ = 0`,`cₙ imaginaires purs`],a:0,e:``},
{q:`En un point de discontinuité, la série de Fourier converge vers…`,o:[`la moyenne des limites à gauche et à droite`,`la limite à droite`,`0`,`elle diverge`],a:0,e:`Théorème de Dirichlet.`},
{q:`Créneau impair ±1 : les harmoniques présentes sont…`,o:[`les impaires seulement, en 4/(nπ)`,`toutes, en 1/n²`,`les paires seulement`,`seulement le fondamental`],a:0,e:r`$b_n=\frac{2(1-(-1)^n)}{n\pi}$.`},
{q:r`$c_n$ et $(a_n,b_n)$ : $c_n=$`,o:[r`$\frac{a_n-ib_n}2$`,r`$a_n+ib_n$`,r`$\frac{a_n+ib_n}2$`,r`$a_n-b_n$`],a:0,e:``},
{q:`Parseval relie…`,o:[`la puissance moyenne du signal à la somme des carrés des coefficients`,`le signal à sa dérivée`,`aₙ et bₙ`,`la période à la fréquence`],a:0,e:``},
{q:`Le phénomène de Gibbs, c'est…`,o:[`un dépassement d'environ 9 % près des sauts, qui ne disparaît pas`,`la divergence de la série`,`l'annulation des harmoniques paires`,`une erreur de calcul`],a:0,e:``},
{q:`Plus un signal a des discontinuités…`,o:[`plus ses coefficients décroissent lentement`,`plus ils décroissent vite`,`moins il a d'harmoniques`,`plus a₀ est grand`],a:0,e:`Saut ⇒ 1/n ; angle ⇒ 1/n² ; lisse ⇒ très vite.`},
{q:r`$\sum_{n\ge1}\frac1{n^2}=$`,o:[r`$\frac{\pi^2}6$`,r`$\frac{\pi^2}8$`,r`$\frac{\pi}4$`,`diverge`],a:0,e:`Parseval sur f(t) = t (ou Dirichlet sur t² en π).`}];
Q.ma7=[
{q:r`$\int_1^{+\infty}\frac{\mathrm dt}{t^2}$ :`,o:[`converge, vaut 1`,`diverge`,`converge, vaut 1/2`,`vaut 2`],a:0,e:`α = 2 > 1, valeur 1/(α − 1).`},
{q:r`$\int_0^1\frac{\mathrm dt}{\sqrt t}$ :`,o:[`converge, vaut 2`,`diverge`,`vaut 1/2`,`vaut 1`],a:0,e:`α = 1/2 < 1 en 0, valeur 1/(1 − α).`},
{q:r`$\int_1^{+\infty}\frac{\mathrm dt}{t}$ :`,o:[`diverge (ln X → ∞)`,`converge vers 1`,`converge vers 0`,`vaut e`],a:0,e:`Cas limite de Riemann.`},
{q:r`La TF de $f$ (convention du cours) :`,o:[r`$\int_{-\infty}^{+\infty}f(t)e^{-2i\pi\lambda t}\mathrm dt$`,r`$\int_0^{+\infty}f(t)e^{-pt}\mathrm dt$`,r`$\frac1T\int_Tf(t)e^{-in\omega t}\mathrm dt$`,r`$\int f(t)e^{2i\pi\lambda t}\mathrm dt$`],a:0,e:`La 2ᵉ est Laplace, la 3ᵉ est cₙ.`},
{q:`La TF de la porte Π est…`,o:[`sin(πλ)/(πλ)`,`une porte`,`une gaussienne`,`1`],a:0,e:`Sinus cardinal.`},
{q:`On rend un signal 2 fois plus court (f(2t)). Son spectre…`,o:[`devient 2 fois plus large (et 2 fois moins haut)`,`devient 2 fois plus étroit`,`ne change pas`,`est décalé`],a:0,e:r`$\frac12\hat f(\frac\lambda2)$.`},
{q:`Retarder f de a multiplie f̂ par…`,o:[r`$e^{-2i\pi\lambda a}$`,r`$e^{-a}$`,`a`,r`$e^{-ap}$`],a:0,e:`Le module du spectre ne change pas.`},
{q:`f paire et réelle ⇒ f̂ est…`,o:[`paire et réelle`,`impaire et imaginaire`,`nulle`,`complexe quelconque`],a:0,e:``},
{q:`L'échelon U(t) a-t-il une TF (au sens des fonctions) ?`,o:[`Non, il n'est pas intégrable sur ℝ`,`Oui, 1/p`,`Oui, 1`,`Oui, δ`],a:0,e:`Pour lui, on utilise Laplace.`},
{q:`Plancherel-Parseval dit que…`,o:[`∫|f|² = ∫|f̂|² (même énergie en temps et en fréquence)`,`f̂ est continue`,`f = f̂`,`∫f = f̂(1)`],a:0,e:``},
{q:r`$\hat f(0)$ est égal à…`,o:[r`$\int_{-\infty}^{+\infty}f(t)\,\mathrm dt$`,`f(0)`,`0`,`max |f|`],a:0,e:`Aire sous le signal.`}];
Q.ma8=[
{q:r`$\mathcal L[1]=$`,o:[r`$\frac1p$`,`1`,`p`,r`$\frac1{p^2}$`],a:0,e:`Pour Re p > 0.`},
{q:r`$\mathcal L[e^{3t}]=$`,o:[r`$\frac1{p-3}$ (Re p > 3)`,r`$\frac1{p+3}$`,r`$\frac3p$`,r`$e^{-3p}$`],a:0,e:``},
{q:r`$\mathcal L[t^2]=$`,o:[r`$\frac2{p^3}$`,r`$\frac1{p^2}$`,r`$\frac2{p^2}$`,r`$\frac{1}{p^3}$`],a:0,e:r`$\frac{n!}{p^{n+1}}$.`},
{q:r`$\mathcal L[f']=$`,o:[r`$pF(p)-f(0)$`,r`$pF(p)$`,r`$F'(p)$`,r`$\frac{F(p)}p$`],a:0,e:`Dériver = multiplier par p (et la condition initiale apparaît).`},
{q:r`$\mathcal L[e^{at}f(t)]=$`,o:[r`$F(p-a)$`,r`$F(p+a)$`,r`$e^{-ap}F(p)$`,r`$aF(p)$`],a:0,e:``},
{q:r`$\mathcal L[f(t-a)U(t-a)]=$`,o:[r`$e^{-ap}F(p)$`,r`$F(p-a)$`,r`$F(p)-a$`,r`$e^{ap}F(p)$`],a:0,e:`Théorème du retard.`},
{q:r`L'original de $\frac{p}{p^2+9}$ est…`,o:[r`$\cos3t$`,r`$\sin3t$`,r`$\frac13\sin3t$`,r`$e^{3t}$`],a:0,e:``},
{q:r`L'original de $\frac1{(p-2)^2}$ est…`,o:[r`$te^{2t}$`,r`$e^{2t}$`,r`$t^2e^{2t}$`,r`$\frac{e^{2t}}2$`],a:0,e:r`$\frac1{p^2}\leftrightarrow t$, décalé de 2.`},
{q:`Un pôle de F(p) à partie réelle positive signifie que f(t)…`,o:[`croît exponentiellement`,`s'amortit`,`est constante`,`est nulle`],a:0,e:``},
{q:`Pour retrouver f à partir d'une fraction rationnelle F(p), on…`,o:[`décompose en éléments simples puis on lit le dictionnaire`,`dérive F`,`calcule F(0)`,`intègre F de 0 à ∞`],a:0,e:``},
{q:`Pourquoi Laplace est pratique pour les EDO ?`,o:[`elle transforme l'EDO en équation algébrique, conditions initiales incluses`,`elle supprime le second membre`,`elle évite les exponentielles`,`elle donne directement le régime permanent`],a:0,e:``}];

Q.mapat=[
{q:`« Calculer ∫₀¹ x e^{3x} dx »`,o:[`IPP avec u = x`,`changement de variable u = 3x seul`,`éléments simples`,`linéariser`],a:0,e:`Polynôme × exponentielle.`},
{q:`« Écrire (1 + i)^{10} sous forme algébrique »`,o:[`passer en forme exponentielle, puis revenir`,`développer avec le binôme`,`calculer les racines`,`Euler`],a:0,e:`√2 e^{iπ/4} puissance 10 = 32 e^{i5π/2} = 32i.`},
{q:`« ∬ sur le disque x² + y² ≤ 4 de √(x² + y²) »`,o:[`polaires (avec le facteur r)`,`Fubini en cartésiennes`,`sphériques`,`Cramer`],a:0,e:``},
{q:`« Résoudre u″ − 4u′ + 4u = e^{2t} »`,o:[`racine double 2 et second membre e^{2t} : u_p = A t² e^{2t}`,`u_p = A e^{2t}`,`u_p = A t e^{2t}`,`u_p = A`],a:0,e:`m = 2 est racine DOUBLE.`},
{q:`« Montrer que A est inversible et calculer A⁻¹ (3×3) »`,o:[`det ≠ 0 puis Gauss-Jordan ou comatrice, et vérifier`,`inverser chaque coefficient`,`Cramer`,`transposer`],a:0,e:``},
{q:`« f paire, 2π-périodique : coefficients de Fourier »`,o:[`bₙ = 0, calculer a₀ et aₙ sur [0, π] (× 2)`,`aₙ = 0`,`tout calculer sur [−π, π]`,`seulement a₀`],a:0,e:``},
{q:`« En déduire Σ 1/(2p + 1)² »`,o:[`Parseval (ou Dirichlet en un point) sur le créneau`,`IPP`,`Laplace`,`comparaison`],a:0,e:``},
{q:`« Nature de ∫₁^∞ (t + 1)/(t³ + 2) dt »`,o:[`équivalent à 1/t² en +∞ : converge`,`diverge car le numérateur tend vers ∞`,`calculer une primitive exacte obligatoirement`,`ça dépend de t`],a:0,e:``},
{q:`« Transformée de Laplace de f définie par un graphe en morceaux »`,o:[`l'écrire avec des U(t − a), chaque morceau en (t − a), retard`,`intégrer le graphe`,`Fourier`,`dériver`],a:0,e:``},
{q:`« Résoudre y″ + y = 0, y(0) = 1, y′(0) = 2 par Laplace »`,o:[`(p² + 1)Y = p + 2, puis dictionnaire : cos t + 2 sin t`,`équation caractéristique seulement`,`Y = 1/p`,`Fourier`],a:0,e:``},
{q:`« Système 2×2 avec paramètre m »`,o:[`Cramer (det en fonction de m)`,`Gauss obligatoire`,`polaires`,`IPP`],a:0,e:``},
{q:`« Calculer ∫ dx/(x² − 1) »`,o:[`éléments simples : ½(1/(x − 1) − 1/(x + 1))`,`arctan`,`IPP`,`u = x²`],a:0,e:`x² − 1 se factorise (≠ x² + 1 qui donne arctan).`}];

const card=(k,a)=>C[k]=a.map(([f,b])=>({f,b}));
card('ma1',[[`Module et argument de $a+ib$`,r`$|z|=\sqrt{a^2+b^2}$ ; $\cos\theta=a/|z|$, $\sin\theta=b/|z|$ (attention au quadrant).`],[`Diviser deux complexes`,`Multiplier haut et bas par le conjugué du dénominateur.`],[`Formules d'Euler`,r`$\cos\theta=\frac{e^{i\theta}+e^{-i\theta}}2$, $\sin\theta=\frac{e^{i\theta}-e^{-i\theta}}{2i}$`],[`De Moivre`,r`$(\cos\theta+i\sin\theta)^n=\cos n\theta+i\sin n\theta$`],[`Racines carrées de X + iY`,r`$a^2-b^2=X$, $2ab=Y$, $a^2+b^2=\sqrt{X^2+Y^2}$ ; signe de Y ⇒ signes de a, b.`],[`Racines n-ièmes de $Re^{i\alpha}$`,r`$R^{1/n}e^{i(\alpha+2k\pi)/n}$, $k=0..n-1$ : polygone régulier.`],[`Multiplier par $e^{i\theta}$`,`Tourner de θ.`],[`Équation du 2ᵈ degré dans ℂ`,r`$\Delta$, puis δ tel que $\delta^2=\Delta$, puis $\frac{-b\pm\delta}{2a}$.`]]);
card('ma2',[[`Théorème fondamental`,r`$\int_a^bf=F(b)-F(a)$ ; $\left(\int_a^xf\right)'=f(x)$`],[`IPP`,r`$\int uv'=[uv]-\int u'v$ ; u = polynôme / ln, v′ = exp / trig.`],[`Changement de variable`,r`$t=\varphi(u)$, $\mathrm dt=\varphi'(u)\mathrm du$, nouvelles bornes.`],[`Primitive de $u'/u$`,r`$\ln|u|$`],[`Primitive de $\frac1{1+x^2}$`,r`$\arctan x$`],[`Élément simple $\frac A{x-a}$`,r`$A\ln|x-a|$`],[`Méthode du cache`,`Multiplier par (x − a) et faire x = a.`],[`f impaire sur [−a, a]`,`Intégrale nulle.`]]);
card('ma3',[[`Solution de $au'+bu=0$`,r`$Ce^{-bt/a}$`],[`Structure d'une solution`,`u = u_h (toutes) + u_p (une).`],[`Second membre $e^{mt}$, m = −b/a (ordre 1)`,`Résonance : u_p = A t e^{mt}.`],[`Équation caractéristique`,r`$ar^2+br+c=0$ (on essaie $e^{rt}$).`],[`Δ > 0`,r`$\lambda e^{r_1t}+\mu e^{r_2t}$`],[`Δ = 0`,r`$(\lambda+\mu t)e^{rt}$`],[`Δ < 0, racines α ± iβ`,r`$e^{\alpha t}(\lambda\cos\beta t+\mu\sin\beta t)$`],[`Second membre trig × exp`,`Passer par la forme complexe, prendre la partie réelle.`]]);
card('ma4',[[`Fubini`,`On intègre variable par variable ; bornes intérieures fonctions des extérieures.`],[`Polaires`,r`$\mathrm dx\,\mathrm dy=r\,\mathrm dr\,\mathrm d\theta$`],[`Cylindriques`,r`$\mathrm dV=r\,\mathrm dr\,\mathrm d\theta\,\mathrm dz$`],[`Sphériques (latitude φ)`,r`$\mathrm dV=r^2\cos\varphi\,\mathrm dr\,\mathrm d\theta\,\mathrm d\varphi$`],[`Masse`,r`$\iiint\rho\,\mathrm dV$`],[`Centre d'inertie`,r`$x_G=\frac1m\iiint x\rho\,\mathrm dV$`],[`Moment d'inertie / Oz`,r`$\iiint(x^2+y^2)\rho\,\mathrm dV$`],[`Rectangle × fonction séparée`,`Produit de deux intégrales simples.`]]);
card('ma5',[[`Produit (i, j)`,`Ligne i de A · colonne j de B.`],[`det 2×2`,`ad − bc`],[`Inverse 2×2`,r`$\frac1{ad-bc}\begin{pmatrix}d&-b\\-c&a\end{pmatrix}$`],[`Inversible ⇔`,`det ≠ 0`],[`Opérations de Gauss`,`Échange, multiplication par λ ≠ 0, Lᵢ ← Lᵢ + λLⱼ.`],[`det(AB)`,`det A · det B`],[`Cramer`,r`$x_i=\det A_i/\det A$`],[`Sens de |det A|`,`Facteur d'aire (volume) de la transformation.`]]);
card('ma6',[[`a₀, aₙ, bₙ`,r`$\frac1T\int f$, $\frac2T\int f\cos n\omega t$, $\frac2T\int f\sin n\omega t$`],[`cₙ`,r`$\frac1T\int f e^{-in\omega t}$ ; $c_n=\frac{a_n-ib_n}2$`],[`Dirichlet`,`Converge vers (f(t⁺) + f(t⁻))/2.`],[`Parseval`,r`$\frac1T\int f^2=a_0^2+\frac12\sum(a_n^2+b_n^2)$`],[`Parité`,`Paire ⇒ cosinus seulement ; impaire ⇒ sinus seulement.`],[`Spectre`,r`$A_n=\sqrt{a_n^2+b_n^2}=2|c_n|$`],[`Créneau ±A`,r`$\frac{4A}\pi\sum\frac{\sin(2p+1)t}{2p+1}$`],[`$\sum1/n^2$`,r`$\pi^2/6$`]]);
card('ma7',[[`Riemann en +∞`,r`$\int_1^\infty t^{-\alpha}$ converge ⇔ α > 1`],[`Riemann en 0`,r`$\int_0^1t^{-\alpha}$ converge ⇔ α < 1`],[`TF`,r`$\hat f(\lambda)=\int f(t)e^{-2i\pi\lambda t}\mathrm dt$`],[`TF de la porte Π`,r`$\frac{\sin\pi\lambda}{\pi\lambda}$`],[`TF de $e^{-a|t|}$`,r`$\frac{2a}{a^2+4\pi^2\lambda^2}$`],[`Retard`,r`$f(t-a)\to e^{-2i\pi\lambda a}\hat f$`],[`Inversion`,r`$f(t)=\int\hat f(\lambda)e^{2i\pi\lambda t}\mathrm d\lambda$`],[`Plancherel`,r`$\int|f|^2=\int|\hat f|^2$`]]);
card('ma8',[[`Définition`,r`$F(p)=\int_0^\infty f(t)e^{-pt}\mathrm dt$`],[`$\mathcal L[t^n]$`,r`$\frac{n!}{p^{n+1}}$`],[`$\mathcal L[e^{at}]$`,r`$\frac1{p-a}$`],[`cos / sin`,r`$\frac{p}{p^2+\omega^2}$ / $\frac{\omega}{p^2+\omega^2}$`],[`Dérivée`,r`$pF-f(0)$ ; $p^2F-pf(0)-f'(0)$`],[`Retard`,r`$f(t-a)U(t-a)\to e^{-ap}F$`],[`Décalage`,r`$e^{at}f\to F(p-a)$`],[`Méthode EDO`,`Transformer, isoler Y, éléments simples, dictionnaire.`]]);
})();

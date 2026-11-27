/* ============ Électronique analogique : quiz & flashcards ============ */
(function(){
const r=String.raw; const Q=window.EM_DATA.quiz, C=window.EM_DATA.cards;

Q.el1=[
{q:`Le sens conventionnel du courant est…`,o:[`l'inverse du sens de déplacement des électrons`,`le sens de déplacement des électrons`,`du − vers le + à l'extérieur du générateur`,`arbitraire et sans lien avec les électrons`],a:0,e:`Par convention, le courant va du + vers le − dans le circuit extérieur ; les électrons (négatifs) vont en sens inverse.`},
{q:r`La flèche de la tension $U_{AB}$ est dessinée…`,o:[`de B vers A (pointe sur A)`,`de A vers B (pointe sur B)`,`dans le sens du courant`,`toujours vers le haut`],a:0,e:r`$U_{AB}=V_A-V_B$ : la pointe de la flèche est sur le point dont on prend le potentiel en premier (A).`},
{q:`Convention récepteur :`,o:[`flèches de tension et de courant en sens OPPOSÉS`,`flèches dans le même sens`,`la tension est toujours positive`,`réservée aux générateurs`],a:0,e:`Récepteur : le courant « descend » le potentiel (entre par la borne où pointe la flèche de U). Générateur : flèches dans le même sens. Les passifs R, L, C sont en convention récepteur, les sources en convention générateur.`},
{q:`Dans un circuit, on peut placer…`,o:[`une seule masse (référence 0 V)`,`autant de masses que de mailles`,`une masse par source`,`aucune masse en régime continu`],a:0,e:`La masse est LA référence de potentiel ; deux masses = deux références différentes reliées implicitement.`},
{q:`La résistance d'un court-circuit est…`,o:[`0 Ω (tension nulle quel que soit I)`,`infinie`,`1 Ω`,`indéterminée`],a:0,e:`Fil idéal : U = 0. Le circuit ouvert, lui, a R = ∞ (I = 0 quelle que soit U).`},
{q:`Un générateur de tension idéal impose…`,o:[`sa tension, quel que soit le courant qui le traverse`,`son courant`,`sa puissance`,`une tension qui dépend de la charge`],a:0,e:`Le courant est imposé par le reste du circuit (et peut être de signe quelconque).`},
{q:r`Deux résistances $R_1$ et $R_2$ en parallèle :`,o:[r`$R_{eq}=\dfrac{R_1R_2}{R_1+R_2}$`,r`$R_{eq}=R_1+R_2$`,r`$R_{eq}=\dfrac{R_1+R_2}{R_1R_2}$`,r`$R_{eq}=\sqrt{R_1R_2}$`],a:0,e:r`$\frac1{R_{eq}}=\frac1{R_1}+\frac1{R_2}$. Toujours plus petite que la plus petite des deux.`},
{q:`La puissance reçue par une résistance est…`,o:[r`toujours positive : $P=RI^2$`,`négative si le courant change de sens`,`nulle en continu`,r`$P=R/I^2$`],a:0,e:`Une résistance est toujours réceptrice : elle dissipe par effet Joule.`},
{q:`Loi des mailles : dans une maille…`,o:[`la somme algébrique des tensions est nulle`,`la somme des courants est nulle`,`toutes les tensions sont égales`,`le courant est le même partout`],a:0,e:`On parcourt la maille dans un sens : + pour les flèches dans ce sens, − sinon. Somme = 0. (La loi des nœuds porte sur les courants.)`},
{q:r`Diviseur de tension (E, $R_1$ en haut, $R_2$ en bas) : $U_{R_2}=$`,o:[r`$E\dfrac{R_2}{R_1+R_2}$`,r`$E\dfrac{R_1}{R_1+R_2}$`,r`$E\dfrac{R_1R_2}{R_1+R_2}$`,r`$E\dfrac{R_2}{R_1}$`],a:0,e:`La résistance « dont on veut la tension » au numérateur. Valable SEULEMENT si aucun courant ne sort au point milieu.`},
{q:r`Diviseur de courant ($I$ se partage entre $R_1$ et $R_2$) : $I_2=$`,o:[r`$I\dfrac{R_1}{R_1+R_2}$`,r`$I\dfrac{R_2}{R_1+R_2}$`,r`$I\dfrac{R_1R_2}{R_1+R_2}$`,r`$I/2$`],a:0,e:`Piège : c'est l'AUTRE résistance au numérateur. Le courant préfère le chemin le moins résistant.`},
{q:`Pour calculer $R_{th}$, on éteint les sources : une source de tension devient…`,o:[`un court-circuit (fil)`,`un circuit ouvert`,`une résistance de 1 Ω`,`on la laisse`],a:0,e:`Source de tension éteinte = 0 V = fil. Source de courant éteinte = 0 A = circuit ouvert.`},
{q:`$E_{th}$ est…`,o:[`la tension à vide entre A et B`,`la tension aux bornes de la charge`,`la tension de la plus grosse source`,`$R_{th}\\times I$ quel que soit I`],a:0,e:`À vide = sans charge branchée entre A et B. Et $I_N$ = courant de court-circuit entre A et B ; $E_{th}=R_{th}I_N$.`},
{q:`Le théorème de superposition s'applique…`,o:[`aux circuits linéaires avec sources indépendantes`,`aux puissances`,`seulement à deux sources`,`à n'importe quel circuit, même non linéaire`],a:0,e:`On additionne les tensions/courants (pas les puissances, qui sont quadratiques !).`},
{q:`Millman donne directement…`,o:[`la tension d'un nœud relié à plusieurs branches (E_k, R_k)`,`le courant dans une maille`,`la résistance équivalente`,`la puissance totale`],a:0,e:r`$U=\frac{\sum E_k/R_k}{\sum 1/R_k}$ — une branche sans source compte $0/R$ au numérateur mais $1/R$ au dénominateur.`},
];
C.el1=[
{f:`Courant électrique`,b:r`$I=\Delta Q/\Delta t$ (A) ; sens conventionnel inverse de celui des électrons.`},
{f:`Tension $U_{AB}$`,b:r`$U_{AB}=V_A-V_B$, flèche de B vers A (pointe sur A).`},
{f:`Conventions récepteur / générateur`,b:`Récepteur : flèches U et I opposées (R, L, C). Générateur : même sens (sources). P = UI > 0 = reçue (récepteur) / fournie (générateur).`},
{f:`Loi des nœuds / des mailles`,b:`Σ courants entrants = Σ sortants ; dans une maille, Σ algébrique des tensions = 0.`},
{f:`Associations de résistances`,b:r`Série : $R_1+R_2$. Parallèle : $\frac{R_1R_2}{R_1+R_2}$.`},
{f:`Diviseur de tension`,b:r`$U_2=E\frac{R_2}{R_1+R_2}$ (même courant dans R₁ et R₂, rien ne sort au milieu).`},
{f:`Diviseur de courant`,b:r`$I_2=I\frac{R_1}{R_1+R_2}$ (l'AUTRE résistance au numérateur).`},
{f:`Thévenin : méthode`,b:`E_th = tension à vide entre A et B. R_th = résistance vue de A–B, sources éteintes (tension → fil, courant → ouvert).`},
{f:`Norton ↔ Thévenin`,b:r`$R_N=R_{th}$, $E_{th}=R_{th}I_N$, $I_N$ = courant de court-circuit.`},
{f:`Superposition`,b:`Une source à la fois (les autres éteintes), on somme les contributions. Sources indépendantes, circuit linéaire.`},
{f:`Millman`,b:r`$U=\dfrac{\sum E_k/R_k}{\sum 1/R_k}$ (branches en parallèle ; source de courant : +I_k au numérateur).`},
{f:`Puissance`,b:`p(t) = u(t)·i(t) ; continu P = UI ; résistance P = RI² = U²/R (effet Joule).`},
];

Q.el2=[
{q:r`Loi du condensateur (convention récepteur) :`,o:[r`$i=C\dfrac{\mathrm du}{\mathrm dt}$`,r`$u=C\dfrac{\mathrm di}{\mathrm dt}$`,r`$u=Ci$`,r`$i=\dfrac1C\int u\,\mathrm dt$`],a:0,e:`Vient de q = Cu et i = dq/dt.`},
{q:`Ce qui ne peut pas varier brutalement dans un condensateur :`,o:[`sa tension`,`son courant`,`les deux`,`aucun des deux`],a:0,e:r`Un saut de u donnerait $i=C\,\mathrm du/\mathrm dt$ infini. Le courant, lui, peut sauter. → condition initiale $u_C(0^+)=u_C(0^-)$.`},
{q:`Ce qui ne peut pas varier brutalement dans une bobine :`,o:[`son courant`,`sa tension`,`les deux`,`aucun`],a:0,e:r`Un saut de i donnerait $u=L\,\mathrm di/\mathrm dt$ infini. → $i_L(0^+)=i_L(0^-)$.`},
{q:`En régime permanent continu, un condensateur se comporte comme…`,o:[`un circuit ouvert`,`un fil`,`une résistance`,`une source de courant`],a:0,e:`u constante ⇒ i = C du/dt = 0. (La bobine, elle, devient un fil : u = L di/dt = 0.)`},
{q:`Constante de temps d'un circuit RC :`,o:[`τ = RC`,`τ = R/C`,`τ = 1/(RC)`,`τ = √(RC)`],a:0,e:`[RC] = Ω·F = (V/A)·(A·s/V) = s. RL : τ = L/R.`},
{q:`À t = τ, en charge, $u_C$ vaut…`,o:[`63 % de E`,`50 % de E`,`37 % de E`,`99 % de E`],a:0,e:r`$1-e^{-1}\approx0{,}63$. À 3τ : 95 %, à 5τ : 99 % (on considère le régime atteint).`},
{q:`Charge RC : courant juste après la fermeture ?`,o:[r`$E/R$ (maximal)`,`0`,`E/(2R)`,`infini`],a:0,e:r`$u_C(0^+)=0$ donc toute la tension E est sur R : $i(0^+)=E/R$, puis décroissance exponentielle.`},
{q:`Énergie stockée dans une bobine :`,o:[r`$\tfrac12Li^2$`,r`$Li^2$`,r`$\tfrac12Cu^2$`,r`$\tfrac12L^2i$`],a:0,e:`Une bobine idéale ne dissipe rien : elle stocke puis restitue.`},
{q:`Condensateurs en série :`,o:[r`$\frac1{C_{eq}}=\sum\frac1{C_k}$`,r`$C_{eq}=\sum C_k$`,r`$C_{eq}=\prod C_k$`,`$C_{eq}$ = le plus grand`],a:0,e:`C'est l'inverse des résistances : en parallèle les C s'ajoutent. Les bobines se comportent comme les résistances.`},
{q:r`RLC série libre : $\omega_0=$`,o:[r`$1/\sqrt{LC}$`,r`$\sqrt{LC}$`,r`$R/2L$`,r`$1/(RC)$`],a:0,e:r`λ = R/2L est le facteur d'amortissement. Polynôme : $r^2+2\lambda r+\omega_0^2=0$.`},
{q:r`RLC série : régime pseudo-périodique si…`,o:[r`$Q>1/2$ (Δ < 0)`,r`$Q<1/2$`,r`$Q=1/2$`,`R est grand`],a:0,e:r`$Q=\frac1R\sqrt{\frac LC}$. Peu de résistance ⇒ λ < ω₀ ⇒ racines complexes ⇒ oscillations amorties.`},
{q:`Régime critique :`,o:[`retour à l'équilibre le plus rapide sans oscillation`,`oscillations sans amortissement`,`retour le plus lent`,`divergence`],a:0,e:r`Racine double $r=-\lambda$, solution $(A_1t+A_2)e^{-\lambda t}$.`},
{q:`Pseudo-pulsation ω en régime pseudo-périodique :`,o:[r`$\sqrt{\omega_0^2-\lambda^2}$`,r`$\omega_0$`,r`$\omega_0^2-\lambda^2$`,r`$\lambda$`],a:0,e:r`Racines $-\lambda\pm j\omega$. Si λ ≪ ω₀ (Q grand), ω ≈ ω₀.`},
];
C.el2=[
{f:`Condensateur : loi, continuité, permanent`,b:r`$i=C\frac{\mathrm du}{\mathrm dt}$ ; u continue ; en continu permanent = circuit ouvert ; $E=\frac12Cu^2$.`},
{f:`Bobine : loi, continuité, permanent`,b:r`$u=L\frac{\mathrm di}{\mathrm dt}$ ; i continu ; en continu permanent = fil ; $E=\frac12Li^2$.`},
{f:`Associations C et L`,b:`C en parallèle : s'ajoutent ; en série : inverses. L comme les résistances.`},
{f:`Méthode : régime transitoire 1ᵉʳ ordre`,b:`1. Lois (mailles, Ohm, composant) → EDO. 2. Forme τ y' + y = y∞. 3. y = A e^(−t/τ) + y∞. 4. A par continuité (u_C ou i_L à 0⁺).`},
{f:`Charge RC`,b:r`$u_C=E(1-e^{-t/RC})$, $i=\frac ER e^{-t/RC}$.`},
{f:`Décharge RC`,b:r`$u_C=Ee^{-t/RC}$, $i=-\frac ER e^{-t/RC}$.`},
{f:`Établissement RL`,b:r`$i=\frac ER(1-e^{-Rt/L})$, $u_L=Ee^{-Rt/L}$.`},
{f:`Repères temporels`,b:`τ : 63 % ; 3τ : 95 % ; 5τ : 99 %. Tangente à l'origine coupe l'asymptote en τ.`},
{f:`RLC série : équation`,b:r`$LC\ddot u_C+RC\dot u_C+u_C=e(t)$ ; $\omega_0=\frac1{\sqrt{LC}}$, $\lambda=\frac R{2L}$, $Q=\frac1R\sqrt{\frac LC}$.`},
{f:`Les 3 régimes`,b:r`Δ = 4(λ² − ω₀²). Δ > 0 apériodique (Q < ½) ; Δ = 0 critique ; Δ < 0 pseudo-périodique (Q > ½), $\omega=\sqrt{\omega_0^2-\lambda^2}$.`},
];

Q.el3=[
{q:`Un signal $V(t)=V_m\\cos(\\omega t+\\phi)+V_{DC}$ : $V_{DC}$ est…`,o:[`l'offset (composante continue)`,`l'amplitude`,`la phase`,`la valeur efficace`],a:0,e:`Le GBF règle fréquence, amplitude (crête-à-crête), offset et phase. $V_m=V_{cc}/2$.`},
{q:`Valeur efficace d'une sinusoïde d'amplitude $V_m$ :`,o:[r`$V_m/\sqrt2$`,r`$V_m/2$`,r`$V_m\sqrt2$`,r`$V_m$`],a:0,e:`C'est la tension continue qui dissiperait la même puissance moyenne dans une résistance. Le 230 V du secteur est une valeur efficace (amplitude 325 V).`},
{q:`Déphasage mesuré : décalage d = 2 ms, période D = 20 ms :`,o:[`π/5 rad = 36°`,`π/10 rad`,`2 rad`,`10°`],a:0,e:r`$\Delta\phi=2\pi d/D=2\pi/10=\pi/5$.`},
{q:`En notation complexe, dériver revient à…`,o:[`multiplier par jω`,`diviser par jω`,`multiplier par ω`,`prendre la partie réelle`],a:0,e:r`$\frac{\mathrm d}{\mathrm dt}Xe^{j\omega t}=j\omega Xe^{j\omega t}$. Intégrer : diviser par jω. Les EDO deviennent des équations algébriques.`},
{q:`Impédance d'un condensateur :`,o:[r`$\dfrac1{jC\omega}$`,r`$jC\omega$`,r`$jL\omega$`,r`$C\omega$`],a:0,e:`Module 1/(Cω) : infini en BF (coupe-circuit), nul en HF (fil). Bobine : jLω (l'inverse).`},
{q:`Module de $Z=1+jRC\\omega$ :`,o:[r`$\sqrt{1+(RC\omega)^2}$`,r`$1+RC\omega$`,r`$1+(RC\omega)^2$`,r`$RC\omega$`],a:0,e:`|a + jb| = √(a² + b²).`},
{q:`$\\arg\\left(\\dfrac{1}{1+jRC\\omega}\\right)=$`,o:[r`$-\arctan(RC\omega)$`,r`$\arctan(RC\omega)$`,r`$\pi/2$`,`0`],a:0,e:`arg(num) − arg(dén) = 0 − arctan(RCω).`},
{q:`Un gain de −20 dB correspond à…`,o:[`une amplitude divisée par 10`,`une amplitude divisée par 20`,`une amplitude divisée par 100`,`un gain nul`],a:0,e:`G_dB = 20 log G ⇒ G = 10^(−1). −3 dB ⇔ G = 1/√2 (puissance divisée par 2), −40 dB ⇔ /100.`},
{q:`Pente asymptotique HF d'un passe-bas du 1ᵉʳ ordre :`,o:[`−20 dB/décade`,`−6 dB/décade`,`−40 dB/décade`,`0`],a:0,e:`H ≈ 1/(jx) ⇒ −20 log x : −20 dB chaque fois que la fréquence ×10 (= −6 dB/octave). 2ᵈ ordre : −40 dB/déc.`},
{q:`La pulsation de coupure à −3 dB est définie par…`,o:[r`$G(\omega_c)=G_{max}/\sqrt2$`,r`$G(\omega_c)=G_{max}/2$`,r`$G(\omega_c)=0$`,r`$G(\omega_c)=G_{max}-3$`],a:0,e:`En linéaire : /√2 ; en dB : −3 dB. La bande passante est l'intervalle où G ≥ Gmax/√2.`},
{q:`L'ordre d'un filtre est…`,o:[`le degré du polynôme en jω du dénominateur de H`,`le nombre de résistances`,`la pente en dB/déc`,`le nombre de fréquences de coupure`],a:0,e:`Ordre n ⇒ pente asymptotique jusqu'à 20n dB/décade.`},
{q:`R en série puis C en sortie (sortie sur C) : quel filtre ?`,o:[`passe-bas`,`passe-haut`,`passe-bande`,`coupe-bande`],a:0,e:`BF : C ouvert ⇒ v_s = v_e. HF : C = fil ⇒ v_s = 0. Ça laisse passer les basses fréquences.`},
];
C.el3=[
{f:`Signal sinusoïdal`,b:r`$V_m\cos(\omega t+\phi)+V_{DC}$, $\omega=2\pi f$, $T=1/f$, $V_{eff}=V_m/\sqrt2$.`},
{f:`Déphasage à partir d'un graphe`,b:r`$\Delta\phi=2\pi\,d/T$ ; signe + si le signal est EN AVANCE (son pic arrive avant).`},
{f:`Passage en complexe`,b:r`$x=X_m\cos(\omega t+\phi)\to\underline X=X_me^{j\phi}$ ; retour : $X_m=|\underline X|$, $\phi=\arg\underline X$.`},
{f:`Dériver / intégrer en complexe`,b:`× jω / ÷ jω.`},
{f:`Impédances`,b:r`$Z_R=R$, $Z_L=jL\omega$, $Z_C=\frac1{jC\omega}$ ; série : somme ; parallèle : inverses.`},
{f:`Fonction de transfert`,b:r`$\underline H=\underline V_s/\underline V_e$ ; gain $G=|\underline H|$ ; déphasage $\phi=\arg\underline H$.`},
{f:`Décibels`,b:`G_dB = 20 log G ; ×10 ↔ +20 dB ; /√2 ↔ −3 dB.`},
{f:`Coupure, bande passante`,b:r`$G(\omega_c)=G_{max}/\sqrt2$ (−3 dB) ; bande passante : G ≥ Gmax/√2.`},
{f:`Décade / octave`,b:`Décade : ω → 10ω. Octave : ω → 2ω. Pentes en dB/déc.`},
{f:`Comportement asymptotique de L et C`,b:`BF : L = fil, C = ouvert. HF : L = ouvert, C = fil.`},
{f:`Passe-bas 1ᵉʳ ordre`,b:r`$H=\frac{H_0}{1+jx}$ : 0 dB puis −20 dB/déc, φ : 0 → −90°, −45° à x = 1.`},
{f:`Passe-bande 2ᵈ ordre`,b:r`$H=\frac{H_0}{1+jQ(x-1/x)}$ : +20 / −20 dB/déc, bande passante Δx = 1/Q.`},
];

Q.eltd1=[
{q:`Nœud N : entrent $I_A$ et 1000 A ; sortent 1 A, 10 A, 100 A. $I_A=$`,o:[`−889 A`,`889 A`,`1111 A`,`−1111 A`],a:0,e:`I_A + 1000 = 111 ⇒ I_A = −889 A : le vrai courant sort vers A.`},
{q:`$V_6$ du diviseur (V = 4 V, R₄ = 100 Ω, R₅ = R₆ = 600 Ω) :`,o:[`3 V`,`2 V`,`3,43 V`,`1,71 V`],a:0,e:`R₅∥R₆ = 300 Ω ; V₆ = 4 × 300/400 = 3 V. Il faut D'ABORD regrouper R₅∥R₆.`},
{q:`Pont de Wheatstone équilibré (U = 0) :`,o:[r`$R_1R_3=R_2R_4$`,r`$R_1R_2=R_3R_4$`,r`$R_1+R_3=R_2+R_4$`,r`$R_1=R_2$`],a:0,e:`Les deux points milieux au même potentiel : R₂/(R₁+R₂) = R₃/(R₃+R₄).`},
{q:`Branche « E en série avec R » vue comme Norton :`,o:[`I = E/R en parallèle avec R`,`I = E·R`,`I = E en parallèle avec R`,`impossible`],a:0,e:`C'est la conversion clé de l'exo 3 : on transforme chaque branche en Norton pour ajouter les courants.`},
{q:`Dans l'exo 6 (superposition), en éteignant E on la remplace par…`,o:[`un fil`,`un circuit ouvert`,`une résistance R`,`une source de courant`],a:0,e:`Source de tension éteinte = 0 V = fil.`},
];
Q.eltd2=[
{q:`RC avec R = 100 Ω, C = 100 µF : τ =`,o:[`10 ms`,`1 ms`,`0,1 s`,`10 µs`],a:0,e:`100 × 100·10⁻⁶ = 10⁻² s.`},
{q:`Juste avant l'ouverture (exo 3), la bobine idéale en régime permanent est…`,o:[`un fil : u = 0`,`un circuit ouvert`,`une source de 10 V`,`traversée par 0 A`],a:0,e:`Donc R est court-circuitée : u = 0 et tout le courant E/r = 1 A passe dans L.`},
{q:`Juste après l'ouverture (exo 3), quelle grandeur garde sa valeur ?`,o:[`le courant dans L`,`la tension u`,`le courant dans r`,`aucune`],a:0,e:`Continuité du courant dans la bobine ; u, elle, saute de 0 à R·i(0).`},
{q:`Au bout de combien de τ la charge diffère de 0,01 % de sa limite ?`,o:[`ln(10⁴) ≈ 9,2 τ`,`5 τ`,`4 τ`,`100 τ`],a:0,e:`e^(−t/τ) = 10⁻⁴ ⇒ t = τ ln 10⁴.`},
{q:`Exo 5 : Q = (1/r)√(L/C) ≈ 82. Le régime est…`,o:[`pseudo-périodique très peu amorti`,`apériodique`,`critique`,`divergent`],a:0,e:`Q ≫ 1/2 : ~60 oscillations avant que l'amplitude soit divisée par 10.`},
];
Q.eltd3=[
{q:`Deux sources de fréquences ω et 2ω : on peut…`,o:[`appliquer la superposition et revenir au temps pour chaque fréquence`,`additionner les amplitudes complexes`,`utiliser une seule impédance`,`ignorer la plus haute fréquence`],a:0,e:`Les amplitudes complexes n'ont de sens qu'à UNE fréquence : on calcule u₁(t) et u₂(t) séparément puis on les somme en temporel.`},
{q:`Filtre R–L–R₀ (exo 6), sortie sur R₀ : type ?`,o:[`passe-bas 1ᵉʳ ordre`,`passe-haut`,`passe-bande`,`coupe-bande`],a:0,e:`BF : L = fil ⇒ diviseur R/R₀ ⇒ H₀ = 1/2. HF : L = ouvert ⇒ 0.`},
{q:`Créneau de fréquence ≫ f_c à travers un passe-bas 1ᵉʳ ordre :`,o:[`sortie ≈ triangle (intégration)`,`sortie ≈ créneau intact`,`sortie ≈ impulsions`,`sortie ≈ sinusoïde pure de même amplitude`],a:0,e:`En HF, H ≈ H₀ω_c/(jω) : diviser par jω = intégrer.`},
{q:`Pont de Wien : H(x) =`,o:[r`$\dfrac{1/3}{1+j(x-1/x)/3}$`,r`$\dfrac{1}{1+jx}$`,r`$\dfrac{jx}{1+jx}$`,r`$\dfrac{1}{3+jx}$`],a:0,e:`Passe-bande, gain max 1/3 (−9,5 dB) à x = 1, Q = 1/3.`},
{q:`Pulsations de coupure réduites du pont de Wien :`,o:[`0,30 et 3,30`,`0,5 et 2`,`1/3 et 3`,`0,1 et 10`],a:0,e:`x − 1/x = ±3 ⇒ x = (±3 + √13)/2 ; leur produit vaut 1 et leur écart 3 = 1/Q.`},
];
C.eltd1=[{f:`Dipôle AB complexe → générateur réel`,b:`Convertir chaque branche (E,R) en Norton (E/R ∥ R), sommer les courants, combiner les R en parallèle, reconvertir en Thévenin.`},{f:`Résistances avec un fil entre deux points milieux`,b:`Les deux points sont au même potentiel : on les fusionne → associations parallèles puis série.`}];
C.eltd2=[{f:`« Fermé depuis très longtemps »`,b:`= régime permanent continu : C = circuit ouvert, L = fil. On calcule les valeurs à 0⁻, puis continuité de u_C / i_L.`},{f:`Thévenin vu par C (ou L)`,b:`Le reste du circuit → (E_th, R_th) ; τ = R_th·C (ou L/R_th), u_C∞ = E_th.`}];
C.eltd3=[{f:`Approximation à une fréquence donnée`,b:`Calculer x = ω/ω_c : x ≪ 1 ou x ≫ 1 ⇒ garder le terme dominant de H ; sinon module + argument exacts.`},{f:`Créneau à travers un filtre`,b:`Somme d'harmoniques impairs (4U/π)·sin(nωt)/n : chacun multiplié par |H(nω)| et déphasé de arg H(nω).`}];
Q.el4=[
{q:`Dans le modèle de l’AOP idéal, les courants d’entrée valent…`,o:[`i₊ = i₋ = 0`,`i₊ = i₋ ≠ 0`,`i₊ = −i₋`,`ils dépendent de la charge`],a:0,e:`Impédance d’entrée infinie.`},
{q:r`La relation $v_+=v_-$ est valable…`,o:[`en régime linéaire, avec une contre-réaction`,`toujours`,`seulement pour un comparateur`,`seulement en continu`],a:0,e:`Elle vient de ε = vs/A avec A → ∞ et vs fini (non saturé).`},
{q:`La contre-réaction relie la sortie à…`,o:[`l’entrée inverseuse v₋`,`l’entrée non inverseuse v₊`,`la masse`,`l’alimentation`],a:0,e:`Réaction négative ⇒ stabilisation (régime linéaire).`},
{q:`Une réaction positive provoque…`,o:[`la saturation de l’AOP`,`un gain de 1`,`un fonctionnement linéaire`,`une impédance d’entrée nulle`],a:0,e:`La sortie s’emballe jusqu’à ±Vsat.`},
{q:r`Gain de l’inverseur ($R_1$ à l’entrée, $R_2$ en contre-réaction) :`,o:[r`$-\frac{R_2}{R_1}$`,r`$1+\frac{R_2}{R_1}$`,r`$\frac{R_1}{R_2}$`,r`$-\frac{R_1}{R_2}$`],a:0,e:`Masse virtuelle : i = ve/R₁ traverse R₂.`},
{q:`Gain du non-inverseur :`,o:[r`$1+\frac{R_2}{R_1}$`,r`$-\frac{R_2}{R_1}$`,r`$\frac{R_2}{R_1}$`,`1`],a:0,e:`Diviseur au nœud v₋ : v₋ = vs·R₁/(R₁+R₂) = ve.`},
{q:`À quoi sert un suiveur (gain 1) ?`,o:[`isoler deux étages (adaptation d’impédance)`,`amplifier`,`inverser le signal`,`filtrer`],a:0,e:`Impédance d’entrée infinie, de sortie nulle.`},
{q:`Un intégrateur à AOP transforme un créneau en…`,o:[`un triangle`,`un sinus`,`des pics`,`un créneau plus grand`],a:0,e:`Une constante intégrée donne une rampe.`},
{q:`Comparateur simple, ue sur v₊ : si ue > Vref, alors us =`,o:[`+Vcc`,`−Vcc`,`0`,`Vref`],a:0,e:`ε = ue − Vref > 0.`},
{q:`L’intérêt du comparateur à hystérésis :`,o:[`éviter les basculements multiples dus au bruit`,`amplifier linéairement`,`augmenter la bande passante`,`supprimer l’offset`],a:0,e:`Deux seuils écartés de 2(R₁/R₂)Vcc.`},
{q:`GBW = 2 MHz, gain du montage 100 : bande passante ?`,o:[`20 kHz`,`200 MHz`,`2 MHz`,`200 Hz`],a:0,e:`BW = GBW / G.`},
{q:`Slew rate 1 V/µs, sinus de 5 V d’amplitude : fréquence max ≈`,o:[`32 kHz`,`200 kHz`,`5 MHz`,`1 kHz`],a:0,e:`f ≤ SR/(2πA) = 10⁶/(31,4) ≈ 32 kHz.`},
{q:`En single-supply (VSS = 0), il faut…`,o:[`recentrer le signal autour de VDD/2`,`rien de spécial`,`inverser l’alimentation`,`supprimer la contre-réaction`],a:0,e:`Sinon la partie négative du signal est coupée.`}];
C.el4=[{f:`AOP idéal`,b:`i₊ = i₋ = 0 ; vs = Aε ; si contre-réaction et non saturé : v₊ = v₋.`},{f:`Inverseur`,b:`vs = −(R₂/R₁)ve ; masse virtuelle v₋ = 0 ; Re = R₁.`},{f:`Non-inverseur`,b:`vs = (1 + R₂/R₁)ve ; gain ≥ 1.`},{f:`Sommateur`,b:`vs = −Rf(ve₁/R₁ + ve₂/R₂).`},{f:`Soustracteur`,b:`R₁ = R₃, R₂ = R₄ : vs = (R₂/R₁)(ve₂ − ve₁).`},{f:`Intégrateur / dérivateur`,b:`vs = −(1/RC)∫ve dt ; vs = −RC dve/dt.`},{f:`Seuils de l’hystérésis`,b:`VT± = [(R₁+R₂)Vref ± R₁Vcc]/R₂ ; largeur 2(R₁/R₂)Vcc.`},{f:`GBW`,b:`G × BW = constante (2 MHz pour le MCP6271).`},{f:`Slew rate`,b:`2πfA ≤ SR, sinon sortie triangulaire.`},{f:`Offset`,b:`Vout = −(R₂/R₁)Vin ± (1 + R₂/R₁)V_OS.`}];
})();

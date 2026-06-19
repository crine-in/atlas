## Module 1: Atomic & Molecular Structure

### Schrödinger Equation & Particle in a Box

#### The Time-Independent 1D Schrödinger Equation:
$$\frac{d^2\Psi}{dx^2} + \frac{8\pi^2m}{h^2}(E - V)\Psi = 0$$

#### Derivation of the Hamiltonian Form:
1. Rearrange the 1D Schrödinger equation:
   $$\frac{d^2\Psi}{dx^2} = -\frac{8\pi^2m}{h^2}(E - V)\Psi$$
2. Multiply both sides by $-\frac{h^2}{8\pi^2m}$:
   $$-\frac{h^2}{8\pi^2m}\frac{d^2\Psi}{dx^2} = (E - V)\Psi$$
3. Expand the right-hand side:
   $$-\frac{h^2}{8\pi^2m}\frac{d^2\Psi}{dx^2} + V\Psi = E\Psi$$
4. Define the Hamiltonian operator $\hat{H}$ representing total energy (kinetic + potential) in 1D as:
   $$\hat{H} = -\frac{h^2}{8\pi^2m}\frac{d^2}{dx^2} + V$$
5. Substituting the operator yields the classic form:
   $$\hat{H}\Psi = E\Psi$$
   *(For 3D systems, replace $\frac{d^2}{dx^2}$ with the Laplacian operator $\nabla^2$)*

**Key Variables:**
* $\Psi$: Wave function (probability amplitude)
* $E$: Total energy
* $V$: Potential energy
* $m$: Mass of the particle
* $h$: Planck’s constant

**Exam Tip:** This derivation is a frequent 5-mark question. Be sure to define the Hamiltonian Operator ($\hat{H}$) explicitly.

#### Particle in a Box & Polyenes:
The energy of a particle confined in a 1D box of length $L$ is quantized as:
$$E_n = \frac{n^2h^2}{8mL^2} \quad (n = 1, 2, 3 \dots)$$
This model is used to approximate the energy levels of $\pi$-electrons in polyenes (conjugated systems), where $L$ represents the length of the conjugated carbon chain.

*   **Zero Point Energy (ZPE):** The lowest possible energy level ($n=1$):
    $$E_1 = \frac{h^2}{8mL^2}$$
*   **Physical Significance of ZPE:** The particle's energy can never be zero. If $E=0$, the momentum $p=0$, which means uncertainty in momentum $\Delta p = 0$. By Heisenberg's Uncertainty Principle:
    $$\Delta x \cdot \Delta p \ge \frac{h}{4\pi}$$
    If $\Delta p = 0$, then uncertainty in position $\Delta x \to \infty$, which is impossible for a particle confined inside a box of finite width $L$.
*   **Numerical Quick-Tip:** Since $E_n \propto n^2$, if the ground state (ZPE) $E_1 = 2.5\text{ eV}$, then the next energy level ($n=2$) is:
    $$E_2 = 2^2 \times E_1 = 4 \times 2.5\text{ eV} = 10\text{ eV}$$

### Molecular Orbital (MO) Theory

*   **Bonding vs. Antibonding MOs:** Atomic orbitals combine to form Bonding MOs (constructive interference, $\Psi_A + \Psi_B$, lower energy, stable) and Antibonding MOs (destructive interference, $\Psi_A - \Psi_B$, higher energy, unstable).
*   **Non-existence of Helium Molecule ($\text{He}_2$):**
    $$\text{Bond Order (B.O.)} = \frac{1}{2}(N_b - N_a)$$
    For $\text{He}_2$ (4 valence electrons), the configuration is $\sigma_{1s}^2 \sigma_{1s}^{*2}$.
    $$\text{B.O.} = \frac{1}{2}(2 - 2) = 0$$
    Since the bond order is zero, $\text{He}_2$ does not exist.
*   **Magnetic Behavior of Oxygen ($\text{O}_2$):** $\text{O}_2$ has 16 electrons. Its MO configuration ends with:
    $$(\pi^*_{2p_x})^1 (\pi^*_{2p_y})^1$$
    The presence of two unpaired electrons in the degenerate antibonding $\pi^*$ orbitals makes $\text{O}_2$ **paramagnetic**, a fact that Valence Bond Theory (VBT) failed to explain.

#### Comparison Table of Oxygen Species (High Exam Weightage)

| Species | Bond Order | Relative Stability | Magnetic Behavior | Unpaired Electrons |
| :--- | :---: | :---: | :---: | :---: |
| $\text{O}_2^{2+}$ | 3.0 | Highest | Diamagnetic | 0 |
| $\text{O}_2^+$ | 2.5 | High | Paramagnetic | 1 |
| $\text{O}_2$ | 2.0 | Moderate | Paramagnetic | 2 |
| $\text{O}_2^-$ | 1.5 | Low | Paramagnetic | 1 |
| $\text{O}_2^{2-}$ | 1.0 | Lowest | Diamagnetic | 0 |

#### Heteronuclear Diatomic Molecules:
*   **$\text{CO}$**: Bond Order = 3, Diamagnetic. The energy levels of Oxygen's atomic orbitals are lower than Carbon's due to Oxygen's higher electronegativity.
*   **$\text{NO}$**: Bond Order = 2.5, Paramagnetic (contains 1 unpaired electron). $\text{NO}^+$ has a Bond Order of 3 and is diamagnetic.

### Aromaticity & $\pi$-Molecular Orbitals

#### Criteria for Aromaticity (Hückel's Rules):
1.  Cyclic structure.
2.  Planar geometry (all ring atoms are $sp^2$ or $sp$ hybridized).
3.  Continuous conjugation of p-orbitals.
4.  Possesses $(4n + 2) \ \pi$-electrons (where $n$ is an integer $0, 1, 2, 3 \dots$).

*   **Benzene:** Has $6\pi$ electrons ($n=1$). Its $\pi$-MO diagram contains three bonding MOs ($\psi_1, \psi_2, \psi_3$) and three antibonding MOs ($\psi^*_4, \psi^*_5, \psi^*_6$). All bonding MOs are completely filled.
*   **Furan:** Aromatic ($4\pi$ from double bonds + $2\pi$ from one of oxygen's lone pairs residing in a p-orbital = $6\pi$ electrons in the ring).
*   **Cyclopentadienyl Cation:** Anti-aromatic ($4\pi$ electrons, cyclic, planar, fully conjugated; obeys Hückel's $4n\pi$ rule).

### Crystal Field Theory (CFT)

*   **Octahedral Fields ($O_h$):** The five d-orbitals split into two groups:
    -   $t_{2g}$ ($d_{xy}, d_{yz}, d_{zx}$): lower energy group, pointing between the axes.
    -   $e_g$ ($d_{x^2-y^2}, d_{z^2}$): higher energy group, pointing directly along the axes.
*   **Tetrahedral Fields ($T_d$):** The splitting pattern is reversed. $e$ orbitals are lower in energy, and $t_2$ orbitals are higher.
*   **CFSE Formula (Octahedral):**
    $$\text{CFSE} = \left[ (-0.4 \times n_{t_{2g}}) + (0.6 \times n_{e_g}) \right]\Delta_o + mP$$
    *(where $P$ is the spin-pairing energy, and $m$ is the number of paired electron pairs)*
*   **Tetrahedral Complexes Context:** Low-spin tetrahedral complexes are extremely rare because the crystal field splitting energy is small:
    $$\Delta_t \approx \frac{4}{9}\Delta_o$$
    Since $\Delta_t$ is typically less than the pairing energy $P$, electrons prefer to occupy higher energy orbitals rather than pair up.

### Band Structure of Solids

| Feature | Conductors | Semiconductors | Insulators |
| :--- | :--- | :--- | :--- |
| **Band Gap ($E_g$)** | No gap (valence & conduction bands overlap) | Small band gap ($E_g < 3\text{ eV}$) | Large band gap ($E_g > 5\text{ eV}$) |
| **n-type Doping** | N/A | Si doped with P/As (Group 15 elements, adds extra electrons) | N/A |
| **p-type Doping** | N/A | Si doped with B/Ga (Group 13 elements, creates positive holes) | N/A |

## Module 2: Spectroscopic Techniques & Applications

### Beer-Lambert Law & Principles

#### Statement:
Absorbance ($A$) is directly proportional to concentration ($c$) and path length ($L$):
$$A = \epsilon c L$$

#### Mathematical Proof:
1. Let the intensity of incident light passing through a medium be $I$. The rate of decrease in intensity with path thickness $dx$ is proportional to both intensity and solute concentration:
   $$-\frac{dI}{dx} \propto I \cdot c \implies -\frac{dI}{dx} = kIc$$
2. Rearranging variables to integrate:
   $$\frac{dI}{I} = -kc \, dx$$
3. Integrating from initial intensity $I_0$ to transmitted intensity $I$, and path length $0$ to $L$:
   $$\int_{I_0}^{I} \frac{dI}{I} = -kc \int_{0}^{L} dx$$
4. Evaluating the integrals:
   $$\ln\left(\frac{I}{I_0}\right) = -kcL \implies \log_{10}\left(\frac{I_0}{I}\right) = \frac{k}{2.303}cL$$
5. Defining Absorbance $A = \log_{10}\left(\frac{I_0}{I}\right)$ and the molar extinction coefficient $\epsilon = \frac{k}{2.303}$, we arrive at:
   $$A = \epsilon c L$$

### Electronic (UV-Visible) Spectroscopy

*   **UV Spectral Range:** $200\text{ nm} - 400\text{ nm}$. Frequency ($\nu$) is calculated as $\nu = c/\lambda$ (units: $\text{Hz}$ or $\text{s}^{-1}$).
*   **Terminology:**
    -   **Chromophore:** An isolated covalent group responsible for giving color to a molecule (e.g., $-\text{N=N}-$, $-\text{NO}_2$).
    -   **Auxochrome:** An acidic or basic group that does not produce color itself but deepens/enhances the absorption band when attached to a chromophore (e.g., $-\text{OH}$, $-\text{NH}_2$).
    -   **Bathochromic Shift (Red Shift):** Shift of absorption maximum ($\lambda_{max}$) to a longer wavelength.
    -   **Hypsochromic Shift (Blue Shift):** Shift of absorption maximum ($\lambda_{max}$) to a shorter wavelength.
*   **Why UV spectra are broad bands:** Molecular electronic transitions are broad bands because each electronic state is subdivided into multiple vibrational and rotational energy levels.
*   **Conjugation effect:** $1,3\text{-pentadiene}$ (conjugated) has a significantly higher $\lambda_{max}$ than $1,4\text{-pentadiene}$ (non-conjugated) due to the reduced energy gap between the HOMO and LUMO in conjugated systems.
*   **Formaldehyde transitions:** Undergoes both $n \to \pi^*$ (lower energy, occurs at longer wavelength) and $\pi \to \pi^*$ transitions (higher energy, shorter wavelength).

### Vibrational (IR) Spectroscopy

*   **Fingerprint Region:** $1600\text{ cm}^{-1} - 400\text{ cm}^{-1}$. Highly complex region unique for every compound; used as a "fingerprint" for identification.
*   **IR Activity Condition:** A molecule is IR active only if its vibration causes a change in its net dipole moment (e.g., $\text{HCl}$, $\text{H}_2\text{O}$). Symmetrical homonuclear diatomic molecules (e.g., $\text{O}_2$, $\text{N}_2$) are IR inactive.
*   **Vibrational Frequency Formula:**
    $$\bar{\nu} = \frac{1}{2\pi c}\sqrt{\frac{k}{\mu}} \quad \text{where} \quad \mu = \frac{m_1 m_2}{m_1 + m_2}$$
    *(where $k$ is the bond force constant, and $\mu$ is the reduced mass)*

### NMR and MRI

*   **NMR Active Nuclei:** Only nuclei with an odd atomic number or odd mass number possess nuclear spin and are active ($^1\text{H}$, $^{13}\text{C}$, $^{19}\text{F}$). Even/Even nuclei like $^{12}\text{C}$ and $^{16}\text{O}$ have zero spin ($I=0$) and are inactive.
*   **Shielding vs. Deshielding:** Electrons shield the nucleus from the external magnetic field. Electronegative atoms pull electron density away (deshielding), shifting the NMR signal downfield to higher chemical shift values ($\delta \text{ ppm}$).
*   **Magnetic Resonance Imaging (MRI):** Based on the NMR principle, MRI map the spatial density of water/fat protons inside human tissues.

### Fluorescence & Surface Techniques

*   **Fluorescence:** The absorption of a high-energy photon followed by the rapid, near-instantaneous ($<10^{-8}\text{ s}$) emission of a lower-energy (longer wavelength) photon.
*   **High-Yield Surface Techniques:**
    1.  **XRD (X-Ray Diffraction):** Evaluates crystal structure, planes, and phases.
    2.  **SEM (Scanning Electron Microscopy):** Topographic imaging of sample surfaces.
    3.  **TEM (Transmission Electron Microscopy):** Nanostructure morphology and internal lattice structure.
    4.  **AFM (Atomic Force Microscopy):** Sub-nanometer 3D surface mapping.

## Module 3: Intermolecular Forces & Real Gases

### Intermolecular Interactions

*   **Ionic Forces:** Electrostatic attraction between ions (strongest).
*   **Dipole-Dipole Forces:** Forces between polar molecules (e.g., $\text{HCl} \dots \text{HCl}$).
*   **London Dispersion (van der Waals):** Weak attraction from transient induced dipoles in non-polar molecules.
*   **Boiling Point Trends:**
    -   **$n\text{-pentane} > \text{neo-pentane}$:** $n\text{-pentane}$ is a linear chain with a larger surface area, leading to stronger London dispersion interactions than spherical $\text{neo-pentane}$.
    -   **$\text{H}_2\text{O (liquid)} \gg \text{H}_2\text{S (gas)}$:** High electronegativity of oxygen enables strong intermolecular Hydrogen bonding in water, whereas sulfur cannot form strong hydrogen bonds.

### Real Gases & van der Waals Equation

$$\left(P + \frac{an^2}{V^2}\right)(V - nb) = nRT$$

*   **Parameter $a$:** Accounts for the attractive forces between real gas molecules.
*   **Parameter $b$:** Accounts for the finite excluded volume of gas molecules.
*   **Compressibility Factor ($Z$):**
    $$Z = \frac{PV}{nRT}$$
    For an ideal gas, $Z = 1$. For gases like $\text{H}_2$ and $\text{He}$, $Z > 1$ at standard temperatures because molecular attractions are negligible (small $a$), making repulsive forces dominant.

### Critical Phenomena

#### Proof of Critical Compressibility Factor Ratio ($\frac{RT_c}{P_c V_c} = \frac{8}{3}$):
1. At the critical point on a $P-V$ isotherm, the curve has an inflection point, meaning:
   $$\left(\frac{\partial P}{\partial V}\right)_T = 0 \quad \text{and} \quad \left(\frac{\partial^2 P}{\partial V^2}\right)_T = 0$$
2. Solving these derivatives for the van der Waals equation gives the critical constants:
   $$V_c = 3b, \quad P_c = \frac{a}{27b^2}, \quad T_c = \frac{8a}{27Rb}$$
3. Substitute these constants into the compressibility ratio:
   $$\frac{R T_c}{P_c V_c} = \frac{R \left(\frac{8a}{27Rb}\right)}{\left(\frac{a}{27b^2}\right)(3b)} = \frac{\frac{8a}{27b}}{\frac{3a}{27b}} = \frac{8}{3} \approx 2.67$$

*   **Boyle Temperature ($T_B$):** The temperature at which a real gas behaves ideally over a wide range of pressures.
    $$T_B = \frac{a}{Rb}$$

## Module 4: Thermodynamics & Chemical Equilibria

### Thermodynamic Functions & Laws

*   **First Law:**
    $$\Delta U = q - W$$
*   **Proof that Heat at Constant Pressure equals Enthalpy ($q_p = \Delta H$):**
    Enthalpy is defined as:
    $$H = U + PV \implies \Delta H = \Delta U + \Delta(PV)$$
    At constant pressure $P$:
    $$\Delta H = \Delta U + P\Delta V$$
    Since $\Delta U = q_p - P\Delta V$ (expansion work), substitute it:
    $$\Delta H = (q_p - P\Delta V) + P\Delta V \implies \Delta H = q_p$$
*   **Gas Reaction Relation:**
    $$\Delta H = \Delta U + \Delta n_g RT$$
    *(where $\Delta n_g$ is the difference in moles of gaseous products and reactants)*

### Spontaneity & Gibbs-Helmholtz

*   **Spontaneity Criteria:** A process is spontaneous if the change in Gibbs free energy is negative ($\Delta G < 0$) and the total entropy change is positive ($\Delta S_{total} > 0$).
*   **Entropy of Mixing for Ideal Gases:**
    $$\Delta S_{mix} = -R \sum n_i \ln x_i$$
    Since the mole fraction $x_i$ is always less than 1, $\ln x_i$ is negative, making $\Delta S_{mix}$ always positive.
*   **Gibbs-Helmholtz Equation Derivation:**
    1. By definition:
       $$G = H - TS \implies dG = dH - TdS - SdT$$
    2. At constant pressure, the fundamental thermodynamic equation simplifies to:
       $$dG = -SdT \implies \left(\frac{\partial G}{\partial T}\right)_P = -S$$
    3. Substitute $S = \frac{H - G}{T}$ back into the derivative:
       $$\left(\frac{\partial G}{\partial T}\right)_P = \frac{G - H}{T}$$$
    4. Expressing this in terms of the derivative of $G/T$:
       $$\left[ \frac{\partial(G/T)}{\partial T} \right]_P = -\frac{H}{T^2}$$

### Electrochemistry & Water Chemistry

*   **EMF and Gibbs Free Energy Relation:**
    $$\Delta G = -nFE_{cell}$$
*   **Nernst Equation:**
    $$E = E^0 - \frac{RT}{nF}\ln Q$$
    Used to calculate the cell potential under non-standard concentrations.
*   **Calomel Reference Electrode:** Represents as $\text{Hg} \mid \text{Hg}_2\text{Cl}_2\text{(s)} \mid \text{KCl(satd)}$.
*   **Water Hardness:** Caused by dissolved $\text{Ca}^{2+}$ and $\text{Mg}^{2+}$ salts. Stearate ions in soap precipitate as insoluble scum (Calcium stearate) rather than forming a lather:
    $$2\text{C}_{17}\text{H}_{35}\text{COONa} + \text{Ca}^{2+} \to (\text{C}_{17}\text{H}_{35}\text{COO})_2\text{Ca(s)} \downarrow + 2\text{Na}^+$$
*   **Corrosion Types:**
    -   **Galvanic Corrosion:** Occurs when two dissimilar metals are electrically connected in an electrolyte.
    -   **Electrochemical Corrosion:** Local cell action where oxidation occurs at the anode ($\text{Fe} \to \text{Fe}^{2+} + 2e^-$) and reduction occurs at the cathode ($\text{O}_2 + 2\text{H}_2\text{O} + 4e^- \to 4\text{OH}^-$).

## Module 5: Periodic Properties

### Slater’s Rules (Calculating $Z_{eff}$)

Formula:
$$Z_{eff} = Z - \sigma$$

*   **Iron ($\text{Fe}, Z=26$):** Configuration: $[\text{1s}^2][\text{2s}^2 \text{2p}^6][\text{3s}^2 \text{3p}^6][\text{3d}^6][\text{4s}^2]$.
    For a $4s$ valence electron:
    $$\sigma = (1 \times 0.35) + (14 \times 0.85) + (10 \times 1.00) = 22.25$$
    $$Z_{eff} = 26 - 22.25 = 3.75$$
*   **Copper ($\text{Cu}, Z=29$):** Configuration: $[\dots][\text{3s}^2 \text{3p}^6][\text{3d}^{10}][\text{4s}^1]$.
    For the $4s$ electron:
    $$\sigma = (0 \times 0.35) + (18 \times 0.85) + (10 \times 1.00) = 25.30$$
    $$Z_{eff} = 29 - 25.30 = 3.70$$
*   **Potassium ($\text{K}, Z=19$):** Configuration: $[\dots][\text{3s}^2 \text{3p}^6][\text{4s}^1]$.
    For the $4s$ electron:
    $$\sigma = (8 \times 0.85) + (10 \times 1.00) = 16.80$$
    $$Z_{eff} = 19 - 16.80 = 2.20$$

### Specific Trends & HSAB Theory

*   **Electron Affinity ($\text{Cl} > \text{F}$):** Fluorine's exceptionally small atomic size leads to high inter-electronic repulsion when an electron is added, making its EA lower than Chlorine's.
*   **High Second Ionization Energy of $\text{Cr}$ and $\text{Cu}$:** Exceptionally high because it involves removing an electron from stable, symmetrical half-filled ($3d^5$) or completely filled ($3d^{10}$) d-subshells.
*   **HSAB (Hard and Soft Acids and Bases):** Hard acids (e.g., $\text{Li}^+$, $\text{Ti}^{4+}$) prefer binding to hard bases (e.g., $\text{OH}^-$, $\text{F}^-$) via ionic interactions. Soft acids (e.g., $\text{Ag}^+$, $\text{Hg}^{2+}$) prefer binding to soft bases (e.g., $\text{I}^-$, $\text{SCN}^-$) via covalent interactions.

### VSEPR Configurations

| Molecule | Steric Number | Bond Pairs | Lone Pairs | Hybridization | Geometry/Shape |
| :--- | :---: | :---: | :---: | :---: | :--- |
| $\text{ClF}_3$ | 5 | 3 | 2 | $sp^3d$ | T-shaped |
| $\text{XeF}_2$ | 5 | 2 | 3 | $sp^3d$ | Linear |
| $\text{BrF}_5$ | 6 | 5 | 1 | $sp^3d^2$ | Square Pyramidal |
| $\text{XeF}_4$ | 6 | 4 | 2 | $sp^3d^2$ | Square Planar |
| $\text{NF}_3$ | 4 | 3 | 1 | $sp^3$ | Pyramidal |

## Module 6: Stereochemistry

*   **Enantiomers:** Non-superimposable mirror images that rotate plane-polarized light in opposite directions (e.g., d- and l-tartaric acid).
*   **Diastereomers:** Stereoisomers that are not mirror images of one another.
*   **Meso Compounds:** Molecules containing chiral centers that are optically inactive due to an internal plane of symmetry (internal compensation).
*   **Racemic Mixture:** A 50:50 mixture of two enantiomers, rendering it optically inactive via external compensation.
*   **Ethane Conformations:** Staggered (stable, minimal torsional strain) and Eclipsed (unstable, maximum torsional strain).
*   **n-Butane Conformations Stability Order:**
    $$\text{Anti} > \text{Gauche} > \text{Eclipsed} > \text{Fully Eclipsed}$$

## Module 7: Organic Reactions & Drug Synthesis

### Substitution & Named Reactions

*   **$\text{S}_\text{N}1$ Mechanism:** Two-step pathway involving a carbocation intermediate. Rate order: $3^\circ > 2^\circ > 1^\circ$. Highly favored in polar protic solvents.
*   **$\text{S}_\text{N}2$ Mechanism:** One-step concerted mechanism with a pentacoordinate transition state. Rate order: $1^\circ > 2^\circ > 3^\circ$. Involves stereochemical **Walden Inversion**.
*   **Markovnikov's Rule:** In the addition of a polar reagent to an unsymmetrical alkene, the acidic proton adds to the carbon with more hydrogen atoms.
*   **Peroxide Effect (Anti-Markovnikov Addition):** Occurs only with $\text{HBr}$ in the presence of peroxides because both radical propagation steps are exothermic.
*   **Cannizzaro Reaction:** Aldehydes lacking $\alpha$-hydrogens (e.g., Benzaldehyde, Formaldehyde) undergo self-redox in concentrated $\text{NaOH}$ to yield an alcohol and a carboxylic acid salt.

### Mechanism of Nitration of Benzene

1.  **Generation of the Nitronium Electrophile ($\text{NO}_2^+$):**
    $$\text{HNO}_3 + 2\text{H}_2\text{SO}_4 \rightleftharpoons \text{NO}_2^+ + 2\text{HSO}_4^- + \text{H}_3\text{O}^+$$
2.  **Electrophilic Attack on Benzene:** The aromatic $\pi$-cloud attacks the electrophilic $\text{NO}_2^+$ to form a resonance-stabilized Sigma Complex (arenium ion intermediate).
3.  **Deprotonation to Restore Aromaticity:** A weak base (such as $\text{HSO}_4^-$) removes the proton from the carbon bearing the nitro group, yielding nitrobenzene and regenerating the $\text{H}_2\text{SO}_4$ catalyst.

### Drug Synthesis

*   **Aspirin Synthesis:**
    $$\text{Salicylic Acid} + \text{Acetic Anhydride} \xrightarrow{\text{H}_3\text{PO}_4} \text{Aspirin} + \text{Acetic Acid}$$
*   **Paracetamol Synthesis:**
    $$\text{p-Aminophenol} + \text{Acetic Anhydride} \to \text{Paracetamol} + \text{Acetic Acid}$$

#### Key Organic Conversions:
*   **Benzoic acid to Benzene:** Decarboxylation using Soda lime ($\text{NaOH} + \text{CaO}$) and heat.
*   **Phenol to Benzene:** Reduction using Zinc dust and heat.

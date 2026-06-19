## Module 1: Atomic & Molecular Structure

*   **Time-Independent Schrödinger Wave Equation (3D):**
    $$\nabla^2\Psi + \frac{8\pi^2m}{h^2}(E - V)\Psi = 0$$
    Expressed with the Hamiltonian operator $\hat{H}$, this is written as:
    $$\hat{H}\Psi = E\Psi \quad \text{where} \quad \hat{H} = -\frac{h^2}{8\pi^2m}\nabla^2 + V$$

*   **Time-Independent Schrödinger Wave Equation (1D):**
    $$\frac{d^2\Psi}{dx^2} + \frac{8\pi^2m}{h^2}(E - V)\Psi = 0$$

*   **Energy of a Particle in a 1D Box:**
    $$E_n = \frac{n^2h^2}{8mL^2}$$
    *(where $n$ is the principal quantum number $1, 2, 3...$, $m$ is mass, and $L$ is box length)*

*   **Zero-Point Energy (1D Box):**
    $$E_1 = \frac{h^2}{8mL^2}$$
    *(calculated at the ground state $n=1$)*

*   **De Broglie Wavelength:**
    $$\lambda = \frac{h}{p} = \frac{h}{mv}$$
    *(where $p$ is momentum, $m$ is mass, and $v$ is velocity)*

*   **Heisenberg's Uncertainty Principle:**
    $$\Delta p \times \Delta x \ge \frac{h}{4\pi}$$
    *(where $\Delta p$ is uncertainty in momentum and $\Delta x$ is uncertainty in position)*

*   **Bond Order (Molecular Orbital Theory):**
    $$\text{B.O.} = \frac{1}{2}(N_b - N_a)$$
    *(where $N_b$ is the number of bonding electrons and $N_a$ is the number of anti-bonding electrons)*

*   **Spin-Only Magnetic Moment:**
    $$\mu = \sqrt{n(n+2)} \quad \text{B.M.}$$
    *(where $n$ is the number of unpaired electrons and $\text{B.M.}$ stands for Bohr Magnetons)*

---

## Module 2: Spectroscopic Techniques & Applications

*   **Planck-Einstein Relation (Energy of a Photon):**
    $$E = h\nu = \frac{hc}{\lambda}$$

*   **Beer-Lambert Law (Absorbance):**
    $$A = \log\left(\frac{I_0}{I}\right) = \epsilon c L$$
    *(where $I_0$ is incident intensity, $I$ is transmitted intensity, $\epsilon$ is the molar extinction coefficient, $c$ is concentration, and $L$ is path length)*

*   **Transmittance ($T$) and Absorbance ($A$) Relationship:**
    $$T = \frac{I}{I_0} \quad \text{and} \quad A = 2 - \log(\%T)$$

*   **Force Constant for IR Spectroscopy (Harmonic Oscillator):**
    $$\nu = \frac{1}{2\pi}\sqrt{\frac{k}{\mu}}$$
    *(where $k$ is the force constant and $\mu$ is the reduced mass)*

*   **Reduced Mass ($\mu$):**
    $$\mu = \frac{m_1 \times m_2}{m_1 + m_2}$$

*   **Rotational Constant ($B$) in Microwave Spectroscopy:**
    $$B = \frac{h}{8\pi^2 I c}$$
    *(where $I$ is the moment of inertia, $I = \mu r^2$)*

*   **Chemical Shift ($\delta$) in NMR Spectroscopy:**
    $$\delta = \frac{\Delta B}{B_0} \times 10^6 \quad \text{ppm}$$
    *(expressed in parts per million relative to Tetramethylsilane)*

---

## Module 3: Intermolecular Forces & Potential Energy Surfaces

*   **Ideal Gas Equation:**
    $$PV = nRT$$

*   **van der Waals Equation (Real Gases):**
    $$\left(P + \frac{an^2}{V^2}\right)(V - nb) = nRT$$
    *(where $a$ corrects for intermolecular attractions and $b$ corrects for excluded volume)*

*   **Compressibility Factor ($Z$):**
    $$Z = \frac{PV}{nRT}$$
    *(where $Z=1$ for ideal gases, $Z<1$ for negative deviation, $Z>1$ for positive deviation)*

*   **Critical Constants derived from van der Waals Parameters:**
    *   **Boyle's Temperature ($T_b$):** $$T_b = \frac{a}{Rb}$$
    *   **Critical Temperature ($T_c$):** $$T_c = \frac{8a}{27Rb}$$
    *   **Critical Pressure ($P_c$):** $$P_c = \frac{a}{27b^2}$$
    *   **Critical Volume ($V_c$):** $$V_c = 3b$$
    *   **Critical Compressibility Factor ($Z_c$):** $$Z_c = \frac{P_c V_c}{RT_c} = \frac{3}{8} = 0.375$$
---

## Module 4: Thermodynamics & Electrochemical Cells

*   **First Law of Thermodynamics:**
    $$q = \Delta U + W$$
    *(or in differential form: $dq = dU + dW$, where $q$ is heat, $\Delta U$ is internal energy change, and $W$ is work done)*

*   **Enthalpy Change ($\Delta H$):**
    $$H = U + PV \implies \Delta H = \Delta U + \Delta n_g RT$$
    *(for reactions involving gases where only expansion work is performed)*

*   **Molar Heat Capacity Relation:**
    $$C_p - C_v = R$$
    *(for 1 mole of an ideal gas)*

*   **Work Done (Isothermal Reversible Expansion):**
    $$W_{rev} = nRT \ln\left(\frac{V_2}{V_1}\right) = nRT \ln\left(\frac{P_1}{P_2}\right)$$

*   **Adiabatic Reversible Relations:**
    $$PV^\gamma = \text{Constant} \quad TV^{\gamma-1} = \text{Constant} \quad T^\gamma P^{1-\gamma} = \text{Constant}$$
    *(where $\gamma = C_p / C_v$)*

*   **Work Done (Adiabatic Reversible Expansion):**
    $$W_{adia} = \frac{1}{\gamma-1}(P_1V_1 - P_2V_2) = -C_v(T_2 - T_1)$$

*   **Entropy Change ($dS$):**
    $$dS = \frac{dq_{rev}}{T}$$

*   **Entropy of Mixing for Ideal Gases:**
    $$\Delta S_{mix} = -R \sum x_i \ln x_i$$
    *(where $x_i$ is the mole fraction of component $i$)*

*   **Gibbs Free Energy ($G$):**
    $$G = H - TS$$

*   **Gibbs-Helmholtz Equation:**
    $$\Delta G = \Delta H + T\left[\frac{\partial(\Delta G)}{\partial T}\right]_P$$

*   **EMF and Gibbs Free Energy Relation:**
    $$\Delta G = -nFE$$
    *(where $F$ is Faraday's constant $\approx 96485 \text{ C/mol}$)*

*   **Nernst Equation (Cell EMF):**
    $$E_{cell} = E^0_{cell} - \frac{RT}{nF} \ln\left(\frac{[\text{Products}]}{[\text{Reactants}]}\right)$$
    At $298\text{ K}$, this simplifies with base-10 log to:
    $$E_{cell} = E^0_{cell} - \frac{0.0591}{n}\log_{10}\left(\frac{[\text{Products}]}{[\text{Reactants}]}\right)$$

---

## Module 5: Periodic Properties

*   **Effective Nuclear Charge ($Z_{eff}$):**
    $$Z_{eff} = Z - \sigma$$
    *(where $Z$ is the atomic number and $\sigma$ is the screening/shielding constant)*

*   **Slater's Rules for shielding constant $\sigma$ ($ns$ or $np$ valence electron):**
    *   Electrons in the same $(ns, np)$ group shield by **$0.35$** (except $1s$ which shields by $0.30$).
    *   Electrons in the $(n-1)$ shell shield by **$0.85$**.
    *   Electrons in $(n-2)$ and deeper shells shield completely by **$1.00$**.


## Module 6: Stereochemistry

*   **Number of Optical Isomers:**
    For an unsymmetrical molecule containing $n$ chiral carbons:
    $$\text{Number of Optically Active Isomers} = 2^n$$
    *(Note: Symmetrical molecules containing chiral carbons will have fewer active isomers due to the presence of meso compounds)*


## Module 7: Organic Reactions & Synthesis

*   **Kinetics of $\text{S}_\text{N}1$ Reaction:**
    $$\text{Rate} = k[\text{R-X}]$$
    *(Unimolecular nucleophilic substitution, first-order kinetics; rate is determined by the slow ionization step forming the carbocation intermediate)*

*   **Kinetics of $\text{S}_\text{N}2$ Reaction:**
    $$\text{Rate} = k[\text{R-X}][\text{Nu}^-]$$
    *(Bimolecular nucleophilic substitution, second-order kinetics; rate depends on both the substrate and attacking nucleophile in a single concerted step)*
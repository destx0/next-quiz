import React from "react";
import LatexRenderer from "@/components/LatexRenderer";

const LatexPage = () => {
	  const content = `
# Introduction to Quantum Mechanics

Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles. One of the core principles is the famous Schrödinger equation:

$$
i\\hbar \\frac{\\partial}{\\partial t} \\Psi(\\mathbf{r},t) = \\left [ \\frac{-\\hbar^2}{2m}\\nabla^2 + V(\\mathbf{r},t)\\right ] \\Psi(\\mathbf{r},t)
$$

Where:
- $\\Psi$ is the wave function
- $\\hbar$ is the reduced Planck constant
- $m$ is the mass of the particle
- $V$ is the potential energy

Another important concept is the uncertainty principle, often expressed as:

$$
\\Delta x \\Delta p \\geq \\frac{\\hbar}{2}
$$

This principle, formulated by Werner Heisenberg, states that there is a fundamental limit to the precision with which certain pairs of physical properties of a particle, such as position $x$ and momentum $p$, can be determined.

![Schrödinger's cat thought experiment](https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Schrodingers_cat.svg/640px-Schrodingers_cat.svg.png)

*Figure 1: Illustration of Schrödinger's cat thought experiment, a famous paradox in quantum mechanics.*

The above image illustrates the famous Schrödinger's cat thought experiment, which highlights the strange nature of quantum superposition.

In quantum mechanics, the state of a particle can be described as a superposition of different states. For example, the spin of an electron can be represented as:

$$
|\\psi\\rangle = \\alpha|\\uparrow\\rangle + \\beta|\\downarrow\\rangle
$$

Where $\\alpha$ and $\\beta$ are complex numbers satisfying $|\\alpha|^2 + |\\beta|^2 = 1$.
`;


	return (
		<div>
			<h1>Welcome to my math page</h1>
			<LatexRenderer>{content}</LatexRenderer>
		</div>
	);
};

export default LatexPage;

// app/register/page.js
"use client";
import { useState } from "react";
import { Input, Button } from "@nextui-org/react";
import { registerWithEmail } from "@/utils/auth";

export default function RegisterPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleRegister = async () => {
		const response = await registerWithEmail(email, password);
		if (response.success) {
			// Redirect to homepage or login
		} else {
			setError(response.message);
		}
	};

	return (
		<div>
			<Input
				placeholder="Email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<Input
				placeholder="Password"
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<Button onClick={handleRegister}>Register</Button>
			{error && <p>{error}</p>}
		</div>
	);
}

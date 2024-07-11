// app/login/page.js
"use client";
import { useState } from "react";
import { Input, Button } from "@nextui-org/react";
import { loginWithEmail, loginWithGoogle } from "@/utils/auth";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleLogin = async () => {
		const response = await loginWithEmail(email, password);
		if (response.success) {
			// Redirect to homepage or dashboard
		} else {
			setError(response.message);
		}
	};

	const handleGoogleLogin = async () => {
		const response = await loginWithGoogle();
		if (response.success) {
			// Redirect to homepage or dashboard
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
			<Button onClick={handleLogin}>Login</Button>
			<Button onClick={handleGoogleLogin}>Login with Google</Button>
			{error && <p>{error}</p>}
		</div>
	);
}

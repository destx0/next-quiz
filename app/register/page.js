"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Input, Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { setCookie } from "cookies-next";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();
      setCookie("authToken", token);
      setCookie("userEmail", userCredential.user.email);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error registering new user", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center pb-0 pt-6 px-4">
          <h1 className="text-2xl font-bold">Register</h1>
        </CardHeader>
        <CardBody className="overflow-hidden">
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              label="Password"
              placeholder="Choose a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button color="primary" type="submit">
              Create Account
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

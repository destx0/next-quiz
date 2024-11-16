"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import {
  Input,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
} from "@nextui-org/react";
import { FaGoogle } from "react-icons/fa";
import { setCookie } from "cookies-next";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();
      setCookie("authToken", token);
      setCookie("userEmail", userCredential.user.email);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await handleLogin(email, password);
    } catch (error) {
      console.error("Error signing in with email and password", error);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await handleLogin(result.user.email, password);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center pb-0 pt-6 px-4">
          <h1 className="text-2xl font-bold">Login</h1>
        </CardHeader>
        <CardBody className="overflow-hidden">
          <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button color="primary" type="submit">
              Sign In
            </Button>
          </form>
          <Divider className="my-4" />
          <Button
            onClick={handleGoogleLogin}
            startContent={<FaGoogle />}
            color="secondary"
            variant="flat"
            className="w-full"
          >
            Sign in with Google
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}

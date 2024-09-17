"use client";

import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignIn() {
  const callbackUrl = "/applications";

  return (
    <Card className="w-[350px] mx-auto mt-20">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Sign in to access the Job Application Tracker
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => signIn("google", { callbackUrl })}>
          Sign in with Google
        </Button>
      </CardContent>
    </Card>
  );
}

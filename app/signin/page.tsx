// app/auth/signin/page.js
"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function SignIn() {
  const searchParams = useSearchParams();
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

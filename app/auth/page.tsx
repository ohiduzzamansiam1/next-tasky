"use client";

import { SignIn } from "@clerk/nextjs";

function SignInPage() {
  return (
    <div className="full-center">
      <SignIn />
    </div>
  );
}

export default SignInPage;

import { SignUp as ClerkSignUp } from "@clerk/nextjs";

export default function SignUp() {
  return (
    <main className="container grid h-full place-content-center">
      <ClerkSignUp
        appearance={{
          elements: {
            card: "rounded-md border bg-popover shadow-md",
          },
        }}
      />
    </main>
  );
}

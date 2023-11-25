import { SignIn as ClerkSignIn } from "@clerk/nextjs";

export default function SignIn() {
  return (
    <main className="container grid h-full place-content-center">
      <ClerkSignIn
        appearance={{
          elements: {
            card: "rounded-md border bg-popover shadow-md",
          },
        }}
      />
    </main>
  );
}

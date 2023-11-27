import { SignIn as ClerkSignIn } from "@clerk/nextjs";

export default function SignIn() {
  return (
    <main className="container grid h-full place-content-center">
      <ClerkSignIn
        appearance={{
          elements: {
            card: "rounded-md border border-accent bg-card shadow-md",
            socialButtonsBlockButton:
              "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            dividerRow: "hidden",
            form: "hidden",
          },
        }}
      />
    </main>
  );
}

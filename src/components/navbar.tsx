import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ClerkLoaded,
  ClerkLoading,
  currentUser,
  UserButton,
} from "@clerk/nextjs";
import isNil from "lodash/isNil";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { typography } from "@/components/ui/typography";

export async function Navbar() {
  const user = await currentUser();

  if (isNil(user)) {
    redirect("/sign-in");
  }

  const firstName = user.firstName ?? "";
  const lastName = user.lastName ?? "";
  const userInitials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`;

  return (
    <header className="py-2 lg:py-4">
      <nav className="container flex items-center justify-between">
        <Link
          href="/"
          className={cn(typography({ variant: "h2" }), "font-bold")}
        >
          Split
          <span className="bg-gradient bg-clip-text text-transparent">It</span>
        </Link>
        <ul className="inline-flex items-center space-x-2 lg:space-x-4">
          <li>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/split">
                <span>Split bill</span>
              </Link>
            </Button>
          </li>
          <li className="h-10">
            <ClerkLoading>
              <Avatar>
                <AvatarImage src={user.imageUrl} alt={userInitials} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </ClerkLoading>
            <ClerkLoaded>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                    userButtonPopoverCard:
                      "rounded-md border bg-popover shadow-md",
                  },
                }}
                afterSignOutUrl="/"
              />
            </ClerkLoaded>
          </li>
        </ul>
      </nav>
    </header>
  );
}

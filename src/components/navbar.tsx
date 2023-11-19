import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import isNil from "lodash/isNil";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
    <TooltipProvider>
      <header className="py-2 lg:py-4">
        <nav className="container flex items-center justify-between">
          <Link
            href="/"
            className={cn(typography({ variant: "h2" }), "font-bold")}
          >
            Split
            <span className="bg-gradient bg-clip-text text-transparent">
              It
            </span>
          </Link>
          <ul className="inline-flex items-center space-x-2 lg:space-x-4">
            <li>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/split">
                  <span>Split bill</span>
                </Link>
              </Button>
            </li>
            <li>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/profile">
                    <Avatar>
                      <AvatarImage src={user.imageUrl} alt={firstName} />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View profile</p>
                </TooltipContent>
              </Tooltip>
            </li>
          </ul>
        </nav>
      </header>
    </TooltipProvider>
  );
}

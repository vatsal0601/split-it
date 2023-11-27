import Link from "next/link";
import { currentUser } from "@clerk/nextjs";
import isNil from "lodash/isNil";
import { ArrowRightIcon, LogInIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { typography } from "@/components/ui/typography";

export default async function Home() {
  const user = await currentUser();
  const isUserSignedIn = !isNil(user);

  return (
    <main className="container pt-24 md:flex md:h-full md:items-center md:justify-between md:gap-12 md:pt-0">
      <section className="mx-auto max-w-lg space-y-4 md:text-left">
        <h1
          className={cn(
            typography({ variant: "h1" }),
            "bg-gradient-to-br from-primary to-accent-foreground bg-clip-text text-center text-transparent"
          )}
        >
          Bill splitting just got a whole lot easier.
        </h1>
        <p
          className={cn(
            typography({ variant: "p" }),
            "text-cente text-muted-foreground"
          )}
        >
          SplitIt allows you to split bills more simply while still keeping
          track of them.
        </p>
        <div className="flex items-center justify-center space-x-2 lg:space-x-4">
          <Button asChild>
            <Link href={isUserSignedIn ? "/dashboard" : "/sign-up"}>
              <span className="mr-2">
                {isUserSignedIn ? "Go to dashboard" : "Get Started"}
              </span>
              <LogInIcon className="h-4 w-4 lg:h-5 lg:w-5" />
            </Link>
          </Button>

          <Button variant="ghost" asChild>
            <Link href="/split">
              <span className="mr-2">Split bill</span>
              <ArrowRightIcon className="h-4 w-4 lg:h-5 lg:w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

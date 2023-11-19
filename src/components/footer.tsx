import Link from "next/link";
import { GithubIcon, HeartIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { typography } from "@/components/ui/typography";
import { ThemeToggle } from "./theme-toggle";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border py-4">
      <div className="container flex items-center justify-between">
        <p
          className={cn(
            typography({ variant: "p" }),
            "flex flex-wrap items-center text-muted-foreground"
          )}
        >
          <span>Made with</span>
          <HeartIcon className="mx-1 h-4 w-4 fill-destructive stroke-destructive" />
          <span>by</span>
          <Link
            href="https://github.com/vatsal0601"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 underline-offset-4 hover:underline"
          >
            @vatsal0601
          </Link>
        </p>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link
              href="https://github.com/vatsal0601/split-it"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Github link</span>
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}

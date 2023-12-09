import Link from "next/link";
import map from "lodash/map";

import { cn } from "@/lib/utils";
import { typography } from "@/components/ui/typography";

const TABS = {
  Dashboard: "/dashboard",
  Friends: "/dashboard/friends",
  Groups: "/dashboard/groups",
  Activity: "/dashboard/activity",
} as const;

export function DashboardTabs({ activeTab }: { activeTab: keyof typeof TABS }) {
  return (
    <nav className="mb-10 border-b">
      <ul className="container flex items-center overflow-auto">
        {map(TABS, (value, key) => {
          const isActive = key === activeTab;
          return (
            <Link
              key={key}
              href={value}
              className={cn(
                "inline-block whitespace-nowrap border-b-2 border-transparent ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                !isActive && "hover:border-muted",
                isActive && "border-primary"
              )}
            >
              <li
                className={cn(
                  typography({ variant: "p" }),
                  "p-2 md:px-4",
                  !isActive && "text-muted-foreground",
                  isActive && "font-medium"
                )}
              >
                {key}
              </li>
            </Link>
          );
        })}
      </ul>
    </nav>
  );
}

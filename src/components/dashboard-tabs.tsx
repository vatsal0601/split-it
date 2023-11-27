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
            <Link key={key} href={value}>
              <li
                className={cn(
                  typography({ variant: "p" }),
                  "inline-block border-b-2 border-transparent p-2 transition-colors md:px-4",
                  !isActive && "text-muted-foreground hover:border-muted",
                  isActive && "border-primary font-medium"
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

import Link from "next/link";

import { cn } from "@/lib/utils";
import { typography } from "@/components/ui/typography";

const TABS = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Friends", href: "/dashboard/friends" },
  { name: "Groups", href: "/dashboard/groups" },
  { name: "Activity", href: "/dashboard/activity" },
];

export function DashboardTabs({
  activeTab,
}: {
  activeTab: "Dashboard" | "Friends" | "Groups" | "Settings";
}) {
  return (
    <nav className="mb-10 border-b">
      <ul className="container flex items-center overflow-auto">
        {TABS.map((tab) => {
          const isActive = tab.name === activeTab;
          return (
            <Link key={tab.name} href={tab.href}>
              <li
                className={cn(
                  typography({ variant: "p" }),
                  "inline-block border-b-2 border-transparent p-2 transition-colors md:px-4",
                  !isActive && "text-muted-foreground hover:border-muted",
                  isActive && "border-primary font-medium"
                )}
              >
                {tab.name}
              </li>
            </Link>
          );
        })}
      </ul>
    </nav>
  );
}

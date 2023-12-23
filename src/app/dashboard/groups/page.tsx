import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import size from "lodash/size";

import { cn } from "@/lib/utils";
import { DashboardTabs } from "@/components/dashboard-tabs";
import { CreateGroupDialog } from "@/components/group-server-components";
import { SearchInput } from "@/components/search-input";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { typography } from "@/components/ui/typography";

// generate 10 groups for filling the data
const GROUPS = [
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
    name: "Avengers Assemble",
    createdAt: "2021-10-01T00:00:00.000Z",
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174001",
    name: "Justice League",
    createdAt: "2021-10-01T00:00:00.000Z",
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174002",
    name: "The Incredibles",
    createdAt: "2021-10-01T00:00:00.000Z",
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174003",
    name: "The Fantastic Four",
    createdAt: "2021-10-01T00:00:00.000Z",
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174004",
    name: "Expendables",
    createdAt: "2021-10-01T00:00:00.000Z",
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174005",
    name: "The A-Team",
    createdAt: "2021-10-01T00:00:00.000Z",
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174006",
    name: "The Avengers",
    createdAt: "2021-10-01T00:00:00.000Z",
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174007",
    name: "The Justice League",
    createdAt: "2021-10-01T00:00:00.000Z",
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174008",
    name: "The Incredibles",
    createdAt: "2021-10-01T00:00:00.000Z",
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174009",
    name: "The Fantastic Four",
    createdAt: "2021-10-01T00:00:00.000Z",
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174010",
    name: "Expendables",
    createdAt: "2021-10-01T00:00:00.000Z",
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174011",
    name: "The A-Team",
    createdAt: "2021-10-01T00:00:00.000Z",
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174012",
    name: "The Avengers",
    createdAt: "2021-10-01T00:00:00.000Z",
  },
];

const PATTERNS = [
  "pattern-formal-invitation",
  "pattern-endless-clouds",
  "pattern-zig-zag",
  "pattern-diagonal-stripes",
  "pattern-tiny-checkers",
  "pattern-bamboo",
  "pattern-charlie-brown",
];

function getRandomPattern(id: string) {
  const index = parseInt(id.slice(-1), 10);
  return PATTERNS[index % PATTERNS.length];
}

function Group({
  id,
  name,
  createdAt,
}: {
  id: string;
  name: string;
  createdAt: string;
}) {
  return (
    <Link href={`/dashboard/groups/${id}`}>
      <Card className="border-2 transition-colors hover:border-primary">
        <div
          className={cn(
            "h-6 w-full rounded-t-md bg-secondary",
            getRandomPattern(id)
          )}
        />
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>
            Created at {new Date(createdAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}

export default async function Groups({
  searchParams,
}: {
  searchParams: {
    "create-group": string | undefined;
    search: string | undefined;
  };
}) {
  const user = await currentUser();

  if (isNil(user)) {
    redirect("/sign-in");
  }

  return (
    <>
      <DashboardTabs activeTab="Groups" />
      <main className="container min-h-full space-y-10 pb-32">
        <div className="space-y-5">
          <div className="flex flex-col items-end justify-between gap-4 md:flex-row-reverse md:items-center">
            <CreateGroupDialog
              userId={user.id}
              createGroupParam={searchParams["create-group"]}
            />
            <SearchInput
              initialValue={searchParams["search"] ?? ""}
              placeholder="Search groups"
            />
          </div>
        </div>

        {size(GROUPS) > 0 ? (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {GROUPS.map((group) => {
              return (
                <Group
                  key={group.id}
                  id={group.id}
                  name={group.name}
                  createdAt={group.createdAt}
                />
              );
            })}
          </ul>
        ) : !isEmpty(searchParams["search"]) ? (
          <div>
            <p
              className={cn(
                typography({ variant: "h3" }),
                "mb-2 mt-4 text-center"
              )}
            >
              No results found
            </p>
            <p className={cn(typography({ variant: "muted" }), "text-center")}>
              We couldn&apos;t find any groups matching your search query.
            </p>
          </div>
        ) : (
          <div>
            <p
              className={cn(
                typography({ variant: "h3" }),
                "mb-2 mt-4 text-center"
              )}
            >
              You don&apos;t have any groups yet :&#40;
            </p>
            <p className={cn(typography({ variant: "muted" }), "text-center")}>
              Click on the create group button to create a group
            </p>
          </div>
        )}
      </main>
    </>
  );
}

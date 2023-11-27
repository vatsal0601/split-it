"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import isEmpty from "lodash/isEmpty";
import { PlusIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { typography } from "@/components/ui/typography";

export function AddFriendCommand({
  initialValue,
  children,
}: {
  initialValue: boolean;
  children: React.ReactNode;
}) {
  const [isCommandOpen, setIsCommandOpen] = React.useState(initialValue);
  const { replace } = useRouter();
  const pathname = usePathname();

  const openCommand = () => {
    setIsCommandOpen(true);
  };

  const onCommandChange = (isOpen: boolean) => {
    console.log("onCommandChange", isOpen);
    if (!isOpen) {
      const params = new URLSearchParams(window.location.search);
      params.delete("add-friend");
      replace(`${pathname}?${params.toString()}`);
    }

    setIsCommandOpen(isOpen);
  };

  return (
    <>
      <Button onClick={openCommand} size="sm" className="sm:hidden">
        <PlusIcon className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
        <span>Add friend</span>
      </Button>
      <Button onClick={openCommand} className="hidden sm:inline-flex">
        <PlusIcon className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
        <span>Add friend</span>
      </Button>
      <CommandDialog
        open={isCommandOpen}
        onOpenChange={onCommandChange}
        shouldFilter={false}
      >
        {children}
      </CommandDialog>
    </>
  );
}

export const AddFriendInput = ({ initialValue }: { initialValue: string }) => {
  const [search, setSearch] = React.useState(initialValue);
  const [isPending, startTransition] = React.useTransition();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(window.location.search);

    if (!isEmpty(value)) {
      params.set("add-friend", value);
    } else {
      params.delete("add-friend");
    }

    setSearch(value);
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <CommandInput
      value={search}
      onValueChange={handleSearch}
      placeholder="Type friend's username"
      name="add-friend"
    />
  );
};

export function CommandUser({
  firstName,
  lastName,
  username,
  userInitials,
  prfileImage,
}: {
  firstName: string;
  lastName: string;
  username: string | null;
  userInitials: string;
  prfileImage: string;
}) {
  const handleSelect = () => {
    console.log("user ->", userInitials);
  };

  return (
    <CommandItem onSelect={handleSelect} className="cursor-pointer gap-2">
      <Avatar className="h-6 w-6">
        <AvatarImage src={prfileImage} alt={userInitials} />
        <AvatarFallback>{userInitials}</AvatarFallback>
      </Avatar>
      <div>
        <span className={cn(typography({ variant: "p" }), "font-medium")}>
          {firstName} {lastName}
        </span>
        {!isEmpty(username) ? (
          <span className={cn(typography({ variant: "muted" }), "ml-1")}>
            (@{username})
          </span>
        ) : null}
      </div>
    </CommandItem>
  );
}

export function FriendsDropdownMenu({
  isShowingRequests,
}: {
  isShowingRequests: boolean;
}) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = React.useTransition();

  const handleOnCheckedChange = () => {
    const params = new URLSearchParams(window.location.search);

    if (!isShowingRequests) {
      params.set("show-requests", "true");
    } else {
      params.delete("show-requests");
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <Button variant="outline" size="sm" className="sm:hidden">
            Showing {isShowingRequests ? "friend requests" : "your friends"}
          </Button>
          <Button variant="outline" className="hidden sm:inline-flex">
            Showing {isShowingRequests ? "friend requests" : "your friends"}
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuCheckboxItem
          checked={!isShowingRequests}
          onCheckedChange={handleOnCheckedChange}
        >
          Your friends
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={isShowingRequests}
          onCheckedChange={handleOnCheckedChange}
        >
          Friends requests
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

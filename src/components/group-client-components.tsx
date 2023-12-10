"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import isNil from "lodash/isNil";
import size from "lodash/size";
import { PlusIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { typography } from "@/components/ui/typography";

function Tag({
  username,
  onRemove,
}: {
  username: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-sm text-secondary-foreground">
      <span className="mr-1">@{username}</span>
      <Button
        onClick={onRemove}
        variant="ghost"
        size="icon"
        className="h-5 w-5"
      >
        <XIcon className="h-4 w-4 text-secondary-foreground" />
      </Button>
    </span>
  );
}

export function CreateGroupDialog({
  isDialogOpen,
  children,
}: {
  isDialogOpen: boolean;
  children: any;
}) {
  const { replace } = useRouter();
  const pathname = usePathname();

  function openDialog() {
    const params = new URLSearchParams(window.location.search);
    params.set("create-group", "true");
    replace(`${pathname}?${params.toString()}`);
  }

  function onDialogChange(isOpen: boolean) {
    if (isOpen) return;

    const params = new URLSearchParams(window.location.search);
    params.delete("create-group");
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <>
      <Button onClick={openDialog} size="sm" className="md:hidden">
        <PlusIcon className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
        <span>Create group</span>
      </Button>
      <Button onClick={openDialog} className="hidden md:inline-flex">
        <PlusIcon className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
        <span>Create group</span>
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={onDialogChange}>
        {children}
      </Dialog>
    </>
  );
}

interface GroupDialogProps {
  users: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    prfileImage: string;
  }[];
}
export function GroupDialogContent({ users }: GroupDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedFriends, setSelectedFriends] = React.useState<
    {
      id: string;
      username: string;
    }[]
  >([]);

  function handleAddSelectedFriend(friend: { id: string; username: string }) {
    setSelectedFriends((selectedFriends) => [...selectedFriends, friend]);
  }

  function handleRemoveSelectedFriend(id: string) {
    setSelectedFriends((selectedFriends) =>
      selectedFriends.filter((friend) => friend.id !== id)
    );
  }

  const filteredUsers = users.filter((user) => {
    if (selectedFriends.find((friend) => friend.id === user.id)) return false;
    return true;
  });

  return (
    <form action="">
      <div className="mb-4 space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Group name" className="mt-1" />
        </div>
        <div>
          <Label htmlFor="friends">Friends</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <div className="flex items-center gap-2">
              <div className="mt-1 flex w-full justify-between rounded-md border px-3 py-2">
                {size(selectedFriends) > 0 ? (
                  selectedFriends.map((friend) => (
                    <Tag
                      username={friend.username}
                      onRemove={() => handleRemoveSelectedFriend(friend.id)}
                    />
                  ))
                ) : (
                  <p className="select-none text-sm text-muted-foreground">
                    No friends selected
                  </p>
                )}
              </div>
              <PopoverTrigger asChild>
                <Button variant="secondary" size="icon" className="shrink-0">
                  <PlusIcon className="h-4 w-4 text-secondary-foreground" />
                </Button>
              </PopoverTrigger>
            </div>
            <PopoverContent
              className="w-60 p-0 sm:w-80"
              side="bottom"
              align="end"
            >
              <Command>
                <CommandInput placeholder="Type friend's username" />
                <CommandList>
                  <CommandEmpty>No results found</CommandEmpty>
                  <CommandGroup>
                    {filteredUsers.map((user) => {
                      const firstName = user.firstName ?? "";
                      const lastName = user.lastName ?? "";
                      const userInitials = `${firstName[0] ?? ""}${
                        lastName[0] ?? ""
                      }`;
                      return (
                        <CommandItem
                          key={user.username}
                          value={user.username ?? ""}
                          onSelect={() =>
                            handleAddSelectedFriend({
                              id: user.id,
                              username: user.username ?? "",
                            })
                          }
                          className="cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage
                                src={user.prfileImage}
                                alt={userInitials}
                              />
                              <AvatarFallback>{userInitials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4
                                className={cn(
                                  typography({ variant: "p" }),
                                  "font-medium"
                                )}
                              >
                                {user.firstName} {user.lastName}
                              </h4>
                              {!isNil(user.username) ? (
                                <p className={typography({ variant: "muted" })}>
                                  @{user.username}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">Create group</Button>
      </DialogFooter>
    </form>
  );
}

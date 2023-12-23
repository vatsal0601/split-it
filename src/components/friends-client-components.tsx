"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  acceptRequest,
  deleteFriend,
  deleteRequest,
  sendRequest,
} from "@/actions/friends";
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import trim from "lodash/trim";
import { PlusIcon, UserMinusIcon, UserPlusIcon } from "lucide-react";
import { useFormState, useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TooltipTrigger } from "@/components/ui/tooltip";
import { typography } from "@/components/ui/typography";
import { useToast } from "@/components/ui/use-toast";

export function AddFriendCommand({
  isCommandOpen,
  children,
}: {
  isCommandOpen: boolean;
  children: React.ReactNode;
}) {
  const { replace } = useRouter();
  const pathname = usePathname();

  function openCommand() {
    const params = new URLSearchParams(window.location.search);
    params.set("add-friend", "true");
    replace(`${pathname}?${params.toString()}`);
  }

  function onCommandChange(isOpen: boolean) {
    if (isOpen) return;

    const params = new URLSearchParams(window.location.search);
    params.delete("add-friend");
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <>
      <Button onClick={openCommand} size="sm" className="md:hidden">
        <PlusIcon className="mr-2 size-4 lg:size-5" />
        <span>Add friend</span>
      </Button>
      <Button onClick={openCommand} className="hidden md:inline-flex">
        <PlusIcon className="mr-2 size-4 lg:size-5" />
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

export function AddFriendInput({ initialValue }: { initialValue: string }) {
  const [search, setSearch] = React.useState(initialValue);
  const [isPending, startTransition] = React.useTransition();
  const { replace } = useRouter();
  const pathname = usePathname();

  function handleSearch(value: string) {
    const params = new URLSearchParams(window.location.search);

    if (!isEmpty(value)) {
      params.set("add-friend", trim(value));
    } else {
      params.set("add-friend", "true");
    }

    setSearch(value);
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <CommandInput
      value={search}
      onValueChange={handleSearch}
      placeholder="Type friend's username"
      name="add-friend"
    />
  );
}

interface CommandUserProps {
  fromUserId: string;
  toUserId: string;
  firstName: string;
  lastName: string;
  username: string | null;
  userInitials: string;
  prfileImage: string;
}

interface CommandUserInternalProps extends CommandUserProps {
  handleSubmit: () => void;
}

function CommandUserInternal({
  firstName,
  lastName,
  username,
  userInitials,
  prfileImage,
  handleSubmit,
}: CommandUserInternalProps) {
  const { pending } = useFormStatus();

  return (
    <CommandItem
      onSelect={handleSubmit}
      className="cursor-pointer gap-2 disabled:opacity-50"
      disabled={pending}
      value={username ?? ""}
    >
      <Avatar className={cn("size-6", pending && "opacity-50")}>
        <AvatarImage src={prfileImage} alt={userInitials} />
        <AvatarFallback>{userInitials}</AvatarFallback>
      </Avatar>
      <div>
        <span
          className={cn(
            typography({ variant: "p" }),
            "font-medium",
            pending && "opacity-50"
          )}
        >
          {firstName} {lastName}
        </span>
        {!isEmpty(username) ? (
          <span
            className={cn(
              typography({ variant: "muted" }),
              "ml-1",
              pending && "opacity-50"
            )}
          >
            (@{username})
          </span>
        ) : null}
      </div>
    </CommandItem>
  );
}

export function CommandUser(props: CommandUserProps) {
  const { fromUserId, toUserId, username } = props;
  const [formState, formAction] = useFormState(sendRequest, null);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (isNil(formState)) return;

    const { success } = formState;

    if (success) {
      toast({
        description: `Friend request sent to @${username}`,
      });
      return;
    }

    toast({
      variant: "destructive",
      description: `Failed to send friend request to @${username}`,
    });
  }, [formState, toast, username]);

  function handleSubmit() {
    toast({
      description: `Sending friend request to @${username}`,
    });
    formRef.current?.requestSubmit();
  }

  return (
    <form ref={formRef} action={formAction}>
      <input type="hidden" name="from-user-id" value={fromUserId} />
      <input type="hidden" name="to-user-id" value={toUserId} />
      <CommandUserInternal handleSubmit={handleSubmit} {...props} />
    </form>
  );
}

export function DeleteConfirmationDialog({
  isShowingSentRequests,
  fromUserId,
  toUserId,
}: {
  isShowingSentRequests: boolean;
  fromUserId: string;
  toUserId: string;
}) {
  const [formState, formAction] = useFormState(
    isShowingSentRequests ? deleteRequest : deleteFriend,
    null
  );
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (isNil(formState)) return;

    const { success } = formState;

    if (success) {
      toast({
        description: isShowingSentRequests
          ? "Friend request deleted"
          : "Friend deleted",
      });
      return;
    }

    toast({
      variant: "destructive",
      description: isShowingSentRequests
        ? "Failed to delete friend request"
        : "Failed to delete friend",
    });
  }, [formState, toast, isShowingSentRequests]);

  function handleSubmit() {
    toast({
      description: isShowingSentRequests
        ? "Deleting your friend request"
        : "Deleting your friend",
    });
    formRef.current?.requestSubmit();
  }

  let alertDescription =
    "This action cannot be undone. This will delete your friend from your friends list.";

  if (isShowingSentRequests) {
    alertDescription =
      "This action cannot be undone. This will permanently delete your friend request.";
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <TooltipTrigger asChild>
          <Button
            onClick={handleSubmit}
            variant="ghost"
            size="icon"
            className="shrink-0 hover:bg-destructive/90 hover:text-destructive-foreground"
          >
            <UserMinusIcon className="size-6" />
          </Button>
        </TooltipTrigger>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>{alertDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form ref={formRef} action={formAction}>
            <input type="hidden" name="from-user-id" value={fromUserId} />
            <input type="hidden" name="to-user-id" value={toUserId} />
            <AlertDialogAction onClick={handleSubmit}>
              Continue
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function AddFriendButton({
  username,
  fromUserId,
  toUserId,
}: {
  username: string | null;
  fromUserId: string;
  toUserId: string;
}) {
  const [formState, formAction] = useFormState(acceptRequest, null);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (isNil(formState)) return;

    const { success } = formState;

    if (success) {
      toast({
        description: `@${username} added to your friends list`,
      });
      return;
    }

    toast({
      variant: "destructive",
      description: `Failed to add @${username} to your friends list`,
    });
  }, [formState, toast, username]);

  function handleSubmit() {
    toast({
      description: `Adding @${username} to your friends list`,
    });
    formRef.current?.requestSubmit();
  }

  return (
    <form ref={formRef} action={formAction} className="shrink-0">
      <input type="hidden" name="from-user-id" value={fromUserId} />
      <input type="hidden" name="to-user-id" value={toUserId} />
      <TooltipTrigger asChild>
        <Button onClick={handleSubmit} variant="ghost" size="icon">
          <UserPlusIcon className="size-6" />
        </Button>
      </TooltipTrigger>
    </form>
  );
}

export function FriendsToggle({
  isShowingRequests,
  isShowingSentRequests,
}: {
  isShowingRequests: boolean;
  isShowingSentRequests: boolean;
}) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = React.useTransition();

  function reset() {
    const params = new URLSearchParams(window.location.search);
    params.delete("show-requests");
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }

  function showRequests() {
    const params = new URLSearchParams(window.location.search);
    params.set("show-requests", "received");
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }

  function showSentRequests() {
    const params = new URLSearchParams(window.location.search);
    params.set("show-requests", "sent");
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }

  function handleOnValueChange(value: string) {
    if (value === "friends") reset();
    if (value === "received") showRequests();
    if (value === "sent") showSentRequests();
  }

  let value = "friends";
  if (isShowingRequests && !isShowingSentRequests) value = "received";
  if (isShowingSentRequests && !isShowingRequests) value = "sent";

  return (
    <div>
      <ToggleGroup
        value={value}
        onValueChange={handleOnValueChange}
        type="single"
        size="sm"
        className="flex-wrap justify-start md:hidden"
      >
        <ToggleGroupItem value="friends" aria-label="Your friends">
          Your friends
        </ToggleGroupItem>
        <ToggleGroupItem value="received" aria-label="Friend requests">
          Friend requests
        </ToggleGroupItem>
        <ToggleGroupItem value="sent" aria-label="Sent requests">
          Sent requests
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup
        value={value}
        onValueChange={handleOnValueChange}
        type="single"
        className="hidden flex-wrap justify-start md:flex"
      >
        <ToggleGroupItem value="friends" aria-label="Your friends">
          Your friends
        </ToggleGroupItem>
        <ToggleGroupItem value="received" aria-label="Friend requests">
          Friend requests
        </ToggleGroupItem>
        <ToggleGroupItem value="sent" aria-label="Sent requests">
          Sent requests
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

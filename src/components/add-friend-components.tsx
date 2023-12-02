"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { deleteFriend, deleteRequest, sendRequest } from "@/actions/friends";
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import { PlusIcon } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

  const openCommand = () => {
    const params = new URLSearchParams(window.location.search);
    params.set("add-friend", "true");
    replace(`${pathname}?${params.toString()}`);
  };

  const onCommandChange = (isOpen: boolean) => {
    if (isOpen) return;

    const params = new URLSearchParams(window.location.search);
    params.delete("add-friend");
    replace(`${pathname}?${params.toString()}`);
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
  const [search, setSearch] = React.useState(
    initialValue === "true" ? "" : initialValue
  );
  const [isPending, startTransition] = React.useTransition();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(window.location.search);

    if (!isEmpty(value)) {
      params.set("add-friend", value);
    } else {
      params.set("add-friend", "true");
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
      className="gap-2 disabled:opacity-50"
      disabled={pending}
    >
      <Avatar className={cn("h-6 w-6", pending && "opacity-50")}>
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

export function FriendsDropdownMenu({
  isShowingRequests,
  isShowingSentRequests,
}: {
  isShowingRequests: boolean;
  isShowingSentRequests: boolean;
}) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = React.useTransition();

  const reset = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("show-requests");
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  const showRequests = () => {
    const params = new URLSearchParams(window.location.search);
    params.set("show-requests", "received");
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  const showSentRequests = () => {
    const params = new URLSearchParams(window.location.search);
    params.set("show-requests", "sent");
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  let triggerText = "Showing your friends";
  if (isShowingRequests && !isShowingSentRequests)
    triggerText = "Showing received friend requests";
  if (isShowingSentRequests && !isShowingRequests)
    triggerText = "Showing sent friend requests";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <Button variant="outline" size="sm" className="sm:hidden">
            {triggerText}
          </Button>
          <Button variant="outline" className="hidden sm:inline-flex">
            {triggerText}
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuCheckboxItem
          checked={!isShowingRequests && !isShowingSentRequests}
          onCheckedChange={reset}
        >
          Your friends
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={isShowingRequests && !isShowingSentRequests}
          onCheckedChange={showRequests}
        >
          Received friend requests
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={isShowingSentRequests && !isShowingRequests}
          onCheckedChange={showSentRequests}
        >
          Sent friend requests
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DeleteConfirmationDialog({
  children,
  isShowingSentRequests,
  fromUserId,
  toUserId,
}: {
  children: React.ReactNode;
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
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
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

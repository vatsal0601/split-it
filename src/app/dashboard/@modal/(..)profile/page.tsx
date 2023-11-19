"use client";

import { useRouter } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Profile() {
  const router = useRouter();

  const handleOnOpenChange = (isOpen: boolean) => {
    if (isOpen) return;
    router.back();
  };

  const redirectToHome = () => {
    router.push("/");
  };

  return (
    <Dialog onOpenChange={handleOnOpenChange} defaultOpen={true}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">my profile</div>
        <DialogFooter>
          <SignOutButton signOutCallback={redirectToHome}>
            <Button variant="secondary">Logout</Button>
          </SignOutButton>
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

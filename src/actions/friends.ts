"use server";

import { revalidatePath } from "next/cache";
import isEmpty from "lodash/isEmpty";

import {
  acceptFriendRequest,
  deleteFriend as deleteFriendFromDb,
  deleteFriendRequest,
  sendFriendRequest,
} from "@/db/friends";

export async function sendRequest(prevState: any, formData: FormData) {
  const fromUserId = formData.get("from-user-id") as string;
  const toUserId = formData.get("to-user-id") as string;

  if (isEmpty(fromUserId) || isEmpty(toUserId)) {
    return {
      success: false,
    };
  }

  await sendFriendRequest({ fromUserId, toUserId });
  revalidatePath("/dashboard/friends");
  return {
    success: true,
  };
}

export async function acceptRequest(prevState: any, formData: FormData) {
  const fromUserId = formData.get("from-user-id") as string;
  const toUserId = formData.get("to-user-id") as string;

  if (isEmpty(fromUserId) || isEmpty(toUserId)) {
    return {
      success: false,
    };
  }

  await acceptFriendRequest({ fromUserId, toUserId });
  revalidatePath("/dashboard/friends");
  return {
    success: true,
  };
}

export async function deleteRequest(prevState: any, formData: FormData) {
  const fromUserId = formData.get("from-user-id") as string;
  const toUserId = formData.get("to-user-id") as string;

  if (isEmpty(fromUserId) || isEmpty(toUserId)) {
    return {
      success: false,
    };
  }

  await deleteFriendRequest({ fromUserId, toUserId });
  revalidatePath("/dashboard/friends");
  return {
    success: true,
  };
}

export async function deleteFriend(prevState: any, formData: FormData) {
  const fromUserId = formData.get("from-user-id") as string;
  const toUserId = formData.get("to-user-id") as string;

  if (isEmpty(fromUserId) || isEmpty(toUserId)) {
    return {
      success: false,
    };
  }

  await deleteFriendFromDb({ fromUserId, toUserId });
  revalidatePath("/dashboard/friends");
  return {
    success: true,
  };
}

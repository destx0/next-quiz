import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ADMIN_EMAILS = [
  "classcommon2@gmail.com",
  "destisdbest@gmail.com",
  "iampulakghosh@gmail.com",
];

export const isAdminUser = (email: string | null | undefined): boolean => {
  return email ? ADMIN_EMAILS.includes(email) : false;
};

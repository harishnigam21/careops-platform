import { formatDistanceToNow } from "date-fns";

export const getDaysBetween = (dateString) => {
  if (!dateString) return "";

  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};

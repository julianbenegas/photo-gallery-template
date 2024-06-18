"use client";

import { useSearchParams } from "next/navigation";

export const SelectedPhotoDialog = () => {
  const params = useSearchParams();
  const selected = params.get("selected");

  return selected ?? "";
};

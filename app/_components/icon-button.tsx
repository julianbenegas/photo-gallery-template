"use client";
import { clsx } from "clsx";

export const IconButton = ({
  className,
  ...props
}: JSX.IntrinsicElements["button"]) => {
  return (
    <button {...props} className={clsx(className, "pointer-events-auto")} />
  );
};

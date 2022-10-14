import clsx from "clsx";
import type { ReactNode } from "react";

enum Variant {
  GRAY,
  RED,
  ORANGE,
  YELLOW,
  GREEN,
  TEAL,
  BLUE,
  INDIGO,
  PURPLE,
  PINK,
}

const VARIANT_MAPS: Record<Variant, string> = {
  [Variant.GRAY]: "bg-gray-100 text-gray-800",
  [Variant.RED]: "bg-red-100 text-red-800",
  [Variant.ORANGE]: "bg-orange-100 text-orange-800",
  [Variant.YELLOW]: "bg-yellow-100 text-yellow-800",
  [Variant.GREEN]: "bg-green-100 text-green-800",
  [Variant.TEAL]: "bg-teal-100 text-teal-800",
  [Variant.BLUE]: "bg-blue-100 text-blue-800",
  [Variant.INDIGO]: "bg-indigo-100 text-indigo-800",
  [Variant.PURPLE]: "bg-purple-100 text-purple-800",
  [Variant.PINK]: "bg-pink-100 text-pink-800",
};

interface BadgeProps {
  variant: Variant;
  children?: ReactNode;
}

export function Badge(props: BadgeProps) {
  const { children, variant } = props;

  return (
    <span
      className={clsx(
        "whitespace-no-wrap inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium leading-4",
        VARIANT_MAPS[variant]
      )}
    >
      {children}
    </span>
  );
}

Badge.variant = Variant;

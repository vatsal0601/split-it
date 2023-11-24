"use client";

import * as React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import type { Appearance } from "@clerk/types";
import { useTheme } from "next-themes";

export function ThemedClerkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = React.useState(false);
  const theme = useTheme();
  const isDark = theme.resolvedTheme === "dark";

  const appearance: Appearance = isDark
    ? {
        variables: {
          colorPrimary: "hsl(212 80% 69%)",
          colorDanger: "hsl(0 62.8% 30.6%)",
          colorAlphaShade: "hsl(212 80% 69%)",
          colorText: "hsl(212 8% 98.45%)",
          colorTextOnPrimaryBackground: "hsl(212 8% 6.8999999999999995%)",
          colorTextSecondary: "hsl(212 8% 56.9%)",
          colorBackground: "hsl(212 52% 5.52%)",
          fontSmoothing: "antialiased",
          borderRadius: "0.5rem",
        },
      }
    : {
        variables: {
          colorPrimary: "hsl(228 73% 13%)",
          colorDanger: "hsl(0 84.2% 60.2%)",
          colorAlphaShade: "hsl(228 73% 13%)",
          colorText: "hsl(228 5.38% 11.3%)",
          colorTextOnPrimaryBackground: "hsl(228 1.46% 91.3%)",
          colorTextSecondary: "hsl(228 3.65% 41.3%)",
          colorBackground: "hsl(228 98.65% 98.26%)",
          fontSmoothing: "antialiased",
          borderRadius: "0.5rem",
        },
      };

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return <ClerkProvider appearance={appearance}>{children}</ClerkProvider>;
}

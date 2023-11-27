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
          colorPrimary: "hsl(217.2 91.2% 59.8%)",
          colorDanger: "hsl(0 62.8% 30.6%)",
          colorAlphaShade: "hsl(217.2 91.2% 59.8%)",
          colorText: "hsl(210 40% 98%)",
          colorTextOnPrimaryBackground: "hsl(210 40% 98%)",
          colorTextSecondary: "hsl(215 20.2% 65.1%)",
          colorBackground: "hsl(222.2 84% 4.9%)",
          colorInputBackground: "hsl(222.2 84% 4.9%)",
          colorInputText: "hsl(210 40% 98%)",
          fontSmoothing: "antialiased",
          borderRadius: "0.75rem",
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
          borderRadius: "0.75rem",
        },
      };

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return <ClerkProvider appearance={appearance}>{children}</ClerkProvider>;
}

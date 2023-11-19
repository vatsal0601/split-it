import "./globals.css";

import type { Metadata } from "next";
import { Noto_Color_Emoji } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";

import { cn } from "@/lib/utils";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "SplitIt",
  description:
    "SplitIt allows you to split bills more simply while still keeping track of them",
};

const notoEmoji = Noto_Color_Emoji({
  subsets: ["emoji"],
  weight: "400",
  display: "block",
  variable: "--font-noto-emoji",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={cn(
          GeistSans.variable,
          notoEmoji.variable,
          "font-sans",
          "h-full"
        )}
      >
        <body className="h-full">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

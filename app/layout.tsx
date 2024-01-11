import AppBar from "@/components/AppBar";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import GoogleAnalytics from "@bradgarropy/next-google-analytics";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Cabin } from "next/font/google";
import "./globals.css";

const cabin = Cabin({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tasky - Next",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryProvider>
      <ClerkProvider>
        <html lang="en">
          <body className={cabin.className}>
            <AppBar />
            <div className="container">
              <GoogleAnalytics measurementId="G-M1PFRFW5Q7" />
              {children}
            </div>
          </body>
        </html>
      </ClerkProvider>
    </ReactQueryProvider>
  );
}

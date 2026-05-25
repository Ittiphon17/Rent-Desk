import type { Metadata } from "next";
import { Chakra_Petch } from "next/font/google";
import "./globals.css";

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra-petch",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Rent-Desk | Condo & Apartment Management Portal",
  description: "A comprehensive and accessible portal for property managers and tenants to handle leases, invoices, and maintenance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${chakraPetch.variable} h-full antialiased`}
    >
      <body className={`${chakraPetch.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}

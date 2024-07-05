import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ChakraProviders } from "./chakra_provider";
import "./global.css"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Directory Marketplace POC",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ChakraProviders>
                    <main>
                        {children}
                    </main>
                </ChakraProviders>
            </body>
        </html>
    );
}

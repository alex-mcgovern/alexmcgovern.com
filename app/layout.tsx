import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Main } from "boondoggle/main";
import { css } from "boondoggle/css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Alex McGovern",
    description: "Coder / software engineer based in London.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Main
                    size="md"
                    className={css({
                        marginX: "auto",
                        paddingY: "space_8",
                    })}
                >
                    {children}
                </Main>
            </body>
        </html>
    );
}

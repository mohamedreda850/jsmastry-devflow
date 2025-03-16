import type { Metadata } from "next";
import "./globals.css";
import  localFont  from "next/font/local";
const inter = localFont({
  src:"./fonts/InterVF.ttf",
  variable: "--font-inter",
});
const spaceGrotesk = localFont({
  src:"./fonts/SpaceGrotesk.ttf",
  variable: "--font-space-grotesk",
});


export const metadata: Metadata = {
  title: "DevFlow",
  description: "A community-driven platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers from around the world. Explore topics in web development, mobile app development, algorithms, data structures, and more.",
  icons:{
    icon:"./../public/images/site-logo.svg"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${spaceGrotesk.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

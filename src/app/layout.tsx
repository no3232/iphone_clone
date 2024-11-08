import "@/styles/globals.css";

export const metadata = {
  title: "Apple iPhone",
  description: "Apple iPhone",
  icons: {
    icon: "/assets/images/apple.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}

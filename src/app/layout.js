import { Roboto } from 'next/font/google'
import "./globals.css";

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

export const metadata = {
  title: "RAG Droptimizer",
  description: "RAG Droptimizer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" href="./icon.png" sizes="any" />
      <body className={roboto.className}>{children}</body>
    </html>
  );
}

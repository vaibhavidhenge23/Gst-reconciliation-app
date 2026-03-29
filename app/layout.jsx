import "./globals.css";
import Header from "./components/Header";

export const metadata = {
  title: "GST Automation App",
  description: "GST Reconciliation & Tax Filing for Indian Businesses",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}

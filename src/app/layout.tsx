import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`antialiased`}>
                {children}
                <Toaster />
            </body>
        </html>
    );
}
export default RootLayout;

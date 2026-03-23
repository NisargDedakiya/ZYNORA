import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import { LuxuryIntro } from "@/components/LuxuryIntro";

export default function StorefrontLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <CartProvider>
            <LuxuryIntro />
            <Header />
            <main className="min-h-screen pt-24">
                {children}
            </main>
            <Footer />
        </CartProvider>
    );
}

import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RootLayout({ children }) {
    return (
        <html lang="ru">
        <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto p-4">
            {children}
        </main>
        <Footer />
        </body>
        </html>
    );
}
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Script from 'next/script';

export default function RootLayout({ children }) {
    return (
        <html lang="ru" suppressHydrationWarning>
        <head>
            {/* Подключаем скрипт Telegram Web App */}
            <Script
                src="https://telegram.org/js/telegram-web-app.js"
                strategy="beforeInteractive"
            />
        </head>
        <body className="flex flex-col min-h-screen">
        <Header />
        <main className="container mx-auto p-4 flex-grow flex">
            {children}
        </main>
        <Footer />
        </body>
        </html>
    );
}

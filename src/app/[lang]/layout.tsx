import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import Header from '@/components/layout/Header';
import { getDictionary, Locale } from '@/lib/i18n';
import '../globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const dict = getDictionary(resolvedParams.lang as Locale);
    return {
        title: dict.siteTitle,
        description: dict.siteDesc,
    };
}

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const resolvedParams = await params;

    return (
        <html lang={resolvedParams.lang} suppressHydrationWarning>
            <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-[#ffffff] dark:bg-[#05070a] text-zinc-900 dark:text-[#94a3b8] antialiased min-h-screen selection:bg-[#5eead4]/30 selection:text-white`} suppressHydrationWarning>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <div className="max-w-7xl mx-auto px-6 py-10">
                        <Header currentLang={resolvedParams.lang} />
                        <main className="mt-20">
                            {children}
                        </main>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}

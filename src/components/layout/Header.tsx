'use client';

import Link from 'next/link';
import { Terminal } from 'lucide-react';
import LangSelector from './LangSelector';
import ThemeToggle from './ThemeToggle';
import { usePathname } from 'next/navigation';
import { getDictionary, Locale } from '@/lib/i18n';

export default function Header({ currentLang }: { currentLang: string }) {
    const pathname = usePathname();
    const dictionary = getDictionary(currentLang as Locale);

    const navItems = [
        { name: dictionary.navArticles, path: `/${currentLang}/blog` },
        { name: dictionary.navSeries, path: `/${currentLang}/series` },
        { name: dictionary.navAbout, path: `/${currentLang}/about` },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 dark:border-teal-500/10 bg-white/70 dark:bg-[#05070a]/70 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href={`/${currentLang}`} className="flex items-center gap-3 transition-all hover:opacity-80">
                    <Terminal className="w-5 h-5 text-zinc-900 dark:text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                    <span className="text-sm font-bold tracking-[0.2em] font-mono text-zinc-900 dark:text-zinc-100 italic">
                        KVASIGARD_SYS
                    </span>
                </Link>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex gap-6">
                        {navItems.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`text-xs font-mono tracking-widest transition-all ${isActive
                                            ? 'text-indigo-600 dark:text-amber-500 font-bold underline decoration-2 underline-offset-8'
                                            : 'text-zinc-500 dark:text-[#94a3b8] hover:text-zinc-900 dark:hover:text-zinc-100'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-4 border-l border-zinc-200 dark:border-white/5 pl-6">
                        <ThemeToggle />
                        <LangSelector currentLang={currentLang} />
                    </div>
                </div>
            </div>
        </nav>
    );
}

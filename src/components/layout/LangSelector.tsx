'use client';

import { usePathname, useRouter } from 'next/navigation';

interface LangSelectorProps {
    currentLang: string;
}

export default function LangSelector({ currentLang }: LangSelectorProps) {
    const pathname = usePathname();
    const router = useRouter();

    const setLang = (lang: string) => {
        if (!pathname || lang === currentLang) return;
        const segments = pathname.split('/');
        if (segments[1] === currentLang) {
            segments[1] = lang;
        }
        router.push(segments.join('/'));
    };

    return (
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest bg-zinc-100/50 dark:bg-white/5 p-1 rounded border border-zinc-200 dark:border-teal-500/10">
            <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 transition-all rounded ${
                    currentLang === 'en' 
                        ? 'text-indigo-600 dark:text-amber-500 font-bold bg-white dark:bg-white/10 shadow-[0_0_10px_rgba(99,102,241,0.1)]' 
                        : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
                }`}
                aria-label="Set language to English"
            >
                [EN]
            </button>
            <button
                onClick={() => setLang('es')}
                className={`px-2 py-1 transition-all rounded ${
                    currentLang === 'es' 
                        ? 'text-indigo-600 dark:text-amber-500 font-bold bg-white dark:bg-white/10 shadow-[0_0_10px_rgba(245,158,11,0.1)]' 
                        : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
                }`}
                aria-label="Establecer idioma a Español"
            >
                [ES]
            </button>
        </div>
    );
}

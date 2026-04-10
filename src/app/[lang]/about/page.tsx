import { getDictionary, Locale } from '@/lib/i18n';
import Link from 'next/link';

interface AboutPageProps {
    params: Promise<{
        lang: string;
    }>;
}


export function generateStaticParams() {
    return [{ lang: 'es' }, { lang: 'en' }];
}


export default async function AboutPage({ params }: AboutPageProps) {
    const resolvedParams = await params;
    const dictionary = getDictionary(resolvedParams.lang as Locale);

    return (
        <div className="w-full space-y-12 max-w-5xl mx-auto">
            {/* Cabecera del Sistema */}
            <header className="mb-12 pb-10 border-b border-zinc-200 dark:border-white/10">
                <h1 className="text-4xl sm:text-5xl font-bold italic tracking-tight text-zinc-900 dark:text-zinc-100 font-mono mb-4">
                    {dictionary.aboutTitle.toUpperCase()}
                </h1>
                <p className="text-[10px] sm:text-xs font-mono text-zinc-500 dark:text-[#94a3b8] tracking-[0.2em] uppercase">
                    {dictionary.aboutDesc}
                </p>
            </header>

            <div className="relative">
                <div className="space-y-12">
                    <section className="relative">
                        <div className="prose prose-zinc dark:prose-invert max-w-none text-lg leading-relaxed text-zinc-700 dark:text-[#94a3b8] font-sans">
                            {dictionary.aboutBio}
                        </div>
                    </section>

                    <section className="space-y-8">
                        <h2 className="text-[10px] font-mono font-bold text-indigo-600 dark:text-amber-500 tracking-[0.3em] uppercase opacity-80">
                            {dictionary.contactTitle}
                        </h2>

                        <div className="flex flex-wrap gap-x-12 gap-y-8">
                            {[
                                { name: 'GitHub', url: 'https://github.com/noelsandival', label: 'github.com/noelsandival' },
                                { name: 'Twitter/X', url: 'https://x.com/noelsandival', label: 'twitter.com/noelsandival' }
                            ].map((channel) => (
                                <Link
                                    key={channel.name}
                                    href={channel.url}
                                    target="_blank"
                                    className="group flex flex-col"
                                >
                                    <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1 group-hover:text-indigo-600 dark:group-hover:text-amber-500 transition-colors">
                                        {channel.name}
                                    </span>
                                    <span className="text-sm font-mono text-zinc-800 dark:text-zinc-300 border-b border-zinc-200 dark:border-white/10 group-hover:border-indigo-500 dark:group-hover:border-amber-500 transition-all pb-1">
                                        {channel.label}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {/* Footer de información de sistema */}
            <div className="pt-12 mt-12 border-t border-zinc-100 dark:border-zinc-900 flex justify-between items-center text-[10px] font-mono text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">
                <span>// KVASIGARD_V1.0.4</span>
                <span>// CONNECTION_SECURE: RUST_AES_256</span>
            </div>
        </div>
    );
}

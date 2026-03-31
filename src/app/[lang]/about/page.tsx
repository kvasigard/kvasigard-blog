import { getDictionary, Locale } from '@/lib/i18n';
import Link from 'next/link';

interface AboutPageProps {
    params: Promise<{
        lang: string;
    }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
    const resolvedParams = await params;
    const dictionary = getDictionary(resolvedParams.lang as Locale);

    return (
        <div className="w-full space-y-10 max-w-4xl mx-auto">
            {/* Cabecera del Sistema */}
            <header className="mb-10 pb-8 border-b border-zinc-200 dark:border-white/10">
                <h1 className="text-4xl font-bold italic tracking-tight text-zinc-900 dark:text-zinc-100 font-mono mb-4">
                    {dictionary.aboutTitle.toUpperCase()}
                </h1>
                <p className="text-[10px] font-mono text-zinc-500 dark:text-[#94a3b8] tracking-[0.2em] uppercase">
                    {dictionary.aboutDesc}
                </p>
            </header>
            
            <div className="relative group">
                {/* Decoración lateral de terminal */}
                <div className="absolute -left-4 top-0 bottom-0 w-[1px] bg-indigo-500/20 dark:bg-amber-500/20 hidden md:block" />
                
                <div className="space-y-8 pl-0 md:pl-8">
                    <section 
                        className="p-8 border border-zinc-200 dark:border-white/10 rounded-xl bg-zinc-50/50 dark:bg-white/[0.02] backdrop-blur-md relative overflow-hidden shadow-sm"
                    >
                        {/* Indicador de carga de perfil */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-indigo-500/10 dark:bg-amber-500/10" />
                        
                        <div className="prose prose-zinc dark:prose-invert max-w-none text-base leading-relaxed text-zinc-700 dark:text-[#94a3b8] font-sans">
                            {dictionary.aboutBio}
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-[10px] font-mono font-bold text-indigo-600 dark:text-amber-500 tracking-[0.3em] uppercase opacity-80">
                            {dictionary.contactTitle}
                        </h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { name: 'GitHub', url: 'https://github.com/noelsandival', label: '/@noelsandival' },
                                { name: 'Twitter/X', url: 'https://x.com/noelsandival', label: '/@noelsandival' }
                            ].map((channel) => (
                                <Link 
                                    key={channel.name}
                                    href={channel.url}
                                    target="_blank"
                                    className="p-4 border border-zinc-200 dark:border-white/5 rounded-lg bg-white/50 dark:bg-white/[0.01] hover:border-indigo-500/50 dark:hover:border-amber-500/50 transition-all group"
                                >
                                    <span className="block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 mb-1 group-hover:text-indigo-600 dark:group-hover:text-amber-500 transition-colors">
                                        {channel.name}
                                    </span>
                                    <span className="text-sm font-mono text-zinc-800 dark:text-zinc-300">
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

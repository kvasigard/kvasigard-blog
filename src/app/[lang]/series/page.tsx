import { getAllPosts } from '@/lib/mdx';
import { getDictionary, Locale } from '@/lib/i18n';
import Link from 'next/link';


export function generateStaticParams() {
    return [{ lang: 'es' }, { lang: 'en' }];
}


export default async function SagasPage({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await params;
    const posts = await getAllPosts(resolvedParams.lang);
    const dictionary = getDictionary(resolvedParams.lang as Locale);

    const sagaMap = posts.reduce((acc, post) => {
        if (post.series) {
            if (!acc[post.series]) acc[post.series] = [];
            acc[post.series].push(post);
        }
        return acc;
    }, {} as Record<string, typeof posts>);

    const sagaEntries = Object.entries(sagaMap);
    const totalModulesInSagas = sagaEntries.reduce((sum, [, items]) => sum + items.length, 0);

    return (
        <div className="space-y-12">
            <header className="mb-10 pb-8 border-b border-zinc-200 dark:border-white/10">
                <h1 className="text-3xl font-bold tracking-[0.1em] mb-4 text-zinc-900 dark:text-zinc-100 font-mono italic text-left">
                    {dictionary.navSeries.toUpperCase()}
                </h1>
                <p className="text-[10px] font-mono text-[#94a3b8] tracking-widest uppercase text-left">
                    {sagaEntries.length === 0 ? dictionary.noSeries : (
                        `# ${sagaEntries.length} ${dictionary.series.toUpperCase()} // ${totalModulesInSagas} ${dictionary.modulesLoaded}`
                    )}
                </p>
            </header>

            <div className="grid gap-10 lg:grid-cols-1">
                {sagaEntries.map(([sagaName, sagaPosts]) => (
                    <section
                        key={sagaName}
                        className="p-8 border border-zinc-200 dark:border-white/10 rounded-xl bg-zinc-50/50 dark:bg-white/[0.02] backdrop-blur-sm relative overflow-hidden group hover:border-indigo-500/20 dark:hover:border-amber-500/20 transition-all shadow-lg text-left"
                    >
                        {/* Interactive scanline effect for sagas */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-indigo-500/20 dark:bg-amber-500/20 group-hover:animate-scan-y" />

                        <div className="flex items-start justify-between mb-8">
                            <h2 className="text-xl font-bold text-indigo-500 dark:text-amber-500 font-mono tracking-tight flex items-center gap-3">
                                <span className="opacity-50 font-normal">{dictionary.sagaPrefix}::</span>
                                {sagaName.toUpperCase()}
                            </h2>
                            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-white/10 px-2 py-1 rounded bg-zinc-100/50 dark:bg-white/5 transition-all">
                                {dictionary.pktSize}: {sagaPosts.length}
                            </span>
                        </div>

                        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                            {sagaPosts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(post => (
                                <li key={post.slug} className="group/item">
                                    <Link
                                        href={`/${resolvedParams.lang}/blog/${post.slug}`}
                                        className="block p-4 border border-zinc-200/60 dark:border-white/5 rounded-lg bg-zinc-100/50 dark:bg-white/[0.01] hover:border-indigo-500/30 dark:hover:border-amber-500/30 hover:bg-white dark:hover:bg-white/5 transition-all relative overflow-hidden group shadow-sm"
                                    >
                                        <div className="text-sm font-semibold text-zinc-800 dark:text-zinc-300 group-hover/item:text-indigo-600 dark:group-hover/item:text-amber-500 transition-all font-mono translate-x-0 group-hover/item:translate-x-1 duration-300">
                                            {post.title}
                                        </div>
                                        <div className="text-[10px] text-zinc-500 mt-2 font-mono flex gap-3 uppercase tracking-widest">
                                            <span>{post.date}</span>
                                            <span className="opacity-30">|</span>
                                            <span>{post.readTime}m</span>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>
        </div>
    );
}

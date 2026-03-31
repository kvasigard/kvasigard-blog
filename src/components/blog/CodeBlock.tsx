'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
    code: string;
    language: string;
    html: string;
    copyLabel: string;
    copiedLabel: string;
}

export default function CodeBlock({ code, language, html, copyLabel, copiedLabel }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group my-8 rounded-xl overflow-hidden border border-zinc-200 dark:border-teal-500/20 bg-zinc-50 dark:bg-[#0d1117] shadow-sm transition-colors duration-300">

            {/* Cabecera del bloque de código */}
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-200/50 dark:bg-white/[0.02] border-b border-zinc-200 dark:border-white/10 font-mono text-[10px] uppercase tracking-widest text-zinc-500 dark:text-amber-500 transition-colors duration-300">
                <span>{language}</span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-amber-400 transition-colors"
                >
                    {copied ? (
                        <>
                            <Check className="w-3 h-3 text-indigo-500 dark:text-amber-500" />
                            <span className="text-indigo-500 dark:text-amber-500">{copiedLabel}</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3 h-3" />
                            <span>{copyLabel}</span>
                        </>
                    )}
                </button>
            </div>

            {/* SOLUCIÓN: En lugar de filtros, usamos selectores de descendientes.
               Forzamos a que en modo oscuro, cualquier span (token de código) que tenga un color 
               demasiado oscuro o herede el color base, se vea brillante.
            */}
            <div
                className="overflow-auto text-sm leading-relaxed
                           [&_pre]:!bg-transparent [&_pre]:m-0 [&_pre]:p-5
                           [&_pre]:text-zinc-700 dark:[&_pre]:text-zinc-300
                           dark:[&_span]:!text-[inherit] dark:[&_span[style*='color']]:[color:inherit]
                           dark:[&_span]:brightness-150 dark:[&_span]:contrast-125"
                dangerouslySetInnerHTML={{ __html: html }}
            />

            {/* Estilo inyectado específico para arreglar los colores del HTML estático en Dark Mode */}
            <style jsx global>{`
                .dark .dark\:bg-\[\#0d1117\] span[style*="color: #24292e"], 
                .dark .dark\:bg-\[\#0d1117\] span[style*="color:#24292e"] {
                    color: #e2e8f0 !important; /* Forzamos el texto base a gris claro */
                }
                .dark .dark\:bg-\[\#0d1117\] span[style*="color: #6a737d"],
                .dark .dark\:bg-\[\#0d1117\] span[style*="color:#6a737d"] {
                    color: #94a3b8 !important; /* Forzamos comentarios a gris legible */
                }
            `}</style>
        </div>
    );
}
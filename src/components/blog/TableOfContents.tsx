'use client';

// Añadimos useRef a los imports
import { useEffect, useState, useRef } from 'react';

interface TOCHeading {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    headings: TOCHeading[];
    title: string;
}

export default function TableOfContents({ headings, title }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>(headings.length > 0 ? headings[0].id : '');

    // Referencias para manejar el clic y bloquear el observer temporalmente
    const isClickingRef = useRef<boolean>(false);
    const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            // Si el scroll es provocado por un clic nuestro, ignoramos esta lógica
            if (isClickingRef.current) return;

            const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
            if (scrollPercent > 0.95 && headings.length > 0) {
                setActiveId(headings[headings.length - 1].id);
            }
        };

        const callback = (entries: IntersectionObserverEntry[]) => {
            // Si estamos saltando hacia un enlace por clic, ignoramos las actualizaciones visuales
            if (isClickingRef.current) return;

            const visibleEntries = entries.filter(entry => entry.isIntersecting);
            if (visibleEntries.length > 0) {
                const topMost = visibleEntries.reduce((prev, curr) =>
                    curr.boundingClientRect.top < prev.boundingClientRect.top ? curr : prev
                );
                setActiveId(topMost.target.id);
            }
        };

        const observer = new IntersectionObserver(callback, {
            // Ajustamos el rootMargin. Al subir el límite inferior (-60%) forzamos a 
            // que se fije más en la parte superior de la pantalla.
            rootMargin: '-70px 0px -60% 0px',
            threshold: 1.0, // Forzamos a que detecte cuando el título asoma completamente
        });

        headings.forEach((heading) => {
            const element = document.getElementById(heading.id);
            if (element) {
                observer.observe(element);
            }
        });

        window.addEventListener('scroll', handleScroll);
        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
            if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
        };
    }, [headings]);

    // Función para manejar el clic explícitamente
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        // Establecer activo inmediatamente
        setActiveId(id);

        // Bloquear el observer
        isClickingRef.current = true;
        if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);

        // Desbloquear tras 800ms (tiempo suficiente para que termine cualquier animación de scroll)
        clickTimeoutRef.current = setTimeout(() => {
            isClickingRef.current = false;
        }, 800);
    };

    const activeIndex = headings.findIndex(h => h.id === activeId);
    let activeParentId: string | null = null;

    if (activeIndex !== -1) {
        for (let i = activeIndex; i >= 0; i--) {
            if (headings[i].level === 2) {
                activeParentId = headings[i].id;
                break;
            }
        }
    }

    return (
        <nav className="p-6 border border-zinc-200 dark:border-white/5 rounded-xl bg-white/50 dark:bg-white/[0.01] backdrop-blur-sm shadow-sm relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 dark:bg-amber-500/5 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none" />

            <h4 className="relative z-10 text-[10px] font-bold text-indigo-600 dark:text-amber-500 mb-6 tracking-[0.2em] uppercase border-b border-zinc-200 dark:border-white/10 pb-3 font-mono italic">
                {title}
            </h4>
            <ul className="space-y-4 relative z-10">
                {headings.map((heading, index) => {
                    const isActive = activeId === heading.id;
                    const isSubSection = heading.level > 2;

                    let isVisible = !isSubSection;

                    if (isSubSection) {
                        let myParentId: string | null = null;
                        for (let i = index; i >= 0; i--) {
                            if (headings[i].level === 2) {
                                myParentId = headings[i].id;
                                break;
                            }
                        }

                        if (myParentId && myParentId === activeParentId) {
                            isVisible = true;
                        }
                    }

                    if (!isVisible) return null;

                    return (
                        <li
                            key={heading.id}
                            style={{ paddingLeft: isSubSection ? '1.25rem' : '0' }}
                            className="transition-all duration-300 ease-in-out relative group"
                        >
                            {isActive && (
                                <div className="absolute left-[-1.25rem] top-1/2 -translate-y-1/2 w-[2px] h-3 bg-indigo-600 dark:bg-amber-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.4)] dark:shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
                            )}
                            <a
                                href={`#${heading.id}`}
                                onClick={(e) => handleClick(e, heading.id)}
                                className={`block text-[10px] font-mono leading-relaxed transition-all duration-300 uppercase tracking-widest ${isActive
                                    ? 'text-indigo-600 dark:text-amber-500 font-bold opacity-100'
                                    : 'text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-zinc-200 opacity-80 hover:opacity-100'
                                    }`}
                            >
                                {heading.text}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
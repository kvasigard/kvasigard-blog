'use client';

import { useEffect } from 'react';

export default function CopyCodeListener() {
    useEffect(() => {
        const buttons = document.querySelectorAll('.copy-button');
        
        const handleCopy = async (e: Event) => {
            const button = e.currentTarget as HTMLButtonElement;
            const code = button.getAttribute('data-code');
            const copiedLabel = button.getAttribute('data-copied-label');
            const copyLabel = button.getAttribute('data-copy-label');
            
            if (code) {
                await navigator.clipboard.writeText(decodeURIComponent(code));
                
                const copyTextSpan = button.querySelector('.copy-text');
                const svg = button.querySelector('svg');
                
                if (copyTextSpan && copiedLabel) {
                    copyTextSpan.textContent = copiedLabel;
                }
                if (svg) {
                    // Change to check icon
                    svg.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';
                    svg.classList.remove('lucide-copy');
                    svg.classList.add('lucide-check');
                    svg.classList.add('text-indigo-500', 'dark:text-amber-500');
                }
                
                setTimeout(() => {
                    if (copyTextSpan && copyLabel) {
                        copyTextSpan.textContent = copyLabel;
                    }
                    if (svg) {
                        svg.innerHTML = '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>';
                        svg.classList.add('lucide-copy');
                        svg.classList.remove('lucide-check', 'text-indigo-500', 'dark:text-amber-500');
                    }
                }, 2000);
            }
        };

        buttons.forEach(button => {
            button.addEventListener('click', handleCopy);
        });

        return () => {
            buttons.forEach(button => {
                button.removeEventListener('click', handleCopy);
            });
        };
    }, []);

    return null;
}

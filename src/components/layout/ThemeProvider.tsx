'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  const [mounted, setMounted] = React.useState(false);

  // Usamos useLayoutEffect para que el montaje sea lo más rápido posible 
  // antes de que el navegador pinte, pero useEffect también sirve.
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Si no está montado, renderizamos un div invisible o fragmento 
  // que no ejecute la lógica interna del Provider de Shiki/Themes
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  );
}
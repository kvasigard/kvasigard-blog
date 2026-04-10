export const dictionaries = {
    es: {
        notFound: "SYS_ERR: El componente solicitado no existe o no tiene traducción.",
        readTime: "min",
        readTimeLabel: "TIEMPO_LECTURA",
        date: "FECHA",
        series: "Sagas activas",
        articles: "Módulos",
        noSeries: "Sin información indexada en esta saga.",
        siteTitle: "KVASIGARD_SYS // Tech Blog",
        siteDesc: "Explorando la ingeniería inversa, desarrollo seguro y arquitectura de sistemas.",
        navArticles: "Artículos",
        navSeries: "Sagas",
        navAbout: "Sobre Mí",
        searchPlaceholder: "filtrar_por_título_tags_o_cves...",
        tableOfContents: "Índice de Contenidos",
        latestArticles: "Últimos Módulos",
        aboutTitle: "Sobre Mí",
        aboutDesc: "SYSTEM_IDENT: INVESTIGADOR // DESARROLLADOR",
        aboutBio: ".",
        contactTitle: "CANALES_COMUNICACIÓN",
        copy: "Copiar",
        copied: "¡Copiado!",
        datacenter: "CENTRO_DATOS",
        pktSize: "TAM_PAQUETE",
        sagaPrefix: "SAGA",
        modulesLoaded: "MÓDULOS CARGADOS"
    },
    en: {
        notFound: "SYS_ERR: The requested component does not exist or lacks translation.",
        readTime: "min",
        readTimeLabel: "READ_TIME",
        date: "DATE",
        series: "Active Sagas",
        articles: "Modules",
        noSeries: "No indexed information in this saga.",
        siteTitle: "KVASIGARD_SYS // Tech Blog",
        siteDesc: "Exploring reverse engineering, secure development, and systems architecture.",
        navArticles: "Articles",
        navSeries: "Sagas",
        navAbout: "About Me",
        searchPlaceholder: "filter_by_title_tags_or_cves...",
        tableOfContents: "Table of Contents",
        latestArticles: "Latest Modules",
        aboutTitle: "About Me",
        aboutDesc: "SYSTEM_IDENT: RESEARCHER // DEVELOPER",
        aboutBio: ".",
        contactTitle: "COMMUNICATION_CHANNELS",
        copy: "Copy",
        copied: "Copied!",
        datacenter: "DATACENTER",
        pktSize: "PKT_SIZE",
        sagaPrefix: "SAGA",
        modulesLoaded: "MODULES LOADED"
    }
} as const;

export type Locale = keyof typeof dictionaries;

export function getDictionary(lang: Locale | string) {
    if (lang in dictionaries) return dictionaries[lang as Locale];
    return dictionaries.es;
}

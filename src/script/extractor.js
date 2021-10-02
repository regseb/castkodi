// Mettre le code dans un bloc pour que les variables sont détruites à la fin et
// qu'il n'y ait pas de problème de re-déclaration de variables constantes si ce
// script est exécuté plusieurs fois.
{
    const SELECTORS = [
        "video source", "video", "audio source", "audio",
    ];

    const media = SELECTORS.map((s) => `${s}[src]:not([src=""])` +
                                                `:not([src^="blob:"])`)
                           .map((s) => document.querySelectorAll(s))
                           .flatMap((l) => Array.from(l))
                           .shift();

    // Retourner l'éventuelle source d'une vidéo ou d'une musique, qui sera
    // récupérée par le code ayant appelé browser.tabs.executeScript().
    // eslint-disable-next-line max-len
    // eslint-disable-next-line no-unused-expressions, @babel/no-unused-expressions
    media?.src;
}

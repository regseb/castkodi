/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

// La méthode navigator.clipboard.readText() (pour lire dans le presse-papier)
// ne fonctionne pas dans Chromium car la permission "clipboardRead" s'applique
// seulement à document.execCommand("paste"). https://crbug.com/1425583
// https://crbug.com/1063219 (ce bogue n'est plus accessible)
const { name } = await browser.runtime.getBrowserInfo();
if ("Chromium" === name) {
    navigator.clipboard.readText = () => {
        return new Promise((resolve) => {
            const listener = (event) => {
                event.preventDefault();
                document.removeEventListener("paste", listener);
                resolve(event.clipboardData.getData("text"));
            };

            document.addEventListener("paste", listener);
            document.execCommand("paste");
        });
    };
}

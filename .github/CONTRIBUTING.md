# Contribuer à Cast Kodi

Cette documentation vous guide pour contribuer au projet Cast Kodi.

## Pré-requis

Les outils suivants sont nécessaires pour utiliser ce projet :

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/) et
  [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

## Installation

- [Dupliquez](https://docs.github.com/get-started/quickstart/fork-a-repo)
  (_forker_) le dépôt [`castkodi`](https://github.com/regseb/castkodi).
- Clonez votre dépôt dupliqué :
  `git clone https://github.com/YOUR-USERNAME/castkodi.git`
- Déplacez-vous dans le répertoire du projet : `cd castkodi`
- Installez les dépendances : `npm ci`

## Développement

### Scraper

- Créez un fichier dans le répertoire `src/core/scraper/`
- Implémentez votre scraper pour un site Internet dans ce fichier.
- Importez votre fichier dans `src/core/scrapers.js` et ajoutez le dans la liste
  `SCRAPERS`
- Ajoutez le nouveau site supporté dans le `README` et dans les fichiers
  `locales/*/description.md`
- Écrivez des tests unitaires dans `test/unit/core/scraper/` et des tests
  d'intégration dans `test/integration/scraper/`

## Déploiement

Vous pouvez installer l'extension dans les navigateurs avec les commandes
suivantes :

- `npm run start:chromium` : déployer l'extension dans Chromium.
- `npm run start:firefox` : déployer l'extension dans Firefox.
<!-- Le déploiement ne fonctionne pas avec la version Snap de Firefox.
     https://github.com/mozilla/web-ext/issues/1696 -->
- `npm run start:firefox-android` : déployer l'extension dans Firefox sous
  Android. Il faut ajouter l'option
  [`--adb-device XXX`](https://extensionworkshop.com/documentation/develop/web-ext-command-reference/#adb-device)
  (cf.
  [_Developing extensions for Firefox for Android_](https://extensionworkshop.com/documentation/develop/developing-extensions-for-firefox-for-android/)).

Vous pouvez aussi installer manuellement l'extension :

- [_Load an unpacked extension_ in Chrome](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked).
- [_Sideload an extension to install and test it locally_ in Edge](https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/getting-started/extension-sideloading)
- [_Temporary installation in Firefox_](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/).

## Qualité

Pour vérifier la qualité de votre développement, trois commandes sont
disponibles :

- `npm run lint` : exécuter les linters (avec
  [Metalint](https://github.com/regseb/metalint)) pour faire une analyse
  statique du code source.
- `npm run lint:fix` : exécuter les linters et corriger certains problèmes (dont
  le formatage).
- `npm run lint:types` : vérifier les types avec
  [TypeScript](https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html)
  (et la JSDoc).

## Tests

Deux types de tests sont exécutables : les tests unitaires et les tests
d'intégration.

- `npm run test:unit` : lancer les tests unitaires (avec
  [Mocha](https://mochajs.org/)).
- `npm run test:unit -- --grep foo` : lancer seulement les tests unitaires dont
  leur titre contient `foo` (par exemple :
  `npm run test:unit -- --grep core/scraper/twitch.js`).
- `npm run test:coverage` : calculer la couverture des tests unitaires (avec
  [Stryker Mutator](https://stryker-mutator.io/)).
- `npm run test:integration` : lancer les tests d'intégration.
- `npm run test:integration -- --grep foo` : lancer seulement les tests
  d'intégration dont leur titre contient `foo` (par exemple :
  `npm run test:integration -- --grep YouTube`).

## Commit

Le message de commit doit suivre la spécification des
[Commits Conventionnels](https://www.conventionalcommits.org/en/v1.0.0/).

## Traduction

Les traductions dans les différentes langues se font avec
[Weblate](https://hosted.weblate.org/engage/castkodi/).

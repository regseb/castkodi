# Cast Kodi

[![chrome add-on][img-chrome_add-on]][link-chrome_add-on]
[![firefox add-on][img-firefox_add-on]][link-firefox_add-on]
[![build][img-build]][link-build]
[![coverage][img-coverage]][link-coverage]
[![chrome rating][img-chrome_rating]][link-chrome_rating]
[![firefox rating][img-firefox_rating]][link-firefox_rating]

> WebExtension pour diffuser des vidéos et des musiques sur Kodi.

## Description

Cast Kodi est une extension pour les navigateurs Chromium (Chrome, Edge, Opera)
et Firefox. Elle permet de diffuser des vidéos et des musiques sur **Kodi** :

- liens directs : _avi_, _mkv_, _mp3_, _flac_… et torrent / magnet ;
- YouTube, Twitch, Vimeo, SoundCloud ainsi que Ace Stream, Apple Podcasts,
  Bigo Live, BitChute, Blog Talk Radio, Castbox, Dailymotion, DevTube, Facebook,
  Flickr, Instagram, ItemFix, Jamendo, Megaphone, Mixcloud, Odysee, Overcast,
  PeerTube, Pippa, podCloud, Pokémon TV, Radio, Radioline, Steam, Streamable,
  TikTok, Ultimedia, Veoh, VideoPress, VideosHub, Vidyard, Viously ;
  - 🇩🇪 Allemagne : ARD Mediathek, Arte, ZDF ;
  - 🇧🇪 Belgique : GoPlay, VRT NU, VTM GO ;
  - 🇺🇸 États-Unis : KCAA Radio ;
  - 🇫🇷 France : 20 Minutes, AlloCiné, Arte, Arte Radio, France Inter, Futura
    Sciences, Gamekult, JV, Konbini, Le Monde, Le Point, L'Internaute, Melty,
    Ouest-France ;
  - 🇬🇷 Grèce : StarGR ;
  - 🇮🇷 Iran : آپارات ;
  - 🇮🇸 Islande : Útvarp Saga ;
  - 🇳🇱 Pays-Bas : Dumpert ;
  - 🇬🇧 Royaume-Uni : Daily Mail, The Guardian ;
  - 🇷🇺 Russie : Первый канал ;
  - 🇨🇭 Suisse : Play SRF.

Cast Kodi analyse aussi les pages pour y trouver des vidéos, de la musique ou
des intégrations de plateformes externes. Par exemple, si une page affiche une
vidéo YouTube, cette vidéo sera envoyée à Kodi.

Pour diffuser les vidéos / musiques, trois options peuvent être ajoutées dans le
menu contextuel des liens / pages / sélections de vidéos ou de musiques : _Lire
maintenant avec Kodi_, _Lire ensuite avec Kodi_ et _Placer en file d'attente de
Kodi_. Une télécommande (accessible depuis un bouton de la barre d'outils) est
aussi présente pour diffuser l'onglet courant sur Kodi et pour : mettre en
pause, passer au prochain élément, régler le volume, consulter la liste de
lecture…

## Installation

L'extension est disponible sur [**Chrome Web Store**][link-chrome_add-on] (pour
Chromium, Chrome, Edge et Opera) ainsi que sur [**Firefox Browser
Add-ons**][link-firefox_add-on].

Dans Kodi, il faut _Autoriser le contrôle à distance par des programmes sur
d'autres systèmes_. Ce réglage se fait dans la page _Paramètres_ / _Services_ /
_Contrôle_.

Vous devez ensuite configurer les _Préférences_ de Cast Kodi en copiant
l'_Adresse_ IP du serveur hébergeant Kodi ; cette information est disponible
dans la page _Paramètres_ / _Infos sur le système_ / _Résumé_.

[img-chrome_add-on]:https://img.shields.io/chrome-web-store/v/gojlijimdlgjlliggedhakpefimkedmb?label=add-on&logo=googlechrome&logoColor=white
[img-firefox_add-on]:https://img.shields.io/amo/v/castkodi.svg?label=add-on&logo=firefox-browser&logoColor=white
[img-build]:https://img.shields.io/github/workflow/status/regseb/castkodi/CI
[img-coverage]:https://img.shields.io/coveralls/github/regseb/castkodi
[img-chrome_rating]:https://img.shields.io/chrome-web-store/stars/gojlijimdlgjlliggedhakpefimkedmb?label=rating&logo=googlechrome&logoColor=white
[img-firefox_rating]:https://img.shields.io/amo/stars/castkodi.svg?label=rating&logo=firefox-browser&logoColor=white

[link-chrome_add-on]:https://chrome.google.com/webstore/detail/cast-kodi/gojlijimdlgjlliggedhakpefimkedmb
[link-firefox_add-on]:https://addons.mozilla.org/addon/castkodi/
[link-build]:https://github.com/regseb/castkodi/actions/workflows/ci.yml?query=branch%3Amain
[link-coverage]:https://coveralls.io/github/regseb/castkodi
[link-chrome_rating]:https://chrome.google.com/webstore/detail/cast-kodi/gojlijimdlgjlliggedhakpefimkedmb/reviews
[link-firefox_rating]:https://addons.mozilla.org/addon/castkodi/reviews/

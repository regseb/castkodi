# Cast Kodi

[![firefox add-on][img-firefox_add-on]][link-firefox_add-on]
[![build][img-build]][link-build]
[![coverage][img-coverage]][link-coverage]
[![rating][img-rating]][link-rating]

> WebExtension pour diffuser des vidéos et des musiques sur Kodi.

## Description

Cast Kodi est une extension pour le navigateur Firefox. Elle permet de diffuser
des vidéos et des musiques sur **Kodi** :

- liens directs : *avi*, *mkv*, *mp3*, *flac*… et torrent / magnet ;
- YouTube, Twitch, Vimeo, SoundCloud ainsi que Ace Stream, Apple Podcasts,
  Bigo Live, BitChute, Blog Talk Radio, Castbox, Dailymotion, DevTube, Facebook,
  Flickr, Instagram, Jamendo, LBRY, LiveLeak, Megaphone, Metacafe, Mixcloud,
  My Cloud Player, Overcast, PeerTube, Pippa, podCloud, Pokémon TV, Radio,
  Radioline, Steam, Streamable, TikTok, Ultimedia, Veoh, VideoPress, Viously ;
  - Allemagne : Arte ;
  - Belgique : VRT NU, VTM GO ;
  - États-Unis : KCAA Radio ;
  - France : 20 Minutes, AlloCiné, Arte, Arte Radio, France Inter, Futura
    Sciences, Gamekult, JeuxVideoCom, Konbini, Le Point, L'Internaute, Melty,
    Ouest-France ;
  - Iran : آپارات ;
  - Islande : Útvarp Saga ;
  - Pays-Bas : Dumpert ;
  - Royaume-Uni : Daily Mail, The Guardian ;
  - Russie : Первый канал.

Cast Kodi analyse aussi les pages pour y trouver des vidéos, de la musique ou
des intégrations de plateformes externes. Par exemple, si une page affiche une
vidéo YouTube, cette vidéo sera envoyée à Kodi.

Pour diffuser les vidéos / musiques, trois options peuvent être ajoutées dans le
menu contextuel des liens / pages / sélections de vidéos ou de musiques : *Lire
maintenant avec Kodi*, *Lire ensuite avec Kodi* et *Place en file d'attente de
Kodi*. Une télécommande (accessible depuis un bouton de la barre d'outils) est
aussi présente pour diffuser l'onglet courant sur Kodi et pour : mettre en
pause, passer au prochain élément, régler le volume, consulter la liste de
lecture…

## Installation

L'extension est disponible sur
**[Firefox Browser Add-ons](https://addons.mozilla.org/addon/castkodi/)**.

Dans Kodi, il faut *Autoriser le contrôle à distance par des programmes sur
d'autres systèmes*. Ce réglage se fait dans la page *Paramètres* / *Services* /
*Contrôle*.

Vous devez ensuite configurer les *Préférences* de Cast Kodi en copiant
l'*Adresse* IP du serveur hébergeant Kodi ; cette information est disponible
dans la page *Paramètres* / *Infos sur le système* / *Résumé*.

[img-firefox_add-on]:https://img.shields.io/amo/v/castkodi.svg?label=add-on&logo=firefox-browser&logoColor=white
[img-build]:https://img.shields.io/github/workflow/status/regseb/castkodi/CI
[img-coverage]:https://img.shields.io/coveralls/github/regseb/castkodi
[img-rating]:https://img.shields.io/amo/stars/castkodi.svg?label=rating

[link-firefox_add-on]:https://addons.mozilla.org/addon/castkodi/
[link-build]:https://github.com/regseb/castkodi/actions?query=workflow%3ACI+branch%3Amaster
[link-coverage]:https://coveralls.io/github/regseb/castkodi
[link-rating]:https://addons.mozilla.org/addon/castkodi/reviews/

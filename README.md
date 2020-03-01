# Cast Kodi

[![build][img-build]][link-build]
[![coverage][img-coverage]][link-coverage]
[![mozilla add-on][img-mozilla-add-on]][link-mozilla-add-on]
[![stars][img-stars]][link-stars]
[![license][img-license]][link-license]

> WebExtension pour diffuser des vidéos et des musiques sur Kodi.

## Description

Cast Kodi est une extension pour le navigateur Firefox. Elle permet de diffuser
des vidéos et des musiques sur **Kodi** :

- liens directs : *avi*, *mkv*, *mp3*, *flac*… et torrent / magnet ;
- YouTube, Twitch, Vimeo, SoundCloud ainsi que Ace Stream, Apple Podcasts,
  BitChute, Blog Talk Radio, Dailymotion, DevTube, Facebook, Flickr, Full30,
  Instagram, Jamendo, LiveLeak, Mixcloud, Mixer, My Cloud Player, Overcast,
  PeerTube, Pippa, podCloud, PodMust, Radio, Radioline, Steam, Streamable,
  TikTok, Ultimedia, Veoh, YT Home ;
  - Allemagne : Arte ;
  - Belgique : VRT NU ;
  - États-Unis : KCAA Radio ;
  - France : 20 Minutes, AlloCiné, Arte, Arte Radio, France Inter, Gamekult,
    JeuxVideoCom, Konbini, Le Point, Melty, Ouest-France ;
  - Islande : Útvarp Saga ;
  - Pays-Bas : Dumpert ;
  - Russie : Первый канал, StormoTV.

Cast Kodi analyse aussi les pages pour y trouver des vidéos, de la musique ou
des intégrations de plateformes externes. Par exemple, si une page affiche une
vidéo YouTube, cette vidéo sera envoyée à Kodi.

Pour diffuser les vidéos / musiques, trois options peuvent être ajoutées dans le
menu contextuel des liens / pages / sélections de vidéos ou de musiques : *Lire
maintenant avec Kodi*, *Lire ensuite avec Kodi* et *Place en file d'attente de
Kodi*. Une télécommande (accessible depuis un bouton de la barre d'outils) est
aussi présente pour diffuser l'onglet courant sur Kodi et pour : mettre en
pause, passer au prochain élément, régler le volume…

## Installation

L'extension est disponible sur le
**[Firefox Add-ons](https://addons.mozilla.org/addon/castkodi/)**.

Dans Kodi, il faut *Autoriser le contrôle à distance par des programmes sur
d'autres systèmes*. Ce réglage se fait dans la page *Paramètres* / *Services* /
*Contrôle*.

Vous devez ensuite configurer les *Préférences* de Cast Kodi en copiant
l'*Adresse IP* du serveur hébergeant Kodi ; cette information est disponible
dans la page *Paramètres* / *Infos sur le système* / *Résumé*.

## Licence

L'extension est publiée sous la [licence publique de l’Union européenne - EUPL
v1.2](https://joinup.ec.europa.eu/collection/eupl/eupl-text-11-12).

[img-build]:https://img.shields.io/github/workflow/status/regseb/castkodi/CI
[img-coverage]:https://img.shields.io/coveralls/github/regseb/castkodi
[img-mozilla-add-on]:https://img.shields.io/amo/v/castkodi.svg
[img-stars]:https://img.shields.io/amo/stars/castkodi.svg
[img-license]:https://img.shields.io/badge/license-EUPL-blue.svg

[link-build]:https://github.com/regseb/castkodi/actions?query=workflow%3ACI
[link-coverage]:https://coveralls.io/github/regseb/castkodi
[link-mozilla-add-on]:https://addons.mozilla.org/addon/castkodi/
[link-stars]:https://addons.mozilla.org/addon/castkodi/reviews/
[link-license]:https://joinup.ec.europa.eu/collection/eupl/eupl-text-11-12
               "Licence publique de l’Union européenne"

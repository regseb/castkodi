# Cast Kodi

[![Version][img-version]][link-version]
[![Dependencies][img-dependencies]][link-dependencies]
[![Coverage][img-coverage]][link-coverage]
[![License][img-license]][link-license]

> WebExtension pour diffuser des vidéos et musiques sur Kodi.

## Description

Cast Kodi est une extension pour le navigateur Firefox. Elle permet de diffuser
sur **Kodi** :

- des vidéos : liens directs (*avi*, *mkv*, ...), YouTube, Facebook, Twitch,
  Vimeo, Dailymotion, CollegeHumor, Air Mozilla et Dumpert ;
- des musiques : liens directs (*mp3*, *flac*, ...) et SoundCloud.

Une nouvelle option « *Diffuser sur Kodi* » est ajoutée dans le menu contextuel
des liens / pages / sélections de vidéos ou de musiques. Puis deux choix sont
disponibles : *Lire* le média ou le *Placer en file d'attente*.

## Installation

L'extension est disponible sur le
**[Mozilla Add-ons](https://addons.mozilla.org/fr/firefox/addon/castkodi/)**.

Dans Kodi, il faut *Autoriser le contrôle à distance via HTTP*. Ce réglage se
fait dans la page *Paramètres* / *Services* / *Contrôle*.

Vous devez ensuite configurer les *Préférences* de Cast Kodi en copiant les
valeurs renseignées dans Kodi : le *Port* et éventuellement le *Nom
d'utilisateur* et le *Mot de passe*. Il faut fournir l'*Adresse IP* du serveur
hébergeant Kodi ; cette information est disponible dans la page *Paramètres* /
*Infos sur le système* / *Résumé*.

Pour lire les vidéos / musiques hébergées sur des plateformes, il faut installer
les extensions
[YouTube](https://kodi.tv/addon/plugins-video-add-ons/youtube),
[Twitch](https://kodi.tv/addon/plugins-video-add-ons/twitch),
[Vimeo](https://kodi.tv/addon/plugins-video-add-ons/vimeo),
[DailyMotion.com](https://kodi.tv/addon/plugins-video-add-ons/dailymotioncom),
[CollegeHumor](https://kodi.tv/addon/plugins-video-add-ons/collegehumor),
[Dumpert](https://kodi.tv/addon/plugins-video-add-ons/dumpert) ou
[SoundCloud](https://kodi.tv/addon/music-add-ons-plugins/soundcloud) dans Kodi.

## Licence

L'extension est publiée sous la [licence publique de l’Union européenne - EUPL
v1.2](https://joinup.ec.europa.eu/page/eupl-text-11-12).

[img-version]:https://img.shields.io/amo/v/castkodi.svg
[img-dependencies]:https://img.shields.io/david/regseb/castkodi.svg
[img-coverage]:https://img.shields.io/coveralls/regseb/castkodi.svg
[img-license]:https://img.shields.io/badge/license-EUPL-blue.svg

[link-version]:https://addons.mozilla.org/fr/firefox/addon/castkodi/
[link-dependencies]:https://david-dm.org/regseb/castkodi
[link-coverage]:https://coveralls.io/github/regseb/castkodi
[link-license]:https://joinup.ec.europa.eu/page/eupl-text-11-12
               "Licence Publique de l’Union européenne"

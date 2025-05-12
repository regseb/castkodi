# Cast Kodi

<!-- Utiliser du HTML (avec l'attribut "align" obsolète) pour faire flotter
     l'image à droite. -->
<!-- markdownlint-disable-next-line no-inline-html-->
<img src="src/img/icon.svg" align="right" alt="">

<!-- Ne pas afficher de badge pour le Microsoft Edge Add-ons, car Shields.io ne
     le supporte pas. https://github.com/badges/shields/issues/4690 -->

[![chrome][img-chrome]][link-chrome] [![firefox][img-firefox]][link-firefox]
[![build][img-build]][link-build] [![coverage][img-coverage]][link-coverage]

> WebExtension pour diffuser des vidéos et des musiques sur Kodi.

## Description

Cast Kodi est une extension pour les navigateurs Chrome, Chromium, Edge et
Firefox. Elle permet de diffuser des vidéos et des musiques sur **Kodi** :

- liens directs : _avi_, _mkv_, _mp3_, _flac_… et torrent / magnet ;
- YouTube, Twitch, Vimeo, SoundCloud ainsi que Acast, Ace Stream, Apple
  Podcasts, Ausha, Bigo Live, BitChute, Castbox, Dailymotion, DevTube, Facebook,
  Flickr, Instagram, ItemFix, Jamendo, Kick, Kickstarter, Mastodon, Megaphone,
  Mixcloud, Odysee, Overcast, PeerTube, Podcast Addict, podCloud, Prime Video
  (Amazon), Reddit, Rumble, Steam, Streamable, TikTok, Ultimedia, Uqload,
  VideoPress, VidLii, Vidyard, Viously, Vudeo ;
  - 🇩🇪 Allemagne : Arte, Chaos Computer Club, DMAX, ZDF ;
  - 🇧🇪 Belgique : GoPlay, VRT NU, VTM GO ;
  - 🇨🇦 Canada : CBC Listen ;
  - 🇺🇸 États-Unis : KCAA Radio ;
  - 🇫🇷 France : 20 Minutes, AlloCiné, Arte, Arte Radio, France Inter, Futura
    Sciences, Gamekult, JV, Konbini, Le Monde, Le Point, L'Internaute, Melty,
    Ouest-France ;
  - 🇬🇷 Grèce : StarGR ;
  - 🇮🇷 Iran : آپارات<!-- Aparat --> ;
  - 🇮🇸 Islande : Útvarp Saga ;
  - 🇳🇱 Pays-Bas : Dumpert ;
  - 🇬🇧 Royaume-Uni : Daily Mail, The Guardian ;
  - 🇷🇺 Russie : OK ;
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

L'extension est disponible sur le [**Chrome Web Store**][link-chrome], le
[**Firefox Browser Add-ons**][link-firefox] et le [**Microsoft Edge
Add-ons**][link-edge].

Pour connecter l'extension à Kodi, vous devez _Autoriser le contrôle à distance
par des programmes sur d'autres systèmes_. Ce réglage se fait dans Kodi à la
page _Paramètres_ / _Services_ / _Contrôle_. Vous devez aussi récupérer
l'_Adresse IP_ de Kodi. Cette information est affichée dans la page _Paramètres_
/ _Infos sur le système_ / _Résumé_. Puis renseignez cette adresse IP dans les
_Options_ de Cast Kodi.

Pour certains sites Internet, les add-ons suivants sont nécessaires dans Kodi :
[Amazon VOD](https://github.com/Sandmann79/xbmc),
[Dailymotion](https://kodi.tv/addons/omega/plugin.video.dailymotion_com/),
[Elementum](https://github.com/elgatito/plugin.video.elementum),
[Mixcloud](https://kodi.tv/addons/omega/plugin.audio.mixcloud/),
[Plexus](https://github.com/enen92/program.plexus),
[SendToKodi](https://github.com/firsttris/plugin.video.sendtokodi),
[SoundCloud](https://kodi.tv/addons/omega/plugin.audio.soundcloud/),
[Tubed](https://kodi.tv/addons/omega/plugin.video.tubed/),
[Twitch](https://kodi.tv/addons/omega/plugin.video.twitch/),
[Vimeo](https://kodi.tv/addons/omega/plugin.video.vimeo/),
[VRT MAX](https://kodi.tv/addons/omega/plugin.video.vrt.nu/),
[VTM GO](https://kodi.tv/addons/omega/plugin.video.vtm.go/),
[YouTube](https://kodi.tv/addons/omega/plugin.video.youtube/).

## Contribution

Si vous souhaitez contribuer à Cast Kodi, consultez le fichier
[CONTRIBUTING.md](.github/CONTRIBUTING.md) pour avoir plus d'informations.

[img-chrome]:
  https://img.shields.io/chrome-web-store/stars/gojlijimdlgjlliggedhakpefimkedmb?label=chrome&logo=googlechrome&logoColor=whitesmoke
[img-firefox]:
  https://img.shields.io/amo/stars/castkodi.svg?label=firefox&logo=firefox-browser&logoColor=whitesmoke
[img-build]:
  https://img.shields.io/github/actions/workflow/status/regseb/castkodi/ci.yml?branch=main&logo=github&logoColor=whitesmoke
[img-coverage]:
  https://img.shields.io/endpoint?label=coverage&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fregseb%2Fcastkodi%2Fmain
[link-chrome]:
  https://chromewebstore.google.com/detail/cast-kodi/gojlijimdlgjlliggedhakpefimkedmb
[link-edge]:
  https://microsoftedge.microsoft.com/addons/detail/cast-kodi/jaodccnfhodnbdibkmlhogdephdlkkgh
[link-firefox]: https://addons.mozilla.org/addon/castkodi/
[link-build]:
  https://github.com/regseb/castkodi/actions/workflows/ci.yml?query=branch%3Amain
[link-coverage]:
  https://dashboard.stryker-mutator.io/reports/github.com/regseb/castkodi/main

# Cast Kodi

<!-- Utiliser du HTML (avec l'attribut "align" obsolète) pour faire flotter
     l'image à droite. -->
<!-- markdownlint-disable-next-line no-inline-html -->
<img src="src/img/icon.svg" align="right" width="100" height="100" alt="">

[![chrome][img-chrome]][link-chrome] [![firefox][img-firefox]][link-firefox]
[![edge][img-edge]][link-edge] [![build][img-build]][link-build]
[![coverage][img-coverage]][link-coverage]

> WebExtension pour diffuser des vidéos et des musiques sur Kodi.

## Description

Cast Kodi est une extension pour les navigateurs Chrome, Chromium, Edge et
Firefox. Elle permet de diffuser des vidéos et des musiques sur **Kodi** :

- liens directs : _avi_, _mkv_, _mp3_, _flac_… et torrent / magnet ;
- YouTube, Twitch, Vimeo, SoundCloud ainsi que Acast, Ace Stream, Apple
  Podcasts, Ausha, Bigo Live, BitChute, Castbox, Dailymotion, DevTube, Facebook,
  Flickr, Instagram, Invidious, ItemFix, Jamendo, Kick, Mastodon, Megaphone,
  Mixcloud, Odysee, Overcast, PeerTube, Podcast Addict, podCloud, Prime Video
  (Amazon), Reddit, Rumble, Steam, Streamable, TikTok, Ultimedia, Uqload,
  VideoPress, VidLii, Vidyard, Viously ;
  - 🇩🇪 Allemagne : Arte, Chaos Computer Club, DMAX, ZDF ;
  - 🇧🇪 Belgique : GoPlay, VRT NU, VTM GO ;
  - 🇨🇦 Canada : CBC Listen ;
  - 🇺🇸 États-Unis : KCAA Radio ;
  - 🇫🇷 France : 20 Minutes, AlloCiné, Arte, Arte Radio, France Inter, Futura
    Sciences, Gamekult, JV, Konbini, Le Monde, Le Point, L'Internaute,
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
[Invidious](https://github.com/lekma/plugin.video.invidious),
[Mixcloud](https://kodi.tv/addons/omega/plugin.audio.mixcloud/),
[Piped](https://kodi.tv/addons/omega/plugin.video.piped/),
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
  https://img.shields.io/chrome-web-store/users/gojlijimdlgjlliggedhakpefimkedmb?style=flat-square&label=chrome&logo=googlechrome&logoColor=whitesmoke&color=blue
[img-firefox]:
  https://img.shields.io/amo/users/castkodi?style=flat-square&label=firefox&logo=firefox-browser&logoColor=whitesmoke

<!-- Créer le badge manuellement, car Shields.io ne gère pas encore le Microsoft
     Edge Add-ons. https://github.com/badges/shields/issues/4690
     Mettre le contenu du logo, car Microsoft refuse l'ajout de ses logos dans
     Simple Icons. https://github.com/simple-icons/simple-icons/issues/11236 -->

[img-edge]:
  https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Fjaodccnfhodnbdibkmlhogdephdlkkgh&query=%24.activeInstallCount&style=flat-square&label=edge&logo=data:image/svg%2bxml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIxLjg2IDE3Ljg2cS4xNCAwIC4yNS4xMi4xLjEzLjEuMjV0LS4xMS4zM2wtLjMyLjQ2LS40My41My0uNDQuNXEtLjIxLjI1LS4zOC40MmwtLjIyLjIzcS0uNTguNTMtMS4zNCAxLjA0LS43Ni41MS0xLjYuOTEtLjg2LjQtMS43NC42NHQtMS42Ny4yNHEtLjkgMC0xLjY5LS4yOC0uOC0uMjgtMS40OC0uNzgtLjY4LS41LTEuMjItMS4xNy0uNTMtLjY2LS45Mi0xLjQ0LS4zOC0uNzctLjU4LTEuNi0uMi0uODMtLjItMS42NyAwLTEgLjMyLTEuOTYuMzMtLjk3Ljg3LTEuOC4xNC45NS41NSAxLjc3LjQxLjgyIDEuMDIgMS41LjYuNjggMS4zOCAxLjIxLjc4LjU0IDEuNjQuOS44Ni4zNiAxLjc3LjU2LjkyLjIgMS44LjIgMS4xMiAwIDIuMTgtLjI0IDEuMDYtLjIzIDIuMDYtLjcybC4yLS4xLjItLjA1em0tMTUuNS0xLjI3cTAgMS4xLjI3IDIuMTUuMjcgMS4wNi43OCAyLjAzLjUxLjk2IDEuMjQgMS43Ny43NC44MiAxLjY2IDEuNC0xLjQ3LS4yLTIuOC0uNzQtMS4zMy0uNTUtMi40OC0xLjM3LTEuMTUtLjgzLTIuMDgtMS45LS45Mi0xLjA3LTEuNTgtMi4zM1QuMzYgMTQuOTRRMCAxMy41NCAwIDEyLjA2cTAtLjgxLjMyLTEuNDkuMzEtLjY4LjgzLTEuMjMuNTMtLjU1IDEuMi0uOTYuNjYtLjQgMS4zNS0uNjYuNzQtLjI3IDEuNS0uMzkuNzgtLjEyIDEuNTUtLjEyLjcgMCAxLjQyLjEuNzIuMTIgMS40LjM1LjY4LjIzIDEuMzIuNTcuNjMuMzUgMS4xNi44My0uMzUgMC0uNy4wNy0uMzMuMDctLjY1LjIzdi0uMDJxLS42My4yOC0xLjIuNzQtLjU3LjQ2LTEuMDUgMS4wNC0uNDguNTgtLjg3IDEuMjYtLjM4LjY3LS42NSAxLjM5LS4yNy43MS0uNDIgMS40NC0uMTUuNzItLjE1IDEuMzh6TTExLjk2LjA2cTEuNyAwIDMuMzMuMzkgMS42My4zOCAzLjA3IDEuMTUgMS40My43NyAyLjYyIDEuOTMgMS4xOCAxLjE2IDEuOTggMi43LjQ5Ljk0Ljc2IDEuOTYuMjggMSAuMjggMi4wOCAwIC44OS0uMjMgMS43LS4yNC44LS42OSAxLjQ4LS40NS42OC0xLjEgMS4yMi0uNjQuNTMtMS40NS44OC0uNTQuMjQtMS4xMS4zNi0uNTguMTMtMS4xNi4xMy0uNDIgMC0uOTctLjAzLS41NC0uMDMtMS4xLS4xMi0uNTUtLjEtMS4wNS0uMjgtLjUtLjE5LS44NC0uNS0uMTItLjA5LS4yMy0uMjQtLjEtLjE2LS4xLS4zMyAwLS4xNS4xNi0uMzUuMTYtLjIuMzUtLjUuMi0uMjguMzYtLjY4LjE2LS40LjE2LS45NSAwLTEuMDYtLjQtMS45Ni0uNC0uOTEtMS4wNi0xLjY0LS42Ni0uNzQtMS41Mi0xLjI4LS44Ni0uNTUtMS43OS0uODktLjg0LS4zLTEuNzItLjQ0LS44Ny0uMTQtMS43Ni0uMTQtMS41NSAwLTMuMDYuNDVULjk0IDcuNTVxLjcxLTEuNzQgMS44MS0zLjEzIDEuMS0xLjM4IDIuNTItMi4zNVE2LjY4IDEuMSA4LjM3LjU4cTEuNy0uNTIgMy41OC0uNTJaIiBmaWxsPSJ3aGl0ZXNtb2tlIi8+PC9zdmc+
[img-build]:
  https://img.shields.io/github/actions/workflow/status/regseb/castkodi/ci.yml?branch=main&style=flat-square&logo=github&logoColor=whitesmoke
[img-coverage]:
  https://img.shields.io/endpoint?url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fregseb%2Fcastkodi%2Fmain&style=flat-square&label=coverage
[link-chrome]:
  https://chromewebstore.google.com/detail/cast-kodi/gojlijimdlgjlliggedhakpefimkedmb
[link-firefox]: https://addons.mozilla.org/addon/castkodi/
[link-edge]:
  https://microsoftedge.microsoft.com/addons/detail/cast-kodi/jaodccnfhodnbdibkmlhogdephdlkkgh
[link-build]:
  https://github.com/regseb/castkodi/actions/workflows/ci.yml?query=branch%3Amain
[link-coverage]:
  https://dashboard.stryker-mutator.io/reports/github.com/regseb/castkodi/main

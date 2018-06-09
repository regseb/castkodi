/**
 * @module core/scraper/peertube
 */

import { PebkacError } from "../pebkac.js";

/**
 * La liste des instances de PeerTube.
 *
 * @constant {Array.<string>} INSTANCES
 * @see {@link https://instances.joinpeertube.org}
 */
const INSTANCES = [
    "coste.video",
    "exode.me",
    "facegirl.me",
    "fontube.fr",
    "framatube.org",
    "janny.moe",
    "jp.peertube.network",
    "media.zat.im",
    "medias.libox.fr",
    "megatube.lilomoino.fr",
    "meilleurtube.delire.party",
    "p-tube.h3z.jp",
    "peer.ecutsa.fr",
    "peer.hostux.social",
    "peertube.1312.media",
    "peertube.angristan.xyz",
    "peertube.cpy.re",
    "peertube.datagueule.tv",
    "peertube.dav.li",
    "peertube.devosi.org",
    "peertube.duckdns.org",
    "peertube.extremely.online",
    "peertube.gaialabs.ch",
    "peertube.geekael.fr",
    "peertube.geekshell.fr",
    "peertube.gegeweb.eu",
    "peertube.gwendalavir.eu",
    "peertube.heraut.eu",
    "peertube.inapurna.org",
    "peertube.koehn.com",
    "peertube.maly.io",
    "peertube.mastodon.host",
    "peertube.moe",
    "peertube.netzspielplatz.de",
    "peertube.nsa.ovh",
    "peertube.parleur.net",
    "peertube.pl",
    "peertube.public-infrastructure.eu",
    "peertube.qtg.fr",
    "peertube.solidev.net",
    "peertube.tamanoir.foucry.net",
    "peertube.tifox.fr",
    "peertube.touhoppai.moe",
    "peertube.valvin.fr",
    "peertube.video",
    "peertube.viviers-fibre.net",
    "peertube.walkingmountains.fr",
    "peertube.xyz",
    "peertube2.cpy.re",
    "peertube3.cpy.re",
    "pytu.be",
    "share.tube",
    "sikke.fi",
    "skeptikon.fr",
    "testtube.ortg.de",
    "thinkerview.video",
    "troll.tv",
    "tube.22decembre.eu",
    "tube.aquilenet.fr",
    "tube.bootlicker.party",
    "tube.conferences-gesticulees.net",
    "tube.homecomputing.fr",
    "tube.kher.nl",
    "tube.mochi.academy",
    "tube.opportunis.me",
    "tube.otter.sh",
    "tube.ouahpiti.info",
    "tube.p2p.legal",
    "tube.svnet.fr",
    "vid.leotindall.com",
    "video.anormallostpod.ovh",
    "video.atlanti.se",
    "video.blueline.mg",
    "video.colibris-outilslibres.org",
    "video.deadsuperhero.com",
    "video.g3l.org",
    "video.hispagatos.org",
    "video.lqdn.fr",
    "video.migennes.net",
    "video.passageenseine.fr",
    "video.tedomum.net",
    "videos.benpro.fr",
    "videos.cemea.org",
    "videos.cloudfrancois.fr",
    "videos.festivalparminous.org",
    "videos.iut-orsay.fr",
    "videos.lecygnenoir.info",
    "videos.symphonie-of-code.fr",
    "videos.tcit.fr",
    "vod.mochi.academy"
];

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map} rules
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
 *
 * @param {String} url L'URL d'une vidéo PeerTube.
 * @return {Promise} L'URL du <em>fichier</em>.
 */
rules.set([
    ...INSTANCES.map((i) => `*://${i}/videos/watch/*`),
    ...INSTANCES.map((i) => `*://${i}/videos/embed/*`)
], function (url) {
    const api = url.toString().replace(/^http:/i, "https:")
                              .replace("videos/watch", "api/v1/videos")
                              .replace("videos/embed", "api/v1/videos");
    return fetch(api).then(function (response) {
        return response.json();
    }).then(function (response) {
        if ("files" in response) {
            return response.files[0].fileUrl;
        }

        throw new PebkacError("noVideo", "PeerTube");
    });
});

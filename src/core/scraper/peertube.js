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
    "betamax.video",
    "coste.video",
    "dialup.express",
    "exode.me",
    "facegirl.me",
    "fontube.fr",
    "framatube.org",
    "janny.moe",
    "jp.peertube.network",
    "media.krashboyz.org",
    "media.zat.im",
    "medias.libox.fr",
    "megatube.lilomoino.fr",
    "meilleurtube.delire.party",
    "pe.ertu.be",
    "peer.ecutsa.fr",
    "peer.hostux.social",
    "peer.tube",
    "peertube.0xf.org",
    "peertube.1312.media",
    "peertube.angristan.xyz",
    "peertube.azkware.net",
    "peertube.bambuch.cz",
    "peertube.cat",
    "peertube.cpy.re",
    "peertube.d1n0.link",
    "peertube.datagueule.tv",
    "peertube.devosi.org",
    "peertube.duckdns.org",
    "peertube.firewall-sec.com",
    "peertube.fs0c137y.com",
    "peertube.gaialabs.ch",
    "peertube.geekael.fr",
    "peertube.geekshell.fr",
    "peertube.gegeweb.eu",
    "peertube.gwendalavir.eu",
    "peertube.heberge.fr",
    "peertube.heraut.eu",
    "peertube.inapurna.org",
    "peertube.maly.io",
    "peertube.mastodon.host",
    "peertube.mes-courriers.fr",
    "peertube.mindpalace.io",
    "peertube.moe",
    "peertube.netzspielplatz.de",
    "peertube.nogafa.org",
    "peertube.nsa.ovh",
    "peertube.openstreetmap.fr",
    "peertube.parleur.net",
    "peertube.peshane.net",
    "peertube.pl",
    "peertube.pretex.space",
    "peertube.public-infrastructure.eu",
    "peertube.qtg.fr",
    "peertube.r79.io",
    "peertube.snargol.com",
    "peertube.social",
    "peertube.solidev.net",
    "peertube.tamanoir.foucry.net",
    "peertube.teleassist.fr",
    "peertube.tifox.fr",
    "peertube.touhoppai.moe",
    "peertube.valvin.fr",
    "peertube.video",
    "peertube.viviers-fibre.net",
    "peertube.waifus.eu",
    "peertube.walkingmountains.fr",
    "peertube.xyz",
    "peertube2.cpy.re",
    "peertube3.cpy.re",
    "pytu.be",
    "queertube.org",
    "share.tube",
    "sikke.fi",
    "skeptikon.fr",
    "thinkerview.video",
    "troll.tv",
    "tube.22decembre.eu",
    "tube.aquilenet.fr",
    "tube.bootlicker.party",
    "tube.cccp.io",
    "tube.comm.network",
    "tube.conferences-gesticulees.net",
    "tube.darfweb.eu",
    "tube.hoga.fr",
    "tube.homecomputing.fr",
    "tube.kdy.ch",
    "tube.kher.nl",
    "tube.lesamarien.fr",
    "tube.mochi.academy",
    "tube.openalgeria.org",
    "tube.otter.sh",
    "tube.ouahpiti.info",
    "tube.p2p.legal",
    "tube.piweb.be",
    "tube.svnet.fr",
    "tube.worldofhauru.xyz",
    "tv.datamol.org",
    "vid.leotindall.com",
    "video.anormallostpod.ovh",
    "video.atlanti.se",
    "video.blender.org",
    "video.blueline.mg",
    "video.colibris-outilslibres.org",
    "video.crystalnet.org",
    "video.datsemultimedia.com",
    "video.deadsuperhero.com",
    "video.g3l.org",
    "video.hispagatos.org",
    "video.lqdn.fr",
    "video.migennes.net",
    "video.obermui.de",
    "video.passageenseine.fr",
    "video.teddybeard.eu",
    "video.tedomum.net",
    "video.typica.us",
    "videonaute.fr",
    "videos.benpro.fr",
    "videos.cemea.org",
    "videos.cloudfrancois.fr",
    "videos.festivalparminous.org",
    "videos.iut-orsay.fr",
    "videos.lecygnenoir.info",
    "videos.lescommuns.org",
    "videos.symphonie-of-code.fr",
    "videos.tcit.fr",
    "vidz.dou.bet",
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

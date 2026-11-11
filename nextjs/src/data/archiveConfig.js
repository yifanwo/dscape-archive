// src/data/archiveConfig.ts
import rawData from './objects.json';
const itemsMap = new Map(rawData.items.map((item) => [item.id, item]));
const getItem = (id, storyRole) => {
    const found = itemsMap.get(id);
    if (!found)
        throw new Error(`Missing item: ${id}`);
    return { ...found, storyRole };
};
export const ARCHIVE_METADATA = rawData.archiveMetadata;
export const GENERAL_RESOURCES = rawData.generalResources;
export const CHAPTERS = [
    {
        id: 'chapter-records',
        number: 'ACT I',
        title: 'RECORDS',
        kanjiOrCode: 'RECORDS',
        subline: 'Physical media carrying the early digital catalog.',
        intro: 'Before cloud storage, data moved physically. From massive mainframe reels to small floppy disks, these carriers transported early cataloging records and database references across institutions.',
        eraSpan: '1990 — 1999',
        accentColor: '#c94a29', // Vermilion Ink
        bgGradient: 'radial-gradient(circle at 50% 20%, rgba(201, 74, 41, 0.16) 0%, transparent 60%), linear-gradient(180deg, #ede5d5 0%, #f3efe6 100%)',
        items: [
            getItem('item-04-basf-reel', 'Moving data before the internet meant moving the physical tape across borders.'),
            getItem('item-05-floppy-disk-5-25', 'Early bibliographic indexes were installed and queried locally via 5.25" magnetic jackets.'),
            getItem('item-02-floppy-disk-3-5', 'Standardized 1.44MB high-density carriers enabled machine-readable MARC record exchange.'),
        ],
    },
    {
        id: 'chapter-systems',
        number: 'ACT II',
        title: 'SYSTEMS',
        kanjiOrCode: 'SYSTEMS',
        subline: 'The hardware and software running the library.',
        intro: 'Building the digital library required localized infrastructure. Installation discs updated core systems, KVM switches managed terminal access, and DAT tapes ensured nightly server backups.',
        eraSpan: '1997 — 2007',
        accentColor: '#2f5d62', // Oxidized Copper / Mineral Teal
        bgGradient: 'radial-gradient(circle at 50% 35%, rgba(47, 93, 98, 0.15) 0%, transparent 60%), linear-gradient(180deg, #f3efe6 0%, #e4e6df 100%)',
        items: [
            getItem('item-06-innopac-cd', 'System updates arrived periodically in the mail on pressed optical CD-ROMs.'),
            getItem('item-01-aten-kvmp', 'One console controlling multiple headless server towers in early library machine rooms.'),
            getItem('item-03-hp-dat-160', 'Nightly unattended 160GB magnetic cartridge backups safeguarding localized servers.'),
        ],
    },
    {
        id: 'chapter-networks',
        number: 'ACT III',
        title: 'NETWORKS',
        kanjiOrCode: 'NETWORKS',
        subline: 'Transitioning from local hardware to connected infrastructure.',
        intro: 'The dawn of the network era changed everything. IP cameras watched over the lab, while early NAS devices centralized files, bridging isolated workstations and shared digital spaces.',
        eraSpan: '2007 — 2012',
        accentColor: '#3a4f7a', // Indigo Blueprint
        bgGradient: 'radial-gradient(circle at 50% 50%, rgba(58, 79, 122, 0.16) 0%, transparent 65%), linear-gradient(180deg, #e4e6df 0%, #dde2ea 100%)',
        items: [
            getItem('item-07-planet-camera', 'Extending TCP/IP and PoE directly to physical lab space surveillance.'),
            getItem('item-08-lacie-nas', 'Replacing isolated direct-attached drives with centralized Gigabit network storage.'),
        ],
    },
];

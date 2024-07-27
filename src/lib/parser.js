'use client';
import { itemSubTypes, itemClasses } from '@lib/enums';

import testReport from '/dev/test-report';

export const parse = (json, rules) => {
    json = testReport;
    const simbot = json.simbot;
    // const invalid = isInvalid(simbot.meta, rules);
    // if (invalid) {
    //     return invalid;
    // }

    const character = getCharacter(simbot);
    const report = getReport(simbot);
    const { instances, encounters } = getInstances(simbot.meta);
    const { items, encounterItems } = getItems(simbot.meta);

    const reportItems = getReportItems(json.sim, report.id);

    return {
        character,
        report,
        instances,
        encounters,
        items,
        encounterItems,
        reportItems,
    };
};

const isInvalid = (meta, rules) => {
    const ret = [];
    for (const [keyRule, keyValue] of Object.entries(rules)) {
        if (meta[keyRule] != keyValue) {
            ret.push(keyRule);
        }
    }

    return ret.length > 1 ? ret : false;
};

const getCharacter = (simbot) => {
    const meta = simbot.meta;
    const data = meta.rawFormData;
    return {
        name: data.armory.name,
        server: data.armory.realm,
        class: simbot.charClass,
    };
};

const getReport = (simbot) => {
    const formData = simbot.meta.rawFormData;
    const firstItemUpgrade = simbot.meta.itemLibrary[0].upgrade;
    return {
        id: simbot.simId,
        url: 'https://www.raidbots.com/simbot/report/vNuZ7NnKB2SuqGRhu87dnk',
        difficulty: formData.droptimizer.difficulty,
        spec_id: formData.droptimizer.specId,
        date: new Date(simbot.date).toLocaleString('en-US', { timeZone: 'America/Chicago' }),
        avg_ilvl: formData.character.items.averageItemLevel,
        avg_ilvl_equip: formData.character.items.averageItemLevelEquipped,
        upgrade_path: firstItemUpgrade.name,
        upgrade_level: firstItemUpgrade.level,
        upgrade_max: firstItemUpgrade.max,
    };
};

const getReportItems = (sim, report_id) => {
    const results = sim.profilesets.results.reduce((acc, r) => {
        const item_id = r.name.split('/')[3];
        // already exists, more DPS.
        if (acc?.[item_id]?.dps > r.mean) {
            return acc;
        }

        return {
            ...acc,
            [item_id]: {
                item_id: r.name.split('/')[3],
                report_id,
                dps: r.mean,
            },
        };
    }, {});
    return Object.values(results);
};

const getInstances = (meta) => {
    return meta.instanceLibrary.reduce(
        (acc, instance) => ({
            instances: [
                ...acc.instances,
                {
                    id: instance.id,
                    name: instance.name,
                    description: instance.description,
                },
            ],
            encounters: [
                ...acc.encounters,
                ...instance.encounters.map((e) => ({
                    id: e.id,
                    name: e.name,
                    icon: e.icon,
                    instance_id: instance.id,
                })),
            ],
        }),
        { instances: [], encounters: [] },
    );
};

const getItems = (meta) => {
    const { items, encounterItems } = meta.rawFormData.droptimizerItems.reduce(
        (acc, item) => {
            const itemClass = itemClasses[item.item.itemClass];
            const itemSlot = isItemRingOrTrinket(item.slot) ? item.slot.slice(0, -1) : item.slot;
            const itemKey = `${item.item.id}${itemSlot}`;

            acc.items[itemKey] = {
                id: item.item.id,
                icon: item.item.icon,
                name: item.item.name,
                slot: itemSlot,
                type: itemClass ?? 'Unknown',
                subtype: itemSubTypes[itemClass]?.[item.item.itemSubClass] ?? 'Unknown',
            };
            acc.encounterItems = {
                ...acc.encounterItems,
                ...item.item.sources.reduce(
                    (acc, i) => ({
                        ...acc,
                        [`${i.encounterId}${item.item.id}`]: {
                            encounter_id: i.encounterId,
                            item_id: item.item.id,
                        },
                    }),
                    {},
                ),
            };
            if (item.item.sourceItem) {
                const sourceItem = item.item.sourceItem;
                const sourceItemClass = itemClasses[sourceItem.itemClass];
                const sourceItemKey = `${sourceItem.id}${itemSlot}`;
                acc.items[sourceItemKey] = {
                    id: sourceItem.id,
                    name: sourceItem.name,
                    icon: sourceItem.icon,
                    slot: itemSlot,
                    type: sourceItemClass ?? 'Unknown',
                    subtype: itemSubTypes[sourceItemClass]?.[sourceItem.itemSubClass] ?? 'Unknown',
                };

                acc.items[itemKey]['source_item_id'] = sourceItem.id;
                acc.encounterItems = {
                    ...acc.encounterItems,
                    ...sourceItem.sources.reduce(
                        (acc, i) => ({
                            ...acc,
                            [`${i.encounterId}${sourceItem.id}`]: {
                                encounter_id: i.encounterId,
                                item_id: sourceItem.id,
                            },
                        }),
                        {},
                    ),
                };
            }

            return acc;
        },
        { items: {}, encounterItems: {} },
    );

    return { items: Object.values(items), encounterItems: Object.values(encounterItems) };
};

const TRINKET_RING_REGEX = /(trinket|finger).+/;
const isItemRingOrTrinket = (slot) => {
    return slot.match(TRINKET_RING_REGEX);
};

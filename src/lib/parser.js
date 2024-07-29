'use client';
import { itemSubTypes, itemClasses } from '@lib/enums';

export const parse = (json, rules) => {
    const simbot = json.simbot;
    // const invalid = isInvalid(simbot.meta, rules);
    // if (invalid) {
    //     return invalid;
    // }

    const character = getCharacter(simbot);
    const report = getReport(simbot);
    report.dps = json.sim.players[0].collected_data.dps.mean
    const { instances, encounters } = getInstances(simbot.meta);
    const { items, encounterItems } = getItems(simbot.meta);

    const reportItems = getReportItems(json.sim);

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
        difficulty: getDifficulty(formData.droptimizer.difficulty),
        spec_id: formData.droptimizer.specId,
        date: new Date(simbot.date).toLocaleString('en-US', { timeZone: 'America/Chicago' }),
        avg_ilvl: formData.character.items.averageItemLevel,
        avg_ilvl_equip: formData.character.items.averageItemLevelEquipped,
        upgrade_path: firstItemUpgrade.name,
        upgrade_level: firstItemUpgrade.level,
        upgrade_max: firstItemUpgrade.max,
    };
};

const getReportItems = (sim) => {
    const results = sim.profilesets.results.reduce((acc, r) => {
        // "1200/2486/raid-mythic-fated/194301/525/0/trinket1/"
        // "instanceId/encounterId/difficulty/encounterItems[].id/itemLevel/enchant/slot"
        const itemProps = r.name.split('/');
        const itemID = itemProps[3];
        let itemSlot = itemProps.at(-2);
        if (isItemRingOrTrinket(itemSlot)) itemSlot = itemSlot.slice(0, -1);
        const itemKey = `${itemID}${itemSlot}`;
        // already exists, more DPS.
        if (acc?.[itemKey]?.dps > r.mean) {
            return acc;
        }

        return {
            ...acc,
            [itemKey]: {
                item_id: itemID,
                item_slot: itemSlot,
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
                slot: itemSlot,
                icon: item.item.icon,
                name: item.item.name,
                type: itemClass ?? 'Unknown',
                subtype: itemSubTypes[itemClass]?.[item.item.itemSubClass] ?? 'Unknown',
            };

            acc.encounterItems = {
                ...acc.encounterItems,
                ...item.item.sources.reduce(
                    (acc, i) => ({
                        ...acc,
                        [`${i.encounterId}${itemKey}`]: {
                            encounter_id: i.encounterId,
                            item_id: item.item.id,
                            item_slot: itemSlot,
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
                    slot: itemSlot,
                    name: sourceItem.name,
                    icon: sourceItem.icon,
                    type: sourceItemClass ?? 'Unknown',
                    subtype: itemSubTypes[sourceItemClass]?.[sourceItem.itemSubClass] ?? 'Unknown',
                };

                acc.items[itemKey]['source_item_id'] = sourceItem.id;
                acc.items[itemKey]['source_item_slot'] = itemSlot;
                acc.encounterItems = {
                    ...acc.encounterItems,
                    ...sourceItem.sources.reduce(
                        (acc, i) => ({
                            ...acc,
                            [`${i.encounterId}${sourceItemKey}`]: {
                                encounter_id: i.encounterId,
                                item_id: sourceItem.id,
                                item_slot: itemSlot,
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

const DIFFICULTY_REGEX = /(normal|heroic|mythic)/i;
const getDifficulty = (difficulty) => {
    difficulty = difficulty.match(DIFFICULTY_REGEX)[0] || 'error';
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
};

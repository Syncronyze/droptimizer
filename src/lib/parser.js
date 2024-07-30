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
    report.dps = json.sim.players[0].collected_data.dps.mean;
    const { instances, encounters } = getInstances(simbot.meta);
    const items = getItems(simbot.meta);

    const reportItems = getReportItems(json.sim, report.dps);

    return {
        character,
        report,
        instances,
        encounters,
        items,
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
        name: data.armory.name.toLowerCase(),
        server: data.armory.realm.toLowerCase(),
        class: simbot.charClass.toLowerCase(),
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

const getReportItems = (sim, currentDPS) => {
    const results = sim.profilesets.results.reduce((acc, r) => {
        // "1200/2486/raid-mythic-fated/194301/525/0/trinket1/"
        // "instanceId/encounterId/difficulty/encounterItems[].id/itemLevel/enchant/slot"
        const itemProps = r.name.split('/');
        const itemID = itemProps[3];
        const encounterID = itemProps[1];
        let itemSlot = itemProps.at(-2);
        if (isItemRingOrTrinket(itemSlot)) itemSlot = itemSlot.slice(0, -1);
        if (itemSlot === 'off_hand' || itemSlot === 'main_hand') itemSlot = 'weapon';
        const itemKey = `${encounterID}${itemID}${itemSlot}`;
        const dpsGain = r.mean - currentDPS;
        // already exists, more DPS.
        if (acc?.[itemKey]?.dps > dpsGain) {
            return acc;
        }

        return {
            ...acc,
            [itemKey]: {
                item_id: itemID,
                item_slot: itemSlot,
                encounter_id: encounterID,
                dps: dpsGain,
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
    const items = meta.rawFormData.droptimizerItems.reduce((acc, item) => {
        const itemClass = itemClasses[item.item.itemClass];
        let itemSlot = isItemRingOrTrinket(item.slot) ? item.slot.slice(0, -1) : item.slot;
        if (itemSlot === 'off_hand' || itemSlot === 'main_hand') itemSlot = 'weapon';
        const itemKey = `${item.item.id}${itemSlot}`;

        acc[itemKey] = {
            id: item.item.id,
            slot: itemSlot,
            icon: item.item.icon,
            name: item.item.name,
            type: itemClass ?? 'Unknown',
            subtype: itemSubTypes[itemClass]?.[item.item.itemSubClass] ?? 'Unknown',
        };

        if (item.item.sourceItem) {
            const sourceItem = item.item.sourceItem;
            const sourceItemClass = itemClasses[sourceItem.itemClass];
            let sourceItemSlot = itemSlot;
            if (sourceItemClass !== 'Armor') sourceItemSlot = 'token';
            const sourceItemKey = `${sourceItem.id}${sourceItemSlot}`;
            acc[sourceItemKey] = {
                id: sourceItem.id,
                slot: sourceItemSlot,
                name: sourceItem.name,
                icon: sourceItem.icon,
                type: sourceItemClass ?? 'Unknown',
                subtype: itemSubTypes[sourceItemClass]?.[sourceItem.itemSubClass] ?? 'Unknown',
            };

            acc[itemKey]['source_item_id'] = sourceItem.id;
            acc[itemKey]['source_item_slot'] = sourceItemSlot;
        }

        return acc;
    }, {});

    return Object.values(items);
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

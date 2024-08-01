'use client';
import { itemSubTypes, itemClasses } from '@lib/enums';

export const parse = (json) => {
    const simbot = json.simbot;
    // const invalid = isInvalid(simbot.meta, rules);
    // if (invalid) {
    //     return invalid;
    // }

    const character = getCharacter(simbot);
    const report = getReport(simbot);
    report.dps = json.sim.players[0].collected_data.dps.mean;
    const { instances, encounters } = getInstances(simbot.meta);
    const { items, reportItemFKs } = getItems(simbot.meta);

    const reportItems = getReportItems(json.sim, report.dps, reportItemFKs);

    return {
        character,
        report,
        instances,
        encounters,
        items,
        reportItems,
    };
};

// const isInvalid = (meta, rules) => {
//     const ret = [];
//     for (const [keyRule, keyValue] of Object.entries(rules)) {
//         if (meta[keyRule] != keyValue) {
//             ret.push(keyRule);
//         }
//     }

//     return ret.length > 1 ? ret : false;
// };

const getCharacter = (simbot) => {
    const formData = simbot.meta.rawFormData;
    return {
        name: formData.character.name.toLowerCase(),
        server: formData.character.realm.toLowerCase(),
        class: simbot.charClass.toLowerCase(),
    };
};

const getReport = (simbot) => {
    const formData = simbot.meta.rawFormData;
    const firstItemUpgrade = simbot.meta.itemLibrary[0].upgrade;
    return {
        difficulty: getDifficulty(formData.droptimizer.difficulty),
        instance_id: formData.droptimizer.instance,
        spec_id: formData.droptimizer.specId,
        date: new Date(simbot.date).toLocaleString('en-US', { timeZone: 'America/Chicago' }),
        avg_ilvl: formData.character.items.averageItemLevel,
        avg_ilvl_equip: formData.character.items.averageItemLevelEquipped,
        upgrade_path: firstItemUpgrade.name,
        upgrade_level: firstItemUpgrade.level,
        upgrade_max: firstItemUpgrade.max,
    };
};

const getReportItems = (sim, currentDPS, items) => {
    const results = sim.profilesets.results.reduce((acc, r) => {
        // "1200/2486/raid-mythic-fated/194301/525/0/trinket1/"
        // "instanceId/encounterId/difficulty/encounterItems[].id/itemLevel/enchant/slot"
        const [_, encounter_id, ___, ____, ilvl, _____, slot] = r.name.split('/');
        const { item_id, source } = items[r.name];
        const itemKey = `${encounter_id}${item_id}${ilvl}${source}`;

        const dpsGain = r.mean - currentDPS;
        // already exists, more DPS.
        if (acc?.[itemKey]?.dps > dpsGain) {
            return acc;
        }

        return {
            ...acc,
            [itemKey]: {
                item_id,
                ilvl,
                slot: parseSlot(slot),
                source,
                encounter_id,
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
    const { items, reportItemFKs } = meta.rawFormData.droptimizerItems.reduce(
        (acc, r) => {
            const { item } = r;
            const isOriginal = !item.sourceItem;
            const itemToParse = isOriginal ? item : item.sourceItem;
            const parsedItem = parseItem(itemToParse);

            acc.items = {
                ...acc.items,
                [parsedItem.id]: parsedItem,
            };

            // by creating a second object here, we are creating the link between the raidbots "ID"
            // and the source item. given "id" 1208/2530/raid-mythic-fated/217207/528/0/hands/
            // this will be found in rawFormData.droptimizerItems and this is how its identified in the results
            // so now when we getReportItems we reference the item_id as linked here, essentially "overwriting" values
            // if it's already been seen prior and it's higher dps.
            acc.reportItemFKs = {
                ...acc.reportItemFKs,
                [r.id]: {
                    item_id: parsedItem.id,
                    slot: item.slot,
                    source: isOriginal ? 'original' : item.fromToken ? 'token' : 'catalyst',
                },
            };

            return acc;
        },
        { items: {}, reportItemFKs: {} },
    );

    return { items: Object.values(items), reportItemFKs };
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

const parseSlot = (slotStr) => {
    if (isItemRingOrTrinket(slotStr)) slotStr = slotStr.slice(0, -1);
    else if (slotStr === 'off_hand' || slotStr === 'main_hand') slotStr = 'weapon';
    return slotStr;
};

const parseItem = (item) => {
    const itemType = itemClasses[item.itemClass] ?? 'Unknown';
    const itemSubType = itemSubTypes[itemType]?.[item.itemSubClass] ?? 'Unknown';
    return {
        id: item.id,
        name: item.name,
        icon: item.icon,
        type: itemSubType,
        subtype: itemSubType,
    };
};

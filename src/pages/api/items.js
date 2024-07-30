import db from '@db';
import { encounter_item_view } from '@tables';
import { and, desc, eq } from 'drizzle-orm';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { encounter, difficulty } = req.query;
    if (!encounter || !difficulty) {
        res.status(405).json({ error: 'Invalid parameters' });
        return;
    }

    try {
        const items = await selectItems(encounter, difficulty);
        res.status(200).json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
        return;
    }
}

const selectItems = async (encounter, difficulty) => {
    console.info(`Selecting items for encounter ${encounter} and difficulty ${difficulty}`);

    return await db
        .select({
            id: encounter_item_view.item_id,
            icon: encounter_item_view.item_icon,
            name: encounter_item_view.item_name,
            slot: encounter_item_view.item_slot,
            is_source_item: encounter_item_view.is_source_item,
            highest_dps: encounter_item_view.highest_dps,
            dps_gain: encounter_item_view.dps_gain,
            dps: encounter_item_view.dps,
            report_id: encounter_item_view.report_id,
            encounter_id: encounter_item_view.encounter_id,
            difficulty: encounter_item_view.difficulty,
        })
        .from(encounter_item_view)
        .where(
            and(
                eq(encounter_item_view.encounter_id, encounter),
                eq(encounter_item_view.difficulty, difficulty),
            ),
        )
        .orderBy(desc(encounter_item_view.dps_gain));
};

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
        .select()
        .from(encounter_item_view)
        .where(
            and(
                eq(encounter_item_view.encounter_id, encounter),
                eq(encounter_item_view.difficulty, difficulty),
            ),
        )
        .orderBy(desc(encounter_item_view.highest_dps_gain_dec));
};

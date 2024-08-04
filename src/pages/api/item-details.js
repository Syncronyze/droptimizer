import db from '@db';
import { item_detail_view } from '@tables';
import { and, eq } from 'drizzle-orm';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { item, encounter, difficulty } = req.query;
    if (!item || !encounter || !difficulty) {
        res.status(405).json({ error: 'Invalid parameters' });
        return;
    }

    try {
        const items = await selectItems(item, encounter, difficulty);
        res.status(200).json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
        return;
    }
}

const selectItems = async (item, encounter, difficulty) => {
    const query = db
        .select()
        .from(item_detail_view)
        .where(
            and(
                eq(item_detail_view.difficulty, difficulty),
                eq(item_detail_view.encounter_id, encounter),
                eq(item_detail_view.id, item),
            ),
        );
    const items = await query.execute();
    return items;
};

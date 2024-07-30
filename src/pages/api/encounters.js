import db from '@db';
import { encounters } from '@tables';
import { eq } from 'drizzle-orm';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { instance } = req.query;
    if (!instance) {
        res.status(405).json({ error: 'Invalid parameters' });
        return;
    }

    try {
        const encounters = await selectEncounters(instance);
        res.status(200).json(encounters);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
        return;
    }
}

const selectEncounters = async (instance) => {
    console.info('Selecting encounters');
    const result = await db.select().from(encounters).where(eq(encounters.instance_id, instance));

    return result;
};

import db from '@db';
import { instances } from '@tables';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const instances = await selectInstances();
        res.status(200).json(instances);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
        return;
    }
}

const selectInstances = async () => {
    console.info('Selecting instances');
    const result = await db.select().from(instances);

    return result;
};

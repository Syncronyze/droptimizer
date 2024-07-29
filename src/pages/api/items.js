import { supabase } from '@lib/supabase';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { encounter } = req.query;
    if (!encounter) {
        res.status(405).json({ error: 'Invalid parameters' });
        return;
    }

    try {
        const items = await selectItems(encounter);
        res.status(200).json(items.map((ia) => ({ ...ia.items })));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
        return;
    }
}

const selectItems = async (encounter) => {
    console.info(`Selecting items for encounter ${encounter}`);
    const { data, error } = await supabase
        .from('encounter_items')
        .select('items (id, slot, source_item_id, source_item_slot, name, type, subtype, icon)')
        .eq('encounter_id', encounter);

    if (error)
        throw new Error(
            `Could not get encounters(s) - ${error.httpStatusCode} ${error.code} ${error.message}`,
        );

    return data;
};

import db from '@db';
import { characters, items, report_items, reports, specs } from '@tables';
import { and, sql } from 'drizzle-orm';

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
    console.info(`Selecting item ${item} for encounter ${encounter} and difficulty ${difficulty} `);
    const maxDpsSubquery = db
        .select({
            char_id: reports.char_id,
            spec_id: reports.spec_id,
            item_slot: items.slot,
            max_dps: sql`max(${report_items.dps})`.as('max_dps'),
        })
        .from(report_items)
        .innerJoin(reports, sql`${reports.id} = ${report_items.report_id}`)
        .innerJoin(
            items,
            sql`${items.id} = ${report_items.item_id} AND ${items.slot} = ${report_items.item_slot}`,
        )
        .groupBy(reports.char_id, reports.spec_id, items.slot)
        .as('max_dps_subquery');

    const result = await db
        .select({
            name: characters.name,
            server: characters.server,
            class: characters.class,
            spec_dps: sql`json_agg(json_build_object(
        'name', ${specs.name},
        'icon', ${specs.icon},
        'url', ${reports.url},
        'ilvl', ${reports.avg_ilvl},
        'ilvl_equip', ${reports.avg_ilvl_equip},
        'item_gain', ${report_items.dps},
        'bis_gain', ${maxDpsSubquery.max_dps},
        'item_dec', (${report_items.dps} / ${reports.dps}),
        'bis_dec', (${maxDpsSubquery.max_dps} / ${reports.dps}),
        'is_bis', ${report_items.dps} = ${maxDpsSubquery.max_dps}
      ))`,
        })
        .from(items)
        .innerJoin(
            report_items,
            sql`${items.id} = ${report_items.item_id} AND ${items.slot} = ${report_items.item_slot}`,
        )
        .innerJoin(reports, sql`${reports.id} = ${report_items.report_id}`)
        .innerJoin(characters, sql`${characters.id} = ${reports.char_id}`)
        .innerJoin(specs, sql`${specs.id} = ${reports.spec_id}`)
        .innerJoin(
            maxDpsSubquery,
            sql`
        ${maxDpsSubquery.char_id} = ${reports.char_id} AND
        ${maxDpsSubquery.spec_id} = ${reports.spec_id} AND
        ${maxDpsSubquery.item_slot} = ${items.slot}
      `,
        )
        .where(
            and(
                sql`${items.id} = ${item}`,
                sql`${report_items.encounter_id} = ${encounter}`,
                sql`${reports.difficulty} = ${difficulty}`,
            ),
        )
        .groupBy(characters.id, characters.name, characters.server, characters.class)
        .execute();
    return result;
};

import {
    pgTable,
    pgEnum,
    integer,
    text,
    uniqueIndex,
    unique,
    doublePrecision,
    date,
    primaryKey,
    pgView,
    json,
    decimal,
} from 'drizzle-orm/pg-core';

export const source = pgEnum('source', ['original', 'token', 'catalyst']);

export const items = pgTable('items', {
    id: integer('id').primaryKey().notNull(),
    name: text('name'),
    icon: text('icon'),
    type: text('type'),
    subtype: text('subtype'),
});

export const instances = pgTable('instances', {
    id: integer('id').primaryKey().notNull(),
    name: text('name'),
    description: text('description'),
});

export const specs = pgTable('specs', {
    id: integer('id').primaryKey().notNull(),
    name: text('name'),
    icon: text('icon'),
});

export const encounters = pgTable('encounters', {
    id: integer('id').primaryKey().notNull(),
    instance_id: integer('instance_id').references(() => instances.id),
    name: text('name'),
    icon: text('icon'),
});

export const characters = pgTable(
    'characters',
    {
        id: integer('id').primaryKey().generatedByDefaultAsIdentity({
            name: 'characters_id_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        name: text('name').notNull(),
        server: text('server').notNull(),
        class: text('class'),
    },
    (table) => {
        return {
            name_server_idx: uniqueIndex('characters_name_server_idx').using(
                'btree',
                table.name,
                table.server,
            ),
        };
    },
);

export const reports = pgTable(
    'reports',
    {
        id: integer('id').primaryKey().generatedByDefaultAsIdentity({
            name: 'reports_id_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        url: text('url'),
        char_id: integer('char_id').references(() => characters.id),
        spec_id: integer('spec_id').references(() => specs.id),
        difficulty: text('difficulty'),
        instance_id: integer('instance_id').references(() => instances.id),
        dps: doublePrecision('dps'),
        date: date('date'),
        avg_ilvl: doublePrecision('avg_ilvl'),
        avg_ilvl_equip: doublePrecision('avg_ilvl_equip'),
        upgrade_path: text('upgrade_path'),
        upgrade_level: integer('upgrade_level'),
        upgrade_max: integer('upgrade_max'),
    },
    (table) => {
        return {
            char_id_spec_id_difficulty_instance_id_idx: uniqueIndex(
                'reports_char_id_spec_id_difficulty_instance_id_idx',
            ).using('btree', table.char_id, table.spec_id, table.difficulty, table.instance_id),
            reports_url_key: unique('reports_url_key').on(table.url),
        };
    },
);

export const report_items = pgTable(
    'report_items',
    {
        report_id: integer('report_id')
            .notNull()
            .references(() => reports.id),
        item_id: integer('item_id')
            .notNull()
            .references(() => items.id),
        slot: text('slot').notNull(),
        encounter_id: integer('encounter_id')
            .notNull()
            .references(() => encounters.id),
        ilvl: integer('ilvl').notNull(),
        source: source('source').notNull(),
        dps: doublePrecision('dps'),
    },
    (table) => {
        return {
            report_items_pkey: primaryKey({
                columns: [
                    table.report_id,
                    table.item_id,
                    table.slot,
                    table.encounter_id,
                    table.ilvl,
                    table.source,
                ],
                name: 'report_items_pkey',
            }),
        };
    },
);

export const item_detail_view = pgView('item_detail_view', {
    name: text('character_name'),
    server: text('character_server'),
    class: text('character_class'),
    id: integer('item_id'),
    encounter_id: integer('encounter_id'),
    difficulty: text('difficulty'),
    spec_dps: json('spec_dps'),
}).existing();

export const encounter_item_view = pgView('encounter_item_view', {
    id: integer('item_id'),
    name: text('item_name'),
    icon: text('item_icon'),
    difficulty: text('difficulty'),
    encounter_id: integer('encounter_id'),
    slot: text('slot'),
    source: text('source'),
    highest_dps_gain: decimal('highest_dps_gain'),
    highest_dps_gain_dec: decimal('highest_dps_gain_dec'),
    character_name: text('character_name'),
    character_class: text('character_class'),
    character_server: text('character_server'),
    character_spec: text('character_spec'),
}).existing();

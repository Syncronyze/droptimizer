import {
    pgTable,
    integer,
    text,
    uniqueIndex,
    foreignKey,
    unique,
    doublePrecision,
    date,
    primaryKey,
    pgView,
    boolean,
    real,
} from 'drizzle-orm/pg-core';

export const instances = pgTable('instances', {
    id: integer('id').primaryKey().notNull(),
    name: text('name'),
    description: text('description'),
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
            char_id_spec_id_idx: uniqueIndex('reports_char_id_spec_id_idx').using(
                'btree',
                table.char_id,
                table.spec_id,
            ),
            reports_url_key: unique('reports_url_key').on(table.url),
        };
    },
);

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

export const spec_instances = pgTable(
    'spec_instances',
    {
        spec_id: integer('spec_id')
            .notNull()
            .references(() => specs.id),
        instance_id: integer('instance_id')
            .notNull()
            .references(() => instances.id),
    },
    (table) => {
        return {
            spec_instances_pkey: primaryKey({
                columns: [table.spec_id, table.instance_id],
                name: 'spec_instances_pkey',
            }),
        };
    },
);

export const encounter_items = pgTable(
    'encounter_items',
    {
        encounter_id: integer('encounter_id')
            .notNull()
            .references(() => encounters.id),
        item_id: integer('item_id').notNull(),
        item_slot: text('item_slot').notNull(),
    },
    (table) => {
        return {
            encounter_items_item_id_item_slot_fkey: foreignKey({
                columns: [table.item_id, table.item_slot],
                foreignColumns: [items.id, items.slot],
                name: 'encounter_items_item_id_item_slot_fkey',
            }),
            encounter_items_pkey: primaryKey({
                columns: [table.encounter_id, table.item_id, table.item_slot],
                name: 'encounter_items_pkey',
            }),
        };
    },
);

export const report_items = pgTable(
    'report_items',
    {
        report_id: integer('report_id')
            .notNull()
            .references(() => reports.id),
        item_id: integer('item_id').notNull(),
        item_slot: text('item_slot').notNull(),
        dps: doublePrecision('dps'),
        encounter_id: integer('encounter_id')
            .notNull()
            .references(() => encounters.id),
    },
    (table) => {
        return {
            report_items_item_id_item_slot_fkey: foreignKey({
                columns: [table.item_id, table.item_slot],
                foreignColumns: [items.id, items.slot],
                name: 'report_items_item_id_item_slot_fkey',
            }),
            report_items_pkey: primaryKey({
                columns: [table.report_id, table.item_id, table.item_slot, table.encounter_id],
                name: 'report_items_pkey',
            }),
            report_items_encounter_id_fkey: foreignKey({
                columns: [table.encounter_id],
                foreignColumns: [encounters.id],
                name: 'report_items_encounter_id_fkey',
            }),
        };
    },
);

export const items = pgTable(
    'items',
    {
        id: integer('id').notNull(),
        slot: text('slot').notNull(),
        source_item_id: integer('source_item_id'),
        source_item_slot: text('source_item_slot'),
        name: text('name'),
        icon: text('icon'),
        type: text('type'),
        subtype: text('subtype'),
    },
    (table) => {
        return {
            items_source_item_id_source_item_slot_fkey: foreignKey({
                columns: [table.source_item_id, table.source_item_slot],
                foreignColumns: [table.id, table.slot],
                name: 'items_source_item_id_source_item_slot_fkey',
            }),
            items_pkey: primaryKey({ columns: [table.id, table.slot], name: 'items_pkey' }),
        };
    },
);

export const encounter_item_view = pgView('encounter_item_view', {
    item_id: integer('item_id'),
    item_icon: text('item_icon'),
    item_name: text('item_name'),
    item_slot: text('item_slot'),
    is_source_item: boolean('is_source_item'),
    highest_dps: real('highest_dps'),
    dps_gain: real('dps_gain'),
    dps: real('dps'),
    report_id: text('report_id'),
    encounter_id: integer('encounter_id'),
    difficulty: integer('difficulty'),
}).existing();

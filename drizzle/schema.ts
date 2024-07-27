import {
    pgTable,
    integer,
    text,
    foreignKey,
    unique,
    date,
    doublePrecision,
    primaryKey,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const characters = pgTable('characters', {
    id: integer('id').primaryKey().notNull(),
    name: text('name'),
    server: text('server'),
    class: text('class'),
});

export const specs = pgTable('specs', {
    id: integer('id').primaryKey().notNull(),
    name: text('name'),
    icon: text('icon'),
});

export const difficulties = pgTable('difficulties', {
    id: integer('id').primaryKey().notNull(),
    name: text('name'),
});

export const items = pgTable(
    'items',
    {
        id: integer('id').primaryKey().notNull(),
        source_item_id: integer('source_item_id'),
        icon: text('icon'),
        type: text('type'),
        subtype: text('subtype'),
    },
    (table) => {
        return {
            items_source_item_id_fkey: foreignKey({
                columns: [table.source_item_id],
                foreignColumns: [table.id],
                name: 'items_source_item_id_fkey',
            }),
        };
    },
);

export const instances = pgTable('instances', {
    id: integer('id').primaryKey().notNull(),
    name: text('name'),
    description: text('description'),
});

export const encounters = pgTable('encounters', {
    id: integer('id').primaryKey().notNull(),
    instance_id: integer('instance_id').references(() => instances.id),
    name: text('name'),
    icon: text('icon'),
});

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
        difficulty_id: integer('difficulty_id').references(() => difficulties.id),
        date: date('date'),
        avg_ilvl: doublePrecision('avg_ilvl'),
        avg_ilvl_equip: doublePrecision('avg_ilvl_equip'),
        upgrade_path: text('upgrade_path'),
        upgrade_level: integer('upgrade_level'),
        upgrade_max: integer('upgrade_max'),
    },
    (table) => {
        return {
            reports_url_key: unique('reports_url_key').on(table.url),
        };
    },
);

export const encounter_items = pgTable(
    'encounter_items',
    {
        encounter_id: integer('encounter_id').notNull(),
        item_id: integer('item_id').notNull(),
    },
    (table) => {
        return {
            encounter_items_pkey: primaryKey({
                columns: [table.encounter_id, table.item_id],
                name: 'encounter_items_pkey',
            }),
        };
    },
);

export const report_items = pgTable(
    'report_items',
    {
        report_id: text('report_id').notNull(),
        item_id: integer('item_id').notNull(),
        dps: doublePrecision('dps'),
    },
    (table) => {
        return {
            report_items_pkey: primaryKey({
                columns: [table.report_id, table.item_id],
                name: 'report_items_pkey',
            }),
        };
    },
);

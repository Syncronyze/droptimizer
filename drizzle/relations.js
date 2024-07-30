import { relations } from 'drizzle-orm/relations';
import {
    characters,
    reports,
    specs,
    instances,
    encounters,
    spec_instances,
    encounter_items,
    items,
    report_items,
} from './schema';

export const reportsRelations = relations(reports, ({ one, many }) => ({
    character: one(characters, {
        fields: [reports.char_id],
        references: [characters.id],
    }),
    spec: one(specs, {
        fields: [reports.spec_id],
        references: [specs.id],
    }),
    report_items: many(report_items),
}));

export const charactersRelations = relations(characters, ({ many }) => ({
    reports: many(reports),
}));

export const specsRelations = relations(specs, ({ many }) => ({
    reports: many(reports),
    spec_instances: many(spec_instances),
}));

export const encountersRelations = relations(encounters, ({ one, many }) => ({
    instance: one(instances, {
        fields: [encounters.instance_id],
        references: [instances.id],
    }),
    encounter_items: many(encounter_items),
    report_items: many(report_items),
}));

export const instancesRelations = relations(instances, ({ many }) => ({
    encounters: many(encounters),
    spec_instances: many(spec_instances),
}));

export const spec_instancesRelations = relations(spec_instances, ({ one }) => ({
    spec: one(specs, {
        fields: [spec_instances.spec_id],
        references: [specs.id],
    }),
    instance: one(instances, {
        fields: [spec_instances.instance_id],
        references: [instances.id],
    }),
}));

export const encounter_itemsRelations = relations(encounter_items, ({ one }) => ({
    encounter: one(encounters, {
        fields: [encounter_items.encounter_id],
        references: [encounters.id],
    }),
    item: one(items, {
        fields: [encounter_items.item_id],
        references: [items.id],
    }),
}));

export const itemsRelations = relations(items, ({ one, many }) => ({
    encounter_items: many(encounter_items),
    report_items: many(report_items),
    item: one(items, {
        fields: [items.source_item_id],
        references: [items.id],
        relationName: 'items_source_item_id_items_id',
    }),
    items: many(items, {
        relationName: 'items_source_item_id_items_id',
    }),
}));

export const report_itemsRelations = relations(report_items, ({ one }) => ({
    report: one(reports, {
        fields: [report_items.report_id],
        references: [reports.id],
    }),
    item: one(items, {
        fields: [report_items.item_id],
        references: [items.id],
    }),
    encounter: one(encounters, {
        fields: [report_items.encounter_id],
        references: [encounters.id],
    }),
}));

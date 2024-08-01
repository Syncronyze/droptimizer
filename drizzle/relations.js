import { relations } from 'drizzle-orm/relations';
import {
    instances,
    encounters,
    characters,
    reports,
    specs,
    spec_instances,
    report_items,
    items,
} from './schema';

export const encountersRelations = relations(encounters, ({ one, many }) => ({
    instance: one(instances, {
        fields: [encounters.instance_id],
        references: [instances.id],
    }),
    report_items: many(report_items),
}));

export const instancesRelations = relations(instances, ({ many }) => ({
    encounters: many(encounters),
    reports: many(reports),
    spec_instances: many(spec_instances),
}));

export const reportsRelations = relations(reports, ({ one, many }) => ({
    character: one(characters, {
        fields: [reports.char_id],
        references: [characters.id],
    }),
    spec: one(specs, {
        fields: [reports.spec_id],
        references: [specs.id],
    }),
    instance: one(instances, {
        fields: [reports.instance_id],
        references: [instances.id],
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

export const itemsRelations = relations(items, ({ many }) => ({
    report_items: many(report_items),
}));

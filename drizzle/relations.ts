import { relations } from 'drizzle-orm/relations';
import {
    classes,
    specs,
    instances,
    encounters,
    items,
    characters,
    encounter_items,
    class_instances,
    reports,
    report_items,
    spec_reports,
} from './schema';

export const specsRelations = relations(specs, ({ one, many }) => ({
    class: one(classes, {
        fields: [specs.class_id],
        references: [classes.id],
    }),
    spec_reports: many(spec_reports),
}));

export const classesRelations = relations(classes, ({ many }) => ({
    specs: many(specs),
    characters: many(characters),
    class_instances: many(class_instances),
}));

export const encountersRelations = relations(encounters, ({ one, many }) => ({
    instance: one(instances, {
        fields: [encounters.instance_id],
        references: [instances.id],
    }),
    encounter_items: many(encounter_items),
}));

export const instancesRelations = relations(instances, ({ many }) => ({
    encounters: many(encounters),
    class_instances: many(class_instances),
}));

export const itemsRelations = relations(items, ({ one, many }) => ({
    item: one(items, {
        fields: [items.source_item_id],
        references: [items.id],
        relationName: 'items_source_item_id_items_id',
    }),
    items: many(items, {
        relationName: 'items_source_item_id_items_id',
    }),
    encounter_items: many(encounter_items),
    report_items: many(report_items),
}));

export const charactersRelations = relations(characters, ({ one, many }) => ({
    class: one(classes, {
        fields: [characters.class_id],
        references: [classes.id],
    }),
    spec_reports: many(spec_reports),
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

export const class_instancesRelations = relations(class_instances, ({ one }) => ({
    class: one(classes, {
        fields: [class_instances.class_id],
        references: [classes.id],
    }),
    instance: one(instances, {
        fields: [class_instances.instance_id],
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
}));

export const reportsRelations = relations(reports, ({ many }) => ({
    report_items: many(report_items),
    spec_reports: many(spec_reports),
}));

export const spec_reportsRelations = relations(spec_reports, ({ one }) => ({
    character: one(characters, {
        fields: [spec_reports.char_id],
        references: [characters.id],
    }),
    spec: one(specs, {
        fields: [spec_reports.spec_id],
        references: [specs.id],
    }),
    report: one(reports, {
        fields: [spec_reports.report_id],
        references: [reports.id],
    }),
}));

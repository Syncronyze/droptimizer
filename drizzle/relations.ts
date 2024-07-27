import { relations } from 'drizzle-orm/relations';
import { items, instances, encounters, characters, reports, specs, difficulties } from './schema';

export const itemsRelations = relations(items, ({ one, many }) => ({
    item: one(items, {
        fields: [items.source_item_id],
        references: [items.id],
        relationName: 'items_source_item_id_items_id',
    }),
    items: many(items, {
        relationName: 'items_source_item_id_items_id',
    }),
}));

export const encountersRelations = relations(encounters, ({ one }) => ({
    instance: one(instances, {
        fields: [encounters.instance_id],
        references: [instances.id],
    }),
}));

export const instancesRelations = relations(instances, ({ many }) => ({
    encounters: many(encounters),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
    character: one(characters, {
        fields: [reports.char_id],
        references: [characters.id],
    }),
    spec: one(specs, {
        fields: [reports.spec_id],
        references: [specs.id],
    }),
    difficulty: one(difficulties, {
        fields: [reports.difficulty_id],
        references: [difficulties.id],
    }),
}));

export const charactersRelations = relations(characters, ({ many }) => ({
    reports: many(reports),
}));

export const specsRelations = relations(specs, ({ many }) => ({
    reports: many(reports),
}));

export const difficultiesRelations = relations(difficulties, ({ many }) => ({
    reports: many(reports),
}));

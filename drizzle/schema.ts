import { pgTable, foreignKey, bigint, text, date, varchar, primaryKey, unique, numeric } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"



export const specs = pgTable("specs", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint("id", { mode: "number" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	class_id: bigint("class_id", { mode: "number" }).notNull().references(() => classes.id),
	name: text("name").notNull(),
	icon: text("icon").default('').notNull(),
});

export const instances = pgTable("instances", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "instances_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 99999999, cache: 1 }),
	name: text("name").default('').notNull(),
	description: text("description").default('').notNull(),
});

export const encounters = pgTable("encounters", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint("id", { mode: "number" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	instance_id: bigint("instance_id", { mode: "number" }).notNull().references(() => instances.id),
	name: text("name").notNull(),
	icon: text("icon").default('').notNull(),
});

export const items = pgTable("items", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint("id", { mode: "number" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	source_item_id: bigint("source_item_id", { mode: "number" }),
	slot: text("slot").default('').notNull(),
	icon: text("icon").default('').notNull(),
	type: text("type").default('').notNull(),
	subtype: text("subtype").notNull(),
},
(table) => {
	return {
		items_fk1: foreignKey({
			columns: [table.source_item_id],
			foreignColumns: [table.id],
			name: "items_fk1"
		}),
	}
});

export const reports = pgTable("reports", {
	id: text("id").primaryKey().notNull(),
	difficulty: text("difficulty").notNull(),
	date: date("date").notNull(),
	avg_ilvl: numeric("avg_ilvl", { precision: 16, scale: 2 }).default('0').notNull(),
	avg_ilvl_equip: numeric("avg_ilvl_equip", { precision: 16, scale: 2 }).default('0').notNull(),
	upgrade_path: text("upgrade_path").default('').notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	upgrade_level: bigint("upgrade_level", { mode: "number" }).default(0).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	upgrade_max: bigint("upgrade_max", { mode: "number" }).default(0).notNull(),
});

export const classes = pgTable("classes", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint("id", { mode: "number" }).primaryKey().notNull(),
	name: text("name").notNull(),
	icon: text("icon").default('').notNull(),
});

export const characters = pgTable("characters", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "characters_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 99999999, cache: 1 }),
	name: text("name").notNull(),
	server: text("server").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	class_id: bigint("class_id", { mode: "number" }).notNull().references(() => classes.id),
});

export const encounter_items = pgTable("encounter_items", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	encounter_id: bigint("encounter_id", { mode: "number" }).notNull().references(() => encounters.id),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	item_id: bigint("item_id", { mode: "number" }).notNull().references(() => items.id),
},
(table) => {
	return {
		encounter_items_pkey: primaryKey({ columns: [table.encounter_id, table.item_id], name: "encounter_items_pkey"}),
		encounter_items_encounter_id_key: unique("encounter_items_encounter_id_key").on(table.encounter_id),
		encounter_items_item_id_key: unique("encounter_items_item_id_key").on(table.item_id),
	}
});

export const class_instances = pgTable("class_instances", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	class_id: bigint("class_id", { mode: "number" }).notNull().references(() => classes.id),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	instance_id: bigint("instance_id", { mode: "number" }).notNull().references(() => instances.id),
},
(table) => {
	return {
		class_instances_pkey: primaryKey({ columns: [table.class_id, table.instance_id], name: "class_instances_pkey"}),
		class_instances_class_id_key: unique("class_instances_class_id_key").on(table.class_id),
		class_instances_instance_id_key: unique("class_instances_instance_id_key").on(table.instance_id),
	}
});

export const report_items = pgTable("report_items", {
	report_id: text("report_id").notNull().references(() => reports.id),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	item_id: bigint("item_id", { mode: "number" }).notNull().references(() => items.id),
	dps: numeric("dps", { precision: 64, scale: 16 }).default('0').notNull(),
},
(table) => {
	return {
		report_items_pkey: primaryKey({ columns: [table.report_id, table.item_id], name: "report_items_pkey"}),
		report_items_report_id_key: unique("report_items_report_id_key").on(table.report_id),
		report_items_item_id_key: unique("report_items_item_id_key").on(table.item_id),
	}
});

export const spec_reports = pgTable("spec_reports", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	char_id: bigint("char_id", { mode: "number" }).notNull().references(() => characters.id),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	spec_id: bigint("spec_id", { mode: "number" }).notNull().references(() => specs.id),
	difficulty: text("difficulty").notNull(),
	report_id: text("report_id").references(() => reports.id),
},
(table) => {
	return {
		spec_reports_pkey: primaryKey({ columns: [table.char_id, table.spec_id, table.difficulty], name: "spec_reports_pkey"}),
	}
});
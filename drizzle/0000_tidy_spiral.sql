-- Delete all rows from report_items
DELETE FROM report_items;

-- Delete all rows from reports
DELETE FROM reports;

-- Alter report_items table to add encounter_id column
ALTER TABLE report_items ADD COLUMN encounter_id INTEGER;

-- Add NOT NULL constraint
ALTER TABLE report_items ALTER COLUMN encounter_id SET NOT NULL;

-- Add foreign key constraint
ALTER TABLE report_items ADD CONSTRAINT report_items_encounter_id_fkey 
FOREIGN KEY (encounter_id) REFERENCES encounters(id);

-- Add the primary key constraint
ALTER TABLE report_items
ADD CONSTRAINT report_items_pkey 
PRIMARY KEY (report_id, item_id, item_slot, encounter_id);
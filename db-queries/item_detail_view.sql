
CREATE VIEW public.item_detail_view AS
 WITH item_dps AS (
         SELECT items.id AS item_id,
            items.source_item_id,
            COALESCE(items.source_item_id, items.id) AS effective_item_id,
                CASE
                    WHEN (items.source_item_id IS NOT NULL) THEN true
                    ELSE false
                END AS is_source_item,
            report_items.encounter_id,
            report_items.ilvl,
            reports_1.difficulty,
            report_items.dps,
            reports_1.char_id,
            reports_1.spec_id,
            reports_1.id AS report_id,
            items.slot AS item_slot,
            row_number() OVER (PARTITION BY reports_1.char_id, reports_1.spec_id, COALESCE(items.source_item_id, items.id), report_items.encounter_id, reports_1.difficulty, report_items.ilvl,
                CASE
                    WHEN (items.source_item_id IS NOT NULL) THEN true
                    ELSE false
                END ORDER BY report_items.dps DESC) AS rn
           FROM ((public.report_items
             JOIN public.items ON ((items.id = report_items.item_id)))
             JOIN public.reports reports_1 ON ((reports_1.id = report_items.report_id)))
        ), max_dps_subquery AS (
         SELECT reports_1.char_id,
            reports_1.spec_id,
            items.slot AS item_slot,
            max(report_items.dps) AS max_dps
           FROM ((public.report_items
             JOIN public.reports reports_1 ON ((reports_1.id = report_items.report_id)))
             JOIN public.items ON (((items.id = report_items.item_id))))
          GROUP BY reports_1.char_id, reports_1.spec_id, items.slot
        )
 SELECT characters.id AS character_id,
    characters.name,
    characters.server,
    characters.class,
    item_dps.effective_item_id,
    item_dps.is_source_item,
    item_dps.encounter_id,
    item_dps.difficulty,
    json_agg(json_build_object('name', specs.name, 'icon', specs.icon, 'url', reports.url, 'ilvl', reports.avg_ilvl, 'ilvl_equip', reports.avg_ilvl_equip, 'item_gain', item_dps.dps, 'bis_gain', max_dps_subquery.max_dps, 'item_dec', (item_dps.dps / reports.dps), 'bis_dec', (max_dps_subquery.max_dps / reports.dps), 'is_bis', (item_dps.dps = max_dps_subquery.max_dps))) AS spec_dps
   FROM ((((item_dps
     JOIN public.reports ON ((reports.id = item_dps.report_id)))
     JOIN public.characters ON ((characters.id = item_dps.char_id)))
     JOIN public.specs ON ((specs.id = item_dps.spec_id)))
     JOIN max_dps_subquery ON (((max_dps_subquery.char_id = item_dps.char_id) AND (max_dps_subquery.spec_id = item_dps.spec_id) AND (max_dps_subquery.item_slot = item_dps.item_slot))))
  WHERE (item_dps.rn = 1)
  GROUP BY characters.id, characters.name, characters.server, characters.class, item_dps.effective_item_id, item_dps.is_source_item, item_dps.encounter_id, item_dps.difficulty;
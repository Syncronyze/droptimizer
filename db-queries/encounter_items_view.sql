
CREATE VIEW public.encounter_item_view AS
 SELECT subquery.item_id,
    subquery.item_icon,
    subquery.item_name,
    subquery.item_slot,
    subquery.is_source_item,
    subquery.highest_dps,
    (subquery.highest_dps / reports.dps) AS dps_gain,
    reports.dps,
    subquery.report_id,
    subquery.encounter_id,
    reports.difficulty
   FROM (( SELECT ri.item_id,
            ri.item_icon,
            ri.item_name,
            ri.item_slot,
            ri.is_source_item,
            ri.highest_dps,
            ri.report_id,
            ri.encounter_id,
            ri.difficulty,
            row_number() OVER (PARTITION BY ri.item_id, ri.is_source_item, ri.encounter_id ORDER BY ri.highest_dps DESC) AS rn
           FROM ( SELECT COALESCE(source_items.id, items.id) AS item_id,
                    COALESCE(source_items.icon, items.icon) AS item_icon,
                    COALESCE(source_items.name, items.name) AS item_name,
                        CASE
                            WHEN (source_items.id IS NOT NULL) THEN true
                            ELSE false
                        END AS is_source_item,
                    max(report_items.dps) AS highest_dps,
                    items.slot as item_slot,
                    report_items.report_id,
                    report_items.encounter_id,
                    reports_1.difficulty,
                    reports_1.dps
                   FROM (((public.items
                     JOIN public.report_items ON ((items.id = report_items.item_id)))
                     LEFT JOIN public.items source_items ON (items.source_item_id = source_items.id))
                     JOIN public.reports reports_1 ON ((report_items.report_id = reports_1.id)))
                  GROUP BY COALESCE(source_items.id, items.id), COALESCE(source_items.icon, items.icon), COALESCE(source_items.name, items.name), items.slot, report_items.report_id, report_items.encounter_id, reports_1.difficulty, reports_1.dps,
                        CASE
                            WHEN (source_items.id IS NOT NULL) THEN true
                            ELSE false
                        END) ri) subquery
     JOIN public.reports ON ((subquery.report_id = reports.id)))
  WHERE (subquery.rn = 1);

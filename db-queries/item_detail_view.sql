drop view item_detail_view;
create view item_detail_view as
  with bis_list as (
    select
      report_id,
      slot,
      item_id as bis_item_id,
      encounter_id as bis_encounter_id,
      item_dps as bis_gain,
      item_dps / dps as bis_gain_dec
    from (
      select
        r.id as report_id,
        ri.item_id,
        ri.encounter_id,
        ri.slot,
        ri.dps as item_dps,
        r.dps,
        row_number() over (partition by r.id, ri.slot order by ri.dps desc) as rn
      from report_items ri
      left join reports r on ri.report_id = r.id
    )
    where rn = 1
  )
  select
    c.name as character_name,
    c.server as character_server,
    c.class as character_class,
    ri.item_id,
    ri.encounter_id,
    r.difficulty,
    json_agg(
      json_build_object(
        'name', s.name, 
        'icon', s.icon, 
        'url', r.url, 
    	  'source', ri.source,
        'ilvl', r.avg_ilvl, 
        'ilvl_equip', r.avg_ilvl_equip, 
        'dps_gain', ri.dps,
        'slot', ri.slot,
        'dps_gain_dec', ri.dps / r.dps,
        'bis_item_id', bl.bis_item_id,
        'bis_encounter_id', bl.bis_encounter_id,
        'bis_gain', bl.bis_gain,
        'bis_gain_dec', bl.bis_gain_dec
    )
	order by ri.dps desc
  ) AS spec_dps
  from report_items ri
  left join items i on ri.item_id = i.id
  left join reports r on ri.report_id = r.id
  left join characters c on r.char_id = c.id
  left join specs s on r.spec_id = s.id
  left join bis_list bl on bl.report_id = r.id and bl.slot = ri.slot
  group by c.name, c.server, c.class, ri.item_id, ri.encounter_id, r.difficulty
  order by max(ri.dps) desc
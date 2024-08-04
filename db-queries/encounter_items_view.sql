create view public.encounter_item_view as
 select
	item_id,
	item_name,
	item_icon,
	difficulty,
	encounter_id,
	slot,
	source,
	highest_dps_gain,
	highest_dps_gain_dec,
	character_name,
	character_class,
	character_server,
	character_spec
from (
	select
		ri.item_id as item_id,
		i.name as item_name,
		i.icon as item_icon,
		ri.encounter_id as encounter_id,
		r.difficulty as difficulty,
		ri.slot as slot,
		ri.source as source,
		ri.dps as highest_dps_gain,
		ri.dps / r.dps as highest_dps_gain_dec,
		c.name as character_name,
		c.server as character_server,
		c.class as character_class,
		s.name as character_spec,
		row_number() over ( partition by ri.item_id, ri.encounter_id, r.difficulty, ri.ilvl order by ri.dps desc ) as rn
	from report_items ri
	left join items i on ri.item_id = i.id
	left join reports r on ri.report_id = r.id
	left join characters c on r.char_id = c.id
	left join specs s on r.spec_id = s.id
)
where rn = 1;
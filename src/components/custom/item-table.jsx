'use client';
import { PlusCircle } from 'lucide-react';

import { Button } from '@components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@components/ui/tabs';
import React from 'react';
import { scrollClasses } from '@utils/css-utils';
import ItemRow from './item-row';

const items = [
    {
        id: 195492,
        name: 'Windborne Hatsuburi',
        icon: 'inv_helm_leather_raidrogueprimalist_d_01',
        slot: 'head',
        type: 'Armor',
        subtype: 'Leather',
    },
    {
        id: 217193,
        icon: 'inv_leather_raiddruiddragon_d_01_helm',
        name: 'Bough of the Autumn Blaze',
        slot: 'head',
        type: 'Armor',
        subtype: 'Leather',
        source_item_id: 217325,
    },
    {
        id: 217325,
        name: 'Mystic Decelerating Chronograph',
        icon: 'inv_belt_armor_waistoftime_d_01',
        slot: 'head',
        type: 'Miscellaneous',
        subtype: 'Junk',
    },
    {
        id: 195496,
        icon: 'inv_10_dungeonjewelry_primalist_necklace_1_air',
        name: 'Eye of the Vengeful Hurricane',
        slot: 'neck',
        type: 'Armor',
        subtype: 'Misc',
    },
    {
        id: 195502,
        icon: 'inv_10_dungeonjewelry_primalist_trinket_4_earth',
        name: "Terros's Captive Core",
        slot: 'neck',
        type: 'Armor',
        subtype: 'Misc',
    },
    {
        id: 195486,
        name: 'Twisted Loam Spaulders',
        icon: 'inv_shoulder_leather_raiddemonhunterprimalist_d_01',
        slot: 'shoulder',
        type: 'Armor',
        subtype: 'Leather',
    },
    {
        id: 217195,
        icon: 'inv_leather_raiddruiddragon_d_01_shoulder',
        name: 'Mantle of the Autumn Blaze',
        slot: 'shoulder',
        type: 'Armor',
        subtype: 'Leather',
        source_item_id: 217408,
    },
    {
        id: 217333,
        name: 'Mystic Synchronous Timestrand',
        icon: 'inv_10_enchanting2_magicswirl_bronze',
        slot: 'shoulder',
        type: 'Miscellaneous',
        subtype: 'Junk',
    },
    {
        id: 195478,
        name: "Valdrakken Protector's Turncoat",
        icon: 'inv_leather_raiddruidprimalist_d_01_chest',
        slot: 'chest',
        type: 'Armor',
        subtype: 'Leather',
    },
    {
        id: 217191,
        icon: 'inv_leather_raiddruiddragon_d_01_chest',
        name: 'Chestroots of the Autumn Blaze',
        slot: 'chest',
        type: 'Armor',
        subtype: 'Leather',
        source_item_id: 217408,
    },
    {
        id: 202004,
        name: "Brawler's Earthen Cuirass",
        icon: 'inv_chest_leather_raidmonkprimalist_d_01',
        slot: 'chest',
        type: 'Armor',
        subtype: 'Leather',
    },
    {
        id: 217317,
        name: 'Mystic Fleeting Hourglass',
        icon: 'ability_dragonriding_bronzerewind01',
        slot: 'chest',
        type: 'Miscellaneous',
        subtype: 'Junk',
    },
    {
        id: 217408,
        name: 'Awakened Tempostone',
        icon: 'inv_10_specialreagentfoozles_coolegg_bronze',
        slot: 'chest',
        type: 'Reagent',
        subtype: 'ContextToken',
    },
    {
        id: 195501,
        name: 'Fused Shale Waistband',
        icon: 'inv_belt_leather_raiddemonhunterprimalist_d_01',
        slot: 'waist',
        type: 'Armor',
        subtype: 'Leather',
    },
    {
        id: 202512,
        icon: 'inv_leather_raiddruiddragon_d_01_belt',
        name: 'Garland of the Autumn Blaze',
        slot: 'waist',
        type: 'Armor',
        subtype: 'Leather',
        source_item_id: 195501,
    },
    {
        id: 195530,
        name: 'Loathsome Thunderhosen',
        icon: 'inv_pant_leather_raidmonkprimalist_d_01',
        slot: 'legs',
        type: 'Armor',
        subtype: 'Leather',
    },
    {
        id: 217194,
        icon: 'inv_leather_raiddruiddragon_d_01_pant',
        name: 'Pants of the Autumn Blaze',
        slot: 'legs',
        type: 'Armor',
        subtype: 'Leather',
        source_item_id: 217329,
    },
    {
        id: 217329,
        name: 'Mystic Ephemeral Hypersphere',
        icon: 'item_timemote_icon',
        slot: 'legs',
        type: 'Miscellaneous',
        subtype: 'Junk',
    },
    {
        id: 195509,
        name: "Ice-Climber's Cleats",
        icon: 'inv_boot_leather_raidrogueprimalist_d_01',
        slot: 'feet',
        type: 'Armor',
        subtype: 'Leather',
    },
    {
        id: 202517,
        icon: 'inv_leather_raiddruiddragon_d_01_boot',
        name: 'Hooves of the Autumn Blaze',
        slot: 'feet',
        type: 'Armor',
        subtype: 'Leather',
        source_item_id: 202008,
    },
    {
        id: 202008,
        name: 'Galvanic Gaiters',
        icon: 'inv_boot_leather_raidmonkprimalist_d_01',
        slot: 'feet',
        type: 'Armor',
        subtype: 'Leather',
    },
    {
        id: 195525,
        name: "Loyal Flametender's Bracers",
        icon: 'inv_leather_raiddruidprimalist_d_01_bracer',
        slot: 'wrist',
        type: 'Armor',
        subtype: 'Leather',
    },
    {
        id: 202511,
        icon: 'inv_leather_raiddruiddragon_d_01_bracer',
        name: 'Bands of the Autumn Blaze',
        slot: 'wrist',
        type: 'Armor',
        subtype: 'Leather',
        source_item_id: 195525,
    },
    {
        id: 195514,
        name: 'Treacherous Totem Wraps',
        icon: 'inv_glove_leather_raidmonkprimalist_d_01',
        slot: 'hands',
        type: 'Armor',
        subtype: 'Leather',
    },
    {
        id: 217192,
        icon: 'inv_leather_raiddruiddragon_d_01_glove',
        name: 'Handguards of the Autumn Blaze',
        slot: 'hands',
        type: 'Armor',
        subtype: 'Leather',
        source_item_id: 217408,
    },
    {
        id: 217321,
        name: 'Mystic Quickened Bronzestone',
        icon: 'inv_10_dungeonjewelry_dragon_trinket_1arcanemagical_bronze',
        slot: 'hands',
        type: 'Miscellaneous',
        subtype: 'Junk',
    },
    {
        id: 195480,
        icon: 'inv_10_dungeonjewelry_primalist_ring_2_fire',
        name: "Seal of Diurna's Chosen",
        slot: 'finger',
        type: 'Armor',
        subtype: 'Misc',
    },
    {
        id: 201992,
        icon: 'inv_10_dungeonjewelry_primalist_ring_1_fire',
        name: "Emissary's Flamewrought Seal",
        slot: 'finger',
        type: 'Armor',
        subtype: 'Misc',
    },
    {
        id: 194301,
        icon: 'inv_10_dungeonjewelry_primalist_necklace_1_omni',
        name: 'Whispering Incarnate Icon',
        slot: 'trinket',
        type: 'Armor',
        subtype: 'Misc',
    },
    {
        id: 194304,
        icon: 'inv_misc_web_01',
        name: 'Iceblood Deathsnare',
        slot: 'trinket',
        type: 'Armor',
        subtype: 'Misc',
    },
    {
        id: 194309,
        icon: 'inv_10_dungeonjewelry_primalist_trinket_1ragingelement_air',
        name: 'Spiteful Storm',
        slot: 'trinket',
        type: 'Armor',
        subtype: 'Misc',
    },
    {
        id: 194310,
        icon: 'inv_10_inscription2_book1_color4',
        name: "Desperate Invoker's Codex",
        slot: 'trinket',
        type: 'Armor',
        subtype: 'Misc',
    },
    {
        id: 195481,
        icon: 'inv_mace_1h_primalistraid_d_02',
        name: 'Scepter of Drastic Measures',
        slot: 'main_hand',
        type: 'Weapon',
        subtype: 'Mace 1H',
    },
    {
        id: 195529,
        icon: 'inv_knife_1h_primalistraid_d_01',
        name: "Stormlash's Last Resort",
        slot: 'main_hand',
        type: 'Weapon',
        subtype: 'Dagger',
    },
    {
        id: 195482,
        name: "Decorated Commander's Cindercloak",
        icon: 'inv_cape_leather_raidmonkprimalist_d_01',
        slot: 'back',
        type: 'Armor',
        subtype: 'Cloth',
    },
    {
        id: 202510,
        icon: 'inv_leather_raiddruiddragon_d_01_cape',
        name: 'Foliage of the Autumn Blaze',
        slot: 'back',
        type: 'Armor',
        subtype: 'Cloth',
        source_item_id: 195511,
    },
    {
        id: 195511,
        name: 'Acid-Proof Webbing',
        icon: 'inv_mail_raidhunterprimalist_d_01_cape',
        slot: 'back',
        type: 'Armor',
        subtype: 'Cloth',
    },
    {
        id: 195497,
        icon: 'inv_staff_2h_primalistraid_d_02',
        name: 'Quake-Detecting Seismostaff',
        slot: 'main_hand',
        type: 'Weapon',
        subtype: 'Staff',
    },
    {
        id: 195484,
        icon: 'inv_offhand_1h_primalistraid_d_02',
        name: "Icewrath's Channeling Conduit",
        slot: 'off_hand',
        type: 'Armor',
        subtype: 'Misc',
    },
    {
        id: 195513,
        icon: 'inv_offhand_1h_primalistraid_d_01',
        name: 'Scripture of Primal Devotion',
        slot: 'off_hand',
        type: 'Armor',
        subtype: 'Misc',
    },
    {
        id: 195526,
        icon: 'inv_10_dungeonjewelry_primalist_ring_3_fire',
        name: 'Seal of Filial Duty',
        slot: 'finger',
        type: 'Armor',
        subtype: 'Misc',
    },
];

const difficulties = [
    {
        name: 'Normal',
    },
    {
        name: 'Heroic',
    },
    {
        name: 'Mythic',
    },
];

const headerClasses =
    'h-10 px-2 text-left align-middle font-medium text-muted-foreground p-2 hover:bg-muted/50 select-none pointer-default';

export default function ItemTable() {
    return (
        <Tabs className='flex grow flex-col m-4' defaultValue='all'>
            <div className='flex items-center'>
                <TabsList>
                    {difficulties.map((difficulty) => (
                        <TabsTrigger value={`${difficulty.name}`} key={`${difficulty.name}`}>
                            {difficulty.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
                <div className='ml-auto flex items-center gap-2'>
                    <Button size='sm' className='h-7 gap-1'>
                        <PlusCircle className='h-3.5 w-3.5' />
                        <span>Add Sim</span>
                    </Button>
                </div>
            </div>
            <div className='flex flex-col min-h-0 ring-1 ring-neutral-800 rounded-md m-2'>
                <div className='grid grid-cols-12 border-b pr-4'>
                    <div className={`col-span-7 ${headerClasses}`}>
                        <a href='#' className='flex flex-row items-center px-4 cursor-default'>
                            <span className='pl-4 font-bold'>Item</span>
                        </a>
                    </div>
                    <div className={`col-span-2 text-center ${headerClasses}`}>Slot</div>
                    <div className={`col-span-2 text-center ${headerClasses}`}>Highest DPS</div>
                    <div className={`col-span-1 ${headerClasses} hover:bg-transparent`}>
                        <span className='sr-only'>Expand</span>
                    </div>
                </div>
                <div className={`flex flex-auto flex-col overflow-auto ${scrollClasses}`}>
                    {items.map((item) => (
                        <ItemRow key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </Tabs>
    );
}

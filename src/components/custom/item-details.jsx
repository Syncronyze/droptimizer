import { textClassColors } from '@utils/css-utils';
import Image from 'next/image';
import React from 'react';
import DPSDisplay from './dps-display';

const itemCharacterDPS = [
    {
        name: 'Syncsii',
        server: 'Illidan',
        class: 'Druid',
        spec_dps: [
            {
                spec: 'balance',
                icon: 'spell_nature_starfall',
                dps_gain: 9027,
                bis_gain: 14047,
                max_dps: 500000,
            },
            {
                spec: 'feral',
                icon: 'ability_druid_catform',
                dps_gain: 12539,
                bis_gain: 12539,
                max_dps: 500000,
            },
        ],
    },
    {
        name: 'Snc',
        server: 'Illidan',
        class: 'Rogue',
        spec_dps: [
            {
                spec: 'outlaw',
                icon: 'ability_rogue_waylay',
                dps_gain: 53636,
                bis_gain: 53636,
                max_dps: 500000,
            },
            {
                spec: 'subtlety',
                icon: 'ability_stealth',
                dps_gain: -7755,
                bis_gain: 1681,
                max_dps: 500000,
            },
            {
                spec: 'assassination',
                icon: 'ability_rogue_deadlybrew',
                dps_gain: -11465,
                bis_gain: 9729,
                max_dps: 500000,
            },
        ],
    },
    {
        name: 'Synks',
        server: 'Illidan',
        class: 'Paladin',
        spec_dps: [
            {
                spec: 'retribution',
                icon: 'paladin_retribution',
                dps_gain: 15704,
                bis_gain: 15704,
                max_dps: 500000,
            },
            {
                spec: 'protection',
                icon: 'ability_paladin_shieldofthetemplar',
                dps_gain: -1425,
                bis_gain: 10136,
                max_dps: 250000,
            },
        ],
    },
];

const CharacterRow = ({ character, showTitles }) => (
    <div className='flex flex-col'>
        <div className='grid grid-cols-6 text-right bg-muted border-x border-neutral-800 font-bold text-muted-foreground'>
            <div
                className={`text-left pl-4 col-span-2 ${textClassColors[character.class.toLowerCase()]}`}
            >
                {character.name}-{character.server}
            </div>
            {showTitles ? (
                <>
                    <div>BIS Upgrade %</div>
                    <div>BIS Gain</div>
                    <div>DPS Gain</div>
                    <div className='pr-4'>Upgrade %</div>
                </>
            ) : (
                <>
                    <div />
                    <div />
                    <div />
                    <div />
                </>
            )}
        </div>
        <div>
            {character.spec_dps.map((spec) => (
                <SpecRow key={`${character.name}-${character.server}-${spec.spec}`} spec={spec} />
            ))}
        </div>
    </div>
);

const SpecRow = ({ spec }) => {
    const rawDiff = spec.dps_gain;
    const pctDiff = spec.dps_gain / spec.max_dps;
    const isBIS = spec.dps_gain >= spec.bis_gain;
    let rawRelDiff = 0.0;
    let pctRelDiff = 0.0;

    if (!isBIS) {
        rawRelDiff = spec.bis_gain;
        pctRelDiff = spec.bis_gain / spec.max_dps;
    }

    return (
        <div className='grid grid-cols-6 border-b bg-neutral-900 hover:bg-muted/50 items-center px-4'>
            <div className='col-span-2 capitalize py-1'>
                <div className='flex flex-row'>
                    <div className='w-6 h-6'>
                        <Image
                            alt={spec.spec}
                            width='0'
                            height='0'
                            sizes='100vw'
                            className='w-full h-auto rounded-full border-2'
                            src={`https://wow.zamimg.com/images/wow/icons/large/${spec.icon}.jpg`}
                        />
                    </div>
                    <span className='font-semibold pl-2'>{spec.spec}</span>
                </div>
            </div>
            <DPSDisplay dps={pctRelDiff} percent />
            <DPSDisplay dps={rawRelDiff} />
            <DPSDisplay dps={rawDiff} />
            <DPSDisplay dps={pctDiff} percent icon doubleIcon={isBIS} />
        </div>
    );
};

export default function ItemDetails({ item }) {
    return (
        <div>
            {itemCharacterDPS.map((character, i) => (
                <CharacterRow
                    key={`${character.name}-${character.server}`}
                    character={character}
                    showTitles={i === 0}
                />
            ))}
        </div>
    );
}

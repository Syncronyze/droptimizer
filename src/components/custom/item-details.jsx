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

const CharacterRow = ({ character }) => (
    <>
        <thead className='ring-1 ring-neutral-700 bg-muted'>
            <tr className='text-center font-bold text-muted-foreground'>
                <td className={`${textClassColors[character.class.toLowerCase()]}`}>
                    {character.name}
                </td>
                <td>BIS Upgrade %</td>
                <td>BIS Gain</td>
                <td>Upgrade %</td>
                <td>DPS Gain</td>
            </tr>
        </thead>
        <tbody>
            {character.spec_dps.map((spec) => (
                <SpecRow key={`${character.name}-${character.server}-${spec.spec}`} spec={spec} />
            ))}
        </tbody>
    </>
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
        <tr className='border-b hover:bg-muted/50'>
            <td className='capitalize px-4 py-1'>
                <div className='flex flex-row'>
                    <div className='w-6 h-6'>
                        <Image
                            alt={spec.spec}
                            width='0'
                            height='0'
                            sizes='100vw'
                            className='w-full h-auto rounded-full'
                            src={`https://wow.zamimg.com/images/wow/icons/large/${spec.icon}.jpg`}
                        />
                    </div>
                    <span className='font-semibold px-4'>{spec.spec}</span>
                </div>
            </td>
            <td className='px-4'>
                <DPSDisplay dps={pctRelDiff} percent />
            </td>
            <td>
                <DPSDisplay dps={rawRelDiff} />
            </td>
            <td>
                <DPSDisplay dps={pctDiff} percent />
            </td>
            <td>
                <DPSDisplay dps={rawDiff} icon />
            </td>
        </tr>
    );
};

export default function ItemDetails({ item }) {
    return (
        <div className='p-2 border-b'>
            <table className='w-full'>
                {itemCharacterDPS.map((character) => (
                    <CharacterRow
                        key={`${character.name}-${character.server}`}
                        character={character}
                    />
                ))}
            </table>
        </div>
    );
}

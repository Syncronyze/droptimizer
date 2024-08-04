import { textClassColors } from '@utils/css-utils';
import Image from 'next/image';
import React from 'react';
import { DPSDisplay } from '@components';
import { Badge } from '@components/ui';

const CharacterTable = ({ character, showTitles }) => (
    <>
        <thead className='text-right bg-muted font-bold text-muted-foreground'>
            {showTitles ? (
                <tr className='sticky top-0 border-b border-neutral-700'>
                    <th
                        className={`capitalize bg-muted text-left pl-4 col-span-2 ${textClassColors[character.class.toLowerCase().replace(' ', '_')]}`}
                    >
                        {character.name}
                    </th>
                    <th className='bg-muted'>BIS Upgrade %</th>
                    <th className='bg-muted'>BIS Gain</th>
                    <th className='bg-muted'>Upgrade %</th>
                    <th className='pr-4 bg-muted'>DPS Gain</th>
                </tr>
            ) : (
                <tr>
                    <th
                        className={`capitalize sticky border-y border-neutral-700 top-0 bg-muted text-left pl-4 col-span-2 z-10 ${textClassColors[character.class.toLowerCase().replace(' ', '_')]}`}
                    >
                        {character.name}
                    </th>
                    <th />
                    <th />
                    <th />
                    <th />
                </tr>
            )}
        </thead>
        <tbody>
            {character.spec_dps.map((spec) => (
                <SpecRow
                    key={`${character.name}-${character.server}-${spec.name}`}
                    spec_dps={spec}
                />
            ))}
        </tbody>
    </>
);

const SpecRow = ({ spec_dps }) => {
    const isBIS = spec_dps.dps_gain === spec_dps.bis_gain;
    return (
        <tr
            className={`border-y border-neutral-700 cursor-pointer ${isBIS ? 'bg-slate-700/40 hover:bg-slate-700/30 ' : 'hover:bg-muted/50'}`}
            onClick={() => window.open(spec_dps.url, '_blank')}
        >
            <td className='capitalize py-1 pl-2'>
                <div className='flex flex-row justify-between items-center'>
                    <span className='flex flex-row'>
                        <div className='w-6 h-6'>
                            <Image
                                alt={spec_dps.name}
                                width='0'
                                height='0'
                                sizes='100vw'
                                className='w-full h-auto rounded-full border-2'
                                src={`https://wow.zamimg.com/images/wow/icons/large/${spec_dps.icon}.jpg`}
                            />
                        </div>
                        <span className='font-semibold pl-2 text-ellipsis whitespace-nowrap'>
                            {spec_dps.name}
                        </span>
                        {spec_dps.ilvl_equip && spec_dps.ilvl && (
                            <span className='text-[0.65rem] ml-2 px-1 py-0.5 whitespace-nowrap self-center font-bold text-white bg-neutral-600 rounded-md'>
                                {spec_dps.ilvl_equip} / {spec_dps.ilvl}
                            </span>
                        )}
                    </span>
                    {spec_dps.source === 'catalyst' && (
                        <Badge>
                            <span>Catalyst</span>
                        </Badge>
                    )}
                    {spec_dps.source === 'multitoken' && (
                        <Badge>
                            <span>{spec_dps.slot}</span>
                        </Badge>
                    )}
                </div>
            </td>
            <td>
                <DPSDisplay dps={isBIS ? 0 : spec_dps.bis_gain_dec} percent />
            </td>
            <td>
                <DPSDisplay dps={isBIS ? 0 : Math.round(spec_dps.bis_gain)} />
            </td>
            <td>
                <DPSDisplay dps={spec_dps.dps_gain_dec} percent />
            </td>
            <td>
                <DPSDisplay dps={Math.round(spec_dps.dps_gain)} icon doubleIcon={isBIS} />
            </td>
        </tr>
    );
};

export default function ItemDetailTable({ itemData, queryStatus }) {
    const isLoading = queryStatus === 'loading' || queryStatus === 'pending';
    if (!isLoading && (queryStatus === 'error' || itemData.length === 0)) {
        return (
            <div className='w-full text-center font-semibold my-4'>
                No reports contain this item.
            </div>
        );
    }

    return (
        <table className='w-full bg-neutral-900 relative z-20 border-x'>
            {itemData?.map((character, i) => (
                <CharacterTable
                    key={`${character.name}-${character.server}`}
                    character={character}
                    showTitles={i === 0}
                />
            ))}
        </table>
    );
}

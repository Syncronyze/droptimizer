import { textClassColors } from '@utils/css-utils';
import Image from 'next/image';
import React from 'react';
import DPSDisplay from './dps-display';

const CharacterRow = ({ character, showTitles }) => (
    <div className='flex flex-col'>
        <div className='grid grid-cols-6 text-right bg-muted border-x border-neutral-800 font-bold text-muted-foreground'>
            <div
                className={`capitalize text-left pl-4 col-span-2 ${textClassColors[character.class.toLowerCase()]}`}
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
    return (
        <a
            href={spec.url}
            target='_blank'
            rel='noopener noreferrer'
            className='grid grid-cols-6 border-b bg-neutral-900 hover:bg-muted/50 items-center px-4'
        >
            <div className='col-span-2 capitalize py-1'>
                <div className='flex flex-row'>
                    <div className='w-6 h-6'>
                        <Image
                            alt={spec.name}
                            width='0'
                            height='0'
                            sizes='100vw'
                            className='w-full h-auto rounded-full border-2'
                            src={`https://wow.zamimg.com/images/wow/icons/large/${spec.icon}.jpg`}
                        />
                    </div>
                    <span className='font-semibold pl-2'>{spec.name}</span>
                    <span className='text-[0.65rem] ml-2 px-1 py-0.5  self-center font-bold text-white bg-neutral-600 rounded-md'>
                        iLvl {spec.ilvl_equip} / {spec.ilvl}
                    </span>
                </div>
            </div>
            <DPSDisplay dps={spec.is_bis ? 0 : spec.bis_dec} percent />
            <DPSDisplay dps={spec.is_bis ? 0 : Math.round(spec.bis_gain)} />
            <DPSDisplay dps={Math.round(spec.item_gain)} />
            <DPSDisplay dps={spec.item_dec} percent icon doubleIcon={spec.is_bis} />
        </a>
    );
};

export default function ItemDetails({ itemData, queryStatus }) {
    if (queryStatus === 'loading' || queryStatus === 'pending') {
        return <div />;
    }

    if (queryStatus === 'error' || itemData.length === 0) {
        return (
            <div className='w-full text-center font-semibold my-4'>
                No reports contain this item.
            </div>
        );
    }
    console.log(itemData);
    return (
        <div>
            {itemData.map((character, i) => (
                <CharacterRow
                    key={`${character.name}-${character.server}`}
                    character={character}
                    showTitles={i === 0}
                />
            ))}
        </div>
    );
}

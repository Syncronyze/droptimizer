import { scrollClasses } from '@utils/css-utils';
import Image from 'next/image';
import React from 'react';

const encounters = [
    {
        id: 2480,
        name: 'Eranog',
        icon: 'ui-ej-boss-eranog',
        order: 1,
        flags: 0,
        difficulty_mask: 255,
    },
    {
        id: 2500,
        name: 'Terros',
        icon: 'ui-ej-boss-terros',
        order: 2,
        flags: 0,
        difficulty_mask: 255,
    },
    {
        id: 2486,
        name: 'The Primal Council',
        icon: 'ui-ej-boss-theprimalcouncil',
        order: 3,
        flags: 0,
        difficulty_mask: 255,
    },
    {
        id: 2482,
        name: 'Sennarth, the Cold Breath',
        icon: 'ui-ej-boss-sennarththecoldbreath',
        order: 4,
        flags: 0,
        difficulty_mask: 255,
    },
    {
        id: 2502,
        name: 'Dathea, Ascended',
        icon: 'ui-ej-boss-datheaascended',
        order: 5,
        flags: 0,
        difficulty_mask: 255,
    },
    {
        id: 2491,
        name: 'Kurog Grimtotem',
        icon: 'ui-ej-boss-kuroggrimtotem',
        order: 6,
        flags: 0,
        difficulty_mask: 255,
    },
    {
        id: 2493,
        name: 'Broodkeeper Diurna',
        icon: 'ui-ej-boss-broodkeeperdiurna',
        order: 7,
        flags: 0,
        difficulty_mask: 255,
    },
    {
        id: 2499,
        name: 'Raszageth the Storm-Eater',
        icon: 'ui-ej-boss-raszageththestorm-eater',
        order: 8,
        flags: 0,
        difficulty_mask: 255,
    },
];

export default function BossNav() {
    return (
        <nav className={`flex flex-auto flex-col overflow-auto border-t ${scrollClasses}`}>
            {encounters.map((encounter) => (
                <div
                    key={encounter.id}
                    className={
                        'flex flex-row items-center text-muted-foreground whitespace-nowrap p-2 mx-4 mt-1 rounded-md ' +
                        'hover:text-primary hover:bg-muted/50 cursor-pointer'
                    }
                >
                    <Image
                        height={32}
                        width={64}
                        alt={encounter.name}
                        src={`https://www.raidbots.com/static/images/EncounterJournal/orig/${encounter.icon}.png`}
                    />
                    <span className='text-sm overflow-hidden text-ellipsis font-semibold'>
                        {encounter.name}
                    </span>
                </div>
            ))}
        </nav>
    );
}

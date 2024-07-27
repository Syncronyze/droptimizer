'use client';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
} from '@components/ui/dropdown-menu';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { ChevronDownIcon } from 'lucide-react';
import React from 'react';

const instances = [
    {
        id: -58,
        name: 'Season 4 Raid Vendors',
        description: '',
    },
    {
        id: 1208,
        name: 'Aberrus, the Shadowed Crucible',
        description:
            "Millennia ago, Neltharion established Aberrus, a secret laboratory where he conducted world altering experiments. Recently rediscovered, Aberrus is now under attack from all sides as forces seeking to claim the Earth-Warder's legacy search for any power that remains. The champions of Azeroth must venture into the shadows and ensure Neltharion's dark power doesn't fall into the wrong hands.",
    },
    {
        id: 1207,
        name: "Amirdrassil, the Dream's Hope",
        description:
            "Having been carefully nurtured within the Emerald Dream, Amirdrassil is preparing to bloom and cross into Azeroth. But the fate of the new World Tree cannot be secured until Azeroth's champions come together to face Fyrakk and his molten allies, before he devours the heart of Amirdrassil and bathes the world in flame.",
    },
    {
        id: 1200,
        name: 'Vault of the Incarnates',
        description:
            "The Primalists breached the Titan prison used to hold the Incarnates for millennia. Within, Raszageth performs a foul ritual to unleash her siblings, so together they can purge the world of the Titans' influence. The champions of Azeroth must assault this impregnable fortress and break their defenses to end this threat. While many could fall, defeat condemns all the realms to the Incarnates' reign of fire and blood.",
    },
];

export default function InstanceNav() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className='flex flex-row justify-between items-center text-xl font-semibold bg-transparent hover:bg-neutral-800 text-white select-none p-1 m-1 rounded-md text-nowrap'>
                    <span className='px-2 text-base overflow-hidden text-ellipsis'>
                        Aberrus, the Shadowed Crucible
                    </span>
                    <ChevronDownIcon className='mt-1 h-6 w-6' />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                {instances.map((instance) => {
                    return (
                        <DropdownMenuCheckboxItem
                            key={instance.id}
                            className='cursor-pointer select-none'
                            checked={instance.id === 1200}
                            onCheckedChange={() => {}}
                        >
                            {instance.name}
                        </DropdownMenuCheckboxItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

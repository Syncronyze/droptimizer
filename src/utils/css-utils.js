import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const scrollClasses =
    'scrollbar-thumb-rounded-md scrollbar-track-rounded-md scrollbar-w-2 scrollbar ' +
    'scrollbar-thumb-neutral-600 scrollbar-track-neutral-900';

export const textClassColors = {
    death_knight: 'text-death_knight',
    demon_hunter: 'text-demon_hunter',
    druid: 'text-druid',
    evoker: 'text-evoker',
    hunter: 'text-hunter',
    mage: 'text-mage',
    monk: 'text-monk',
    paladin: 'text-paladin',
    priest: 'text-priest',
    rogue: 'text-rogue',
    shaman: 'text-shaman',
    warlock: 'text-warlock',
    warrior: 'text-warrior',
};

export const colSpans = [
    'col-span-1',
    'col-span-2',
    'col-span-3',
    'col-span-4',
    'col-span-5',
    'col-span-6',
];

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

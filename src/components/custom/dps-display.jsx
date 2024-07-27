import React from 'react';
import { ChevronDown, ChevronUp, ChevronsDown, ChevronsUp } from 'lucide-react';

const formatter = new Intl.NumberFormat();

const getIcon = (dps, doubleIcon) => {
    if (dps >= 0) {
        return doubleIcon ? (
            <ChevronsUp className='mx-1 text-green-500' />
        ) : (
            <ChevronUp className='mx-1 text-green-500' />
        );
    }

    return doubleIcon ? (
        <ChevronsDown className='mx-1 text-red-500' />
    ) : (
        <ChevronDown className='mx-1 text-red-500' />
    );
};

export default function DPSDisplay({ dps, icon, doubleIcon, percent }) {
    const directionIcon = icon ? getIcon(dps, doubleIcon) : null;

    let formattedDPS;
    if (percent) {
        formattedDPS = formatter.format(Math.round(dps * 10000) / 100) + '%';
    } else {
        formattedDPS = formatter.format(dps);
    }

    if (dps > 0) formattedDPS = '+' + formattedDPS;
    else if (dps === 0) formattedDPS = '—';

    return (
        <span className='flex flex-row justify-end items-center'>
            {formattedDPS} {icon && directionIcon}
        </span>
    );
}

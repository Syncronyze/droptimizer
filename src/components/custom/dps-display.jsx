import React from 'react';
import { ChevronsDown, ChevronsUp } from 'lucide-react';

const formatter = new Intl.NumberFormat();

export default function DPSDisplay({ dps, icon, percent }) {
    const directionIcon =
        dps > 0 ? (
            <ChevronsUp className='text-green-500' />
        ) : (
            <ChevronsDown className='text-red-500' />
        );

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

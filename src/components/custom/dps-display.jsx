import React from 'react';
import { ChevronDown, ChevronUp, ChevronsDown, ChevronsUp } from 'lucide-react';

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

const formatNumber = (dps) => {
    const absDPS = Math.abs(dps);
    if (absDPS > 999999) {
        return (dps / 1000000).toFixed(1) + 'm';
    } else if (absDPS > 999) {
        return (dps / 1000).toFixed(1) + 'k';
    }
    return parseInt(dps);
};

export default function DPSDisplay({ dps, icon, doubleIcon, percent }) {
    const directionIcon = icon ? getIcon(dps, doubleIcon) : null;

    let formattedDPS = '—';
    if (dps !== 0) {
        if (percent) {
            formattedDPS = (dps * 100).toFixed(1) + '%';
        } else {
            formattedDPS = formatNumber(dps);
        }

        if (dps > 0) formattedDPS = '+' + formattedDPS;
    }

    return (
        <span className='flex flex-row justify-end items-center'>
            {formattedDPS} {icon && directionIcon}
        </span>
    );
}

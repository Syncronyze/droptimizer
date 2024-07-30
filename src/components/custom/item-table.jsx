'use client';
import React, { useContext, useState } from 'react';
import { scrollClasses } from '@utils/css-utils';
import ItemRow from '@components/custom/item-row';
import { NavContext } from '@components/custom/nav-context';
import { useQuery } from '@tanstack/react-query';
import { defaultFetch } from '@lib/react-query';
import { Skeleton } from '@components/ui/skeleton';

const headerClasses =
    'h-10 px-2 text-left align-middle font-medium text-muted-foreground p-2 hover:bg-muted/50 select-none pointer-default';

export default function ItemTable() {
    const [openedItem, setOpenedItem] = useState(null);
    const { selectedEncounter, selectedDifficulty } = useContext(NavContext).navState;
    const { data: items, status } = useQuery({
        queryKey: ['items', selectedEncounter?.id, selectedDifficulty?.name],
        queryFn: async () =>
            defaultFetch({
                endpoint: 'items',
                method: 'GET',
                params: {
                    encounter: selectedEncounter.id,
                    difficulty: selectedDifficulty.name,
                },
            }),
        enabled: !!selectedEncounter?.id && !!selectedDifficulty?.name,
    });

    const handleOpen = (item) => {
        setOpenedItem(item);
    };

    if (status === 'loading' || status === 'pending') {
        return (
            <>
                {Array.from({ length: 8 }, (_, i) => i).map((i) => (
                    <div key={i} className='flex flex-row items-center mx-4 mt-2'>
                        <Skeleton className='w-16 mx-2 h-8 rounded-full' />
                        <Skeleton className='h-4 w-full' />
                    </div>
                ))}
            </>
        );
    }

    if (status === 'error' || items.length === 0) {
        return <div className='w-full text-center font-semibold mt-8'>No items.</div>;
    }

    return (
        <div className='flex flex-col min-h-0 ring-1 ring-neutral-800 rounded-md '>
            <div className='grid grid-cols-12 border-b pr-4'>
                <div className={`col-span-7 ${headerClasses}`}>
                    <a href='#' className='flex flex-row items-center px-4 cursor-default'>
                        <span className='pl-4 font-bold'>Item</span>
                    </a>
                </div>
                <div className={`col-span-2 text-center ${headerClasses}`}>Slot</div>
                <div className={`col-span-2 text-center ${headerClasses}`}>Highest DPS</div>
                <div className={`col-span-1 ${headerClasses} hover:bg-transparent`}>
                    <span className='sr-only'>Expand</span>
                </div>
            </div>
            <div
                className={`flex flex-auto flex-col overflow-y-scroll rounded-b-md ${scrollClasses}`}
            >
                {items.map((item) => (
                    <ItemRow
                        key={`${item.id}${item.is_source_item}`}
                        item={item}
                        difficulty={selectedDifficulty}
                        open={openedItem?.id === item.id}
                        setOpen={handleOpen}
                    />
                ))}
            </div>
        </div>
    );
}

'use client';
import React, { useCallback, useContext, useState } from 'react';
import { colSpans, scrollClasses } from '@utils/css-utils';
import { NavContext, ItemListItem, Spinner } from '@components';
import { useQuery } from '@tanstack/react-query';
import { defaultFetch } from '@lib/react-query';
import { Skeleton } from '@components/ui';
import dynamic from 'next/dynamic';

const headerClasses =
    'h-10 px-2 text-left align-middle font-medium text-muted-foreground p-2 hover:bg-muted/50 select-none pointer-default';

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const RandomSkeletonRow = ({ totalColSpan, maxItems, index }) => {
    let remainingColSpan = totalColSpan;
    const colArr = [];

    while (remainingColSpan > 0) {
        if (colArr.length >= maxItems - 1) {
            colArr.push(remainingColSpan);
            break;
        }
        const newCol = randInt(1, remainingColSpan);
        colArr.push(newCol);
        remainingColSpan -= newCol;
    }

    return colArr.map((colSpan, j) => (
        <Skeleton key={`skeleton_${index}${j}`} className={`h-4 mx-2 ${colSpans[colSpan - 1]}`} />
    ));
};

// disabling SSR for this because the Math.random() will not match.
const DynamicSkeletonRow = dynamic(() => Promise.resolve(RandomSkeletonRow), { ssr: false });

export default function ItemList() {
    const [openedItem, setOpenedItem] = useState({ id: -1, loaded: -1 });
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

    const handleOpen = useCallback(
        (id, isLoaded) => {
            console.log(openedItem, id, isLoaded);
            if (openedItem.id === id && openedItem.loaded === id) {
                return;
            }
            setOpenedItem({ id, loaded: isLoaded ? id : openedItem.loaded });
        },
        [openedItem],
    );

    if (status === 'error' || items?.length === 0) {
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
                {status === 'loading' || status === 'pending' ? (
                    <>
                        {Array.from({ length: 12 }, (_, i) => i).map((i) => (
                            <div key={i} className='w-full py-3 border-b'>
                                <div className='grid grid-cols-12 items-center'>
                                    <Skeleton className='w-11 h-11 mx-4 rounded-full' />
                                    <div className='col-span-6 mx-2 grid grid-cols-6'>
                                        <DynamicSkeletonRow
                                            totalColSpan={6}
                                            maxItems={4}
                                            index={i}
                                        />
                                    </div>
                                    <Skeleton className='col-span-2 h-4 mx-6' />
                                    <div className='col-span-2 '>
                                        <Skeleton className='h-4 mx-6' />
                                        <Skeleton className='h-4 mt-2 mx-6' />
                                    </div>
                                    <div className='col-span-1 h-6 w-6 mx-4'>
                                        <Spinner />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        {items.map((item) => (
                            <ItemListItem
                                key={`${item.id}${item.source}`}
                                item={item}
                                open={openedItem.id === item.id}
                                loaded={openedItem.loaded === item.id}
                                setOpen={handleOpen}
                            />
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}

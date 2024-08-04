import React, { memo, useCallback, useContext, useEffect } from 'react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@radix-ui/react-collapsible';
import { Badge } from '@components/ui';
import Image from 'next/image';
import { textClassColors } from '@utils/css-utils';
import { defaultFetch } from '@lib/react-query';
import { useQuery } from '@tanstack/react-query';
import { NavContext, DPSDisplay, Spinner, ItemDetailTable } from '@components';
import { ChevronRightIcon } from 'lucide-react';

export default memo(function ItemListItem({ item, open, setOpen, loaded }) {
    const { selectedEncounter, selectedDifficulty } = useContext(NavContext).navState;
    const { data, status } = useQuery({
        queryKey: ['itemsDetails', item.id, selectedEncounter?.id, selectedDifficulty.name],
        queryFn: async () =>
            defaultFetch({
                endpoint: 'item-details',
                method: 'GET',
                params: {
                    item: item.id,
                    difficulty: selectedDifficulty.name,
                    encounter: selectedEncounter.id,
                },
            }),
        enabled: open && !!selectedEncounter?.id && !!selectedDifficulty.name,
    });

    useEffect(() => {
        // if the item hasn't already been loaded, then we wait for the data to come back.
        // the loaded state will be set immediately upon opening if it was previously loaded.
        // this solves a bit of a problem with the animations while one closes before the GET completes.
        if (open && !loaded && data?.length) {
            setOpen(item.id, true);
        }
    }, [data?.length, item, loaded, open, setOpen]);

    const tryLoad = useCallback(() => {
        setOpen(open ? -1 : item.id, !!data?.length || data?.length === 0);
    }, [data?.length, item.id, open, setOpen]);

    return (
        <Collapsible asChild open={loaded} onOpenChange={tryLoad}>
            <>
                <CollapsibleTrigger asChild>
                    <div className='grid grid-cols-12 cursor-pointer p-2 bg-neutral-950 hover:bg-muted/30 items-center border-b'>
                        <div className='col-span-7'>
                            <div className='flex flex-row items-center px-4'>
                                <a href='#' data-wowhead={`item=${item.id}`}>
                                    <Image
                                        alt={item.name}
                                        className='aspect-square rounded-md object-cover'
                                        height='42'
                                        src={`https://wow.zamimg.com/images/wow/icons/large/${item.icon}.jpg`}
                                        width='42'
                                    />
                                </a>
                                <span className='pl-6 font-semibold text-md'>{item.name}</span>
                            </div>
                        </div>
                        <div className='col-span-2 text-center'>
                            <Badge variant='secondary'>
                                <span className='capitalize'>
                                    {item.source === 'multitoken'
                                        ? 'Token'
                                        : item.slot.replace('_', ' ')}
                                </span>
                            </Badge>
                        </div>
                        <div className='col-span-2 text-center'>
                            <DPSDisplay dps={item.highest_dps_gain} icon />
                            <div
                                className={`text-xs font-semibold capitalize ${textClassColors[item.character_class?.toLowerCase()]}`}
                            >
                                {item.character_name}
                            </div>
                        </div>
                        <div className='col-span-1 flex justify-end pr-4'>
                            {open && (status === 'loading' || status === 'pending') ? (
                                <Spinner />
                            ) : (
                                <ChevronRightIcon
                                    className={`transition-all ${loaded ? 'rotate-90' : ''}`}
                                />
                            )}
                        </div>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent className='bg-muted/50 oveflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'>
                    <ItemDetailTable itemData={data} queryStatus={status} />
                </CollapsibleContent>
            </>
        </Collapsible>
    );
});

import React, { useContext } from 'react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@radix-ui/react-collapsible';
import { Badge } from '@components/ui/badge';
import Image from 'next/image';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import ItemDetails from './item-details';
import DPSDisplay from './dps-display';
import { textClassColors } from '@utils/css-utils';
import Spinner from '@components/custom/spinner';
import { defaultFetch } from '@lib/react-query';
import { useQuery } from '@tanstack/react-query';
import { NavContext } from './nav-context';

export default function ItemRow({ item, open, setOpen }) {
    const { selectedEncounter, selectedDifficulty } = useContext(NavContext).navState;
    const { data, status } = useQuery({
        queryKey: ['itemsDetails', item.id, selectedEncounter?.id, selectedDifficulty.name],
        queryFn: async () =>
            defaultFetch({
                endpoint: 'item-details',
                method: 'GET',
                params: {
                    item: item.id,
                    is_source_item: item.is_source_item,
                    difficulty: selectedDifficulty.name,
                    encounter: selectedEncounter.id,
                },
            }),
        enabled: !!open && !!selectedEncounter?.id && !!selectedDifficulty.name,
    });
    return (
        <Collapsible
            asChild
            open={open}
            onOpenChange={() => {
                setOpen(item);
            }}
        >
            <>
                <CollapsibleTrigger asChild>
                    <div className='grid grid-cols-12 cursor-pointer p-2 bg-neutral-950 hover:bg-muted/30 items-center border-b'>
                        <div className='col-span-7'>
                            <a
                                href='#'
                                className='flex flex-row items-center px-4'
                                data-wowhead={`item=${item.id}`}
                            >
                                <Image
                                    alt={item.name}
                                    className='aspect-square rounded-md object-cover'
                                    height='42'
                                    src={`https://wow.zamimg.com/images/wow/icons/large/${item.icon}.jpg`}
                                    width='42'
                                />
                                <span className='pl-6 font-semibold text-md'>{item.name}</span>
                                {item.is_source_item && item.slot !== 'token' && (
                                    <Badge className='ml-4'>
                                        <span>Catalyst</span>
                                    </Badge>
                                )}
                            </a>
                        </div>
                        <div className='col-span-2 text-center'>
                            <Badge variant='secondary'>
                                <span className='capitalize'>{item.slot.replace('_', ' ')}</span>
                            </Badge>
                        </div>
                        <div className='col-span-2 text-center'>
                            <DPSDisplay dps={item.dps_gain} icon percent />
                            <div
                                className={`font-semibold capitalize ${textClassColors[item.characterClass?.toLowerCase()]}`}
                            >
                                {item.characterName}
                            </div>
                        </div>
                        <div className='col-span-1 flex justify-end pr-4'>
                            {open && (status === 'loading' || status === 'pending') ? (
                                <Spinner />
                            ) : (
                                <ChevronRightIcon
                                    className={`transition-all ${open ? 'rotate-90' : ''}`}
                                />
                            )}
                        </div>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent className='bg-muted/50 transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'>
                    <ItemDetails itemData={data} queryStatus={status} />
                </CollapsibleContent>
            </>
        </Collapsible>
    );
}

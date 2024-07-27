import { useState } from 'react';
import React from 'react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@radix-ui/react-collapsible';
import { Badge } from '@components/ui/badge';
import Image from 'next/image';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import ItemDetails from './item-details';
import DPSDisplay from './dps-display';

export default function ItemRow({ item }) {
    const [open, setOpen] = useState(false);
    return (
        <Collapsible asChild onOpenChange={setOpen}>
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
                            </a>
                        </div>
                        <div className='col-span-2 text-center'>
                            <Badge variant='secondary'>
                                <span className='capitalize'>{item.slot.replace('_', ' ')}</span>
                            </Badge>
                        </div>
                        <div className='col-span-2 text-center'>
                            <DPSDisplay dps={55000} icon />
                        </div>
                        <div className='col-span-1 flex justify-end pr-4'>
                            <ChevronRightIcon
                                className={`transition-all ${open ? 'rotate-90' : ''}`}
                            />
                        </div>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent className='bg-muted/50 transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'>
                    <ItemDetails />
                </CollapsibleContent>
            </>
        </Collapsible>
    );
}

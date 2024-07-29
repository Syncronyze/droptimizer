'use client';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
} from '@components/ui/dropdown-menu';
import { defaultFetch } from '@lib/react-query';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { ChevronDownIcon } from 'lucide-react';
import React, { useContext, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@components/ui/skeleton';
import { NavContext } from '@components/custom/nav-context';

export default function InstanceNav() {
    const { navState, updateNavState } = useContext(NavContext);
    const { selectedInstance } = navState;
    const { data: instances, status } = useQuery({
        queryKey: ['instances'],
        queryFn: async () =>
            defaultFetch({
                endpoint: 'instances',
                method: 'GET',
            }),
    });

    useEffect(() => {
        if (instances?.length > 0 && !selectedInstance)
            updateNavState({ selectedInstance: instances.at(-1) });
    }, [instances, selectedInstance, updateNavState]);

    if (status === 'loading' || status === 'pending') {
        return (
            <button className='flex flex-row justify-between items-center text-xl font-semibold bg-transparent hover:bg-neutral-800 text-white select-none p-1 m-1 rounded-md text-nowrap'>
                <Skeleton className='h-4 w-full' />
                <ChevronDownIcon className='mt-1 h-6 w-6' />
            </button>
        );
    }

    if (status === 'error' || instances.length === 0) {
        return <div className='w-full text-center text-xl font-semibold my-2'>No instances.</div>;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className='flex flex-row justify-between items-center text-xl font-semibold bg-transparent hover:bg-neutral-800 text-white select-none p-1 m-1 rounded-md text-nowrap'>
                    <span className='px-2 text-base overflow-hidden text-ellipsis'>
                        {selectedInstance?.name ?? ''}
                    </span>
                    <ChevronDownIcon className='mt-1 h-6 w-6' />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                {instances?.map((instance) => (
                    <DropdownMenuCheckboxItem
                        key={instance.id}
                        className='cursor-pointer select-none'
                        checked={selectedInstance?.id === instance.id}
                        onCheckedChange={() =>
                            updateNavState({ selectedInstance: instance, selectedEncounter: null })
                        }
                    >
                        {instance.name}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

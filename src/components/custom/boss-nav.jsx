'use client';
import { defaultFetch } from '@lib/react-query';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import React, { useContext, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@components/ui/skeleton';
import { NavContext } from './nav-context';
import { cn } from '@utils/css-utils';

export default function BossNav() {
    const { navState, updateNavState } = useContext(NavContext);
    const { selectedInstance, selectedEncounter } = navState;
    const { data: encounters, status } = useQuery({
        queryKey: ['encounters', selectedInstance?.id],
        queryFn: async () =>
            defaultFetch({
                endpoint: 'encounters',
                method: 'GET',
                params: { instance: selectedInstance.id },
            }),
        enabled: !!selectedInstance?.id,
    });

    useEffect(() => {
        if (encounters?.length > 0 && !selectedEncounter)
            updateNavState({ selectedEncounter: encounters[0] });
    }, [encounters, selectedEncounter, updateNavState]);

    if (status === 'loading' || status === 'pending') {
        return (
            <>
                {Array.from({ length: 8 }, (_, i) => i).map((i) => (
                    <div key={i} className='flex flex-row items-center mx-4 mt-4'>
                        <Skeleton className='w-16 mx-2 h-8 rounded-full' />
                        <Skeleton className='h-4 w-full' />
                    </div>
                ))}
            </>
        );
    }

    if (status === 'error' || encounters.length === 0) {
        return <div className='w-full text-center font-semibold mt-8'>No encounters.</div>;
    }

    return (
        <>
            {encounters.map((encounter) => (
                <div
                    key={encounter.id}
                    className={cn(
                        'transition-all flex flex-row items-center whitespace-nowrap p-2 mx-4 mt-1 rounded-md',
                        selectedEncounter?.id === encounter.id
                            ? 'cursor-default text-primary bg-muted'
                            : 'cursor-pointer text-muted-foreground hover:text-primary hover:bg-muted/50',
                    )}
                    onClick={
                        selectedEncounter?.id === encounter.id
                            ? undefined
                            : () => updateNavState({ selectedEncounter: encounter })
                    }
                >
                    {encounter.icon == null ? (
                        <Trash2 className='w-8 mr-6 ml-2 h-8' />
                    ) : (
                        <Image
                            height={32}
                            width={64}
                            alt={encounter.name}
                            src={`https://www.raidbots.com/static/images/EncounterJournal/orig/${encounter.icon}.png`}
                        />
                    )}

                    <span className='text-sm overflow-hidden text-ellipsis font-semibold'>
                        {encounter.name}
                    </span>
                </div>
            ))}
        </>
    );
}

import React, { useContext, useEffect } from 'react';
import { AddSimForm, NavContext } from '@components';
import { cn } from '@utils/css-utils';

const difficulties = [
    {
        name: 'Normal',
    },
    {
        name: 'Heroic',
    },
    {
        name: 'Mythic',
    },
];

export default function DifficultyNav() {
    const { navState, updateNavState } = useContext(NavContext);
    const { selectedDifficulty } = navState;
    useEffect(() => {
        if (!selectedDifficulty) updateNavState({ selectedDifficulty: difficulties[2] });
    }, [selectedDifficulty, updateNavState]);
    return (
        <div className='flex items-center'>
            <div className='inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground'>
                {difficulties.map((difficulty) => (
                    <div
                        className={cn(
                            'cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all',
                            selectedDifficulty?.name === difficulty.name
                                ? 'bg-background text-foreground shadow'
                                : '',
                        )}
                        onClick={() => updateNavState({ selectedDifficulty: difficulty })}
                        value={`${difficulty.name}`}
                        key={`${difficulty.name}`}
                    >
                        {difficulty.name}
                    </div>
                ))}
            </div>
            <AddSimForm />
        </div>
    );
}

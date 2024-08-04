'use client';
import React from 'react';
import { ItemList, DifficultyNav, BossNav, InstanceNav, NavContextProvider } from '@components';
import { scrollClasses } from '@utils/css-utils';

export default function Dashboard() {
    return (
        <div className='w-[1024px] m-auto py-24 h-full min-h-min min-w-min'>
            <div className='flex flex-row border rounded-md h-full'>
                <NavContextProvider>
                    <div className='min-w-fit border-r bg-muted/40'>
                        <div className='flex w-64 h-full max-h-screen flex-col'>
                            <InstanceNav />
                            <nav
                                className={`flex flex-auto flex-col overflow-auto border-t ${scrollClasses}`}
                            >
                                <BossNav />
                            </nav>
                        </div>
                    </div>
                    <div className='flex grow flex-col m-2 gap-y-2'>
                        <DifficultyNav />
                        <ItemList />
                    </div>
                </NavContextProvider>
            </div>
        </div>
    );
}

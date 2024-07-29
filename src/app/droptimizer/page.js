'use client';
import React from 'react';
import ItemTable from '@components/custom/item-table';
import { NavContextProvider } from '@components/custom/nav-context';
import DifficultyNav from '@components/custom/difficulty-nav';
import InstanceNav from '@components/custom/instance-nav';
import { scrollClasses } from '@utils/css-utils';
import BossNav from '@components/custom/boss-nav';

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
                        <ItemTable />
                    </div>
                </NavContextProvider>
            </div>
        </div>
    );
}

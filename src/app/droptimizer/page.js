import React from 'react';
import BossNav from '@components/custom/boss-nav';
import ItemTable from '@components/custom/item-table';
import InstanceNav from '@components/custom/instance-nav';

export default function Dashboard() {
    return (
        <div className='w-[72rem] m-auto py-16 h-full min-h-min min-w-min'>
            <div className='flex flex-row border rounded-md h-full'>
                <div className='min-w-fit border-r bg-muted/40'>
                    <div className='flex w-fit h-full max-h-screen flex-col'>
                        <InstanceNav />
                        <BossNav />
                    </div>
                </div>
                <ItemTable />
            </div>
        </div>
    );
}

'use client';
import Instance from '@components/instance';
import { parse } from '@lib/parser';
import { getData } from '@lib/queries';
import { useEffect } from 'react';

export default function Droptimizer() {
    useEffect(() => {
        const data = parse();
        console.log(data);
        getData();
    }, []);

    return (
        <main className='flex min-h-screen flex-col items-center justify-between p-24 bg-slate-900'>
            <div className='' />
        </main>
    );
}

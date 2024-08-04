'use client';

import { QueryClient } from '@tanstack/react-query';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 0,
            staleTime: Infinity,
        },
    },
});

export const defaultFetch = async ({ endpoint, method, params }) => {
    let res = null;
    const url = `api/${endpoint}`;
    if (method === 'GET') {
        const queryString = params ? `?${new URLSearchParams(params)}` : '';
        res = await fetch(`${url}${queryString}`);
    } else {
        res = await fetch(url, { method, body: JSON.stringify(params) });
    }

    if (!res.ok) {
        throw new Error(`Response status not ok - ${res.status}`);
    }
    await sleep(Math.random() * 1000);
    return await res.json();
};

import { cn } from '@utils/css-utils';
import { Roboto } from 'next/font/google';
import '../../globals.css';
import React from 'react';
import Script from 'next/script';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@lib/react-query';
const roboto = Roboto({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-sans',
});

export const metadata = {
    title: 'RAG Droptimizer',
    description: 'RAG Droptimizer',
};

export default function RootLayout({ children }) {
    return (
        <QueryClientProvider client={queryClient}>
            <html lang='en' className='dark'>
                <link rel='icon' href='../../public/icon.png' sizes='any' />
                <Script src='https://wow.zamimg.com/js/tooltips.js' />
                <body
                    className={cn(
                        'min-h-screen h-screen bg-background font-sans antialiased',
                        roboto.variable,
                    )}
                >
                    {children}
                </body>
            </html>
        </QueryClientProvider>
    );
}

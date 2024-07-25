import { cn } from '@lib/utils';
import { Roboto } from 'next/font/google';
import '../../globals.css';
import React from 'react';
import Script from 'next/script';

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
        <html lang='en' className='dark'>
            <link rel='icon' href='../../public/icon.png' sizes='any' />
            <Script src='https://wow.zamimg.com/js/tooltips.js'></Script>
            <body
                className={cn(
                    'min-h-screen h-screen bg-background font-sans antialiased',
                    roboto.variable,
                )}
            >
                {children}
            </body>
        </html>
    );
}

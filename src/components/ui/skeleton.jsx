import { cn } from '@utils/css-utils';
import React from 'react';

function Skeleton({ className, ...props }) {
    return <div className={cn('animate-pulse rounded-md bg-primary/10', className)} {...props} />;
}

export { Skeleton };

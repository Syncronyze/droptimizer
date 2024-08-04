import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@components/ui';

export default function CustomAlert({ show, error, description }) {
    return (
        <Alert className={show ? '' : 'hidden'} variant={error ? 'destructive' : 'default'}>
            {error ? <AlertTriangle className='h-4 w-4' /> : <CheckCircle className='h-4 w-4' />}

            <AlertTitle>{error ? 'Error!' : 'Success!'}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
        </Alert>
    );
}

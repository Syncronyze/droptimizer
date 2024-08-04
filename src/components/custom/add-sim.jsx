import { Button, Input, Label, Popover, PopoverContent, PopoverTrigger } from '@components/ui';
import React, { useState } from 'react';
import { PlusCircleIcon, RefreshCwIcon } from 'lucide-react';
import { CustomAlert, Spinner } from '@components';

const URL_REGEX = /[1-9A-z]{22}/;

export default function AddSimForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [value, setValue] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!value) {
            setAlert({ type: 'error', description: 'Please put in your droptimizer URL.' });
            return;
        } else if (!URL_REGEX.test(value)) {
            setAlert({ type: 'error', description: 'Please put in a valid droptimizer URL.' });
            return;
        }

        setAlert(null);
        setIsLoading(true);

        try {
            const response = await fetch('/api/reports', {
                method: 'POST',
                body: JSON.stringify({ url: value }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit the data. Please try again.');
            }
            setAlert({ type: 'success', description: 'Successfully added the sim.' });
            setValue('');
        } catch (error) {
            setAlert({ type: 'error', description: error.message });
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className='ml-auto flex items-center gap-2'>
                    <Button size='sm' className='h-7 gap-1'>
                        <PlusCircleIcon className='h-3.5 w-3.5' />
                        <span>Add Sim</span>
                    </Button>
                </div>
            </PopoverTrigger>
            <PopoverContent asChild>
                <div className='w-auto items-center gap-1.5'>
                    <Label htmlFor='url'>Sim URL</Label>
                    <form className='flex flex-row gap-x-4 justify-center items-center mt-2 mb-4' onSubmit={onSubmit}>
                        <Input
                            onChange={(e) => {
                                setValue(e.target.value);
                            }}
                            className='w-96 text-xs'
                            value={value}
                            type='text'
                            id='url'
                            placeholder='https://www.raidbots.com/simbot/report/...'
                        />
                        {isLoading ? (
                            <Button variant='secondary' disabled>
                                {isLoading && <Spinner />}
                                Processing...
                            </Button>
                        ) : (
                            <Button variant='secondary' type='submit'>
                                Submit
                            </Button>
                        )}
                    </form>
                    {alert && (
                        <CustomAlert
                            show={!!alert}
                            error={alert.type === 'error'}
                            description={alert.description}
                        />
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}

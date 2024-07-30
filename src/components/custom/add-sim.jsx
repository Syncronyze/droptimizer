import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
import { ReloadIcon } from '@radix-ui/react-icons';
import { PlusCircle } from 'lucide-react';
import React, { useState } from 'react';
import CustomAlert from '@components/custom/alert';

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
                        <PlusCircle className='h-3.5 w-3.5' />
                        <span>Add Sim</span>
                    </Button>
                </div>
            </PopoverTrigger>
            <PopoverContent asChild>
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <form onSubmit={onSubmit}>
                        <Label htmlFor='url'>Sim URL</Label>
                        <Input
                            onChange={(e) => {
                                setValue(e.target.value);
                            }}
                            value={value}
                            type='text'
                            id='url'
                            placeholder='https://www.raidbots.com/simbot/report/xxxxxxxxxxxxxxxxxxxxxx'
                        />
                        {isLoading ? (
                            <Button variant='secondary' disabled>
                                {isLoading && <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />}
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

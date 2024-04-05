'use client';

import React, { useState } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Input, Textarea } from '@nextui-org/react';
import { z } from 'zod';
import { PlusIcon } from 'lucide-react';
import { has } from 'lodash';

const schema = z.object({
  title: z
    .string({ required_error: 'Required' })
    .min(2, 'at least 2 characters')
    .max(255, 'at most 255 characters'),
  description: z.string().min(2, 'at least 2 characters'),
});

interface Errors {
  title?: string[];
  description?: string[];
}

export default function NewIssuesPage() {
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate the form feilds
    const validationResult = schema.safeParse({ title, description });
    if (!validationResult.success) {
      // Set the errors and return
      return setErrors(validationResult.error.flatten().fieldErrors);
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    console.log(validationResult.data);
  };

  return (
    <div className='container flex justify-center'>
      <form onSubmit={onSubmit}>
        <Card className='p-5 w-[30rem]'>
          <CardHeader>
            <p className='text-3xl font-medium'>New Issue</p>
          </CardHeader>
          <CardBody className='space-y-5'>
            <Input
              value={title}
              onValueChange={setTitle}
              type='title'
              label='Title'
              variant='underlined'
              validate={_ => (has(errors, 'title') ? true : null)}
              validationBehavior='native'
              color={title === undefined ? 'default' : has(errors, 'title') ? 'danger' : 'success'}
              errorMessage={errors.title?.join(', ')}
              isRequired
            />
            <Textarea
              value={description}
              onValueChange={setDescription}
              label='Description'
              variant='underlined'
              // placeholder='Enter issue description'
              validate={_ => (has(errors, 'description') ? true : null)}
              validationBehavior='native'
              color={
                description === undefined
                  ? 'default'
                  : has(errors, 'description')
                  ? 'danger'
                  : 'success'
              }
              errorMessage={errors.description?.join(', ')}
              isRequired
            />
          </CardBody>
          <CardFooter>
            <Button
              fullWidth
              type='submit'
              color='primary'
              variant='solid'
              startContent={<PlusIcon />}
              isLoading={isLoading}
              spinnerPlacement='end'
              className='text-base font-semibold'
            >
              New Issue
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

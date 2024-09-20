'use client'

import * as React from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { z } from 'zod'
import type { FieldApi } from '@tanstack/react-form'
import { useToast } from "@/hooks/use-toast"

/* eslint-disable  @typescript-eslint/no-explicit-any */
function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <div className="min-h-[20px] text-xs">
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <p className="text-red-500">{field.state.meta.errors[0]}</p>
      ) : field.state.meta.isValidating ? (
        <p className="text-blue-500">Validating...</p>
      ) : null}
    </div>
  )
}

export default function Home() {
  const { toast } = useToast()

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Form submitted:', value);
      toast({
        title: "Success",
        description: "Form submitted successfully!",
      })
    },
    validatorAdapter: zodValidator(),
  })

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>User Registration</CardTitle>
          <CardDescription>Please fill out the form below to register.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <div className="space-y-4">
              <form.Field
                name="firstName"
                validators={{
                  onChange: z
                    .string()
                    .min(3, 'First name must be at least 3 characters'),
                  onChangeAsyncDebounceMs: 500,
                  onChangeAsync: z.string().refine(
                    async (value) => {
                      await new Promise((resolve) => setTimeout(resolve, 1000))
                      return !value.includes('error')
                    },
                    {
                      message: "No 'error' allowed in first name",
                    },
                  ),
                }}
              >
                {(field) => (
                  <div className="space-y-1">
                    <Label htmlFor={field.name}>First Name</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldInfo field={field} />
                  </div>
                )}
              </form.Field>

              <form.Field
                name="lastName"
                validators={{
                  onChange: z
                    .string()
                    .min(2, 'Last name must be at least 2 characters'),
                }}
              >
                {(field) => (
                  <div className="space-y-1">
                    <Label htmlFor={field.name}>Last Name</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldInfo field={field} />
                  </div>
                )}
              </form.Field>

              <form.Field
                name="email"
                validators={{
                  onChange: z.string().email('Invalid email address'),
                }}
              >
                {(field) => (
                  <div className="space-y-1">
                    <Label htmlFor={field.name}>Email</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldInfo field={field} />
                  </div>
                )}
              </form.Field>
            </div>

            <CardFooter className="flex justify-end mt-6">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <Button type="submit" disabled={!canSubmit}>
                    {isSubmitting ? 'Submitting...' : 'Register'}
                  </Button>
                )}
              </form.Subscribe>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

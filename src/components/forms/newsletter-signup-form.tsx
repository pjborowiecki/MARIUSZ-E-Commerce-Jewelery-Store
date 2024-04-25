"use client"

import * as React from "react"
import { subscribeToNewsletter } from "@/actions/newsletter"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  newsletterSignUpSchema,
  type NewsletterSignUpFormInput,
} from "@/validations/newsletter"

import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"

export function NewsletterSignUpForm(): JSX.Element {
  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<NewsletterSignUpFormInput>({
    resolver: zodResolver(newsletterSignUpSchema),
    defaultValues: {
      email: "",
    },
  })

  function onSubmit(formData: NewsletterSignUpFormInput): void {
    startTransition(async () => {
      try {
        const message = await subscribeToNewsletter({ email: formData.email })

        switch (message) {
          case "exists":
            toast({
              title: "Jesteś już subskrybentem newslettera",
              variant: "destructive",
            })
            form.reset()
            break
          case "success":
            toast({
              title: "Dziękujemy!",
              description: "Zostałeś dopisany do listy naszych subskrybentów",
            })
            form.reset()
            break
          default:
            toast({
              title: "Coś poszło nie tak",
              description: "Spróbuj ponownie",
              variant: "destructive",
            })
        }
      } catch (error) {
        toast({
          title: "Coś poszło nie tak",
          description: "Spróbuj ponownie",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <Form {...form}>
      <form
        className="flex h-8 w-full  items-center justify-center md:h-10"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="relative h-8 w-full space-y-0 md:h-10">
              <FormLabel className="sr-only">Email</FormLabel>
              <FormControl className="rounded-r-none">
                <Input
                  type="email"
                  placeholder="jan.kowalski@gmail.com"
                  className="h-8 placeholder:text-xs md:h-10 md:placeholder:text-sm"
                  {...field}
                />
              </FormControl>
              <FormMessage className="pt-2 sm:text-sm" />
            </FormItem>
          )}
        />

        <Button
          className="size-8 rounded-l-none md:size-10"
          disabled={isPending}
        >
          {isPending ? (
            <Icons.spinner className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Icons.paperPlane className="size-4" aria-hidden="true" />
          )}
          <span className="sr-only">Join newsletter</span>
        </Button>
      </form>
    </Form>
  )
}

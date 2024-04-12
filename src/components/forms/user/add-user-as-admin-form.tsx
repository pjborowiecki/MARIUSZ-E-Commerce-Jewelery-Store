"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { addUserAsAdmin } from "@/actions/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { users } from "@/db/schema"
import {
  addUserAsAdminSchema,
  type AddUserAsAdminInput,
} from "@/validations/user"

import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Icons } from "@/components/icons"
import { PasswordInput } from "@/components/password-input"

export function AddUserAsAdminForm(): JSX.Element {
  const router = useRouter()
  const { toast } = useToast()
  const [isPending, startTransition] = React.useTransition()

  const form = useForm<AddUserAsAdminInput>({
    resolver: zodResolver(addUserAsAdminSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  function onSubmit(formData: AddUserAsAdminInput): void {
    startTransition(async () => {
      try {
        const message = await addUserAsAdmin({
          name: formData.name,
          surname: formData.surname,
          role: formData.role,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        })

        switch (message) {
          case "exists":
            toast({
              title: "Podany adres email jest już zarezerwowany",
              description:
                "Podaj inny adres email aby dokończyć dodawanie użytkownika",
              variant: "destructive",
            })
            break
          case "success":
            toast({
              title: "Użytkownik został dodany",
            })
            router.push("/admin/uzytkownicy")
            break
          default:
            toast({
              title: "Coś poszło nie tak",
              description: "Spróbuj ponownie",
              variant: "destructive",
            })
            console.error(message)
        }
      } catch (error) {
        toast({
          title: "Coś poszło nie tak",
          description: "Spróbuj ponownie",
          variant: "destructive",
        })
        console.error(error)
      }
    })
  }

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <div className="flex w-full flex-col gap-4 md:w-4/5 lg:flex-row xl:w-2/3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="jan.kowalski@gmail.com" {...field} />
                </FormControl>
                <FormMessage className="pt-2 sm:text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Rola</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value: typeof field.value) =>
                    field.onChange(value)
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder="Wybierz rolę"
                        defaultValue={users.role.enumValues[0]}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {Object.values(users.role.enumValues).map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex w-full flex-col gap-4 md:w-4/5 lg:flex-row xl:w-2/3">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Hasło</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="**********" {...field} />
                </FormControl>
                <FormMessage className="pt-2 sm:text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Potwierdź hasło</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="**********" {...field} />
                </FormControl>
                <FormMessage className="pt-2 sm:text-sm" />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button
            disabled={isPending}
            aria-label="dodaj użytkownika"
            className="w-fit"
          >
            {isPending ? (
              <>
                <Icons.spinner
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
                <span>Dodawanie...</span>
              </>
            ) : (
              <span>Dodaj</span>
            )}
            <span className="sr-only">Dodaj użytkownika</span>
          </Button>

          <Link
            href="/admin/uzytkownicy"
            className={cn(buttonVariants({ variant: "outline" }), "w-fit")}
            aria-label="anuluj"
          >
            Anuluj
          </Link>
        </div>
      </form>
    </Form>
  )
}

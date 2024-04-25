import Link from "next/link"
import Balancer from "react-wrap-balancer"

import { footerNavItems } from "@/data/nav-items"

import { NewsletterSignUpForm } from "@/components/forms/newsletter-signup-form"
import { ThemeToggle } from "@/components/theme-toggle"

export function Footer(): JSX.Element {
  return (
    <footer
      id="footer"
      aria-label="footer"
      className="grid gap-8 border-t bg-accent/40 pb-8 pt-16"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-8 sm:flex-row">
        <div className="grid flex-1 grid-cols-3 gap-4 md:gap-8">
          {footerNavItems.map((item) => (
            <div
              key={item.title}
              className="space-y-1 text-center sm:text-start md:space-y-2 md:text-start"
            >
              <ul className="space-y-1 md:space-y-2">
                {item.subItems.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      target={link?.external ? "_blank" : undefined}
                      rel={link?.external ? "noreferrer" : undefined}
                      className="text-xs text-muted-foreground underline-offset-8 transition-all hover:underline hover:opacity-70 lg:text-sm"
                    >
                      {link.title}
                      <span className="sr-only">{link.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="hidden flex-col gap-4 sm:flex sm:w-1/3 xl:pl-24">
          <p className="text-sm font-medium leading-5 2xl:text-base">
            <Balancer>
              Dołącz do naszego newslettera, bądź na bieżąco i nigdy nie przegap
              okazji
            </Balancer>
          </p>

          <NewsletterSignUpForm />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-8">
        <p className="text-sm text-muted-foreground xl:text-base">
          <Balancer>&copy; 2024 Mariusz. Wszystkie prawa zastrzeżone.</Balancer>
        </p>
        <div className="flex items-center justify-center">
          <ThemeToggle />
        </div>
      </div>
    </footer>
  )
}

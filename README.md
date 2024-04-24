# MARIUSZ E-Commerce Jewelery Store

A full-stack freelance project built for one of my clients in Poland, using [Next.js 14](https://nextjs.org/) with its latest features (app router, server actions, etc.), [TypeScript](https://www.typescriptlang.org/), [Auth.js / Next-Auth v.5](https://authjs.dev/), Postgres database hosted with [Neon](https://neon.tech/), [Drizzle ORM](https://orm.drizzle.team/), [Stripe](https://stripe.com/en-pl), [TailwindCSS](https://tailwindcss.com/), [Resend](https://resend.com), and many more fantastic tools.

This fully-functional project consists of a store front, additional info pages, (such as Terms and Conditions, Privacy Policy, About Us, Mission, Contact, and so on), client's section for viewing orders and managing client's own data (such as payment options, delivery addresses, emails, etc.), and an admin dashboard, with full CRUD functionality for managing products, categories, subcategories, orders, or users. Store front and dashboards are fully responsive and built with best practices for performance, security, and accessibility.

> **Warning**
> This project is still in active development. See a feature list below to get a better understanding of what has been implemented to date and what is yet to come.
> Since the store is being developed for a client in Poland, you can expect error messages and information visible to users to be encoded in Polish, however function names and anything else that is not directly related to the client's needs has been written in English and easy to follow.

#### Live Demo:

Not yet available

#### Live Admin Dashboard:

Not yet available

## Tech Stack:

- TypeScript
- Next.js 14
- Next-Auth
- Postgres (Neon)
- Drizzle ORM
- TailwindCSS
- ShadCn UI
- Stripe

## Features:

- [ ] Store front built with TailwindCSS and ShadCN UI
- [ ] Additional info and support pages, such as FAQ, Terms and Conditions, Privacy Policy, About Us, Mission, Contact, and so on
- [x] Role-based authentication, including:
  - [x] Email verification
  - [x] SignIn with OAuth Providers (Google and Facebook)
  - [x] Password Reset and Update
- [ ] Admin dashboard with the following CRUD functionality:
  - [x] Managing categories and subcategories
  - [x] Managing products
  - [x] Managing orders
  - [x] Managing users and customers data
- [ ] Client's panel with the followng functionality:
  - [ ] Viewing and managing user information (shipping addresses, payment methods, etc.)
  - [ ] Viewing and managing orders
  - [ ] Updating email or password
  - [ ] Deleting an acccount
- [ ] Stripe payments integration
- [ ] Opt out from newsletter
- [ ] Custom loading pages with skeleton loaders
- [ ] Custom error pages
- [ ] Blogging functionality with MDX and Markdown
- [ ] Unit, integration, and E2E tests
- [x] Postgres database and ORM set up
- [x] Transactional emails
- [x] Functional newsletter sign up
- [x] Functional and styled landing page with pricing, features, testimonials, and FAQ sections
- [x] Functional and styled sign in and sign up pages
- [x] Client-side and Server-side input validation with Zod
- [x] Latest Next.js features (app router, server actions, etc.)
- [x] Rigorous linting and TypeScript type checking

### Note:

This project has been inspired by a fantastic work done by [Sadman Sakib](https://github.com/sadmann7) and countless colaborators for his [Skateshop](https://github.com/sadmann7/skateshop) project, which I highly encourage you to check out. It has been adapted to my own and my client's needs. Most notably, it has been tranformed into a single-vendor e-commerce application.

import type { Category, Option } from "@/types"
import { MixIcon } from "@radix-ui/react-icons"

import { Icons } from "@/components/icons"

export const productCategories = [
  {
    title: "naszyjniki",
    image: "/",
    icon: Icons.gem,
    subcategories: [
      {
        title: "złote",
        description: "",
        image: "/",
        slug: "zlote",
      },
      {
        title: "pozłacane",
        description: "",
        image: "/",
        slug: "pozlacane",
      },
      {
        title: "srebrne",
        description: "",
        image: "/images/truck-one.webp",
        slug: "srebrne",
      },
      {
        title: "pozostałe",
        description: "The bearings that go in the wheels.",
        image: "/",
        slug: "pozostale",
      },
      {
        title: "wszystko w kategorii",
        description: "",
        image: "/",
        slug: "wszytko",
      },
    ],
  },
  {
    title: "kolczyki",
    image: "/",
    icon: Icons.gem,
    subcategories: [
      {
        title: "złote",
        description: "",
        slug: "zlote",
      },
      {
        title: "pozłacane",
        description: "",
        slug: "pozlacane",
      },
      {
        title: "srebrne",
        description: "",
        slug: "srebrne",
      },
      {
        title: "z diamentami",
        description: "",
        slug: "z-diamentami",
      },
      {
        title: "z kamieniami",
        description: "",
        slug: "z-kamieniami",
      },
      {
        title: "pozostale",
        description: "",
        slug: "pozostale",
      },
      {
        title: "wszystko w kategorii",
        description: "",
        slug: "wszystko",
      },
    ],
  },
  {
    title: "pierścionki",
    image: "/",
    icon: Icons.gem,
    subcategories: [
      {
        title: "złote",
        description: "",
        slug: "zlote",
      },
      {
        title: "srebrne",
        description: "",
        slug: "srebrne",
      },
      {
        title: "pozostałe",
        description: "",
        slug: "pozostale",
      },
      {
        title: "wszystko w kategorii",
        description: "",
        slug: "wszystko",
      },
    ],
  },
  {
    title: "inne",
    image: "/",
    icon: MixIcon,
    subcategories: [
      {
        title: "akcesoria",
        description: "",
        slug: "akcesoria",
      },
      {
        title: "zestawy",
        description: "",
        slug: "bushings",
      },
      {
        title: "pozostałe",
        description: "",
        slug: "pozostale",
      },
      {
        title: "wszystko",
        description: "",
        slug: "wszystko",
      },
    ],
  },
] satisfies Category[]

export const productTags = [
  "new",
  "sale",
  "bestseller",
  "featured",
  "popular",
  "trending",
  "limited",
  "exclusive",
]

export function getSubcategories(category?: string): Option[] {
  if (!category) return []

  const subcategories =
    productCategories
      .find((c) => c.title === category)
      ?.subcategories.map((s) => ({
        label: s.title,
        value: s.slug,
      })) ?? []

  return subcategories
}

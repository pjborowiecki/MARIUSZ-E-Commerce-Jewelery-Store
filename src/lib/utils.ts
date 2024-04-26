import type { StoredFile } from "@/types"
import { clsx, type ClassValue } from "clsx"
import { customAlphabet } from "nanoid"
import { twMerge } from "tailwind-merge"

import { env } from "@/env.mjs"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(
  bytes: number,
  decimals = 0,
  sizeType: "accurate" | "normal" = "normal"
) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"]
  if (bytes === 0) return "0 Byte"
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
  }`
}

export function formatDate(date: Date | string | number) {
  return new Intl.DateTimeFormat("pl-PL", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

export function formatPrice(
  price: number | string,
  options: {
    currency?: "USD" | "EUR" | "GBP" | "BDT" | "PLN"
    notation?: Intl.NumberFormatOptions["notation"]
  } = {}
) {
  const { currency = "PLN", notation = "compact" } = options

  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency,
    notation,
  }).format(Number(price))
}

export function formatId(id: string) {
  return `#${id.padStart(4, "0")}`
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`
}

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str
}

export function slugify(str: string): string {
  const polishChars: { [key: string]: string } = {
    ą: "a",
    ć: "c",
    ę: "e",
    ł: "l",
    ń: "n",
    ó: "o",
    ś: "s",
    ź: "z",
    ż: "z",
  }

  return str
    .split("")
    .map((char) => polishChars[char] || char)
    .join("")
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
}

export function unslugify(str: string): string {
  const polishCharsReverse: { [key: string]: string } = {
    a: "ą",
    c: "ć",
    e: "ę",
    l: "ł",
    n: "ń",
    o: "ó",
    s: "ś",
    z: "ź",
    z: "ż",
  }

  return str
    .replace(/-/g, " ") // Restore whitespace
    .split("")
    .map((char) => polishCharsReverse[char] || char)
    .join("")
}

export function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  )
}

export function translateFilterNamesToPolish(name: string): string {
  const nameTranslations: Record<string, string> = {
    orders: "zamówienia",
    customers: "klientów",
    products: "produkty",
    category: "kategorie",
    names: "nazwy",
  }

  return nameTranslations[name] || name
}

export function translateColumnNamesToPolish(name: string): string {
  const nameTranslations: Record<string, string> = {
    id: "Id",
    name: "Nazwa",
    email: "Email",
    role: "Rola",
    customer: "Klient",
    category: "Kategoria",
    categoryName: "Kategoria",
    subcategoryName: "Podkategoria",
    price: "Cena",
    status: "Status płatności",
    state: "Status",
    inventory: "Dostępność",
    quantity: "Ilość",
    amount: "Wartość",
    visibility: "Widoczność",
    createdAt: "Data dodania",
    updatedAt: "Data modyfikacji",
  }

  return nameTranslations[name] || name
}

export function toSentenceCase(str: string) {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
}

export function isArrayOfFile(files: unknown): files is File[] {
  const isArray = Array.isArray(files)
  if (!isArray) return false
  return files.every((file) => file instanceof File)
}

export function isMacOs() {
  if (typeof window === "undefined") return false

  return window.navigator.userAgent.includes("Mac")
}

export function generateId(length = 32) {
  return customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    length
  )()
}

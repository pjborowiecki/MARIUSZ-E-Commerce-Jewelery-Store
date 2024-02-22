import { Inter } from "next/font/google"
import localFont from "next/font/local"

export const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const fontHeading = localFont({
  src: "../../public/fonts/cal-sans-semi-bold.woff2",
  variable: "--font-heading",
})

"use client"

import * as React from "react"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"

import { carouselItems } from "@/data/carousel-items"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

export function HeroCarousel(): JSX.Element {
  const plugin = React.useRef(Autoplay({ stopOnInteraction: false }))

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full overflow-hidden rounded-lg"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {carouselItems.map((item, index) => (
          <CarouselItem key={index} className="overflow-hidden">
            <Card className="overflow-hidden rounded-lg border-none">
              <CardContent className="flex items-center justify-center p-0">
                <AspectRatio ratio={16 / 9}>
                  <Image
                    src={item.src}
                    fill
                    className="size-full object-cover"
                    alt={`hero carousel item ${index}`}
                  />
                </AspectRatio>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// TODO: Adjust the structure to the form
export default function UpdateSubcategoryLoading(): JSX.Element {
  return (
    <div className="px-2 py-5 sm:pl-14 sm:pr-6">
      <Card className="rounded-md bg-tertiary">
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-2/4" />
        </CardHeader>
        <CardContent>
          <div className="grid w-full gap-6">
            {/* Name */}
            <div className="w-full space-y-2.5 md:w-4/5 xl:w-2/3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6" />
            </div>

            {/* Description */}
            <div className="w-full space-y-2.5 md:w-4/5 xl:w-2/3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-[120px]" />
            </div>

            {/* Category and subcategory */}
            <div className="flex w-full gap-4 md:w-4/5 xl:w-2/3">
              <div className="w-full space-y-2.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6" />
              </div>
              <div className="w-full space-y-2.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6" />
              </div>
            </div>

            {/* Price and inventory */}
            <div className="flex w-full gap-4 md:w-4/5 xl:w-2/3">
              <div className="w-full space-y-2.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6" />
              </div>
              <div className="w-full space-y-2.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6" />
              </div>
            </div>

            {/* Images */}
            <div className="mt-2.5 flex w-full flex-col gap-[5px] md:w-4/5 xl:w-2/3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6" />
            </div>
          </div>
        </CardContent>

        {/* Buttons */}
        <CardFooter className="space-x-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
        </CardFooter>
      </Card>
    </div>
  )
}

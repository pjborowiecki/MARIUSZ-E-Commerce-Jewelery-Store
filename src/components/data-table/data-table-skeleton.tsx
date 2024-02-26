import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableSkeletonProps {
  columnCount: number
  rowCount?: number
  isNewRowCreatable?: boolean
  isRowsDeletable?: boolean
  searchableFieldCount?: number
  filterableFieldCount?: number
}

export function DataTableSkeleton({
  columnCount,
  rowCount = 10,
  isNewRowCreatable = false,
  isRowsDeletable = false,
  searchableFieldCount = 1,
  filterableFieldCount = 1,
}: DataTableSkeletonProps) {
  return <div></div>
}

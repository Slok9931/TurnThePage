import { Table, TableBody, TableHead, TableHeader, TableRow } from "./ui/table"

interface SkeletonProps {
  booksPerPage: number
}

export const GridSkeleton = ({ booksPerPage }: SkeletonProps) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(booksPerPage)].map((_, i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
        ))}
    </div>
)

export const TableSkeleton = ({ booksPerPage }: SkeletonProps) => (
    <div className="border rounded-lg">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Genre</TableHead>
                    <TableHead className="text-center">Year</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {[...Array(booksPerPage)].map((_, i) => (
                    <TableRow key={i}>
                        <td className="p-4">
                            <div className="h-4 bg-muted animate-pulse rounded w-32" />
                        </td>
                        <td className="p-4">
                            <div className="h-4 bg-muted animate-pulse rounded w-24" />
                        </td>
                        <td className="p-4">
                            <div className="h-4 bg-muted animate-pulse rounded w-20" />
                        </td>
                        <td className="p-4">
                            <div className="h-4 bg-muted animate-pulse rounded w-16 mx-auto" />
                        </td>
                        <td className="p-4">
                            <div className="h-4 bg-muted animate-pulse rounded w-48" />
                        </td>
                        <td className="p-4">
                            <div className="h-4 bg-muted animate-pulse rounded w-20 ml-auto" />
                        </td>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
)
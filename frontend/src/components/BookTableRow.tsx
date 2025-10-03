import { Link } from 'react-router-dom'
import { Calendar, ExternalLink, Star } from 'lucide-react'
import type { Book } from '../types'
import { TableCell, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

interface BookTableRowProps {
    book: Book
}

export const BookTableRow = ({ book }: BookTableRowProps) => {
    return (
        <TableRow className="hover:bg-muted/50">
            <TableCell className="font-medium">
                <Link to={`/book/${book._id}`} className="hover:text-primary hover:underline">
                    {book.title}
                </Link>
            </TableCell>
            <TableCell>{book.author}</TableCell>
            <TableCell className='min-w-52'>
                <Badge variant="secondary" className="text-xs">
                    {book.genre}
                </Badge>
            </TableCell>
            <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span className="text-sm">{book.publishedYear}</span>
                </div>
            </TableCell>
            <TableCell className="text-center">
                {book.averageRating !== undefined && book.averageRating > 0 ? (
                    <div className="flex items-center justify-center gap-1">
                        <Star className="h-3 w-3 text-primary fill-primary" />
                        <span className="text-sm font-medium">{book.averageRating.toFixed(1)}</span>
                    </div>
                ) : (
                    <span className="text-xs text-muted-foreground">No ratings</span>
                )}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground max-w-xs">
                <div className="truncate" title={book.description}>
                    {book.description}
                </div>
            </TableCell>
            <TableCell className="text-right">
                <Link to={`/book/${book._id}`}>
                    <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                    </Button>
                </Link>
            </TableCell>
        </TableRow>
    )
}

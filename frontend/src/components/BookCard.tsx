import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import type { Book } from '../types'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import { Badge } from './ui/badge'

interface BookCardProps {
  book: Book;
}

export const BookCard = ({ book }: BookCardProps) => {
  return (
    <Link to={`/book/${book._id}`}>
      <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer">
        <CardHeader className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg line-clamp-2 flex-1">{book.title}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{book.publishedYear}</span>
          </div>
          </div>
          <p className="text-sm text-muted-foreground">{book.author}</p>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">{book.description}</p>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Badge variant="secondary">{book.genre}</Badge>
        </CardFooter>
      </Card>
    </Link>
  );
};

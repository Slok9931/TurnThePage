import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Star } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Book } from '@/types';

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
            <BookOpen className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
          </div>
          <p className="text-sm text-muted-foreground">{book.author}</p>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">{book.description}</p>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Badge variant="secondary">{book.genre}</Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{book.publishedYear}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

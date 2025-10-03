import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BookOpen, Calendar, User, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { booksApi } from '../api/books'
import { reviewsApi } from '../api/reviews'
import { useAuth } from '../hooks/useAuth'
import type { Book } from '../types/book.types'
import type { Review, ReviewStats } from '../types/review.types'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Label } from '../components/ui/label'
import { StarRating } from '../components/StarRating'
import { Textarea } from '../components/ui/textarea'
import { ReviewCard } from '../components/ReviewCard'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog'

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBookData();
    }
  }, [id]);

  const fetchBookData = async () => {
    if (!id) return;
    try {
      const [bookData, reviewsData, statsData] = await Promise.all([
        booksApi.getBookById(id),
        reviewsApi.getReviewsForBook(id),
        reviewsApi.getBookReviewStats(id),
      ]);
      setBook(bookData);
      setReviews(reviewsData);
      setStats(statsData);
    } catch (error) {
      toast.error('Failed to load book details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !user) return;

    setSubmitting(true);
    try {
      if (editingReview) {
        await reviewsApi.editReview(editingReview._id, { rating, reviewText });
        toast.success('Review updated successfully');
      } else {
        await reviewsApi.addReview(id, { rating, reviewText });
        toast.success('Review added successfully');
      }
      setRating(5);
      setReviewText('');
      setEditingReview(null);
      fetchBookData();
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setRating(review.rating);
    setReviewText(review.reviewText);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await reviewsApi.deleteReview(reviewId);
      toast.success('Review deleted successfully');
      fetchBookData();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  const handleDeleteBook = async () => {
    if (!id) return;
    try {
      await booksApi.deleteBook(id);
      toast.success('Book deleted successfully');
      navigate('/home');
    } catch (error) {
      toast.error('Failed to delete book');
    }
  };

  const isBookOwner = user && book && typeof book.addedBy === 'object' && book.addedBy._id === user._id;

  if (loading) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="h-64 bg-muted animate-pulse rounded-lg" />
          <div className="h-96 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Book not found</p>
          <Link to="/home">
            <Button className="mt-4">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-8 w-8 text-primary" />
                  <CardTitle className="text-3xl">{book.title}</CardTitle>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{book.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{book.publishedYear}</span>
                  </div>
                  <Badge variant="secondary">{book.genre}</Badge>
                </div>
              </div>
              {isBookOwner && (
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => navigate(`/edit-book/${book._id}`)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setShowDeleteDialog(true)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{book.description}</p>
            </div>
            {stats && (
              <div className="flex items-center gap-6 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                  <p className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Reviews</p>
                  <p className="text-2xl font-bold">{stats.totalReviews}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {user && (
          <Card>
            <CardHeader>
              <CardTitle>{editingReview ? 'Edit Review' : 'Write a Review'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="space-y-2">
                  <Label>Your Rating</Label>
                  <StarRating rating={rating} onRatingChange={setRating} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="review">Your Review</Label>
                  <Textarea
                    id="review"
                    placeholder="Share your thoughts about this book..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                    rows={10}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Submitting...' : editingReview ? 'Update Review' : 'Submit Review'}
                  </Button>
                  {editingReview && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingReview(null);
                        setRating(1);
                        setReviewText('');
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Reviews</h2>
          {reviews.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  currentUserId={user?._id}
                  onEdit={handleEditReview}
                  onDelete={handleDeleteReview}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Book</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this book? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBook}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BookDetail;

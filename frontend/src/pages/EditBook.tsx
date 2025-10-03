import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { booksApi } from '../api/books'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'

const EditBook = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    genre: '',
    publishedYear: new Date().getFullYear(),
  });

  useEffect(() => {
    if (id) {
      fetchBook();
    }
  }, [id]);

  const fetchBook = async () => {
    if (!id) return;
    try {
      const book = await booksApi.getBookById(id);
      setFormData({
        title: book.title,
        author: book.author,
        description: book.description,
        genre: book.genre,
        publishedYear: book.publishedYear,
      });
    } catch (error) {
      toast.error('Failed to load book');
      navigate('/home');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setLoading(true);
    try {
      await booksApi.updateBook(id, formData);
      toast.success('Book updated successfully');
      navigate(`/book/${id}`);
    } catch (error) {
      toast.error('Failed to update book');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'publishedYear' ? parseInt(value) : value,
    }));
  };

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Edit Book</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="genre">Genre</Label>
                <Input
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="publishedYear">Published Year</Label>
                <Input
                  id="publishedYear"
                  name="publishedYear"
                  type="number"
                  min="1000"
                  max={new Date().getFullYear()}
                  value={formData.publishedYear}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={10}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Updating...' : 'Update Book'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditBook;

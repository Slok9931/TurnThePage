import { useState, useEffect } from 'react'
import { Edit, BookOpen } from 'lucide-react'
import { toast } from 'sonner'
import { booksApi } from '../api/books'
import type { Book } from '../types/index'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './ui/dialog'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

interface EditBookDialogProps {
    book: Book
    onBookUpdated?: () => void
    trigger?: React.ReactNode
}

const EditBookDialog = ({ book, onBookUpdated, trigger }: EditBookDialogProps) => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        genre: '',
        publishedYear: new Date().getFullYear(),
    })

    // Initialize form data when dialog opens or book changes
    useEffect(() => {
        if (book) {
            setFormData({
                title: book.title || '',
                author: book.author || '',
                description: book.description || '',
                genre: book.genre || '',
                publishedYear: book.publishedYear || new Date().getFullYear(),
            })
        }
    }, [book])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!book._id) return
        
        setLoading(true)
        try {
            await booksApi.updateBook(book._id, formData)
            toast.success('Book updated successfully')
            setOpen(false)
            // Notify parent to refresh the book data
            onBookUpdated?.()
        } catch (error) {
            toast.error('Failed to update book')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'publishedYear' ? parseInt(value) : value,
        }))
    }

    const handleCancel = () => {
        setOpen(false)
        // Reset form data to original book data
        setFormData({
            title: book.title || '',
            author: book.author || '',
            description: book.description || '',
            genre: book.genre || '',
            publishedYear: book.publishedYear || new Date().getFullYear(),
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <BookOpen className="h-5 w-5 text-primary" />
                        Edit Book Details
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    {/* Title Field */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-title" className="text-sm font-semibold">
                            Book Title
                        </Label>
                        <Input
                            id="edit-title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter the book title"
                            className="h-11"
                            required
                        />
                    </div>

                    {/* Author and Year Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-author" className="text-sm font-semibold">
                                Author
                            </Label>
                            <Input
                                id="edit-author"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                placeholder="Enter author name"
                                className="h-11"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-publishedYear" className="text-sm font-semibold">
                                Published Year
                            </Label>
                            <Input
                                id="edit-publishedYear"
                                name="publishedYear"
                                type="number"
                                min="1000"
                                max={new Date().getFullYear()}
                                value={formData.publishedYear}
                                onChange={handleChange}
                                placeholder="2024"
                                className="h-11"
                                required
                            />
                        </div>
                    </div>

                    {/* Genre Field */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-genre" className="text-sm font-semibold">
                            Genre
                        </Label>
                        <Input
                            id="edit-genre"
                            name="genre"
                            value={formData.genre}
                            onChange={handleChange}
                            placeholder="e.g., Fiction, Science Fiction, Romance"
                            className="h-11"
                            required
                        />
                    </div>

                    {/* Description Field */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-description" className="text-sm font-semibold">
                            Description
                        </Label>
                        <Textarea
                            id="edit-description"
                            name="description"
                            rows={10}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Tell us about this book... What makes it special? What's the story about?"
                            className="resize-none"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            className="flex-1"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 font-semibold"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Updating...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Edit className="h-4 w-4" />
                                    Update Book
                                </div>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditBookDialog

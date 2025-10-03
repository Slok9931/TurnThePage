import { useState } from 'react'
import { PlusCircle, BookOpen } from 'lucide-react'
import { toast } from 'sonner'
import { booksApi } from '../api/books'
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

interface AddBookDialogProps {
    onBookAdded?: () => void
}

const AddBookDialog = ({ onBookAdded }: AddBookDialogProps) => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        genre: '',
        publishedYear: new Date().getFullYear(),
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await booksApi.addBook(formData)
            toast.success('Book added successfully')
            setOpen(false)
            // Reset form
            setFormData({
                title: '',
                author: '',
                description: '',
                genre: '',
                publishedYear: new Date().getFullYear(),
            })
            // Notify parent to refresh the books list
            onBookAdded?.()
        } catch (error) {
            toast.error('Failed to add book')
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add New Book
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <BookOpen className="h-5 w-5 text-primary" />
                        Add New Book
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    {/* Title Field */}
                    <div className="space-y-2">
                        <Label htmlFor="dialog-title" className="text-sm font-semibold">
                            Book Title
                        </Label>
                        <Input
                            id="dialog-title"
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
                            <Label htmlFor="dialog-author" className="text-sm font-semibold">
                                Author
                            </Label>
                            <Input
                                id="dialog-author"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                placeholder="Enter author name"
                                className="h-11"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dialog-publishedYear" className="text-sm font-semibold">
                                Published Year
                            </Label>
                            <Input
                                id="dialog-publishedYear"
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
                        <Label htmlFor="dialog-genre" className="text-sm font-semibold">
                            Genre
                        </Label>
                        <Input
                            id="dialog-genre"
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
                        <Label htmlFor="dialog-description" className="text-sm font-semibold">
                            Description
                        </Label>
                        <Textarea
                            id="dialog-description"
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
                            onClick={() => setOpen(false)}
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
                                    Adding...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <PlusCircle className="h-4 w-4" />
                                    Add Book
                                </div>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AddBookDialog

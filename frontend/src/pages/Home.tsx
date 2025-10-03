import { useState, useEffect } from 'react'
import { Search, Grid3X3, List, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Book } from '../types'
import { booksApi } from '../api/books'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { BookCard } from '../components/BookCard'
import { BookTableRow } from '../components/BookTableRow'

type ViewMode = 'grid' | 'table'

const Home = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [genreFilter, setGenreFilter] = useState('')
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalBooks, setTotalBooks] = useState(0)
  const [booksPerPage, setBooksPerPage] = useState(10) // Default books per page
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchBooks(true) // Reset books when filters change
  }, [searchTerm, genreFilter, booksPerPage])

  const fetchBooks = async (reset = false, page = 1) => {
    try {
      if (reset) {
        setLoading(true)
        setBooks([])
        setCurrentPage(1)
      } else {
        setLoadingMore(true)
      }

      const params = {
        page,
        limit: booksPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(genreFilter && genreFilter !== 'all' && { genre: genreFilter })
      }

      const data = await booksApi.getBooks(params.page, params.limit)
      
      if (reset || viewMode === 'table') {
        // For table view or reset, replace books
        setBooks(Array.isArray(data) ? data : data.books || [])
      } else {
        // For grid view, append books (load more functionality)
        const newBooks = Array.isArray(data) ? data : data.books || []
        setBooks(prevBooks => [...prevBooks, ...newBooks])
      }

      // Update pagination info
      if (data && !Array.isArray(data)) {
        setTotalBooks(data.total || 0)
        setTotalPages(Math.ceil((data.total || 0) / booksPerPage))
        setHasMore(page < Math.ceil((data.total || 0) / booksPerPage))
      } else {
        const bookCount = Array.isArray(data) ? data.length : 0
        setHasMore(bookCount === booksPerPage) // Assume more if we got full page
      }

    } catch (error) {
      toast.error('Failed to load books')
      console.error('Error fetching books:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = Math.floor(books.length / booksPerPage) + 1
      fetchBooks(false, nextPage)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchBooks(true, page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBooksPerPageChange = (value: string) => {
    setBooksPerPage(parseInt(value))
    setCurrentPage(1)
  }

  const filteredBooks = books.filter(
    (book) =>
      (book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (genreFilter === '' || genreFilter === 'all' || book.genre.toLowerCase() === genreFilter.toLowerCase())
  )

  // Get unique genres for filter - fix empty values
  const genres = [...new Set(books.map((book: Book) => book.genre).filter(genre => genre && genre.trim() !== ''))]

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
          Discover Books
        </h1>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-3xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by title, author, or genre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={genreFilter} onValueChange={setGenreFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Genres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  {genres.length > 0 ? (
                    genres.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-genres" disabled>
                      No Genres Available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>

              {/* Books per page selector */}
              <Select value={booksPerPage.toString()} onValueChange={handleBooksPerPageChange}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="75">75</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="flex items-center gap-2"
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="hidden sm:inline">Grid</span>
            </Button>
            <Button
              variant={viewMode === 'table' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="flex items-center gap-2"
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Table</span>
            </Button>
          </div>
        </div>

        {/* Results summary */}
        {!loading && (
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>
              Showing {filteredBooks.length} of {totalBooks} books
              {searchTerm && <span> for "{searchTerm}"</span>}
              {genreFilter && genreFilter !== 'all' && <span> in "{genreFilter}"</span>}
            </span>
            {viewMode === 'table' && totalPages > 1 && (
              <span>Page {currentPage} of {totalPages}</span>
            )}
          </div>
        )}
      </div>

      {loading ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        )
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            {searchTerm || (genreFilter && genreFilter !== 'all') ? 'No books found matching your criteria' : 'No books available yet'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
          
          {/* Load More Button for Grid View */}
          {hasMore && !loadingMore && (
            <div className="flex justify-center">
              <Button 
                onClick={handleLoadMore}
                variant="outline"
                size="lg"
                className="px-8"
              >
                Load More Books
              </Button>
            </div>
          )}
          
          {/* Loading More Indicator */}
          {loadingMore && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading more books...</span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
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
                {filteredBooks.map((book) => (
                  <BookTableRow key={book._id} book={book} />
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination for Table View */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {getPageNumbers().map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="w-10 h-10"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Home

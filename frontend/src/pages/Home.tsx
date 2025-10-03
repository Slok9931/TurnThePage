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

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalBooks: number
  hasNext: boolean
  hasPrev: boolean
  limit: number
  skip: number
}

const Home = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [genreFilter, setGenreFilter] = useState('')
  const [booksPerPage, setBooksPerPage] = useState(12) // Default books per page
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 0,
    totalBooks: 0,
    hasNext: false,
    hasPrev: false,
    limit: 10,
    skip: 0
  })

  useEffect(() => {
    fetchBooks(true) // Reset books when filters change
  }, [searchTerm, genreFilter, booksPerPage])

  const fetchBooks = async (reset = false, page = 1) => {
    try {
      if (reset) {
        setLoading(true)
        setBooks([])
      } else {
        setLoadingMore(true)
      }

      let response: { books: Book[]; pagination: PaginationInfo };
      
      if (viewMode === 'table' || reset) {
        // For table view or reset, use page-based pagination
        response = await booksApi.getBooks(
          page,
          booksPerPage,
          searchTerm || undefined,
          genreFilter && genreFilter !== 'all' ? genreFilter : undefined
        )
        setBooks(response.books)
      } else {
        // For grid view load more, use skip-based pagination
        const currentSkip = books.length
        response = await booksApi.getBooks(
          1,
          booksPerPage,
          searchTerm || undefined,
          genreFilter && genreFilter !== 'all' ? genreFilter : undefined,
          currentSkip
        )
        setBooks(prevBooks => [...prevBooks, ...response.books])
      }

      setPagination(response.pagination)

    } catch (error) {
      toast.error('Failed to load books')
      console.error('Error fetching books:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleLoadMore = () => {
    if (!loadingMore && pagination.hasNext) {
      fetchBooks(false)
    }
  }

  const handlePageChange = (page: number) => {
    fetchBooks(true, page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBooksPerPageChange = (value: string) => {
    setBooksPerPage(parseInt(value))
  }

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
    // Reset books when changing view mode to ensure proper pagination
    fetchBooks(true)
  }

  // Get unique genres for filter
  const genres = [...new Set(books.map((book: Book) => book.genre).filter(genre => genre && genre.trim() !== ''))]

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5
    const startPage = Math.max(1, pagination.currentPage - Math.floor(maxPagesToShow / 2))
    const endPage = Math.min(pagination.totalPages, startPage + maxPagesToShow - 1)

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
  }

  // Loading skeletons
  const GridSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(booksPerPage)].map((_, i) => (
        <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
      ))}
    </div>
  )

  const TableSkeleton = () => (
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
                  <SelectItem value="25">25</SelectItem>
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
              onClick={() => handleViewModeChange('grid')}
              className="flex items-center gap-2"
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="hidden sm:inline">Grid</span>
            </Button>
            <Button
              variant={viewMode === 'table' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => handleViewModeChange('table')}
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
              {viewMode === 'grid'
                ? `Showing ${books.length} of ${pagination.totalBooks} books`
                : `Showing ${((pagination.currentPage - 1) * pagination.limit) + 1} to ${Math.min(pagination.currentPage * pagination.limit, pagination.totalBooks)} of ${pagination.totalBooks} books`
              }
              {searchTerm && <span> for "{searchTerm}"</span>}
              {genreFilter && genreFilter !== 'all' && <span> in "{genreFilter}"</span>}
            </span>
            {viewMode === 'table' && pagination.totalPages > 1 && (
              <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
            )}
          </div>
        )}
      </div>

      {loading ? (
        viewMode === 'grid' ? <GridSkeleton /> : <TableSkeleton />
      ) : books.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            {searchTerm || (genreFilter && genreFilter !== 'all') ? 'No books found matching your criteria' : 'No books available yet'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={`${book._id}-${book.title}`} book={book} />
            ))}
          </div>
          
          {/* Load More Button for Grid View */}
          {pagination.hasNext && (
            <div className="flex justify-center">
              <Button 
                onClick={handleLoadMore}
                variant="outline"
                size="lg"
                className="px-8"
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading More...
                  </>
                ) : (
                  'Load More Books'
                )}
              </Button>
            </div>
          )}
          
          {/* Loading More Shimmer */}
          {loadingMore && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(booksPerPage)].map((_, i) => (
                <div key={`loading-${i}`} className="h-64 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {loadingMore ? (
            <TableSkeleton />
          ) : (
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
                  {books.map((book) => (
                    <BookTableRow key={book._id} book={book} />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination for Table View */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev || loadingMore}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {getPageNumbers().map((page) => (
                  <Button
                    key={page}
                    variant={pagination.currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    disabled={loadingMore}
                    className="w-10 h-10"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext || loadingMore}
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

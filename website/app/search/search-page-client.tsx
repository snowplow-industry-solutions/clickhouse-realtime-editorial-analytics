"use client"

import { useEffect, useState, useRef } from "react"
import PageLayout from "../components/page-layout"
import MainContentLayout from "../components/main-content-layout"
import PageHeader from "../components/page-header"
import ArticleGrid from "../components/article-grid"
import { Search } from "lucide-react"
import { searchArticles } from "@/website/lib/data"
import { trackFullSearch } from "@/website/lib/snowplow-tracking"

interface SearchPageClientProps {
  query: string
}

export default function SearchPageClient({ query }: SearchPageClientProps) {
  const [filteredArticles, setFilteredArticles] = useState<any[]>([])
  const lastTrackedQueryRef = useRef<string>("")

  useEffect(() => {
    const articles = searchArticles(query)
    setFilteredArticles(articles)

          // Track full search only once per unique query
      if (query.trim() && query !== lastTrackedQueryRef.current) {
        console.log('Tracking full search for query:', query, 'with', articles.length, 'results');
        trackFullSearch(
          query,
          articles.length,
          articles.map((article, index) => ({
            id: article.id,
            title: article.title,
            author: article.author,
            category: article.category,
            position: index + 1
          }))
        );
        lastTrackedQueryRef.current = query
      }
  }, [query])

  return (
    <PageLayout>
      <MainContentLayout>
        <PageHeader 
          title="Search Results" 
          description={
            filteredArticles.length > 0
              ? `Found ${filteredArticles.length} article${filteredArticles.length === 1 ? "" : "s"} for "${query}"`
              : `No results found for "${query}"`
          }
        />

        {/* Search Results */}
        <div>
        {filteredArticles.length > 0 ? (
          <ArticleGrid articles={filteredArticles} />
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600 mb-6">
                We couldn&apos;t find any articles matching &quot;{query}&quot;. Try searching with different keywords.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>Suggestions:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Check your spelling</li>
                <li>Try more general keywords</li>
                <li>Search for author names or categories</li>
              </ul>
            </div>
          </div>
        )}
        </div>
      </MainContentLayout>
    </PageLayout>
  )
} 
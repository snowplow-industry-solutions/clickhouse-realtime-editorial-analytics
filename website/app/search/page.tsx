import type { Metadata } from "next";
import { Suspense } from "react"
import SearchPageClient from "./search-page-client"

export const metadata: Metadata = {
  title: "Search | The Powder Post",
  description: "Search through our collection of articles and insights",
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

function SearchResults({ query }: { query: string }) {
  return <SearchPageClient query={query} />
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const query = q || ""

  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <SearchResults query={query} />
    </Suspense>
  )
}

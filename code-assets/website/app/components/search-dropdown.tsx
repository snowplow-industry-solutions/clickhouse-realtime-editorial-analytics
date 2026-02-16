"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, Clock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { allArticles } from "@/website/lib/data"
import { getCategoryColor } from "@/website/lib/utils"
import { trackQuickSearch } from "@/website/lib/snowplow-tracking"

export default function SearchDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredArticles, setFilteredArticles] = useState(allArticles)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredArticles([])
      setIsOpen(false)
    } else {
      const filtered = allArticles
        .filter((article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 5)
      setFilteredArticles(filtered)
      setIsOpen(true)
    }
  }, [searchTerm])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleInputFocus = () => {
    if (searchTerm.trim() !== "") {
    setIsOpen(true)
    }
  }

  const handleArticleClick = (article: any) => {
    // Track quick search selection
    trackQuickSearch(searchTerm, {
      id: article.id,
      title: article.title,
      author: article.author,
      category: article.category,
      position: filteredArticles.findIndex(a => a.id === article.id) + 1
    });
    
    setIsOpen(false)
    setSearchTerm("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      e.preventDefault()
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
      setIsOpen(false)
      setSearchTerm("")
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
        />
      </div>

      {isOpen && searchTerm.trim() !== "" && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
          <div className="py-2">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
              <Link key={article.id} href={`/articles/${article.slug}`} onClick={() => handleArticleClick(article)}>
                <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2 flex-1 mr-2">{article.title}</h4>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded whitespace-nowrap ${getCategoryColor(article.category)}`}
                    >
                      {article.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{article.author}</span>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {article.readTime} min read
                    </div>
                  </div>
                </div>
              </Link>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">No articles found for &quot;{searchTerm}&quot;</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

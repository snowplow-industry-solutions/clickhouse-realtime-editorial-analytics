"use client"

import { useEffect, useRef, useState } from "react"
import PageLayout from "../../components/page-layout"
import MainContentLayout from "../../components/main-content-layout"
import Sidebar from "../../components/sidebar"
import SubscriptionModal from "../../components/subscription-modal"
import { Clock, User, Calendar } from "lucide-react"
import { formatDate } from "@/website/lib/utils"
import Image from "next/image"
import { trackArticleView } from "@/website/lib/snowplow-tracking"
import { useUser } from "../../contexts/user-context"

interface Article {
  id: string
  title: string
  excerpt: string
  content?: string
  author: string
  date: string
  readTime: number
  category: string
  image?: string
  slug?: string
}

interface ArticlePageClientProps {
  article: Article
}

// Global tracking registry to prevent duplicates across component instances
const trackedArticles = new Set<string>();

export default function ArticlePageClient({ article }: ArticlePageClientProps) {
  const hasTrackedRef = useRef(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [userArticleCount, setUserArticleCount] = useState(0);
  const hasCheckedSubscriptionRef = useRef(false);
  const { user } = useUser();

  // Track article view when component mounts
  useEffect(() => {
    console.log('Article client effect triggered for:', article.title, '(ID:', article.id, ')', 'hasTracked:', hasTrackedRef.current, 'global tracked:', trackedArticles.has(article.id));
    
    // Track article view only once per article globally and only on client side
    if (article.id && !hasTrackedRef.current && !trackedArticles.has(article.id) && typeof window !== 'undefined') {
      console.log('Tracking article view for:', article.title, '(ID:', article.id, ')');
      
      // Mark as tracked immediately to prevent race conditions
      hasTrackedRef.current = true;
      trackedArticles.add(article.id);
      
      // Add a small delay to ensure Snowplow is fully initialized
      setTimeout(() => {
        trackArticleView({
          id: article.id,
          title: article.title,
          author: article.author,
          category: article.category,
          article_id: article.id
        });
      }, 100);
    }
  }, [article.id]);

  return (
    <PageLayout>
      <MainContentLayout sidebar={<Sidebar category={article.category} />} advertising={{ inArticle: true }}>
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Article Header */}
          <Image src={article.image || "/placeholder.svg"} alt={article.title} className="w-full h-64 object-cover" width={1200} height={256} />

          <div className="p-8">
            {/* Category and Meta Info */}
            <div className="flex items-center justify-between mb-4">
              <span
                className={`inline-block px-3 py-1 text-sm font-semibold rounded ${
                  article.category === "Technology"
                    ? "bg-green-100 text-green-800"
                    : article.category === "Business"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-purple-100 text-purple-800"
                }`}
              >
                {article.category}
              </span>
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="h-4 w-4 mr-1" />
                {article.readTime} min read
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>

            {/* Author and Date */}
            <div className="flex items-center text-gray-600 mb-6">
              <User className="h-4 w-4 mr-2" />
              <span className="mr-4">{article.author}</span>
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDate(article.date)}</span>
            </div>

            {/* Article Content */}
            <div className="article-content">
              {article.content ? (
                <div 
                  className="article-content"
                  dangerouslySetInnerHTML={{ __html: article.content }} 
                />
              ) : (
                <div>
                  <p className="text-gray-700 leading-relaxed">{article.excerpt}</p>
                  <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 italic">Full article content coming soon...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>
      </MainContentLayout>

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        articlesRead={userArticleCount}
        isBlocking={true}
      />
    </PageLayout>
  )
} 
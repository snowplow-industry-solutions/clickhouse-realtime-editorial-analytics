import ArticleCard from "./article-card"
import { Article } from "@/website/lib/config"

interface ArticleGridProps {
  articles: Article[]
  className?: string
}

export default function ArticleGrid({ articles, className = "" }: ArticleGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  )
} 
import Link from "next/link"
import { Clock, User } from "lucide-react"
import { getCategoryColor, formatDateShort } from "@/website/lib/utils"
import Image from "next/image"

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

interface ArticleCardProps {
  article: Article
}

// Function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function ArticleCard({ article }: ArticleCardProps) {
  // Map article titles to their slugs
  const slugMap: { [key: string]: string } = {
    "The Future of Artificial Intelligence in Journalism": "future-ai-journalism",
    "Breaking: Major Tech Companies Announce Climate Initiative": "tech-companies-climate-initiative",
    "The Rise of Independent Media Platforms": "independent-media-platforms",
    "Cybersecurity Trends to Watch in 2024": "cybersecurity-trends-2024",
    "Digital Privacy in the Modern Age": "digital-privacy-modern-age",
    "Machine Learning in Healthcare": "machine-learning-healthcare",
    "Startup Funding Reaches Record High in Q4 2023": "startup-funding-reaches-record-high-in-q4-2023",
  }

  const slug = article.slug || slugMap[article.title] || generateSlug(article.title)

  return (
    <Link href={`/articles/${slug}`}>
      <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        <Image src={article.image || "/placeholder.svg"} alt={article.title} className="w-full h-48 object-cover" width={600} height={192} />
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span
              className={`inline-block px-2 py-1 text-xs font-semibold rounded ${getCategoryColor(article.category)}`}
            >
              {article.category}
            </span>
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="h-4 w-4 mr-1" />
              {article.readTime} min read
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-brand-primary transition-colors">
            {article.title}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{article.excerpt}</p>

          <div className="flex items-center text-sm text-gray-500 mt-auto">
            <User className="h-4 w-4 mr-1" />
            <span className="mr-2">{article.author}</span>
            <span>•</span>
            <span className="ml-2">{formatDateShort(article.date)}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

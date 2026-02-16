import Link from "next/link"
import { Clock } from "lucide-react"
import { getCategoryColor } from "@/website/lib/utils"

interface Recommendation {
  id: string
  title: string
  author: string
  readTime: number
  category: string
  slug?: string
}

interface RecommendationCardProps {
  recommendation: Recommendation
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function RecommendationCard({ recommendation }: RecommendationCardProps) {
  // Map recommendation titles to their slugs
  const slugMap: { [key: string]: string } = {
    "Digital Privacy in the Modern Age": "digital-privacy-modern-age",
    "The Evolution of Social Media": "evolution-social-media",
    "Blockchain Beyond Cryptocurrency": "blockchain-beyond-crypto",
    "Machine Learning in Healthcare": "machine-learning-healthcare",
    "Remote Work Technology Trends": "remote-work-tech-trends",
  }

  const slug = recommendation.slug || slugMap[recommendation.title] || generateSlug(recommendation.title)

  return (
    <Link href={`/articles/${slug}`}>
      <div className="border-b-2 border-gray-100 last:border-b-0 last:pb-0 last:mb-0 hover:bg-gray-50 p-3 -m-3 rounded transition-colors cursor-pointer mb-2.5 mt-2.5 pb-6 pt-3">
        <div className="flex justify-between mb-px items-center">
          <h4 className="text-sm font-medium text-gray-900 hover:text-brand-primary cursor-pointer line-clamp-2 flex-1 mr-2 transition-colors">
            {recommendation.title}
          </h4>
          <span
            className={`inline-block px-2 py-1 text-xs font-semibold rounded whitespace-nowrap ${getCategoryColor(recommendation.category)}`}
          >
            {recommendation.category}
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-500 items-center">
          <span>{recommendation.author}</span>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {recommendation.readTime} min read
          </div>
        </div>
      </div>
    </Link>
  )
}

import type { Metadata } from "next";
import { notFound } from "next/navigation"
import { getArticleBySlug } from "@/website/lib/data"
import ArticlePageClient from "./article-page-client"

interface PageProps {
  params: Promise<{ slug: string }>
}

// Generate metadata for article pages
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  
  if (!article) {
    return {
      title: "Article Not Found"
    }
  }

  return {
    title: `${article.title} | The Daily Query`,
    description: article.excerpt,
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return notFound()

    return <ArticlePageClient article={article} />
}

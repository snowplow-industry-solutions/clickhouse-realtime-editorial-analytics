"use client"

import PageLayout from "../components/page-layout"
import MainContentLayout from "../components/main-content-layout"
import PageHeader from "../components/page-header"
import ArticleGrid from "../components/article-grid"
import { getArticlesByCategory } from "@/website/lib/data"
import { useEffect } from "react"
import { trackArticleImpression } from "@/website/lib/snowplow-tracking"

const technologyArticles = getArticlesByCategory("Technology")

export default function TechnologyPage() {
    useEffect(() => {
      // Track impressions after component mounts (client-side)
      setTimeout(() => {
        let article_position = 1;
        technologyArticles.forEach((article) => {
          console.log('Tracking impression:', article.title);
          trackArticleImpression(article, article_position)
          article_position++;
        })
      }, 100)
    }, [])
  
  return (
    <PageLayout>
      <MainContentLayout advertising={{ sponsored: true, category: "Technology" }}>
        <PageHeader 
          title="Technology" 
          description="Latest technology news, product launches, and industry insights" 
        />

        {/* Articles Grid */}
        <ArticleGrid articles={technologyArticles} />
      </MainContentLayout>
    </PageLayout>
  )
}

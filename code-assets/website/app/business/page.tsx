"use client"

import PageLayout from "../components/page-layout"
import MainContentLayout from "../components/main-content-layout"
import PageHeader from "../components/page-header"
import ArticleGrid from "../components/article-grid"
import { getArticlesByCategory } from "@/website/lib/data"
import { siteConfig } from "@/website/lib/config"
import { trackArticleImpression } from "@/website/lib/snowplow-tracking";
import { useEffect } from "react";

const businessArticles = getArticlesByCategory("Business")


export default function BusinessPage() {
  useEffect(() => {
    // Track impressions after component mounts (client-side)
    setTimeout(() => {
      let article_position = 1;
      businessArticles.forEach((article) => {
        console.log('Tracking impression:', article.title);
        trackArticleImpression(article, article_position)
        article_position++;
      })
    }, 100)
  }, [])


  return (
    <PageLayout>
      <MainContentLayout advertising={{ sponsored: true, category: "Business" }}>
        <PageHeader
          title="Business"
          description="Latest business news, market insights, and industry trends"
        />

        {/* Articles Grid */}
        <ArticleGrid articles={businessArticles} />
      </MainContentLayout>
    </PageLayout>
  )
}

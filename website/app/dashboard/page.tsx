"use client"

import { useState, useCallback } from "react"
import PageLayout from "../components/page-layout"
import { RefreshCw, TrendingUp, Layers, Megaphone, AlertCircle } from "lucide-react"

interface TrendingArticle {
  article_title: string
  article_category: string
  impressions: number
  views: number
  total_article_views: number
  avg_scroll_depth_pct: number
  total_engaged_time_seconds: number
}

interface TrendingCategory {
  category: string
  impressions: number
  views: number
  total_article_views: number
  avg_scroll_depth_pct: number
  total_engaged_time_seconds: number
}

interface AdPerformance {
  ad_id: string
  advertiser_id: string
  campaign_id: string
  impressions: number
  clicks: number
  ad_ctr: number
}

interface DashboardData {
  trendingArticles: TrendingArticle[]
  trendingCategories: TrendingCategory[]
  adPerformance: AdPerformance[]
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  const fetchDashboardData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/dashboard')
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch dashboard data')
      }

      setData(result.data)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching data')
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'AI': 'bg-blue-100 text-blue-800',
      'Technology': 'bg-purple-100 text-purple-800',
      'Business': 'bg-green-100 text-green-800',
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  return (
    <PageLayout>
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="mt-1 text-gray-600">
                Real-time article and ad performance metrics
              </p>
            </div>
            <div className="flex items-center gap-4">
              {lastUpdated && (
                <span className="text-sm text-gray-500">
                  Last updated: {lastUpdated}
                </span>
              )}
              <button
                onClick={fetchDashboardData}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Error loading data</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!data && !loading && !error && (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No data loaded</h2>
            <p className="text-gray-600 mb-6">
              Click the refresh button to load the latest analytics data from ClickHouse.
            </p>
            <button
              onClick={fetchDashboardData}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Load Data
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && !data && (
          <div className="text-center py-16">
            <RefreshCw className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        )}

        {/* Data Tables */}
        {data && (
          <div className="space-y-8">
            {/* Trending Articles Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Trending Articles</h2>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Article performance metrics (last 30 minutes)
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[40%]">
                        Article
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Impressions
                      </th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Views
                      </th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Unique Viewers
                      </th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Avg. Scroll Depth
                      </th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Avg. Engaged Time (s)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.trendingArticles.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                          No trending articles data available
                        </td>
                      </tr>
                    ) : (
                      data.trendingArticles.map((article, index) => (
                        <tr key={article.article_title || index} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-gray-900 truncate" title={article.article_title}>
                              {article.article_title}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(article.article_category)}`}>
                              {article.article_category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-gray-600">
                            {article.impressions.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-gray-600">
                            {article.views.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-gray-600">
                            {article.total_article_views.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-gray-600">
                            {article.avg_scroll_depth_pct}%
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-gray-600">
                            {article.total_engaged_time_seconds}s
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Trending Categories Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Trending Categories</h2>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Category performance metrics (last 30 minutes)
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Impressions
                      </th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Views
                      </th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Unique Viewers
                      </th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Avg. Scroll Depth
                      </th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Avg. Engaged Time (s)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.trendingCategories.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          No trending categories data available
                        </td>
                      </tr>
                    ) : (
                      data.trendingCategories.map((category, index) => (
                        <tr key={category.category || index} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(category.category)}`}>
                              {category.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-gray-600">
                            {category.impressions.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-gray-600">
                            {category.views.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-gray-600">
                            {category.total_article_views.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-gray-600">
                            {category.avg_scroll_depth_pct}%
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-gray-600">
                            {category.total_engaged_time_seconds}s
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ad Performance Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Ad Performance</h2>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Advertisement metrics (last 30 minutes)
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ad ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Advertiser
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Campaign
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Impressions
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Clicks
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ad CTR
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.adPerformance.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                          No ad performance data available
                        </td>
                      </tr>
                    ) : (
                      data.adPerformance.map((ad, index) => (
                        <tr key={ad.ad_id || index} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {ad.ad_id}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {ad.advertiser_id}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {ad.campaign_id}
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-gray-600">
                            {ad.impressions.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-gray-900 font-medium">
                            {ad.clicks.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              ad.ad_ctr >= 2 
                                ? 'bg-green-100 text-green-800' 
                                : ad.ad_ctr >= 1 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-gray-100 text-gray-800'
                            }`}>
                              {ad.ad_ctr}%
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </PageLayout>
  )
}

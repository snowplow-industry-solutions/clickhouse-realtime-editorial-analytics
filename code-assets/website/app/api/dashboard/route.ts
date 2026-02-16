import { NextRequest, NextResponse } from 'next/server'

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

async function createClickHouseClient() {
  const { ClickHouse } = await import('clickhouse')

  return new ClickHouse({
    url: process.env.CLICKHOUSE_HOST || 'http://localhost:8123',
    basicAuth: {
      username: process.env.CLICKHOUSE_USER || 'default',
      password: process.env.CLICKHOUSE_KEY || '',
    },
    config: {
      database: process.env.CLICKHOUSE_DATABASE || 'default',
    },
    isUseGzip: false,
    format: 'json',
  })
}

async function getTrendingArticles(): Promise<TrendingArticle[]> {
  try {
    const clickhouse = await createClickHouseClient()

    const query = `
      WITH article_metrics AS (
        SELECT 
          article_title,
          article_category,
          SUM(CASE WHEN article_interaction_type = 'impression' THEN 1 ELSE 0 END) AS impressions,
          SUM(CASE WHEN article_interaction_type = 'view' THEN 1 ELSE 0 END) AS views,
          COUNT(DISTINCT CASE WHEN article_interaction_type = 'view' THEN domain_userid END) AS total_article_views
        FROM snowplow_article_interactions
        WHERE event_name = 'article_interaction'
          AND dvce_created_tstamp >= now() - INTERVAL 30 MINUTE
        GROUP BY 
          article_title,
          article_category
      ),
      page_metrics AS (
        SELECT
          page_title,
          ROUND(AVG(
            ROUND(100 * (LEAST(COALESCE(pp_yoffset_max, 0) + browser_viewheight, document_height) / toFloat64(document_height)))
          ), 2) AS avg_scroll_depth_pct,
          SUM(CASE WHEN event_name = 'page_ping' THEN 10 ELSE 0 END) AS total_engaged_time_seconds
        FROM snowplow_article_interactions
        WHERE event_name IN ('page_view', 'page_ping')
          AND page_id IS NOT NULL
          AND document_height IS NOT NULL
          AND document_height > 0
          AND dvce_created_tstamp >= now() - INTERVAL 30 MINUTE
        GROUP BY page_title
      )
      SELECT 
        a.article_title,
        a.article_category,
        a.impressions,
        a.views,
        a.total_article_views,
        COALESCE(p.avg_scroll_depth_pct, 0) AS avg_scroll_depth_pct,
        COALESCE(p.total_engaged_time_seconds, 0) AS total_engaged_time_seconds
      FROM article_metrics a
      LEFT JOIN page_metrics p ON a.article_title = p.page_title
      ORDER BY a.views DESC
      LIMIT 20
    `

    const result = await clickhouse.query(query).toPromise()
    
    if (!Array.isArray(result)) {
      console.error('Unexpected response format from ClickHouse:', result)
      return []
    }

    return result.map((row: any) => ({
      article_title: row.article_title || 'Unknown',
      article_category: row.article_category || 'Uncategorized',
      impressions: Number(row.impressions) || 0,
      views: Number(row.views) || 0,
      total_article_views: Number(row.total_article_views) || 0,
      avg_scroll_depth_pct: Number(row.avg_scroll_depth_pct) || 0,
      total_engaged_time_seconds: Number(row.total_engaged_time_seconds) || 0,
    }))
  } catch (err: any) {
    console.error('ClickHouse trending articles query error:', err?.message || err)
    return []
  }
}

async function getTrendingCategories(): Promise<TrendingCategory[]> {
  try {
    const clickhouse = await createClickHouseClient()

    const query = `
      WITH category_metrics AS (
        SELECT 
          article_category AS category,
          SUM(CASE WHEN article_interaction_type = 'impression' THEN 1 ELSE 0 END) AS impressions,
          SUM(CASE WHEN article_interaction_type = 'view' THEN 1 ELSE 0 END) AS views,
          COUNT(DISTINCT domain_userid) AS total_article_views
        FROM snowplow_article_interactions
        WHERE event_name = 'article_interaction'
          AND article_category != ''
          AND dvce_created_tstamp >= now() - INTERVAL 30 MINUTE
        GROUP BY article_category
      ),
      category_page_metrics AS (
        SELECT
          a.article_category AS category,
          ROUND(AVG(
            ROUND(100 * (LEAST(COALESCE(p.pp_yoffset_max, 0) + p.browser_viewheight, p.document_height) / toFloat64(p.document_height)))
          ), 2) AS avg_scroll_depth_pct,
          SUM(CASE WHEN p.event_name = 'page_ping' THEN 10 ELSE 0 END) AS total_engaged_time_seconds
        FROM snowplow_article_interactions p
        INNER JOIN snowplow_article_interactions a
          ON p.page_title = a.article_title
          AND a.event_name = 'article_interaction'
          AND a.article_category != ''
        WHERE p.event_name IN ('page_view', 'page_ping')
          AND p.page_id IS NOT NULL
          AND p.document_height IS NOT NULL
          AND p.document_height > 0
          AND p.dvce_created_tstamp >= now() - INTERVAL 30 MINUTE
        GROUP BY a.article_category
      )
      SELECT 
        c.category,
        c.impressions,
        c.views,
        c.total_article_views,
        COALESCE(cp.avg_scroll_depth_pct, 0) AS avg_scroll_depth_pct,
        COALESCE(cp.total_engaged_time_seconds, 0) AS total_engaged_time_seconds
      FROM category_metrics c
      LEFT JOIN category_page_metrics cp ON c.category = cp.category
      ORDER BY c.views DESC
      LIMIT 10
    `

    const result = await clickhouse.query(query).toPromise()
    
    if (!Array.isArray(result)) {
      console.error('Unexpected response format from ClickHouse:', result)
      return []
    }

    return result.map((row: any) => ({
      category: row.category || 'Uncategorized',
      impressions: Number(row.impressions) || 0,
      views: Number(row.views) || 0,
      total_article_views: Number(row.total_article_views) || 0,
      avg_scroll_depth_pct: Number(row.avg_scroll_depth_pct) || 0,
      total_engaged_time_seconds: Number(row.total_engaged_time_seconds) || 0,
    }))
  } catch (err: any) {
    console.error('ClickHouse trending categories query error:', err?.message || err)
    return []
  }
}

async function getAdPerformance(): Promise<AdPerformance[]> {
  try {
    const clickhouse = await createClickHouseClient()

    const query = `
      SELECT 
        ad_id,
        any(advertiser_id) AS advertiser_id,
        any(campaign_id) AS campaign_id,
        SUM(CASE WHEN ad_interaction_type = 'impression' THEN 1 ELSE 0 END) AS impressions,
        SUM(CASE WHEN ad_interaction_type = 'click' THEN 1 ELSE 0 END) AS clicks,
        ROUND(
          IF(SUM(CASE WHEN ad_interaction_type = 'impression' THEN 1 ELSE 0 END) > 0,
            SUM(CASE WHEN ad_interaction_type = 'click' THEN 1 ELSE 0 END) / SUM(CASE WHEN ad_interaction_type = 'impression' THEN 1 ELSE 0 END) * 100,
            0
          ), 2
        ) AS ad_ctr
      FROM snowplow_article_interactions
      WHERE event_name = 'ad_interaction'
        AND ad_id != ''
        AND dvce_created_tstamp >= now() - INTERVAL 30 MINUTE
      GROUP BY ad_id
      ORDER BY impressions DESC
      LIMIT 20
    `

    const result = await clickhouse.query(query).toPromise()
    
    if (!Array.isArray(result)) {
      console.error('Unexpected response format from ClickHouse:', result)
      return []
    }

    return result.map((row: any) => ({
      ad_id: row.ad_id || '',
      advertiser_id: row.advertiser_id || '',
      campaign_id: row.campaign_id || '',
      impressions: Number(row.impressions) || 0,
      clicks: Number(row.clicks) || 0,
      ad_ctr: Number(row.ad_ctr) || 0,
    }))
  } catch (err: any) {
    console.error('ClickHouse ad performance query error:', err?.message || err)
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    const [trendingArticles, trendingCategories, adPerformance] = await Promise.all([
      getTrendingArticles(),
      getTrendingCategories(),
      getAdPerformance(),
    ])

    return NextResponse.json({
      success: true,
      data: {
        trendingArticles,
        trendingCategories,
        adPerformance,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('API Error fetching dashboard data:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch dashboard data',
        message: error?.message || 'Unknown error',
      },
      { status: 500 }
    )
  }
}

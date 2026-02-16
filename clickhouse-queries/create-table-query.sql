CREATE TABLE snowplow_article_interactions (
    event_id String,
    event_name String,
    article_id String,
    article_title String,
    article_category String,
    article_interaction_type String,
    article_listing_position Nullable(Int32),
    dvce_created_tstamp DateTime,
    domain_userid String,
    domain_sessionid String,
    page_id String,
    page_title String,
    browser_viewheight Nullable(Int32),
    document_height Nullable(Int32),
    pp_yoffset_min Nullable(Int32),
    pp_yoffset_max Nullable(Int32),
    ad_interaction_type String,
    ad_id String,
    advertiser_id String,
    campaign_id String,
    PROJECTION article_views_per_user (
        SELECT domain_userid, domain_sessionid, COUNT(distinct article_id) AS total_article_views
        GROUP BY domain_userid, domain_sessionid
    ),
    PROJECTION article_metrics_per_hour (
        SELECT article_id, article_title, toStartOfHour(dvce_created_tstamp) as start_of_hour, count(distinct event_id) as total_article_views 
        GROUP BY article_id, article_title, start_of_hour
    ),
    -- Projections for dashboard queries (route.ts)
    -- Speeds up getTrendingArticles() article_metrics CTE and getTrendingCategories() category_metrics CTE
    -- Both filter on event_name = 'article_interaction' + time range, then group by title/category
    PROJECTION dashboard_article_interactions (
        SELECT
            article_title,
            article_category,
            article_interaction_type,
            domain_userid,
            dvce_created_tstamp
        ORDER BY event_name, dvce_created_tstamp, article_category, article_title
    ),
    -- Speeds up getTrendingArticles() page_metrics CTE
    -- Filters on event_name IN ('page_view','page_ping') + time range, groups by page_title
    PROJECTION dashboard_page_engagement (
        SELECT
            page_title,
            event_name,
            pp_yoffset_max,
            browser_viewheight,
            document_height,
            page_id,
            dvce_created_tstamp
        ORDER BY event_name, dvce_created_tstamp, page_title
    ),
    -- Speeds up getAdPerformance()
    -- Filters on event_name = 'ad_interaction' + time range, groups by ad_id
    PROJECTION dashboard_ad_performance (
        SELECT
            ad_id,
            advertiser_id,
            campaign_id,
            ad_interaction_type,
            dvce_created_tstamp
        ORDER BY event_name, dvce_created_tstamp, ad_id
    )
) ENGINE = MergeTree()
ORDER BY dvce_created_tstamp;

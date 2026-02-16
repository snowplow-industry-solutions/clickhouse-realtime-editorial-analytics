-- ClickHouse Queries for Snowplow Data Analysis

-- 1. Check if data is flowing from Kafka
SELECT 'Raw Kafka Messages' as table_name, count() as row_count FROM kafka_snowplow_events
UNION ALL
SELECT 'Parsed Events', count() FROM snowplow_events
UNION ALL
SELECT 'Page Views Per Minute', count() FROM page_views_per_minute
UNION ALL
SELECT 'Article Interactions', count() FROM article_interactions
UNION ALL
SELECT 'Session Analytics', count() FROM session_analytics;

-- 2. Recent events (last 10 minutes)
SELECT 
    event_name,
    domain_userid,
    page_title,
    article_title,
    dvce_created_tstamp
FROM snowplow_events 
WHERE dvce_created_tstamp >= now() - INTERVAL 10 MINUTE
ORDER BY dvce_created_tstamp DESC
LIMIT 20;

-- 3. Page views in the last hour by minute
SELECT 
    minute_timestamp,
    page_views,
    unique_users
FROM page_views_per_minute 
WHERE minute_timestamp >= now() - INTERVAL 1 HOUR
ORDER BY minute_timestamp DESC;

-- 4. Top articles by views in the last hour
SELECT 
    article_title,
    article_category,
    total_views,
    unique_viewers,
    avg_scroll_depth,
    total_interactions
FROM article_interactions 
WHERE hour_timestamp >= now() - INTERVAL 1 HOUR
ORDER BY total_views DESC
LIMIT 10;

-- 5. User session analysis
SELECT 
    domain_userid,
    session_duration_seconds,
    page_views,
    length(articles_viewed) as unique_articles,
    max_scroll_depth
FROM session_analytics 
WHERE date = today()
ORDER BY session_duration_seconds DESC
LIMIT 10;

-- 6. Real-time scroll depth analysis
SELECT 
    article_title,
    count() as events,
    avg(pp_yoffset_max) as avg_max_scroll,
    percentile(pp_yoffset_max, 0.5) as median_scroll,
    percentile(pp_yoffset_max, 0.9) as p90_scroll
FROM snowplow_events 
WHERE article_title IS NOT NULL 
    AND pp_yoffset_max > 0
    AND dvce_created_tstamp >= now() - INTERVAL 1 HOUR
GROUP BY article_title
ORDER BY events DESC
LIMIT 10;

-- 7. Session bounce rate (single page sessions)
SELECT 
    toDate(session_start) as date,
    countIf(page_views = 1) as single_page_sessions,
    count() as total_sessions,
    round(countIf(page_views = 1) / count() * 100, 2) as bounce_rate_percent
FROM session_analytics 
WHERE date >= today() - 7
GROUP BY date
ORDER BY date DESC;

-- 8. Device and location breakdown
SELECT 
    device_type,
    geo_country,
    count() as page_views,
    uniq(domain_userid) as unique_users
FROM snowplow_events 
WHERE dvce_created_tstamp >= now() - INTERVAL 1 DAY
GROUP BY device_type, geo_country
ORDER BY page_views DESC
LIMIT 20;

-- 9. Article interaction events
SELECT 
    article_interaction,
    count() as interaction_count,
    uniq(domain_userid) as unique_users
FROM snowplow_events 
WHERE article_interaction IS NOT NULL
    AND dvce_created_tstamp >= now() - INTERVAL 1 HOUR
GROUP BY article_interaction
ORDER BY interaction_count DESC;

-- 10. Average time between events per session
SELECT 
    domain_sessionid,
    count() as events_in_session,
    max(dvce_created_tstamp) as session_end,
    min(dvce_created_tstamp) as session_start,
    round(dateDiff('second', min(dvce_created_tstamp), max(dvce_created_tstamp)) / count(), 2) as avg_seconds_between_events
FROM snowplow_events 
WHERE dvce_created_tstamp >= now() - INTERVAL 1 HOUR
GROUP BY domain_sessionid
HAVING events_in_session > 1
ORDER BY avg_seconds_between_events DESC
LIMIT 10;

-- 11. PROJECTION 1: Article views per session analysis
SELECT 
    session_date,
    round(avg(article_views), 2) as avg_articles_per_session,
    round(avg(unique_articles_viewed), 2) as avg_unique_articles_per_session,
    round(avg(session_duration_minutes), 2) as avg_session_duration_minutes,
    count() as total_sessions,
    countIf(article_views >= 3) as sessions_with_3plus_articles,
    round(countIf(article_views >= 3) / count() * 100, 2) as engaged_session_rate_percent
FROM article_views_per_session 
WHERE session_date >= today() - 7
GROUP BY session_date
ORDER BY session_date DESC;

-- 12. PROJECTION 1: Top engaged sessions today
SELECT 
    domain_sessionid,
    domain_userid,
    article_views,
    unique_articles_viewed,
    session_duration_minutes,
    length(articles_list) as articles_count,
    articles_list
FROM article_views_per_session 
WHERE session_date = today()
ORDER BY (article_views * 0.6 + session_duration_minutes * 0.4) DESC
LIMIT 20;

-- 13. PROJECTION 2: Current hour article performance (scroll depth analysis)
SELECT 
    article_title,
    article_category,
    article_views,
    unique_viewers,
    avg_scroll_depth_percent,
    median_scroll_depth_percent,
    engagement_score,
    total_scroll_events
FROM hourly_article_scroll_metrics 
WHERE hour_timestamp = toStartOfHour(now())
ORDER BY engagement_score DESC
LIMIT 15;

-- 14. PROJECTION 2: Last 24 hours - Article scroll performance trends
SELECT 
    article_title,
    sum(article_views) as total_views_24h,
    sum(unique_viewers) as total_unique_viewers_24h,
    round(avg(avg_scroll_depth_percent), 2) as avg_scroll_depth_24h,
    round(avg(engagement_score), 2) as avg_engagement_score_24h,
    count() as hourly_periods_with_data
FROM hourly_article_scroll_metrics 
WHERE hour_timestamp >= now() - INTERVAL 24 HOUR
GROUP BY article_title
HAVING total_views_24h >= 10  -- Filter for articles with meaningful traffic
ORDER BY avg_engagement_score_24h DESC
LIMIT 20;

-- 15. PROJECTION 1 & 2 COMBINED: Deep engagement analysis
SELECT 
    a.article_title,
    a.article_category,
    h.article_views as hourly_views,
    h.avg_scroll_depth_percent,
    h.engagement_score,
    s.avg_articles_per_session,
    s.sessions_with_article,
    round(s.sessions_with_article / h.unique_viewers * 100, 2) as session_conversion_rate
FROM hourly_article_scroll_metrics h
LEFT JOIN (
    SELECT 
        any(article_title) as article_title,
        avg(article_views) as avg_articles_per_session,
        count() as sessions_with_article
    FROM article_views_per_session 
    WHERE session_date = today()
        AND has(articles_list, article_title)
    GROUP BY article_title
) s ON h.article_title = s.article_title
WHERE h.hour_timestamp = toStartOfHour(now())
    AND h.article_views > 0
ORDER BY h.engagement_score DESC
LIMIT 10;
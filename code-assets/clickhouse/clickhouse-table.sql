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
    campaign_id String
    PROJECTION article_views_per_user (
        SELECT domain_userid, domain_sessionid, COUNT(distinct article_id) AS total_article_views
        GROUP BY domain_userid, domain_sessionid
    ),
    PROJECTION article_metrics_per_hour (
        SELECT article_id, article_title, toStartOfHour(dvce_created_tstamp) as start_of_hour, count(distinct event_id) as total_article_views 
        GROUP BY article_id, article_title, start_of_hour
    )    
)
    ORDER BY dvce_created_tstamp;

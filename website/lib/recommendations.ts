import { allArticles } from './data'
import { Article } from './config'

// Client-safe synchronous function for components
export function getRecommendations(count: number = 4): Article[] {
  // Simple fallback for client-side usage - return random articles
  return allArticles.slice(0, count);
}

// Server-side async function for API routes or server components
export async function getRecommendationsFromClickHouse(count: number = 4): Promise<Article[]> {
  // Only import ClickHouse in server environment
  if (typeof window !== 'undefined') {
    // Client-side fallback
    return getRecommendations(count);
  }

  try {
    // Dynamic import to avoid bundling issues
    const { ClickHouse } = await import('clickhouse');
    
    const clickhouse = new ClickHouse({
      url: 'http://localhost:8123',
      basicAuth: {
        username: 'default',
        password: 'admin',
      },
      isUseGzip: false,
      format: 'json',
    });

    const query = `
        SELECT article_id, toStartOfHour(dvce_created_tstamp) as start_of_hour, count(distinct event_id) as total_article_views 
        FROM article_view_events
        GROUP BY article_id, start_of_hour
        ORDER BY start_of_hour DESC, total_article_views DESC
        LIMIT ${count}
    `;

    const result = await clickhouse.query(query).toPromise();

    // Result is already an array
    if (!Array.isArray(result)) {
      console.error('Unexpected response format from ClickHouse:', result);
      // Fallback to default articles if ClickHouse fails
      return getRecommendations(count);
    }

    console.log('ClickHouse query result:', result.map((row: any) => ({ 
      article_id: row.article_id, 
      views: row.total_article_views,
      hour: row.start_of_hour 
    })));

    // Map ClickHouse results to articles, preserving the order from ClickHouse
    const recommendedArticles: Article[] = [];
    for (const row of result) {
      const typedRow = row as any; // Type assertion for ClickHouse result
      const article = allArticles.find(article => article.id === typedRow.article_id);
      if (article) {
        recommendedArticles.push(article);
      }
      // Stop once we have enough articles
      if (recommendedArticles.length >= count) {
        break;
      }
    }

    // If we don't have enough articles from ClickHouse, fill with default articles
    if (recommendedArticles.length < count) {
      const remainingCount = count - recommendedArticles.length;
      const usedArticleIds = recommendedArticles.map(article => article.id);
      const fallbackArticles = allArticles
        .filter(article => !usedArticleIds.includes(article.id))
        .slice(0, remainingCount);
      return [...recommendedArticles, ...fallbackArticles];
    }

    console.log('Final recommended articles order:', recommendedArticles.map(article => ({ 
      id: article.id, 
      title: article.title 
    })));

    return recommendedArticles;
  } catch (err: any) {
    console.error('ClickHouse query error:', err?.message || err);
    // Fallback to default articles if ClickHouse fails
    return getRecommendations(count);
  }
} 
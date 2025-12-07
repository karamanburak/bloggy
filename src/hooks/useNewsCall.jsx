import { useDispatch } from "react-redux";
import {
  fetchFail,
  fetchStart,
  getNewsSuccess,
} from "../features/newsShowsSlice";
import axios from "axios";

const useNewsCall = () => {
  const dispatch = useDispatch();

  const stripHtml = (html) => {
    if (!html) return "";
    let doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  // Free API - No registration required: Knowivate News API
  // DISABLED: CORS issues - API doesn't allow cross-origin requests
  const fetchKnowivateNews = async () => {
    // This API has CORS issues, skipping
    return null;
  };

  // Free API - No registration required: The Free News API
  // DISABLED: SSL certificate issues - API has invalid certificate
  const fetchFreeNewsAPI = async () => {
    // This API has SSL certificate issues, skipping
    return null;
  };

  const fetchHackerNews = async () => {
    try {
      // Get top story IDs
      const { data: topStories } = await axios.get(
        "https://hacker-news.firebaseio.com/v0/topstories.json",
        { timeout: 10000 }
      );
      
      if (topStories && Array.isArray(topStories) && topStories.length > 0) {
        // Get first 20 stories
        const storyIds = topStories.slice(0, 20);
        const storyPromises = storyIds.map(id =>
          axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, { timeout: 5000 })
        );
        
        const stories = await Promise.all(storyPromises);
        const articles = stories
          .map(res => res.data)
          .filter(story => story && story.type === 'story' && story.title)
          .map((story) => ({
            title: story.title,
            description: stripHtml(story.text || "").substring(0, 200),
            content: stripHtml(story.text || ""),
            url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
            image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop",
            publishedAt: new Date(story.time * 1000).toISOString(),
            source: {
              name: "Hacker News",
            },
            author: story.by || "Hacker News",
          }));
        
        if (articles.length > 0) {
          return articles;
        }
      }
    } catch (error) {
      // Error fetching Hacker News
    }
    return null;
  };

  const fetchDevTo = async () => {
    try {
      const { data } = await axios.get(
        "https://dev.to/api/articles?top=30&per_page=20",
        {
          headers: {
            'Accept': 'application/json',
          },
          timeout: 10000
        }
      );
      
      if (data && Array.isArray(data) && data.length > 0) {
        return data.map((article) => ({
          title: article.title || "",
          description: stripHtml(article.description || ""),
          content: stripHtml(article.description || ""),
          url: article.url || article.canonical_url || "#",
          image: article.cover_image || article.social_image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop",
          publishedAt: article.published_at || new Date().toISOString(),
          source: {
            name: "Dev.to",
          },
          author: article.user?.name || "Dev.to",
        }));
      }
    } catch (error) {
      // Error fetching Dev.to
    }
    return null;
  };

  // NewsAPI.org - Primary API
  const fetchNewsAPI = async (apiKey) => {
    try {
      const { data } = await axios.get(
        `https://newsapi.org/v2/top-headlines?country=us&category=technology&pageSize=20&apiKey=${apiKey}`,
        {
          headers: {
            'Accept': 'application/json',
          }
        }
      );
      
      if (data.articles && data.articles.length > 0) {
        return data.articles.map((article) => ({
          title: article.title,
          description: stripHtml(article.description || ""),
          content: stripHtml(article.content || article.description || ""),
          url: article.url,
          image: article.urlToImage || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop",
          publishedAt: article.publishedAt,
          source: {
            name: article.source?.name || "Unknown Source",
          },
          author: article.author,
        }));
      }
    } catch (error) {
      // Error fetching NewsAPI
    }
    return null;
  };

  // Alternative: NewsData.io (Free tier available)
  const fetchNewsDataIO = async () => {
    try {
      const apiKey = import.meta.env.VITE_NEWSDATA_API_KEY;
      if (!apiKey) return null;

      const { data } = await axios.get(
        `https://newsdata.io/api/1/news?apikey=${apiKey}&category=technology&language=en&country=us`,
        {
          headers: {
            'Accept': 'application/json',
          }
        }
      );
      
      if (data.results && data.results.length > 0) {
        return data.results.map((article) => ({
          title: article.title,
          description: stripHtml(article.description || ""),
          content: stripHtml(article.content || article.description || ""),
          url: article.link,
          image: article.image_url || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop",
          publishedAt: article.pubDate,
          source: {
            name: article.source_id || "Unknown Source",
          },
          author: article.creator?.[0] || article.source_id,
        }));
      }
    } catch (error) {
      // Error fetching NewsData.io
    }
    return null;
  };

  // Alternative: Guardian API (Free, requires API key)
  const fetchGuardianAPI = async () => {
    try {
      const apiKey = import.meta.env.VITE_GUARDIAN_API_KEY;
      if (!apiKey) return null;

      const { data } = await axios.get(
        `https://content.guardianapis.com/search?api-key=${apiKey}&section=technology&show-fields=thumbnail,body,trailText&page-size=20`,
        {
          headers: {
            'Accept': 'application/json',
          }
        }
      );
      
      if (data.response?.results && data.response.results.length > 0) {
        return data.response.results.map((article) => ({
          title: article.webTitle,
          description: stripHtml(article.fields?.trailText || ""),
          content: stripHtml(article.fields?.body || article.fields?.trailText || ""),
          url: article.webUrl,
          image: article.fields?.thumbnail || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop",
          publishedAt: article.webPublicationDate,
          source: {
            name: "The Guardian",
          },
          author: article.fields?.byline || "The Guardian",
        }));
      }
    } catch (error) {
      // Error fetching Guardian API
    }
    return null;
  };

  // Helper function to remove duplicates based on title similarity
  const removeDuplicates = (articles) => {
    const seen = new Set();
    const unique = [];
    
    for (const article of articles) {
      const normalizedTitle = article.title?.toLowerCase().trim();
      if (normalizedTitle && !seen.has(normalizedTitle)) {
        seen.add(normalizedTitle);
        unique.push(article);
      }
    }
    
    return unique;
  };

  // Main function to fetch news from multiple sources and aggregate
  const getNewsData = async () => {
    dispatch(fetchStart());
    try {
      const allArticles = [];
      
      // Fetch from all available sources in parallel
      const fetchPromises = [];

      // Priority 1: Free APIs (No registration required)
      // Removed fetchKnowivateNews() and fetchFreeNewsAPI() due to CORS/SSL issues
      fetchPromises.push(fetchDevTo());
      fetchPromises.push(fetchHackerNews());

      // Priority 2: APIs that require registration (but have free tiers)
      const newsApiKey = import.meta.env.VITE_NEWS_API_KEY;
      if (newsApiKey) {
        fetchPromises.push(fetchNewsAPI(newsApiKey));
      }

      fetchPromises.push(fetchNewsDataIO());
      fetchPromises.push(fetchGuardianAPI());

      // Wait for all promises to resolve (some may fail, that's okay)
      const results = await Promise.allSettled(fetchPromises);
      
      // Collect all successful results
      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value && Array.isArray(result.value)) {
          allArticles.push(...result.value);
        }
      });

      // Remove duplicates and limit to 30 articles
      const uniqueArticles = removeDuplicates(allArticles);
      const limitedArticles = uniqueArticles.slice(0, 30);

      limitedArticles.sort((a, b) => {
        const dateA = new Date(a.publishedAt || 0);
        const dateB = new Date(b.publishedAt || 0);
        return dateB - dateA;
      });

      if (limitedArticles.length > 0) {
        dispatch(getNewsSuccess(limitedArticles));
      } else {
        dispatch(getNewsSuccess([]));
      }
    } catch (error) {
      dispatch(fetchFail());
      dispatch(getNewsSuccess([]));
    }
  };

  return {
    getNewsData,
  };
};

export default useNewsCall;


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
  const fetchKnowivateNews = async () => {
    try {
      const { data } = await axios.get(
        "https://news.knowivate.com/api/latest",
        {
          headers: {
            'Accept': 'application/json',
          },
          timeout: 10000
        }
      );
      
      if (data && Array.isArray(data) && data.length > 0) {
        return data.map((article) => ({
          title: article.title || article.headline || "",
          description: stripHtml(article.description || article.summary || ""),
          content: stripHtml(article.content || article.description || article.summary || ""),
          url: article.url || article.link || "#",
          image: article.image || article.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop",
          publishedAt: article.publishedAt || article.date || new Date().toISOString(),
          source: {
            name: article.source || article.publisher || "News",
          },
          author: article.author || article.source || "",
        }));
      }
    } catch (error) {
      console.error("Knowivate News API Error:", error);
    }
    return null;
  };

  // Free API - No registration required: The Free News API
  const fetchFreeNewsAPI = async () => {
    try {
      const { data } = await axios.get(
        "https://www.thefreenewsapi.com/api/v1/latest-news",
        {
          headers: {
            'Accept': 'application/json',
          },
          timeout: 10000
        }
      );
      
      if (data && data.news && Array.isArray(data.news) && data.news.length > 0) {
        return data.news.map((article) => ({
          title: article.title || "",
          description: stripHtml(article.description || article.summary || ""),
          content: stripHtml(article.content || article.description || ""),
          url: article.url || article.link || "#",
          image: article.image || article.imageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop",
          publishedAt: article.publishedAt || article.date || new Date().toISOString(),
          source: {
            name: article.source || "Free News",
          },
          author: article.author || "",
        }));
      }
    } catch (error) {
      console.error("Free News API Error:", error);
    }
    return null;
  };

  // Free API - No registration required: Hacker News API
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
      console.error("Hacker News API Error:", error);
    }
    return null;
  };

  // Free API - No registration required: Dev.to API
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
      console.error("Dev.to API Error:", error);
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
      console.error("NewsAPI Error:", error);
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
      console.error("NewsData.io Error:", error);
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
      console.error("Guardian API Error:", error);
    }
    return null;
  };

  // Main function to fetch news with fallbacks
  const getNewsData = async () => {
    dispatch(fetchStart());
    try {
      // Priority 1: Free APIs (No registration required)
      // Try Knowivate News API first (completely free, no registration)
      const knowivateArticles = await fetchKnowivateNews();
      if (knowivateArticles && knowivateArticles.length > 0) {
        dispatch(getNewsSuccess(knowivateArticles));
        return;
      }

      // Try The Free News API (completely free, no registration)
      const freeNewsArticles = await fetchFreeNewsAPI();
      if (freeNewsArticles && freeNewsArticles.length > 0) {
        dispatch(getNewsSuccess(freeNewsArticles));
        return;
      }

      // Try Dev.to API (completely free, no registration)
      const devToArticles = await fetchDevTo();
      if (devToArticles && devToArticles.length > 0) {
        dispatch(getNewsSuccess(devToArticles));
        return;
      }

      // Try Hacker News API (completely free, no registration)
      const hackerNewsArticles = await fetchHackerNews();
      if (hackerNewsArticles && hackerNewsArticles.length > 0) {
        dispatch(getNewsSuccess(hackerNewsArticles));
        return;
      }

      // Priority 2: APIs that require registration (but have free tiers)
      // Try NewsAPI if API key is provided
      const newsApiKey = import.meta.env.VITE_NEWS_API_KEY;
      if (newsApiKey) {
        const articles = await fetchNewsAPI(newsApiKey);
        if (articles && articles.length > 0) {
          dispatch(getNewsSuccess(articles));
          return;
        }
      }

      // Try NewsData.io if API key is provided
      const newsDataArticles = await fetchNewsDataIO();
      if (newsDataArticles && newsDataArticles.length > 0) {
        dispatch(getNewsSuccess(newsDataArticles));
        return;
      }

      // Try Guardian API if API key is provided
      const guardianArticles = await fetchGuardianAPI();
      if (guardianArticles && guardianArticles.length > 0) {
        dispatch(getNewsSuccess(guardianArticles));
        return;
      }

      // If all APIs fail, show empty state
      dispatch(getNewsSuccess([]));
    } catch (error) {
      console.error("News Fetch Error:", error);
      dispatch(fetchFail());
      dispatch(getNewsSuccess([]));
    }
  };

  return {
    getNewsData,
  };
};

export default useNewsCall;


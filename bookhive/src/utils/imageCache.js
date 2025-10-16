// Image cache utility for storing base64 images in localStorage
class ImageCache {
  constructor() {
    this.cacheKey = 'bookhive_image_cache';
    this.maxCacheSize = 50; // Maximum number of images to cache
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  }

  // Generate cache key for an image
  getCacheKey(fileName, folderName) {
    return `${fileName}_${folderName}`;
  }

  // Get cached image
  get(fileName, folderName) {
    try {
      const cache = this.getCache();
      const key = this.getCacheKey(fileName, folderName);
      const cachedItem = cache[key];

      if (cachedItem) {
        // Check if cache has expired
        if (Date.now() - cachedItem.timestamp > this.cacheExpiry) {
          this.remove(fileName, folderName);
          return null;
        }
        return cachedItem.data;
      }
      return null;
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  }

  // Store image in cache
  set(fileName, folderName, imageData) {
    try {
      const cache = this.getCache();
      const key = this.getCacheKey(fileName, folderName);
      
      // Check cache size and remove oldest items if needed
      this.cleanupCache(cache);
      
      cache[key] = {
        data: imageData,
        timestamp: Date.now()
      };
      
      localStorage.setItem(this.cacheKey, JSON.stringify(cache));
    } catch (error) {
      console.error('Error writing to cache:', error);
      // If localStorage is full, try to clear some space
      this.clearOldCache();
    }
  }

  // Remove specific image from cache
  remove(fileName, folderName) {
    try {
      const cache = this.getCache();
      const key = this.getCacheKey(fileName, folderName);
      delete cache[key];
      localStorage.setItem(this.cacheKey, JSON.stringify(cache));
    } catch (error) {
      console.error('Error removing from cache:', error);
    }
  }

  // Get cache from localStorage
  getCache() {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      return cached ? JSON.parse(cached) : {};
    } catch (error) {
      console.error('Error parsing cache:', error);
      return {};
    }
  }

  // Clean up cache to maintain size limit
  cleanupCache(cache) {
    const entries = Object.entries(cache);
    if (entries.length >= this.maxCacheSize) {
      // Sort by timestamp and remove oldest entries
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      const toRemove = entries.slice(0, entries.length - this.maxCacheSize + 1);
      
      toRemove.forEach(([key]) => {
        delete cache[key];
      });
    }
  }

  // Clear old cache entries
  clearOldCache() {
    try {
      const cache = this.getCache();
      const now = Date.now();
      let hasChanges = false;

      Object.keys(cache).forEach(key => {
        if (now - cache[key].timestamp > this.cacheExpiry) {
          delete cache[key];
          hasChanges = true;
        }
      });

      if (hasChanges) {
        localStorage.setItem(this.cacheKey, JSON.stringify(cache));
      }
    } catch (error) {
      console.error('Error clearing old cache:', error);
    }
  }

  // Clear all cache
  clear() {
    try {
      localStorage.removeItem(this.cacheKey);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  // Get cache statistics
  getStats() {
    try {
      const cache = this.getCache();
      const entries = Object.values(cache);
      const now = Date.now();
      
      return {
        totalImages: entries.length,
        expiredImages: entries.filter(item => now - item.timestamp > this.cacheExpiry).length,
        cacheSize: JSON.stringify(cache).length,
        oldestImage: entries.length > 0 ? Math.min(...entries.map(item => item.timestamp)) : null
      };
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return { totalImages: 0, expiredImages: 0, cacheSize: 0, oldestImage: null };
    }
  }
}

// Create singleton instance
const imageCache = new ImageCache();

export default imageCache;

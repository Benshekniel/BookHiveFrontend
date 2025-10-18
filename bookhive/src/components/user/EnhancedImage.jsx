import React, { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';

const EnhancedImage = ({ 
  src, 
  alt = "Book cover", 
  className = "", 
  fileName = null, 
  folderName = "userBooks", 
  baseUrl = "http://localhost:9090",
  bookTitle = "Unknown Book",
  fallbackType = "svg" // "svg" or "google"
}) => {
  const [imgSrc, setImgSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Generate fallback images
  const generateSVGFallback = (title) => {
    const cleanTitle = title.replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 15);
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="300" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#4F46E5;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#6366F1;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="300" height="400" fill="url(#grad)"/>
        <text x="150" y="180" text-anchor="middle" fill="#FFFFFF" font-size="18" font-weight="bold">${cleanTitle}</text>
        <text x="150" y="220" text-anchor="middle" fill="#E5E7EB" font-size="14">Book Cover</text>
      </svg>
    `)}`;
  };

  const generateGoogleBooksCover = (title) => {
    // Try to get from Google Books API (this would need an API key in production)
    const searchQuery = encodeURIComponent(title);
    return `https://books.google.com/books/publisher/content/images/frontcover/${btoa(title).substring(0, 12)}?fife=w300-h400&source=gbs_api`;
  };

  const generateFallbackImage = () => {
    if (fallbackType === "google" && bookTitle !== "Unknown Book") {
      return generateGoogleBooksCover(bookTitle);
    }
    return generateSVGFallback(bookTitle);
  };

  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true);
      setHasError(false);

      // Try original source first
      if (src && !src.includes('placeholder')) {
        try {
          const img = new Image();
          img.onload = () => {
            setImgSrc(src);
            setIsLoading(false);
          };
          img.onerror = () => {
            tryAlternativeSource();
          };
          img.src = src;
          return;
        } catch (error) {
          console.error('Error loading primary image:', error);
        }
      }

      tryAlternativeSource();
    };

    const tryAlternativeSource = async () => {
      // Try to load from backend if fileName is provided
      if (fileName && baseUrl) {
        try {
          const response = await fetch(`${baseUrl}/getFileAsBase64?fileName=${fileName}&folderName=${folderName}`);
          if (response.ok) {
            const base64Data = await response.text();
            const imageUrl = `data:image/jpeg;base64,${base64Data}`;
            setImgSrc(imageUrl);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.error('Error loading from backend:', error);
        }
      }

      // Fall back to generated image
      setImgSrc(generateFallbackImage());
      setIsLoading(false);
    };

    loadImage();
  }, [src, fileName, folderName, baseUrl, bookTitle, fallbackType]);

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(generateFallbackImage());
    }
  };

  if (isLoading) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center animate-pulse`}>
        <BookOpen className="w-8 h-8 text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleImageError}
      loading="lazy"
    />
  );
};

export default EnhancedImage;
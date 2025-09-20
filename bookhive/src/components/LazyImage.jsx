import React, { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import imageCache from '../utils/imageCache';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = "https://via.placeholder.com/150x200/6B7280/FFFFFF?text=No+Image",
  baseUrl = 'http://localhost:9090',
  folderName = 'userBooks',
  fileName = null,
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoading, setIsLoading] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Start loading 50px before the image comes into view
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Load image when component comes into view
  useEffect(() => {
    if (!isInView) return;

    const loadImage = async () => {
      setIsLoading(true);

      let imageUrl = src;
      
      // If we have fileName and folderName, fetch from Google Drive (prioritize over src)
      if (fileName && folderName) {
        // Check cache first
        const cachedImage = imageCache.get(fileName, folderName);
        if (cachedImage) {
          imageUrl = cachedImage;
        } else {
          try {
            const response = await fetch(`${baseUrl}/getFileAsBase64?fileName=${fileName}&folderName=${folderName}`);
            if (response.ok) {
              imageUrl = await response.text();
              // Store in cache for future use
              imageCache.set(fileName, folderName, imageUrl);
            } else {
              // If fetch fails, just use placeholder without showing error
              imageUrl = placeholder;
            }
          } catch {
            // If network fails, just use placeholder without showing error
            imageUrl = placeholder;
          }
        }
      }

      // Set the image source directly without preloading
      setImageSrc(imageUrl);
      setIsLoading(false);
    };

    loadImage();
  }, [isInView, src, fileName, folderName, baseUrl, placeholder]);

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`} {...props}>
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
      )}
      
      {/* Actual image */}
      <img
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onError={() => {
          setImageSrc(placeholder);
          setIsLoading(false);
        }}
      />
    </div>
  );
};

export default LazyImage;

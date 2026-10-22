import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAbsoluteImageUrl } from '../utils/imageUtils';

interface SlideData {
  id: number;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;    // lg — 1920×1080
  backgroundImageMd: string;  // md — 1280×720
  backgroundImageSm: string;  // sm — 800×450
  textColor?: 'white' | 'dark';
}

const HeroSlider: React.FC = () => {
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  // Fetch slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const SERVER_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
        const API_BASE = SERVER_URL ? `${SERVER_URL}/api` : '/api';
        const response = await fetch(`${API_BASE}/hero-slides`);
        if (response.ok) {
          const data = await response.json();
          // Transform API data to component format
          const transformedSlides = data.map((slide: any) => ({
            id: slide.id,
            title: slide.title,
            description: slide.description || '',
            buttonText: slide.button_text,
            buttonLink: slide.button_link,
            backgroundImage:   getAbsoluteImageUrl(slide.background_image),
            backgroundImageMd: getAbsoluteImageUrl(slide.background_image_md || slide.background_image),
            backgroundImageSm: getAbsoluteImageUrl(slide.background_image_sm || slide.background_image_md || slide.background_image),
            textColor: slide.text_color || 'white'
          }));

          // Preload first slide image to prevent layout shift
          if (transformedSlides.length > 0) {
            const img = new Image();
            img.onload = () => {
              setSlides(transformedSlides);
              setLoading(false);
            };
            img.onerror = () => {
              // Even if image fails, show slides
              setSlides(transformedSlides);
              setLoading(false);
            };
            img.src = transformedSlides[0].backgroundImage;
          } else {
            setSlides(transformedSlides);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error fetching hero slides:', error);
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
    setIsAutoPlaying(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !touchStart) return;

    const currentTouch = e.targetTouches[0].clientX;
    const diff = currentTouch - touchStart;

    // Add resistance at boundaries
    if ((currentSlide === 0 && diff > 0) || (currentSlide === slides.length - 1 && diff < 0)) {
      setDragOffset(diff * 0.2);
    } else {
      setDragOffset(diff);
    }

    setTouchEnd(currentTouch);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const distance = touchStart - touchEnd;
    const threshold = 50;

    if (distance > threshold && currentSlide < slides.length - 1) {
      goToNext();
    } else if (distance < -threshold && currentSlide > 0) {
      goToPrevious();
    }

    setIsDragging(false);
    setDragOffset(0);
    setTouchStart(0);
    setTouchEnd(0);
    setIsAutoPlaying(true);
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX);
    setIsDragging(true);
    setIsAutoPlaying(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !touchStart) return;

    const diff = e.clientX - touchStart;

    // Add resistance at boundaries
    if ((currentSlide === 0 && diff > 0) || (currentSlide === slides.length - 1 && diff < 0)) {
      setDragOffset(diff * 0.2);
    } else {
      setDragOffset(diff);
    }

    setTouchEnd(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    const distance = touchStart - touchEnd;
    const threshold = 50;

    if (distance > threshold && currentSlide < slides.length - 1) {
      goToNext();
    } else if (distance < -threshold && currentSlide > 0) {
      goToPrevious();
    }

    setIsDragging(false);
    setDragOffset(0);
    setTouchStart(0);
    setTouchEnd(0);
    setIsAutoPlaying(true);
  };

  // If no slides and still loading, show loading state with skeleton
  if (loading || slides.length === 0) {
    return (
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="absolute inset-0 flex items-center justify-center">
          {loading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-500 text-sm">A carregar slides...</p>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative h-[70vh] md:h-[80vh] overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slides Container */}
      <div
        className="relative w-full h-full cursor-grab active:cursor-grabbing select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          if (isDragging) {
            handleMouseUp();
          }
          handleMouseLeave();
        }}
      >
        <div
          className="w-full h-full flex"
          style={{
            transform: `translateX(calc(${-currentSlide * 100}% + ${dragOffset}px))`,
            transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {slides.map((slide, index) => {
            const isImageLoaded = imagesLoaded.has(index);
            return (
            <div
              key={slide.id}
              className="w-full h-full flex-shrink-0 relative"
            >
              {/* Background Image */}
              <div className="absolute inset-0 bg-gray-200">
                {/* Skeleton loader while image loads */}
                {!isImageLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
                )}

                <picture>
                  <source media="(max-width: 768px)"  srcSet={slide.backgroundImageSm} />
                  <source media="(max-width: 1280px)" srcSet={slide.backgroundImageMd} />
                  <img
                    src={slide.backgroundImage}
                    alt={slide.title}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${
                      isImageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => {
                      setImagesLoaded(prev => new Set(prev).add(index));
                    }}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                </picture>
                <div className="absolute inset-0 bg-black/40"></div>
              </div>

              {/* Content */}
              <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                <div className="max-w-xl">
                  <h2
                    className={`text-4xl md:text-6xl font-serif font-bold mb-4 tracking-tight ${
                      slide.textColor === 'dark' ? 'text-gray-900' : 'text-white'
                    }`}
                  >
                    {slide.title}
                  </h2>
                  <p
                    className={`text-lg md:text-xl mb-8 leading-relaxed ${
                      slide.textColor === 'dark' ? 'text-gray-700' : 'text-gray-100'
                    }`}
                  >
                    {slide.description}
                  </p>
                  {slide.buttonText && slide.buttonLink && (
                    <Link
                      to={slide.buttonLink}
                      className="inline-flex items-center px-8 py-3 rounded-full bg-primary-600 text-white font-medium hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      {slide.buttonText}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )})}
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200 focus:outline-none"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200 focus:outline-none"
            aria-label="Próximo slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 focus:outline-none ${
                  index === currentSlide
                    ? 'w-8 bg-white'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Ir para o slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroSlider;

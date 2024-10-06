import React, { useEffect, useRef, useState } from 'react';
import { ImEnlarge } from 'react-icons/im';
import { GrFormNext } from 'react-icons/gr';
import { GrFormPrevious } from 'react-icons/gr';

interface Media {
  media_type?: string;
  title?: string;
  explanation?: string;
  url?: string;
  hdurl?: string;
  img_src?: string;
}

interface ImageSliderProps {
  mediaList: Media[];
  width: string;
  height: string;
  loading: boolean;
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  mediaList,
  width,
  height,
  loading,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const currentMedia = mediaList?.length > 0 ? mediaList[currentIndex] : null;

  const goToPrevious = (): void => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? mediaList.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = (): void => {
    const isLastSlide = currentIndex === mediaList.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const openModal = (): void => {
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setZoomLevel(1);
  };

  const handleWheelZoom = (e: React.WheelEvent<HTMLDivElement>): void => {
    if (e.deltaY > 0) {
      setZoomLevel(prevZoom => Math.max(1, prevZoom - 0.1));
    } else {
      setZoomLevel(prevZoom => Math.min(3, prevZoom + 0.1));
    }
  };

  const LazyBackgroundImage = ({ imageUrl, width, height }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              observer.disconnect();
            }
          });
        },
        { threshold: 0.1 }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => {
        if (ref.current) {
          observer.disconnect();
        }
      };
    }, []);

    return (
      <div
        ref={ref}
        style={{
          backgroundImage: isVisible ? `url(${imageUrl})` : 'none',
        }}
        className={`bg-cover bg-center ${width} ${height}`}
      />
    );
  };

  useEffect(() => {
    setCurrentIndex(0);
  }, [mediaList]);

  return (
    <div className={`relative mx-auto ${width}`}>
      {mediaList?.length > 0 && !loading && (
        <div
          className={`relative bg-center bg-cover rounded-lg transition-all duration-500 ${width} ${height}`}
        >
          {currentMedia?.media_type === 'image' ? (
            !loading ? (
              <LazyBackgroundImage
                imageUrl={currentMedia?.url || mediaList[currentIndex]?.img_src}
                width={width}
                height={height}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 animate-pulse"></div>
            )
          ) : !loading ? (
            <iframe
              className="w-full h-full"
              src={
                mediaList[currentIndex]?.url || mediaList[currentIndex]?.img_src
              }
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          ) : (
            <div className="w-full h-full bg-gray-200 animate-pulse"></div>
          )}

          {currentMedia?.media_type === 'image' && (
            <div
              className="absolute bottom-2 right-2 cursor-pointer"
              onClick={openModal}
            >
              <ImEnlarge className="text-white" />
            </div>
          )}
        </div>
      )}

      {mediaList?.length > 0 && !loading && (
        <div className="flex justify-center items-center mt-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={goToPrevious}
          >
            <GrFormPrevious />
          </button>
          <div className="text-center mx-2 text-gray-700">
            {currentIndex + 1} / {mediaList.length}
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={goToNext}
          >
            <GrFormNext />
          </button>
        </div>
      )}

      <div className="mt-4 mb-10">
        {!loading ? (
          <h3 className="text-lg font-semibold text-gray-800">
            {mediaList[currentIndex]?.title}
          </h3>
        ) : (
          <div className="text-lg mb-4 bg-gradient-to-r from-white via-gray-500 to-white rounded-sm h-6 w-1/2 font-semibold text-gray-800 animate-pulse"></div>
        )}
        {!loading ? (
          <p className="text-sm text-gray-600">
            {mediaList[currentIndex]?.explanation}
          </p>
        ) : (
          <div className="space-y-2">
            <div className="h-4 bg-gradient-to-r from-white via-gray-200 to-white  rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gradient-to-r from-white via-gray-200 to-white  rounded animate-pulse w-1/2"></div>
            <div className="h-4 bg-gradient-to-r from-white via-gray-200 to-white  rounded animate-pulse w-full"></div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onWheel={handleWheelZoom}
        >
          {currentMedia?.media_type === 'image' ? (
            <img
              src={currentMedia?.hdurl}
              alt="Full-size view"
              className="rounded-lg shadow-lg"
              style={{
                transform: `scale(${zoomLevel})`,
                transition: 'transform 0.2s ease-in-out',
              }}
            />
          ) : (
            <video controls className="rounded-lg shadow-lg">
              <source src={currentMedia?.hdurl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          <button
            className="absolute top-5 right-5 text-white text-4xl font-bold"
            onClick={closeModal}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageSlider;

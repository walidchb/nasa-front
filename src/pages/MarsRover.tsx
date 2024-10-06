import React, { useEffect, useState, useRef, ChangeEvent } from 'react';
import Dashboard from '../components/Dashboard.tsx';
import { FaFilter } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import MarsRoverStore from '../stores/marsRoverStore.ts';
import Modal from '../components/Modal.tsx';
import DateInput from '../components/CustomDateInput.tsx';
import SuccessFailerAlert from '../components/AlertSuccessfailer.tsx';
import ImageSlider from '../components/ImageSlider.tsx';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

interface Image {
  img_src: string;
}

interface RoverCameras {
  curiosity: string[];
  opportunity: string[];
  spirit: string[];
}

const MarsRover: React.FC = () => {
  const ImagesRef = useRef<HTMLDivElement | null>(null);
  const today = new Date();
  const formattedEarthDate = today.toISOString().split('T')[0];
  const {
    images,
    fetchDataImages,
    setImages,
    errorGetImages,
    loadingImages,
    globalAlertManage,
    setGlobalAlertManage,
  } = MarsRoverStore();
  const navigate = useNavigate();
  const query = useQuery();
  const [modalFilters, setModalFilters] = useState(false);
  const [earth_date, setEarthDate] = useState<string>(
    query.get('earth_date') || ''
  );
  const [page, setPage] = useState<number>(Number(query.get('page')) || 1);
  const [selectedRover, setSelectedRover] = useState<string | null>(null);
  const [sol, setSol] = useState<number>(Number(query.get('sol')) || 1);
  const [cameras, setCameras] = useState<string[]>([]);
  const [selectedCameras, setSelectedCameras] = useState<string[]>(() => {
    const camerasFromQuery = query.getAll('camera');
    return camerasFromQuery.length ? camerasFromQuery : [];
  });
  const roverCameras: RoverCameras = {
    curiosity: ['fhaz', 'rhaz', 'mast', 'chemcam', 'mahli', 'mardi', 'navcam'],
    opportunity: ['fhaz', 'rhaz', 'navcam', 'pancam', 'minites'],
    spirit: ['fhaz', 'rhaz', 'navcam', 'pancam', 'minites'],
  };

  useEffect(() => {
    return () => {
      setImages([]);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (earth_date) params.append('earth_date', earth_date);
    if (page) params.append('page', page.toString());
    if (sol) params.append('sol', sol.toString());
    if (selectedCameras.length > 0) {
      selectedCameras.forEach(camera => {
        params.append('camera', camera);
      });
    }
    if (selectedCameras.length > 0) {
      fetchDataImages(
        `/marsRovers/${selectedRover}/photos?${params.toString()}`
      );
    }

    if (ImagesRef.current) {
      ImagesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    navigate(`?${params.toString()}`, { replace: true });
  }, [selectedCameras]);

  const handleRoverClick = (rover: string) => {
    setSelectedRover(rover);
    setCameras(roverCameras[rover]);
    setSelectedCameras([]);
    setPage(1);
    setEarthDate('');
    setSol(1);
    setImages([]);
  };

  const handleSolChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSol(Number(e.target.value));
    const params = new URLSearchParams();
    if (earth_date) params.append('earth_date', earth_date);
    if (page) params.append('page', page.toString());
    if (sol) params.append('sol', sol.toString());
    if (selectedCameras.length > 0) {
      selectedCameras.forEach(camera => {
        params.append('camera', camera);
      });
    }
    fetchDataImages(`/marsRovers/${selectedRover}/photos?${params.toString()}`);
    if (ImagesRef.current) {
      ImagesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    navigate(`?${params.toString()}`, { replace: true });
  };

  const toggleCameraSelection = (camera: string) => {
    if (selectedCameras.includes(camera)) {
      setSelectedCameras(selectedCameras.filter(cam => cam !== camera));
    } else {
      setSelectedCameras([...selectedCameras, camera]);
    }
  };

  const getSliderValuePosition = () => {
    const percentage = ((sol - 1) / (1000 - 1)) * 100;
    return `calc(${percentage}% - 20px)`;
  };

  const closeModal = () => {
    setModalFilters(false);
  };

  const handlePageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setPage(value);
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (earth_date) params.append('earth_date', earth_date);
    if (page) params.append('page', page.toString());
    if (sol) params.append('sol', sol.toString());
    if (selectedCameras.length > 0) {
      selectedCameras.forEach(camera => {
        params.append('camera', camera);
      });
    }
    fetchDataImages(`/marsRovers/${selectedRover}/photos?${params.toString()}`);
    if (ImagesRef.current) {
      ImagesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    navigate(`?${params.toString()}`, { replace: true });
    setModalFilters(false);
  };
  const clearFilters = () => {
    setEarthDate('');
    setPage(0);

    const params = new URLSearchParams();

    if (sol) params.append('sol', sol.toString());
    if (selectedCameras.length > 0) {
      selectedCameras.forEach(camera => {
        params.append('camera', camera);
      });
    }
    fetchDataImages(`/marsRovers/${selectedRover}/photos?${params.toString()}`);
    if (ImagesRef.current) {
      ImagesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    navigate(`?${params.toString()}`, { replace: true });

    setModalFilters(false);
  };

  function filterImageObjects(objectsArray: Image[]) {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];

    function isImageUrl(url: string) {
      const urlExtension = url.split('.').pop()?.toLowerCase();
      return imageExtensions.includes(urlExtension || '');
    }

    return objectsArray?.filter(obj => obj.img_src && isImageUrl(obj.img_src));
  }

  return (
    <Dashboard>
      <div className="flex justify-center p-4 items-center flex-col">
        <div className="flex w-full justify-between items-center mb-3">
          <div className="flex justify-start items-center">
            <div
              onClick={() => setModalFilters(true)}
              className="border-[0.5px] border-gray-300 rounded-md p-3 hover:border-gray-800 flex justify-center items-center h-[44px] w-[44px] cursor-pointer"
            >
              <FaFilter />
            </div>
            {filterImageObjects(images?.photos)?.length > 0 && (
              <p className="ml-4">
                You are now seeing the photos of MARS ROVER for the day{' '}
                <span className="font-bold">
                  {earth_date || formattedEarthDate}
                </span>
                .
              </p>
            )}
          </div>
        </div>
        <h2 className="bg-blue-300 rounded-t-md w-[95%] md:w-[80%] py-4 px-8">
          ROVER
        </h2>
        <div className="py-6 rounded-b-md w-[95%] md:w-[80%] flex flex-wrap gap-y-3 border-x-[1px] border-b-[1px] justify-around items-center h-full">
          <button
            className={`${selectedRover === 'curiosity' ? 'text-white bg-blue-300 border-white' : 'text-blue-500 border-blue-500'} hover:text-white hover:bg-blue-300 font-bold px-6 py-4 rounded-md border-2`}
            onClick={() => handleRoverClick('curiosity')}
          >
            Curiosity
          </button>
          <button
            className={`${selectedRover === 'opportunity' ? 'text-white bg-blue-300 border-white' : 'text-blue-500 border-blue-500'} hover:text-white hover:bg-blue-300 font-bold px-6 py-4 rounded-md border-2`}
            onClick={() => handleRoverClick('opportunity')}
          >
            Opportunity
          </button>
          <button
            className={`${selectedRover === 'spirit' ? 'text-white bg-blue-300 border-white' : 'text-blue-500 border-blue-500'} hover:text-white hover:bg-blue-300 font-bold px-6 py-4 rounded-md border-2`}
            onClick={() => handleRoverClick('spirit')}
          >
            Spirit
          </button>
        </div>

        {selectedRover && (
          <div className="w-[95%] md:w-[80%] mt-8">
            <h2 className="bg-blue-300 rounded-t-md py-4 px-8">
              SOL (Martian Day)
            </h2>
            <div className="w-full flex justify-center items-center rounded-b-md border-x-[1px] border-b-[1px]">
              <div className="relative w-[80%] py-6 h-full">
                <input
                  className="w-full"
                  type="range"
                  min="1"
                  max="1000"
                  value={sol}
                  onChange={handleSolChange}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '40px',
                    left: getSliderValuePosition(),
                    transform: 'translateX(-50%)',
                    background: '#ddd',
                    padding: '5px',
                    borderRadius: '5px',
                    fontSize: '12px',
                  }}
                >
                  Sol: {sol}
                </div>
              </div>
            </div>
          </div>
        )}

        {cameras.length > 0 && sol > 1 && (
          <div className="w-[95%] md:w-[80%] mt-8">
            <h2 className="bg-blue-300 rounded-t-md py-4 px-8">CAMERA</h2>
            <div className="py-6 rounded-b-md w-full flex flex-wrap gap-y-3 border-x-[1px] border-b-[1px] justify-around items-center h-full">
              {cameras.map((cam, index) => (
                <button
                  className={`${
                    selectedCameras.includes(cam)
                      ? 'text-white bg-blue-300 border-white'
                      : 'text-blue-500 bg-white border-blue-500 '
                  } font-bold px-6 py-4 rounded-md border-2`}
                  key={index}
                  onClick={() => toggleCameraSelection(cam)}
                >
                  {cam.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8" ref={ImagesRef}>
          {cameras && (
            <ImageSlider
              mediaList={filterImageObjects(images?.photos) || []}
              width="w-[95vw] md:w-[70vw] lg:w-[60vw]"
              height="h-[60vh] md:h-[70vh]"
              loading={loadingImages}
            />
          )}

          {filterImageObjects(images?.photos)?.length === 0 &&
            !loadingImages && (
              <div className="w-full h-full text-gray-600 text-4xl justify-center flex items-center">
                There are no data to show
              </div>
            )}
        </div>

        {modalFilters && (
          <Modal
            className="w-min sm:w-[70vw] md:w-[70vw] lg:w-min"
            onClose={closeModal}
          >
            <div className="w-[100vw] sm:w-auto p-4 lg:w-[40vw] flex flex-wrap">
              <div className="flex flex-col w-full sm:w-1/2 mr-8">
                <span className="font-inter text-md text-gray-800 mb-1 mt-2">
                  earth_date
                </span>
                <DateInput
                  label="earth_date"
                  value={earth_date}
                  onChange={(earth_date: string) => setEarthDate(earth_date)}
                />
              </div>
              <div className="flex flex-col mr-8">
                <span className="font-inter text-md text-gray-800 mb-1 mt-2">
                  Page
                </span>
                <input
                  placeholder="Nb"
                  min="0"
                  type="number"
                  value={page}
                  onChange={handlePageChange}
                  className="bg-white w-24 h-11 text-center border-[0.5px] rounded-md border-gray-300 text-gray-700 py-2 focus:outline-none"
                />
              </div>
              <div className="w-full flex justify-end items-end space-x-4 mt-4">
                <button
                  onClick={clearFilters}
                  className="text-blue-500 bg-white px-4 py-2 rounded"
                >
                  Reset
                </button>
                <button
                  onClick={applyFilters}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Apply
                </button>
              </div>
            </div>
          </Modal>
        )}

        {globalAlertManage.type !== null && (
          <div className="absolute right-0 bottom-0 mr-6 mb-6">
            <SuccessFailerAlert
              message={globalAlertManage.message}
              type={globalAlertManage.type}
            />
          </div>
        )}
      </div>
    </Dashboard>
  );
};

export default MarsRover;

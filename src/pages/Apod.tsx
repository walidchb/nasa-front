import React, { useEffect, useState } from 'react';
import Dashboard from '../components/Dashboard.tsx';
import { FaFilter } from 'react-icons/fa';
import { MdFileDownloadDone } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import ApodStore from '../stores/apodStore.ts';
import Modal from '../components/Modal.tsx';
import DateInput from '../components/CustomDateInput.tsx';
import DateRangeInput from '../components/InputRangeDate.tsx';
import ImageSlider from '../components/ImageSlider.tsx';
import SuccessFailerAlert from '../components/AlertSuccessfailer.tsx';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
function Apod() {
  const {
    images,
    fetchDataImages,
    errorGetImages,
    loadingImages,
    setImages,
    globalAlertManage,
  } = ApodStore();
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  const navigate = useNavigate();
  const query = useQuery();
  const [modalFilters, setModalFilters] = useState(false);
  const [date, setDate] = useState(query.get('date') || formattedDate);
  const [count, setCount] = useState(Number(query.get('count')) || '');
  const [thumbs, setthumbs] = useState(query.get('thumbs') || false);
  const [start_date, setStartDate] = useState(query.get('start_date') || '');
  const [end_date, setEndDate] = useState(query.get('end_date') || '');
  const [dateDisabled, setDateDisabled] = useState(false);
  const [countDisabled, setCountDisabled] = useState(false);
  const [start_dateDisabled, setStartDateDisabled] = useState(false);
  const [end_dateDisabled, setEndDateDisabled] = useState(true);

  const closeModal = () => {
    setModalFilters(false);
  };
  const toggle = () => {
    setthumbs(prevState => !prevState);
  };

  useEffect(() => {
    fetchDataImages('/apod/apod');
  }, []);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (count) params.append('count', count.toString());
    if (thumbs) params.append('thumbs', thumbs.toString());
    if (start_date) params.append('start_date', start_date);
    if (end_date) params.append('end_date', end_date);

    fetchDataImages(`/apod/apod?${params.toString()}`);

    navigate(`?${params.toString()}`, { replace: true });
    setModalFilters(false);
  };
  useEffect(() => {
    return () => {
      setImages([]);
    };
  }, []);

  const clearFilters = () => {
    setDate('');
    setCount('');
    setthumbs('');
    setStartDate('');
    setEndDate('');
    navigate('/apod');
    setModalFilters(false);
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (Number(newValue) !== 0) {
      setDate('');
      setStartDate('');
      setEndDate('');

      setEndDateDisabled(true);
      setCount(newValue);
    } else {
      setDateDisabled(false);
      setStartDateDisabled(false);
      setEndDateDisabled(false);
      setCount('');
      setDate(formattedDate);
    }
  };

  return (
    <Dashboard>
      <div className=" h-[92vh] relative p-4 flex flex-col justify-start items-start">
        <div className="flex justify-start items-center mb-3">
          <div
            onClick={() => setModalFilters(true)}
            className=" border-[0.5px] border-gray-300 rounded-md p-3 hover:border-gray-800 flex justify-center items-center h-[44px] w-[44px] cursor-pointer"
          >
            <FaFilter />
          </div>
          {Number(count) > 0 && !modalFilters ? (
            <p className="ml-4">
              You are now seeing the images of APOD for{' '}
              <span className="font-bold">{count}</span> random days.
            </p>
          ) : date && !modalFilters ? (
            <p className="ml-4">
              You are now seeing the image of APOD for the day{' '}
              <span className="font-bold">{date}</span>.
            </p>
          ) : !modalFilters ? (
            <p className="ml-4">
              You are now seeing the image of APOD from the day{' '}
              <span className="font-bold">{start_date}</span> to the day{' '}
              <span className="font-bold">{end_date || formattedDate}</span>.{' '}
            </p>
          ) : null}
        </div>

        <ImageSlider
          mediaList={Array.isArray(images) ? images : [images]}
          width="w-[95vw] md:w-[70vw] lg:w-[60vw]"
          height="h-[60vh] md:h-[70vh]"
          loading={loadingImages}
        />

        {modalFilters && (
          <Modal className={' w-min'} onClose={closeModal}>
            <div className="w-[100vw] sm:w-auto p-4 lg:w-[40vw]  flex flex-wrap">
              <div className=" mb-5 mr-8 flex flex-col">
                <span className="font-inter text-md text-gray-800 mb-1 mt-2">
                  Period time
                </span>
                <DateRangeInput
                  showErrors={!date && !count}
                  start_dateDisabled={start_dateDisabled}
                  end_dateDisabled={end_dateDisabled}
                  startDate={start_date}
                  endDate={end_date}
                  onStartDateChange={startDateValue => {
                    if (startDateValue) {
                      setCount('');
                      setDate('');

                      setEndDateDisabled(false);
                      setStartDate(startDateValue);
                    } else {
                      setCountDisabled(false);
                      setDateDisabled(false);
                      setEndDateDisabled(true);
                      setStartDate('');
                    }
                    setStartDate(startDateValue);
                  }}
                  onEndDateChange={endDateValue => {
                    setEndDate(endDateValue);
                  }}
                />
              </div>
              <div className="flex flex-col mr-8">
                <span className="font-inter text-md text-gray-800 mb-2 mt-2">
                  thumbs
                </span>
                <button
                  type="button"
                  onClick={toggle}
                  className={` flex items-center ${thumbs ? 'bg-blue-700' : 'bg-gray-200'} w-14 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out`}
                >
                  <span
                    className={`${thumbs ? 'translate-x-6 flex items-center justify-center' : 'translate-x-0'} inline-block w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out`}
                  >
                    {thumbs && <MdFileDownloadDone />}
                  </span>
                </button>
              </div>
              <div className="flex flex-col w-1/2 mr-8">
                <span className="font-inter text-md text-gray-800 mb-1 mt-2">
                  Date
                </span>{' '}
                <DateInput
                  disabled={dateDisabled}
                  label="Date"
                  value={date}
                  onChange={date => {
                    if (date) {
                      setCount('');
                      setStartDate('');
                      setEndDate('');
                      setStartDate('');

                      setEndDateDisabled(true);
                      setDate(date);
                    } else {
                      setCountDisabled(false);
                      setDateDisabled(false);
                      setStartDateDisabled(false);
                      setEndDateDisabled(false);
                      setDate('');
                    }
                  }}
                />
              </div>
              <div className="flex flex-col mr-8">
                <span className="font-inter text-md text-gray-800 mb-1 mt-2">
                  Count
                </span>
                <input
                  placeholder="Nb"
                  disabled={countDisabled}
                  min="0"
                  type="number"
                  value={count}
                  onChange={handleCountChange}
                  className="bg-white w-24 h-11 text-center border-[0.5px]  rounded-md border-gray-300  text-gray-700 py-2 focus:outline-none"
                />
              </div>

              <div className="flex  items-center gap-8 mt-4"></div>
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
}

export default Apod;

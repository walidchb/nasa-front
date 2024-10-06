import moment from 'moment';
import React, { useEffect, useState } from 'react';

import { HiArrowRight } from 'react-icons/hi2';

interface DateRangeInputProps {
  startDate: string;
  endDate: string;
  start_dateDisabled?: boolean;
  end_dateDisabled?: boolean;
  showErrors?: boolean;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}

const DateRangeInput: React.FC<DateRangeInputProps> = ({
  showErrors,
  startDate,
  endDate,
  start_dateDisabled,
  end_dateDisabled,
  onStartDateChange,
  onEndDateChange,

  ...rest
}) => {
  const [error, setError] = useState('');

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (dateValue) {
      const newDate = moment(dateValue).format('YYYY-MM-DD');
      onStartDateChange(newDate);
      validateDates(newDate, endDate);
    } else {
      onStartDateChange('');
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (dateValue) {
      const newDate = moment(dateValue).format('YYYY-MM-DD');
      onEndDateChange(newDate);
      validateDates(startDate, newDate);
    } else {
      onEndDateChange('');
    }
  };

  const validateDates = (start, end) => {
    console.log('i am herrreee');
    if (new Date(start) > new Date(end)) {
      console.log('wtffffff');
      setError('Start date cannot be after the end date.');
      onStartDateChange('');
      onEndDateChange('');
    } else {
      setError('');
    }
  };

  useEffect(() => {
    console.log('showErrors');
    console.log(showErrors);
  }, [showErrors]);

  return (
    <div className=" ">
      <div className=" flex justify-center items-center md:w-min  h-11 pl-6  p-2 rounded-md border-[0.5px] border-gray-300 font-inter text-md text-gray-400 placeholder-gray-400">
        <input
          disabled={start_dateDisabled}
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          className="w-full  sm:w-full   font-inter text-md text-gray-400 placeholder-gray-400"
          placeholder="JJ/MM/AAAA"
          {...rest}
        />

        <HiArrowRight className="mx-8 scale-150 " />

        <input
          disabled={end_dateDisabled}
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          className="w-full  sm:w-full   font-inter text-md text-gray-400 placeholder-gray-400"
          placeholder="JJ/MM/AAAA"
          {...rest}
        />
      </div>
      {showErrors && error && <p className="text-red-500"> {error}</p>}
    </div>
  );
};

export default DateRangeInput;

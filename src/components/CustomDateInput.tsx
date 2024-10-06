import React, { useState } from 'react';

import moment from 'moment';

interface CustomDateInputProps {
  value: string;
  label: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

const DateInput: React.FC<CustomDateInputProps> = ({
  value,
  onChange,
  label,
  disabled,
  ...rest
}) => {
  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (dateValue) {
      const formattedDate = moment(dateValue).format('YYYY-MM-DD');
      onChange(formattedDate);
    } else {
      onChange('');
    }
  };

  return (
    <div className="flex items-center w-full ">
      <input
        disabled={disabled}
        type="date"
        value={value}
        onChange={handleDateInputChange}
        className="w-full h-11 p-2 rounded-md border-[0.5px] border-gray-300 font-inter text-md text-gray-400 placeholder-gray-400"
        placeholder="JJ/MM/AAAA"
        {...rest}
      />
    </div>
  );
};

export default DateInput;

import Sidebar from './Sidebar.tsx';
import { useLocation } from 'react-router-dom';
import renderTitle from '../RenderTitle.ts';
import { IoMdMenu } from 'react-icons/io';

import React, { useState } from 'react';
interface DashboardProps {
  children: React.ReactNode;
}

export default function Dashboard({ children }: DashboardProps) {
  const location = useLocation();
  const [isHiden, setIsHiden] = useState(true);
  return (
    <div className="flex w-[100vw]">
      <Sidebar isHiden={isHiden} setIsHiden={setIsHiden} />
      <div className="w-full ">
        <main className="flex flex-col max-h-[100vh] overflow-auto ">
          <h1 className="font-inter h-[8vh] text-lg flex items-center px-2 border-b-2 border-blue-50 w-full font-medium text-blue-600   ">
            <IoMdMenu
              onClick={() => setIsHiden(prev => !prev)}
              className="lg:hidden scale-125 cursor-pointer mr-2"
            />
            {renderTitle(location.pathname)}
          </h1>

          {children}
        </main>
      </div>
    </div>
  );
}

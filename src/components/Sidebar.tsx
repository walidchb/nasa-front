import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { IoClose } from 'react-icons/io5';

interface SidebarItem {
  label: string;
  path?: string;
}

interface SideBarProps {
  isHiden?: boolean;
  setIsHiden?: any;
}

const Sidebar: React.FC<SideBarProps> = ({ isHiden, setIsHiden }) => {
  const location = useLocation();

  const sidebarData: SidebarItem[] = [
    {
      label: 'Astronomy Picture of the Day',
      path: '/apod',
    },
    {
      label: 'Mars Rover Photos',
      path: '/mars-rover',
    },
  ];

  return (
    <div
      className={`${
        isHiden ? 'lg:flex hidden' : 'flex'
      } flex-col items-center lg:z-0 z-50 fixed lg:static left-0 top-0 h-full bg-blue-50 lg:min-h-screen w-[70%] md:w-[45%] lg:w-auto lg:flex-col lg:items-center p-4`}
    >
      <div className="w-full justify-end flex lg:hidden pb-0 p-4">
        <IoClose
          onClick={() => setIsHiden(!isHiden)}
          className="cursor-pointer text-2xl"
        />
      </div>
      <img className="w-28" src="/images/NASALOGO.png" alt="lkjhghjk" />
      <ul className="flex flex-col items-center p-3 mb-2 w-full">
        {sidebarData.map((item, index) => (
          <li className="flex flex-col items-center w-full" key={index}>
            <Link
              to={item.path || '#'}
              className={
                location.pathname === item.path
                  ? 'flex items-center justify-between bg-blue-500 rounded-lg my-2 p-3 w-full cursor-pointer'
                  : 'flex items-center justify-between w-full hover:bg-blue-100 hover:rounded-lg p-3 cursor-pointer'
              }
            >
              <div className="flex items-center space-x-4">
                <span
                  className={
                    location.pathname === item.path
                      ? 'text-white text-lg font-normal'
                      : 'text-gray-800 text-lg font-normal'
                  }
                >
                  {item.label}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;

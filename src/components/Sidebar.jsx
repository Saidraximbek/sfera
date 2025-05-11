import React from "react";
import { NavLink } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { MdSubject } from "react-icons/md";
import { GiTeacher } from "react-icons/gi";
import { MdGroups } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import { MdOutlinePersonOff } from "react-icons/md";

const Sidebar = () => {
  return (
    <div className="w-[100%] max-w-[250px] py-10 px-4 flex flex-col gap-8 sm:w-15 md:w-80 lg:w-100">
      {/* Logo */}
      <div className="flex items-center gap-1 text-3xl mb-10 sm:text-[12px]">
        <img src="./sfera.svg" alt="sfera logo" width={75} />
        <h2 className="font-serif text-white sfera-logo hidden sm:block">Sfera</h2>
      </div>

      {/* Navigation links */}
      <ul className="pl-4 flex flex-col gap-5">
        <NavLink
          to="home"
          className={({ isActive }) =>
            isActive
              ? "flex items-center gap-2 text-gray-950 bg-amber-100 font-semibold w-full px-2 py-3 rounded-active transition-sidebar"
              : "flex items-center gap-2 text-amber-100 hover:text-blue-500 px-2 py-3 rounded-noactive"
          }
        >
          <li className="flex items-center gap-3 text-2xl">
            <IoHomeOutline className="text-2xl" />
            <span className="hidden sm:inline">Bosh sahifa</span>
          </li>
        </NavLink>

        <NavLink
          to="/lessons"
          className={({ isActive }) =>
            isActive
              ? "flex items-center gap-2 text-gray-950 bg-amber-100 font-semibold w-full px-2 py-3 rounded-active transition-sidebar"
              : "flex items-center gap-2 text-amber-100 hover:text-blue-500 px-2 py-3 rounded-noactive"
          }
        >
          <li className="flex items-center gap-3 text-2xl">
            <GiTeacher className="text-2xl" />
            <span className="hidden sm:inline">Xodimlar</span>
          </li>
        </NavLink>

        <NavLink
          to="/teachers"
          className={({ isActive }) =>
            isActive
              ? "flex items-center gap-2 text-gray-950 bg-amber-100 font-semibold w-full px-2 py-3 rounded-active transition-sidebar"
              : "flex items-center gap-2 text-amber-100 hover:text-blue-500 px-2 py-3 rounded-noactive"
          }
        >
          <li className="flex items-center gap-3 text-2xl">
            <MdGroups className="text-2xl" />
            <span className="hidden sm:inline">Guruxlar</span>
          </li>
        </NavLink>

        <NavLink
          to="/confirm"
          className={({ isActive }) =>
            isActive
              ? "flex items-center gap-2 text-gray-950 bg-amber-100 font-semibold w-full px-2 py-3 rounded-active transition-sidebar"
              : "flex items-center gap-2 text-amber-100 hover:text-blue-500 px-2 py-3 rounded-noactive"
          }
        >
          <li className="flex items-center gap-3 text-2xl">
            <GiConfirmed className="text-2xl" />
            <span className="hidden sm:inline">O'quvchilar</span>
          </li>
        </NavLink>

        <NavLink
          to="/students"
          className={({ isActive }) =>
            isActive
              ? "flex items-center gap-2 text-gray-950 bg-amber-100 font-semibold w-full px-2 py-3 rounded-active transition-sidebar"
              : "flex items-center gap-2 text-amber-100 hover:text-blue-500 px-2 py-3 rounded-noactive"
          }
        >
          <li className="flex items-center gap-3 text-2xl">
            <MdOutlinePersonOff className="text-2xl" />
            <span className="hidden sm:inline">Tasdiqlanmagan</span>
          </li>
        </NavLink>
      </ul>
    </div>
  );
};

export default Sidebar;

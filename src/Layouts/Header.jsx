import { useEffect, useState } from "react";
import logo from "../assets/images/newlogo.png";
import { Link, useLocation } from "react-router-dom";

function Header() {
  const firstname = localStorage.getItem("getfitfirstname");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [openCalories, setOpenCalories] = useState(false);
  const [openExercises, setOpenExercises] = useState(false);
  const [openUserDropdown, setOpenUserDropdown] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    setIsDarkMode(savedTheme === "dark");
  }, []);

  const handleToggle = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    setIsDarkMode(!isDarkMode);
  };

  const activeClass =
    "bg-primary/10 text-primary font-semibold dark:bg-primary/20 dark:text-primary";

  return (
    <nav className="w-64 d-none d-md-block h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col px-4 py-6 fixed left-0 top-0 overflow-y-auto shadow-lg">
      
      {/* Logo */}
      <div className="flex justify-center mb-10 ">
        <img src={logo} alt="logo" className="h-14 transition hover:scale-105" />
      </div>

      {/* Navigation */}
      <ul className="space-y-1 px-0 mx-0">

        {/* Dashboard */}
         <li className="list-none mb-2">
          <Link
            to="/"
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 
            hover:bg-gray-100 dark:hover:bg-gray-800 hover:ps-5
            ${location.pathname === "/" ? activeClass : "text-gray-700 dark:text-gray-200"}`}
          >
            <i className="bi bi-house-door text-lg"></i>
            Dashboard
          </Link>
        </li>

        {/* Calories */}
         <li className="list-none mb-2">
          <button
            onClick={() => setOpenCalories(!openCalories)}
            className="w-full flex items-center justify-between px-4 py-2 rounded-lg 
            text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 
            transition-all duration-200 hover:pl-5"
          >
            <span className="flex items-center gap-3">
              <i className="bi bi-briefcase text-lg"></i> Calories
            </span>
            <i className={`bi bi-chevron-down transition-transform duration-300 ${openCalories ? "rotate-180" : ""}`}></i>
          </button>

          {openCalories && (
            <ul className="ml-10 mt-1 space-y-1 animate-slideDown">
               <li className="list-none">
                <Link
                  to="/addcategories"
                  className="block px-3 py-2 text-sm rounded-lg text-gray-600 dark:text-gray-300 
                  hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:pl-4"
                >
                  ➤ Add Categories
                </Link>
              </li>
               <li className="list-none">
                <Link
                  to="/additems"
                  className="block px-3 py-2 text-sm rounded-lg text-gray-600 dark:text-gray-300 
                  hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:pl-4"
                >
                  ➤ Add Items
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Users */}
         <li className="list-none mb-2">
          <Link
            to="/users"
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition hover:bg-gray-100 dark:hover:bg-gray-800 hover:pl-5
             ${location.pathname === "/users" ? activeClass : "text-gray-700 dark:text-gray-200"}`}
          >
            <i className="bi bi-people text-lg"></i>
            Users
          </Link>
        </li>

        {/* Exercises */}
         <li className="list-none">
          <button
            onClick={() => setOpenExercises(!openExercises)}
            className="w-full flex items-center justify-between px-4 py-2 rounded-lg 
            text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 
            transition-all duration-200 hover:pl-5"
          >
            <span className="flex items-center gap-3">
              <i className="bi bi-person-arms-up text-lg"></i> Exercises
            </span>
            <i className={`bi bi-chevron-down transition-transform duration-300 ${openExercises ? "rotate-180" : ""}`}></i>
          </button>

          {openExercises && (
            <ul className="ml-10 mt-1 space-y-1 animate-slideDown">
               <li className="list-none">
                <Link
                  to="/addexercisecategories"
                  className="block px-3 py-2 text-sm rounded-lg text-gray-600 dark:text-gray-300 
                  hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:pl-4"
                >
                  ➤ Add Categories
                </Link>
              </li>
               <li className="list-none">
                <Link
                  to="/addexercises"
                  className="block px-3 py-2 text-sm rounded-lg text-gray-600 dark:text-gray-300 
                  hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:pl-4"
                >
                  ➤ Add Exercises
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Challenges */}
        <li className="list-none">
          <Link
            to="/challanges"
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition hover:bg-gray-100 dark:hover:bg-gray-800 hover:pl-5
            ${location.pathname === "/challanges" ? activeClass : "text-gray-700 dark:text-gray-200"}`}
          >
            <i className="bi bi-person-walking text-lg"></i>
            Challenges
          </Link>
        </li>

      </ul>

      {/* Divider */}
      <hr className="my-6 border-gray-300 dark:border-gray-700" />

      {/* User Dropdown */}
      {/* <div className="mt-auto relative">
        <button
          onClick={() => setOpenUserDropdown(!openUserDropdown)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-lg 
          bg-primary text-white shadow-md hover:shadow-lg transition"
        >
          <span className="flex items-center gap-3">
            <img
              src="https://clever.webpixels.io/img/people/img-profile.jpg"
              className="h-9 w-9 rounded-full border-2 border-white"
              alt=""
            />
            {firstname}
          </span>
          <i className="bi bi-chevron-expand text-xl"></i>
        </button>

        {openUserDropdown && (
          <div className="absolute w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-xl p-3 animate-slideDown z-50">
            
            <div className="px-3 pb-2 text-sm">
              <p className="text-gray-500 dark:text-gray-400">Signed in as</p>
              <p className="font-semibold">{firstname}</p>
            </div>

            <hr className="my-2 border-gray-300 dark:border-gray-700" />

            <Link
              to="/"
              className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <i className="bi bi-house me-2"></i>
              Home
            </Link>

            <hr className="my-2 border-gray-300 dark:border-gray-700" />

            <Link
              to="/logout"
              className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <i className="bi bi-box-arrow-left me-2"></i>
              Logout
            </Link>
          </div>
        )}
      </div> */}
    </nav>
  );
}

export default Header;

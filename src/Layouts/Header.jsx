import { useEffect, useState } from "react";
import logo from '../assets/images/logo.png'
import { Link } from "react-router-dom";

function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
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
    const firstname = localStorage.getItem("getfitfirstname")
  return (
    <>
      <nav
        className="navbar show navbar-vertical h-lg-screen navbar-expand-lg px-0 py-3 navbar-light bg-white border-bottom border-bottom-lg-0 border-end-lg scrollbar"
        id="sidebar"
      >
        <div className="container-fluid">
          <button
            className="navbar-toggler ms-n2"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#sidebarCollapse"
            aria-controls="sidebarCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <a className="navbar-brand d-flex justify-content-center py-lg-2 mb-lg-5 px-lg-6 me-0" href="/">
            <img src={logo} className="navbarlogo" alt="..." />
          </a>

          <div className="navbar-user d-lg-none">
            <div className="dropdown">
              <a
                href="#"
                id="sidebarAvatar"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <div className="avatar-parent-child">
                  <img
                    alt="..."
                    src="/img/people/img-profile.jpg"
                    className="avatar avatar- rounded-circle"
                  />
                  <span className="avatar-child avatar-badge bg-success"></span>
                </div>
              </a>
              <div className="dropdown-menu dropdown-menu-end" aria-labelledby="sidebarAvatar">

                <hr className="dropdown-divider" />
                <Link to={"/logout"}  className="dropdown-item">Logout</Link>
              </div>
            </div>
          </div>

          <div className="collapse navbar-collapse" id="sidebarCollapse">
            <ul className="navbar-nav">

              <li className="nav-item">
               
                 <Link to={"/"} className="nav-link">
                  <i className="bi bi-house-door"></i> Dashboard
                 </Link>
               
              
              </li>
              <li className="nav-item">
                <a
                  className="nav-link collapsed"
                  href="#sidebar-projects"
                  data-bs-toggle="collapse"
                  role="button"
                  aria-expanded="false"
                  aria-controls="sidebar-projects"
                >
                  <i className="bi bi-briefcase"></i> Calories
                </a>
                <div className="collapse" id="sidebar-projects">
                  <ul className="nav nav-sm flex-column">
                    <li className="nav-item">
                      <Link to={"/addcategories"}  className="nav-link">
                        Add Categories
                      </Link>
                      <Link to={"/additems"}  className="nav-link">
                        Add Items
                      </Link>
                    </li>

                  </ul>
                </div>
              </li>

               <li className="nav-item">
               
                 <Link to={"/users"} className="nav-link">
                  <i className="bi bi-people"></i> Users
                 </Link>
                           
              </li>

                <li className="nav-item">
                <a
                  className="nav-link collapsed"
                  href="#sidebar-exercises"
                  data-bs-toggle="collapse"
                  role="button"
                  aria-expanded="false"
                  aria-controls="sidebar-exercises"
                >
                <i className="bi bi-person-arms-up"></i> Exercises
                </a>
                <div className="collapse" id="sidebar-exercises">
                  <ul className="nav nav-sm flex-column">
                    <li className="nav-item">
                      <Link to={"/addexercisecategories"}  className="nav-link">
                        Add Categories
                      </Link>
                      <Link to={"/addexercises"}  className="nav-link">
                        Add Exercises
                      </Link>
                    </li>

                  </ul>
                </div>
              </li>

               <li className="nav-item">
               
                 <Link to={"/challanges"} className="nav-link">
                  <i className="bi bi-person-walking"></i> Challanges
                 </Link>
               
              
              </li>


            </ul>

            <hr className="navbar-divider my-4 opacity-70" />
            <div className="mt-auto"></div>

            <div className="my-4 px-lg-6 position-relative">
              <div className="dropup w-full">
                <button
                  className="btn-primary d-flex w-full py-3 ps-3 pe-4 align-items-center shadow shadow-3-hover rounded-3"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span className="me-3">
                    <img
                      alt="..."
                      src="https://clever.webpixels.io/img/people/img-profile.jpg"
                      className="avatar avatar-sm rounded-circle"
                    />
                  </span>
                  <span className="flex-fill text-start text-sm font-semibold">
                    {firstname}
                  </span>
                  <span>
                    <i className="bi bi-chevron-expand text-white text-opacity-70"></i>
                  </span>
                </button>
                <div className="dropdown-menu dropdown-menu-end w-full">
                  <div className="dropdown-header">
                    <span className="d-block text-sm text-muted mb-1">Signed in as</span>
                    <span className="d-block text-heading font-semibold">{firstname}</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to={"/"} className="dropdown-item" href="#">
                    <i className="bi bi-house me-3"></i>Home
                  </Link>
                
                  <div className="dropdown-divider"></div>
                  <Link to={"/logout"} className="dropdown-item" href="#">
                    <i className="bi bi-box-arrow-left me-3"></i>Logout
                  </Link>
                </div>
              </div>
               <div className="nav-item px-3 py-2 mt-2">
              {/* <div className="d-flex gap-3 justify-content-center align-items-center">
                <div>
                  <i className="bi bi-moon-stars me-2 text-warning"></i>
                  <span className="text-heading text-sm fw-bold">Dark mode</span>
                </div>
                <div className="ms-auto">
                  <div className="form-check form-switch me-n2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="switch-dark-mode"
                      checked={isDarkMode}
                      onChange={handleToggle}
                    />
                  </div>
                </div>
              </div> */}
            </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Header

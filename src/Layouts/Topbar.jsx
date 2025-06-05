import React from 'react'
import { Link } from 'react-router-dom'

function Topbar() {
    const firstname = localStorage.getItem("getfitfirstname")
    return (
        <>
            <nav className="navbar navbar-light position-lg-sticky top-lg-0 d-none d-lg-block overlap-10 flex-none bg-white border-bottom px-0 py-3"
                id="topbar">
                <div className="container-fluid">
                    <div className="hstack gap-2"><button type="button"
                        className="btn btn-sm btn-square bg-tertiary bg-opacity-20 bg-opacity-100-hover text-tertiary text-white-hover">C</button>
                        <button type="button"
                            className="btn btn-sm btn-square bg-primary bg-opacity-20 bg-opacity-100-hover text-primary text-white-hover">D</button>
                        <button type="button"
                            className="btn btn-sm btn-square bg-warning bg-opacity-20 bg-opacity-100-hover text-warning text-white-hover">A</button>
                        <button type="button" className="btn btn-sm btn-square btn-neutral border-dashed shadow-none"><i
                            className="bi bi-plus-lg"></i></button>
                    </div>
                    <form className="form-inline ms-auto me-4 d-none d-md-flex">
                        <div className="input-group input-group-inline shadow-none"><span
                            className="input-group-text border-0 shadow-none ps-0 pe-3">
                            <i className="bi bi-search"></i>
                        </span><input type="text" className="form-control form-control-flush" placeholder="Search"
                            aria-label="Search" /></div>
                    </form>
                    <div className="navbar-user d-none d-sm-block">
                        <div className="hstack gap-3 ms-4">
                            <div className="dropdown"><a href="#"
                                className="nav-link px-3 text-base text-muted text-opacity-70 text-opacity-100-hover"
                                id="dropdown-notifications" data-bs-toggle="dropdown" aria-expanded="false"><i
                                    className="bi bi-bell-fill"></i></a>
                                <div className="dropdown-menu dropdown-menu-end px-2"
                                    aria-labelledby="dropdown-notifications">
                                    <div className="dropdown-item d-flex align-items-center">
                                        <h6 className="dropdown-header p-0 m-0 font-semibold">Notifications</h6><a href="#"
                                            className="text-sm font-semibold ms-auto">Clear all</a>
                                    </div>
                                    <div className="dropdown-item py-3 d-flex">
                                        <div>
                                            <div className="avatar bg-tertiary text-white rounded-circle">RF</div>
                                        </div>
                                        <div className="flex-fill ms-3">
                                            <div className="text-sm lg-snug w-64 text-wrap"><a href="#"
                                                className="font-semibold text-heading text-primary-hover">Robert</a>
                                                sent a message to <a href="#"
                                                    className="font-semibold text-heading text-primary-hover">Webpixels</a>
                                            </div><span className="text-muted text-xs">30 mins ago</span>
                                        </div>
                                    </div>
                                    <div className="dropdown-item py-3 d-flex">
                                        <div><img alt="..." src="https://clever.webpixels.io/img/people/img-profile.jpg" className="avatar rounded-circle" />
                                        </div>
                                        <div className="flex-fill ms-3">
                                            <div className="text-sm lg-snug w-64 text-wrap"><a href="#"
                                                className="font-semibold text-heading text-primary-hover">Robert</a>
                                                sent a message to <a href="#"
                                                    className="font-semibold text-heading text-primary-hover">Webpixels</a>
                                            </div><span className="text-muted text-xs">30 mins ago</span>
                                        </div>
                                    </div>
                                    <div className="dropdown-item py-3 d-flex">
                                        <div><img alt="..." src="https://clever.webpixels.io/img/people/img-profile.jpg" className="avatar rounded-circle" />
                                        </div>
                                        <div className="flex-fill ms-3">
                                            <div className="text-sm lg-snug w-64 text-wrap"><a href="#"
                                                className="font-semibold text-heading text-primary-hover">Robert</a>
                                                sent a message to <a href="#"
                                                    className="font-semibold text-heading text-primary-hover">Webpixels</a>
                                            </div><span className="text-muted text-xs">30 mins ago</span>
                                        </div>
                                    </div>
                                    <div className="dropdown-item py-3 d-flex">
                                        <div>
                                            <div className="avatar bg-success text-white rounded-circle">KW</div>
                                        </div>
                                        <div className="flex-fill ms-3">
                                            <div className="text-sm lg-snug w-64 text-wrap"><a href="#"
                                                className="font-semibold text-heading text-primary-hover">Robert</a>
                                                sent a message to <a href="#"
                                                    className="font-semibold text-heading text-primary-hover">Webpixels</a>
                                            </div><span className="text-muted text-xs">30 mins ago</span>
                                        </div>
                                    </div>
                                    <div className="dropdown-item py-3 d-flex">
                                        <div><img alt="..." src="https://clever.webpixels.io/img/people/img-profile.jpg" className="avatar rounded-circle" />
                                        </div>
                                        <div className="flex-fill ms-3">
                                            <div className="text-sm lg-snug w-64 text-wrap"><a href="#"
                                                className="font-semibold text-heading text-primary-hover">Robert</a>
                                                sent a message to <a href="#"
                                                    className="font-semibold text-heading text-primary-hover">Webpixels</a>
                                            </div><span className="text-muted text-xs">30 mins ago</span>
                                        </div>
                                    </div>
                                    <div className="dropdown-divider"></div>
                                    <div className="dropdown-item py-2 text-center"><a href="#"
                                        className="font-semibold text-muted text-primary-hover">View all</a></div>
                                </div>
                            </div>
                            <div className="dropdown"><a className="d-flex align-items-center" href="#" role="button"
                                data-bs-toggle="dropdown" aria-haspopup="false" aria-expanded="false">
                                <div>
                                    <div className="avatar avatar-sm bg-warning rounded-circle text-white"><img
                                        alt="..." src="https://clever.webpixels.io/img/people/img-profile.jpg" /></div>
                                </div>
                                <div className="d-none d-sm-block ms-3"><span className="h6">{firstname}</span></div>
                                <div className="d-none d-md-block ms-md-2"><i
                                    className="bi bi-chevron-down text-muted text-xs"></i></div>
                            </a>
                                <div className="dropdown-menu dropdown-menu-end">
                                    <div className="dropdown-header"><span className="d-block text-sm text-muted mb-1">Signed in
                                        as</span> <span className="d-block text-heading font-semibold">{firstname}</span></div>
                                    <div className="dropdown-divider"></div><Link to={"/"} className="dropdown-item" href="#"><i
                                        className="bi bi-house me-3"></i>Home </Link>
                                  
                                    <Link to={"/logout"} className="dropdown-item" href="#"><i
                                        className="bi bi-person me-3"></i>Logout</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Topbar

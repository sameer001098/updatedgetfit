import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Topbar from '../Layouts/Topbar'

function Dashboard() {
    const [totalUsers, setTotalUsers] = useState(null);
    const [challengeCount, setChallengeCount] = useState(null);
    const [workoutCount, setWorkoutCount] = useState(null);

    const [activeUsers, setActiveUsers] = useState(null);
    const [activeTrainers, setActiveTrainers] = useState(null);

    useEffect(() => {
        axios.get('https://projects.funtashtechnologies.com/getfitapi/adminpanel/getusers.php')
              .then(response => {
      if (response.data.ResponseCode === "200") {
        const users = response.data.Data;  // <-- Here!

        setTotalUsers(users.length);  // total users count

        const filteredUsers = users.filter(user => user.role === "user");
        const filteredTrainers = users.filter(user => user.role === "trainer");

        setActiveUsers(filteredUsers.length);
        setActiveTrainers(filteredTrainers.length);
      } else {
        console.error(response.data.ResponseMsg);
      }
    })
    .catch(error => {
      console.error('API Error:', error);
    });
}, []);
    useEffect(() => {
        fetch("https://projects.funtashtechnologies.com/getfitapi/getchallanges.php")
            .then((res) => res.json())
            .then((data) => {
                if (data.Result === "true" && Array.isArray(data.Data)) {
                    setChallengeCount(data.Data.length);
                } else {
                    setChallengeCount(0);
                }
            })
            .catch(() => setChallengeCount(0));
    }, []);

    useEffect(() => {
        fetch("https://projects.funtashtechnologies.com/getfitapi/getworkouts.php")
            .then((res) => res.json())
            .then((data) => {
                if (data.Result === "true" && Array.isArray(data.Data)) {
                    setWorkoutCount(data.Data.length);
                } else {
                    setWorkoutCount(0);
                }
            })
            .catch(() => setWorkoutCount(0));
    }, []);
    return (
        <div className='flex-lg-1 h-screen overflow-y-lg-auto'>
            <Topbar />

            <main className="py-6 bg-surface-secondary ml-250px">
                <div
                    className="offcanvas offcanvas-end w-full w-lg-1/3"
                    data-bs-scroll="true"
                    data-bs-backdrop="true"
                    tabIndex="-1"
                    id="offcanvasCreate"
                    aria-labelledby="offcanvasCreateLabel"
                >
                    <div className="offcanvas-header border-bottom py-5 bg-surface-secondary">
                        <h5 className="offcanvas-title" id="offcanvasCreateLabel">
                            Create a new project
                        </h5>
                        <button
                            type="button"
                            className="btn-close text-reset text-xs"
                            data-bs-dismiss="offcanvas"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="offcanvas-body vstack gap-5">
                        <div>
                            <label className="form-label">Name</label>
                            <input type="text" className="form-control" placeholder="Project name" />
                            <span className="d-block mt-2 text-sm text-muted">Make it unique.</span>
                        </div>
                        <div>
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-control"
                                placeholder="Project description ..."
                                rows="2"
                            ></textarea>
                            <span className="d-block mt-2 text-sm text-muted">Make it unique.</span>
                        </div>
                        <hr className="my-0" />
                        <div>
                            <label className="form-label">Select view</label>
                            <div className="hstack gap-3">
                                {["kanban", "list", "table"].map((view, index) => (
                                    <div className="form-item-checkable" key={index}>
                                        <input
                                            className="form-item-check"
                                            type="radio"
                                            name="project-view"
                                            id={`project-view-${view}`}
                                            defaultChecked={view === "kanban"}
                                        />
                                        <label className="form-item" htmlFor={`project-view-${view}`}>
                                            <span className="form-item-click d-inline-flex align-items-center justify-content-center form-control w-24 h-24 text-center text-muted">
                                                <i className={`bi bi-${view}`} style={{ fontSize: "2rem" }}></i>
                                            </span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <hr className="my-0" />
                        <div className="vstack gap-4">
                            <div className="d-flex gap-3">
                                <input
                                    className="form-check-input flex-shrink-0 text-lg"
                                    type="radio"
                                    name="projecy-privacy"
                                    defaultChecked
                                />
                                <div className="pt-1 form-checked-content">
                                    <h6 className="mb-1 lh-relaxed">Private</h6>
                                    <span className="d-block text-muted text-sm">
                                        <i className="bi bi-lock-fill me-1"></i> Only you will be able to see this project
                                    </span>
                                </div>
                            </div>
                            <div className="d-flex gap-3">
                                <input
                                    className="form-check-input flex-shrink-0 text-lg"
                                    type="radio"
                                    name="projecy-privacy"
                                />
                                <div className="pt-1 form-checked-content">
                                    <h6 className="mb-1 lh-relaxed">Make it public</h6>
                                    <span className="d-block text-muted text-sm">
                                        <i className="bi bi-people-fill me-1"></i> Everyone in this workspace will be able to
                                        see this project
                                    </span>
                                </div>
                            </div>
                        </div>
                        <hr className="my-0" />
                        <div className="row gx-4">
                            <div className="col-md">
                                <label className="form-label">Client</label>
                                <select className="form-select">
                                    <option>Webpixels</option>
                                    <option>Apple</option>
                                    <option>Elrond</option>
                                </select>
                            </div>
                            <div className="col-auto align-self-end">
                                <span className="d-inline-block py-3 font-semibold text-muted">or</span>
                            </div>
                            <div className="col-md-auto align-self-end">
                                <button type="button" className="btn btn-neutral">
                                    <i className="bi bi-plus-lg me-2"></i>New client
                                </button>
                            </div>
                        </div>
                        <div className="row gx-4">
                            <div className="col-md-6">
                                <label className="form-label">Start date</label>
                                <div className="input-group input-group-inline datepicker">
                                    <span className="input-group-text pe-2">
                                        <i className="bi bi-calendar"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control flatpickr-input"
                                        placeholder="Select date"
                                        data-input=""
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Due date</label>
                                <div className="input-group input-group-inline datepicker">
                                    <span className="input-group-text pe-2">
                                        <i className="bi bi-calendar"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control flatpickr-input"
                                        placeholder="Select date"
                                        data-input=""
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer py-2 bg-surface-secondary">
                        <button type="button" className="btn btn-sm btn-neutral" data-bs-dismiss="offcanvas">
                            Close
                        </button>
                        <button type="button" className="btn btn-sm btn-primary">
                            Save
                        </button>
                    </div>
                </div>


                <div className="modal fade" id="modalExport" tabIndex="-1" aria-labelledby="modalExport" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content shadow-3">
                            <div className="modal-header">
                                <div className="icon icon-shape rounded-3 bg-soft-primary text-primary text-lg me-4">
                                    <i className="bi bi-globe"></i>
                                </div>
                                <div>
                                    <h5 className="mb-1">Share to web</h5>
                                    <small className="d-block text-xs text-muted">
                                        Publish and share link with anyone
                                    </small>
                                </div>
                                <div className="ms-auto">
                                    <div className="form-check form-switch me-n2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="flexSwitchCheckChecked"
                                            defaultChecked
                                        />
                                        <label className="form-check-label" htmlFor="flexSwitchCheckChecked"></label>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-body">
                                <div className="d-flex align-items-center mb-5">
                                    <div>
                                        <p className="text-sm">
                                            Anyone with this link <span className="font-bold text-heading">can view</span>
                                        </p>
                                    </div>
                                    <div className="ms-auto">
                                        <a href="#" className="text-sm font-semibold">
                                            Settings
                                        </a>
                                    </div>
                                </div>
                                <div>
                                    <div className="input-group input-group-inline">
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="username"
                                            defaultValue="https://webpixels.io/your-amazing-link"
                                        />
                                        <span className="input-group-text">
                                            <i className="bi bi-clipboard"></i>
                                        </span>
                                    </div>
                                    <span className="mt-2 valid-feedback">Looks good!</span>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <div className="me-auto">
                                    <a href="#" className="text-sm font-semibold">
                                        <i className="bi bi-clipboard me-2"></i>Copy link
                                    </a>
                                </div>
                                <button type="button" className="btn btn-sm btn-neutral" data-bs-dismiss="modal">
                                    Close
                                </button>
                                <button type="button" className="btn btn-sm btn-success">
                                    Share file
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="container-fluid">
                    <div className="row g-6 mb-6">
                        <div className="col-xl-3 col-sm-6 col-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col">
                                            <span className="h6 font-semibold text-muted text-sm d-block mb-2">Total Users</span>
                                           <span className="h3 font-bold mb-0">{totalUsers !== null ? totalUsers : '...'}</span>
                                        </div>
                                        <div className="col-auto">
                                            <div className="icon icon-shape bg-tertiary text-white text-lg rounded-circle">
                                               
                                                <i className="bi bi-person-fill-check"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-2 mb-0 text-sm">
                                        <span className="badge badge-pill bg-soft-success text-success me-2">
                                            <i className="bi bi-arrow-up me-1"></i>30%
                                        </span>
                                        <span className="text-nowrap text-xs text-muted">Since last month</span>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="col-xl-3 col-sm-6 col-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col">
                                            <span className="h6 font-semibold text-muted text-sm d-block mb-2">Active Users</span>
                                            <span className="h3 font-bold mb-0">{activeUsers !== null ? activeUsers : '...'}</span>
                                        </div>
                                        <div className="col-auto">
                                            <div className="icon icon-shape bg-primary text-white text-lg rounded-circle">
                                                <i className="bi bi-people"></i>
                                                
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-2 mb-0 text-sm">
                                        <span className="badge badge-pill bg-soft-success text-success me-2">
                                            <i className="bi bi-arrow-up me-1"></i>23%
                                        </span>
                                        <span className="text-nowrap text-xs text-muted">Since last week</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-sm-6 col-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col">
                                            <span className="h6 font-semibold text-muted text-sm d-block mb-2">Active Trainers</span>
                                           <span className="h3 font-bold mb-0">{activeTrainers !== null ? activeTrainers : '...'}</span>

                                        </div>
                                        <div className="col-auto">
                                            <div className="icon icon-shape bg-warning text-white text-lg rounded-circle">
                                               <i className="bi bi-person-raised-hand"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-2 mb-0 text-sm">
                                        <span className="badge badge-pill bg-soft-success text-success me-2">
                                            <i className="bi bi-arrow-up me-1"></i>15%
                                        </span>
                                        <span className="text-nowrap text-xs text-muted">Since yesterday</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-3 col-sm-6 col-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col">
                                            <span className="h6 font-semibold text-muted text-sm d-block mb-2"> Challanges</span>
                                            <span className="h3 font-bold mb-0">  {challengeCount !== null ? challengeCount : "..."}</span>
                                        </div>
                                        <div className="col-auto">
                                            <div className="icon icon-shape bg-info text-white text-lg rounded-circle">
                                                <i className="bi bi-person-walking"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-2 mb-0 text-sm">
                                        <span className="badge badge-pill bg-soft-success text-success me-2">
                                            <i className="bi bi-arrow-down me-1"></i>+10%
                                        </span>
                                        <span className="text-nowrap text-xs text-muted">Since last month</span>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>

                

                </div>
            </main>


        </div>
    )
}

export default Dashboard

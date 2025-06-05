import React, { useEffect, useState } from 'react';
import Topbar from '../Layouts/Topbar';
import axios from 'axios';

function Users() {
    const [usersData, setUsersData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [trainersPage, setTrainersPage] = useState(1);
    const trainersPerPage = 10;


    const [usersPage, setUsersPage] = useState(1);
    const usersPerPage = 10;


    useEffect(() => {
        axios.get('https://projects.funtashtechnologies.com/getfitapi/adminpanel/getusers.php')
            .then(res => {
                if (res.data?.Result === "true") {
                    setUsersData(res.data.Data || []);
                }
            })
            .catch(err => {
                console.error("Error fetching users:", err);
            })
            .finally(() => setLoading(false));
    }, []);

    const trainers = usersData.filter(user => user.role === "trainer");
    const normalUsers = usersData.filter(user => user.role === "user");

    const handleDelete = (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        axios.post('https://projects.funtashtechnologies.com/getfitapi/adminpanel/deleteusers.php', {
            id: userId
        })
            .then(res => {
                if (res.data?.Result === "true") {
                    alert("User deleted successfully");
                    setUsersData(prev => prev.filter(user => user.id !== userId));
                } else {
                    alert("Failed to delete user: " + res.data?.ResponseMsg);
                }
            })
            .catch(err => {
                console.error("Error deleting user:", err);
                alert("An error occurred while deleting the user.");
            });
    };
    const indexOfLastTrainer = trainersPage * trainersPerPage;
    const indexOfFirstTrainer = indexOfLastTrainer - trainersPerPage;
    const currentTrainers = trainers.slice(indexOfFirstTrainer, indexOfLastTrainer);
    const totalTrainerPages = Math.ceil(trainers.length / trainersPerPage);

    // For Users
    const indexOfLastUser = usersPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = normalUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalUserPages = Math.ceil(normalUsers.length / usersPerPage);


    const renderUserRow = (user, srNo) => (
        <tr key={user.id}>
            <th scope="row">{srNo}</th>
            <td>{user.firstname} {user.lastname}</td>
            <td>{user.email}</td>
            <td>{user.phone}</td>
            <td className=''><button type="button" class="btn  btn-sm bg-warning bg-opacity-20 bg-opacity-100-hover text-warning text-white-hover">Unpaid</button></td>
            <td>
                <button className="btn btn-sm btn-neutral me-1">View</button>
                <button
                    className="btn btn-sm btn-square btn-neutral text-danger-hover"
                    onClick={() => handleDelete(user.id)}
                >
                    <i className="bi bi-trash3-fill"></i>
                </button>
            </td>
        </tr>
    );

    return (
        <div className='flex-lg-1 h-screen overflow-y-lg-auto'>
            <Topbar />

            <main className="py-6 px-3 bg-surface-secondary">
                <div className="container-fluid max-w-screen-lg vstack gap-5">
                    <h1 className="h3 ls-tight mb-0">Users</h1>

                    <ul className="nav nav-pills mb-3 w-100" id="pills-tab" role="tablist">
                        <li className="nav-item w-50 pe-1" role="presentation">
                            <button className="nav-link w-100 active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Trainers</button>
                        </li>
                        <li className="nav-item w-50 ps-1" role="presentation">
                            <button className="nav-link w-100" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Users</button>
                        </li>
                    </ul>

                    <div className="tab-content" id="pills-tabContent">
                        {/* Trainers Tab */}
                        <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabIndex="0">
                            <div className="card">
                                <div className="card-body">
                                    <table className="table table-hover table-nowrap">
                                        <thead className="table-light">
                                            <tr>
                                                <th>#</th>
                                                <th>Fullname</th>
                                                <th>Email address</th>
                                                <th>Phone</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading ? (
                                                <tr><td colSpan="6">Loading...</td></tr>
                                            ) : currentTrainers.length > 0 ? (
                                                currentTrainers.map((trainer, index) => renderUserRow(trainer, indexOfFirstTrainer + index + 1))
                                            ) : (
                                                <tr><td colSpan="6">No trainers found.</td></tr>
                                            )}

                                        </tbody>
                                    </table>

                                    <div className="d-flex justify-content-center align-items-center mt-3">
                                        <button
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() => setTrainersPage(prev => Math.max(prev - 1, 1))}
                                            disabled={trainersPage === 1}
                                        >
                                             <i className="bi bi-arrow-left"></i>
                                        </button>

                                        <span className="me-2">Page {trainersPage} of {totalTrainerPages}</span>

                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => setTrainersPage(prev => Math.min(prev + 1, totalTrainerPages))}
                                            disabled={trainersPage === totalTrainerPages}
                                        >
                                             <i className="bi bi-arrow-right"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Users Tab */}
                        <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabIndex="0">
                            <div className="card">
                                <div className="card-body">
                                    <table className="table table-hover table-nowrap">
                                        <thead className="table-light">
                                            <tr>
                                                <th>#</th>
                                                <th>Fullname</th>

                                                <th>Email address</th>
                                                <th>Phone</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading ? (
                                                <tr><td colSpan="6">Loading...</td></tr>
                                            ) : currentUsers.length > 0 ? (
                                                currentUsers.map((user, index) => renderUserRow(user, indexOfFirstUser + index + 1))
                                            ) : (
                                                <tr><td colSpan="6">No users found.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                    <div className="d-flex justify-content-center align-items-center mt-3">
                                        <button
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() => setUsersPage(prev => Math.max(prev - 1, 1))}
                                            disabled={usersPage === 1}
                                        >
                                             <i className="bi bi-arrow-left"></i>
                                        </button>

                                        <span className="me-2">Page {usersPage} of {totalUserPages}</span>

                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => setUsersPage(prev => Math.min(prev + 1, totalUserPages))}
                                            disabled={usersPage === totalUserPages}
                                        >
                                          <i className="bi bi-arrow-right"></i>
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Users;

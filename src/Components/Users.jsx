import React, { useEffect, useState } from 'react';
import Topbar from '../Layouts/Topbar';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Users() {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  const [trainersPage, setTrainersPage] = useState(1);
  const [usersPage, setUsersPage] = useState(1);

  const trainersPerPage = 10;
  const usersPerPage = 10;

  // ✅ Fetch all users
  const fetchUsers = () => {
    setLoading(true);
    axios
      .get('https://projects.funtashtechnologies.com/getfitapi/adminpanel/getusers.php')
      .then((res) => {
        if (res.data?.Result === 'true') {
          setUsersData(res.data.Data || []);
        }
      })
      .catch((err) => console.error('Error fetching users:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const trainers = usersData.filter((user) => user.role === 'trainer');
  const normalUsers = usersData.filter((user) => user.role === 'user');

  // ✅ DELETE handler with confirmation
  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    try {
      const res = await axios.post('https://projects.funtashtechnologies.com/getfitapi/adminpanel/deleteusers.php', {
        id: userId,
      });

      if (res.data?.status === true || res.data?.Result === 'true') {
        alert('✅ User deleted successfully.');
        fetchUsers(); // refresh list
      } else {
        alert('❌ Failed to delete user: ' + (res.data?.message || res.data?.ResponseMsg || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('⚠️ An error occurred while deleting the user.');
    }
  };

  const indexOfLastTrainer = trainersPage * trainersPerPage;
  const indexOfFirstTrainer = indexOfLastTrainer - trainersPerPage;
  const currentTrainers = trainers.slice(indexOfFirstTrainer, indexOfLastTrainer);
  const totalTrainerPages = Math.ceil(trainers.length / trainersPerPage);

  const indexOfLastUser = usersPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = normalUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalUserPages = Math.ceil(normalUsers.length / usersPerPage);

  const handleView = (user) => {
    setSelectedUser(user);
    const modal = new window.bootstrap.Modal(document.getElementById('viewUserModal'));
    modal.show();
  };

  const renderUserRow = (user, srNo) => (
    <tr key={user.id}>
      <th scope="row">{srNo}</th>
      <td>{user.firstname} {user.lastname}</td>
      <td>{user.email}</td>
      <td>{user.phone}</td>
      <td>
        <Link to={`/details/${user.id}`}
          className="btn btn-sm btn-neutral me-1"
       
        >
          View
        </Link>
        <button
          className="btn btn-sm btn-square btn-neutral text-danger-hover"
          onClick={() => handleDelete(user.id)}
        >
          <i className="bi bi-trash3-fill text-danger"></i>
        </button>
      </td>
    </tr>
  );

  return (
    <div className="flex-lg-1 h-screen overflow-y-lg-auto">
      <Topbar />

      <main className="py-6 px-3 bg-surface-secondary ml-[255px]">
        <div className="container-fluid max-w-screen-lg vstack gap-2">
          <h1 className="h3  mb-0">Users</h1>

          <ul className="nav nav-pills mb-3 w-100" id="pills-tab" role="tablist">
            <li className="nav-item w-50 pe-1" role="presentation">
              <button
                className="nav-link w-100 active"
                id="pills-home-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-home"
                type="button"
                role="tab"
              >
                Trainers
              </button>
            </li>
            <li className="nav-item w-50 ps-1" role="presentation">
              <button
                className="nav-link w-100"
                id="pills-profile-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-profile"
                type="button"
                role="tab"
              >
                Users
              </button>
            </li>
          </ul>

          <div className="tab-content" id="pills-tabContent">
            {/* Trainers Tab */}
            <div className="tab-pane fade show active" id="pills-home" role="tabpanel">
              <div className="card">
                <div className="card-body">
                  <table className="table table-hover table-nowrap">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Fullname</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan="5">Loading...</td></tr>
                      ) : currentTrainers.length > 0 ? (
                        currentTrainers.map((trainer, index) =>
                          renderUserRow(trainer, indexOfFirstTrainer + index + 1)
                        )
                      ) : (
                        <tr><td colSpan="5">No trainers found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Users Tab */}
            <div className="tab-pane fade" id="pills-profile" role="tabpanel">
              <div className="card">
                <div className="card-body">
                  <table className="table table-hover table-nowrap">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Fullname</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan="5">Loading...</td></tr>
                      ) : currentUsers.length > 0 ? (
                        currentUsers.map((user, index) =>
                          renderUserRow(user, indexOfFirstUser + index + 1)
                        )
                      ) : (
                        <tr><td colSpan="5">No users found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* User Details Modal */}
      <div className="modal fade" id="viewUserModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">User Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div className="modal-body">
              {selectedUser ? (
                <div className="container-fluid">
                  <div className="row mb-4">
                    <div className="col-md-4 text-center">
                      <img
                        src={`https://projects.funtashtechnologies.com/getfitapi/${selectedUser.profileimage}`}
                        alt="Profile"
                        className="img-fluid rounded-circle mb-3 border"
                        width="140"
                        height="140"
                      />
                      <h4 className="fw-bold mb-2">{selectedUser.firstname} {selectedUser.lastname}</h4>
                      <p className="text-muted mb-2">
                        Role: <span className='text-dark h5'>{selectedUser.role || "N/A"}</span>
                      </p>
                      <p className="text-muted mb-0">
                        Visibility: <span className='text-dark h5'>{selectedUser.profilevisibility || "N/A"}</span>
                      </p>
                    </div>

                    <div className="col-md-8">
                      <div className="row">
                        {Object.entries(selectedUser).map(([key, value]) => {
                          if (["id", "profileimage", "firstname", "lastname", "role", "profilevisibility"].includes(key))
                            return null;
                          return (
                            <div className="col-md-6 mb-2 mb-md-4 px-2" key={key}>
                              <strong className="text-capitalize">{key.replace(/_/g, " ")}:</strong>{" "}
                              <span className='text-dark fw-bold'>{value || ""}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p>No user selected</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;

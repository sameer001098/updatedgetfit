import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Topbar from '../Layouts/Topbar';

function Challanges() {
    const [challenges, setChallenges] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const challengesPerPage = 10;
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        entryFee: '',
        reward: '',
        image: null,
        video: null,
    });
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const response = await axios.get(
                    'https://projects.funtashtechnologies.com/getfitapi/caloriesitems/getchallanges.php'
                );
                if (response.data.ResponseCode === "200") {
                    setChallenges(response.data.Data);
                } else {
                    alert("Failed to load data");
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                alert("Something went wrong");
            }
        };

        fetchChallenges();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;

        if (type === 'file') {
            setFormData((prev) => ({
                ...prev,
                [name]: e.target.files[0],
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('entryFee', formData.entryFee);
        data.append('reward', formData.reward);
        data.append('image', formData.image);
        data.append('video', formData.video);

        setLoading(true);

        try {
            const response = await axios.post(
                'https://projects.funtashtechnologies.com/getfitapi/challanges.php',
                data
            );
            alert(response.data.ResponseMsg);
            setFormData({
                title: '',
                description: '',
                entryFee: '',
                reward: '',
                image: null,
                video: null,
            });

            const modalEl = document.getElementById('exampleModal');
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            if (modalInstance) {
                modalInstance.hide();
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong!');
        } finally {
            setLoading(false);
        }
    };
    const indexOfLast = currentPage * challengesPerPage;
    const indexOfFirst = indexOfLast - challengesPerPage;
    const currentChallenges = challenges.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(challenges.length / challengesPerPage);

    const handleView = async (id) => {
        try {
            const response = await axios.get(`https://projects.funtashtechnologies.com/getfitapi/caloriesitems/getchallangesbyid.php?id=${id}`);
            if (response.data.ResponseCode === "200") {
                const data = response.data.Data;
                setFormData({
                    title: data.title || '',
                    description: data.description || '',
                    entryFee: data.entryFee || '',
                    reward: data.reward || '',
                    image: null,
                    video: null,
                });
                setIsEditMode(true);
                setCurrentId(id);
                const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
                modal.show();
            } else {
                alert('Challenge not found');
            }
        } catch (error) {
            console.error('Error fetching challenge:', error);
            alert('Failed to fetch challenge');
        }
    };

    const handleAddClick = () => {
        setIsEditMode(false);
        setCurrentId(null);
        setFormData({
            title: '',
            description: '',
            entryFee: '',
            reward: '',
            image: null,
            video: null,
        });
    };

    return (
        <div className='flex-lg-1 h-screen overflow-y-lg-auto'>
            <Topbar />
            <main className="py-6 px-3 bg-surface-secondary">
                <div className="container-fluid max-w-screen-lg vstack gap-5">
                    <div
                        className="modal"
                        id="exampleModal"
                        tabIndex="-1"
                        aria-labelledby="exampleModalLabel"
                        aria-modal="true"
                        role="dialog"
                    >
                        <div className="modal-dialog modal-lg">
                            <form className="modal-content" onSubmit={handleSubmit}>
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5">
                                        {isEditMode ? 'Edit Challenge' : 'Add Challenge'}
                                    </h1>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                    ></button>
                                </div>

                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Title</label>
                                            <input
                                                className="form-control"
                                                placeholder="Add Title"
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Entry Fee</label>
                                            <input
                                                className="form-control"
                                                placeholder="Entry Fee"
                                                type="number"
                                                name="entryFee"
                                                value={formData.entryFee}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Reward</label>
                                            <input
                                                className="form-control"
                                                placeholder="Reward"
                                                type="number"
                                                name="reward"
                                                value={formData.reward}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="col-md-12 mb-3">
                                            <label className="form-label">Add Description</label>
                                            <textarea
                                                name="description"
                                                rows="4"
                                                placeholder="Type here..."
                                                className="form-control"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                            ></textarea>
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Challenge Thumbnail</label>
                                            <input
                                                className="form-control"
                                                type="file"
                                                name="image"
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Challenge Video</label>
                                            <input
                                                className="form-control"
                                                type="file"
                                                name="video"
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="col-md-12 text-end">
                                            <button className="btn btn-primary" type="submit" disabled={loading}>
                                                {loading ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-footer"></div>
                            </form>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <h1 className="h3 ls-tight mb-0"> Challanges</h1>
                        </div>
                        <div className="col ms-auto d-flex justify-content-md-end">
                            <button
                                className="btn btn-primary w-max btn-sm"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                                onClick={handleAddClick}
                            >
                                + Add
                            </button>
                        </div>
                    </div>

                    <div className="my-3"></div>
                    <div className="card">
                        <div className="card-body">
                            <table className="table table-hover table-nowrap">
                                <thead className="table-light">
                                    <tr>
                                        <th>#</th>
                                        <th>Title</th>
                                        <th>Entry Fee</th>
                                        <th>Reward</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {challenges.map((item, index) => (
                                        <tr key={item.id}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{item.title}</td>
                                            <td>{item.entryFee}</td>
                                            <td>{item.reward}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-neutral me-1"
                                                    onClick={() => handleView(item.id)}
                                                >
                                                    View
                                                </button>
                                                <button className="btn btn-sm btn-square btn-neutral text-danger-hover">
                                                    <i className="bi bi-trash3-fill"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {challenges.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="text-center">Loading...</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <div className="d-flex justify-content-center align-items-center mt-3">
                                <button
                                    className="btn btn-sm btn-primary me-2"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                     <i className="bi bi-arrow-left"></i>
                                </button>

                                <span className="me-2">Page {currentPage} of {totalPages}</span>

                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    <i className="bi bi-arrow-right"></i>
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

export default Challanges;

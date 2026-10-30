import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Topbar from '../Layouts/Topbar';

function Challangedetails() {
    const { id } = useParams();
    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);
    const [completedChallenges, setCompletedChallenges] = useState([]);
    const [activeTab, setActiveTab] = useState("pending");
    const [approvingId, setApprovingId] = useState(null);

    // Video modal state
    const [videoModal, setVideoModal] = useState({
        isOpen: false,
        src: ''
    });

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const [challengeRes, completedRes] = await Promise.all([
                    axios.get(
                        `https://projects.funtashtechnologies.com/getfitapi/caloriesitems/getchallangesbyid.php?id=${id}`
                    ),
                    axios.get(
                        `https://projects.funtashtechnologies.com/getfitapi/getallcompletechallanges.php?challangeId=${id}`
                    )
                ]);

                if (challengeRes.data.ResponseCode === "200") {
                    setChallenge(challengeRes.data.Data);
                }

                if (completedRes.data.ResponseCode === "200") {
                    setCompletedChallenges(completedRes.data.Data || []);
                }

            } catch (error) {
                console.error(error);
                alert('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    const handleStatusUpdate = async (rowId, status) => {
        try {
            setApprovingId(rowId);

            const formData = new FormData();
            formData.append("id", rowId);
            formData.append("status", status);

            const response = await axios.post(
                "https://projects.funtashtechnologies.com/getfitapi/updatecompletechallanges.php",
                formData
            );

            if (response.data.ResponseCode === "200") {
                setCompletedChallenges((prev) =>
                    prev.map((item) =>
                        item.id === rowId
                            ? { ...item, status: status.toLowerCase() }
                            : item
                    )
                );
            } else {
                alert("Failed to update status");
            }

        } catch (error) {
            console.error(error);
            alert("Error updating status");
        } finally {
            setApprovingId(null);
        }
    };



    const openVideoModal = (src) => {
        setVideoModal({ isOpen: true, src });
    };

    const closeVideoModal = () => {
        setVideoModal({ isOpen: false, src: '' });
    };
    const filteredChallenges = completedChallenges.filter(
        (item) => item.status?.toLowerCase() == activeTab
    );


    if (loading) return <p className="p-4">Loading...</p>;
    if (!challenge) return <p className="p-4">No data found</p>;

    return (
        <div className='flex-lg-1 h-screen overflow-y-lg-auto'>
            <Topbar />
            <main className="py-6 px-3 bg-surface-secondary ml-[250px]">
                <div className="container-fluid max-w-screen-xl">
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-body p-4">


                            <div className="row">
                                <div className="col-lg-6">



                                    {challenge.videopath && (
                                        <div className="mb-4">
                                            <div
                                                className="border rounded d-flex justify-content-center align-items-center bg-dark"
                                                style={{ maxWidth: "100%", height: "350px", cursor: "pointer" }}
                                                onClick={() =>
                                                    openVideoModal(`https://projects.funtashtechnologies.com/getfitapi/uploads/${challenge.videopath}`)
                                                }
                                            >
                                                <video
                                                    src={`https://projects.funtashtechnologies.com/getfitapi/uploads/${challenge.videopath}`}
                                                    muted
                                                    autoPlay
                                                    loop
                                                    playsInline
                                                    style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="col-lg-6">
                                    <div className="row">
                                        <div className="col-md-12 my-auto d-flex flex-column justify-content-center h-100">
                                            <div className=" rounded p-3 mb-3 bg-light">
                                                <h2 className="mb-1 fw-bold">{challenge.title}</h2>

                                                <p>{challenge.description || 'N/A'}</p>
                                                <hr className="my-2" />
                                                <div className=" rounded p-3 mb-3 bg-light">
                                                    <h6 className="text-muted">Reward</h6>
                                                    <h5 className="mb-0 text-success">Rs {challenge.reward || 0}</h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">

                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <hr className="my-4" />
                    <div className="card shadow-sm border-0 mt-4">
                        <div className="card-body p-4">
                            <h4 className="mb-3 fw-bold">Completed Challenges</h4>

                            <ul className="nav nav-tabs mb-3">
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === "pending" ? "active" : ""}`}
                                        onClick={() => setActiveTab("pending")}
                                    >
                                        Pending
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === "approved" ? "active" : ""}`}
                                        onClick={() => setActiveTab("approved")}
                                    >
                                        Approved
                                    </button>
                                </li>
                            </ul>

                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>#</th>
                                            <th>Full Name</th>
                                            <th>Email</th>
                                            <th>Title</th>
                                            <th>Description</th>
                                            <th>Video</th>
                                            {activeTab === "pending" && <th>Action</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredChallenges.length > 0 ? filteredChallenges.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{index + 1}</td>
                                                <td>{item.firstname} {item.lastname}</td>
                                                <td>{item.userEmail}</td>
                                                <td>{item.title}</td>
                                                <td style={{ maxWidth: "250px" }}>
                                                    <span className="text-muted">{item.description}</span>
                                                </td>
                                                <td>
                                                    {item.video ? (
                                                        <div
                                                            className="border rounded bg-dark d-flex justify-content-center align-items-center"
                                                            style={{ width: "120px", height: "80px", cursor: "pointer" }}
                                                            onClick={() =>
                                                                openVideoModal(`https://projects.funtashtechnologies.com/getfitapi/uploads/${item.video}`)
                                                            }
                                                        >
                                                            <video
                                                                src={`https://projects.funtashtechnologies.com/getfitapi/uploads/${item.video}`}
                                                                muted
                                                                autoPlay
                                                                loop
                                                                playsInline
                                                                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted">No Video</span>
                                                    )}
                                                </td>
                                                {activeTab === "pending" && (
                                                    <td>
                                                        <div className="d-flex gap-2">
                                                            <button
                                                                className="btn btn-sm btn-success"
                                                                disabled={approvingId === item.id}
                                                                onClick={() => handleStatusUpdate(item.id, "Approved")}
                                                            >
                                                                {approvingId === item.id ? (
                                                                    <>
                                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                                        Updating...
                                                                    </>
                                                                ) : (
                                                                    "Approve"
                                                                )}
                                                            </button>

                                                            <button
                                                                className="btn btn-sm btn-danger"
                                                                disabled={approvingId === item.id}
                                                                onClick={() => handleStatusUpdate(item.id, "Rejected")}
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>

                                                    </td>
                                                )}

                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="7" className="text-center text-muted">
                                                    No  Challenges found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
            {videoModal.isOpen && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75"
                    style={{ zIndex: 1050 }}
                    onClick={closeVideoModal}
                >
                    <div
                        className="position-relative"
                        style={{ maxWidth: "90%", maxHeight: "90%" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <video
                            src={videoModal.src}
                            controls
                            autoPlay
                            style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "8px" }}
                        />
                        <button
                            className="btn btn-danger position-absolute top-2 end-2"
                            onClick={closeVideoModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Challangedetails;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Topbar from '../Layouts/Topbar';

function Challangedetails() {
    const { id } = useParams();
    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);
    const [completedChallenges, setCompletedChallenges] = useState([]);

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

    const openVideoModal = (src) => {
        setVideoModal({ isOpen: true, src });
    };

    const closeVideoModal = () => {
        setVideoModal({ isOpen: false, src: '' });
    };

    if (loading) return <p className="p-4">Loading...</p>;
    if (!challenge) return <p className="p-4">No data found</p>;

    return (
        <div className='flex-lg-1 h-screen overflow-y-lg-auto'>
            <Topbar />

            <main className="py-6 px-3 bg-surface-secondary ml-[250px]">
                <div className="container-fluid max-w-screen-xl">

                    {/* ================= MAIN CHALLENGE CARD ================= */}
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-body p-4">
                            <h2 className="mb-4 fw-bold">{challenge.title}</h2>

                            <div className="row">

                                {/* LEFT SIDE MEDIA */}
                                <div className="col-lg-6">

                                    {/* IMAGE */}
                                    {challenge.image && (
                                        <div className="mb-4">
                                            <h6 className="text-muted mb-2">Challenge Thumbnail</h6>
                                            <div className="border rounded overflow-hidden">
                                                <img
                                                    src={challenge.image}
                                                    alt="Challenge"
                                                    className="w-100"
                                                    style={{ maxHeight: "350px", objectFit: "cover", cursor: "pointer" }}
                                                    onClick={() => openVideoModal(challenge.image)}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* VIDEO */}
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

                                {/* RIGHT SIDE DETAILS */}
                                <div className="col-lg-6">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="border rounded p-3 mb-3 bg-light">
                                                <h6 className="text-muted">Description</h6>
                                                <p>{challenge.description || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="border rounded p-3 mb-3 bg-light">
                                                <h6 className="text-muted">Reward</h6>
                                                <h5 className="mb-0 text-success">Rs {challenge.reward || 0}</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <hr className="my-4" />

                    {/* ================= COMPLETED CHALLENGES TABLE ================= */}
                    <div className="card shadow-sm border-0 mt-4">
                        <div className="card-body p-4">
                            <h4 className="mb-3 fw-bold">Completed Challenges</h4>
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
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {completedChallenges.length > 0 ? completedChallenges.map((item, index) => (
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
                                                <td>{new Date(item.created_at).toLocaleString()}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="7" className="text-center text-muted">
                                                    No completed challenges found
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

            {/* ================= VIDEO MODAL ================= */}
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

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Topbar from "../Layouts/Topbar";
import axios from "axios";

function Userdetails() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [connections, setConnections] = useState({ Users: [], Trainers: [] });
    const [loading, setLoading] = useState(true);

    // Fetch user details
    useEffect(() => {
        const formData = new FormData();
        formData.append("userId", id);

        axios
            .post("https://projects.funtashtechnologies.com/getfitapi/getprofiledata.php", formData)
            .then((res) => {
                if (res.data?.Result === "true") {
                    setUser(res.data.UserData);
                } else {
                    console.error("API Error:", res.data.ResponseMsg);
                }
            })
            .catch((err) => console.error("Error fetching user:", err));
    }, [id]);

    // Fetch connections
    useEffect(() => {
        const formData = new FormData();
        formData.append("userId", id);

        axios
            .post("https://projects.funtashtechnologies.com/getfitapi/getconnections.php", formData)
            .then((res) => {
                if (res.data?.Result === "true") {
                    setConnections({
                        Users: res.data.Users || [],
                        Trainers: res.data.Trainers || [],
                    });
                } else {
                    console.error("Connections API Error:", res.data.ResponseMsg);
                }
            })
            .catch((err) => console.error("Error fetching connections:", err))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading || !user) {
        return (
            <div className="flex justify-center items-center h-screen text-xl font-semibold">
                Loading user details...
            </div>
        );
    }

    return (
        <div className="flex-lg-1 h-screen overflow-y-auto overflow-x-hidden">
            <Topbar />

            <main className="py-6 px-4 ml-[255px] bg-gray-100 min-h-screen">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        {/* User Header */}
                        <div className="flex flex-row items-start justify-between gap-6">
                            <div className="flex flex-row items-start gap-6">
                                <img
                                    src={user.profileimage ? `https://projects.funtashtechnologies.com/getfitapi/${user.profileimage}` : "https://via.placeholder.com/150"}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full border shadow"
                                />
                                <div>
                                    <h2 className="text-xl text-blue-950 font-bold">{user.firstname} {user.lastname}</h2>
                                    <p className="font-semibold text-gray-800 mt-1 text-lg">
                                        <i className="bi bi-tag"></i>{" "}
                                        <span>{user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ""}</span>
                                    </p>

                                    <div className="flex flex-row mt-2">
                                        {user.points && (
                                            <span className="badge bg-body-secondary text-success me-2 text-sm">{user.points} Points</span>
                                        )}
                                        {user.calories && (
                                            <span className="badge bg-body-secondary text-warning text-sm">{user.calories} Calories</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button className="font-normal text-white px-5 text-md py-1 rounded-md bg-green-600">
                                <i className="bi bi-arrow-clockwise me-2"></i> {user.profilevisibility || "N/A"}
                            </button>
                        </div>

                        <hr className="my-6" />

                        {/* Tabs */}
                        <div className="w-full max-w-screen-lg mx-auto mt-6">
                            <ul className="nav nav-tabs mb-4 flex flex-wrap border-b border-gray-200" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button
                                        className="nav-link active px-4 py-2"
                                        id="profile-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#profile-details"
                                        type="button"
                                        role="tab"
                                        aria-controls="profile-details"
                                        aria-selected="true"
                                    >
                                        Profile Details
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button
                                        className="nav-link px-4 py-2"
                                        id="buddies-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#buddies"
                                        type="button"
                                        role="tab"
                                        aria-controls="buddies"
                                        aria-selected="false"
                                    >
                                                  {user.role === "user" ? `Buddies (${connections.Users.length})` : "Bookings"}
                                    </button>
                                </li>
                                  {user.role === "user" && (
                                <li className="nav-item" role="presentation">
                                    <button
                                        className="nav-link px-4 py-2"
                                        id="trainers-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#trainers"
                                        type="button"
                                        role="tab"
                                        aria-controls="trainers"
                                        aria-selected="false"
                                    >
                                        Trainers ({connections.Trainers.length})
                                    </button>
                                </li>
                                  )}
                            </ul>

                            <div className="tab-content">
                                {/* Profile Details */}
                                <div className="tab-pane fade show active" id="profile-details" role="tabpanel" aria-labelledby="profile-tab">
                                    <div className="w-full max-w-screen-lg mx-auto">
                                        <div className="custom-grid grid-cols-3 gap-5">
                                            {Object.entries(user).map(([key, value]) => {
                                                const excludeFields = [
                                                    "id", "role", "firstname", "lastname", "profilevisibility",
                                                    "receiveconnectionreq", "exercises", "sendconnectionreq",
                                                    "referral", "visibility", "created_at", "testimonialimages", "profileimage"
                                                ];
                                                if (excludeFields.includes(key)) return null;
                                                return (
                                                    <div key={key} className="bg-gray-50 p-4 rounded-xl shadow-sm border break-words">
                                                        <p className="text-gray-500 text-sm capitalize">{key.replace(/_/g, " ")}</p>
                                                        <p className="text-md font-semibold mt-1">{value || "—"}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>


                                <div className="tab-pane fade" id="buddies" role="tabpanel" aria-labelledby="buddies-tab">
                                    <div className="flex flex-row flex-wrap gap-5">
                                        {connections.Users.map((u) => (
                                            <a
                                                href={`/details/${u.id}`}
                                                key={u.id}
                                                className="bg-white rounded-2xl shadow-lg border hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center p-5"
                                            >
                                                <img
                                                    src={
                                                        u.profileimage
                                                            ? `https://projects.funtashtechnologies.com/getfitapi/${u.profileimage}`
                                                            : "https://via.placeholder.com/100"
                                                    }
                                                    alt={u.firstname}
                                                    className="w-24 h-24 rounded-full mb-4 border-2 border-gray-200"
                                                />
                                                <h3 className="font-semibold text-lg text-gray-900">
                                                    {u.firstname} {u.lastname}
                                                </h3>
                                                <p className="text-purple-500 text-md fw-medium mb-4">
                                                    {u.role ? u.role.charAt(0).toUpperCase() + u.role.slice(1) : ""}
                                                </p>

                                                <div className="flex justify-center items-center gap-4 w-full border-t pt-3">
                                                    <span className="flex items-center gap-1 text-gray-600 text-md">
                                                        <i className="bi bi-people"></i>{" "}
                                                        {u.sendconnectionreq && u.sendconnectionreq !== ""
                                                            ? u.sendconnectionreq.split(",").length
                                                            : 0}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-gray-600 text-md">
                                                        <i className="bi bi-star"></i> {u.points || 0}
                                                    </span>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                  {user.role === "user" && (
                                <div className="tab-pane fade" id="trainers" role="tabpanel" aria-labelledby="trainers-tab">
                                    <div className="flex flex-row flex-wrap gap-5">
                                        {connections.Trainers.map((t) => (
                                            <a
                                                href={`/details/${t.id}`}
                                                key={t.id}
                                                className="bg-white rounded-2xl shadow-lg border hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center p-5"
                                            >
                                                <img
                                                    src={
                                                        t.profileimage
                                                            ? `https://projects.funtashtechnologies.com/getfitapi/${t.profileimage}`
                                                            : "https://via.placeholder.com/100"
                                                    }
                                                    alt={t.firstname}
                                                    className="w-24 h-24 rounded-full mb-4 border-2 border-gray-200"
                                                />
                                                <h3 className="font-semibold text-lg text-gray-900">
                                                    {t.firstname} {t.lastname}
                                                </h3>
                                                <p className="text-purple-500 text-md font-medium mb-4">
                                                    {t.role ? t.role.charAt(0).toUpperCase() + t.role.slice(1) : ""}
                                                </p>

                                                <div className="flex justify-center items-center gap-4 w-full border-t pt-3">
                                                    <span className="flex items-center gap-1 text-gray-600 text-md">
                                                        <i className="bi bi-people"></i>{" "}
                                                        {t.sendconnectionreq && t.sendconnectionreq !== ""
                                                            ? t.sendconnectionreq.split(",").length
                                                            : 0}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-gray-600 text-md">
                                                        <i className="bi bi-star"></i> {t.points || 0}
                                                    </span>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                                 )}
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}

export default Userdetails;

import React, { useState, useEffect, useRef } from 'react';
import Topbar from '../Layouts/Topbar';
import axios from "axios";

function Addexercises() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [benefitInput, setBenefitInput] = useState('');
  const [benefitsList, setBenefitsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    categoryid: '',
    categoryname: '',
    description: '',
    day: '1',
    type: ''
  });

  const thumbnailRef = useRef(null);
  const videoRef = useRef(null);

  // For showing existing image/video preview when viewing an exercise
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  const handleAddBenefit = () => {
    if (benefitInput.trim() !== '') {
      const updatedList = [...benefitsList, benefitInput.trim()];
      setBenefitsList(updatedList);
      setBenefitInput('');
    }
  };

  useEffect(() => {
    axios
      .get("https://projects.funtashtechnologies.com/getfitapi/caloriesitems/getexercises.php")
      .then((res) => {
        if (res.data.Result === "true") {
          setExercises(res.data.Data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch exercises:", err);
      });
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this exercise?")) return;

    axios.post("https://projects.funtashtechnologies.com/getfitapi/caloriesitems/deleteexercises.php", {
      id: id
    })
      .then((res) => {
        if (res.data.Result === "true") {
          alert("Exercise deleted successfully.");
          setExercises((prev) => prev.filter((item) => item.id !== id));
        } else {
          alert(res.data.ResponseMsg);
        }
      })
      .catch((err) => {
        console.error("Error deleting exercise", err);
      });
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('https://projects.funtashtechnologies.com/getfitapi/getallcategories.php');
        const data = await res.json();
        if (data.ResponseCode === '200' && data.Result === 'true') {
          setCategories(data.Data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategories();
  }, []);

  const handleCategorySelect = (e) => {
    const selectedId = e.target.value;
    const selectedCategory = categories.find(cat => cat.id.toString() === selectedId);
    setFormData(prev => ({
      ...prev,
      categoryid: selectedId,
      categoryname: selectedCategory ? selectedCategory.categoryname : '',
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true); // Start loading

    const form = new FormData();
    form.append('title', formData.title);
    form.append('categoryid', formData.categoryid);
    form.append('category', formData.categoryname);
    form.append('description', formData.description);
    form.append('day', formData.day);
    form.append('benefits', benefitsList.join(','));
    form.append('type', formData.type);

    if (
      !formData.title ||
      !formData.categoryid ||
      !formData.categoryname ||
      !formData.description ||
      !formData.type ||
      !formData.day ||
      benefitsList.length === 0 ||
      (!thumbnailRef.current?.files[0] && !formData.id) ||  // only require files if creating new
      (!videoRef.current?.files[0] && !formData.id)
    ) {
      alert('Please fill out all required fields and upload files.');
      setLoading(false); // Stop loading on validation failure
      return;
    }

    if (thumbnailRef.current?.files[0]) {
      form.append('image', thumbnailRef.current.files[0]);
    }
    if (videoRef.current?.files[0]) {
      form.append('video', videoRef.current.files[0]);
    }

    if (formData.id) {
      form.append('id', formData.id); // pass id if editing (assuming your API handles editing)
    }

    try {
      const res = await fetch('https://projects.funtashtechnologies.com/getfitapi/exercises.php', {
        method: 'POST',
        body: form,
      });

      const result = await res.json();
      console.log(result);
      alert(result);

      if (result.success) {
        alert('Exercise added successfully!');
        // Reset form if needed
      }
    } catch (error) {
      console.error('Error uploading exercise:', error);
    } finally {
      setLoading(false); // Stop loading after everything
    }
  };

  const handleView = async (id) => {
    try {
      const res = await axios.get(`https://projects.funtashtechnologies.com/getfitapi/caloriesitems/getexercisebyid.php?id=${id}`);
      if (res.data.Result === "true" && res.data.Data) {
        const exercise = res.data.Data;

        setFormData({
          id: exercise.id,
          title: exercise.title || '',
          categoryid: exercise.categoryid || '',
          categoryname: exercise.category || '',
          description: exercise.description || '',
          type: exercise.type || '',
          day: exercise.day || '1',
        });

        // Set benefits list by splitting comma separated benefits string
        setBenefitsList(exercise.benefits ? exercise.benefits.split(',') : []);

        // Set image and video previews
        setImagePreview(exercise.image ? exercise.image : null);  // assuming the API returns full URL or relative path
        setVideoPreview(exercise.video ? exercise.video : null);

        // Clear file inputs since we are viewing existing files
        if (thumbnailRef.current) thumbnailRef.current.value = null;
        if (videoRef.current) videoRef.current.value = null;

        // Open modal programmatically (Bootstrap 5)
        const modalElement = document.getElementById('exampleModal');
        const modal = window.bootstrap.Modal.getOrCreateInstance(modalElement);
        modal.show();
      } else {
        alert("Exercise data not found.");
      }
    } catch (error) {
      console.error("Error fetching exercise by ID:", error);
      alert("Failed to fetch exercise details.");
    }
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentExercises = exercises.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(exercises.length / itemsPerPage);

  return (
    <div className='flex-lg-1 h-screen overflow-y-lg-auto'>
      <Topbar />
      <main className="py-6 px-3 bg-surface-secondary ml-[250px]">
        <div className="container-fluid max-w-screen-lg vstack gap-5">
          <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5">Add Exercises</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Title</label>
                      <input className="form-control" placeholder="Add Title" type="text" name="title" value={formData.title} onChange={handleChange} />
                    </div>
                      <div className="col-md-4 mb-3">
                      <label className="form-label">Workout Type</label>
                      <select
                        name="type"
                        className="form-select"
                        value={formData.type}
                        onChange={handleChange}
                      >
                        <option value="">Select Type</option>
                        <option value="Home Workout">Home Workout</option>
                        <option value="Yoga Workout">Yoga Workout</option>
                        <option value="Intense Workout">Intense Workout</option>
                           <option value="Gym Workout">Gym Workout</option>
                      </select>
                    </div>
                   <div className="col-md-4 mb-3">
  <label className="form-label">Select Category</label>
  <select
    className="form-select"
    onChange={handleCategorySelect}
    value={formData.categoryid}
    required
    disabled={!formData.type}   // disable until the user selects workout type
  >
    <option value="">
      {formData.type ? "Select Category" : "Select Workout Type First"}
    </option>

    {categories
      .filter(cat => cat.categorytype === formData.type)   // 🔥 FILTERING HERE
      .map(cat => (
        <option key={cat.id} value={cat.id}>
          {cat.categoryname}
        </option>
      ))}
  </select>
</div>

                  
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Exercise Day</label>
                      <select name="day" className="form-select" value={formData.day} onChange={handleChange}>
                        {[...Array(7).keys()].map(i => (
                          <option key={i + 1} value={i + 1}>Day {i + 1}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-12 mb-3">
                      <label className="form-label">Add Description</label>
                      <textarea name="description" rows={4} placeholder="Type here..." className="form-control" value={formData.description} onChange={handleChange}></textarea>
                    </div>

                    {/* Show image preview if exists */}
                    {imagePreview && (
                      <div className="col-md-12 mb-3">
                        <label className="form-label">Current Exercise Thumbnail</label>
                        <br />
                        <img src={`https://projects.funtashtechnologies.com/getfitapi/uploads/${imagePreview}`} alt="Exercise Thumbnail" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: 8 }} />
                      </div>
                    )}

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Exercise Thumbnail</label>
                      <input className="form-control" type="file" ref={thumbnailRef} />
                    </div>

                    {/* Show video preview if exists
                    {videoPreview && (
                      <div className="col-md-12 mb-3">
                        <label className="form-label">Current Exercise Video</label>
                        <video
                          src={videoPreview}
                          controls
                          style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: 8 }}
                        />
                      </div>
                    )} */}

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Exercise Video</label>
                      <input className="form-control" type="file" ref={videoRef} />
                    </div>

                    <div className="col-md-12 mb-3">
                      <label className="form-label">Benefits</label>
                      <div className="row">
                        <div className="col-12 col-md-10">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Add Benefit"
                            value={benefitInput}
                            onChange={(e) => setBenefitInput(e.target.value)}
                          />

                        </div>
                        <div className="col-12 col-md-2">
                          <button className="btn btn-success" onClick={handleAddBenefit}>Add </button>
                        </div>
                      </div>

                      <ul>
                        {benefitsList.map((benefit, index) => (
                          <li className='bg-primary bg-opacity-20 bg-opacity-100-hover text-primary text-white-hover w-max p-2 rounded-2 m-2' key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="col-md-12 text-end">
                      <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Loading...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="modal-footer"></div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <h1 className="h3 ls-tight mb-0">Add Exercises</h1>
            </div>
            <div className="col ms-auto d-flex justify-content-md-end">
              <button className="btn btn-primary w-max btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModal">+ Add</button>
            </div>
          </div>
          <div className="container py-4">

            <div className="card">
              <div className="card-body">
                <table className="table table-hover table-nowrap">
                  <thead className='table-light'>
                    <tr>
                      <th>Sr No.</th>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Category</th>
                      <th>Exercise Day</th>

                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentExercises.length === 0 ? (
                      <tr><td colSpan="6" className="text-center">No exercises found.</td></tr>
                    ) : (
                      currentExercises.map((exercise, index) => (
                        <tr key={exercise.id}>
                          <td>{indexOfFirstItem + index + 1}</td> {/* Adjust Sr No. */}
                          <td>{exercise.title}</td>
                          <td>{exercise.type}</td>
                          <td>{exercise.category}</td>
                          <td>{exercise.day}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-neutral me-1"
                              onClick={() => handleView(exercise.id)}
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal"
                            >
                              View
                            </button>
                            <button
                              className="btn btn-sm btn-square btn-neutral text-danger-hover"
                              onClick={() => handleDelete(exercise.id)}
                            >
                              <i className="bi bi-trash3-fill"></i>
                            </button>
                          </td>
                        </tr>
                      ))
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

        </div>
      </main>
    </div>
  );
}

export default Addexercises;

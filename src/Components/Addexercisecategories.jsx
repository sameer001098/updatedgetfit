import React, { useState, useEffect } from 'react';
import Topbar from '../Layouts/Topbar';
import { Link } from 'react-router-dom';

function Addexercisecategories() {
    const [categoryName, setCategoryName] = useState('');
    const [categoryImage, setCategoryImage] = useState(null);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
       const [categories, setCategories] = useState([]);

    const handleSubmit = async () => {
        setIsSubmitting(true); // 👈 Start loading
        setMessage(''); // Optional: Clear previous messages

        const formData = new FormData();
        formData.append('categoryname', categoryName);
        formData.append('categorytype', 'workout');
        if (categoryImage) {
            formData.append('categoryimage', categoryImage);
        }

        try {
            const response = await fetch('https://projects.funtashtechnologies.com/getfitapi/caloriesitems/addcategories.php', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.ResponseCode === '200') {
                setMessage('Category added successfully!');
                setCategoryName('');
                setCategoryImage(null);
            } else {
                setMessage(result.ResponseMsg || 'Something went wrong');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Failed to submit the form.');
        } finally {
            setIsSubmitting(false); // 👈 End loading
        }
    };

     const fetchCategories = async () => {
        try {
            const res = await fetch('https://projects.funtashtechnologies.com/getfitapi/getcategories.php');
            const data = await res.json();

            if (data.ResponseCode === '200' && data.Result === 'true') {
                setCategories(data.Data);
            } else {
                setMessage('Failed to load categories.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Failed to fetch categories.');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className='flex-lg-1 h-screen overflow-y-lg-auto'>
            <Topbar />
            <main className="py-6 px-3 bg-surface-secondary">
                <div className="container-fluid max-w-screen-md vstack gap-5">
                    <h1 className="h3 ls-tight mb-3">Add Categories</h1>

                    {message && (
                        <div className="alert alert-primary">
                            {message}
                        </div>
                    )}

                    <div>
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Category name"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="form-label">Category Image</label>
                        <input
                            type="file"
                            className="form-control"
                            onChange={(e) => setCategoryImage(e.target.files[0])}
                        />
                    </div>

                    <div className='d-flex justify-content-end'>
                        <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={handleSubmit}
                            disabled={isSubmitting} // 👈 Disable button while submitting
                        >
                            <span>{isSubmitting ? 'Saving...' : 'Save'}</span>
                        </button>
                    </div>


                    <hr className="my-3" />

                      <h1 className="h3 ls-tight mb-3"> Categories</h1>

                    <div className="row g-6 mt-1">
                        {categories.map((cat) => (
                            <div className="col-xl-3 col-sm-6 mt-0" key={cat.id}>
                                <div className="card">
                                    <div className="card-body text-center">
                                        <img
                                            src={`${cat.categoryimage}` || 'https://via.placeholder.com/100x100?text=No+Image'}
                                            alt={cat.categoryname}
                                            className="mx-auto mb-3"
                                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                        />
                                        <Link className='h5 d-block my-6' to="#">
                                            {cat.categoryname}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Addexercisecategories;

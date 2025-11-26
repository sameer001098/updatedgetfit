import React, { useEffect, useState } from 'react';
import Topbar from '../Layouts/Topbar';

function Additems() {
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({
        itemname: '',
        categoryid: '',
        categoryname: '',
        itemcalories: '',
    });
    const [itemimage, setItemImage] = useState(null);
    const [message, setMessage] = useState('');
    useEffect(() => {
        async function fetchItems() {
            try {
                const res = await fetch('https://projects.funtashtechnologies.com/getfitapi/caloriesitems/getallitems.php');
                const data = await res.json();
                if (data.ResponseCode === '200' && data.Result === 'true') {
                    setItems(data.Data);
                }
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        }
        fetchItems();
    }, []);
    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await fetch('https://projects.funtashtechnologies.com/getfitapi/caloriesitems/getcategories.php');
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCategorySelect = (e) => {
        const selectedId = e.target.value;
        const selectedCategory = categories.find(cat => cat.id === selectedId);
        setFormData(prev => ({
            ...prev,
            categoryid: selectedId,
            categoryname: selectedCategory ? selectedCategory.categoryname : '',
        }));
    };

    const handleFileChange = (e) => {
        setItemImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);


        const postData = new FormData();
        postData.append('itemname', formData.itemname);
        postData.append('categoryid', formData.categoryid);
        postData.append('categoryname', formData.categoryname);
        postData.append('itemcalories', formData.itemcalories);
        if (itemimage) {
            postData.append('itemimage', itemimage);
        }

        try {
            const res = await fetch('https://projects.funtashtechnologies.com/getfitapi/caloriesitems/additems.php', {
                method: 'POST',
                body: postData,
            });
            const result = await res.json();

            setMessage(result.ResponseMsg);
            if (result.ResponseCode === '200' && result.Result === 'true' && result.Data) {
                setItems(prevItems => [result.Data, ...prevItems]);
            }

            console.log(result);
        } catch (error) {
            console.error('Error submitting item:', error);
            setMessage('Failed to submit.');
        } finally {
            setIsSubmitting(false);
            // setFormData({
            //     itemname: '',
            //     categoryid: '',
            //     categoryname: '',
            //     itemcalories: '',
            // });
            // setItemImage(null);
        }
    };
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = items.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(items.length / itemsPerPage);
    return (
        <div className='flex-lg-1 h-screen overflow-y-lg-auto'>
            <Topbar />

            <main className="py-6 px-3 bg-surface-secondary ml-[250px]">
                <div className="container-fluid max-w-screen-lg vstack gap-5">
                    <h1 className="h3 ls-tight mb-0">Add Categories</h1>

                    {message && (
                        <div className="col-12 mt-2">
                            <div className="alert alert-primary">{message}</div>
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <label className="form-label">Item Name</label>
                                <input
                                    type="text"
                                    name="itemname"
                                    className="form-control"
                                    value={formData.itemname}
                                    onChange={handleChange}
                                    placeholder='Item name'
                                    required
                                />
                            </div>

                            <div className="col-12 col-md-6">
                                <label className="form-label">Item Category</label>
                                <select
                                    className="form-select"
                                    onChange={handleCategorySelect}
                                    required
                                    value={formData.categoryid}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.categoryname}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-12 col-md-6 mt-3">
                                <label className="form-label">Calories</label>
                                <input
                                    type="number"
                                    name="itemcalories"
                                    className="form-control"
                                    value={formData.itemcalories}
                                    onChange={handleChange}
                                    placeholder='calories in number'
                                    required
                                />
                            </div>

                            <div className="col-12 col-md-6 mt-3">
                                <label className="form-label">Item Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="form-control"
                                    onChange={handleFileChange}
                                />
                            </div>

                            <div className="col-12 mt-4">
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save'}
                                </button>
                            </div>


                        </div>
                    </form>

                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">Categories</h5>

                        </div>
                        <div className="card-body">
                            <table className="table table-hover table-nowrap">
                                <thead className='table-light'>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Item</th>
                                        <th scope="col">Category</th>
                                        <th scope="col">Item image</th>
                                        <th scope="col">Calories</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => {
                                        if (!item) return null;
                                        return (
                                            <tr key={item.id || index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{item.itemname}</td>
                                                <td>{item.categoryname}</td>
                                                <td>
                                                    <img src={item.itemimage} className='rounded-pill' alt={item.itemname} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                                </td>
                                                <td>{item.itemcalories}</td>
                                                <td>
                                                    <button className='btn btn-sm btn-neutral me-1'>View</button>
                                                    <button className='btn btn-sm btn-square btn-neutral text-danger-hover'><i className="bi bi-trash3-fill"></i></button>
                                                </td>
                                            </tr>
                                        );
                                    })}
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
    )
}

export default Additems

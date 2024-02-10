import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import LoadingSpinner from './LoadingSpinner';
import useAuth from '../hooks/useAuth';
import SideNav from './SideNav';

const AddMeal = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('starters');

  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState('');

  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [errMsg, setErrMsg] = useState('');
  const { setNotification, menuIsOpen, setMenuIsOpen } = useAuth();

  const nameRef = useRef();
  const errRef = useRef();

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const showNotification = (message, type) => {
    setNotification({ message, type });

    // Auto-hide the notification after a few seconds (e.g., 10 seconds)
    setTimeout(() => {
      setNotification(null);
    }, 10000);
  };

  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call or data loading delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Set loading to false once data is loaded
      setLoading(false);
    };

    fetchData();
  }, []);

  const UploadWidget = () => {
    const cloudinaryRef = useRef();
    const widgetRef = useRef();

    useEffect(() => {
      cloudinaryRef.current = window.cloudinary;
      widgetRef.current = cloudinaryRef.current.createUploadWidget({
        cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
        uploadPreset: 'dev_setups',
      }, (error, result) => {
        if (!error && result && result.event === "success") {
          console.log('Done! Here is the image info: ', result.info);

          setImageUrl(result.info.secure_url);
        }

      });
    }, []);

    return (
      <button
        type="button"
        onClick={() => widgetRef.current.open()}
        className="custom-button">
        Upload
      </button>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { name, price, category, description, imageUrl }

    console.log(payload)
    try {
      const response = await axiosPrivate.post('/meals',
        JSON.stringify(payload), {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        withCredentials: true
      }
      );
      console.log(JSON.stringify(response?.data));
      showNotification('Meal created successfully', 'success');

      setImageUrl("");
      navigate("/meals");

    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response!');
      } else if (err.response?.status === 409) {
        setErrMsg('Meal already exist!');
      } else if (err.response?.status === 400) {
        setErrMsg('Oops! Bad request. Check the fields and try again.');
      } else if (err.response?.status === 403) {
        setErrMsg('Oops! You are not authorized to consume this resource.')
      } else {
        setErrMsg('Failed!')
      }
      errRef.current.focus();
    }
  }

  return (
    <div>
      {
        loading ?
          <LoadingSpinner loading={loading} />
          :
          <div className="page-wrapper">
            <div className="sidenav">
              <SideNav currentTab="meals" />
            </div>
            <div className="container">
              <div className='row'>
                <div className="card-header">
                  <button onClick={() => setMenuIsOpen(!menuIsOpen)} type="button" className="title-bar">
                    <div className="menu-icon dark" type="button" data-toggle="main-nav"></div>
                  </button>
                  <div className="header-content">
                    <h6 className="mb-0 text-sm">Create Meal Record</h6>
                  </div>
                </div>
                <ol className="breadcrumb">
                  <li><Link to={"/meals"}>Meals</Link></li>
                  <li>Add Meal</li>
                </ol>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <div className="form-data">
                  {imageUrl &&
                    <div className="img">
                      <img src={imageUrl} alt="" />
                    </div>}
                  <div className="form-center bdr-lft pt-pr">
                    <div className="fm">
                      <form onSubmit={handleSubmit}>
                        <button className="btn" type='submit'>Add Meal</button>
                        <label>Name:
                          <input
                            type="text"
                            name="name"
                            ref={nameRef}
                            required="required"
                            placeholder="Enter a meal..."
                            onChange={e => setName(e.target.value)} />
                        </label>

                        <label>Category:
                          <select id="category" name='Select an option' onChange={e => setCategory(e.target.value)}>
                            <option value="starters">Starters</option>
                            <option value="desserts">Desserts</option>
                            <option value="main dishes">Main Dishes</option>
                            <option value="specials">Specials</option>
                            <option value="swallows">Swallows</option>
                            <option value="drinks">Drinks</option>
                          </select>
                        </label>

                        <label>Price:
                          <input
                            type="text"
                            name="price"
                            required="required"
                            placeholder="Enter a price..."
                            onChange={e => setPrice(e.target.value)} />
                        </label>

                        <label>Description:
                          <input
                            type="text"
                            name="description"
                            required="required"
                            placeholder="Enter the description..."
                            onChange={e => setDescription(e.target.value)} />
                        </label>

                        <label>Image:
                          <UploadWidget />
                        </label>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      }
    </div>
  )
}

export default AddMeal

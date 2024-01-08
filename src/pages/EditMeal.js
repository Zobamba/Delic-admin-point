import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import LoadingSpinner from './LoadingSpinner';
import useAuth from '../hooks/useAuth';
import SideNav from './SideNav';

const EditMeal = () => {
  const [name, setName] = useState('');
  const [mealId, setMealId] = useState('');
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');

  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [errMsg, setErrMsg] = useState('');
  const [imageVisible, setImageVisible] = useState(false);

  const nameRef = useRef();
  const errRef = useRef();

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const { setNotification } = useAuth();

  const showNotification = (message, type) => {
    setNotification({ message, type });

    // Auto-hide the notification after a few seconds (e.g., 10 seconds)
    setTimeout(() => {
      setNotification(null);
    }, 10000);
  };

  useEffect(() => {
    const getMeal = async () => {
      const id = window.location.href.split("/")[4];

      try {
        const response = await axiosPrivate.get(`/meals/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          withCredentials: true
        });

        setName(response.data.name);
        setMealId(response.data.id);

        setCategory(response.data.category);
        setPrice(response.data.price);

        setDescription(response.data.description);
        setImageUrl(response.data.imageUrl);

      } catch (err) {
        console.error(err);
        navigate('/sign-in');
      }
    }

    getMeal();
    setImageVisible(true);
  }, [axiosPrivate, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call or data loading delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

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
        uploadPreset: 'dev_setups'
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

    const id = window.location.href.split("/")[4];
    const payload = { name, price, category, description, imageUrl };

    try {
      await axiosPrivate.put(`/meals/${id}`,
        JSON.stringify(payload),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          withCredentials: true
        }
      );

      showNotification('Save was successful', 'success');
      navigate(`/meals/${id}`);

    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response!');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized!');
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
                  <div className="header-content">
                    <h6 className="mb-0 text-sm">Edit Meal</h6>
                  </div>
                </div>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <ol className="breadcrumb">
                  <li><Link to={"/meals"}>Meals</Link></li>
                  <li><Link to={`/meals/${mealId}`}>{name}</Link></li>
                  <li>Edit Meal</li>
                </ol>
                <div className="form-data">
                  <div className={`img ${imageVisible ? 'act' : ''}`}>
                    <img src={imageUrl} alt="" />
                  </div>
                  <div className="frm pt-pr">
                    <div className="fm">
                      <form onSubmit={handleSubmit}>
                        <button className="btn" type='submit'>Save</button>
                        <label htmlFor="name">Name:
                          <input
                            type="text"
                            name="name"
                            ref={nameRef}
                            value={name}
                            required="required"
                            placeholder="Enter a meal..."
                            onChange={e => setName(e.target.value)}
                          />
                        </label>

                        <label htmlFor="category">Category:
                          <select id="category" value={category} onChange={e => setCategory(e.target.value)}>
                            <option value="starters">Starters</option>
                            <option value="main dishes">Main Dishes</option>
                            <option value="desserts">Desserts</option>
                            <option value="specials">Specials</option>
                            <option value="swallows">Swallows</option>
                            <option value="drinks">Drinks</option>
                          </select>
                        </label>

                        <label htmlFor="price">Price:
                          <input
                            type="text"
                            name="price"
                            value={price}
                            required="required"
                            placeholder="Enter a price..."
                            onChange={e => setPrice(e.target.value)}
                          />
                        </label>

                        <label htmlFor="price">Description:
                          <input
                            type="text"
                            name="description"
                            value={description}
                            required="required"
                            placeholder="Enter the description..."
                            onChange={e => setDescription(e.target.value)}
                          />
                        </label>

                        <label htmlFor="imageUrl">Image: <UploadWidget />
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

export default EditMeal

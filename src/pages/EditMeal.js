import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import SideNav from './SideNav';

const EditMeal = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const nameRef = useRef();
  const errRef = useRef();

  const [errMsg, setErrMsg] = useState('');

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    nameRef.current.focus();

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
        setCategory(response.data.category);
        setPrice(response.data.price);
        setDescription(response.data.description);
        setImageUrl(response.data.imageUrl);

      } catch (err) {
        console.error(err);
        navigate('/sign-in', { state: { from: location }, replace: true });
      }
    }

    getMeal();
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
      <button type="button" onClick={() => widgetRef.current.open()}>
        Upload
      </button>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const id = window.location.href.split("/")[4];
    const payload = { name, price, category, description, imageUrl };
    console.log(payload);

    try {
      const response = await axiosPrivate.put(`/meals/${id}`,
        JSON.stringify(payload),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          withCredentials: true
        }
      );

      console.log(JSON.stringify(response?.data));
      navigate("/meals")

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
    <div className="page-wrapper">
      <SideNav currentTab="meals" />
      <div className="container">
        <div className='row'>
          <div className="card-header">
            <h6 className="mb-0 text-sm">  <span><FontAwesomeIcon className="icon-back" icon={faArrowLeft} onClick={() => navigate(-1)} />
            </span> Edit Meal</h6>
          </div>
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

          <form onSubmit={handleSubmit}>
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

            <label htmlFor="imagePreview">ImagePreview:
              <div className="img">
                <img src={imageUrl} alt="" />
              </div>
            </label>

            <label htmlFor="imageUrl">ImageUrl: <UploadWidget />
            </label>

            <button
              className="button"
              type='submit'>Save</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditMeal

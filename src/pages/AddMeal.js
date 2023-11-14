import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import SideNav from './SideNav';

const AddMeal = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('starters');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const nameRef = useRef();
  const errRef = useRef();

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  useEffect(() => {
    nameRef.current.focus();
  }, [])

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

      setImageUrl("");
      navigate("/meals");

    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response!');
      } else if (err.response?.status === 409) {
        setErrMsg('Meal already exist!');
      } else if (err.response?.status === 404) {
        setErrMsg('Bad request!');
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
            <h6 className="mb-0 text-sm">  <span><FontAwesomeIcon title="Back" className="icon-back" icon={faArrowLeft} onClick={() => navigate(-1)} />
            </span> Create Meal Record</h6>
          </div>
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
          <div className="form-data">
            {imageUrl &&
              <div className="img">
                <img src={imageUrl} alt="" />
              </div>}
            <div className="frm bdr-lft pt-pr">
              <div className="fm">
                <form onSubmit={handleSubmit}>
                  <button className="btn" type='submit'>Add Meal</button>
                  <label>Name
                    <input
                      type="text"
                      name="name"
                      ref={nameRef}
                      required="required"
                      placeholder="Enter a meal..."
                      onChange={e => setName(e.target.value)} />
                  </label>

                  <label>Category
                    <select id="category" name='Select an option' onChange={e => setCategory(e.target.value)}>
                      <option value="starters">Starters</option>
                      <option value="desserts">Desserts</option>
                      <option value="specials">Specials</option>
                      <option value="swallows">Swallows</option>
                      <option value="drinks">Drinks</option>
                    </select>
                  </label>

                  <label>Price
                    <input
                      type="text"
                      name="price"
                      required="required"
                      placeholder="Enter a price..."
                      onChange={e => setPrice(e.target.value)} />
                  </label>

                  <label>Description
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
  )
}

export default AddMeal

import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import SideNav from './SideNav';

const Menus = () => {

  const [menus, setMenus] = useState();
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getMenus = async () => {
      try {
        const response = await axiosPrivate.get('/menus', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          withCredentials: true
        });

        console.log(response.data);
        setMenus(response.data.menus);

      } catch (err) {
        console.error(err);
        navigate('/sign-in', { state: { from: location }, replace: true });
      }
    }

    getMenus();

  }, []);

  return (
    <div className="page-wrapper">
      <SideNav currentTab="menus" />
      <div className="container">
        <div className="row">
          <div className="card-header">
            <h6 className="mb-0 text-sm"><span><FontAwesomeIcon title="Back" className="icon-back" icon={faArrowLeft} onClick={() => navigate(-1)} />
            </span> Menus</h6>

            <Link to="/addMenu">
              <span>Add Menu</span>
            </Link>
            <br />
          </div>
          <div className="p-reset">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th className="text-center text-secondary ">Menu Id</th>
                    <th className="text-center text-secondary ">Created</th>
                    <th className="text-center text-secondary ">Updated</th>
                    <th className="text-center text-secondary ">Expiry Date</th>
                    <th className="text-center text-secondary">Meals Count</th>
                    <th className="text-center text-secondary">See More</th>
                  </tr>
                </thead>
                {menus &&
                  <tbody>
                    {menus.map((menu, i) => {

                      return (
                        <tr key={i}>
                          <td className="align-middle">
                            <p>{menu.id}</p>
                          </td>
                          <td className="align-middle">
                            <span className="font-weight-bold">{new Date(menu.createdAt).toDateString()}</span>
                          </td>
                          <td className="align-middle">
                            <span className="font-weight-bold">{new Date(menu.updatedAt).toDateString()}</span>
                          </td>
                          <td className="align-middle">
                            <span className="font-weight-bold">{menu.expiredAt === null ? "" : new Date(menu.expiredAt).toDateString()}</span>
                          </td>
                          <td className="align-middle">
                            <span className="font-weight-bold">{menu.meals.length}</span>
                          </td>
                          <td className="align-middle">
                            <Link
                              to={`/menus/${menu.id}`}
                              className="view">
                              <span>View</span>
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                }
              </table>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

export default Menus

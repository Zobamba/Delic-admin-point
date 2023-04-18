import React from 'react'
import SideNav from './SideNav';
import './Table.scss';

const Table = () => {
    return (
        <div className="page-wrapper">
            <SideNav currentTab="table" />
            <div className="container">
                <div className="row">
                    <div className="card-header">
                        <h6 className="mb-0 text-sm">Authors table</h6>
                    </div>

                    <div className="table-responsive">
                        <table className="table">
                            <tr>
                                <th className="text-secondary">Author</th>
                                <th className="text-secondary ps-2">Function</th>
                                <th className="text-center text-secondary ">Status</th>
                                <th className="text-center text-secondary ">Employed</th>
                                <th className="text-secondary"></th>
                            </tr>
                            <tr>
                                <td>
                                    <h6 className="mb-0 text-sm">John Michael</h6>
                                    <p className="text-xs mb-0">john@creative-tim.com</p>
                                </td>
                                <td>
                                    <p className="text-xs font-weight-bold mb-0">Manager</p>
                                    <p className="text-xs mb-0">Organization</p>
                                </td>
                                <td className="align-middle">
                                    <span className="badge">Online</span>
                                </td>
                                <td className="align-middle">
                                    <span className="font-weight-bold">23/04/18</span>
                                </td>
                                <td className="align-middle">
                                    <a href="" className="font-weight-bold" data-toggle="tooltip" data-original-title="Edit user">
                                        Edit
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h6 className="mb-0 text-sm">Alexa Liras</h6>
                                    <p className="text-xs mb-0">alexa@creative-tim.com</p>
                                </td>
                                <td>
                                    <p className="text-xs font-weight-bold mb-0">Programator</p>
                                    <p className="text-xs mb-0">Developer</p>
                                </td>
                                <td className="align-middle">
                                    <span className="badge">Offline</span>
                                </td>
                                <td className="align-middle">
                                    <span className="font-weight-bold">11/01/19</span>
                                </td>
                                <td className="align-middle">
                                    <a href="" className="font-weight-bold" data-toggle="tooltip" data-original-title="Edit user">
                                        Edit
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h6 className="mb-0 text-sm">Laurent Perrier</h6>
                                    <p className="text-xs mb-0">laurent@creative-tim.com</p>
                                </td>
                                <td>
                                    <p className="text-xs font-weight-bold mb-0">Executive</p>
                                    <p className="text-xs mb-0">Projects</p>
                                </td>
                                <td className="align-middle">
                                    <span className="badge">Online</span>
                                </td>
                                <td className="align-middle">
                                    <span className="font-weight-bold">19/09/17</span>
                                </td>
                                <td className="align-middle">
                                    <a href="" className="font-weight-bold" data-toggle="tooltip" data-original-title="Edit user">
                                        Edit
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h6 className="mb-0 text-sm">Michael Levi</h6>
                                    <p className="text-xs mb-0">michael@creative-tim.com</p>
                                </td>
                                <td>
                                    <p className="text-xs font-weight-bold mb-0">Programator</p>
                                    <p className="text-xs mb-0">Developer</p>
                                </td>
                                <td className="align-middle">
                                    <span className="badge">Online</span>
                                </td>
                                <td className="align-middle">
                                    <span className="font-weight-bold">24/12/08</span>
                                </td>
                                <td className="align-middle">
                                    <a href="" className="font-weight-bold" data-toggle="tooltip" data-original-title="Edit user">
                                        Edit
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td>

                                    <h6 className="mb-0 text-sm">Richard Gran</h6>
                                    <p className="text-xs mb-0">richard@creative-tim.com</p>
                                </td>
                                <td>
                                    <p className="text-xs font-weight-bold mb-0">Manager</p>
                                    <p className="text-xs mb-0">Executive</p>
                                </td>
                                <td className="align-middle">
                                    <span className="badge">Offline</span>
                                </td>
                                <td className="align-middle">
                                    <span className="font-weight-bold">04/10/21</span>
                                </td>
                                <td className="align-middle">
                                    <a href="" className="font-weight-bold" data-toggle="tooltip" data-original-title="Edit user">
                                        Edit
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td>

                                    <h6 className="mb-0 text-sm">Miriam Eric</h6>
                                    <p className="text-xs mb-0">miriam@creative-tim.com</p>

                                </td>
                                <td>
                                    <p className="text-xs font-weight-bold mb-0">Programator</p>
                                    <p className="text-xs mb-0">Developer</p>
                                </td>
                                <td className="align-middle">
                                    <span className="badge">Offline</span>
                                </td>
                                <td className="align-middle">
                                    <span className="font-weight-bold">14/09/20</span>
                                </td>
                                <td className="align-middle">
                                    <a href="" className="font-weight-bold" data-toggle="tooltip" data-original-title="Edit user">
                                        Edit
                                    </a>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Table

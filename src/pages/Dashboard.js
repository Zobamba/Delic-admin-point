/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import SideNav from './SideNav';
import './Dashboard.scss';

const Dashboard = () => {
  return (
    <section>
      <SideNav currentTab="dashboard" />
      <div className="py-4">
        <div className="row">
          <div className="col-xl-3">
            <div className="card">
              <div className="card-body p-3">
                <div className="row">
                  <p className="text-sm">Today's Money</p>
                  <h5 className="font-weight-bolder">
                    $53,000
                  </h5>
                  <p className="mb-0">
                    <span className="text-success">+55%</span>
                    since yesterday
                  </p>
                  <div className="col-4">
                    <div className="icon icon-shape">
                      <i className="ni ni-money-coins text-lg opacity-10" aria-hidden="true"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3">
            <div className="card">
              <div className="card-body p-3">
                <div className="row">
                  <p className="text-sm">Today's Users</p>
                  <h5 className="font-weight-bolder">
                    2,300
                  </h5>
                  <p className="mb-0">
                    <span className="text-success">+3%</span>
                    since last week
                  </p>
                  <div className="col-4 text-end">
                    <div className="icon icon-shape bg-gradient-danger shadow-danger text-center rounded-circle">
                      <i className="ni ni-world text-lg opacity-10" aria-hidden="true"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3">
            <div className="card">
              <div className="card-body p-3">
                <div className="row">
                  <p className="text-sm">New Clients</p>
                  <h5 className="font-weight-bolder">
                    +3,462
                  </h5>
                  <p className="mb-0">
                    <span className="text-danger">-2%</span>
                    since last quarter
                  </p>
                  <div className="col-4 text-end">
                    <div className="icon icon-shape bg-gradient-success shadow-success text-center rounded-circle">
                      <i className="ni ni-paper-diploma text-lg opacity-10" aria-hidden="true"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6">
            <div className="card">
              <div className="card-body p-3">
                <div className="row">
                  <p className="text-sm">Sales</p>
                  <h5 className="font-weight-bolder">
                    $103,430
                  </h5>
                  <p className="mb-0">
                    <span className="text-success">+5%</span> than last month
                  </p>
                  <div className="col-4 text-end">
                    <div className="icon icon-shape bg-gradient-warning shadow-warning text-center rounded-circle">
                      <i className="ni ni-cart text-lg opacity-10" aria-hidden="true"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Dashboard

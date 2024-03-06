import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Link } from 'react-router-dom';
import { ReactComponent as Slider } from '../assets/slider.svg';
import { ReactComponent as Insta } from '../assets/insta.svg';
import { ReactComponent as Fb } from '../assets/fb.svg';
import DelicLogo from '../assets/img/delic-logo-2.png';
import './LandingPage.scss';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="header">
        <div className="hdr-content">
          <div className="btn">
            <Link to={"/get-started"}>Get started</Link>
          </div>
        </div>
      </div>
      <Carousel
        infinite={true}
        infiniteLoop={true}
        autoPlay={true}
        autoplaySpeed={3500}
        transitionTime={10}
        showArrows={false}
        fade={true}
        showIndicators={false}
        stopOnHover={false}
        showStatus={false}
        cssEase="linear"
        showThumbs={false}
      >
        <div className="slider">
          <div className="a-slide slide1">
            <div className="container">
              <h1>Welcome to Delic Admin</h1>
              <div className="bottom-section scroll-reveal" data-origin="right" data-distance="20%">
                <h1 className="header-txt">
                  <span>Seamless</span> meal and order <span>management</span>
                </h1>
                <div className="divider">
                  <Slider />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="slider">
          <div className="a-slide slide2">
            <div className="container">
              <div className="bottom-section">
                <h1 className="header-txt">
                  Dynamic <span>menu customization</span>, and real-time <span>analytics</span>
                </h1>
                <div className="divider">
                  <Slider />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Carousel>
      <div className="footer">
        <div className="footer-content">
          <div className="copyright">
            <p className="copy-info">Copyright © 2024 Delic, Inc. All rights reserved.</p>
          </div>
          <div className="social-icons scroll-reveal" data-duration="1500">
            <div className="fb-i">
              <Link target="_blank" to="https://www.facebook.com/bernard.onah">
                <Fb style={{ height: "1.25rem", width: "1.25rem" }} />
              </Link>
            </div>
            <div className="insta-i">
              <Link target="_blank" to="https://www.instagram.com/onah_zoba/">
                <Insta style={{ height: "1.25rem", width: "1.25rem" }} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage

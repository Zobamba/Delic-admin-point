import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faPhone, faEnvelope, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FaFacebook, FaGoogle, FaTwitter } from "react-icons/fa";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import Visibility from "@material-ui/icons/Visibility";
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Input from "@material-ui/core/Input";
import axios from '../api/axios';
import './SignUp.scss';

const USER_REGEX = /^[A-z][A-z]{2,23}$/;
const EMAIL_REGEX = /^[a-z0-9.]{1,64}@[a-z0-9.]{1,64}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/users/sign_up';

const SignUp = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [validEMail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [validFirstname, setValidFirstname] = useState(false);
    const [firstNameFocus, setFirstNameFocus] = useState(false);


    const [lastName, setLastName] = useState('');
    const [validLastname, setValidLastname] = useState(false);
    const [lastNameFocus, setLastNameFocus] = useState(false);

    const [phoneNumber, setPhoneNumber] = useState('');

    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const navigate = useNavigate()


    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => {
        setValidFirstname(USER_REGEX.test(firstName));
        setValidLastname(USER_REGEX.test(lastName));
    }, [firstName, lastName])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
        setValidMatch(password === passwordConfirmation);
    }, [password, passwordConfirmation])

    useEffect(() => {
        setErrMsg('');
    }, [email, firstName, lastName, phoneNumber, password, passwordConfirmation])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Will effect if button validations are removed
        const v1 = EMAIL_REGEX.test(email);
        const v2 = PWD_REGEX.test(password);
        const v3 = USER_REGEX.test(firstName, lastName);
        if (!v1 || !v2 || !v3) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ email, firstName, lastName, phoneNumber, password, passwordConfirmation }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            //clear state and controlled inputs
            setEmail('');
            setPassword('');
            setFirstName('')
            setLastName('')
            setPhoneNumber('')
            setPasswordConfirmation('');
            navigate("/")
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response!');
            } else if (err.response?.status === 409) {
                setErrMsg('Email already exist!');
            } else {
                setErrMsg('Registration Failed!')
            }
            errRef.current.focus();
        }
    }
    const [values, setValues] = React.useState({
        password: "",
        showPassword: false,
    });

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <main className="wrapper">
            <section className="inner">
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <form className="login100-form" onSubmit={handleSubmit}>
                    <span className="sign-up-title">Sign up</span>
                    <div className="form-group">
                        <div className="form-wrapper">
                            <InputLabel className="label-input100" htmlFor="firstname">
                                First Name:
                                <FontAwesomeIcon icon={faCheck} className={validFirstname ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validFirstname || !firstName ? "hide" : "invalid"} />
                            </InputLabel>
                            <Input
                                className="form-control"
                                type="text"
                                ref={userRef}
                                id="firstname"
                                autoComplete="off"
                                onChange={(e) => setFirstName(e.target.value)}
                                value={firstName}
                                required
                                aria-invalid={validFirstname ? false.toString() : true.toString()}
                                aria-describedby="firstname"
                                onFocus={() => setFirstNameFocus(true)}
                                onBlur={() => setFirstNameFocus(false)}
                            />
                            <p id="firstname" className={firstNameFocus && firstName && !validFirstname ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                3 to 24 characters.<br />
                                Must begin with a letter.<br />
                            </p>
                            <span>
                                <i>
                                    <FontAwesomeIcon className="focus-input100" icon={faUserCircle} />
                                </i>
                            </span>
                        </div>
                        <div className="form-wrapper">
                            <InputLabel className="label-input100" htmlFor="lastname">
                                Last Name:
                                <FontAwesomeIcon icon={faCheck} className={validLastname ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validLastname || !lastName ? "hide" : "invalid"} />
                            </InputLabel>
                            <Input
                                className="form-control"
                                type="text"
                                id="lastname"
                                autoComplete="off"
                                onChange={(e) => setLastName(e.target.value)}
                                value={lastName}
                                required
                                aria-invalid={validLastname ? false.toString() : true.toString()}
                                aria-describedby="lastname"
                                onFocus={() => setLastNameFocus(true)}
                                onBlur={() => setLastNameFocus(false)}
                            />
                            <p id="lastname" className={lastNameFocus && lastName && !validLastname ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                3 to 24 characters.<br />
                                Must begin with a letter.<br />
                            </p>
                            <span>
                                <i>
                                    <FontAwesomeIcon className="focus-input100" icon={faUserCircle} />
                                </i>
                            </span>
                        </div>
                    </div>
                    <div className="form-wrapper">
                        <InputLabel className="label-input100" htmlFor="phone">
                            Phone No:
                        </InputLabel>
                        <Input
                            className="form-control"
                            type="tel"
                            id="phone"
                            autoComplete="off"
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            value={phoneNumber}
                            required
                            aria-describedby="phone"
                        />
                        <span>
                            <i>
                                <FontAwesomeIcon className="focus-input100" icon={faPhone} />
                            </i>
                        </span>
                    </div>
                    <div className="form-wrapper">
                        <InputLabel className="label-input100" htmlFor="email">
                            Email:
                            <FontAwesomeIcon icon={faCheck} className={validEMail ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validEMail || !email ? "hide" : "invalid"} />
                        </InputLabel>
                        <Input
                            className="form-control"
                            type="email"
                            id="email"
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                            aria-invalid={validEMail ? false.toString() : true.toString()}
                            aria-describedby="eml"
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                        />
                        <p id="eml" className={emailFocus && email && !validEMail ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            2 to 65 characters before @.<br />
                            Must begin with a letter.<br />
                        </p>
                        <span>
                            <i>
                                <FontAwesomeIcon className="focus-input100" icon={faEnvelope} />
                            </i>
                        </span>
                    </div>
                    <div className="form-wrapper">
                        <InputLabel className="label-input100" htmlFor="password">
                            Password:
                            <FontAwesomeIcon icon={faCheck} className={validPassword ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPassword || !password ? "hide" : "invalid"} />
                        </InputLabel>
                        <Input
                            className="form-control"
                            type={values.showPassword ? "text" : "password"}
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                            aria-invalid={validPassword ? false.toString() : true.toString()}
                            aria-describedby="pwd"
                            onFocus={() => setPasswordFocus(true)}
                            onBlur={() => setPasswordFocus(false)}
                            endAdornment={
                                <InputAdornment position="end"
                                    className="fa-eye">
                                    <IconButton
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                    >
                                        {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        <p id="pwd" className={passwordFocus && !validPassword ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>

                        <span>
                            <i>
                                <FontAwesomeIcon className="focus-input100" icon={faKey} />
                            </i>
                        </span>
                    </div>
                    <div className="form-wrapper">
                        <InputLabel className="label-input100" htmlFor="confirm_pwd">
                            Confirm Password:
                            <FontAwesomeIcon icon={faCheck} className={validMatch && passwordConfirmation ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !passwordConfirmation ? "hide" : "invalid"} /></InputLabel>
                        <Input
                            className="form-control"
                            type={values.showPassword ? "text" : "password"}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            value={passwordConfirmation}
                            required
                            aria-invalid={validPassword ? false.toString() : true.toString()}
                            aria-describedby="confirmPwd"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmPwd" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the first password input field.
                        </p>
                        <span>
                            <i>
                                <FontAwesomeIcon className="focus-input100" icon={faKey} />
                            </i>
                        </span>
                    </div>

                    <div className="btn-section">
                        <button disabled={!validFirstname || !validLastname || !validEMail || !validPassword || !validMatch ? true : false}>Register</button>
                        <Link className="sign-in" to="/sign-in">I am already a member</Link>
                    </div>
                    <div className="txt1">
                        <span>
                            Or Sign Up Using
                        </span>
                    </div>

                    <div className="flex-c-m">
                        <Link to="" className="login100-social-item bg1">
                            <i className="fa fa-facebook"><FaFacebook /></i>
                        </Link>

                        <Link to="" className="login100-social-item bg2">
                            <i className="fa fa-twitter"><FaTwitter /></i>
                        </Link>

                        <Link to="" className="login100-social-item bg3">
                            <i className="fa fa-google"><FaGoogle /></i>
                        </Link>
                    </div>
                </form>
            </section>
        </main>
    )
}

export default SignUp

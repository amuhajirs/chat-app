import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from 'yup';

function Register() {
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    // Validation schema
    const registerSchema = Yup.object().shape({
        email: Yup.string()
            .required('Email required')
            .email('Invalid Email'),
        username: Yup.string()
            .required('Username required')
            .min(3, 'Username too short'),
        password: Yup.string()
            .required('Password required')
            .min(8, 'Password too short'),
        confirmPassword: Yup.string()
            .required('Confirm Password required')
            .oneOf([Yup.ref('password')], 'Your passwords do not match.')
    });

    // Formik
    const formik = useFormik({
        initialValues: {
            email: "",
            username: "",
            password: "",
            confirmPassword: ""
        },
        validationSchema: registerSchema,
        validateOnChange: false,
        validateOnBlur: false,
        onSubmit: async (values)=>{
            setIsLoading(true);

            await axios.post('/api/auth/register', {
                email: values.email,
                username: values.username,
                password: values.password
            })
                .then(res=>{
                    console.log(res.data);
                    navigate('/login');
                })
                .catch(err=>{
                    formik.errors.email = err.response.data.error.email;
                    formik.errors.username = err.response.data.error.username;
                })
                .finally(()=>setIsLoading(false));
        }
    });

    return (
        <div className="container" style={{height: '100vh'}}>
            <div className="row justify-content-center align-items-center" style={{height: '100%'}}>
                <div className="col-lg-5 col-md-7 col-sm-12 bg-theme-primary rounded-2 p-4">

                    <div className="row mb-3">
                        <div className="col">
                            <h1 className="text-center fw-bold mb-3">
                                <img src="/logo512.png" style={{width: '60px'}} alt="" /> ChatApp
                            </h1>
                            <h4 className="text-center">Create your account</h4>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <form method="POST" onSubmit={formik.handleSubmit} className="mb-3">

                                    <div className="field-theme pb-4">
                                        <input type="text"
                                            {...formik.getFieldProps("email")}
                                            className={`input-theme rounded-pill ${formik.errors.email && formik.touched.email ? 'invalid' : ''}`}
                                            id="email"
                                            required
                                            autoComplete="off" />

                                        <label htmlFor="email">Email</label>
                                        {formik.errors.email && formik.touched.email && <span className="error-message ms-3">{formik.errors.email}</span>}
                                    </div>

                                    <div className="field-theme pb-4">
                                        <input type="text"
                                            {...formik.getFieldProps("username")}
                                            className={`input-theme rounded-pill ${formik.errors.username && formik.touched.username ? 'invalid' : ''}`}
                                            id="username"
                                            required
                                            autoComplete="off" />

                                        <label htmlFor="username">Username</label>
                                        {formik.errors.username && formik.touched.username && <span className="error-message ms-3">{formik.errors.username}</span>}
                                    </div>

                                    <div className="field-theme pb-4">
                                        <input type="password"
                                            {...formik.getFieldProps("password")}
                                            className={`input-theme rounded-pill ${formik.errors.password && formik.touched.password ? 'invalid' : ''}`}
                                            id="password"
                                            required
                                            autoComplete="off" />

                                        <label htmlFor="password">Password</label>
                                        {formik.errors.password && formik.touched.password && <span className="error-message ms-3">{formik.errors.password}</span>}
                                    </div>

                                    <div className="field-theme pb-4">
                                        <input type="password"
                                            {...formik.getFieldProps("confirmPassword")}
                                            className={`input-theme rounded-pill ${formik.errors.confirmPassword && formik.touched.confirmPassword ? 'invalid' : ''}`}
                                            id="confirm_password"
                                            required
                                            autoComplete="off" />

                                        <label htmlFor="confirm_password">Confirm Password</label>
                                        {formik.errors.confirmPassword && formik.touched.confirmPassword && <span className="error-message ms-3">{formik.errors.confirmPassword}</span>}
                                    </div>

                                {!isLoading ? (<button type="submit" className="btn btn-primary w-100 rounded-pill">Register</button>) :
                                (<button type="submit" className="btn btn-primary w-100 rounded-pill" disabled>Registering...</button>)}
                            </form>
                            <span>Already have an account? <Link to="/login">Login now</Link></span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Register;
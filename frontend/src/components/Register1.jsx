import axios from 'axios';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';

const Register1 = ({ setStep, values, setValues, step1Error, verifiedEmail }) => {
    const [isLoading, setIsLoading] = useState(false);

    // Validation schema
    const registerSchema = Yup.object().shape({
        username: Yup.string()
            .required('Username required')
            .min(3, 'Username too short'),
        email: Yup.string()
            .required('Email required')
            .email('Invalid Email'),
        password: Yup.string()
            .required('Password required')
            .min(8, 'Password too short'),
        confirmPassword: Yup.string()
            .required('Confirm Password required')
            .oneOf([Yup.ref('password')], 'Confirm password doesn\'t match with password.')
    });

    // Formik
    const formik = useFormik({
        initialValues: {
            email: values.email || '',
            username: values.username || '',
            password: values.password || '',
            confirmPassword: values.confirmPassword || ''
        },
        validationSchema: registerSchema,
        validateOnChange: false,
        validateOnBlur: false,
        onSubmit: async (values)=>{
            setIsLoading(true);
            setValues(values);

            if(verifiedEmail.includes(values.email)) {
                setIsLoading(false);
                setStep(3);
            } else {
                await axios.post('/api/auth/verify-email/generate', {email: values.email, username: values.username})
                    .then(res => {
                        if(res.data.succeed) {
                            setStep(2);
                        } else {
                            formik.setErrors(res.data.message);
                        }
                    })
                    .catch(err => console.error(err))
                    .finally(() => setIsLoading(false));
            }
        }
    });

    useEffect(() => {
        formik.setErrors(step1Error);
    }, [step1Error]);

    return (
        <>
        <h4 className="text-center mb-3">Create your account</h4>

        <form onSubmit={formik.handleSubmit} className="mb-3">

            <div className="field-theme mb-4">
                <input type="text"
                    {...formik.getFieldProps("username")}
                    className={`input-theme rounded-2 w-100 ${formik.errors?.username ? 'invalid' : ''}`}
                    id="username"
                    required
                    autoComplete="off" />

                <label htmlFor="username">Username</label>
                {formik.errors?.username ? <span className="error-message ms-3">{formik.errors.username}</span> :
                <span className="error-message ms-3 text-secondary" style={{color: 'white'}}>Username must be unique</span>}
            </div>

            <div className="field-theme mb-4">
                <input type="text"
                    {...formik.getFieldProps("email")}
                    className={`input-theme rounded-2 w-100 ${formik.errors?.email ? 'invalid' : ''}`}
                    id="email"
                    required
                    autoComplete="off" />

                <label htmlFor="email">Email</label>

                {formik.errors?.email ? <span className="error-message ms-3">{formik.errors.email}</span> : 
                <span className="error-message ms-3 text-secondary" style={{color: 'white'}}>Email must be unique</span>}
            </div>

            <div className="field-theme mb-4">
                <input type="password"
                    {...formik.getFieldProps("password")}
                    className={`input-theme rounded-2 w-100 ${formik.errors?.password ? 'invalid' : ''}`}
                    id="password"
                    required
                    autoComplete="off" />

                <label htmlFor="password">Password</label>
                {formik.errors?.password ? <span className="error-message ms-3">{formik.errors?.password}</span> :
                <span className="error-message ms-3 text-secondary">Password length at least 8 letters</span>}
            </div>

            <div className="field-theme mb-5">
                <input type="password"
                    {...formik.getFieldProps("confirmPassword")}
                    className={`input-theme rounded-2 w-100 ${formik.errors?.confirmPassword ? 'invalid' : ''}`}
                    id="confirm_password"
                    required
                    autoComplete="off" />

                <label htmlFor="confirm_password">Confirm Password</label>
                {formik.errors?.confirmPassword ? <span className="error-message ms-3">{formik.errors.confirmPassword}</span> : 
                <span className="error-message ms-3 text-secondary">Confirm Password must be match with Password field</span>}
            </div>

            {!isLoading ? (
            <button type="submit" className="btn btn-primary w-100 rounded-2 d-flex justify-content-center align-items-center gap-2">
                <span>Next</span> <i className="fa-solid fa-arrow-right pt-1"></i>
            </button>) :
            (<button type="submit" className="btn btn-primary w-100 rounded-2" disabled>Sending OTP...</button>)}
        </form>
        <span>Already have an account? <Link to="/login">Login now</Link></span>
        </>
    )
}

export default Register1;
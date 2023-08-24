import axios from 'axios';
import { useRef, useState } from 'react';

const Register3 = ({ setStep, values, setStep1Error }) => {
    const [avatar, setAvatar] = useState(undefined);
    const [displayName, setDisplayName] = useState(values.username);
    const [isLoading, setIsLoading] = useState(false);

    const myModal = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        let data;

        if(avatar) {
            data = new FormData();
            data.append('avatar', avatar);
            data.append('displayName', displayName);
            data.append('username', values.username);
            data.append('email', values.email);
            data.append('password', values.password);
        } else {
            data = {...values, avatar: '/default-avatar.jpg', displayName};
        }

        await axios.post('/api/auth/register', data)
            .then(res => {
                console.log(res.data);
                if(res.data.succeed) {
                    const modal = new window.bootstrap.Modal(myModal.current);
                    modal.show();
                } else {
                    setStep1Error(res.data.message);
                    setStep(1);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    }

    return (
        <>
        <div className='text-center'>
            <h5 className='m-0 fw-bold'>Almost done!</h5>
            <h5 className='mb-4'>Set up your profile</h5>

            <form onSubmit={handleSubmit}>
                <label className='position-relative d-inline-block rounded-circle change-avatar mb-4' style={{overflow: 'hidden'}}>
                    <img src={avatar ? URL.createObjectURL(avatar) : '/default-avatar.jpg' } alt="" style={{width: '150px'}} className='avatar' />
                    <div className="position-absolute bottom-0 start-50 w-100 rounded-circle" style={{transform: 'translate(-50%, 0)'}}>
                        <div className="text-black mt-3 fw-semibold">Change Picture</div>
                    </div>
                    <input type="file" accept="image/*" hidden onChange={(e) => setAvatar(e.target.files[0])} />
                </label>

                <div className="field-theme mb-4">
                    <input type="text" id='display-name' className='input-theme rounded-2 w-100' value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
                    <label htmlFor="display-name">Display Name</label>
                </div>

                {!isLoading ? <button type='submit' className='btn btn-primary w-100'>Register</button> : 
                <button type='submit' className='btn btn-primary w-100' disabled>Registering...</button>}
            </form>
        </div>

        {/* Modal */}
        <div className="modal fade" id="successModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-hidden="true" ref={myModal} data-bs-theme="dark">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-theme-primary">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">Register Success</h1>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3 text-center">
                            <i className="fa-solid fa-circle-check text-success mb-4" style={{fontSize: '120px'}}></i>
                            <h5>Account created successfully! You can login now.</h5>
                        </div>
                        <div className=" d-flex justify-content-end align-items-center pt-3">
                            <a href="/login" type="button" className="btn btn-primary px-4 w-100">Okay</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Register3;
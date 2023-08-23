import { useState } from "react";
import { ChatState } from "../context/ChatProvider";
import * as Yup from 'yup';
import axios from "axios";
import { MoonLoader } from 'react-spinners';

const ProfileModal = () => {
    const { user, setUser } = ChatState();
    const [isEditUsername, setIsEditUsername] = useState(false);
    const [isEditEmail, setIsEditEmail] = useState(false);
    const [isEditPassword, setIsEditPassword] = useState(false);
    const [isLoadingUsername, setIsLoadingUsername] = useState(false);
    const [isLoadingEmail, setIsLoadingEmail] = useState(false);
    const [isLoadingPassword, setIsLoadingPassword] = useState(false);

    const [username, setUsername] = useState(user.data?.username);
    const [email, setEmail] = useState(user.data?.email);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const emailSchema = Yup.object().shape({
        email: Yup.string()
            .required()
            .email('Invalid Email'),
    });

    const toggleEdit = async (field) => {
        if(field==='username') {
            if(isEditUsername) {
                setIsEditUsername(false);
                setUsername(user.data?.username);
            } else {
                setIsEditUsername(true);
            }
        } else if (field==='email') {
            if(isEditEmail) {
                setIsEditEmail(false);
                setEmail(user.data?.email);
            } else {
                setIsEditEmail(true);
            }
        } else if (field==='password') {
            if(isEditPassword) {
                setIsEditPassword(false);
                setCurrentPassword('');
                setNewPassword('');
            } else {
                setIsEditPassword(true);
                setCurrentPassword('');
                setNewPassword('');
            }
        }
    }

    const handleSubmit = async (field) => {
        let data;

        if(field==='username') {
            // Validate
            if(!username || username.length <= 2) {
                return;
            }
            
            setIsLoadingUsername(true);
            data = {username};
        } else if (field==='email') {
            // Validate
            await emailSchema.validate({email});
            
            setIsLoadingEmail(true);
            data = {email};
        } else if (field==='password') {
            // Validate
            if(!newPassword || !currentPassword || newPassword.length <= 7) {
                return;
            }

            setIsLoadingPassword(true);
            data = {currentPassword, newPassword}
        }
        console.log(data)

        await axios.patch('/api/auth/update', data)
            .then(res => {
                setUser({...user, data: res.data.data});

                if(field==='username') {
                    setIsEditUsername(false);
                } else if (field==='email') {
                    setIsEditEmail(false);
                } else if (field==='password') {
                    setIsEditPassword(false);
                }
            })
            .catch(err => console.error(err))
            .finally(() => {
                if(field==='username') {
                    setIsLoadingUsername(false);
                } else if (field==='email') {
                    setIsLoadingEmail(false);
                } else if (field==='password') {
                    setIsLoadingPassword(false);
                }
            });
    }

    const changeAvatar = async (file) => {
        const formData = new FormData();

        if(file) {
            formData.append('avatar', file);
        }

        await axios.patch('/api/auth/update', formData)
            .then(res => {
                setUser({...user, data: res.data.data});
            })
            .catch(err => console.error(err))
    }

    const deleteAvatar = async () => {
        await axios.delete('/api/auth/delete-avatar')
            .then(res => setUser({...user, data: res.data.data}))
            .catch(err => console.error(err));
    }

    return (
        <div className="modal fade" id="profileModal" tabIndex="-1" aria-hidden="true" data-bs-theme="dark">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-theme-primary">
                    <div className="modal-body position-relative">
                        <button type="button" className="btn-close position-absolute" data-bs-dismiss="modal" aria-label="Close" style={{top: '20px', right: '20px'}}></button>
                        <div className="d-flex justify-content-center my-3">
                            <h3 className="modal-title">Profile</h3>
                        </div>
                        <div>
                            <div className="dropdown text-center mb-3 ">
                                <div className="position-relative d-inline-block rounded-circle change-avatar" style={{overflow: 'hidden'}} data-bs-toggle="dropdown" aria-expanded="false">
                                    <img src={user.data?.avatar} alt="" style={{width: '150px', aspectRatio: '1/1', objectFit: 'cover'}} />
                                    <div className="position-absolute bottom-0 start-50 w-100 rounded-circle" style={{transform: 'translate(-50%, 0)'}}>
                                        <div className="text-black mt-3 fw-semibold">Change Avatar</div>
                                    </div>
                                </div>
                                <ul className="dropdown-menu dropdown-menu-dark dropdown-theme-primary">
                                    <li>
                                        <label role="button" htmlFor="input-avatar" className="dropdown-item">Upload Image</label>
                                    </li>
                                    <li>
                                        <span role="button" className="dropdown-item" onClick={deleteAvatar}>Default</span>
                                    </li>
                                </ul>
                                <input id="input-avatar" type="file" accept="image/*" hidden onChange={(e) => {changeAvatar(e.target.files[0])}} />
                            </div>

                            <div className="position-relative bg-dark rounded p-1 ps-3 pe-5 d-flex align-items-center gap-3 border mb-2">
                                <i className="fa-solid fa-user fs-5"></i>
                                <div style={{width: '75%'}}>
                                    <p style={{fontSize: '14px'}}>Username</p>
                                    {!isEditUsername ? <p className="fw-semibold">{user.data?.username}</p> : 
                                    <input type="text" className="form-control" placeholder="New Username" value={username} onChange={(e) => setUsername(e.target.value)} />}
                                </div>
                                <div className="position-absolute top-50" style={{transform: 'translate(0, -50%)', right: '20px'}}>
                                    { isLoadingUsername ? <div className="d-flex"><MoonLoader color="rgb(255, 255, 255)" size={20} /></div> :
                                    !isEditUsername ? (
                                        <button onClick={() => toggleEdit('username')}>
                                            <i className="fa-solid fa-pen"></i>
                                        </button>) : (
                                    <>
                                        <button onClick={() => toggleEdit('username')} className="me-3">
                                            <i className="fa-solid fa-xmark fs-5"></i>
                                        </button>
                                        <button onClick={() => handleSubmit('username')}>
                                            <i className="fa-solid fa-check fs-5"></i>
                                        </button>
                                    </>
                                    )}
                                </div>
                            </div>

                            <div className="position-relative bg-dark rounded p-1 ps-3 pe-5 d-flex align-items-center gap-3 border mb-2">
                                <i className="fa-solid fa-envelope fs-5"></i>
                                <div style={{width: '75%'}}>
                                    <p style={{fontSize: '14px'}}>Email</p>
                                    {!isEditEmail ? <p className="fw-semibold">{user.data?.email}</p> : 
                                    <input type="text" className="form-control" placeholder="New Email" value={email} onChange={(e) => setEmail(e.target.value)} />}
                                </div>
                                <div className="position-absolute top-50" style={{transform: 'translate(0, -50%)', right: '20px'}}>
                                    { isLoadingEmail ? <div className="d-flex"><MoonLoader color="rgb(255, 255, 255)" size={20} /></div> :
                                    !isEditEmail ? (
                                        <button onClick={() => toggleEdit('email')}>
                                            <i className="fa-solid fa-pen"></i>
                                        </button>) : (
                                    <>
                                        <button onClick={() => toggleEdit('email')} className="me-3">
                                            <i className="fa-solid fa-xmark fs-5"></i>
                                        </button>
                                        <button onClick={() => handleSubmit('email')}>
                                            <i className="fa-solid fa-check fs-5"></i>
                                        </button>
                                    </>
                                    )}
                                </div>
                            </div>

                            <div className="position-relative bg-dark rounded p-1 ps-3 pe-5 d-flex align-items-center gap-3 border mb-5">
                                <i className="fa-solid fa-lock fs-5"></i>
                                <div style={{width: '75%'}}>
                                    <p style={{fontSize: '14px'}}>Password</p>
                                    {!isEditPassword ? <p className="fw-semibold">**********</p> : 
                                    <>
                                    <input type="password" className="form-control mb-2" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                                    <input type="password" className="form-control" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                    </>
                                    }
                                </div>
                                <div className="position-absolute top-50" style={{transform: 'translate(0, -50%)', right: '20px'}}>
                                    { isLoadingPassword ? <div className="d-flex"><MoonLoader color="rgb(255, 255, 255)" size={20} /></div> :
                                    !isEditPassword ? (
                                        <button onClick={() => toggleEdit('password')}>
                                            <i className="fa-solid fa-pen"></i>
                                        </button>) : (
                                    <>
                                        <button onClick={() => toggleEdit('password')} className="me-3">
                                            <i className="fa-solid fa-xmark fs-5"></i>
                                        </button>
                                        <button onClick={() => handleSubmit('password')}>
                                            <i className="fa-solid fa-check fs-5"></i>
                                        </button>
                                    </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileModal
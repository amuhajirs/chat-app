import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ChatState } from "../context/ChatProvider";

const CheckLogin = ({ type }) => {
    const { user } = ChatState();
    const navigate = useNavigate();

    useEffect(() => {
        if(type==='auth') {
            if(!user.login) {
                navigate('/login');
            }
        } else {
            if(user.login) {
                navigate('/');
            }
        }
    });

    return (
        <Outlet />
    )
}

export default CheckLogin;
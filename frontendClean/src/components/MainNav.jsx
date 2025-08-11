import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearToken, clearUser } from '../store';
import logo from '../assets/argentBankLogo.png';

function MainNav() {
    const token = useSelector((state) => state.auth.token);
    const firstName = useSelector((state) => state.user.firstName);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem('token');
        dispatch(clearToken());
        dispatch(clearUser());
        navigate('/');
    };

    return (
        <nav className="main-nav">
            <Link className="main-nav-logo" to="/">
                <img className="main-nav-logo-image" src={logo} alt="Argent Bank Logo" />
                <h1 className="sr-only">Argent Bank</h1>
            </Link>
            <div>
                {token ? (
                    <>
                        <Link className="main-nav-item" to="/profile">
                            <i className="fa fa-user-circle"></i>
                            {' '}{firstName}
                        </Link>
                        <button className="main-nav-item" onClick={handleSignOut}>
                            <i className="fa fa-sign-out"></i>
                            {' '}Sign Out
                        </button>
                    </>
                ) : (
                    <Link className="main-nav-item" to="/login">
                        <i className="fa fa-user-circle"></i>
                        {' '}Sign In
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default MainNav;

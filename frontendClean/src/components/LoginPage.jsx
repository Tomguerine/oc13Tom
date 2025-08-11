import React, { useState } from 'react';
import MainNav from './MainNav';
import Footer from './Footer';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setToken, setUser } from '../store';
import '../style/main.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:3001/api/v1/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok && data.body && data.body.token) {
                const token = data.body.token;
                dispatch(setToken(token));
                if (rememberMe) {
                    localStorage.setItem('token', token);
                } else {
                    localStorage.removeItem('token');
                }
                try {
                    const profileRes = await fetch('http://localhost:3001/api/v1/user/profile', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (profileRes.ok) {
                        const profileData = await profileRes.json();
                        if (profileData && profileData.body) {
                            dispatch(setUser({
                                firstName: profileData.body.firstName,
                                lastName: profileData.body.lastName,
                            }));
                        }
                    }
                } catch (err) {
                    console.error('Failed to fetch user profile', err);
                }
                navigate('/profile');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            console.error('Error during login', err);
            setError('Error during login');
        }
    };

    return (
        <>
            <MainNav />
            <main className="main bg-dark">
                <section className="sign-in-content">
                    <i className="fa fa-user-circle sign-in-icon"></i>
                    <h1>Sign In</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="input-wrapper">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="input-wrapper">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="input-remember">
                            <input
                                type="checkbox"
                                id="remember-me"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label htmlFor="remember-me">Remember me</label>
                        </div>
                        <button type="submit" className="sign-in-button">Sign In</button>
                    </form>
                    {error && <p className="error">{error}</p>}
                </section>
            </main>
            <Footer />
        </>
    );
}

export default LoginPage;

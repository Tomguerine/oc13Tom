import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import MainNav from '../components/MainNav';
import Footer from '../components/Footer';
import withAuth from '../components/withAuth';

function UserPage() {
    const token = useSelector((state) => state.auth.token);
    const [profile, setProfile] = useState({ firstName: '', lastName: '' });
    const [editing, setEditing] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) {
            return;
        }
        fetch('/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data && data.body) {
                    setProfile({
                        firstName: data.body.firstName,
                        lastName: data.body.lastName,
                    });
                    setFirstName(data.body.firstName);
                    setLastName(data.body.lastName);
                }
            })
            .catch((err) => console.error('Failed to fetch profile', err));
    }, [token]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        fetch('/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ firstName, lastName }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data && data.status === 200) {
                    setProfile({ firstName, lastName });
                    setEditing(false);
                } else {
                    setError('Failed to update profile');
                }
            })
            .catch((err) => {
                console.error('Failed to update profile', err);
                setError('Failed to update profile');
            });
    };

    return (
        <>
            <MainNav />
            <main className="main bg-dark">
                <div className="header">
                    {editing ? (
                        <form className="edit-name-form" onSubmit={handleSubmit}>
                            <div className="input-wrapper">
                                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                            <div className="input-wrapper">
                                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>
                            {error && <p className="error-message">{error}</p>}
                            <button type="submit" className="save-button">Save</button>
                            <button type="button" className="cancel-button" onClick={() => setEditing(false)}>Cancel</button>
                        </form>
                    ) : (
                        <>
                            <h1>Welcome back<br />{profile.firstName} {profile.lastName}!</h1>
                            <button className="edit-button" onClick={() => setEditing(true)}>Edit Name</button>
                        </>
                    )}
                </div>
                <h2 className="sr-only">Accounts</h2>
                <section className="account">
                    <div className="account-content-wrapper">
                        <h3 className="account-title">Argent Bank Checking (x8349)</h3>
                        <p className="account-amount">$2,082.79</p>
                        <p className="account-amount-description">Available Balance</p>
                    </div>
                    <div className="account-content-wrapper cta">
                        <button className="transaction-button">View transactions</button>
                    </div>
                </section>
                <section className="account">
                    <div className="account-content-wrapper">
                        <h3 className="account-title">Argent Bank Savings (x6712)</h3>
                        <p className="account-amount">$10,928.42</p>
                        <p className="account-amount-description">Available Balance</p>
                    </div>
                    <div className="account-content-wrapper cta">
                        <button className="transaction-button">View transactions</button>
                    </div>
                </section>
                <section className="account">
                    <div className="account-content-wrapper">
                        <h3 className="account-title">Argent Bank Credit Card (x8349)</h3>
                        <p className="account-amount">$184.30</p>
                        <p className="account-amount-description">Current Balance</p>
                    </div>
                    <div className="account-content-wrapper cta">
                        <button className="transaction-button">View transactions</button>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

const ProtectedUserPage = withAuth(UserPage);

export default ProtectedUserPage;


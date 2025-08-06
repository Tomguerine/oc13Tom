import React from 'react';
import MainNav from '../components/MainNav';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';

function HomePage() {
    return (
        <>
            <MainNav />
            <main>
                <Hero />
                <Features />
            </main>
            <Footer />
        </>
    );
}

export default HomePage;
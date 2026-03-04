import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import WhyChoose from '../components/WhyChoose';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <>
            <Navbar />
            <Hero />
            <Features />
            <HowItWorks />
            <WhyChoose />
            <CallToAction />
            <Footer />
        </>
    );
};

export default Home;

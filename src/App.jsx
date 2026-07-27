import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import CodeShowcase from './components/CodeShowcase';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import GetStarted from './components/GetStarted';
import Footer from './components/Footer';
import Tutorial from './components/Tutorial';

function HomePage() {
  return (
    <div className="app">
      <Hero />
      <CodeShowcase />
      <Features />
      <HowItWorks />
      <GetStarted />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tutorial" element={<Tutorial />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

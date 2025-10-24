import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Herosection from '../components/Herosection';
import Footer from '../components/Footer';
import Logo_About from '../components/Logo_About';
import Gallery from '../components/Gallery';
import { FaUsers, FaShieldAlt, FaHeadset, FaBriefcase } from 'react-icons/fa';

const Home = () => {
  const { id, pageName } = useParams(); // Get 'id' and 'pageName' from URL
  const navigate = useNavigate();

  const [userId, setUserId] = useState(id);

  useEffect(() => {
    // Redirect to login if 'id' is missing, undefined, or not a valid number
    if (!id || isNaN(Number(id))) {
      navigate('/login');
    } else {
      setUserId(id); // Set the userId in state if it's valid
    }
  }, [id, navigate]);

  return (
    <>
      <Navbar />

      

      <hr className="bg-purple-100 py-5" />


  

      <Footer />
    </>
  );
};

export default Home;

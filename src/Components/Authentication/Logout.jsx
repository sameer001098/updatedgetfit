import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
   
    localStorage.removeItem('getfituserid');
    localStorage.removeItem('getfitfirstname');

  
    navigate('/login');
  }, [navigate]);

  return null; 
}

export default Logout;

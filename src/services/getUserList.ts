import { useState, useEffect } from 'react';

const useUserList = () => {
  const [loading, setLoading] = useState(true);
  const [userdata, setUserdata] = useState([]);
  const fetchData = async () => {
    try {
   
      setLoading(true);

      const response = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const userData = await response.json();
      setLoading(false);
      setUserdata(userData);

    } catch (error) {
      setLoading(false);
      setUserdata([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); 

  return { loading, userdata };
};

export default useUserList;

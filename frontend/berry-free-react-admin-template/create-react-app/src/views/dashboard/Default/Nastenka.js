import React, { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Cards from 'views/utilities/Cards';

const Nastenka = (props) => {
  const [data, setData] = useState({ postData: [], imagesData: [] });

  const fetchData = async () => {
    const token = localStorage.getItem('jwtToken');
    try {
      const [postResponse, imagesResponse] = await Promise.all([
        fetch('/api/post', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          }
        }),
        fetch('/api/images', {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (!postResponse.ok) {
        throw new Error(`Post data fetch failed with status: ${postResponse.status}`);
      }

      if (!imagesResponse.ok) {
        throw new Error(`Images data fetch failed with status: ${imagesResponse.status}`);
      }

      const postData = await postResponse.json();
      const imagesData = await imagesResponse.json();

      setData({ postData, imagesData });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const memoizedPostData = useMemo(() => data.postData, [data.postData]);
  const memoizedImagesData = useMemo(() => data.imagesData, [data.imagesData]);

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
      {memoizedPostData.map((postItem, index) => {
        const imageData = memoizedImagesData.find(img => img.postId === postItem.id);
        const imageSrc = imageData ? `data:image/jpeg;base64,${imageData.image}` : undefined;
        return (
          <Cards key={index} content={postItem.content} date={postItem.createdAt} teacherFirstName={postItem.teacherFirstName} teacherSecondName={postItem.teacherLastName} imageSrc={imageSrc} postId={postItem.id} postHandler={fetchData} />
        );
      })}
    </Box>
  );
};

export default Nastenka;

import React, {useEffect } from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router';

export default function AccountSettings() {
    
  const navigate = useNavigate();
  useEffect(() => {
   
  }, []);

  return (
    
    <>
      <Button variant="contained" size="medium" style={{ marginTop: 2 + 'em', marginLeft: 0.6 + 'em', textTransform: 'none' }} onClick={() => {navigate('/utils/util-password-change')}} disableElevation>
        Zmeniť heslo
      </Button>
    </>
  );
}

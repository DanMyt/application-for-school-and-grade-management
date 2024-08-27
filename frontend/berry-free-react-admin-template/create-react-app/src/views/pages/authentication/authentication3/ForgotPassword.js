import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';


// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import Logo from 'ui-component/Logo';
import { ForgotPasswordForm } from '../auth-forms/ForgotPasswordForm';
import { useParams, useSearchParams } from 'react-router-dom';

// assets

// ===============================|| AUTH3 - REGISTER ||=============================== //

const ForgotPassword = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const { token } = useParams();
  const navigate = useNavigate();


  

  const checkTokenValidity = () => {
   
    fetch('http://localhost:8080/auth/user/changePassword/' + token, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error();
        }

        return res.json();
      })
      .then((data) => {
        if (!data.show) {
          navigate('/pages/login/login3');
        }
        
      })
      .catch((err) => {
        console.log(err);
      });
 
  }

  useEffect(() => {
   checkTokenValidity();
  }, []);

  return (
    <AuthWrapper1>
      <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                  <Grid item sx={{ mb: 3 }}>
                    <Link to="#">
                      <Logo />
                    </Link>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container direction={matchDownSM ? 'column-reverse' : 'row'} alignItems="center" justifyContent="center">
                      <Grid item>
                        <Stack alignItems="center" justifyContent="center" spacing={1}>
                          <Typography color={theme.palette.secondary.main} gutterBottom variant={matchDownSM ? 'h3' : 'h2'}>
                            Resetovanie hesla
                          </Typography>
                          
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                  <Formik
                  initialValues={{ password: '', token: token }}
                 
                >
                  {formikProps => (
                    <ForgotPasswordForm {...formikProps} />
                  )}
                </Formik>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                 
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
        
      </Grid>
    </AuthWrapper1>
  );
};

export default ForgotPassword;

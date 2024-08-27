import { useFormikContext } from 'formik';
import React, { useState, useEffect } from 'react';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import {
  Box,
  Grid,
  Button,
  FormControl,
  InputLabel,
  FormHelperText,
  OutlinedInput,
  useMediaQuery,
  Link
} from '@mui/material';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { useTheme } from '@mui/material/styles';
import { AppQuery } from 'data';

export const AutthCheckEmail = React.memo(({ ...others }) => {
  const theme = useTheme();
  const { errors, handleBlur, handleChange, touched, values } = useFormikContext();

  const { mutate, isLoading } = AppQuery.useResetPassword();

  const [checked, setChecked] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('123456');
  }, []);

  // const sendRequestToPasswordReset = (event) => {
  //   event.preventDefault();
  //   console.log('hereee');
  //   console.log(values.email);
  //   const body = JSON.stringify({
  //       mail: values.email
  //     });
  //   fetch('/auth/resetPassword', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: body    
  //   })
  //     .then((res) => {
  //       if (!res.ok) {
  //         throw new Error();
  //       }

  //       return res.json();
  //     })
  //     .then((data) => {
       
        
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState();

  return (
    <form noValidate {...others}>
      
      <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="outlined-adornment-email-register">Emailová adresa</InputLabel>
        <OutlinedInput
          id="outlined-adornment-email-register"
          type="email"
          value={values.email}
          name="email"
          onBlur={handleBlur}
          onChange={handleChange}
          inputProps={{}}
        />
        {touched.email && errors.email && (
          <FormHelperText error id="standard-weight-helper-text--register">
            {errors.email}
          </FormHelperText>
        )}
      </FormControl>

      
      {errors.submit && (
        <Box sx={{ mt: 3 }}>
          <FormHelperText error>{errors.submit}</FormHelperText>
        </Box>
      )}

      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button
            onClick={mutate}
            disabled={isLoading}
            disableElevation
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="secondary"
            style={{textTransform: 'none'}}
          >
            Odoslať overovací link na email
          </Button>
        </AnimateButton>
      </Box>
    </form>
  );
});

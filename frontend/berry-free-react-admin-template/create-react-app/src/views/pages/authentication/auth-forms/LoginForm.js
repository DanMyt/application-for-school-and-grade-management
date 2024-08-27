import { useFormikContext } from 'formik';
import React, { useState } from 'react';
import { useAuth } from 'AuthProvider'; 
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  FormHelperText,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Stack,
  FormControlLabel,
  Checkbox,
  Typography
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { useTheme } from '@mui/material/styles';
import { AppQuery } from 'data';

export const LoginForm = React.memo(({ ...others }) => {
  const theme = useTheme();
  const { errors, handleBlur, handleChange, touched, values } = useFormikContext();

  const { mutate, isLoading } = AppQuery.useLogin();

  const [checked, setChecked] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };


  

  return (
    <form noValidate {...others}>
      <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="outlined-adornment-email-login">Emailová adresa</InputLabel>
        <OutlinedInput
          id="outlined-adornment-email-login"
          type="email"
          value={values.email}
          name="email"
          onBlur={handleBlur}
          onChange={handleChange}
          label="Email Address / Username"
          inputProps={{}}
        />
        {touched.email && errors.email && (
          <FormHelperText error id="standard-weight-helper-text-email-login">
            {errors.email}
          </FormHelperText>
        )}
      </FormControl>

      <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="outlined-adornment-password-login">Heslo</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password-login"
          type={showPassword ? 'text' : 'password'}
          value={values.password}
          name="password"
          onBlur={handleBlur}
          onChange={handleChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                size="large"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
          inputProps={{}}
        />
        {touched.password && errors.password && (
          <FormHelperText error id="standard-weight-helper-text-password-login">
            {errors.password}
          </FormHelperText>
        )}
      </FormControl>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
        <FormControlLabel
          control={<Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />}
          label="Zapamätať si ma"
        />
        <Typography component={Link} to="/pages/newPass/checkEmail" variant="subtitle1" color="secondary" sx={{ textDecoration: 'none', cursor: 'pointer' }}>
          Zabudol si heslo?
        </Typography>
      </Stack>
      {errors.submit && (
        <Box sx={{ mt: 3 }}>
          <FormHelperText error>{errors.submit}</FormHelperText>
        </Box>
      )}

      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button
            disableElevation
            disabled={isLoading}
            fullWidth
            size="large"
            variant="contained"
            color="secondary"
            onClick={mutate}
          >
            Prihlásiť
          </Button>
        </AnimateButton>
      </Box>
    </form>
  );
});

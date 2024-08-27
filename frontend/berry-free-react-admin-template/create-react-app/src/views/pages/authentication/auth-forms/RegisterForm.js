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
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Typography,
  useMediaQuery,
  Link
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { useTheme } from '@mui/material/styles';
import { AppQuery } from 'data';

export const RegisterForm = React.memo(({ ...others }) => {
  const theme = useTheme();
  const { errors, handleBlur, handleChange, touched, values } = useFormikContext();

  const { mutate, isLoading } = AppQuery.useRegister();

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

  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState();

  return (
    <form noValidate {...others}>
      <Grid container spacing={matchDownSM ? 0 : 2}>
        <Grid item xs={12} sm={6}>
          <InputLabel htmlFor="outlined-adornment-firstName">Meno</InputLabel>
          <OutlinedInput
            id="outlined-adornment-firstName"
            type="firstName"
            value={values.firstName}
            name="firstName"
            onBlur={handleBlur}
            onChange={handleChange}
            inputProps={{}}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <InputLabel htmlFor="outlined-adornment-email-register">Priezvisko</InputLabel>
          <OutlinedInput
            id="outlined-adornment-lastName"
            type="lastName"
            value={values.lastName}
            name="lastName"
            onBlur={handleBlur}
            onChange={handleChange}
            inputProps={{}}
          />

          {/*   <TextField
            fullWidth
            label="Last Name"
            margin="normal"
            name="lname"
            value={values.lastName}
            type="text"
            defaultValue=""
            sx={{ ...theme.typography.customInput }}
          /> */}
        </Grid>
      </Grid>
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

      <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="outlined-adornment-password-register">Heslo</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password-register"
          type={showPassword ? 'text' : 'password'}
          value={values.password}
          name="password"
          label="Password"
          onBlur={handleBlur}
          onChange={(e) => {
            handleChange(e);
            changePassword(e.target.value);
          }}
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
          inputProps={{}}
        />
        {touched.password && errors.password && (
          <FormHelperText error id="standard-weight-helper-text-password-register">
            {errors.password}
          </FormHelperText>
        )}
      </FormControl>

      {strength !== 0 && (
        <FormControl fullWidth>
          <Box sx={{ mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Box style={{ backgroundColor: level?.color }} sx={{ width: 85, height: 8, borderRadius: '7px' }} />
              </Grid>
              <Grid item>
                <Typography variant="subtitle1" fontSize="0.75rem">
                  {level?.label}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </FormControl>
      )}

      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <FormControlLabel
            control={<Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />}
            label={
              <Typography variant="subtitle1">
                Súhlasím s &nbsp;
                <Typography variant="subtitle1" component={Link} to="#">
                  Terms & Condition.
                </Typography>
              </Typography>
            }
          />
        </Grid>
      </Grid>
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
          >
            Zaregistrovať
          </Button>
        </AnimateButton>
      </Box>
    </form>
  );
});

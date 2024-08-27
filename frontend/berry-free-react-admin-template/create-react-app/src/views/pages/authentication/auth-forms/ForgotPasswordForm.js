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

export const ForgotPasswordForm = React.memo(({ ...others }) => {
  const theme = useTheme();
  const { errors, handleBlur, handleChange, touched, values } = useFormikContext();

  const { mutate, isLoading } = AppQuery.useChangePassword();

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
      
      <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="outlined-adornment-password-register">Nové heslo</InputLabel>
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
            style={{textTransform: 'none'}}
          >
            Zmeniť heslo
          </Button>
        </AnimateButton>
      </Box>
    </form>
  );
});

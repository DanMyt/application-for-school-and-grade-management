// material-ui
import { useTheme } from '@mui/material/styles';
import logo3 from 'assets/images/logo.png';

/**
 * if you want to use image instead of <svg> uncomment following.
 
 
 *
 */
//import logoDark from 'assets/images/logo-dark.svg';
//import logo from 'assets/images/logo.svg';

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  const theme = useTheme();

  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * 
     *
     */
    <div><img src={logo3} alt='logo' width="150"/></div>
   // <img src={logo} alt="Berry" width="100" />
    
  );
};

export default Logo;

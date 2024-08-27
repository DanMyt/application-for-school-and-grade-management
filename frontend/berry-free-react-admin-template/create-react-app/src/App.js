import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import { QueryClientProvider, QueryClient } from 'react-query';
import AuthProvider from 'AuthProvider';

// ==============================|| APP ||============================== //

const queryClient = new QueryClient()

const App = () => {
  const customization = useSelector((state) => state.customization);

  return (
    <StyledEngineProvider injectFirst>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={themes(customization)}>
          <CssBaseline />
          <NavigationScroll>
            <AuthProvider>
            <Routes />
            </AuthProvider>
          </NavigationScroll>
        </ThemeProvider>
      </QueryClientProvider>
    </StyledEngineProvider>
  );
};

export default App;

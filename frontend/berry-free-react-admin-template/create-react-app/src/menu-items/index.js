import dashboard from './dashboard';
import pages from './pages';
import utilities from './utilities';
import studentUtilities from './studentUtilities';
import other from './other';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [dashboard, utilities, other],
  studentItems: [dashboard, studentUtilities, other]
};

export default menuItems;

import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';

const MainLayout = Loadable(lazy(() => import('layout/MainLayout')));
const NewCourse = Loadable(lazy(() => import('views/utilities/NewCourse')));
const Courses = Loadable(lazy(() => import('views/utilities/Courses')));
const Students = Loadable(lazy(() => import('views/utilities/Students')));
const ProtectedRoute = Loadable(lazy(() => import('routes/ProtectedRoute')));
const Grade = Loadable(lazy(() => import('views/utilities/Grade')));
const NewAssigment = Loadable(lazy(() => import('views/utilities/NewAssigment')));
const EmailTemplates = Loadable(lazy(() => import('views/utilities/EmailTemplates')));
const StudentCourses = Loadable(lazy(() => import('views/utilities/StudentCourses')));
const PasswordChange = Loadable(lazy(() => import('views/utilities/PasswordChange')));
const AccountSettings = Loadable(lazy(() => import('views/utilities/AccountSettings')));
const NameChange = Loadable(lazy(() => import('views/utilities/NameChange')));
const MojeUlohy = Loadable(lazy(() => import('views/utilities/MojeUlohy')));
const Ulohy = Loadable(lazy(() => import('views/utilities/Ulohy')));
const CoursesAssigements = Loadable(lazy(() => import('views/utilities/CoursesAssigements')));
const Assigements = Loadable(lazy(() => import('views/utilities/Assigements')));
const UploadAssigment = Loadable(lazy(() => import('views/utilities/UploadAssigement')));
const SubmittedDetail = Loadable(lazy(() => import('views/utilities/SubmittedDetail')));
const FileDetail = Loadable(lazy(() => import('views/utilities/FileDetail')));
const MyEditor = Loadable(lazy(() => import('views/utilities/MyEditor')));
const Cards = Loadable(lazy(() => import('views/utilities/Cards')));
const Nastenka = Loadable(lazy(() => import('views/dashboard/Default/Nastenka')));
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const Pending = Loadable(lazy(() => import('views/utilities/Pending')));



// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <ProtectedRoute><DashboardDefault /></ProtectedRoute>
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <ProtectedRoute><DashboardDefault /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default-prispevky',
          element: <ProtectedRoute><Nastenka /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-cards',
          element: <ProtectedRoute><Cards /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-my-editor',
          element: <ProtectedRoute><MyEditor /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-pending',
          element: <ProtectedRoute><Pending /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-fileDetail',
          element: <ProtectedRoute><FileDetail /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-newcourse',
          element: <ProtectedRoute><NewCourse /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-studentCourses',
          element: <ProtectedRoute><StudentCourses /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-coursesAssigements',
          element: <ProtectedRoute><CoursesAssigements /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-assigement',
          element: <ProtectedRoute><Assigements /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-submittedDetail',
          element: <ProtectedRoute><SubmittedDetail /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-uploadAssigment',
          element: <ProtectedRoute><UploadAssigment /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-grading',
          element: <ProtectedRoute><Grade /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-courses',
          element: <ProtectedRoute><Courses /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-emailTemplates',
          element: <ProtectedRoute><EmailTemplates /></ProtectedRoute>
        }
      ]
    },
    
    {
      path: 'utils',
      children: [
        {
          path: 'util-newassigment',
          element: <ProtectedRoute><NewAssigment /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-students',
          element: <ProtectedRoute><Students /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-password-change',
          element: <ProtectedRoute><PasswordChange /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-name-change',
          element: <ProtectedRoute><NameChange /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-ulohy',
          element: <ProtectedRoute><Ulohy /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-mojeUlohy',
          element: <ProtectedRoute><MojeUlohy /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'utils',
      children: [
        {
          path: 'util-account-settings',
          element: <ProtectedRoute><AccountSettings /></ProtectedRoute>
        }
      ]
    }
   
    
  ]
};

export default MainRoutes;

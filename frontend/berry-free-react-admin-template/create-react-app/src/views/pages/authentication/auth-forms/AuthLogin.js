
import * as Yup from 'yup';
import { Formik } from 'formik';
import { LoginForm } from './LoginForm';

// ============================|| FIREBASE - LOGIN ||============================ //

const FirebaseLogin = ({ ...others }) => {
  return (
    <>
     

      <Formik
        initialValues={{
          email: 'email@tuke.com',
          password: '123456',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
      >
        <LoginForm {...others} />
      </Formik>
    </>
  );
};

export default FirebaseLogin;

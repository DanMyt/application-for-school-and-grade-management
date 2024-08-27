
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

import { RegisterForm } from './RegisterForm';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const FirebaseRegister = ({ ...others }) => {

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
      >
        <RegisterForm { ...others }/>
      </Formik>
    </>
  );
};

export default FirebaseRegister;

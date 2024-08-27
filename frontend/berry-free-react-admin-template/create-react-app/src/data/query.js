import React, { createContext, useContext, useState } from 'react';
import { useMutation } from 'react-query';
import Api from './api';
import { useFormikContext } from 'formik';
import { useNavigate } from 'react-router';
import useScriptRef from 'hooks/useScriptRef';
import {useAuth} from 'AuthProvider';


export const AppQuery = Object.freeze({
 
  useLogin: () => {
    const { setStatus, values, setSubmitting, setErrors } = useFormikContext();
    const navigate = useNavigate();
    const scriptedRef = useScriptRef();
    const { login } = useAuth();

  
    return useMutation(() => Api.login(values.email, values.password), {
      onSuccess: async (response) => {
        if (response.ok) {
          
          const data = await response.json();
          
          const token = data.token;
          const roles = data.roles;
          const info = data.info;
          //const token = response.body.token;
          localStorage.setItem('roles', roles);
          localStorage.setItem('info',JSON.stringify(info));
         
          login(token);
          setStatus({ success: true });
          setSubmitting(false);
          if (roles == 'STUDENT') {
            navigate('/utils/util-studentCourses');
          } else {
            navigate('/dashboard/default');
          }
          
        } else {
          setStatus({ success: false });
          setSubmitting(false);
          setErrors({ submit: 'Incorrect email or password' });
        }

        if (scriptedRef.current) {
          setStatus({ success: true });
          setSubmitting(false);
        }
      },
      onError: (error) => console.log(error)
    });
  },

  useRegister: () => {
    const { setStatus, values, setSubmitting, setErrors } = useFormikContext();
    const navigate = useNavigate();
    const scriptedRef = useScriptRef();

    return useMutation(() => Api.register(values.email, values.password, values.firstName, values.lastName), {
      onSuccess: (response) => {
        if (response.ok) {
          const data = response.json();
          const token = data.token;
          localStorage.setItem('jwtToken', token);
          setStatus({ success: true });
          setSubmitting(false);
          navigate('/pages/login/login3');
        } else {
          setStatus({ success: false });
          setSubmitting(false);
          setErrors({ submit: 'User already exists' });
        }

        if (scriptedRef.current) {
          setStatus({ success: true });
          setSubmitting(false);
        }
      },
      onError: (error) => console.log(error)
    });
  },
  useAddCourse: () => {
    const { setStatus, values, setSubmitting, setErrors } = useFormikContext();
    const navigate = useNavigate();
    const scriptedRef = useScriptRef();

    return useMutation(() => Api.register(values.courseName, values.subject, values.students, values.teachers), {
      onSuccess: (response) => {
        if (response.ok) {
          setStatus({ success: true });
          setSubmitting(false);
          
        } else {
          setStatus({ success: false });
          setSubmitting(false);
          setErrors({ submit: 'Course creation failed'});
        }

        if (scriptedRef.current) {
          setStatus({ success: true });
          setSubmitting(false);
        }
      },
      onError: (error) => console.log(error)
    });
  },

  useResetPassword: () => {
    const { setStatus, values, setSubmitting, setErrors } = useFormikContext();
    const scriptedRef = useScriptRef();

    return useMutation(() => Api.resetPassword(values.email), {
      onSuccess: (response) => {
        if (response.ok) {
          setStatus({ success: true });
          setSubmitting(false);
          
        } else {
          setStatus({ success: false });
          setSubmitting(false);
          setErrors({ submit: 'Course creation failed'});
        }

        if (scriptedRef.current) {
          setStatus({ success: true });
          setSubmitting(false);
        }
      },
      onError: (error) => console.log(error)
    })
  },

  useChangePassword: () => {
    const { setStatus, values, setSubmitting, setErrors } = useFormikContext();
    const scriptedRef = useScriptRef();

    return useMutation(() => Api.changePassword(values.password, values.token), {
      onSuccess: (response) => {
        if (response.ok) {
          setStatus({ success: true, message: 'Password changed successfully!' }); 
          setSubmitting(false);
          
        } else {
          setStatus({ success: false });
          setSubmitting(false);
          setErrors({ submit: 'Chyba'});
        }

        if (scriptedRef.current) {
          setStatus({ success: true });
          setSubmitting(false);
        }
      },
      onError: (error) => console.log(error)
    })
  }
});

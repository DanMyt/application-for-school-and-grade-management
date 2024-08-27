//endpoints
const ENDPOINTS = {
  LOGIN: 'http://localhost:8080/auth/authentication',
  REGISTER: 'http://localhost:8080/auth/register',
  ADDCOURSE: 'http://localhost:8080/api/createCourse',
  RESETPASSWORD: 'http://localhost:8080/auth/resetPassword',
  CHANGEPASSWORD: 'http://localhost:8080/auth/changePassword'
};

export default Object.freeze({
  login: (mail, password) =>
    fetch(ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ mail, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    }),

  register: (mail, password, firstName, lastName) =>
    fetch(ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify({ mail, password, firstName, lastName }),
      headers: {
        'Content-Type': 'application/json'
      }
    }),

  addCourse: (courseName, subject, students, teachers) =>
    fetch(ENDPOINTS.ADDCOURSE, {
      method: 'POST',
      body: JSON.stringify({ courseName, subject, students, teachers }),
      headers: {
        'Content-Type': 'application/json'
      }
    }),

    resetPassword: (mail) =>
      fetch(ENDPOINTS.RESETPASSWORD, {
        method: 'POST',
        body: JSON.stringify({mail}),
        headers: {
          'Content-Type': 'application/json'
        }
      }),

      changePassword: (password, token) =>
        fetch(ENDPOINTS.CHANGEPASSWORD, {
          method: 'POST',
          body: JSON.stringify({password, token}),
          headers: {
            'Content-Type': 'application/json'
          }
        }),
});

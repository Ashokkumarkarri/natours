import axios from 'axios';
import { showAlert } from './alert';

export const signUp = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',

      data: {
        name: name,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm,
      },
      withCredentials: true, // This ensures cookies are sent and received
    });
    if (res.data.status === 'success') {
      showAlert('success', 'SignUp successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
    // console.log(res);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

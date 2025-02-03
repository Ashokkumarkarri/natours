// updateData function
//call that fun from index.js

import axios from 'axios';
import { showAlert } from './alert';

export const updateData = async (name, email) => {
  console.log('what is happininh here');
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://localhost:8000/api/v1/users/updateMe',
      data: {
        name: name,
        email: email,
      },
    });
    console.log('Response from server:', res);
    if (res.data.status === 'success') {
      showAlert('success', 'Data Updated successfully');
    }
  } catch (err) {
    console.error('Error updating data:', err);
    showAlert('error', err.response.data.message);
  }
};

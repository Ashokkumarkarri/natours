// updateData function
//call that fun from index.js

import axios from 'axios';
import { showAlert } from './alert';

//type is either password or data
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://localhost:8000/api/v1/users/updateMyPassword'
        : 'http://localhost:8000/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url: url,
      data: data,
    });
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} Updated successfully`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

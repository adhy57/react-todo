import axios from 'axios';
import authHeader from './auth-header';

const API_URL = "http://127.0.0.1:5000/task/";

class TaskService {
  getAllTask() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  addTask(title, detail) {
    // console.log(authHeader())
    return axios.post(API_URL, {
      title,
      detail
    }, { headers: authHeader() });
  }

  deleteTask(id) {
    // console.log(authHeader())
    return axios.delete(API_URL, {
      headers: authHeader(),
      data: id
    });


  }

  updateTask(id, data) {
    // console.log(authHeader())
    return axios.put(API_URL + id + "/", data,{
      headers: authHeader(),
    });
  }

}

export default new TaskService();
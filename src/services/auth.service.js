import axios from "axios";

const API_URL = "http://127.0.0.1:5000/";

class AuthService {
  login(email, password) {
    return axios
      .post(API_URL + "auth/login", {
        email,
        password
      })
      .then(response => {
        console.log(response)
        if (response.data.Authorization) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username, email, password) {
    return axios.post(API_URL+ "user/", {
      username,
      email,
      password
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
}

export default new AuthService();
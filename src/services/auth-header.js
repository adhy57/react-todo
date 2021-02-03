export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.Authorization) {
    return {
      // 'Access-Control-Allow-Origin': '*',
      // 'Content-Type': 'application/json',
      Authorization: 'Bearer ' + user.Authorization
    };
  } else {
    return {};
  }
}
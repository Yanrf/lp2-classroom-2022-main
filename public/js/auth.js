function isAuthenticated() {
  if (!getToken()) {
    window.location.href = '/signin.html';
  } else {
    return true;
  }
}

function getToken() {
  return localStorage.getItem('@gymApp:token');
}

function signin(token) {
  localStorage.setItem('@gymApp:token', token);

  window.location.href = '/gyms.html';
}

function signout() {
  localStorage.removeItem('@gymApp:token');

  window.location.href = '/signin.html';
}

export default { isAuthenticated, getToken, signin, signout };

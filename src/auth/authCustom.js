import axios from "../axios-config";

/**
 * This app currently offers two ways of authentification: custom and keyloak. The custom login uses
 * the backend for log-in. The keyloak service an external Keyloak server not managed by us.
 *
 * This service has functions which KeycloakAuthService has as well. This functions should be usable
 * interchangeable depending on which auth-mechanism is used. All the functions of the
 * KeycloakAuthService have to async. I read that it is possible to await a non async function, that
 * way it's result is automatically wrapped into a promise. That's why not all functionse are not
 * async as well.
 */
class CustomAuthService {

  constructor() {
    this._loggedIn = false;
    this._loggedInListeners = [];
    this.token = null;
    this.username = null;
    this.expiredTime = 0;
  }

  set loggedIn(value) {
    this._loggedIn = value
    this._loggedInListeners.forEach(fn => fn(value))
  }

  addLoggedInListener(fn) {
    this._loggedInListeners.push(fn)
  }

  isUserLoggedIn() {
    return this._loggedIn
  }

  async loginCustom(username, password) {
    // Try to login
    const formData = new FormData();
    formData.append("username", username)
    formData.append("password", password)

    return axios
      .post("/login", formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((response) => {
        // Save the information
        this.token = response.data.accessToken,
        this.expiredTime = response.data.expiredTime,
        this.username = username,
        this._loggedIn = true;
      });
  }

  logoutCustom() {
    this.token = null;
    this.username = null;
    this.expiredTime = 0;
    this._loggedIn = false;
  }

  getAccessToken() {
    if (!this.token || Date.now() >= this.expiredTime) {
      return null
    } else {
      return this.token
    }
  }

  getUsername() {
    return this.username;
  }

  isKeycloak() {
    return false;
  }
}
export const customAuthService = new CustomAuthService()

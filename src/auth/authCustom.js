import axios from "../axios-config";

/**
 * TODO: Describe what this class does and why the methods return Promises alltough they don't have
 * to
 * TODO: check if making Functions async is really necesarry
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
      .post("/login", formData)
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

  /**
   * This has to be async to use it interchangeable with authKeycloak where it has to be async
   */
  // TODO: Ich bin nicht sicher ob das funktioniert: Ich habe gelesen man kann auch ein nicht
  //   Promise awaiten, dann wird in ein Promise gewrappt, also das gleiche wie hier
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

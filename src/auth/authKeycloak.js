import { UserManager, WebStorageStateStore } from 'oidc-client'

const settings = {
  authority: import.meta.env.VITE_KEYCLOAK_AUTHORITY,
  client_id: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_KEYCLOAK_REDIRECT_URI,
  post_logout_redirect_uri: import.meta.env.VITE_KEYCLOAK_LOGOUT_REDIRECT_URI,
  response_type: 'code',
  scope: 'openid profile email offline_access',
  automaticSilentRenew: true,
}

settings.userStore = new WebStorageStateStore({ store: window.sessionStorage })
const userManager = new UserManager(settings)

/**
 * Class to encapsulate all authentication related logic.
 */
class KeycloakAuthService {

  constructor() {
    this._loggedIn = false;
    this._loggedInListeners = new Map();
    this.listenerKeyGenerator = 0
  }

  set loggedIn(value) {
    this._loggedIn = value
    this._loggedInListeners.forEach(fn => fn(value))
  }

  addLoggedInListener(fn) {
    this._loggedInListeners.set(++this.listenerKeyGenerator, fn)
    return this.listenerKeyGenerator
  }

  removeLoggedInListener(key) {
    this._loggedInListeners.delete(key)
  }

  /**
   * Checks whether or not a user is currently logged in.
   *
   * Returns a promise which will be resolved to true/false or be rejected with an error.
   */
  async isUserLoggedIn () {
    try {
      let user = await userManager.getUser();
      this.loggedIn = (user !== null)
    } catch (error) {
      this.loggedIn = false
    }
    return this._loggedIn
  }

  /**
   * Initate the login process.
   */
  loginKeycloak () {
    userManager.signinRedirect()
  }

  logoutKeycloak () {
    userManager.signoutRedirect()
  }

  /**
   * Handles the redirect from the OAuth server after a user logged in.
   */
  handleLoginRedirect () {
    // Returns a promise
    try {
      return userManager.signinRedirectCallback()
    } catch (error) {
      throw error
    }
  }

  /**
   * Handles the redirect from the OAuth server after a user logged out.
   */
  handleLogoutRedirect () {
    return userManager.signoutRedirectCallback()
  }

  /**
   * Get the access token.
   *
   * Can be used to make requests to the backend.
   */
  async getAccessToken () {
    return new Promise((resolve, reject) => {
      userManager.getUser()
        .then(user => {
          if (user != null) {
            resolve(user.access_token)
          } else {
            reject("User not logged in. Cannot read Access Token")
          }
        })
        .catch(error => {
          reject(error);
        })
    })
  }

  /**
   * Get the profile data for the currently authenticated user.
   *
   * Returns an empty object if no user is logged in.
   */
  async getProfile () {
    return new Promise((resolve, reject) => {
      userManager.getUser()
        .then(user => {
          if (user === null) {
            resolve(null)
          } else {
            resolve(user.profile)
          }
        })
        .catch(error => reject(error))
    })
  }

  isKeycloak() {
    return true;
  }

  async getUsername() {
    let profile = await this.getProfile();
    if (profile) {
      return profile["sub"];
    }
    //return this.username;
    return null;
  }

}

/**
 * Create and expose an instance of the auth service.
 */
export const keycloakAuthService = new KeycloakAuthService()

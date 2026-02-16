import axios from "../axios-config";
import { useTokenStore } from '@/stores/token';
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
    this.listenerKeyGenerator = 0
    this.expiredTime = 0;
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
        const tokenStore = useTokenStore()
        tokenStore.setToken(response.data.accessToken)
        tokenStore.setUsername(username)
      });
  }

  logoutCustom() {
    const tokenStore = useTokenStore()
    tokenStore.clearToken()
    tokenStore.clearUsername()
  }

  isKeycloak() {
    return false;
  }

  init() {
    //pass
  }

}
export const customAuthService = new CustomAuthService()

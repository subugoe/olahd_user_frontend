import { keycloakAuthService } from "./authKeycloak";
import { customAuthService } from "./authCustom";
import axios from "../axios-config";

export let authService;

if (import.meta.env.VITE_USE_KEYCLOAK && import.meta.env.VITE_USE_KEYCLOAK.toUpperCase() == "TRUE") {
  authService = keycloakAuthService;
} else {
  authService = customAuthService;
}

function setBearerInterceptor () {
  // Add the bearer token to all outgoing requests if available
  axios.interceptors.request.use(async (config) => {
    let accessToken;
    try {
      accessToken = await authService.getAccessToken()
      if (accessToken != null) {
        config.headers['Authorization'] = 'Bearer ' + accessToken
      }
    } catch (e) {
      // pass: if AccessToken cannot be received do not use bearer header
    }
    return config
  })
}
setBearerInterceptor();

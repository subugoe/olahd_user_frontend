import Keycloak from 'keycloak-js'
import { useTokenStore } from '@/stores/token'

const settings = {
  // TODO: Re-work variables: Some old ones are not used any more, some are missing like "realm" or
  // "host" which are derived from the pre-existing variables but should become new variables
  authority: import.meta.env.VITE_KEYCLOAK_AUTHORITY,
  client_id: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
}

const keycloak = new Keycloak({
  url: new URL(settings.authority).origin,
  clientId: settings.client_id,
  realm: new URL(settings.authority).pathname.split('/').filter(Boolean).pop(),
})

keycloak.onTokenExpired = async () => {
  const tokenStore = useTokenStore()
  try {
    let refreshed = await keycloak.updateToken(30);
    if (refreshed) {
      tokenStore.setToken(keycloak.token)
    }
  } catch (err) {
    console.error("Token refresh failed", err)
    tokenStore.clearToken()
  }
}


/**
 * Class to encapsulate all authentication related logic.
 */
class KeycloakAuthService {

  isKeycloak() {
    return true;
  }

  init() {
    const tokenStore = useTokenStore()
    const authenticated = keycloak.init({
      onLoad: "check-sso",
    }).then(authenticated => {
      if (authenticated) {
        const token = keycloak.token
        tokenStore.setToken(keycloak.token)
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const userId = tokenPayload.sub;
        tokenStore.setUsername(userId);
      } else {
        tokenStore.clearToken()
      }
    }).catch(err => {
      console.error(`Keycloak init failed: ${err}`)
      tokenStore.clearToken()
    })
  }

  async loginKeycloak(event) {
    await keycloak.login({
      redirectUri: window.location.origin + '/dashview/dashboard',
    })
  }
  logoutKeycloak(event) {
    keycloak.logout({
      redirectUri: window.location.origin + '/',
    })
  }
}

/**
 * Create and expose an instance of the auth service.
 */
export const keycloakAuthService = new KeycloakAuthService()

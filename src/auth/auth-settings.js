export const settings = {
  // URL to the authentication server (including realm)
  authority: 'http://localhost:6701/realms/heroes',
  // The name of the client in Keycloak setup for this service
  client_id: 'spa-heroes',
  // Where to redirect the user to after successful authentication
  redirect_uri: 'http://localhost:4300/login',
  // Where to redirect the user to after logging the user out
  post_logout_redirect_uri: 'http://localhost:4300/logout',
  // Indicate the the authorization code flow should be used
  response_type: 'code',
  // "openid" tells the server that this client uses oidc for authentication
  scope: 'openid profile email offline_access heroes',
  // Enable automatic (silent) renewal of the access token
  automaticSilentRenew: true
}

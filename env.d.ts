/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_USE_KEYCLOAK?: string;
  readonly VITE_KEYCLOAK_AUTHORITY?: string;
  readonly VITE_KEYCLOAK_CLIENT_ID?: string;
  readonly VITE_KEYCLOAK_REDIRECT_URI?: string;
  readonly VITE_KEYCLOAK_LOGOUT_REDIRECT_URI?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

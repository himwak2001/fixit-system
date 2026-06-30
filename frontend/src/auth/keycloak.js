import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL || "http://localhost:8180",
  realm: import.meta.env.VITE_KEYCLOAK_REALM || "fixit-realm",
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || "fixit-frontend",
});

export default keycloak;

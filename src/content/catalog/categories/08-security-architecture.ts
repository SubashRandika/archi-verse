import type { CategoryDefinition } from "../types";

export const securityArchitecture: CategoryDefinition = {
  id: "security-architecture",
  title: "Security Architecture",
  description:
    "Protecting users and systems: identity, access control, browser security mechanisms and the common attacks they defend against.",
  icon: "security",
  order: 8,
  concepts: [
    {
      id: "authentication-and-authorization",
      title: "Authentication and Authorization",
      keywords: ["authn", "authz", "auth"],
    },
    {
      id: "oauth-2",
      title: "OAuth 2.0",
      keywords: ["OAuth", "authorization code", "PKCE"],
    },
    {
      id: "openid-connect",
      title: "OpenID Connect (OIDC)",
      keywords: ["OIDC", "ID token"],
    },
    {
      id: "jwt",
      title: "JWT",
      keywords: ["JSON Web Token", "claims"],
    },
    {
      id: "access-tokens-and-refresh-tokens",
      title: "Access Tokens and Refresh Tokens",
    },
    {
      id: "session-and-cookie-authentication",
      title: "Session and Cookie Authentication",
      keywords: ["session id"],
    },
    {
      id: "secure-httponly-and-samesite-cookies",
      title: "Secure, HttpOnly and SameSite Cookies",
    },
    {
      id: "role-based-access-control",
      title: "Role-Based Access Control (RBAC)",
      keywords: ["RBAC", "permissions"],
    },
    {
      id: "attribute-based-access-control",
      title: "Attribute-Based Access Control (ABAC)",
      keywords: ["ABAC", "policies"],
    },
    {
      id: "single-sign-on",
      title: "Single Sign-On (SSO)",
      keywords: ["SSO", "SAML", "identity provider"],
    },
    {
      id: "multi-factor-authentication",
      title: "Multi-Factor Authentication (MFA)",
      keywords: ["MFA", "2FA", "passkeys", "TOTP"],
    },
    {
      id: "cross-site-scripting",
      title: "Cross-Site Scripting (XSS)",
      keywords: ["XSS", "injection"],
    },
    {
      id: "cross-site-request-forgery",
      title: "Cross-Site Request Forgery (CSRF)",
      keywords: ["CSRF", "XSRF"],
    },
    {
      id: "content-security-policy",
      title: "Content Security Policy (CSP)",
      keywords: ["CSP", "nonce"],
    },
    {
      id: "cross-origin-resource-sharing",
      title: "Cross-Origin Resource Sharing (CORS)",
      keywords: ["CORS", "preflight", "same-origin policy"],
    },
    {
      id: "clickjacking",
      title: "Clickjacking",
      keywords: ["X-Frame-Options", "frame-ancestors"],
    },
    {
      id: "secure-api-communication",
      title: "Secure API Communication",
      keywords: ["HTTPS", "TLS"],
    },
    {
      id: "software-supply-chain-security",
      title: "Software Supply Chain Security",
      keywords: ["SBOM", "npm audit", "dependencies"],
    },
  ],
};

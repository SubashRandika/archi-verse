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
      summary:
        "Authentication proves who someone is; authorization decides what they are allowed to do.",
      keywords: ["authn", "authz", "auth"],
    },
    {
      id: "oauth-2",
      title: "OAuth 2.0",
      summary:
        "A framework for granting an application limited access to a user's resources without sharing their password.",
      keywords: ["OAuth", "authorization code", "PKCE"],
    },
    {
      id: "openid-connect",
      title: "OpenID Connect (OIDC)",
      summary:
        "An identity layer on top of OAuth 2.0 that adds sign-in and a standard ID token describing the user.",
      keywords: ["OIDC", "ID token"],
    },
    {
      id: "jwt",
      title: "JWT",
      summary:
        "A JSON Web Token: a compact, signed token carrying claims that a service can verify without a database lookup.",
      keywords: ["JSON Web Token", "claims"],
    },
    {
      id: "access-tokens-and-refresh-tokens",
      title: "Access Tokens and Refresh Tokens",
      summary:
        "Short-lived access tokens authorise requests; longer-lived refresh tokens get new access tokens without signing in again.",
    },
    {
      id: "session-and-cookie-authentication",
      title: "Session and Cookie Authentication",
      summary:
        "The server keeps a session, and the browser sends a cookie that identifies it with every request.",
      keywords: ["session id"],
    },
    {
      id: "secure-httponly-and-samesite-cookies",
      title: "Secure, HttpOnly and SameSite Cookies",
      summary:
        "Cookie attributes that restrict a cookie to HTTPS, hide it from JavaScript and limit when it is sent cross-site.",
    },
    {
      id: "role-based-access-control",
      title: "Role-Based Access Control (RBAC)",
      summary:
        "Granting permissions to roles, such as admin or editor, and assigning roles to users.",
      keywords: ["RBAC", "permissions"],
    },
    {
      id: "attribute-based-access-control",
      title: "Attribute-Based Access Control (ABAC)",
      summary:
        "Deciding access with policies over attributes of the user, the resource and the context, such as department or time of day.",
      keywords: ["ABAC", "policies"],
    },
    {
      id: "single-sign-on",
      title: "Single Sign-On (SSO)",
      summary: "Signing in once with an identity provider to access many applications.",
      keywords: ["SSO", "SAML", "identity provider"],
    },
    {
      id: "multi-factor-authentication",
      title: "Multi-Factor Authentication (MFA)",
      summary:
        "Requiring two or more independent proofs of identity, such as a password plus a passkey or one-time code.",
      keywords: ["MFA", "2FA", "passkeys", "TOTP"],
    },
    {
      id: "cross-site-scripting",
      title: "Cross-Site Scripting (XSS)",
      summary:
        "An attack that injects malicious script into a page other users view, usually through input that was not escaped.",
      keywords: ["XSS", "injection"],
    },
    {
      id: "cross-site-request-forgery",
      title: "Cross-Site Request Forgery (CSRF)",
      summary:
        "An attack that tricks a signed-in user's browser into sending an unwanted request to a site that trusts it.",
      keywords: ["CSRF", "XSRF"],
    },
    {
      id: "content-security-policy",
      title: "Content Security Policy (CSP)",
      summary:
        "A response header that tells the browser which sources of scripts, styles and other content are allowed.",
      keywords: ["CSP", "nonce"],
    },
    {
      id: "cross-origin-resource-sharing",
      title: "Cross-Origin Resource Sharing (CORS)",
      summary:
        "How a server allows pages from other origins to read its responses, including preflight requests.",
      keywords: ["CORS", "preflight", "same-origin policy"],
    },
    {
      id: "clickjacking",
      title: "Clickjacking",
      summary:
        "Tricking users into clicking something hidden in an invisible frame, prevented with frame-ancestors or X-Frame-Options.",
      keywords: ["X-Frame-Options", "frame-ancestors"],
    },
    {
      id: "secure-api-communication",
      title: "Secure API Communication",
      summary:
        "Protecting data between client and API with TLS, careful token handling, input validation and least privilege.",
      keywords: ["HTTPS", "TLS"],
    },
    {
      id: "software-supply-chain-security",
      title: "Software Supply Chain Security",
      summary:
        "Guarding against compromised dependencies, build tools and pipelines with lockfiles, audits, signing and provenance.",
      keywords: ["SBOM", "npm audit", "dependencies"],
    },
  ],
};

/**
 * mockJwt.js
 */

function base64url(obj) {
  return btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64url(str) {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(padded));
}

const FAKE_SECRET = 'cinefokus-mock-signature';

export function signToken(payload, expiresInMs = 1000 * 60 * 60 * 24) {
  const header = { alg: 'mock256', typ: 'JWT' };
  const fullPayload = { ...payload, iat: Date.now(), exp: Date.now() + expiresInMs };
  const headerPart = base64url(header);
  const payloadPart = base64url(fullPayload);
  const signaturePart = btoa(`${headerPart}.${payloadPart}.${FAKE_SECRET}`).slice(0, 24);
  return `${headerPart}.${payloadPart}.${signaturePart}`;
}

export function decodeToken(token) {
  try {
    const [headerPart, payloadPart] = token.split('.');
    if (!headerPart || !payloadPart) return null;
    return fromBase64url(payloadPart);
  } catch {
    return null;
  }
}

export function isTokenValid(token) {
  const payload = decodeToken(token);
  if (!payload?.exp) return false;
  return Date.now() < payload.exp;
}

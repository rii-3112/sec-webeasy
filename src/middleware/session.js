const { randomUUID } = require('crypto');

const COOKIE_NAME = 'workshop_session';

function parseCookie(header, name) {
  if (!header) return null;
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function sessionMiddleware(req, res, next) {
  let sessionId = parseCookie(req.headers.cookie, COOKIE_NAME);

  if (!sessionId) {
    sessionId = randomUUID();
    res.append(
      'Set-Cookie',
      `${COOKIE_NAME}=${sessionId}; Path=/; SameSite=Lax; HttpOnly`
    );
  }

  req.sessionId = sessionId;
  next();
}

module.exports = { sessionMiddleware, COOKIE_NAME };

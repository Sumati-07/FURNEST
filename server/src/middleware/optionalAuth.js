const jwt = require("jsonwebtoken");

// Like `protect`, but never blocks the request — just attaches req.userId
// when a valid token happens to be present. Used on public routes (like the
// feed) that behave slightly differently for logged-in users (e.g. likedByMe).
function optionalAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        try {
            const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
            req.userId = decoded.userId;
        } catch (error) {
            // Ignore invalid tokens on optional routes — just proceed unauthenticated.
        }
    }
    next();
}

module.exports = { optionalAuth };

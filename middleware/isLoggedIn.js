import obtainTokenFromHeaders from "../util/obtainTokenFromHeader.js";
import verifyToken from "../util/verifyToken.js";

export const isLoggedIn = (req, res, next) => {
  //obtain token from header
  const token = obtainTokenFromHeaders(req);
  const decodedUser = verifyToken(token);
  if (!decodedUser) {
    throw new Error("Invalid or expired token, pleasE login again");
  } else {
    req.userAuth = decodedUser?.id;
  }

  next();
};
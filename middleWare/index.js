import jwt from "jsonwebtoken"
export const authentication = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (authHeader !== undefined) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "MY_SECRET_TOKEN", async (error, user) => {
      if (error) {
        res.send("invalid access token");
      } else {
        next();
      }
    });
  } else {
    return res.send("token not present");
  }
};

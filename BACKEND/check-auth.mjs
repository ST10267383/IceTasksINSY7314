import jwt from "jsonwebtoken";

const checkauth = (req, res, next) => {
  try {
    // Expect header like:  Authorization: Bearer <token>
    const auth = req.headers.authorization || "";
    const [, token] = auth.split(" ");

    if (!token) {
      return res.status(401).json({ message: "Missing token" });
    }

    // Uses the same secret you’ll set in .env (JWT_SECRET)
    jwt.verify(token, process.env.JWT_SECRET || "this_secret_should_be_longer_than_it_is");
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid" });
  }
};

export default checkauth;
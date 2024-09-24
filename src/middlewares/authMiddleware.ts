import passport from "passport";
import { Request, Response, NextFunction } from "express";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptionsWithoutRequest,
} from "passport-jwt";
import { getUserById } from "../services/users";
import { User } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set");
}

const opts: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

export const jwtStrategy = new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await getUserById(jwt_payload.id);
    if (user) return done(null, user);
    else return done(null, false);
  } catch (err) {
    return done(err, false);
  }
});

export const isAuth = passport.authenticate("jwt", { session: false });

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User;

  if (
    req.isAuthenticated() &&
    (user.role === "ADMIN" || user.role === "OWNER")
  ) {
    return next();
  } else {
    return res.status(403).json({ message: "Forbidden, Admins only" });
  }
};

export const isOwner = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User;

  if (req.isAuthenticated() && user.role === "OWNER") {
    return next();
  } else {
    return res.status(403).json({ message: "Forbidden, Owner only" });
  }
};

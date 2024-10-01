import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Profile as GoogleProfile } from "passport-google-oauth20";
import { Profile as GitHubProfile } from "passport-github2";

const router = express.Router();
const prisma = new PrismaClient();
const clientURL = process.env.CLIENT_URL || "http://localhost:3000";

type User = {
  id: number;
  email: string;
  password?: string;
};

if (
  !process.env.GOOGLE_CLIENT_ID ||
  !process.env.GOOGLE_CLIENT_SECRET ||
  !process.env.GITHUB_CLIENT_ID ||
  !process.env.GITHUB_CLIENT_SECRET
) {
  console.error("Client IDs and Secrets must be set in .env file.");
}

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (user) {
      done(null, user);
    } else {
      done(new Error('User not found'), null);
    }
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken: string, refreshToken: string, profile: GoogleProfile, done: (err: any, user?: any) => void) => {
      console.log("Google Profile:", profile);
      console.log("Access Token:", accessToken);
      console.log("Refresh Token:", refreshToken);
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error("No email found"), false);
      }

      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            password: "",
          },
        });
      }
      done(null, user);
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: "/api/auth/github/callback",
    },
    async (accessToken: string, refreshToken: string, profile: GitHubProfile, done: (err: any, user?: any) => void) => {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error("No email found"), false);
      }

      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            password: "",
          },
        });
      }
      done(null, user);
    }
  )
);

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      req.login(user, (err) => {
        if (err) {
          console.error("Error logging in:", err);
          return res.status(500).json({ message: "Internal server error" });
        }

        console.log("User logged in successfully:", user);
        return res.status(200).json({ id: user.id, email: user.email });
      });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


router.post("/logout", (req: Request, res: Response) => {
  req.logout((err: Error | null) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }

    req.session.destroy((err: Error | null) => {
      if (err) {
        return res.status(500).json({ message: "Error destroying session" });
      }

      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});



router.get("/session", (req: Request, res: Response) => {
  if (req.isAuthenticated() && req.user) {
    const user = req.user as User;
    res.status(200).json({ email: user.email });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

router.post("/register", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ id: newUser.id, email: newUser.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
  console.log("User logged in:", req.user);
  res.redirect(clientURL);
});

router.get("/github/callback", passport.authenticate("github", { failureRedirect: "/login" }), (req, res) => {
  res.redirect(clientURL);
});

export default router;

"use client";
import { useState } from "react";
import axios from "axios";
import styles from "./signin.module.css";
import Image from "next/image";
import Swal from "sweetalert2";
import { showLoadingAlert } from "../../../utils/sweetAlertUtils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
console.log("API_BASE_URL:", API_BASE_URL);

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      showLoadingAlert("Signing in");
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        window.location.href = "/";
      }
    } catch (error) {
      setError("Invalid email or password");
      console.error("Login error:", error);
    } finally {
      Swal.close();
    }
  };

  const handleOAuthSignIn = (provider: string) => {
    const redirectUri = `${API_BASE_URL}/api/auth/${provider}`;
    window.location.href = redirectUri;
  };

  return (
    <div className={styles.signInBackground}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className={`${styles.cardCustom} card`}>
              <div className="card-body">
                <h3 className="card-title text-center mb-4">Sign In</h3>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Sign In
                  </button>
                </form>

                <div className="my-4"></div>
                <div className="my-3"></div>

                <div className="d-flex align-items-center justify-content-center mb-4">
                  <hr className="col" />
                  <span className="px-2">OR</span>
                  <hr className="col" />
                </div>

                <div className="text-center mb-3">
                  <button
                    className="btn btn-outline-secondary w-100 mb-2"
                    style={{ borderRadius: "50px", border: "1px solid #ddd" }}
                    onClick={() => handleOAuthSignIn("google")}
                  >
                    <span className="me-2">
                      <Image src="/google.svg" alt="Google logo" width={20} height={20} />
                    </span>
                    Sign in with Google
                  </button>
                  <button
                    className="btn btn-outline-dark w-100"
                    style={{ borderRadius: "50px", border: "1px solid #ddd" }}
                    onClick={() => handleOAuthSignIn("github")}
                  >
                    <span className="me-2">
                      <Image src="/github.svg" alt="Github logo" width={20} height={20} />
                    </span>
                    Sign in with GitHub
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

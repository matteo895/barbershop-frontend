// ResetPassword.js

import React, { useState } from "react";
import { Redirect } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setRedirectToLogin(true);
      } else {
        console.error("Reset password request failed");
      }
    } catch (error) {
      console.error("Reset password request failed", error);
    }
  };

  if (redirectToLogin) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Reset Password</div>
            <div className="card-body">
              <form onSubmit={handleResetPassword}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email:
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Send Password Reset Link
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

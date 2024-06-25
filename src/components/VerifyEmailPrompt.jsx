// VerifyEmailPrompt.js

import React from "react";
import { Redirect } from "react-router-dom";

const VerifyEmailPrompt = ({ user }) => {
  if (user && user.email_verified_at) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div>
      <h2>Email Verification Required</h2>
      <p>Please verify your email to continue.</p>
    </div>
  );
};

export default VerifyEmailPrompt;

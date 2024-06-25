// UserProfile.js

import React, { useState, useEffect } from "react";

const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/UserProfile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Handle error response
          console.error("Failed to fetch user profile");
        }
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async (updatedProfile) => {
    try {
      const response = await fetch("/UserProfile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfile),
      });
      if (response.ok) {
        console.log("Profile updated successfully");
        // Optionally update local state or perform other actions on success
      } else {
        // Handle error response
        console.error("Failed to update user profile");
      }
    } catch (error) {
      console.error("Failed to update user profile", error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <button onClick={() => handleUpdateProfile({ name: "Updated Name" })}>
        Update Profile
      </button>
    </div>
  );
};

export default UserProfile;

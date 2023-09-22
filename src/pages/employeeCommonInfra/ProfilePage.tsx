import React, { useState, } from "react";
import Employee from "src/models/Employee";
import { useAuthContext } from "src/hooks/useAuthContext";
import Profile from "../../components/EmployeeCommonInfra/Profile";

function ProfilePage() {
  return (
    <div className="p-10">
        <Profile />
    </div>
  );
}

export default ProfilePage;
export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const ROLES = {
  ADMIN: "admin",
  STAFF: "staff",
  STUDENT: "student",
};

export const canWrite = (role) => role === ROLES.ADMIN || role === ROLES.STAFF;
export const isAdmin = (role) => role === ROLES.ADMIN;

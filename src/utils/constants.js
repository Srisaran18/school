// Local development — uncomment for local work
// export const API_BASE_URL = "http://localhost:5000/api";

// Production — uncomment before pushing to git
export const API_BASE_URL = "https://backend-api-nine-xi.vercel.app/api";

export const ROLES = {
  ADMIN: "admin",
  STAFF: "staff",
  STUDENT: "student",
};

export const canWrite = (role) => role === ROLES.ADMIN || role === ROLES.STAFF;
export const isAdmin = (role) => role === ROLES.ADMIN;

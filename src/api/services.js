import api from "./api";

export const login = (email, password) => api.post("/auth/login", { email, password });

export const getMe = () => api.get("/auth/me");

export const getDashboard = () => api.get("/dashboard");

export const getStaff = () => api.get("/staff");
export const createStaff = (data) => api.post("/staff", data);
export const updateStaff = (id, data) => api.put(`/staff/${id}`, data);
export const deleteStaff = (id) => api.delete(`/staff/${id}`);

export const getStudents = (params = "") => api.get(`/students${params}`);
export const createStudent = (data) => api.post("/students", data);
export const updateStudent = (id, data) => api.put(`/students/${id}`, data);
export const deleteStudent = (id) => api.delete(`/students/${id}`);

export const getHomeworks = (params = "") => api.get(`/homeworks${params}`);
export const createHomework = (data) => api.post("/homeworks", data);
export const updateHomework = (id, data) => api.put(`/homeworks/${id}`, data);
export const deleteHomework = (id) => api.delete(`/homeworks/${id}`);

export const getAttendance = (params = "") => api.get(`/attendance${params}`);
export const markAttendance = (data) => api.post("/attendance", data);
export const updateAttendance = (id, data) => api.put(`/attendance/${id}`, data);
export const deleteAttendance = (id) => api.delete(`/attendance/${id}`);

export const getMarks = (params = "") => api.get(`/marks${params}`);
export const createMark = (data) => api.post("/marks", data);
export const updateMark = (id, data) => api.put(`/marks/${id}`, data);
export const deleteMark = (id) => api.delete(`/marks/${id}`);

export const getCirculars = () => api.get("/circulars");
export const createCircular = (data) => api.post("/circulars", data);
export const updateCircular = (id, data) => api.put(`/circulars/${id}`, data);
export const deleteCircular = (id) => api.delete(`/circulars/${id}`);

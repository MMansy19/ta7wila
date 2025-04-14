 import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });


// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem(process.env.NEXT_PUBLIC_TOKEN_NAME || "token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;


export const updateSubdomain = async (apiUrl: string, id: string, subdomain: string) => {
  return axios.post(`${apiUrl}/applications/update-subdomain`, { id, subdomain });
};

export const updateSettings = async (apiUrl: string, data: Record<string, any>) => {
  return axios.post(`${apiUrl}/applications/update`, data);
};




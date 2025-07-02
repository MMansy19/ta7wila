let token = "";
import {  getCookie } from 'cookies-next';

if (typeof window !== "undefined") {
  token = getCookie("token") || "";
}

export default function getAuthHeaders() {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}



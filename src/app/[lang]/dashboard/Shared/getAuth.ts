import { getToken } from '@/lib/auth';

export default function getAuthHeaders() {
  const token = getToken();
  
  if (!token) {
    console.warn('No authentication token found');
  }
  
  return {
    Authorization: `Bearer ${token || ''}`,
    "Content-Type": "application/json",
  };
}



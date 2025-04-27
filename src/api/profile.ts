import axios from 'axios';
import { getCookie } from 'cookies-next';
import toast from 'react-hot-toast';
import getAuthHeaders from '../app/[lang]/dashboard/Shared/getAuth';

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface User {
  username: string;
  name: string;
  email: string;
  image?: string;
  user_type:string;
}

// Get user profile
export const getUserProfile = async (): Promise<User | null> => {
  try {
    const response = await axios.get(`${apiUrl}/profile`, {
      headers: getAuthHeaders(), 
    });
    return response.data.result;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    toast.error('Failed to fetch user profile.');
    return null;
  }
};

// Check developer mode
let developerModeCache: boolean | null = null;

export const checkDeveloperMode = async (): Promise<boolean> => {

  if (developerModeCache !== null) {
    return developerModeCache;
  }

  const token =  getCookie("token") || ""
  if (!token) {
    toast.error('Authentication token is missing. Please log in.');
    return false;
  }

  try {
    const response = await axios.post(
      `${apiUrl}/profile/isDeveloper`,
      {},
      { headers: getAuthHeaders() }
    );

    if (response.status === 200) {
      developerModeCache = true; 
      toast.success('Developer Mode activated successfully!');
      getAuthHeaders()
      return true;
    } else {
      toast.error(`Failed to save settings: ${response.data.errorMessage || 'An unexpected error occurred.'}`);
      developerModeCache = false; 
      return false;
    }
  } catch (error: any) {
    toast.error('A network or server error occurred. Please try again.');
    developerModeCache = false;
    return false;
  }
};

// Check WiFi status
export const checkWiFiStatus = async (): Promise<boolean> => {
  try {
    const response = await axios.post(`${apiUrl}/transactions/is-enabled`, {}, {
      headers: getAuthHeaders(),  
    });
    return response.data.result;
  } catch (error) {
    console.error('Error checking WiFi status:', error);
    return false;
  }
};



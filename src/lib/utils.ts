import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateTime(dateString: string | null | undefined): {
  date: string;
  time: string;
} {
  if (!dateString) {
    return {
      date: 'غير متاح',
      time: '--:--'
    };
  }

  try {
    const date = new Date(dateString);
    
    // التحقق من صحة التاريخ
    if (isNaN(date.getTime())) {
      return {
        date: 'تاريخ غير صحيح',
        time: '--:--'
      };
    }

    return {
      date: date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }),
      time: date.toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  } catch (error) {
    return {
      date: 'خطأ في التاريخ',
      time: '--:--'
    };
  }
}

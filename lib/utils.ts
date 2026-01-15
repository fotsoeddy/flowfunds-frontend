import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCarrierFromNumber(number: string): 'momo' | 'om' | null {
  // Remove spaces and non-digit chars (except +)
  const cleanNum = number.replace(/[^0-9+]/g, '');
  
  // check for cameroon cameroon code +237 or 237
  let localNum = cleanNum;
  if (localNum.startsWith('+237')) localNum = localNum.slice(4);
  else if (localNum.startsWith('237')) localNum = localNum.slice(3);

  if (localNum.length !== 9) return null; // Cameroon numbers are 9 digits
  
  const prefix = parseInt(localNum.substring(0, 2));
  const prefix3 = parseInt(localNum.substring(0, 3));

  // Orange: 690-699, 655-659
  if ((prefix >= 69 && prefix <= 69) || (prefix3 >= 655 && prefix3 <= 659)) {
    return 'om';
  }

  // MTN: 670-679, 650-654, 680-689
  if ((prefix >= 67 && prefix <= 67) || (prefix3 >= 650 && prefix3 <= 654) || (prefix >= 68 && prefix <= 68)) {
    return 'momo';
  }

  return null;
}

/**
 * ฟังก์ชันสำหรับจัดการวันที่
 */

/**
 * จัดรูปแบบวันที่ให้แสดงเฉพาะวันที่โดยไม่มีเวลา
 * @param dateString - วันที่ในรูปแบบ string (เช่น "2024-01-15T17:00:00.000Z")
 * @param locale - ภาษา (default: 'en-US')
 * @returns วันที่ในรูปแบบที่อ่านง่าย (เช่น "15/01/2567")
 */
export const formatDate = (
  dateString: string,
  locale: string = "en-US"
): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    // Custom format: Mar 9 2021
    const day = date.getDate();
    const month = date.toLocaleString(locale, { month: "short" });
    const year = date.getFullYear();
    return `${month} ${day} ${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

/**
 * จัดรูปแบบวันที่ให้แสดงแบบเต็ม (วันที่และเวลา)
 * @param dateString - วันที่ในรูปแบบ string
 * @param locale - ภาษา (default: 'en-US')
 * @returns วันที่และเวลาในรูปแบบที่อ่านง่าย
 */
export const formatDateTime = (
  dateString: string,
  locale: string = "en-US"
): string => {
  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleString(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting datetime:", error);
    return dateString;
  }
};

/**
 * จัดรูปแบบวันที่ให้แสดงแบบย่อ (เช่น "15 ม.ค. 67")
 * @param dateString - วันที่ในรูปแบบ string
 * @param locale - ภาษา (default: 'en-US')
 * @returns วันที่ในรูปแบบย่อ
 */
export const formatShortDate = (
  dateString: string,
  locale: string = "en-US"
): string => {
  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString(locale, {
      year: "2-digit",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting short date:", error);
    return dateString;
  }
};

/**
 * แปลงวันที่เป็น relative time (เช่น "2 วันที่แล้ว", "1 ชั่วโมงที่แล้ว")
 * @param dateString - วันที่ในรูปแบบ string
 * @param locale - ภาษา (default: 'th-TH')
 * @returns relative time string
 */
export const getRelativeTime = (
  dateString: string,
  locale: string = "th-TH"
): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInDays > 0) {
      return `${diffInDays} วันที่แล้ว`;
    } else if (diffInHours > 0) {
      return `${diffInHours} ชั่วโมงที่แล้ว`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} นาทีที่แล้ว`;
    } else {
      return "เมื่อสักครู่";
    }
  } catch (error) {
    console.error("Error getting relative time:", error);
    return dateString;
  }
};

/**
 * ตรวจสอบว่าเป็นวันที่ในอนาคตหรือไม่
 * @param dateString - วันที่ในรูปแบบ string
 * @returns boolean
 */
export const isFutureDate = (dateString: string): boolean => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    return date > now;
  } catch (error) {
    return false;
  }
};

/**
 * ตรวจสอบว่าเป็นวันที่ในอดีตหรือไม่
 * @param dateString - วันที่ในรูปแบบ string
 * @returns boolean
 */
export const isPastDate = (dateString: string): boolean => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    return date < now;
  } catch (error) {
    return false;
  }
};

/**
 * ตรวจสอบว่าเป็นวันนี้หรือไม่
 * @param dateString - วันที่ในรูปแบบ string
 * @returns boolean
 */
export const isToday = (dateString: string): boolean => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    return date.toDateString() === now.toDateString();
  } catch (error) {
    return false;
  }
};

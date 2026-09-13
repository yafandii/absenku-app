export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
  },
  ATTENDANCE: {
    CLOCKIN: "/attendances/clock-in",
    HISTORY: "/attendances", //--- ONLY FOR HRD --
    TODAY: "/attendances/attendence-today",
    MYHISTORY: "/attendances/my-history",
  },
  EMPLOYEE: {
    CREATE: "/users",
    UPDATE: "/users/update",
    DELETE: "/users/delete",
  },
};

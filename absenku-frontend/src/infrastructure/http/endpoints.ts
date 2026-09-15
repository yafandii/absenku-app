export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    USER_ALL: "/users/all",
    USER_ME: "/users",
  },
  ATTENDANCE: {
    CLOCKIN: "/attendances/clock-in",
    CLOCKOUT: "/attendances/clock-out",
    HISTORY: "/attendances",
    TODAY: "/attendances/attendence-today",
    MYHISTORY: "/attendances/my-history",
    MONTHLYSUMMARY: "/attendances/monthly-summary",
  },
  EMPLOYEE: {
    CREATE: "/users",
    UPDATE: "/users/update",
    DELETE: "/users/delete",
  },
};

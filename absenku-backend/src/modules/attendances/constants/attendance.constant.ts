import { randomBytes } from 'crypto';

export const ATTENDANCE_CONFIG = {
  WORK_START_HOUR: 8,
  WORK_START_MINUTE: 0,
  WORK_END_HOUR: 17,
  WORK_END_MINUTE: 0,
  TARGET_DAILY_HOURS: 8,
  TIMEZONE: 'Asia/Jakarta',
  DEFAULT_TYPE: 'Presensi Masuk',
  WORK_TARGET_IN_HOURS_MONTHLY: 160,
  LATE_THRESHOLD_IN_MINUTES: 15,
  LATE_MAX_PER_MONTH: 3,
  ATTENDANCE_TYPES: {
    WORK_FROM_OFFICE: 'WORK_FROM_OFFICE',
    WORK_FROM_HOME: 'WORK_FROM_HOME',
    OUT_OF_OFFICE: 'OUT_OF_OFFICE',
  } as const,
} as const;

export function generateAttendanceId(date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const randomSuffix = randomBytes(3).toString('hex').toUpperCase();
  return `ATT-${yyyy}${mm}${dd}-${randomSuffix}`;
}

export function getWorkingDaysInMonth(
  year: number,
  monthIndex: number,
): number {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  let workingDays = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, monthIndex, day);
    const dayOfWeek = d.getDay();

    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays++;
    }
  }
  return workingDays;
}

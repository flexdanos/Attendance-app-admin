export interface AttendanceRecord {
  id: string;
  memberName: string;
  eventName: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  checkInTime?: string;
  group?: string;
}

export interface ReportData {
  totalMembers: number;
  totalEvents: number;
  averageAttendance: number;
  attendanceRate: number;
  presentToday: number;
  absentToday: number;
  weeklyTrend: number;
  monthlyTrend: number;
}

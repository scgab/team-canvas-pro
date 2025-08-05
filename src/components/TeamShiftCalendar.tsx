import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserColors } from '@/components/UserColorContext';

interface Shift {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  assigned_to: string;
  shift_type: string;
  status: string;
  notes?: string;
  created_by: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  full_name?: string;
  status: string;
  role: string;
}

interface TeamShiftCalendarProps {
  teamMembers: TeamMember[];
  shifts: Shift[];
  onRefresh: () => void;
}

export const TeamShiftCalendar: React.FC<TeamShiftCalendarProps> = ({
  teamMembers,
  shifts,
  onRefresh
}) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const { getColorByEmail } = useUserColors();

  // Get start of week (Monday)
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // Get week dates
  const weekDates = useMemo(() => {
    const start = getWeekStart(currentWeek);
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [currentWeek]);

  // Format week range
  const formatWeekRange = (dates: Date[]) => {
    const start = dates[0];
    const end = dates[6];
    return `${start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  };

  // Get shifts for specific date and member
  const getShiftsForDateAndMember = (date: Date, memberEmail: string) => {
    const dateString = date.toISOString().split('T')[0];
    return shifts.filter(shift => 
      shift.date === dateString && 
      shift.assigned_to === memberEmail
    );
  };

  // Navigation functions
  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() - 7);
    setCurrentWeek(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(newDate);
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(new Date());
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Time slots for display (6 AM to 10 PM)
  const timeSlots = [];
  for (let hour = 6; hour <= 22; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Team Shift Calendar
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium min-w-[200px] text-center">
                {formatWeekRange(weekDates)}
              </span>
              <Button variant="outline" size="sm" onClick={goToNextWeek}>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToCurrentWeek}>
                Today
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Team Members List */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Team Members</h3>
            <div className="flex flex-wrap gap-2">
              {teamMembers.map(member => {
                const colors = getColorByEmail(member.email);
                return (
                  <div
                    key={member.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-gray-50"
                  >
                    <div 
                      className={`w-3 h-3 rounded-full ${colors.avatar}`}
                    />
                    <span className="text-sm font-medium">
                      {member.full_name || member.name}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {member.role}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header with days */}
              <div className="grid grid-cols-8 gap-1 mb-2">
                <div className="p-2"></div> {/* Empty cell for time column */}
                {weekDates.map((date, index) => (
                  <div
                    key={index}
                    className={`p-2 text-center text-sm font-medium border rounded ${
                      isToday(date) 
                        ? 'bg-blue-100 text-blue-800 border-blue-300' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="font-semibold">
                      {date.toLocaleDateString('en-GB', { weekday: 'short' })}
                    </div>
                    <div className="text-xs">
                      {date.getDate()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Team Members Rows */}
              {teamMembers.map(member => {
                const colors = getColorByEmail(member.email);
                return (
                  <div key={member.id} className="grid grid-cols-8 gap-1 mb-2">
                    {/* Member name column */}
                    <div className="p-2 bg-gray-50 border rounded flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${colors.avatar}`} />
                      <span className="text-sm font-medium truncate">
                        {member.full_name || member.name}
                      </span>
                    </div>

                    {/* Day columns */}
                    {weekDates.map((date, dateIndex) => {
                      const dayShifts = getShiftsForDateAndMember(date, member.email);
                      return (
                        <div
                          key={dateIndex}
                          className={`p-1 border rounded min-h-[60px] ${
                            isToday(date) ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                          }`}
                        >
                          {dayShifts.map(shift => (
                            <div
                              key={shift.id}
                              className={`mb-1 p-1 rounded text-xs`}
                              style={{
                                backgroundColor: colors.primary + '20',
                                borderLeft: `3px solid ${colors.primary}`
                              }}
                            >
                              <div className="font-medium truncate">
                                {shift.shift_type}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <Clock className="w-3 h-3" />
                                {shift.start_time} - {shift.end_time}
                              </div>
                              <Badge 
                                variant={shift.status === 'confirmed' ? 'default' : 'outline'}
                                className="text-xs h-4"
                              >
                                {shift.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold mb-2">Legend</h4>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-100 border-l-2 border-blue-500 rounded"></div>
                <span>Today</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="h-4">confirmed</Badge>
                <span>Confirmed Shift</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="h-4">scheduled</Badge>
                <span>Scheduled Shift</span>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {shifts.filter(s => {
                  const shiftDate = new Date(s.date);
                  return weekDates.some(d => d.toDateString() === shiftDate.toDateString());
                }).length}
              </div>
              <div className="text-sm text-blue-700">Total Shifts This Week</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {teamMembers.filter(m => 
                  shifts.some(s => {
                    const shiftDate = new Date(s.date);
                    return s.assigned_to === m.email && 
                           weekDates.some(d => d.toDateString() === shiftDate.toDateString());
                  })
                ).length}
              </div>
              <div className="text-sm text-green-700">Active Members</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {shifts.filter(s => {
                  const shiftDate = new Date(s.date);
                  return s.status === 'confirmed' && 
                         weekDates.some(d => d.toDateString() === shiftDate.toDateString());
                }).length}
              </div>
              <div className="text-sm text-purple-700">Confirmed Shifts</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
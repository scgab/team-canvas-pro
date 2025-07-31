import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Shift {
  id: string;
  assigned_to: string | null;
  date: string;
  start_time: string;
  end_time: string;
  shift_type: string;
  status: string;
  notes: string | null;
  created_by: string;
}

interface WeeklyShiftCalendarProps {
  userProfile: any;
}

const ShiftCell = ({ shift, date, time }: { shift: Shift | undefined; date: Date; time: string }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!shift) {
    return (
      <div className="p-1 h-8 text-xs rounded border bg-gray-50 border-gray-200"></div>
    );
  }

  return (
    <div
      className="relative p-1 h-8 text-xs rounded border bg-blue-100 border-blue-300 text-blue-800 cursor-pointer"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="truncate font-medium">
        {shift.shift_type || 'Shift'}
      </div>
      
      {showTooltip && (
        <div className="absolute z-10 bg-gray-800 text-white p-2 rounded-lg text-xs whitespace-nowrap -top-16 left-0 shadow-lg">
          <div className="font-medium">{shift.shift_type}</div>
          <div>{shift.start_time} - {shift.end_time}</div>
          {shift.notes && <div className="text-gray-300">{shift.notes}</div>}
          
          {/* Tooltip arrow */}
          <div className="absolute top-full left-2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};

export const WeeklyShiftCalendar = ({ userProfile }: WeeklyShiftCalendarProps) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(false);

  // Get start of current week (Monday)
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  };

  // Get week dates (Monday to Sunday)
  const getWeekDates = (startDate: Date) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Time slots from 7 AM to 10 PM
  const timeSlots = [];
  for (let hour = 7; hour <= 22; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  const weekStart = getWeekStart(currentWeek);
  const weekDates = getWeekDates(weekStart);
  const currentUserEmail = userProfile?.email;

  // Load shifts for current week
  const loadWeeklyShifts = async () => {
    if (!currentUserEmail) return;
    
    try {
      setLoading(true);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const { data, error } = await supabase
        .from('shifts')
        .select('*')
        .eq('assigned_to', currentUserEmail)
        .gte('date', weekStart.toISOString().split('T')[0])
        .lte('date', weekEnd.toISOString().split('T')[0])
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error loading weekly shifts:', error);
        setShifts([]);
        return;
      }
      
      setShifts(data || []);
    } catch (error) {
      console.error('Error loading weekly shifts:', error);
      setShifts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserEmail) {
      loadWeeklyShifts();
    }
  }, [currentWeek, currentUserEmail]);

  // Navigate to previous week
  const goToPreviousWeek = () => {
    const prevWeek = new Date(currentWeek);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setCurrentWeek(prevWeek);
  };

  // Navigate to next week
  const goToNextWeek = () => {
    const nextWeek = new Date(currentWeek);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setCurrentWeek(nextWeek);
  };

  // Go to current week
  const goToCurrentWeek = () => {
    setCurrentWeek(new Date());
  };

  // Check if shift exists for specific date and time
  const getShiftForDateTime = (date: Date, time: string) => {
    const dateStr = date.toISOString().split('T')[0];
    return shifts.find(shift => {
      if (shift.date !== dateStr) return false;
      
      const shiftStart = shift.start_time;
      const shiftEnd = shift.end_time;
      
      return time >= shiftStart && time < shiftEnd;
    });
  };

  // Format week range display
  const formatWeekRange = () => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const startStr = weekStart.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    const endStr = weekEnd.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
    
    return `${startStr} - ${endStr}`;
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Weekly Schedule</h2>
          <p className="text-gray-600">{formatWeekRange()}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={goToCurrentWeek}
            className="px-3 py-2 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Today
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPreviousWeek}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Previous week"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <button
              onClick={goToNextWeek}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Next week"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Days header */}
          <div className="grid grid-cols-8 gap-1 mb-2">
            <div className="p-2"></div> {/* Empty cell for time column */}
            {weekDates.map((date, index) => (
              <div
                key={index}
                className={`p-2 text-center text-sm font-medium rounded-lg ${
                  isToday(date)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-50 text-gray-700'
                }`}
              >
                <div className="font-semibold">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-xs">
                  {date.getDate()}
                </div>
              </div>
            ))}
          </div>

          {/* Time slots and shifts */}
          <div className="space-y-1">
            {timeSlots.map((time, timeIndex) => (
              <div key={timeIndex} className="grid grid-cols-8 gap-1">
                {/* Time column */}
                <div className="p-2 text-xs text-gray-500 text-right font-medium">
                  {time}
                </div>
                
                {/* Day columns */}
                {weekDates.map((date, dateIndex) => {
                  const shift = getShiftForDateTime(date, time);
                  
                  return (
                    <ShiftCell
                      key={dateIndex}
                      shift={shift}
                      date={date}
                      time={time}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
            <span className="text-gray-600">Scheduled Shift</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
            <span className="text-gray-600">Available</span>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          Total shifts this week: {shifts.length}
        </div>
      </div>
    </div>
  );
};
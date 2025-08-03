import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { AvailabilityDialog } from './AvailabilityDialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { TeamAuthService } from '@/services/teamAuth';

interface AvailabilityData {
  id: string;
  date: string;
  is_available: boolean;
  preferred_start_time: string | null;
  preferred_end_time: string | null;
  notes: string | null;
}

interface AvailabilityCalendarProps {
  onRefresh?: () => void;
}

export const AvailabilityCalendar = ({ onRefresh }: AvailabilityCalendarProps) => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'monthly' | 'weekly'>('monthly');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData[]>([]);
  const [teamId, setTeamId] = useState<string | null>(null);

  useEffect(() => {
    fetchTeamIdAndAvailability();
  }, [user?.email, currentDate]);

  const fetchTeamIdAndAvailability = async () => {
    if (!user?.email) return;

    try {
      const teamData = await TeamAuthService.getUserTeam(user.email);
      if (teamData?.team?.id) {
        setTeamId(teamData.team.id);
        await fetchAvailability(teamData.team.id);
      }
    } catch (error) {
      console.error('Error fetching team data:', error);
    }
  };

  const fetchAvailability = async (teamId: string) => {
    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const { data, error } = await supabase
        .from('availability')
        .select('*')
        .eq('team_id', teamId)
        .eq('team_member_email', user?.email)
        .gte('date', startOfMonth.toISOString().split('T')[0])
        .lte('date', endOfMonth.toISOString().split('T')[0]);

      if (error) throw error;

      setAvailabilityData(data || []);
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const getAvailabilityForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return availabilityData.find(a => a.date === dateStr);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setDate(prev.getDate() - 7);
      } else {
        newDate.setDate(prev.getDate() + 7);
      }
      return newDate;
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setDialogOpen(true);
  };

  const renderMonthlyView = () => {
    const days = getDaysInMonth(currentDate);
    const today = new Date();

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center font-medium text-sm text-gray-500">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className="p-2"></div>;
          }

          const availability = getAvailabilityForDate(day);
          const isToday = day.toDateString() === today.toDateString();
          const isPast = day < today;

          return (
            <div key={index} className="p-1">
              <Button
                variant="ghost"
                onClick={() => handleDateClick(day)}
                disabled={isPast}
                className={`w-full h-12 text-sm flex flex-col items-center justify-center relative ${
                  isToday ? 'bg-blue-100 border-2 border-blue-500' : ''
                } ${isPast ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
              >
                <span className={isToday ? 'font-bold text-blue-600' : ''}>{day.getDate()}</span>
                {availability && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className={`w-2 h-2 rounded-full ${
                      availability.is_available ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                )}
              </Button>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeeklyView = () => {
    const days = getWeekDays(currentDate);
    const today = new Date();

    return (
      <div className="space-y-2">
        {days.map((day, index) => {
          const availability = getAvailabilityForDate(day);
          const isToday = day.toDateString() === today.toDateString();
          const isPast = day < today;

          return (
            <div key={index} className={`p-4 border rounded-lg ${isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-medium ${isToday ? 'text-blue-600' : ''}`}>
                    {day.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </h3>
                  {availability && (
                    <div className="mt-1">
                      <Badge variant={availability.is_available ? "default" : "destructive"}>
                        {availability.is_available ? 'Available' : 'Not Available'}
                      </Badge>
                      {availability.is_available && availability.preferred_start_time && (
                        <span className="ml-2 text-sm text-gray-600">
                          {availability.preferred_start_time} - {availability.preferred_end_time}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDateClick(day)}
                  disabled={isPast}
                >
                  {availability ? 'Edit' : 'Set'} Availability
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              My Availability
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'monthly' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode('monthly')}
              >
                Monthly
              </Button>
              <Button
                variant={viewMode === 'weekly' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode('weekly')}
              >
                Weekly
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => viewMode === 'monthly' ? navigateMonth('prev') : navigateWeek('prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <h2 className="text-lg font-semibold">
              {viewMode === 'monthly' 
                ? currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                : `Week of ${getWeekDays(currentDate)[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
              }
            </h2>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => viewMode === 'monthly' ? navigateMonth('next') : navigateWeek('next')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Calendar View */}
          {viewMode === 'monthly' ? renderMonthlyView() : renderWeeklyView()}

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Not Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <span>Not Set</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <AvailabilityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedDate={selectedDate}
        teamId={teamId}
        onSuccess={() => {
          fetchAvailability(teamId!);
          onRefresh?.();
        }}
      />
    </div>
  );
};
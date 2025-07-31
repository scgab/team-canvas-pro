import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Clock, 
  Calendar, 
  User, 
  TrendingUp, 
  Target, 
  Award,
  BarChart3,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Star,
  Phone,
  Mail,
  MapPin,
  Briefcase
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: string;
  competence_level: string;
  hourly_rate: number;
}

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

interface AvailableShift {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  shift_type: string;
  competence_required: string;
  description: string | null;
  claimed_by: string | null;
  created_by: string;
}

interface ShiftsOverviewProps {
  currentUser: any;
  teamMembers: TeamMember[];
  shifts: Shift[];
  availableShifts: AvailableShift[];
  onTabChange: (tab: string) => void;
}

export const ShiftsOverview = ({ 
  currentUser, 
  teamMembers, 
  shifts, 
  availableShifts, 
  onTabChange 
}: ShiftsOverviewProps) => {
  const [userProfile, setUserProfile] = useState<TeamMember | null>(null);
  const [stats, setStats] = useState({
    currentMonthShifts: 0,
    currentMonthHours: 0,
    currentWeekShifts: 0,
    currentWeekHours: 0,
    ytdTotalShifts: 0,
    ytdTotalHours: 0,
    attendanceRate: 0,
    completedShifts: 0
  });

  useEffect(() => {
    if (currentUser && teamMembers.length > 0) {
      const profile = teamMembers.find(m => m.email === currentUser.email);
      setUserProfile(profile || null);
      calculateStats();
    }
  }, [currentUser, teamMembers, shifts]);

  const calculateStats = () => {
    const userShifts = shifts.filter(s => s.assigned_to === currentUser?.email);
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Current month stats
    const currentMonthShifts = userShifts.filter(s => {
      const shiftDate = new Date(s.date);
      return shiftDate.getMonth() === currentMonth && shiftDate.getFullYear() === currentYear;
    });

    // Current week stats
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const currentWeekShifts = userShifts.filter(s => {
      const shiftDate = new Date(s.date);
      return shiftDate >= startOfWeek;
    });

    // YTD stats
    const ytdShifts = userShifts.filter(s => {
      const shiftDate = new Date(s.date);
      return shiftDate.getFullYear() === currentYear;
    });

    const calculateHours = (shifts: Shift[]) => {
      return shifts.reduce((total, shift) => {
        const start = new Date(`2000-01-01 ${shift.start_time}`);
        const end = new Date(`2000-01-01 ${shift.end_time}`);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        return total + hours;
      }, 0);
    };

    const completedShifts = userShifts.filter(s => s.status === 'completed').length;
    const attendanceRate = userShifts.length > 0 ? (completedShifts / userShifts.length) * 100 : 0;

    setStats({
      currentMonthShifts: currentMonthShifts.length,
      currentMonthHours: calculateHours(currentMonthShifts),
      currentWeekShifts: currentWeekShifts.length,
      currentWeekHours: calculateHours(currentWeekShifts),
      ytdTotalShifts: ytdShifts.length,
      ytdTotalHours: calculateHours(ytdShifts),
      attendanceRate,
      completedShifts
    });
  };

  const getUpcomingShifts = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return shifts
      .filter(s => s.assigned_to === currentUser?.email)
      .filter(s => {
        const shiftDate = new Date(s.date);
        return shiftDate >= today && shiftDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  };

  const getQualifiedAvailableShifts = () => {
    if (!userProfile) return [];
    
    const competenceLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
    const userLevel = competenceLevels.indexOf(userProfile.competence_level.toLowerCase());
    
    return availableShifts
      .filter(s => !s.claimed_by)
      .filter(s => {
        const requiredLevel = competenceLevels.indexOf(s.competence_required.toLowerCase());
        return userLevel >= requiredLevel;
      })
      .slice(0, 3);
  };

  const getRecentActivity = () => {
    const userShifts = shifts
      .filter(s => s.assigned_to === currentUser?.email)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    return userShifts.map(shift => ({
      id: shift.id,
      timestamp: shift.date,
      type: shift.status === 'completed' ? 'shift_completed' : 'shift_scheduled',
      description: shift.status === 'completed' 
        ? `Completed ${calculateShiftHours(shift)}-hour shift`
        : `Scheduled for ${shift.start_time} - ${shift.end_time}`,
      details: `${shift.shift_type} shift`,
      icon: shift.status === 'completed' ? CheckCircle2 : Clock
    }));
  };

  const calculateShiftHours = (shift: Shift) => {
    const start = new Date(`2000-01-01 ${shift.start_time}`);
    const end = new Date(`2000-01-01 ${shift.end_time}`);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60));
  };

  const quickActions = [
    {
      title: "Mark Availability",
      description: "Set your available days",
      icon: Calendar,
      action: () => onTabChange('availability'),
      priority: "high"
    },
    {
      title: "Claim Available Shift",
      description: "Browse open shifts",
      icon: Plus,
      action: () => onTabChange('available'),
      badge: getQualifiedAvailableShifts().length
    },
    {
      title: "View My Schedule",
      description: "See upcoming shifts",
      icon: Clock,
      action: () => onTabChange('my-shifts')
    },
    {
      title: "View Reports",
      description: "See detailed reports",
      icon: BarChart3,
      action: () => onTabChange('reports')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Row - Personal Info, Stats, Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarFallback>
                  {userProfile?.name?.split(' ').map(n => n[0]).join('') || 'UN'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{userProfile?.name || 'Unknown'}</h3>
                <p className="text-sm text-muted-foreground">{userProfile?.role || 'Team Member'}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4" />
                <span>{userProfile?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="w-4 h-4" />
                <span>Competence: {userProfile?.competence_level}</span>
              </div>
              {userProfile?.hourly_rate && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-lg">💰</span>
                  <span>${userProfile.hourly_rate}/hour</span>
                </div>
              )}
            </div>

            <Badge variant="secondary" className="w-fit">
              {userProfile?.competence_level} Level
            </Badge>
          </CardContent>
        </Card>

        {/* Current Period Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Current Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{stats.currentMonthShifts}</p>
                <p className="text-xs text-muted-foreground">This Month Shifts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{Math.round(stats.currentMonthHours)}</p>
                <p className="text-xs text-muted-foreground">This Month Hours</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.currentWeekShifts}</p>
                <p className="text-xs text-muted-foreground">This Week</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{Math.round(stats.attendanceRate)}%</p>
                <p className="text-xs text-muted-foreground">Attendance</p>
              </div>
            </div>
            
            <div className="pt-2 border-t">
              <div className="text-center">
                <p className="text-lg font-semibold">{stats.ytdTotalShifts} shifts</p>
                <p className="text-sm text-muted-foreground">Year to Date</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start h-auto p-3"
                onClick={action.action}
              >
                <action.icon className="w-4 h-4 mr-3" />
                <div className="text-left flex-1">
                  <p className="font-medium text-sm">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
                {action.badge && action.badge > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {action.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Middle Row - Upcoming Shifts & Available Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Shifts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Upcoming Shifts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {getUpcomingShifts().length > 0 ? (
              getUpcomingShifts().map((shift) => (
                <div key={shift.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{new Date(shift.date).toDateString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {shift.start_time} - {shift.end_time} ({calculateShiftHours(shift)}h)
                    </p>
                  </div>
                  <Badge variant={shift.shift_type === 'overtime' ? 'destructive' : 'default'}>
                    {shift.shift_type}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">No upcoming shifts</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => onTabChange('available')}
                >
                  Find Available Shifts
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Available Opportunities
              {getQualifiedAvailableShifts().length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {getQualifiedAvailableShifts().length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {getQualifiedAvailableShifts().length > 0 ? (
              getQualifiedAvailableShifts().map((shift) => (
                <div key={shift.id} className="flex items-center justify-between p-3 border rounded-lg bg-green-50 dark:bg-green-950">
                  <div>
                    <p className="font-medium">{new Date(shift.date).toDateString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {shift.start_time} - {shift.end_time}
                    </p>
                    <Badge variant="outline" className="mt-1">
                      {shift.competence_required} required
                    </Badge>
                  </div>
                  <Button size="sm" onClick={() => onTabChange('available')}>
                    View
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">No shifts available</p>
                <p className="text-sm text-muted-foreground">Check back later for new opportunities</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row - Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getRecentActivity().length > 0 ? (
              getRecentActivity().map((activity, index) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <activity.icon className="w-4 h-4 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleDateString()} • {activity.details}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.type.replace('_', ' ')}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <Clock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">No recent activity</p>
                <p className="text-sm text-muted-foreground">Your shift activity will appear here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
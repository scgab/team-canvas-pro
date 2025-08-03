import React, { useState, useEffect } from 'react';
import { BarChart3, Calendar, Clock, CheckCircle, FileText, UserPlus, Settings } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { ShiftsOverview } from '@/components/ShiftsOverview';
import { MakeShifts } from '@/components/MakeShifts';
import { AllShiftsManagement } from '@/components/AllShiftsManagement';
import { AvailabilityCalendar } from '@/components/AvailabilityCalendar';
import { useTeamMember } from '@/hooks/useTeamMember';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { TeamAuthService } from '@/services/teamAuth';
import { useToast } from '@/hooks/use-toast';

const ShiftPlanningPage = () => {
  const [activeTab, setActiveTab] = useState('shifts-overview');
  const { isAdmin } = useTeamMember();
  const { user } = useAuth();
  const { toast } = useToast();
  const [shifts, setShifts] = useState([]);
  const [availableShifts, setAvailableShifts] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamId, setTeamId] = useState<string | null>(null);

  // Fetch team data and shifts
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.email) return;

      try {
        // Get team data
        const teamData = await TeamAuthService.getUserTeam(user.email);
        if (teamData?.team?.id) {
          setTeamId(teamData.team.id);
          
          // Fetch team members
          const members = await TeamAuthService.getTeamMembers(teamData.team.id);
          setTeamMembers(members.filter(m => m.status === 'active'));

          // Fetch shifts
          const { data: shiftsData, error: shiftsError } = await supabase
            .from('shifts')
            .select('*')
            .eq('team_id', teamData.team.id)
            .order('date', { ascending: true });

          if (!shiftsError && shiftsData) {
            setShifts(shiftsData);
          }

          // Fetch available shifts
          const { data: availableShiftsData, error: availableError } = await supabase
            .from('available_shifts')
            .select('*')
            .eq('team_id', teamData.team.id)
            .order('date', { ascending: true });

          if (!availableError && availableShiftsData) {
            setAvailableShifts(availableShiftsData);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [user?.email]);

  // Function to refresh data (useful after creating new shifts)
  const refreshData = async () => {
    if (!teamId) return;
    
    try {
      // Fetch shifts
      const { data: shiftsData, error: shiftsError } = await supabase
        .from('shifts')
        .select('*')
        .eq('team_id', teamId)
        .order('date', { ascending: true });

      if (!shiftsError && shiftsData) {
        setShifts(shiftsData);
      }

      // Fetch available shifts
      const { data: availableShiftsData, error: availableError } = await supabase
        .from('available_shifts')
        .select('*')
        .eq('team_id', teamId)
        .order('date', { ascending: true });

      if (!availableError && availableShiftsData) {
        setAvailableShifts(availableShiftsData);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  // Simple hardcoded user profile - no async loading
  const getCurrentUserProfile = () => {
    const currentUser = localStorage.getItem('currentUser') || 'hna@scandac.com';
    const profiles = {
      'hna@scandac.com': {
        full_name: 'HNA User',
        email: 'hna@scandac.com',
        age: 28,
        competence_level: 'Advanced',
        department: 'Operations',
        job_title: 'Project Manager'
      },
      'myh@scandac.com': {
        full_name: 'MYH User', 
        email: 'myh@scandac.com',
        age: 32,
        competence_level: 'Expert',
        department: 'Management',
        job_title: 'Team Lead'
      }
    };
    return profiles[currentUser] || profiles['hna@scandac.com'];
  };

  const baseTabs = [
    { id: 'shifts-overview', label: 'Shifts Overview', icon: BarChart3 }
  ];

  const adminTabs = [
    { id: 'make-shifts', label: 'Make Shifts', icon: UserPlus },
    { id: 'all-shifts', label: 'All Shifts', icon: Settings }
  ];

  const memberTabs = [
    { id: 'my-shifts', label: 'My Shifts', icon: Calendar },
    { id: 'available-shifts', label: 'Available Shifts', icon: Clock },
    { id: 'my-availability', label: 'My Availability', icon: CheckCircle },
    { id: 'my-reports', label: 'My Reports', icon: FileText }
  ];

  const tabs = isAdmin 
    ? [...baseTabs, ...adminTabs, ...memberTabs]
    : [...baseTabs, ...memberTabs];
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Shift Planning</h1>

        {/* FUNCTIONAL TABS WITH STATE */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* TAB CONTENT - ALWAYS RENDER CONTENT */}
        <div className="min-h-96">
          {activeTab === 'shifts-overview' && (
            <ShiftsOverview 
              currentUser={{ email: user?.email || getCurrentUserProfile().email }}
              teamMembers={teamMembers}
              shifts={shifts}
              availableShifts={availableShifts}
              onTabChange={setActiveTab}
            />
          )}

          {activeTab === 'make-shifts' && isAdmin && (
            <MakeShifts onShiftCreated={refreshData} />
          )}

          {activeTab === 'all-shifts' && isAdmin && (
            <AllShiftsManagement onRefresh={refreshData} />
          )}
          
          {activeTab === 'my-shifts' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">My Shifts</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Morning Shift</h3>
                      <p className="text-sm text-gray-500">Today • 8:00 AM - 4:00 PM</p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Confirmed</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Evening Shift</h3>
                      <p className="text-sm text-gray-500">Tomorrow • 4:00 PM - 12:00 AM</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Scheduled</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'available-shifts' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Available Shifts</h2>
                <div className="space-y-4">
                  {availableShifts.length > 0 ? (
                    availableShifts
                      .filter(shift => !shift.claimed_by)
                      .map((shift) => (
                        <div key={shift.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-medium">{shift.shift_type} Shift</h3>
                            <p className="text-sm text-gray-500">
                              <strong>{new Date(shift.date).toLocaleDateString()}</strong> • {shift.start_time} - {shift.end_time}
                            </p>
                            <p className="text-xs text-gray-400">
                              Competence Required: {shift.competence_required}
                            </p>
                            {shift.description && (
                              <p className="text-xs text-gray-500 mt-1">{shift.description}</p>
                            )}
                          </div>
                          <button 
                            className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
                            onClick={async () => {
                              try {
                                const { error } = await supabase
                                  .from('available_shifts')
                                  .update({ claimed_by: user?.email })
                                  .eq('id', shift.id);
                                
                                if (error) throw error;
                                
                                // Refresh data
                                refreshData();
                                
                                toast({
                                  title: "Success",
                                  description: "Shift claimed successfully!"
                                });
                              } catch (error: any) {
                                toast({
                                  title: "Error",
                                  description: error.message || "Failed to claim shift",
                                  variant: "destructive"
                                });
                              }
                            }}
                          >
                            Claim Shift
                          </button>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500">No available shifts at the moment</p>
                      <p className="text-sm text-gray-400">Check back later for new opportunities</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'my-availability' && (
            <AvailabilityCalendar onRefresh={refreshData} />
          )}
          
          {activeTab === 'my-reports' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">My Reports</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Hours This Month</h3>
                    <p className="text-2xl font-bold text-blue-600">96 Hours</p>
                    <p className="text-sm text-gray-500">Regular: 88h • Overtime: 8h</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Attendance Rate</h3>
                    <p className="text-2xl font-bold text-green-600">98%</p>
                    <p className="text-sm text-gray-500">1 missed shift this month</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ShiftPlanningPage;
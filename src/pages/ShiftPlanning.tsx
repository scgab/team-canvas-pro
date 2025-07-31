import React, { useState } from 'react';
import { BarChart3, Calendar, Clock, CheckCircle, FileText } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { ShiftsOverview } from '@/components/ShiftsOverview';

const ShiftPlanningPage = () => {
  const [activeTab, setActiveTab] = useState('shifts-overview');

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

  const tabs = [
    { id: 'shifts-overview', label: 'Shifts Overview', icon: BarChart3 },
    { id: 'my-shifts', label: 'My Shifts', icon: Calendar },
    { id: 'available-shifts', label: 'Available Shifts', icon: Clock },
    { id: 'my-availability', label: 'My Availability', icon: CheckCircle },
    { id: 'my-reports', label: 'My Reports', icon: FileText }
  ];
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
              currentUser={{ email: getCurrentUserProfile().email }}
              teamMembers={[]}
              shifts={[]}
              availableShifts={[]}
              onTabChange={setActiveTab}
            />
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
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Weekend Shift</h3>
                      <p className="text-sm text-gray-500">Saturday • 10:00 AM - 6:00 PM</p>
                      <p className="text-xs text-gray-400">Competence: Intermediate</p>
                    </div>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600">
                      Claim Shift
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Night Shift</h3>
                      <p className="text-sm text-gray-500">Friday • 11:00 PM - 7:00 AM</p>
                      <p className="text-xs text-gray-400">Competence: Advanced</p>
                    </div>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600">
                      Claim Shift
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'my-availability' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">My Availability</h2>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div key={day} className="text-center">
                      <div className="font-medium text-sm mb-2">{day}</div>
                      <div className="space-y-1">
                        <button className="w-full p-2 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200">
                          Available
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Update Availability
                </button>
              </div>
            </div>
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
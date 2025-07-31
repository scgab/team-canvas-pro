import React from 'react';
import { BarChart3, Calendar, Clock } from 'lucide-react';
import { Layout } from '@/components/Layout';

const ShiftPlanningPage = () => {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Shift Planning</h1>

        {/* HARDCODED TABS - NO STATE */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <div className="py-2 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Shifts Overview
            </div>
            <div className="py-2 px-1 border-b-2 border-transparent text-gray-500 font-medium text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              My Shifts
            </div>
            <div className="py-2 px-1 border-b-2 border-transparent text-gray-500 font-medium text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Available Shifts
            </div>
          </nav>
        </div>

        {/* HARDCODED CONTENT - NO CONDITIONS */}
        <div className="space-y-6">
          {/* Weekly Calendar */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Weekly Schedule</h2>
            
            <div className="grid grid-cols-8 gap-1 mb-4">
              <div></div>
              <div className="p-2 text-center text-sm font-medium bg-gray-50 rounded">Mon</div>
              <div className="p-2 text-center text-sm font-medium bg-gray-50 rounded">Tue</div>
              <div className="p-2 text-center text-sm font-medium bg-blue-500 text-white rounded">Wed</div>
              <div className="p-2 text-center text-sm font-medium bg-gray-50 rounded">Thu</div>
              <div className="p-2 text-center text-sm font-medium bg-gray-50 rounded">Fri</div>
              <div className="p-2 text-center text-sm font-medium bg-gray-50 rounded">Sat</div>
              <div className="p-2 text-center text-sm font-medium bg-gray-50 rounded">Sun</div>
            </div>

            <div className="grid grid-cols-8 gap-1">
              <div className="p-2 text-xs text-gray-500">09:00</div>
              <div className="p-1 h-8 bg-gray-50 border rounded"></div>
              <div className="p-1 h-8 bg-gray-50 border rounded"></div>
              <div className="p-1 h-8 bg-blue-100 border border-blue-300 rounded"></div>
              <div className="p-1 h-8 bg-gray-50 border rounded"></div>
              <div className="p-1 h-8 bg-gray-50 border rounded"></div>
              <div className="p-1 h-8 bg-gray-50 border rounded"></div>
              <div className="p-1 h-8 bg-gray-50 border rounded"></div>
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-semibold">
                H
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">HNA User</h3>
                <p className="text-gray-600">hna@scandac.com</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-gray-500">Age: </span><span>28</span></div>
                  <div><span className="text-gray-500">Level: </span><span className="font-medium text-blue-600">Advanced</span></div>
                  <div><span className="text-gray-500">Department: </span><span>Operations</span></div>
                  <div><span className="text-gray-500">Role: </span><span>Project Manager</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-medium text-gray-500">This Month</h3>
              <p className="text-2xl font-bold text-blue-600">12 Shifts</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-medium text-gray-500">Hours Worked</h3>
              <p className="text-2xl font-bold text-green-600">96 Hours</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-medium text-gray-500">This Week</h3>
              <p className="text-2xl font-bold text-purple-600">3 Shifts</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-medium text-gray-500">Availability</h3>
              <p className="text-2xl font-bold text-orange-600">85%</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ShiftPlanningPage;
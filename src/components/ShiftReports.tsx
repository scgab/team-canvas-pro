import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  FileText,
  Download
} from "lucide-react";

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
}

interface ShiftStats {
  totalShifts: number;
  completedShifts: number;
  totalHours: number;
  totalCost: number;
  memberStats: Array<{
    email: string;
    name: string;
    shifts: number;
    hours: number;
    cost: number;
    completionRate: number;
  }>;
}

interface ShiftReportsProps {
  teamMembers: TeamMember[];
  shifts: Shift[];
}

export const ShiftReports = ({ teamMembers, shifts }: ShiftReportsProps) => {
  const [reportPeriod, setReportPeriod] = useState('month');
  const [stats, setStats] = useState<ShiftStats | null>(null);

  useEffect(() => {
    calculateStats();
  }, [shifts, teamMembers, reportPeriod]);

  const calculateStats = () => {
    const now = new Date();
    let startDate: Date;

    switch (reportPeriod) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), 0, 1);
    }

    const filteredShifts = shifts.filter(shift => 
      new Date(shift.date) >= startDate && new Date(shift.date) <= now
    );

    const totalShifts = filteredShifts.length;
    const completedShifts = filteredShifts.filter(s => s.status === 'completed').length;

    const memberStatsMap = new Map();

    filteredShifts.forEach(shift => {
      if (!shift.assigned_to) return;

      const member = teamMembers.find(m => m.email === shift.assigned_to);
      if (!member) return;

      const hours = calculateHours(shift.start_time, shift.end_time);
      const cost = hours * member.hourly_rate;

      if (!memberStatsMap.has(shift.assigned_to)) {
        memberStatsMap.set(shift.assigned_to, {
          email: shift.assigned_to,
          name: member.name,
          shifts: 0,
          hours: 0,
          cost: 0,
          completedShifts: 0,
          totalShifts: 0
        });
      }

      const memberStats = memberStatsMap.get(shift.assigned_to);
      memberStats.shifts += 1;
      memberStats.totalShifts += 1;
      memberStats.hours += hours;
      memberStats.cost += cost;
      
      if (shift.status === 'completed') {
        memberStats.completedShifts += 1;
      }
    });

    const memberStats = Array.from(memberStatsMap.values()).map(stats => ({
      ...stats,
      completionRate: stats.totalShifts > 0 ? (stats.completedShifts / stats.totalShifts) * 100 : 0
    }));

    const totalHours = memberStats.reduce((sum, member) => sum + member.hours, 0);
    const totalCost = memberStats.reduce((sum, member) => sum + member.cost, 0);

    setStats({
      totalShifts,
      completedShifts,
      totalHours,
      totalCost,
      memberStats
    });
  };

  const calculateHours = (startTime: string, endTime: string): number => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  };

  const exportReport = () => {
    if (!stats) return;

    const reportData = {
      period: reportPeriod,
      generatedAt: new Date().toISOString(),
      summary: {
        totalShifts: stats.totalShifts,
        completedShifts: stats.completedShifts,
        completionRate: stats.totalShifts > 0 ? (stats.completedShifts / stats.totalShifts * 100).toFixed(1) : '0',
        totalHours: stats.totalHours.toFixed(1),
        totalCost: stats.totalCost.toFixed(2)
      },
      memberDetails: stats.memberStats
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shift-report-${reportPeriod}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!stats) return <div>Loading reports...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Shift Reports</h3>
        <div className="flex items-center gap-2">
          <Select value={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={exportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shifts</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalShifts}</div>
            <div className="text-xs text-muted-foreground">
              {stats.completedShifts} completed
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalShifts > 0 ? ((stats.completedShifts / stats.totalShifts) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-xs text-muted-foreground">
              {stats.completedShifts} of {stats.totalShifts} shifts
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">
              {(stats.totalHours / (stats.totalShifts || 1)).toFixed(1)} avg per shift
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalCost.toFixed(0)}</div>
            <div className="text-xs text-muted-foreground">
              ${(stats.totalCost / (stats.totalHours || 1)).toFixed(0)} avg per hour
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Member Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Team Member Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team Member</TableHead>
                <TableHead className="text-right">Shifts</TableHead>
                <TableHead className="text-right">Hours</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">Completion Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.memberStats.map((member) => (
                <TableRow key={member.email}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell className="text-right">{member.shifts}</TableCell>
                  <TableCell className="text-right">{member.hours.toFixed(1)}</TableCell>
                  <TableCell className="text-right">${member.cost.toFixed(0)}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={member.completionRate >= 90 ? "default" : member.completionRate >= 70 ? "secondary" : "destructive"}>
                      {member.completionRate.toFixed(0)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {stats.memberStats.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              No shift data for the selected period
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { usePersistedState } from "@/hooks/useDataPersistence";
import { AdminInviteButton } from "@/components/AdminInviteButton";
import { Moon, Sun, Clock, Globe, Palette, Bell, User, Shield } from "lucide-react";

type DateFormat = "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";
type TimeFormat = "12h" | "24h";
type Theme = "light" | "dark" | "system";

interface SettingsState {
  theme: Theme;
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    deadlines: boolean;
    teamUpdates: boolean;
  };
  privacy: {
    profileVisible: boolean;
    activityTracking: boolean;
  };
}

const defaultSettings: SettingsState = {
  theme: "system",
  dateFormat: "MM/DD/YYYY",
  timeFormat: "12h",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  notifications: {
    email: true,
    push: true,
    deadlines: true,
    teamUpdates: true,
  },
  privacy: {
    profileVisible: true,
    activityTracking: true,
  },
};

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = usePersistedState<SettingsState>("app-settings", defaultSettings);

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    
    if (theme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
    } else {
      root.classList.toggle("dark", theme === "dark");
    }
  };

  const handleSettingChange = <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    if (key === "theme") {
      applyTheme(value as Theme);
    }
  };

  const handleNestedSettingChange = <K extends keyof SettingsState>(
    category: K,
    key: keyof SettingsState[K],
    value: any
  ) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...(settings[category] as object),
        [key]: value,
      },
    };
    setSettings(newSettings);
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
    applyTheme(defaultSettings.theme);
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to their default values.",
    });
  };

  const saveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been saved successfully.",
    });
  };

  const formatDate = (date: Date, format: DateFormat): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    switch (format) {
      case "MM/DD/YYYY":
        return `${month}/${day}/${year}`;
      case "DD/MM/YYYY":
        return `${day}/${month}/${year}`;
      case "YYYY-MM-DD":
        return `${year}-${month}-${day}`;
      default:
        return `${month}/${day}/${year}`;
    }
  };

  const formatTime = (date: Date, format: TimeFormat): string => {
    if (format === "24h") {
      return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const sampleDate = new Date();

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Manage your application preferences and account settings.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetToDefaults}>
              Reset to Defaults
            </Button>
            <Button onClick={saveSettings}>
              Save Changes
            </Button>
          </div>
        </div>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the look and feel of your workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select
                value={settings.theme}
                onValueChange={(value: Theme) => handleSettingChange("theme", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Date & Time Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Date & Time
            </CardTitle>
            <CardDescription>
              Configure how dates and times are displayed throughout the application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <Select
                  value={settings.dateFormat}
                  onValueChange={(value: DateFormat) => handleSettingChange("dateFormat", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY ({formatDate(sampleDate, "MM/DD/YYYY")})</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY ({formatDate(sampleDate, "DD/MM/YYYY")})</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD ({formatDate(sampleDate, "YYYY-MM-DD")})</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeFormat">Time Format</Label>
                <Select
                  value={settings.timeFormat}
                  onValueChange={(value: TimeFormat) => handleSettingChange("timeFormat", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12-hour ({formatTime(sampleDate, "12h")})</SelectItem>
                    <SelectItem value="24h">24-hour ({formatTime(sampleDate, "24h")})</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={settings.timezone}
                onValueChange={(value) => handleSettingChange("timezone", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time (UTC-5/-4)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (UTC-6/-5)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (UTC-7/-6)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (UTC-8/-7)</SelectItem>
                  <SelectItem value="Europe/London">GMT (UTC+0/+1)</SelectItem>
                  <SelectItem value="Europe/Paris">CET (UTC+1/+2)</SelectItem>
                  <SelectItem value="Asia/Tokyo">JST (UTC+9)</SelectItem>
                  <SelectItem value="Australia/Sydney">AEST (UTC+10/+11)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Control what notifications you receive and how you receive them.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch
                checked={settings.notifications.email}
                onCheckedChange={(checked) => 
                  handleNestedSettingChange("notifications", "email", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
              </div>
              <Switch
                checked={settings.notifications.push}
                onCheckedChange={(checked) => 
                  handleNestedSettingChange("notifications", "push", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Deadline Reminders</Label>
                <p className="text-sm text-muted-foreground">Get notified about upcoming deadlines</p>
              </div>
              <Switch
                checked={settings.notifications.deadlines}
                onCheckedChange={(checked) => 
                  handleNestedSettingChange("notifications", "deadlines", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Team Updates</Label>
                <p className="text-sm text-muted-foreground">Notifications about team activity and messages</p>
              </div>
              <Switch
                checked={settings.notifications.teamUpdates}
                onCheckedChange={(checked) => 
                  handleNestedSettingChange("notifications", "teamUpdates", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Admin Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Admin Actions
            </CardTitle>
            <CardDescription>
              Administrative functions and special invitations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border">
                <h4 className="font-semibold mb-2">Send Admin Invitation</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Grant full admin access with unlimited team capabilities to any email address.
                </p>
                <AdminInviteButton />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Privacy & Security
            </CardTitle>
            <CardDescription>
              Manage your privacy settings and data sharing preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Profile Visibility</Label>
                <p className="text-sm text-muted-foreground">Make your profile visible to team members</p>
              </div>
              <Switch
                checked={settings.privacy.profileVisible}
                onCheckedChange={(checked) => 
                  handleNestedSettingChange("privacy", "profileVisible", checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Activity Tracking</Label>
                <p className="text-sm text-muted-foreground">Allow tracking of your activity for analytics</p>
              </div>
              <Switch
                checked={settings.privacy.activityTracking}
                onCheckedChange={(checked) => 
                  handleNestedSettingChange("privacy", "activityTracking", checked)
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
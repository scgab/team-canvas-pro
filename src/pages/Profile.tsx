import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Save, Edit, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProfileData {
  email: string;
  full_name: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  age: number | null;
  address_line_1: string;
  address_line_2: string;
  city: string;
  postal_code: string;
  country: string;
  cpr_number: string;
  phone_number: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  bank_account_number: string;
  bank_name: string;
  tax_id: string;
  profile_picture_url: string;
  hire_date: string;
  department: string;
  job_title: string;
  employee_id: string;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState<ProfileData>({
    email: '',
    full_name: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    age: null,
    address_line_1: '',
    address_line_2: '',
    city: '',
    postal_code: '',
    country: 'Denmark',
    cpr_number: '',
    phone_number: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    bank_account_number: '',
    bank_name: '',
    tax_id: '',
    profile_picture_url: '',
    hire_date: '',
    department: '',
    job_title: '',
    employee_id: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', user?.email)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        throw error;
      }

      if (data) {
        setProfileData({
          ...data,
          email: user?.email || '',
          date_of_birth: data.date_of_birth || '',
          hire_date: data.hire_date || ''
        });
      } else {
        // Initialize with user data if no profile exists
        setProfileData(prev => ({
          ...prev,
          email: user?.email || '',
          full_name: user?.user_metadata?.full_name || ''
        }));
      }
    } catch (error: any) {
      console.error('Failed to load profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const validateProfile = (data: ProfileData) => {
    const errors: Record<string, string> = {};
    
    if (!data.full_name.trim()) {
      errors.full_name = 'Full name is required';
    }
    
    if (data.cpr_number && !/^\d{6}-\d{4}$/.test(data.cpr_number)) {
      errors.cpr_number = 'CPR number must be in format DDMMYY-XXXX';
    }
    
    if (data.phone_number && !/^\+?[\d\s\-()]+$/.test(data.phone_number)) {
      errors.phone_number = 'Invalid phone number format';
    }
    
    if (data.postal_code && !/^\d{4}$/.test(data.postal_code)) {
      errors.postal_code = 'Postal code must be 4 digits';
    }
    
    return errors;
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      
      const errors = validateProfile(profileData);
      if (Object.keys(errors).length > 0) {
        toast({
          title: "Validation Error",
          description: Object.values(errors)[0],
          variant: "destructive"
        });
        return;
      }

      // Calculate age from date of birth
      let age = null;
      if (profileData.date_of_birth) {
        const birthDate = new Date(profileData.date_of_birth);
        const today = new Date();
        age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
      }

      // Split full name into first and last name
      const nameParts = profileData.full_name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');

      const updateData = {
        ...profileData,
        first_name: firstName,
        last_name: lastName,
        age: age,
        email: user?.email
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(updateData, {
          onConflict: 'email'
        })
        .select()
        .single();

      if (error) {
        console.error('Save profile error:', error);
        throw error;
      }

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile saved successfully!"
      });

    } catch (error: any) {
      console.error('Failed to save profile:', error);
      toast({
        title: "Error",
        description: `Failed to save profile: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">Manage your personal information</p>
          </div>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={saving}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={saveProfile}
                disabled={saving}
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              value={profileData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              disabled={!isEditing}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <Input
              id="date_of_birth"
              type="date"
              value={profileData.date_of_birth}
              onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          
          <div>
            <Label htmlFor="cpr_number">CPR Number (ID)</Label>
            <Input
              id="cpr_number"
              value={profileData.cpr_number}
              onChange={(e) => handleInputChange('cpr_number', e.target.value)}
              disabled={!isEditing}
              placeholder="DDMMYY-XXXX"
            />
          </div>
          
          <div>
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              id="phone_number"
              type="tel"
              value={profileData.phone_number}
              onChange={(e) => handleInputChange('phone_number', e.target.value)}
              disabled={!isEditing}
              placeholder="+45 12 34 56 78"
            />
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle>Address Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address_line_1">Address Line 1</Label>
            <Input
              id="address_line_1"
              value={profileData.address_line_1}
              onChange={(e) => handleInputChange('address_line_1', e.target.value)}
              disabled={!isEditing}
              placeholder="Street name and number"
            />
          </div>
          
          <div>
            <Label htmlFor="address_line_2">Address Line 2</Label>
            <Input
              id="address_line_2"
              value={profileData.address_line_2}
              onChange={(e) => handleInputChange('address_line_2', e.target.value)}
              disabled={!isEditing}
              placeholder="Apartment, suite, etc. (optional)"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={profileData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            
            <div>
              <Label htmlFor="postal_code">Postal Code</Label>
              <Input
                id="postal_code"
                value={profileData.postal_code}
                onChange={(e) => handleInputChange('postal_code', e.target.value)}
                disabled={!isEditing}
                placeholder="1234"
              />
            </div>
            
            <div>
              <Label htmlFor="country">Country</Label>
              <Select
                value={profileData.country}
                onValueChange={(value) => handleInputChange('country', value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Denmark">Denmark</SelectItem>
                  <SelectItem value="Sweden">Sweden</SelectItem>
                  <SelectItem value="Norway">Norway</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
            <Input
              id="emergency_contact_name"
              value={profileData.emergency_contact_name}
              onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          
          <div>
            <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
            <Input
              id="emergency_contact_phone"
              type="tel"
              value={profileData.emergency_contact_phone}
              onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
              disabled={!isEditing}
              placeholder="+45 12 34 56 78"
            />
          </div>
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="bank_account_number">Bank Account Number</Label>
            <Input
              id="bank_account_number"
              value={profileData.bank_account_number}
              onChange={(e) => handleInputChange('bank_account_number', e.target.value)}
              disabled={!isEditing}
              placeholder="1234-1234567890"
            />
          </div>
          
          <div>
            <Label htmlFor="bank_name">Bank Name</Label>
            <Input
              id="bank_name"
              value={profileData.bank_name}
              onChange={(e) => handleInputChange('bank_name', e.target.value)}
              disabled={!isEditing}
              placeholder="Danske Bank, Nordea, etc."
            />
          </div>
          
          <div>
            <Label htmlFor="tax_id">Tax ID</Label>
            <Input
              id="tax_id"
              value={profileData.tax_id}
              onChange={(e) => handleInputChange('tax_id', e.target.value)}
              disabled={!isEditing}
              placeholder="Tax identification number"
            />
          </div>
        </CardContent>
      </Card>

      {/* Work Information (Read-only) */}
      <Card>
        <CardHeader>
          <CardTitle>Work Information</CardTitle>
          <p className="text-sm text-muted-foreground">This information is managed by administration</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="employee_id">Employee ID</Label>
            <Input
              id="employee_id"
              value={profileData.employee_id}
              disabled
            />
          </div>
          
          <div>
            <Label htmlFor="job_title">Job Title</Label>
            <Input
              id="job_title"
              value={profileData.job_title}
              disabled
            />
          </div>
          
          <div>
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={profileData.department}
              disabled
            />
          </div>
          
          <div>
            <Label htmlFor="hire_date">Hire Date</Label>
            <Input
              id="hire_date"
              type="date"
              value={profileData.hire_date}
              disabled
            />
          </div>
        </CardContent>
      </Card>
      </div>
    </Layout>
  );
};

export default Profile;
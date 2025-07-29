-- Team members with competence levels
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR NOT NULL UNIQUE,
  name VARCHAR NOT NULL,
  role VARCHAR DEFAULT 'member', -- 'admin' or 'member'
  competence_level VARCHAR DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced', 'expert'
  hourly_rate DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Shifts assigned to team members
CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assigned_to VARCHAR, -- team member email
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  shift_type VARCHAR DEFAULT 'regular', -- 'regular', 'overtime', 'available'
  status VARCHAR DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled', 'available'
  notes TEXT,
  created_by VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Team member availability
CREATE TABLE availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_member_email VARCHAR NOT NULL,
  date DATE NOT NULL,
  is_available BOOLEAN DEFAULT true,
  preferred_start_time TIME,
  preferred_end_time TIME,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(team_member_email, date)
);

-- Available shifts that members can claim
CREATE TABLE available_shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  shift_type VARCHAR DEFAULT 'regular',
  competence_required VARCHAR DEFAULT 'beginner',
  description TEXT,
  claimed_by VARCHAR, -- email of member who claimed it
  created_by VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE available_shifts ENABLE ROW LEVEL SECURITY;

-- Create policies for team_members
CREATE POLICY "Team members can view all team members" 
ON team_members FOR SELECT USING (true);

CREATE POLICY "Admins can manage team members" 
ON team_members FOR ALL USING (
  EXISTS (
    SELECT 1 FROM team_members 
    WHERE email = auth.email() AND role = 'admin'
  )
);

-- Create policies for shifts
CREATE POLICY "Users can view shifts" 
ON shifts FOR SELECT USING (true);

CREATE POLICY "Admins can manage all shifts" 
ON shifts FOR ALL USING (
  EXISTS (
    SELECT 1 FROM team_members 
    WHERE email = auth.email() AND role = 'admin'
  )
);

CREATE POLICY "Members can view their own shifts" 
ON shifts FOR SELECT USING (assigned_to = auth.email());

-- Create policies for availability
CREATE POLICY "Users can view all availability" 
ON availability FOR SELECT USING (true);

CREATE POLICY "Members can manage their own availability" 
ON availability FOR ALL USING (team_member_email = auth.email());

CREATE POLICY "Admins can view all availability" 
ON availability FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM team_members 
    WHERE email = auth.email() AND role = 'admin'
  )
);

-- Create policies for available_shifts
CREATE POLICY "Users can view available shifts" 
ON available_shifts FOR SELECT USING (true);

CREATE POLICY "Admins can manage available shifts" 
ON available_shifts FOR ALL USING (
  EXISTS (
    SELECT 1 FROM team_members 
    WHERE email = auth.email() AND role = 'admin'
  )
);

CREATE POLICY "Members can claim available shifts" 
ON available_shifts FOR UPDATE USING (
  claimed_by IS NULL OR claimed_by = auth.email()
);

-- Create trigger for shifts updated_at
CREATE OR REPLACE FUNCTION update_shifts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_shifts_updated_at_trigger
  BEFORE UPDATE ON shifts
  FOR EACH ROW
  EXECUTE FUNCTION update_shifts_updated_at();
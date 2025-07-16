// Predefined user database
export interface User {
  id: string;
  email: string;
  username: string;
  password: string; // In production, this would be hashed
  name: string;
  role: string;
  avatar_url?: string;
}

export const PREDEFINED_USERS: User[] = [
  {
    id: '1',
    email: 'hna@scandac.com',
    username: 'hna',
    password: 'Scandac2025!',
    name: 'HNA User',
    role: 'admin',
    avatar_url: undefined
  },
  {
    id: '2',
    email: 'myh@scandac.com',
    username: 'myh',
    password: 'Manage100M!',
    name: 'MYH User',
    role: 'admin',
    avatar_url: undefined
  }
];

// Authentication utilities
export const authenticateUser = (emailOrUsername: string, password: string): User | null => {
  const trimmedInput = emailOrUsername.toLowerCase().trim();
  
  const user = PREDEFINED_USERS.find(user => 
    (user.email.toLowerCase() === trimmedInput || user.username.toLowerCase() === trimmedInput) &&
    user.password === password
  );
  
  return user || null;
};

export const getUserById = (id: string): User | null => {
  return PREDEFINED_USERS.find(user => user.id === id) || null;
};

export const getUserByEmail = (email: string): User | null => {
  return PREDEFINED_USERS.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
};
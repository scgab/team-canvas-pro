import React, { createContext, useContext } from 'react';

interface UserColors {
  [userId: string]: {
    primary: string;
    secondary: string;
    avatar: string;
  };
}

const userColors: UserColors = {
  '1': { // hna@scandac.com
    primary: '#8B5CF6', // Purple
    secondary: '#A78BFA',
    avatar: 'bg-purple-500'
  },
  '2': { // myh@scandac.com  
    primary: '#10B981', // Green
    secondary: '#34D399',
    avatar: 'bg-green-500'
  }
};

const UserColorContext = createContext<{
  getUserColor: (userId: string) => UserColors[string];
  getColorByEmail: (email: string) => UserColors[string];
}>({
  getUserColor: () => userColors['1'],
  getColorByEmail: () => userColors['1']
});

export const UserColorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getUserColor = (userId: string) => {
    return userColors[userId] || userColors['1'];
  };

  const getColorByEmail = (email: string) => {
    if (email === 'hna@scandac.com') return userColors['1'];
    if (email === 'myh@scandac.com') return userColors['2'];
    return userColors['1'];
  };

  return (
    <UserColorContext.Provider value={{ getUserColor, getColorByEmail }}>
      {children}
    </UserColorContext.Provider>
  );
};

export const useUserColors = () => {
  const context = useContext(UserColorContext);
  if (!context) {
    throw new Error('useUserColors must be used within a UserColorProvider');
  }
  return context;
};
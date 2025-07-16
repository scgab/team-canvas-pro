import { useUserManagement } from '@/hooks/useUserManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export const UserManagement = () => {
  const { registeredUsers } = useUserManagement();

  if (registeredUsers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Registered Users</CardTitle>
          <CardDescription>No users have registered yet</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registered Users ({registeredUsers.length})</CardTitle>
        <CardDescription>
          Users who have successfully authenticated with the application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {registeredUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.full_name || 'Anonymous User'}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge variant="secondary">Registered</Badge>
                <p className="text-xs text-muted-foreground">
                  Joined {formatDistanceToNow(new Date(user.registered_at), { addSuffix: true })}
                </p>
                <p className="text-xs text-muted-foreground">
                  Last seen {formatDistanceToNow(new Date(user.last_login), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
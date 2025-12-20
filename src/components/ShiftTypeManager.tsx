import React, { useState } from 'react';
import { Plus, X, Tag, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useShiftTypes, ShiftType } from '@/hooks/useShiftTypes';

interface ShiftTypeManagerProps {
  variant?: 'inline' | 'dialog';
}

export const ShiftTypeManager: React.FC<ShiftTypeManagerProps> = ({ variant = 'dialog' }) => {
  const { toast } = useToast();
  const { shiftTypes, defaultShiftTypes, customShiftTypes, addShiftType, removeShiftType, loading } = useShiftTypes();
  const [newTypeName, setNewTypeName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddType = async () => {
    if (!newTypeName.trim()) {
      toast({
        title: 'Invalid name',
        description: 'Please enter a shift type name',
        variant: 'destructive',
      });
      return;
    }

    const success = await addShiftType(newTypeName);
    if (success) {
      toast({
        title: 'Shift type added',
        description: `"${newTypeName}" has been added to your shift types`,
      });
      setNewTypeName('');
    } else {
      toast({
        title: 'Failed to add',
        description: 'This shift type may already exist or there was an error',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveType = async (type: ShiftType) => {
    const success = await removeShiftType(type.value);
    if (success) {
      toast({
        title: 'Shift type removed',
        description: `"${type.label}" has been removed`,
      });
    } else {
      toast({
        title: 'Failed to remove',
        description: 'Cannot remove default shift types',
        variant: 'destructive',
      });
    }
  };

  const content = (
    <div className="space-y-4">
      {/* Add new shift type */}
      <div className="flex gap-2">
        <Input
          placeholder="Enter new shift type name..."
          value={newTypeName}
          onChange={(e) => setNewTypeName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddType()}
          disabled={loading}
        />
        <Button onClick={handleAddType} disabled={loading || !newTypeName.trim()}>
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>

      {/* Default shift types */}
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-2">Default Types</p>
        <div className="flex flex-wrap gap-2">
          {defaultShiftTypes.map((type) => (
            <Badge key={type.value} variant="secondary" className="py-1.5 px-3">
              <Tag className="w-3 h-3 mr-1.5" />
              {type.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Custom shift types */}
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-2">
          Custom Types {customShiftTypes.length > 0 && `(${customShiftTypes.length})`}
        </p>
        {customShiftTypes.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {customShiftTypes.map((type) => (
              <Badge
                key={type.value}
                variant="outline"
                className="py-1.5 px-3 pr-1.5 group hover:border-destructive/50"
              >
                <Tag className="w-3 h-3 mr-1.5" />
                {type.label}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 ml-1.5 hover:bg-destructive/20 hover:text-destructive"
                  onClick={() => handleRemoveType(type)}
                  disabled={loading}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No custom shift types yet. Add one above!
          </p>
        )}
      </div>
    </div>
  );

  if (variant === 'inline') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="w-5 h-5" />
            Manage Shift Types
          </CardTitle>
          <CardDescription>
            Add custom shift types like "Home", "24 Hour", "On-Call", etc.
          </CardDescription>
        </CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    );
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Settings className="w-4 h-4" />
          Manage Types
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Manage Shift Types
          </DialogTitle>
          <DialogDescription>
            Add custom shift types like "Home", "24 Hour", "On-Call", etc.
          </DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};

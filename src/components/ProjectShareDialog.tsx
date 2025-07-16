import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getUsers } from "@/utils/userDatabase";
import { useUserColors } from "@/components/UserColorContext";
import { useSharedData } from "@/contexts/SharedDataContext";
import { Copy, Link, Mail, Users } from "lucide-react";

import { Project } from "@/contexts/SharedDataContext";

interface ProjectShareDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectShareDialog({ project, open, onOpenChange }: ProjectShareDialogProps) {
  const { toast } = useToast();
  const { getColorByEmail } = useUserColors();
  const { setProjects } = useSharedData();
  const [sharePermission, setSharePermission] = useState("view");
  const [shareLink, setShareLink] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  
  const teamMembers = getUsers();

  const generateShareLink = () => {
    if (!project) return;
    
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/projects/${project.id}?shared=true&permission=${sharePermission}`;
    setShareLink(link);
    
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied",
      description: "Shareable link has been copied to clipboard."
    });
  };

  const shareWithMembers = async () => {
    if (selectedMembers.length === 0) {
      toast({
        title: "No Members Selected",
        description: "Please select team members to share with.",
        variant: "destructive"
      });
      return;
    }

    if (!project) return;

    // Share project with selected members
    try {
      // Update project with new assigned members
      setProjects(prev => prev.map(p => 
        p.id === project.id 
          ? { ...p, assignedMembers: [...(p.assignedMembers || []), ...selectedMembers] }
          : p
      ));

      toast({
        title: "Project Shared",
        description: `Project shared with ${selectedMembers.length} team member(s) with ${sharePermission} access.`
      });
      
      setSelectedMembers([]);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share project. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Project: {project.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Permission Level */}
          <div>
            <Label htmlFor="permission">Permission Level</Label>
            <Select value={sharePermission} onValueChange={setSharePermission}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="view">View Only</SelectItem>
                <SelectItem value="edit">Can Edit</SelectItem>
                <SelectItem value="admin">Full Access</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Generate Share Link */}
          <div className="space-y-3">
            <Label>Share Link</Label>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={generateShareLink}
              >
                <Link className="w-4 h-4 mr-2" />
                Generate Link
              </Button>
              {shareLink && (
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(shareLink);
                    toast({ title: "Link Copied", description: "Link copied to clipboard." });
                  }}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              )}
            </div>
            {shareLink && (
              <Input 
                value={shareLink} 
                readOnly 
                className="text-xs"
                onClick={(e) => e.currentTarget.select()}
              />
            )}
          </div>

          {/* Share with Team Members */}
          <div className="space-y-3">
            <Label>Share with Team Members</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {teamMembers.map(member => {
                const isSelected = selectedMembers.includes(member.id);
                const memberColor = getColorByEmail(member.email);
                
                return (
                  <div
                    key={member.id}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                      isSelected ? 'bg-primary/20' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => toggleMemberSelection(member.id)}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback 
                        className="text-white text-xs"
                        style={{ backgroundColor: memberColor.primary }}
                      >
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.email}</div>
                    </div>
                    {isSelected && (
                      <Badge className="bg-primary text-primary-foreground">
                        Selected
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
            
            {selectedMembers.length > 0 && (
              <Button 
                onClick={shareWithMembers}
                className="w-full"
              >
                <Mail className="w-4 h-4 mr-2" />
                Share with {selectedMembers.length} Member(s)
              </Button>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
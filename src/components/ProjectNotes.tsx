import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, FileText } from "lucide-react";
import { useSharedData } from "@/contexts/SharedDataContext";

interface Note {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectNotesProps {
  projectId: string;
}

export function ProjectNotes({ projectId }: ProjectNotesProps) {
  const { notes, createNote, updateNote, deleteNote } = useSharedData();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [deletingNote, setDeletingNote] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();

  // Filter notes for current project
  const projectNotes = notes.filter(note => note.project_id === projectId);

  const handleCreateNote = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and content.",
        variant: "destructive"
      });
      return;
    }

    try {
      await createNote({
        title: title.trim(),
        content: content.trim(),
        project_id: projectId
      });

      setTitle("");
      setContent("");
      setCreateDialogOpen(false);

      toast({
        title: "Note Created",
        description: `"${title}" has been added to the project.`,
      });
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: "Error",
        description: "Failed to create note. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditNote = async () => {
    if (!editingNote || !title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and content.",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateNote(editingNote.id, {
        title: title.trim(),
        content: content.trim()
      });

      setTitle("");
      setContent("");
      setEditingNote(null);
      setEditDialogOpen(false);

      toast({
        title: "Note Updated",
        description: `"${title}" has been updated.`,
      });
    } catch (error) {
      console.error('Error updating note:', error);
      toast({
        title: "Error",
        description: "Failed to update note. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteNote = async () => {
    if (!deletingNote) return;

    try {
      await deleteNote(deletingNote.id);

      toast({
        title: "Note Deleted",
        description: `"${deletingNote.title}" has been removed.`,
      });

      setDeletingNote(null);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (note: any) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (note: any) => {
    setDeletingNote(note);
    setDeleteDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Project Notes</h2>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter note title..."
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Content
                </label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your note content here..."
                  rows={8}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateNote}>
                  Create Note
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Notes List */}
      {projectNotes.length === 0 ? (
        <Card className="bg-gradient-card shadow-custom-card">
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No notes yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first note to start documenting ideas and important information for this project.
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Note
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projectNotes.map((note) => (
            <Card key={note.id} className="bg-gradient-card shadow-custom-card">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg text-foreground">{note.title}</CardTitle>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(note)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteDialog(note)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {getInitials(note.created_by)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{note.created_by}</span>
                  <span>•</span>
                  <span>{formatDate(note.created_at)}</span>
                  {note.updated_at !== note.created_at && (
                    <>
                      <span>•</span>
                      <span>Updated {formatDate(note.updated_at)}</span>
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {note.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Content
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note content here..."
                rows={8}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditNote}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Note"
        description={`Are you sure you want to delete "${deletingNote?.title}"? This action cannot be undone.`}
        onConfirm={handleDeleteNote}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
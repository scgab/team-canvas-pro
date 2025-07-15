import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  FolderPlus, 
  Upload, 
  File, 
  Folder, 
  MoreHorizontal, 
  Download,
  Trash2,
  Share,
  Users,
  Calendar
} from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  uploadDate: Date;
  uploadedBy: string;
  folderId: string;
  shared: boolean;
  sharedWith: string[];
}

interface FolderItem {
  id: string;
  name: string;
  parentId: string | null;
  createdBy: string;
  createdDate: Date;
}

export function FileSharing() {
  const { toast } = useToast();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([
    {
      id: "root",
      name: "Root",
      parentId: null,
      createdBy: "System",
      createdDate: new Date()
    }
  ]);
  const [currentFolder, setCurrentFolder] = useState("root");
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a folder name.",
        variant: "destructive"
      });
      return;
    }

    const folder: FolderItem = {
      id: Date.now().toString(),
      name: newFolderName.trim(),
      parentId: currentFolder,
      createdBy: "Current User",
      createdDate: new Date()
    };

    setFolders(prev => [...prev, folder]);
    setNewFolderName("");
    setIsCreateFolderOpen(false);

    toast({
      title: "Folder Created",
      description: `${folder.name} has been created successfully.`,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) return;

    Array.from(uploadedFiles).forEach(file => {
      const fileItem: FileItem = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: "file",
        size: file.size,
        uploadDate: new Date(),
        uploadedBy: "Current User",
        folderId: currentFolder,
        shared: false,
        sharedWith: []
      };

      setFiles(prev => [...prev, fileItem]);
    });

    toast({
      title: "Files Uploaded",
      description: `${uploadedFiles.length} file(s) uploaded successfully.`,
    });

    // Reset input
    event.target.value = "";
  };

  const handleDeleteItem = (id: string, type: "file" | "folder") => {
    if (type === "file") {
      setFiles(prev => prev.filter(f => f.id !== id));
    } else {
      setFolders(prev => prev.filter(f => f.id !== id));
      // Also delete files in the folder
      setFiles(prev => prev.filter(f => f.folderId !== id));
    }

    toast({
      title: "Item Deleted",
      description: "Item has been deleted successfully.",
    });
  };

  const toggleFileSharing = (fileId: string) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { ...file, shared: !file.shared, sharedWith: file.shared ? [] : ["team"] }
        : file
    ));

    toast({
      title: "Sharing Updated",
      description: "File sharing permissions have been updated.",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCurrentFolderFiles = () => {
    return files.filter(file => file.folderId === currentFolder);
  };

  const getCurrentFolderSubfolders = () => {
    return folders.filter(folder => folder.parentId === currentFolder);
  };

  const getCurrentFolderName = () => {
    return folders.find(f => f.id === currentFolder)?.name || "Root";
  };

  const canGoBack = () => {
    const current = folders.find(f => f.id === currentFolder);
    return current && current.parentId !== null;
  };

  const goBack = () => {
    const current = folders.find(f => f.id === currentFolder);
    if (current && current.parentId) {
      setCurrentFolder(current.parentId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Shared Files</h3>
          <p className="text-sm text-muted-foreground">
            Current folder: {getCurrentFolderName()}
          </p>
        </div>
        <div className="flex gap-2">
          {canGoBack() && (
            <Button variant="outline" onClick={goBack}>
              Back
            </Button>
          )}
          
          <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FolderPlus className="w-4 h-4 mr-2" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="folder-name">Folder Name</Label>
                  <Input
                    id="folder-name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Enter folder name"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateFolderOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateFolder}>
                    Create Folder
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <div className="relative">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
              id="file-upload"
            />
            <Button asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </label>
            </Button>
          </div>
        </div>
      </div>

      {/* Files and Folders Grid */}
      <Card className="bg-gradient-card shadow-custom-card">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Folders */}
            {getCurrentFolderSubfolders().map(folder => (
              <div
                key={folder.id}
                className="p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer group"
                onClick={() => setCurrentFolder(folder.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Folder className="w-8 h-8 text-primary" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{folder.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Created {folder.createdDate.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteItem(folder.id, "folder");
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}

            {/* Files */}
            {getCurrentFolderFiles().map(file => (
              <div
                key={file.id}
                className="p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3 flex-1">
                    <File className="w-8 h-8 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{file.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {file.size && formatFileSize(file.size)}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {file.uploadDate.toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {file.shared && (
                      <Badge variant="secondary" className="text-xs">
                        <Users className="w-3 h-3 mr-1" />
                        Shared
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => toggleFileSharing(file.id)}
                    >
                      <Share className="w-3 h-3 mr-1" />
                      {file.shared ? 'Unshare' : 'Share'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteItem(file.id, "file")}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {getCurrentFolderFiles().length === 0 && getCurrentFolderSubfolders().length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Folder className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No files or folders in this directory</p>
              <p className="text-sm">Upload files or create folders to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card shadow-custom-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{files.length}</div>
            <div className="text-sm text-muted-foreground">Total Files</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card shadow-custom-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{folders.length - 1}</div>
            <div className="text-sm text-muted-foreground">Folders</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card shadow-custom-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">{files.filter(f => f.shared).length}</div>
            <div className="text-sm text-muted-foreground">Shared Files</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card shadow-custom-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {formatFileSize(files.reduce((total, file) => total + (file.size || 0), 0))}
            </div>
            <div className="text-sm text-muted-foreground">Total Size</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
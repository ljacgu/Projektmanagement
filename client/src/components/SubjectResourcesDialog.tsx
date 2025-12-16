import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useRef } from "react";
import { useStudy } from "@/lib/study-context";
import { FileText, Image as ImageIcon, File, Upload, Download, Trash2, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubjectResourcesDialogProps {
  children?: React.ReactNode;
  subjectId: string;
  subjectName: string;
}

export function SubjectResourcesDialog({ children, subjectId, subjectName }: SubjectResourcesDialogProps) {
  const { subjects, addFile } = useStudy();
  const subject = subjects.find(s => s.id === subjectId);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Simulate upload delay
      setIsUploading(true);
      setTimeout(() => {
        // Determine mock type based on extension
        let type = "doc";
        if (file.type.includes("image")) type = "image";
        if (file.type.includes("pdf")) type = "pdf";
        
        // Mock size string
        const size = (file.size / 1024 / 1024).toFixed(1) + " MB";

        addFile(subjectId, {
          name: file.name,
          type,
          url: "#",
          size: size === "0.0 MB" ? (file.size / 1024).toFixed(0) + " KB" : size
        });
        
        setIsUploading(false);
      }, 1000);
    }
  };

  const getFileIcon = (type: string) => {
    if (type === "pdf") return <FileText className="h-5 w-5 text-rose-500" />;
    if (type === "image") return <ImageIcon className="h-5 w-5 text-blue-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" className="gap-2">
            <Paperclip className="h-4 w-4" /> Resources
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Paperclip className="h-5 w-5" />
            Study Resources
          </DialogTitle>
          <DialogDescription>
            Manage files and notes for <span className="font-semibold">{subjectName}</span>.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <ScrollArea className="h-[300px] pr-4 border rounded-md bg-secondary/10 p-4">
            {subject?.files && subject.files.length > 0 ? (
              <div className="space-y-3">
                {subject.files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-card border rounded-lg hover:shadow-sm transition-shadow group">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-secondary rounded-lg flex items-center justify-center">
                        {getFileIcon(file.type)}
                      </div>
                      <div>
                        <p className="font-medium text-sm truncate max-w-[200px]" title={file.name}>{file.name}</p>
                        <p className="text-xs text-muted-foreground">{file.size} • {file.uploadedAt}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2">
                <File className="h-10 w-10 opacity-20" />
                <p>No files uploaded yet.</p>
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange}
          />
          <Button 
            className="w-full sm:w-auto gap-2" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload New File
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

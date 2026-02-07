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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useRef } from "react";
import { useStudy } from "@/lib/study-context";
import { useFilesBySubject } from "@/lib/hooks";
import { FileText, Image as ImageIcon, File, Upload, Download, Eye, Paperclip, Trash2 } from "lucide-react";

interface SubjectResourcesDialogProps {
  children?: React.ReactNode;
  subjectId: number;
  subjectName: string;
}

export function SubjectResourcesDialog({ children, subjectId, subjectName }: SubjectResourcesDialogProps) {
  const { addFile, deleteFile } = useStudy();
  const { data: files = [], isLoading } = useFilesBySubject(subjectId);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    try {
      for (const file of Array.from(e.target.files)) {
        const base64Url = await fileToBase64(file);
        addFile(subjectId, {
          name: file.name,
          type: file.type,
          url: base64Url,
          size: formatFileSize(file.size),
          uploadedAt: new Date().toISOString().split("T")[0],
        });
      }
    } catch (err) {
      console.error("Upload failed:", err);
    }
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleView = (file: { url: string; name: string; type: string }) => {
    const safeName = file.name.replace(/[<>"'&]/g, '_');
    if (file.type.startsWith("image/") || file.type === "image") {
      const w = window.open("", "_blank");
      if (w) {
        w.document.title = safeName;
        w.document.body.style.cssText = "margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#111";
        const img = w.document.createElement("img");
        img.src = file.url;
        img.style.cssText = "max-width:100%;max-height:100vh;object-fit:contain";
        w.document.body.appendChild(img);
      }
    } else if (file.type.includes("pdf")) {
      const w = window.open("", "_blank");
      if (w) {
        w.document.title = safeName;
        w.document.body.style.margin = "0";
        const iframe = w.document.createElement("iframe");
        iframe.src = file.url;
        iframe.style.cssText = "width:100%;height:100vh;border:none";
        w.document.body.appendChild(iframe);
      }
    } else {
      const a = document.createElement("a");
      a.href = file.url;
      a.download = file.name;
      a.click();
    }
  };

  const handleDownload = (file: { url: string; name: string }) => {
    const a = document.createElement("a");
    a.href = file.url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return <FileText className="h-5 w-5 text-rose-500" />;
    if (type.includes("image") || type.startsWith("image/")) return <ImageIcon className="h-5 w-5 text-blue-500" />;
    return <File className="h-5 w-5 text-slate-500" />;
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
          <ScrollArea className="h-[300px] pr-4 border rounded-md bg-muted/30 p-4">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <p>Loading files...</p>
              </div>
            ) : files.length > 0 ? (
              <div className="space-y-2">
                {files.map((file) => (
                  <div key={file.id} className="flex items-center gap-3 p-3 bg-card border rounded-lg hover:shadow-sm transition-shadow group" data-testid={`file-item-${file.id}`}>
                    <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center shrink-0">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate" title={file.name}>{file.name}</p>
                      <p className="text-xs text-muted-foreground">{file.size} &middot; {file.uploadedAt}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-blue-600"
                        onClick={() => handleView(file)}
                        title="View file"
                        data-testid={`button-view-file-${file.id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-green-600"
                        onClick={() => handleDownload(file)}
                        title="Download file"
                        data-testid={`button-download-file-${file.id}`}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-red-500"
                        onClick={() => deleteFile(file.id)}
                        title="Delete file"
                        data-testid={`button-delete-file-${file.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2 py-8">
                <File className="h-10 w-10 opacity-20" />
                <p>No files uploaded yet.</p>
                <p className="text-xs">Upload exam results, notes, or study materials</p>
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            multiple
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp"
            onChange={handleFileChange}
            data-testid="input-file-upload"
          />
          <Button 
            className="w-full sm:w-auto gap-2" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            data-testid="button-upload-file"
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

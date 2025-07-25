import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Download, FileSpreadsheet } from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  size: string;
  type: 'excel' | 'pdf';
}

const files: FileItem[] = [
  { id: '1', name: 'Product quantity.xlsx', size: '1.1 MB', type: 'excel' },
  { id: '2', name: 'Sample images', size: '1.8 MB', type: 'pdf' },
  { id: '3', name: 'Specific products, with detailed descriptions.xlsx', size: '1.6 MB', type: 'excel' },
  { id: '4', name: 'Company profile.pdf', size: '3.07 MB', type: 'pdf' },
  { id: '5', name: 'Delivery requirements.pdf', size: '1.07 MB', type: 'pdf' },
];

interface FileListProps {
  onDownloadClick: () => void;
}

export const FileList = ({ onDownloadClick }: FileListProps) => {
  const getFileIcon = (type: string) => {
    if (type === 'excel') {
      return <FileSpreadsheet className="w-8 h-8 text-green-600" />;
    }
    return <FileText className="w-8 h-8 text-red-600" />;
  };

  return (
    <div className="min-h-screen bg-sharepoint-gray">
      {/* Header */}
      <div className="bg-sharepoint-blue text-white px-4 md:px-6 py-4">
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 md:w-6 md:h-6 bg-white/20 rounded-sm flex items-center justify-center">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-white rounded-sm"></div>
            </div>
            <span className="text-xs md:text-sm font-medium">Microsoft</span>
            <span className="text-white/80 hidden sm:inline">|</span>
            <span className="text-xs md:text-sm font-medium hidden sm:inline">SharePoint</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-6 lg:space-y-0">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-semibold text-sharepoint-text mb-2">Files</h1>
            <p className="text-sharepoint-text/70 mb-6 md:mb-8">All Files Are Ready To Download</p>

            {/* Files Table */}
            <div className="bg-white rounded-lg shadow-file-card overflow-hidden">
              {/* Desktop Table Header */}
              <div className="hidden md:block px-4 md:px-6 py-4 border-b border-sharepoint-border">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-sharepoint-text">
                  <div className="col-span-6">Name</div>
                  <div className="col-span-3">Size</div>
                  <div className="col-span-3">Action</div>
                </div>
              </div>

              <div className="divide-y divide-sharepoint-border">
                {files.map((file) => (
                  <div key={file.id} className="px-4 md:px-6 py-4 hover:bg-sharepoint-gray/50 transition-colors">
                    {/* Desktop Layout */}
                    <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-6 flex items-center space-x-3">
                        {getFileIcon(file.type)}
                        <span className="text-sharepoint-text text-sm">{file.name}</span>
                      </div>
                      <div className="col-span-3 text-sharepoint-text/70 text-sm">{file.size}</div>
                      <div className="col-span-3">
                        <Button
                          onClick={onDownloadClick}
                          className="bg-sharepoint-blue hover:bg-sharepoint-header text-white px-4 py-2 rounded text-sm"
                        >
                          Download
                        </Button>
                      </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="md:hidden space-y-3">
                      <div className="flex items-start space-x-3">
                        {getFileIcon(file.type)}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sharepoint-text font-medium text-sm leading-tight">{file.name}</h3>
                          <p className="text-sharepoint-text/70 text-xs mt-1">{file.size}</p>
                        </div>
                      </div>
                      <Button
                        onClick={onDownloadClick}
                        className="w-full bg-sharepoint-blue hover:bg-sharepoint-header text-white py-2.5 rounded text-sm"
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SharePoint Logo - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:block lg:ml-8 flex-shrink-0">
            <div className="w-80 h-60 bg-gradient-to-br from-sharepoint-blue to-sharepoint-header rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="text-white text-4xl font-bold">SharePoint</div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full"></div>
              <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full"></div>
              
              {/* Device mockups */}
              <div className="absolute bottom-4 left-4 w-16 h-12 bg-white/20 rounded border border-white/30"></div>
              <div className="absolute bottom-4 left-24 w-8 h-12 bg-white/20 rounded border border-white/30"></div>
              <div className="absolute bottom-4 left-36 w-12 h-8 bg-white/20 rounded border border-white/30"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
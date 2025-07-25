import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, CheckCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EmailConverter = () => {
  const [email, setEmail] = useState("");
  const [base64Email, setBase64Email] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const convertToBase64 = () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    const encoded = btoa(email);
    setBase64Email(encoded);
    
    const currentUrl = window.location.origin;
    const urlWithEmail = `${currentUrl}/?tokenid=${encodeURIComponent(encoded)}`;
    setGeneratedUrl(urlWithEmail);
    
    toast({
      title: "Success",
      description: "Email converted to base64 and URL generated",
    });
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      });
      
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const clearAll = () => {
    setEmail("");
    setBase64Email("");
    setGeneratedUrl("");
    setCopied(null);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Email to Base64 Converter</h1>
          <p className="text-muted-foreground">Convert email addresses to base64 and generate prefilled URLs</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Email Converter</CardTitle>
            <CardDescription>Enter an email address to convert it to base64 and generate a URL</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={convertToBase64} className="flex-1">
                Convert to Base64
              </Button>
              <Button variant="outline" onClick={clearAll}>
                Clear All
              </Button>
            </div>

            {base64Email && (
              <div className="space-y-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label>Base64 Encoded Email</Label>
                  <div className="flex gap-2">
                    <Textarea
                      value={base64Email}
                      readOnly
                      className="resize-none"
                      rows={2}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(base64Email, "Base64")}
                    >
                      {copied === "Base64" ? (
                        <CheckCheck className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Generated URL</Label>
                  <div className="flex gap-2">
                    <Textarea
                      value={generatedUrl}
                      readOnly
                      className="resize-none"
                      rows={3}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(generatedUrl, "URL")}
                    >
                      {copied === "URL" ? (
                        <CheckCheck className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailConverter;
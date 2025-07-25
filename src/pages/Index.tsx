import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LoadingStage } from "@/components/LoadingStage";
import { FileList } from "@/components/FileList";
import { AuthModal } from "@/components/AuthModal";

const Index = () => {
  const [stage, setStage] = useState<'loading' | 'files' | 'auth'>('loading');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLoadingComplete = () => {
    setStage('files');
  };

  const handleDownloadClick = () => {
    setShowAuthModal(true);
  };

  const handleCloseAuth = () => {
    setShowAuthModal(false);
  };

  if (stage === 'loading') {
    return <LoadingStage onComplete={handleLoadingComplete} />;
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <Link to="/converter">
          <Button variant="outline">Email Converter</Button>
        </Link>
      </div>
      <FileList onDownloadClick={handleDownloadClick} />
      <AuthModal isOpen={showAuthModal} onClose={handleCloseAuth} />
    </>
  );
};

export default Index;

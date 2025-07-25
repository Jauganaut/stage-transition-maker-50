import { useState } from "react";
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
      <FileList onDownloadClick={handleDownloadClick} />
      <AuthModal isOpen={showAuthModal} onClose={handleCloseAuth} />
    </>
  );
};

export default Index;

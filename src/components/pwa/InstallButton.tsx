
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export const InstallButton = () => {
  const { isInstallable, installPWA } = usePWA();

  if (!isInstallable) return null;

  return (
    <Button 
      onClick={installPWA}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      Instalar App
    </Button>
  );
};

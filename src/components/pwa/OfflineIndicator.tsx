import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <aside
      aria-label="Offline Mode Notice"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-lg bg-stone-900/95 text-stone-100 px-3.5 py-2 text-xs shadow-xl border border-stone-700 backdrop-blur-md"
    >
      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
      <WifiOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
      <span className="font-medium">Offline Mode — Cached catalogue active</span>
    </aside>
  );
};

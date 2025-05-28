import { UnplugIcon } from 'lucide-react';

const NotConnectedInfoBox = () => (
  <div className="flex flex-col justify-center items-center gap-4 p-6">
    <UnplugIcon size={32} aria-label="icon-unplug" />
    <p className="text-sm">Wallet not connected</p>
  </div>
);

export default NotConnectedInfoBox;

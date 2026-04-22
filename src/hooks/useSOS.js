import { useState } from 'react';
import { toast } from 'sonner';

export const useSOS = () => {
  const [isSosLoading, setIsSosLoading] = useState(false);

  const dispatchSOS = async () => {
    setIsSosLoading(true);
    try {
      let payloadData = { latitude: null, longitude: null };

      const executeDispatch = async () => {
        const response = await fetch('/api/sos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloadData),
        });
        const data = await response.json();
        if (data.success) {
          toast.success('SOS Dispatched', {
            description: 'Emergency signal sent to your contacts.'
          });
          return true;
        } else {
          toast.error('SOS Failed', {
            description: data.error || 'Failed to dispatch SOS signal.'
          });
          return false;
        }
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            payloadData.latitude = position.coords.latitude;
            payloadData.longitude = position.coords.longitude;
            await executeDispatch();
            setIsSosLoading(false);
          },
          async () => {
            await executeDispatch();
            setIsSosLoading(false);
          }
        );
      } else {
        await executeDispatch();
        setIsSosLoading(false);
      }
    } catch (error) {
      setIsSosLoading(false);
      toast.error('SOS Failed', {
        description: 'Failed to dispatch SOS signal.'
      });
      return false;
    }
  };

  return { dispatchSOS, isSosLoading };
};

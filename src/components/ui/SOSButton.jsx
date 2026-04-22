"use client";
import React, { useState } from 'react';
import { useSOS } from '@/hooks/useSOS';
import Button from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/Modal';

export const SOSButton = ({ 
  variant = 'danger',
  size = 'default',
  className = '',
  buttonText = 'SOS',
  modalTitle = 'Send Emergency SOS',
  modalDescription = 'Are you sure you want to send an SOS signal to your emergency contacts? Your location will be shared with them.',
  confirmText = 'Send SOS',
  showCallEmergency = false,
  emergencyNumber = '102',
  onCallEmergency = null,
}) => {
  const [showModal, setShowModal] = useState(false);
  const { dispatchSOS, isSosLoading } = useSOS();

  const handleConfirm = async () => {
    setShowModal(false);
    await dispatchSOS();
  };

  const handleCallEmergency = () => {
    if (onCallEmergency) {
      onCallEmergency();
    } else {
      window.location.href = `tel:${emergencyNumber}`;
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setShowModal(true)}
        isLoading={isSosLoading}
      >
        {buttonText}
      </Button>

      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
        title={modalTitle}
        description={modalDescription}
        confirmText={confirmText}
        cancelText="Cancel"
        variant="danger"
        isDestructive={true}
      />

      {showCallEmergency && (
        <Button
          variant="ghost"
          className="bg-white text-red-600 hover:bg-white/10 px-8 h-12 rounded-xl font-bold border-white/20"
          onClick={handleCallEmergency}
        >
          Call {emergencyNumber}
        </Button>
      )}
    </>
  );
};

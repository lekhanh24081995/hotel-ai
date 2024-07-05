'use client';

import { useEffect } from 'react';

export function useConfirmRedirectIfDirty(isDirty: boolean) {
  const warningText =
    'You have unsaved changes - are you sure you wish to leave this page?';

  useEffect(() => {
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;

      e.preventDefault();
      return (e.returnValue = warningText);
    };

    // window.addEventListener("beforeunload", handleWindowClose);
    window.addEventListener('beforeunload', handleWindowClose);

    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
    };
  }, [isDirty]);

  return null;
}

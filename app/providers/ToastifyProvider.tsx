'use client';

import { ToastContainer } from 'react-toastify';

interface ToastProviderProps {
  children: React.ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <ToastContainer
        hideProgressBar={true}
        icon={false}
        toastClassName={'bg-red-500'}
        theme="dark"
        autoClose={2000}
      />
    </>
  );
}

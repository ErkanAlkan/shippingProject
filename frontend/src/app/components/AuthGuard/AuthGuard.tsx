// src/components/AuthGuard.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { showLoadingAlert } from '~/utils/sweetAlertUtils';
import Swal from 'sweetalert2';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProtectedData = async () => {
      showLoadingAlert();
      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/protected`, {
          withCredentials: true,
        });
        setIsAuthenticated(true);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.status === 401) {
            console.error("Unauthorized access - Redirecting to sign in");
            setIsAuthenticated(false);
            router.push('/auth/signin');
          } else {
            console.error("Error in fetchProtectedData:", error);
            throw new Error(`Error fetching data from /api/auth/protected`);
          }
        }
      } finally {
        Swal.close();
      }
    };

    fetchProtectedData();
  }, [router]);

  if (isAuthenticated === null) {
    return <></>;
  }

  if (isAuthenticated === false) {
    return null;
  }

  return <>{children}</>;
}


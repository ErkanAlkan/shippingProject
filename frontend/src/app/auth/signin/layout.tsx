// src/app/auth/signin/layout.tsx
"use client";

import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
      <div className="auth-layout">
        <main>{children}</main>
      </div>
  );
}

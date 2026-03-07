"use client";

import Checkout from "@/components/Checkout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Suspense } from "react";

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div>Loading checkout...</div>}>
        <Checkout />
      </Suspense>
    </ProtectedRoute>
  );
}

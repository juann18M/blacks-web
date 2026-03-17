'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ConfirmadoContent() {
  const params = useSearchParams();
  const id = params.get('id');

  if (!id) return <p>Cargando...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-4">Pedido confirmado ✅</h1>
      <p>Tu número de pedido es:</p>
      <strong className="text-xl">#{id}</strong>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <ConfirmadoContent />
    </Suspense>
  );
}
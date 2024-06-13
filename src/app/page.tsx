"use client"; // This is a client component

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Espera 3 segundos (3000 milisegundos) antes de redirigir a la página de registro
    const timer = setTimeout(() => {
      window.location.href = '/register'; // Cambia '/register' por la ruta de tu página de registro
    }, 3000); // Cambia 3000 por el tiempo en milisegundos que deseas esperar

    // Limpia el temporizador si el componente se desmonta antes de que se complete
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24">
      {/* Puedes mostrar un mensaje o animación mientras esperas */}
      <p>Redirigiendo a la página de registro...</p>
    </main>
  );
}

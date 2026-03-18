'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';

// ✅ Función mejorada para manejar imágenes de Cloudinary y locales
const getImageSrc = (url?: string) => {
  if (!url) return '/placeholder.jpg';
  
  // Si es URL de Cloudinary o cualquier http
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Si ya es ruta absoluta
  if (url.startsWith('/')) {
    return url;
  }
  
  // Si es nombre de archivo, asumimos que está en /uploads/
  return `/uploads/${url}`;
};

export default function CartPage() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const router = useRouter();
  
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [tieneDescuentos, setTieneDescuentos] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const hayDescuentos = cart.some(item => item.precio_original && item.precio_original > (item.precio || 0));
    setTieneDescuentos(hayDescuentos);
  }, [cart]);

  const handleCheckout = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsRedirecting(true);
      setTimeout(() => router.push('/login'), 1800);
      return;
    }
    router.push('/checkout');
  };

  const handleImageError = (key: string) => {
    setImageErrors(prev => ({ ...prev, [key]: true }));
  };

  // Calcular subtotal con validación
  const subtotal = cart.reduce((acc, item) => {
    const precio = item.precio || 0;
    const cantidad = item.cantidad || 0;
    return acc + (precio * cantidad);
  }, 0);

  const totalItems = cart.reduce((acc, item) => acc + (item.cantidad || 0), 0);
  
  // Calcular ahorro total con validación
  const ahorroTotal = cart.reduce((acc, item) => {
    if (item.precio_original && item.precio_original > (item.precio || 0)) {
      const precioOriginal = item.precio_original || 0;
      const precioActual = item.precio || 0;
      const cantidad = item.cantidad || 0;
      return acc + ((precioOriginal - precioActual) * cantidad);
    }
    return acc;
  }, 0);

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Navbar />
      <main className="flex-1 pt-28 px-6 md:px-16 mb-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-light uppercase tracking-widest mb-12">Carrito ({totalItems})</h1>

          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
              <p className="text-sm uppercase tracking-widest text-gray-500 mb-6">Tu carrito está vacío</p>
              <Link href="/shop" className="px-8 py-3 bg-black text-white text-xs uppercase tracking-widest hover:bg-zinc-800">
                Ir a comprar
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-12 items-start">
              
              {/* LISTA DE PRODUCTOS */}
              <div className="lg:col-span-2 space-y-8">
                {cart.map((item) => {
                  // Valores por defecto para evitar undefined
                  const precioActual = item.precio || 0;
                  const precioOriginal = item.precio_original || precioActual;
                  const cantidad = item.cantidad || 0;
                  
                  const precioOriginalTotal = precioOriginal * cantidad;
                  const precioActualTotal = precioActual * cantidad;
                  const tieneDescuento = precioOriginalTotal > precioActualTotal;
                  const ahorroItem = precioOriginalTotal - precioActualTotal;
                  const imageKey = `${item.id}-${item.talla}`;
                  
                  return (
                    <div key={imageKey} className={`flex gap-6 pb-6 ${tieneDescuento ? 'border-b border-green-200' : 'border-b border-gray-100'}`}>
                      <div className="w-24 h-32 relative bg-gray-50">
                        {imageErrors[imageKey] ? (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-[10px] text-center p-2">
                            Imagen no disponible
                          </div>
                        ) : (
                          <Image 
                            src={getImageSrc(item.imagen)}
                            alt={item.nombre || 'Producto'}
                            fill
                            className="object-contain p-2"
                            onError={() => handleImageError(imageKey)}
                            sizes="(max-width: 768px) 96px, 96px"
                            unoptimized={item.imagen?.includes('cloudinary.com')}
                          />
                        )}
                      </div>

                      <div className="flex flex-col justify-between flex-1 py-1">
                        <div>
                          <div className="flex items-start justify-between">
                            <h2 className="text-sm uppercase tracking-wide font-medium">{item.nombre || 'Producto'}</h2>
                            {tieneDescuento && (
                              <div className="flex items-center gap-1 text-[9px] text-green-600 bg-green-50 px-2 py-1 rounded">
                                <Tag size={10} />
                                <span className="uppercase tracking-wider">Mayoreo</span>
                              </div>
                            )}
                          </div>
                          
                          {item.talla && <p className="text-xs text-gray-500 mt-1">Talla: <span className="text-gray-800">{item.talla}</span></p>}
                          
                          <div className="mt-2">
                            {tieneDescuento ? (
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-green-600">
                                  MXN {precioActualTotal.toLocaleString('es-MX')}
                                </span>
                                <span className="text-xs text-gray-400 line-through">
                                  MXN {precioOriginalTotal.toLocaleString('es-MX')}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm font-medium">
                                MXN {precioActualTotal.toLocaleString('es-MX')}
                              </span>
                            )}
                            
                            {tieneDescuento && (
                              <p className="text-[9px] text-green-600 mt-1">
                                Ahorras: MXN {ahorroItem.toLocaleString('es-MX')}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3 mt-3">
                            <button 
                              onClick={() => decreaseQuantity(item.id, item.talla)} 
                              className="w-7 h-7 border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:border-black"
                            >
                              −
                            </button>
                            <span className="text-sm font-medium w-5 text-center">{cantidad}</span>
                            <button 
                              onClick={() => increaseQuantity(item.id, item.talla)} 
                              className="w-7 h-7 border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:border-black"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="flex justify-between items-end mt-4">
                          <span className="text-xs text-gray-500">
                            Precio unitario: MXN {precioActual.toLocaleString('es-MX')}
                          </span>
                          <button 
                            onClick={() => removeFromCart(item.id, item.talla)} 
                            className="text-xs uppercase tracking-wider text-gray-400 hover:text-red-500"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* RESUMEN */}
              <div className="bg-gray-50 border border-gray-100 p-8 sticky top-32">
                <h3 className="text-sm font-medium uppercase tracking-widest mb-6 border-b border-gray-200 pb-4">Resumen de compra</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">MXN {subtotal.toLocaleString('es-MX')}</span>
                  </div>
                  
                  {ahorroTotal > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1 text-green-600">
                        <Tag size={12} /> Ahorro por mayoreo
                      </span>
                      <span className="text-green-600 font-medium">- MXN {ahorroTotal.toLocaleString('es-MX')}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Envío</span>
                    <span className="text-gray-500">Calculado al pagar</span>
                  </div>
                </div>

                <div className="flex justify-between text-base font-semibold border-t border-gray-200 pt-4 mb-8">
                  <span>Total</span>
                  <span>MXN {(subtotal - ahorroTotal).toLocaleString('es-MX')}</span>
                </div>

                <button 
                  onClick={handleCheckout} 
                  disabled={isRedirecting}
                  className={`w-full py-4 text-xs uppercase tracking-[0.2em] transition-all ${
                    isRedirecting ? 'bg-zinc-300 text-zinc-500 cursor-not-allowed' : 'bg-black text-white hover:bg-zinc-800'
                  }`}
                >
                  {isRedirecting ? 'Procesando...' : 'Proceder con el pago'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />

      {isRedirecting && (
        <div className="fixed inset-0 flex items-end justify-center pointer-events-none z-50 pb-10">
          <div className="w-[90%] max-w-sm pointer-events-auto animate-bounce shadow-2xl">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex">
              <div className="w-1 bg-black" />
              <div className="p-4 flex-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-900">Autenticación requerida</p>
                <p className="text-xs text-gray-500 mt-1.5">Redirigiendo al inicio de sesión...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
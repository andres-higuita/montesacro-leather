import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import Encabezado from './components/Encabezado'
import PieDePagina from './components/PieDePagina'
import { ProveedorCarrito } from './carrito/CarritoContexto'
import { ProveedorCabecera } from './tema/ProveedorCabecera'
import CajonCarrito from './carrito/CajonCarrito'
import Inicio from './paginas/Inicio'
import Catalogo from './paginas/Catalogo'
import Producto from './paginas/Producto'
import Experiencia from './paginas/Experiencia'
import Checkout from './paginas/Checkout'
import Confirmacion from './paginas/Confirmacion'

/** Al cambiar de ruta vuelve arriba; con ancla, salta al bloque nombrado. */
function AlNavegar() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const destino = document.querySelector(hash)
      if (destino) {
        destino.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

/** `/pieza/:id` fue la ruta del primer prototipo. Se conserva como redirección. */
function RedirigirPieza() {
  const { id } = useParams()
  return <Navigate to={`/producto/${id}`} replace />
}

export default function App() {
  return (
    <ProveedorCarrito>
      <ProveedorCabecera>
        <AlNavegar />
        <Encabezado />

        <main id="contenido">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/tienda" element={<Navigate to="/catalogo" replace />} />
            <Route path="/producto/:slug" element={<Producto />} />
            <Route path="/pieza/:id" element={<RedirigirPieza />} />
            <Route path="/experiencia" element={<Experiencia />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/pedido-confirmado" element={<Confirmacion />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <PieDePagina />
        <CajonCarrito />
      </ProveedorCabecera>
    </ProveedorCarrito>
  )
}

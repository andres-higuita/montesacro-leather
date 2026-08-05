import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { irA } from './lib/scroll'
import Encabezado from './components/Encabezado'
import PieDePagina from './components/PieDePagina'
import SuavizadoScroll from './components/SuavizadoScroll'
import { ProveedorCarrito } from './carrito/CarritoContexto'
import { ProveedorCabecera } from './tema/ProveedorCabecera'
import CajonCarrito from './carrito/CajonCarrito'
import Inicio from './paginas/Inicio'
import Catalogo from './paginas/Catalogo'
import Producto from './paginas/Producto'
import Experiencia from './paginas/Experiencia'
import Checkout from './paginas/Checkout'
import Confirmacion from './paginas/Confirmacion'

/**
 * Al cambiar de ruta vuelve arriba; con ancla, salta al bloque nombrado.
 *
 * El movimiento va por `irA` y no por `window.scrollTo`: con el scroll
 * suavizado instalado, Lenis lleva su propia posición de destino e interpola
 * hacia ella en cada fotograma, así que un salto hecho a espaldas suyas se
 * deshace en el frame siguiente y la ficha se abría a media altura.
 *
 * Después del salto hay que refrescar ScrollTrigger. Los bloques fijados de la
 * página nueva se miden al montarse, y en ese momento las alturas todavía son
 * las de la página anterior: sin refresco, el recorrido de la ficha arranca con
 * los límites equivocados. Va en un `requestAnimationFrame` para que el
 * navegador haya hecho ya la maquetación.
 */
function AlNavegar() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const destino = hash ? document.querySelector(hash) : null

    if (destino) irA(destino, { suave: true })
    else irA(0)

    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
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
        <SuavizadoScroll />
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

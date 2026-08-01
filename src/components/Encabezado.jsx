import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Logotipo from './Logotipo'
import Monograma from './Monograma'
import BotonCarrito from '../carrito/BotonCarrito'
import { IconoCerrar, IconoMenu } from './Iconos'
import { useCabecera } from '../tema/cabecera'

const RUTAS = [
  { a: '/catalogo', texto: 'Las piezas' },
  { a: '/experiencia', texto: 'La experiencia' },
]

/** Roles que adopta el encabezado en reposo según la banda que tiene debajo. */
const ROLES_DE_CABECERA = {
  base: '',
  contra: 'roles-contra',
  vino: 'roles-vino',
}

export default function Encabezado() {
  const [posado, setPosado] = useState(false)
  const [menu, setMenu] = useState(false)
  const { pathname } = useLocation()
  const { mundo: mundoCabecera } = useCabecera()

  useEffect(() => {
    const alDesplazar = () => setPosado(window.scrollY > 24)
    alDesplazar()
    window.addEventListener('scroll', alDesplazar, { passive: true })
    return () => window.removeEventListener('scroll', alDesplazar)
  }, [])

  useEffect(() => {
    setMenu(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menu])

  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[var(--z-dialogo)] focus:bg-grafia focus:px-4 focus:py-2 focus:text-lienzo"
      >
        Saltar al contenido
      </a>

      {/* En reposo el encabezado no pinta fondo, así que adopta los roles de
          color de la banda que la página tiene debajo (ver tema/cabecera.js).
          Posado ya tiene fondo propio y vuelve a los roles del tema. */}
      <header
        className={`fixed inset-x-0 top-0 z-[var(--z-nav)] transition-[background-color,border-color,backdrop-filter] duration-500 ${
          posado
            ? 'border-b border-grafia/12 bg-lienzo/92 backdrop-blur-[6px]'
            : `border-b border-transparent ${ROLES_DE_CABECERA[mundoCabecera] ?? ''}`
        }`}
      >
        <div className="canal relative flex h-[4.5rem] items-center justify-between gap-6 md:h-[5.25rem]">
          {/* Navegación izquierda — escritorio */}
          <nav aria-label="Principal" className="hidden flex-1 md:block">
            <ul className="flex items-center gap-9">
              {RUTAS.map((r) => (
                <li key={r.a}>
                  <NavLink
                    to={r.a}
                    className={({ isActive }) =>
                      `versalita text-menor transition-colors duration-300 ${
                        isActive ? 'text-acento' : 'text-grafia/72 hover:text-grafia'
                      }`
                    }
                  >
                    {r.texto}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <Link
            to="/"
            className="shrink-0 text-grafia transition-colors duration-500 md:absolute md:left-1/2 md:-translate-x-1/2"
            aria-label="MONTESACRO, inicio"
          >
            <Logotipo tamano="nav" bajada={!posado} />
          </Link>

          <div className="hidden flex-1 items-center justify-end gap-7 md:flex">
            <Link
              to="/experiencia#personalizacion"
              className="versalita text-menor text-grafia/72 transition-colors duration-300 hover:text-grafia"
            >
              Personalización
            </Link>
            <BotonCarrito />
          </div>

          {/* Disparadores móviles */}
          <div className="flex items-center gap-6 md:hidden">
            <BotonCarrito />
            <button
              type="button"
              onClick={() => setMenu(true)}
              className="-mr-1 p-1 text-grafia/80 transition-colors duration-300 hover:text-grafia"
              aria-expanded={menu}
              aria-controls="menu-movil"
              aria-label="Abrir el menú"
            >
              <IconoMenu />
            </button>
          </div>
        </div>
      </header>

      {/* Panel móvil a pantalla completa */}
      {menu && (
        <div
          id="menu-movil"
          className="fixed inset-0 z-[var(--z-velo)] flex flex-col bg-lienzo md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navegación"
        >
          <div className="canal flex h-[4.5rem] items-center justify-between">
            <Monograma size={26} className="text-acento" />
            <button
              type="button"
              onClick={() => setMenu(false)}
              className="-mr-1 p-1 text-grafia/80 transition-colors duration-300 hover:text-grafia"
              aria-label="Cerrar el menú"
              autoFocus
            >
              <IconoCerrar />
            </button>
          </div>

          <nav aria-label="Principal móvil" className="canal mt-10 flex-1">
            <ul className="flex flex-col gap-7">
              {[{ a: '/', texto: 'Inicio' }, ...RUTAS].map((r) => (
                <li key={r.a}>
                  <NavLink
                    to={r.a}
                    className="font-[family-name:var(--font-display)] text-titulo text-grafia"
                  >
                    {r.texto}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <p className="canal pb-10 text-menor text-grafia-suave">
            Objetos de legado. Hechos para trascender.
          </p>
        </div>
      )}
    </>
  )
}

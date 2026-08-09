import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Logotipo from './Logotipo'
import Monograma from './Monograma'
import BotonCarrito from '../carrito/BotonCarrito'
import { IconoCerrar, IconoMenu } from './Iconos'
import { useCabecera } from '../tema/cabecera'

/* Anclas de la portada, no rutas.
   Con una sola pieza en catálogo, «Las piezas» llevaba a una rejilla de un
   elemento y «La experiencia» a una página que la portada ya cuenta entera. El
   recorrido ES el sitio, así que la navegación lleva a sus bloques.
   `AlNavegar`, en App.jsx, resuelve el salto con el scroll suavizado puesto.

   SUSTANTIVOS SUELTOS, SIN ARTÍCULO, y no por estilo: el logotipo va centrado
   en absoluto y la cápsula se estrecha a 46rem al posarse, así que el carril
   izquierdo son unos 235 px. «Las pieles · La ficha · El empaque» mide ~330 y
   se metía debajo del logotipo. Es el mismo choque que ya tumbó al enlace de
   personalización (ver el comentario junto al carrito).

   `desdeAncho` marca los que solo caben cuando hay sitio de sobra. */
const RUTAS = [
  { a: '/#pieles', texto: 'Pieles' },
  { a: '/#ficha', texto: 'Ficha' },
  { a: '/#empaque', texto: 'Empaque', desdeAncho: true },
]

/** `'/#pieles'` → `'#pieles'`. Una ruta sin ancla devuelve cadena vacía. */
const anclaDe = (ruta) => {
  const corte = ruta.indexOf('#')
  return corte === -1 ? '' : ruta.slice(corte)
}

/** Roles que adopta el encabezado en reposo según la banda que tiene debajo. */
const ROLES_DE_CABECERA = {
  base: '',
  contra: 'roles-contra',
  vino: 'roles-vino',
}

/* Altura, en píxeles, que le tiene que quedar al borde inferior de la portada
   para que el encabezado siga escondido. Es la medida del sitio de referencia:
   el encabezado no aparece por desplazamiento recorrido, sino cuando el bloque
   de portada YA CASI no está en pantalla. La diferencia importa —la portada
   mide 2.2 pantallas—: con un umbral fijo de scroll, el encabezado se habría
   colado en mitad del iris. */
const BORDE_PORTADA = 100

export default function Encabezado() {
  const [posado, setPosado] = useState(false)
  const [menu, setMenu] = useState(false)
  /* Arranca escondido y no visible: en la portada el primer fotograma tiene que
     ser el campo marfil limpio. En cualquier otra ruta no hay `#hero` y el
     primer `alDesplazar` lo destapa antes de pintar. */
  const [enPortada, setEnPortada] = useState(true)
  const { pathname, hash } = useLocation()
  const { mundo: mundoCabecera } = useCabecera()

  useEffect(() => {
    const alDesplazar = () => {
      setPosado(window.scrollY > 24)

      /* Se consulta el DOM y no una ruta: así la regla vale para cualquier
         página que declare un `#hero`, y las que no lo declaran —ficha, pedido,
         confirmación— muestran el encabezado desde el primer píxel sin ningún
         caso especial. */
      const portada = document.getElementById('hero')
      setEnPortada(
        Boolean(portada) && portada.getBoundingClientRect().bottom > BORDE_PORTADA,
      )
    }

    alDesplazar()
    window.addEventListener('scroll', alDesplazar, { passive: true })
    /* También al redimensionar: la portada mide en `svh`, así que al girar el
       teléfono o al recogerse la barra del navegador su borde inferior cambia
       de sitio sin que nadie haya desplazado nada. */
    window.addEventListener('resize', alDesplazar)
    return () => {
      window.removeEventListener('scroll', alDesplazar)
      window.removeEventListener('resize', alDesplazar)
    }
  }, [pathname])

  /* También con `hash`: la navegación de la portada son anclas de la MISMA
     ruta, así que al tocar «Pieles» el pathname no cambia y el panel se
     quedaba abierto, tapando justo la sección a la que acababa de saltar. */
  useEffect(() => {
    setMenu(false)
  }, [pathname, hash])

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

      {/* Cápsula flotante, despegada del borde superior.
          En reposo no pinta fondo y adopta los roles de color de la banda que
          la página tiene debajo (ver tema/cabecera.js); al posarse se cierra
          sobre sí misma con fondo y filete propios, y vuelve a los roles del
          tema. La cápsula se estrecha al posarse: al bajar estorba menos. */}
      {/* SE ESCONDE MIENTRAS DURA LA PORTADA. La portada es un bloque fijado de
          2.2 pantallas con su propia composición —el nombre de la casa a sangre
          y la lente—, y una barra encima le quita el golpe. Sube fuera de
          cuadro y vuelve a bajar en cuanto el bloque termina.

          Solo desde `md`: en teléfono la barra lleva el carrito y el menú, y son
          lo único con lo que se puede interactuar en toda la portada. */}
      <header
        className={`fixed inset-x-0 top-0 z-[var(--z-nav)] px-[var(--medida-canal)] pt-3 transition-transform duration-[400ms] ease-out md:pt-5 ${
          enPortada && !menu ? 'md:-translate-y-full' : 'translate-y-0'
        } ${posado ? '' : ROLES_DE_CABECERA[mundoCabecera] ?? ''}`}
      >
        <div
          className={`relative mx-auto flex h-[3.5rem] items-center justify-between gap-6 rounded-panel px-5 transition-[max-width,background-color,border-color,backdrop-filter] duration-500 ease-[var(--ease-salida)] md:h-[4rem] md:px-8 ${
            posado
              ? 'max-w-[46rem] border border-grafia/12 bg-lienzo/88 backdrop-blur-[10px]'
              : 'max-w-[var(--medida-ancho)] border border-transparent'
          }`}
        >
          {/* Navegación izquierda — escritorio */}
          <nav aria-label="Principal" className="hidden min-w-0 flex-1 md:block">
            {/* `gap-7` y no `gap-9`: con tres enlaces, dos separaciones de 36 px
                se comían el margen que queda hasta el logotipo centrado. */}
            <ul className="flex items-center gap-7">
              {RUTAS.map((r) => (
                <li key={r.a} className={r.desdeAncho ? 'hidden lg:block' : undefined}>
                  {/* `Link` y no `NavLink`: `NavLink` decide `isActive` con el
                      pathname y descarta el hash, así que con tres anclas de la
                      misma página las TRES se pintaban de acento a la vez. El
                      estado activo se calcula aquí, contra el hash. */}
                  <Link
                    to={r.a}
                    aria-current={hash === anclaDe(r.a) ? 'true' : undefined}
                    className={`versalita text-menor transition-colors duration-300 ${
                      hash === anclaDe(r.a)
                        ? 'text-acento'
                        : 'text-grafia/72 hover:text-grafia'
                    }`}
                  >
                    {r.texto}
                  </Link>
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

          {/* Solo el carrito. `Personalización` vivía aquí y chocaba con el
              logotipo centrado al estrecharse la cápsula; el enlace se mantiene
              en el pie y dentro de la ficha de producto, que es donde se decide. */}
          <div className="hidden flex-1 items-center justify-end md:flex">
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

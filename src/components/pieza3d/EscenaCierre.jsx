import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * El cierre, en tres dimensiones.
 *
 * Este archivo es el TROZO PESADO: arrastra three.js. Nunca se importa
 * directo — `Cierre3D.jsx` lo trae con `lazy()` y solo cuando el bloque se
 * acerca a la pantalla, así que el paquete de entrada del sitio no cambia.
 *
 * SIN DREI, A PROPÓSITO
 * De la biblioteca de ayudas solo hacían falta dos cosas: una caja de esquinas
 * redondeadas y un entorno de iluminación. Las dos caben en cuarenta líneas
 * aquí abajo, y traerlas de fuera costaba 85 kB comprimidos —un tercio más de
 * peso en el trozo— por código que en su mayor parte administra controles de
 * cámara, cargadores y ayudas de depuración que esta escena no usa. La caja
 * redondeada, además, sale mejor hecha a mano: extruida con bisel tiene el
 * canto de una pieza fundida, que es lo que hay que enseñar.
 *
 * POR QUÉ EL CIERRE Y NO EL BOLSO
 * Porque es lo único que se puede modelar con verdad hoy. El rombo es el path
 * real de la marca —las mismas cuatro coordenadas de `public/monograma.svg`— y
 * el resto son volúmenes que describen lo que el texto de la sección ya
 * promete: zamak macizo, dorado antiguo cepillado, tirador anular. No hay
 * ningún relleno inventado.
 *
 * Lo que falta es el monograma MS en relieve: el SVG de la casa lo dibuja con
 * <text>, y de un <text> no sale geometría —hace falta el trazado vectorizado—.
 * En cuanto exista, se extruye igual que el rombo.
 *
 * LA ILUMINACIÓN ES EL MATERIAL
 * Un metal no tiene color propio: se ve lo que refleja. Por eso aquí no hay
 * focos apuntando a la pieza sino PANTALLAS colocadas alrededor, como las cajas
 * de luz de un plató de bodegón. Lo que recorre el canto dorado al girar son
 * esas pantallas. Sin mapa de entorno, este material se vería como plástico
 * gris: no es un adorno del render, es la mitad del render.
 */

/* Las cuatro puntas del rombo de la marca, sacadas del path de
   `monograma.svg` —M32 3 · 61 32 · 32 61 · 3 32— y llevadas a coordenadas
   centradas en el origen: restar 32 y dividir entre 32. Que sea el mismo
   trazado y no un rombo parecido es la razón de que la pieza se reconozca. */
const PUNTA = 29 / 32

/** Rectángulo de esquinas redondeadas, listo para extruir. */
function formaRedondeada(ancho, alto, radio) {
  const x = ancho / 2 - radio
  const y = alto / 2 - radio
  const forma = new THREE.Shape()

  forma.moveTo(-x, -alto / 2)
  forma.lineTo(x, -alto / 2)
  forma.absarc(x, -y, radio, -Math.PI / 2, 0)
  forma.lineTo(ancho / 2, y)
  forma.absarc(x, y, radio, 0, Math.PI / 2)
  forma.lineTo(-x, alto / 2)
  forma.absarc(-x, y, radio, Math.PI / 2, Math.PI)
  forma.lineTo(-ancho / 2, -y)
  forma.absarc(-x, -y, radio, Math.PI, Math.PI * 1.5)

  return forma
}

/* Prefijo `use` en un archivo por lo demás en castellano: no es un anglicismo
   por descuido, es el contrato con el que React y el linter reconocen un hook.
   `usarGeometrias` compilaría igual y dejaría de comprobarse el orden de las
   llamadas, que es la única regla que de verdad importa aquí. */
/**
 * Las dos geometrías talladas de la pieza, construidas una sola vez.
 *
 * Van juntas en un hook porque comparten ciclo de vida: three.js reserva
 * búferes en la GPU al crearlas y no los suelta cuando React desmonta el
 * componente. Hay que liberarlos a mano o cada visita a la página deja una
 * copia colgada.
 */
function useGeometrias() {
  const geometrias = useMemo(() => {
    /* La placa. Extruida con bisel y no una caja con las esquinas limadas: el
       bisel es una superficie inclinada de verdad, y es la ÚNICA parte que
       devuelve un destello cuando la luz pasa de largo. Sin él el canto se
       apaga y la placa se lee como una calcomanía. */
    const placa = new THREE.ExtrudeGeometry(formaRedondeada(1.5, 1.5, 0.09), {
      depth: 0.1,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 4,
      curveSegments: 12,
    })
    placa.center()

    /* El rombo hueco: el filete de la marca, con cuerpo para poder extruirse. */
    const contorno = (radio) => [
      [0, radio],
      [radio, 0],
      [0, -radio],
      [-radio, 0],
    ]

    const forma = new THREE.Shape()
    contorno(PUNTA).forEach(([x, y], i) => {
      if (i === 0) forma.moveTo(x, y)
      else forma.lineTo(x, y)
    })
    forma.closePath()

    /* El hueco se recorre AL REVÉS que el contorno. Con el mismo sentido de
       giro, la triangulación lo trata como una segunda isla maciza y el rombo
       sale relleno en vez de hueco. */
    const hueco = new THREE.Path()
    contorno(PUNTA - 0.075)
      .reverse()
      .forEach(([x, y], i) => {
        if (i === 0) hueco.moveTo(x, y)
        else hueco.lineTo(x, y)
      })
    hueco.closePath()
    forma.holes.push(hueco)

    const rombo = new THREE.ExtrudeGeometry(forma, {
      depth: 0.05,
      bevelEnabled: true,
      // Bisel diminuto pero obligatorio, por lo mismo que el de la placa.
      bevelThickness: 0.012,
      bevelSize: 0.012,
      bevelSegments: 2,
    })
    rombo.center()

    return { placa, rombo }
  }, [])

  useEffect(
    () => () => {
      geometrias.placa.dispose()
      geometrias.rombo.dispose()
    },
    [geometrias],
  )

  return geometrias
}

/**
 * El plató, montado como mapa de entorno.
 *
 * Tres pantallas y nada más: una llave grande y suave arriba a la izquierda, un
 * relleno frío a la derecha para que la sombra no se cierre en negro, y una
 * tira estrecha detrás que dibuja el canto —el recorte que separa la pieza del
 * fondo—. Es el armado de un bodegón de joyería, y funciona por lo que NO
 * tiene: una cuarta luz y el metal deja de tener dirección.
 *
 * Se genera aquí en vez de descargar un .hdr de plató, que son varios megas
 * para lo mismo. `PMREMGenerator` toma esta escena de tres planos, la fotografía
 * en todas las direcciones y la desenfoca por niveles, que es exactamente lo
 * que un material rugoso necesita para saber qué reflejar.
 */
function Platon() {
  const gl = useThree((estado) => estado.gl)
  const escena = useThree((estado) => estado.scene)

  useEffect(() => {
    const plato = new THREE.Scene()
    // Un negro que no es negro: el gris muy oscuro da al metal algo que
    // reflejar en las zonas que no miran a ninguna pantalla. Con negro puro,
    // esas zonas se convierten en agujeros.
    plato.background = new THREE.Color(0x0a0a0a)

    const geometria = new THREE.PlaneGeometry(1, 1)
    const materiales = []

    const pantalla = ([x, y, z], [ancho, alto], intensidad, color) => {
      /* La intensidad va MULTIPLICADA en el color y no en un `intensity`
         aparte: `MeshBasicMaterial` no tiene ese parámetro —no lo ilumina
         nadie, es su propio color—. El mapa de entorno se genera en coma
         flotante, así que un color por encima de 1 no se recorta: es lo que
         hace que la pantalla se lea como fuente de luz y no como cartulina. */
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(color).multiplyScalar(intensidad),
        side: THREE.DoubleSide,
      })
      materiales.push(material)

      const malla = new THREE.Mesh(geometria, material)
      malla.position.set(x, y, z)
      malla.scale.set(ancho, alto, 1)
      // Cada pantalla mira a la pieza: es como se orienta una caja de luz.
      malla.lookAt(0, 0, 0)
      plato.add(malla)
    }

    pantalla([-2.6, 2.2, 1.8], [4, 4], 5.0, 0xffffff)
    pantalla([3.0, -0.6, 1.4], [3, 3], 1.6, 0xc9d6e8)
    // La tira del canto. Estrecha y larga a propósito: una pantalla ancha aquí
    // lava toda la cara trasera en vez de dibujar el borde.
    pantalla([0.4, 0.2, -2.6], [0.35, 5], 3.2, 0xffffff)

    const generador = new THREE.PMREMGenerator(gl)
    const objetivo = generador.fromScene(plato, 0.04)
    escena.environment = objetivo.texture

    return () => {
      escena.environment = null
      objetivo.dispose()
      generador.dispose()
      geometria.dispose()
      materiales.forEach((m) => m.dispose())
    }
  }, [gl, escena])

  return null
}

/**
 * El herraje.
 *
 * `avance` es una referencia y no un estado: cambia sesenta veces por segundo
 * con el scroll, y un `useState` volvería a renderizar el árbol de React entero
 * en cada uno de esos cambios para mover una matriz que three.js ya sabe mover
 * solo.
 */
function Herraje({ avance, oro }) {
  const grupo = useRef(null)
  const { placa, rombo } = useGeometrias()

  /* Los colores llegan del tema en sRGB de 0 a 1 y hay que declararlo: three
     trabaja en lineal, y un color de superficie entregado sin decirle el
     espacio sale visiblemente más claro y lavado. */
  const colores = useMemo(() => {
    const dorado = new THREE.Color().setRGB(oro[0], oro[1], oro[2], THREE.SRGBColorSpace)
    // El dorado ANTIGUO del manual: el mismo tono, bajado de luminosidad. No es
    // otro color, es el mismo metal sin pulir.
    return { dorado, envejecido: dorado.clone().multiplyScalar(0.62) }
  }, [oro])

  useFrame((_, delta) => {
    if (!grupo.current) return
    const p = avance.current

    /* Media vuelta larga, centrada en el frente: la pieza entra girada hacia un
       lado, se pone de cara por el medio del recorrido y sale girada hacia el
       otro. Nunca da la espalda —lo interesante está en esta cara— y nunca se
       queda quieta de frente, que es cuando un render se delata como render. */
    const giroY = (p - 0.5) * 1.3
    // Cabeceo: se inclina hacia atrás al principio y se endereza. Es lo que
    // hace que la luz recorra el canto en vez de quedarse clavada en el plano.
    const giroX = 0.34 - p * 0.42
    // Y una deriva mínima en el eje de la cámara, para que el canto nunca esté
    // perfectamente alineado con el borde de la pantalla.
    const giroZ = Math.sin(p * Math.PI) * 0.1

    /* Se persigue el objetivo en vez de asignarlo. El scroll llega a saltos —y
       Lenis los suaviza, pero no del todo—; sin la persecución el herraje copia
       cada salto y se lee como un motor de pasos. El factor exponencial hace
       que el tiempo de asentamiento sea el mismo a 60 y a 120 Hz. */
    const k = 1 - Math.pow(0.004, delta)
    grupo.current.rotation.y += (giroY - grupo.current.rotation.y) * k
    grupo.current.rotation.x += (giroX - grupo.current.rotation.x) * k
    grupo.current.rotation.z += (giroZ - grupo.current.rotation.z) * k
  })

  return (
    <group ref={grupo}>
      {/* La placa. Cepillada: rugosidad alta para el metal mate del manual, y
          una capa de barniz encima —`clearcoat`— que es lo que separa un dorado
          antiguo de un dorado de bisutería. */}
      <mesh geometry={placa}>
        <meshPhysicalMaterial
          color={colores.envejecido}
          metalness={1}
          roughness={0.42}
          clearcoat={0.5}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* El rombo de la marca, en relieve sobre la placa. Pulido: rugosidad
          baja. El contraste entre el filete brillante y la placa mate es todo
          lo que se necesita para que se lea como pieza fundida y grabada. */}
      <mesh geometry={rombo} position={[0, 0, 0.09]}>
        <meshPhysicalMaterial
          color={colores.dorado}
          metalness={1}
          roughness={0.14}
          clearcoat={1}
          clearcoatRoughness={0.08}
        />
      </mesh>

      {/* El tirador: el anillo por el que se tira. Va por detrás y asomando por
          arriba, que es como cuelga en la pieza real. */}
      <mesh position={[0, 0.86, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.26, 0.055, 20, 64]} />
        <meshPhysicalMaterial
          color={colores.dorado}
          metalness={1}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </group>
  )
}

function Sonda() {
  const estado = useThree()
  useEffect(() => {
    window.__cierre = estado
  }, [estado])
  return null
}

/**
 * @param {{ current: number }} avance  Recorrido del scroll, 0-1. Lo escribe
 *   ScrollTrigger desde `Cierre3D`; aquí solo se lee.
 * @param {[number, number, number]} oro  El acento del tema, en sRGB 0-1.
 * @param {'always'|'never'} reloj  `never` congela el bucle: el bloque está
 *   fuera de pantalla y no hay motivo para que la GPU siga trabajando.
 */
export default function EscenaCierre({ avance, oro, reloj = 'always' }) {
  return (
    <Canvas
      frameloop={reloj}
      /* Techo de densidad en 1.75. La pieza es metal pulido sobre negro: por
         encima de eso lo que se gana es imperceptible y lo que se paga es un
         cuarto más de píxeles sombreados en cada fotograma. */
      dpr={[1, 1.75]}
      gl={{
        // Transparente: el negro de la sección es el fondo. Un lienzo opaco
        // dejaría el rectángulo visible sobre el negro de la página.
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
      }}
      /* Campo estrecho, cámara lejos. Es el teleobjetivo del bodegón: comprime
         la perspectiva y la pieza se lee como objeto medido en vez de como
         render de gran angular. */
      camera={{ position: [0, 0, 4.4], fov: 26 }}
    >
      <Sonda />
      <Platon />
      <Herraje avance={avance} oro={oro} />
    </Canvas>
  )
}

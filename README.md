# Partners 2027 · Un mundo de propuestas

Infografía interactiva para acompañar la exposición de **Alejandro Galeano Mejía**, candidato a la Presidencia de Partners Campus EAFIT 2027.

Un mundo isométrico continuo que se recorre con la cámara: visión → tres objetivos → relación objetivos/pilares → Conectando, Sirviendo y Cambiando vidas (7 propuestas) → cierre. El mundo se va "construyendo" a medida que avanza la presentación.

## Controles

| Acción | Teclado | Botón |
| --- | --- | --- |
| Avanzar | → ↓ Espacio Enter AvPág | › (abajo a la derecha) |
| Retroceder | ← ↑ RePág | ‹ (abajo a la izquierda) |
| Vista panorámica (entrar/salir) | P | Panorámica |
| Índice / acceso directo | I | Índice o puntos de progreso |
| Pantalla completa | F | Pantalla completa |
| Reducir animaciones | A | Animaciones |
| Ir al inicio / al final | Inicio / Fin | — |

La presentación nunca avanza sola. Los clickers de presentación (que envían AvPág/RePág) funcionan.

## Tu foto

Guarda la foto como `assets/alejandro.jpg` (cuadrada, mínimo 600×600). Mientras no exista, se muestran las iniciales.

## Ejecutar localmente

No necesita instalación ni internet (las fuentes están incluidas). Abre `index.html` en Chrome o Edge, o sirve la carpeta:

```bash
python -m http.server 8000
```

## Archivos

- `js/content.js`: todos los textos (objetivos, pilares, propuestas y el orden del recorrido).
- `js/world.js`: el mundo isométrico (SVG generado).
- `js/app.js`: cámara, paneles y controles.
- `css/styles.css`: estilos con los colores de marca Partners.

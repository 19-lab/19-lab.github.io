# Bilophus · Telegram Mini App + GitHub Pages

Juego web listo para abrirse como **Telegram Mini App** y también como página web normal (GitHub Pages).
Los anuncios usan el formato **Rewarded Interstitial** de Monetag para Telegram Mini Apps.

## Archivos (todos en la raíz del repositorio)

| Archivo | Qué es |
|---|---|
| `index.html` | El juego (con three.js incluido, no depende de internet para eso). |
| `ads.js` | Conexión con Telegram y con Monetag. No hace falta tocarlo. |
| `ads-config.js` | **Único archivo a editar para conectar Monetag.** |
| `README.md` | Esta guía. |

## Dónde se configura Monetag (más adelante)

Abrí `ads-config.js` y completá **solo estos dos datos**:

```js
monetagZoneId: '',   // ← ID de la zona PRINCIPAL del SDK (panel de Monetag → tu Mini App → "Get SDK")
monetagSdkSrc: '',   // ← el src="..." del <script> que te da Monetag en "Get instructions"
```

Después, antes de publicar para el público, poné `allowSimulation: false`.

Mientras estén vacíos, el juego usa el anuncio de prueba de 5 segundos (igual que antes).
Con los dos datos cargados, **dentro de Telegram nunca se usa el anuncio de prueba**: solo el anuncio real.

## Los dos puntos de anuncio

Los dos botones llaman a `mostrarAnuncio(lugar)` en `index.html`, que a su vez usa `BilophusAds.showRewarded(lugar)` de `ads.js`:

1. Portada, botón voluntario "Ver anuncio para comenzar y duplicar semillas" → lugar `'duplicar_semillas'`.
2. Al perder, botón "Ver anuncio y seguir desde acá" → lugar `'revivir'`.

La recompensa se entrega **solo si el SDK de Monetag confirma que el anuncio se completó**.
Si el jugador lo cierra o lo salta, si falla o si no hay anuncio, no hay recompensa. Tocar el botón no alcanza.

## Publicar en GitHub Pages

1. Subí los 4 archivos a la raíz del repositorio (rama `main`).
2. En GitHub: Settings → Pages → "Deploy from a branch" → `main` / `(root)`.
3. Tu juego queda en `https://TU-USUARIO.github.io/TU-REPO/`.

## Abrirlo como Mini App de Telegram

1. En Telegram, hablá con @BotFather y creá o elegí tu bot.
2. Creá la Mini App con `/newapp` (o poné el botón de menú con `/setmenubutton`) y usá como URL la dirección HTTPS de GitHub Pages. Los pasos de BotFather pueden variar un poco.
3. Abrí el bot en Telegram y probá el juego ahí. Los anuncios de Monetag hay que probarlos **dentro de Telegram**, no en el navegador.

## Qué hace el juego dentro de Telegram

- Avisa a Telegram que cargó (`ready`) y usa toda la altura (`expand`).
- Desactiva el gesto de deslizar hacia abajo de Telegram (`disableVerticalSwipes`), porque el juego usa deslizamientos y si no minimizaría la Mini App.
- Fuera de Telegram (web normal) no hace nada de esto.

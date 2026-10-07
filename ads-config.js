/* =====================================================================
   BILOPHUS · CONFIGURACIÓN DE ANUNCIOS (Monetag Rewarded Interstitial)
   ---------------------------------------------------------------------
   ESTE ES EL ÚNICO ARCHIVO QUE TENÉS QUE EDITAR PARA CONECTAR MONETAG.
   Mientras los dos valores de Monetag estén vacíos ('') el juego anda
   igual que siempre (con el anuncio de prueba de 5 segundos).
   ===================================================================== */
window.BILOPHUS_ADS_CONFIG = {

  /* ► DATO 1 · ID de la zona PRINCIPAL de Monetag (solo el número).
       Lo vas a ver en el panel de Monetag, en tu Telegram Mini App,
       botón "Get SDK". Usá la zona principal, no una sub-zona.
       Dejalo vacío hasta que lo tengas. */
  monetagZoneId: '11977893',

  /* ► DATO 2 · Dirección (URL) del script del SDK de Monetag.
       Es el valor del atributo src="..." del <script> que te muestra
       Monetag en "Get instructions". Copialo tal cual.
       Dejalo vacío hasta que lo tengas. */
  monetagSdkSrc: '//libtl.com/sdk.js',

  /* (Opcional) Nombre de la función global del SDK. Si lo dejás vacío se
     usa 'show_' + el ID de zona, que es lo que indica la documentación
     de Monetag (data-sdk="show_XXX"). */
  monetagFunctionName: 'show_11977893',

  /* Anuncio de PRUEBA de 5 segundos (no es publicidad real):
       true  → se usa cuando Monetag NO está configurado, y en la versión web.
       false → si no hay anuncio real disponible, no se da ninguna recompensa.
     Dentro de Telegram, una vez cargados los dos datos de arriba, NUNCA se
     usa el anuncio de prueba, sin importar este valor.
     Recomendado: poné false antes de publicar el juego para el público. */
  allowSimulation: true,

  /* Precargar el anuncio para que aparezca sin demora (recomendado). */
  preload: true
};

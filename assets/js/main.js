document.addEventListener('DOMContentLoaded', () => {
    // Aseguramos que el contenido principal de la página tenga el ID 'main-content'.
    // Esto es vital para que nuestro script sepa qué parte de la página debe reemplazar.
    const mainContent = document.getElementById('main-content');
    if (!mainContent) {
        console.error('Error: No se encontró el contenedor #main-content. La navegación dinámica no funcionará.');
        return; // Detenemos el script si no encontramos el elemento crítico.
    }

    // Esta función se encarga de cargar el contenido de una URL y actualizar la página.
    // 'pushState' nos dice si debemos añadir la URL al historial del navegador o no (útil para el botón de "atrás").
    const loadContent = async (url, pushState = true) => {
        try {
            // Hacemos una petición para obtener el HTML de la nueva página.
            const response = await fetch(url);
            if (!response.ok) {
                // Si la petición falla (ej. página no encontrada), lanzamos un error.
                throw new Error(`Error HTTP! Estado: ${response.status}`);
            }
            const html = await response.text(); // Obtenemos el HTML como texto.

            // Creamos un "documento temporal" para analizar el HTML que acabamos de recibir.
            // Esto nos permite extraer solo la parte que nos interesa (#main-content).
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Buscamos el contenido principal en el documento temporal.
            const newMainContent = doc.getElementById('main-content');

            if (newMainContent) {
                // Si encontramos el nuevo contenido, lo reemplazamos en nuestra página actual.
                mainContent.innerHTML = newMainContent.innerHTML;

                // Si 'pushState' es verdadero (es decir, el usuario hizo clic en un enlace),
                // actualizamos la URL en la barra de direcciones sin recargar la página.
                if (pushState) {
                    window.history.pushState({ path: url }, '', url);
                }

                // Opcional: Desplazamos la vista al inicio de la página para que el usuario vea el nuevo contenido.
                window.scrollTo(0, 0);

                console.log(`Contenido cargado dinámicamente para: ${url}`);
                
                // Disparamos un evento personalizado. Esto es muy útil si tienes otros scripts
                // en tus páginas de contenido que necesitan ejecutarse cuando se carga dinámicamente.
                const event = new Event('contentLoadedDynamically');
                document.dispatchEvent(event);

            } else {
                // Si la nueva página no tiene #main-content, no podemos hacer la carga dinámica.
                // Como respaldo, recargamos la página completa.
                console.error(`Error: No se encontró #main-content en la página cargada dinámicamente: ${url}`);
                window.location.href = url;
            }

        } catch (error) {
            // Si ocurre cualquier otro error durante la carga, también recargamos la página completa.
            console.error('Error al cargar el contenido:', error);
            window.location.href = url;
        }
    };

    // Escuchamos los clics en cualquier parte del cuerpo del documento.
    document.body.addEventListener('click', (event) => {
        // Usamos 'closest('a')' para encontrar el enlace más cercano que fue clickeado.
        const target = event.target.closest('a');

        // Solo interceptamos enlaces si cumplen estas condiciones:
        // 1. Es un enlace (no es nulo).
        // 2. Apunta al mismo dominio (es un enlace interno de tu sitio).
        // 3. No tiene el atributo 'data-no-ajax' (permite excluir enlaces de la carga dinámica).
        // 4. No abre en una nueva pestaña ('target="_blank"').
        if (target && 
            target.origin === window.location.origin && 
            !target.hasAttribute('data-no-ajax') &&    
            target.getAttribute('target') !== '_blank'  
        ) {
            event.preventDefault(); // ¡Esto es clave! Detiene la recarga normal de la página.
            const href = target.getAttribute('href'); // Obtenemos la URL del enlace.
            // Si la URL existe y no es la misma página en la que ya estamos, cargamos el contenido.
            if (href && href !== window.location.pathname) { 
                loadContent(href);
            }
        }
    });

    // Escuchamos el evento 'popstate'. Este evento se dispara cuando el usuario usa los botones
    // de "atrás" o "adelante" del navegador.
    window.addEventListener('popstate', (event) => {
        // Recargamos el contenido de la URL actual del navegador, pero sin añadir una nueva entrada
        // al historial (pushState = false), ya que el historial ya cambió por el botón.
        loadContent(window.location.pathname, false); 
    });

    // Al cargar la página por primera vez, reemplazamos el estado del historial.
    // Esto es importante para que los botones de "atrás"/"adelante" funcionen correctamente
    // desde el momento en que el usuario llega a tu sitio.
    window.history.replaceState({ path: window.location.pathname }, '', window.location.pathname);
});
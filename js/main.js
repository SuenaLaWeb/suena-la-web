(() => {
  // <stdin>
  document.addEventListener("DOMContentLoaded", () => {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) {
      console.error("Error: No se encontr\xF3 el contenedor #main-content. La navegaci\xF3n din\xE1mica no funcionar\xE1.");
      return;
    }
    const loadContent = async (url, pushState = true) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error HTTP! Estado: ${response.status}`);
        }
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const newMainContent = doc.getElementById("main-content");
        if (newMainContent) {
          mainContent.innerHTML = newMainContent.innerHTML;
          if (pushState) {
            window.history.pushState({ path: url }, "", url);
          }
          window.scrollTo(0, 0);
          console.log(`Contenido cargado din\xE1micamente para: ${url}`);
          const event = new Event("contentLoadedDynamically");
          document.dispatchEvent(event);
        } else {
          console.error(`Error: No se encontr\xF3 #main-content en la p\xE1gina cargada din\xE1micamente: ${url}`);
          window.location.href = url;
        }
      } catch (error) {
        console.error("Error al cargar el contenido:", error);
        window.location.href = url;
      }
    };
    document.body.addEventListener("click", (event) => {
      const target = event.target.closest("a");
      if (target && target.origin === window.location.origin && !target.hasAttribute("data-no-ajax") && target.getAttribute("target") !== "_blank") {
        event.preventDefault();
        const href = target.getAttribute("href");
        if (href && href !== window.location.pathname) {
          loadContent(href);
        }
      }
    });
    window.addEventListener("popstate", (event) => {
      loadContent(window.location.pathname, false);
    });
    window.history.replaceState({ path: window.location.pathname }, "", window.location.pathname);
  });
})();

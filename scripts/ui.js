    const themeButton = document.querySelector(".theme");
    themeButton.addEventListener("click", toggleTheme);
    applyTheme();

    const input = document.querySelector("input");
    input.addEventListener("input", (event) => {
      const query = event.target.value;
      if (query.length < 3) return;
      update(query);
      window.history.replaceState({}, null, "?q=" + query);
    });
    if (initialQuery) {
      input.value = initialQuery;
    }

    // Sniffing the user agent is not great, but capability detection is not
    // possible because of fingerprinting protection, and mitigation strategies
    // really do depend on the specific browser.

    const userAgentLower = navigator.userAgent.toLowerCase();
    const isFirefox = userAgentLower.includes("firefox");
    if (isFirefox) {
      document.body.classList.add("firefox");
    }

    const isSafari =
      userAgentLower.includes("safari") && !userAgentLower.includes("chrome");
    if (isSafari) {
      document.body.classList.add("safari");
    }
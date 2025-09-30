let allPokemon = [];
    let currentIndex = 0;
    let isLoading = false;

    async function fetchAllPokemon() {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000");
        if (!response.ok) throw new Error("Failed to fetch Pokémon list");

        const data = await response.json();
        allPokemon = data.results;
        
        // Enable buttons once data is loaded
        document.getElementById("prevBtn").disabled = false;
        document.getElementById("nextBtn").disabled = false;
        
        showPokemon();
      } catch (error) {
        document.getElementById("pokemonCard").innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
      }
    }

    async function showPokemon() {
      if (allPokemon.length === 0) return;
      
      isLoading = true;
      const pokemonInfo = allPokemon[currentIndex];
      
      try {
        // Show loading state
        document.getElementById("pokemonCard").innerHTML = '<div class="loading">Loading Pokémon details...</div>';
        
        const response = await fetch(pokemonInfo.url);
        if (!response.ok) throw new Error("Failed to fetch Pokémon details");

        const details = await response.json();
        const card = document.getElementById("pokemonCard");

        // Extract data with fallbacks
        const name = details.name || "Unknown";
        const image = details.sprites?.front_default || "https://via.placeholder.com/150?text=No+Image";
        const weight = details.weight
        const height = details.height
        const types = details.types?.map(t => t.type.name).join(", ") || "Unknown";

        // Build HTML
        card.innerHTML = `
          <h2>${name.charAt(0).toUpperCase() + name.slice(1)}</h2>
          <img src="${image}" alt="${name}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
          <p><strong>Height:</strong> ${height}</p>
          <p><strong>Weight:</strong> ${weight}</p>
          <p><strong>Type(s):</strong> ${types}</p>
        `;
        
        // Update counter
        document.getElementById("pokemonCounter").textContent = `Pokémon ${currentIndex + 1} of ${allPokemon.length}`;
        
      } catch (error) {
        document.getElementById("pokemonCard").innerHTML = `<p style="color: red;">Error loading Pokémon: ${error.message}</p>`;
      } finally {
        isLoading = false;
      }
    }

    // Button click handlers
    document.getElementById("nextBtn").addEventListener("click", () => {
      if (!isLoading && allPokemon.length > 0) {
        currentIndex = (currentIndex + 1) % allPokemon.length;
        showPokemon();
      }
    });

    document.getElementById("prevBtn").addEventListener("click", () => {
      if (!isLoading && allPokemon.length > 0) {
        currentIndex = currentIndex === 0 ? allPokemon.length - 1 : currentIndex - 1;
        showPokemon();
      }
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (isLoading || allPokemon.length === 0) return;
      
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        currentIndex = (currentIndex + 1) % allPokemon.length;
        showPokemon();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        currentIndex = currentIndex === 0 ? allPokemon.length - 1 : currentIndex - 1;
        showPokemon();
      }
    });

    // Start the app
    document.addEventListener("DOMContentLoaded", fetchAllPokemon);
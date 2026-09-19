export type Language = "en" | "es"

export const translations = {
  en: {
    startSeason: "Start Season",
    chooseCountries: "Choose Your Countries",
    nextSeason: "Next Season",
    history: "History",
    changelog: "Changelog",
    close: "Close",
    exitGame: "Exit game",
    endSeason: "End of season",

    game: {
      title: "Eurovision Stage",
      description:
        "You are the stage director behind Europe's greatest song contest. Run 1 to 4 countries each season. You can't pick the song — but you can reshape it and its staging with one make-or-break call per act, then survive the semi-final and the Grand Final scoreboard.",
      steps: {
        one: "Pick 1–4 competing countries — each already has a song chosen.",
        two: "Make one call per act: tweak the song or the staging.",
        three:
          "Qualify through the semi-final, then all countries vote 12–1.",
        four:
          "Win to host next year, then swap countries and go again.",
      },
    },

    historyModal: {
      archive: "Your archive",
      title: "Season History",
    },

    wins: {
      one: "win",
      other: "wins",
    },

    countrySelect: {
      chooseSubtitle:
        "Select 1 to 4 countries to direct into this year's contest.",
      nextSubtitle:
        "Keep your roster or swap in new countries for the coming year.",
      enterRehearsals: "Enter the Rehearsals",
      countriesCompeting: "countries competing",
      notCompetingIn: "Not competing in",
    },

    currentEntry: "Current entry",

    decisionCard: {
      act: "Act",
      native: "native",
      returningArtist: "Returning artist — competed before",
      swipeHint: "Swipe the card or tap a choice",
    },

    results: {
      grandFinal: "Grand Final",
      resultsAreIn: "The Results Are In",
      countries: "countries",
      inGrandFinal: "in the Grand Final",
      you: "you",
      autoFinal: "Auto-final",
      qualified: "Qualified",
      eliminated: "Eliminated",
      inTheGrandFinal: "in the Grand Final",
      pts: "pts",
      didNotQualify: "Did not qualify for the Grand Final",
      twist: "Twist:",
      scoreboard: "Scoreboard — Top 10",
      endOfSeason: "End of Season",
    },
  },

  es: {
    startSeason: "Comenzar temporada",
    chooseCountries: "Elige tus países",
    nextSeason: "Siguiente temporada",
    history: "Histórico",
    changelog: "Cambios",
    close: "Cerrar",
    exitGame: "Salir del juego",
    endSeason: "Terminar temporada",

    game: {
      title: "Eurovision Stage",
      description:
        "Eres el director escénico detrás del mayor festival de canciones de Europa. Dirige de 1 a 4 países cada temporada. No puedes elegir la canción, pero sí puedes modificarla y transformar su puesta en escena con una decisión clave por artista. Después, tendrás que superar la semifinal y la clasificación de la Gran Final.",
      steps: {
        one: "Elige entre 1 y 4 países participantes, cada uno con una canción ya seleccionada.",
        two: "Toma una decisión para cada artista: modifica la canción o la puesta en escena.",
        three:
          "Supera la semifinal y después todos los países repartirán puntos del 12 al 1.",
        four:
          "Si ganas, organizarás el concurso del año siguiente. Cambia tus países y vuelve a empezar.",
      },
    },

    historyModal: {
      archive: "Tu archivo",
      title: "Histórico de temporadas",
    },

    wins: {
      one: "victoria",
      other: "victorias",
    },

    countrySelect: {
      chooseSubtitle:
        "Selecciona entre 1 y 4 países para dirigirlos en el concurso de este año.",
      nextSubtitle:
        "Mantén tu selección o cambia algunos países para la próxima temporada.",
      enterRehearsals: "Entrar en los ensayos",
      countriesCompeting: "países participantes",
      notCompetingIn: "No participan en",
    },

    currentEntry: "Actuación actual",

    decisionCard: {
      act: "Actuación",
      native: "idioma nativo",
      returningArtist:
        "Artista que regresa — ya ha participado anteriormente",
      swipeHint: "Desliza la tarjeta o pulsa una opción",
    },

    results: {
      grandFinal: "Gran Final",
      resultsAreIn: "Estos son los resultados",
      countries: "países",
      inGrandFinal: "en la Gran Final",
      you: "tú",
      autoFinal: "Finalista directo",
      qualified: "Clasificado",
      eliminated: "Eliminado",
      inTheGrandFinal: "en la Gran Final",
      pts: "pts",
      didNotQualify: "No se ha clasificado para la Gran Final",
      twist: "Giro:",
      scoreboard: "Clasificación — Top 10",
      endOfSeason: "Terminar temporada",
    },
  },
} as const
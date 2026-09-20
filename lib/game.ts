// ---------- Stats ----------
// You are the stage director. The only two levers you control are the SONG
// itself and the STAGING (dancers, backgrounds, pyro, camera).

export type StatKey = "song" | "staging"

export type Stats = Record<StatKey, number>

export const STAT_META: Record<
  StatKey,
  { label: string; short: string; color: string }
> = {
  song: { label: "Song", short: "SONG", color: "#f472b6" },
  staging: { label: "Staging", short: "STAGE", color: "#a78bfa" },
}

export const STAT_ORDER: StatKey[] = ["song", "staging"]

export const STAT_MIN = 0
export const STAT_MAX = 100

// ---------- Seeded RNG (stable songs & line-ups per year) ----------

function hashSeed(str: string): number {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return h >>> 0
}

function mulberry32(a: number): () => number {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function seededShuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)]
}

// ---------- Countries (EBU / Eurovision participants) ----------

export type Country = {
  id: string
  name: string
  code: string
  colors: [string, string]
  // Historical pedigree at the contest (0-100). Seeds acts and AI results.
  strength: number
  bloc: string
  // Host city used when this country wins and hosts the next contest.
  city: string
  alternativeCities: string[]
  // Language key for song titles & artist names. Countries sharing a language
  // are geographic neighbours, so any name repeat stays "in the family".
  lang: string
}

export const COUNTRIES: Country[] = [

  { id: "se", name: "Sweden", code: "SWE", colors: ["#006aa7", "#fecc00"], strength: 80, bloc: "nordic", city: "Stockholm", alternativeCities: ["Gothenburg", "Malmö", "Uppsala"], lang: "sv" },

  { id: "it", name: "Italy", code: "ITA", colors: ["#008c45", "#cd212a"], strength: 76, bloc: "south", city: "Rome", alternativeCities: ["Milan", "Naples", "Turin"], lang: "it" },

  { id: "ua", name: "Ukraine", code: "UKR", colors: ["#0057b7", "#ffd700"], strength: 74, bloc: "east", city: "Kyiv", alternativeCities: ["Kharkiv", "Odesa", "Lviv"], lang: "uk" },

  { id: "fi", name: "Finland", code: "FIN", colors: ["#003580", "#ffffff"], strength: 70, bloc: "nordic", city: "Helsinki", alternativeCities: ["Espoo", "Tampere", "Turku"], lang: "fi" },

  // { id: "il", name: "Israel", code: "ISR", colors: ["#0038b8", "#ffffff"], strength: 70, bloc: "south", city: "Jerusalem", alternativeCities: ["Tel Aviv", "Haifa", "Eilat"], lang: "he" },

  { id: "ch", name: "Switzerland", code: "SUI", colors: ["#d52b1e", "#ffffff"], strength: 68, bloc: "west", city: "Bern", alternativeCities: ["Zurich", "Geneva", "Basel"], lang: "de" },

  { id: "fr", name: "France", code: "FRA", colors: ["#0055a4", "#ef4135"], strength: 66, bloc: "west", city: "Paris", alternativeCities: ["Marseille", "Lyon", "Toulouse"], lang: "fr" },

  { id: "nl", name: "Netherlands", code: "NED", colors: ["#ae1c28", "#21468b"], strength: 66, bloc: "west", city: "Amsterdam", alternativeCities: ["Rotterdam", "The Hague", "Utrecht"], lang: "nl" },

  { id: "hr", name: "Croatia", code: "CRO", colors: ["#ff0000", "#171796"], strength: 66, bloc: "balkan", city: "Zagreb", alternativeCities: ["Split", "Rijeka", "Osijek"], lang: "hr" },

  { id: "no", name: "Norway", code: "NOR", colors: ["#ba0c2f", "#00205b"], strength: 62, bloc: "nordic", city: "Oslo", alternativeCities: ["Bergen", "Trondheim", "Stavanger"], lang: "no" },

  { id: "au", name: "Australia", code: "AUS", colors: ["#00843d", "#ffcd00"], strength: 62, bloc: "world", city: "Canberra", alternativeCities: ["Sydney", "Melbourne", "Brisbane"], lang: "en" },

  { id: "at", name: "Austria", code: "AUT", colors: ["#ed2939", "#ffffff"], strength: 62, bloc: "west", city: "Vienna", alternativeCities: ["Graz", "Linz", "Salzburg"], lang: "de" },

  { id: "gr", name: "Greece", code: "GRE", colors: ["#0d5eaf", "#ffffff"], strength: 60, bloc: "south", city: "Athens", alternativeCities: ["Thessaloniki", "Patras", "Heraklion"], lang: "el" },

  { id: "ee", name: "Estonia", code: "EST", colors: ["#0072ce", "#000000"], strength: 60, bloc: "baltic", city: "Tallinn", alternativeCities: ["Tartu", "Narva", "Pärnu"], lang: "et" },

  { id: "es", name: "Spain", code: "ESP", colors: ["#aa151b", "#f1bf00"], strength: 58, bloc: "south", city: "Madrid", alternativeCities: ["Barcelona", "Valencia", "Seville"], lang: "es" },

  { id: "pt", name: "Portugal", code: "POR", colors: ["#006600", "#ff0000"], strength: 58, bloc: "south", city: "Lisbon", alternativeCities: ["Porto", "Braga", "Coimbra"], lang: "pt" },

  { id: "be", name: "Belgium", code: "BEL", colors: ["#000000", "#fdda24"], strength: 58, bloc: "west", city: "Brussels", alternativeCities: ["Antwerp", "Ghent", "Bruges"], lang: "fr" },

  { id: "cy", name: "Cyprus", code: "CYP", colors: ["#d57800", "#ffffff"], strength: 58, bloc: "south", city: "Nicosia", alternativeCities: ["Limassol", "Larnaca", "Paphos"], lang: "el" },

  { id: "az", name: "Azerbaijan", code: "AZE", colors: ["#00b5e2", "#ef3340"], strength: 56, bloc: "east", city: "Baku", alternativeCities: ["Ganja", "Sumqayit", "Gabala"], lang: "az" },

  { id: "am", name: "Armenia", code: "ARM", colors: ["#d90012", "#0033a0"], strength: 56, bloc: "east", city: "Yerevan", alternativeCities: ["Gyumri", "Vanadzor", "Kapan"], lang: "hy" },

  { id: "lt", name: "Lithuania", code: "LTU", colors: ["#fdb913", "#006a44"], strength: 56, bloc: "baltic", city: "Vilnius", alternativeCities: ["Kaunas", "Klaipėda", "Šiauliai"], lang: "lt" },

  { id: "rs", name: "Serbia", code: "SRB", colors: ["#c6363c", "#0c4076"], strength: 56, bloc: "balkan", city: "Belgrade", alternativeCities: ["Novi Sad", "Niš", "Kragujevac"], lang: "sr" },

  { id: "is", name: "Iceland", code: "ISL", colors: ["#02529c", "#dc1e35"], strength: 56, bloc: "nordic", city: "Reykjavik", alternativeCities: ["Kópavogur", "Hafnarfjörður", "Akureyri"], lang: "is" },

  { id: "md", name: "Moldova", code: "MDA", colors: ["#0046ae", "#ffd200"], strength: 56, bloc: "east", city: "Chisinau", alternativeCities: ["Bălți", "Tiraspol", "Cahul"], lang: "ro" },

  { id: "gb", name: "United Kingdom", code: "GBR", colors: ["#012169", "#c8102e"], strength: 54, bloc: "west", city: "London", alternativeCities: ["Birmingham", "Manchester", "Liverpool"], lang: "en" },

  { id: "ie", name: "Ireland", code: "IRL", colors: ["#169b62", "#ff883e"], strength: 54, bloc: "west", city: "Dublin", alternativeCities: ["Cork", "Galway", "Limerick"], lang: "en" },

  { id: "si", name: "Slovenia", code: "SLO", colors: ["#005ce6", "#ed1c24"], strength: 54, bloc: "balkan", city: "Ljubljana", alternativeCities: ["Maribor", "Koper", "Celje"], lang: "sl" },

  { id: "de", name: "Germany", code: "GER", colors: ["#000000", "#dd0000"], strength: 52, bloc: "west", city: "Berlin", alternativeCities: ["Hamburg", "Munich", "Cologne"], lang: "de" },

  { id: "pl", name: "Poland", code: "POL", colors: ["#dc143c", "#ffffff"], strength: 52, bloc: "east", city: "Warsaw", alternativeCities: ["Krakow", "Wrocław", "Gdańsk"], lang: "pl" },

  { id: "cz", name: "Czechia", code: "CZE", colors: ["#11457e", "#d7141a"], strength: 52, bloc: "east", city: "Prague", alternativeCities: ["Brno", "Ostrava", "Plzeň"], lang: "cs" },

  { id: "lv", name: "Latvia", code: "LAT", colors: ["#9e3039", "#ffffff"], strength: 50, bloc: "baltic", city: "Riga", alternativeCities: ["Daugavpils", "Liepāja", "Jelgava"], lang: "lv" },

  { id: "ge", name: "Georgia", code: "GEO", colors: ["#ff0000", "#ffffff"], strength: 50, bloc: "east", city: "Tbilisi", alternativeCities: ["Batumi", "Kutaisi", "Rustavi"], lang: "ka" },

  { id: "mt", name: "Malta", code: "MLT", colors: ["#ffffff", "#cf142b"], strength: 50, bloc: "south", city: "Valletta", alternativeCities: ["Birkirkara", "Mosta", "St. Julian's"], lang: "en" },

  { id: "al", name: "Albania", code: "ALB", colors: ["#e41e20", "#000000"], strength: 48, bloc: "balkan", city: "Tirana", alternativeCities: ["Durrës", "Vlorë", "Shkodër"], lang: "sq" },

  { id: "sm", name: "San Marino", code: "SMR", colors: ["#5eb6e4", "#ffffff"], strength: 42, bloc: "south", city: "San Marino", alternativeCities: ["Serravalle", "Borgo Maggiore", "Domagnano"], lang: "it" },

  { id: "bg", name: "Bulgaria", code: "BUL", colors: ["#00966e", "#d62612"], strength: 60, bloc: "east", city: "Sofia", alternativeCities: ["Plovdiv", "Varna", "Burgas"], lang: "bg" },

  { id: "dk", name: "Denmark", code: "DEN", colors: ["#c8102e", "#ffffff"], strength: 62, bloc: "nordic", city: "Copenhagen", alternativeCities: ["Aarhus", "Odense", "Aalborg"], lang: "da" },

  { id: "lu", name: "Luxembourg", code: "LUX", colors: ["#ed2939", "#ffffff"], strength: 48, bloc: "west", city: "Luxembourg City", alternativeCities: ["Esch-sur-Alzette", "Differdange", "Dudelange"], lang: "fr" },

  { id: "me", name: "Montenegro", code: "MNE", colors: ["#c8102e", "#d4af37"], strength: 48, bloc: "balkan", city: "Podgorica", alternativeCities: ["Nikšić", "Budva", "Bar"], lang: "sr" },

  { id: "ro", name: "Romania", code: "ROU", colors: ["#002b7f", "#fcd116"], strength: 58, bloc: "east", city: "Bucharest", alternativeCities: ["Cluj-Napoca", "Timișoara", "Iași"], lang: "ro" },

  { id: "mk", name: "North Macedonia", code: "MKD", colors: ["#d20000", "#ffe600"], strength: 48, bloc: "balkan", city: "Skopje", alternativeCities: ["Ohrid", "Bitola", "Tetovo"], lang: "mk" },

  { id: "sk", name: "Slovakia", code: "SVK", colors: ["#0b4ea2", "#ee1c25"], strength: 50, bloc: "east", city: "Bratislava", alternativeCities: ["Košice", "Prešov", "Žilina"], lang: "sk" },

  { id: "hu", name: "Hungary", code: "HUN", colors: ["#ce2939", "#477050"], strength: 52, bloc: "east", city: "Budapest", alternativeCities: ["Debrecen", "Szeged", "Pécs"], lang: "hu" },

  { id: "ba", name: "Bosnia and Herzegovina", code: "BIH", colors: ["#002f6c", "#f5f5f5"], strength: 48, bloc: "balkan", city: "Sarajevo", alternativeCities: ["Banja Luka", "Mostar", "Tuzla"], lang: "hr" },

  // New EBU member / Eurovision participant confirmed for 2027
  // { id: "ca", name: "Canada", code: "CAN", colors: ["#ff0000", "#ffffff"], strength: 60, bloc: "world", city: "Ottawa", alternativeCities: ["Toronto", "Montreal", "Vancouver"], lang: "en" },

]

const REAL_EUROVISION_WINS: Record<string, number> = {
  ie: 7,
  se: 7,
  gb: 5,
  fr: 5,
  lu: 5,
  nl: 5,
  es: 2,
  it: 3,
  dk: 3,
  no: 3,
  de: 2,
  il: 4,
  ua: 3,
  at: 3,
  ch: 3,
  gr: 1,
  fi: 1,
  ee: 1,
  lv: 1,
  tr: 1,
  pt: 1,
  rs: 1,
  ru: 1,
  az: 1,
  be: 1,
  bg: 1,
  hr: 0,
  cy: 0,
  cz: 0,
  is: 0,
  pl: 0,
  si: 0,
  ro: 0,
  md: 0,
  al: 0,
  am: 0,
  ge: 0,
  lt: 0,
  mt: 0,
  me: 0,
  mk: 0,
  sk: 0,
  hu: 0,
  ba: 0,
  sm: 0,
}

export function getRealEurovisionWins(
  countryId: string,
): number {
  return REAL_EUROVISION_WINS[countryId] ?? 0
}

export function getCountry(id: string): Country {
  return COUNTRIES.find((c) => c.id === id) as Country
}

// Countries with an automatic pass to the Grand Final.
export const BIG_FIVE = new Set(["fr", "de", "it", "es", "gb"])

// ---------- Songs (each country picks an entry every year) ----------

export type Genre = {
  name: string
  song: number // modifier to seeded Song stat
  staging: number // modifier to seeded Staging stat
}

const GENRES: Genre[] = [
  { name: "Power Ballad", song: 4, staging: -2 },
  { name: "Europop Banger", song: 0, staging: 4 },
  { name: "Ethno-Pop", song: 2, staging: 2 },
  { name: "Dark Pop", song: 2, staging: 1 },
  { name: "Techno Rave", song: -2, staging: 5 },
  { name: "Folk Anthem", song: 4, staging: -2 },
  { name: "Operatic Pop", song: 5, staging: -1 },
  { name: "Rock Anthem", song: 1, staging: 3 },
  { name: "Disco Revival", song: 0, staging: 3 },
  { name: "Synth Ballad", song: 3, staging: 0 },
  { name: "Hip-Hop", song: 1, staging: 2 },
  { name: "Chanson", song: 4, staging: -3 },
]

const TITLE_ADJ = [
  "Golden", "Broken", "Electric", "Midnight", "Silent", "Burning", "Endless",
  "Neon", "Velvet", "Wild", "Frozen", "Sacred", "Paper", "Crimson", "Hollow",
  "Restless", "Fragile", "Infinite",
]
const TITLE_NOUN = [
  "Hearts", "Fire", "Rain", "Kingdom", "Mirror", "Thunder", "Halo", "Echoes",
  "Gravity", "Paradise", "Storm", "Lights", "Dynasty", "Horizon", "Machine",
  "Wolves", "Diamonds", "Silhouette",
]

// Ready-made native-language titles for the languages we support. Countries
// whose lang has an entry here sing in their own tongue ~55% of the time.
const LANG_TITLES: Record<string, string[]> = {
  it: [
    "Cuore Selvaggio", "Notte Infinita", "Fuoco e Cenere", "L'Ultimo Ballo", "Stelle Cadenti",
    "Amore Eterno", "Luce del Nord", "Tempesta", "Il Mio Volo", "Sospiro",
    "Senza Confini", "Luce e Ombra", "Occhi di Fuoco", "Dentro di Me", "Oltre il Cielo",
    "Cuore di Vetro", "Vento del Sud", "Sotto le Stelle", "Ancora Noi", "Fino all'Alba",
    "Brucia con Me", "La Mia Libertà", "Onde del Mare", "Rinascere", "Un'Ultima Volta",
    "Senza Paura", "Nel Silenzio", "Anima Ribelle", "Dove Sei", "L'Amore Ritorna",
    "Notte di Luna", "Vento Selvaggio", "Sogno Eterno", "Lacrime d'Oro", "Oltre il Mare",
    "Vivo per Te", "Fiamma", "Stella Solitaria", "Mai Più", "Libera",
    "Il Primo Giorno", "Senza Te", "Battito", "Cielo Rosso", "Cuore in Fiamme",
    "Dimmi Ancora", "L'Ultima Promessa", "Tra le Nuvole", "Fuori dal Buio", "Per Sempre",

  ],

  fr: [
    "Cœur de Verre", "Sous la Pluie", "Éternité", "La Dernière Danse", "Lumière",
    "Envole-moi", "Nuit Blanche", "Feu Follet", "Mon Silence", "Tempête",
    "Sans Limites", "Au-delà du Ciel", "Dernier Adieu", "Cœur Sauvage", "Danse avec Moi",
    "Sous les Étoiles", "L'Ombre et la Lumière", "Libre Comme l'Air", "À Jamais", "Avant l'Aube",
    "Un Nouveau Départ", "Regarde-moi", "Brûle Encore", "Le Vent du Nord", "À Contre-Courant",
    "Rêve Éveillé", "Je Reviens", "Nos Deux Mondes", "Après la Nuit", "Sans Peur",
    "Nuit d'Été", "Larmes d'Or", "Au Bord du Monde", "Étoile Solitaire", "Jamais Plus",
    "Cœur en Feu", "Sous les Lumières", "Tout Recommencer", "Entre Nous", "Dernier Regard",
    "Danse dans le Noir", "Le Temps s'Arrête", "Libre", "Une Dernière Fois", "Rien à Perdre",
    "Comme un Rêve", "Le Ciel Rouge", "Ma Liberté", "Dis-moi Encore", "Pour Toujours",
  ],

  es: [
    "Corazón Salvaje", "Bajo la Luna", "Fuego Eterno", "La Última Noche", "Tormenta",
    "Vuelo", "Latido", "Sin Miedo", "Amanecer", "Espejismo",
    "Sin Fronteras", "Más Allá del Cielo", "Luz y Sombra", "Alma Libre", "Baila Conmigo",
    "Hasta el Amanecer", "Vuelve a Mí", "Fuego en la Piel", "Cielo de Cristal", "Donde Nace el Sol",
    "Otra Vez", "Grito al Viento", "Entre Dos Mundos", "Después de la Lluvia", "Noche de Fuego",
    "Romper el Silencio", "Nada que Perder", "Tiempo Perdido", "El Último Beso", "Renacer",
    "Noche de Verano", "Lágrimas de Oro", "Más Allá", "Estrella Solitaria", "Nunca Más",
    "Corazón en Llamas", "Bajo las Estrellas", "Todo Comienza de Nuevo", "Entre Nosotros", "Última Mirada",
    "Bailando en la Oscuridad", "El Tiempo se Detiene", "Libre", "Una Última Vez", "Como un Sueño",
    "Cielo Rojo", "Mi Libertad", "Dime Otra Vez", "Hasta Siempre", "Sin Mirar Atrás",
  ],

  pt: [
    "Coração Selvagem", "Sob a Chuva", "Fogo Eterno", "A Última Dança", "Tempestade",
    "Voo", "Saudade", "Sem Medo", "Amanhecer", "Miragem",
    "Sem Fronteiras", "Além do Céu", "Luz e Sombra", "Alma Livre", "Dança Comigo",
    "Até ao Amanhecer", "Volta para Mim", "Fogo na Pele", "Céu de Cristal", "Onde Nasce o Sol",
    "Outra Vez", "Grito ao Vento", "Entre Dois Mundos", "Depois da Chuva", "Noite de Fogo",
    "Quebrar o Silêncio", "Nada a Perder", "Tempo Perdido", "O Último Beijo", "Renascimento",
    "Noite de Verão", "Lágrimas de Ouro", "Além do Mar", "Estrela Solitária", "Nunca Mais",
    "Coração em Chamas", "Sob as Estrelas", "Começar de Novo", "Entre Nós", "Último Olhar",
    "Dançando no Escuro", "O Tempo Parou", "Livre", "Uma Última Vez", "Como um Sonho",
    "Céu Vermelho", "Minha Liberdade", "Diz-me Outra Vez", "Para Sempre", "Sem Olhar Para Trás",
  ],

  sv: [
    "Vilda Hjärtan", "Under Natten", "Evig Eld", "Sista Dansen", "Storm",
    "Norrsken", "Andetag", "Utan Rädsla", "Gryning", "Hägring",
    "Utan Gränser", "Bortom Himlen", "Ljus och Skugga", "Fri Själ", "Dansa Med Mig",
    "Fram Till Gryningen", "Kom Tillbaka", "Eld i Mitt Hjärta", "Glashimmel", "Där Solen Föds",
    "En Gång Till", "Ropa Mot Vinden", "Mellan Två Världar", "Efter Regnet", "Eldens Natt",
    "Bryt Tystnaden", "Inget Att Förlora", "Förlorad Tid", "Den Sista Kyssen", "Återfödd",
    "Sommarnatt", "Gyllene Tårar", "Bortom Havet", "Ensam Stjärna", "Aldrig Mer",
    "Hjärta i Lågor", "Under Stjärnorna", "Börja Om", "Mellan Oss", "Sista Blicken",
    "Dans i Mörkret", "Tiden Står Still", "Fri", "En Sista Gång", "Som en Dröm",
    "Röd Himmel", "Min Frihet", "Säg Det Igen", "För Alltid", "Utan Att Se Tillbaka",
  ],

  no: [
    "Ville Hjerter", "Under Regnet", "Evig Ild", "Siste Dans", "Storm",
    "Nordlys", "Åndedrag", "Uten Frykt", "Daggry", "Luftspeiling",
    "Uten Grenser", "Forbi Himmelen", "Lys og Skygge", "Fri Sjel", "Dans Med Meg",
    "Frem Til Daggry", "Kom Tilbake", "Ild i Hjertet", "Glasshimmel", "Der Solen Fødes",
    "En Gang Til", "Rop Mot Vinden", "Mellom To Verdener", "Etter Regnet", "Ildens Natt",
    "Bryt Stillheten", "Ingenting å Tape", "Tapt Tid", "Det Siste Kysset", "Gjenfødt",
    "Sommernatt", "Tårer av Gull", "Forbi Havet", "Ensom Stjerne", "Aldri Mer",
    "Hjerte i Flammer", "Under Stjernene", "Begynn På Nytt", "Mellom Oss", "Det Siste Blikket",
    "Dans i Mørket", "Tiden Står Stille", "Fri", "En Siste Gang", "Som en Drøm",
    "Rød Himmel", "Min Frihet", "Si Det Igjen", "For Alltid", "Uten Å Se Tilbake",
  ],

  de: [
    "Wildes Herz", "Unter dem Mond", "Ewiges Feuer", "Der Letzte Tanz", "Sturm",
    "Nordlicht", "Atemzug", "Ohne Angst", "Morgenrot", "Fata Morgana",
    "Ohne Grenzen", "Jenseits des Himmels", "Licht und Schatten", "Freie Seele", "Tanz mit Mir",
    "Bis zum Morgengrauen", "Komm Zurück", "Feuer im Herzen", "Glashimmel", "Wo die Sonne Erwacht",
    "Noch Einmal", "Schrei in den Wind", "Zwischen Zwei Welten", "Nach dem Regen", "Nacht aus Feuer",
    "Brich das Schweigen", "Nichts zu Verlieren", "Verlorene Zeit", "Der Letzte Kuss", "Wiedergeboren",
    "Sommernacht", "Goldene Tränen", "Jenseits des Meeres", "Einsamer Stern", "Nie Wieder",
    "Herz in Flammen", "Unter den Sternen", "Von Neuem Beginnen", "Zwischen Uns", "Letzter Blick",
    "Tanz im Dunkeln", "Die Zeit Steht Still", "Frei", "Ein Letztes Mal", "Wie ein Traum",
    "Roter Himmel", "Meine Freiheit", "Sag Es Noch Einmal", "Für Immer", "Ohne Zurückzublicken",
  ],

  nl: [
    "Wild Hart", "Onder de Regen", "Eeuwig Vuur", "De Laatste Dans", "Storm",
    "Noorderlicht", "Ademtocht", "Zonder Angst", "Dageraad", "Luchtspiegeling",
    "Zonder Grenzen", "Voorbij de Hemel", "Licht en Schaduw", "Vrije Ziel", "Dans met Mij",
    "Tot de Dageraad", "Kom Terug", "Vuur in Mijn Hart", "Glazen Hemel", "Waar de Zon Ontwaakt",
    "Nog Eén Keer", "Schreeuw naar de Wind", "Tussen Twee Werelden", "Na de Regen", "Nacht van Vuur",
    "Breek de Stilte", "Niets te Verliezen", "Verloren Tijd", "De Laatste Kus", "Herboren",
    "Zomernacht", "Gouden Tranen", "Voorbij de Zee", "Eenzame Ster", "Nooit Meer",
    "Hart in Vlammen", "Onder de Sterren", "Opnieuw Beginnen", "Tussen Ons", "Laatste Blik",
    "Dans in het Donker", "De Tijd Staat Stil", "Vrij", "Een Laatste Keer", "Als een Droom",
    "Rode Hemel", "Mijn Vrijheid", "Zeg het Nog Een Keer", "Voor Altijd", "Zonder Om te Kijken",
  ],

  uk: [
    "Dyke Sertse", "Pid Doshchem", "Vichnyy Vohon", "Ostannii Tanets", "Burya",
    "Polit", "Podykh", "Bez Strakhu", "Svitanok", "Mirazh",
    "Bez Kordoniv", "Poza Nebom", "Svitlo i Tin", "Vilna Dusha", "Tantsiui zi Mnoiu",
    "Do Svitanku", "Povernysia", "Vohon u Sertsi", "Skelne Nebo", "Tam de Skhodyt Sonce",
    "Shche Raz", "Kryk do Vitru", "Mizh Dvoma Svitamy", "Pislia Doschu", "Nich Vohnu",
    "Rozbiti Tishu", "Nichoho Vtrachaty", "Vtrachena Godyna", "Ostannii Potsilunok", "Vidrodzhennia",
    "Litnia Nich", "Zoloti Slezy", "Poza Morem", "Samotnia Zirka", "Nikoly Bilshi",
    "Sertse u Polumi", "Pid Zirkamy", "Pochaty Znovu", "Mizh Namy", "Ostannii Pohliad",
    "Tantsi v Temriavi", "Chas Zupyniaietsia", "Vilna", "Ostannii Raz", "Yak Son",
    "Chervone Nebo", "Moia Svoboda", "Skazhy Shche Raz", "Nazavzhdy", "Bez Pohliadu Nazad",
  ],

  fi: [
    "Villi Sydän", "Sateen Alla", "Ikuinen Tuli", "Viimeinen Tanssi", "Myrsky",
    "Revontulet", "Henkäys", "Ilman Pelkoa", "Aamunkoi", "Kangastus",
    "Ilman Rajoja", "Taivaan Tuolla Puolen", "Valo ja Varjo", "Vapaa Sielu", "Tanssi Kanssani",
    "Aamunkoittoon", "Palaa Luokseni", "Tuli Sydämessä", "Lasitaivas", "Missä Aurinko Nousee",
    "Vielä Kerran", "Huuto Tuuleen", "Kahden Maailman Välissä", "Sateen Jälkeen", "Tulinen Yö",
    "Riko Hiljaisuus", "Ei Mitään Menetettävää", "Kadonnut Aika", "Viimeinen Suudelma", "Uudestisyntynyt",
    "Kesäyö", "Kultaiset Kyyneleet", "Meren Tuolla Puolen", "Yksinäinen Tähti", "Ei Koskaan Enää",
    "Sydän Liekissä", "Tähtien Alla", "Aloita Alusta", "Meidän Välillämme", "Viimeinen Katse",
    "Tanssi Pimeässä", "Aika Pysähtyy", "Vapaa", "Viimeisen Kerran", "Kuin Unelma",
    "Punainen Taivas", "Minun Vapauteni", "Sano Se Uudelleen", "Ikuisesti", "Katsomatta Taakse",
  ],

  el: [
    "Agria Kardia", "Kato apo ti Vrohi", "Aionia Fotia", "Teleftaios Horos", "Kataigida",
    "Ptisi", "Anasa", "Horis Fovo", "Ximeroma", "Antikatoptrismos",
    "Horis Synora", "Pera apo ton Ourano", "Fos kai Skia", "Eleftheri Psyhi", "Horepse Mazi Mou",
    "Mexri to Ximeroma", "Gyrise Piso", "Fotia stin Kardia", "Gyalinos Ouranos", "Ekei pou Anatellei o Ilios",
    "Mia Fora Akoma", "Foni ston Anemo", "Anamesa se Dyo Kosmous", "Meta ti Vrohi", "Nychta Fotias",
    "Spase ti Siopi", "Tipota na Chaso", "Chamenos Chronos", "To Teleftaio Fili", "Anagennisi",
    "Nychta tou Kalokairiou", "Chrysa Dakrya", "Pera apo ti Thalassa", "Monasteri Asteri", "Pote Xana",
    "Kardia se Floges", "Kato apo ta Asteria", "Xekina Xana", "Anamesa Mas", "Teleftaio Vlemma",
    "Horos sto Skotadi", "O Chronos Stamata", "Eleftheri", "Mia Teleftaia Fora", "San Oneiro",
    "Kokkino Ourano", "I Eleftheria Mou", "Pes to Xana", "Gia Panta", "Horis na Koitas Piso",
  ],

  hr: [
    "Divlje Srce", "Pod Kišom", "Vječna Vatra", "Posljednji Ples", "Oluja",
    "Let", "Dah", "Bez Straha", "Zora", "Fatamorgana",
    "Bez Granica", "Iznad Neba", "Svjetlo i Sjena", "Slobodna Duša", "Pleši sa Mnom",
    "Do Svitanja", "Vrati Mi Se", "Vatra u Srcu", "Stakleno Nebo", "Tamo Gdje Sunce Sja",
    "Još Jednom", "Vrisak u Vjetar", "Između Dva Svijeta", "Nakon Kiše", "Noć Vatre",
    "Razbij Tišinu", "Nemam Što Izgubiti", "Izgubljeno Vrijeme", "Posljednji Poljubac", "Ponovno Rođen",
    "Ljetna Noć", "Zlatne Suze", "Iza Mora", "Usamljena Zvijezda", "Nikad Više",
    "Srce u Plamenu", "Pod Zvijezdama", "Počni Iznova", "Između Nas", "Posljednji Pogled",
    "Ples u Mraku", "Vrijeme Stoji", "Slobodna", "Još Jednom Posljednji Put", "Kao San",
    "Crveno Nebo", "Moja Sloboda", "Reci Još Jednom", "Zauvijek", "Bez Pogleda Unatrag",
  ],

  sr: [
    "Divlje Srce", "Pod Kišom", "Večna Vatra", "Poslednji Ples", "Oluja",
    "Let", "Dah", "Bez Straha", "Zora", "Priviđenje",
    "Bez Granica", "Iznad Neba", "Svetlost i Senka", "Slobodna Duša", "Pleši sa Mnom",
    "Do Svitanja", "Vrati Mi Se", "Vatra u Srcu", "Stakleno Nebo", "Tamo Gde Sunce Sija",
    "Još Jednom", "Vrisak u Vetar", "Između Dva Sveta", "Posle Kiše", "Noć Vatre",
    "Razbij Tišinu", "Nemam Šta da Izgubim", "Izgubljeno Vreme", "Poslednji Poljubac", "Ponovo Rođen",
    "Letnja Noć", "Zlatne Suze", "Iza Mora", "Usamljena Zvezda", "Nikad Više",
    "Srce u Plamenu", "Pod Zvezdama", "Počni Iznova", "Između Nas", "Poslednji Pogled",
    "Ples u Mraku", "Vreme Stoji", "Slobodna", "Još Jednom Poslednji Put", "Kao San",
    "Crveno Nebo", "Moja Sloboda", "Reci Još Jednom", "Zauvek", "Bez Pogleda Unazad",
  ],

  pl: [
    "Dzikie Serce", "Pod Deszczem", "Wieczny Ogień", "Ostatni Taniec", "Burza",
    "Lot", "Oddech", "Bez Strachu", "Świt", "Miraż",
    "Bez Granic", "Poza Niebem", "Światło i Cień", "Wolna Dusza", "Tańcz Ze Mną",
    "Do Świtu", "Wróć Do Mnie", "Ogień w Sercu", "Szklane Niebo", "Tam Gdzie Wschodzi Słońce",
    "Jeszcze Raz", "Krzyk na Wiatr", "Między Dwoma Światami", "Po Deszczu", "Noc Ognia",
    "Przerwij Ciszę", "Nie Mam Nic do Stracenia", "Stracony Czas", "Ostatni Pocałunek", "Odrodzenie",
    "Letnia Noc", "Złote Łzy", "Za Morzem", "Samotna Gwiazda", "Nigdy Więcej",
    "Serce w Płomieniach", "Pod Gwiazdami", "Zacznij Od Nowa", "Między Nami", "Ostatnie Spojrzenie",
    "Taniec w Ciemności", "Czas Stoi", "Wolna", "Ostatni Raz", "Jak Sen",
    "Czerwone Niebo", "Moja Wolność", "Powiedz Jeszcze Raz", "Na Zawsze", "Bez Patrzenia Wstecz",
  ],
  
  en: [
    "Wild Heart",
    "Infinite Night",
    "Eternal Fire",
    "The Last Dance",
    "Falling Stars",
    "Eternal Love",
    "Northern Light",
    "Storm",
    "My Flight",
    "Whisper",
    "Without Limits",
    "Light and Shadow",
    "Eyes of Fire",
    "Inside Me",
    "Beyond the Sky",
    "Glass Heart",
    "Southern Wind",
    "Under the Stars",
    "Once Again",
    "Until Dawn",
    "Burn With Me",
    "My Freedom",
    "Waves of the Sea",
    "Reborn",
    "One Last Time",
    "Fearless",
    "In the Silence",
    "Rebel Soul",
    "Where Are You",
    "Love Returns",
    "Summer Night",
    "Golden Tears",
    "Beyond the Sea",
    "Lonely Star",
    "Never Again",
    "Heart on Fire",
    "Dancing in the Dark",
    "Between Two Worlds",
    "After the Rain",
    "Red Sky",
    "Lost Time",
    "Last Goodbye",
    "Dream Again",
    "Into the Unknown",
    "Echoes",
    "Chasing the Sun",
    "Rise Again",
    "Stay With Me",
    "A Million Lights",
    "Forever",
  ]
}

// Per-language name pools. Artists are first + last combos, so names read as
// local to each country and pools are effectively disjoint between languages.
const FIRST_NAMES: Record<string, string[]> = {
  default: [
    "Alex", "Nadia", "Milo", "Sasha", "Elin", "Dario", "Nina", "Leon", "Mara", "Ivo",
    "Tara", "Rudi", "Sena", "Vito", "Lea", "Noa", "Aria", "Lena", "Mika", "Eva",
    "Lia", "Niko", "Mila", "Luca", "Sara", "Lina", "Eli", "Mina", "Kai", "Nora",
    "Theo", "Mira", "Lara", "Lio", "Elia", "Rina", "Sami", "Toni", "Maya", "Dina",
    "Ema", "Luka", "Nika", "Sia", "Vera", "Mara", "Kira", "Timo", "Rhea", "Enzo",
  ],

  en: [
    "Ellie", "Jonah", "Grace", "Mason", "Ruby", "Cole", "Ivy", "Reece", "Faye", "Miles",
    "Nora", "Blake", "Esme", "Dylan", "Lark", "Sage", "Amelia", "Oliver", "Charlotte", "Henry",
    "Isla", "Jack", "Sophie", "Theo", "Evie", "Oscar", "Freya", "Harry", "Lily", "Leo",
    "Poppy", "George", "Molly", "Arthur", "Ella", "James", "Chloe", "Thomas", "Daisy", "Archie",
    "Phoebe", "Alfie", "Maisie", "Finley", "Willow", "Ethan", "Florence", "Charlie", "Imogen", "Max",
  ],

  sv: [
    "Elin", "Måns", "Saga", "Viktor", "Tuva", "Anton", "Nova", "Loreen", "Felix", "Sanna",
    "Ludvig", "Astrid", "Kian", "Ebba", "Jonas", "Signe", "Alva", "Axel", "Elsa", "Hugo",
    "Agnes", "Isak", "Wilma", "Elias", "Maja", "Oskar", "Linnea", "Emil", "Freja", "William",
    "Tindra", "Oliver", "Nellie", "Arvid", "Selma", "Theodor", "Ida", "Viggo", "Stella", "Noah",
    "Alice", "Leo", "Ellen", "Liam", "Klara", "Edvin", "Julia", "Simon", "Moa", "Albin",
  ],

  no: [
    "Aksel", "Ingrid", "Sondre", "Maja", "Emil", "Thea", "Kaja", "Ulrik", "Vilde", "Henrik",
    "Frida", "Odin", "Silje", "Nikolai", "Ronja", "Erik", "Astrid", "Magnus", "Ida", "Isak",
    "Nora", "Lars", "Sofie", "Anders", "Emma", "Kristian", "Amalie", "Martin", "Hedda", "Jonas",
    "Marte", "Elias", "Live", "Oliver", "Selma", "Sander", "Tuva", "Mathias", "Ella", "Marius",
    "Theodor", "Karoline", "Oskar", "Mina", "Viktor", "Linnea", "Sebastian", "Julie", "Noah", "Aurora",
  ],

  fi: [
    "Aino", "Eero", "Ilta", "Niko", "Sanni", "Väinö", "Helmi", "Onni", "Lumi", "Aleksi",
    "Venla", "Kaarle", "Sisu", "Roosa", "Tuuli", "Joel", "Aada", "Elias", "Emilia", "Joonas",
    "Veera", "Matti", "Ella", "Oskari", "Siiri", "Leevi", "Iida", "Arttu", "Sofia", "Lauri",
    "Anni", "Juho", "Vilma", "Eetu", "Noora", "Mikael", "Hilla", "Antti", "Saara", "Jere",
    "Linnea", "Rasmus", "Kerttu", "Samuel", "Alina", "Henna", "Tomi", "Nea", "Topias", "Pinja",
  ],

  it: [
    "Giulia", "Marco", "Chiara", "Luca", "Sofia", "Matteo", "Elisa", "Dario", "Francesca", "Alessio",
    "Nina", "Gabriele", "Bianca", "Vito", "Serena", "Enzo", "Aurora", "Leonardo", "Beatrice", "Lorenzo",
    "Martina", "Federico", "Alice", "Riccardo", "Camilla", "Andrea", "Valentina", "Davide", "Greta", "Tommaso",
    "Arianna", "Simone", "Giorgia", "Emanuele", "Noemi", "Filippo", "Elena", "Mattia", "Sara", "Niccolò",
    "Carlotta", "Pietro", "Irene", "Samuele", "Claudia", "Jacopo", "Marta", "Ludovica", "Fabio", "Viola",
  ],

  fr: [
    "Camille", "Louis", "Chloé", "Hugo", "Manon", "Émile", "Léa", "Théo", "Elise", "Rémi",
    "Océane", "Julien", "Amélie", "Noé", "Sabine", "Lucas", "Clara", "Gabriel", "Louise", "Arthur",
    "Inès", "Mathis", "Emma", "Nathan", "Jade", "Raphaël", "Alice", "Maxime", "Zoé", "Antoine",
    "Margot", "Paul", "Lola", "Baptiste", "Lucie", "Thomas", "Agathe", "Adrien", "Éva", "Romain",
    "Maëlle", "Simon", "Élodie", "Martin", "Juliette", "Victor", "Anaïs", "Alexandre", "Céleste", "Valentin",
  ],

  es: [
    "Lucía", "Mateo", "Carla", "Diego", "Sara", "Pablo", "Nerea", "Álvaro", "Rocío", "Hugo",
    "Marta", "Iván", "Elena", "Bruno", "Paula", "Adrián", "Sofía", "Daniel", "Valeria", "Javier",
    "Claudia", "Alejandro", "Marina", "Mario", "Carmen", "Sergio", "Irene", "Álex", "Aitana", "Ángel",
    "Natalia", "David", "Laura", "Raúl", "Noelia", "Miguel", "Andrea", "Óscar", "Alba", "Rubén",
    "Patricia", "Víctor", "Beatriz", "Enrique", "Julia", "Samuel", "Cristina", "Gonzalo", "Miriam", "Jorge",
  ],

  pt: [
    "Beatriz", "Tiago", "Inês", "Rui", "Mariana", "Diogo", "Salomé", "João", "Carolina", "Miguel",
    "Leonor", "André", "Matilde", "Nuno", "Sofia", "Duarte", "Mafalda", "Gonçalo", "Catarina", "Tomás",
    "Francisca", "Rodrigo", "Bárbara", "Afonso", "Ana", "Martim", "Joana", "Pedro", "Margarida", "Guilherme",
    "Teresa", "Vasco", "Clara", "Henrique", "Rita", "Daniel", "Lara", "Filipe", "Laura", "Bruno",
    "Marisa", "Ricardo", "Eva", "Simão", "Carolina", "Luís", "Diana", "António", "Filipa", "Eduardo",
  ],

  de: [
    "Lena", "Felix", "Mia", "Jonas", "Klara", "Max", "Greta", "Lukas", "Anke", "Emil",
    "Frida", "Noah", "Heike", "Tobias", "Svea", "Jan", "Anna", "Paul", "Marie", "Leon",
    "Hannah", "Ben", "Leonie", "Finn", "Laura", "Elias", "Lina", "Moritz", "Sophie", "Jakob",
    "Clara", "Niklas", "Amelie", "David", "Johanna", "Felix", "Marlene", "Simon", "Luisa", "Maximilian",
    "Charlotte", "Julian", "Nina", "Sebastian", "Lara", "Alexander", "Emma", "Matthias", "Theresa", "Konrad",
  ],

  nl: [
    "Sanne", "Daan", "Fleur", "Sem", "Isa", "Bram", "Lotte", "Finn", "Roos", "Luuk",
    "Julia", "Thijs", "Noor", "Gijs", "Evi", "Stijn", "Sophie", "Lars", "Mila", "Jesse",
    "Tess", "Ruben", "Maud", "Niels", "Lynn", "Mees", "Saar", "Wout", "Eva", "Cas",
    "Feline", "Tim", "Puck", "Joris", "Lieke", "Daan", "Nora", "Koen", "Anne", "Bram",
    "Iris", "Pim", "Sofie", "Timo", "Fleur", "Joep", "Luna", "Rik", "Eline", "Mats",
  ],

  uk: [
    "Oksana", "Andriy", "Yulia", "Taras", "Sofiia", "Dmytro", "Iryna", "Bohdan", "Nadiia", "Olek",
    "Kateryna", "Yaroslav", "Alina", "Mykola", "Zlata", "Ivan", "Olena", "Maksym", "Anastasiia", "Artem",
    "Mariia", "Denys", "Viktoriia", "Oleksii", "Daria", "Roman", "Solomiia", "Serhii", "Polina", "Volodymyr",
    "Tetiana", "Pavlo", "Veronika", "Nazar", "Kristina", "Ihor", "Lilia", "Bohdan", "Svitlana", "Vadym",
    "Yevhen", "Alina", "Marko", "Lesia", "Danylo", "Vira", "Ostap", "Marta", "Mykhailo", "Roksolana",
  ],

  el: [
    "Eleni", "Nikos", "Maria", "Yannis", "Sofia", "Dimitris", "Katerina", "Stelios", "Ioanna", "Petros",
    "Athina", "Kostas", "Danae", "Vasilis", "Marina", "Alexis", "Eirini", "Giorgos", "Anna", "Manolis",
    "Christina", "Panagiotis", "Vasiliki", "Theodoros", "Elpida", "Michalis", "Georgia", "Andreas", "Niki", "Spyros",
    "Kalliopi", "Konstantinos", "Eleni", "Thanasis", "Despina", "Ilias", "Dimitra", "Sotiris", "Fotini", "Lefteris",
    "Aggeliki", "Marios", "Rania", "Antonis", "Evangelia", "Thanos", "Alexandra", "Vaggelis", "Melina", "Panos",
  ],

  hr: [
    "Ana", "Luka", "Ivana", "Marko", "Petra", "Ivan", "Lucija", "Josip", "Marija", "Filip",
    "Dora", "Tomislav", "Ena", "Nikola", "Klara", "Roko", "Mia", "Mateo", "Sara", "Fran",
    "Lea", "Jakov", "Nika", "Lovro", "Ema", "Ante", "Iva", "Domagoj", "Tena", "Tin",
    "Lana", "Marin", "Paula", "Stjepan", "Lucija", "Bruna", "Borna", "Marta", "Karlo", "Tea",
    "Petar", "Matea", "Viktor", "Elena", "Dino", "Lara", "Kristijan", "Lorena", "Vedran", "Nela",
  ],

  sr: [
    "Jelena", "Nikola", "Milica", "Stefan", "Ana", "Marko", "Teodora", "Luka", "Sara", "Nemanja",
    "Ivana", "Vuk", "Katarina", "Filip", "Mina", "Uroš", "Jovana", "Miloš", "Marija", "Dušan",
    "Anđela", "Lazar", "Tamara", "Aleksa", "Isidora", "Bogdan", "Sofija", "Vladimir", "Una", "Ognjen",
    "Nikolina", "Strahinja", "Maša", "Pavle", "Milica", "Vanja", "Andrej", "Jelica", "Mihajlo", "Tijana",
    "Teodor", "Danica", "Vasilije", "Lena", "Milan", "Anja", "Veljko", "Nina", "Dunja", "Petar",
  ],

  pl: [
    "Zofia", "Kacper", "Maja", "Jakub", "Lena", "Filip", "Julia", "Szymon", "Alicja", "Wiktor",
    "Nadia", "Antoni", "Ola", "Michał", "Ewa", "Piotr", "Zuzanna", "Jan", "Lena", "Franciszek",
    "Maria", "Mateusz", "Hanna", "Krzysztof", "Natalia", "Bartosz", "Wiktoria", "Adam", "Weronika", "Tomasz",
    "Amelia", "Kamil", "Emilia", "Patryk", "Gabriela", "Jakub", "Maja", "Mikołaj", "Oliwia", "Dawid",
    "Aleksandra", "Maciej", "Laura", "Szymon", "Kinga", "Marcel", "Karolina", "Igor", "Paulina", "Oskar",
  ],
}

const LAST_NAMES: Record<string, string[]> = {
  default: [
    "Vale", "Novak", "Sol", "Marín", "Ríos", "Frost", "Lune", "Moon", "North", "Belle",
    "Storm", "Vega", "Reine", "Skye", "Asher", "Brant", "River", "Stone", "Blair", "Winter",
    "Dawn", "Silver", "Raven", "Star", "Ocean", "Fox", "Rain", "Wells", "Gray", "Rose",
    "Lane", "Hart", "West", "Sky", "Brooks", "Field", "Lake", "Cruz", "Snow", "Hill",
    "Parker", "Reed", "Cole", "Green", "Dale", "Young", "Ray", "Bell", "Miles", "Hope",
  ],

  en: [
    "Hart", "Rivers", "Vale", "Fox", "Wren", "Blackwood", "Reed", "Sterling", "Frost", "Marlowe",
    "Ashford", "Quinn", "Rye", "Hale", "Snow", "Wilder", "Bennett", "Carter", "Collins", "Cooper",
    "Dawson", "Ellis", "Fletcher", "Griffin", "Harper", "Hayes", "Hunter", "King", "Lawson", "Morgan",
    "Parker", "Reynolds", "Sawyer", "Spencer", "Turner", "Walker", "Ward", "Watson", "Webb", "West",
    "Wood", "Adams", "Brooks", "Clark", "Foster", "Green", "Harris", "Mason", "Rogers", "Taylor",
  ],

  sv: [
    "Lindqvist", "Berg", "Nyström", "Sundgren", "Holm", "Ekström", "Dahl", "Lundin", "Sjöberg", "Norén",
    "Falk", "Hedlund", "Åberg", "Wik", "Sten", "Brand", "Andersson", "Johansson", "Karlsson", "Nilsson",
    "Eriksson", "Larsson", "Olsson", "Persson", "Svensson", "Gustafsson", "Pettersson", "Jonsson", "Lindberg", "Lundberg",
    "Björk", "Wallin", "Sandberg", "Holmberg", "Bergström", "Lindström", "Mattsson", "Forsberg", "Håkansson", "Vikström",
    "Nordström", "Ström", "Blom", "Engström", "Söderberg", "Åkesson", "Magnusson", "Eklund", "Öberg", "Dahlberg",
  ],

  no: [
    "Dahl", "Berg", "Solheim", "Haugen", "Lund", "Moen", "Vik", "Fjell", "Nord", "Strand",
    "Aas", "Brekke", "Hauge", "Stein", "Ryen", "Foss", "Hansen", "Johansen", "Olsen", "Larsen",
    "Andersen", "Pedersen", "Nilsen", "Kristiansen", "Jensen", "Karlsen", "Eriksen", "Bakke", "Hagen", "Lie",
    "Berglund", "Dahlberg", "Solberg", "Lunde", "Sæther", "Moe", "Myhre", "Eide", "Rønning", "Vangen",
    "Hovland", "Skog", "Vikheim", "Gran", "Dalen", "Sund", "Røed", "Bjerke", "Tangen", "Holm",
  ],

  fi: [
    "Virtanen", "Nieminen", "Mäkinen", "Laine", "Koskinen", "Heikkilä", "Salo", "Aalto", "Lahti", "Rinne",
    "Toivonen", "Halla", "Kivi", "Ranta", "Salmi", "Vuori", "Korhonen", "Heinonen", "Lehtinen", "Saarinen",
    "Hämäläinen", "Rantanen", "Kallio", "Järvinen", "Miettinen", "Lehtonen", "Kinnunen", "Karjalainen", "Pitkänen", "Niemelä",
    "Ahonen", "Heikkinen", "Hakala", "Manninen", "Väisänen", "Seppälä", "Peltonen", "Tuominen", "Koskela", "Salonen",
    "Ojala", "Mattila", "Nykänen", "Anttila", "Leppänen", "Mustonen", "Hiltunen", "Laitinen", "Soininen", "Koivisto",
  ],

  it: [
    "Rossi", "Conti", "Ferrari", "Greco", "Riva", "Marino", "Bruno", "De Luca", "Costa", "Fontana",
    "Galli", "Rizzo", "Sartori", "Vitale", "Neri", "Amato", "Romano", "Ricci", "Moretti", "Esposito",
    "Lombardi", "Barbieri", "Colombo", "Ferraro", "Santoro", "Mariani", "Caruso", "Leone", "Longo", "Gentile",
    "Martini", "Serra", "De Angelis", "Pellegrini", "Fiore", "Grassi", "Ferri", "Monti", "Rinaldi", "Villa",
    "Bianchi", "Mancini", "Giordano", "Orlando", "Testa", "Sanna", "Fontana", "D'Amico", "Parisi", "Bellini",
  ],

  fr: [
    "Laurent", "Moreau", "Girard", "Fontaine", "Dubois", "Lefèvre", "Marchand", "Colin", "Renaud", "Blanchard",
    "Faure", "Leroy", "Noël", "Perrin", "Aubert", "Roche", "Martin", "Bernard", "Thomas", "Robert",
    "Richard", "Petit", "Durand", "Lemoine", "Simon", "Michel", "Lefebvre", "Mercier", "Legrand", "Garnier",
    "Chevalier", "Robin", "Masson", "Henry", "Roussel", "Boyer", "Gautier", "Caron", "Renard", "Barbier",
    "Dupont", "Lambert", "Bonnet", "François", "Muller", "Brunet", "Dumas", "Picard", "Vidal", "Besson",
  ],

  es: [
    "García", "Torres", "Vega", "Navarro", "Molina", "Serrano", "Castro", "Ibáñez", "Reyes", "Delgado",
    "Marín", "Bravo", "Aguilar", "Solís", "Campos", "Prieto", "Gómez", "Fernández", "López", "Martínez",
    "Sánchez", "Pérez", "González", "Rodríguez", "Ruiz", "Díaz", "Moreno", "Muñoz", "Álvarez", "Romero",
    "Alonso", "Gutiérrez", "Navarro", "Domínguez", "Ramos", "Vázquez", "Ramírez", "Sanz", "Iglesias", "Suárez",
    "Blanco", "Mora", "Ortega", "Del Río", "Cabrera", "Vidal", "Santiago", "Núñez", "Cortés", "Pastor",
  ],

  pt: [
    "Silva", "Costa", "Ferreira", "Sousa", "Lopes", "Moreira", "Pinto", "Nunes", "Tavares", "Baptista",
    "Rocha", "Cardoso", "Matos", "Freitas", "Braga", "Valente", "Santos", "Oliveira", "Pereira", "Rodrigues",
    "Martins", "Gomes", "Carvalho", "Teixeira", "Correia", "Mendes", "Coelho", "Monteiro", "Neves", "Cunha",
    "Pires", "Ribeiro", "Antunes", "Azevedo", "Faria", "Barbosa", "Fonseca", "Marques", "Araújo", "Vieira",
    "Moura", "Campos", "Simões", "Loureiro", "Dias", "Machado", "Henriques", "Cruz", "Borges", "Varela",
  ],

  de: [
    "Fischer", "Weber", "Wagner", "Becker", "Hoffmann", "Schulz", "Kaiser", "Vogel", "Brandt", "Winter",
    "Sommer", "Wolf", "Lang", "Berger", "Haas", "Frei", "Müller", "Schmidt", "Schneider", "Friedrich",
    "Klein", "Richter", "Koch", "Bauer", "Huber", "Winkler", "Kraus", "Lehmann", "Schwarz", "Zimmermann",
    "Krüger", "Hartmann", "Lange", "Werner", "Schmitz", "Keller", "Neumann", "Peters", "Roth", "Frank",
    "Jäger", "Lorenz", "Kuhn", "Arnold", "Graf", "Busch", "Vogt", "Horn", "Seidel", "Brand",
  ],

  nl: [
    "de Vries", "Jansen", "Bakker", "Visser", "Smit", "Meijer", "Bosch", "Vermeer", "de Jong", "Kramer",
    "van Dijk", "Post", "Willems", "Prins", "Klein", "de Wit", "van den Berg", "van der Meer", "van Leeuwen", "de Boer",
    "Mulder", "van der Linden", "Dekker", "van der Heijden", "van der Veen", "Kuiper", "Schouten", "Dijkstra", "Blom", "Vos",
    "Hoekstra", "van Dam", "de Graaf", "Verhoeven", "van Beek", "Hendriks", "van der Wal", "Bos", "Kok", "Peeters",
    "van der Horst", "Maas", "Smit", "van der Laan", "Jacobs", "Willemsen", "Vink", "Koster", "Martens", "Evers",
  ],

  uk: [
    "Shevchenko", "Kovalenko", "Bondar", "Tkachuk", "Melnyk", "Kravets", "Boyko", "Lysenko", "Marchuk", "Savchuk",
    "Petrenko", "Danylko", "Koval", "Zinchenko", "Hnatiuk", "Romaniuk", "Tkachenko", "Polishchuk", "Klymenko", "Moroz",
    "Kovalchuk", "Oliynyk", "Kravchenko", "Sydorenko", "Pavlenko", "Honchar", "Kucherenko", "Mazur", "Fedorenko", "Rudenko",
    "Vovk", "Melnyk", "Bereza", "Kushnir", "Hrytsenko", "Marchenko", "Yaremchuk", "Dovzhenko", "Levchenko", "Kozak",
    "Bondarenko", "Tymoshenko", "Shapoval", "Ponomarenko", "Havryliuk", "Ostapenko", "Semenko", "Lytvyn", "Bilyk", "Chernenko",
  ],

  el: [
    "Papadakis", "Nikolaou", "Georgiou", "Vassiliou", "Dimou", "Pappas", "Christou", "Antoniou", "Makris", "Petrou",
    "Sideris", "Manos", "Lazaris", "Fotiou", "Vlachos", "Rallis", "Papadopoulos", "Papanikolaou", "Kostas", "Dimitriou",
    "Karagiannis", "Ioannidis", "Kouris", "Alexiou", "Theodorou", "Stavrou", "Katsaros", "Mavridis", "Nikolaidis", "Panagiotou",
    "Angelopoulos", "Vasilakis", "Galanis", "Zervas", "Kallias", "Kondylis", "Lazarou", "Mantzios", "Oikonomou", "Petridis",
    "Raptis", "Spyridis", "Tsakiris", "Kourtidis", "Markopoulos", "Daskalakis", "Kontos", "Sarantis", "Kefalas", "Vrettos",
  ],

  hr: [
    "Horvat", "Kovačević", "Marić", "Jurić", "Novak", "Babić", "Perić", "Vuković", "Knežević", "Matić",
    "Petrović", "Blažević", "Radić", "Šarić", "Tomić", "Barišić", "Kovač", "Pavlović", "Grgić", "Marković",
    "Vidović", "Nikolić", "Božić", "Lovrić", "Šimić", "Pavić", "Rajić", "Milić", "Vidaković", "Klarić",
    "Matičević", "Delić", "Vukelić", "Perković", "Jukić", "Kralj", "Čović", "Bilić", "Šarić", "Bašić",
    "Vlašić", "Radičević", "Tadić", "Maras", "Grubišić", "Zorić", "Špoljarić", "Katić", "Bošnjak", "Brajković",
  ],

  sr: [
    "Jovanović", "Petrović", "Nikolić", "Ilić", "Marković", "Đorđević", "Stojanović", "Pavlović", "Kovačević", "Lukić",
    "Ristić", "Simić", "Todorović", "Kostić", "Mitrović", "Vasić", "Popović", "Milošević", "Stanković", "Stefanović",
    "Đukić", "Mandić", "Živković", "Savić", "Mladenović", "Janković", "Mihajlović", "Vuković", "Pantić", "Knežević",
    "Dimitrijević", "Matić", "Ivić", "Radosavljević", "Lazarević", "Obradović", "Maksimović", "Aleksić", "Vučković", "Radović",
    "Milovanović", "Nikolić", "Bošković", "Kovač", "Grujić", "Tomić", "Vujović", "Drašković", "Babić", "Stojković",
  ],

  pl: [
    "Kowalski", "Nowak", "Wiśniewski", "Wójcik", "Kamiński", "Lewandowski", "Zieliński", "Szymański", "Dąbrowski", "Kozłowski",
    "Mazur", "Krawczyk", "Piotrowski", "Grabowski", "Zawadzki", "Sikora", "Jankowski", "Pawłowski", "Michalski", "Król",
    "Wieczorek", "Jabłoński", "Wróbel", "Nowicki", "Majewski", "Olszewski", "Stępień", "Jaworski", "Malinowski", "Adamczyk",
    "Dudek", "Górski", "Pawlik", "Walczak", "Rutkowski", "Baran", "Michalak", "Szczepański", "Wasilewski", "Czarnecki",
    "Marciniak", "Kubiak", "Kaczmarek", "Piotrowski", "Bąk", "Krupa", "Lis", "Witkowski", "Sadowski", "Zając",
  ],
}

export type ArtistType = "solo" | "duo" | "group"

export type Artist = {
  id: string
  name: string
  type: ArtistType
  members: string[]
}

type Song = {
  title: string
  artist: Artist
  genre: Genre
  native: boolean
  veteran: boolean
}

// Quality edge granted to a returning (veteran) artist.
export const VETERAN_BONUS = 7

const ENGLISH_GROUP_NAMES = [
  "Northern Lights",
  "Silverline",
  "Neon Hearts",
  "Midnight Avenue",
  "Wildfire",
  "Blue Horizon",
  "Golden Hour",
  "The Wanderers",
  "Electric Soul",
  "Starfall",
  "Velvet Sky",
  "The Dreamers",
  "Night Drive",
  "Freefall",
  "Moonlight Club",
  "Paper Hearts",
  "Firelight",
  "The Nomads",
  "Echo Valley",
  "Black Diamond",
  "City Lights",
  "The Wild Ones",
  "Red Horizon",
  "The Runaways",
  "Zero Gravity",
  "After Midnight",
  "Broken Arrows",
  "Silver Moon",
  "The Strangers",
  "Wild Hearts",
  "Eternal Summer",
  "Crimson Sky",
  "Golden Shadows",
  "Electric Avenue",
  "Midnight Echo",
  "The Outlaws",
  "Dream State",
  "Neon Valley",
  "Static Hearts",
  "Lost Highway",
  "The Satellites",
  "Night Bloom",
  "Gravity",
  "The Rebels",
  "Velvet Moon",
  "Fire & Ice",
  "The Nomads",
  "Midnight Rain",
  "Crystal Hearts",
  "The Skylines",
  "Wild Horizon",
  "Silver Echo",
  "The Mavericks",
  "Neon Dreams",
  "Northern Star",
  "The Voyagers",
  "Electric Dreams",
  "Afterglow",
  "The Unknowns",
  "Golden Shadows",
  "Midnight Sun",
  "The Comets",
  "Parallel Lines",
  "The Starlights",
  "Dark Matter",
  "The Free Spirits",
  "Ocean Drive",
  "The Night Owls",
  "Red Moon",
  "The Fireflies",
  "Velvet Storm",
  "The Bluebirds",
  "Midnight Theory",
  "The Soundwaves",
  "Silver Storm",
  "The Daydreamers",
  "Neon Tide",
  "The Skylarks",
  "Wildfire",
  "The Moonwalkers",
  "Electric Hearts",
  "The Horizons",
  "Starlight",
  "The Wanderers",
  "Crystal Sky",
  "Nightfall",
  "The Dreamcatchers",
  "Sunset Avenue",
  "The Echoes",
  "Black Velvet",
  "The Rising",
  "Moonlit",
  "The Phoenixes",
  "Golden Lights",
  "The Afterhours",
  "Cosmic Love",
  "The Firebirds",
]

const GROUP_NAMES: Record<string, string[]> = {
  // 🇪🇸 Spanish
  es: [
    "Los Horizontes",
    "Luz del Sur",
    "La Última Ola",
    "Corazón Eléctrico",
    "Noche Abierta",
    "Alma Libre",
    "Cielo Rojo",
    "Fuego Azul",
    "Los Errantes",
    "Marea Alta",
    "Vértigo",
    "Tiempo Cero",
    "La Distancia",
    "Río Salvaje",
    "Estrella Polar",
    "Punto de Fuga",
    "Voces del Mar",
    "Ciudad Lunar",
    "Sombra y Luz",
    "Los Inquietos",
    "A Contraluz",
    "Latido",
    "Horizonte Sur",
    "Los Navegantes",
    "Prisma",
    "Medianoche",
    "Los Desvelados",
    "Calle Abierta",
    "Kilómetro Cero",
    "Fuego Interior",
  ],

  // 🇫🇷 French
  fr: [
    "Les Étoiles",
    "Lumière Noire",
    "Nuit Blanche",
    "Cœur Électrique",
    "Les Insoumis",
    "Dernier Métro",
    "Rêve Éveillé",
    "L'Onde",
    "Les Vagabonds",
    "Feu de Nuit",
    "Éclat",
    "Minuit",
    "Ciel Rouge",
    "Les Amants",
    "Libre Comme l'Air",
    "La Traversée",
    "Lueur",
    "Les Égarés",
    "Point Zéro",
    "Soleil Noir",
    "La Marée",
    "Étoile Filante",
    "Les Oubliés",
    "Horizon Bleu",
    "Sans Limites",
    "L'Instant",
    "Cœur Sauvage",
    "Les Nomades",
    "Après Minuit",
    "Lumière du Sud",
  ],

  // 🇮🇹 Italian
  it: [
    "Luna Rossa",
    "Le Stelle",
    "Cuore Elettrico",
    "Luce di Notte",
    "Fuoco Nero",
    "Gli Erranti",
    "Cielo Aperto",
    "Anima Libera",
    "Mare Blu",
    "Mezzanotte",
    "Punto Zero",
    "Vento del Sud",
    "Gli Inquieti",
    "Onda Lunga",
    "Stella Polare",
    "Senza Confini",
    "Città Invisibile",
    "Fuoco d'Argento",
    "I Sognatori",
    "Ultima Fermata",
    "Luce Rossa",
    "Cuore Selvaggio",
    "Gli Eroi",
    "Orizzonte",
    "Notte Eterna",
    "Riflessi",
    "Voci del Mare",
    "I Nomadi",
    "Oltre il Cielo",
    "Fiamma",
  ],

  // 🇩🇪 German
  de: [
    "Nordlicht",
    "Silberherz",
    "Nachtwind",
    "Sternenflug",
    "Dunkelgold",
    "Die Wanderer",
    "Freier Fall",
    "Lichtblick",
    "Morgenrot",
    "Nachtfalter",
    "Die Unruhigen",
    "Horizont",
    "Feuerherz",
    "Schattenlicht",
    "Mondschein",
    "Fernweh",
    "Die Träumer",
    "Nordstern",
    "Sturmvogel",
    "Zwischenwelt",
    "Neonherz",
    "Die Suchenden",
    "Himmelwärts",
    "Letzte Nacht",
    "Wellenbrecher",
    "Silbermond",
    "Die Nomaden",
    "Grenzenlos",
    "Nachtschicht",
    "Licht und Schatten",
  ],

  // 🇬🇧 English
  en: [
    "Northern Lights",
    "Silverline",
    "Neon Hearts",
    "Midnight Avenue",
    "The Wanderers",
    "Electric Soul",
    "Wildfire",
    "Blue Horizon",
    "Golden Hour",
    "The Outlaws",
    "Night Drive",
    "Velvet Sky",
    "The Dreamers",
    "Broken Arrows",
    "Starfall",
    "After Midnight",
    "The Strangers",
    "Moonlight Club",
    "Paper Hearts",
    "Firelight",
    "The Nomads",
    "Echo Valley",
    "Black Diamond",
    "Freefall",
    "The Wild Ones",
    "City Lights",
    "Red Horizon",
    "The Runaways",
    "Silver Moon",
    "Zero Gravity",
  ],

  // 🇳🇱 Dutch
  nl: [
    "De Sterren",
    "Zilverlicht",
    "Nachtvlucht",
    "Noorderlicht",
    "De Dromers",
    "Hartslag",
    "Vrije Val",
    "Nachtwind",
    "De Zwervers",
    "Gouden Uur",
    "Maanlicht",
    "De Onrustigen",
    "Blauwe Horizon",
    "Vuurhart",
    "Sterrenregen",
    "Donkerlicht",
    "De Reizigers",
    "Zonder Grenzen",
    "Middernacht",
    "Lange Golf",
    "De Vrijen",
    "Rode Maan",
    "Schaduwdans",
    "De Nachtuilen",
    "Zilveren Hart",
    "Lichtstad",
    "De Dwalers",
    "Open Hemel",
    "Stormvogel",
    "Eeuwige Zomer",
  ],

  // 🇸🇪 Swedish
  sv: [
    "Norrsken",
    "Silverljus",
    "Midnatt",
    "Stjärnfall",
    "De Vandrande",
    "Vilda Hjärtan",
    "Månskimmer",
    "Nordstjärna",
    "Fri Själ",
    "Nattvind",
    "Gyllene Timmen",
    "Drömmarna",
    "Blå Horisont",
    "Eldhjärta",
    "Skymningsljus",
    "De Rastlösa",
    "Vinterljus",
    "Havets Röster",
    "Sista Dansen",
    "Mellan Världar",
    "Silverhjärta",
    "Nattfjäril",
    "Den Fria Vägen",
    "Röd Himmel",
    "Stjärnljus",
    "De Namnlösa",
    "Evig Natt",
    "Nordvind",
    "Ljusets Barn",
    "Vildmark",
  ],

  // 🇳🇴 Norwegian
  no: [
    "Nordlys",
    "Midnattssol",
    "Stjerneskudd",
    "Nattvind",
    "De Vandrende",
    "Ville Hjerter",
    "Fri Sjæl",
    "Blå Horisont",
    "Gyllen Time",
    "Drømmerne",
    "Nordstjernen",
    "Måneskinn",
    "Eldhjerte",
    "De Rastløse",
    "Stormfugler",
    "Sølvlys",
    "Nattuglene",
    "Evig Sommer",
    "Mellom Verdener",
    "Rød Himmel",
    "Havets Stemmer",
    "Siste Dans",
    "Uten Grenser",
    "Skygge og Lys",
    "De Frie",
    "Vinterlys",
    "Midnatt",
    "Villmark",
    "Nordavind",
    "Stjernelys",
  ],

  // 🇫🇮 Finnish
  fi: [
    "Revontulet",
    "Tähtisade",
    "Yövalo",
    "Unelmoijat",
    "Vapaa Sielu",
    "Pohjantähti",
    "Hopeasydän",
    "Yön Tuuli",
    "Vaeltajat",
    "Sininen Horisontti",
    "Keskiyö",
    "Villi Sydän",
    "Kultainen Hetki",
    "Varjo ja Valo",
    "Yön Varjot",
    "Tähtien Alla",
    "Vapaat",
    "Myrskylinnut",
    "Punainen Taivas",
    "Hiljainen Yö",
    "Pohjoistuuli",
    "Unien Kaupunki",
    "Viimeinen Tanssi",
    "Hopeinen Kuu",
    "Rajattomat",
    "Meren Äänet",
    "Yöperhoset",
    "Ikuinen Kesä",
    "Tulen Sydän",
    "Uusi Aamu",
  ],

  // 🇵🇱 Polish
  pl: [
    "Północne Światła",
    "Srebrne Serce",
    "Nocny Wiatr",
    "Gwiezdny Pył",
    "Wędrowcy",
    "Wolna Dusza",
    "Czerwone Niebo",
    "Błękitny Horyzont",
    "Złota Godzina",
    "Marzyciele",
    "Nocne Ptaki",
    "Dziki Ogień",
    "Między Światami",
    "Cień i Światło",
    "Bez Granic",
    "Ostatni Taniec",
    "Samotna Gwiazda",
    "Nocni Wędrowcy",
    "Srebrny Księżyc",
    "Głosy Morza",
    "Płonące Serce",
    "Ciche Miasto",
    "Zimowe Światło",
    "Wolni",
    "Gwiazdy Północy",
    "Czarna Fala",
    "Wieczny Sen",
    "Nocna Zmiana",
    "Dzikie Serca",
    "Nowy Świt",
  ],

  // 🇬🇷 Greek
  el: [
    "Αστέρια",
    "Βόρειο Φως",
    "Νυχτερινή Πόλη",
    "Ασημένια Καρδιά",
    "Άγριες Ψυχές",
    "Οι Ταξιδιώτες",
    "Κόκκινος Ορίζοντας",
    "Χρυσή Νύχτα",
    "Όνειρο",
    "Φωτιά",
    "Μεσάνυχτα",
    "Ελεύθερες Ψυχές",
    "Σκιές και Φως",
    "Νυχτερινός Άνεμος",
    "Αστρική Σκόνη",
    "Οι Περιπλανώμενοι",
    "Μπλε Ουρανός",
    "Καρδιά της Φωτιάς",
    "Τελευταίος Χορός",
    "Χωρίς Σύνορα",
    "Φωνές της Θάλασσας",
    "Κόκκινο Φεγγάρι",
    "Αιώνιο Καλοκαίρι",
    "Νέα Αυγή",
    "Ασημένιο Φεγγάρι",
    "Άγρια Καρδιά",
    "Τα Όνειρα",
    "Βραδινό Φως",
    "Βόρειος Άνεμος",
    "Ελεύθεροι",
  ],

  // 🇵🇹 Portuguese
  pt: [
    "Luz do Norte",
    "Coração Selvagem",
    "Noite Branca",
    "Alma Livre",
    "Os Viajantes",
    "Horizonte Azul",
    "Céu Vermelho",
    "Lua Prateada",
    "Sonho Eterno",
    "Vento do Mar",
    "Estrelas Cadentes",
    "Coração Elétrico",
    "Os Errantes",
    "Fogo Selvagem",
    "Entre Mundos",
    "Sem Fronteiras",
    "Última Dança",
    "Luz e Sombra",
    "Noite de Verão",
    "Vozes do Mar",
    "Hora Dourada",
    "Lua Vermelha",
    "Os Sonhadores",
    "Alma de Fogo",
    "Vento Norte",
    "Cidade Lunar",
    "Noite Infinita",
    "Céu Aberto",
    "Coração de Prata",
    "Novo Amanhecer",
  ],

  // 🇭🇷 Croatian
  hr: [
    "Sjeverne Zvijezde",
    "Srebrno Srce",
    "Noćni Vjetar",
    "Crveno Nebo",
    "Slobodne Duše",
    "Lutalice",
    "Zvjezdani Trag",
    "Plavi Horizont",
    "Zlatna Noć",
    "Divlje Srce",
    "Ponoć",
    "Svjetlo i Sjena",
    "Posljednji Ples",
    "Glasovi Mora",
    "Vječno Ljeto",
    "Srebrni Mjesec",
    "Putnici",
    "Noćne Ptice",
    "Između Svjetova",
    "Bez Granica",
    "Vatreno Srce",
    "Nova Zora",
    "Zvijezde",
    "Crveni Mjesec",
    "Tihi Grad",
    "Slobodni",
    "Sjeverni Vjetar",
    "Snovi",
    "Noćni Val",
    "Zlatno Srce",
  ],

  // 🇷🇸 Serbian
  sr: [
    "Severne Zvezde",
    "Srebrno Srce",
    "Noćni Vetar",
    "Crveno Nebo",
    "Slobodne Duše",
    "Lutalice",
    "Zvezdani Trag",
    "Plavi Horizont",
    "Zlatna Noć",
    "Divlje Srce",
    "Ponoć",
    "Svetlo i Senka",
    "Poslednji Ples",
    "Glasovi Mora",
    "Večno Leto",
    "Srebrni Mesec",
    "Putnici",
    "Noćne Ptice",
    "Između Svetova",
    "Bez Granica",
    "Vatreno Srce",
    "Nova Zora",
    "Zvezde",
    "Crveni Mesec",
    "Tihi Grad",
    "Slobodni",
    "Severni Vetar",
    "Snovi",
    "Noćni Talas",
    "Zlatno Srce",
  ],

  // 🇺🇦 Ukrainian
  uk: [
    "Північне Сяйво",
    "Срібне Серце",
    "Нічний Вітер",
    "Червоне Небо",
    "Вільні Душі",
    "Мандрівники",
    "Зоряний Шлях",
    "Синій Горизонт",
    "Золота Ніч",
    "Дике Серце",
    "Опівночі",
    "Світло і Тінь",
    "Останній Танок",
    "Голоси Моря",
    "Вічне Літо",
    "Срібний Місяць",
    "Подорожні",
    "Нічні Птахи",
    "Між Світами",
    "Без Меж",
    "Вогняне Серце",
    "Новий Світанок",
    "Зорі",
    "Червоний Місяць",
    "Тихе Місто",
    "Вільні",
    "Північний Вітер",
    "Мрійники",
    "Нічна Хвиля",
    "Золоте Серце",
  ],

  // 🌍 Fallback for countries that still use lang: "default"
  default: [
    "Northern Lights",
    "Silver Hearts",
    "Midnight",
    "Wild Horizon",
    "The Wanderers",
    "Electric Soul",
    "Starfall",
    "Blue Horizon",
    "The Dreamers",
    "Nightfall",
    "Golden Hour",
    "Free Spirits",
    "Red Moon",
    "Fireheart",
    "The Nomads",
    "Moonlight",
    "Zero Gravity",
    "The Outlaws",
    "Night Birds",
    "Wild Hearts",
    "After Midnight",
    "Echo Valley",
    "The Strangers",
    "Black Diamond",
    "City Lights",
    "Freefall",
    "Silver Moon",
    "The Runaways",
    "Eternal Summer",
    "New Dawn",
  ],
}

function generateArtistName(
  country: Country,
  rng: () => number,
  usedArtists: Set<string>,
): Artist {
  const first = FIRST_NAMES[country.lang] ?? FIRST_NAMES.default
  const last = LAST_NAMES[country.lang] ?? LAST_NAMES.default

  const createMember = () =>
    `${pick(first, rng)} ${pick(last, rng)}`

  const createUniqueMemberList = (count: number) => {
    const members: string[] = []

    let attempts = 0

    while (members.length < count && attempts < 100) {
      const member = createMember()

      if (!members.includes(member)) {
        members.push(member)
      }

      attempts++
    }

    return members
  }

  const createUniqueArtistId = (name: string) => {
    const base = `${country.id}-${name
      .toLowerCase()
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-|-$/g, "")}`

    let id = base
    let suffix = 2

    while (usedArtists.has(id)) {
      id = `${base}-${suffix}`
      suffix++
    }

    return id
  }

  const roll = rng()

  // 25% → grupo
  if (roll < 0.25) {
    const memberCount = 3 + Math.floor(rng() * 4)
    const members = createUniqueMemberList(memberCount)
    const name = generateGroupName(country, rng)
    const id = createUniqueArtistId(name)

    return {
      id,
      name,
      type: "group",
      members,
    }
  }

  // 20% → dúo
  if (roll < 0.45) {
    const members = createUniqueMemberList(2)
    const name = members.join(" & ")
    const id = createUniqueArtistId(name)

    return {
      id,
      name,
      type: "duo",
      members,
    }
  }

  // 55% → solista
  const members = createUniqueMemberList(1)
  const name = members[0]
  const id = createUniqueArtistId(name)

  return {
    id,
    name,
    type: "solo",
    members,
  }
}

export function generateSong(
  countryId: string,
  year: number,
  usedArtists: Set<string>,
  returningArtists: Artist[] = [],
): Song {
  const c = getCountry(countryId) ?? COUNTRIES[0]

  // Los artistas se generan de forma aleatoria.
  // Las canciones mantienen su generación independiente.
  const rng = Math.random

  const genre = pick(GENRES, rng)

  // 8% de posibilidades de recuperar un artista anterior
  // del mismo país.
  const veteran =
    returningArtists.length > 0 && rng() < 0.08

  let artist: Artist

  if (veteran) {
    artist = pick(returningArtists, rng)
  } else {
    artist = generateArtistName(
      c,
      rng,
      usedArtists,
    )
  }

  const nativeTitles = LANG_TITLES[c.lang]
  const englishTitles = LANG_TITLES.en

  let title: string
  let native = false

  if (nativeTitles && rng() < 0.33) {
    title = pick(nativeTitles, rng)
    native = true
  } else {
    title = pick(englishTitles, rng)
  }

  return {
    title,
    artist,
    genre,
    native,
    veteran,
  }
}

function generateGroupName(
  country: Country,
  rng: () => number,
): string {
  // 70% → nombre internacional en inglés
  if (rng() < 0.7) {
    return pick(ENGLISH_GROUP_NAMES, rng)
  }

  // 30% → nombre en el idioma local
  const localNames =
    GROUP_NAMES[country.lang] ?? GROUP_NAMES.default

  return pick(localNames, rng)
}

// ---------- Yearly line-up (withdrawals + real excuses) ----------

const WITHDRAWAL_REASONS = [
  "withdrew citing the rising cost of participation.",
  "pulled out after national broadcaster budget cuts.",
  "sat out this year over an EBU membership dispute.",
  "withdrew following a broadcasting-rights disagreement.",
  "skipped this edition amid internal broadcaster restructuring.",
  "pulled out over a political controversy surrounding the host.",
  "failed to secure government funding before the deadline.",
  "opted out after a run of poor results and low viewership.",
  "withdrew due to a scheduling clash with a national election.",
  "suspended its entry over a sponsorship funding shortfall.",
  "withdrew after failing to reach an agreement with the national broadcaster.",
  "pulled out following a change in the broadcaster's leadership.",
  "withdrew after the broadcaster redirected its budget to domestic programming.",
  "decided to skip this edition due to rising production costs.",
  "withdrew after failing to secure a suitable Eurovision venue.",
  "pulled out following disagreements over the selection process.",
  "withdrew after its planned national selection was cancelled.",
  "skipped this year's contest due to concerns over audience interest.",
  "withdrew after the broadcaster failed to meet the participation deadline.",
  "pulled out following a dispute over broadcasting obligations.",
  "withdrew after its Eurovision budget was frozen pending a financial review.",
  "decided not to participate while the broadcaster reviews its international strategy.",
  "withdrew after failing to secure a confirmed artist for the contest.",
  "pulled out after its selected artist became unavailable.",
  "withdrew following concerns over the cost of staging and promotion.",
  "skipped the contest while undergoing a major restructuring of its public broadcaster.",
  "withdrew after negotiations with the EBU failed to resolve participation terms.",
  "pulled out following a dispute over the allocation of broadcasting fees.",
  "withdrew after the national broadcaster announced a temporary spending freeze.",
  "decided to take a one-year break from the contest due to financial pressures.",
  "withdrew following uncertainty over the broadcaster's future funding.",
  "pulled out after failing to secure sufficient commercial sponsorship.",
  "withdrew amid uncertainty surrounding the country's broadcasting licence.",
  "skipped this edition while reviewing its long-term participation strategy.",
  "withdrew after the broadcaster faced unexpected technical and production costs.",
  "pulled out following a change in national broadcasting policy.",
  "withdrew after its planned entry was deemed financially unviable.",
  "decided to skip the contest due to competing domestic broadcasting priorities.",
  "withdrew following an unresolved dispute with the national selection committee.",
  "pulled out after the broadcaster postponed its Eurovision preparations.",
]

export type Withdrawal = { country: Country; reason: string }

export type Season = {
  participants: Country[]
  withdrawals: Withdrawal[]
}

// Big Five + the host always participate; others may withdraw. Deterministic
// per (year, host) so the line-up is stable while the player is choosing.
export function getSeason(year: number, hostId: string): Season {
  const rng = mulberry32(hashSeed(`season-${year}-${hostId}`))
  const protectedIds = new Set<string>([...BIG_FIVE, hostId])
  const eligible = COUNTRIES.filter((c) => !protectedIds.has(c.id))
  const shuffled = seededShuffle(eligible, rng)
  const count = 2 + Math.floor(rng() * 4) // 2–5 withdrawals per year
  const withdrawn = shuffled.slice(0, count)
  const withdrawals: Withdrawal[] = withdrawn
    .map((c) => ({
      country: c,
      reason: WITHDRAWAL_REASONS[Math.floor(rng() * WITHDRAWAL_REASONS.length)],
    }))
    .sort((a, b) => a.country.name.localeCompare(b.country.name))
  const withdrawnIds = new Set(withdrawn.map((c) => c.id))
  const participants = COUNTRIES.filter((c) => !withdrawnIds.has(c.id))
  return { participants, withdrawals }
}

// ---------- Decisions (one stage-director call per country, per year) ----------

export type Effect = Partial<Stats>

export type Choice = {
  label: string
  effects: Effect
}

export type Decision = {
  id: string
  role: string
  prompt: string
  left: Choice
  right: Choice
}

// As stage director every call is a tug-of-war between the SONG and the STAGING.
export const DECISIONS: Decision[] = [
  {
    id: "bridge",
    role: "Songwriter",
    prompt: "Budget's tight. Spend it rewriting the bridge, or on a jaw-dropping aerial acrobatics moment?",
    left: { label: "Rewrite bridge", effects: { song: 12, staging: -5 } },
    right: { label: "Aerial acrobatics", effects: { staging: 12, song: -5 } },
  },
  {
    id: "raw",
    role: "Stage Director",
    prompt: "Strip the arrangement down to a raw vocal moment, or blow the budget on pyrotechnics?",
    left: { label: "Raw vocal moment", effects: { song: 10, staging: -4 } },
    right: { label: "Pyrotechnics", effects: { staging: 11, song: -3 } },
  },
  {
    id: "keychange",
    role: "Songwriter",
    prompt: "Add the classic Eurovision key change for drama, or engineer a stunning costume reveal instead?",
    left: { label: "Big key change", effects: { song: 9, staging: -3 } },
    right: { label: "Costume reveal", effects: { staging: 10, song: -4 } },
  },
  {
    id: "orchestra",
    role: "Producer",
    prompt: "Record a lush orchestral layer for the track, or build a giant LED backdrop for the stage?",
    left: { label: "Orchestral layer", effects: { song: 11, staging: -4 } },
    right: { label: "Giant LED set", effects: { staging: 12, song: -5 } },
  },
  {
    id: "dance",
    role: "Choreographer",
    prompt: "Tighten the tempo to a radio-friendly cut, or choreograph a viral, meme-ready dance break?",
    left: { label: "Tighten tempo", effects: { song: 8, staging: -2 } },
    right: { label: "Viral dance", effects: { staging: 11, song: -4 } },
  },
  {
    id: "guest",
    role: "Head of Delegation",
    prompt: "Fly in a star guest songwriter, or a celebrity choreographer? You can only afford one.",
    left: { label: "Guest songwriter", effects: { song: 12, staging: -4 } },
    right: { label: "Celebrity choreographer", effects: { staging: 12, song: -4 } },
  },
  {
    id: "rehearsal",
    role: "Stage Director",
    prompt: "Devote the final rehearsals to nailing the vocal, or to perfecting the stagecraft?",
    left: { label: "Drill the vocal", effects: { song: 9, staging: -3 } },
    right: { label: "Perfect stagecraft", effects: { staging: 10, song: -3 } },
  },
  {
    id: "silence",
    role: "Songwriter",
    prompt: "Cut the second verse for a dramatic silence, or fill the stage with a wind-machine spectacle?",
    left: { label: "Dramatic silence", effects: { song: 8, staging: -2 } },
    right: { label: "Wind-machine spectacle", effects: { staging: 9, song: -2 } },
  },
  {
    id: "language",
    role: "Songwriter",
    prompt: "Translate the lyric into English for wider appeal, or keep it native and lean on striking visuals?",
    left: { label: "Sing in English", effects: { song: 7, staging: -1 } },
    right: { label: "Native + visuals", effects: { staging: 9, song: -3 } },
  },
  {
    id: "melody",
    role: "Producer",
    prompt: "Invest in an unforgettable melody, or in cinematic background projections?",
    left: { label: "The melody", effects: { song: 11, staging: -4 } },
    right: { label: "Projections", effects: { staging: 11, song: -4 } },
  },
  {
    id: "band",
    role: "Set Designer",
    prompt: "Put a live band on stage for authenticity, or keep a clean, minimal set that lets the song breathe?",
    left: { label: "Live band", effects: { staging: 8, song: 1 } },
    right: { label: "Minimal set", effects: { song: 6, staging: -2 } },
  },
  {
    id: "finale",
    role: "Stage Director",
    prompt: "Rework the final chorus for a bigger climax, or trigger flame jets on the last note?",
    left: { label: "Rework the chorus", effects: { song: 10, staging: -3 } },
    right: { label: "Flame jets", effects: { staging: 11, song: -4 } },
  },
]

// ---------- Contest-night random events ----------

export type ContestEvent = {
  id: string
  text: string
  effect: Effect
}

export const CONTEST_EVENTS: ContestEvent[] = [
  { id: "viral", text: "A rehearsal clip goes viral on TikTok overnight.", effect: { staging: 8 } },
  { id: "cold", text: "The lead singer catches a cold days before the final.", effect: { song: -12 } },
  { id: "malfunction", text: "A wardrobe malfunction during the dress rehearsal.", effect: { staging: -12 } },
  { id: "standing", text: "The arena erupts in a mid-song standing ovation.", effect: { staging: 6, song: 3 } },
  { id: "pyro_fail", text: "The pyrotechnics misfire on live TV.", effect: { staging: -10 } },
  { id: "critics", text: "Critics hail the songwriting as the year's best.", effect: { song: 12 } },
  { id: "draw", text: "You draw a dreaded early slot in the running order.", effect: { staging: -6 } },
  { id: "primetime", text: "You land the coveted closing performance slot.", effect: { staging: 8 } },
  { id: "nerves", text: "Nerves make the live vocal shaky on the night.", effect: { song: -9 } },
  { id: "perfect", text: "A flawless, note-perfect live performance.", effect: { song: 11 } },
  { id: "meme", text: "The staging becomes an instant internet meme.", effect: { staging: 10, song: -3 } },
  { id: "backing", text: "A power flicker cuts the backing track for a beat.", effect: { song: -7 } },
]

// ---------- Core helpers ----------

export function clamp(n: number): number {
  return Math.max(STAT_MIN, Math.min(STAT_MAX, n))
}

export function applyEffect(stats: Stats, effect: Effect): Stats {
  const next: Stats = { ...stats }
  for (const key of STAT_ORDER) {
    if (effect[key] !== undefined) {
      next[key] = clamp(next[key] + (effect[key] as number))
    }
  }
  return next
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

// Fresh act each year, seeded by the country's pedigree and its chosen song.
export function seedStats(country: Country, song: Song): Stats {
  const s = country.strength
  return {
    song: clamp(Math.round(s + song.genre.song + rand(-8, 8))),
    staging: clamp(Math.round(s + song.genre.staging + rand(-8, 8))),
  }
}

// Overall performance rating from the two stats the director controls.
export function ratingOf(stats: Stats): number {
  return stats.song * 0.55 + stats.staging * 0.45
}

// ---------- Contest resolution ----------

export type Entry = {
  countryId: string
  managed: boolean
  song: Song
  finalStats: Stats
  quality: number
  veteran: boolean
  qualified: boolean
  autoQualified: boolean
  semiPoints: number // points scored in the semi-final
  semiPosition: number // rank in the semi-final (0 = went straight to the final)
  points: number // aggregate points from every voting country in the final
  position: number // rank among finalists (0 = did not qualify)
  event: ContestEvent | null // contest-night twist (managed entries only)
}

// The televote/jury points each country hands out to its top 10.
const POINTS_TABLE = [12, 10, 8, 7, 6, 5, 4, 3, 2, 1]

const GRAND_FINAL_SPOTS = 26

function blocAffinity(a: Country, b: Country): number {
  return a.bloc === b.bloc ? 4 : 0
}

// Runs 12→1 voting from a set of voters over a set of candidates, and writes
// the summed points back onto each candidate via `assign`.
function tallyVotes(
  voters: Country[],
  candidates: Entry[],
  jitter: number,
  assign: (entry: Entry, pts: number) => void,
) {
  const byId = new Map(candidates.map((c) => [c.countryId, c]))
  for (const voter of voters) {
    const ranked = candidates
      .filter((c) => c.countryId !== voter.id)
      .map((c) => ({
        id: c.countryId,
        v: c.quality + rand(-jitter, jitter) + blocAffinity(voter, getCountry(c.countryId)),
      }))
      .sort((a, b) => b.v - a.v)
    ranked.slice(0, 10).forEach((r, i) => {
      const c = byId.get(r.id)
      if (c) assign(c, POINTS_TABLE[i])
    })
  }
}

export type ContestInput = {
  participants: Country[]
  songs: Record<string, Song>
  managed: { countryId: string; stats: Stats }[]
  hostId: string
}

/**
 * Runs a full contest: seed every entry, run the semi-final (with its own
 * scoreboard so eliminated countries get a real position and points), then
 * aggregate Grand Final points from all voting countries (each awards
 * 12,10,8,7,6,5,4,3,2,1 to its top ten finalists).
 */
export function runContest(input: ContestInput): Entry[] {
  const { participants, songs, managed, hostId } = input
  const managedMap = new Map(managed.map((m) => [m.countryId, m]))

  // 1. Build every participant into an entry with a quality score.
  const entries: Entry[] = participants.map((c) => {
    const song = songs[c.id] ?? generateSong(c.id, 0)
    const vet = song.veteran ? VETERAN_BONUS : 0
    const m = managedMap.get(c.id)
    if (m) {
      const event = CONTEST_EVENTS[Math.floor(Math.random() * CONTEST_EVENTS.length)]
      const finalStats = applyEffect(m.stats, event.effect)
      return {
        countryId: c.id,
        managed: true,
        song,
        finalStats,
        quality: ratingOf(finalStats) * 0.9 + vet + rand(-5, 5),
        veteran: song.veteran,
        qualified: false,
        autoQualified: false,
        semiPoints: 0,
        semiPosition: 0,
        points: 0,
        position: 0,
        event,
      }
    }
    const finalStats = seedStats(c, song)
    return {
      countryId: c.id,
      managed: false,
      song,
      finalStats,
      quality: ratingOf(finalStats) * 0.82 + c.strength * 0.18 + vet + rand(-14, 14),
      veteran: song.veteran,
      qualified: false,
      autoQualified: false,
      semiPoints: 0,
      semiPosition: 0,
      points: 0,
      position: 0,
      event: null,
    }
  })

  // 2. Big Five + host go straight to the Grand Final.
  const auto = entries.filter((e) => BIG_FIVE.has(e.countryId) || e.countryId === hostId)
  auto.forEach((e) => {
    e.qualified = true
    e.autoQualified = true
  })

  // 3. Two semi-finals.
  //
  // Only countries that are not directly qualified compete in the semis.
  // They are split as evenly as possible between two semi-finals.
  // Each semi-final has its own ranking, so a country's position can never
  // exceed the number of countries actually competing in that semi.
  const semifinalists = entries.filter((e) => !e.autoQualified)

  const semi1: Entry[] = []
  const semi2: Entry[] = []

  // Alternate countries between the two semi-finals to keep them balanced.
  semifinalists.forEach((entry, index) => {
    if (index % 2 === 0) {
      semi1.push(entry)
    } else {
      semi2.push(entry)
    }
  })

  const runSemiFinal = (semi: Entry[]) => {
    // Reset semi-final points in case this helper is ever reused.
    semi.forEach((e) => {
      e.semiPoints = 0
      e.semiPosition = 0
    })

    // All participating countries vote in the semi-final.
    tallyVotes(participants, semi, 18, (e, pts) => {
      e.semiPoints += pts
    })

    // Rank ONLY against the countries in this semi-final.
    const ranked = [...semi].sort(
      (a, b) =>
        b.semiPoints - a.semiPoints ||
        b.quality - a.quality,
    )

    ranked.forEach((e, index) => {
      e.semiPosition = index + 1
    })

    // Top 10 qualify from each semi-final.
    ranked.slice(0, Math.min(10, ranked.length)).forEach((e) => {
      e.qualified = true
    })
  }

  runSemiFinal(semi1)
  runSemiFinal(semi2)

  // 4. Grand Final voting. Every participant awards points to its top 10.
  const finalists = entries.filter((e) => e.qualified)

  tallyVotes(participants, finalists, 20, (e, pts) => {
    e.points += pts
  })

  finalists.sort(
    (a, b) => b.points - a.points || b.quality - a.quality,
  )

  finalists.forEach((f, i) => {
    f.position = i + 1
  })

  return entries
}

// ---------- Outcome flavour ----------

export function placementLabel(entry: Entry): string {
  if (!entry.qualified) return "Did not qualify"
  if (entry.position === 1) return "WINNER"
  if (entry.position <= 3) return "Podium"
  if (entry.position <= 5) return "Top 5"
  if (entry.position <= 10) return "Left side of the board"
  return "Qualified"
}

export function placementFlavor(entry: Entry, finalists: number): string {
  if (!entry.qualified)
    return `Knocked out in the semi-final — ${entry.semiPosition}${ordinal(entry.semiPosition)} with ${entry.semiPoints} pts, just short of the Grand Final.`
  if (entry.position === 1)
    return "Douze points! Your country wins the Grand Final and hosts next year."
  if (entry.position <= 3) return "A place on the podium — the fans are ecstatic."
  if (entry.position <= 5) return "A confident Top 5 finish. The delegation is thrilled."
  if (entry.position <= 10) return "A respectable finish on the left side of the scoreboard."
  return `${entry.position}th of ${finalists} finalists. You made the final, but the points stayed shy.`
}

export function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"]
  const v = n % 100
  return s[(v - 20) % 10] ?? s[v] ?? s[0]
}

export const START_YEAR = 2027
export const START_HOST = "bg" 
export const MIN_ROSTER = 1
export const MAX_ROSTER = 4

export function getSeasonTitle(year: number, hostId: string): string {
  const host = getCountry(hostId)

  if (!host) return `${year}`

  const city = getHostCity(hostId, year)

  return `${city} (${host.name}) ${year}`
}

export function getHostCity(countryId: string, year: number): string {
  const country = getCountry(countryId)

  if (!country) return ""

  // Eurovision 2027 is a fixed exception: Burgas is the official Host City.
  if (countryId === "bg" && year === 2027) {
    return "Burgas"
  }

  const alternatives = country.alternativeCities ?? []

  // 95% → ciudad principal
  // 5% → ciudad alternativa
  if (alternatives.length === 0) {
    return country.city
  }

  const rng = mulberry32(hashSeed(`host-city-${countryId}-${year}`))

  if (rng() < 0.95) {
    return country.city
  }

  return pick(alternatives, rng)
}
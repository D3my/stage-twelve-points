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
  // Language key for song titles & artist names. Countries sharing a language
  // are geographic neighbours, so any name repeat stays "in the family".
  lang: string
}

// Only EBU / Eurovision-participating countries can be selected.
export const COUNTRIES: Country[] = [
  { id: "se", name: "Sweden", code: "SWE", colors: ["#006aa7", "#fecc00"], strength: 80, bloc: "nordic", city: "Stockholm", lang: "sv" },
  { id: "it", name: "Italy", code: "ITA", colors: ["#008c45", "#cd212a"], strength: 76, bloc: "south", city: "Turin", lang: "it" },
  { id: "ua", name: "Ukraine", code: "UKR", colors: ["#0057b7", "#ffd700"], strength: 74, bloc: "east", city: "Kyiv", lang: "uk" },
  { id: "fi", name: "Finland", code: "FIN", colors: ["#003580", "#ffffff"], strength: 70, bloc: "nordic", city: "Helsinki", lang: "fi" },
  { id: "il", name: "Israel", code: "ISR", colors: ["#0038b8", "#ffffff"], strength: 70, bloc: "south", city: "Tel Aviv", lang: "default" },
  { id: "ch", name: "Switzerland", code: "SUI", colors: ["#d52b1e", "#ffffff"], strength: 68, bloc: "west", city: "Basel", lang: "de" },
  { id: "fr", name: "France", code: "FRA", colors: ["#0055a4", "#ef4135"], strength: 66, bloc: "west", city: "Paris", lang: "fr" },
  { id: "nl", name: "Netherlands", code: "NED", colors: ["#ae1c28", "#21468b"], strength: 66, bloc: "west", city: "Rotterdam", lang: "nl" },
  { id: "hr", name: "Croatia", code: "CRO", colors: ["#ff0000", "#171796"], strength: 66, bloc: "balkan", city: "Zagreb", lang: "hr" },
  { id: "no", name: "Norway", code: "NOR", colors: ["#ba0c2f", "#00205b"], strength: 62, bloc: "nordic", city: "Oslo", lang: "no" },
  { id: "au", name: "Australia", code: "AUS", colors: ["#00843d", "#ffcd00"], strength: 62, bloc: "world", city: "Sydney", lang: "en" },
  { id: "at", name: "Austria", code: "AUT", colors: ["#ed2939", "#ffffff"], strength: 62, bloc: "west", city: "Vienna", lang: "de" },
  { id: "gr", name: "Greece", code: "GRE", colors: ["#0d5eaf", "#ffffff"], strength: 60, bloc: "south", city: "Athens", lang: "el" },
  { id: "ee", name: "Estonia", code: "EST", colors: ["#0072ce", "#000000"], strength: 60, bloc: "baltic", city: "Tallinn", lang: "default" },
  { id: "es", name: "Spain", code: "ESP", colors: ["#aa151b", "#f1bf00"], strength: 58, bloc: "south", city: "Madrid", lang: "es" },
  { id: "pt", name: "Portugal", code: "POR", colors: ["#006600", "#ff0000"], strength: 58, bloc: "south", city: "Lisbon", lang: "pt" },
  { id: "be", name: "Belgium", code: "BEL", colors: ["#000000", "#fdda24"], strength: 58, bloc: "west", city: "Brussels", lang: "fr" },
  { id: "cy", name: "Cyprus", code: "CYP", colors: ["#d57800", "#ffffff"], strength: 58, bloc: "south", city: "Nicosia", lang: "el" },
  { id: "az", name: "Azerbaijan", code: "AZE", colors: ["#00b5e2", "#ef3340"], strength: 56, bloc: "east", city: "Baku", lang: "default" },
  { id: "am", name: "Armenia", code: "ARM", colors: ["#d90012", "#0033a0"], strength: 56, bloc: "east", city: "Yerevan", lang: "default" },
  { id: "lt", name: "Lithuania", code: "LTU", colors: ["#fdb913", "#006a44"], strength: 56, bloc: "baltic", city: "Vilnius", lang: "default" },
  { id: "rs", name: "Serbia", code: "SRB", colors: ["#c6363c", "#0c4076"], strength: 56, bloc: "balkan", city: "Belgrade", lang: "sr" },
  { id: "is", name: "Iceland", code: "ISL", colors: ["#02529c", "#dc1e35"], strength: 56, bloc: "nordic", city: "Reykjavik", lang: "default" },
  { id: "md", name: "Moldova", code: "MDA", colors: ["#0046ae", "#ffd200"], strength: 56, bloc: "east", city: "Chisinau", lang: "default" },
  { id: "gb", name: "United Kingdom", code: "GBR", colors: ["#012169", "#c8102e"], strength: 54, bloc: "west", city: "London", lang: "en" },
  { id: "ie", name: "Ireland", code: "IRL", colors: ["#169b62", "#ff883e"], strength: 54, bloc: "west", city: "Dublin", lang: "en" },
  { id: "si", name: "Slovenia", code: "SLO", colors: ["#005ce6", "#ed1c24"], strength: 54, bloc: "balkan", city: "Ljubljana", lang: "default" },
  { id: "de", name: "Germany", code: "GER", colors: ["#000000", "#dd0000"], strength: 52, bloc: "west", city: "Hamburg", lang: "de" },
  { id: "pl", name: "Poland", code: "POL", colors: ["#dc143c", "#ffffff"], strength: 52, bloc: "east", city: "Warsaw", lang: "pl" },
  { id: "cz", name: "Czechia", code: "CZE", colors: ["#11457e", "#d7141a"], strength: 52, bloc: "east", city: "Prague", lang: "default" },
  { id: "lv", name: "Latvia", code: "LAT", colors: ["#9e3039", "#ffffff"], strength: 50, bloc: "baltic", city: "Riga", lang: "default" },
  { id: "ge", name: "Georgia", code: "GEO", colors: ["#ff0000", "#ffffff"], strength: 50, bloc: "east", city: "Tbilisi", lang: "default" },
  { id: "mt", name: "Malta", code: "MLT", colors: ["#ffffff", "#cf142b"], strength: 50, bloc: "south", city: "Valletta", lang: "en" },
  { id: "al", name: "Albania", code: "ALB", colors: ["#e41e20", "#000000"], strength: 48, bloc: "balkan", city: "Tirana", lang: "default" },
  { id: "sm", name: "San Marino", code: "SMR", colors: ["#5eb6e4", "#ffffff"], strength: 42, bloc: "south", city: "San Marino", lang: "it" },
]

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
  it: ["Cuore Selvaggio", "Notte Infinita", "Fuoco e Cenere", "L'Ultimo Ballo", "Stelle Cadenti", "Amore Eterno", "Luce del Nord", "Tempesta", "Il Mio Volo", "Sospiro"],
  fr: ["Cœur de Verre", "Sous la Pluie", "Éternité", "La Dernière Danse", "Lumière", "Envole-moi", "Nuit Blanche", "Feu Follet", "Mon Silence", "Tempête"],
  es: ["Corazón Salvaje", "Bajo la Luna", "Fuego Eterno", "La Última Noche", "Tormenta", "Vuelo", "Latido", "Sin Miedo", "Amanecer", "Espejismo"],
  pt: ["Coração Selvagem", "Sob a Chuva", "Fogo Eterno", "A Última Dança", "Tempestade", "Voo", "Saudade", "Sem Medo", "Amanhecer", "Miragem"],
  sv: ["Vilda Hjärtan", "Under Natten", "Evig Eld", "Sista Dansen", "Storm", "Norrsken", "Andetag", "Utan Rädsla", "Gryning", "Hägring"],
  no: ["Ville Hjerter", "Under Regnet", "Evig Ild", "Siste Dans", "Storm", "Nordlys", "Åndedrag", "Uten Frykt", "Daggry", "Luftspeiling"],
  de: ["Wildes Herz", "Unter dem Mond", "Ewiges Feuer", "Der Letzte Tanz", "Sturm", "Nordlicht", "Atemzug", "Ohne Angst", "Morgenrot", "Fata Morgana"],
  nl: ["Wild Hart", "Onder de Regen", "Eeuwig Vuur", "De Laatste Dans", "Storm", "Noorderlicht", "Ademtocht", "Zonder Angst", "Dageraad", "Luchtspiegeling"],
  uk: ["Dyke Sertse", "Pid Doshchem", "Vichnyy Vohon", "Ostannii Tanets", "Burya", "Polit", "Podykh", "Bez Strakhu", "Svitanok", "Mirazh"],
  fi: ["Villi Sydän", "Sateen Alla", "Ikuinen Tuli", "Viimeinen Tanssi", "Myrsky", "Revontulet", "Henkäys", "Ilman Pelkoa", "Aamunkoi", "Kangastus"],
  el: ["Agria Kardia", "Kato apo ti Vrohi", "Aionia Fotia", "Teleftaios Horos", "Kataigida", "Ptisi", "Anasa", "Horis Fovo", "Ximeroma", "Antikatoptrismos"],
  hr: ["Divlje Srce", "Pod Kišom", "Vječna Vatra", "Posljednji Ples", "Oluja", "Let", "Dah", "Bez Straha", "Zora", "Fatamorgana"],
  sr: ["Divlje Srce", "Pod Kišom", "Večna Vatra", "Poslednji Ples", "Oluja", "Let", "Dah", "Bez Straha", "Zora", "Priviđenje"],
  pl: ["Dzikie Serce", "Pod Deszczem", "Wieczny Ogień", "Ostatni Taniec", "Burza", "Lot", "Oddech", "Bez Strachu", "Świt", "Miraż"],
}

// Per-language name pools. Artists are first + last combos, so names read as
// local to each country and pools are effectively disjoint between languages.
const FIRST_NAMES: Record<string, string[]> = {
  default: ["Alex", "Nadia", "Milo", "Sasha", "Elin", "Dario", "Nina", "Leon", "Mara", "Ivo", "Tara", "Rudi", "Sena", "Vito", "Lea", "Noa"],
  en: ["Ellie", "Jonah", "Grace", "Mason", "Ruby", "Cole", "Ivy", "Reece", "Faye", "Miles", "Nora", "Blake", "Esme", "Dylan", "Lark", "Sage"],
  sv: ["Elin", "Måns", "Saga", "Viktor", "Tuva", "Anton", "Nova", "Loreen", "Felix", "Sanna", "Ludvig", "Astrid", "Kian", "Ebba", "Jonas", "Signe"],
  no: ["Aksel", "Ingrid", "Sondre", "Maja", "Emil", "Thea", "Kaja", "Ulrik", "Vilde", "Henrik", "Frida", "Odin", "Silje", "Nikolai", "Ronja", "Erik"],
  fi: ["Aino", "Eero", "Ilta", "Niko", "Sanni", "Väinö", "Helmi", "Onni", "Lumi", "Aleksi", "Venla", "Kaarle", "Sisu", "Roosa", "Tuuli", "Joel"],
  it: ["Giulia", "Marco", "Chiara", "Luca", "Sofia", "Matteo", "Elisa", "Dario", "Francesca", "Alessio", "Nina", "Gabriele", "Bianca", "Vito", "Serena", "Enzo"],
  fr: ["Camille", "Louis", "Chloé", "Hugo", "Manon", "Émile", "Léa", "Théo", "Elise", "Rémi", "Océane", "Julien", "Amélie", "Noé", "Sabine", "Lucas"],
  es: ["Lucía", "Mateo", "Carla", "Diego", "Sara", "Pablo", "Nerea", "Álvaro", "Rocío", "Hugo", "Marta", "Iván", "Elena", "Bruno", "Paula", "Adrián"],
  pt: ["Beatriz", "Tiago", "Inês", "Rui", "Mariana", "Diogo", "Salomé", "João", "Carolina", "Miguel", "Leonor", "André", "Matilde", "Nuno", "Sofia", "Duarte"],
  de: ["Lena", "Felix", "Mia", "Jonas", "Klara", "Max", "Greta", "Lukas", "Anke", "Emil", "Frida", "Noah", "Heike", "Tobias", "Svea", "Jan"],
  nl: ["Sanne", "Daan", "Fleur", "Sem", "Isa", "Bram", "Lotte", "Finn", "Roos", "Luuk", "Julia", "Thijs", "Noor", "Gijs", "Evi", "Stijn"],
  uk: ["Oksana", "Andriy", "Yulia", "Taras", "Sofiia", "Dmytro", "Iryna", "Bohdan", "Nadiia", "Olek", "Kateryna", "Yaroslav", "Alina", "Mykola", "Zlata", "Ivan"],
  el: ["Eleni", "Nikos", "Maria", "Yannis", "Sofia", "Dimitris", "Katerina", "Stelios", "Ioanna", "Petros", "Athina", "Kostas", "Danae", "Vasilis", "Marina", "Alexis"],
  hr: ["Ana", "Luka", "Ivana", "Marko", "Petra", "Ivan", "Lucija", "Josip", "Marija", "Filip", "Dora", "Tomislav", "Ena", "Nikola", "Klara", "Roko"],
  sr: ["Jelena", "Nikola", "Milica", "Stefan", "Ana", "Marko", "Teodora", "Luka", "Sara", "Nemanja", "Ivana", "Vuk", "Katarina", "Filip", "Mina", "Uroš"],
  pl: ["Zofia", "Kacper", "Maja", "Jakub", "Lena", "Filip", "Julia", "Szymon", "Alicja", "Wiktor", "Nadia", "Antoni", "Ola", "Michał", "Ewa", "Piotr"],
}

const LAST_NAMES: Record<string, string[]> = {
  default: ["Vale", "Novak", "Sol", "Marín", "Ríos", "Frost", "Lune", "Moon", "North", "Belle", "Storm", "Vega", "Reine", "Skye", "Asher", "Brant"],
  en: ["Hart", "Rivers", "Vale", "Fox", "Wren", "Blackwood", "Reed", "Sterling", "Frost", "Marlowe", "Ashford", "Quinn", "Rye", "Hale", "Snow", "Wilder"],
  sv: ["Lindqvist", "Berg", "Nyström", "Sundgren", "Holm", "Ekström", "Dahl", "Lundin", "Sjöberg", "Norén", "Falk", "Hedlund", "Åberg", "Wik", "Sten", "Brand"],
  no: ["Dahl", "Berg", "Solheim", "Haugen", "Lund", "Moen", "Vik", "Fjell", "Nord", "Strand", "Aas", "Brekke", "Hauge", "Stein", "Ryen", "Foss"],
  fi: ["Virtanen", "Nieminen", "Mäkinen", "Laine", "Koskinen", "Heikkilä", "Salo", "Aalto", "Lahti", "Rinne", "Toivonen", "Halla", "Kivi", "Ranta", "Salmi", "Vuori"],
  it: ["Rossi", "Conti", "Ferrari", "Greco", "Riva", "Marino", "Bruno", "De Luca", "Costa", "Fontana", "Galli", "Rizzo", "Sartori", "Vitale", "Neri", "Amato"],
  fr: ["Laurent", "Moreau", "Girard", "Fontaine", "Dubois", "Lefèvre", "Marchand", "Colin", "Renaud", "Blanchard", "Faure", "Leroy", "Noël", "Perrin", "Aubert", "Roche"],
  es: ["García", "Torres", "Vega", "Navarro", "Molina", "Serrano", "Castro", "Ibáñez", "Reyes", "Delgado", "Marín", "Bravo", "Aguilar", "Solís", "Campos", "Prieto"],
  pt: ["Silva", "Costa", "Ferreira", "Sousa", "Lopes", "Moreira", "Pinto", "Nunes", "Tavares", "Baptista", "Rocha", "Cardoso", "Matos", "Freitas", "Braga", "Valente"],
  de: ["Fischer", "Weber", "Wagner", "Becker", "Hoffmann", "Schulz", "Kaiser", "Vogel", "Brandt", "Winter", "Sommer", "Wolf", "Lang", "Berger", "Haas", "Frei"],
  nl: ["de Vries", "Jansen", "Bakker", "Visser", "Smit", "Meijer", "Bosch", "Vermeer", "de Jong", "Kramer", "van Dijk", "Post", "Willems", "Prins", "Klein", "de Wit"],
  uk: ["Shevchenko", "Kovalenko", "Bondar", "Tkachuk", "Melnyk", "Kravets", "Boyko", "Lysenko", "Marchuk", "Savchuk", "Petrenko", "Danylko", "Koval", "Zinchenko", "Hnatiuk", "Romaniuk"],
  el: ["Papadakis", "Nikolaou", "Georgiou", "Vassiliou", "Dimou", "Pappas", "Christou", "Antoniou", "Makris", "Petrou", "Sideris", "Manos", "Lazaris", "Fotiou", "Vlachos", "Rallis"],
  hr: ["Horvat", "Kovačević", "Marić", "Jurić", "Novak", "Babić", "Perić", "Vuković", "Knežević", "Matić", "Petrović", "Blažević", "Radić", "Šarić", "Tomić", "Barišić"],
  sr: ["Jovanović", "Petrović", "Nikolić", "Ilić", "Marković", "Đorđević", "Stojanović", "Pavlović", "Kovačević", "Lukić", "Ristić", "Simić", "Todorović", "Kostić", "Mitrović", "Vasić"],
  pl: ["Kowalski", "Nowak", "Wiśniewski", "Wójcik", "Kamiński", "Lewandowski", "Zieliński", "Szymański", "Dąbrowski", "Kozłowski", "Mazur", "Krawczyk", "Piotrowski", "Grabowski", "Zawadzki", "Sikora"],
}

export type Song = {
  title: string
  artist: string
  genre: Genre
  native: boolean
  // A "returning artist" who has competed before — shown with a star and gets
  // a competitive edge on the night.
  veteran: boolean
}

// Quality edge granted to a returning (veteran) artist.
export const VETERAN_BONUS = 7

function generateArtistName(country: Country, rng: () => number): string {
  const first = FIRST_NAMES[country.lang] ?? FIRST_NAMES.default
  const last = LAST_NAMES[country.lang] ?? LAST_NAMES.default
  return `${pick(first, rng)} ${pick(last, rng)}`
}

export function generateSong(countryId: string, year: number): Song {
  const c = getCountry(countryId) ?? COUNTRIES[0]
  const rng = mulberry32(hashSeed(`song-${countryId}-${year}`))
  const genre = pick(GENRES, rng)
  const artist = generateArtistName(c, rng)
  const nativeTitles = LANG_TITLES[c.lang]
  let title: string
  let native = false
  if (nativeTitles && rng() < 0.55) {
    title = pick(nativeTitles, rng)
    native = true
  } else {
    title = `${pick(TITLE_ADJ, rng)} ${pick(TITLE_NOUN, rng)}`
  }
  const veteran = rng() < 0.2
  return { title, artist, genre, native, veteran }
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
  return a.bloc === b.bloc ? 6 : 0
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
        quality: ratingOf(finalStats) + vet + rand(-3, 3),
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
      quality: ratingOf(finalStats) + vet + rand(-10, 10),
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

  // 3. Semi-final. Everyone else competes; all countries vote. The semi has a
  //    full scoreboard so eliminated acts get a real position and points.
  const semifinalists = entries.filter((e) => !e.autoQualified)
  tallyVotes(participants, semifinalists, 14, (e, pts) => {
    e.semiPoints += pts
  })
  const rankedSemi = [...semifinalists].sort(
    (a, b) => b.semiPoints - a.semiPoints || b.quality - a.quality,
  )
  rankedSemi.forEach((e, i) => {
    e.semiPosition = i + 1
  })
  const finalSpots = Math.min(GRAND_FINAL_SPOTS, entries.length)
  const spotsLeft = Math.max(0, finalSpots - auto.length)
  rankedSemi.slice(0, spotsLeft).forEach((e) => {
    e.qualified = true
  })

  // 4. Grand Final voting. Every participant awards points to its top 10.
  const finalists = entries.filter((e) => e.qualified)
  tallyVotes(participants, finalists, 16, (e, pts) => {
    e.points += pts
  })
  finalists.sort((a, b) => b.points - a.points || b.quality - a.quality)
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
export const START_HOST = "at" // Austria hosts the 2027 contest in Vienna
export const MIN_ROSTER = 1
export const MAX_ROSTER = 4

export function getSeasonTitle(year: number, hostId: string): string {
  const host = getCountry(hostId)
  return `${host.city} (${host.name}) ${year}`
}
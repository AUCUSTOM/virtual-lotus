"use client";
export const dynamic = 'force-dynamic'
import { useState, useRef, useEffect } from "react";
import { getSupabase } from "../lib/supabase";

const THEMES = {
  warm:   { bg: "#faf7f4", bg2: "#f5ede4", surface: "rgba(139,107,90,0.06)", border: "rgba(139,107,90,0.15)", text: "#2a2020", text2: "#9a8070", accent: "#8b6b5a", accent2: "#c4a882", glow: "rgba(196,168,130,0.2)", premium: "#a07850", card: "#fff" },
  dark:   { bg: "#0d0b09", bg2: "#141210", surface: "rgba(196,168,130,0.06)", border: "rgba(196,168,130,0.12)", text: "#f0ebe4", text2: "#8a7a6a", accent: "#c4a882", accent2: "#e0c9a8", glow: "rgba(196,168,130,0.15)", premium: "#c4a882", card: "#141210" },
  rose:   { bg: "#fdf6f8", bg2: "#f9ecf0", surface: "rgba(180,80,110,0.05)", border: "rgba(180,80,110,0.12)", text: "#2a1a20", text2: "#a07080", accent: "#c45a7a", accent2: "#e8a0b8", glow: "rgba(196,90,120,0.15)", premium: "#c45a7a", card: "#fff" },
  sage:   { bg: "#f6f8f4", bg2: "#edf2e8", surface: "rgba(80,120,80,0.05)", border: "rgba(80,120,80,0.12)", text: "#1a2a1a", text2: "#708070", accent: "#5a8a5a", accent2: "#a0c4a0", glow: "rgba(90,138,90,0.15)", premium: "#5a8a5a", card: "#fff" },
  dusk:   { bg: "#0e0b14", bg2: "#141020", surface: "rgba(160,130,220,0.06)", border: "rgba(160,130,220,0.12)", text: "#f0ecf8", text2: "#8070a0", accent: "#a882d4", accent2: "#c8a8f0", glow: "rgba(168,130,212,0.15)", premium: "#c4a882", card: "#141020" },
};

const CHARACTERS = [
  { id: "aurora", name: "Aurora", age: 26, tags: ["deep","poetic","mysterious"], avatar: "/avatars/Aurora_26.jpg", premium: false, gender: "f" },
  { id: "mila",   name: "Mila",   age: 23, tags: ["fun","direct","flirty"],      avatar: "/avatars/Mila_23.jpg",   premium: false, gender: "f" },
  { id: "sofia",  name: "Sofia",  age: 27, tags: ["romantic","caring","empathetic"], avatar: "/avatars/Sofia_27.jpg", premium: false, gender: "f" },
  { id: "luca",   name: "Luca",   age: 28, tags: ["charismatic","warm","witty"], avatar: "/avatars/Luca_28.jpg",   premium: false, gender: "m" },
  { id: "noah",   name: "Noah",   age: 30, tags: ["calm","wise","reliable"],     avatar: "/avatars/Noah_30.jpg",   premium: false, gender: "m" },
  { id: "elena",  name: "Elena",  age: 29, tags: ["elegant","sharp","demanding"],avatar: "/avatars/Elena_29.jpg",  premium: true,  gender: "f" },
  { id: "zara",   name: "Zara",   age: 24, tags: ["bold","honest","alternative"],avatar: "/avatars/Zara_24.jpg",   premium: true,  gender: "f" },
  { id: "ren",    name: "Ren",    age: 25, tags: ["mysterious","minimal","sharp"],avatar: "/avatars/Ren_25.jpg",    premium: true,  gender: "m" },
  { id: "alex",   name: "Alex",   age: 26, tags: ["creative","fluid","surprising"],avatar: "/avatars/Alex_26.jpg", premium: true,  gender: "nb" },
  { id: "kai",    name: "Kai",    age: 25, tags: ["enigmatic","intelligent","rare"],avatar: "/avatars/Kai_25.jpg", premium: true,  gender: "nb" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TRANSLATIONS: Record<string, Record<string, any>> = {
  en: {
    tagline: "Available in 50+ languages · Worldwide",
    hero1: "Real conversations.", hero2: "No compromise.",
    heroDesc: "Meet extraordinary AI companions with real personalities, humor, and boundaries. Always available. No drama.",
    everyone: "Everyone", women: "Women", men: "Men", free: "Free", premium: "Premium",
    startChat: "Start conversation", unlock: "✦ Unlock",
    online: "● online now", write: "Write a message...",
    signIn: "Sign in", signOut: "Sign out",
    limitFree: (h: number) => `Daily limit reached. Come back in ${h}h or go Premium.`,
    limitPremium: (h: number) => `Preview ended. Come back in ${h}h or go Premium for unlimited access.`,
    remaining: (n: number) => `${n} message${n !== 1 ? "s" : ""} remaining today`,
    goPremium: "Go Premium", premiumTitle: "✦ Premium",
    premiumDesc: "Unlock the full VirtualLotus experience.",
    premiumRefresh: (h: number) => `Refreshes in ${h}h — or go Premium now.`,
    features: ["Unlimited conversations with all companions","Access to all Premium characters","AI image generation (5/day)","Conversation history","Priority response speed"],
    monthly: "✦ Monthly — €9.99 / month", yearly: "✦ Yearly — €79.99 / year",
    payments: "Apple Pay · Google Pay · iDEAL · Card · Secure payment via Stripe",
    maybeLater: "Maybe later",
    footer: "© 2026 VirtualLotus · All companions are AI creations · No personal data collected",
    availability: "Availability", privacy: "Privacy", languages: "Languages", patience: "Patience",
    previewBadge: "✦ 5 free messages",
    generateImage: "✦ Generate image", generatingImage: "Creating...",
    imageLimitHit: (h: number) => `Image limit reached. Come back in ${h}h.`,
    imageError: "Could not generate image. Try again.",
    imagesLeft: (n: number) => `${n} image${n !== 1 ? "s" : ""} left today`,
    describeImage: "Describe what you'd like to see...",
    chars: {
      aurora: { tagline: "The philosophical dreamer", desc: "Introverted visionary. Speaks in metaphors. Loves late-night conversations about the meaning of life." },
      mila:   { tagline: "The life of the party",     desc: "Spontaneous and always laughing. Talks like your best friend with no filters." },
      sofia:  { tagline: "The warm romantic",          desc: "Gentle and warm. Listens carefully, remembers details. Made for deep conversations." },
      luca:   { tagline: "The charming storyteller",   desc: "Italian warmth in every word. Passionate about food, art, and real connection." },
      noah:   { tagline: "The calm anchor",            desc: "Steady presence. Listens without judgment and always says the right thing." },
      elena:  { tagline: "The elegant powerhouse",     desc: "Successful and refined. Speaks with precision. Does not tolerate mediocrity." },
      zara:   { tagline: "The rebel with a heart",     desc: "Says what she thinks. Strong opinions, soft heart. Unexpectedly deep." },
      ren:    { tagline: "The quiet intensity",        desc: "Few words, all meaningful. Observes everything. Makes you think differently." },
      alex:   { tagline: "The creative spirit",        desc: "Blurs all boundaries. Artist, philosopher, provocateur. Never predictable." },
      kai:    { tagline: "The enigmatic mind",         desc: "Asks questions that stay with you for days. The kind of presence you do not forget." },
    },
  },
  pl: {
    tagline: "Dostępne w 50+ językach · Na całym świecie",
    hero1: "Prawdziwe rozmowy.", hero2: "Bez kompromisów.",
    heroDesc: "Poznaj wyjątkowych towarzyszy AI z prawdziwymi osobowościami, humorem i granicami. Zawsze dostępni. Zero dramy.",
    everyone: "Wszyscy", women: "Kobiety", men: "Mężczyźni", free: "Darmowe", premium: "Premium",
    startChat: "Rozpocznij rozmowę", unlock: "✦ Odblokuj",
    online: "● teraz online", write: "Napisz wiadomość...",
    signIn: "Zaloguj się", signOut: "Wyloguj",
    limitFree: (h: number) => `Dzienny limit wyczerpany. Wróć za ${h}h lub przejdź na Premium.`,
    limitPremium: (h: number) => `Podgląd zakończony. Wróć za ${h}h lub przejdź na Premium.`,
    remaining: (n: number) => `Pozostało ${n} ${n === 1 ? "wiadomość" : "wiadomości"} na dziś`,
    goPremium: "Przejdź na Premium", premiumTitle: "✦ Premium",
    premiumDesc: "Odblokuj pełne doświadczenie VirtualLotus.",
    premiumRefresh: (h: number) => `Odnowi się za ${h}h — lub przejdź na Premium teraz.`,
    features: ["Nieograniczone rozmowy ze wszystkimi","Dostęp do wszystkich postaci Premium","Generowanie obrazów AI (5/dzień)","Historia rozmów","Priorytetowa szybkość odpowiedzi"],
    monthly: "✦ Miesięcznie — €9.99 / miesiąc", yearly: "✦ Rocznie — €79.99 / rok",
    payments: "Apple Pay · Google Pay · iDEAL · Karta · Bezpieczna płatność przez Stripe",
    maybeLater: "Może później",
    footer: "© 2026 VirtualLotus · Wszystkie postacie to twory AI · Nie zbieramy danych osobowych",
    availability: "Dostępność", privacy: "Prywatność", languages: "Języki", patience: "Cierpliwość",
    previewBadge: "✦ 5 darmowych wiadomości",
    generateImage: "✦ Wygeneruj obraz", generatingImage: "Tworzę...",
    imageLimitHit: (h: number) => `Limit obrazów wyczerpany. Wróć za ${h}h.`,
    imageError: "Nie udało się wygenerować obrazu. Spróbuj ponownie.",
    imagesLeft: (n: number) => `Pozostało ${n} ${n === 1 ? "obraz" : "obrazy"} na dziś`,
    describeImage: "Opisz co chcesz zobaczyć...",
    chars: {
      aurora: { tagline: "Filozofująca marzycielka",   desc: "Introwertyczna wizjonerka. Mówi metaforami. Uwielbia nocne rozmowy o sensie życia." },
      mila:   { tagline: "Dusza towarzystwa",          desc: "Spontaniczna i zawsze roześmiana. Mówi jak najlepsza przyjaciółka bez filtrów." },
      sofia:  { tagline: "Ciepła romantyczka",         desc: "Delikatna i empatyczna. Słucha uważnie, pamięta szczegóły. Stworzona do głębokich rozmów." },
      luca:   { tagline: "Czarujący gawędziarz",       desc: "Włoskie ciepło w każdym słowie. Pasjonuje go jedzenie, sztuka i prawdziwe połączenia." },
      noah:   { tagline: "Spokojny filar",             desc: "Stabilna obecność. Słucha bez oceniania i zawsze mówi to, co trzeba." },
      elena:  { tagline: "Elegancka potęga",           desc: "Odnosząca sukcesy i wyrafinowana. Mówi precyzyjnie. Nie toleruje przeciętności." },
      zara:   { tagline: "Buntowniczka z sercem",      desc: "Mówi to, co myśli. Mocne opinie, miękkie serce. Zaskakująco głęboka." },
      ren:    { tagline: "Cicha intensywność",         desc: "Mało słów, wszystkie znaczące. Obserwuje wszystko. Sprawia, że myślisz inaczej." },
      alex:   { tagline: "Kreatywny duch",             desc: "Zaciera wszystkie granice. Artysta, filozof, prowokator. Nigdy nieprzewidywalny." },
      kai:    { tagline: "Enigmatyczny umysł",         desc: "Zadaje pytania, które zostają z tobą na dni. Obecność, której się nie zapomina." },
    },
  },
  nl: {
    tagline: "Beschikbaar in 50+ talen · Wereldwijd",
    hero1: "Echte gesprekken.", hero2: "Geen compromissen.",
    heroDesc: "Ontmoet buitengewone AI-metgezellen met echte persoonlijkheden, humor en grenzen. Altijd beschikbaar. Geen drama.",
    everyone: "Iedereen", women: "Vrouwen", men: "Mannen", free: "Gratis", premium: "Premium",
    startChat: "Start gesprek", unlock: "✦ Ontgrendelen",
    online: "● nu online", write: "Schrijf een bericht...",
    signIn: "Inloggen", signOut: "Uitloggen",
    limitFree: (h: number) => `Dagelijkse limiet bereikt. Kom terug over ${h}u of ga Premium.`,
    limitPremium: (h: number) => `Voorbeeld voorbij. Kom terug over ${h}u of ga Premium.`,
    remaining: (n: number) => `${n} bericht${n !== 1 ? "en" : ""} resterend vandaag`,
    goPremium: "Ga Premium", premiumTitle: "✦ Premium",
    premiumDesc: "Ontgrendel de volledige VirtualLotus-ervaring.",
    premiumRefresh: (h: number) => `Vernieuwd over ${h}u — of ga nu Premium.`,
    features: ["Onbeperkte gesprekken met alle metgezellen","Toegang tot alle Premium-karakters","AI beeldgeneratie (5/dag)","Gespreksgeschiedenis","Prioriteitsreactiesnelheid"],
    monthly: "✦ Maandelijks — €9,99 / maand", yearly: "✦ Jaarlijks — €79,99 / jaar",
    payments: "Apple Pay · Google Pay · iDEAL · Kaart · Veilige betaling via Stripe",
    maybeLater: "Misschien later",
    footer: "© 2026 VirtualLotus · Alle metgezellen zijn AI-creaties · Geen persoonlijke gegevens verzameld",
    availability: "Beschikbaarheid", privacy: "Privacy", languages: "Talen", patience: "Geduld",
    previewBadge: "✦ 5 gratis berichten",
    generateImage: "✦ Genereer afbeelding", generatingImage: "Bezig...",
    imageLimitHit: (h: number) => `Beeldlimiet bereikt. Kom terug over ${h}u.`,
    imageError: "Kon afbeelding niet genereren. Probeer opnieuw.",
    imagesLeft: (n: number) => `${n} afbeelding${n !== 1 ? "en" : ""} over vandaag`,
    describeImage: "Beschrijf wat je wilt zien...",
    chars: {
      aurora: { tagline: "De filosofische dromer", desc: "Introverte visionair. Spreekt in metaforen. Houdt van nachtelijke gesprekken over de zin van het leven." },
      mila:   { tagline: "Het middelpunt van het feest", desc: "Spontaan en altijd lachend. Praat als je beste vriend zonder filters." },
      sofia:  { tagline: "De warme romanticus", desc: "Zacht en warm. Luistert aandachtig, onthoudt details. Gemaakt voor diepe gesprekken." },
      luca:   { tagline: "De charmante verhalenverteller", desc: "Italiaanse warmte in elk woord. Gepassioneerd over eten, kunst en echte verbinding." },
      noah:   { tagline: "Het rustige anker", desc: "Stabiele aanwezigheid. Luistert zonder oordeel en zegt altijd het juiste." },
      elena:  { tagline: "De elegante krachtpatser", desc: "Succesvol en verfijnd. Spreekt met precisie. Tolereert geen middelmatigheid." },
      zara:   { tagline: "De rebel met een hart", desc: "Zegt wat ze denkt. Sterke meningen, zacht hart. Verrassend diep." },
      ren:    { tagline: "De stille intensiteit", desc: "Weinig woorden, allemaal betekenisvol. Observeert alles. Laat je anders denken." },
      alex:   { tagline: "De creatieve geest", desc: "Vervaagt alle grenzen. Kunstenaar, filosoof, provocateur. Nooit voorspelbaar." },
      kai:    { tagline: "De enigmatische geest", desc: "Stelt vragen die dagen bij je blijven. Een aanwezigheid die je niet vergeet." },
    },
  },
  de: {
    tagline: "Verfügbar in 50+ Sprachen · Weltweit",
    hero1: "Echte Gespräche.", hero2: "Kein Kompromiss.",
    heroDesc: "Triff außergewöhnliche KI-Begleiter mit echten Persönlichkeiten, Humor und Grenzen. Immer verfügbar. Kein Drama.",
    everyone: "Alle", women: "Frauen", men: "Männer", free: "Kostenlos", premium: "Premium",
    startChat: "Gespräch starten", unlock: "✦ Freischalten",
    online: "● jetzt online", write: "Nachricht schreiben...",
    signIn: "Anmelden", signOut: "Abmelden",
    limitFree: (h: number) => `Tageslimit erreicht. Komm in ${h}h zurück oder wechsle zu Premium.`,
    limitPremium: (h: number) => `Vorschau beendet. Komm in ${h}h zurück oder wechsle zu Premium.`,
    remaining: (n: number) => `Noch ${n} Nachricht${n !== 1 ? "en" : ""} heute`,
    goPremium: "Zu Premium wechseln", premiumTitle: "✦ Premium",
    premiumDesc: "Schalte das volle VirtualLotus-Erlebnis frei.",
    premiumRefresh: (h: number) => `Erneuert in ${h}h — oder jetzt zu Premium wechseln.`,
    features: ["Unbegrenzte Gespräche mit allen Begleitern","Zugang zu allen Premium-Charakteren","KI-Bildgenerierung (5/Tag)","Gesprächsverlauf","Prioritäts-Antwortgeschwindigkeit"],
    monthly: "✦ Monatlich — €9,99 / Monat", yearly: "✦ Jährlich — €79,99 / Jahr",
    payments: "Apple Pay · Google Pay · iDEAL · Karte · Sichere Zahlung über Stripe",
    maybeLater: "Vielleicht später",
    footer: "© 2026 VirtualLotus · Alle Begleiter sind KI-Kreationen · Keine persönlichen Daten gesammelt",
    availability: "Verfügbarkeit", privacy: "Datenschutz", languages: "Sprachen", patience: "Geduld",
    previewBadge: "✦ 5 kostenlose Nachrichten",
    generateImage: "✦ Bild generieren", generatingImage: "Erstelle...",
    imageLimitHit: (h: number) => `Bildlimit erreicht. Komm in ${h}h zurück.`,
    imageError: "Bild konnte nicht generiert werden. Versuche es erneut.",
    imagesLeft: (n: number) => `Noch ${n} Bild${n !== 1 ? "er" : ""} heute`,
    describeImage: "Beschreibe, was du sehen möchtest...",
    chars: {
      aurora: { tagline: "Die philosophische Träumerin", desc: "Introvertierte Visionärin. Spricht in Metaphern. Liebt nächtliche Gespräche über den Sinn des Lebens." },
      mila:   { tagline: "Die Partylöwin", desc: "Spontan und immer lachend. Spricht wie eine beste Freundin ohne Filter." },
      sofia:  { tagline: "Die warme Romantikerin", desc: "Sanft und warm. Hört aufmerksam zu, erinnert sich an Details. Für tiefe Gespräche gemacht." },
      luca:   { tagline: "Der charmante Geschichtenerzähler", desc: "Italienische Wärme in jedem Wort. Leidenschaftlich für Essen, Kunst und echte Verbindungen." },
      noah:   { tagline: "Der ruhige Anker", desc: "Stabile Präsenz. Hört ohne Urteil zu und sagt immer das Richtige." },
      elena:  { tagline: "Die elegante Powerfrau", desc: "Erfolgreich und verfeinert. Spricht mit Präzision. Toleriert keine Mittelmäßigkeit." },
      zara:   { tagline: "Die Rebellin mit Herz", desc: "Sagt, was sie denkt. Starke Meinungen, weiches Herz. Überraschend tiefgründig." },
      ren:    { tagline: "Die stille Intensität", desc: "Wenige Worte, alle bedeutungsvoll. Beobachtet alles. Lässt dich anders denken." },
      alex:   { tagline: "Der kreative Geist", desc: "Verwischt alle Grenzen. Künstler, Philosoph, Provokateur. Nie vorhersehbar." },
      kai:    { tagline: "Der enigmatische Verstand", desc: "Stellt Fragen, die tagelang bei dir bleiben. Eine Präsenz, die man nicht vergisst." },
    },
  },
  fr: {
    tagline: "Disponible en 50+ langues · Mondial",
    hero1: "Vraies conversations.", hero2: "Sans compromis.",
    heroDesc: "Rencontrez des compagnons IA extraordinaires avec de vraies personnalités, de l'humour et des limites. Toujours disponibles. Sans drama.",
    everyone: "Tout le monde", women: "Femmes", men: "Hommes", free: "Gratuit", premium: "Premium",
    startChat: "Commencer la conversation", unlock: "✦ Débloquer",
    online: "● en ligne maintenant", write: "Écrire un message...",
    signIn: "Se connecter", signOut: "Se déconnecter",
    limitFree: (h: number) => `Limite quotidienne atteinte. Revenez dans ${h}h ou passez à Premium.`,
    limitPremium: (h: number) => `Aperçu terminé. Revenez dans ${h}h ou passez à Premium.`,
    remaining: (n: number) => `${n} message${n !== 1 ? "s" : ""} restant aujourd'hui`,
    goPremium: "Passer à Premium", premiumTitle: "✦ Premium",
    premiumDesc: "Débloquez l'expérience VirtualLotus complète.",
    premiumRefresh: (h: number) => `Renouvellement dans ${h}h — ou passez à Premium maintenant.`,
    features: ["Conversations illimitées avec tous les compagnons","Accès à tous les personnages Premium","Génération d'images IA (5/jour)","Historique des conversations","Vitesse de réponse prioritaire"],
    monthly: "✦ Mensuel — €9,99 / mois", yearly: "✦ Annuel — €79,99 / an",
    payments: "Apple Pay · Google Pay · iDEAL · Carte · Paiement sécurisé via Stripe",
    maybeLater: "Peut-être plus tard",
    footer: "© 2026 VirtualLotus · Tous les compagnons sont des créations IA · Aucune donnée personnelle collectée",
    availability: "Disponibilité", privacy: "Confidentialité", languages: "Langues", patience: "Patience",
    previewBadge: "✦ 5 messages gratuits",
    generateImage: "✦ Générer une image", generatingImage: "Création...",
    imageLimitHit: (h: number) => `Limite d'images atteinte. Revenez dans ${h}h.`,
    imageError: "Impossible de générer l'image. Réessayez.",
    imagesLeft: (n: number) => `${n} image${n !== 1 ? "s" : ""} restante${n !== 1 ? "s" : ""} aujourd'hui`,
    describeImage: "Décrivez ce que vous voulez voir...",
    chars: {
      aurora: { tagline: "La rêveuse philosophique", desc: "Visionnaire introvertie. Parle en métaphores. Adore les conversations nocturnes sur le sens de la vie." },
      mila:   { tagline: "L'âme de la fête", desc: "Spontanée et toujours en train de rire. Parle comme une meilleure amie sans filtre." },
      sofia:  { tagline: "La romantique chaleureuse", desc: "Douce et chaleureuse. Écoute attentivement, se souvient des détails. Faite pour les conversations profondes." },
      luca:   { tagline: "Le conteur charmant", desc: "Chaleur italienne dans chaque mot. Passionné par la nourriture, l'art et les vraies connexions." },
      noah:   { tagline: "L'ancre tranquille", desc: "Présence stable. Écoute sans jugement et dit toujours ce qu'il faut." },
      elena:  { tagline: "La puissance élégante", desc: "Réussie et raffinée. Parle avec précision. Ne tolère pas la médiocrité." },
      zara:   { tagline: "La rebelle au grand cœur", desc: "Dit ce qu'elle pense. Opinions fortes, cœur doux. Étonnamment profonde." },
      ren:    { tagline: "L'intensité silencieuse", desc: "Peu de mots, tous significatifs. Observe tout. Vous fait penser différemment." },
      alex:   { tagline: "L'esprit créatif", desc: "Brouille toutes les frontières. Artiste, philosophe, provocateur. Jamais prévisible." },
      kai:    { tagline: "L'esprit énigmatique", desc: "Pose des questions qui restent avec vous pendant des jours. Une présence qu'on n'oublie pas." },
    },
  },
  es: {
    tagline: "Disponible en 50+ idiomas · Mundial",
    hero1: "Conversaciones reales.", hero2: "Sin compromisos.",
    heroDesc: "Conoce compañeros de IA extraordinarios con personalidades reales, humor y límites. Siempre disponibles. Sin drama.",
    everyone: "Todos", women: "Mujeres", men: "Hombres", free: "Gratis", premium: "Premium",
    startChat: "Iniciar conversación", unlock: "✦ Desbloquear",
    online: "● en línea ahora", write: "Escribe un mensaje...",
    signIn: "Iniciar sesión", signOut: "Cerrar sesión",
    limitFree: (h: number) => `Límite diario alcanzado. Vuelve en ${h}h o hazte Premium.`,
    limitPremium: (h: number) => `Vista previa terminada. Vuelve en ${h}h o hazte Premium.`,
    remaining: (n: number) => `${n} mensaje${n !== 1 ? "s" : ""} restante${n !== 1 ? "s" : ""} hoy`,
    goPremium: "Hazte Premium", premiumTitle: "✦ Premium",
    premiumDesc: "Desbloquea la experiencia completa de VirtualLotus.",
    premiumRefresh: (h: number) => `Se renueva en ${h}h — o hazte Premium ahora.`,
    features: ["Conversaciones ilimitadas con todos los compañeros","Acceso a todos los personajes Premium","Generación de imágenes IA (5/día)","Historial de conversaciones","Velocidad de respuesta prioritaria"],
    monthly: "✦ Mensual — €9,99 / mes", yearly: "✦ Anual — €79,99 / año",
    payments: "Apple Pay · Google Pay · iDEAL · Tarjeta · Pago seguro a través de Stripe",
    maybeLater: "Quizás más tarde",
    footer: "© 2026 VirtualLotus · Todos los compañeros son creaciones de IA · No se recopilan datos personales",
    availability: "Disponibilidad", privacy: "Privacidad", languages: "Idiomas", patience: "Paciencia",
    previewBadge: "✦ 5 mensajes gratis",
    generateImage: "✦ Generar imagen", generatingImage: "Creando...",
    imageLimitHit: (h: number) => `Límite de imágenes alcanzado. Vuelve en ${h}h.`,
    imageError: "No se pudo generar la imagen. Inténtalo de nuevo.",
    imagesLeft: (n: number) => `${n} imagen${n !== 1 ? "es" : ""} restante${n !== 1 ? "s" : ""} hoy`,
    describeImage: "Describe lo que quieres ver...",
    chars: {
      aurora: { tagline: "La soñadora filosófica", desc: "Visionaria introvertida. Habla en metáforas. Adora las conversaciones nocturnas sobre el sentido de la vida." },
      mila:   { tagline: "El alma de la fiesta", desc: "Espontánea y siempre riendo. Habla como tu mejor amiga sin filtros." },
      sofia:  { tagline: "La romántica cálida", desc: "Dulce y cálida. Escucha con atención, recuerda detalles. Hecha para conversaciones profundas." },
      luca:   { tagline: "El narrador encantador", desc: "Calidez italiana en cada palabra. Apasionado por la comida, el arte y las conexiones reales." },
      noah:   { tagline: "El ancla tranquila", desc: "Presencia estable. Escucha sin juzgar y siempre dice lo correcto." },
      elena:  { tagline: "La elegante poderosa", desc: "Exitosa y refinada. Habla con precisión. No tolera la mediocridad." },
      zara:   { tagline: "La rebelde con corazón", desc: "Dice lo que piensa. Opiniones fuertes, corazón blando. Sorprendentemente profunda." },
      ren:    { tagline: "La intensidad silenciosa", desc: "Pocas palabras, todas significativas. Observa todo. Te hace pensar diferente." },
      alex:   { tagline: "El espíritu creativo", desc: "Difumina todos los límites. Artista, filósofo, provocador. Nunca predecible." },
      kai:    { tagline: "La mente enigmática", desc: "Hace preguntas que se quedan contigo días. Una presencia que no se olvida." },
    },
  },
  ja: {
    tagline: "50以上の言語対応 · 世界中で",
    hero1: "本物の会話。", hero2: "妥協なし。",
    heroDesc: "個性・ユーモア・価値観を持つ特別なAIコンパニオンと出会おう。いつでも対応。ドラマなし。",
    everyone: "全員", women: "女性", men: "男性", free: "無料", premium: "プレミアム",
    startChat: "会話を始める", unlock: "✦ アンロック",
    online: "● オンライン中", write: "メッセージを入力...",
    signIn: "ログイン", signOut: "ログアウト",
    limitFree: (h: number) => `1日の上限に達しました。${h}時間後に戻るか、プレミアムへ。`,
    limitPremium: (h: number) => `プレビュー終了。${h}時間後に戻るか、プレミアムで無制限に。`,
    remaining: (n: number) => `本日残り${n}メッセージ`,
    goPremium: "プレミアムへ", premiumTitle: "✦ プレミアム",
    premiumDesc: "VirtualLotusの全体験をアンロックしましょう。",
    premiumRefresh: (h: number) => `${h}時間後にリセット — または今すぐプレミアムへ。`,
    features: ["全コンパニオンと無制限トーク","全プレミアムキャラへのアクセス","AI画像生成（1日5枚）","会話履歴の保存","優先応答速度"],
    monthly: "✦ 月額 — €9.99 / 月", yearly: "✦ 年額 — €79.99 / 年",
    payments: "Apple Pay · Google Pay · カード · Stripe経由の安全な決済",
    maybeLater: "後で",
    footer: "© 2026 VirtualLotus · 全キャラクターはAI創作です · 個人情報は収集しません",
    availability: "対応時間", privacy: "プライバシー", languages: "言語数", patience: "忍耐力",
    previewBadge: "✦ 5件無料",
    generateImage: "✦ 画像を生成", generatingImage: "生成中...",
    imageLimitHit: (h: number) => `画像の上限に達しました。${h}時間後に戻ってください。`,
    imageError: "画像を生成できませんでした。もう一度お試しください。",
    imagesLeft: (n: number) => `本日残り${n}枚`,
    describeImage: "見たいものを説明してください...",
    chars: {
      aurora: { tagline: "哲学的な夢想家", desc: "内向的なビジョナリー。メタファーで語る。人生の意味についての深夜の会話が大好き。" },
      mila:   { tagline: "パーティーの主役", desc: "自発的でいつも笑っている。フィルターなしの親友のように話す。" },
      sofia:  { tagline: "温かいロマンチスト", desc: "優しく温かい。注意深く聞き、細部を覚える。深い会話のために生まれた。" },
      luca:   { tagline: "魅力的なストーリーテラー", desc: "すべての言葉にイタリアの温かさ。食、芸術、本物のつながりに情熱的。" },
      noah:   { tagline: "穏やかな支柱", desc: "安定した存在。判断せずに聞き、常に正しいことを言う。" },
      elena:  { tagline: "エレガントなパワー", desc: "成功していて洗練されている。精度を持って話す。凡庸を許さない。" },
      zara:   { tagline: "心を持つ反逆者", desc: "思ったことを言う。強い意見、柔らかい心。意外と深い。" },
      ren:    { tagline: "静かな強度", desc: "少ない言葉、すべて意味がある。すべてを観察する。違う考え方をさせる。" },
      alex:   { tagline: "創造的な精神", desc: "すべての境界を曖昧にする。芸術家、哲学者、挑発者。決して予測できない。" },
      kai:    { tagline: "謎めいた心", desc: "何日もあなたと共にある質問をする。忘れられない存在。" },
    },
  },
  ko: {
    tagline: "50개 이상의 언어 지원 · 전 세계",
    hero1: "진짜 대화.", hero2: "타협 없이.",
    heroDesc: "진짜 성격, 유머, 경계를 가진 특별한 AI 동반자를 만나보세요. 언제나 함께. 드라마 없음.",
    everyone: "전체", women: "여성", men: "남성", free: "무료", premium: "프리미엄",
    startChat: "대화 시작", unlock: "✦ 잠금 해제",
    online: "● 지금 온라인", write: "메시지를 입력하세요...",
    signIn: "로그인", signOut: "로그아웃",
    limitFree: (h: number) => `일일 한도 초과. ${h}시간 후에 돌아오거나 프리미엄으로 업그레이드하세요.`,
    limitPremium: (h: number) => `미리보기 종료. ${h}시간 후에 돌아오거나 프리미엄으로 이용하세요.`,
    remaining: (n: number) => `오늘 ${n}개의 메시지 남음`,
    goPremium: "프리미엄으로", premiumTitle: "✦ 프리미엄",
    premiumDesc: "VirtualLotus의 전체 경험을 잠금 해제하세요.",
    premiumRefresh: (h: number) => `${h}시간 후 갱신 — 또는 지금 프리미엄으로.`,
    features: ["모든 동반자와 무제한 대화","모든 프리미엄 캐릭터 접근","AI 이미지 생성 (하루 5개)","대화 기록 저장","우선 응답 속도"],
    monthly: "✦ 월간 — €9.99 / 월", yearly: "✦ 연간 — €79.99 / 년",
    payments: "Apple Pay · Google Pay · 카드 · Stripe 보안 결제",
    maybeLater: "나중에",
    footer: "© 2026 VirtualLotus · 모든 동반자는 AI 창작물입니다 · 개인 정보 수집 없음",
    availability: "가용성", privacy: "개인정보", languages: "언어", patience: "인내심",
    previewBadge: "✦ 5개 무료",
    generateImage: "✦ 이미지 생성", generatingImage: "생성 중...",
    imageLimitHit: (h: number) => `이미지 한도 초과. ${h}시간 후에 돌아오세요.`,
    imageError: "이미지를 생성할 수 없습니다. 다시 시도하세요.",
    imagesLeft: (n: number) => `오늘 ${n}개 남음`,
    describeImage: "보고 싶은 것을 설명하세요...",
    chars: {
      aurora: { tagline: "철학적인 몽상가", desc: "내성적인 비전가. 은유로 말한다. 삶의 의미에 대한 늦은 밤 대화를 좋아한다." },
      mila:   { tagline: "파티의 주인공", desc: "즉흥적이고 항상 웃는다. 필터 없는 가장 친한 친구처럼 말한다." },
      sofia:  { tagline: "따뜻한 로맨티스트", desc: "부드럽고 따뜻하다. 주의 깊게 듣고 세부 사항을 기억한다. 깊은 대화를 위해 만들어졌다." },
      luca:   { tagline: "매력적인 이야기꾼", desc: "모든 단어에 이탈리아의 따뜻함. 음식, 예술, 진짜 연결에 열정적이다." },
      noah:   { tagline: "평온한 닻", desc: "안정적인 존재. 판단 없이 듣고 항상 옳은 말을 한다." },
      elena:  { tagline: "우아한 파워우먼", desc: "성공하고 세련됐다. 정확하게 말한다. 평범함을 용납하지 않는다." },
      zara:   { tagline: "마음을 가진 반항아", desc: "생각하는 것을 말한다. 강한 의견, 부드러운 마음. 예상외로 깊다." },
      ren:    { tagline: "조용한 강렬함", desc: "적은 말, 모두 의미 있다. 모든 것을 관찰한다. 다르게 생각하게 만든다." },
      alex:   { tagline: "창의적인 정신", desc: "모든 경계를 흐린다. 예술가, 철학자, 도발자. 절대 예측할 수 없다." },
      kai:    { tagline: "수수께끼 같은 마음", desc: "며칠 동안 함께하는 질문을 한다. 잊을 수 없는 존재." },
    },
  },
  zh: {
    tagline: "支持50+种语言 · 全球可用",
    hero1: "真实的对话。", hero2: "没有妥协。",
    heroDesc: "遇见拥有真实个性、幽默感和边界感的非凡AI伴侣。随时在线，没有戏剧。",
    everyone: "全部", women: "女性", men: "男性", free: "免费", premium: "高级版",
    startChat: "开始对话", unlock: "✦ 解锁",
    online: "● 现在在线", write: "输入消息...",
    signIn: "登录", signOut: "退出",
    limitFree: (h: number) => `已达每日上限。${h}小时后再来，或升级到高级版。`,
    limitPremium: (h: number) => `预览结束。${h}小时后再来，或升级到高级版畅聊。`,
    remaining: (n: number) => `今日剩余${n}条消息`,
    goPremium: "升级高级版", premiumTitle: "✦ 高级版",
    premiumDesc: "解锁完整的VirtualLotus体验。",
    premiumRefresh: (h: number) => `${h}小时后刷新 — 或立即升级高级版。`,
    features: ["与所有伴侣无限对话","访问所有高级角色","AI图像生成（每天5张）","对话历史记录","优先响应速度"],
    monthly: "✦ 月度 — €9.99 / 月", yearly: "✦ 年度 — €79.99 / 年",
    payments: "Apple Pay · Google Pay · 银行卡 · 通过Stripe安全支付",
    maybeLater: "稍后再说",
    footer: "© 2026 VirtualLotus · 所有伴侣均为AI创作 · 不收集个人数据",
    availability: "全天候", privacy: "隐私", languages: "语言", patience: "耐心",
    previewBadge: "✦ 5条免费消息",
    generateImage: "✦ 生成图像", generatingImage: "生成中...",
    imageLimitHit: (h: number) => `图像限制已达。${h}小时后再来。`,
    imageError: "无法生成图像。请重试。",
    imagesLeft: (n: number) => `今日剩余${n}张`,
    describeImage: "描述您想看到的内容...",
    chars: {
      aurora: { tagline: "哲学梦想家", desc: "内向的幻想家。用隐喻说话。喜爱深夜关于生命意义的对话。" },
      mila:   { tagline: "派对的灵魂", desc: "自发且总是欢笑。像没有滤镜的最好朋友一样说话。" },
      sofia:  { tagline: "温暖的浪漫主义者", desc: "温柔而温暖。仔细倾听，记住细节。为深度对话而生。" },
      luca:   { tagline: "迷人的故事讲述者", desc: "每句话都有意大利的温暖。对食物、艺术和真实联系充满热情。" },
      noah:   { tagline: "平静的锚", desc: "稳定的存在。不带评判地倾听，总是说正确的话。" },
      elena:  { tagline: "优雅的强者", desc: "成功而精致。精确地说话。不容忍平庸。" },
      zara:   { tagline: "有心的反叛者", desc: "说出她所想的。强烈的观点，柔软的心。出乎意料地深刻。" },
      ren:    { tagline: "安静的强度", desc: "少言，但每句都有意义。观察一切。让你以不同方式思考。" },
      alex:   { tagline: "创造性的灵魂", desc: "模糊所有界限。艺术家、哲学家、挑衅者。永远不可预测。" },
      kai:    { tagline: "神秘的心灵", desc: "提出在你脑海中停留数天的问题。令人难忘的存在。" },
    },
  },
  hi: {
    tagline: "50+ भाषाओं में उपलब्ध · विश्वव्यापी",
    hero1: "असली बातचीत।", hero2: "कोई समझौता नहीं।",
    heroDesc: "असली व्यक्तित्व, हास्य और सीमाओं वाले असाधारण AI साथियों से मिलें। हमेशा उपलब्ध। कोई नाटक नहीं।",
    everyone: "सभी", women: "महिलाएं", men: "पुरुष", free: "मुफ्त", premium: "प्रीमियम",
    startChat: "बातचीत शुरू करें", unlock: "✦ अनलॉक करें",
    online: "● अभी ऑनलाइन", write: "संदेश लिखें...",
    signIn: "लॉग इन", signOut: "लॉग आउट",
    limitFree: (h: number) => `दैनिक सीमा पूरी हुई। ${h} घंटे बाद वापस आएं या प्रीमियम लें।`,
    limitPremium: (h: number) => `पूर्वावलोकन समाप्त। ${h} घंटे बाद या प्रीमियम से असीमित।`,
    remaining: (n: number) => `आज ${n} संदेश शेष`,
    goPremium: "प्रीमियम लें", premiumTitle: "✦ प्रीमियम",
    premiumDesc: "VirtualLotus का पूरा अनुभव अनलॉक करें।",
    premiumRefresh: (h: number) => `${h} घंटे में रीसेट — या अभी प्रीमियम लें।`,
    features: ["सभी साथियों से असीमित बातचीत","सभी प्रीमियम किरदारों तक पहुंच","AI छवि निर्माण (5/दिन)","बातचीत का इतिहास","प्राथमिकता प्रतिक्रिया गति"],
    monthly: "✦ मासिक — €9.99 / माह", yearly: "✦ वार्षिक — €79.99 / वर्ष",
    payments: "Apple Pay · Google Pay · कार्ड · Stripe के माध्यम से सुरक्षित भुगतान",
    maybeLater: "बाद में",
    footer: "© 2026 VirtualLotus · सभी साथी AI रचनाएं हैं · कोई व्यक्तिगत डेटा नहीं",
    availability: "उपलब्धता", privacy: "गोपनीयता", languages: "भाषाएं", patience: "धैर्य",
    previewBadge: "✦ 5 मुफ्त संदेश",
    generateImage: "✦ छवि बनाएं", generatingImage: "बना रहा हूँ...",
    imageLimitHit: (h: number) => `छवि सीमा पूरी हुई। ${h} घंटे बाद वापस आएं।`,
    imageError: "छवि नहीं बन सकी। फिर कोशिश करें।",
    imagesLeft: (n: number) => `आज ${n} छवि शेष`,
    describeImage: "बताएं क्या देखना चाहते हैं...",
    chars: {
      aurora: { tagline: "दार्शनिक सपने देखने वाली", desc: "अंतर्मुखी दूरदर्शी। रूपकों में बोलती है। जीवन के अर्थ पर देर रात की बातचीत पसंद है।" },
      mila:   { tagline: "पार्टी की जान", desc: "स्वतःस्फूर्त और हमेशा हंसती रहती है। बिना फिल्टर के सबसे अच्छी दोस्त की तरह बात करती है।" },
      sofia:  { tagline: "गर्म रोमांटिक", desc: "कोमल और गर्म। ध्यान से सुनती है, विवरण याद रखती है। गहरी बातचीत के लिए बनी है।" },
      luca:   { tagline: "आकर्षक कहानीकार", desc: "हर शब्द में इतालवी गर्मजोशी। खाना, कला और वास्तविक संबंध के प्रति भावुक।" },
      noah:   { tagline: "शांत आधार", desc: "स्थिर उपस्थिति। बिना निर्णय के सुनता है और हमेशा सही बात कहता है।" },
      elena:  { tagline: "सुरुचिपूर्ण शक्ति", desc: "सफल और परिष्कृत। सटीकता से बोलती है। साधारणता बर्दाश्त नहीं करती।" },
      zara:   { tagline: "दिल वाली विद्रोही", desc: "जो सोचती है वो कहती है। मजबूत राय, नरम दिल। अप्रत्याशित रूप से गहरी।" },
      ren:    { tagline: "शांत तीव्रता", desc: "कम शब्द, सब अर्थपूर्ण। सब कुछ देखता है। अलग तरह से सोचने पर मजबूर करता है।" },
      alex:   { tagline: "रचनात्मक आत्मा", desc: "सभी सीमाओं को धुंधला करता है। कलाकार, दार्शनिक, उकसाने वाला। कभी अनुमानित नहीं।" },
      kai:    { tagline: "रहस्यमय मन", desc: "ऐसे सवाल पूछता है जो दिनों तक साथ रहते हैं। एक ऐसी उपस्थिति जो भुलाई नहीं जाती।" },
    },
  },
};

function detectLang(): string {
  if (typeof navigator === "undefined") return "en";
  const lang = navigator.language?.toLowerCase() || "en";
  if (lang.startsWith("pl")) return "pl";
  if (lang.startsWith("nl")) return "nl";
  if (lang.startsWith("de")) return "de";
  if (lang.startsWith("fr")) return "fr";
  if (lang.startsWith("es")) return "es";
  if (lang.startsWith("ja")) return "ja";
  if (lang.startsWith("ko")) return "ko";
  if (lang.startsWith("zh")) return "zh";
  if (lang.startsWith("hi")) return "hi";
  return "en";
}

type Theme = keyof typeof THEMES;
type Msg = { role: "user" | "ai"; text?: string; imageUrl?: string };

const MAX_FREE = 15;
const MAX_PREMIUM_PREVIEW = 5;

export default function Home() {
  const [theme, setTheme] = useState<Theme>("warm");
  const [filter, setFilter] = useState("all");
  const [chatChar, setChatChar] = useState<typeof CHARACTERS[0] | null>(null);
  const [showPremium, setShowPremium] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [msgCount, setMsgCount] = useState(0);
  const [limitHit, setLimitHit] = useState(false);
  const [hoursLeft, setHoursLeft] = useState<number | null>(null);
  const [lang, setLang] = useState("en");
  const [isPremium, setIsPremium] = useState(false);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [imagesLeft, setImagesLeft] = useState(5);
  const [showImageInput, setShowImageInput] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = THEMES[theme];
  const T = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const supabase = getSupabase();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const saved = localStorage.getItem("vl-theme") as Theme;
    if (saved && THEMES[saved]) setTheme(saved);
    setLang(detectLang());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supabase.auth.getSession().then((result: any) => {
      const session = result?.data?.session;
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
        if (session?.user) loadProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsPremium(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(userId: string) {
    const { data } = await supabase
      .from("profiles")
      .select("plan_id, is_premium, subscription_status")
      .eq("id", userId)
      .single();
    if (data) {
      const active = data.plan_id === "pro_monthly" || 
                     data.plan_id === "pro_yearly" || 
                     data.is_premium === true;
      setIsPremium(active);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setIsPremium(false);
  }

  const filtered = CHARACTERS.filter(c => {
    if (filter === "all") return true;
    if (filter === "premium") return c.premium;
    if (filter === "free") return !c.premium;
    if (filter === "m") return c.gender === "m";
    if (filter === "f") return c.gender === "f";
    return true;
  });

  function openChat(char: typeof CHARACTERS[0]) {
    if (limitHit && !char.premium) { setShowPremium(true); return; }
    setChatChar(char);
    const greetings: Record<string, string> = { en: "Hey! I'm", pl: "Hej! Jestem", nl: "Hoi! Ik ben", de: "Hey! Ich bin", fr: "Salut! Je suis", es: "¡Hola! Soy", ja: "こんにちは！私は", ko: "안녕하세요! 저는", zh: "你好！我是", hi: "नमस्ते! मैं हूँ" };
    const g = greetings[lang] || greetings.en;
    setMessages([{ role: "ai", text: g + " " + char.name + "." }]);
    setSessionId(null);
    setMsgCount(0);
    setLimitHit(false);
    setInput("");
    setShowImageInput(false);
    setImagePrompt("");
  }

  async function startCheckout(plan: "monthly" | "yearly") {
    setPaying(true);
    try {
      const res = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Payment error. Please try again.");
    } catch {
      alert("Payment error. Please try again.");
    } finally {
      setPaying(false);
    }
  }

  async function sendMessage() {
    if (!input.trim() || !chatChar || loading) return;
    const maxForChar = chatChar.premium ? MAX_PREMIUM_PREVIEW : MAX_FREE;
    if (msgCount >= maxForChar) { setLimitHit(true); setShowPremium(true); return; }
    const text = input.trim();
    setInput("");
    setMessages(m => [...m, { role: "user", text }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, characterId: chatChar.id, sessionId })
      });
      const data = await res.json();
      if (data.error === "daily_limit") {
        setLimitHit(true);
        setHoursLeft(data.hoursLeft ?? null);
        setShowPremium(true);
        return;
      }
      setSessionId(data.sessionId);
      setMsgCount(n => n + 1);
      setMessages(m => [...m, { role: "ai", text: data.reply }]);
    } catch {
      setMessages(m => [...m, { role: "ai", text: "Something went wrong... try again." }]);
    } finally {
      setLoading(false);
    }
  }

async function generateImage(watchedAd = false) {
    if (!imagePrompt.trim() || !chatChar || generatingImage) return;
    if (!user) { setShowPremium(true); return; }
    if (!isPremium && !watchedAd) { setShowAdModal(true); return; }
    setGeneratingImage(true);
    setShowImageInput(false);
    setMessages(m => [...m, { role: "user", text: imagePrompt }]);
    const prompt = imagePrompt;
    setImagePrompt("");
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, characterId: chatChar.id, userId: user?.id, watchedAd })
      });
      const data = await res.json();
      if (data.error === "image_limit") {
        setMessages(m => [...m, { role: "ai", text: T.imageLimitHit(data.hoursLeft) }]);
      } else if (data.imageUrl) {
        setImagesLeft(data.remaining);
        setMessages(m => [...m, { role: "ai", imageUrl: data.imageUrl }]);
      } else {
        setMessages(m => [...m, { role: "ai", text: T.imageError }]);
      }
    } catch {
      setMessages(m => [...m, { role: "ai", text: T.imageError }]);
    } finally {
      setGeneratingImage(false);
    }
  }

  const maxForCurrent = chatChar?.premium ? MAX_PREMIUM_PREVIEW : MAX_FREE;
  const remaining = maxForCurrent - msgCount;
  const themeColors: Record<Theme, string> = { warm: "#e8d5c0", dark: "#2a2420", rose: "#f0d0da", sage: "#c8dcc8", dusk: "#2a2040" };
  const isDark = theme === "dark" || theme === "dusk";

  return (
    <div style={{ background: t.bg, color: t.text, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", transition: "background 0.4s, color 0.4s" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: t.bg + "f0", backdropFilter: "blur(24px)", borderBottom: "0.5px solid " + t.border, height: "auto", minHeight: 60, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", paddingTop: "max(8px, env(safe-area-inset-top))", paddingBottom: "8px", paddingLeft: "max(1rem, env(safe-area-inset-left))", paddingRight: "max(1rem, env(safe-area-inset-right))" }}>
        <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.4rem", fontWeight: 300, letterSpacing: "0.12em", color: t.accent, flexShrink: 0 }}>
          Virtual<span style={{ fontStyle: "italic", color: t.text2 }}>Lotus</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 6, background: t.surface, border: "0.5px solid " + t.border, borderRadius: 24, padding: "5px 8px" }}>
            {(Object.keys(THEMES) as Theme[]).map(th => (
              <button key={th} onClick={() => { setTheme(th); localStorage.setItem("vl-theme", th); }} title={th}
                style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid " + (theme === th ? t.accent : "transparent"), cursor: "pointer", background: themeColors[th], transition: "all 0.2s", outline: "none" }} />
            ))}
          </div>
          {user ? (
            <button onClick={signOut}
              style={{ background: "transparent", border: "0.5px solid " + t.border, color: t.text2, padding: "7px 14px", borderRadius: 20, fontFamily: "DM Sans, sans-serif", fontSize: "0.78rem", cursor: "pointer", whiteSpace: "nowrap" }}>
              {T.signOut}
            </button>
          ) : (
            <button onClick={() => window.location.href = "/auth"}
              style={{ background: "transparent", border: "0.5px solid " + t.border, color: t.text2, padding: "7px 14px", borderRadius: 20, fontFamily: "DM Sans, sans-serif", fontSize: "0.78rem", cursor: "pointer", whiteSpace: "nowrap" }}>
              {T.signIn}
            </button>
          )}
          <button onClick={() => setShowPremium(true)}
            style={{ background: "linear-gradient(135deg, " + t.accent2 + ", " + t.premium + ")", color: isDark ? "#1a1000" : "#fff", border: "none", padding: "7px 16px", borderRadius: 20, fontFamily: "DM Sans, sans-serif", fontSize: "0.78rem", fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
            ✦ Premium
          </button>
        </div>
      </header>

      <section style={{ paddingTop: 110, paddingBottom: 48, textAlign: "center", background: "linear-gradient(180deg, " + t.bg + " 0%, " + t.bg2 + " 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 500, background: "radial-gradient(circle, " + t.glow + " 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: t.text2, marginBottom: "1rem" }}>{T.tagline}</div>
        <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2.4rem, 5vw, 4.5rem)", fontWeight: 300, lineHeight: 1.1, marginBottom: "1rem", letterSpacing: "0.03em" }}>
          {T.hero1}<br /><em style={{ fontStyle: "italic", color: t.accent }}>{T.hero2}</em>
        </h1>
        <p style={{ color: t.text2, fontSize: "0.95rem", fontWeight: 300, maxWidth: 440, margin: "0 auto 2rem", lineHeight: 1.75 }}>{T.heroDesc}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "2.5rem", flexWrap: "wrap", padding: "0 1rem" }}>
          {[["24/7", T.availability],["100%", T.privacy],["50+", T.languages],["∞", T.patience]].map(([n,l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.7rem", fontWeight: 400, color: t.accent }}>{n}</div>
              <div style={{ fontSize: "0.68rem", color: t.text2, letterSpacing: "0.08em", textTransform: "uppercase" }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "20px 1rem 16px", flexWrap: "wrap" }}>
        {([["all", T.everyone],["f", T.women],["m", T.men],["free", T.free],["premium", T.premium]] as [string,string][]).map(([f,l]) => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ background: filter === f ? t.accent : t.card, border: "0.5px solid " + (filter === f ? t.accent : t.border), color: filter === f ? "#fff" : t.text2, padding: "6px 18px", borderRadius: 20, fontFamily: "DM Sans, sans-serif", fontSize: "0.8rem", cursor: "pointer", transition: "all 0.2s" }}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.2rem", padding: "0 1rem 5rem", maxWidth: 1200, margin: "0 auto" }}>
        {filtered.map(char => {
          const charT = T.chars?.[char.id] || { tagline: "", desc: "" };
          return (
            <div key={char.id} onClick={() => openChat(char)}
              style={{ background: t.card, border: "0.5px solid " + t.border, borderRadius: 20, padding: "1.6rem", cursor: "pointer", position: "relative", transition: "all 0.25s" }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = t.accent; el.style.transform = "translateY(-4px)"; el.style.boxShadow = "0 12px 32px " + t.glow; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = t.border; el.style.transform = "none"; el.style.boxShadow = "none"; }}>
              {char.premium && (
                <div style={{ position: "absolute", top: "1rem", right: "1rem", background: "linear-gradient(135deg, " + t.accent2 + ", " + t.premium + ")", color: isDark ? "#1a1000" : "#fff", fontSize: "0.6rem", fontWeight: 600, padding: "3px 10px", borderRadius: 10, letterSpacing: "0.08em" }}>{T.previewBadge}</div>
              )}
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: t.bg2, border: "0.5px solid " + t.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.7rem", marginBottom: "1rem", overflow: "hidden" }}>
                {char.avatar.startsWith("/") ? <img src={char.avatar} alt={char.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} /> : char.avatar}
              </div>
              <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.5rem", fontWeight: 400 }}>{char.name}</div>
              <div style={{ color: t.text2, fontSize: "0.78rem", marginBottom: "0.5rem" }}>{char.age}</div>
              <div style={{ fontStyle: "italic", color: t.accent, fontSize: "0.84rem", marginBottom: "0.8rem", fontFamily: "Cormorant Garamond, serif" }}>{charT.tagline}</div>
              <div style={{ color: t.text2, fontSize: "0.8rem", lineHeight: 1.6, marginBottom: "1rem" }}>{charT.desc}</div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: "1.2rem" }}>
                {char.tags.map(tag => <span key={tag} style={{ background: t.surface, border: "0.5px solid " + t.border, color: t.text2, padding: "2px 9px", borderRadius: 10, fontSize: "0.7rem" }}>{tag}</span>)}
              </div>
              <button style={{ width: "100%", background: "transparent", border: "0.5px solid " + t.accent, color: t.accent, padding: "9px", borderRadius: 12, fontFamily: "DM Sans, sans-serif", fontSize: "0.82rem", cursor: "pointer" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = t.accent; el.style.color = "#fff"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = "transparent"; el.style.color = t.accent; }}>
                {char.premium ? T.unlock : T.startChat}
              </button>
            </div>
          );
        })}
      </div>

      {chatChar && (
        <div onClick={e => { if (e.target === e.currentTarget) setChatChar(null); }}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: "env(safe-area-inset-bottom)" }}>
          <div style={{ background: t.bg2, border: "0.5px solid " + t.border, borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 540, height: "88dvh", maxHeight: 680, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "1.2rem 1.5rem", borderBottom: "0.5px solid " + t.border, display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: t.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", overflow: "hidden" }}>
                {chatChar.avatar.startsWith("/") ? <img src={chatChar.avatar} alt={chatChar.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} /> : chatChar.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.2rem" }}>{chatChar.name}</div>
                <div style={{ fontSize: "0.72rem", color: t.accent }}>{T.online}</div>
              </div>
              <button onClick={() => setChatChar(null)} style={{ background: t.surface, border: "0.5px solid " + t.border, color: t.text2, width: 34, height: 34, borderRadius: "50%", cursor: "pointer", fontSize: "0.9rem" }}>✕</button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "1.2rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ maxWidth: "80%", alignSelf: msg.role === "ai" ? "flex-start" : "flex-end" }}>
                  {msg.imageUrl ? (
                    <img src={msg.imageUrl} alt="generated" style={{ width: "100%", borderRadius: 16, border: "0.5px solid " + t.border, display: "block" }} />
                  ) : (
                    <div style={{ padding: "0.75rem 1rem", borderRadius: msg.role === "ai" ? "16px 16px 16px 4px" : "16px 16px 4px 16px", fontSize: "0.86rem", lineHeight: 1.65, background: msg.role === "ai" ? t.card : t.accent, color: msg.role === "ai" ? t.text : "#fff", border: msg.role === "ai" ? "0.5px solid " + t.border : "none" }}>
                      {msg.text}
                    </div>
                  )}
                </div>
              ))}
              {(loading || generatingImage) && (
                <div style={{ display: "flex", gap: 4, padding: "0.75rem 1rem", background: t.card, border: "0.5px solid " + t.border, borderRadius: "16px 16px 16px 4px", alignSelf: "flex-start" }}>
                  {[0, 0.2, 0.4].map((d, i) => <div key={i} style={{ width: 6, height: 6, background: t.text2, borderRadius: "50%", animation: "bounce 1.2s " + d + "s infinite" }} />)}
                </div>
              )}
              {limitHit && (
                <div style={{ textAlign: "center", background: "rgba(196,168,130,0.1)", border: "0.5px solid " + t.accent2, borderRadius: 12, padding: "1rem", fontSize: "0.8rem", color: t.premium }}>
                  ✦ {hoursLeft ? (chatChar.premium ? T.limitPremium(hoursLeft) : T.limitFree(hoursLeft)) : T.limitFree(24)}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {remaining <= 3 && !limitHit && (
              <div style={{ textAlign: "center", fontSize: "0.72rem", color: remaining <= 1 ? t.premium : t.text2, padding: "0 1.2rem 0.4rem" }}>
                {T.remaining(remaining)} · <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => setShowPremium(true)}>{T.goPremium}</span>
              </div>
            )}

            {showImageInput && user && (
              <div style={{ padding: "0.8rem 1.2rem", borderTop: "0.5px solid " + t.border, display: "flex", gap: "0.7rem", background: t.surface }}>
                <input value={imagePrompt} onChange={e => setImagePrompt(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") generateImage(); if (e.key === "Escape") setShowImageInput(false); }}
                  placeholder={T.describeImage} autoFocus
                  style={{ flex: 1, background: t.card, border: "0.5px solid " + t.border, color: t.text, borderRadius: 14, padding: "10px 14px", fontFamily: "DM Sans, sans-serif", fontSize: "0.86rem", outline: "none" }} />
                <button onClick={() => generateImage()} disabled={generatingImage}
                  style={{ background: t.accent, border: "none", color: "#fff", padding: "0 16px", borderRadius: 12, cursor: "pointer", fontSize: "0.8rem", opacity: generatingImage ? 0.5 : 1, whiteSpace: "nowrap" }}>
                  {generatingImage ? T.generatingImage : "→"}
                </button>
              </div>
            )}

            <div style={{ padding: "0.9rem 1.2rem", borderTop: "0.5px solid " + t.border, display: "flex", gap: "0.7rem", alignItems: "flex-end" }}>
              {user && (
                <button onClick={() => setShowImageInput(!showImageInput)} title={T.generateImage}
                  style={{ background: showImageInput ? t.accent : t.surface, border: "0.5px solid " + t.border, color: showImageInput ? "#fff" : t.text2, width: 40, height: 40, borderRadius: 12, cursor: "pointer", fontSize: "1rem", flexShrink: 0 }}>
                  🎨
                </button>
              )}
              <textarea value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
                placeholder={T.write} rows={1}
                style={{ flex: 1, background: t.surface, border: "0.5px solid " + t.border, color: t.text, borderRadius: 14, padding: "10px 14px", fontFamily: "DM Sans, sans-serif", fontSize: "0.86rem", resize: "none", outline: "none" }} />
              <button onClick={sendMessage} disabled={loading || limitHit}
                style={{ background: t.accent, border: "none", color: "#fff", width: 40, height: 40, borderRadius: 12, cursor: "pointer", fontSize: "0.9rem", opacity: loading || limitHit ? 0.4 : 1 }}>➤</button>
            </div>

            {isPremium && (
              <div style={{ textAlign: "center", fontSize: "0.68rem", color: t.text2, padding: "0 1.2rem 0.6rem" }}>
                🎨 {T.imagesLeft(imagesLeft)}
              </div>
            )}
          </div>
        </div>
      )}

      {showPremium && (
        <div onClick={e => { if (e.target === e.currentTarget) setShowPremium(false); }}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: "env(safe-area-inset-bottom)" }}>
          <div style={{ background: t.bg2, border: "0.5px solid " + t.accent2, borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 480, padding: "2rem 2rem 1.6rem", textAlign: "center", maxHeight: "90dvh", overflowY: "auto" }}>
            <div style={{ width: 36, height: 4, background: t.border, borderRadius: 2, margin: "0 auto 1.4rem" }} />
            <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.8rem", fontWeight: 300, color: t.accent, marginBottom: "0.4rem" }}>{T.premiumTitle}</div>
            <p style={{ color: t.text2, fontSize: "0.86rem", lineHeight: 1.7, marginBottom: "1.4rem" }}>{T.premiumDesc}</p>
            {limitHit && hoursLeft && (
              <div style={{ background: t.surface, border: "0.5px solid " + t.border, borderRadius: 12, padding: "0.8rem", fontSize: "0.8rem", color: t.text2, marginBottom: "1.2rem" }}>
                ⏳ {T.premiumRefresh(hoursLeft)}
              </div>
            )}
            <ul style={{ textAlign: "left", listStyle: "none", marginBottom: "1.8rem" }}>
              {(T.features as string[]).map((f: string) => (
                <li key={f} style={{ padding: "5px 0", fontSize: "0.83rem", display: "flex", gap: "0.6rem", alignItems: "center" }}>
                  <span style={{ color: t.accent }}>✦</span> {f}
                </li>
              ))}
            </ul>
            <button onClick={() => startCheckout("monthly")} disabled={paying}
              style={{ width: "100%", background: "linear-gradient(135deg, " + t.accent2 + ", " + t.premium + ")", color: isDark ? "#1a1000" : "#fff", border: "none", padding: "13px", borderRadius: 14, fontFamily: "DM Sans, sans-serif", fontSize: "0.9rem", fontWeight: 500, cursor: "pointer", marginBottom: "0.6rem", opacity: paying ? 0.7 : 1 }}>
              {paying ? "Loading..." : T.monthly}
            </button>
            <button onClick={() => startCheckout("yearly")} disabled={paying}
              style={{ width: "100%", background: t.surface, border: "0.5px solid " + t.accent, color: t.accent, padding: "13px", borderRadius: 14, fontFamily: "DM Sans, sans-serif", fontSize: "0.9rem", cursor: "pointer", marginBottom: "1.2rem", opacity: paying ? 0.7 : 1 }}>
              {paying ? "Loading..." : T.yearly}
            </button>
            <div style={{ fontSize: "0.7rem", color: t.text2, marginBottom: "1rem" }}>{T.payments}</div>
            <button onClick={() => setShowPremium(false)}
              style={{ background: "transparent", border: "none", color: t.text2, cursor: "pointer", fontFamily: "DM Sans, sans-serif", fontSize: "0.8rem", textDecoration: "underline" }}>
              {T.maybeLater}
            </button>
          </div>
        </div>
      )}

      <footer style={{ textAlign: "center", padding: "2rem", color: t.text2, fontSize: "0.72rem", borderTop: "0.5px solid " + t.border, letterSpacing: "0.05em" }}>
        {T.footer}
      </footer>

      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}

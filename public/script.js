// Dynamic Emotional Love Universe Engine
// Personalization for couples with algorithmic animations and emotional variations on refresh

// Backend URL resolver: when running inside the Android APK (loaded via appassets.androidplatform.net or file:)
// automatically target the live full-stack cloud backend for real-time proposals and cross-device syncing.
const API_BASE_URL = (
  window.location.origin.includes("appassets.androidplatform.net") ||
  window.location.protocol === "file:" ||
  (window.location.hostname === "localhost" && window.location.port === "5000")
) ? "https://romantic-beige.vercel.app" : "";

function getBackendOrigin() {
  if (
    window.location.origin.includes("appassets.androidplatform.net") ||
    window.location.protocol === "file:"
  ) {
    return "https://romantic-beige.vercel.app";
  }
  return window.location.origin;
}

const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");

// DOM Elements
const soundToggle = document.getElementById("soundToggle");
const soundIcon = document.getElementById("soundIcon");
const soundLabel = document.getElementById("soundLabel");
const confettiContainer = document.getElementById("confettiContainer");
const yesBtn = document.getElementById("yesBtn");
const thinkBtn = document.getElementById("thinkBtn");
const againBtn = document.getElementById("againBtn");
const playfulHesitationText = document.getElementById("playfulHesitationText");
const successBox = document.getElementById("success");
const themeTagPill = document.getElementById("themeTagPill");
const navCoupleText = document.getElementById("navCoupleText");
const refreshEmotionBtn = document.getElementById("refreshEmotionBtn");
const openCustomizerBtn = document.getElementById("openCustomizerBtn");
const shareBtn = document.getElementById("shareBtn");
const downloadModalBtn = document.getElementById("downloadModalBtn");
const proposalModeBanner = document.getElementById("proposalModeBanner");
const proposalBannerText = document.getElementById("proposalBannerText");
const proposalButtonsGroup = document.getElementById("proposalButtonsGroup");
const recipientReplyShowcase = document.getElementById("recipientReplyShowcase");
const recipientReplyText = document.getElementById("recipientReplyText");
const downloadCertificateBtn = document.getElementById("downloadCertificateBtn");
const notifyWhatsAppBtn = document.getElementById("notifyWhatsAppBtn");

// Animation Studio Elements
const animChipsContainer = document.getElementById("animChipsContainer");
const randomAnimBtn = document.getElementById("randomAnimBtn");
const replayAnimBtn = document.getElementById("replayAnimBtn");
const recordVideoBtn = document.getElementById("recordVideoBtn");
const downloadCardBtn = document.getElementById("downloadCardBtn");
const recordVideoBtnLabel = document.getElementById("recordVideoBtnLabel");
const selectMotionMode = document.getElementById("selectMotionMode");
const selectAnimSpeed = document.getElementById("selectAnimSpeed");
const selectParticleDensity = document.getElementById("selectParticleDensity");
const selectTouchFx = document.getElementById("selectTouchFx");

// Customizer Modal Elements
const customizerModal = document.getElementById("customizerModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelModalBtn = document.getElementById("cancelModalBtn");
const namesForm = document.getElementById("namesForm");
const inputSender = document.getElementById("inputSender");
const inputPartner = document.getElementById("inputPartner");
const labelSender = document.getElementById("labelSender");
const labelPartner = document.getElementById("labelPartner");
const selectEmotion = document.getElementById("selectEmotion");
const inputCustomNote = document.getElementById("inputCustomNote");
const dynamicGirlToBoy = document.getElementById("dynamicGirlToBoy");
const dynamicBoyToGirl = document.getElementById("dynamicBoyToGirl");
const dynamicSoulmates = document.getElementById("dynamicSoulmates");
const createAndShareBtn = document.getElementById("createAndShareBtn");
const toastNotification = document.getElementById("toastNotification");

// Share & Live Tracker Modal Elements
const shareModal = document.getElementById("shareModal");
const shareModalBackdrop = document.getElementById("shareModalBackdrop");
const closeShareModalBtn = document.getElementById("closeShareModalBtn");
const doneShareModalBtn = document.getElementById("doneShareModalBtn");
const sharePartnerLabel = document.getElementById("sharePartnerLabel");
const partnerShareUrl = document.getElementById("partnerShareUrl");
const copyPartnerUrlBtn = document.getElementById("copyPartnerUrlBtn");
const shareWhatsAppBtn = document.getElementById("shareWhatsAppBtn");
const shareTelegramBtn = document.getElementById("shareTelegramBtn");
const nativeShareBtn = document.getElementById("nativeShareBtn");
const radarIndicator = document.getElementById("radarIndicator");
const trackerStatusTitle = document.getElementById("trackerStatusTitle");
const trackerStatusDesc = document.getElementById("trackerStatusDesc");
const senderTrackerUrl = document.getElementById("senderTrackerUrl");
const copyTrackerUrlBtn = document.getElementById("copyTrackerUrlBtn");

// Recipient Acceptance Modal Elements
const recipientAcceptModal = document.getElementById("recipientAcceptModal");
const recipientModalBackdrop = document.getElementById("recipientModalBackdrop");
const closeRecipientModalBtn = document.getElementById("closeRecipientModalBtn");
const cancelRecipientAcceptBtn = document.getElementById("cancelRecipientAcceptBtn");
const recipientAcceptForm = document.getElementById("recipientAcceptForm");
const recipientReplyInput = document.getElementById("recipientReplyInput");
const confirmYesSubmitBtn = document.getElementById("confirmYesSubmitBtn");
const acceptModalDesc = document.getElementById("acceptModalDesc");

// Sender Acceptance Alert Elements
const senderAcceptedAlert = document.getElementById("senderAcceptedAlert");
const senderAlertBackdrop = document.getElementById("senderAlertBackdrop");
const dismissSenderAlertXBtn = document.getElementById("dismissSenderAlertXBtn");
const senderAlertHeading = document.getElementById("senderAlertHeading");
const senderAlertPartnerName = document.getElementById("senderAlertPartnerName");
const senderAlertTimeBadge = document.getElementById("senderAlertTimeBadge");
const partnerReplyBubble = document.getElementById("partnerReplyBubble");
const partnerReplyQuote = document.getElementById("partnerReplyQuote");
const senderSaveCertificateBtn = document.getElementById("senderSaveCertificateBtn");
const closeSenderAlertBtn = document.getElementById("closeSenderAlertBtn");

// Download Modal Elements
const downloadModal = document.getElementById("downloadModal");
const downloadModalBackdrop = document.getElementById("downloadModalBackdrop");
const closeDownloadModalBtn = document.getElementById("closeDownloadModalBtn");
const doneDownloadModalBtn = document.getElementById("doneDownloadModalBtn");
const startVideoRecordBtn = document.getElementById("startVideoRecordBtn");
const startVideoRecordText = document.getElementById("startVideoRecordText");
const recordProgressBar = document.getElementById("recordProgressBar");
const recordProgressFill = document.getElementById("recordProgressFill");
const recordProgressText = document.getElementById("recordProgressText");
const downloadPngCardBtn = document.getElementById("downloadPngCardBtn");
const downloadCertActionBtn = document.getElementById("downloadCertActionBtn");

// State Variables for Dynamics, Sharing & Tracking
let currentDynamic = "boy_to_girl"; // 'girl_to_boy' | 'boy_to_girl' | 'soulmates'
let currentCustomNote = "";
let activeProposalId = null;
let isRecipientProposalMode = false;
let sseEventSource = null;
let proposalPollingTimer = null;
let isVideoRecording = false;

// Content Placeholders
const heroPartnerName = document.getElementById("heroPartnerName");
const heartMessage = document.getElementById("heartMessage");
const heartMessageName = document.getElementById("heartMessageName");
const heartMessagePrefix = document.getElementById("heartMessagePrefix");
const heartMessageSub = document.getElementById("heartMessageSub");
const whisperPartner = document.getElementById("whisperPartner");
const whisperFrom = document.getElementById("whisperFrom");
const letterSealText = document.getElementById("letterSealText");
const letterThemeTag = document.getElementById("letterThemeTag");
const letterSalutation = document.getElementById("letterSalutation");
const letterPara1 = document.getElementById("letterPara1");
const letterPara2 = document.getElementById("letterPara2");
const letterHighlight = document.getElementById("letterHighlight");
const letterSenderName = document.getElementById("letterSenderName");
const displaySender = document.getElementById("displaySender");
const displayPartner = document.getElementById("displayPartner");
const proposalSmallText = document.getElementById("proposalSmallText");
const proposalPoeticText = document.getElementById("proposalPoeticText");
const successHighlight = document.getElementById("successHighlight");
const successVow = document.getElementById("successVow");
const pageFooter = document.getElementById("pageFooter");

// Twelve Distinct Romantic Animation Worlds
const EMOTIONS = [
  {
    id: "rose",
    badge: "🌹 Passionate Rose Bloom",
    tag: "passionate & eternal",
    styleName: "rose",
    palette: [
      "255, 45, 95",   // ruby crimson
      "255, 90, 140",  // vibrant rose
      "255, 175, 205", // soft blossom pink
      "255, 215, 80",  // glowing amber gold
      "255, 250, 252"  // starlight white
    ],
    dustPalette: "255, 180, 210",
    confetti: ["🌹", "❤️", "💖", "💕", "✨", "🍷", "💘", "🌸"],
    scale: [329.63, 392.00, 440.00, 493.88, 587.33, 659.25, 783.99, 880.00], // E major passionate
    chord: [440, 554.37, 659.25, 880],
    beatSpeed: 2.7,
    particleStyle: "rose",
    letter: {
      tag: "passionate & eternal",
      para1: "In a universe of eight billion souls and infinite possibilities, my heart stops only for you. You are the serene calm to my chaotic days, the sweetest melody in my quietest hours, and the brightest dream I never want to wake from.",
      para2: "Loving you isn’t something I have to decide—it is as essential and natural as breathing. With every beat of my heart, I choose your radiant smile that lights up my whole world, your gentle kindness that heals everything around you, and the boundless beauty of your soul.",
      quote: (partner) => `"Today, tomorrow, and through all of eternity... it has always been you, ${partner}."`,
      vow: (partner, sender) => `Thank you for saying YES, my love! From this second until the end of time, I, ${sender}, promise to treasure you, protect your smile, and hold your hand through every chapter of our lives.`
    },
    promises: [
      { icon: "🌸", title: "Your Radiant Smile", detail: "No matter what life brings, I promise to protect your happiness and cherish your laughter." },
      { icon: "✨", title: "A Safe Sanctuary", detail: "My arms will always be your safe haven, where you are deeply heard, understood, and adored." },
      { icon: "🌙", title: "Our Endless Tomorrow", detail: "Hand in hand through every joy and storm, writing our happiest chapters together forever." }
    ]
  },
  {
    id: "starlight",
    badge: "✨ Eternal Constellation",
    tag: "written in the stars",
    styleName: "starlight",
    palette: [
      "130, 210, 255", // cosmic cyan
      "210, 150, 255", // nebula violet
      "255, 180, 240", // celestial pink
      "255, 255, 255", // pure supernova white
      "100, 140, 255"  // galactic sapphire
    ],
    dustPalette: "180, 215, 255",
    confetti: ["✨", "🌟", "💫", "💖", "🌙", "💍", "🪐", "💎"],
    scale: [392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00, 1046.50], // G major celestial
    chord: [523.25, 659.25, 783.99, 1046.50],
    beatSpeed: 2.3,
    particleStyle: "starlight",
    letter: {
      tag: "written in the stars",
      para1: "Before time began, the universe sketched our orbits to collide. When I gaze into your eyes, I don't just see the present—I see galaxies of unconditional love and our destiny written across the cosmos.",
      para2: "You are my true North Star, guiding me with warmth whenever the world turns dark. In your presence, every impossible dream feels within reach, and every quiet moment feels like sacred poetry.",
      quote: (partner) => `"Across a million galaxies and infinite lifetimes, my soul would still recognize and choose you, ${partner}."`,
      vow: (partner, sender) => `A love written in the stars! Thank you, my sweetest ${partner}. I, ${sender}, vow to illuminate your path, stand beside you beneath every sky, and love you beyond infinity.`
    },
    promises: [
      { icon: "🌟", title: "Endless Starlight", detail: "I promise to be your constant light, guiding and reassuring you through every unknown journey." },
      { icon: "💫", title: "Celestial Devotion", detail: "Our bond will remain steadfast across distance, time, and whatever the universe holds." },
      { icon: "🪐", title: "Our Shared Galaxy", detail: "Building a tranquil universe filled with your favorite dreams, peaceful nights, and eternal love." }
    ]
  },
  {
    id: "embers",
    badge: "🔥 Fiery Hearth Embers",
    tag: "burning & unquenchable",
    styleName: "embers",
    palette: [
      "255, 70, 20",   // fiery ruby
      "255, 140, 25",  // molten amber
      "255, 215, 45",  // golden spark
      "255, 95, 30",   // blazing crimson
      "255, 245, 230"  // incandescent core
    ],
    dustPalette: "255, 180, 80",
    confetti: ["🔥", "❤️", "✨", "💥", "🧡", "🌟", "🎇", "💫"],
    scale: [369.99, 440.00, 493.88, 554.37, 659.25, 739.99, 880.00, 987.77], // F# minor warm flame
    chord: [440.00, 554.37, 659.25, 739.99],
    beatSpeed: 2.8,
    particleStyle: "embers",
    letter: {
      tag: "burning & unquenchable",
      para1: "Like a sacred fire that never fades, my love for you burns brighter and deeper every passing second. You ignite a warmth in my spirit that no cold winter could ever extinguish.",
      para2: "Every beat of my heart is an ember stoked by your touch, your laugh, and the breathtaking way you love. With you, life is vibrant, warm, and endlessly alive.",
      quote: (partner) => `"An eternal flame ignited by your soul, ${partner}—burning purely for you through all of time."`,
      vow: (partner, sender) => `YES! With all the fire in my soul! My dearest ${partner}, I, ${sender}, vow to protect our hearth, keep the warmth of passion burning, and cherish you through every storm.`
    },
    promises: [
      { icon: "🔥", title: "Unquenchable Passion", detail: "I promise to keep our romance vibrant, spontaneous, and fiercely cherished every day." },
      { icon: "🕯️", title: "Warmth in Every Winter", detail: "When times are cold or weary, my love will always be the warm haven that melts your worries." },
      { icon: "💥", title: "Sparks of Joy", detail: "Bringing laughter, excitement, and playful passion to every chapter we write together." }
    ]
  },
  {
    id: "aurora",
    badge: "🌌 Northern Lights Aurora",
    tag: "mystical & ethereal",
    styleName: "aurora",
    palette: [
      "45, 212, 191",  // emerald teal
      "52, 211, 153",  // luminous jade
      "34, 211, 238",  // cyan glow
      "167, 139, 250", // electric violet
      "245, 255, 250"  // starlight pearl
    ],
    dustPalette: "130, 240, 210",
    confetti: ["🌌", "💚", "✨", "💜", "🌙", "💠", "💫", "💎"],
    scale: [246.94, 293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25], // B minor aurora
    chord: [293.66, 369.99, 440.00, 587.33],
    beatSpeed: 2.1,
    particleStyle: "aurora",
    letter: {
      tag: "mystical & ethereal",
      para1: "Your love is like the northern lights dancing across a midnight sky—rare, breathtaking, and endlessly magical. You brought wonder back into my life when the world felt ordinary.",
      para2: "Gazing upon you feels like witnessing the greatest wonders of heaven. You possess a grace that mesmerizes my thoughts and an innocence that humbles my entire being.",
      quote: (partner) => `"In a world of black and white, ${partner}, you are my dancing aurora of a million colors."`,
      vow: (partner, sender) => `A dream come true beneath heaven's skies! My beloved ${partner}, I, ${sender}, promise to marvel at your beauty, cherish your gentle wonder, and love you beyond measure.`
    },
    promises: [
      { icon: "🌌", title: "Eternal Wonder", detail: "I promise to keep our love inspired by beauty, curiosity, and childlike reverence." },
      { icon: "🎨", title: "Vivid Colors", detail: "Painting your life with colorful memories, peaceful mornings, and tender affection." },
      { icon: "🌙", title: "Silent Harmony", detail: "Resting beside you in peaceful companionship, where no words are needed to feel understood." }
    ]
  },
  {
    id: "butterfly",
    badge: "🦋 Fluttering Butterfly Dance",
    tag: "playful & enchanting",
    styleName: "butterfly",
    palette: [
      "244, 114, 182", // sweet fuchsia
      "192, 132, 252", // lilac orchid
      "251, 191, 36",  // golden pollen
      "255, 182, 193", // soft blush
      "255, 240, 245"  // pearlescent wing
    ],
    dustPalette: "240, 180, 230",
    confetti: ["🦋", "🌸", "💖", "🌷", "✨", "🌺", "💕", "🌼"],
    scale: [277.18, 329.63, 440.00, 493.88, 554.37, 659.25, 880.00, 987.77], // A major playful
    chord: [329.63, 440.00, 554.37, 659.25],
    beatSpeed: 2.9,
    particleStyle: "butterfly",
    letter: {
      tag: "playful & enchanting",
      para1: "You give my heart butterflies in the sweetest, most tender way. Every time your name appears, every time you laugh, and every time our eyes meet, my heart takes flight.",
      para2: "You transformed my world into an enchanted garden blooming with happiness. Thank you for being my gentlest joy, my favorite adventure, and my lifelong sweet surprise.",
      quote: (partner) => `"Every heartbeat with you, ${partner}, is a flutter of pure magic and joyful gratitude."`,
      vow: (partner, sender) => `My heart is soaring! Sweetest ${partner}, I, ${sender}, promise to always make you giggle, to carry your bags, to celebrate your little victories, and to adore you forever.`
    },
    promises: [
      { icon: "🦋", title: "Playful Heart", detail: "I promise to fill our home with laughter, fun dances in the kitchen, and sweetest cuddles." },
      { icon: "🌷", title: "Gentle Care", detail: "Treating your sensitive soul with infinite patience, kindness, and tender respect." },
      { icon: "🌈", title: "Sunny Adventures", detail: "Exploring the world hand-in-hand, discovering beautiful sunsets and sweet memories." }
    ]
  },
  {
    id: "crystal",
    badge: "💎 Diamond Prism Crystalline",
    tag: "unbreakable & pure",
    styleName: "crystal",
    palette: [
      "103, 232, 249", // diamond cyan
      "165, 243, 252", // prismatic ice
      "196, 181, 253", // crystal lavender
      "253, 164, 175", // rose quartz glint
      "255, 255, 255"  // brilliant white
    ],
    dustPalette: "180, 235, 250",
    confetti: ["💎", "💍", "✨", "🤍", "💠", "💫", "👑", "💖"],
    scale: [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 1760.00, 2093.00], // High crystal chime
    chord: [523.25, 659.25, 783.99, 1046.50],
    beatSpeed: 2.4,
    particleStyle: "crystal",
    letter: {
      tag: "unbreakable & pure",
      para1: "Our bond is cut from the rarest, most indestructible gemstone. Tested against the pressures of time and distance, my devotion to you only grows clearer, stronger, and more luminous.",
      para2: "Like a diamond catching the morning sun, your presence refracts a rainbow of grace across everything I do. You are the priceless jewel I will protect with my life.",
      quote: (partner) => `"Purer than crystal and stronger than diamonds, my vow to you, ${partner}, will never fracture."`,
      vow: (partner, sender) => `An unbreakable covenant! My precious ${partner}, I, ${sender}, vow to honor you with rock-solid loyalty, pure honesty, and everlasting protection through every season.`
    },
    promises: [
      { icon: "💎", title: "Unbreakable Loyalty", detail: "Standing as your unshakable fortress through every trial, never wavering in my devotion." },
      { icon: "💍", title: "Sacred Honor", detail: "Upholding your dignity and cherishing your trust as my most valuable treasure." },
      { icon: "✨", title: "Purest Honesty", detail: "Always being transparent, truthful, and open-hearted in every word and deed." }
    ]
  },
  {
    id: "fireworks",
    badge: "🎆 Golden Sparkler Fountain",
    tag: "celebratory & radiant",
    styleName: "fireworks",
    palette: [
      "251, 191, 36",  // champagne gold
      "255, 230, 120", // molten spark
      "244, 63, 94",   // celebration crimson
      "225, 29, 72",   // vibrant ruby
      "255, 255, 240"  // sparkler white
    ],
    dustPalette: "255, 225, 140",
    confetti: ["🎆", "✨", "🍾", "🥂", "💛", "🎉", "💖", "🌟"],
    scale: [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51], // C major triumphant
    chord: [523.25, 659.25, 783.99, 1046.50],
    beatSpeed: 3.0,
    particleStyle: "fireworks",
    letter: {
      tag: "celebratory & radiant",
      para1: "Being loved by you feels like New Year's Eve under a sky filled with golden fireworks. Every day is a triumph, every memory is a festival, and every shared laugh is music to my ears.",
      para2: "You turned my quiet life into a radiant celebration of love, gratitude, and adventure. I want to celebrate you not just today, but for all the thousands of tomorrows we will share.",
      quote: (partner) => `"With you, ${partner}, every ordinary second sparkles like gold and explodes with joy."`,
      vow: (partner, sender) => `YES! The greatest celebration of my life! To my forever love ${partner}, I, ${sender}, promise to celebrate our love every single day and make your life magnificent!`
    },
    promises: [
      { icon: "🎆", title: "Lifelong Celebration", detail: "Treating our love as a daily festival, keeping the romance sparklers glowing bright." },
      { icon: "🥂", title: "Cherished Milestones", detail: "Celebrating every anniversary, small achievement, and quiet joy with all my heart." },
      { icon: "✨", title: "Endless Radiance", detail: "Filling our home with golden warmth, optimism, and an abundance of sweet memories." }
    ]
  },
  {
    id: "supernova",
    badge: "💫 Cosmic Supernova Bloom",
    tag: "infinite & transcendent",
    styleName: "supernova",
    palette: [
      "232, 121, 249", // magenta flare
      "129, 140, 248", // indigo pulsar
      "255, 255, 255", // cosmic core
      "244, 114, 182", // starlight neon
      "99, 102, 241"   // deep cosmos violet
    ],
    dustPalette: "210, 170, 255",
    confetti: ["💫", "🪐", "✨", "🌌", "💜", "🌙", "☄️", "💖"],
    scale: [293.66, 369.99, 440.00, 493.88, 554.37, 659.25, 739.99, 987.77], // D Lydian mystical
    chord: [440.00, 554.37, 659.25, 739.99],
    beatSpeed: 2.5,
    particleStyle: "supernova",
    letter: {
      tag: "infinite & transcendent",
      para1: "When our paths crossed, it was as if a dormant star went supernova—illuminating the darkest corners of my world with incomprehensible brilliance and eternal warmth.",
      para2: "My love for you expands outward into infinity, defying all bounds of time, space, and mortality. You are my cosmic miracle, my soul's gravity, and my final resting star.",
      quote: (partner) => `"Beyond time, beyond the edge of the universe... my heart will forever orbit yours, ${partner}."`,
      vow: (partner, sender) => `To infinity and beyond! Dearest ${partner}, I, ${sender}, vow to love you with cosmic depth, holding you close through all expanding universes and lifetimes.`
    },
    promises: [
      { icon: "💫", title: "Transcendent Love", detail: "A devotion that outlasts all earthly challenges, rooted in the deepest depths of my soul." },
      { icon: "🪐", title: "Eternal Orbit", detail: "Never straying, always centering my life around your peace, your safety, and your joy." },
      { icon: "🌌", title: "Infinite Horizons", detail: "Dreaming big together, traveling beneath infinite skies, and reaching for the stars." }
    ]
  },
  {
    id: "sakura",
    badge: "🌸 Cherry Blossom Reverie",
    tag: "sweet & enchanting",
    styleName: "sakura",
    palette: [
      "255, 155, 195", // sakura petal pink
      "255, 195, 220", // soft blush
      "255, 115, 165", // sweet magenta
      "255, 245, 250", // blossom white
      "255, 225, 175"  // spring sun gold
    ],
    dustPalette: "255, 200, 225",
    confetti: ["🌸", "💮", "🌺", "💕", "🍃", "🦋", "🌷", "💖"],
    scale: [349.23, 440.00, 523.25, 587.33, 698.46, 783.99, 880.00, 1046.50], // F major sweet melody
    chord: [349.23, 440.00, 523.25, 698.46],
    beatSpeed: 2.6,
    particleStyle: "sakura",
    letter: {
      tag: "sweet & enchanting",
      para1: "Every memory with you blossoms like spring petals carried by a gentle breeze. You brought color, tenderness, and endless joy into my life the very instant you entered it.",
      para2: "I fall in love with you anew every morning—with your gentle laughter, your pure and caring heart, and the magic you sprinkle effortlessly over every ordinary day.",
      quote: (partner) => `"You are the eternal spring of my soul, ${partner}, making every day feel like a sweet fairy tale."`,
      vow: (partner, sender) => `YES! My heart is dancing with joy! Dearest ${partner}, I, ${sender}, promise to nurture our romance every single day, keeping our love forever fresh, sweet, and blooming.`
    },
    promises: [
      { icon: "🌸", title: "Gentle Sweetness", detail: "I promise to treat your heart with the utmost tenderness, honor, and unending patience." },
      { icon: "🦋", title: "Childlike Wonder", detail: "Keeping the magic alive through sweet surprises, playful laughter, and shared adventures." },
      { icon: "🌿", title: "Everlasting Spring", detail: "Loving you through every season, finding new reasons to adore you with every sunrise." }
    ]
  },
  {
    id: "ocean",
    badge: "🌊 Deep Ocean Whispers",
    tag: "boundless & peaceful",
    styleName: "ocean",
    palette: [
      "70, 195, 255",  // glowing cyan
      "120, 130, 255", // moonlit lavender
      "200, 240, 255", // seafoam starlight
      "255, 140, 195", // coral pink
      "40, 140, 240"   // deep azure
    ],
    dustPalette: "150, 220, 255",
    confetti: ["🌊", "💎", "💙", "🌙", "✨", "🐚", "🐬", "💧"],
    scale: [329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00], // A minor deep serenity
    chord: [440.00, 523.25, 659.25, 783.99],
    beatSpeed: 2.2,
    particleStyle: "ocean",
    letter: {
      tag: "boundless & peaceful",
      para1: "My love for you is as deep and infinite as the ocean itself. In a noisy and unpredictable world, your voice is the soothing tide that quiets my soul and brings absolute stillness to my mind.",
      para2: "Just as the tides are forever bound to the pull of the moon, every breath of mine is drawn to you. I love you not just for who you are, but for who I become when I am blessed to walk beside you.",
      quote: (partner) => `"Deeper than the seven seas and wider than the skies, my heart belongs entirely to you, ${partner}."`,
      vow: (partner, sender) => `Deepest peace and eternal devotion! My beloved ${partner}, I, ${sender}, vow to be your calm harbor, your steady anchor, and your faithful companion through all tides of life.`
    },
    promises: [
      { icon: "⚓", title: "Unwavering Anchor", detail: "I promise to be your rock and shelter, steady and calm through life's unexpected waves." },
      { icon: "🌊", title: "Boundless Love", detail: "A love without conditions, boundaries, or end—deepening with every breath we share." },
      { icon: "🌙", title: "Serene Nights", detail: "Holding you in comfort, ensuring you fall asleep feeling safe, cherished, and deeply loved." }
    ]
  },
  {
    id: "sunset",
    badge: "🍯 Sunset Golden Serenade",
    tag: "warmth & comfort",
    styleName: "sunset",
    palette: [
      "255, 180, 70",  // warm honey gold
      "255, 110, 120", // peach blush
      "255, 220, 140", // soft sunshine
      "255, 245, 220", // warm ivory
      "255, 130, 160"  // coral rose
    ],
    dustPalette: "255, 210, 160",
    confetti: ["🍯", "🧡", "💖", "🌸", "🌻", "☀️", "🍂", "✨"],
    scale: [293.66, 369.99, 440.00, 493.88, 587.33, 659.25, 739.99, 880.00], // D major warm sunset
    chord: [369.99, 440.00, 587.33, 739.99],
    beatSpeed: 2.5,
    particleStyle: "sunset",
    letter: {
      tag: "warmth & comfort",
      para1: "Being with you feels like coming home to the warmest golden sunset after a long journey. Your laughter brings pure sunshine into my days, and your gentle touch melts away all the worries of the world.",
      para2: "I adore the sweetest little things about you—how your eyes light up when you're joyful, the warmth of your hand in mine, and the peaceful sanctuary we create together simply by being near.",
      quote: (partner) => `"In your warm embrace, ${partner}, I found the haven my heart had been searching for all along."`,
      vow: (partner, sender) => `The sweetest YES of my entire life! From this moment on, ${partner}, I, ${sender}, promise to brew your morning warmth, celebrate every laugh, and keep our home filled with endless happiness.`
    },
    promises: [
      { icon: "☀️", title: "Unfailing Sunshine", detail: "I promise to bring light and laughter to your rainy days and always cherish your precious heart." },
      { icon: "🏡", title: "A Peaceful Haven", detail: "Our love will always be a warm shelter of understanding, honest care, and boundless comfort." },
      { icon: "🌻", title: "Blooming Joy", detail: "Nurturing our dreams with patience and celebrating every step of our beautiful journey together." }
    ]
  },
  {
    id: "sanctuary",
    badge: "🕊️ Pure Sanctuary",
    tag: "sacred & devoted",
    styleName: "sanctuary",
    palette: [
      "240, 210, 255", // iridescent opal
      "255, 130, 175", // rose quartz
      "255, 255, 255", // pure angelic white
      "200, 170, 255", // ethereal lavender
      "255, 185, 215"  // tender orchid
    ],
    dustPalette: "230, 200, 255",
    confetti: ["🕊️", "💍", "💖", "🤍", "👑", "✨", "🌹", "💎"],
    scale: [329.63, 415.30, 493.88, 554.37, 659.25, 830.61, 987.77, 1108.73], // E harmonic sacred
    chord: [415.30, 493.88, 659.25, 830.61],
    beatSpeed: 2.4,
    particleStyle: "sanctuary",
    letter: {
      tag: "sacred & devoted",
      para1: "To love you is my life's most sacred calling. In your spirit I have found the purest sanctuary—a place where trust is absolute, love is boundless, and two souls become one inseparable whole.",
      para2: "I vow to honor you above all else, to stand as your guardian in times of trial, and to cherish every thought, hope, and dream you share with me for the rest of my days.",
      quote: (partner) => `"My devotion to you, ${partner}, is written with the ink of eternity and sealed with my entire soul."`,
      vow: (partner, sender) => `A sacred vow for all eternity! My precious ${partner}, I, ${sender}, promise you my loyalty, my unconditional devotion, and my boundless love through this lifetime and beyond.`
    },
    promises: [
      { icon: "🕊️", title: "Sacred Trust", detail: "I promise to honor our bond with unflinching honesty, deep respect, and unbreakable loyalty." },
      { icon: "🛡️", title: "Your Faithful Shield", detail: "Standing fiercely beside you in every challenge, never letting you feel alone in this world." },
      { icon: "💍", title: "Eternity in One Breath", detail: "Choosing you with full devotion today, tomorrow, and every day God blesses us with." }
    ]
  }
];

// State Management
let currentSender = "Md. Firoz Kabir";
let currentPartner = "Most. Noushin Islam";
let currentEmotion = EMOTIONS[0];
let selectedEmotionChoice = "auto"; // "auto" or emotion id

// Animation Studio States
let currentMotionMode = "pulse"; // "pulse" | "vortex" | "wave" | "shimmer" | "wings"
let currentAnimSpeed = 1.0; // 0.65 | 1.0 | 1.55 | 2.1
let currentParticleDensity = "medium"; // "light" | "medium" | "high"
let currentTouchFx = "sparkles"; // "sparkles" | "hearts" | "petals" | "embers" | "rainbow"

let particles = [];
let celebrationParticles = [];
let interactiveSparks = [];
let animationId;
let startTime = performance.now();
let heartReady = false;
let isCelebrating = false;
let soundEnabled = false;
let audioCtx = null;
let musicInterval = null;

// Simple string hash for mapping names to an emotional seed
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

// Get or initialize refresh counter in sessionStorage so refreshes give new feelings even for identical names
function getRefreshSeed() {
  const stored = sessionStorage.getItem("romantic_refresh_seed");
  const count = stored ? parseInt(stored, 10) : 0;
  sessionStorage.setItem("romantic_refresh_seed", (count + 1).toString());
  return count;
}

// Compute active emotion based on names, user choice, and refresh seed
function determineEmotion(sender, partner, choice, refreshCount) {
  if (choice && choice !== "auto") {
    const found = EMOTIONS.find(e => e.id === choice);
    if (found) return found;
  }
  const nameHash = hashString((sender || "").trim().toLowerCase() + ":::" + (partner || "").trim().toLowerCase());
  const index = Math.abs(nameHash + refreshCount) % EMOTIONS.length;
  return EMOTIONS[index];
}

// Show Toast Notification
let toastTimeout = null;
function showToast(text, duration = 3000) {
  if (toastTimeout) clearTimeout(toastTimeout);
  toastNotification.textContent = text;
  toastNotification.hidden = false;
  toastTimeout = setTimeout(() => {
    toastNotification.hidden = true;
  }, duration);
}

// Initialize audio context
function initAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

// Play chime with audio synthesizer
function playChime(freq = 523.25, duration = 1.2, delay = 0) {
  if (!soundEnabled || !audioCtx) return;
  setTimeout(() => {
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio safety guard
    }
  }, delay * 1000);
}

function playRomanticChord(notes, spread = 0.08) {
  if (!soundEnabled) return;
  initAudio();
  notes.forEach((freq, idx) => {
    playChime(freq, 2.2, idx * spread);
  });
}

function playCelebrationFanfare() {
  initAudio();
  soundEnabled = true;
  updateSoundButtonUI();

  const melody = [
    { freq: currentEmotion.chord[0] || 440, delay: 0.0, dur: 0.8 },
    { freq: currentEmotion.chord[1] || 554.37, delay: 0.15, dur: 0.8 },
    { freq: currentEmotion.chord[2] || 659.25, delay: 0.3, dur: 1.2 },
    { freq: currentEmotion.scale[currentEmotion.scale.length - 2] || 880.0, delay: 0.5, dur: 2.2 },
    { freq: currentEmotion.scale[currentEmotion.scale.length - 1] || 1108.73, delay: 0.7, dur: 2.8 },
    { freq: (currentEmotion.chord[0] || 440) * 2, delay: 0.9, dur: 3.2 }
  ];

  melody.forEach(item => {
    playChime(item.freq, item.dur, item.delay);
  });
}

function startAmbientChimes() {
  if (musicInterval) clearInterval(musicInterval);
  musicInterval = setInterval(() => {
    if (!soundEnabled) return;
    const scale = currentEmotion.scale;
    const n1 = scale[Math.floor(Math.random() * scale.length)];
    const n2 = scale[Math.floor(Math.random() * scale.length)];
    playRomanticChord([n1, n2], 0.15);
  }, 4200);
}

function stopAmbientChimes() {
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
}

function updateSoundButtonUI() {
  if (soundEnabled) {
    soundIcon.textContent = "🔊";
    soundLabel.textContent = "Chimes: On";
    soundToggle.style.borderColor = "var(--pink)";
    soundToggle.style.background = "rgba(255, 101, 149, 0.28)";
  } else {
    soundIcon.textContent = "♪";
    soundLabel.textContent = "Play Romantic Melody";
    soundToggle.style.borderColor = "";
    soundToggle.style.background = "";
  }
}

soundToggle.addEventListener("click", () => {
  initAudio();
  soundEnabled = !soundEnabled;
  updateSoundButtonUI();
  if (soundEnabled) {
    playRomanticChord(currentEmotion.chord);
    startAmbientChimes();
  } else {
    stopAmbientChimes();
  }
});

// Canvas resizing
function resize() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  createParticles();
}

// Parametric Heart formulation with emotion-specific perturbations
function heartPoint(t, scale = 1, style = "rose") {
  let x = 16 * Math.pow(Math.sin(t), 3);
  let y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

  // Style-specific geometric contours
  if (style === "sunset") {
    y += Math.sin(t * 3) * 0.4;
  } else if (style === "ocean") {
    return { x: x * scale * 1.05, y: y * scale * 0.98 };
  } else if (style === "sakura") {
    return { x: x * scale * 0.98, y: (y - Math.sin(t) * 0.5) * scale };
  } else if (style === "crystal") {
    // Sharp faceted steps
    const step = Math.PI / 16;
    const roundedT = Math.round(t / step) * step;
    const fx = 16 * Math.pow(Math.sin(roundedT), 3);
    const fy = -(13 * Math.cos(roundedT) - 5 * Math.cos(2 * roundedT) - 2 * Math.cos(3 * roundedT) - Math.cos(4 * roundedT));
    return { x: (x * 0.7 + fx * 0.3) * scale, y: (y * 0.7 + fy * 0.3) * scale };
  } else if (style === "butterfly") {
    // Delicate butterfly wing lobes
    x *= (1 + 0.12 * Math.sin(t * 2));
  } else if (style === "embers") {
    // Thermal flame tapering
    y -= Math.abs(Math.sin(t)) * 0.45;
  }

  return { x: x * scale, y: y * scale };
}

// Particle Creation for Current Emotion and Density
function createParticles() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  const scale = Math.min(w, h) / 38;
  const cx = w / 2;
  const cy = h / 2 + 6;

  particles = [];

  let densityMult = 1.0;
  if (currentParticleDensity === "light") densityMult = 0.65;
  else if (currentParticleDensity === "high") densityMult = 1.65;

  const heartCount = Math.floor(Math.max(680, Math.floor((w * h) / 180)) * densityMult);
  const palette = currentEmotion.palette;
  const style = currentEmotion.particleStyle;

  for (let i = 0; i < heartCount; i++) {
    const t = Math.random() * Math.PI * 2;
    const p = heartPoint(t, scale, style);
    const normalJitter = (Math.random() - 0.5) * scale * (0.6 + Math.random() * 2.0);

    particles.push({
      x: cx + p.x + normalJitter,
      y: cy + p.y + normalJitter,
      baseX: cx + p.x + normalJitter,
      baseY: cy + p.y + normalJitter,
      size: Math.random() * 1.55 + 0.35,
      alpha: Math.random() * 0.85 + 0.25,
      phase: Math.random() * Math.PI * 2,
      speed: 0.7 + Math.random() * 1.8,
      angle: Math.random() * Math.PI * 2,
      orbitRadius: Math.random() * 14 + 4,
      isWing: i % 2 === 0,
      wingPhase: Math.random() * Math.PI * 2,
      emberRise: 0.4 + Math.random() * 1.2,
      emberTurb: Math.random() * 50,
      facetAngle: Math.floor(Math.random() * 8) * (Math.PI / 4),
      sparkAngle: Math.random() * Math.PI * 2,
      sparkSpeed: 0.8 + Math.random() * 2.5,
      color: palette[Math.floor(Math.random() * palette.length)]
    });
  }

  // Floating ambient stardust / petals / motes
  const dustCount = Math.floor(Math.max(180, Math.floor((w * h) / 1000)) * densityMult);
  for (let i = 0; i < dustCount; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      baseX: Math.random() * w,
      baseY: Math.random() * h,
      size: Math.random() * 0.95 + 0.25,
      alpha: Math.random() * 0.45,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.9,
      ambient: true,
      color: currentEmotion.dustPalette
    });
  }
}

// Celebration Particle Burst
function spawnCanvasCelebration() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  const cx = w / 2;
  const cy = h / 2;

  celebrationParticles = [];
  for (let i = 0; i < 220; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 7.5 + 2;
    celebrationParticles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.6,
      alpha: 1,
      size: Math.random() * 3.2 + 1,
      color: Math.random() > 0.35 ? currentEmotion.palette[0] : currentEmotion.palette[3] || "255, 220, 100",
      decay: Math.random() * 0.012 + 0.008
    });
  }
}

// Draw Loop with Theme-Adaptive Particle Motion & Studio Controls
function draw(now) {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  ctx.clearRect(0, 0, w, h);

  const rawElapsed = (now - startTime) / 1000;
  const elapsed = rawElapsed * currentAnimSpeed;
  const reveal = Math.min(1, elapsed / 2.8);
  const style = currentEmotion.particleStyle;

  // Real heartbeat pulse
  const beatSpeed = (isCelebrating ? (currentEmotion.beatSpeed * 1.5) : currentEmotion.beatSpeed) * currentAnimSpeed;
  const beatTime = (rawElapsed * beatSpeed) % (Math.PI * 2);
  const lub = Math.exp(-Math.pow(beatTime - 1.2, 2) * 16) * 0.045;
  const dub = Math.exp(-Math.pow(beatTime - 2.0, 2) * 16) * 0.035;
  let heartbeatScale = 1 + lub + dub;

  // Motion dynamics mode modifiers
  if (currentMotionMode === "pulse") {
    heartbeatScale = 1 + (lub + dub) * 1.6;
  }

  // Main particles
  for (const p of particles) {
    if (p.ambient) {
      if (style === "sakura") {
        // Falling and drifting petal flow
        p.y += 0.65 * p.speed * currentAnimSpeed;
        p.x += Math.sin(elapsed * 1.2 + p.phase) * 0.8;
        if (p.y > h + 10) p.y = -10;
        if (p.x > w + 10) p.x = -10;
      } else if (style === "embers") {
        // Rising hearth sparks
        p.y -= 0.6 * p.speed * currentAnimSpeed;
        p.x += Math.sin(elapsed * 1.8 + p.phase) * 0.6;
        if (p.y < -10) p.y = h + 10;
        if (p.x > w + 10) p.x = -10;
      } else if (style === "ocean") {
        // Gentle underwater wave drift
        p.x = p.baseX + Math.sin(elapsed * 0.9 + p.phase) * 10;
        p.y = p.baseY + Math.cos(elapsed * 0.6 + p.phase) * 6;
      } else {
        const drift = Math.sin(elapsed * p.speed + p.phase) * 5;
        p.x = p.baseX + drift;
        p.y = p.baseY + Math.cos(elapsed * 0.7 + p.phase) * 4;
      }
    } else {
      if (reveal < 1) {
        // Style-specific reveal animation
        if (style === "sanctuary" || style === "supernova") {
          // Dual spiral swirl into place
          const angle = p.phase + (1 - reveal) * 6;
          const dist = (1 - reveal) * 120;
          p.x = p.baseX + Math.cos(angle) * dist;
          p.y = p.baseY + Math.sin(angle) * dist;
        } else if (style === "starlight" || style === "crystal") {
          // Twinkle-in from stardust cluster
          const scatter = (1 - reveal) * 85;
          p.x = p.baseX + (Math.sin(p.phase + elapsed) * scatter);
          p.y = p.baseY + (Math.cos(p.phase + elapsed) * scatter);
        } else if (style === "embers" || style === "fireworks") {
          // Rising explosion bloom
          const rise = (1 - reveal) * 90;
          const scatter = (1 - reveal) * 45;
          p.x = p.baseX + Math.cos(p.phase) * scatter;
          p.y = p.baseY + rise;
        } else {
          // Radial scatter bloom
          const scatter = (1 - reveal) * (40 + 110 * (0.4 + Math.random() * 0.6));
          const ease = reveal * reveal * (3 - 2 * reveal);
          p.x = p.baseX + Math.cos(p.phase + elapsed * p.speed) * scatter * (1 - ease);
          p.y = p.baseY + Math.sin(p.phase + elapsed * p.speed) * scatter * (1 - ease);
        }
      } else {
        const w2 = w / 2;
        const h2 = h / 2 + 6;
        let bx = p.baseX - w2;
        let by = p.baseY - h2;

        let dynamicPulse = heartbeatScale;

        // Dynamics Modes application
        if (currentMotionMode === "vortex") {
          const rot = elapsed * 0.25;
          const rx = bx * Math.cos(rot) - by * Math.sin(rot);
          const ry = bx * Math.sin(rot) + by * Math.cos(rot);
          bx = rx;
          by = ry;
        } else if (currentMotionMode === "wave") {
          dynamicPulse += Math.sin(elapsed * 2.8 + (bx + by) * 0.025) * 0.035;
        } else if (currentMotionMode === "shimmer") {
          dynamicPulse += Math.sin(elapsed * 8.5 + p.phase) * 0.02;
        } else if (currentMotionMode === "wings") {
          dynamicPulse += Math.sin(elapsed * 6.5 + p.phase) * (p.isWing ? 0.04 : -0.02);
        }

        // Style Kinematics
        if (style === "starlight") {
          dynamicPulse += Math.sin(elapsed * 3.5 + p.phase) * 0.02;
          p.x = w2 + bx * dynamicPulse;
          p.y = h2 + by * dynamicPulse;
        } else if (style === "ocean") {
          dynamicPulse += Math.sin(elapsed * 1.8 + Math.sqrt(bx*bx + by*by) * 0.05) * 0.025;
          p.x = w2 + bx * dynamicPulse;
          p.y = h2 + by * dynamicPulse;
        } else if (style === "aurora") {
          const waveCurtain = Math.sin(p.baseX * 0.02 + elapsed * 2.2) * 8 + Math.cos(p.baseY * 0.02 + elapsed * 1.5) * 6;
          p.x = w2 + bx * dynamicPulse + waveCurtain;
          p.y = h2 + by * dynamicPulse + Math.sin(elapsed * 1.6 + p.phase) * 3;
        } else if (style === "embers") {
          const flameFloat = Math.sin(elapsed * 3.2 + p.emberTurb) * 5;
          const heatShimmer = Math.sin(elapsed * 5.0 + p.phase) * 2;
          p.x = w2 + bx * dynamicPulse + flameFloat;
          p.y = h2 + by * dynamicPulse - heatShimmer;
        } else if (style === "butterfly") {
          const flap = Math.sin(elapsed * 8.5 + p.phase) * (p.isWing ? 7.5 : 1.8);
          const normAngle = Math.atan2(by, bx) + Math.PI / 2;
          p.x = w2 + bx * dynamicPulse + Math.cos(normAngle) * flap;
          p.y = h2 + by * dynamicPulse + Math.sin(normAngle) * flap;
        } else if (style === "crystal") {
          const facetGlint = (Math.sin(elapsed * 5 + p.facetAngle) > 0.6) ? 1.03 : 0.98;
          p.x = w2 + bx * dynamicPulse * facetGlint;
          p.y = h2 + by * dynamicPulse * facetGlint;
        } else if (style === "fireworks") {
          const sparkPhase = (elapsed * 3.5 + p.phase) % (Math.PI * 2);
          const sparkBurst = Math.sin(sparkPhase) > 0.75 ? Math.sin(sparkPhase) * 10 : 0;
          p.x = w2 + (bx + Math.cos(p.sparkAngle) * sparkBurst) * dynamicPulse;
          p.y = h2 + (by + Math.sin(p.sparkAngle) * sparkBurst + (sparkBurst > 0 ? 3 : 0)) * dynamicPulse;
        } else if (style === "supernova") {
          const dist = Math.sqrt(bx * bx + by * by);
          const pulseWave = Math.sin(elapsed * 3.6 - dist * 0.05) * 0.035;
          p.x = w2 + bx * (dynamicPulse + pulseWave);
          p.y = h2 + by * (dynamicPulse + pulseWave);
        } else {
          dynamicPulse += Math.sin(elapsed * 2.8 + p.phase) * 0.015;
          p.x = w2 + bx * dynamicPulse;
          p.y = h2 + by * dynamicPulse;
        }
      }
    }

    const flicker = p.alpha * (0.65 + 0.35 * Math.sin(elapsed * (p.speed * 1.5) + p.phase));
    ctx.fillStyle = `rgba(${p.color}, ${Math.max(0.05, flicker)})`;
    ctx.shadowBlur = p.size > 1.2 ? 10 : 0;
    ctx.shadowColor = `rgba(${p.color}, 0.85)`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * (isCelebrating ? 1.25 : 1), 0, Math.PI * 2);
    ctx.fill();
  }

  // Interactive mouse/touch sparks with currentTouchFx
  for (let i = interactiveSparks.length - 1; i >= 0; i--) {
    const s = interactiveSparks[i];
    s.x += s.vx;
    s.y += s.vy;
    s.alpha -= s.decay || 0.025;
    if (s.size) s.size *= 0.96;

    if (s.alpha <= 0) {
      interactiveSparks.splice(i, 1);
      continue;
    }

    if (s.type === "hearts") {
      // Floating mini heart glyph
      ctx.save();
      ctx.font = `${Math.floor(s.size * 5)}px "Caveat", cursive`;
      ctx.fillStyle = `rgba(${s.color}, ${s.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(${s.color}, 0.9)`;
      ctx.fillText(s.glyph, s.x, s.y);
      ctx.restore();
    } else if (s.type === "petals") {
      // Drifting petal
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.angle || 0);
      ctx.fillStyle = `rgba(${s.color}, ${s.alpha})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, s.size * 2, s.size * 1.1, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      s.angle = (s.angle || 0) + 0.04;
    } else {
      // Stardust / Embers / Rainbow sparkles
      ctx.fillStyle = `rgba(${s.color}, ${s.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(${s.color}, 0.9)`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, Math.max(0.8, s.size), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Celebration fireworks particles
  for (let i = celebrationParticles.length - 1; i >= 0; i--) {
    const cp = celebrationParticles[i];
    cp.x += cp.vx;
    cp.y += cp.vy;
    cp.vy += 0.08;
    cp.alpha -= cp.decay;

    if (cp.alpha <= 0) {
      celebrationParticles.splice(i, 1);
      continue;
    }

    ctx.fillStyle = `rgba(${cp.color}, ${cp.alpha})`;
    ctx.shadowBlur = 12;
    ctx.shadowColor = `rgba(${cp.color}, 0.9)`;
    ctx.beginPath();
    ctx.arc(cp.x, cp.y, cp.size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.shadowBlur = 0;

  if (reveal > 0.92 && !heartReady) {
    heartReady = true;
    heartMessage.classList.add("show");
  }

  animationId = requestAnimationFrame(draw);
}

// Sparkle trail for interaction with currentTouchFx support
function addSparkleTrail(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;

  const palette = currentEmotion.palette;

  if (currentTouchFx === "hearts") {
    interactiveSparks.push({
      type: "hearts",
      glyph: Math.random() > 0.4 ? "♥" : "♡",
      x,
      y,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -1.6 - Math.random() * 1.4,
      size: Math.random() * 2.2 + 2.5,
      alpha: 1,
      decay: 0.02,
      color: palette[Math.floor(Math.random() * palette.length)]
    });
  } else if (currentTouchFx === "petals") {
    interactiveSparks.push({
      type: "petals",
      x,
      y,
      vx: (Math.random() - 0.5) * 1.8,
      vy: 0.8 + Math.random() * 1.4,
      size: Math.random() * 2.5 + 2,
      angle: Math.random() * Math.PI,
      alpha: 1,
      decay: 0.016,
      color: Math.random() > 0.5 ? "255, 140, 185" : "255, 195, 220"
    });
  } else if (currentTouchFx === "embers") {
    for (let i = 0; i < 3; i++) {
      interactiveSparks.push({
        type: "embers",
        x,
        y,
        vx: (Math.random() - 0.5) * 3,
        vy: -1.5 - Math.random() * 2.2,
        size: Math.random() * 2.6 + 1,
        alpha: 1,
        decay: 0.028,
        color: Math.random() > 0.5 ? "255, 120, 20" : "255, 210, 40"
      });
    }
  } else if (currentTouchFx === "rainbow") {
    const hue = (performance.now() * 0.15) % 360;
    for (let i = 0; i < 3; i++) {
      interactiveSparks.push({
        type: "rainbow",
        x,
        y,
        vx: (Math.random() - 0.5) * 2.8,
        vy: (Math.random() - 0.5) * 2.8,
        size: Math.random() * 2.6 + 1.2,
        alpha: 1,
        decay: 0.025,
        color: `hsl(${(hue + i * 40) % 360}, 95%, 65%)`
      });
    }
  } else {
    // Default stardust sparkles
    for (let i = 0; i < 3; i++) {
      interactiveSparks.push({
        type: "sparkles",
        x,
        y,
        vx: (Math.random() - 0.5) * 2.5,
        vy: (Math.random() - 0.5) * 2.5,
        size: Math.random() * 2.5 + 1,
        alpha: 1,
        decay: 0.025,
        color: palette[Math.floor(Math.random() * palette.length)]
      });
    }
  }
}

canvas.addEventListener("mousemove", (e) => {
  addSparkleTrail(e.clientX, e.clientY);
});

canvas.addEventListener("touchmove", (e) => {
  if (e.touches && e.touches[0]) {
    addSparkleTrail(e.touches[0].clientX, e.touches[0].clientY);
  }
}, { passive: true });

// Confetti burst on celebration
function launchConfettiCelebration() {
  const hearts = currentEmotion.confetti;
  confettiContainer.innerHTML = "";

  for (let i = 0; i < 95; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti-heart";
    confetti.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.animationDuration = `${2.2 + Math.random() * 2.8}s`;
    confetti.style.animationDelay = `${Math.random() * 1.5}s`;
    confetti.style.fontSize = `${16 + Math.random() * 24}px`;
    confettiContainer.appendChild(confetti);
  }

  setTimeout(() => {
    confettiContainer.innerHTML = "";
  }, 6500);
}

// Extract short first name for cozy display
function getFirstName(fullName, defaultName) {
  if (!fullName) return defaultName;
  const parts = fullName.trim().split(/\s+/);
  if (parts.length > 1 && /^(md\.?|most\.?|dr\.?|mr\.?|ms\.?|mrs\.?)$/i.test(parts[0])) {
    return parts[1];
  }
  return parts[0] || defaultName;
}

// Render the application with current names and active emotion
function applyState(sender, partner, emotion, dynamic, customNote) {
  currentSender = sender || "Md. Firoz Kabir";
  currentPartner = partner || "Most. Noushin Islam";
  currentEmotion = emotion || EMOTIONS[0];
  if (dynamic) currentDynamic = dynamic;
  if (customNote !== undefined) currentCustomNote = customNote;

  const partnerShort = getFirstName(currentPartner, "My Love");
  const senderShort = getFirstName(currentSender, "My Love");

  // Update Body Theme
  document.body.setAttribute("data-theme", currentEmotion.styleName);

  // Update Top Bar
  themeTagPill.textContent = currentEmotion.badge;
  navCoupleText.textContent = `${currentSender} & ${currentPartner}`;

  // Update Hero
  heroPartnerName.textContent = `belongs to you, ${partnerShort}`;

  // Update Canvas Message
  heartMessageName.textContent = partnerShort;
  heartMessagePrefix.textContent = "my forever";
  heartMessageSub.textContent = "my greatest blessing";

  // Dynamic Content according to who is proposing
  if (currentDynamic === "girl_to_boy") {
    // Girl proposing to boy
    if (proposalBannerText) {
      proposalBannerText.textContent = `A Private Heartfelt Proposal for ${currentPartner} from His Girl, ${currentSender}`;
    }
    whisperPartner.textContent = partnerShort.toUpperCase();
    if (whisperFrom) {
      whisperFrom.textContent = `from your girl ${senderShort}, with all my soul straight to yours ♡`;
    }
    const whisperPrefixEl = document.getElementById("whisperPrefix");
    if (whisperPrefixEl) whisperPrefixEl.textContent = "A GIRL'S SACRED VOW TO";

    letterSealText.textContent = `A Girl's Love Letter to Her Prince, ${partnerShort}`;
    letterSalutation.textContent = `To the Man Who Stole My Heart, My Dearest ${currentPartner},`;
    letterSenderName.innerHTML = `With all my heart and love, your girl,<br><strong>${currentSender} ♡</strong>`;

    const proposalQuestion = document.getElementById("proposalQuestion");
    if (proposalQuestion) {
      proposalQuestion.innerHTML = `Will you make me the happiest girl in the world<br><span id="proposalQuestionHighlight">and be mine forever?</span> ♡`;
    }
    proposalSmallText.textContent = `from your girl, ${currentSender}, asking the sacred question of a lifetime...`;
    proposalPoeticText.innerHTML = `Across every lifetime and every universe, my heart could only ever surrender to you, <b>${partnerShort}</b>.`;

    successHighlight.textContent = `"You and me, ${partnerShort} — my forever king and love."`;
    successVow.textContent = `Thank you for saying YES, my love! From this second until the end of time, I, ${currentSender}, promise to support your dreams, stand proudly by your side through every storm, and cherish you with all my heart.`;
  } else if (currentDynamic === "soulmates") {
    // Soulmate proposal
    if (proposalBannerText) {
      proposalBannerText.textContent = `A Sacred Soulmate Proposal for ${currentPartner} from ${currentSender}`;
    }
    whisperPartner.textContent = partnerShort.toUpperCase();
    if (whisperFrom) {
      whisperFrom.textContent = `from ${senderShort}, bound across the stars ♡`;
    }
    const whisperPrefixEl = document.getElementById("whisperPrefix");
    if (whisperPrefixEl) whisperPrefixEl.textContent = "AN ETERNAL VOW TO";

    letterSealText.textContent = `A Sacred Bond with ${partnerShort}`;
    letterSalutation.textContent = `To My Soulmate & Twin Flame, ${currentPartner},`;
    letterSenderName.innerHTML = `Yours for all eternity,<br><strong>${currentSender} ♡</strong>`;

    const proposalQuestion = document.getElementById("proposalQuestion");
    if (proposalQuestion) {
      proposalQuestion.innerHTML = `Will you walk hand in hand with me<br><span id="proposalQuestionHighlight">through all of eternity?</span> ♡`;
    }
    proposalSmallText.textContent = `from ${currentSender}, two souls uniting as one...`;
    proposalPoeticText.innerHTML = `Two souls bound across space and time, discovering home in each other: <b>${partnerShort} & ${senderShort}</b>.`;

    successHighlight.textContent = `"Two souls, one destiny — ${partnerShort} & ${senderShort} forever."`;
    successVow.textContent = `Hand in hand through every mystery of existence, I, ${currentSender}, vow to honor, cherish, and walk alongside you, ${partnerShort}, through all worlds.`;
  } else {
    // Boy proposing to girl (default)
    if (proposalBannerText) {
      proposalBannerText.textContent = `A Private Heartfelt Proposal for ${currentPartner} from ${currentSender}`;
    }
    whisperPartner.textContent = partnerShort.toUpperCase();
    if (whisperFrom) {
      whisperFrom.textContent = `from ${senderShort}'s soul straight to yours ♡`;
    }
    const whisperPrefixEl = document.getElementById("whisperPrefix");
    if (whisperPrefixEl) whisperPrefixEl.textContent = "A PROMISE TO";

    letterSealText.textContent = `A Love Letter to ${partnerShort}`;
    letterSalutation.textContent = `My Dearest ${currentPartner},`;
    letterSenderName.innerHTML = `With all my love and endless devotion,<br><strong>${currentSender} ♡</strong>`;

    const proposalQuestion = document.getElementById("proposalQuestion");
    if (proposalQuestion) {
      proposalQuestion.innerHTML = `Will you be<br><span id="proposalQuestionHighlight">mine forever?</span> ♡`;
    }
    proposalSmallText.textContent = `from ${currentSender}, with all my heart and soul...`;
    proposalPoeticText.innerHTML = `I could search a thousand lifetimes across a million galaxies,<br>but my heart's only true destination will always be <b>${partnerShort}</b>.`;

    successHighlight.textContent = `"You and me, ${partnerShort} — a love written in the stars."`;
    successVow.textContent = currentEmotion.letter.vow(partnerShort, currentSender);
  }

  // Update Letter Paragraphs
  letterThemeTag.textContent = currentEmotion.letter.tag;
  letterPara1.textContent = currentEmotion.letter.para1;
  letterPara2.textContent = currentEmotion.letter.para2;

  // Custom Note or Standard Quote
  if (currentCustomNote && currentCustomNote.trim()) {
    letterHighlight.textContent = `"${currentCustomNote.trim()}"`;
  } else {
    letterHighlight.textContent = currentEmotion.letter.quote(partnerShort);
  }

  // Update Three Promises
  currentEmotion.promises.forEach((p, idx) => {
    const icon = document.getElementById(`capsuleIcon${idx + 1}`);
    const title = document.getElementById(`capsuleTitle${idx + 1}`);
    const detail = document.getElementById(`capsuleDetail${idx + 1}`);
    if (icon) icon.textContent = p.icon;
    if (title) title.textContent = p.title;
    if (detail) detail.textContent = p.detail;
  });

  // Display Names
  displaySender.textContent = currentSender;
  displayPartner.textContent = currentPartner;

  // Update Footer
  pageFooter.innerHTML = `made with eternal <span>♥</span> &amp; infinite devotion for ${currentPartner} from ${currentSender}`;

  // Update Document Title
  document.title = `For ${currentPartner} — From ${currentSender} ❤️`;

  // Sync Animation Studio Active Chip
  document.querySelectorAll(".anim-chip").forEach(chip => {
    if (chip.getAttribute("data-anim") === currentEmotion.id) {
      chip.classList.add("active");
    } else {
      chip.classList.remove("active");
    }
  });

  // Sync modal dropdown
  if (selectEmotion) {
    selectEmotion.value = (selectedEmotionChoice === "auto") ? "auto" : currentEmotion.id;
  }

  // Reset Canvas Animation with new emotion parameters
  cancelAnimationFrame(animationId);
  startTime = performance.now();
  heartReady = false;
  isCelebrating = false;
  heartMessage.classList.remove("show");
  successBox.hidden = true;
  yesBtn.textContent = "YES, WITH ALL MY HEART! ❤️";
  createParticles();
  animationId = requestAnimationFrame(draw);
}

// Reset / Replay
function restart() {
  cancelAnimationFrame(animationId);
  startTime = performance.now();
  heartReady = false;
  isCelebrating = false;
  heartMessage.classList.remove("show");
  successBox.hidden = true;
  yesBtn.textContent = "YES, WITH ALL MY HEART! ❤️";
  createParticles();
  animationId = requestAnimationFrame(draw);
  playRomanticChord(currentEmotion.chord);
}

// Playful Hesitation Button ("Let me think... 🤔")
const HESITATION_PHRASES = [
  "Are you sure? Look how warm and inviting the glowing YES button is! 😉",
  "Error 404: 'No' was not found in our romantic universe! 🥰",
  "My heart can't take the suspense! Please tap YES! 💓",
  "Legend says eternal happiness begins the second you tap YES! ✨",
  "Nice try, but you know you belong in my arms forever! ❤️",
  "Every millisecond without your YES feels like a century! 🌹"
];
let hesitationIndex = 0;

function handleHesitate() {
  initAudio();
  playRomanticChord([523.25, 659.25], 0.15);

  if (playfulHesitationText) {
    playfulHesitationText.textContent = HESITATION_PHRASES[hesitationIndex % HESITATION_PHRASES.length];
    playfulHesitationText.style.animation = "none";
    playfulHesitationText.offsetHeight; // trigger reflow
    playfulHesitationText.style.animation = "heartPulse 0.4s ease";
  }
  hesitationIndex++;

  // Make the YES button pulse bigger and more alluring
  yesBtn.style.transform = "scale(1.15)";
  yesBtn.style.boxShadow = "0 0 45px rgba(255, 45, 95, 0.9)";
  setTimeout(() => {
    yesBtn.style.transform = "";
    yesBtn.style.boxShadow = "";
  }, 700);

  // Playfully shift the think button slightly
  if (thinkBtn) {
    const randomOffset = (Math.random() - 0.5) * 24;
    thinkBtn.style.transform = `translateX(${randomOffset}px) scale(0.95)`;
  }
}

if (thinkBtn) {
  thinkBtn.addEventListener("click", handleHesitate);
  thinkBtn.addEventListener("mouseenter", () => {
    if (Math.random() > 0.4) handleHesitate();
  });
}

// YES Button: Ultimate Emotional Climax or Recipient Acceptance
yesBtn.addEventListener("click", () => {
  // If recipient is viewing an active shared proposal, open acceptance response modal
  if (isRecipientProposalMode && activeProposalId) {
    openRecipientAcceptModal();
    return;
  }

  // Local celebration mode
  triggerCelebrationSequence();
});

function triggerCelebrationSequence(customNoteText) {
  isCelebrating = true;
  successBox.hidden = false;
  const partnerShort = getFirstName(currentPartner, "LOVE");
  const senderShort = getFirstName(currentSender, "LOVE");

  if (currentDynamic === "girl_to_boy") {
    yesBtn.textContent = `❤️ HE SAID YES! ${partnerShort.toUpperCase()} & ${senderShort.toUpperCase()} FOREVER ❤️`;
  } else {
    yesBtn.textContent = `❤️ SHE SAID YES! ${partnerShort.toUpperCase()} & ${senderShort.toUpperCase()} FOREVER ❤️`;
  }

  if (customNoteText && recipientReplyShowcase && recipientReplyText) {
    recipientReplyText.textContent = `"${customNoteText}"`;
    recipientReplyShowcase.hidden = false;
  }

  spawnCanvasCelebration();
  launchConfettiCelebration();
  playCelebrationFanfare();

  successBox.scrollIntoView({ behavior: "smooth", block: "center" });
}

// Recipient Acceptance Modal
function openRecipientAcceptModal() {
  if (!recipientAcceptModal) return;
  if (acceptModalDesc) {
    acceptModalDesc.textContent = `You are about to say YES to ${currentSender}! Add an optional sweet note or message to deliver directly to their heart:`;
  }
  recipientAcceptModal.hidden = false;
  if (recipientReplyInput) {
    setTimeout(() => recipientReplyInput.focus(), 100);
  }
}

function closeRecipientAcceptModal() {
  if (recipientAcceptModal) recipientAcceptModal.hidden = true;
}

if (closeRecipientModalBtn) closeRecipientModalBtn.addEventListener("click", closeRecipientAcceptModal);
if (cancelRecipientAcceptBtn) cancelRecipientAcceptBtn.addEventListener("click", closeRecipientAcceptModal);
if (recipientModalBackdrop) recipientModalBackdrop.addEventListener("click", closeRecipientAcceptModal);

if (recipientAcceptForm) {
  recipientAcceptForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const replyNote = recipientReplyInput ? recipientReplyInput.value.trim() : "";

    confirmYesSubmitBtn.disabled = true;
    confirmYesSubmitBtn.textContent = "Sealing Your Sacred YES... 💖";

    try {
      if (activeProposalId) {
        const res = await fetch(`${API_BASE_URL}/api/proposals/${activeProposalId}/accept`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ replyNote })
        });
        const data = await res.json();
        if (data.success) {
          showToast(`💍 Proposal officially accepted! ${currentSender} has been notified ❤️`);
        }
      }
    } catch (err) {
      console.warn("Offline or direct acceptance fallback:", err);
      showToast("💍 Accepted with all your heart! ❤️");
    } finally {
      confirmYesSubmitBtn.disabled = false;
      confirmYesSubmitBtn.textContent = "YES, SEAL OUR LOVE FOREVER! 💍";
      closeRecipientAcceptModal();

      // Configure WhatsApp notification button if recipient wants to double text
      if (notifyWhatsAppBtn) {
        const textMsg = `I just opened your proposal and I said YES with all my heart! ❤️ ${replyNote ? `«${replyNote}»` : ""}`;
        notifyWhatsAppBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(textMsg)}`;
      }

      // Hide proposal choice buttons, trigger glorious celebration
      if (proposalButtonsGroup) proposalButtonsGroup.style.display = "none";
      triggerCelebrationSequence(replyNote);
    }
  });
}

// Again Button
againBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (proposalButtonsGroup) proposalButtonsGroup.style.display = "";
  setTimeout(restart, 400);
});

// Replay button in animation deck
if (replayAnimBtn) {
  replayAnimBtn.addEventListener("click", () => {
    restart();
    showToast(`↺ Replaying ${currentEmotion.badge}`);
  });
}

// Random Animation button
if (randomAnimBtn) {
  randomAnimBtn.addEventListener("click", () => {
    const otherEmotions = EMOTIONS.filter(e => e.id !== currentEmotion.id);
    const randomPick = otherEmotions[Math.floor(Math.random() * otherEmotions.length)];
    selectedEmotionChoice = randomPick.id;
    localStorage.setItem("romantic_emotion_choice", randomPick.id);

    const params = new URLSearchParams(window.location.search);
    params.set("theme", randomPick.id);
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);

    applyState(currentSender, currentPartner, randomPick, currentDynamic, currentCustomNote);
    showToast(`🎲 Switched to: ${randomPick.badge}`);
    initAudio();
    playRomanticChord(randomPick.chord);
  });
}

// Setup Quick Animation Chips
document.querySelectorAll(".anim-chip").forEach(chip => {
  chip.addEventListener("click", () => {
    const animId = chip.getAttribute("data-anim");
    const foundEmotion = EMOTIONS.find(e => e.id === animId);
    if (!foundEmotion) return;

    selectedEmotionChoice = animId;
    localStorage.setItem("romantic_emotion_choice", animId);

    const params = new URLSearchParams(window.location.search);
    params.set("theme", animId);
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);

    applyState(currentSender, currentPartner, foundEmotion, currentDynamic, currentCustomNote);
    showToast(`✨ Switched animation: ${foundEmotion.badge}`);
    initAudio();
    playRomanticChord(foundEmotion.chord);
  });
});

// Setup Animation Fine-Tuning Selectors
if (selectMotionMode) {
  selectMotionMode.addEventListener("change", (e) => {
    currentMotionMode = e.target.value;
    localStorage.setItem("romantic_motion_mode", currentMotionMode);
    showToast(`Motion updated: ${selectMotionMode.options[selectMotionMode.selectedIndex].text}`);
  });
}

if (selectAnimSpeed) {
  selectAnimSpeed.addEventListener("change", (e) => {
    currentAnimSpeed = parseFloat(e.target.value) || 1.0;
    localStorage.setItem("romantic_anim_speed", currentAnimSpeed.toString());
    showToast(`Tempo updated: ${selectAnimSpeed.options[selectAnimSpeed.selectedIndex].text}`);
  });
}

if (selectParticleDensity) {
  selectParticleDensity.addEventListener("change", (e) => {
    currentParticleDensity = e.target.value;
    localStorage.setItem("romantic_particle_density", currentParticleDensity);
    createParticles();
    showToast(`Density updated: ${selectParticleDensity.options[selectParticleDensity.selectedIndex].text}`);
  });
}

if (selectTouchFx) {
  selectTouchFx.addEventListener("change", (e) => {
    currentTouchFx = e.target.value;
    localStorage.setItem("romantic_touch_fx", currentTouchFx);
    showToast(`Cursor magic: ${selectTouchFx.options[selectTouchFx.selectedIndex].text}`);
  });
}

// Interactive Floating Heart buttons
const floatingHearts = [
  document.getElementById("floatHeart1"),
  document.getElementById("floatHeart2"),
  document.getElementById("floatHeart3")
];

floatingHearts.forEach((btn, idx) => {
  if (!btn) return;
  btn.addEventListener("click", (e) => {
    initAudio();
    playRomanticChord([
      currentEmotion.chord[0] || 523.25,
      (currentEmotion.chord[1] || 659.25) + idx * 40
    ]);
    addSparkleTrail(e.clientX, e.clientY);
    btn.style.transform = "scale(1.8) rotate(25deg)";
    btn.style.color = "var(--pink)";
    setTimeout(() => {
      btn.style.transform = "";
      btn.style.color = "";
    }, 450);
  });
});

// Interactive Love Capsules (Why I Love You / Promises)
const capsules = [
  document.getElementById("capsule1"),
  document.getElementById("capsule2"),
  document.getElementById("capsule3")
];

capsules.forEach((capsule, index) => {
  if (!capsule) return;
  capsule.addEventListener("click", () => {
    initAudio();
    const scale = currentEmotion.scale;
    playRomanticChord([scale[index * 2 % scale.length], scale[(index * 2 + 2) % scale.length]]);

    capsule.classList.toggle("active");
    if (capsule.classList.contains("active")) {
      capsule.style.transform = "scale(1.03) translateY(-4px)";
    } else {
      capsule.style.transform = "";
    }
  });
});

// ==========================================
// Customizer Modal Logic
// ==========================================
function updateDynamicLabels() {
  if (dynamicGirlToBoy && dynamicGirlToBoy.checked) {
    if (labelSender) labelSender.textContent = "Your Name (Girl / Proposing):";
    if (labelPartner) labelPartner.textContent = "Boyfriend / Husband's Name (Recipient):";
  } else if (dynamicBoyToGirl && dynamicBoyToGirl.checked) {
    if (labelSender) labelSender.textContent = "Your Name (Boy / Proposing):";
    if (labelPartner) labelPartner.textContent = "Girlfriend / Wife's Name (Recipient):";
  } else {
    if (labelSender) labelSender.textContent = "Your Name:";
    if (labelPartner) labelPartner.textContent = "Soulmate / Partner's Name:";
  }
}

if (dynamicGirlToBoy) dynamicGirlToBoy.addEventListener("change", updateDynamicLabels);
if (dynamicBoyToGirl) dynamicBoyToGirl.addEventListener("change", updateDynamicLabels);
if (dynamicSoulmates) dynamicSoulmates.addEventListener("change", updateDynamicLabels);

function openModal() {
  inputSender.value = currentSender;
  inputPartner.value = currentPartner;
  selectEmotion.value = selectedEmotionChoice;
  if (inputCustomNote) inputCustomNote.value = currentCustomNote;

  if (currentDynamic === "girl_to_boy" && dynamicGirlToBoy) dynamicGirlToBoy.checked = true;
  else if (currentDynamic === "soulmates" && dynamicSoulmates) dynamicSoulmates.checked = true;
  else if (dynamicBoyToGirl) dynamicBoyToGirl.checked = true;

  updateDynamicLabels();
  customizerModal.hidden = false;
  setTimeout(() => inputPartner.focus(), 80);
}

function closeModal() {
  customizerModal.hidden = true;
}

openCustomizerBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
cancelModalBtn.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", closeModal);

// Handle Names & Emotion Submission
namesForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newSender = inputSender.value.trim() || "Md. Firoz Kabir";
  const newPartner = inputPartner.value.trim() || "Most. Noushin Islam";
  selectedEmotionChoice = selectEmotion.value;

  let newDynamic = "boy_to_girl";
  if (dynamicGirlToBoy && dynamicGirlToBoy.checked) newDynamic = "girl_to_boy";
  else if (dynamicSoulmates && dynamicSoulmates.checked) newDynamic = "soulmates";

  const newCustomNote = inputCustomNote ? inputCustomNote.value.trim() : "";

  // Persist in localStorage
  localStorage.setItem("romantic_sender", newSender);
  localStorage.setItem("romantic_partner", newPartner);
  localStorage.setItem("romantic_emotion_choice", selectedEmotionChoice);
  localStorage.setItem("romantic_dynamic", newDynamic);
  localStorage.setItem("romantic_custom_note", newCustomNote);

  // Update URL Query Parameters
  const params = new URLSearchParams(window.location.search);
  params.set("from", newSender);
  params.set("to", newPartner);
  params.set("dynamic", newDynamic);
  if (selectedEmotionChoice !== "auto") {
    params.set("theme", selectedEmotionChoice);
  } else {
    params.delete("theme");
  }
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, "", newUrl);

  const newEmotion = determineEmotion(newSender, newPartner, selectedEmotionChoice, getRefreshSeed());
  applyState(newSender, newPartner, newEmotion, newDynamic, newCustomNote);

  closeModal();
  showToast(`✨ Romantic world prepared for ${newPartner} and ${newSender}!`);
  initAudio();
  playRomanticChord(newEmotion.chord);
});

// "Surprise Emotion ↻" Button
refreshEmotionBtn.addEventListener("click", () => {
  const seed = getRefreshSeed();
  const nextEmotion = determineEmotion(currentSender, currentPartner, "auto", seed);
  selectedEmotionChoice = "auto";
  localStorage.setItem("romantic_emotion_choice", "auto");

  applyState(currentSender, currentPartner, nextEmotion, currentDynamic, currentCustomNote);
  showToast(`↻ Revealed emotion: ${nextEmotion.badge}`);
  initAudio();
  playRomanticChord(nextEmotion.chord);
});

// ==========================================
// Proposal Creation, Sharing & Live Tracking
// ==========================================
async function handleCreateAndShareProposal() {
  const sender = inputSender ? (inputSender.value.trim() || currentSender) : currentSender;
  const partner = inputPartner ? (inputPartner.value.trim() || currentPartner) : currentPartner;
  let dynamic = currentDynamic;
  if (dynamicGirlToBoy && dynamicGirlToBoy.checked) dynamic = "girl_to_boy";
  else if (dynamicSoulmates && dynamicSoulmates.checked) dynamic = "soulmates";
  else if (dynamicBoyToGirl && dynamicBoyToGirl.checked) dynamic = "boy_to_girl";

  const emotionChoice = selectEmotion ? selectEmotion.value : selectedEmotionChoice;
  const customNote = inputCustomNote ? inputCustomNote.value.trim() : currentCustomNote;

  closeModal();

  showToast("💌 Crafting private proposal & real-time tracker...");

  try {
    const res = await fetch(`${API_BASE_URL}/api/proposals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender,
        partner,
        dynamic,
        emotion: emotionChoice,
        motionMode: currentMotionMode,
        animSpeed: currentAnimSpeed,
        particleDensity: currentParticleDensity,
        touchFx: currentTouchFx,
        customNote
      })
    });

    const data = await res.json();
    if (data.success && data.id) {
      activeProposalId = data.id;
      localStorage.setItem("romantic_active_proposal_id", activeProposalId);

      // Update current in-memory state
      const targetEmotion = (emotionChoice === "auto") ? determineEmotion(sender, partner, "auto", getRefreshSeed()) : (EMOTIONS.find(e => e.id === emotionChoice) || currentEmotion);
      applyState(sender, partner, targetEmotion, dynamic, customNote);

      openShareModal(data.id, sender, partner);
      startTrackingProposal(data.id);
    } else {
      fallbackOpenShareModal();
    }
  } catch (err) {
    console.warn("Backend proposal save error, fallback to client URL:", err);
    fallbackOpenShareModal();
  }
}

if (createAndShareBtn) {
  createAndShareBtn.addEventListener("click", handleCreateAndShareProposal);
}

// Share Button on Top Nav
shareBtn.addEventListener("click", () => {
  if (activeProposalId) {
    openShareModal(activeProposalId, currentSender, currentPartner);
  } else {
    handleCreateAndShareProposal();
  }
});

function openShareModal(proposalId, sender, partner) {
  if (!shareModal) return;

  const partnerShort = getFirstName(partner, "Your Love");
  if (sharePartnerLabel) {
    sharePartnerLabel.textContent = `Secret Proposal Link for ${partner}:`;
  }

  const origin = getBackendOrigin();
  const partnerUrl = `${origin}/?p=${proposalId}&view=proposal`;
  const trackerUrl = `${origin}/?p=${proposalId}&view=tracker`;

  if (partnerShareUrl) partnerShareUrl.value = partnerUrl;
  if (senderTrackerUrl) senderTrackerUrl.value = trackerUrl;

  // Configure Quick Sharing
  if (shareWhatsAppBtn) {
    const whatsappText = `I crafted something truly special straight from my heart just for you. Please open this: ${partnerUrl}`;
    shareWhatsAppBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`;
  }
  if (shareTelegramBtn) {
    shareTelegramBtn.href = `https://t.me/share/url?url=${encodeURIComponent(partnerUrl)}&text=${encodeURIComponent("A secret heartfelt proposal for you ❤️")}`;
  }

  shareModal.hidden = false;
}

function fallbackOpenShareModal() {
  const url = new URL(window.location.href);
  url.searchParams.set("from", currentSender);
  url.searchParams.set("to", currentPartner);
  url.searchParams.set("dynamic", currentDynamic);
  if (selectedEmotionChoice && selectedEmotionChoice !== "auto") {
    url.searchParams.set("theme", selectedEmotionChoice);
  }
  url.searchParams.set("view", "proposal");

  const shareableUrl = url.toString();
  if (partnerShareUrl) partnerShareUrl.value = shareableUrl;
  if (shareModal) shareModal.hidden = false;
}

function closeShareModal() {
  if (shareModal) shareModal.hidden = true;
}

if (closeShareModalBtn) closeShareModalBtn.addEventListener("click", closeShareModal);
if (doneShareModalBtn) doneShareModalBtn.addEventListener("click", closeShareModal);
if (shareModalBackdrop) shareModalBackdrop.addEventListener("click", closeShareModal);

// Copy Buttons
async function copyToClipboard(text, btnElement, successLabel) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const tempInput = document.createElement("input");
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
    }
    const originalText = btnElement.textContent;
    btnElement.textContent = successLabel;
    setTimeout(() => { btnElement.textContent = originalText; }, 2000);
    showToast(successLabel);
  } catch (e) {
    showToast("Link: " + text);
  }
}

if (copyPartnerUrlBtn) {
  copyPartnerUrlBtn.addEventListener("click", () => {
    if (partnerShareUrl) copyToClipboard(partnerShareUrl.value, copyPartnerUrlBtn, "✓ Link Copied!");
  });
}

if (copyTrackerUrlBtn) {
  copyTrackerUrlBtn.addEventListener("click", () => {
    if (senderTrackerUrl) copyToClipboard(senderTrackerUrl.value, copyTrackerUrlBtn, "✓ Tracker Copied!");
  });
}

if (nativeShareBtn) {
  nativeShareBtn.addEventListener("click", async () => {
    const url = partnerShareUrl ? partnerShareUrl.value : window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `For ${currentPartner} — Love Proposal`,
          text: `I made this one just for you, my love ❤️`,
          url: url
        });
      } catch (err) {}
    } else {
      copyToClipboard(url, nativeShareBtn, "✓ Copied!");
    }
  });
}

// Start SSE stream and polling fallback for real-time acceptance notification
function startTrackingProposal(proposalId) {
  if (!proposalId) return;

  // Clean up any existing listeners
  if (sseEventSource) {
    sseEventSource.close();
    sseEventSource = null;
  }
  if (proposalPollingTimer) {
    clearInterval(proposalPollingTimer);
    proposalPollingTimer = null;
  }

  // 1. SSE Connection
  if (window.EventSource) {
    try {
      sseEventSource = new EventSource(`${API_BASE_URL}/api/proposals/${proposalId}/events`);
      sseEventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "ACCEPTED" || data.status === "accepted") {
            handleSenderNotificationOfAcceptance(data.proposal || data);
          }
        } catch (e) {}
      };
      sseEventSource.onerror = () => {
        // Fall back to polling if SSE experiences a transient disconnect
      };
    } catch (e) {}
  }

  // 2. Polling Fallback every 3 seconds
  proposalPollingTimer = setInterval(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/proposals/${proposalId}`);
      if (res.ok) {
        const data = await res.json();
        const prop = data.proposal || data;
        if (prop && prop.status === "accepted") {
          handleSenderNotificationOfAcceptance(prop);
        }
      }
    } catch (e) {}
  }, 3000);
}

let hasDismissedSenderAlert = false;
let lastAcceptedProposalData = null;

function handleSenderNotificationOfAcceptance(proposal) {
  lastAcceptedProposalData = proposal;

  // Stop polling once accepted
  if (proposalPollingTimer) {
    clearInterval(proposalPollingTimer);
    proposalPollingTimer = null;
  }
  if (sseEventSource) {
    try { sseEventSource.close(); } catch (_) {}
    sseEventSource = null;
  }

  // Update Tracker UI in modal
  if (radarIndicator) radarIndicator.classList.add("accepted");
  if (trackerStatusTitle) trackerStatusTitle.textContent = "💖 PROPOSAL ACCEPTED! YES!";
  if (trackerStatusDesc) {
    trackerStatusDesc.textContent = `${currentPartner} accepted your proposal on ${new Date(proposal.acceptedAt || Date.now()).toLocaleTimeString()}!`;
  }

  // Update proposal choice buttons immediately
  if (proposalButtonsGroup) proposalButtonsGroup.style.display = "none";
  const partnerShort = getFirstName(currentPartner, "LOVE");
  const senderShort = getFirstName(currentSender, "LOVE");
  if (yesBtn) {
    if (currentDynamic === "girl_to_boy") {
      yesBtn.textContent = `❤️ HE SAID YES! ${partnerShort.toUpperCase()} & ${senderShort.toUpperCase()} FOREVER ❤️`;
    } else {
      yesBtn.textContent = `❤️ SHE SAID YES! ${partnerShort.toUpperCase()} & ${senderShort.toUpperCase()} FOREVER ❤️`;
    }
  }

  // Sound Celebration Fanfare & Confetti
  try {
    initAudio();
    playCelebrationFanfare();
    launchConfettiCelebration();
  } catch (_) {}

  // If user already dismissed the alert in this session, do not reopen
  const propId = (proposal && proposal.id) || activeProposalId;
  if (
    hasDismissedSenderAlert ||
    (propId && (sessionStorage.getItem("romantic_dismissed_alert_" + propId) === "true" || localStorage.getItem("romantic_dismissed_alert_" + propId) === "true"))
  ) {
    return;
  }

  // Show Sender Celebration Alert Overlay
  const alertOverlay = document.getElementById("senderAcceptedAlert") || senderAcceptedAlert;
  if (alertOverlay) {
    if (senderAlertHeading) {
      senderAlertHeading.textContent = currentDynamic === "girl_to_boy" ? "🎉 HE SAID YES! ❤️" : "🎉 SHE SAID YES! ❤️";
    }
    if (senderAlertPartnerName) {
      senderAlertPartnerName.textContent = `${currentPartner} has accepted your proposal!`;
    }
    if (senderAlertTimeBadge) {
      const timeStr = new Date(proposal.acceptedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      senderAlertTimeBadge.textContent = `Accepted at ${timeStr}`;
    }
    if (partnerReplyBubble && partnerReplyQuote) {
      if (proposal.replyNote && proposal.replyNote.trim()) {
        partnerReplyQuote.textContent = `"${proposal.replyNote.trim()}"`;
        partnerReplyBubble.hidden = false;
        partnerReplyBubble.style.display = "block";
      } else {
        partnerReplyBubble.hidden = true;
        partnerReplyBubble.style.display = "none";
      }
    }
    alertOverlay.hidden = false;
    alertOverlay.classList.remove("is-hidden");
    alertOverlay.style.setProperty("display", "flex", "important");
    alertOverlay.style.setProperty("visibility", "visible", "important");
    alertOverlay.style.setProperty("opacity", "1", "important");
    alertOverlay.style.setProperty("pointer-events", "auto", "important");
  }
}

// Function to handle "Close & Celebrate" action reliably on desktop and mobile
function dismissSenderAcceptedAlert(e) {
  if (e) {
    try {
      if (typeof e.stopPropagation === "function") e.stopPropagation();
    } catch (_) {}
  }

  hasDismissedSenderAlert = true;

  const propId = (lastAcceptedProposalData && lastAcceptedProposalData.id) || activeProposalId;
  if (propId) {
    try {
      sessionStorage.setItem("romantic_dismissed_alert_" + propId, "true");
      localStorage.setItem("romantic_dismissed_alert_" + propId, "true");
    } catch (_) {}
  }

  const alertOverlay = document.getElementById("senderAcceptedAlert") || senderAcceptedAlert;
  if (alertOverlay) {
    alertOverlay.classList.add("is-hidden");
    alertOverlay.hidden = true;
    alertOverlay.style.setProperty("display", "none", "important");
    alertOverlay.style.setProperty("visibility", "hidden", "important");
    alertOverlay.style.setProperty("opacity", "0", "important");
    alertOverlay.style.setProperty("pointer-events", "none", "important");
  }

  // Also close share modal if open so view is crystal clear
  if (shareModal) {
    try {
      shareModal.hidden = true;
      shareModal.style.setProperty("display", "none", "important");
    } catch (_) {}
  }

  // Retrieve reply note if available
  const replyNote = (lastAcceptedProposalData && lastAcceptedProposalData.replyNote) ? lastAcceptedProposalData.replyNote : "";

  // Trigger celebration on main page so user sees fireworks, vows & celebration cards
  try {
    triggerCelebrationSequence(replyNote);
  } catch (err) {
    console.warn("Celebration sequence trigger:", err);
  }

  // Extra celebration fanfare & fireworks
  try {
    initAudio();
    playCelebrationFanfare();
    launchConfettiCelebration();
  } catch (_) {}

  // Smooth scroll to celebrate the sacred vows
  try {
    if (successBox && !successBox.hidden) {
      setTimeout(() => {
        successBox.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  } catch (_) {}

  try {
    showToast("🥂 Proposal accepted! Celebrating your eternal love story! ❤️");
  } catch (_) {}
}

// Make globally accessible immediately
window.dismissSenderAcceptedAlert = dismissSenderAcceptedAlert;

if (closeSenderAlertBtn) {
  closeSenderAlertBtn.addEventListener("click", dismissSenderAcceptedAlert);
  closeSenderAlertBtn.addEventListener("touchend", dismissSenderAcceptedAlert);
}

if (dismissSenderAlertXBtn) {
  dismissSenderAlertXBtn.addEventListener("click", dismissSenderAcceptedAlert);
  dismissSenderAlertXBtn.addEventListener("touchend", dismissSenderAcceptedAlert);
}

if (senderAlertBackdrop) {
  senderAlertBackdrop.addEventListener("click", dismissSenderAcceptedAlert);
  senderAlertBackdrop.addEventListener("touchend", dismissSenderAcceptedAlert);
}

if (senderSaveCertificateBtn) {
  const handleSaveCert = (e) => {
    if (e) {
      try {
        if (typeof e.stopPropagation === "function") e.stopPropagation();
      } catch (_) {}
    }
    try {
      initAudio();
      downloadLoveCertificate();
    } catch (_) {}
  };
  senderSaveCertificateBtn.addEventListener("click", handleSaveCert);
  senderSaveCertificateBtn.addEventListener("touchend", handleSaveCert);
}

// ==========================================
// Download Engine (Video, Keepsake, Certificate)
// ==========================================
function openDownloadModal() {
  if (downloadModal) downloadModal.hidden = false;
}

function closeDownloadModal() {
  if (downloadModal) downloadModal.hidden = true;
}

if (downloadModalBtn) downloadModalBtn.addEventListener("click", openDownloadModal);
if (downloadCardBtn) downloadCardBtn.addEventListener("click", openDownloadModal);
if (closeDownloadModalBtn) closeDownloadModalBtn.addEventListener("click", closeDownloadModal);
if (doneDownloadModalBtn) doneDownloadModalBtn.addEventListener("click", closeDownloadModal);
if (downloadModalBackdrop) downloadModalBackdrop.addEventListener("click", closeDownloadModal);

if (recordVideoBtn) {
  recordVideoBtn.addEventListener("click", () => {
    startAnimationVideoRecording();
  });
}

if (startVideoRecordBtn) {
  startVideoRecordBtn.addEventListener("click", () => {
    startAnimationVideoRecording();
  });
}

if (downloadPngCardBtn) {
  downloadPngCardBtn.addEventListener("click", () => {
    downloadKeepsakeImage();
  });
}

if (downloadCertActionBtn) {
  downloadCertActionBtn.addEventListener("click", () => {
    downloadLoveCertificate();
  });
}

if (downloadCertificateBtn) {
  downloadCertificateBtn.addEventListener("click", () => {
    downloadLoveCertificate();
  });
}

// 1. Video Recording using Canvas captureStream & MediaRecorder
async function startAnimationVideoRecording() {
  if (isVideoRecording) return;

  if (!canvas.captureStream) {
    showToast("⚠️ Video recording is not supported in this browser. Downloading HD Keepsake instead!");
    downloadKeepsakeImage();
    return;
  }

  try {
    isVideoRecording = true;
    if (recordProgressBar) recordProgressBar.hidden = false;
    if (recordProgressFill) recordProgressFill.style.width = "0%";
    if (startVideoRecordText) startVideoRecordText.textContent = "Recording Animation... 🎥";
    if (recordVideoBtnLabel) recordVideoBtnLabel.textContent = "Recording...";

    const stream = canvas.captureStream(30);
    const mimeTypes = ["video/webm;codecs=vp9", "video/webm", "video/mp4"];
    let selectedMime = "";
    for (const m of mimeTypes) {
      if (window.MediaRecorder && MediaRecorder.isTypeSupported(m)) {
        selectedMime = m;
        break;
      }
    }

    const options = selectedMime ? { mimeType: selectedMime } : {};
    const mediaRecorder = new MediaRecorder(stream, options);
    const recordedChunks = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: selectedMime || "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const partnerShort = getFirstName(currentPartner, "love");
      const senderShort = getFirstName(currentSender, "love");
      a.download = `${senderShort}-and-${partnerShort}-love-animation.webm`;
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      isVideoRecording = false;
      if (recordProgressBar) recordProgressBar.hidden = true;
      if (startVideoRecordText) startVideoRecordText.textContent = "Record & Save 5s Animation Video";
      if (recordVideoBtnLabel) recordVideoBtnLabel.textContent = "Save Video";
      showToast("🎥 Romantic video downloaded successfully! Cherish it forever ❤️");
    };

    mediaRecorder.start();

    // 5-second countdown & progress bar
    const duration = 5000;
    const interval = 50;
    let elapsed = 0;

    const progressTimer = setInterval(() => {
      elapsed += interval;
      const percent = Math.min(100, Math.round((elapsed / duration) * 100));
      if (recordProgressFill) recordProgressFill.style.width = `${percent}%`;
      if (recordProgressText) {
        const remaining = ((duration - elapsed) / 1000).toFixed(1);
        recordProgressText.textContent = `Capturing romantic frames... ${remaining}s remaining (${percent}%)`;
      }

      if (elapsed >= duration) {
        clearInterval(progressTimer);
        mediaRecorder.stop();
      }
    }, interval);

  } catch (err) {
    console.error("Video recording error:", err);
    isVideoRecording = false;
    if (recordProgressBar) recordProgressBar.hidden = true;
    if (startVideoRecordText) startVideoRecordText.textContent = "Record & Save 5s Animation Video";
    if (recordVideoBtnLabel) recordVideoBtnLabel.textContent = "Save Video";
    showToast("⚠️ Video recording failed. Generating HD Keepsake Card!");
    downloadKeepsakeImage();
  }
}

// 2. HD Keepsake Card (1200x1500)
function downloadKeepsakeImage() {
  const offCanvas = document.createElement("canvas");
  offCanvas.width = 1200;
  offCanvas.height = 1500;
  const oCtx = offCanvas.getContext("2d");

  // Rich Dark Gradient Background
  const grad = oCtx.createRadialGradient(600, 550, 50, 600, 750, 900);
  grad.addColorStop(0, `rgba(${currentEmotion.palette[0]}, 0.25)`);
  grad.addColorStop(0.5, "#0a0714");
  grad.addColorStop(1, "#030207");
  oCtx.fillStyle = grad;
  oCtx.fillRect(0, 0, 1200, 1500);

  // Ornate Gold / Romantic Border
  oCtx.strokeStyle = "rgba(248, 180, 0, 0.4)";
  oCtx.lineWidth = 4;
  oCtx.strokeRect(36, 36, 1128, 1428);

  oCtx.strokeStyle = "rgba(255, 101, 149, 0.5)";
  oCtx.lineWidth = 1.5;
  oCtx.strokeRect(48, 48, 1104, 1404);

  // Corner Accents
  oCtx.font = "28px serif";
  oCtx.fillStyle = "rgba(248, 180, 0, 0.8)";
  oCtx.textAlign = "center";
  oCtx.fillText("✦", 48, 48);
  oCtx.fillText("✦", 1152, 48);
  oCtx.fillText("✦", 48, 1452);
  oCtx.fillText("✦", 1152, 1452);

  // Draw current live heart canvas in upper half
  oCtx.save();
  oCtx.shadowColor = `rgba(${currentEmotion.palette[0]}, 0.8)`;
  oCtx.shadowBlur = 40;
  oCtx.drawImage(canvas, 200, 140, 800, 540);
  oCtx.restore();

  // Typography
  oCtx.textAlign = "center";
  oCtx.fillStyle = "rgba(255, 255, 255, 0.7)";
  oCtx.font = "600 20px -apple-system, BlinkMacSystemFont, sans-serif";
  oCtx.letterSpacing = "3px";
  oCtx.fillText(currentEmotion.badge.toUpperCase(), 600, 750);

  // Couple's Names
  oCtx.fillStyle = "#ffffff";
  oCtx.font = "bold 52px -apple-system, BlinkMacSystemFont, sans-serif";
  oCtx.shadowColor = "rgba(255, 45, 95, 0.6)";
  oCtx.shadowBlur = 20;
  oCtx.fillText(`${currentSender}  ♥  ${currentPartner}`, 600, 825);
  oCtx.shadowBlur = 0;

  // Romantic Vow / Quote
  oCtx.fillStyle = "rgba(255, 215, 140, 0.95)";
  oCtx.font = "italic 26px Georgia, serif";
  const partnerShort = getFirstName(currentPartner, "My Love");
  const quoteText = currentCustomNote ? `"${currentCustomNote}"` : currentEmotion.letter.quote(partnerShort);
  wrapText(oCtx, quoteText, 600, 920, 900, 38);

  // Dynamic Relationship Label
  let dynamicLabel = "Two Hearts Bound for Eternity";
  if (currentDynamic === "girl_to_boy") dynamicLabel = "A Girl's Sacred Proposal to Her Forever King";
  else if (currentDynamic === "soulmates") dynamicLabel = "Soulmates United Across Space and Time";
  oCtx.fillStyle = "rgba(255, 126, 179, 0.85)";
  oCtx.font = "500 22px -apple-system, BlinkMacSystemFont, sans-serif";
  oCtx.fillText(dynamicLabel, 600, 1150);

  // Three Core Promises
  oCtx.fillStyle = "rgba(255, 255, 255, 0.85)";
  oCtx.font = "20px -apple-system, BlinkMacSystemFont, sans-serif";
  currentEmotion.promises.forEach((p, idx) => {
    oCtx.fillText(`${p.icon}  ${p.title}: "${p.detail}"`, 600, 1230 + idx * 45);
  });

  // Date and Seal
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  oCtx.fillStyle = "rgba(255, 255, 255, 0.4)";
  oCtx.font = "16px -apple-system, BlinkMacSystemFont, sans-serif";
  oCtx.fillText(`Eternal Love Universe • Sealed on ${today}`, 600, 1410);

  // Trigger Download
  const a = document.createElement("a");
  const senderShort = getFirstName(currentSender, "love");
  a.download = `love-keepsake-${senderShort}-${partnerShort}.png`;
  a.href = offCanvas.toDataURL("image/png");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast("📸 HD Keepsake Card downloaded successfully!");
}

// 3. Official Love Certificate (1400x1000)
function downloadLoveCertificate() {
  const offCanvas = document.createElement("canvas");
  offCanvas.width = 1400;
  offCanvas.height = 1000;
  const oCtx = offCanvas.getContext("2d");

  // Rich Royal Dark Background
  const grad = oCtx.createRadialGradient(700, 500, 100, 700, 500, 900);
  grad.addColorStop(0, "#1c1126");
  grad.addColorStop(0.6, "#0d0915");
  grad.addColorStop(1, "#040208");
  oCtx.fillStyle = grad;
  oCtx.fillRect(0, 0, 1400, 1000);

  // Double Royal Gold Border
  oCtx.strokeStyle = "rgba(248, 195, 80, 0.85)";
  oCtx.lineWidth = 6;
  oCtx.strokeRect(40, 40, 1320, 920);

  oCtx.strokeStyle = "rgba(255, 230, 150, 0.4)";
  oCtx.lineWidth = 1.5;
  oCtx.strokeRect(55, 55, 1290, 890);

  // Certificate Header
  oCtx.textAlign = "center";
  oCtx.fillStyle = "rgba(248, 195, 80, 0.9)";
  oCtx.font = "bold 22px Georgia, serif";
  oCtx.letterSpacing = "6px";
  oCtx.fillText("ROYAL & ETERNAL PROPOSAL REGISTRY", 700, 125);

  oCtx.fillStyle = "#ffffff";
  oCtx.font = "bold 44px Georgia, serif";
  oCtx.shadowColor = "rgba(248, 195, 80, 0.5)";
  oCtx.shadowBlur = 18;
  oCtx.fillText("CERTIFICATE OF ETERNAL LOVE", 700, 195);
  oCtx.shadowBlur = 0;

  oCtx.fillStyle = "rgba(255, 255, 255, 0.65)";
  oCtx.font = "italic 22px Georgia, serif";
  oCtx.fillText("Be it known across the universe that on this sacred day,", 700, 260);

  // Grand Names
  oCtx.fillStyle = "rgba(255, 101, 149, 1)";
  oCtx.font = "bold 56px -apple-system, BlinkMacSystemFont, sans-serif";
  oCtx.shadowColor = "rgba(255, 45, 95, 0.7)";
  oCtx.shadowBlur = 24;
  oCtx.fillText(`${currentSender}   &   ${currentPartner}`, 700, 360);
  oCtx.shadowBlur = 0;

  // Declaration
  oCtx.fillStyle = "rgba(255, 255, 255, 0.85)";
  oCtx.font = "22px Georgia, serif";
  let vowText = `have pledged their hearts in unconditional devotion, sealing a love written in the stars and destined for eternity.`;
  if (currentDynamic === "girl_to_boy") {
    vowText = `united their hearts as she asked the sacred question, choosing him as her forever protector, partner, and king.`;
  }
  wrapText(oCtx, vowText, 700, 435, 1050, 34);

  // Proposal Question & Sacred Vow
  oCtx.fillStyle = "rgba(248, 195, 80, 0.95)";
  oCtx.font = "italic bold 28px Georgia, serif";
  const partnerShort = getFirstName(currentPartner, "My Love");
  const sacredQuote = currentCustomNote ? `"${currentCustomNote}"` : currentEmotion.letter.quote(partnerShort);
  wrapText(oCtx, sacredQuote, 700, 545, 1050, 40);

  // Wax Seal Graphic in Center Bottom
  oCtx.fillStyle = "rgba(255, 45, 95, 0.85)";
  oCtx.beginPath();
  oCtx.arc(700, 750, 68, 0, Math.PI * 2);
  oCtx.fill();
  oCtx.strokeStyle = "rgba(248, 195, 80, 0.9)";
  oCtx.lineWidth = 3;
  oCtx.stroke();

  oCtx.fillStyle = "#ffffff";
  oCtx.font = "bold 28px sans-serif";
  oCtx.fillText("💍", 700, 745);
  oCtx.font = "bold 12px sans-serif";
  oCtx.letterSpacing = "2px";
  oCtx.fillText("SEALED", 700, 775);

  // Signatures on Left and Right
  oCtx.strokeStyle = "rgba(255, 255, 255, 0.4)";
  oCtx.lineWidth = 1;

  // Left Proposer
  oCtx.beginPath();
  oCtx.moveTo(220, 810);
  oCtx.lineTo(480, 810);
  oCtx.stroke();
  oCtx.fillStyle = "rgba(255, 255, 255, 0.9)";
  oCtx.font = "italic 24px Georgia, serif";
  oCtx.fillText(`${currentSender} ♡`, 350, 795);
  oCtx.fillStyle = "rgba(255, 255, 255, 0.5)";
  oCtx.font = "14px sans-serif";
  oCtx.fillText("PROPOSER & ETERNAL DEVOTION", 350, 835);

  // Right Recipient
  oCtx.beginPath();
  oCtx.moveTo(920, 810);
  oCtx.lineTo(1180, 810);
  oCtx.stroke();
  oCtx.fillStyle = "rgba(255, 255, 255, 0.9)";
  oCtx.font = "italic 24px Georgia, serif";
  oCtx.fillText(`${currentPartner} ♡`, 1050, 795);
  oCtx.fillStyle = "rgba(255, 255, 255, 0.5)";
  oCtx.font = "14px sans-serif";
  oCtx.fillText("BELOVED & SOULMATE", 1050, 835);

  // Date and Verification Stamp
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  oCtx.fillStyle = "rgba(255, 255, 255, 0.4)";
  oCtx.font = "14px sans-serif";
  oCtx.fillText(`Theme: ${currentEmotion.badge} • Registered on ${today}`, 700, 910);

  // Trigger Download
  const a = document.createElement("a");
  const senderShort = getFirstName(currentSender, "love");
  a.download = `official-love-certificate-${senderShort}-${partnerShort}.png`;
  a.href = offCanvas.toDataURL("image/png");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast("📜 Official Love Certificate downloaded successfully!");
}

// Canvas Text Wrapping Helper
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  if (!text) return;
  const words = text.split(" ");
  let line = "";

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

// Window resize listener
window.addEventListener("resize", resize);

// Initialization sequence
async function initApp() {
  const urlParams = new URLSearchParams(window.location.search);
  const paramProposalId = urlParams.get("p");
  const paramView = urlParams.get("view");
  const paramFrom = urlParams.get("from");
  const paramTo = urlParams.get("to");
  const paramTheme = urlParams.get("theme");
  const paramDynamic = urlParams.get("dynamic");

  const storedFrom = localStorage.getItem("romantic_sender");
  const storedPartner = localStorage.getItem("romantic_partner");
  const storedChoice = localStorage.getItem("romantic_emotion_choice");
  const storedDynamic = localStorage.getItem("romantic_dynamic");
  const storedCustomNote = localStorage.getItem("romantic_custom_note");
  const storedMotion = localStorage.getItem("romantic_motion_mode");
  const storedSpeed = localStorage.getItem("romantic_anim_speed");
  const storedDensity = localStorage.getItem("romantic_particle_density");
  const storedTouch = localStorage.getItem("romantic_touch_fx");
  const storedProposalId = localStorage.getItem("romantic_active_proposal_id");

  let sender = paramFrom || storedFrom || "Md. Firoz Kabir";
  let partner = paramTo || storedPartner || "Most. Noushin Islam";
  selectedEmotionChoice = paramTheme || storedChoice || "auto";
  currentDynamic = paramDynamic || storedDynamic || "boy_to_girl";
  currentCustomNote = storedCustomNote || "";

  if (storedMotion && selectMotionMode) {
    currentMotionMode = storedMotion;
    selectMotionMode.value = storedMotion;
  }
  if (storedSpeed && selectAnimSpeed) {
    currentAnimSpeed = parseFloat(storedSpeed) || 1.0;
    selectAnimSpeed.value = storedSpeed;
  }
  if (storedDensity && selectParticleDensity) {
    currentParticleDensity = storedDensity;
    selectParticleDensity.value = storedDensity;
  }
  if (storedTouch && selectTouchFx) {
    currentTouchFx = storedTouch;
    selectTouchFx.value = storedTouch;
  }

  // Handle Shared Proposal Mode (?p=...)
  if (paramProposalId) {
    activeProposalId = paramProposalId;
    try {
      const res = await fetch(`${API_BASE_URL}/api/proposals/${paramProposalId}`);
      if (res.ok) {
        const proposal = await res.json();
        if (proposal) {
          sender = proposal.sender || sender;
          partner = proposal.partner || partner;
          currentDynamic = proposal.dynamic || currentDynamic;
          selectedEmotionChoice = proposal.emotion || selectedEmotionChoice;
          currentCustomNote = proposal.customNote || "";
          if (proposal.motionMode) currentMotionMode = proposal.motionMode;
          if (proposal.animSpeed) currentAnimSpeed = proposal.animSpeed;
          if (proposal.particleDensity) currentParticleDensity = proposal.particleDensity;
          if (proposal.touchFx) currentTouchFx = proposal.touchFx;

          // If view === 'proposal' (Recipient Mode)
          if (paramView === "proposal" || !paramView) {
            isRecipientProposalMode = true;
            document.body.classList.add("proposal-recipient-mode");

            // If already accepted, reflect immediately
            if (proposal.status === "accepted") {
              setTimeout(() => {
                triggerCelebrationSequence(proposal.replyNote);
                if (proposalButtonsGroup) proposalButtonsGroup.style.display = "none";
              }, 500);
            }
          }

          // If sender opened tracker link directly
          if (paramView === "tracker") {
            setTimeout(() => {
              openShareModal(proposal.id, sender, partner);
              startTrackingProposal(proposal.id);
              if (proposal.status === "accepted") {
                handleSenderNotificationOfAcceptance(proposal);
              }
            }, 600);
          }
        }
      }
    } catch (e) {
      console.warn("Could not fetch proposal details from server:", e);
    }
  } else if (storedProposalId && !paramView) {
    // If sender already created an active proposal in their session, track it silently
    activeProposalId = storedProposalId;
    startTrackingProposal(storedProposalId);
  }

  // Seed changes on refresh if auto emotion
  const refreshSeed = getRefreshSeed();
  const emotion = determineEmotion(sender, partner, selectedEmotionChoice, refreshSeed);

  resize();
  applyState(sender, partner, emotion, currentDynamic, currentCustomNote);
}

initApp();

// ==========================================
// Progressive Web App (PWA) & Android Install
// ==========================================
let deferredPrompt = null;
const installPwaBtn = document.getElementById("installPwaBtn");

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js")
      .then((reg) => {
        console.log("Service Worker registered successfully:", reg.scope);
      })
      .catch((err) => {
        console.warn("Service Worker registration failed:", err);
      });
  });
}

window.addEventListener("beforeinstallprompt", (e) => {
  // Prevent default mini-infobar on mobile
  e.preventDefault();
  deferredPrompt = e;
  if (installPwaBtn) {
    installPwaBtn.style.display = "inline-flex";
  }
});

if (installPwaBtn) {
  installPwaBtn.addEventListener("click", async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        showToast("📱 Romantic Universe added to your Android Home Screen!");
      }
      deferredPrompt = null;
      installPwaBtn.style.display = "none";
    } else {
      // Guide user if browser already installed or manual add
      showToast("💡 To install on Android: Tap Chrome menu (⋮) -> 'Add to Home screen'");
    }
  });
}

window.addEventListener("appinstalled", () => {
  deferredPrompt = null;
  if (installPwaBtn) installPwaBtn.style.display = "none";
  showToast("🎉 Android App successfully installed!");
});


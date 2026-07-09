/**
 * Single source of truth for brand + contact details.
 * Tweak anything here and the whole site updates.
 */

export const SITE_URL = "https://thewebstylist.github.io/Nextlevelsite2026";

export const BRAND = {
  name: "Sterling Creations Ai",
  wordmark: { primary: "STERLING", secondary: "CREATIONS", chip: "Ai" },
  tagline: "Next Level Ai Assisted Client Content Creation",
  location: "Pasadena, CA",
};

export const CONTACT = {
  email: "info@sterlingcreations.ai",
  phoneDisplay: "855-WEB-STYLIST",
  phoneNumeric: "855-932-7984",
  phoneHref: "tel:+18559327984",
  emailHref:
    "mailto:info@sterlingcreations.ai?subject=New%20Project%20Inquiry",
};

export const LINKS = {
  site: "https://sterlingcreations.ai",
  motion: "https://sterlingcreations.ai/motion/",
  webStylist: "https://thewebstylist.com",
  instagram: "https://www.instagram.com/thewebstylist/",
  instagramAi: "https://www.instagram.com/sterling_williams/",
  youtube: "https://www.youtube.com/user/thewebstylist",
  behance: "https://www.behance.net/thewebstylist",
  linkedin: "https://www.linkedin.com/in/sterlingwilliams/",
};

/**
 * Optional hero background video.
 * Point this at an mp4 (e.g. the background video from sterlingcreations.ai —
 * copy it into /public/media/hero-bg.mp4 or paste its full URL) and it will
 * play behind the hero. Leave empty to use the built-in animated aurora only.
 */
export const HERO_VIDEO_SRC = "media/hero-bg.mp4";

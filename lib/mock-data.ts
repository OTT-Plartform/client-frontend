// lib/mock-data.ts

export const mockContent = [
  {
    id: "1",
    type: "movie",
    title: "The Last Kingdom",
    thumbnail: "/thumbnails/last-kingdom.jpg",
    isPremium: false,
  },
  {
    id: "2",
    type: "movie",
    title: "Rise of Legends",
    thumbnail: "/thumbnails/rise-legends.jpg",
    isPremium: true,
  },
  {
    id: "3",
    type: "series",
    title: "Zimushaland",
    thumbnail: "/thumbnails/zimushaland.jpg",
    isPremium: true,
    episodes: [
      {
        title: "Episode 1: Welcome to Zimushaland",
        description: "The journey begins in the magical land of Zimushaland.",
      },
      {
        title: "Episode 2: The Rising Conflict",
        description: "Tensions rise as new challenges appear.",
      },
      {
        title: "Episode 3: The Hidden Power",
        description: "A secret power begins to emerge among the heroes.",
      },
    ],
  },
  {
    id: "4",
    type: "series",
    title: "Code Warriors",
    thumbnail: "/thumbnails/code-warriors.jpg",
    isPremium: false,
    episodes: [
      {
        title: "Episode 1: The Call to Code",
        description: "A team of young coders is called to defend the digital realm.",
      },
      {
        title: "Episode 2: Debugging the Enemy",
        description: "The warriors face their first big challenge in the system.",
      },
      {
        title: "Episode 3: Power of Open Source",
        description: "An unexpected ally joins the fight for freedom.",
      },
    ],
  },
  // 🔥 New Content
  {
    id: "9",
    type: "movie",
    title: "Echoes of the Savannah",
    thumbnail: "/thumbnails/echoes-savannah.jpg",
    isPremium: false,
  },
  {
    id: "10",
    type: "series",
    title: "Digital Shadows",
    thumbnail: "/thumbnails/digital-shadows.jpg",
    isPremium: true,
    episodes: [
      {
        title: "Episode 1: Into the Net",
        description: "A hacker discovers a dark world hidden inside the web.",
      },
      {
        title: "Episode 2: Ghost Protocol",
        description: "Anonymity comes with a dangerous price.",
      },
      {
        title: "Episode 3: Breaking Firewalls",
        description: "The ultimate showdown against cyber overlords begins.",
      },
    ],
  },
  {
    id: "11",
    type: "movie",
    title: "Kingdom of Stone",
    thumbnail: "/thumbnails/kingdom-stone.jpg",
    isPremium: true,
  },
  {
    id: "12",
    type: "series",
    title: "The Great Migration",
    thumbnail: "/thumbnails/great-migration.jpg",
    isPremium: false,
    episodes: [
      {
        title: "Episode 1: The Journey Begins",
        description: "Animals set off on their epic migration across Africa.",
      },
      {
        title: "Episode 2: Predators and Prey",
        description: "Survival becomes a game of wits and instincts.",
      },
      {
        title: "Episode 3: The Final Crossing",
        description: "The herd faces the deadliest challenge at the river crossing.",
      },
    ],
  },
];

export const mockTrending = [
  {
    id: "5",
    type: "movie",
    title: "Shadows of Time",
    thumbnail: "/thumbnails/shadows-time.jpg",
    isPremium: false,
  },
  {
    id: "6",
    type: "series",
    title: "Future Chronicles",
    thumbnail: "/thumbnails/future-chronicles.jpg",
    isPremium: true,
    episodes: [
      {
        title: "Episode 1: Tomorrow Begins",
        description: "The world awakens to new futuristic possibilities.",
      },
      {
        title: "Episode 2: Breaking the Boundaries",
        description: "Humans test the limits of science and technology.",
      },
      {
        title: "Episode 3: The Unknown Beyond",
        description: "The team faces unexpected consequences of their inventions.",
      },
    ],
  },
  // 🔥 Extra trending
  {
    id: "13",
    type: "movie",
    title: "Blood Moon Rising",
    thumbnail: "/thumbnails/blood-moon.jpg",
    isPremium: true,
  },
  {
    id: "14",
    type: "series",
    title: "Warriors of Tomorrow",
    thumbnail: "/thumbnails/warriors-tomorrow.jpg",
    isPremium: false,
    episodes: [
      {
        title: "Episode 1: Awakening",
        description: "A group of rebels rise against futuristic oppressors.",
      },
      {
        title: "Episode 2: Fire and Steel",
        description: "The rebels clash with powerful AI-driven armies.",
      },
      {
        title: "Episode 3: The Last Stand",
        description: "Humanity’s fate lies in the balance.",
      },
    ],
  },
];

export const mockRecommended = [
  {
    id: "7",
    type: "series",
    title: "Legends of Africa",
    thumbnail: "/thumbnails/legends-africa.jpg",
    isPremium: false,
    episodes: [
      {
        title: "Episode 1: Ancient Origins",
        description: "Uncovering the hidden history of African heroes.",
      },
      {
        title: "Episode 2: Kingdoms Rising",
        description: "The great civilizations of Africa rise and prosper.",
      },
      {
        title: "Episode 3: Legacy of Warriors",
        description: "Stories of courage and resilience echo through time.",
      },
    ],
  },
  {
    id: "8",
    type: "movie",
    title: "Silent Horizon",
    thumbnail: "/thumbnails/silent-horizon.jpg",
    isPremium: true,
  },
  // 🔥 Extra recommended
  {
    id: "15",
    type: "series",
    title: "Desert Mysteries",
    thumbnail: "/thumbnails/desert-mysteries.jpg",
    isPremium: true,
    episodes: [
      {
        title: "Episode 1: Sands of Time",
        description: "Explorers uncover secrets buried deep beneath the desert.",
      },
      {
        title: "Episode 2: Oasis of Hope",
        description: "A forgotten tribe holds the key to survival.",
      },
      {
        title: "Episode 3: Storm of Destiny",
        description: "The desert unleashes its fury in an epic climax.",
      },
    ],
  },
  {
    id: "16",
    type: "movie",
    title: "Crimson River",
    thumbnail: "/thumbnails/crimson-river.jpg",
    isPremium: false,
  },
];

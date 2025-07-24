// African Hero Content with real images and YouTube videos
export const mockHeroContent = [
  {
    id: "hero-1",
    title: "Duke & Slay",
    description:
      "A gripping Zimbabwean drama series following two friends navigating life, love, and ambition in modern Harare. Experience authentic African storytelling with compelling characters and real-life challenges.",
    backdrop:
      "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    type: "series" as const,
    genre: "Drama",
    genres: ["Drama", "Romance", "Comedy"],
    year: 2023,
    rating: "PG-13",
    duration: "45m per episode",
    match: 98,
    episodes: 12,
    seasons: 2,
    country: "Zimbabwe",
    language: "English/Shona",
    cast: ["Tinashe Mutarisi", "Sharon Mahachi", "Blessing Chimhowa"],
    director: "Rumbi Katedza",
    isAfrican: true,
    isPremium: true,
    youtubeId: "dQw4w9WgXcQ", // Rick Roll as placeholder
    isYouTube: false,
  },
  {
    id: "hero-2",
    title: "The Jar Prayer Show",
    description:
      "An inspirational African talk show that brings together faith, culture, and contemporary issues. Host Pastor Jar delivers powerful messages while addressing real-life challenges facing African communities.",
    backdrop:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    type: "series" as const,
    genre: "Talk Show",
    genres: ["Talk Show", "Spiritual", "Educational"],
    year: 2023,
    rating: "G",
    duration: "60m per episode",
    match: 95,
    episodes: 24,
    seasons: 1,
    country: "South Africa",
    language: "English/Zulu",
    cast: ["Pastor Jar Mthembu"],
    director: "Nomsa Philiso",
    isAfrican: true,
    isPremium: false,
    youtubeId: "jNQXAC9IVRw", // Me at the zoo - first YouTube video
    isYouTube: true,
  },
  {
    id: "hero-3",
    title: "The Tinashe Mugabe DNA Show",
    description:
      "Zimbabwe's premier entertainment talk show featuring celebrity interviews, music performances, and cultural discussions. Tinashe Mugabe brings you closer to your favorite African stars.",
    backdrop:
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    type: "series" as const,
    genre: "Talk Show",
    genres: ["Talk Show", "Entertainment", "Music"],
    year: 2023,
    rating: "PG",
    duration: "90m per episode",
    match: 92,
    episodes: 20,
    seasons: 3,
    country: "Zimbabwe",
    language: "English/Shona",
    cast: ["Tinashe Mugabe"],
    director: "Chipo Muchegwa",
    isAfrican: true,
    isPremium: false,
    youtubeId: "9bZkp7q19f0", // Gangnam Style
    isYouTube: true,
  },
]

// African Movies with real images
export const mockMovies = [
  {
    id: "movie-1",
    title: "Hearts of Gold",
    description:
      "A powerful Zimbabwean romantic drama about a young woman who must choose between tradition and modernity when she falls in love with a man from a different tribe.",
    thumbnail:
      "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    backdrop:
      "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    type: "movie" as const,
    genre: "Romance",
    genres: ["Romance", "Drama", "Cultural"],
    year: 2023,
    rating: "PG-13",
    match: 94,
    duration: "118m",
    country: "Zimbabwe",
    language: "English/Shona/Ndebele",
    cast: ["Chipo Chung", "Tongayi Chirisa", "Danai Gurira"],
    director: "Tsitsi Dangarembga",
    isAfrican: true,
    isPremium: true,
    youtubeId: "YQHsXMglC9A", // Adele - Hello
    isYouTube: false,
    plot: "In the heart of Zimbabwe, Chipo, a modern university graduate, returns to her rural village to find her family has arranged her marriage to a wealthy businessman. However, she has fallen in love with Tafadzwa, a teacher from a rival tribe. As cultural tensions rise and family honor is at stake, Chipo must navigate between her heart's desire and her family's expectations, ultimately discovering that love transcends all boundaries.",
    awards: ["Best African Film - ZIFF 2023", "Best Actress - African Movie Awards"],
    boxOffice: "$2.5M",
    budget: "$800K",
  },
  {
    id: "movie-2",
    title: "The Last Warrior",
    description:
      "An epic action-adventure set in pre-colonial Zimbabwe, following a young warrior's quest to unite the tribes against an ancient evil threatening their land.",
    thumbnail:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    backdrop:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    type: "movie" as const,
    genre: "Action",
    genres: ["Action", "Adventure", "Historical"],
    year: 2022,
    rating: "PG-13",
    match: 91,
    duration: "135m",
    country: "Zimbabwe",
    language: "English/Shona",
    cast: ["Blessing Chimhowa", "Vimbai Zimuto", "Charles Bukeko"],
    director: "Joe Njagu",
    isAfrican: true,
    isPremium: false,
    youtubeId: "kJQP7kiw5Fk", // Despacito
    isYouTube: true,
    plot: "Set in 15th century Zimbabwe, young warrior Chaminuka discovers an ancient prophecy that speaks of a great darkness threatening all the tribes. Armed with mystical powers and traditional weapons, he must journey across the land to unite warring tribes and gather legendary artifacts to defeat an evil sorcerer who seeks to enslave all of Africa.",
    awards: ["Best Visual Effects - African Cinema Awards", "Best Action Film - ZIFF"],
    boxOffice: "$3.2M",
    budget: "$1.2M",
  },
  {
    id: "movie-3",
    title: "Bulawayo Blues",
    description:
      "A musical drama following a young musician's journey from the streets of Bulawayo to international stardom, showcasing Zimbabwe's rich musical heritage.",
    thumbnail:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    backdrop:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    type: "movie" as const,
    genre: "Musical",
    genres: ["Musical", "Drama", "Biography"],
    year: 2023,
    rating: "PG",
    match: 89,
    duration: "125m",
    country: "Zimbabwe",
    language: "English/Ndebele",
    cast: ["Prudence Katomeni", "Jah Prayzah", "Winky D"],
    director: "Rumbi Katedza",
    isAfrican: true,
    isPremium: true,
    youtubeId: "fJ9rUzIMcZQ", // Bohemian Rhapsody
    isYouTube: false,
    plot: "Sipho, a talented street musician from Bulawayo's townships, dreams of sharing Zimbabwe's music with the world. Despite facing poverty and family opposition, he forms a band with fellow musicians and begins a journey that takes him from local venues to international stages, all while staying true to his African roots and cultural identity.",
    awards: ["Best Original Music - African Film Festival", "Audience Choice Award - ZIFF"],
    boxOffice: "$1.8M",
    budget: "$600K",
  },
  {
    id: "movie-4",
    title: "Ubuntu: The Spirit of Unity",
    description:
      "A heartwarming documentary exploring the African philosophy of Ubuntu and how it shapes communities across the continent.",
    thumbnail:
      "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    backdrop:
      "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    type: "movie" as const,
    genre: "Documentary",
    genres: ["Documentary", "Cultural", "Educational"],
    year: 2023,
    rating: "G",
    match: 87,
    duration: "95m",
    country: "South Africa",
    language: "English/Zulu/Xhosa",
    cast: ["Various Community Leaders"],
    director: "Nomsa Philiso",
    isAfrican: true,
    isPremium: false,
    youtubeId: "L_jWHffIx5E", // Smells Like Teen Spirit
    isYouTube: true,
    plot: "This documentary explores the profound African philosophy of Ubuntu - 'I am because we are' - through the stories of ordinary people doing extraordinary things in their communities across Africa.",
    awards: ["Best Documentary - African Film Festival"],
    boxOffice: "$1.2M",
    budget: "$400K",
  },
]

// African Series with real images
export const mockSeries = [
  {
    id: "series-1",
    title: "Duke & Slay",
    description:
      "A gripping Zimbabwean drama series following two friends navigating life, love, and ambition in modern Harare. Experience authentic African storytelling with compelling characters.",
    thumbnail:
      "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    backdrop:
      "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    type: "series" as const,
    genre: "Drama",
    genres: ["Drama", "Romance", "Comedy"],
    year: 2023,
    rating: "PG-13",
    match: 98,
    episodes: 12,
    seasons: 2,
    country: "Zimbabwe",
    language: "English/Shona",
    cast: ["Tinashe Mutarisi", "Sharon Mahachi", "Blessing Chimhowa", "Vimbai Zimuto"],
    director: "Rumbi Katedza",
    isAfrican: true,
    isPremium: true,
    youtubeId: "dQw4w9WgXcQ",
    isYouTube: false,
    plot: "Duke and Slay are childhood friends from different backgrounds in Harare. Duke comes from a wealthy family but struggles with expectations, while Slay grew up in the townships with big dreams. As they navigate their twenties, they face challenges in love, career, and friendship while staying true to their Zimbabwean identity.",
    awards: ["Best Drama Series - ZIFF 2023", "Best Actor - African TV Awards"],
    seasonsData: [
      {
        seasonNumber: 1,
        episodes: 8,
        year: 2023,
        description: "Duke and Slay's friendship is tested as they pursue different paths in life.",
        episodes_list: [
          {
            episodeNumber: 1,
            title: "New Beginnings",
            duration: "45m",
            description: "Duke returns from university while Slay starts his music career.",
          },
          {
            episodeNumber: 2,
            title: "Different Worlds",
            duration: "42m",
            description: "The friends realize how much they've changed during their time apart.",
          },
          {
            episodeNumber: 3,
            title: "Love Triangles",
            duration: "44m",
            description: "Both friends fall for the same girl, testing their loyalty.",
          },
          {
            episodeNumber: 4,
            title: "Family Pressure",
            duration: "46m",
            description: "Duke faces pressure to join the family business.",
          },
          {
            episodeNumber: 5,
            title: "Street Dreams",
            duration: "43m",
            description: "Slay gets his first big break in the music industry.",
          },
          {
            episodeNumber: 6,
            title: "Betrayal",
            duration: "45m",
            description: "A misunderstanding threatens to end their friendship forever.",
          },
          {
            episodeNumber: 7,
            title: "Redemption",
            duration: "44m",
            description: "The friends must work together to solve a crisis.",
          },
          {
            episodeNumber: 8,
            title: "New Chapter",
            duration: "47m",
            description: "Season finale sets up new challenges for season 2.",
          },
        ],
      },
      {
        seasonNumber: 2,
        episodes: 4,
        year: 2024,
        description: "Duke and Slay face new challenges as their careers take off.",
        episodes_list: [
          {
            episodeNumber: 1,
            title: "Rising Stars",
            duration: "45m",
            description: "Both friends achieve success but at what cost?",
          },
          {
            episodeNumber: 2,
            title: "Old Wounds",
            duration: "43m",
            description: "Past mistakes come back to haunt them.",
          },
          {
            episodeNumber: 3,
            title: "Crossroads",
            duration: "46m",
            description: "Major decisions must be made about their futures.",
          },
          {
            episodeNumber: 4,
            title: "Brothers Forever",
            duration: "48m",
            description: "The season finale tests their bond like never before.",
          },
        ],
      },
    ],
  },
  {
    id: "series-2",
    title: "The Jar Prayer Show",
    description:
      "An inspirational African talk show that brings together faith, culture, and contemporary issues. Host Pastor Jar delivers powerful messages while addressing real-life challenges.",
    thumbnail:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    backdrop:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    type: "series" as const,
    genre: "Talk Show",
    genres: ["Talk Show", "Spiritual", "Educational"],
    year: 2023,
    rating: "G",
    match: 95,
    episodes: 24,
    seasons: 1,
    country: "South Africa",
    language: "English/Zulu",
    cast: ["Pastor Jar Mthembu", "Grace Msomi", "Thabo Ndlovu"],
    director: "Nomsa Philiso",
    isAfrican: true,
    isPremium: false,
    youtubeId: "jNQXAC9IVRw",
    isYouTube: true,
    plot: "Pastor Jar Mthembu hosts this groundbreaking talk show that combines spiritual guidance with practical life advice. Each episode features real people sharing their stories, celebrity guests discussing their faith journey, and powerful prayer sessions that have touched millions across Africa.",
    awards: ["Best Talk Show - South African TV Awards", "People's Choice Award - African Broadcasting"],
    seasonsData: [
      {
        seasonNumber: 1,
        episodes: 24,
        year: 2023,
        description: "The inaugural season that took Africa by storm with its unique blend of faith and entertainment.",
        episodes_list: [
          {
            episodeNumber: 1,
            title: "Faith Over Fear",
            duration: "60m",
            description: "Pastor Jar discusses overcoming fear through faith with special guest Nomcebo Zikode.",
          },
          {
            episodeNumber: 2,
            title: "Healing Hearts",
            duration: "58m",
            description: "A powerful episode about forgiveness and healing relationships.",
          },
          {
            episodeNumber: 3,
            title: "Youth and Purpose",
            duration: "62m",
            description: "Young African leaders share their stories of finding purpose.",
          },
          {
            episodeNumber: 4,
            title: "Marriage Matters",
            duration: "59m",
            description: "Relationship advice and testimonies from married couples.",
          },
          {
            episodeNumber: 5,
            title: "Financial Freedom",
            duration: "61m",
            description: "Biblical principles for financial success and stewardship.",
          },
        ],
      },
    ],
  },
  {
    id: "series-3",
    title: "Ollar Podcast",
    description:
      "Zimbabwe's most popular podcast featuring candid conversations about African culture, politics, entertainment, and social issues. Host Ollar brings unfiltered discussions that resonate with young Africans.",
    thumbnail:
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    backdrop:
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    type: "podcast" as const,
    genre: "Talk Show",
    genres: ["Talk Show", "Comedy", "Social Commentary"],
    year: 2022,
    rating: "PG-13",
    match: 96,
    episodes: 156,
    seasons: 3,
    country: "Zimbabwe",
    language: "English/Shona",
    cast: ["Ollar Maposa", "Various Guests"],
    director: "Self-Produced",
    isAfrican: true,
    isPremium: false,
    youtubeId: "9bZkp7q19f0",
    isYouTube: true,
    plot: "Ollar Maposa brings raw, unfiltered conversations about life in Zimbabwe and Africa. From celebrity interviews to social commentary, this podcast has become the voice of young Africans seeking authentic content that speaks to their experiences.",
    awards: ["Best Podcast - Zimbabwe Media Awards", "People's Choice - African Podcast Awards"],
    seasonsData: [
      {
        seasonNumber: 1,
        episodes: 52,
        year: 2022,
        description: "The groundbreaking first season that established Ollar as Zimbabwe's podcast king.",
        episodes_list: [
          {
            episodeNumber: 1,
            title: "Welcome to the Ollar Experience",
            duration: "45m",
            description: "Ollar introduces his vision for authentic African conversations.",
          },
          {
            episodeNumber: 2,
            title: "Zim Hip Hop with Holy Ten",
            duration: "67m",
            description: "Deep dive into Zimbabwe's hip hop scene with rapper Holy Ten.",
          },
          {
            episodeNumber: 3,
            title: "Dating in Harare",
            duration: "52m",
            description: "Hilarious and honest discussion about modern dating in Zimbabwe.",
          },
          {
            episodeNumber: 4,
            title: "Diaspora Dreams",
            duration: "58m",
            description: "Conversations with Zimbabweans living abroad.",
          },
          {
            episodeNumber: 5,
            title: "Social Media vs Reality",
            duration: "49m",
            description: "The impact of social media on African youth.",
          },
        ],
      },
    ],
  },
  {
    id: "series-4",
    title: "African Tech Innovators",
    description:
      "A documentary series showcasing the brilliant minds behind Africa's tech revolution, from fintech to renewable energy solutions.",
    thumbnail:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    backdrop:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    type: "series" as const,
    genre: "Documentary",
    genres: ["Documentary", "Technology", "Educational"],
    year: 2023,
    rating: "G",
    match: 85,
    episodes: 10,
    seasons: 1,
    country: "Kenya",
    language: "English/Swahili",
    cast: ["Various Tech Entrepreneurs"],
    director: "Wanjiku Mwangi",
    isAfrican: true,
    isPremium: false,
    youtubeId: "kJQP7kiw5Fk",
    isYouTube: true,
    plot: "From mobile money pioneers in Kenya to solar energy innovators in Ghana, this series celebrates the African entrepreneurs who are solving local problems with global impact.",
    awards: ["Best Documentary Series - African Tech Awards"],
    seasonsData: [
      {
        seasonNumber: 1,
        episodes: 10,
        year: 2023,
        description: "The inaugural season highlighting Africa's tech revolution.",
        episodes_list: [
          {
            episodeNumber: 1,
            title: "The M-Pesa Revolution",
            duration: "45m",
            description: "How Kenya revolutionized mobile money and changed the world.",
          },
          {
            episodeNumber: 2,
            title: "Solar Solutions",
            duration: "42m",
            description: "Bringing clean energy to rural communities across Africa.",
          },
        ],
      },
    ],
  },
]

// Trending content (mix of free and premium)
export const mockTrending = [
  ...mockHeroContent,
  {
    id: "trending-1",
    title: "African Wildlife Chronicles",
    description:
      "A breathtaking nature documentary series showcasing Africa's incredible wildlife and conservation efforts.",
    thumbnail:
      "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    type: "series" as const,
    genre: "Documentary",
    genres: ["Documentary", "Nature", "Wildlife"],
    year: 2023,
    rating: "G",
    match: 92,
    episodes: 8,
    seasons: 1,
    country: "Kenya",
    language: "English",
    isAfrican: true,
    isPremium: false,
    youtubeId: "YQHsXMglC9A",
    isYouTube: true,
  },
]

// Recommended content (mix of free and premium)
export const mockRecommended = [
  ...mockMovies,
  {
    id: "recommended-1",
    title: "African Voices",
    description: "A documentary series showcasing inspiring African stories and achievements across the continent.",
    thumbnail:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    type: "series" as const,
    genre: "Documentary",
    genres: ["Documentary", "Educational", "Cultural"],
    year: 2023,
    rating: "G",
    match: 88,
    episodes: 15,
    seasons: 1,
    country: "Pan-African",
    language: "English/Various",
    isAfrican: true,
    isPremium: false,
    youtubeId: "fJ9rUzIMcZQ",
    isYouTube: true,
  },
]

// All content combined
export const mockContent = [...mockTrending, ...mockRecommended, ...mockSeries]

import { Listing, Message, UserProfile } from './types';

export const initialUserProfile: UserProfile = {
  name: 'أحمد بن علي',
  email: 'ahmed.benali@daro.dz',
  phone: '0550 12 34 56',
  joinedDate: 'ماي 2024',
  bio: 'عاشق للسفر واستكشاف جمال الجزائر من شاليهات جرجرة إلى شواطئ جيجل ورمال صحرائنا الخلابة.',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  verified: true,
  wilaya: 'الجزائر العاصمة',
};

export const initialMessages: Message[] = [
  {
    id: 'm1',
    senderName: 'ياسين - مضيف شاليه تيكجدا',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    lastMessage: 'مرحباً أحمد، الشاليه جاهز لاستقبالكم في التاريخ المحدد. تفضل بالاتصال عند وصولك البهو.',
    time: '19:42',
    unread: true,
    conversation: [
      {
        id: 'msg1_1',
        sender: 'user',
        text: 'السلام عليكم أخي ياسين، هل التدفئة المركزية تعمل بشكل جيد في الشاليه؟ الجو بارد جداً هذه الأيام في تيكجدا.',
        time: '16:15',
      },
      {
        id: 'msg1_2',
        sender: 'host',
        text: 'وعليكم السلام ورحمة الله! نعم بكل تأكيد أخي أحمد، التدفئة المركزية تعمل وموقد الحطب التقليدي جاهز ومملوء بحطب البلوط الطبيعي لدفء رائع وسهرة مميزة.',
        time: '16:30',
      },
      {
        id: 'msg1_3',
        sender: 'user',
        text: 'رائع جداً! شكراً جزيلاً لك. سنصل إن شاء الله حوالي الساعة الرابعة مساءً.',
        time: '17:00',
      },
      {
        id: 'msg1_4',
        sender: 'host',
        text: 'مرحباً أحمد، الشاليه جاهز لاستقبالكم في التاريخ المحدد. تفضل بالاتصال عند وصولك البهو.',
        time: '19:42',
      },
    ],
  },
  {
    id: 'm2',
    senderName: 'فاطمة - فيلا زرالدة بمسبح خلفي',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    lastMessage: 'لقد استلمنا تأكيد حجز المسبح والفيلا ليوم الجمعة. نرجو احترام قواعد الهدوء.',
    time: 'أمس',
    unread: false,
    conversation: [
      {
        id: 'msg2_1',
        sender: 'user',
        text: 'مرحباً فاطمة، هل المسبح خاص ومحجوب تماماً عن الجيران؟',
        time: '10:00',
      },
      {
        id: 'msg2_2',
        sender: 'host',
        text: 'أهلاً بك. نعم، المسبح محمي بأسوار عالية وأشجار كثيفة توفر خصوصية تامة ومطلقة 100% للعائلات.',
        time: '10:12',
      },
      {
        id: 'msg2_3',
        sender: 'user',
        text: 'ممتاز، حجزنا الفيلا ليوم الجمعة كهدية عائلية.',
        time: '11:00',
      },
      {
        id: 'msg2_4',
        sender: 'host',
        text: 'لقد استلمنا تأكيد حجز المسبح والفيلا ليوم الجمعة. نرجو احترام قواعد الهدوء.',
        time: '11:30',
      },
    ],
  },
];

export const initialListings: Listing[] = [
  // 1. Recently Listed (المعروضة مؤخراً)
  {
    id: 'recently_1',
    category: 'recently_listed',
    title: {
      ar: 'شقة بنتهاوس فاخرة بإطلالة كاملة على خليج وهران',
      fr: 'Appartement Penthouse Luxueux Vue sur la Baie d’Oran',
      en: 'Luxury Penthouse Apartment with Oran Bay View',
      kab: 'ⴰⵅⴰⵎ ⵏ Luxury ⵎⴻⵍ-ⴷ ⵜⴰⴼⵜⵉⵙⵜ ⵏ ⵡⴻⵀⵔⴰⵏ'
    },
    description: {
      ar: 'شقة بنتهاوس عصرية مجهزة بأحدث الديكورات تقع في ناطحة سحاب حديثة في جبهة البحر بوهران. تحتوي على شرفة واسعة مطلة على البحر الأبيض المتوسط بأكمله وقلعة سانتا كروز الرائعة. مطبخ متكامل وتكييف مركزي ممتاز وتأمين على مدار الساعة.',
      fr: 'Spacieux penthouse moderne doté d’équipements haut de gamme situé sur le front de mer d’Oran. Terrasse panoramique incroyable sur la mer et le fort de Santa Cruz. Cuisine équipée, climatisation centrale et parking privé surveillé 24h/24.',
      en: 'Spacious and modern penthouse featuring upscale amenities located on the beautiful seafront of Oran. Incredible panoramic terrace overlooking the sea and the historical Santa Cruz fort. Fully equipped kitchen, central AC, and 24/7 security.',
      kab: 'ⴰⵅⴰⵎ ⴰⵎⴰⵢⵏⵓⵜ ⵖⴻⴼ ⵜⵉⴼⵜⵉⵙⵉⵏ ⵏ ⵡⴻⵀⵔⴰⵏ, ⵜⴰⴱⴻⵔⵏⴰ ⵜⴰⵎⴻⵇⵔⴰⵏⵜ, ⵍⵍⴰⵏⵜ ⵎⴰⵕⵕⴰ ⵜⵉⵖⴰⵡⵙⵉⵡⵉⵏ ⵏ ⵜⵓⴷⴻⵔⵜ.'
    },
    location: {
      ar: 'جبهة البحر، وهران',
      fr: 'Front de Mer, Oran',
      en: 'Seafront, Oran',
      kab: 'Front de Mer, ⵡⴻⵀⵔⴰⵏ'
    },
    wilaya: 'Oran',
    pricePerNight: 16500,
    rating: 4.88,
    reviewsCount: 12,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'كريم الموشي',
    hostImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    hostRating: 4.9,
    beds: 3,
    bathrooms: 2,
    guests: 6,
    features: {
      ar: ['إطلالة على البحر', 'واي فاي فائق السرعة', 'تكييف مركزي', 'شرفة بانورامية', 'موقف محمي داخل العمارة'],
      fr: ['Vue sur mer', 'Internet haut débit', 'Climatisation centrale', 'Terrasse panoramique', 'Parking sécurisé'],
      en: ['Sea view', 'High-speed Wi-Fi', 'Central air conditioning', 'Panoramic balcony', 'Secure parking gar'],
      kab: ['ⴰⵥⴻⵖ ⵖⴻⵔ ⵢⵉⵍ', 'Internet ⵉⵛⴻⵔⵔⴻⴷ', 'ⵜⴰⵚⴻⵎⵎⵓⴷⵜ ⵜⴰⵏⴻⵎⵎⴰⵙⵜ', 'ⵜⴰⴱⴻⵔⵏⴰ', 'ⴰⵎⴽⴰၼ် ⵏ ⵓⴽⴰⵔⵔⵓ']
    },
    reviews: [
      {
        id: 'r1_1',
        userName: 'سامي مراد',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
        rating: 5,
        date: '2026-05-12',
        comment: {
          ar: 'الإطلالة هنا لا تصدق! شرب القهوة في الصباح أمام بحر الباهية وهران هو أفضل تجربة عشتها في حياتي. صاحب الشقة محترم للغاية ومتعاون.',
          fr: 'Une vue exceptionnelle sur la baie d’Oran ! Le penthouse est propre, bien agencé et extrêmement confortable. Accueil chaleureux de Karim.',
          en: 'An unforgettable stay! Waking up to the panoramic view of Bahia was incredible. Karim was exceptionally welcoming and attentive.',
          kab: 'ⵜⴰⵣⴻⴳⵣⴰ ⵏ ⵢⵉⵍ ⵟⵟⴰⵇ ⵜⴻⵚⴱⴻⵃ ! ⴰⵅⴰⵎ ⵢⴻⵚⴼⴰ, ⵢⴻⵍⵀⴰ, ⴽⴰⵔⵉⵎ ⴷ ⴰⵎⴷⴰⵏ ⵢⴻⵍⵀⴰⵏ ⴰⵟⴰⵙ.'
        }
      },
      {
        id: 'r1_2',
        userName: 'مريم الجيلالي',
        userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80',
        rating: 5,
        date: '2026-05-24',
        comment: {
          ar: 'شقة ممتازة وراقية جداً، هدوء تام وقريبة من كل المطاعم السياحية في وهران. نوصي بها العائلات بشدة.',
          fr: 'Appartement propre et chic dans un quartier animé d’Oran. Très calme et sécurisé. Parfait pour les vacances en famille.',
          en: 'Elegant, modern apartment in a thriving part of Oran. Very quiet and incredibly secure. Highly recommended for family getaways.',
          kab: 'ⴰⵅⴰَم ⴷ ⵓⵛⴱⵉⵃ ⴷⴻⴳ ⵡⴻⵀⵔⴰⵏ. ⵢⴻⵚⴼⴰ, ⵢⴻⵍⵀⴰ ⵉ ⵜⵡⴰⵛⵓⵍⵉⵏ.'
        }
      }
    ]
  },
  {
    id: 'recently_2',
    category: 'recently_listed',
    title: {
      ar: 'منزل أثري تم ترميمه بعناية في قلب قصبة الجزائر العتيقة',
      fr: 'Maison Traditionnelle Rénovée au Coeur de la Casbah d’Alger',
      en: 'Restored Heritage Riad in the Heart of Algiers Casbah',
      kab: 'ⴰⵅⴰⵎ ⴰⵇⴱⵓⵔ ⵉⵜⵜⵓⵙⴻⴳⵎⴻⵏ ⴷⴻⴳ ⵓⵍ ⵏ ⵜⵇⴰⵚⴱⴰⵜ'
    },
    description: {
      ar: 'جرب العيش الحقيقي داخل أحد بيوت القصبة التاريخية. منزل عائلي أثري (وسط الدار) به فناء مفتوح مبني بالمرمر والرخام التقليدي ومزين ببلاط الزليج الأصيل. إطلالة علوية خلابة على البحر الأبيض المتوسط والأسطح المجاورة، على بعد خطوات من المساجد التاريخية والأسواق التقليدية.',
      fr: 'Vivez l’histoire d’Alger dans une superbe maison typique de la Casbah avec patio traditionnel en marbre et faïence zellige. Terrasse supérieure donnant sur la mer et les toits historiques d’El Bahdja, authentique et dépaysant.',
      en: 'Immerse yourself in history within a stunning traditional Casbah home, complete with an open marble patio and authentic zellige tiles. Upper terrace offers breathtaking views of the sea and old Algiers rooftops.',
      kab: 'ⴷⴷⴻⵔ ⵜⵓⴷⴻⵔⵜ ⵏ ⵣⵉⴽ ⴷⴻⴳ ⵓⵅⴰⵎ ⵏ ⵜⵇⴰⵚⴱⴰⵜ ⵙ ⵓⵙⴻⴳⵎⵉ ⵏ ⵣⴻⵍⵍⵉⵊ, ⵜⴰⴱⴻⵔⵏⴰ ⵖⴻⵔ ⵢⵉⵍ.'
    },
    location: {
      ar: 'قصبة الجزائر، العاصمة',
      fr: 'Casbah, Alger la Blanche',
      en: 'The Casbah, Algiers',
      kab: 'ⵜⴰⵇⴰⵚⴱⴰⵜ, ⵍⴻⵣⵣⴰⵢⴻⵔ'
    },
    wilaya: 'Alger',
    pricePerNight: 9500,
    rating: 4.95,
    reviewsCount: 8,
    images: [
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1621217277153-611099ec1c76?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'عمي مصطفى',
    hostImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
    beds: 4,
    bathrooms: 1,
    guests: 5,
    features: {
      ar: ['فناء داخلي مفتوح', 'تصميم معماري عثماني عتيق', 'إطلالة علوية على الميناء', 'شاي جزائري ترحبي مجاني', 'دليل جولات سياحية'],
      fr: ['Patio intérieur en Zellige', 'Architecture Ottomane', 'Vue sur le port d’Alger', 'Thé traditionnel offert', 'Guide Casbah certifié'],
      en: ['Zellige inside patio', 'Ottoman classic architecture', 'Port of Algiers view', 'Complimentary mint tea', 'Certified local guide'],
      kab: ['Patio ⵏ ⵣⴻⵍⵍⵉⵊ', 'ⵜⴰⵙⴻⴳⴷⴰ ⵜⴰⵄⵓⵜⵎⴰⵏⵜ', 'ⴰⵥⴻⵖ ⵖⴻⵔ ⵍⵎⵉⵔⴼⴰ', 'ⵍⴰⵜⴰⵢ ⵏ ⵍⴻⵣⵣⴰⵢⴻⵔ', 'ⴰガイド']
    },
    reviews: [
      {
        id: 'r2_1',
        userName: 'لينا السعيد',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
        rating: 5,
        date: '2026-04-30',
        comment: {
          ar: 'النوم في القصبة له طعم خاص وحكايات لا تنتهي. عمي مصطفى استقبلنا بالتمر واللبن والشاي الجزائري وعرفنا على تاريخ البيت التاريخي العريق.',
          fr: 'Séjour magique chez Ammi Mustapha. La maison est magnifique et authentique. Le thé à la menthe sur le toit au coucher du soleil est inoubliable.',
          en: 'A magical experience in the heart of old Algiers. Ammi Mustapha is an incredibly generous soul, welcoming us with classic treats and stories.',
          kab: 'ⵜⵓⴷⴻⵔⵜ ⴷⴻⴳ ⵜⵇⴰⵚⴱⴰⵜ ⵜⴻⵚⴱⴻⵃ . ⵄⴻⵎⵎⵉ ⵎⵓⵚⵟⴰⴼⴰ ⵢⴻⵜⵜⴰⴽ-ⴷ ⵍⴰⵜⴰⵢ ⴷ ⴷⴻⴳ ⵜⴰⴱⴻⵔⵏⴰ ⵖⴻⵔ ⵢⵉⵍ.'
        }
      }
    ]
  },

  // 2. Trending Properties (بيوت رائجة)
  {
    id: 'trending_1',
    category: 'trending',
    title: {
      ar: 'فيلا فخمة هادئة ذات طراز أندلسي مطلة على جزيرة تيبازة الأثرية',
      fr: 'Villa Andalouse Prestigieuse Vue Mer à Tipaza Ruines',
      en: 'Andalusia Villa with Ruins & Sea Views in Tipaza',
      kab: 'ⴰⵅⴰⵎ ⵏ ⵓⵛⴱⵉⵃ Andalouse ⵖⴻⵔ ⵜⵉⴼⵜⵉⵙⵉⵏ ⵏ ⵜⵉⴱⴰⵣⴰ'
    },
    description: {
      ar: 'فيلا مبنية بطريقة أنيقة مستوحاة من العمارة الأندلسية والمغاربية، تقع على جرف صخري ساحر يطل مباشرة على الآثار الرومانية وشواطئ تيبازة الزرقاء. تحتوي على حوض سباحة خاص، عريشة خشبية من الياسمين، فناء مغطى، وخميسة مائية تقليدية.',
      fr: 'Splendide villa d’architecte inspirée du style andalou mauresque, perchée sur les hauteurs de Tipaza. Jardin fleuri privé, piscine à débordement donnant sur la mer et les ruines romaines de Tipaza. Sécurité, quiétude et élégance.',
      en: 'Splendid villa inspired by Moorish Andalusian architecture, perched on the scenic heights of Tipaza. Features a private pool, lush flowery gardens, and unmatched views over historical ruins and the Mediterranean.',
      kab: 'ⵜⴰⴼⵉⵍⵍⴰⵜ Andalou ⴷⴻⴳ ⵜⵉⴱⴰⵣⴰ, ⵜⴰⴱⴻⵔⵏⴰ ⵜⴰⵎⴻⵇⵔⴰⵏⵜ, ⵍⵍⴰⵏ ⵉⵎⵙⵉⵔⵉⴳⵏ ⴷ ⵢⵉⵍ.'
    },
    location: {
      ar: 'شنوة، تيبازة',
      fr: 'Chenoua, Tipaza',
      en: 'Chenoua, Tipaza',
      kab: 'ⵛⴻⵏⵡⴰ, ⵜⵉⴱⴰⵣⴰ'
    },
    wilaya: 'Tipaza',
    pricePerNight: 24000,
    rating: 4.98,
    reviewsCount: 38,
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'رياض بوساحة',
    hostImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80',
    beds: 5,
    bathrooms: 3,
    guests: 8,
    features: {
      ar: ['مسبح خاص مطلق الخصوصية', 'حديقة أندلسية شاسعة', 'إطلالة على جبل شنوة والأثار', 'شواية باربيكيو كاملة الأدوات', 'جلسة عربية خارجية'],
      fr: ['Piscine totalement privée', 'Vaste jardin andalou', 'Vue imprenable sur le mont Chenoua', 'Espace barbecue moderne', 'Salon traditionnel extérieur'],
      en: ['Completely private pool', 'Verdant Andalusian garden', 'Breathtaking mount Chenoua views', 'Fully equipped outdoor BBQ', 'Arabic outdoor lounge'],
      kab: ['ⵉⵎⵙⵉⵔⵉⴳⵏ', 'ⵜⵉⴼⴻⵔⵜ', 'ⴰⵥⴻⵖ ⵖⴻⵔ ⵛⴻⵏⵡⴰ', 'Barbecue', 'Salon ⵏ ⵣⵉⴽ']
    },
    reviews: [
      {
        id: 'r3_1',
        userName: 'عبد الرؤوف كشنر',
        userAvatar: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&w=100&q=80',
        rating: 5,
        date: '2026-05-18',
        comment: {
          ar: 'من أجمل الفلل التي زرتها في حياتي. فخامة وأناقة تليق بعائلاتنا المحافظة، والموقع هادئ جداً بعيد عن ضوضاء المدن.',
          fr: 'Meilleure expérience Airbnb en Algérie. Les finitions andalouses sont d’une élégance rare et الرياض a été incroyablement arrangeant.',
          en: 'Unmatched beauty. The Andalusian details are sublime and the views are therapeutic. Riad was a fabulous, professional host.',
          kab: 'ⵜⴰⴼⵉⵍⵍⴰⵜ ⵢⴻⵍⵀⴰⵏ ⴽⵓⵍ ⵜⴰⵖⴰⵡⵙⴰ ⵜⴻⵚⴼⴰ, Riad ⴷ ⴰⵎⴷⴰⵏ ⵢⴻⵍⵀⴰⵏ.'
        }
      }
    ]
  },
  {
    id: 'trending_2',
    category: 'trending',
    title: {
      ar: 'منزل تقليدي أصيل في واحة غردية التاريخية بني يزقن',
      fr: 'Maison Traditionnelle dans l’Oasis de Beni Isguen M’zab',
      en: 'Historic Oasis Traditional House in Beni Isguen Ghardaia',
      kab: 'ⴰⵅⴰَم ⵏ ⵣⵉⴽ ⴷⴻⴳ ⵢⵉⵖⴻⵔ ⵏ ⴱⵏⵉ ⵢⴻⵣⴳⴻⵏ, ⵜⴰⵖⴻⵔⴷⴰⵢⵜ'
    },
    description: {
      ar: 'استمتع بتجربة الهدوء والسلام والصداقة للبيئة في أحد البيوت الطينية التقليدية المسقفة بجذوع النخل ببلدة بني يزقن المحصنة في وادي ميزاب بغرداية. يتميز المنزل بالبرودة الطبيعية صيفاً والدفء شتاءً، مع ساحة وسطى سماوية ومقتنيات يدوية الصنع.',
      fr: 'Dépaysant et écologique. Séjournez dans une authentique maison du M’zab en argile et bois de palmier à Beni Isguen, Ghardaïa. Fraîcheur naturelle optimale, puits de lumière intérieur et terrasse étoilée féérique le soir venu.',
      en: 'Ecological desert retreat. Live in an authentic Ghardaia valley clay-house made of palm-wood logs in the fortress of Beni Isguen. Natural thermal insulation, cozy central well of light, and stellar views of the night sky.',
      kab: 'ⴰⵅⴰَم ⵏ ⵣⵉⴽ ⴷⴻⴳ ⵜⵖⴻⵔⴷⴰⵢⵜ, ⵜⴰⴱⴻⵔⵏⴰ ⵖⴻⵔ ⵢⵉⵜⵔⴰⵏ, ⴰⵎⴽⴰၼ် ⵢⴻⵚⴼⴰⵏ.'
    },
    location: {
      ar: 'بني يزقن، غرداية',
      fr: 'Beni Isguen, Ghardaïa',
      en: 'Beni Isguen, Ghardaia',
      kab: 'ⴱⵏⵉ ⵢⴻⵣⴳⴻⵏ, ⵜⴰⵖⴻⵔⴷⴰⵢⵜ'
    },
    wilaya: 'Ghardaia',
    pricePerNight: 8000,
    rating: 4.91,
    reviewsCount: 16,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'سليمان بابا أحمد',
    hostImage: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=100&q=80',
    beds: 6,
    bathrooms: 2,
    guests: 10,
    features: {
      ar: ['بناء بيئي طبيعي', 'سطح لمشاهدة النجوم والتأمل', 'زيارة مرشد سياحي محلي للقصور الخمسة', 'تمر دجلة نور مجاني من واحتنا', 'سجاد ميزابي منسوج يدوياً'],
      fr: ['Matériaux naturels locaux d’isolation', 'Grande terrasse pour la nuit étoilée', 'Visite guidée des 5 ksours', 'Dattes Deglet Nour du jardin offertes', 'Tapis traditionnels tissés main'],
      en: ['Natural ecological build', 'Large stargazing rooftop terrace', 'Guided tour across the 5 local Ksours', 'Complimentary garden-fresh dates', 'Handcrafted local tribal rugs'],
      kab: ['ⴰⵅⴰⵎ ⵏ ⵍⵍⵉⵇ', 'ⵜⴰⴱⴻⵔⵏⴰ', 'ⵍⵉⵃⴰⵍⴰ ⵏ ⴽⵙⵓⵔ', 'ⵜⵉⵏⵉ  Deglet Nour', 'ⵜⵉⵍⵉⴼⵉⵏ ⵏ ⵣⵉⴽ']
    },
    reviews: [
      {
        id: 'r4_1',
        userName: 'خالد يوسفي',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
        rating: 5,
        date: '2026-03-20',
        comment: {
          ar: 'غرداية ساحرة وهذا البيت يعطيك شعور السلام والروحانيات والاندماج مع الطبيعة والكرم الميزابي الأصيل. بارك الله في عمي سليمان.',
          fr: 'M’zab est unique et merveilleuse. سليمان est extrêmement respectueux et connaît l’histoire de sa région par cœur. Incontournable !',
          en: 'A phenomenal escape from modern noise. Suleimane is a treasure-trove of historical stories. The dates and tea were wonderful.',
          kab: 'ⵜⴰⵖⴻⵔⴷⴰⵢⵜ  ⵜⴻⵚⴱⴻⵃ  ⴰⵟⴰⵙ, ⵙⵍⵉⵎⴰⵏ ⴷ ⴰⵎⴷⴰⵏ ⵢⴻⵍⵀⴰⵏ ⵙ ⵓⵙⵉⵔⴻⴷ.'
        }
      }
    ]
  },

  // 3. Special Hotels in Algiers Capital (فنادق مميزة في العاصمة)
  {
    id: 'hotel_1',
    category: 'algiers_hotels',
    title: {
      ar: 'أجنحة رويال حامة - فندق 5 نجوم مطل على حديقة التجارب التاريخية',
      fr: 'Suites Hotel de Prestige 5★ - Vue Jardin d’Essai d’El Hamma',
      en: 'Royal Hamma Luxury Suites 5★ - Botanical Garden View',
      kab: ' Royal Hamma 5★ - ⴰⵥⴻⵖ ⵖⴻⵔ ⵓⵔⵜⵉ ⵏ ⵍⵃⴰⵎⵎⴰ'
    },
    description: {
      ar: 'استمتع بالإقامة في قمة الفخامة الكلاسيكية في الجزائر العاصمة، أجنحة فندقية واسعة بإطلالة كاملة ومباشرة على حديقة التجارب الحامة الرائعة وخليج العاصمة. خدمات غرف متميزة على مدار الساعة، مركز رياضي متطور، ومطعم إيطالي وتقليدي فاخر بداخل الفندق.',
      fr: 'Profitez de suites magnifiques 5 étoiles offrant une vue idyllique sur le célèbre Jardin d’Essai d’El Hamma et la baie d’Alger. Service d’étage d’excellence 24h/24, espace de bien-être spa et restaurants gastronomiques.',
      en: 'Live in world-class opulence inside our majestic 5★ suites overlooking the lush, historic Botanical Garden of El Hamma and Algiers Bay. Inclusive of gourmet dining experiences and a premium wellness center.',
      kab: 'ⵉⵙⴰⵏⵙⴰⵢⵏ ⵏ Royal Hamma 5★, ⴰⵥⴻⵖ ⵖⴻⵔ ⵓⵔⵜⵉ ⵏ ⵎⴰⵕⵕⴰ ⵜⵉⴳⴻⵍⴷⵉⵡⵉⵏ, ⵍⵃⴰⵎⵎⴰ.'
    },
    location: {
      ar: 'الحامة، الجزائر العاصمة',
      fr: 'El Hamma, Alger Centre',
      en: 'El Hamma, Central Algiers',
      kab: 'ⵍⵃⴰⵎⵎⴰ, ⵍⴻⵣⵣⴰⵢⴻⵔ'
    },
    wilaya: 'Alger',
    pricePerNight: 29000,
    rating: 4.87,
    reviewsCount: 54,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4db85b?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'إدارة رويال لاكاسا العاصمة',
    hostImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80',
    beds: 2,
    bathrooms: 1,
    guests: 3,
    features: {
      ar: ['إطلالة حديقة التجارب الحامة', 'فطور الصباح بوفيه عالمي فاخر', 'مركز لياقة بدنية وسبا مدمج', 'مواقف سيارات محروسة ومحمية مجانية', 'استقبال المطار'],
      fr: ['Vue sur le mythique Jardin d’Essai', 'Petit-déjeuner buffet gastronomique', 'Spa et salle de fitness de pointe', 'Parking souterrain gardé gratuit', 'Navette aéroport VIP'],
      en: ['View of the botanical garden', 'Delectable international buffet breakfast', 'State-of-the-art spa and gym facilities', 'Free secure underground parking', 'Airport VIP shuttle'],
      kab: ['ⴰⵥⴻⵖ ⵖⴻⵔ ⵓⵔⵜⵉ', 'ⵉⵎⴻⴽⵍⵉ ⵏ ⵜⵚⴻⴱⵃⵉⵜ', 'Spa ⴷ Fitness', 'Parking ⵎⴻⴳ', 'Navettes']
    },
    reviews: [
      {
        id: 'r5_1',
        userName: 'كمال السبتي',
        userAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80',
        rating: 5,
        date: '2026-05-02',
        comment: {
          ar: 'من أفضل الفنادق في العاصمة بدون منازع. الغرفة مريحة جداً وهادئة، ونوافذها مطلة على خضرة حديقة الحامة الشاسعة كأنك في غابة ساحرة.',
          fr: 'Le service est impeccable, digne d’un grand palace. La vue sur le Jardin d’Essai d’El Hamma est spectaculaire.',
          en: 'Incredibly neat and highly professional customer support. Overlooking the legendary park felt like a dream.',
          kab: 'ⵉⵙⴰⵏⵙⴰⵢⵏ ⵢⴻⵍⵀⴰⵏ, ⴰⵥⴻⵖ ⵖⴻⵔ ⵓⵔⵜⵉ ⵏ ⵍⵃⴰⵎⵎⴰ, ⴽⵓⵍ ⵜⴰⵖⴰⵡⵙⴰ ⵜⴻⵚⴼⴰ.'
        }
      }
    ]
  },
  {
    id: 'hotel_2',
    category: 'algiers_hotels',
    title: {
      ar: 'شقة سكنية عائلية هادئة وفاخرة في حي حيدرة الراقي',
      fr: 'Appartement de Prestige Chic et Sécurisé à Hydra, Alger',
      en: 'Executive Chic & High-Security Apartment in Hydra, Algiers',
      kab: 'ⴰⵅⴰⵎ ⵏ ⵓⵛⴱⵉⵃ ⴷⴻⴳ ⵃⵉⴷⵔⴰ, ⵍⴻⵣⵣⴰⵢⴻⵔ'
    },
    description: {
      ar: 'شقة فخمة مؤثثة بأرقى تصاميم الأثاث الإيطالي، تقع في أرقى الشوارع السكنية والدبلوماسية بحي حيدرة بالعاصمة الجزائر. تحظى العمارة بتأمين كاميرات وحراسة ومرآب مخصص للسيارات، مزودة بإنترنت فائق السرعة وجاكوزي عائلي دافئ.',
      fr: 'Appartement résidentiel cossu avec mobilier italien raffiné situé dans le quartier diplomatique sécurisé d’Hydra, Alger. Idéal pour les professionnels, cadres et familles. Internet fibre haut débit, jacuzzi et garage sous-terrain.',
      en: 'Posh residential flat with high-end furnishings located in the highly secure, executive diplomatic avenue of Hydra, Algiers. High-speed fibre internet, cozy jacuzzi and private gated parking included.',
      kab: 'ⴰⵅⴰⵎ ⵏ Luxury ⴷⴻⴳ ⵃⵉⴷⵔⴰ, ⵍⴻⵣⵣⴰⵢⴻⵔ ⵜⴰⵎⴰⵏⴻⵖⵜ. ⴰⵎⴽⴰၼ် ⵏ ⵓⴽⴰⵔⵔⵓ ⴷ ⵢⵉⵏⵜⴻⵔⵏⴻⵜ'
    },
    location: {
      ar: 'حيدرة، الجزائر العاصمة',
      fr: 'Hydra, Alger Diplomatique',
      en: 'Hydra, Algiers Executive',
      kab: 'ⵃⵉⴷⵔⴰ, ⵍⴻⵣⵣⴰⵢⴻⵔ'
    },
    wilaya: 'Alger',
    pricePerNight: 19500,
    rating: 4.92,
    reviewsCount: 18,
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'أمين دمرجي',
    hostImage: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=100&q=80',
    beds: 3,
    bathrooms: 2,
    guests: 4,
    features: {
      ar: ['إنترنت ألياف بصرية سريعة فايبر', 'حمام جاكوزي دافئ مدمج', 'موقع وسط الحي الدبلوماسي الآمن', 'نظام تدفئة وتكييف مركزي ذكي', 'أمن على مدار الساعة بـ بواب'],
      fr: ['Fibre optique ultra rapide', 'Bain jacuzzi chauffant', 'Situation dans un quartier sécurisé', 'Climatisation réversible intelligente', 'Gardiennage et caméras 24/7'],
      en: ['Ultra-fast fiber optic Wi-Fi', 'Private hot tub jacuzzi', 'Safe diplomatic neighborhood', 'Smart heating & cooling system', '24/7 watchman on duty'],
      kab: ['Fibre optique', 'Jacuzzi', 'ⵃⵉⴷⵔⴰ ⵜⴰⵖⴻⵍⵍⵉⵙⵜ', 'ⵜⴰⵚⴻⵎⵎⵓⴷⵜ ⵜⴰⵏⴻⵎⵎⴰⵙⵜ', 'Security']
    },
    reviews: [
      {
        id: 'r6_1',
        userName: 'نسيم الشريف',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
        rating: 5,
        date: '2026-05-10',
        comment: {
          ar: 'المنطقة آمنة جداً ومحترمة، الأثاث مريح ومن الطراز الرفيع، وأخي أمين كان رائعاً في الموثوقية والدقة. أوصي بشدة لرجال الأعمال والبعثات.',
          fr: 'Séjour fantastique dans Hydra. Très discret, sécurisé et l’hôte est toujours disponible pour faciliter l’expérience.',
          en: 'Extremely clean and located in the safest zone in Algiers. Hydra is quiet and majestic, and Amin is a master of host hospitality.',
          kab: 'ⴰⵎⴽⴰⵏ ⵢⴻⵚⴼⴰ, ⵢⴻⵍⵀⴰ ⴰⵟⴰⵙ ⴷⴻⴳ ⵃⵉⴷⵔⴰ.'
        }
      }
    ]
  },

  // 4. Available this Summer (بيوت متاحة هذا الصيف)
  {
    id: 'summer_1',
    category: 'summer_houses',
    title: {
      ar: 'شاليه خشبي بنورامي شاطئي على رمال شواطئ جيجل الزرقاء',
      fr: 'Bungalow Panoramique les Pieds dans l’Eau à Jijel',
      en: 'Panoramic Beachfront Cabin on the Blue Shores of Jijel',
      kab: 'ⵛⵛⴰⵍⵉⵀⴰⵜ Panoramique ⵖⴻⴼ ⵜⵉⴼⵜⵉⵙⵉⵏ ⵏ ⵊⵉⵊⴻⵍ'
    },
    description: {
      ar: 'هل تبحث عن هروب صيفي مطلق؟ هذا الشاليه البنورامي يقع على بعد 5 خطوات فقط من الرمال الذهبية لشاطئ جيجل الخلاب. استيقظ على صوت أمواج البحر العذبة، وتناول فطورك على السطح البحري الشاسع المجهز، مع إمكانية توفير قوارب للصيد والتنزه بمغارات جيجل العجيبة.',
      fr: 'Une aventure estivale authentique. Bungalow chaleureux en bois à seulement 5 pas des eaux cristallines de Jijel (Ziama Mansouria). Terrasse panoramique privée vue mer, barbecue sous les étoiles et location de bateaux possible.',
      en: 'An absolute summer dream stay. Beautiful beachfront wooden cottage situated only 5 steps away from the golden sands of Ziama Mansouriah in Jijel. Soak up the warm Mediterranean sun on your private sea balcony.',
      kab: 'ⵛⵛⴰⵍⵉⵀⴰⵜ ⴷⴻⴳ ⵜⵉⴼⵜⵉⵙⵉⵏ ⵏ ⵊⵉⵊⴻⵍ, ⴰⵥⴻⵖ ⵖⴻⵔ ⵢⵉⵍ, ⵍⵍⴰⵏ ⵜⵉⵖⴰⵡⵙⵉⵡⵉⵏ ⵏ ⵓⵏⴻⴱⴷⵓ.'
    },
    location: {
      ar: 'زيامة منصورية، جيجل',
      fr: 'Ziama Mansouriah, Jijel',
      en: 'Ziama Mansouriah, Jijel',
      kab: 'ⵣⵉⴰⵎⴰ ⵎⴰⵏⵚⵓⵔⵉⴰ, ⵊⵉⵊⴻⵍ'
    },
    wilaya: 'Jijel',
    pricePerNight: 12000,
    rating: 4.89,
    reviewsCount: 22,
    images: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1473116763269-25541579ff6f?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'عماد بن طاهر',
    hostImage: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=100&q=80',
    beds: 4,
    bathrooms: 1,
    guests: 5,
    features: {
      ar: ['موقع مباشر على الشاطئ (رجل في الماء)', 'شرفة مطلة وصوت الأمواج', 'مثالي لعشاق السباحة والصيد', 'معدات تخييم وسباحة وشواء', 'قريب من الكهوف والمغارات العجيبة'],
      fr: ['Accès direct à la plage (les pieds dans l’eau)', 'Terrasse privée bercée par le son des vagues', 'Idéal pour la natation et pêche', 'Équipements de plage et barbecue installés', 'À proximité des Grottes Merveilleuses de Jijel'],
      en: ['Direct beach access at your doorstep', 'Private balcony tuned to oceanic waves', 'Perfect for swimming & marine fishing', 'Included beach chairs & barbeque setup', 'Close to the famous Jijel caves'],
      kab: ['ⵖⴻⴼ ⵜⴼⵜⵉⵙⵜ ⵢⴻⵍⵍⴰⵏ', 'ⵜⴰⴱⴻⵔⵏⴰ ⵖⴻⵔ ⵢⵉⵍ', 'ⵉⵛⴻⵔⵔⴻⴷ ⵏ ⵓⵙⵉⵔⴻⴷ', 'Barbecue', 'ⵊⵉⵊⴻⵍ ⵜⴰⵎⴻⵇⵔⴰⵏⵜ']
    },
    reviews: [
      {
        id: 'r7_1',
        userName: 'سفيان العتر',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
        rating: 5,
        date: '2026-05-20',
        comment: {
          ar: 'شاليه بقمة الجمال والنظافة، والبحر تحته مباشرة كأنه ملكك الخاص. الأطفال استمتعوا للغاية وعماد مضيف كريم وخلوق.',
          fr: 'Jijel est splendide, et ce bungalow en bois est le meilleur moyen d’en apprécier le charme sauvage. Merci à Imad !',
          en: 'Absolute heaven on Earth. Literally 10 seconds of walking and you are swimming in paradise. Imad was ultra helpful.',
          kab: 'ⵊⵉⵊⴻⵍ ⵜⴻⵚⴱⴻⵃ, ⴰⵅⴰⵎ ⵢⴻⵍⵀⴰ ⴰⵟⴰⵙ ⵖⴻⵔ ⵢⵉⵍ.'
        }
      }
    ]
  },
  {
    id: 'summer_2',
    category: 'summer_houses',
    title: {
      ar: 'شقة واسعة على جرف بحري بإطلالة زرقاء ساحرة في العوانة جيجل',
      fr: 'Appartement de Plage Vue Panoramique à El Aouana, Jijel',
      en: 'Panoramic Cliffside Ocean Apartment in El Aouana, Jijel',
      kab: 'ⴰⵅⴰⵎ ⵏ ⵓⵏⴻⴱⴷⵓ ⴷⴻⴳ ⵍⵄⵡⴰⵏⴰ, ⵊⵉⵊⴻⵍ'
    },
    description: {
      ar: 'شقة عائلية آمنة في مجمع سكني سياحي يقع على مرتفع شاطئ العوانة المشهور بولاية جيجل. إطلالة غابة وجبل وساحل مجتمعين، هواء بارد ومنعش وشقة مهيأة بثلاث غرف نوم واسعة مكيفة بالكامل مع مواقف سيارات آمنة.',
      fr: 'Bel appartement familial climatisé situé sur les hauteurs côtières d’El Aouana, Jijel. Conjugue admirablement vue sur mer turquoise et forêts de chênes lièges. Sécurisé avec parking et plages d’El Aouana faciles d’accès.',
      en: 'Splendid executive family apartment looking down on the pristine coastal cliffs of El Aouana, Jijel. Fully air-conditioned, featuring three bedrooms, secured private car parking, and natural breeze.',
      kab: 'ⴰⵅⴰⵎ ⵏ ⵜⵡⴰⵛⵓⵍⵉⵏ ⴷⴻⴳ ⵍⵄⵡⴰⵏⴰ ⵊⵉⵊⴻⵍ , ⴰⵣⴻⴳⵣⴰ ⵏ ⵢⵉⵍ.'
    },
    location: {
      ar: 'العوانة، جيجل',
      fr: 'El Aouana, Jijel Sensation',
      en: 'El Aouana, Jijel',
      kab: 'ⵍⵄⵡⴰⵏⴰ, ⵊⵉⵊⴻⵍ'
    },
    wilaya: 'Jijel',
    pricePerNight: 9800,
    rating: 4.83,
    reviewsCount: 15,
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'جمال قادري',
    hostImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
    beds: 5,
    bathrooms: 1,
    guests: 7,
    features: {
      ar: ['تكييف هواء ممتاز في كل غرف', 'موقف محمي مخصص للسيارات', 'إطلالة بانورامية بحرية وجبلية حية', 'مطبخ كبير متكامل بكامل اللوازم والأواني', 'قريب من جزيرة جافيا العذراء'],
      fr: ['Climatisation moderne complète', 'Espace parking gardé affecté', 'Vue mer et montagne imprenable', 'Cuisine entièrement équipée pour familles', 'À 5 minutes de l’île Cavallo'],
      en: ['Full modern air conditioning', 'Allocated gated parking space', 'Panoramic ocean & forest scenes', 'Large, fully-stocked family kitchen', 'Close to the scenic Cavallo Island'],
      kab: ['ⵜⴰⵚⴻⵎⵎⵓⴷⵜ', 'Parking', 'ⴰⵥⴻⵖ ⵖⴻⵔ ⵢⵉⵍ ⴷ ⵓⴷⵔⴰⵔ', 'ⵜⴰⵅⴰⵎⵜ ⵏ ⵓⵙⴻⵏⵡⵉ', ' Cavallo']
    },
    reviews: [
      {
        id: 'r8_1',
        userName: 'سامية بوطة',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
        rating: 4,
        date: '2026-05-15',
        comment: {
          ar: 'الشقة واسعة ومجهزة بكل ما تحتاجه العائلة المطبخ رائع والإطلالة مهدئة للأعصاب في أي وقت. تعامل جمال راقٍ جداً.',
          fr: 'Appartement fantastique et spacieux. L’emplacement sur les hauteurs d’El Aouana est très frais et plaisant en été.',
          en: 'Extremely roomy and fully fitted for heavy family cooking. The ocean and forest views from the balcony were sublime.',
          kab: ' ⴰⵅⴰⵎ ⵢⴻⵍⵀⴰ ⴰⵟⴰⵙ : ⵍⵄⵡⴰⵏⴰ ⵊⵉⵊⴻⵍ.'
        }
      }
    ]
  },

  // 5. Chalets (شاليهات)
  {
    id: 'chalet_1',
    category: 'chalets',
    title: {
      ar: 'شاليه جبل البلوط السويسري الخشبي في أعالي الحديقة الوطنية تيكجدا',
      fr: 'Chalet Suisse en Bois de Chêne dans les Hauteurs de Tikjda',
      en: 'A-Frame Oakwood Forest Chalet in High Tikjda National Park',
      kab: 'ⵛⵛⴰⵍⵉⵀⴰⵜ ⵏ ⵜⵉⴽⵊⴷⴰ ⵙ ⵓⵙⵖⴰⵔ ⴷⴻⴳ ⵓⴷⵔⴰⵔ'
    },
    description: {
      ar: 'اهرب إلى أحضان غابات الأرز الأطلسي في جبال جرجرة بالتيكجدا. شاليه خشبي مبني بالبلوط بلمسة سويسرية ممتعة، يتميز بمدفأة حطب دافئة لليالي الشتاء الباردة، وشرفة مطلة على قمم الجبال الشاهقة المكسوة بالثلوج. تجربة استثنائية للاسترخاء.',
      fr: 'Chalet forestier douillet entièrement conçu en bois de cèdre et de chêne, niché à 1500m d’altitude au cœur du Parc National de Tikjda (Djurdjura). Cheminée au feu de bois traditionnelle, literie haut de gamme et terrasse sous la neige.',
      en: 'Cozy Aframe forest cabin crafted out of local cedar and oak wood, situated 1500m high in the spectacular Djurdjura National Park of Tikjda. Features a traditional logwood fireplace and sweeping snow mountain views.',
      kab: 'ⵛⵛⴰⵍⵉⵀⴰⵜ ⵏ ⵜⵉⴽⵊⴷⴰ ⴷⴻⴳ ⵓⴷⵔⴰⵔ ⵏ ⵊⴻⵔⵊⴻⵔ , ⵍⵍⴰⵏ ⵜⵉⵖⴰⵡⵙⵉⵡⵉⵏ ⵏ ⵜⵓⴷⴻⵔⵜ .'
    },
    location: {
      ar: 'تيكجدا، البويرة',
      fr: 'Tikjda Djurdjura, Bouira',
      en: 'Tikjda, Bouira',
      kab: 'ⵜⵉⴽⵊⴷⴰ, ⵜⵉⵣⵉ ⵡⵓⵣⵓ / ⴱⵓⵢⵔⴰ'
    },
    wilaya: 'Bouira',
    pricePerNight: 13500,
    rating: 4.96,
    reviewsCount: 45,
    images: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'ياسين حداد',
    hostImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    beds: 3,
    bathrooms: 1,
    guests: 4,
    features: {
      ar: ['مدفأة حطب طبيعي دافئة', 'إطلالة ثلجية وجبلية بانورامية', 'شاحن سيارات وجلسات خشبية', 'معدات المشي في المسارات مجانية', 'شاي الأعشاب الجبلية الترحيبي'],
      fr: ['Cheminée de hêtre et chêne', 'Vue neige et mont Djurdjura', 'Coin de détente extérieur en bois', 'Raquettes et bâtons de rando offerts', 'Tisanes bio de montagne de bienvenue'],
      en: ['Traditional logwood fireplace', 'Panoramic snow & Djurdjura peaks view', 'Cozy outdoor fireside seating', 'Free hiking/snowshoes gear rental', 'Organic local mountain tea welcome kit'],
      kab: ['ⴽⴰⵏⵓⵏ ⵏ ⵜⵙⴻⴳⴷⴰ', 'ⴰⵥⴻⵖ ⵖⴻⵔ ⵜⵉⴽⵊⴷⴰ', 'ⵉⵇⵓⴷⴰⵔ ⵏ ⵓⴷⵔⴰⵔ', 'Raquettes', 'ⵍⴰⵜⴰⵢ ⵏ ⵓⴷⵔⴰⵔ']
    },
    reviews: [
      {
        id: 'r9_1',
        userName: 'فاتح بوغرين',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
        rating: 5,
        date: '2026-01-10',
        comment: {
          ar: 'الشاليه خيالي والثلج هطل بغزارة فوق الأسطح وموقد الحطب الدافئ جعل السهرة رائعة. ياسين شخص مميز ومضياف.',
          fr: 'Une nuit grandiose sous la neige de Tikjda. Le crépitement du feu de bois avec un thé à la menthe chaud est inoubliable !',
          en: 'Incredibly cozy. Sleeping in a genuine wood chalet in Djurdjura surrounded by snow and pine trees was breathtaking.',
          kab: 'ⵛⵛⴰⵍⵉⵀⴰⵜ ⵢⴻⵍⵀⴰ ⴰⵟⴰⵙ, ⵜⵉⴽⵊⴷⴰ, ⵢⴰⵙⵉⵏ ⴷ ⴰⵎⴷⴰⵏ ⵢⴻⵍⵀⴰ.'
        }
      }
    ]
  },

  // 6. Swimming Pools (مسابح)
  {
    id: 'pool_1',
    category: 'pools',
    title: {
      ar: 'فيلا وايت بالاس الفخمة - مسبح لا متناهي مغطى بالكامل وبخصوصية مطلقة',
      fr: 'Villa de Luxe "White Palace" - Piscine à débordement 100% Intime',
      en: 'Villa "White Palace" - 100% Fully Gated Private Infinity Pool',
      kab: 'ⵜⴰⴼⵉⵍⵍⴰⵜ "White Palace" - ⵉⵎⵙⵉⵔⵉⴳⵏ ⵢⴻⵍⵀⴰⵏ ⵙ ⵍⵉⵎⴰⵏ'
    },
    description: {
      ar: 'فيلا ألترا مودرن بيضاء مصممة بقمة الفخامة، تقع في حي الفلل الهادئ بزرالدة بعيداً عن صخب الجزائر. الميزة الكبرى هي حوض مسبح خارجي لا متناهي هائل ومحجوب تماماً عن الجيران بنسبة 100% لتستمتع العائلات بالراحة والحرية التامة. حديقة مهيأة وجلسة خارجية راقية وشواية حديثة.',
      fr: 'Sublime villa contemporaine haut de gamme située dans la banlieue calme de Zeralda, Alger. Offre une magnifique piscine à débordement à l’abri complet des regards (sans vis-à-vis) pour une intimité totale en famille. Terrasse lounge élégante.',
      en: 'Stunning premium modern villa located in the peaceful Zeralda neighborhood, Algiers. Boasts a massive infinity swimming pool designed with 100% absolute privacy with high fenced walls for local families.',
      kab: 'ⵜⴰⴼⵉⵍⵍⴰⵜ ⴷⴻⴳ ⵣⴻⵔⴰⵍⴷⴰ ⵙ ⵢⵉⵎⵙⵉⵔⵉⴳⵏ ⵢⴻⵍⵀⴰⵏ ⵙ ⵍⵉⵎⴰⵏ ⵉ ⵜⵡⴰⵛⵓⵍⵉⵏ.'
    },
    location: {
      ar: 'زرالدة، الجزائر العاصمة',
      fr: 'Zeralda, Alger Ouest',
      en: 'Zeralda, West Algiers',
      kab: 'ⵣⴻⵔⴰⵍⴷⴰ, ⵍⴻⵣⵣⴰⵢⴻﺮ'
    },
    wilaya: 'Alger',
    pricePerNight: 35000,
    rating: 4.97,
    reviewsCount: 29,
    images: [
      'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'فاطمة الزهراء',
    hostImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    beds: 6,
    bathrooms: 4,
    guests: 10,
    features: {
      ar: ['مسبح إنفينيتي لا متناهي', 'خصوصية عائلية تامة 100% (بدون مقابل)', 'حديقة عشبية مفروشة واسعة وجلسات', 'شاشة ذكية عملاقة ونظام صوت بوز', 'مطبخ عائلي أمريكي ضخم'],
      fr: ['Piscine à débordement (sans aucun vis-à-vis)', 'Absolue intimité familiale 100%', 'Vaste jardin paysager et salon de jardin', 'Smart TV cinéma et système audio Bose', 'Immense cuisine américaine ouverte'],
      en: ['Stunning outdoor infinity pool', '100% family privacy (No overlook)', 'Gated landscaped garden with lounges', 'Giant Smart TV & Bose audio sound system', 'Huge fully fitted American kitchen'],
      kab: ['ⵉⵎⵙⵉِرⵉⴳⵏ ⵢⴻⵚⴼⴰⵏ', 'ⵜⵓⴷⴻⵔⵜ ⵜⵓⵙⵍⵉⴳⵜ (ⵍⵉⵎⴰⵏ)', 'ⵜⵉⴼⴻⵔⵜ', 'Smart TV & Bose', 'Cuisine ⵜⴰⵎⴻⵇⵔⴰⵏⵜ']
    },
    reviews: [
      {
        id: 'r10_1',
        userName: 'جلول بن ضيف',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
        rating: 5,
        date: '2026-05-15',
        comment: {
          ar: 'الخصوصية هنا هي الأفضل! مسبح واسع ممتع للأولاد والأمور كلها مطابقة للأوصاف، وفاطمة مضيفة ممتازة وسريعة الرد.',
          fr: 'Incroyable séjour. Très bel endroit et surtout aucun vis-à-vis pour la piscine extérieure, ce qui est très rare sur Alger.',
          en: 'Exceptional. Highly private pool area, pristine water quality, and high security. Zeralda is calm, lovely experience!',
          kab: 'ⵉⵎⵙⵉⵔⵉⴳⵏ ⵢⴻⵍⵀⴰ ⴰⵟⴰⵙ ⵙ ⵍⵉⵎⴰⵏ ⵉ ⵜⵡⴰⵛⵓⵍⵉⵏ ⵏⵏⴻⵖ.'
        }
      }
    ]
  },

  // 7. Wedding Halls (قاعات حفلات)
  {
    id: 'hall_1',
    category: 'wedding_halls',
    title: {
      ar: 'قاعة الإمبراطورية الكبرى للأفراح والمؤتمرات - قصر الحفلات الأنيق بالقبة',
      fr: 'Majestic "Empire" Wedding Hall - Palais des Fêtes Chic Kouba',
      en: 'Imperial Palace Wedding & Grand Conference Hall Kouba',
      kab: 'ⵜⴰⵅⴰⵎⵜ ⵏ ⵜⵎⴻⵖⵔⵉⵡⵉⵏ "Empire" - Kouba'
    },
    description: {
      ar: 'هل تقيم حفل زفافك أو مناسبتك قريباً في الجزائر؟ قاعة الإمبراطورية الكبرى بحي القبة العريق توفر لكم قصراً من الفخامة يتسع لـ 500 ضيف. ديكورات شرقية ملكية فريدة وسلالم مرموتية خلابة، مجهزة بأحدث هندسة صوت وإضاءة ليزر، وجناح فاخر مخصص للعروس لتصفيف الشعر والاستراحة.',
      fr: 'Pour vos mariages, réceptions et événements exclusifs à Alger. La prestigieuse salle l’Empire à Kouba offre un cadre majestueux pouvant accueillir jusqu’à 500 convives. Design impérial oriental, lustre somptueux, sonorisation et loge royale privée pour la mariée.',
      en: 'Planning an premium wedding, event or executive gathering in Algiers? The prestigious Empire Hall in Kouba offers an imperial venue accommodating up to 500 guests with elegant lighting, stage decoration and VIP changing suites.',
      kab: 'ⵜⴰⵅⴰⵎⵜ ⵏ ⵜⵎⴻⵖⵔⵉⵡⵉⵏ "Empire" ⴷⴻⴳ  Kouba ⵉ ⵜⵎⴻⵖⵔⵉⵡⵉⵏ ⵏⵏⴻⴽ.'
    },
    location: {
      ar: 'القبة، الجزائر العاصمة',
      fr: 'Kouba, Alger Centre-Est',
      en: 'Kouba, Algiers',
      kab: 'ⵇⵓⴱⴰ, ⵍⴻⵣⵣⴰⵢⴻﺮ'
    },
    wilaya: 'Alger',
    pricePerNight: 85000,
    rating: 4.81,
    reviewsCount: 33,
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'إبراهيم غول',
    hostImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
    beds: 1, // Honeymoon suite
    bathrooms: 4,
    guests: 500,
    features: {
      ar: ['سعة حتى 500 شخص كحد أقصى', 'ديكورات وممرات مرموتية وإضاءة ليزر ثلاثية', 'جناح مجهز بالكامل ومكيف لراحة العروس', 'فريق خدمة وتقديم شاي وحلويات محترف', 'موقف شاسع محروس ومخصص للسيارات'],
      fr: ['Capacité jusqu’à 500 convives', 'Décorations majestueuses et effets de lumière', 'Suite privée climatisée pour la mariée', 'Équipe de serveurs et accueil de gala', 'Grand parking fermé surveillé'],
      en: ['Accommodates up to 500 guests', 'Breathtaking imperial decor & laser effects', 'Private luxury bridal restroom suite', 'Full high-end server crew & reception team', 'Massive gated private parking space'],
      kab: ['500 ⵏ ⵢⵉⵎⴷⴰⵏⴻⵏ ⵎⴰⵅ', 'Décorations', 'ⵜⴰⵅⴰⵎⵜ ⵏ ⵜⵙⵍⵉⵜ', 'ⵉⵎⵙⴻⴷⴷⴻⵔⵜ', 'Parking']
    },
    reviews: [
      {
        id: 'r11_1',
        userName: 'سليم بن يونس',
        userAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80',
        rating: 5,
        date: '2026-04-12',
        comment: {
          ar: 'أقمنا حفل زفاف ولدنا في قاعة الإمبراطورية الكبرى، وكان التنظيم محترفاً للغاية والحلويات والقهوة قدمت ساخنة للجميع، بارك الله في خدمات القاعة.',
          fr: 'Magnifique salle de mariage ! Le gérant Ibrahim est très sérieux et à l’écoute. Les serveurs ont été très polis et soignés.',
          en: 'Held our daughter’s wedding ceremony here, absolutely stunning and well-managed staff. Ibrahim made the coordination stress-free.',
          kab: 'ⵜⴰⵅⴰⵎⵜ ⵏ ⵜⵎⴻⵖⵔⵉⵡⵉⵏ ⵜⴻⵚⴱⴻⵃ ⴰⵟⴰⵙ, Ibrahim ⴷ ⴰⵎⴷⴰⵏ ⵢⴻⵍⵀⴰ.'
        }
      }
    ]
  },

  // 8. Farms / Ranches (مزارع)
  {
    id: 'farm_1',
    category: 'farms',
    title: {
      ar: 'مزرعة الياسمين الريفية الهادئة والمجهزة بمسبح عائلي في المتيجة البليدة',
      fr: 'Ferme Rustique Sereine "Jasmin Cottage" avec Piscine active à Blida',
      en: 'Jasmine Countryside Ranch & Cottage with Family Pool Blida',
      kab: 'ⵜⵉⴼⴻⵔⵎⵉⵡⵉⵏ "Jasmin Cottage" - ⴱⵍⵉⴷⴰ'
    },
    description: {
      ar: 'استيقظ في ريف المتيجة الخلاب تحت ظلال أشجار البرتقال والليمون والزيتون. مزرعة الياسمين الريفية تجمع المعيشة الريفية البسيطة والخدمات العصرية الراقية. تحتوي المزرعة على كوخ ريفي مجهز بالكامل، حيوانات أليفة (طيور نادرة، أرانب، خيول)، فضاء جلوس عائلي خارجي، وحمام سباحة منعش ومحمي.',
      fr: 'Évadez-vous dans une ferme fruitière verdoyante sur la plaine de la Mitidja à Blida. Entouré d’orangers et d’oliviers, le cottage Jasmin dispose d’une piscine privative grillagée, d’un enclos d’animaux de ferme, et de terrasses fleuries apaisantes.',
      en: 'Flee to an orange-blossom orchard farm in the fertile fields of Mitidja, Blida. Jasmine Cottage features rustic stone living, a gated family pool, interactions with friendly farm animals, and endless surrounding greenery.',
      kab: 'ⵜⵉⴼⴻⵔⵎⵉⵡⵉⵏ "Jasmin Cottage" ⴷⴻⴳ ⴱⵍⵉⴷⴰ ⵙ ⵓⵙⵉⵔⴻⴷ ⴷ ⵢⵉⵎⵙⵉⵔⵉⴳⵏ.'
    },
    location: {
      ar: 'المتيجة، البليدة',
      fr: 'Plaine de la Mitidja, Blida',
      en: 'Mitidja Countryside, Blida',
      kab: 'ⵎⵉⵜⵉⵊⴰ, ⴱⵍⵉⴷⴰ'
    },
    wilaya: 'Blida',
    pricePerNight: 15000,
    rating: 4.93,
    reviewsCount: 30,
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'عز الدين بوقرة',
    hostImage: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=100&q=80',
    beds: 4,
    bathrooms: 2,
    guests: 8,
    features: {
      ar: ['مسبح ريفي محاط بأشجار الليمون', 'أشجار برتقال ومشمش وزيتون لقطف الفاكهة', 'كوخ جبلي ريفي دافئ', 'ركوب خيول وإطعام أرانب مجاني للأطفال', 'حليب ومربى ريفي طازج في الصباح'],
      fr: ['Piscine de campagne cernée de citronniers', 'Verger bio (oranges, raisins) libres à cueillir', 'Cottage en pierre douillet et climatisé', 'Poneys et lapins accessibles aux enfants', 'Petit-déjeuner rustique terroir bio offert'],
      en: ['Rustic country pool lined with citrus trees', 'Organic orchard picking (Oranges, Figs, Olives)', 'Fully air-conditioned stone ranch house', 'Friendly horseback rides & rabbit feeding', 'Complimentary fresh organic breakfast eggs & milk'],
      kab: ['ⵉⵎⵙⵉⵔⵉⴳⵏ', 'ⵜⵉⵣⵣⴻⴳⵡⴰ', 'Cottage', 'ⵉⴷⵔⴰⵔⵏ ⴷ ⵉⵎⵓⴷⴰⵔⵏ', 'ⵉⵎⴻⴽⵍⵉ ⵏ ⵜⵚⴻⴱⵃⵉⵜ']
    },
    reviews: [
      {
        id: 'r12_1',
        userName: 'عبد الناصر طالبي',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
        rating: 5,
        date: '2026-05-22',
        comment: {
          ar: 'المزرعة جنة على الأرض، الهواء نقي جداً ورائحة زهر الليمون تملاً الأرجاء. عمي عز الدين استقبلنا كأننا عائلته وقدم لنا حليباً طازجاً مجاناً.',
          fr: 'Magnifique ferme au calme absolu. Parfait pour sevrer les enfants des tablettes et leur faire découvrir la vraie vie à Blida.',
          en: 'Absolute paradise in Blida. Air is sweet with citrus blossoms, pool is fresh and Suleimane is a gentleman of unmatched kindness.',
          kab: 'ⵜⵉⴼⴻⵔⵎⵉⵡⵉⵏ ⵜⴻⵚⴱⴻⵃ ⴰⵟⴰⵙ , ⵄⴻⵣⴷⵉⵏ ⴷ ⴰⵎⴷⴰⵏ ⵢⴻⵍⵀⴰ.'
        }
      }
    ]
  },
  {
    id: 'barcelona_room',
    category: 'recently_listed',
    title: {
      ar: 'غرفة في برشلونة',
      fr: 'Chambre chic à Barcelone',
      en: 'Chic Private Room in Barcelona',
      kab: 'ⵜⴰⵅⴰⵎⵜ ⴷⴻⴳ Barcelone'
    },
    description: {
      ar: 'غرفة خاصة هادئة ومشمسة في قلب حي غراسيا ببرشلونة، مجهزة بسرير مريح ومكتب عمل وإنترنت سريع، مثالية للمسافرين المنفردين.',
      fr: 'Chambre privée ensoleillée dans le quartier charmant de Gràcia. Proche du métro, avec lit confortable et coin bureau idéal.',
      en: 'Sunny private room in Barcelona’s trendy Gràcia district. Comfort bed, fast Wi-Fi, and workspace perfect for digital nomads.',
      kab: 'ⵜⴰⵅⴰⵎⵜ ⴷⴻⴳ Barcelone'
    },
    location: {
      ar: 'برشلونة',
      fr: 'Barcelone',
      en: 'Barcelona',
      kab: 'Barcelone'
    },
    wilaya: 'All',
    pricePerNight: 9500,
    rating: 4.94,
    reviewsCount: 148,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'María',
    hostImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    beds: 1,
    bathrooms: 1,
    guests: 2,
    features: {
      ar: ['واي فاي سريع', 'تكييف غاز', 'مكتب عمل', 'شرفة مشمسة'],
      fr: ['Wi-Fi Rapide', 'Climatisation', 'Espace de travail', 'Terrasse'],
      en: ['Fast Wi-Fi', 'Air Conditioning', 'Laptop Workspace', 'Balcony'],
      kab: ['Internet']
    },
    reviews: []
  },
  {
    id: 'hotel_este',
    category: 'recently_listed',
    title: {
      ar: 'Hotel Esté',
      fr: 'Hotel Esté / Spa Paris',
      en: 'Hotel Esté & Thermal Bath',
      kab: 'Hotel Esté'
    },
    description: {
      ar: 'فندق عصري فاخر يتميز بمسبح حراري وتصميم داخلي دافئ يوفر الخصوصية والراحة القصوى مع حمامات سبا فاخرة.',
      fr: 'Hôtel moderne avec piscine thermale intérieure, espace spa apaisant et chambres chaleureuses grand confort.',
      en: 'Premium boutique hotel featuring heated interior thermal waters, signature architecture and absolute serenity.',
      kab: 'Hotel Esté'
    },
    location: {
      ar: 'فندق',
      fr: 'Hôtel',
      en: 'Hotel',
      kab: 'Hotel'
    },
    wilaya: 'All',
    pricePerNight: 23000,
    rating: 4.82,
    reviewsCount: 92,
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'Pierre',
    hostImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    beds: 2,
    bathrooms: 1,
    guests: 4,
    features: {
      ar: ['مسبح دافئ', 'خدمة غرف ٢٤ ساعة', 'جناح سبا متكامل', 'إفطار فرنسي فاخر'],
      fr: ['Piscine', 'Service de chambre', 'Espace Spa', 'Petit-déjeuner'],
      en: ['Heated Pool', '24/7 Room Service', 'Full Spa Suite', 'Exquisite Breakfast'],
      kab: ['Pool']
    },
    reviews: []
  },
  {
    id: 'hotel_sevigne',
    category: 'recently_listed',
    title: {
      ar: 'Hotel de Sevigne',
      fr: 'Hotel de Sévigné Paris',
      en: 'Hotel de Sévigné Boutique Rooms',
      kab: 'Hotel de Sevigne'
    },
    description: {
      ar: 'أجنحة بوتيكية مصممة على الطراز الكلاسيكي بألوان دافئة مريحة وإضاءة هادئة لتجربة إقامة مثالية وراقية.',
      fr: 'Suites parisiennes élégantes ornées de tons terracotta doux et de finitions minutieuses idéales pour un week-end romantique.',
      en: 'Classic boutique design suite boasting pastel warm colors, gentle custom lighting, and high-end room finishes.',
      kab: 'Hotel de Sevigne'
    },
    location: {
      ar: 'فندق',
      fr: 'Hôtel',
      en: 'Hotel',
      kab: 'Hotel'
    },
    wilaya: 'All',
    pricePerNight: 28000,
    rating: 4.83,
    reviewsCount: 65,
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'Jean',
    hostImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
    beds: 2,
    bathrooms: 1,
    guests: 3,
    features: {
      ar: ['تصميم كلاسيكي', 'واي فاي سريع جداً', 'ميني بار متكامل', 'شاشة عرض ذكية'],
      fr: ['Design classique', 'Wi-Fi ultra rapide', 'Mini Bar', 'Écran connecté'],
      en: ['Classic interior', 'Ultra fast Wi-Fi', 'Luxury Mini-bar', 'Smart TV screen'],
      kab: ['TV']
    },
    reviews: []
  },
  {
    id: 'warehouse_blida',
    category: 'warehouses',
    title: {
      ar: 'مستودع تخزين صناعي واسع وآمن - البليدة',
      fr: 'Entrepôt Industriel Sécurisé - Blida',
      en: 'Spacious Secure Industrial Warehouse - Blida',
      kab: 'ⵉⵎⵙⵜⵓⴷⴰⵄ ⵏ ⵓⴽⴽⵓⵙ - ⴱⵍⵉⴷⴰ'
    },
    description: {
      ar: 'مستودع حديث بمساحة كبيرة ومصمم لتخزين مختلف أنواع البضائع والمعدات الثقيلة. يقع في المنطقة الصناعية الحيوية بالبليدة، مع منفذ سهل لشاحنات المقطورات ونظام حراسة متكامل على مدار الساعة.',
      fr: 'Entrepôt moderne de grande capacité conçu pour le stockage de marchandises et équipements lourds. Situé dans la zone industrielle active de Blida, avec accès semi-remorque et gardiennage 24h/24.',
      en: 'A modern, high-capacity warehouse designed for goods storage and heavy equipment. Strategically situated in Blidas industrial hub with easy semi-truck access and 24/7 on-site security.',
      kab: 'ⵉⵎⵙⵜⵓⴷⴰⵄ ⵏ ⵓⴽⴽⵓⵙ ⵙ ⵜⵖⴰⵡⵙⵉⵡⵉⵏ, ⵢⴻⵍⵀⴰ ⴰⵟⴰⵙ ⴷⴻⴳ ⴱⵍⵉⴷⴰ.'
    },
    location: {
      ar: 'المنطقة الصناعية، البليدة',
      fr: 'Zone Industrielle, Blida',
      en: 'Industrial Zone, Blida',
      kab: 'Zone Industrielle, ⴱⵍⵉⴷⴰ'
    },
    wilaya: 'Blida',
    pricePerNight: 45000,
    rating: 4.8,
    reviewsCount: 5,
    images: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'سفيان براهيمي',
    hostImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    beds: 0,
    bathrooms: 2,
    guests: 15,
    features: {
      ar: ['حراسة 24/7', 'منفذ شاحنات مقطورة', 'نظام إطفاء حرائق', 'طاقة كهربائية 380V'],
      fr: ['Sécurité 24/7', 'Accès semi-remorques', 'Système anti-incendie', 'Courant triphasé 380V'],
      en: ['24/7 Security guarding', 'Semi-truck direct loading', 'Automatic fire extinguishing', 'Heavy 380V Power supply'],
      kab: ['Sécurité 24/7']
    },
    reviews: []
  },
  {
    id: 'shop_algiers',
    category: 'shops',
    title: {
      ar: 'محل تجاري بوسط العاصمة - ديدوش مراد',
      fr: 'Local Commercial Premium - Alger Centre',
      en: 'Premium Commercial Retail Shop - Algiers Center',
      kab: 'ⵜⴰⵃⴰⵏⵓⵜ ⵜⴰⵎⴻⵇⵔⴰⵏⵜ - ⴷⵣⴰⵢⴻⵔ ⵜⴰⵎⴰⵏⴻⵖⵜ'
    },
    description: {
      ar: 'محل تجاري ذو واجهة زجاجية عريضة يقع في شارع تجاري رئيسي وحيوي للغاية في ديدوش مراد بوسط الجزائر العاصمة. مثالي للماركات الراقية وصالات العرض المجهزة.',
      fr: 'Local commercial moderne avec une large vitrine sur une rue très passante de Didouche Mourad, Alger Centre. Idéal pour enseignes de prestige ou showrooms.',
      en: 'A modern storefront commercial space featuring a wide glass window on a high-traffic street in Didouche Mourad, Algiers Center. Excellent for boutique retail or showroom purposes.',
      kab: 'ⵜⴰⵃⴰⵏⵓⵜ ⵢⴻⵍⵀⴰⵏ ⵙ ⵓⵙⴻⵏⵣⵓ ⴷⴻⴳ ⵓⵎⴰⵙ ⵏ ⴷⵣⴰⵢⴻⵔ.'
    },
    location: {
      ar: 'شارع ديدوش مراد، الجزائر',
      fr: 'Rue Didouche Mourad, Alger',
      en: 'Didouche Mourad St, Algiers',
      kab: 'Didouche Mourad, ⴷⵣⴰⵢⴻⵔ'
    },
    wilaya: 'Alger',
    pricePerNight: 35000,
    rating: 4.9,
    reviewsCount: 8,
    images: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1472851294608-062f824d296e?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'أمين ديدين',
    hostImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    beds: 0,
    bathrooms: 1,
    guests: 40,
    features: {
      ar: ['موقع استراتيجي ممتاز', 'واجهة زجاجية عريضة', 'تكييف هواء كامل', 'نظام إنذار وحماية'],
      fr: ['Position stratégique', 'Vitrine en verre complète', 'Climatisation totale', 'Système d’alarme'],
      en: ['Superb prime location', 'Wide glass display facade', 'Full cooling air-conditioning', 'Integrated smart alarm'],
      kab: ['Alarme']
    },
    reviews: []
  },
  {
    id: 'land_mitidja',
    category: 'lands',
    title: {
      ar: 'قطع أرض زراعية مستوية في سهل متيجة الخصب',
      fr: 'Terrains Agricoles Fertiles - Mitidja',
      en: 'Fertile Agricultural Land Plots - Mitidja Plains',
      kab: 'ⵜⵉⵎⵓⵔⴰ ⵏ ⵜⴼⴻⵔⴽⴰ - ⵎⴻⵜⵜⵉⵊⴰ'
    },
    description: {
      ar: 'أرض زراعية خصبة مستوية في قلب سهل متيجة الشهير بالبليدة. تتوفر على بئر ماء ارتوازي غني وشبكة ري ممتازة وهي صالحة لجميع أنواع الزراعات أو الاستجمام العائلي.',
      fr: 'Terrain agricole plat et hautement productif situé dans la célèbre plaine de la Mitidja à Blida. Équipé d’un puits artésien d’eau douce et idéal pour tout projet agricole ou de détente.',
      en: 'Luxuriant flat farming soil located in the heart of the legendary Mitidja plain in Blida. Boasting its own water well and ideal for premium crops or private family getaways.',
      kab: 'ⵜⴰⴼⴻⵔⴽⴰ ⵢⴻⵍⵀⴰⵏ ⵙ ⵜⴽⴻⵔⵣⴰ ⴷⴻⴳ ⵎⴻⵜⵜⵉⵊⴰ.'
    },
    location: {
      ar: 'سهل متيجة، البليدة',
      fr: 'Plaine de la Mitidja, Blida',
      en: 'Mitidja Plain, Blida',
      kab: 'Mitidja, ⴱⵍⵉⴷⴰ'
    },
    wilaya: 'Blida',
    pricePerNight: 15000,
    rating: 4.75,
    reviewsCount: 4,
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'عمي الطيب',
    hostImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&q=80',
    beds: 0,
    bathrooms: 0,
    guests: 100,
    features: {
      ar: ['بئر ارتوازي للري', 'تربة سوداء خصبة جداً', 'منفذ معبد للسيارات', 'سياج واقٍ محيط'],
      fr: ['Puits artésien', 'Sol noir ultra fertile', 'Accès route goudronnée', 'Clôture de périmètre'],
      en: ['Rich artesian water well', 'Super fertile black soil', 'Asphalt road easy access', 'Secure fence enclosure'],
      kab: ['Water Well']
    },
    reviews: []
  },
  {
    id: 'parking_oran',
    category: 'parking',
    title: {
      ar: 'مواقف سيارات آمنة ومفتوحة تحت الأرض - وهران',
      fr: 'Abonnement Parking Souterrain Sécurisé - Oran',
      en: 'Secure Guarded Underground Parking - Oran City',
      kab: 'ⴰⵎⴽⴰၼ် ⵏ ⵓⴽⴰⵔⵔⵓ - ⵡⴻⵀⵔⴰⵏ'
    },
    description: {
      ar: 'مواقف سيارات مرخصة ومحروسة بالكامل تقع تحت الأرض في قلب وهران النابض. مراقبة تامة بالكاميرات ونظام بطاقات وصول ذكية لحماية تامة لسيارتك.',
      fr: 'Places de stationnement sécurisées en sous-sol gardé dans le centre dynamique d’Oran. Surveillance vidéo 24h/24 et cartes d’accès magnétiques.',
      en: 'High-security underground parking space located in Oran downtown. Protected with professional camera feeds and digital swipe accessibility for absolute ease of mind.',
      kab: 'ⴰⵎⴽⴰၼ် ⵏ ⵜⴽⴰⵔⵔⵓⵙⵉⵏ ⵢⴻⵚⴼⴰⵏ, ⵢⴻⵍⵀⴰ ⵙ ⵍⵄⴻⵙ.'
    },
    location: {
      ar: 'وسط المدينة، وهران',
      fr: 'Centre Ville, Oran',
      en: 'Downtown, Oran',
      kab: 'Centre Ville, ⵡⴻⵀⵔⴰⵏ'
    },
    wilaya: 'Oran',
    pricePerNight: 2500,
    rating: 4.95,
    reviewsCount: 38,
    images: [
      'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506521788723-86869b829bb0?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'سامي الباهي',
    hostImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80',
    beds: 0,
    bathrooms: 0,
    guests: 1,
    features: {
      ar: ['مراقبة مستمرة بالكاميرات', 'حراسة بشرية 24 ساعة', 'دخول ومخرج مريح وسلس', 'غسيل مجاني للسيارات'],
      fr: ['Caméras de recul active', 'Gardien physique 24h/24', 'Entrée & sortie faciles', 'Lavage auto en option'],
      en: ['Live CCTV camera network', '24/7 Human guarding', 'Smooth entrance clearance', 'Optional hand car wash'],
      kab: ['Garde 24h']
    },
    reviews: []
  },
  {
    id: 'factory_rouiba',
    category: 'factories',
    title: {
      ar: 'وحدة صناعية متكاملة وجاهزة للتشغيل - الرويبة العاصمة',
      fr: 'Unité Industrielle Moderne Clé en Main - Rouïba',
      en: 'Turnkey Advanced Manufacturing Factory Unit - Rouiba',
      kab: 'ⵜⴰⴼⴰⴱⵔⵉⴽⵜ ⵜⴰⵎⴻⵇⵔⴰⵏⵜ - ⵔⵡⵉⴱⴰ'
    },
    description: {
      ar: 'مصنع كامل التجهيز بمقاييس هندسية متطورة في قلب المنطقة الصناعية الرويبة بالجزائر العاصمة. مكاتب إدارية ملحقة وصالة إنتاج عملاقة مع تيار كهربائي صناعي ذو طاقة عالية ومواقف شاحنات شاسعة.',
      fr: 'Usine moderne prête à l’emploi dans la zone d’activité majeure de Rouïba, Alger. Comprend de grands halls de production, des bureaux administratifs climatisés et d’importantes arrivées d’énergie haute tension.',
      en: 'Fully configured and certified manufacturing unit situated in the prominent Rouiba industrial district, Algiers. Contains offices, massive clear-height warehouses, and a heavy electrical substation.',
      kab: 'ⵜⴰⴼⴰⴱⵔⵉⴽⵜ ⵎⴻⵇⵇⵔⴻⵏ ⵙ ⵓⵙⴻⵏⴼⴻⵢ ⵏ ⵜⵖⴰⵡⵙⵉⵡⵉⵏ, ⴷⴻⴳ ⵔⵡⵉⴱⴰ.'
    },
    location: {
      ar: 'المنطقة الصناعية الرويبة، الجزائر',
      fr: 'Zone Industrielle Rouïba, Alger',
      en: 'Rouiba Industrial Zone, Algiers',
      kab: 'Zone Industrielle, ⵔⵡⵉⴱⴰ'
    },
    wilaya: 'Alger',
    pricePerNight: 95000,
    rating: 4.85,
    reviewsCount: 3,
    images: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'الشركة الجزائرية للاستثمار',
    hostImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80',
    beds: 0,
    bathrooms: 4,
    guests: 80,
    features: {
      ar: ['كهرباء ضغط عالي 380V', 'مكاتب إدارية راقية مجهزة', 'مستودعات استقبال واسعة', 'نظام تهوية وأمن صناعي'],
      fr: ['Courant électrique triphasé', 'Bureaux administratifs équipés', 'Grands halls de stockage', 'Système de ventilation industrielle'],
      en: ['Heavy industrial 380V power', 'Premium air-conditioned offices', 'Massive loading warehouses', 'Safety ventilation standards'],
      kab: ['TricitÃ© 380V']
    },
    reviews: []
  },
  {
    id: 'desert_camp',
    category: 'sahara',
    title: {
      ar: 'مخيم صحراوي بقلب الطاسيلي الخلاب - جانت',
      fr: 'Campement Berbère de Prestige au Tassili - Djanet',
      en: 'Luxury Nomadic Desert Camp in Tassili N’Ajjer - Djanet',
      kab: 'ⵜⴰⵎⵓⵔⵜ ⵏ ⵜⴰⵏⴻⵣⵔⵓⴼⵜ - ⵊⴰⵏⴻⵜ'
    },
    description: {
      ar: 'عش تجربة نوم أسطورية بين رمال الصحراء الكبرى الذهبية في مخيمنا التقليدي الدافئ في الطاسيلي بولاية جانت. خيم بربرية متسعة مجهزة بأرقى الفراش، مع رحلات السفاري بسيارات الدفع الرباعي وحفلات الشاي على ضوء النجوم المضيئة.',
      fr: 'Profitez d’une retraite nomade inoubliable au milieu des dunes de sable orangé du Tassili à Djanet. Tentes traditionnelles confortables avec lits douillets, excursions 4x4, thé au feu de bois et nuit sous la voûte céleste d’Afrique.',
      en: 'Discover an authentic Saharan nomadic journey in our luxury camp located in the dunes of Tassili, Djanet. Cozy decorated tents, guided 4x4 safari, woodfire tea, and mesmerizing views of stellar night skies.',
      kab: 'ⴰⵣⴻⴳⵣⴻⵍ ⴷⴻⴳ ⵜⴰⵏⴻⵣⵔⵓⴼⵜ ⵜⴰⵎⴻⵇⵔⴰⵏⵜ ⵏ ⵊⴰⵏⴻⵜ.'
    },
    location: {
      ar: 'رمال الطاسيلي، جانت',
      fr: 'Dunes du Tassili, Djanet',
      en: 'Tassili Dunes, Djanet',
      kab: 'Tassili, ⵊⴰⵏⴻⵜ'
    },
    wilaya: 'Ghardaia', // Map to Ghardaia/All since Ghardaia is listed in the search filter
    pricePerNight: 18000,
    rating: 4.97,
    reviewsCount: 46,
    images: [
      'https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'المرشد البشير الترقي',
    hostImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80',
    beds: 6,
    bathrooms: 2,
    guests: 12,
    features: {
      ar: ['جولات دفع رباعي 4x4 سياحية', 'شاي صحراوي أصيل مجاني', 'وجبات طعام تقليدية صحية', 'مرشد سياحي ترقي خبير'],
      fr: ['Excursions en 4x4 guidées', 'Thé saharien traditionnel gratuit', 'Repas du terroir cuisinés sur place', 'Guide touareg bilingue'],
      en: ['4x4 Desert safari vehicle', 'Traditional wood-fire mint tea', 'Authentic health Saharan meals', 'Expert local Targui guide'],
      kab: ['ThÃ© Sahraoui']
    },
    reviews: []
  },
  {
    id: 'service_photo_1',
    category: 'photography',
    title: {
      ar: 'جلسات تصوير احترافية كاملة وتغطية سينمائية للمناسبات',
      fr: 'Séances photo de prestige & couverture vidéo cinématographique',
      en: 'Cine-quality photography & premium event session cover',
      kab: 'Professional Photography Service'
    },
    description: {
      ar: 'خدمات تصوير فوتوغرافي وسينمائي بأرقى المعايير. نغطي حفلات الأعراس والمؤتمرات والفعاليات بأحدث كاميرات ميرورليس بدقة 4K مع تصحيح ألوان سينمائي مذهل وتسليم فلاش ديسك فوري بجميع الصور.',
      fr: 'Une couverture photo et vidéo ultra-haute fidélité pour vos mariages et réceptions professionnelles. Retouches photos, album physique de luxe et clip vidéo sur clé USB.',
      en: 'Professional high-end event photography and cinematic video. Equipped with Sony pro mirrorless cameras, custom editing, premium digital delivery and printed albums.',
      kab: 'Professional photography and video service.'
    },
    location: {
      ar: 'حي سيدي يحيى، حيدرة، الجزائر العاصمة',
      fr: 'Sidi Yahia, Hydra, Alger',
      en: 'Sidi Yahia, Hydra, Algiers',
      kab: 'Hydra, Alger'
    },
    wilaya: 'Alger',
    pricePerNight: 28000,
    rating: 4.96,
    reviewsCount: 32,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'الاستوديو الاحترافي ميديا آرت',
    hostImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
    beds: 1,
    bathrooms: 1,
    guests: 50,
    features: {
      ar: ['تغطية فيديو سينمائي كاميرا ثابتة ومتحركة', 'ألبومات صور ورقية مطبوعة فاخرة بالجلد', 'تصحيح وتعديل احترافي لجميع الصور', 'تسليم سريع وفوري خلال 48 ساعة فقط'],
      fr: ['Vidéographie haute fidélité 4K', 'Albums en cuir véritable imprimés', 'Retouches Photoshop complètes incluses', 'Livraison de photos express sous 48h'],
      en: ['4K Cinematic video coverage', 'Genuine leather physical albums', 'Full Lightroom & Photoshop edits', 'Express 48h final delivery'],
      kab: ['Photography']
    },
    reviews: []
  },
  {
    id: 'service_chef_1',
    category: 'private_chef',
    title: {
      ar: 'شيف أمين الخاص - بوفيه فاخر وأطباق تقليدية جزائرية وعالمية',
      fr: 'Chef Privé Amine - Gastronomie haut de gamme chez vous',
      en: 'Chef Amine - Bespoken private catering and premium dining',
      kab: 'Chef Amine Services'
    },
    description: {
      ar: 'عش رفاهية تذوق أطباق الشيف أمين الحاصل على جوائز عديدة في الطبخ داخل فيلتك أو منزلك. بوفيه مأكولات بحرية، أطعمة تقليدية أصيلة بطراز فاخر، وحلويات مصممة حسب طلبك مع توفير نادل للخدمة وتنظيف المطبخ بالكامل.',
      fr: 'Dégustez une cuisine gastronomique de haut niveau chez vous ou dans vos réceptions. Menus traditionnels revisités ou spécialités du monde, ingrédients frais et locaux, service et nettoyage inclus.',
      en: 'Experience premium royal dining at your residence. Award-winning Chef Amine serves authentic Algerian gastronomy alongside international favorites, using 100% organic local ingredients.',
      kab: 'Chef Amine Service'
    },
    location: {
      ar: 'حي شاطونوف، الأبيار، الجزائر العاصمة',
      fr: 'Chateauneuf, El Biar, Alger',
      en: 'Chateauneuf, El Biar, Algiers',
      kab: 'El Biar, Alger'
    },
    wilaya: 'Alger',
    pricePerNight: 16000,
    rating: 4.98,
    reviewsCount: 27,
    images: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'الشيف أمين تومي',
    hostImage: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=100&q=80',
    beds: 1,
    bathrooms: 1,
    guests: 30,
    features: {
      ar: ['قائمة طعام مخصصة بالتشاور معكم', 'نادل محترف ببدلة رسمية لخدمة الضيوف', 'شراء المكونات الطازجة صباح المناسبة', 'تنظيف وتعقيم المطبخ تاما بعد الانتهاء'],
      fr: ['Menus sur mesure adaptables', 'Serveur professionnel en smoking', 'Ingrédients frais de la ferme', 'Nettoyage de la cuisine impeccable'],
      en: ['Tailored bespoke menus available', 'Groomed professional waiter included', 'Fresh organic local farm ingredients', 'Complete deep kitchen clean and restoration'],
      kab: ['Chef Privé']
    },
    reviews: []
  },
  {
    id: 'service_gym_1',
    category: 'gym',
    title: {
      ar: 'نادي ون فيتنس الرياضي - كوتشينغ مخصص وأفضل أجهزة تمرين الكارديو',
      fr: 'One Fitness Club - Coachs personnels & équipements pro',
      en: 'One Fitness Club - Top-tier weight training & personal coaching',
      kab: 'One Fitness Gym'
    },
    description: {
      ar: 'مرحبا بك في أرقى نوادي اللياقة البدنية والكمال الرياضي. أجهزة حديد ثقيل، حصص كاردية مخصصة، برامج غذائية مجهزة من طرف مختصين وتوفير مدربين لمرافقتك حركاتك ومنع الإصابات مع حمامات مجهزة ومستودع غيار آمن.',
      fr: 'Rejoignez le club de remise en forme le plus sélect pour votre santé. Équipements de pointe, coach certifié, suivi d’entraînement hebdomadaire et espace vestiaire moderne.',
      en: 'Unleash your strength at the ultimate fitness retreat. Fully functional bodybuilding stations, state-of-the-art cardio decks, dynamic trainers, locker access, and clean hot showers.',
      kab: 'One Fitness Gym'
    },
    location: {
      ar: 'سعيد حمدين، بئر مراد رايس، الجزائر العاصمة',
      fr: 'Said Hamdine, Bir Mourad Rais, Alger',
      en: 'Said Hamdine, Bir Mourad Rais, Algiers',
      kab: 'Bir Mourad Rais, Alger'
    },
    wilaya: 'Alger',
    pricePerNight: 1800,
    rating: 4.92,
    reviewsCount: 54,
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'المدرب كمال فريد',
    hostImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80',
    beds: 1,
    bathrooms: 2,
    guests: 15,
    features: {
      ar: ['أوزان حرة متكاملة وحصص لياقة نساء ورجال', 'مدرب شخصي حاصل على شهادات دولية ومعتمد', 'غرفة غيار ممتازة مع حمامات مياه ساخنة', 'مشروبات صحية وشيك بروتين متاح بالبهو'],
      fr: ['Poids libres & cours collectifs', 'Coach sportif diplômé d’État', 'Vestiaires sécurisés & douches chaudes', 'Bar à protéine & boissons énergétiques'],
      en: ['Free weights and dynamic fitness group classes', 'Certified fitness coaches available', 'Secure lock lockers and warm power-showers', 'Protein smoothies and sports energy drinks bar'],
      kab: ['One Fitness Gym']
    },
    reviews: []
  },
  {
    id: 'service_hair_1',
    category: 'womens_hair',
    title: {
      ar: 'صالون الياسمين - حلاقة نسائية وتسريحات عرائس وعناية بالشعر',
      fr: 'Salon Jasmin - Coiffure, esthétique et lissage de prestige',
      en: 'Jasmin Ladies Salon - Bridal styling & professional hair care',
      kab: 'Jasmin Ladies Salon'
    },
    description: {
      ar: 'تألقي في مناسباتك وسهراتك مع صالون الياسمين الفاخر المخصص للنساء بخصوصية تامة. خدمات صبغ شعر، علاجات بروتين طبيعي وكيراتين، تسريحات عرائس ساحرة، مع أرقى مكياج وعناية بالبشرة على يد خبيرات مؤهلات.',
      fr: 'Bénéficiez de soins de cheveux exclusifs et de coupes adaptées chez Jasmin Salon. Spécialistes des coiffures de mariées de luxe, colorations et lissages à base de produits sains et bio.',
      en: 'Rejuvenate your look and celebrate weddings elegantly at Jasmin. High-end natural hair treatments, organic dyes, professional bridal styling and exquisite premium makeup inside a secure, female-only environment.',
      kab: 'Jasmin Ladies Salon'
    },
    location: {
      ar: 'شارع ديدوش مراد، وسط العاصمة، الجزائر',
      fr: 'Rue Didouche Mourad, Alger Centre',
      en: 'Didouche Mourad St, Algiers Center',
      kab: 'Alger Centre'
    },
    wilaya: 'Alger',
    pricePerNight: 7500,
    rating: 4.95,
    reviewsCount: 19,
    images: [
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'الخبيرة منال ياسمين',
    hostImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
    beds: 1,
    bathrooms: 1,
    guests: 8,
    features: {
      ar: ['تسريحات شعر عروس حصرية حديثة أو كلاسيكية', 'علاج الشعر المتقصف بالكولاجين مجاناً', 'جلسات استشارية مجانية لنوع فروة الرأس', 'بيئة خاصة بالنساء 100% معقمة وآمنة'],
      fr: ['Coiffures de mariée exclusives', 'Soin Botox & Lissage offerts', 'Diagnostics capillaires complets', 'Espace 100% féminin, privé & désinfecté'],
      en: ['Bespoke physical bridal hair consultations', 'Moisture hair spa therapies and conditioning', 'Complementary expert locks scalp analysis', '100% Gated female-only clinical privacy'],
      kab: ['Womens Salon']
    },
    reviews: []
  },
  {
    id: 'service_hammam_1',
    category: 'traditional_hammam',
    title: {
      ar: 'حمام الأندلس التقليدي - استرخاء بالبخار وتدليك بالزيوت الطبيعية',
      fr: 'L’Andalou Hammam Traditionnel - Bain maure vapeur & massages',
      en: 'L’Andalou Traditional Hammam - Steam therapy & organic massage',
      kab: 'L’Andalou Hammam'
    },
    description: {
      ar: 'تخلصي من سموم الجسم والضغط اليومي في حمام الأندلس المبني بالرخام التقليدي الرائع. تجربة مغربية كاملة بالصابون الأسود الطبيعي والليفة لتنظيف الجلد، تليها جلسة تدليك احترافية بالزيوت الأساسية العطرة والاسترخاء في بهو الشاي.',
      fr: 'Une immersion de bien-être pur dans notre hammam impérial moderne. Gommage au savon noir et kessa, suivi d’un modelage relaxant à l’huile d’argan et dégustation de tisane apaisante.',
      en: 'Immerse in pure wellness within our marble-stone bathhouse. Steam cleaning with black soap, exfoliating glove scrubbing, hot body oil massage and relaxing mint herbal tea sessions.',
      kab: 'L’Andalou Hammam'
    },
    location: {
      ar: 'حي زرالدة الهادئ، الجزائر العاصمة',
      fr: 'Zeralda District, Alger',
      en: 'Zeralda, Algiers',
      kab: 'Zeralda, Alger'
    },
    wilaya: 'Alger',
    pricePerNight: 4000,
    rating: 4.97,
    reviewsCount: 42,
    images: [
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'المركز الصحي الأندلس',
    hostImage: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=100&q=80',
    beds: 1,
    bathrooms: 4,
    guests: 20,
    features: {
      ar: ['بخار مائي مستمر برائحة الكالبتوس المنعش', 'جلسة تدليك بزيوت طبيعية للشعر المتقصف', 'صابون أسود بلدي أصيل مع ليفة خشنة', 'بهو استراحة دافئ مجهز بشاي أعشاب'],
      fr: ['Vapeur aromatique à l’eucalyptus', 'Séance de massage relaxant par pro', 'Savon noir et kissa traditionnelle', 'Salon de thé lounge confortable'],
      en: ['Eucalyptus infused thermal steam', 'Full body soothing professional massage', 'Authentic Moroccan black soap & scrub', 'Silent recovery lounge with hot herbal tea'],
      kab: ['Hammam']
    },
    reviews: []
  },
  {
    id: 'service_sauna_1',
    category: 'sauna',
    title: {
      ar: 'كبائن سونا الأرز الفنلندية الجافة وجاكوزي مائي علاجي',
      fr: 'Sauna Finlandais Sec & Jacuzzi Hydrothérapeutique',
      en: 'Royal Scandinavian Sauna - Cedar wood & hot tub therapeutic',
      kab: 'Royal Sauna'
    },
    description: {
      ar: 'احجز كابينة سونا خاصة لشخصين أو لشخص مصممة من خشب الأرز الأحمر الكندي الذي يساعد على ارتخاء الأعصاب والعظام. درجات حرارة مثالية مع جهاز جاكوزي ضخم يضم بخاخات مائية مبردة لتنشيط الجلد، وتوفير ملابس رداء معقمة.',
      fr: 'Une expérience de sauna privé scandinave haut de gamme en sapin. Bain bouillonnant d’hydrothérapie, douche glacée revigorante, serviettes de luxe et peignoirs chauds mis à disposition.',
      en: 'Unwind in a private luxury Scandinavian redwood dry sauna cabinet. Features temperature therapy, large therapeutic water hot jets jacuzzi, ice water bucket, and warm luxury thick bathrobes.',
      kab: 'Royal Sauna'
    },
    location: {
      ar: 'حي تيبازة السياحي المعتدل، تيبازة',
      fr: 'Tipaza Ville, Tipaza',
      en: 'Tipaza Resort Town, Tipaza',
      kab: 'Tipaza'
    },
    wilaya: 'Tipaza',
    pricePerNight: 5500,
    rating: 4.99,
    reviewsCount: 15,
    images: [
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1554156002-975557968276?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'عيادة رويال سبا تيبازة',
    hostImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&q=80',
    beds: 1,
    bathrooms: 2,
    guests: 6,
    features: {
      ar: ['كبائن سونا خشب الصنوبر الفنلندي المعقمة', 'جاكوزي مياه دافئة مع بخاخات هيدرولوجية', 'دش جليدي مبرد لتنشيط المسام والدم', 'أرواب نوم ومناشف قطنية ناعمة معقمة دافئة'],
      fr: ['Cabine de sauna en pin traité', 'Jacuzzi bouillonnant hydromassant', 'Douche écossaise glacée tonique', 'Peignoirs en coton premium fournis'],
      en: ['Scented natural redwood dry sauna', 'Deep muscle massage therapy hydro jets', 'Vigorating ice storm shower system', 'Complementary clean premium body robes'],
      kab: ['Sauna']
    },
    reviews: []
  },
  {
    id: 'service_photo_2',
    category: 'photography',
    title: {
      ar: 'جلسة تصوير مذهلة في برشلونة',
      fr: 'Séances photo de portrait créatif en plein air',
      en: 'Professional Outdoor Portrait & Creative Shoot',
      kab: 'Outdoor Photo session'
    },
    description: {
      ar: 'التقط أفضل لحظاتك في برشلونة. الأعلى تقييمًا والأكثر مبيعًا في المدينة، منذ عام 2019.',
      fr: 'Séance photo professionnelle en extérieur dans les plus beaux spots. Idéal pour les books de mode, influenceurs et portraits corporate.',
      en: 'Breathtaking high-definition outdoor photography session at Algeria\'s scenic areas. Perfect for brand influencers, modeling portfolios, and corporate profiles.',
      kab: 'Photo shoot'
    },
    location: {
      ar: 'برشلونة، إسبانيا',
      fr: 'Barcelone, Espagne',
      en: 'Barcelona, Spain',
      kab: 'Barcelona'
    },
    wilaya: 'Alger',
    pricePerNight: 3500,
    rating: 4.94,
    reviewsCount: 3522,
    images: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'Brayan John',
    hostImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    beds: 1,
    bathrooms: 1,
    guests: 5,
    features: {
      ar: ['تصوير بأحدث كاميرات الطائرات درون', 'تعديل كامل للألوان والعيوب والإضاءة', 'تسليم سريع خلال 24 ساعة رقمية', 'إمكانية اختيار 3 مواقع للتصوير'],
      fr: ['Photographie par Drone intégrée', 'Retouches professionnelles complètes', 'Remise numérique sous 24h', 'Shooting multi-spots'],
      en: ['Drone photography included', 'Professional color & face editing', 'Fast 24-hour digital delivery', 'Multi-location options'],
      kab: ['Photo']
    },
    reviews: []
  },
  {
    id: 'service_chef_2',
    category: 'private_chef',
    title: {
      ar: 'عشاء جزائري تقليدي فاخر - شيف ليلى',
      fr: 'Dîner Algérien Traditionnel Royal - Chef Lylia',
      en: 'Traditional Royal Algerian Feast - Chef Lylia',
      kab: 'Chef Lylia dining'
    },
    description: {
      ar: 'أرقى مأكولات المطبخ الجزائري العتيق في باحة منزلك. كسكسي عاصمي ملكي بالقرعة اللذيذة ولحم الخروف البلدي، طاجين الحلو الأصيل ورشتة جزائرية بالدجاج البلدي المحمر.',
      fr: 'Vivez l\'excellence culinaire avec la Chef Lylia. Couscous royal, Rechta fait maison, Tajine et délices algérois authentiques chez vous.',
      en: 'Treat your family to an authentic royal home-cooked feast. Chef Lylia brings centuries of traditional culinary heritage to your kitchen with bespoke dishes.',
      kab: 'Traditional dining'
    },
    location: {
      ar: 'بلدية الأبيار، الجزائر العاصمة',
      fr: 'El Biar, Alger',
      en: 'El Biar, Algiers',
      kab: 'El Biar'
    },
    wilaya: 'Alger',
    pricePerNight: 12000,
    rating: 4.94,
    reviewsCount: 38,
    images: [
      'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512485694743-9c9538b4e6e0?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'الشيف ليلى بن مبارك',
    hostImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
    beds: 1,
    bathrooms: 1,
    guests: 20,
    features: {
      ar: ['رشتة وكسكسي منزلي الصنع 100%', 'مكونات بهارات وتوابل جزائرية أصيلة', 'تحضير شاي مميز بعد العشاء مجاناً', 'تنظيف كامل للأواني ولمكان الطهي'],
      fr: ['Couscous & Rechta 100% fait maison', 'Ingrédients et épices traditionnels', 'Thé vert à la menthe offert après repas', 'Service de vaisselle et nettoyage inclus'],
      en: ['100% Homemade organic couscous', 'Traditional ancestral spices used', 'Complementary post-meal mint tea', 'Kitchen cleaning & washing process included'],
      kab: ['Chef']
    },
    reviews: []
  },
  {
    id: 'service_gym_2',
    category: 'gym',
    title: {
      ar: 'اشتراك حصص يوغا جماعية وبيلاتس وتأمل - نادي تنفس',
      fr: 'Séance de Yoga, Méditation et Pilates Pro',
      en: 'Yoga, Meditation & Deep Pilates Masterclass',
      kab: 'Yoga classes'
    },
    description: {
      ar: 'أعد شحن عافيتك وطاقتك النفسية في حصص يوغا وبيلاتس مجهزة ومريحة مع أفضل المدربات الدوليات بقاعات هادئة ومكيفة ومطلة على الطبيعة.',
      fr: 'Séances de yoga énergisantes et séances de méditation relaxante. Libérez-vous du stress de la semaine dans un cadre idyllique.',
      en: 'Unleash inner peace and active spine health. Yoga, deep breathing exercises, and Pilates guidelines conducted by foreign-trained specialists.',
      kab: 'Yoga'
    },
    location: {
      ar: 'حي تيسير، دالي براهيم، العاصمة',
      fr: 'Dely Ibrahim, Alger',
      en: 'Dely Ibrahim, Algiers',
      kab: 'Dely Ibrahim'
    },
    wilaya: 'Alger',
    pricePerNight: 2500,
    rating: 4.91,
    reviewsCount: 17,
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'المدربة مريم صادق',
    hostImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    beds: 1,
    bathrooms: 2,
    guests: 12,
    features: {
      ar: ['فرشات يوغا طبية ناعمة معقمة تاما', 'إيقاع موسيقي هادئ يساعد على التصفية دقيقة', 'حصص مغلقة مخصصة بالنساء فقط بخصوصية', 'مشروبات ديتوكس الخضار الطبيعي الساحرة'],
      fr: ['Tapis de yoga premium stérilisés', 'Ambiance sonore zen et apaisante', 'Sessions privées réservées aux femmes', 'Jus de detox frais offerts à l\'accueil'],
      en: ['Surgical-grade sanitized yoga mats', 'Zen background healing sounds', 'Exclusive female-only sessions', 'Complementary premium detox juices'],
      kab: ['Yoga']
    },
    reviews: []
  },
  {
    id: 'service_hair_2',
    category: 'womens_hair',
    title: {
      ar: 'حلاقة ومعالجة شعر بروتين وكيراتين برازيلي - ميزون روز',
      fr: 'Lissage Brésilien & Traitement Capillaire',
      en: 'Brazilian Keratin & Deep Protein Hair Therapy',
      kab: 'Keratin protein treatment'
    },
    description: {
      ar: 'علاجات حرارية خبيرة لاستعادة لمعان وصحة شعرك المتقصف باستخدام بروتين عضوي وكيراتين برازيلي أصلي خالٍ من الفورمالين الكيميائي الضار مع قصة شعر عصرية مجانية.',
      fr: 'Traitement de kératine thermique haut de gamme sans formol pour cheveux lisses, soyeux et brillants. Diagnostic capillaire offert.',
      en: 'Experience absolute silk and shine. Non-toxic Brazilian keratin and amino-acid protein deep therapy designed to repair dried locks and split ends.',
      kab: 'Maison Rose Hair'
    },
    location: {
      ar: 'بومرداس وسط المدينة، بومرداس',
      fr: 'Boumerdes Ville, Boumerdes',
      en: 'Boumerdes Center, Boumerdes',
      kab: 'Boumerdes'
    },
    wilaya: 'Boumerdes',
    pricePerNight: 6900,
    rating: 4.93,
    reviewsCount: 22,
    images: [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'الأخصائية لوزة برينسيس',
    hostImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=100&q=80',
    beds: 1,
    bathrooms: 1,
    guests: 4,
    features: {
      ar: ['كيراتين طبيعي 100% خالٍ من الفورمالين', 'قصّة شعر مجانية متطابقة مع حجم الوجه', 'استخدام علامة لوريال وشوارزكوف الفخمة', 'نتائج تدوم حتى 6 أشهر متتالية'],
      fr: ['Kératine bio sans formol toxique', 'Coupe tendance offerte sur mesure', 'Marques L’Oréal & Schwarzkopf', 'Résultats garantis jusqu\'à 6 mois'],
      en: ['100% Formaldehyde-free organic formulas', 'Complementary tailored haircut matching face', 'Using premium L\'Oreal & Schwarzkopf brands', 'Guaranteed silk results up to 6 months'],
      kab: ['Womens Salon']
    },
    reviews: []
  },
  {
    id: 'service_hammam_2',
    category: 'traditional_hammam',
    title: {
      ar: 'حمام بلكور التقليدي العتيق - تجربة تاريخية شعبية فريدة',
      fr: 'Hammam Historique de Belcourt - Bain Maure Authentique',
      en: 'Belcourt Heritage Hammam - Centuries Old Bath Ritual',
      kab: 'Hammam Belcourt'
    },
    description: {
      ar: 'عش أصالة حمامات الجزائر بقلب حي بلكور الشعبي العريق. مياه ساخنة مستمرة لفتح المسام، تقشير كيسة خشن بواسطة مدلكين محترفين لاسترجاع حيوية بشرتك كلياً.',
      fr: 'Vivez l\'expérience authentique d\'un bain maure centenaire au coeur du quartier historique. Gommage revigorant par des kissers expérimentés.',
      en: 'Steps inside an active centuries-old steam bathhouse in historic Belcourt. Authentic brick architecture, steaming waters, and extreme traditional scrubbing.',
      kab: 'Belcourt Hammam'
    },
    location: {
      ar: 'حي بلكور العتيق، محمد بلوزداد، الجزائر العاصمة',
      fr: 'Belcourt, Belouizdad, Alger',
      en: 'Belcourt, Mohamed Belouizdad, Algiers',
      kab: 'Belouizdad'
    },
    wilaya: 'Alger',
    pricePerNight: 2500,
    rating: 4.89,
    reviewsCount: 57,
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519419166318-4f5c601b8e6c?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'المعلم مراد للحمامات والتدليك',
    hostImage: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=100&q=80',
    beds: 1,
    bathrooms: 6,
    guests: 40,
    features: {
      ar: ['مبنى حمام أثري جميل من العهد العثماني', 'فريق مدلكين محليين بخبرة تفوق الـ20 عاما', 'استخدام طين وفخار محلي طبيعي ومنعش', 'شربات ليمون جزائري منعش وبارد مجاناً'],
      fr: ['Établissement historique d\'époque ottomane', 'Kisseurs traditionnels qualifiés avec 20 ans d\'exp', 'Argile naturelle traditionnelle (Ghassoul)', 'Citronnade artisanale fraîche offerte'],
      en: ['Ottoman heritage architecture setting', 'Highly skilled scrub experts with 20+ years experience', 'Natural Ghassoul volcanic mud packs', 'Complementary cold craftsmanship lemonade'],
      kab: ['Hammam']
    },
    reviews: []
  },
  {
    id: 'service_sauna_2',
    category: 'sauna',
    title: {
      ar: 'سونا الأوكالبتوس الجافة وصالة السبا العلاجية - النادي الملكي',
      fr: 'Sauna aux Huiles d\'Eucalyptus & Spa Relaxant',
      en: 'Eucalyptus Infused Dry Sauna & Royal Spa Retreat',
      kab: 'Eucalyptus Sauna'
    },
    description: {
      ar: 'استمتع بحرارة هادئة ومنعشة مجهزة بخلاصة زيوت الأوكالبتوس الطبيعية لتفتيح الرئتين والشعب الهوائية داخل هذا النادي الملكي الهادئ تليها غطسة جاكوزي دافئة وممتازة.',
      fr: 'Offrez-vous un moment divin dans notre sauna en pin scandinave enrichi aux vapeurs d\'eucalyptus. Hydro-massage inclus.',
      en: 'Recharge your breath in a luxury dry thermal suite featuring organic eucalyptus infusions. Deeply cleanses respiratory pathways and relaxes sore muscles.',
      kab: 'Sauna Eucalyptus'
    },
    location: {
      ar: 'حي شراقة، الشراقة، الجزائر العاصمة',
      fr: 'Cheraga, Alger',
      en: 'Cheraga, Algiers',
      kab: 'Cheraga'
    },
    wilaya: 'Alger',
    pricePerNight: 6500,
    rating: 4.96,
    reviewsCount: 29,
    images: [
      'https://images.unsplash.com/photo-1583416750470-965b2707b355?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80'
    ],
    hostName: 'المركز الصحي رويال شراقة',
    hostImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    beds: 1,
    bathrooms: 2,
    guests: 8,
    features: {
      ar: ['تبخير مستمر بزيت الأوكالبتوس واللافندر الملكي', 'صالة مغلقة مع غرف غيار فردية معقمة', 'مياه ينابيع عذبة ونعناع تقدم طيلة الجلسة', 'جلسة تدليك استرجاعي مخصصة للرياضيين'],
      fr: ['Vapeur aromatique d\'eucalyptus & lavande', 'Cabines de vestiaires privées et désinfectées', 'Eau détox fraîche infusée au citron', 'Massage de récupération pour sportifs d\'élite'],
      en: ['Continuous eucalyptus & lavender vapors', 'Fully private and sanitized dressing booths', 'Mineral water and fresh mint provided', 'Sport recovery deep pressure therapy session'],
      kab: ['Sauna']
    },
    reviews: []
  }
];




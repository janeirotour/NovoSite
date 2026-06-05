import { Link } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { type LucideIcon, Heart, Globe, Shield, Star, Users, Leaf, MapPin, Award, Landmark, CheckCircle2 } from "lucide-react";

const TX = {
  eyebrow:    { en: "Janeiro Tour & Travel",          es: "Janeiro Tour & Travel",              pt: "Janeiro Tour & Travel",              fr: "Janeiro Tour & Travel",               de: "Janeiro Tour & Travel",               no: "Janeiro Tour & Travel" },
  heroTitle:  { en: "A Story Built on Passion for Brazil", es: "Una Historia Construida con Pasión por Brasil", pt: "Uma História Construída com Paixão pelo Brasil", fr: "Une Histoire Fondée sur la Passion pour le Brésil", de: "Eine Geschichte, die von Leidenschaft für Brasilien geprägt ist", no: "En historie bygget på lidenskap for Brasil" },
  heroSub:    { en: "Born in Rio. Dedicated to showing the world the Brazil we love.", es: "Nacidos en Río. Dedicados a mostrar al mundo el Brasil que amamos.", pt: "Nascidos no Rio. Dedicados a mostrar ao mundo o Brasil que amamos.", fr: "Nés à Rio. Dédiés à montrer au monde le Brésil que nous aimons.", de: "In Rio geboren. Dem Ziel gewidmet, der Welt das Brasilien zu zeigen, das wir lieben.", no: "Født i Rio. Dedikert til å vise verden Brasil slik vi elsker det." },
  founderTag: { en: "Our Founder",                    es: "Nuestra Fundadora",                  pt: "Nossa Fundadora",                    fr: "Notre Fondatrice",                    de: "Unsere Gründerin",                    no: "Vår grunnlegger" },
  yearsLabel: { en: "Years of\nExcellence",           es: "Años de\nExcelencia",                pt: "Anos de\nExcelência",                fr: "Ans d'\nExcellence",                  de: "Jahre\nExzellenz",                    no: "År med\nexellens" },
  blackOwned: { en: "Black-owned Business",           es: "Empresa de Propietario Negro",       pt: "Empresa Negra",                      fr: "Entreprise Afro-fondée",              de: "Afro-geführtes Unternehmen",          no: "Svart eid bedrift" },
  afroPioneer:{ en: "Afrotourism Pioneer",            es: "Pionera del Afroturismo",            pt: "Pioneira do Afroturismo",            fr: "Pionnière de l'Afrotourisme",         de: "Afrotourismus-Pionierin",             no: "Afroturisme-pioner" },
  p1: { en: "At Janeiro Tour & Travel, our story is built on passion, authenticity and a deep love for Brazil.", es: "En Janeiro Tour & Travel, nuestra historia está construida sobre la pasión, la autenticidad y un profundo amor por Brasil.", pt: "Na Janeiro Tour & Travel, nossa história é construída sobre paixão, autenticidade e um amor profundo pelo Brasil.", fr: "Chez Janeiro Tour & Travel, notre histoire est fondée sur la passion, l'authenticité et un amour profond pour le Brésil.", de: "Bei Janeiro Tour & Travel ist unsere Geschichte auf Leidenschaft, Authentizität und tiefer Liebe zu Brasilien aufgebaut." },
  p2: { en: "Founded by Dandara — an Afro-Brazilian entrepreneur from Rio de Janeiro — Janeiro Tour & Travel was born from a simple belief: visitors deserve to experience Brazil beyond the postcards. They deserve genuine connections, local insights and unforgettable moments that reveal the true soul of the country.", es: "Fundada por Dandara — una emprendedora afrobrasileña de Río de Janeiro — Janeiro Tour & Travel nació de una simple creencia: los visitantes merecen experimentar Brasil más allá de las postales. Merecen conexiones genuinas, perspectivas locales y momentos inolvidables que revelen el verdadero alma del país.", pt: "Fundada por Dandara — uma empreendedora afro-brasileira do Rio de Janeiro — a Janeiro Tour & Travel nasceu de uma crença simples: os visitantes merecem experienciar o Brasil além dos cartões-postais. Merecem conexões genuínas, perspectivas locais e momentos inesquecíveis que revelam a verdadeira alma do país.", fr: "Fondée par Dandara — une entrepreneuse afro-brésilienne de Rio de Janeiro — Janeiro Tour & Travel est née d'une conviction simple : les visiteurs méritent de vivre le Brésil au-delà des cartes postales. Ils méritent des connexions authentiques, des perspectives locales et des moments inoubliables qui révèlent la véritable âme du pays.", de: "Gegründet von Dandara — einer afro-brasilianischen Unternehmerin aus Rio de Janeiro — entstand Janeiro Tour & Travel aus einem einfachen Glauben: Besucher verdienen es, Brasilien jenseits der Postkarten zu erleben. Sie verdienen echte Verbindungen, lokale Einblicke und unvergessliche Momente, die die wahre Seele des Landes enthüllen." },
  p3: { en: "Since 2014, we have been welcoming travelers from around the world and transforming ordinary trips into extraordinary memories. What began in Rio de Janeiro as a small project driven by passion and dedication has grown into a trusted travel company recognized for its personalized service, cultural immersion and commitment to excellence.", es: "Desde 2014, hemos recibido a viajeros de todo el mundo y transformado viajes ordinarios en memorias extraordinarias. Lo que comenzó en Río de Janeiro como un pequeño proyecto impulsado por pasión y dedicación se ha convertido en una empresa de viajes de confianza reconocida por su servicio personalizado, inmersión cultural y compromiso con la excelencia.", pt: "Desde 2014, recebemos viajantes de todo o mundo e transformamos viagens comuns em memórias extraordinárias. O que começou no Rio de Janeiro como um pequeno projeto movido por paixão e dedicação cresceu e se tornou uma empresa de viagens de confiança reconhecida por seu serviço personalizado, imersão cultural e compromisso com a excelência.", fr: "Depuis 2014, nous accueillons des voyageurs du monde entier et transformons des voyages ordinaires en souvenirs extraordinaires. Ce qui a commencé à Rio de Janeiro comme un petit projet animé par la passion et le dévouement est devenu une agence de voyages de confiance reconnue pour son service personnalisé, son immersion culturelle et son engagement envers l'excellence.", de: "Seit 2014 empfangen wir Reisende aus der ganzen Welt und verwandeln gewöhnliche Trips in außergewöhnliche Erinnerungen. Was in Rio de Janeiro als kleines, von Leidenschaft und Hingabe getriebenes Projekt begann, ist zu einem vertrauenswürdigen Reiseunternehmen gewachsen, das für seinen persönlichen Service, kulturelle Vertiefung und Engagement für Spitzenleistungen anerkannt ist." },
  fullStory:  { en: "The Full Story",                 es: "La Historia Completa",               pt: "A História Completa",                fr: "L'Histoire Complète",                 de: "Die ganze Geschichte",                no: "Den fulle historien" },
  whyWeDo:    { en: "Why We Do What We Do",           es: "Por Qué Hacemos Lo Que Hacemos",     pt: "Por Que Fazemos O Que Fazemos",      fr: "Pourquoi Nous Faisons Ce Que Nous Faisons", de: "Warum wir tun, was wir tun",        no: "Hvorfor vi gjør det vi gjør" },
  fs1: { en: "Our greatest inspiration has always been Brazil itself — its vibrant culture, breathtaking landscapes, rich history and warm people. Every tour, transfer, itinerary and travel package we create is carefully designed to showcase the country's beauty while respecting local communities, supporting sustainable tourism and delivering exceptional service.", es: "Nuestra mayor inspiración siempre ha sido el propio Brasil — su cultura vibrante, paisajes impresionantes, rica historia y gente cálida. Cada tour, traslado, itinerario y paquete de viaje que creamos está diseñado cuidadosamente para mostrar la belleza del país respetando las comunidades locales, apoyando el turismo sostenible y brindando un servicio excepcional.", pt: "Nossa maior inspiração sempre foi o próprio Brasil — sua cultura vibrante, paisagens deslumbrantes, história rica e povo caloroso. Cada tour, transfer, roteiro e pacote de viagem que criamos é cuidadosamente projetado para mostrar a beleza do país enquanto respeitamos as comunidades locais, apoiamos o turismo sustentável e entregamos um serviço excepcional.", fr: "Notre plus grande inspiration a toujours été le Brésil lui-même — sa culture vibrante, ses paysages époustouflants, sa riche histoire et ses gens chaleureux. Chaque tour, transfert, itinéraire et forfait de voyage que nous créons est soigneusement conçu pour mettre en valeur la beauté du pays tout en respectant les communautés locales, en soutenant le tourisme durable et en offrant un service exceptionnel.", de: "Unsere größte Inspiration war schon immer Brasilien selbst — seine lebendige Kultur, atemberaubende Landschaften, reiche Geschichte und herzliche Menschen. Jede Tour, jeder Transfer, jedes Reiseprogramm und jedes Reisepaket, das wir erstellen, ist sorgfältig darauf ausgelegt, die Schönheit des Landes zu präsentieren und dabei lokale Gemeinschaften zu respektieren, nachhaltigen Tourismus zu unterstützen und außergewöhnlichen Service zu bieten." },
  fs2: { en: "Over the years, we have built strong partnerships with some of Brazil's most talented guides, drivers and tourism professionals, allowing us to offer authentic experiences with the highest standards of quality and safety.", es: "A lo largo de los años, hemos construido sólidas asociaciones con algunos de los guías, conductores y profesionales del turismo más talentosos de Brasil, lo que nos permite ofrecer experiencias auténticas con los más altos estándares de calidad y seguridad.", pt: "Ao longo dos anos, construímos parcerias sólidas com alguns dos guias, motoristas e profissionais de turismo mais talentosos do Brasil, permitindo-nos oferecer experiências autênticas com os mais altos padrões de qualidade e segurança.", fr: "Au fil des ans, nous avons établi de solides partenariats avec certains des guides, chauffeurs et professionnels du tourisme les plus talentueux du Brésil, nous permettant d'offrir des expériences authentiques avec les plus hauts standards de qualité et de sécurité.", de: "Im Laufe der Jahre haben wir starke Partnerschaften mit einigen der talentiertesten Reiseführer, Fahrer und Tourismusprofis Brasiliens aufgebaut, die es uns ermöglichen, authentische Erlebnisse mit höchsten Qualitäts- und Sicherheitsstandards anzubieten." },
  fs3: { en: "Today, we proudly serve travelers from all over the world. Our multilingual team provides assistance in Portuguese, English, Spanish and French, ensuring that every guest feels welcome, comfortable and supported from the first contact to the final farewell.", es: "Hoy, atendemos con orgullo a viajeros de todo el mundo. Nuestro equipo multilingüe brinda asistencia en portugués, inglés, español y francés, asegurando que cada huésped se sienta bienvenido, cómodo y apoyado desde el primer contacto hasta la despedida final.", pt: "Hoje, servimos com orgulho viajantes de todo o mundo. Nossa equipe multilíngue presta assistência em português, inglês, espanhol e francês, garantindo que cada hóspede se sinta bem-vindo, confortável e apoiado desde o primeiro contato até a despedida final.", fr: "Aujourd'hui, nous servons fièrement des voyageurs du monde entier. Notre équipe multilingue fournit une assistance en portugais, anglais, espagnol et français, veillant à ce que chaque client se sente bienvenu, à l'aise et soutenu du premier contact à l'au revoir final.", de: "Heute betreuen wir stolz Reisende aus der ganzen Welt. Unser mehrsprachiges Team bietet Unterstützung auf Portugiesisch, Englisch, Spanisch und Französisch und stellt sicher, dass sich jeder Gast vom ersten Kontakt bis zum letzten Abschied willkommen, wohl und betreut fühlt." },
  fs4: { en: "More than a travel company, Janeiro Tour & Travel is a team of people who genuinely care about creating happiness through travel. Every reservation we receive is treated with dedication, responsibility and attention to detail — because we understand that every trip represents a dream, a celebration or a once-in-a-lifetime experience.", es: "Más que una empresa de viajes, Janeiro Tour & Travel es un equipo de personas que genuinamente se preocupan por crear felicidad a través del viaje. Cada reserva que recibimos es tratada con dedicación, responsabilidad y atención al detalle — porque entendemos que cada viaje representa un sueño, una celebración o una experiencia única en la vida.", pt: "Mais do que uma empresa de viagens, a Janeiro Tour & Travel é uma equipe de pessoas que genuinamente se preocupa em criar felicidade por meio das viagens. Cada reserva que recebemos é tratada com dedicação, responsabilidade e atenção aos detalhes — porque entendemos que cada viagem representa um sonho, uma celebração ou uma experiência única na vida.", fr: "Plus qu'une agence de voyages, Janeiro Tour & Travel est une équipe de personnes qui se soucie véritablement de créer du bonheur à travers le voyage. Chaque réservation que nous recevons est traitée avec dévouement, responsabilité et souci du détail — parce que nous comprenons que chaque voyage représente un rêve, une célébration ou une expérience unique dans une vie.", de: "Mehr als ein Reiseunternehmen ist Janeiro Tour & Travel ein Team von Menschen, denen es wirklich am Herzen liegt, durch Reisen Glück zu schaffen. Jede Reservierung, die wir erhalten, wird mit Hingabe, Verantwortung und Liebe zum Detail behandelt — denn wir verstehen, dass jede Reise einen Traum, eine Feier oder ein einzigartiges Erlebnis im Leben darstellt." },
  fs5: { en: "Our mission is simple: to help you discover the very best of Brazil through authentic experiences, trusted local expertise and unforgettable moments that stay with you long after your journey ends.", es: "Nuestra misión es simple: ayudarte a descubrir lo mejor de Brasil a través de experiencias auténticas, experiencia local de confianza y momentos inolvidables que permanezcan contigo mucho después de que termine tu viaje.", pt: "Nossa missão é simples: ajudá-lo a descobrir o melhor do Brasil por meio de experiências autênticas, expertise local de confiança e momentos inesquecíveis que ficam com você muito depois de sua viagem terminar.", fr: "Notre mission est simple : vous aider à découvrir le meilleur du Brésil grâce à des expériences authentiques, une expertise locale de confiance et des moments inoubliables qui restent avec vous longtemps après la fin de votre voyage.", de: "Unsere Mission ist einfach: Ihnen zu helfen, das Beste Brasiliens durch authentische Erlebnisse, vertrauenswürdige lokale Expertise und unvergessliche Momente zu entdecken, die noch lange nach Ihrer Reise bei Ihnen bleiben." },
  afroTitle:  { en: "Rooted in Afro-Brazilian Culture", es: "Arraigados en la Cultura Afrobrasileña", pt: "Enraizados na Cultura Afro-Brasileira", fr: "Enracinés dans la Culture Afro-Brésilienne", de: "Verwurzelt in der Afro-Brasilianischen Kultur", no: "Forankret i afro-brasiliansk kultur" },
  afroSub:    {
    en: "Janeiro Tour & Travel is proudly Black-owned — founded and led by an Afro-Brazilian woman. Our team reflects the rich diversity at the heart of Brazil, and our experiences are designed to celebrate, amplify and connect travelers with the Afro-Brazilian heritage that built this country.",
    es: "Janeiro Tour & Travel es orgullosamente propiedad de personas negras — fundada y dirigida por una mujer afrobrasileña. Nuestro equipo refleja la rica diversidad en el corazón de Brasil, y nuestras experiencias están diseñadas para celebrar, amplificar y conectar a los viajeros con el patrimonio afrobrasileño que construyó este país.",
    pt: "A Janeiro Tour & Travel é orgulhosamente de propriedade negra — fundada e liderada por uma mulher afro-brasileira. Nossa equipe reflete a rica diversidade no coração do Brasil, e nossas experiências são projetadas para celebrar, amplificar e conectar os viajantes ao patrimônio afro-brasileiro que construiu este país.",
    fr: "Janeiro Tour & Travel est fièrement dirigée par une personne noire — fondée et menée par une femme afro-brésilienne. Notre équipe reflète la riche diversité au cœur du Brésil, et nos expériences sont conçues pour célébrer, amplifier et connecter les voyageurs avec le patrimoine afro-brésilien qui a construit ce pays.",
    de: "Janeiro Tour & Travel ist stolz afro-geführt — gegründet und geleitet von einer afro-brasilianischen Frau. Unser Team spiegelt die reiche Vielfalt im Herzen Brasiliens wider, und unsere Erlebnisse sind darauf ausgelegt, Reisende mit dem afro-brasilianischen Erbe zu verbinden, das dieses Land aufgebaut hat.",
  },
  card1t:     { en: "Black-owned Business",            es: "Empresa de Propietario Negro",       pt: "Empresa Negra",                      fr: "Entreprise Afro-fondée",              de: "Afro-geführtes Unternehmen",          no: "Svart eid bedrift" },
  card1d:     { en: "Founded, led and operated by a Black entrepreneur from Rio de Janeiro. We are proud to represent Black excellence in Brazilian tourism.", es: "Fundada, dirigida y operada por una empresaria negra de Río de Janeiro. Estamos orgullosos de representar la excelencia negra en el turismo brasileño.", pt: "Fundada, liderada e operada por uma empreendedora negra do Rio de Janeiro. Temos orgulho de representar a excelência negra no turismo brasileiro.", fr: "Fondée, dirigée et exploitée par une entrepreneuse noire de Rio de Janeiro. Nous sommes fiers de représenter l'excellence noire dans le tourisme brésilien.", de: "Gegründet, geleitet und betrieben von einer schwarzen Unternehmerin aus Rio de Janeiro. Wir sind stolz darauf, schwarze Exzellenz im brasilianischen Tourismus zu repräsentieren.", no: "Grunnlagt, ledet og drevet av en svart gründer fra Rio de Janeiro. Vi er stolte av å representere svart eksellens i brasiliansk turisme." },
  card2t:     { en: "Afro Team",                       es: "Equipo Afro",                        pt: "Equipe Afro",                         fr: "Équipe Afro",                         de: "Afro-Team",                           no: "Afro-team" },
  card2d:     { en: "Our team is a direct reflection of Brazil's Afro-Brazilian community — guides, storytellers and culture-bearers who share their heritage with every guest.", es: "Nuestro equipo es un reflejo directo de la comunidad afrobrasileña de Brasil — guías, narradores y portadores de cultura que comparten su herencia con cada huésped.", pt: "Nossa equipe é um reflexo direto da comunidade afro-brasileira do Brasil — guias, contadores de histórias e portadores de cultura que compartilham sua herança com cada hóspede.", fr: "Notre équipe est le reflet direct de la communauté afro-brésilienne du Brésil — guides, conteurs et porteurs de culture qui partagent leur patrimoine avec chaque client.", de: "Unser Team ist ein direktes Spiegelbild der afro-brasilianischen Gemeinschaft Brasiliens — Reiseführer, Geschichtenerzähler und Kulturvermittler, die ihr Erbe mit jedem Gast teilen.", no: "Teamet vårt er et direkte speilbilde av Brasils afro-brasilianske samfunn — guider, historiefortellere og kulturbærere som deler sitt arv med hver gjest." },
  card3t:     { en: "Afrotourism",                     es: "Afroturismo",                        pt: "Afroturismo",                         fr: "Afrotourisme",                        de: "Afrotourismus",                       no: "Afroturisme" },
  card3d:     { en: "We specialize in experiences that honor Black culture, history and traditions — from Little Africa in Rio to Afro-Brazilian roots in Salvador, Bahia.", es: "Nos especializamos en experiencias que honran la cultura, historia y tradiciones negras — desde el Pequeño África en Río hasta las raíces afrobrasileñas en Salvador, Bahía.", pt: "Somos especializados em experiências que honram a cultura, história e tradições negras — do Pequeno África no Rio às raízes afro-brasileiras em Salvador, Bahia.", fr: "Nous nous spécialisons dans des expériences qui honorent la culture, l'histoire et les traditions noires — de la Petite Afrique à Rio aux racines afro-brésiliennes à Salvador, Bahia.", de: "Wir sind auf Erlebnisse spezialisiert, die die schwarze Kultur, Geschichte und Traditionen ehren — von Kleinen Afrika in Rio bis zu den afro-brasilianischen Wurzeln in Salvador, Bahia.", no: "Vi spesialiserer oss på opplevelser som ærer svart kultur, historie og tradisjoner — fra Lille Afrika i Rio til afro-brasilianske røtter i Salvador, Bahia." },
  quote:      {
    en: "\"Brazil's greatest beauty is its people — and Afro-Brazilian culture is the beating heart of everything that makes this country extraordinary. We share it with pride.\"",
    es: "\"La mayor belleza de Brasil es su gente — y la cultura afrobrasileña es el corazón palpitante de todo lo que hace a este país extraordinario. La compartimos con orgullo.\"",
    pt: "\"A maior beleza do Brasil é seu povo — e a cultura afro-brasileira é o coração pulsante de tudo o que torna este país extraordinário. Compartilhamos isso com orgulho.\"",
    fr: "\"La plus grande beauté du Brésil, c'est son peuple — et la culture afro-brésilienne est le cœur battant de tout ce qui rend ce pays extraordinaire. Nous la partageons avec fierté.\"",
    de: "\"Brasiliens größte Schönheit ist sein Volk — und die afro-brasilianische Kultur ist das schlagende Herz von allem, was dieses Land außergewöhnlich macht. Wir teilen sie mit Stolz.\"",
  },
  recognition:{ en: "Official Recognition",           es: "Reconocimiento Oficial",             pt: "Reconhecimento Oficial",              fr: "Reconnaissance Officielle",           de: "Offizielle Anerkennung",              no: "Offisiell anerkjennelse" },
  recTitle:   { en: "Motion of Recognition and Praise", es: "Moción de Reconocimiento y Elogio", pt: "Moção de Reconhecimento e Louvor", fr: "Motion de Reconnaissance et d'Éloge", de: "Anerkennungsmotión und Lob",          no: "Anerkjennelses- og honnørmotasjon" },
  recSub:     { en: "Rio de Janeiro City Council · 2022", es: "Câmara Municipal de Río de Janeiro · 2022", pt: "Câmara Municipal do Rio de Janeiro · 2022", fr: "Conseil Municipal de Rio de Janeiro · 2022", de: "Stadtrat von Rio de Janeiro · 2022",   no: "Bystyret i Rio de Janeiro · 2022" },
  rec1:       { en: "On May 3, 2022, the Rio de Janeiro City Council awarded", es: "El 3 de mayo de 2022, la Câmara Municipal de Río de Janeiro otorgó a", pt: "Em 3 de maio de 2022, a Câmara Municipal do Rio de Janeiro concedeu a", fr: "Le 3 mai 2022, le Conseil Municipal de Rio de Janeiro a décerné à", de: "Am 3. Mai 2022 verlieh der Stadtrat von Rio de Janeiro", no: "Den 3. mai 2022 tildelte bystyret i Rio de Janeiro" },
  rec1b:      { en: "an official Motion of Recognition and Praise for her outstanding contribution to tourism in the city of Rio de Janeiro.", es: "una Moción Oficial de Reconocimiento y Elogio por su destacada contribución al turismo en la ciudad de Río de Janeiro.", pt: "uma Moção Oficial de Reconhecimento e Louvor por sua contribuição excepcional ao turismo na cidade do Rio de Janeiro.", fr: "une Motion Officielle de Reconnaissance et d'Éloge pour sa contribution exceptionnelle au tourisme dans la ville de Rio de Janeiro.", de: "eine offizielle Anerkennungsmotión und Lob für ihren herausragenden Beitrag zum Tourismus in der Stadt Rio de Janeiro.", no: "en offisiell anerkjennelses- og honnørmotasjon for hennes fremragende bidrag til turismen i Rio de Janeiro." },
  rec2:       { en: "The recognition highlights her dedication to promoting the cultural, historical and social richness of Rio de Janeiro — connecting visitors from around the world with the authentic spirit of the city through immersive, community-rooted experiences.", es: "El reconocimiento destaca su dedicación a promover la riqueza cultural, histórica y social de Río de Janeiro — conectando a visitantes de todo el mundo con el espíritu auténtico de la ciudad a través de experiencias inmersivas y enraizadas en la comunidad.", pt: "O reconhecimento destaca sua dedicação em promover a riqueza cultural, histórica e social do Rio de Janeiro — conectando visitantes de todo o mundo com o espírito autêntico da cidade por meio de experiências imersivas e enraizadas na comunidade.", fr: "La reconnaissance souligne son dévouement à promouvoir la richesse culturelle, historique et sociale de Rio de Janeiro — en connectant les visiteurs du monde entier avec l'esprit authentique de la ville à travers des expériences immersives et ancrées dans la communauté.", de: "Die Anerkennung unterstreicht ihr Engagement bei der Förderung des kulturellen, historischen und sozialen Reichtums von Rio de Janeiro — indem sie Besucher aus aller Welt mit dem authentischen Geist der Stadt durch immersive, gemeinschaftsverankerte Erlebnisse verbindet." },
  rec3:       { en: "The motion was signed by City Councilwoman", es: "La moción fue firmada por la concejala", pt: "A moção foi assinada pela vereadora", fr: "La motion a été signée par la conseillère municipale", de: "Die Motion wurde von Stadträtin",      no: "Motasjonen ble signert av bystyremedlem" },
  rec3b:      { en: "at the Teotônio Villela Assembly Chamber.", es: "en la Cámara de Asamblea Teotônio Villela.", pt: "na Câmara de Assembleia Teotônio Villela.", fr: "à la Chambre d'Assemblée Teotônio Villela.", de: "im Teotônio-Villela-Versammlungssaal unterzeichnet.", no: "i Teotônio Villela-forsamlingskammeret." },
  timeline:   { en: "Timeline",                        es: "Línea de Tiempo",                    pt: "Linha do Tempo",                     fr: "Chronologie",                         de: "Zeitleiste",                          no: "Tidslinje" },
  journey:    { en: "Our Journey",                     es: "Nuestro Camino",                     pt: "Nossa Jornada",                      fr: "Notre Parcours",                      de: "Unser Weg",                           no: "Vår reise" },
  standFor:   { en: "What We Stand For",               es: "En Qué Creemos",                     pt: "No Que Acreditamos",                 fr: "Ce En Quoi Nous Croyons",             de: "Wofür wir stehen",                    no: "Hva vi tror på" },
  ourValues:  { en: "Our Values",                      es: "Nuestros Valores",                   pt: "Nossos Valores",                     fr: "Nos Valeurs",                         de: "Unsere Werte",                        no: "Våre verdier" },
  diff:       { en: "The Difference",                  es: "La Diferencia",                      pt: "A Diferença",                        fr: "La Différence",                       de: "Der Unterschied",                     no: "Forskjellen" },
  whyUs:      { en: "Why Travel With Us",              es: "Por Qué Viajar Con Nosotros",        pt: "Por Que Viajar Conosco",             fr: "Pourquoi Voyager Avec Nous",          de: "Warum mit uns reisen",                no: "Hvorfor reise med oss" },
  whyUsSub:   { en: "We are not a generic travel operator. We are your dedicated Brazil specialists — committed to your journey from first contact to final farewell.", es: "No somos un operador turístico genérico. Somos tus especialistas dedicados en Brasil — comprometidos con tu viaje desde el primer contacto hasta la despedida final.", pt: "Não somos um operador turístico genérico. Somos seus especialistas dedicados no Brasil — comprometidos com sua viagem do primeiro contato até a despedida final.", fr: "Nous ne sommes pas un opérateur touristique générique. Nous sommes vos spécialistes dédiés au Brésil — engagés dans votre voyage du premier contact au dernier au revoir.", de: "Wir sind kein generischer Reiseveranstalter. Wir sind Ihre dedizierten Brasilien-Spezialisten — vom ersten Kontakt bis zum letzten Abschied für Ihre Reise engagiert.", no: "Vi er ikke en generisk reiseoperatør. Vi er dine dedikerte Brasil-spesialister — engasjert i din reise fra første kontakt til siste avskjed." },
  travelersSay:{ en: "What Travelers Say",             es: "Lo Que Dicen los Viajeros",          pt: "O Que os Viajantes Dizem",           fr: "Ce Que Disent les Voyageurs",         de: "Was Reisende sagen",                  no: "Hva reisende sier" },
  tripadvisor: { en: "Tripadvisor Reviews",            es: "Reseñas de Tripadvisor",             pt: "Avaliações no Tripadvisor",          fr: "Avis Tripadvisor",                    de: "Tripadvisor-Bewertungen",             no: "Tripadvisor-anmeldelser" },
  tripSub:    { en: "We're proud of every review — they reflect years of dedication, care and passion for what we do.", es: "Estamos orgullosos de cada reseña — reflejan años de dedicación, cuidado y pasión por lo que hacemos.", pt: "Somos orgulhosos de cada avaliação — elas refletem anos de dedicação, cuidado e paixão pelo que fazemos.", fr: "Nous sommes fiers de chaque avis — ils reflètent des années de dévouement, de soin et de passion pour ce que nous faisons.", de: "Wir sind stolz auf jede Bewertung — sie spiegeln Jahre der Hingabe, Fürsorge und Leidenschaft für das wider, was wir tun." },
  tripView:   { en: "View all reviews on Tripadvisor ↗", es: "Ver todas las reseñas en Tripadvisor ↗", pt: "Ver todas as avaliações no Tripadvisor ↗", fr: "Voir tous les avis sur Tripadvisor ↗", de: "Alle Bewertungen auf Tripadvisor ansehen ↗" },
  welcome:    { en: "Welcome to Brasil",               es: "Bienvenido a Brasil",                pt: "Bem-vindo ao Brasil",                fr: "Bienvenue au Brésil",                 de: "Willkommen in Brasilien" },
  ctaTitle:   { en: "Experience the Authentic Soul of Brazil", es: "Experimenta el Alma Auténtica de Brasil", pt: "Experiencie a Alma Autêntica do Brasil", fr: "Vivez l'Âme Authentique du Brésil", de: "Erleben Sie die authentische Seele Brasiliens" },
  ctaSub:     { en: "Welcome to Brazil. Welcome to Janeiro Tour & Travel.", es: "Bienvenido a Brasil. Bienvenido a Janeiro Tour & Travel.", pt: "Bem-vindo ao Brasil. Bem-vindo à Janeiro Tour & Travel.", fr: "Bienvenue au Brésil. Bienvenue chez Janeiro Tour & Travel.", de: "Willkommen in Brasilien. Willkommen bei Janeiro Tour & Travel." },
  explore:    { en: "Explore Experiences",             es: "Explorar Experiencias",              pt: "Explorar Experiências",              fr: "Explorer les Expériences",            de: "Erlebnisse Erkunden" },
  talkToUs:   { en: "Talk to Us",                      es: "Habla con Nosotros",                 pt: "Fale Conosco",                       fr: "Nous Parler",                         de: "Sprechen Sie mit uns" },
} as const;

const VALUES_KEYS = [
  { icon: Heart, titleKey: "v1t", descKey: "v1d" },
  { icon: Globe, titleKey: "v2t", descKey: "v2d" },
  { icon: Leaf,  titleKey: "v3t", descKey: "v3d" },
  { icon: Star,  titleKey: "v4t", descKey: "v4d" },
] as const;

const VALUES_TX = {
  v1t: { en: "Authenticity",       es: "Autenticidad",        pt: "Autenticidade",       fr: "Authenticité",        de: "Authentizität" },
  v1d: { en: "We share the Brazil we know and love — not a curated postcard version, but the real, breathing, vibrant country.", es: "Compartimos el Brasil que conocemos y amamos — no una versión de postal curada, sino el país real, vivo y vibrante.", pt: "Compartilhamos o Brasil que conhecemos e amamos — não uma versão de cartão-postal curada, mas o país real, vivo e vibrante.", fr: "Nous partageons le Brésil que nous connaissons et aimons — pas une version carte postale curatée, mais le pays réel, vivant et vibrant.", de: "Wir teilen das Brasilien, das wir kennen und lieben — keine kuratierte Postkartenversion, sondern das echte, lebendige, vibrierende Land." },
  v2t: { en: "Cultural Immersion", es: "Inmersión Cultural",  pt: "Imersão Cultural",    fr: "Immersion Culturelle", de: "Kulturelle Vertiefung" },
  v2d: { en: "Every experience is designed to connect you with local people, stories, and traditions that rarely make it into guidebooks.", es: "Cada experiencia está diseñada para conectarte con personas, historias y tradiciones locales que raramente aparecen en las guías de viaje.", pt: "Cada experiência é projetada para conectá-lo com pessoas, histórias e tradições locais que raramente aparecem nos guias de viagem.", fr: "Chaque expérience est conçue pour vous connecter avec des personnes, des histoires et des traditions locales qui figurent rarement dans les guides de voyage.", de: "Jedes Erlebnis ist darauf ausgelegt, Sie mit lokalen Menschen, Geschichten und Traditionen zu verbinden, die selten in Reiseführern auftauchen." },
  v3t: { en: "Sustainable Tourism", es: "Turismo Sostenible", pt: "Turismo Sustentável", fr: "Tourisme Durable",     de: "Nachhaltiger Tourismus" },
  v3d: { en: "We support local communities, respect natural environments, and believe travel should leave places better than we found them.", es: "Apoyamos las comunidades locales, respetamos los entornos naturales y creemos que el viaje debe dejar los lugares mejor de como los encontramos.", pt: "Apoiamos as comunidades locais, respeitamos os ambientes naturais e acreditamos que as viagens devem deixar os lugares melhores do que os encontramos.", fr: "Nous soutenons les communautés locales, respectons les environnements naturels et croyons que le voyage devrait laisser les endroits meilleurs que nous les avons trouvés.", de: "Wir unterstützen lokale Gemeinschaften, respektieren natürliche Umgebungen und glauben, dass das Reisen Orte besser hinterlassen sollte, als wir sie vorgefunden haben." },
  v4t: { en: "Excellence in Service", es: "Excelencia en el Servicio", pt: "Excelência no Serviço", fr: "Excellence du Service", de: "Exzellenz im Service" },
  v4d: { en: "From the first message to the final farewell, we hold ourselves to the highest standards of quality, care, and attention.", es: "Desde el primer mensaje hasta la despedida final, nos mantenemos a los más altos estándares de calidad, cuidado y atención.", pt: "Do primeiro e-mail até a despedida final, mantemo-nos nos mais altos padrões de qualidade, cuidado e atenção.", fr: "Du premier message à l'au revoir final, nous nous tenons aux normes les plus élevées de qualité, de soin et d'attention.", de: "Von der ersten Nachricht bis zum letzten Abschied halten wir uns an höchste Qualitäts-, Sorgfalts- und Aufmerksamkeitsstandards." },
} as const;

const WHY_TX = {
  w1t: { en: "Local Expertise Since 2014", es: "Experiencia Local desde 2014", pt: "Experiência Local desde 2014", fr: "Expertise Locale depuis 2014", de: "Lokales Fachwissen seit 2014" },
  w1d: { en: "Over a decade guiding travelers from around the world through Brazil's most iconic and hidden destinations.", es: "Más de una década guiando a viajeros de todo el mundo por los destinos más icónicos y ocultos de Brasil.", pt: "Mais de uma década guiando viajantes de todo o mundo pelos destinos mais icônicos e escondidos do Brasil.", fr: "Plus d'une décennie à guider des voyageurs du monde entier à travers les destinations les plus emblématiques et cachées du Brésil.", de: "Über ein Jahrzehnt lang führen wir Reisende aus aller Welt durch Brasiliens ikonischste und versteckteste Reiseziele." },
  w2t: { en: "Carefully Curated Experiences", es: "Experiencias Cuidadosamente Curadas", pt: "Experiências Cuidadosamente Curadas", fr: "Expériences Soigneusement Sélectionnées", de: "Sorgfältig kuratierte Erlebnisse" },
  w2d: { en: "Every tour, transfer, and itinerary is thoughtfully designed to showcase Brazil's beauty and culture.", es: "Cada tour, traslado e itinerario está diseñado cuidadosamente para mostrar la belleza y cultura de Brasil.", pt: "Cada tour, transfer e roteiro é cuidadosamente projetado para mostrar a beleza e cultura do Brasil.", fr: "Chaque tour, transfert et itinéraire est soigneusement conçu pour mettre en valeur la beauté et la culture du Brésil.", de: "Jede Tour, jeder Transfer und jedes Reiseprogramm ist durchdacht gestaltet, um Brasiliens Schönheit und Kultur zu präsentieren." },
  w3t: { en: "Multilingual Team", es: "Equipo Multilingüe", pt: "Equipe Multilíngue", fr: "Équipe Multilingue", de: "Mehrsprachiges Team" },
  w3d: { en: "Our team assists guests in Portuguese, English, Spanish and French — so you always feel at home.", es: "Nuestro equipo asiste a los huéspedes en portugués, inglés, español y francés — para que siempre te sientas como en casa.", pt: "Nossa equipe assiste hóspedes em português, inglês, espanhol e francês — para que você sempre se sinta em casa.", fr: "Notre équipe assiste les clients en portugais, anglais, espagnol et français — pour que vous vous sentiez toujours chez vous.", de: "Unser Team unterstützt Gäste auf Portugiesisch, Englisch, Spanisch und Französisch — damit Sie sich immer wie zu Hause fühlen." },
  w4t: { en: "Trusted & Licensed", es: "Confiables y Licenciados", pt: "Confiáveis e Licenciados", fr: "Fiables & Certifiés", de: "Vertrauenswürdig & Lizenziert" },
  w4d: { en: "Fully certified travel operator. Thousands of international travelers have placed their trust in us.", es: "Operador turístico completamente certificado. Miles de viajeros internacionales han depositado su confianza en nosotros.", pt: "Operador turístico totalmente certificado. Milhares de viajantes internacionais depositaram sua confiança em nós.", fr: "Opérateur touristique entièrement certifié. Des milliers de voyageurs internationaux nous ont accordé leur confiance.", de: "Vollständig zertifizierter Reiseveranstalter. Tausende internationaler Reisender haben ihr Vertrauen in uns gesetzt." },
  w5t: { en: "Dedicated Personal Service", es: "Servicio Personal Dedicado", pt: "Serviço Pessoal Dedicado", fr: "Service Personnel Dédié", de: "Persönlicher Dedizierter Service" },
  w5d: { en: "Every reservation is treated with dedication and responsibility — because every trip represents a dream.", es: "Cada reserva es tratada con dedicación y responsabilidad — porque cada viaje representa un sueño.", pt: "Cada reserva é tratada com dedicação e responsabilidade — porque cada viagem representa um sonho.", fr: "Chaque réservation est traitée avec dévouement et responsabilité — car chaque voyage représente un rêve.", de: "Jede Reservierung wird mit Hingabe und Verantwortung behandelt — denn jede Reise repräsentiert einen Traum." },
  w6t: { en: "Community & Sustainability", es: "Comunidad y Sostenibilidad", pt: "Comunidade e Sustentabilidade", fr: "Communauté & Durabilité", de: "Gemeinschaft & Nachhaltigkeit" },
  w6d: { en: "We partner with local guides, support communities, and practice responsible tourism at every step.", es: "Colaboramos con guías locales, apoyamos comunidades y practicamos el turismo responsable en cada paso.", pt: "Colaboramos com guias locais, apoiamos comunidades e praticamos o turismo responsável em cada etapa.", fr: "Nous nous associons à des guides locaux, soutenons les communautés et pratiquons le tourisme responsable à chaque étape.", de: "Wir arbeiten mit lokalen Reiseführern zusammen, unterstützen Gemeinschaften und praktizieren verantwortungsbewussten Tourismus bei jedem Schritt." },
} as const;

const JOURNEY_TX = {
  y2014: { en: "Dandara began her career promoting local excursions for Brazilians — learning the country from the inside out, building knowledge that no guidebook can teach.", es: "Dandara comenzó su carrera promoviendo excursiones locales para brasileños — aprendiendo el país desde adentro, construyendo conocimiento que ninguna guía puede enseñar.", pt: "Dandara começou sua carreira promovendo excursões locais para brasileiros — aprendendo o país de dentro para fora, construindo um conhecimento que nenhum guia pode ensinar.", fr: "Dandara a commencé sa carrière en promouvant des excursions locales pour les Brésiliens — apprenant le pays de l'intérieur, construisant des connaissances qu'aucun guide ne peut enseigner.", de: "Dandara begann ihre Karriere damit, lokale Ausflüge für Brasilianer zu fördern — das Land von innen heraus kennenzulernend und Wissen aufzubauen, das kein Reiseführer lehren kann." },
  y2016: { en: "The doors opened to international travelers. The Little Africa Walking Tour launched, along with tours to other Brazilian states — a turning point that defined our identity.", es: "Las puertas se abrieron a los viajeros internacionales. Se lanzó el Little Africa Walking Tour, junto con tours a otros estados brasileños — un punto de inflexión que definió nuestra identidad.", pt: "As portas se abriram para viajantes internacionais. O Little Africa Walking Tour foi lançado, junto com tours para outros estados brasileiros — um ponto de virada que definiu nossa identidade.", fr: "Les portes se sont ouvertes aux voyageurs internationaux. Le Little Africa Walking Tour a été lancé, ainsi que des tours vers d'autres États brésiliens — un tournant qui a défini notre identité.", de: "Die Türen öffneten sich für internationale Reisende. Der Little Africa Walking Tour wurde gestartet, zusammen mit Touren in andere brasilianische Bundesstaaten — ein Wendepunkt, der unsere Identität prägte." },
  y2020: { en: "We launched fully customized packages for international travelers exploring Bahia, Foz do Iguaçu, Recife and São Paulo — covering events, leisure and business travel — while also expanding into B2B partnerships with international agencies.", es: "Lanzamos paquetes totalmente personalizados para viajeros internacionales que exploran Bahía, Foz do Iguaçu, Recife y São Paulo — cubriendo eventos, ocio y viajes de negocios — y también expandiéndonos hacia asociaciones B2B con agencias internacionales.", pt: "Lançamos pacotes totalmente personalizados para viajantes internacionais que exploram a Bahia, Foz do Iguaçu, Recife e São Paulo — abrangendo eventos, lazer e viagens de negócios — enquanto também expandíamos para parcerias B2B com agências internacionais.", fr: "Nous avons lancé des forfaits entièrement personnalisés pour les voyageurs internationaux explorant Bahia, Foz do Iguaçu, Recife et São Paulo — couvrant les événements, les loisirs et les voyages d'affaires — tout en développant des partenariats B2B avec des agences internationales.", de: "Wir haben vollständig maßgeschneiderte Pakete für internationale Reisende gestartet, die Bahia, Foz do Iguaçu, Recife und São Paulo erkunden — für Events, Freizeit und Geschäftsreisen — und haben gleichzeitig B2B-Partnerschaften mit internationalen Agenturen ausgebaut." },
  yToday:{ en: "A trusted partner for thousands of travelers from around the world, serving five iconic Brazilian destinations with the same passion and dedication we started with.", es: "Un socio de confianza para miles de viajeros de todo el mundo, sirviendo cinco destinos brasileños icónicos con la misma pasión y dedicación con la que empezamos.", pt: "Um parceiro de confiança para milhares de viajantes de todo o mundo, atendendo cinco destinos brasileiros icônicos com a mesma paixão e dedicação com que começamos.", fr: "Un partenaire de confiance pour des milliers de voyageurs du monde entier, desservant cinq destinations brésiliennes emblématiques avec la même passion et le même dévouement avec lesquels nous avons commencé.", de: "Ein vertrauenswürdiger Partner für Tausende von Reisenden aus aller Welt, der fünf ikonische brasilianische Reiseziele mit derselben Leidenschaft und Hingabe bedient, mit der wir begonnen haben." },
  today: { en: "Today", es: "Hoy", pt: "Hoje", fr: "Aujourd'hui", de: "Heute" },
} as const;

export default function AboutPage() {
  const { lang } = useLanguage();

  const tx = (key: keyof typeof TX) => TX[key][lang as keyof typeof TX[typeof key]] ?? TX[key]["en"];
  const vtx = (key: keyof typeof VALUES_TX) => VALUES_TX[key][lang as keyof typeof VALUES_TX[typeof key]] ?? VALUES_TX[key]["en"];
  const wtx = (key: keyof typeof WHY_TX) => WHY_TX[key][lang as keyof typeof WHY_TX[typeof key]] ?? WHY_TX[key]["en"];
  const jtx = (key: keyof typeof JOURNEY_TX) => JOURNEY_TX[key][lang as keyof typeof JOURNEY_TX[typeof key]] ?? JOURNEY_TX[key]["en"];

  const values = [
    { icon: Heart, title: vtx("v1t"), desc: vtx("v1d") },
    { icon: Globe, title: vtx("v2t"), desc: vtx("v2d") },
    { icon: Leaf,  title: vtx("v3t"), desc: vtx("v3d") },
    { icon: Star,  title: vtx("v4t"), desc: vtx("v4d") },
  ];

  const whyUs = [
    { icon: Globe,  title: wtx("w1t"), desc: wtx("w1d") },
    { icon: Star,   title: wtx("w2t"), desc: wtx("w2d") },
    { icon: Users,  title: wtx("w3t"), desc: wtx("w3d") },
    { icon: Shield, title: wtx("w4t"), desc: wtx("w4d") },
    { icon: Heart,  title: wtx("w5t"), desc: wtx("w5d") },
    { icon: Leaf,   title: wtx("w6t"), desc: wtx("w6d") },
  ];

  const journey = [
    { year: "2014",        text: jtx("y2014") },
    { year: "2016",        text: jtx("y2016") },
    { year: "2020",        text: jtx("y2020") },
    { year: jtx("today"),  text: jtx("yToday") },
  ];

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
        <img src="https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1600&q=80" alt="Rio de Janeiro — Janeiro Tour & Travel" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="eyebrow text-[#FFB600] mb-5">{tx("eyebrow")}</p>
          <h1 className="text-[2.75rem] md:text-6xl font-bold text-white mb-5 max-w-3xl leading-[1.1]">{tx("heroTitle")}</h1>
          <p className="text-white/75 text-lg md:text-xl max-w-2xl leading-relaxed">{tx("heroSub")}</p>
        </div>
      </section>

      {/* Founder Story */}
      <section id="our-story" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100">
                <img src="/images/team-carnival.jpg" alt="Dandara — Founder of Janeiro Tour & Travel" className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80"; }} />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-[#FFB600] text-black px-6 py-4 rounded-2xl shadow-lg hidden md:block">
                <p className="font-bold text-2xl leading-none">10+</p>
                <p className="text-xs font-semibold mt-1 leading-tight whitespace-pre-line">{tx("yearsLabel")}</p>
              </div>
            </div>
            <div>
              <p className="eyebrow text-[#FFB600] mb-5">{tx("founderTag")}</p>
              <h2 className="font-bold text-3xl md:text-[2.75rem] text-gray-900 mb-4 leading-tight">Meet Dandara</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#3d1c00] text-[#f5c07a]">
                  <Shield size={11} /> {tx("blackOwned")}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#009743]/10 text-[#009743]">
                  {tx("afroPioneer")}
                </span>
              </div>
              <div className="space-y-4 text-gray-600 text-base leading-[1.8]">
                <p>{tx("p1")}</p>
                <p>{tx("p2")}</p>
                <p>{tx("p3")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full story */}
      <section className="py-20 bg-[#fafaf8]">
        <div className="max-w-3xl mx-auto px-4">
          <p className="eyebrow text-[#FFB600] mb-4 text-center">{tx("fullStory")}</p>
          <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-10 text-center leading-tight">{tx("whyWeDo")}</h2>
          <div className="space-y-5 text-gray-600 text-base leading-[1.8]">
            <p>{tx("fs1")}</p>
            <p>{tx("fs2")}</p>
            <p>{tx("fs3")}</p>
            <p>{tx("fs4")}</p>
            <p className="font-medium text-gray-800">{tx("fs5")}</p>
          </div>
        </div>
      </section>

      {/* Afro-Tourism */}
      <section className="py-24 bg-[#141210] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1598977054078-a4dd2d53c2ef?w=1400&q=60')] bg-cover bg-center" />
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#f5c07a]/15 text-[#f5c07a] tracking-[0.06em] mb-5">
              <Shield size={12} /> {tx("blackOwned")} · {tx("card3t")}
            </span>
            <h2 className="font-bold text-3xl md:text-4xl text-white mb-5 leading-tight">{tx("afroTitle")}</h2>
            <p className="text-white/65 text-base max-w-2xl mx-auto leading-relaxed">{tx("afroSub")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            {(
              [
                { icon: Shield as LucideIcon, title: tx("card1t"), desc: tx("card1d") },
                { icon: Users  as LucideIcon, title: tx("card2t"), desc: tx("card2d") },
                { icon: Globe  as LucideIcon, title: tx("card3t"), desc: tx("card3d") },
              ] as Array<{ icon: LucideIcon; title: string; desc: string }>
            ).map((item) => (
              <div key={item.title} className="bg-white/6 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors">
                <item.icon size={28} className="text-[#f5c07a] mb-5" />
                <h3 className="font-bold text-white text-base mb-3">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <blockquote className="max-w-2xl mx-auto text-center">
            <p className="text-white/80 text-lg italic leading-relaxed mb-4">{tx("quote")}</p>
            <cite className="text-[#f5c07a] text-sm font-semibold not-italic">— Dandara, Founder of Janeiro Tour &amp; Travel</cite>
          </blockquote>
        </div>
      </section>

      {/* Official Recognition */}
      <section className="py-24 bg-[#fafaf8]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative flex justify-center">
              <div className="relative max-w-sm w-full">
                <div className="absolute -inset-3 rounded-3xl bg-[#FFB600]/15 blur-xl" />
                <img src="/images/mocao-camara-rio.jpeg" alt="Moção de Reconhecimento — Câmara Municipal do Rio de Janeiro" className="relative rounded-2xl shadow-2xl w-full border border-gray-200" />
                <div className="absolute -bottom-4 -right-4 bg-[#009743] text-white px-5 py-3 rounded-xl shadow-lg text-xs font-bold leading-snug hidden md:block">
                  <p>03 maio 2022</p>
                  <p className="font-normal opacity-80">Câmara Municipal RJ</p>
                </div>
              </div>
            </div>
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#009743]/10 text-[#009743] tracking-[0.06em] mb-5">
                <Award size={12} /> {tx("recognition")}
              </span>
              <h2 className="font-bold text-3xl md:text-[2.75rem] text-gray-900 mb-5 leading-tight">{tx("recTitle")}</h2>
              <p className="text-[#FFB600] font-semibold text-sm mb-6">{tx("recSub")}</p>
              <div className="space-y-4 text-gray-600 text-base leading-[1.8] mb-8">
                <p>{tx("rec1")} <strong className="text-gray-800">Dandara de Souza Siqueira</strong> {tx("rec1b")}</p>
                <p>{tx("rec2")}</p>
                <p>{tx("rec3")} <strong className="text-gray-800">Tainá de Paula</strong> {tx("rec3b")}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                  <Landmark size={12} /> Rio de Janeiro City Council
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#009743]/10 text-[#009743] border border-[#009743]/20">
                  <CheckCircle2 size={12} /> {tx("recognition")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <p className="eyebrow text-[#FFB600] mb-4 text-center">{tx("timeline")}</p>
          <h2 className="font-bold text-3xl md:text-[2.75rem] text-gray-900 mb-14 text-center">{tx("journey")}</h2>
          <div className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2" />
            <div className="space-y-10">
              {journey.map((item, i) => (
                <div key={item.year} className={`relative flex gap-6 md:gap-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className={`hidden md:block w-1/2 ${i % 2 === 0 ? "pr-12 text-right" : "pl-12 text-left"}`}>
                    <span className="font-bold text-2xl text-[#FFB600]">{item.year}</span>
                    <p className="text-gray-600 text-sm leading-relaxed mt-1">{item.text}</p>
                  </div>
                  <div className="relative z-10 flex-shrink-0 w-4 h-4 rounded-full bg-[#FFB600] border-4 border-white shadow-sm self-start md:self-auto mt-1 md:mt-0 ml-6 md:ml-0 md:absolute md:left-1/2 md:-translate-x-1/2 md:top-2" />
                  <div className="md:hidden flex-1 pl-4">
                    <span className="font-bold text-xl text-[#FFB600]">{item.year}</span>
                    <p className="text-gray-600 text-sm leading-relaxed mt-1">{item.text}</p>
                  </div>
                  <div className="hidden md:block w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-[#fafaf8]">
        <div className="max-w-6xl mx-auto px-4">
          <p className="eyebrow text-[#FFB600] mb-4 text-center">{tx("standFor")}</p>
          <h2 className="font-bold text-3xl md:text-[2.75rem] text-gray-900 mb-12 text-center">{tx("ourValues")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 rounded-xl bg-[#FFB600]/10 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-[#FFB600]" />
                </div>
                <h3 className="font-bold text-base text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Travel With Us */}
      <section id="why-us" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <p className="eyebrow text-[#FFB600] mb-4 text-center">{tx("diff")}</p>
          <h2 className="font-bold text-3xl md:text-[2.75rem] text-gray-900 mb-5 text-center">{tx("whyUs")}</h2>
          <p className="text-gray-500 text-[1.0625rem] max-w-xl mx-auto text-center mb-12">{tx("whyUsSub")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUs.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow bg-white">
                <div className="w-10 h-10 rounded-xl bg-[#FFB600]/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4.5 h-4.5 text-[#FFB600]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900 mb-1">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-20 bg-[#fafaf8]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="eyebrow text-[#FFB600] mb-5">{tx("travelersSay")}</p>
          <h2 className="font-bold text-3xl md:text-4xl text-gray-900 mb-4">{tx("tripadvisor")}</h2>
          <p className="text-gray-500 text-[1.0625rem] mb-10">{tx("tripSub")}</p>
          <div className="bg-white border border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 min-h-[220px]">
            <svg viewBox="0 0 24 24" className="w-10 h-10 fill-[#00af87]" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
            </svg>
            <a href="https://www.tripadvisor.com/Attraction_Review-g303488-d14760440-Reviews-Janeiro_Tour_Travel-State_of_Rio_de_Janeiro.html"
              target="_blank" rel="noopener noreferrer" className="text-[#00af87] text-sm font-semibold hover:underline">
              {tx("tripView")}
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-28 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/images/banner-janeiro.jpg')] bg-cover bg-center" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <p className="eyebrow text-[#FFB600] mb-5">{tx("welcome")}</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">{tx("ctaTitle")}</h2>
          <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">{tx("ctaSub")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tours">
              <span className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold bg-[#FFB600] hover:bg-[#e6a400] text-black transition-colors cursor-pointer">
                {tx("explore")}
              </span>
            </Link>
            <Link href="/contact">
              <span className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-semibold border border-white/40 text-white hover:bg-white/10 transition-colors cursor-pointer">
                {tx("talkToUs")}
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

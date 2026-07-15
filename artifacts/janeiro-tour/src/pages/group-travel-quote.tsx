import { useState, useMemo, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { useCreateB2bQuote, useListB2bPricing, useListB2bTiers, useListTours } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft, ArrowRight, Check, ChevronRight, Users, Building2,
  Car, Utensils, Star, MessageSquare, TrendingUp, Send,
  Globe, Phone, Mail, MapPin, Calendar, Clock, DollarSign,
  Shield, Zap, Award, RefreshCw, CheckCircle2, FileText, Search,
} from "lucide-react";

const STEPS = [
  { id: 1, label: { en: "Contact", es: "Contacto", pt: "Contato" }, icon: Mail },
  { id: 2, label: { en: "Dates", es: "Fechas", pt: "Datas" }, icon: Calendar },
  { id: 3, label: { en: "Group", es: "Grupo", pt: "Grupo" }, icon: Users },
  { id: 4, label: { en: "Accommodation", es: "Alojamiento", pt: "Hospedagem" }, icon: Building2 },
  { id: 5, label: { en: "Transport", es: "Transporte", pt: "Transporte" }, icon: Car },
  { id: 6, label: { en: "Experiences", es: "Experiencias", pt: "Experiências" }, icon: Star },
  { id: 7, label: { en: "Meals", es: "Comidas", pt: "Refeições" }, icon: Utensils },
  { id: 8, label: { en: "Services", es: "Servicios", pt: "Serviços" }, icon: Shield },
  { id: 9, label: { en: "Details", es: "Detalles", pt: "Detalhes" }, icon: MessageSquare },
  { id: 10, label: { en: "Budget", es: "Presupuesto", pt: "Orçamento" }, icon: DollarSign },
  { id: 11, label: { en: "Estimate", es: "Estimado", pt: "Estimativa" }, icon: TrendingUp },
  { id: 12, label: { en: "Submit", es: "Enviar", pt: "Enviar" }, icon: Send },
];

const T = {
  en: {
    hero: "B2B Group Travel Quote",
    heroSub: "Get a tailored estimate for your group. Complete the form below and receive a personalized quote within 24 hours.",
    back: "Back",
    next: "Next",
    step: "Step",
    of: "of",
    // Step 1
    s1title: "Contact & Company Info",
    contactName: "Contact Name *",
    contactNamePh: "Your full name",
    company: "Company / Agency Name",
    companyPh: "Optional",
    email: "Email Address *",
    emailPh: "your@email.com",
    phone: "Phone / WhatsApp",
    phonePh: "+1 555 000 0000",
    country: "Country",
    countryPh: "Your country",
    website: "Website",
    websitePh: "https://youragency.com",
    iata: "IATA Code",
    iataPh: "Optional",
    preferredContact: "Preferred Contact Method",
    // Step 2
    s2title: "Travel Dates",
    arrival: "Arrival Date *",
    departure: "Departure Date *",
    flexibility: "Date Flexibility",
    flexExact: "Exact dates",
    flexThree: "±3 days",
    flexWeek: "±1 week",
    nights: "Nights",
    // Step 3
    s3title: "Group Profile",
    pax: "Number of Passengers",
    groupType: "Group Type",
    gtLeisure: "Leisure / Holiday",
    gtIncentive: "Incentive / Corporate",
    gtEducational: "Educational / School",
    gtReligious: "Religious / Pilgrimage",
    gtCultural: "Cultural / Heritage",
    gtWedding: "Destination Wedding",
    // Step 4
    s4title: "Accommodation",
    accCat: "Accommodation Category",
    accBudget: "Budget (Hostel / 2★)",
    accStandard: "Standard (3★)",
    accSuperior: "Superior (4★)",
    accDeluxe: "Deluxe (5★)",
    singleSup: "Single room supplement needed?",
    // Step 5
    s5title: "Transportation",
    airportTx: "Airport Transfers",
    airportTxSub: "Pick-up & drop-off included",
    dailyTx: "Daily Program Transport",
    dailyTxSub: "Coach/minivan for all activities",
    vehicleLevel: "Vehicle Level",
    vShared: "Shared shuttle",
    vPrivateMini: "Private minivan",
    vCoach: "Full-size coach",
    // Step 6
    s6title: "Experiences & Activities",
    s6sub: "Select all experiences for your group",
    expSearchPh: "Search experiences…",
    expCatAll: "All", expCatIconic: "Iconic Attractions", expCatCultural: "Cultural",
    expCatAerial: "Aerial", expCatNight: "Night", expCatGastronomy: "Gastronomy",
    expCatPremium: "Premium", expCatAdventure: "Adventure", expCatPrivate: "Private Tours",
    expCatShared: "Shared Tours", expCatCustom: "Custom",
    expSelected: "selected", expNone: "No experiences match your search.",
    expRecommended: "Recommended", expPremiumLabel: "Premium",
    expOtherLabel: "Custom / Other Activity",
    expOtherPh: "Describe any other activity or special request…",
    expProgramLabel: "Selected Program",
    // Step 7
    s7title: "Meal Plan",
    mealNone: "No meals included",
    mealBreakfast: "Breakfast only",
    mealHalf: "Half board (breakfast + dinner)",
    mealFull: "Full board (breakfast, lunch & dinner)",
    dietary: "Dietary Requirements",
    dietaryPh: "Vegetarian, halal, allergies, etc.",
    // Step 8
    s8title: "Guide & Coordination Services",
    guide: "English-speaking tour guide",
    guideSub: "Professional guide for all excursions",
    bilingualCoord: "Bilingual coordinator",
    bilingualCoordSub: "Dedicated coordinator (EN/ES/PT)",
    airportAssist: "Airport assistance (meet & greet)",
    airportAssistSub: "VIP welcome service on arrival",
    // Step 9
    s9title: "Special Requirements & Notes",
    peakSeason: "Will your travel dates overlap with Carnival or New Year?",
    peakSeasonSub: "Feb/Mar (Carnival) and Dec 31 – Jan 2 are peak periods with premium pricing",
    notes: "Additional Notes",
    notesPh: "Specific requests, special accessibility needs, dietary restrictions, arrival flight details, or anything else we should know...",
    // Step 10
    s10title: "Budget Indication (Optional)",
    s10sub: "This helps us tailor the proposal. All fields are optional.",
    budgetRange: "Approximate budget per person (USD)",
    budgetUnder500: "Under $500",
    budget500_1000: "$500–$1,000",
    budget1000_2000: "$1,000–$2,000",
    budget2000_3500: "$2,000–$3,500",
    budgetOver3500: "Over $3,500",
    budgetFlexible: "Flexible / Need guidance",
    currency: "Preferred display currency",
    // Step 11
    s11title: "Your Preliminary Estimate",
    s11sub: "This is a preliminary estimate based on standard rates. Your final tailored proposal may vary.",
    breakdown: "Cost Breakdown (per person)",
    accommodation: "Accommodation",
    transport: "Transportation",
    experiences: "Experiences",
    meals: "Meals",
    guideFees: "Guide & Services",
    subtotal: "Subtotal",
    peakSurcharge: "Peak Season Surcharge",
    groupDiscount: "Group Discount",
    markup: "Operational Markup",
    total: "Estimated Total",
    perPerson: "per person",
    totalGroup: "Total for group",
    estimateRange: "Estimated range",
    loading: "Calculating estimate...",
    tier: "Group tier",
    pricingNote: "* Prices shown in USD. Actual proposal will be in your preferred currency.",
    // Step 12
    s12title: "Review & Submit",
    s12sub: "Please review your details below. We will send a personalised quote within 24 hours.",
    reviewContact: "Contact",
    reviewDates: "Travel Dates",
    reviewGroup: "Group",
    reviewServices: "Services",
    reviewEstimate: "Estimate",
    submitQuote: "Submit Quote Request",
    submitting: "Submitting...",
    // Success
    successTitle: "Quote Request Submitted!",
    successSub: "Thank you! Your quote reference is",
    successDetail: "Our team will contact you within 24 hours with a personalised proposal.",
    successBack: "Back to Group Travel",
    // Errors
    errName: "Name required",
    errEmail: "Valid email required",
    errArrival: "Arrival date required",
    errDeparture: "Departure date after arrival required",
    errPax: "At least 2 passengers required",
  },
  es: {
    hero: "Cotización para Grupos B2B",
    heroSub: "Obtenga un presupuesto personalizado para su grupo. Complete el formulario y recibirá una propuesta en 24 horas.",
    back: "Atrás",
    next: "Siguiente",
    step: "Paso",
    of: "de",
    s1title: "Datos de Contacto y Empresa",
    contactName: "Nombre de Contacto *",
    contactNamePh: "Su nombre completo",
    company: "Empresa / Agencia",
    companyPh: "Opcional",
    email: "Correo Electrónico *",
    emailPh: "su@email.com",
    phone: "Teléfono / WhatsApp",
    phonePh: "+1 555 000 0000",
    country: "País",
    countryPh: "Su país",
    website: "Sitio Web",
    websitePh: "https://suagencia.com",
    iata: "Código IATA",
    iataPh: "Opcional",
    preferredContact: "Método de Contacto Preferido",
    s2title: "Fechas de Viaje",
    arrival: "Fecha de Llegada *",
    departure: "Fecha de Salida *",
    flexibility: "Flexibilidad de Fechas",
    flexExact: "Fechas exactas",
    flexThree: "±3 días",
    flexWeek: "±1 semana",
    nights: "Noches",
    s3title: "Perfil del Grupo",
    pax: "Número de Pasajeros",
    groupType: "Tipo de Grupo",
    gtLeisure: "Ocio / Vacaciones",
    gtIncentive: "Incentivos / Corporativo",
    gtEducational: "Educativo / Escolar",
    gtReligious: "Religioso / Peregrinación",
    gtCultural: "Cultural / Patrimonio",
    gtWedding: "Boda Destino",
    s4title: "Alojamiento",
    accCat: "Categoría de Alojamiento",
    accBudget: "Económico (Hostal / 2★)",
    accStandard: "Estándar (3★)",
    accSuperior: "Superior (4★)",
    accDeluxe: "Deluxe (5★)",
    singleSup: "¿Se necesita suplemento habitación individual?",
    s5title: "Transporte",
    airportTx: "Traslados Aeropuerto",
    airportTxSub: "Recogida y llegada incluidas",
    dailyTx: "Transporte Diario del Programa",
    dailyTxSub: "Autocar/minivan para actividades",
    vehicleLevel: "Tipo de Vehículo",
    vShared: "Shuttle compartido",
    vPrivateMini: "Minivan privado",
    vCoach: "Autocar completo",
    s6title: "Experiencias y Actividades",
    s6sub: "Seleccione todas las experiencias para su grupo",
    expSearchPh: "Buscar experiencias…",
    expCatAll: "Todas", expCatIconic: "Atracciones Icónicas", expCatCultural: "Cultural",
    expCatAerial: "Aéreo", expCatNight: "Nocturno", expCatGastronomy: "Gastronomía",
    expCatPremium: "Premium", expCatAdventure: "Aventura", expCatPrivate: "Tours Privados",
    expCatShared: "Tours Compartidos", expCatCustom: "Personalizado",
    expSelected: "seleccionadas", expNone: "No hay experiencias que coincidan.",
    expRecommended: "Recomendado", expPremiumLabel: "Premium",
    expOtherLabel: "Actividad Personalizada / Otro",
    expOtherPh: "Describe cualquier otra actividad o solicitud especial…",
    expProgramLabel: "Programa Seleccionado",
    s7title: "Plan de Comidas",
    mealNone: "Sin comidas incluidas",
    mealBreakfast: "Solo desayuno",
    mealHalf: "Media pensión (desayuno + cena)",
    mealFull: "Pensión completa (desayuno, almuerzo y cena)",
    dietary: "Requisitos Dietéticos",
    dietaryPh: "Vegetariano, halal, alergias, etc.",
    s8title: "Servicios de Guía y Coordinación",
    guide: "Guía de habla inglesa",
    guideSub: "Guía profesional para excursiones",
    bilingualCoord: "Coordinador bilingüe",
    bilingualCoordSub: "Coordinador dedicado (EN/ES/PT)",
    airportAssist: "Asistencia aeroportuaria (bienvenida VIP)",
    airportAssistSub: "Servicio de bienvenida a la llegada",
    s9title: "Requisitos Especiales y Notas",
    peakSeason: "¿Sus fechas coinciden con el Carnaval o Año Nuevo?",
    peakSeasonSub: "Feb/Mar (Carnaval) y 31 Dic – 2 Ene son temporada alta con precios premium",
    notes: "Notas Adicionales",
    notesPh: "Solicitudes específicas, necesidades de accesibilidad, restricciones dietéticas, detalles de llegada...",
    s10title: "Indicación de Presupuesto (Opcional)",
    s10sub: "Esto nos ayuda a personalizar la propuesta. Todos los campos son opcionales.",
    budgetRange: "Presupuesto aproximado por persona (USD)",
    budgetUnder500: "Menos de $500",
    budget500_1000: "$500–$1.000",
    budget1000_2000: "$1.000–$2.000",
    budget2000_3500: "$2.000–$3.500",
    budgetOver3500: "Más de $3.500",
    budgetFlexible: "Flexible / Necesito orientación",
    currency: "Moneda de visualización preferida",
    s11title: "Su Estimación Preliminar",
    s11sub: "Esta es una estimación preliminar basada en tarifas estándar. La propuesta final puede variar.",
    breakdown: "Desglose de Costos (por persona)",
    accommodation: "Alojamiento",
    transport: "Transporte",
    experiences: "Experiencias",
    meals: "Comidas",
    guideFees: "Guía y Servicios",
    subtotal: "Subtotal",
    peakSurcharge: "Recargo Temporada Alta",
    groupDiscount: "Descuento de Grupo",
    markup: "Markup Operacional",
    total: "Total Estimado",
    perPerson: "por persona",
    totalGroup: "Total para el grupo",
    estimateRange: "Rango estimado",
    loading: "Calculando estimación...",
    tier: "Nivel de grupo",
    pricingNote: "* Precios en USD. La propuesta real será en su moneda preferida.",
    s12title: "Revisión y Envío",
    s12sub: "Por favor revise sus datos. Enviaremos una propuesta personalizada en 24 horas.",
    reviewContact: "Contacto",
    reviewDates: "Fechas de Viaje",
    reviewGroup: "Grupo",
    reviewServices: "Servicios",
    reviewEstimate: "Estimado",
    submitQuote: "Enviar Solicitud de Cotización",
    submitting: "Enviando...",
    successTitle: "¡Solicitud Enviada!",
    successSub: "¡Gracias! Su referencia de cotización es",
    successDetail: "Nuestro equipo le contactará en 24 horas con una propuesta personalizada.",
    successBack: "Volver a Viajes en Grupo",
    errName: "Nombre requerido",
    errEmail: "Email válido requerido",
    errArrival: "Fecha de llegada requerida",
    errDeparture: "Fecha de salida posterior a llegada requerida",
    errPax: "Se requieren mínimo 2 pasajeros",
  },
  pt: {
    hero: "Cotação de Viagem em Grupo B2B",
    heroSub: "Obtenha uma estimativa personalizada para o seu grupo. Preencha o formulário e receba uma proposta em 24 horas.",
    back: "Voltar",
    next: "Próximo",
    step: "Passo",
    of: "de",
    s1title: "Dados de Contato e Empresa",
    contactName: "Nome do Contato *",
    contactNamePh: "Seu nome completo",
    company: "Empresa / Agência",
    companyPh: "Opcional",
    email: "Endereço de Email *",
    emailPh: "seu@email.com",
    phone: "Telefone / WhatsApp",
    phonePh: "+55 11 90000-0000",
    country: "País",
    countryPh: "Seu país",
    website: "Website",
    websitePh: "https://suaagencia.com",
    iata: "Código IATA",
    iataPh: "Opcional",
    preferredContact: "Método de Contato Preferido",
    s2title: "Datas de Viagem",
    arrival: "Data de Chegada *",
    departure: "Data de Partida *",
    flexibility: "Flexibilidade de Datas",
    flexExact: "Datas exatas",
    flexThree: "±3 dias",
    flexWeek: "±1 semana",
    nights: "Noites",
    s3title: "Perfil do Grupo",
    pax: "Número de Passageiros",
    groupType: "Tipo de Grupo",
    gtLeisure: "Lazer / Férias",
    gtIncentive: "Incentivo / Corporativo",
    gtEducational: "Educacional / Escolar",
    gtReligious: "Religioso / Peregrinação",
    gtCultural: "Cultural / Patrimônio",
    gtWedding: "Casamento Destino",
    s4title: "Hospedagem",
    accCat: "Categoria de Hospedagem",
    accBudget: "Econômico (Hostel / 2★)",
    accStandard: "Padrão (3★)",
    accSuperior: "Superior (4★)",
    accDeluxe: "Deluxe (5★)",
    singleSup: "Suplemento quarto individual necessário?",
    s5title: "Transporte",
    airportTx: "Transfers Aeroporto",
    airportTxSub: "Chegada e partida incluídas",
    dailyTx: "Transporte Diário do Programa",
    dailyTxSub: "Ônibus/van para todas as atividades",
    vehicleLevel: "Nível do Veículo",
    vShared: "Shuttle compartilhado",
    vPrivateMini: "Van privativa",
    vCoach: "Ônibus completo",
    s6title: "Experiências e Atividades",
    s6sub: "Selecione todas as experiências para o seu grupo",
    expSearchPh: "Buscar experiências…",
    expCatAll: "Todas", expCatIconic: "Atrações Icônicas", expCatCultural: "Cultural",
    expCatAerial: "Aéreo", expCatNight: "Noturno", expCatGastronomy: "Gastronomia",
    expCatPremium: "Premium", expCatAdventure: "Aventura", expCatPrivate: "Tours Privados",
    expCatShared: "Tours Compartilhados", expCatCustom: "Personalizado",
    expSelected: "selecionadas", expNone: "Nenhuma experiência corresponde à sua busca.",
    expRecommended: "Recomendado", expPremiumLabel: "Premium",
    expOtherLabel: "Atividade Personalizada / Outro",
    expOtherPh: "Descreva outra atividade ou pedido especial…",
    expProgramLabel: "Programa Selecionado",
    s7title: "Plano de Refeições",
    mealNone: "Sem refeições incluídas",
    mealBreakfast: "Café da manhã apenas",
    mealHalf: "Meia pensão (café + jantar)",
    mealFull: "Pensão completa (café, almoço e jantar)",
    dietary: "Requisitos Alimentares",
    dietaryPh: "Vegetariano, halal, alergias, etc.",
    s8title: "Serviços de Guia e Coordenação",
    guide: "Guia de turismo em inglês",
    guideSub: "Guia profissional para todas as excursões",
    bilingualCoord: "Coordenador bilíngue",
    bilingualCoordSub: "Coordenador dedicado (EN/ES/PT)",
    airportAssist: "Assistência aeroportuária (boas-vindas VIP)",
    airportAssistSub: "Serviço de boas-vindas na chegada",
    s9title: "Requisitos Especiais e Observações",
    peakSeason: "Suas datas coincidem com o Carnaval ou Réveillon?",
    peakSeasonSub: "Fev/Mar (Carnaval) e 31 Dez – 2 Jan são períodos de alta temporada com preços premium",
    notes: "Observações Adicionais",
    notesPh: "Pedidos específicos, necessidades de acessibilidade, restrições alimentares, detalhes de chegada...",
    s10title: "Indicação de Orçamento (Opcional)",
    s10sub: "Isso nos ajuda a personalizar a proposta. Todos os campos são opcionais.",
    budgetRange: "Orçamento aproximado por pessoa (USD)",
    budgetUnder500: "Menos de $500",
    budget500_1000: "$500–$1.000",
    budget1000_2000: "$1.000–$2.000",
    budget2000_3500: "$2.000–$3.500",
    budgetOver3500: "Mais de $3.500",
    budgetFlexible: "Flexível / Preciso de orientação",
    currency: "Moeda de exibição preferida",
    s11title: "Sua Estimativa Preliminar",
    s11sub: "Esta é uma estimativa preliminar baseada em tarifas padrão. A proposta final pode variar.",
    breakdown: "Detalhamento de Custos (por pessoa)",
    accommodation: "Hospedagem",
    transport: "Transporte",
    experiences: "Experiências",
    meals: "Refeições",
    guideFees: "Guia e Serviços",
    subtotal: "Subtotal",
    peakSurcharge: "Acréscimo Alta Temporada",
    groupDiscount: "Desconto de Grupo",
    markup: "Markup Operacional",
    total: "Total Estimado",
    perPerson: "por pessoa",
    totalGroup: "Total para o grupo",
    estimateRange: "Faixa estimada",
    loading: "Calculando estimativa...",
    tier: "Nível do grupo",
    pricingNote: "* Preços em USD. A proposta real será na sua moeda preferida.",
    s12title: "Revisão e Envio",
    s12sub: "Por favor revise seus dados. Enviaremos uma proposta personalizada em 24 horas.",
    reviewContact: "Contato",
    reviewDates: "Datas de Viagem",
    reviewGroup: "Grupo",
    reviewServices: "Serviços",
    reviewEstimate: "Estimativa",
    submitQuote: "Enviar Solicitação de Cotação",
    submitting: "Enviando...",
    successTitle: "Solicitação Enviada!",
    successSub: "Obrigado! Sua referência de cotação é",
    successDetail: "Nossa equipe entrará em contato em 24 horas com uma proposta personalizada.",
    successBack: "Voltar para Viagens em Grupo",
    errName: "Nome obrigatório",
    errEmail: "Email válido obrigatório",
    errArrival: "Data de chegada obrigatória",
    errDeparture: "Data de partida posterior à chegada obrigatória",
    errPax: "Mínimo de 2 passageiros necessário",
  },
};

type Lang = "en" | "es" | "pt";

type ExpCategory = "iconic" | "cultural" | "aerial" | "night" | "gastronomy" | "premium" | "adventure" | "private" | "shared" | "custom";

interface B2bExp {
  key: string;
  category: ExpCategory;
  en: string; es: string; pt: string;
  icon: string;
  isPremium?: boolean;
  isRecommended?: boolean;
}

const B2B_CURATED: B2bExp[] = [
  // Iconic Attractions
  { key: "christ_redeemer", category: "iconic", en: "Christ the Redeemer", es: "Cristo Redentor", pt: "Cristo Redentor", icon: "⛪", isRecommended: true },
  { key: "sugarloaf", category: "iconic", en: "Sugarloaf Mountain", es: "Pan de Azúcar", pt: "Pão de Açúcar", icon: "⛰️", isRecommended: true },
  { key: "selaron_steps", category: "iconic", en: "Selarón Steps", es: "Escaleras Selarón", pt: "Escadaria Selarón", icon: "🎨" },
  { key: "little_africa", category: "iconic", en: "Little Africa", es: "Pequeña África", pt: "Pequena África", icon: "🌍" },
  // Cultural
  { key: "favela_tour", category: "cultural", en: "Favela Cultural Tour", es: "Tour Cultural Favela", pt: "Tour Cultural Favela", icon: "🏘️", isRecommended: true },
  { key: "capoeira", category: "cultural", en: "Capoeira Workshop", es: "Taller de Capoeira", pt: "Workshop de Capoeira", icon: "🥋" },
  { key: "cultural_walking", category: "cultural", en: "Cultural Walking Tours", es: "Tours a Pie Culturales", pt: "Passeios Culturais a Pé", icon: "🚶" },
  { key: "samba_experience", category: "cultural", en: "Samba Experience", es: "Experiencia Samba", pt: "Experiência Samba", icon: "🪘", isRecommended: true },
  { key: "carnival_experience", category: "cultural", en: "Carnival Experience", es: "Experiencia Carnaval", pt: "Experiência Carnaval", icon: "🎭" },
  // Aerial
  { key: "helicopter", category: "aerial", en: "Helicopter Experience", es: "Experiencia en Helicóptero", pt: "Experiência de Helicóptero", icon: "🚁", isPremium: true },
  { key: "hang_gliding", category: "aerial", en: "Hang Gliding", es: "Ala Delta", pt: "Asa Delta", icon: "🪂" },
  { key: "paragliding", category: "aerial", en: "Paragliding", es: "Parapente", pt: "Parapente", icon: "🪂" },
  // Night
  { key: "rio_by_night", category: "night", en: "Rio by Night", es: "Río de Noche", pt: "Rio à Noite", icon: "🌃" },
  { key: "dinner_show", category: "night", en: "Dinner Show", es: "Cena Show", pt: "Jantar Show", icon: "🎪" },
  { key: "group_dinner", category: "night", en: "Group Dinner", es: "Cena Grupal", pt: "Jantar em Grupo", icon: "🍷" },
  // Gastronomy
  { key: "afro_gastronomy", category: "gastronomy", en: "Afro-Brazilian Gastronomy", es: "Gastronomía Afrobrasileña", pt: "Gastronomia Afro-Brasileira", icon: "🍽️" },
  { key: "cooking_class", category: "gastronomy", en: "Cooking Class", es: "Clase de Cocina", pt: "Aula de Culinária", icon: "👨‍🍳" },
  { key: "welcome_dinner", category: "gastronomy", en: "Welcome Dinner", es: "Cena de Bienvenida", pt: "Jantar de Boas-Vindas", icon: "🥂", isRecommended: true },
  { key: "farewell_dinner", category: "gastronomy", en: "Farewell Dinner", es: "Cena de Despedida", pt: "Jantar de Despedida", icon: "🎊" },
  // Premium
  { key: "yacht_experience", category: "premium", en: "Yacht Experience", es: "Experiencia en Yate", pt: "Experiência de Iate", icon: "⛵", isPremium: true },
  { key: "photographer", category: "premium", en: "Professional Photographer", es: "Fotógrafo Profesional", pt: "Fotógrafo Profissional", icon: "📷", isPremium: true },
  // Adventure
  { key: "adventure_exp", category: "adventure", en: "Adventure Experiences", es: "Experiencias de Aventura", pt: "Experiências de Aventura", icon: "🏔️" },
  // Private / Shared / Custom
  { key: "private_tours", category: "private", en: "Private Tours", es: "Tours Privados", pt: "Tours Privados", icon: "🔐" },
  { key: "shared_tours", category: "shared", en: "Shared Tours", es: "Tours Compartidos", pt: "Tours Compartilhados", icon: "👥" },
  { key: "custom_experience", category: "custom", en: "Custom Experience", es: "Experiencia Personalizada", pt: "Experiência Personalizada", icon: "✨" },
];

const EXP_CATEGORIES: Array<{ key: string; labelKey: string; icon: string }> = [
  { key: "all", labelKey: "expCatAll", icon: "🌟" },
  { key: "iconic", labelKey: "expCatIconic", icon: "🏛️" },
  { key: "cultural", labelKey: "expCatCultural", icon: "🎭" },
  { key: "aerial", labelKey: "expCatAerial", icon: "🚁" },
  { key: "night", labelKey: "expCatNight", icon: "🌃" },
  { key: "gastronomy", labelKey: "expCatGastronomy", icon: "🍽️" },
  { key: "premium", labelKey: "expCatPremium", icon: "⭐" },
  { key: "adventure", labelKey: "expCatAdventure", icon: "🏔️" },
  { key: "private", labelKey: "expCatPrivate", icon: "🔐" },
  { key: "shared", labelKey: "expCatShared", icon: "👥" },
  { key: "custom", labelKey: "expCatCustom", icon: "✨" },
];

const TOUR_CAT_MAP: Record<string, ExpCategory> = {
  sightseeing: "iconic", culture: "cultural", aerial: "aerial",
  gastronomy: "gastronomy", adventure: "adventure", night: "night",
};
const TOUR_ICON_MAP: Record<string, string> = {
  sightseeing: "🏛️", culture: "🎭", aerial: "🚁",
  gastronomy: "🍽️", adventure: "🏔️", night: "🌃",
};

interface FormData {
  contactName: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  website: string;
  iata: string;
  preferredContact: string;
  arrival: string;
  departure: string;
  flexibility: string;
  pax: number;
  groupType: string;
  accommodation: string;
  singleSupplement: boolean;
  airportTransfers: boolean;
  dailyTransport: boolean;
  vehicleLevel: string;
  programName: string;
  experiences: string[];
  otherExperiences: string;
  mealPlan: string;
  dietary: string;
  guideIncluded: boolean;
  coordinatorIncluded: boolean;
  airportAssistance: boolean;
  isPeakSeason: boolean;
  notes: string;
  budgetRange: string;
  currency: string;
}

const DEFAULT: FormData = {
  contactName: "",
  company: "",
  email: "",
  phone: "",
  country: "",
  website: "",
  iata: "",
  preferredContact: "email",
  arrival: "",
  departure: "",
  flexibility: "exact",
  pax: 20,
  groupType: "leisure",
  accommodation: "standard",
  singleSupplement: false,
  airportTransfers: true,
  dailyTransport: true,
  vehicleLevel: "coach",
  programName: "",
  experiences: [],
  otherExperiences: "",
  mealPlan: "breakfast",
  dietary: "",
  guideIncluded: true,
  coordinatorIncluded: false,
  airportAssistance: false,
  isPeakSeason: false,
  notes: "",
  budgetRange: "",
  currency: "USD",
};

function calcNights(arrival: string, departure: string): number {
  if (!arrival || !departure) return 0;
  const a = new Date(arrival), d = new Date(departure);
  const diff = Math.round((d.getTime() - a.getTime()) / 86400000);
  return diff > 0 ? diff : 0;
}

function getPricingValue(settings: Array<{ settingKey: string; settingValue: string }>, key: string, fallback = 0): number {
  const s = settings.find(s => s.settingKey === key);
  return s ? Number(s.settingValue) : fallback;
}

interface Estimate {
  accommodationPP: number;
  transportPP: number;
  experiencesPP: number;
  mealsPP: number;
  servicesPP: number;
  subtotalPP: number;
  peakSurchargePP: number;
  discountPP: number;
  markupPP: number;
  totalPP: number;
  totalGroup: number;
  lowPP: number;
  highPP: number;
  tierName: string;
  discountPct: number;
  markupPct: number;
  rangePct: number;
}

function computeEstimate(
  form: FormData,
  settings: Array<{ settingKey: string; settingValue: string }>,
  tiers: Array<{ minPax: number; maxPax: number | null; label?: string; discountPct: string; markupPct: string }>,
): Estimate {
  const nights = calcNights(form.arrival, form.departure) || 5;

  // Accommodation — actual keys: accommodation_3star_usd_ppn, 4star, 5star, luxury
  const accKeyMap: Record<string, string> = {
    budget: "accommodation_3star_usd_ppn",
    standard: "accommodation_3star_usd_ppn",
    superior: "accommodation_4star_usd_ppn",
    deluxe: "accommodation_5star_usd_ppn",
    luxury: "accommodation_luxury_usd_ppn",
  };
  const accFallback: Record<string, number> = { budget: 45, standard: 45, superior: 75, deluxe: 120, luxury: 200 };
  const accRate = getPricingValue(settings, accKeyMap[form.accommodation] ?? "accommodation_3star_usd_ppn", accFallback[form.accommodation] ?? 65);
  const accommodationPP = accRate * nights;

  // Transport — pct values are actual per-person costs
  let transportPP = 0;
  if (form.airportTransfers) {
    transportPP += getPricingValue(settings, "transport_airport_arrival_pp", 35);
    transportPP += getPricingValue(settings, "transport_airport_departure_pp", 35);
  }
  if (form.dailyTransport) {
    const vehicleKey = form.vehicleLevel === "private_mini" ? "transport_minivan_per_day" : "transport_coach_per_day";
    const vehiclePerDay = getPricingValue(settings, vehicleKey, 400);
    transportPP += (vehiclePerDay * nights) / Math.max(form.pax, 1);
  }

  const expCostPP = getPricingValue(settings, "experience_avg_pp", 65);
  const experiencesPP = form.experiences.length * expCostPP;

  const mealRates: Record<string, number> = {
    none: 0,
    breakfast: getPricingValue(settings, "meal_breakfast_pp", 15),
    half: getPricingValue(settings, "meal_halfboard_pp", 35),
    full: getPricingValue(settings, "meal_fullboard_pp", 60),
  };
  const mealsPP = (mealRates[form.mealPlan] ?? 0) * nights;

  let servicesPP = 0;
  const guideDayRate = getPricingValue(settings, "guide_per_day_usd", 250);
  const coordDayRate = getPricingValue(settings, "coordinator_per_day_usd", 180);
  const airportAssistPP = getPricingValue(settings, "airport_assistance_pp", 25);
  if (form.guideIncluded) servicesPP += (guideDayRate * nights) / Math.max(form.pax, 1);
  if (form.coordinatorIncluded) servicesPP += (coordDayRate * nights) / Math.max(form.pax, 1);
  if (form.airportAssistance) servicesPP += airportAssistPP;

  const subtotalPP = accommodationPP + transportPP + experiencesPP + mealsPP + servicesPP;

  // Peak season surcharge — stored as decimal (0.30 = 30%)
  const peakSurchargePct = form.isPeakSeason ? getPricingValue(settings, "special_season_surcharge_pct", 0.3) : 0;
  const peakSurchargePP = subtotalPP * peakSurchargePct;
  const subtotalWithSurcharge = subtotalPP + peakSurchargePP;

  const matchedTier = tiers
    .filter(t => form.pax >= t.minPax && (t.maxPax === null || form.pax <= t.maxPax))
    .sort((a, b) => b.minPax - a.minPax)[0];

  // discountPct and markupPct stored as decimals (0.15 = 15%)
  const discountPct = matchedTier ? Number(matchedTier.discountPct) : 0;
  const markupPct = matchedTier ? Number(matchedTier.markupPct) : getPricingValue(settings, "agency_markup_pct", 0.15);
  const tierName = matchedTier?.label ?? "Standard";

  const discountPP = subtotalWithSurcharge * discountPct;
  const afterDiscount = subtotalWithSurcharge - discountPP;
  const markupPP = afterDiscount * markupPct;
  const totalPP = afterDiscount + markupPP;
  const totalGroup = totalPP * form.pax;

  // Range stored as decimal (0.10 = 10%)
  const rangePct = getPricingValue(settings, "estimate_range_pct", 0.1);
  const lowPP = totalPP * (1 - rangePct);
  const highPP = totalPP * (1 + rangePct);

  return {
    accommodationPP, transportPP, experiencesPP, mealsPP, servicesPP,
    subtotalPP, peakSurchargePP, discountPP, markupPP, totalPP,
    totalGroup, lowPP, highPP, tierName,
    discountPct: discountPct * 100,
    markupPct: markupPct * 100,
    rangePct: rangePct * 100,
  };
}

function fmt(n: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
}

function RadioCard({
  value, current, onChange, label, sub,
}: { value: string; current: string; onChange: (v: string) => void; label: string; sub?: string }) {
  const active = value === current;
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
        active ? "border-[#FFB600] bg-[#FFB600]/5 ring-2 ring-[#FFB600]/30" : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
        active ? "border-[#FFB600]" : "border-gray-300"
      }`}>
        {active && <div className="w-2 h-2 rounded-full bg-[#FFB600]" />}
      </div>
      <div>
        <div className="text-sm font-medium text-gray-900">{label}</div>
        {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
      </div>
    </button>
  );
}

function SwitchRow({
  checked, onChange, label, sub,
}: { checked: boolean; onChange: (v: boolean) => void; label: string; sub?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 p-4">
      <div>
        <div className="text-sm font-medium text-gray-900">{label}</div>
        {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5">
      <div
        className="bg-[#FFB600] h-1.5 rounded-full transition-all duration-500"
        style={{ width: `${(step / total) * 100}%` }}
      />
    </div>
  );
}

function StepBubbles({ current, total, steps, lang }: { current: number; total: number; steps: typeof STEPS; lang: Lang }) {
  return (
    <div className="flex items-center gap-0.5 overflow-x-auto pb-1 scrollbar-none">
      {steps.map((s, i) => {
        const done = current > s.id;
        const active = current === s.id;
        return (
          <div key={s.id} className="flex items-center gap-0.5">
            <div className={`flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all ${
              done ? "bg-[#009743] text-white" : active ? "bg-[#FFB600] text-black" : "bg-gray-100 text-gray-400"
            }`}>
              {done ? <Check className="w-3.5 h-3.5" /> : s.id}
            </div>
            {i < total - 1 && <div className={`w-3 h-0.5 ${done ? "bg-[#009743]" : "bg-gray-200"}`} />}
          </div>
        );
      })}
    </div>
  );
}

export default function GroupTravelQuotePage() {
  const { lang } = useLanguage();
  const l = lang as Lang;
  const t = T[l] ?? T.en;
  const search = useSearch();
  const programFromUrl = useMemo(() => decodeURIComponent(new URLSearchParams(search).get("program") ?? ""), []);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(() => ({
    ...DEFAULT,
    programName: programFromUrl,
  }));
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [expCatFilter, setExpCatFilter] = useState("all");
  const [expSearch, setExpSearch] = useState("");

  const upd = <K extends keyof FormData>(key: K, val: FormData[K]) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const { data: pricingData = [] } = useListB2bPricing();
  const { data: tiersData = [] } = useListB2bTiers();
  const { data: rawTours = [] } = useListTours();
  const submitQuote = useCreateB2bQuote();

  const allExperiences = useMemo<B2bExp[]>(() => {
    const curatedKeys = new Set(B2B_CURATED.map(e => e.key));
    const dynamic = (rawTours as Array<{ id: number; title: string; category?: string; published?: boolean }>)
      .filter(r => r.published && r.category !== "transfer")
      .map(r => ({
        key: `tour_${r.id}`,
        category: (TOUR_CAT_MAP[r.category ?? ""] ?? "iconic") as ExpCategory,
        en: r.title, es: r.title, pt: r.title,
        icon: TOUR_ICON_MAP[r.category ?? ""] ?? "🗺️",
      }))
      .filter(r => !curatedKeys.has(r.key));
    return [...B2B_CURATED, ...dynamic];
  }, [rawTours]);

  const filteredExperiences = useMemo(() => {
    let result = allExperiences;
    if (expCatFilter !== "all") result = result.filter(e => e.category === expCatFilter);
    if (expSearch.trim()) {
      const s = expSearch.toLowerCase();
      result = result.filter(e =>
        e.en.toLowerCase().includes(s) || e.es.toLowerCase().includes(s) || e.pt.toLowerCase().includes(s)
      );
    }
    return result;
  }, [allExperiences, expCatFilter, expSearch]);

  const nights = calcNights(form.arrival, form.departure);

  const estimate = useMemo(() => {
    if (pricingData.length === 0) return null;
    return computeEstimate(form, pricingData as Array<{ settingKey: string; settingValue: string }>, tiersData as Array<{ minPax: number; maxPax: number | null; tierName: string; discountPct: string; markupPct: string }>);
  }, [form, pricingData, tiersData]);

  function validate(): boolean {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (step === 1) {
      if (!form.contactName.trim()) errs.contactName = t.errName;
      if (!form.email.trim() || !form.email.includes("@")) errs.email = t.errEmail;
    }
    if (step === 2) {
      if (!form.arrival) errs.arrival = t.errArrival;
      if (!form.departure || (form.arrival && form.departure <= form.arrival)) errs.departure = t.errDeparture;
    }
    if (step === 3) {
      if (form.pax < 2) errs.pax = t.errPax;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleNext() {
    if (!validate()) return;
    setStep(s => Math.min(s + 1, 12));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    setStep(s => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit() {
    if (!validate()) return;
    const groupData = {
      nights,
      programName: form.programName || undefined,
      groupType: form.groupType,
      accommodation: form.accommodation,
      mealPlan: form.mealPlan,
      experiences: form.experiences,
      otherExperiences: form.otherExperiences || undefined,
      airportTransfers: form.airportTransfers,
      dailyTransport: form.dailyTransport,
      vehicleLevel: form.vehicleLevel,
      guideIncluded: form.guideIncluded,
      coordinatorIncluded: form.coordinatorIncluded,
      airportAssistance: form.airportAssistance,
      isPeakSeason: form.isPeakSeason,
      flexibility: form.flexibility,
      budgetRange: form.budgetRange,
      singleSupplement: form.singleSupplement,
      arrival: form.arrival,
      departure: form.departure,
      pax: form.pax,
    };
    const estimateBreakdown = estimate ? {
      accommodationPP: estimate.accommodationPP,
      transportPP: estimate.transportPP,
      experiencesPP: estimate.experiencesPP,
      mealsPP: estimate.mealsPP,
      servicesPP: estimate.servicesPP,
      subtotalPP: estimate.subtotalPP,
      peakSurchargePP: estimate.peakSurchargePP,
      discountPP: estimate.discountPP,
      markupPP: estimate.markupPP,
      tierName: estimate.tierName,
      discountPct: estimate.discountPct,
    } : {};

    try {
      const result = await submitQuote.mutateAsync({
        data: {
          language: l,
          contactName: form.contactName,
          company: form.company,
          email: form.email,
          phone: form.phone,
          country: form.country,
          website: form.website,
          iata: form.iata,
          preferredContact: form.preferredContact,
          groupData: { ...groupData, notes: form.notes },
          estimateLow: estimate?.lowPP ?? 0,
          estimateHigh: estimate?.highPP ?? 0,
          estimateCurrency: form.currency,
          estimateBreakdown,
        },
      });
      setSubmitted((result as { quoteRef?: string }).quoteRef ?? "BQ-SUBMITTED");
    } catch (_e) {
      setSubmitted("BQ-SUBMITTED");
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-20">
        <div className="w-full max-w-lg text-center">
          <div className="w-20 h-20 rounded-full bg-[#009743]/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-[#009743]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{t.successTitle}</h1>
          <p className="text-gray-600 mb-2">{t.successSub}</p>
          <div className="inline-block bg-[#FFB600] text-black font-mono font-bold text-xl px-6 py-3 rounded-xl mb-6">
            {submitted}
          </div>
          <p className="text-gray-500 mb-8">{t.successDetail}</p>
          <Link href="/group-travel">
            <Button className="bg-[#FFB600] hover:bg-[#e6a400] text-black font-semibold gap-2">
              <ArrowLeft className="w-4 h-4" /> {t.successBack}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-black text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#FFB600]/20 text-[#FFB600] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <FileText className="w-3.5 h-3.5" /> B2B Group Travel
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{t.hero}</h1>
          <p className="text-gray-300 text-base max-w-xl mx-auto">{t.heroSub}</p>
        </div>
      </div>

      {/* Trust bar */}
      <div className="bg-[#FFB600] py-3">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-6 px-4">
          {[
            { icon: Zap, text: { en: "Response in 24h", es: "Respuesta en 24h", pt: "Resposta em 24h" } },
            { icon: Award, text: { en: "Black-owned Afrotourism", es: "Afroturismo de propietario negro", pt: "Afroturismo negro" } },
            { icon: Globe, text: { en: "EN / ES / PT support", es: "Soporte EN / ES / PT", pt: "Suporte EN / ES / PT" } },
          ].map(({ icon: Icon, text }) => (
            <div key={text.en} className="flex items-center gap-1.5 text-black text-xs font-semibold">
              <Icon className="w-3.5 h-3.5" /> {text[l] ?? text.en}
            </div>
          ))}
        </div>
      </div>

      {/* Main card */}
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Progress */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500 font-medium">
                {t.step} {step} {t.of} {STEPS.length}
              </span>
              <span className="text-xs text-gray-400">
                {STEPS[step - 1]?.label[l] ?? STEPS[step - 1]?.label.en}
              </span>
            </div>
            <ProgressBar step={step} total={STEPS.length} />
            <div className="mt-3">
              <StepBubbles current={step} total={STEPS.length} steps={STEPS} lang={l} />
            </div>
          </div>

          {/* Step content */}
          <div className="px-6 py-8">
            {/* ── Step 1: Contact ── */}
            {step === 1 && (
              <div className="space-y-5">
                {form.programName && (
                  <div className="flex items-center gap-2 rounded-xl bg-[#009743]/10 border border-[#009743]/30 px-4 py-3">
                    <FileText className="w-4 h-4 text-[#009743] flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-[#009743] uppercase tracking-wide">{t.expProgramLabel}</div>
                      <div className="text-sm font-semibold text-gray-800">{form.programName}</div>
                    </div>
                  </div>
                )}
                <h2 className="text-xl font-bold text-gray-900">{t.s1title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label>{t.contactName}</Label>
                    <Input
                      placeholder={t.contactNamePh}
                      value={form.contactName}
                      onChange={e => upd("contactName", e.target.value)}
                      className={errors.contactName ? "border-red-400" : ""}
                    />
                    {errors.contactName && <p className="text-xs text-red-500">{errors.contactName}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t.company}</Label>
                    <Input placeholder={t.companyPh} value={form.company} onChange={e => upd("company", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t.email}</Label>
                    <Input
                      type="email"
                      placeholder={t.emailPh}
                      value={form.email}
                      onChange={e => upd("email", e.target.value)}
                      className={errors.email ? "border-red-400" : ""}
                    />
                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t.phone}</Label>
                    <Input placeholder={t.phonePh} value={form.phone} onChange={e => upd("phone", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t.country}</Label>
                    <Input placeholder={t.countryPh} value={form.country} onChange={e => upd("country", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t.website}</Label>
                    <Input placeholder={t.websitePh} value={form.website} onChange={e => upd("website", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t.iata}</Label>
                    <Input placeholder={t.iataPh} value={form.iata} onChange={e => upd("iata", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t.preferredContact}</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { v: "email", icon: Mail, label: "Email" },
                      { v: "whatsapp", icon: Phone, label: "WhatsApp" },
                      { v: "phone", icon: Phone, label: { en: "Call", es: "Llamada", pt: "Ligação" }[l] ?? "Call" },
                    ].map(({ v, icon: Icon, label }) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => upd("preferredContact", v)}
                        className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-semibold transition-all ${
                          form.preferredContact === v
                            ? "border-[#FFB600] bg-[#FFB600]/5 text-[#FFB600]"
                            : "border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 2: Dates ── */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-gray-900">{t.s2title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>{t.arrival}</Label>
                    <Input
                      type="date"
                      value={form.arrival}
                      onChange={e => upd("arrival", e.target.value)}
                      className={errors.arrival ? "border-red-400" : ""}
                    />
                    {errors.arrival && <p className="text-xs text-red-500">{errors.arrival}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t.departure}</Label>
                    <Input
                      type="date"
                      value={form.departure}
                      onChange={e => upd("departure", e.target.value)}
                      className={errors.departure ? "border-red-400" : ""}
                    />
                    {errors.departure && <p className="text-xs text-red-500">{errors.departure}</p>}
                  </div>
                </div>
                {nights > 0 && (
                  <div className="flex items-center gap-2 bg-[#FFB600]/10 rounded-xl p-3">
                    <Clock className="w-4 h-4 text-[#FFB600]" />
                    <span className="text-sm font-semibold text-gray-800">{nights} {t.nights}</span>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>{t.flexibility}</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { v: "exact", label: t.flexExact },
                      { v: "three", label: t.flexThree },
                      { v: "week", label: t.flexWeek },
                    ].map(({ v, label }) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => upd("flexibility", v)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                          form.flexibility === v
                            ? "border-[#FFB600] bg-[#FFB600]/5 text-black"
                            : "border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 3: Group ── */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">{t.s3title}</h2>
                <div className="space-y-3">
                  <Label>{t.pax}: <span className="text-[#FFB600] font-bold">{form.pax}</span></Label>
                  <Slider
                    min={2} max={200} step={1}
                    value={[form.pax]}
                    onValueChange={([v]) => upd("pax", v)}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>2</span><span>50</span><span>100</span><span>150</span><span>200</span>
                  </div>
                  {errors.pax && <p className="text-xs text-red-500">{errors.pax}</p>}
                </div>
                <div className="space-y-2">
                  <Label>{t.groupType}</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { v: "leisure", label: t.gtLeisure },
                      { v: "incentive", label: t.gtIncentive },
                      { v: "educational", label: t.gtEducational },
                      { v: "religious", label: t.gtReligious },
                      { v: "cultural", label: t.gtCultural },
                      { v: "wedding", label: t.gtWedding },
                    ].map(({ v, label }) => (
                      <RadioCard key={v} value={v} current={form.groupType} onChange={v => upd("groupType", v)} label={label} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 4: Accommodation ── */}
            {step === 4 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-gray-900">{t.s4title}</h2>
                <div className="space-y-2">
                  <Label>{t.accCat}</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { v: "budget", label: t.accBudget, price: { en: "from ~$35/pp/night", es: "desde ~$35/pp/noche", pt: "a partir de ~$35/pp/noite" }[l] },
                      { v: "standard", label: t.accStandard, price: { en: "from ~$65/pp/night", es: "desde ~$65/pp/noche", pt: "a partir de ~$65/pp/noite" }[l] },
                      { v: "superior", label: t.accSuperior, price: { en: "from ~$110/pp/night", es: "desde ~$110/pp/noche", pt: "a partir de ~$110/pp/noite" }[l] },
                      { v: "deluxe", label: t.accDeluxe, price: { en: "from ~$185/pp/night", es: "desde ~$185/pp/noche", pt: "a partir de ~$185/pp/noite" }[l] },
                    ].map(({ v, label, price }) => (
                      <RadioCard key={v} value={v} current={form.accommodation} onChange={v => upd("accommodation", v)} label={label} sub={price} />
                    ))}
                  </div>
                </div>
                <SwitchRow
                  checked={form.singleSupplement}
                  onChange={v => upd("singleSupplement", v)}
                  label={t.singleSup}
                />
              </div>
            )}

            {/* ── Step 5: Transport ── */}
            {step === 5 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-gray-900">{t.s5title}</h2>
                <div className="space-y-3">
                  <SwitchRow checked={form.airportTransfers} onChange={v => upd("airportTransfers", v)} label={t.airportTx} sub={t.airportTxSub} />
                  <SwitchRow checked={form.dailyTransport} onChange={v => upd("dailyTransport", v)} label={t.dailyTx} sub={t.dailyTxSub} />
                </div>
                {(form.airportTransfers || form.dailyTransport) && (
                  <div className="space-y-2">
                    <Label>{t.vehicleLevel}</Label>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { v: "shared", label: t.vShared },
                        { v: "private_mini", label: t.vPrivateMini },
                        { v: "coach", label: t.vCoach },
                      ].map(({ v, label }) => (
                        <RadioCard key={v} value={v} current={form.vehicleLevel} onChange={v => upd("vehicleLevel", v)} label={label} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Step 6: Experiences ── */}
            {step === 6 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{t.s6title}</h2>
                  <p className="text-sm text-gray-500 mt-1">{t.s6sub}</p>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <Input
                    className="pl-9 text-sm"
                    placeholder={t.expSearchPh}
                    value={expSearch}
                    onChange={e => setExpSearch(e.target.value)}
                  />
                </div>

                {/* Category filter pills */}
                <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                  {EXP_CATEGORIES.map(cat => {
                    const label = t[cat.labelKey as keyof typeof t] as string;
                    const isActive = expCatFilter === cat.key;
                    return (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => setExpCatFilter(cat.key)}
                        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                          isActive
                            ? "bg-[#FFB600] text-black border-[#FFB600]"
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span>{cat.icon}</span>
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected chips */}
                {form.experiences.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {form.experiences.map(key => {
                      const exp = allExperiences.find(e => e.key === key);
                      if (!exp) return null;
                      return (
                        <span
                          key={key}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FFB600]/15 border border-[#FFB600]/40 text-[#7a5500] rounded-full text-xs font-medium"
                        >
                          {exp.icon} {exp[l]}
                          <button
                            type="button"
                            onClick={() => upd("experiences", form.experiences.filter(e => e !== key))}
                            className="ml-0.5 hover:text-red-600 leading-none"
                          >×</button>
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Experience grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
                  {filteredExperiences.map(exp => {
                    const checked = form.experiences.includes(exp.key);
                    return (
                      <label
                        key={exp.key}
                        className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
                          checked ? "border-[#FFB600] bg-[#FFB600]/5" : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={v =>
                            upd("experiences", v
                              ? [...form.experiences, exp.key]
                              : form.experiences.filter(e => e !== exp.key))
                          }
                        />
                        <span className="text-lg leading-none">{exp.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-800 truncate">{exp[l]}</div>
                          {(exp.isPremium || exp.isRecommended) && (
                            <div className="flex gap-1 mt-0.5">
                              {exp.isPremium && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded font-semibold">
                                  {t.expPremiumLabel}
                                </span>
                              )}
                              {exp.isRecommended && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded font-semibold">
                                  ★ {t.expRecommended}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </label>
                    );
                  })}
                  {filteredExperiences.length === 0 && (
                    <div className="col-span-2 py-10 text-center text-sm text-gray-400">
                      {t.expNone}
                    </div>
                  )}
                </div>

                {/* Custom / Other */}
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 space-y-2">
                  <Label className="text-sm font-medium text-gray-700">{t.expOtherLabel}</Label>
                  <Textarea
                    rows={2}
                    placeholder={t.expOtherPh}
                    value={form.otherExperiences}
                    onChange={e => upd("otherExperiences", e.target.value)}
                    className="text-sm resize-none"
                  />
                </div>

                <div className="text-xs text-gray-400">
                  {form.experiences.length}{form.otherExperiences ? " + 1" : ""} {t.expSelected}
                </div>
              </div>
            )}

            {/* ── Step 7: Meals ── */}
            {step === 7 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-gray-900">{t.s7title}</h2>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { v: "none", label: t.mealNone },
                    { v: "breakfast", label: t.mealBreakfast },
                    { v: "half", label: t.mealHalf },
                    { v: "full", label: t.mealFull },
                  ].map(({ v, label }) => (
                    <RadioCard key={v} value={v} current={form.mealPlan} onChange={v => upd("mealPlan", v)} label={label} />
                  ))}
                </div>
                <div className="space-y-1.5">
                  <Label>{t.dietary}</Label>
                  <Textarea
                    placeholder={t.dietaryPh}
                    rows={3}
                    value={form.dietary}
                    onChange={e => upd("dietary", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* ── Step 8: Services ── */}
            {step === 8 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-gray-900">{t.s8title}</h2>
                <div className="space-y-3">
                  <SwitchRow checked={form.guideIncluded} onChange={v => upd("guideIncluded", v)} label={t.guide} sub={t.guideSub} />
                  <SwitchRow checked={form.coordinatorIncluded} onChange={v => upd("coordinatorIncluded", v)} label={t.bilingualCoord} sub={t.bilingualCoordSub} />
                  <SwitchRow checked={form.airportAssistance} onChange={v => upd("airportAssistance", v)} label={t.airportAssist} sub={t.airportAssistSub} />
                </div>
              </div>
            )}

            {/* ── Step 9: Details ── */}
            {step === 9 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-gray-900">{t.s9title}</h2>
                <div className={`rounded-xl border p-4 cursor-pointer transition-all ${
                  form.isPeakSeason ? "border-[#FFB600] bg-[#FFB600]/5" : "border-gray-200"
                }`} onClick={() => upd("isPeakSeason", !form.isPeakSeason)}>
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={form.isPeakSeason}
                      onCheckedChange={v => upd("isPeakSeason", !!v)}
                    />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{t.peakSeason}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{t.peakSeasonSub}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>{t.notes}</Label>
                  <Textarea
                    placeholder={t.notesPh}
                    rows={5}
                    value={form.notes}
                    onChange={e => upd("notes", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* ── Step 10: Budget ── */}
            {step === 10 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-gray-900">{t.s10title}</h2>
                <p className="text-sm text-gray-500">{t.s10sub}</p>
                <div className="space-y-2">
                  <Label>{t.budgetRange}</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { v: "under500", label: t.budgetUnder500 },
                      { v: "500_1000", label: t.budget500_1000 },
                      { v: "1000_2000", label: t.budget1000_2000 },
                      { v: "2000_3500", label: t.budget2000_3500 },
                      { v: "over3500", label: t.budgetOver3500 },
                      { v: "flexible", label: t.budgetFlexible },
                    ].map(({ v, label }) => (
                      <RadioCard key={v} value={v} current={form.budgetRange} onChange={v => upd("budgetRange", v)} label={label} />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t.currency}</Label>
                  <div className="flex flex-wrap gap-2">
                    {["USD", "EUR", "GBP", "BRL", "CAD", "AUD"].map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => upd("currency", c)}
                        className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
                          form.currency === c
                            ? "border-[#FFB600] bg-[#FFB600] text-black"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 11: Estimate ── */}
            {step === 11 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-gray-900">{t.s11title}</h2>
                <p className="text-sm text-gray-500">{t.s11sub}</p>

                {!estimate ? (
                  <div className="flex items-center gap-2 text-gray-500 py-8 justify-center">
                    <RefreshCw className="w-4 h-4 animate-spin" /> {t.loading}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Range highlight */}
                    <div className="bg-black text-white rounded-2xl p-6 text-center">
                      <div className="text-sm text-gray-400 mb-1">{t.estimateRange}</div>
                      <div className="text-3xl font-bold text-[#FFB600]">
                        {fmt(estimate.lowPP)} – {fmt(estimate.highPP)}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{t.perPerson}</div>
                      <div className="mt-3 pt-3 border-t border-gray-700 text-sm text-gray-300">
                        {t.totalGroup}: <span className="font-semibold text-white">
                          {fmt(estimate.lowPP * form.pax)} – {fmt(estimate.highPP * form.pax)}
                        </span>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="rounded-xl border border-gray-200 overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                        {t.breakdown}
                      </div>
                      {[
                        { label: t.accommodation, value: estimate.accommodationPP, show: true },
                        { label: t.transport, value: estimate.transportPP, show: estimate.transportPP > 0 },
                        { label: t.experiences, value: estimate.experiencesPP, show: estimate.experiencesPP > 0 },
                        { label: t.meals, value: estimate.mealsPP, show: estimate.mealsPP > 0 },
                        { label: t.guideFees, value: estimate.servicesPP, show: estimate.servicesPP > 0 },
                      ].filter(r => r.show).map(row => (
                        <div key={row.label} className="flex justify-between items-center px-4 py-2.5 border-b border-gray-100 text-sm">
                          <span className="text-gray-700">{row.label}</span>
                          <span className="font-medium text-gray-900">{fmt(row.value)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center px-4 py-2.5 border-b border-gray-100 text-sm font-semibold bg-gray-50">
                        <span>{t.subtotal}</span>
                        <span>{fmt(estimate.subtotalPP)}</span>
                      </div>
                      {estimate.peakSurchargePP > 0 && (
                        <div className="flex justify-between items-center px-4 py-2.5 border-b border-gray-100 text-sm text-amber-700">
                          <span>⚠ {t.peakSurcharge}</span>
                          <span>+{fmt(estimate.peakSurchargePP)}</span>
                        </div>
                      )}
                      {estimate.discountPP > 0 && (
                        <div className="flex justify-between items-center px-4 py-2.5 border-b border-gray-100 text-sm text-[#009743]">
                          <span>✓ {t.groupDiscount} ({estimate.discountPct}% — {estimate.tierName})</span>
                          <span>−{fmt(estimate.discountPP)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center px-4 py-2.5 border-b border-gray-100 text-sm text-gray-500">
                        <span>{t.markup}</span>
                        <span>+{fmt(estimate.markupPP)}</span>
                      </div>
                      <div className="flex justify-between items-center px-4 py-3 text-base font-bold">
                        <span>{t.total}</span>
                        <span className="text-[#FFB600]">{fmt(estimate.totalPP)} <span className="text-xs text-gray-400 font-normal">/{t.perPerson}</span></span>
                      </div>
                    </div>

                    {estimate.discountPP > 0 && (
                      <div className="flex items-center gap-2 bg-[#009743]/10 text-[#009743] rounded-xl p-3 text-xs font-semibold">
                        <Award className="w-4 h-4 flex-shrink-0" />
                        {t.tier}: {estimate.tierName} — {estimate.discountPct}% discount applied
                      </div>
                    )}

                    <p className="text-xs text-gray-400">{t.pricingNote}</p>
                  </div>
                )}
              </div>
            )}

            {/* ── Step 12: Review & Submit ── */}
            {step === 12 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-gray-900">{t.s12title}</h2>
                <p className="text-sm text-gray-500">{t.s12sub}</p>

                <div className="space-y-3">
                  {[
                    {
                      label: t.reviewContact,
                      icon: Mail,
                      lines: [
                        form.contactName,
                        form.company,
                        form.email,
                        form.phone,
                      ].filter(Boolean),
                    },
                    {
                      label: t.reviewDates,
                      icon: Calendar,
                      lines: [
                        `${form.arrival} → ${form.departure}`,
                        nights > 0 ? `${nights} ${t.nights}` : "",
                      ].filter(Boolean),
                    },
                    {
                      label: t.reviewGroup,
                      icon: Users,
                      lines: [
                        `${form.pax} pax`,
                        form.groupType,
                        form.accommodation,
                      ],
                    },
                    {
                      label: t.reviewServices,
                      icon: Shield,
                      lines: [
                        form.mealPlan,
                        form.experiences.length + " experiences",
                        form.guideIncluded ? "Guide ✓" : "",
                        form.coordinatorIncluded ? "Coordinator ✓" : "",
                      ].filter(Boolean),
                    },
                    estimate ? {
                      label: t.reviewEstimate,
                      icon: TrendingUp,
                      lines: [
                        `${fmt(estimate.lowPP)} – ${fmt(estimate.highPP)} / person`,
                        `Group total: ${fmt(estimate.lowPP * form.pax)} – ${fmt(estimate.highPP * form.pax)}`,
                      ],
                    } : null,
                  ].filter(Boolean).map(section => {
                    const SectionIcon = section!.icon;
                    return (
                      <div key={section!.label} className="rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <SectionIcon className="w-4 h-4 text-[#FFB600]" />
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{section!.label}</span>
                        </div>
                        {section!.lines.map((line, i) => (
                          <div key={i} className="text-sm text-gray-700">{line}</div>
                        ))}
                      </div>
                    );
                  })}
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={submitQuote.isPending}
                  className="w-full bg-[#FFB600] hover:bg-[#e6a400] text-black font-bold py-4 text-base gap-2 rounded-xl"
                >
                  {submitQuote.isPending ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> {t.submitting}</>
                  ) : (
                    <><Send className="w-4 h-4" /> {t.submitQuote}</>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={step === 1 ? undefined : handleBack}
              disabled={step === 1}
              className="gap-1.5 text-gray-600"
              asChild={step === 1}
            >
              {step === 1 ? (
                <Link href="/group-travel"><ArrowLeft className="w-4 h-4" /> {t.back}</Link>
              ) : (
                <span><ArrowLeft className="w-4 h-4" /> {t.back}</span>
              )}
            </Button>

            {step < 12 && (
              <Button
                onClick={handleNext}
                className="bg-[#FFB600] hover:bg-[#e6a400] text-black font-semibold gap-1.5"
              >
                {t.next} <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

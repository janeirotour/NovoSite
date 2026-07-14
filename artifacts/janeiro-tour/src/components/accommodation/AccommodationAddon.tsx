import { useState, useMemo } from "react";
import { useListHotels, useListSpecialSeasons } from "@workspace/api-client-react";
import type { Hotel } from "@workspace/api-client-react";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Building2, Star, MapPin, Users, CheckCircle2, AlertTriangle,
  ChevronDown, ChevronUp, X, Info, BedDouble, Calendar,
} from "lucide-react";

// ─── i18n ─────────────────────────────────────────────────────────────────────
const TX = {
  sectionTitle:   { en: "Add Accommodation to Your Package",   es: "Agregar Alojamiento a su Paquete",      pt: "Adicionar Hospedagem ao seu Pacote" },
  sectionDesc:    { en: "Choose one of our recommended hotels in Rio de Janeiro. Rates are based on double occupancy per room and are subject to availability and final confirmation.", es: "Elija uno de nuestros hoteles recomendados en Río de Janeiro. Las tarifas se basan en doble ocupación por habitación y están sujetas a disponibilidad y confirmación final.", pt: "Escolha um dos nossos hotéis recomendados no Rio de Janeiro. As tarifas são baseadas em dupla ocupação por quarto e estão sujeitas a disponibilidade e confirmação final." },
  noAccom:        { en: "No accommodation (land only)",        es: "Sin alojamiento (solo tierra)",          pt: "Sem hospedagem (só terra)" },
  perRoomNight:   { en: "/ room / night",                      es: "/ hab. / noche",                        pt: "/ quarto / noite" },
  perPerson:      { en: "per person",                          es: "por persona",                           pt: "por pessoa" },
  select:         { en: "Select",                              es: "Seleccionar",                           pt: "Selecionar" },
  selected:       { en: "Selected",                            es: "Seleccionado",                          pt: "Selecionado" },
  change:         { en: "Change",                              es: "Cambiar",                               pt: "Alterar" },
  bestFor:        { en: "Best for",                            es: "Ideal para",                            pt: "Ideal para" },
  rooms:          { en: "Rooms",                               es: "Habitaciones",                          pt: "Quartos" },
  nights:         { en: "Nights",                              es: "Noches",                                pt: "Noites" },
  checkIn:        { en: "Check-in",                            es: "Check-in",                              pt: "Check-in" },
  checkOut:       { en: "Check-out",                           es: "Check-out",                             pt: "Check-out" },
  adults:         { en: "Adults",                              es: "Adultos",                               pt: "Adultos" },
  children:       { en: "Children",                            es: "Niños",                                 pt: "Crianças" },
  specialReqs:    { en: "Special requests",                    es: "Solicitudes especiales",                pt: "Pedidos especiais" },
  specialReqsPh:  { en: "e.g. adjoining rooms, accessibility needs, late check-in...", es: "Ej. habitaciones contiguas, accesibilidad, check-in tardío...", pt: "Ex. quartos comunicantes, acessibilidade, check-in tardio..." },
  priceBreakdown: { en: "Price estimate",                      es: "Estimación de precio",                  pt: "Estimativa de preço" },
  hotelSubtotal:  { en: "Hotel subtotal",                      es: "Subtotal hotel",                        pt: "Subtotal hotel" },
  nightsLabel:    { en: "nights",                              es: "noches",                                pt: "noites" },
  roomsLabel:     { en: "rooms",                               es: "habitaciones",                          pt: "quartos" },
  specialWarning: { en: "Special-season rate — final price and availability require confirmation.", es: "Tarifa de temporada especial — el precio final y la disponibilidad requieren confirmación.", pt: "Tarifa de alta temporada — preço final e disponibilidade requerem confirmação." },
  availNotice:    { en: "If your selected hotel is unavailable, Janeiro Tour & Travel may offer an alternative of the same or higher category. Any substitution will be presented for your approval before confirmation.", es: "Si el hotel seleccionado no está disponible, Janeiro Tour & Travel puede ofrecer una alternativa de la misma o mayor categoría. Cualquier sustitución se presentará para su aprobación.", pt: "Se o hotel selecionado não estiver disponível, Janeiro Tour & Travel poderá oferecer uma alternativa da mesma ou superior categoria. Qualquer substituição será apresentada para sua aprovação antes da confirmação." },
  ratesNotice:    { en: "Hotel rates are estimates based on the selected dates, room type and double occupancy. All accommodations are subject to availability and final confirmation. Rates may change during holidays, Carnival, New Year's Eve and major events.", es: "Las tarifas de hotel son estimaciones basadas en las fechas seleccionadas, tipo de habitación y doble ocupación. Todo alojamiento está sujeto a disponibilidad y confirmación final. Las tarifas pueden cambiar durante feriados, Carnaval, Nochevieja y grandes eventos.", pt: "As tarifas dos hotéis são estimativas baseadas nas datas selecionadas, tipo de quarto e dupla ocupação. Todas as acomodações estão sujeitas a disponibilidade e confirmação final. As tarifas podem mudar em feriados, Carnaval, Réveillon e grandes eventos." },
  onRequest:      { en: "On request",                          es: "Bajo consulta",                         pt: "Sob consulta" },
  unavailable:    { en: "Temporarily unavailable",             es: "Temporalmente no disponible",           pt: "Temporariamente indisponível" },
  occupancy:      { en: "Double occupancy",                    es: "Doble ocupación",                       pt: "Dupla ocupação" },
  category:       { en: "Category",                            es: "Categoría",                             pt: "Categoria" },
  viewDetails:    { en: "Details",                             es: "Detalles",                              pt: "Detalhes" },
  hideDetails:    { en: "Hide",                                es: "Ocultar",                               pt: "Ocultar" },
  currency:       { en: "Currency: BRL (R$)",                  es: "Moneda: BRL (R$)",                      pt: "Moeda: BRL (R$)" },
};

function t(key: keyof typeof TX, lang: string): string {
  const entry = TX[key] as Record<string, string>;
  return entry[lang] ?? entry.en;
}

function starStars(n: number) {
  return Array.from({ length: n }, (_, i) => (
    <Star key={i} className="w-3 h-3 fill-primary text-primary" />
  ));
}

function fmtBRL(n: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 }).format(n);
}

function isDateInSeason(dateStr: string, start: string, end: string): boolean {
  if (!dateStr) return false;
  return dateStr >= start && dateStr <= end;
}

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AccommodationSelection {
  hotelId: number | null;
  hotelName: string;
  hotelSlug: string;
  hotelCategory: string;
  rooms: number;
  nights: number;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  specialRequests: string;
  appliedRate: number;
  hotelSubtotal: number;
  isSpecialSeason: boolean;
  currency: string;
}

interface Props {
  packagePriceLabel?: string;
  onSelectionChange?: (sel: AccommodationSelection | null) => void;
  lang?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function AccommodationAddon({ packagePriceLabel, onSelectionChange, lang: langProp }: Props) {
  const { lang: langCtx } = useLanguage();
  const lang = langProp ?? langCtx;

  const { data: hotels = [], isLoading } = useListHotels({ activeOnly: true });
  const { data: seasons = [] } = useListSpecialSeasons();
  const activeSeasons = useMemo(() => seasons.filter(s => s.isActive), [seasons]);

  const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);
  const [rooms, setRooms] = useState(1);
  const [nights, setNights] = useState(3);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [specialRequests, setSpecialRequests] = useState("");
  const [expandedDetails, setExpandedDetails] = useState<number | null>(null);

  const selectedHotel = hotels.find(h => h.id === selectedHotelId) ?? null;

  const isSpecialSeason = useMemo(() => {
    if (!checkIn && !checkOut) return false;
    const date = checkIn || checkOut;
    return activeSeasons.some(s => isDateInSeason(date, s.startDate, s.endDate));
  }, [checkIn, checkOut, activeSeasons]);

  const appliedRate = selectedHotel ? Number(selectedHotel.regularRate) : 0;
  const hotelSubtotal = appliedRate * rooms * Math.max(nights, 1);

  const shortDesc = (h: Hotel) => {
    if (lang === "pt") return h.shortDescPt || h.shortDescEn;
    if (lang === "es") return h.shortDescEs || h.shortDescEn;
    return h.shortDescEn;
  };
  const bestFor = (h: Hotel) => {
    if (lang === "pt") return h.bestForPt || h.bestForEn;
    if (lang === "es") return h.bestForEs || h.bestForEn;
    return h.bestForEn;
  };

  function handleSelect(hotel: Hotel) {
    setSelectedHotelId(hotel.id);
    const sel: AccommodationSelection = {
      hotelId: hotel.id, hotelName: hotel.name, hotelSlug: hotel.slug,
      hotelCategory: hotel.category, rooms, nights, checkIn, checkOut,
      adults, children, specialRequests, appliedRate: Number(hotel.regularRate),
      hotelSubtotal: Number(hotel.regularRate) * rooms * Math.max(nights, 1),
      isSpecialSeason, currency: hotel.currency ?? "BRL",
    };
    onSelectionChange?.(sel);
  }

  function handleDeselect() {
    setSelectedHotelId(null);
    onSelectionChange?.(null);
  }

  function updateSelection(overrides: Partial<AccommodationSelection>) {
    if (!selectedHotel) return;
    const rate = Number(selectedHotel.regularRate);
    const n = overrides.nights ?? nights;
    const r = overrides.rooms ?? rooms;
    const ci = overrides.checkIn ?? checkIn;
    const co = overrides.checkOut ?? checkOut;
    const special = activeSeasons.some(s => isDateInSeason(ci || co, s.startDate, s.endDate));
    const sel: AccommodationSelection = {
      hotelId: selectedHotel.id, hotelName: selectedHotel.name, hotelSlug: selectedHotel.slug,
      hotelCategory: selectedHotel.category, rooms: r, nights: n, checkIn: ci, checkOut: co,
      adults: overrides.adults ?? adults, children: overrides.children ?? children,
      specialRequests: overrides.specialRequests ?? specialRequests,
      appliedRate: rate, hotelSubtotal: rate * r * Math.max(n, 1),
      isSpecialSeason: special, currency: selectedHotel.currency ?? "BRL",
    };
    onSelectionChange?.(sel);
  }

  const statusBadge = (h: Hotel) => {
    if (h.availabilityStatus === "unavailable") return <Badge variant="destructive" className="text-[10px]">{t("unavailable", lang)}</Badge>;
    if (h.availabilityStatus === "on_request") return <Badge variant="outline" className="border-amber-400 text-amber-600 text-[10px]">{t("onRequest", lang)}</Badge>;
    return null;
  };

  return (
    <section className="border border-gray-100 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-100 px-6 py-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <BedDouble className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">{t("sectionTitle", lang)}</h2>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed ml-11">{t("sectionDesc", lang)}</p>
        <p className="text-xs text-gray-400 ml-11 mt-1">{t("currency", lang)}</p>
      </div>

      <div className="p-6 space-y-4">
        {/* No accommodation option */}
        <button
          onClick={handleDeselect}
          className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${selectedHotelId === null ? "border-gray-900 bg-gray-900/5" : "border-gray-200 hover:border-gray-300"}`}
        >
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedHotelId === null ? "border-gray-900 bg-gray-900" : "border-gray-300"}`}>
            {selectedHotelId === null && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
          <span className="font-medium text-gray-700 text-sm">{t("noAccom", lang)}</span>
        </button>

        {/* Hotel cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[1,2,3,4].map(i => <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {hotels.map(hotel => {
              const isSelected = selectedHotelId === hotel.id;
              const isExpanded = expandedDetails === hotel.id;
              const unavailable = hotel.availabilityStatus === "unavailable";
              return (
                <div
                  key={hotel.id}
                  className={`rounded-xl border-2 overflow-hidden transition-all ${isSelected ? "border-primary shadow-md" : "border-gray-200 hover:border-gray-300"} ${unavailable ? "opacity-60" : ""}`}
                >
                  {/* Image */}
                  {hotel.heroImageUrl && (
                    <div className="relative h-36 overflow-hidden">
                      <img src={hotel.heroImageUrl} alt={hotel.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent" />
                      <div className="absolute top-2 left-2 flex gap-1">{starStars(hotel.starLevel)}</div>
                      {statusBadge(hotel) && (
                        <div className="absolute top-2 right-2">{statusBadge(hotel)}</div>
                      )}
                      <div className="absolute bottom-2 left-2">
                        <p className="text-white font-bold text-sm leading-tight">{hotel.name}</p>
                        <div className="flex items-center gap-1 text-white/70 text-xs mt-0.5">
                          <MapPin className="w-3 h-3" />{hotel.neighborhood}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Body */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-semibold uppercase tracking-wide">
                        <Building2 className="w-3 h-3" />{hotel.category}
                      </span>
                      <div className="text-right">
                        <span className="text-base font-black text-gray-900">{fmtBRL(Number(hotel.regularRate))}</span>
                        <span className="text-[10px] text-gray-400 block">{t("perRoomNight", lang)}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-2">{shortDesc(hotel)}</p>

                    {/* Expandable details */}
                    {isExpanded && (
                      <div className="mb-3 space-y-2 border-t border-gray-100 pt-2">
                        <p className="text-xs text-gray-600"><span className="font-semibold">{t("bestFor", lang)}:</span> {bestFor(hotel)}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1"><Users className="w-3 h-3" />{t("occupancy", lang)}</p>
                        <p className="text-xs text-amber-600 flex items-start gap-1">
                          <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                          <span>{lang === "pt" ? hotel.specialRateConditionsPt : lang === "es" ? hotel.specialRateConditionsEs : hotel.specialRateConditionsEn}</span>
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => setExpandedDetails(isExpanded ? null : hotel.id)}
                        className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 flex-shrink-0"
                      >
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        {isExpanded ? t("hideDetails", lang) : t("viewDetails", lang)}
                      </button>
                      <Button
                        size="sm"
                        disabled={unavailable}
                        onClick={() => isSelected ? handleDeselect() : handleSelect(hotel)}
                        className={`flex-1 text-xs h-8 ${isSelected ? "bg-primary text-gray-900 hover:bg-primary/90" : "bg-gray-900 text-white hover:bg-gray-800"}`}
                      >
                        {isSelected ? (
                          <><X className="w-3 h-3 mr-1" />{t("change", lang)}</>
                        ) : (
                          <><CheckCircle2 className="w-3 h-3 mr-1" />{t("select", lang)}</>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Booking details — shown when a hotel is selected */}
        {selectedHotel && (
          <div className="border border-primary/30 rounded-xl p-5 bg-primary/5 space-y-4 mt-2">
            <div className="flex items-center gap-2">
              <BedDouble className="w-4 h-4 text-primary" />
              <span className="font-semibold text-gray-900 text-sm">{selectedHotel.name}</span>
              <Badge className="bg-primary text-gray-900 text-[10px] ml-auto">{t("selected", lang)}</Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">{t("checkIn", lang)}</Label>
                <div className="relative">
                  <Calendar className="absolute left-2 top-2.5 w-3.5 h-3.5 text-gray-400" />
                  <Input type="date" value={checkIn} className="h-9 pl-7 text-sm" onChange={e => { setCheckIn(e.target.value); updateSelection({ checkIn: e.target.value }); }} />
                </div>
              </div>
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">{t("checkOut", lang)}</Label>
                <div className="relative">
                  <Calendar className="absolute left-2 top-2.5 w-3.5 h-3.5 text-gray-400" />
                  <Input type="date" value={checkOut} className="h-9 pl-7 text-sm" onChange={e => { setCheckOut(e.target.value); updateSelection({ checkOut: e.target.value }); }} />
                </div>
              </div>
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">{t("rooms", lang)}</Label>
                <Input type="number" min={1} max={20} value={rooms} className="h-9 text-sm" onChange={e => { const v = Math.max(1, Number(e.target.value)); setRooms(v); updateSelection({ rooms: v }); }} />
              </div>
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">{t("nights", lang)}</Label>
                <Input type="number" min={1} max={60} value={nights} className="h-9 text-sm" onChange={e => { const v = Math.max(1, Number(e.target.value)); setNights(v); updateSelection({ nights: v }); }} />
              </div>
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">{t("adults", lang)}</Label>
                <Input type="number" min={1} max={100} value={adults} className="h-9 text-sm" onChange={e => { const v = Math.max(1, Number(e.target.value)); setAdults(v); updateSelection({ adults: v }); }} />
              </div>
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">{t("children", lang)}</Label>
                <Input type="number" min={0} max={50} value={children} className="h-9 text-sm" onChange={e => { const v = Math.max(0, Number(e.target.value)); setChildren(v); updateSelection({ children: v }); }} />
              </div>
              <div className="col-span-2">
                <Label className="text-xs text-gray-500 mb-1 block">{t("specialReqs", lang)}</Label>
                <Textarea placeholder={t("specialReqsPh", lang)} value={specialRequests} rows={2} className="text-sm resize-none" onChange={e => { setSpecialRequests(e.target.value); updateSelection({ specialRequests: e.target.value }); }} />
              </div>
            </div>

            {/* Price estimate */}
            <div className="bg-white rounded-lg p-4 border border-gray-100">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">{t("priceBreakdown", lang)}</p>
              {packagePriceLabel && (
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Package</span><span>{packagePriceLabel}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-600">
                <span>{t("hotelSubtotal", lang)} <span className="text-xs text-gray-400">({rooms} {t("roomsLabel", lang)} × {nights} {t("nightsLabel", lang)})</span></span>
                <span className="font-semibold">{fmtBRL(hotelSubtotal)}</span>
              </div>
            </div>

            {/* Special season warning */}
            {isSpecialSeason && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed">{t("specialWarning", lang)}</p>
              </div>
            )}
          </div>
        )}

        {/* Availability notice */}
        <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg p-3">
          <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 leading-relaxed">{t("availNotice", lang)}</p>
        </div>

        {/* Rates disclaimer */}
        <p className="text-[11px] text-gray-400 leading-relaxed">{t("ratesNotice", lang)}</p>
      </div>
    </section>
  );
}

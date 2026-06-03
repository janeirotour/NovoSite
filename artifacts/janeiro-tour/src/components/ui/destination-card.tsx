import { Link } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { Destination } from "@workspace/api-client-react";

export function DestinationCard({ destination }: { destination: Destination }) {
  const { t } = useLanguage();

  return (
    <Link href={`/destinations/${destination.slug}`}>
      <div className="group relative rounded-2xl overflow-hidden aspect-[3/2] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300">
        <img
          src={destination.imageUrl || "/images/dest-salvador.png"}
          alt={t(destination, "name")}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-serif font-bold text-2xl md:text-3xl mb-1">
            {t(destination, "name")}
          </h3>
          <p className="text-white/80 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            {t(destination, "description")?.substring(0, 80)}...
          </p>
        </div>
      </div>
    </Link>
  );
}


import { ShieldCheck, Truck, MessageCircle, CreditCard } from "lucide-react";
import { features } from "@/mock/data";

const iconMap = {
  ShieldCheck,
  Truck,
  MessageCircle,
  CreditCard
};

export function FeatureBenefits() {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature) => {
          const Icon = iconMap[feature.icon as keyof typeof iconMap];
          return (
            <div key={feature.id} className="flex items-start gap-4 p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-red-50 text-[#D92D20] rounded-full flex items-center justify-center shrink-0">
                {Icon && <Icon className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

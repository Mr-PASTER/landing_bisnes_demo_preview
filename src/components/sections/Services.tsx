"use client";

import { motion } from "framer-motion";
import { PenTool, Home, RefreshCw, Trees, Building, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const services = [
  {
    id: 1,
    title: "Проектирование",
    description: "Индивидуальное проектирование с использованием BIM-технологий. Мы создаем детальные планы вашей мечты.",
    icon: PenTool,
    className: "md:col-span-2 md:row-span-2",
    variant: "primary"
  },
  {
    id: 2,
    title: "Строительство домов",
    description: "Строительство под ключ от фундамента до финишной отделки.",
    icon: Home,
    className: "md:col-span-1 md:row-span-1",
    variant: "default"
  },
  {
    id: 3,
    title: "Реконструкция",
    description: "Модернизация существующих зданий и сооружений.",
    icon: RefreshCw,
    className: "md:col-span-1 md:row-span-1",
    variant: "default"
  },
  {
    id: 4,
    title: "Ландшафтный дизайн",
    description: "Благоустройство территории, озеленение и создание уникальных ландшафтов.",
    icon: Trees,
    className: "md:col-span-2 md:row-span-1",
    variant: "default"
  },
  {
    id: 5,
    title: "Коммерческие объекты",
    description: "Строительство офисов, складов и торговых центров.",
    icon: Building,
    className: "md:col-span-1 md:row-span-1",
    variant: "default"
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 md:py-32 bg-neutral-dark text-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">Наши услуги</h2>
          <p className="text-gray-400 max-w-2xl">
            Полный цикл строительных работ для реализации проектов любой сложности.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(200px,auto)]">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              className={cn("relative group", service.className)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                variant="glass" 
                hover 
                className="h-full p-6 flex flex-col justify-between bg-white/5 border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={cn(
                    "p-3 rounded-xl", 
                    service.variant === "primary" ? "bg-primary text-white" : "bg-white/10 text-white"
                  )}>
                    <service.icon size={24} />
                  </div>
                  <ArrowUpRight className="text-gray-500 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">
                    {service.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


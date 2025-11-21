"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Hammer, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Scene from "@/components/3d/Scene";

const benefits = [
  { icon: Clock, text: "15+ лет на рынке" },
  { icon: CheckCircle, text: "200+ объектов" },
  { icon: Shield, text: "Гарантия 10 лет" },
];

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-white to-blue-50 pt-20">
      
      {/* 3D Background / Right Side */}
      <div className="absolute inset-0 lg:left-1/3 lg:w-2/3 z-0 pointer-events-none lg:pointer-events-auto">
        <Scene />
      </div>

      {/* Content Container */}
      <div className="container relative z-10 mx-auto h-full px-4 md:px-6 flex flex-col justify-center min-h-[calc(100vh-80px)]">
        <div className="max-w-xl lg:max-w-2xl space-y-8 mt-10 lg:mt-0">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading text-neutral-dark leading-tight">
              Строим Будущее <br />
              <span className="text-primary">Вместе с Вами</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 max-w-lg"
          >
            Современные технологии строительства. От проекта до ключей за 6 месяцев.
            Мы создаем дома, в которых хочется жить.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <Button size="lg" className="text-lg px-8">
              Рассчитать стоимость
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8">
              Наши проекты
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-gray-200/50"
          >
            {benefits.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full text-primary">
                  <item.icon size={20} />
                </div>
                <span className="text-sm font-medium text-gray-700">{item.text}</span>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}


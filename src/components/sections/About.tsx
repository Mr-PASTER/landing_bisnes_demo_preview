"use client";

import { motion } from "framer-motion";
import { Trophy, Building2, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";

const stats = [
  {
    icon: Trophy,
    value: "15+",
    label: "лет успешной работы",
    description: "Опыт, которому доверяют"
  },
  {
    icon: Building2,
    value: "200+",
    label: "завершенных объектов",
    description: "Жилые и коммерческие здания"
  },
  {
    icon: Users,
    value: "50+",
    label: "профессионалов",
    description: "В штате компании"
  },
];

export default function About() {
  return (
    <section id="about" className="py-20 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">Почему выбирают нас</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Мы создаем не просто здания, а пространство для жизни и бизнеса, сочетая инновационные технологии с проверенными решениями.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card variant="elevated" className="p-8 text-center h-full flex flex-col items-center justify-center hover:shadow-2xl transition-shadow">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-primary mb-6">
                  <stat.icon size={32} />
                </div>
                <h3 className="text-4xl font-bold text-neutral-dark mb-2">{stat.value}</h3>
                <p className="text-lg font-medium text-gray-800 mb-2">{stat.label}</p>
                <p className="text-sm text-gray-500">{stat.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Info Block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h3 className="text-2xl md:text-3xl font-bold font-heading">
              Качество, проверенное временем
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Мы - команда профессионалов с 15-летним опытом в строительной индустрии. Наша миссия - создавать качественные, комфортные и энергоэффективные дома, которые становятся настоящим домом для наших клиентов.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Мы используем только проверенные материалы и современные технологии строительства, что позволяет нам гарантировать долговечность и надежность каждого объекта.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[400px] rounded-2xl overflow-hidden bg-gray-200 shadow-lg"
          >
            {/* Placeholder for Parallax Image */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
               <Building2 className="text-blue-300 w-32 h-32 opacity-50" />
            </div>
            <div className="absolute inset-0 bg-black/10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


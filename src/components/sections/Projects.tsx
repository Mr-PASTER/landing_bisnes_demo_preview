"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

const categories = [
  { id: "all", label: "Все проекты" },
  { id: "residential", label: "Жилые" },
  { id: "commercial", label: "Коммерческие" },
  { id: "reconstruction", label: "Реконструкция" },
];

export default function Projects() {
  const [filter, setFilter] = useState("all");

  const filteredProjects = projects.filter(
    (project) => filter === "all" || project.category === filter
  );

  return (
    <section id="projects" className="py-20 md:py-32 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">Реализованные проекты</h2>
            <p className="text-gray-600 max-w-xl">
              Мы гордимся каждым построенным объектом. Посмотрите наше портфолио.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-2 mt-6 md:mt-0"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === cat.id
                    ? "bg-primary text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>
        </div>

        <motion.div 
          layout 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card variant="default" hover className="h-full flex flex-col group overflow-hidden">
                  <div className="relative h-64 bg-gray-200 overflow-hidden">
                    {/* Placeholder for image - Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                       {/* Image Placeholder */}
                       <span className="font-medium">Изображение проекта</span>
                    </div>
                    
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button variant="secondary" size="sm">
                        Подробнее
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold mb-2 font-heading">{project.title}</h3>
                    <div className="grid grid-cols-3 gap-2 text-sm text-gray-500 mt-auto pt-4 border-t border-gray-100">
                      <div>
                        <span className="block text-xs text-gray-400">Площадь</span>
                        {project.specs.area}
                      </div>
                      <div>
                        <span className="block text-xs text-gray-400">Срок</span>
                        {project.specs.term}
                      </div>
                      <div>
                        <span className="block text-xs text-gray-400">Стоимость</span>
                        {project.specs.cost}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" className="group">
            Посмотреть все проекты
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}


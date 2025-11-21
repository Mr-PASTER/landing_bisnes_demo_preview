"use client";

import { motion } from "framer-motion";
import { Info, ExternalLink } from "lucide-react";

export default function DemoBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-6 left-6 z-50 max-w-xs"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 p-4 group hover:shadow-xl transition-all duration-300">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg text-primary shrink-0">
            <Info size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-900 mb-1">
              Демонстрационный проект
            </p>
            <p className="text-xs text-gray-600 mb-3">
              Это учебный лендинг для демонстрации навыков веб-разработки
            </p>
            <a
              href="https://mr-paster.github.io/web/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-secondary transition-colors group-hover:gap-2 duration-300"
            >
              <span>Сайт исполнителя</span>
              <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to contact website
    window.open('https://mr-paster.github.io/web/', '_blank');
  };

  return (
    <section id="contacts" className="py-20 md:py-32 bg-white relative">
       <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white pointer-events-none h-1/2" />
       
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">Готовы начать проект?</h2>
              <p className="text-gray-600">
                Оставьте заявку, и наши специалисты проведут бесплатную консультацию и рассчитают предварительную стоимость.
              </p>
            </div>

            <Card className="p-8 bg-white shadow-xl border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">Ваше имя</label>
                    <input
                      id="name"
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="Иван Иванов"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700">Телефон</label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="+7 (999) 000-00-00"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                  <input
                    id="email"
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="example@mail.com"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-700">Сообщение</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Расскажите о вашем проекте..."
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full md:w-auto">
                  Отправить заявку
                  <Send className="ml-2 w-4 h-4" />
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Right Side - Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8 lg:pl-12 pt-12"
          >
            <div className="space-y-6">
              <h3 className="text-2xl font-bold font-heading">Контакты</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-primary">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Телефон</p>
                    <a href="tel:+79991234567" className="text-xl font-bold text-neutral-dark hover:text-primary transition-colors">
                      +7 (999) 123-45-67
                    </a>
                    <p className="text-sm text-gray-400 mt-1">Пн-Пт, 9:00 — 18:00</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-primary">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <a href="mailto:info@construction.com" className="text-xl font-bold text-neutral-dark hover:text-primary transition-colors">
                      info@construction.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-primary">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Офис</p>
                    <p className="text-lg font-medium text-neutral-dark">
                      г. Москва, ул. Примерная, д. 1
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="h-64 bg-gray-200 rounded-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gray-300 flex items-center justify-center text-gray-500">
                <span className="font-medium">Интерактивная карта</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}


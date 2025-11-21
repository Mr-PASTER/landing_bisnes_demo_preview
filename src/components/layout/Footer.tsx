import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1: About */}
          <div>
            <Link href="/" className="text-2xl font-bold font-heading text-white mb-6 block">
              CONSTRUCT
            </Link>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Мы строим будущее, создавая комфортные и надежные дома для жизни. 
              15 лет опыта и более 200 реализованных проектов.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-400 hover:text-secondary transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-secondary transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-secondary transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-secondary transition-colors">
                <Linkedin size={20} />
              </Link>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 className="text-lg font-bold mb-6">Навигация</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="#about" className="hover:text-white transition-colors">О нас</Link></li>
              <li><Link href="#projects" className="hover:text-white transition-colors">Проекты</Link></li>
              <li><Link href="#services" className="hover:text-white transition-colors">Услуги</Link></li>
              <li><Link href="#contacts" className="hover:text-white transition-colors">Контакты</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Политика конфиденциальности</Link></li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="text-lg font-bold mb-6">Услуги</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">Проектирование</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Строительство домов</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Реконструкция</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Ландшафтный дизайн</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Коммерческие объекты</Link></li>
            </ul>
          </div>

          {/* Column 4: Contacts */}
          <div>
            <h3 className="text-lg font-bold mb-6">Контакты</h3>
            <ul className="space-y-6 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <Phone size={20} className="text-secondary shrink-0" />
                <span>+7 (999) 123-45-67<br/>Пн-Пт: 9:00-18:00</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={20} className="text-secondary shrink-0" />
                <span>info@construction.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-secondary shrink-0" />
                <span>г. Москва, ул. Примерная, д. 1</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © 2024 Construction Company. Все права защищены.
          </p>
          <p className="text-sm text-gray-600">
            Designed by Gemini AI
          </p>
        </div>
      </div>
    </footer>
  );
}


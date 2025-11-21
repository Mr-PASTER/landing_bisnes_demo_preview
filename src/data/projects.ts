export interface Project {
  id: number;
  title: string;
  category: "residential" | "commercial" | "reconstruction";
  image: string; // In a real app, this would be a path to an image
  specs: {
    area: string;
    term: string;
    cost: string;
  };
}

export const projects: Project[] = [
  {
    id: 1,
    title: 'Загородный дом "Комфорт"',
    category: 'residential',
    image: '/images/projects/1.jpg',
    specs: { area: '250 м²', term: '6 месяцев', cost: '15 млн ₽' }
  },
  {
    id: 2,
    title: 'Коттеджный поселок "Зеленая долина"',
    category: 'residential',
    image: '/images/projects/2.jpg',
    specs: { area: '15 домов', term: '18 месяцев', cost: 'Индивидуально' }
  },
  {
    id: 3,
    title: 'Офисный центр "Бизнес-Парк"',
    category: 'commercial',
    image: '/images/projects/3.jpg',
    specs: { area: '5000 м²', term: '12 месяцев', cost: 'Контрактная' }
  },
  {
    id: 4,
    title: 'Реставрация усадьбы',
    category: 'reconstruction',
    image: '/images/projects/4.jpg',
    specs: { area: '800 м²', term: '14 месяцев', cost: '30 млн ₽' }
  },
  {
    id: 5,
    title: 'Таунхаус "Семейный"',
    category: 'residential',
    image: '/images/projects/5.jpg',
    specs: { area: '180 м²', term: '5 месяцев', cost: '12 млн ₽' }
  },
  {
    id: 6,
    title: 'Торговый павильон',
    category: 'commercial',
    image: '/images/projects/6.jpg',
    specs: { area: '300 м²', term: '3 месяца', cost: '5 млн ₽' }
  },
];


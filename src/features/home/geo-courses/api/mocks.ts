import type { GeoCoursesData } from '../types';
import type { CourseDTO } from './types';
import { transformCourseDTO } from './utils';

export const MOCK_COURSES_DTO: CourseDTO[] = [
  {
    id: '1',
    name: 'Engenharia civil',
    category: 'Engenharia & Tecnologia',
    degree: 'Bacharelado',
    duration: '5 anos (10 semestres)',
    modalities: ['presencial'],
    price: 950,
    campus: {
      name: 'Unidade Aquarius',
      city: 'São José dos Campos',
      state: 'SP',
      coordinates: {
        latitude: -23.1813,
        longitude: -45.8877,
      },
    },
    slug: 'engenharia-civil',
  },
  {
    id: '2',
    name: 'Sociologia',
    category: 'Ciências Humanas',
    degree: 'Licenciatura',
    duration: '4 anos (8 semestres)',
    modalities: ['ead'],
    price: 320,
    campus: {
      name: 'Polo Centro',
      city: 'São José dos Campos',
      state: 'SP',
      coordinates: {
        latitude: -23.1815,
        longitude: -45.8888,
      },
    },
    slug: 'sociologia',
  },
  {
    id: '3',
    name: 'Enfermagem',
    category: 'Ciências da Saúde',
    degree: 'Bacharelado',
    duration: '5 anos (10 semestres)',
    modalities: ['presencial', 'semipresencial'],
    price: 1240,
    campus: {
      name: 'Unidade Aquarius',
      city: 'São José dos Campos',
      state: 'SP',
      coordinates: {
        latitude: -23.1813,
        longitude: -45.8877,
      },
    },
    slug: 'enfermagem',
  },
  {
    id: '4',
    name: 'Análise e desenvolvimento de sistemas',
    category: 'Engenharia & Tecnologia',
    degree: 'Bacharelado',
    duration: '5 anos (10 semestres)',
    modalities: ['ead'],
    price: 450,
    campus: {
      name: 'Polo Centro',
      city: 'São José dos Campos',
      state: 'SP',
      coordinates: {
        latitude: -23.1815,
        longitude: -45.8888,
      },
    },
    slug: 'analise-desenvolvimento-sistemas',
  },
  {
    id: '5',
    name: 'Administração',
    category: 'Gestão & Negócios',
    degree: 'Bacharelado',
    duration: '4 anos (8 semestres)',
    modalities: ['presencial', 'semipresencial', 'ead'],
    price: 550,
    campus: {
      name: 'Unidade Aquarius',
      city: 'São José dos Campos',
      state: 'SP',
      coordinates: {
        latitude: -23.1813,
        longitude: -45.8877,
      },
    },
    slug: 'administracao',
  },
  {
    id: '6',
    name: 'Psicologia',
    category: 'Ciências Humanas',
    degree: 'Bacharelado',
    duration: '5 anos (10 semestres)',
    modalities: ['presencial'],
    price: 780,
    campus: {
      name: 'Polo Centro',
      city: 'São José dos Campos',
      state: 'SP',
      coordinates: {
        latitude: -23.1815,
        longitude: -45.8888,
      },
    },
    slug: 'psicologia',
  },
];

const MOCK_COURSES_DATA = MOCK_COURSES_DTO.map(transformCourseDTO);

export const MOCK_GEO_COURSES_DATA: GeoCoursesData = {
  title: 'Encontre o seu curso e transforme sua carreira!',
  description: 'Explore nossa ampla variedade de cursos de qualidade',
  location: {
    city: 'São José dos Campos',
    state: 'SP',
    coordinates: {
      latitude: -23.1814,
      longitude: -45.8883,
    },
  },
  courses: MOCK_COURSES_DATA,
};

export const MOCK_POPULAR_COURSES_DATA: GeoCoursesData = {
  title: 'Os cursos mais procurados em sua região',
  description: 'Explore nossa ampla variedade de cursos de qualidade',
  location: {
    city: 'São José dos Campos',
    state: 'SP',
    coordinates: {
      latitude: -23.1814,
      longitude: -45.8883,
    },
  },
  courses: [
    MOCK_COURSES_DATA[0], // Engenharia civil
    MOCK_COURSES_DATA[2], // Enfermagem
    MOCK_COURSES_DATA[3], // Análise e desenvolvimento de sistemas
    MOCK_COURSES_DATA[4], // Administração
  ],
};

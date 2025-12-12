import { Service, ServiceCategory, User, Booking } from './types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Amani Omondi',
  avatar: 'https://picsum.photos/seed/amani/100/100',
  isSeller: true,
  location: 'Nairobi, Kenya',
  rating: 4.8,
  joinedDate: 'Jan 2023'
};

export const MOCK_SERVICES: Service[] = [
  {
    id: 's1',
    providerId: 'u2',
    providerName: 'Grace Kamau',
    providerAvatar: 'https://picsum.photos/seed/grace/100/100',
    title: 'High School Math Tutoring',
    description: 'Experienced math tutor specializing in KCSE preparation. I make algebra and calculus easy to understand.',
    category: ServiceCategory.TUTORING,
    price: 1500,
    currency: 'KES',
    location: 'Westlands, Nairobi',
    rating: 4.9,
    reviewCount: 42,
    image: 'https://picsum.photos/seed/math/400/300',
    tags: ['math', 'education', 'tutor', 'high school']
  },
  {
    id: 's2',
    providerId: 'u3',
    providerName: 'Juma Fix-It',
    providerAvatar: 'https://picsum.photos/seed/juma/100/100',
    title: 'Expert Plumbing Services',
    description: 'Leaking taps, blocked pipes, or new installations. Fast and reliable service anywhere in Nairobi.',
    category: ServiceCategory.HOME_REPAIR,
    price: 2500,
    currency: 'KES',
    location: 'Nairobi CBD',
    rating: 4.7,
    reviewCount: 128,
    image: 'https://picsum.photos/seed/plumbing/400/300',
    tags: ['plumbing', 'repair', 'home', 'water']
  },
  {
    id: 's3',
    providerId: 'u4',
    providerName: 'Sarah Styles',
    providerAvatar: 'https://picsum.photos/seed/sarah/100/100',
    title: 'Professional Braiding & Hair Styling',
    description: 'Neat and painless braiding. Knotless braids, cornrows, and dreadlocks maintenance.',
    category: ServiceCategory.BEAUTY,
    price: 3000,
    currency: 'KES',
    location: 'Kilimani, Nairobi',
    rating: 5.0,
    reviewCount: 85,
    image: 'https://picsum.photos/seed/braids/400/300',
    tags: ['beauty', 'hair', 'braiding', 'salon']
  },
  {
    id: 's4',
    providerId: 'u5',
    providerName: 'David Tech',
    providerAvatar: 'https://picsum.photos/seed/david/100/100',
    title: 'Laptop Repair & Software Installation',
    description: 'Fixing slow laptops, virus removal, screen replacement, and Windows/Office installation.',
    category: ServiceCategory.TECH,
    price: 1000,
    currency: 'KES',
    location: 'Mombasa Road, Nairobi',
    rating: 4.6,
    reviewCount: 30,
    image: 'https://picsum.photos/seed/laptop/400/300',
    tags: ['tech', 'repair', 'computer', 'software']
  },
  {
    id: 's5',
    providerId: 'u6',
    providerName: 'Art by Kemo',
    providerAvatar: 'https://picsum.photos/seed/kemo/100/100',
    title: 'Custom Graphic Design & Logos',
    description: 'Need a logo for your business? I create professional brand identities and social media flyers.',
    category: ServiceCategory.CREATIVE,
    price: 4000,
    currency: 'KES',
    location: 'Remote',
    rating: 4.9,
    reviewCount: 15,
    image: 'https://picsum.photos/seed/design/400/300',
    tags: ['design', 'logo', 'branding', 'creative']
  },
  {
    id: 's6',
    providerId: 'u7',
    providerName: 'Mama Njeeri',
    providerAvatar: 'https://picsum.photos/seed/njeeri/100/100',
    title: 'Authentic Kenyan Catering',
    description: 'Cooking service for small parties and events. Chapati, Pilau, Mukimo and more.',
    category: ServiceCategory.OTHER,
    price: 5000,
    currency: 'KES',
    location: 'Thika Road, Nairobi',
    rating: 4.8,
    reviewCount: 200,
    image: 'https://picsum.photos/seed/food/400/300',
    tags: ['food', 'catering', 'cooking', 'events']
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    serviceId: 's2',
    serviceTitle: 'Expert Plumbing Services',
    providerName: 'Juma Fix-It',
    date: '2023-10-25',
    status: 'completed',
    price: 2500
  },
  {
    id: 'b2',
    serviceId: 's4',
    serviceTitle: 'Laptop Repair',
    providerName: 'David Tech',
    date: '2023-11-02',
    status: 'confirmed',
    price: 1000
  }
];
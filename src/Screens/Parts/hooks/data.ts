export interface Product {
  id: string;
  image: string;
  partNumber: string;
  name: string;
  description: string;
  price: number;
  isReady: boolean;
}

export const mockProducts: Product[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    partNumber: '17220-K56-N00',
    name: 'Element Cleaner',
    description: 'Air filter element for Honda motorcycles. High quality replacement part.',
    price: 23500,
    isReady: true,
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400',
    partNumber: '08CJ-A-K56-N00',
    name: 'Coolant',
    description: 'Premium coolant for Honda motorcycles. Prevents overheating.',
    price: 19500,
    isReady: false,
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    partNumber: '17220-K56-N00',
    name: 'Element Cleaner',
    description: 'Air filter element for Honda motorcycles. High quality replacement part.',
    price: 23500,
    isReady: true,
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400',
    partNumber: '08CJ-A-K56-N00',
    name: 'Coolant',
    description: 'Premium coolant for Honda motorcycles. Prevents overheating.',
    price: 19500,
    isReady: true,
  },
];

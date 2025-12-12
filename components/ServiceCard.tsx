import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { Service } from '../types';
import { Badge } from './Shared';

interface ServiceCardProps {
  service: Service;
  onClick: (service: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  return (
    <div 
      onClick={() => onClick(service)}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 cursor-pointer flex flex-col h-full"
    >
      <div className="relative h-40 bg-gray-200">
        <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-bold shadow text-gray-900">
          {service.currency} {service.price.toLocaleString()}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-2">
           <Badge color="bg-brand-50 text-brand-900">{service.category}</Badge>
        </div>
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{service.title}</h3>
        <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="font-medium text-gray-900">{service.rating}</span>
          <span>({service.reviewCount})</span>
        </div>
        
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex items-center gap-2">
            <img src={service.providerAvatar} alt={service.providerName} className="w-6 h-6 rounded-full" />
            <span className="text-xs text-gray-600 truncate max-w-[100px]">{service.providerName}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />
            <span className="truncate max-w-[80px]">{service.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
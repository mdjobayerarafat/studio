"use client";

import type { Task } from '@/types';
import { Clock, MapPin } from 'lucide-react';

interface TriggerIconProps {
  triggerType: Task['triggerType'];
  className?: string;
}

export function TriggerIcon({ triggerType, className }: TriggerIconProps) {
  if (triggerType === 'time') {
    return <Clock className={className} aria-label="Time-based trigger" />;
  }
  if (triggerType === 'geofence') {
    return <MapPin className={className} aria-label="Geofence-based trigger" />;
  }
  return null;
}

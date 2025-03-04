'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import LocationIcon from '@icons/LocationIcon';

interface RoomPlanPickerProps {
  imageUrl: string;
  initialLocation?: string;
  onLocationChange: (location: string) => void;
  isEditable?: boolean;
}

const LocationPicker: React.FC<RoomPlanPickerProps> = ({
  imageUrl,
  initialLocation,
  onLocationChange,
  isEditable = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [marker, setMarker] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  useEffect(() => {
    if (initialLocation) {
      const [x, y] = initialLocation.split(',').map(Number);
      setMarker({ x, y });
    }
  }, [initialLocation]);

  const updateMarkerPosition = (e: React.PointerEvent) => {
    if (!isEditable) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    // Berechne die Prozentwerte, aber begrenze sie auf den Bereich von 0 bis 100
    const xPercent = Math.min(Math.max((offsetX / rect.width) * 100, 0), 100);
    const yPercent = Math.min(Math.max((offsetY / rect.height) * 100, 0), 100);

    setMarker({ x: xPercent, y: yPercent });
    onLocationChange(`${xPercent.toFixed(2)},${yPercent.toFixed(2)}`);
  };

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-4xl touch-none bg-gray-200"
      onPointerDown={(e) => {
        setIsDragging(true);
        updateMarkerPosition(e);
      }}
      onPointerMove={(e) => isDragging && updateMarkerPosition(e)}
      onPointerUp={() => setIsDragging(false)}
    >
      <div
        className="relative w-full"
        style={aspectRatio ? { aspectRatio } : {}}
      >
        <Image
          src={imageUrl}
          alt="Raumplan"
          fill
          className="object-contain"
          onLoadingComplete={({ naturalWidth, naturalHeight }) => {
            setAspectRatio(naturalWidth / naturalHeight);
          }}
        />
      </div>

      {marker && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ top: `${marker.y}%`, left: `${marker.x}%` }}
        >
          <LocationIcon className="h-8 w-8 text-primary" />
        </div>
      )}
    </div>
  );
};

export default LocationPicker;

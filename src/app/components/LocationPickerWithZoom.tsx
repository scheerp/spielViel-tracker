'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import LocationIcon from '@icons/LocationIcon';

const MAGNIFIER_WIDTH = 500;
const MAGNIFIER_HEIGHT = 300;
const MOBILE_ZOOM_LEVEL = 5;
const DESKTOP_ZOOM_LEVEL = 2.5;

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

interface LocationPickerWithZoomProps {
  imageUrl: string;
  initialLocation?: string;
  onLocationChange: (location: string) => void;
  isEditable?: boolean;
}

const LocationPickerWithZoom: React.FC<LocationPickerWithZoomProps> = ({
  imageUrl,
  initialLocation,
  onLocationChange,
  isEditable = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [marker, setMarker] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [magnifierVisible, setMagnifierVisible] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [magnifierPosition, setMagnifierPosition] = useState({
    x: 0,
    y: 0,
    mouseX: 0,
    mouseY: 0,
  });
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  const isDesktop = useMediaQuery('(min-width: 768px)');
  const currentZoom = isDesktop ? DESKTOP_ZOOM_LEVEL : MOBILE_ZOOM_LEVEL;

  const baseMarkerSize = isDesktop ? 32 : 24; // in Pixel
  const magnifierMarkerSize = isDesktop ? 96 : 48;
  const magnifierMarkerHalf = magnifierMarkerSize / 2;

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
    const xPercent = Math.min(Math.max((offsetX / rect.width) * 100, 0), 100);
    const yPercent = Math.min(Math.max((offsetY / rect.height) * 100, 0), 100);
    setMarker({ x: xPercent, y: yPercent });
    onLocationChange(`${xPercent.toFixed(2)},${yPercent.toFixed(2)}`);
  };

  const updateMagnifierPosition = (e: React.PointerEvent) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursor({ x, y });
    setMagnifierPosition({
      x: -x * currentZoom + MAGNIFIER_WIDTH / 2,
      y: -y * currentZoom + MAGNIFIER_HEIGHT / 2,
      mouseX: x - MAGNIFIER_WIDTH / 2,
      mouseY: y - MAGNIFIER_HEIGHT / 2,
    });
  };

  const handlePointerEnter = (e: React.PointerEvent) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    setImageSize({ width: rect.width, height: rect.height });
    setMagnifierVisible(true);
    updateMagnifierPosition(e);
  };

  const handlePointerLeave = () => {
    setMagnifierVisible(false);
  };

  // Berechnung der absoluten Marker-Position im Bild (in Pixeln)
  const markerAbs = marker
    ? {
        x: (imageSize.width * marker.x) / 100,
        y: (imageSize.height * marker.y) / 100,
      }
    : null;

  // Berechnung der Marker-Position in der Lupe (dynamisch skaliert)
  let markerInMagnifier = null;
  if (
    magnifierVisible &&
    marker &&
    imageSize.width &&
    imageSize.height &&
    markerAbs
  ) {
    markerInMagnifier = {
      x: (markerAbs.x - cursor.x) * currentZoom + MAGNIFIER_WIDTH / 2,
      y: (markerAbs.y - cursor.y) * currentZoom + MAGNIFIER_HEIGHT / 2,
    };
  }

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-4xl touch-none bg-gray-200"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={(e) => {
        setIsDragging(true);
        if (isEditable) updateMarkerPosition(e);
        updateMagnifierPosition(e);
      }}
      onPointerMove={(e) => {
        updateMagnifierPosition(e);
        if (isDragging && isEditable) {
          updateMarkerPosition(e);
        }
      }}
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
          onLoadingComplete={({ naturalWidth, naturalHeight }) =>
            setAspectRatio(naturalWidth / naturalHeight)
          }
        />
      </div>

      {/* Basis-Marker im Container – immer sichtbar, aber nur verschiebbar, wenn isEditable true */}
      {marker && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{
            top: `${marker.y}%`,
            left: `${marker.x}%`,
            width: baseMarkerSize,
            height: baseMarkerSize,
          }}
        >
          <LocationIcon
            style={{ width: '100%', height: '100%' }}
            className="text-primary"
          />
        </div>
      )}

      {/* Lupe */}
      <div
        style={{
          backgroundPosition: `${magnifierPosition.x}px ${magnifierPosition.y}px`,
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: `${imageSize.width * currentZoom}px ${imageSize.height * currentZoom}px`,
          backgroundRepeat: 'no-repeat',
          display: magnifierVisible ? 'block' : 'none',
          top: `${magnifierPosition.mouseY}px`,
          left: `${magnifierPosition.mouseX}px`,
          width: `${MAGNIFIER_WIDTH}px`,
          height: `${MAGNIFIER_HEIGHT}px`,
        }}
        className="pointer-events-none absolute z-50 overflow-hidden"
      >
        {/* Marker innerhalb der Lupe – hier wird der Offset anhand des Breakpoints und Zooms gesetzt */}
        {markerInMagnifier && (
          <div
            className="absolute"
            style={{
              left: `${markerInMagnifier.x - magnifierMarkerHalf * ((isDesktop ? DESKTOP_ZOOM_LEVEL : MOBILE_ZOOM_LEVEL) / 2)}px`,
              top: `${markerInMagnifier.y - magnifierMarkerHalf * ((isDesktop ? DESKTOP_ZOOM_LEVEL : MOBILE_ZOOM_LEVEL) / 2)}px`,
            }}
          >
            <LocationIcon
              style={{
                width:
                  magnifierMarkerSize *
                  ((isDesktop ? DESKTOP_ZOOM_LEVEL : MOBILE_ZOOM_LEVEL) / 2),
                height:
                  magnifierMarkerSize *
                  ((isDesktop ? DESKTOP_ZOOM_LEVEL : MOBILE_ZOOM_LEVEL) / 2),
              }}
              className="text-primary"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPickerWithZoom;

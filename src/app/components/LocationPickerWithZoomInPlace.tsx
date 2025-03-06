'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import LocationIcon from '@icons/LocationIcon';
// TODO: Fix this component

// Konstanten für das Zoomfenster
const MAGNIFIER_WIDTH = 500;
const MAGNIFIER_HEIGHT = 300;
const MOBILE_ZOOM_LEVEL = 5;
const DESKTOP_ZOOM_LEVEL = 2.5;

// Ein Hook, um Media Queries zu verwenden
function useMediaQuery(query: string) {
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
}

interface LocationPickerWithZoomInPlaceProps {
  imageUrl: string;
  initialLocation?: string;
  onLocationChange: (location: string) => void;
  isEditable?: boolean;
}

const LocationPickerWithZoomInPlace: React.FC<
  LocationPickerWithZoomInPlaceProps
> = ({ imageUrl, initialLocation, onLocationChange, isEditable = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [marker, setMarker] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  // Zustände für das Zoomfenster
  const [magnifierVisible, setMagnifierVisible] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  // Hier speichern wir die Hintergrundposition, die den Zoomausschnitt steuert
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  // Aktuelle Cursorposition im Container
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  // Ermittlung des Breakpoints: Desktop ab 768px
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const currentZoom = isDesktop ? DESKTOP_ZOOM_LEVEL : MOBILE_ZOOM_LEVEL;

  // Marker-Größen
  const baseMarkerSize = isDesktop ? 32 : 24; // im Container
  const magnifierMarkerSize = isDesktop ? 96 : 48; // im Zoomfenster
  const magnifierMarkerHalf = magnifierMarkerSize / 2;

  // Initialisierung des Markers (z. B. aus initialLocation)
  useEffect(() => {
    if (initialLocation) {
      const [x, y] = initialLocation.split(',').map(Number);
      setMarker({ x, y });
    }
  }, [initialLocation]);

  // Nur im Bearbeitungsmodus verschiebbar
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

  // Update des Zoomfensters:
  // Hier berechnen wir den Background-Offset, so dass der Bereich,
  // über dem Cursor, im vergrößerten Bild möglichst mittig zu sehen ist.
  // Gleichzeitig wird der Offset "geclamped", sodass nicht leerer Raum entsteht.
  const updateMagnifierPosition = (e: React.PointerEvent) => {
    const container = containerRef.current;
    if (!container || !aspectRatio) return;
    const rect = container.getBoundingClientRect();

    // Berechne die tatsächlichen Bilddimensionen erneut (oder verwende imageSize)
    const containerAspect = rect.width / rect.height;
    let displayedWidth, displayedHeight;

    if (containerAspect > aspectRatio) {
      displayedHeight = rect.height;
      displayedWidth = displayedHeight * aspectRatio;
    } else {
      displayedWidth = rect.width;
      displayedHeight = displayedWidth / aspectRatio;
    }

    const width = displayedWidth;
    const height = displayedHeight;

    // Position relativ zum Bild (nicht zum Container)
    const imageX = e.clientX - rect.left - (rect.width - width) / 2;
    const imageY = e.clientY - rect.top - (rect.height - height) / 2;

    setCursor({ x: imageX, y: imageY });

    // Zoom-Berechnungen mit tatsächlichen Bilddimensionen
    const bgWidth = width * currentZoom;
    const bgHeight = height * currentZoom;
    const rawX = -imageX * currentZoom + MAGNIFIER_WIDTH / 2;
    const rawY = -imageY * currentZoom + MAGNIFIER_HEIGHT / 2;
    const clampedX = Math.max(width - bgWidth, Math.min(rawX, 0));
    const clampedY = Math.max(height - bgHeight, Math.min(rawY, 0));
    setMagnifierPosition({ x: clampedX, y: clampedY });
  };

  const handlePointerEnter = (e: React.PointerEvent) => {
    const container = containerRef.current;
    if (!container || !aspectRatio) return; // Warten, bis das Seitenverhältnis verfügbar ist
    const rect = container.getBoundingClientRect();

    // Berechne die tatsächlichen Bilddimensionen innerhalb des Containers
    const containerAspect = rect.width / rect.height;
    let displayedWidth, displayedHeight;

    if (containerAspect > aspectRatio) {
      // Container ist breiter als das Bild: Höhe entspricht dem Container
      displayedHeight = rect.height;
      displayedWidth = displayedHeight * aspectRatio;
    } else {
      // Container ist höher: Breite entspricht dem Container
      displayedWidth = rect.width;
      displayedHeight = displayedWidth / aspectRatio;
    }

    setImageSize({ width: displayedWidth, height: displayedHeight });
    setMagnifierVisible(true);
    updateMagnifierPosition(e);
  };

  const handlePointerLeave = () => {
    setMagnifierVisible(false);
  };

  // Berechnung der absoluten Marker-Position im Originalbild (in Pixeln)
  const markerAbs = marker
    ? {
        x: (imageSize.width * marker.x) / 100,
        y: (imageSize.height * marker.y) / 100,
      }
    : null;

  // NEUE Berechnung:
  // Da das Zoomfenster fix über dem Bild liegt, berechnen wir die Position des Markers
  // im Zoomfenster so, dass der Marker an der originalen Position (skaliert) erscheint.
  // Das funktioniert, indem wir den Marker in der Originalauflösung mit currentZoom multiplizieren
  // und den Background-Offset addieren.
  let markerInMagnifier = null;
  if (
    magnifierVisible &&
    marker &&
    imageSize.width &&
    imageSize.height &&
    markerAbs
  ) {
    markerInMagnifier = {
      x: markerAbs.x * currentZoom + magnifierPosition.x,
      y: markerAbs.y * currentZoom + magnifierPosition.y,
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

      {/* Basis-Marker im Container – immer sichtbar, verschiebbar nur, wenn isEditable */}
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

      {/* Fixes Zoomfenster, das das vergrößerte Bild zeigt */}
      <div
        style={{
          backgroundPosition: `${magnifierPosition.x}px ${magnifierPosition.y}px`,
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: `${imageSize.width * currentZoom}px ${imageSize.height * currentZoom}px`,
          backgroundRepeat: 'no-repeat',
          display: magnifierVisible ? 'block' : 'none',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        className="pointer-events-none absolute z-50 overflow-hidden"
      >
        {/* Marker im Zoomfenster – jetzt an der skalieren Position im vergrößerten Bild */}
        {markerInMagnifier && (
          <div
            className="absolute"
            style={{
              left: `${markerInMagnifier.x - magnifierMarkerHalf}px`,
              top: `${markerInMagnifier.y - magnifierMarkerHalf}px`,
            }}
          >
            <LocationIcon
              style={{
                width: magnifierMarkerSize,
                height: magnifierMarkerSize,
              }}
              className="text-primary"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPickerWithZoomInPlace;

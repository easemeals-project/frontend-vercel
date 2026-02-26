"use client";

import React, { useEffect, useRef, useState } from 'react';
import { message } from 'antd';

interface MapSelectorProps {
    apiKey: string;
    onLocationSelect: (address: string, lat: number, lng: number) => void;
    initialCenter?: { lat: number, lng: number };
}

declare global {
    interface Window {
        google: any;
        initMap: () => void;
    }
}

export default function MapSelector({ apiKey, onLocationSelect, initialCenter }: MapSelectorProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<any>(null);
    const [marker, setMarker] = useState<any>(null);
    const [geocoder, setGeocoder] = useState<any>(null);

    useEffect(() => {
        // Load Google Maps script
        if (!window.google) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&libraries=places`;
            script.async = true;
            script.defer = true;
            window.initMap = initMap;
            document.head.appendChild(script);
        } else {
            initMap();
        }

        function initMap() {
            if (!mapRef.current) return;

            const center = initialCenter || { lat: 6.5244, lng: 3.3792 }; // Lagos, Nigeria default

            const newMap = new window.google.maps.Map(mapRef.current, {
                center: center,
                zoom: 15,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
            });

            const newMarker = new window.google.maps.Marker({
                position: center,
                map: newMap,
                draggable: true,
            });

            const newGeocoder = new window.google.maps.Geocoder();

            setMap(newMap);
            setMarker(newMarker);
            setGeocoder(newGeocoder);

            // Listen for click to move marker
            newMap.addListener('click', (e: any) => {
                const clickedPos = e.latLng;
                newMarker.setPosition(clickedPos);
                handleLocationChange(clickedPos, newGeocoder);
            });

            // Listen for marker drag
            newMarker.addListener('dragend', () => {
                const draggedPos = newMarker.getPosition();
                handleLocationChange(draggedPos, newGeocoder);
            });
        }
    }, [apiKey]);

    const handleLocationChange = (pos: any, geo: any) => {
        const lat = pos.lat();
        const lng = pos.lng();

        if (geo) {
            geo.geocode({ location: pos }, (results: any, status: any) => {
                if (status === 'OK' && results[0]) {
                    onLocationSelect(results[0].formatted_address, lat, lng);
                } else {
                    onLocationSelect(`Selected Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`, lat, lng);
                }
            });
        }
    };

    return (
        <div className="w-full h-full relative">
            <div ref={mapRef} className="w-full h-full rounded-lg" />
            <div className="absolute top-2 left-2 bg-white p-2 rounded shadow-md text-[10px] pointer-events-none">
                Drag the pin or click the map to select your delivery location
            </div>
        </div>
    );
}

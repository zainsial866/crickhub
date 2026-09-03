'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { Ground, GroundSlot } from '@/types';

export function useGrounds() {
  const grounds = useAppStore((state) => state.grounds);
  const slots = useAppStore((state) => state.slots);
  const selectedCity = useAppStore((state) => state.selectedCity);
  const setSelectedCity = useAppStore((state) => state.setSelectedCity);
  const selectedPitchType = useAppStore((state) => state.selectedPitchType);
  const setSelectedPitchType = useAppStore((state) => state.setSelectedPitchType);
  const searchQuery = useAppStore((state) => state.searchQuery);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);

  const filteredGrounds = useMemo(() => {
    return grounds.filter((ground) => {
      const matchCity =
        selectedCity === 'all' || ground.city.toLowerCase() === selectedCity.toLowerCase();
      const matchPitch = selectedPitchType === 'all' || ground.pitchType === selectedPitchType;
      const matchQuery =
        searchQuery.trim() === '' ||
        ground.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ground.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCity && matchPitch && matchQuery;
    });
  }, [grounds, selectedCity, selectedPitchType, searchQuery]);

  const getGroundById = (id: string): Ground | undefined => {
    return grounds.find((g) => g.id === id);
  };

  const getSlotsForGround = (groundId: string): GroundSlot[] => {
    return slots.filter((s) => s.groundId === groundId);
  };

  return {
    grounds: filteredGrounds,
    allGrounds: grounds,
    selectedCity,
    setSelectedCity,
    selectedPitchType,
    setSelectedPitchType,
    searchQuery,
    setSearchQuery,
    getGroundById,
    getSlotsForGround,
  };
}

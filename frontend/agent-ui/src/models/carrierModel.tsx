import { useState, useCallback, useEffect } from 'react';
import {
  getCarriers,
  getAvailableCarriers,
  getProvinces,
  getRegions,
} from '@/services/service/verkApi';

export default () => {
  const [carriers, setCarriers] = useState<VerkType.Carrier[]>([]);
  const [regions, setRegions] = useState<VerkType.Region[]>([]);
  const [provincesByRegion, setProvincesByRegion] = useState<Record<string, VerkType.Province[]>>(
    {},
  );
  const [modelLoading, setModelLoading] = useState<Record<string, boolean>>({
    carriers: false,
    regions: false,
  });

  const fetchCarriers = useCallback(async () => {
    if (carriers.length > 0) return;
    setModelLoading((prev) => ({ ...prev, carriers: true }));
    try {
      const [carriersResponse, availableCarrierIds] = await Promise.all([
        getCarriers(),
        getAvailableCarriers(),
      ]);

      if (carriersResponse.data && availableCarrierIds.data) {
        const availableCarrierIdSet = new Set(availableCarrierIds.data);
        const filteredCarriers = carriersResponse.data.filter((carrier) =>
          availableCarrierIdSet.has(carrier.id.toString()),
        );
        setCarriers(filteredCarriers);
      }
    } catch (error) {
      console.error('Error fetching carriers:', error);
    } finally {
      setModelLoading((prev) => ({ ...prev, carriers: false }));
    }
  }, [carriers]);

  const fetchProvincesByRegion = useCallback(
    async (regionId: string) => {
      if (provincesByRegion[regionId]) return;
      try {
        const response = await getProvinces(regionId);
        if (response.data) {
          setProvincesByRegion((prevState) => ({
            ...prevState,
            [regionId]: response.data,
          }));
        }
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    },
    [provincesByRegion],
  );

  const fetchRegions = useCallback(async () => {
    if (regions.length > 0) return;
    setModelLoading((prev) => ({ ...prev, regions: true }));
    try {
      const response = await getRegions();
      if (response.data) {
        setRegions(response.data);
      }
    } catch (error) {
      console.error('Error fetching regions:', error);
    } finally {
      setModelLoading((prev) => ({ ...prev, regions: false }));
    }
  }, [regions]);

  useEffect(() => {
    fetchCarriers();
    fetchRegions();
  }, []);

  return {
    carriers,
    regions,
    provincesByRegion,
    modelLoading,
    fetchCarriers,
    fetchRegions,
    fetchProvincesByRegion,
  };
};

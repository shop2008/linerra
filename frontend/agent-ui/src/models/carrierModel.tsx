import { useState, useCallback, useRef } from 'react';
import {
  getCarriers,
  getAvailableCarriers,
  getProvinces,
  getRegions,
} from '@/services/service/verkApi';

export default () => {
  const [carriers, setCarriers] = useState<VerkType.Carrier[]>([]);
  const [provincesByRegion, setProvincesByRegion] = useState<Record<string, VerkType.Province[]>>(
    {},
  );
  const [regions, setRegions] = useState<VerkType.Region[]>([]);
  const [loading, setLoading] = useState(false);
  const dataFetchedRef = useRef({
    carriers: false,
    regions: false,
  });

  const fetchCarriers = useCallback(
    async (forceRefresh = false) => {
      // Data has already been fetched and is available
      if (loading || (!forceRefresh && dataFetchedRef.current.carriers && carriers.length > 0))
        return;

      setLoading(true);
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
          dataFetchedRef.current.carriers = true;
        }
      } catch (error) {
        console.error('Error fetching carriers:', error);
      } finally {
        setLoading(false);
      }
    },
    [carriers.length, loading],
  );

  const fetchProvincesByRegion = useCallback(
    async (regionId: string, forceRefresh = false) => {
      if (loading || (!forceRefresh && provincesByRegion[regionId])) return;

      setLoading(true);
      try {
        const response = await getProvinces(regionId);
        if (response.data) {
          setProvincesByRegion((prev) => ({
            ...prev,
            [regionId]: response.data,
          }));
        }
      } catch (error) {
        console.error('Error fetching provinces:', error);
      } finally {
        setLoading(false);
      }
    },
    [loading, provincesByRegion],
  );

  const fetchRegions = useCallback(
    async (forceRefresh = false) => {
      if (loading || (!forceRefresh && dataFetchedRef.current.regions && regions.length > 0))
        return;

      setLoading(true);
      try {
        const response = await getRegions();
        if (response.data) {
          setRegions(response.data);
          dataFetchedRef.current.regions = true;
        }
      } catch (error) {
        console.error('Error fetching regions:', error);
      } finally {
        setLoading(false);
      }
    },
    [regions.length, loading],
  );

  return {
    carriers,
    regions,
    provincesByRegion,
    loading,
    fetchCarriers,
    fetchRegions,
    fetchProvincesByRegion,
  };
};

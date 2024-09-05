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
  const dataFetchedRef = useRef({
    carriers: false,
    regions: false,
  });
  const ongoingFetchesRef = useRef<Record<string, boolean>>({});
  const provincesByRegionRef = useRef<Record<string, VerkType.Province[]>>({});

  const fetchCarriers = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && dataFetchedRef.current.carriers) return;
    if (ongoingFetchesRef.current.carriers) return;

    ongoingFetchesRef.current.carriers = true;
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
      ongoingFetchesRef.current.carriers = false;
    }
  }, []);

  const fetchProvincesByRegion = useCallback(async (regionId: string, forceRefresh = false) => {
    if (!forceRefresh && provincesByRegionRef.current[regionId]) return;
    if (ongoingFetchesRef.current[`provinces_${regionId}`]) return;
    console.log('fetchProvincesByRegion provincesByRegionRef', provincesByRegionRef.current);
    console.log('fetchProvincesByRegion provincesByRegionR', provincesByRegion);

    ongoingFetchesRef.current[`provinces_${regionId}`] = true;
    try {
      const response = await getProvinces(regionId);
      if (response.data) {
        provincesByRegionRef.current[regionId] = response.data;
        setProvincesByRegion((prevState) => ({
          ...prevState,
          [regionId]: response.data,
        }));
      }
    } catch (error) {
      console.error('Error fetching provinces:', error);
    } finally {
      ongoingFetchesRef.current[`provinces_${regionId}`] = false;
    }
  }, []);

  const fetchRegions = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && dataFetchedRef.current.regions) return;
    if (ongoingFetchesRef.current.regions) return;

    ongoingFetchesRef.current.regions = true;
    try {
      const response = await getRegions();
      if (response.data) {
        setRegions(response.data);
        dataFetchedRef.current.regions = true;
      }
    } catch (error) {
      console.error('Error fetching regions:', error);
    } finally {
      ongoingFetchesRef.current.regions = false;
    }
  }, []);

  return {
    carriers,
    regions,
    provincesByRegion: provincesByRegionRef.current,
    fetchCarriers,
    fetchRegions,
    fetchProvincesByRegion,
  };
};

// src/models/userModel.ts
import { useRequest } from 'ahooks';
import { getDicts } from '../services/service/dict';
import { getAccessToken } from '@/access';


export default () => {
  const { data: dicts, loading: loading, runAsync: fetchDictsAsync, run: fetchDicts } = useRequest(async () => {
    const response: API.R<Record<string, API.Service.DictItem[]>> = await getDicts({
      skipErrorHandler: true,
    });
    return response.data;
  }, {
    manual: true,
  });

  const getDictItems = (dictType: string) => async () => {
    let loadedDicts: Record<string, API.Service.DictItem[]> | undefined = dicts;
    if (!loadedDicts) {
      const accessToken = getAccessToken();
      if (accessToken) {
        loadedDicts = await fetchDictsAsync();
      }
    }
    return loadedDicts?.[dictType] || [];
  };

  // const getDictItemsAsync = useAsync(async (dictType: string) => {
  //   if (!dicts) {
  //     const accessToken = getAccessToken();
  //     if (accessToken) {
  //       const loadedDicts = await fetchDictsAsync();
  //       return loadedDicts?.[dictType] || [];
  //     }
  //   }
  //   return dicts?.[dictType] || [];
  // }, [dicts, fetchDictsAsync]);

  const getDictItem = (dictType: string, value: string) => async () => {
    let loadedDicts: Record<string, API.Service.DictItem[]> | undefined = dicts;
    if (!loadedDicts) {
      const accessToken = getAccessToken();
      if (accessToken) {
        loadedDicts = await fetchDictsAsync();
      }
    }
    return loadedDicts?.[dictType]?.find((item) => item.value === value) || null;
  };

  const getDictItemCode = (dictType: string, value: string) => async () => {
    let loadedDicts: Record<string, API.Service.DictItem[]> | undefined = dicts;
    if (!loadedDicts) {
      const accessToken = getAccessToken();
      if (accessToken) {
        loadedDicts = await fetchDictsAsync();
      }
    }
    const dictItem = loadedDicts?.[dictType]?.find((item) => item.value === value) || null;
    return dictItem?.code || null;
  };

  return {
    dicts,
    loading,
    fetchDicts,
    fetchDictsAsync,
    getDictItems,
    getDictItem,
    getDictItemCode,
  };
};



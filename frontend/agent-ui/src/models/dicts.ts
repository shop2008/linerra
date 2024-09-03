// src/models/userModel.ts
import { useRequest } from 'ahooks';
import { getDicts } from '../services/service/dict';
import { getAccessToken } from '@/access';
import { useAsync } from 'react-use';


export default function Page() {
  const { data: dicts, loading: loading, runAsync: fetchDictsAsync, run: fetchDicts } = useRequest(async () => {
    const response: API.R<Record<string, API.Service.DictItem[]>> = await getDicts({
      skipErrorHandler: true,
    });
    return response.data;
  }, {
    manual: true,
  });

  const getDictItems = async (dictType: string) => {
    let loadedDicts: Record<string, API.Service.DictItem[]> | undefined = dicts;
    if (!loadedDicts) {
      const accessToken = getAccessToken();
      if (accessToken) {
        loadedDicts = await fetchDictsAsync();
      }
    }
    return loadedDicts?.[dictType] || [];
  };

  const getDictItem = async (dictType: string, value: string) => {
    let loadedDicts: Record<string, API.Service.DictItem[]> | undefined = dicts;
    if (!loadedDicts) {
      const accessToken = getAccessToken();
      if (accessToken) {
        loadedDicts = await fetchDictsAsync();
      }
    }
    return loadedDicts?.[dictType]?.find((item) => item.value === value) || null;
  };

  const getDictItemCode = async (dictType: string, value: string) => {
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



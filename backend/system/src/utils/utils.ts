export function generateOrderNumber(provider: string, stationNo: string): string {
  // 1. 生成时间戳部分
  const timestamp = Math.floor(Date.now() / 1000).toString(36).toUpperCase().padStart(6, '0');

  // 2. 生成两位随机字符
  const randomChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomPart = Array(2).fill(0).map(() => randomChars[Math.floor(Math.random() * randomChars.length)]).join('');

  // 3. 组合订单号
  return `${timestamp}${randomPart}${provider}${stationNo}`;
}

export const now = () => new Date().toISOString()

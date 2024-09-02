import { verykCarriers } from "system/src/constant/verykConstant";
import { quoteApiResToResVO, quoteReqVOToApiReq } from "system/src/models/veryk/quote.convert";
import { QuoteReqVO, QuoteResVO } from "system/src/models/veryk/quote.entity";
import { quote } from "system/src/utils/verykUtils";

export class VerykShipmentService {
  public static instance: VerykShipmentService = new VerykShipmentService();

  /**
   * 获取可用carrier
   * @returns
   */
  async getAvailableCarriers(): Promise<string[]> {
    const carriers = verykCarriers;
    return carriers.filter(carrier => ["2", "3", "4", "5", "9"].includes(carrier.id)).map(carrier => carrier.id);
  }

  /**
   * 获取报价
   * @param params
   * @param acceptLanguage
   * @returns
   */
  async quote(params: QuoteReqVO, acceptLanguage?: string): Promise<QuoteResVO[]> {
    const quotes = await quote(quoteReqVOToApiReq(params), acceptLanguage);
    return quotes.map(quoteApiResToResVO);
  }
}

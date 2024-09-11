import { ShipmentDO, ShipmentEditResVO, ShipmentReqVO } from "../../models/veryk/shipment.entity";
import { verykCarriers } from "../../constant/verykConstant";
import { quoteApiResToResVO, quoteReqVOToApiReq } from "../../models/veryk/quote.convert";
import { QuoteReqVO, QuoteResVO } from "../../models/veryk/quote.entity";
import { quote, create } from "../../utils/verykUtils";
import { shipmentReqVOToApiReq, shipmentReqVOToDO } from "../../models/veryk/shipment.convert";
import { generateOrderNumber, now } from "../../utils/utils";
import { MainTable, Shipment } from "system/src/dynamodb/toolbox";
import { GetItemCommand, PutItemCommand, QueryCommand } from "dynamodb-toolbox";

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


  async save(params: ShipmentReqVO, currentUser: Record<string, any>): Promise<{ number: string }> {
    const shipmentDO = shipmentReqVOToDO(params);
    shipmentDO.stationId = currentUser.stationId;
    shipmentDO.sortTimestamp = now();
    //shipmentDO.GSI1PK = "SHIPMENT_NO";
    shipmentDO.number = shipmentDO.number || generateOrderNumber("VK", currentUser.stationNo);
    const res = await Shipment.build(PutItemCommand).item({ ...shipmentDO }).send()
    return { number: shipmentDO.number };
  }


  async get(number: string): Promise<ShipmentDO> {
    const { Item } = await Shipment.build(GetItemCommand).key({ number }).send();
    return Item as ShipmentDO;
  }

  async getPage(limit: number, currentUser: Record<string, any>): Promise<any> {
    const { Items } = await MainTable.build(QueryCommand)
      .query({
        index: "GSI1",
        partition: `STATION#${currentUser.stationId}`,
      })
      .entities(Shipment)
      .options({
        limit,
      })
      .send()
    return Items as ShipmentDO[];
  }


  /**
   * 提交到veryk
   * @param params
   * @param acceptLanguage
   * @returns
   */
  async submit(params: ShipmentReqVO, currentUser: Record<string, any>, acceptLanguage?: string): Promise<ShipmentReqVO> {
    const referenceNumber = generateOrderNumber("VK", currentUser.stationNo);
    const apiReq = shipmentReqVOToApiReq(params);
    if (apiReq.option) {
      apiReq.option.reference_number = referenceNumber;
    } else {
      apiReq.option = { reference_number: referenceNumber };
    }
    const submitRes = await create(apiReq, acceptLanguage);
    return submitRes;
  }
}

import { ShipmentDO, ShipmentEditResVO, ShipmentReqVO } from "../../models/veryk/shipment.entity";
import { verykCarriers } from "../../constant/verykConstant";
import { quoteApiResToResVO, quoteReqVOToApiReq } from "../../models/veryk/quote.convert";
import { QuoteReqVO, QuoteResVO } from "../../models/veryk/quote.entity";
import { quote, create } from "../../utils/verykUtils";
import { shipmentApiResToApiUpdateDO, shipmentReqVOToApiReq, shipmentReqVOToDO } from "../../models/veryk/shipment.convert";
import { generateOrderNumber, now } from "../../utils/utils";
import { MainTable, Shipment } from "system/src/dynamodb/toolbox";
import { Condition, GetItemCommand, PutItemCommand, QueryCommand, UpdateItemCommand, UpdateItemResponse } from "dynamodb-toolbox";
import { UpdateAttributesCommand } from 'dynamodb-toolbox'
import { ServiceError } from "system/src/utils/serviceError";
import { updateAttributesCommandReturnValuesOptionsSet } from "dynamodb-toolbox/dist/esm/entity/actions/updateAttributes/options";

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
    //shipmentDO.sortTimestamp = now();
    //let response: UpdateItemResponse<typeof Shipment, { returnValues: 'ALL_NEW' }> | UpdateItemResponse<typeof Shipment, { returnValues: 'ALL_OLD' }>;
    //shipmentDO.GSI1PK = "SHIPMENT_NO";
    if (!shipmentDO.number) {
      shipmentDO.number = generateOrderNumber("VK", currentUser.stationNo);
      await Shipment.build(PutItemCommand)
        .item({ ...shipmentDO, sortTimestamp: now() })
        //.options({ returnValues: "ALL_OLD" })
        .send();

    } else {
      await Shipment.build(UpdateItemCommand)
        .item({ ...shipmentDO })
        //.options({ returnValues: "ALL_NEW" })
        .send();
    }
    return { number: shipmentDO.number };

  }


  async get(number: string): Promise<ShipmentDO> {
    const { Item } = await Shipment.build(GetItemCommand).key({ number }).send();
    return Item as ShipmentDO;
  }

  async getPage(params: { limit: number, keyword?: string, status?: string, dateRange: [string, string] }, currentUser: Record<string, any>): Promise<ShipmentDO[]> {
    // const filter: Record<string, any> = {}
    // if (params.status) {
    //   filter.status = {
    //     attribute: "status",
    //     eq: params.status
    //   }
    // }
    let statusCondition, keywordCondition: Condition<typeof Shipment>
    let conditions: Condition<typeof Shipment>[] = []
    if (params.status) {
      statusCondition = {
        attr: 'status' as const,
        eq: params.status
      }
      conditions.push(statusCondition)
    }

    if (params.keyword) {
      keywordCondition = {
        or: [
          {
            attr: 'number',
            contains: params.keyword
          },
          {
            attr: 'externalId',
            contains: params.keyword
          }
        ]
      }
      conditions.push(keywordCondition)
    }

    let filters: Record<string, any> = {}

    if (conditions.length) {
      filters.Shipment = {
        and: conditions
      }
    }

    const { Items } = await MainTable.build(QueryCommand)
      .query({
        index: "GSI1",
        partition: `STATION#${currentUser.stationId}`,
        range: {
          gte: `SHIPMENT#${params.dateRange[0]}`,
          lte: `SHIPMENT#${params.dateRange[1]}`
        }
      })
      .entities(Shipment)
      .options({
        limit: params.limit,
        filters: filters
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
  async submit(params: ShipmentReqVO, currentUser: Record<string, any>, acceptLanguage?: string) {
    if (params.number) {
      const shipmentDO = await this.get(params.number);
      if (shipmentDO.status !== "open") {
        throw new ServiceError("Shipment status is not open", "Shipment.StatusNotOpen");
      }
    }
    const { number } = await this.save(params, currentUser);
    //console.log(number);
    const apiReq = shipmentReqVOToApiReq(params);
    if (apiReq.option) {
      apiReq.option.reference_number = number;
    } else {
      apiReq.option = { reference_number: number };
    }
    const shipmentApiRes = await create(apiReq, acceptLanguage)
    console.log(shipmentApiRes);
    const shipmentApiUpdateDO = shipmentApiResToApiUpdateDO(shipmentApiRes);

    console.log(shipmentApiUpdateDO);
    const { Attributes } = await Shipment.build(UpdateAttributesCommand)
      .item({ ...shipmentApiUpdateDO })
      .options({ returnValues: "ALL_NEW" })
      .send();
    // const referenceNumber = generateOrderNumber("VK", currentUser.stationNo);
    // const apiReq = shipmentReqVOToApiReq(params);
    // if (apiReq.option) {
    //   apiReq.option.reference_number = referenceNumber;
    // } else {
    //   apiReq.option = { reference_number: referenceNumber };
    // }
    // const submitRes = await create(apiReq, acceptLanguage);
    // return submitRes;
    return { externalId: Attributes?.externalId, waybillNumber: Attributes?.waybillNumber };
  }
}

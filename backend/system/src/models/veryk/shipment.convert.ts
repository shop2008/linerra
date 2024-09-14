import { ShipmentApiReq, ShipmentApiRes, ShipmentApiUpdateDO, ShipmentDetailResVO, ShipmentDO, ShipmentEditResVO, ShipmentReqVO } from "./shipment.entity";
import { initiationReqVOToApiReq, destinationReqVOToApiReq, initiationReqVOToDO, destinationReqVOToDO, addressApiResToInitiationDO, addressApiResToDestinationDO } from "./address.convert";
import { packageApiResToDO, packageDOToEditResVO, packageReqVOToApiReq, packageReqVOToDO } from "./package.convert";
import { optionReqVOToApiReq } from "./option.convert";


export const shipmentReqVOToApiReq = (shipmentReqVO: ShipmentReqVO): ShipmentApiReq => {
  const { serviceId, initiation, destination, package: pkg, option, number,
    //carrierId, airportTo,
    ...rest } = shipmentReqVO;
  return {
    initiation: initiationReqVOToApiReq(initiation),
    destination: destinationReqVOToApiReq(destination),
    package: packageReqVOToApiReq(pkg),
    option: optionReqVOToApiReq(option),
    //carrier_id: carrierId,
    //airport_to: airportTo,
    payment_method: "account",
    state: "order",
    service_id: serviceId,
    ...rest,
  };
};


export const shipmentReqVOToDO = (shipmentReqVO: ShipmentReqVO): ShipmentDO => {
  const { initiation, destination, package: pkg, option, number, serviceId } = shipmentReqVO;
  return {
    number: number || "",
    initiationRegionId: initiation.regionId,
    destinationRegionId: destination.regionId,
    initiation: initiationReqVOToDO(initiation),
    destination: destinationReqVOToDO(destination),
    package: packageReqVOToDO(pkg),
    option: option,
    serviceId,
    status: "open",
    stationId: "",
    //sortTimestamp: "",
    //GSI1PK: "SHIPMENT_NO",
  };
};

export const shipmentDOToEditResVO = (shipmentDO: ShipmentDO): ShipmentEditResVO => {
  return {
    number: shipmentDO.number,
    serviceId: shipmentDO.serviceId,
    initiation: shipmentDO.initiation,
    destination: shipmentDO.destination,
    package: packageDOToEditResVO(shipmentDO.package),
    option: shipmentDO.option,
  };
};

export const shipmentApiResToApiUpdateDO = (shipmentApiRes: ShipmentApiRes): ShipmentApiUpdateDO => {
  return {
    number: shipmentApiRes.reference_number,
    externalId: shipmentApiRes.id,
    waybillNumber: shipmentApiRes.waybill_number,
    serviceId: shipmentApiRes.service.id,
    status: shipmentApiRes.state.code as "submitted" | "completed" | "cancelled",
    //initiationRegionId: shipmentApiRes.initiation_region_id,
    //destinationRegionId: shipmentApiRes.destination_region_id,
    //initiation: addressApiResToInitiationDO(shipmentApiRes.initiation.en_US),
    //destination: addressApiResToDestinationDO(shipmentApiRes.destination.en_US),
    package: packageApiResToDO(shipmentApiRes.package),

    price: shipmentApiRes.price,
    payments: Object.values(shipmentApiRes.payments).map(paymentApiRes => ({
      dateTime: paymentApiRes.datetime,
      description: paymentApiRes.description,
      subtotal: paymentApiRes.subtotal,
    })),
    total: shipmentApiRes.total,
    submittedAt: shipmentApiRes.creationtime,

  };
};


export const shipmentDOToDetailResVO = (shipmentDO: ShipmentDO): ShipmentDetailResVO => {
  return {
    number: shipmentDO.number,
    externalId: shipmentDO.externalId!,
    waybillNumber: shipmentDO.waybillNumber!,
    serviceId: shipmentDO.serviceId,
    status: shipmentDO.status,
    initiationRegionId: shipmentDO.initiationRegionId!,
    destinationRegionId: shipmentDO.destinationRegionId!,
    initiation: shipmentDO.initiation,
    destination: shipmentDO.destination,
    package: shipmentDO.package,
    option: shipmentDO.option,
    price: shipmentDO.price!,
    payments: shipmentDO.payments!,
    total: shipmentDO.total!,
    submittedAt: shipmentDO.submittedAt!,
  };
};

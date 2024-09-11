import { ShipmentApiReq, ShipmentDO, ShipmentReqVO } from "./shipment.entity";
import { initiationReqVOToApiReq, destinationReqVOToApiReq, initiationReqVOToDO, destinationReqVOToDO } from "./address.convert";
import { packageReqVOToApiReq, packageReqVOToDO } from "./package.convert";
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
    sortTimestamp: "",
    //GSI1PK: "SHIPMENT_NO",
  };
};

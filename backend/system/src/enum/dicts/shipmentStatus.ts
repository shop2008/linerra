import { BaseDictEnum } from "./baseDictEnum";

export class ShipmentStatus extends BaseDictEnum<string> {
  static readonly OPEN = new ShipmentStatus('OPEN', 'shipmentStatus.open', "open", 'Open');
  static readonly SUBMITTED = new ShipmentStatus('SUBMITTED', 'shipmentStatus.submitted', "submitted", 'Submitted');
  static readonly COMPLETED = new ShipmentStatus('COMPLETED', 'shipmentStatus.completed', "completed", 'Completed');
  static readonly CANCELLED = new ShipmentStatus('CANCELLED', 'shipmentStatus.cancelled', "cancelled", 'Cancelled');
}

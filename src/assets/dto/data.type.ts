type documentData = {
  aadhar: File | null;
  licence: File | null;
  pancard: File | null;
  vehicle: File | null;
};
interface Role {
  section: string;
  permission: { section: string; permission: string[] }[];
}
interface RootState {
  rolePermission: Role;
}
interface MenuItem {
  name: string;
  navigate: string;
  icon: JSX.Element;
  submenu: MenuItem[];
}
interface ProductTableRowProps {
  orderId: number;
  firstName: string;
  lastName: string;
  contact: string;
  Pickup: string;
  Delivery: string;
  // pickupTime: string;
  // deliveryTime: string;
  Payment_status: string;
  Payment_type: string;
  Amount_collect: number;
  pickup_longitude: string;
  pickup_latitude: string;
  delivery_longitude: string;
  delivery_latitude: string;
  //   weight: string;
}

interface Document {
  id: string;
  internal_path: string;
  document: string;
  align?: AlignType | undefined;
}

interface Address {
  id: string;
  state: string;
  district: string;
  area: string;
}

export type AlignType =
  | "start"
  | "end"
  | "left"
  | "right"
  | "center"
  | "justify"
  | "match-parent";

export type {
  documentData,
  RootState,
  MenuItem,
  ProductTableRowProps,
  Document,
  Address,
};

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
  id: string;
  order_id: string | number;
  first_name: string;
  last_name: string;
  contact: string;
  pickup: string;
  delivery: string;
  // pickupTime: string;
  // deliveryTime: string;
  // Payment_status: string;
  payment_type: string;
  amount_collect: number;
  pickup_longitude: string;
  pickup_latitude: string;
  delivery_longitude: string;
  delivery_latitude: string;
  status: string;
  //   weight: string;
}

interface Document {
  id: string;
  internal_path: string;
  document: string;
  align?: AlignType | undefined;
}

interface CurrentOrder {
  id: string;
  order_id: string;
  pickup: Address;
  delivery: Address;
  payment_type: string;
  amount_collect: number;
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
  CurrentOrder,
};

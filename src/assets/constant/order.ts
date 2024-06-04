import { ColumnProps } from "antd/es/table";
import { CurrentOrder,AlignType } from "../dto/data.type";

export const ORDER_DATA = (): ColumnProps<CurrentOrder>[] => [
  {
    title: "Sr.No.",
    dataIndex: "index",
    render: (_, __, index) => index + 1,
    align: "center" as AlignType,
  },
  {
    title: "Pickup Address",
    dataIndex: "pickup",
    align: "center" as AlignType,
    key: "pickup",
  },
  {
    title: "Delivery Address",
    dataIndex: "delivery",
    align: "center" as AlignType,
    key: "delivery",
  },
  {
    title: "Payment Method",
    dataIndex: "payment_type",
    align: "center" as AlignType,
    key: "payment_type",
  },
  {
    title: "Amount",
    dataIndex: "amount_collect",
    align: "center" as AlignType,
    key: "amount_collect",
  },
];

import { ColumnProps } from "antd/es/table";
import { Document, AlignType } from "../dto/data.type";
// import { useNavigate } from "react-router-dom";
// import { Button } from "antd/es/radio";

export const DOCUMENT_DATA_COL = (): ColumnProps<Document>[] => [
  {
    title: "Sr.No.",
    dataIndex: "index",
    render: (_, __, index) => index + 1,
    align: "center" as AlignType,
  },
  {
    title: "Doucment Preview",
    dataIndex: "document",
    align: "center" as AlignType,
    key: "image",
  },
  {
    title: "Document Type",
    dataIndex: "internal_path",
    render: (text, record) => record.internal_path.split("/")[0],
    align: "center" as AlignType,
  },
];

// export const Categories_page: Categories[] = [
  //  "pickup_address_id": "b233599b-3823-4d87-b610-55de3dc584fc",
  //       "delivery_address_id": "2e325ef4-c47e-4abe-abcb-6970b448e7ee",
  //       "fk_payment_method": "93dee9ae-b327-4768-ab65-57da50042f8d",
  //       "total_price": 71
//     {
//         id: '0aa08c76-f893-4c75-a4a3-31df03665ba1',
//         name: 'Electronics',
//         description: 'Mobile phones, tablets, chargers, headphones, and small gadgets.',
//         status: true,
//         created_at: '2024-04-15T09:13:15.087Z',
//     },
//     {
//         id: '0aa08c76-f893-4c75-a4a3-31df03663bc1',
//         name: 'steel',
//         description: 'Mobile phones, tablets, chargers, headphones, and small gadgets.',
//         status: true,
//         created_at: '2024-04-15T09:13:15.087Z',
//     },
//     {
//         id: '0aa08c76-f893-4c75-a4a3-31df03662cf1',
//         name: 'food',
//         description: 'Mobile phones, tablets, chargers, headphones, and small gadgets.',
//         status: false,
//         created_at: '2024-04-15T09:13:15.087Z',
//     },
//     {
//         id: '0aa08c76-f893-4c75-a4a3-31df036652s1',
//         name: 'Electronics',
//         description: 'Mobile phones, tablets, chargers, headphones, and small gadgets.',
//         status: false,
//         created_at: '2024-04-15T09:13:15.087Z',
//     },
// ];

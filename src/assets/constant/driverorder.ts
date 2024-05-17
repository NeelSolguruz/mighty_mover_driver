import { ColumnProps } from "antd/es/table";
import { AlignType } from "../dto/data.type";
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

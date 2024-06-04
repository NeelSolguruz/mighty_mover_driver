// import React from "react";

import { useCallback, useEffect, useState } from "react";
import http from "../http/http";
import { AlignType, Document } from "../assets/dto/data.type";
import { Card, Table } from "antd";
import { ColumnProps } from "antd/es/table";
import { useDispatch } from "react-redux";
import { setPage } from "../redux/pageSlice";
import { toast } from "sonner";
// import { AlignType } from "./src/assets/dto/data.type.ts";
// import { DOCUMENT_DATA_COL } fro

function DriverDocument() {
  const dispatch = useDispatch();
  const [documentData, setDocumentDatq] = useState<Document[]>([]);
  const DOCUMENT_DATA_COL = (): ColumnProps<Document>[] => [
    {
      title: "Sr.No.",
      dataIndex: "index",
      render: (_, __, index) => index + 1,
      align: "center" as AlignType,
    },
    {
      title: "Document Preview",
      dataIndex: "document",
      align: "center" as AlignType,
      render: (document) => (
        <img
          src={document}
          alt="Document"
          // style={{ width: "150px", height: "150px" }}
        />
      ),
    },
    {
      title: "Document Type",
      dataIndex: "internal_path",
      render: (text, record) => record.internal_path.split("/")[0],
      align: "center" as AlignType,
    },
  ];

  const fetchData = useCallback(async () => {
    try {
      const response = await http.get("api/v1/document");
      setDocumentDatq(response.data.data);
      toast.success(response.data.message);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    dispatch(setPage("Document"));
    void fetchData();
  }, [fetchData, dispatch]);

  return (
    <>
      <Card title="Document Review" className="m-2">
        <Table
          rowClassName="text-center"
          dataSource={documentData}
          // pagination={{
          //   pageSize: 10,
          //   total: total,
          //   current: currentPage,
          //   onChange: (page) => {
          //     fetchData(page);
          //   },
          // }}
          // pagination={false}
          columns={DOCUMENT_DATA_COL()}
          // bordered
          sticky
          className="w-full"
        ></Table>
      </Card>
    </>
  );
}

export default DriverDocument;

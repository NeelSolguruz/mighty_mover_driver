import { useCallback, useEffect, useState } from "react";
import { Address, AlignType } from "../assets/dto/data.type";
import { ColumnProps } from "antd/es/table";
import { Card, Table } from "antd";
import { useDispatch } from "react-redux";
import http from "../http/http";
import { toast } from "sonner";
import { setPage } from "../redux/pageSlice";

function DriverAddress() {
  const [AddressData, setAddressData] = useState<Address[]>([]);
  const dispatch = useDispatch();
  const ADDRESS_DATA_COl = (): ColumnProps<Address>[] => [
    {
      title: "Sr.No.",
      dataIndex: "index",
      render: (_, __, index) => index + 1,
      align: "center" as AlignType,
    },
    {
      title: "state",
      dataIndex: "state",
      
      align: "center" as AlignType,
    },
    {
      title: "district",
      dataIndex: "district",
     
      align: "center" as AlignType,
    },
    {
      title: "area",
      dataIndex: "area",
    
      align: "center" as AlignType,
    },
  ];

  const fetchData = useCallback(async () => {
    try {
      const response = await http.get("/api/v1/driver/address");
      setAddressData(response.data.data);
      toast.success(response.data.message);
    } catch (error) {
      console.error(error);
    }
  }, []);
  useEffect(() => {
    dispatch(setPage("Address Page"));
    void fetchData();
  }, [fetchData, dispatch]);

  return (
    <>
      <Card title="Document Review" className="m-2">
        <Table
          rowClassName="text-center"
          dataSource={AddressData}
          // pagination={{
          //   pageSize: 10,
          //   total: total,
          //   current: currentPage,
          //   onChange: (page) => {
          //     fetchData(page);
          //   },
          // }}
          // pagination={false}
          columns={ADDRESS_DATA_COl()}
          // bordered
          sticky
          className="w-full"
        ></Table>
      </Card>
    </>
  );
}

export default DriverAddress;

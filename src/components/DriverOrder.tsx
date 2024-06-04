import React, { useCallback, useEffect, useState } from "react";
import http from "../http/http";
import { AlignType, CurrentOrder } from "../assets/dto/data.type";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setPage } from "../redux/pageSlice";
import { Button, Card, Table } from "antd";
import { ORDER_DATA } from "../assets/constant/order";
import { ColumnProps } from "antd/es/table";

function DriverOrder() {
  const dispatch = useDispatch();
  const [orderData, setOrderData] = useState<CurrentOrder[]>([]);
  const orderDataList: ColumnProps<CurrentOrder>[] = [
    ...ORDER_DATA(),
    {
      title: "Accept Order",
      key: "action",
      align: "center" as AlignType,
      render: (_, record: CurrentOrder) => (
        <div>
          <Button
            onClick={() => {
              hasAcceptOrder(record.order_id);
              console.log(record.order_id);
            }}
          >
            Accept
          </Button>
        </div>
      ),
    },
  ];
  const fetchData = useCallback(async () => {
    try {
      const response = await http.get("api/v1/driver-order/myorder");
      setOrderData(response.data.data);
      toast.success(response.data.message);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const hasAcceptOrder = async (id: string) => {
    console.log(id);
    try {
      const response = await http.patch(`/api/v1/driver-order/accept/${id}`);
      toast.success(response.data.message);
     if(response.data.status === 422){
        toast.error(response.data.message)
      }

      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    dispatch(setPage("Order List"));
    void fetchData();
  }, [fetchData, dispatch]);

  return (
    <>
      <Card title="Document Review" className="m-2">
        <Table
          rowClassName="text-center"
          dataSource={orderData}
          // pagination={{
          //   pageSize: 10,
          //   total: total,
          //   current: currentPage,
          //   onChange: (page) => {
          //     fetchData(page);
          //   },
          // }}
          // pagination={false}
          columns={orderDataList}
          // bordered
          sticky
          className="w-full"
        ></Table>
      </Card>
    </>
  );
}

export default DriverOrder;

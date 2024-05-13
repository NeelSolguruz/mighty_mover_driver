import { Card } from "antd";
import {
  //   DASHBOARD_STATS_COSTS_MONEY,
  DASHBOARD_STATS_PROFIT_VAL,
  //   DASHBOARD_STATS_REVENUE_VAL,
  //   DASHBOARD_STATS_COSTS_MONEY_VAL,
  //   DASHBOARD_STATS_PROFIT,
  DASHBOARD_TOTAL_EARNING,
  DASHBOARD_IN_PROGRESS,
  DASHBOARD_DELIVERED,
  DASHBOARD_ACCEPTED,
  DASHBOARD_REJECTED,
//   DASHBOARD_GOAL,
  // PURCHASE_ORDER_STATUS,
  // DELIVERED,
  // INPROGRESS,
  // NOTDELIVERED,
  // MONTHLY_DATA,
  // MONTHLY_TARGET,
} from "../assets/constant/constaint";
// import { PieChart } from '../components/piechart';
// import DoughnutChart from '../components/DoughnutChart';

import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
// import CountUp from 'react-countup';
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setPage } from "../redux/pageSlice";
import { LiaRupeeSignSolid } from "react-icons/lia";
import http from "../http/http";
// import Linechart from './linechart';
export default function Dashboard() {
  const [Revenue, setRevenue] = useState(12345);
  const [Order, setOrder] = useState(0);
  const [Deliverd, setDeliverd] = useState(0);
  const [Accepted, setAccepted] = useState(0);
  const [Rejected, setRejected] = useState(0);
//   const [goal, setgoal] = useState(1000);
  const TotalEarning = async () => {
    try {
      const response = await http.get("/api/v1/driver-order/earning");
      console.log(response.data.data);
      setRevenue(response.data.data.total_earning);
    } catch (error) {
      console.log(error);
    }
  };
  const driverOrder = async () => {
    try {
      const response = await http.get("/api/v1/driver-order");
      console.log(response.data.data);
      setOrder(response.data.data.InProgress);
      setDeliverd(response.data.data.Delivered);
      setAccepted(response.data.data.Accepted);
      setRejected(response.data.data.Cancel);
    //   setgoal(response.data.data.Total);
      // setRevenue(response.data.data.total_earning);
      // setRevenue(response.data.data.total_earnings);
    } catch (error) {
      console.log(error);
    }
  };
  const dispatch = useDispatch();
  useEffect(() => {
    TotalEarning();
    driverOrder();
    dispatch(setPage("Dashboard"));
  }, [dispatch]);

  // const formatter = (value: number | string) => {
  //     if (typeof value === 'number') {
  //         return <CountUp end={value} duration={1} />;
  //     }
  //     return value;
  // };

  const prefix =
    DASHBOARD_STATS_PROFIT_VAL >= 0 ? (
      <ArrowUpOutlined className="w-4 h-4" />
    ) : (
      <ArrowDownOutlined className="w-4 h-4" />
    );
  // const color = DASHBOARD_STATS_PROFIT_VAL >= 0 ? '#3f8600' : '#cf1322';
  return (
    <div className="overflow-hidden container">
      <div className="grid grid-cols-5 gap-2 m-4 w-auto  max-md:grid-cols-1 max-md:w-auto ">
        {/* <div className="w-full h-full"> */}
        {/* total Earning card */}
        <Card bordered={false} className="w-full bg-blue-50 max-md:w-auto">
          <div className="w-full flex-col ">
            <div className="flex justify-start w-full text-[15px] font-semibold ">
              {DASHBOARD_TOTAL_EARNING}
            </div>

            <div className="flex justify-start w-full text-[24px] font-bold gap-1 items-center">
              <div style={{ fontWeight: "700" }}>
                {/* <CountUp end={Revenue} duration={1} /> */}
                {Revenue >= 10000 ? (
                  <>
                    {Revenue >= 100000 ? (
                      <>
                        <div className="w-full h-full flex items-center">
                          {<LiaRupeeSignSolid />}
                          {(Revenue / 100000).toFixed(2)}L
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-full h-full flex items-center">
                          {<LiaRupeeSignSolid />}
                          {(Revenue / 1000).toFixed(2)}K
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <div className="w-full h-full flex items-center">
                      {Revenue == null ? (
                        <>
                          <LiaRupeeSignSolid />
                          <span className="ml-1">12.35K</span>
                        </>
                      ) : (
                        <>
                          <LiaRupeeSignSolid />
                          <span className="ml-1">{Revenue}</span>
                        </>
                      )}
                    </div>
                    {/* <div className="w-full h-full flex items-center">
                      {<LiaRupeeSignSolid />}
                      {Revenue}
                    </div> */}
                  </>
                )}
              </div>

              <div>{prefix}</div>
            </div>
          </div>
        </Card>
        {/* </div> */}
        {/* <div className=" w-full h-full"> */}

        {/* IN PROGRESS CARD */}
        <Card
          bordered={false}
          className="w-full flex-1 h-auto flex bg-blue-50 max-md:w-auto"
        >
          <div className="w-full flex-col ">
            <div className="flex justify-start w-full text-[15px] font-semibold ">
              {DASHBOARD_IN_PROGRESS}
            </div>
            <div className="flex justify-start w-full text-[24px] font-bold gap-1 items-center">
              <div style={{ fontWeight: "700" }}>{Order}</div>
            </div>
          </div>
        </Card>
        {/* </div> */}
        {/* <div className=" w-full h-full "> */}

        {/*  DELIVERED CARD*/}
        <Card
          bordered={false}
          className="w-full flex-1 h-auto flex bg-blue-50 "
        >
          <div className="w-full flex-col ">
            <div className="flex justify-start w-full text-[15px] font-semibold ">
              {DASHBOARD_DELIVERED}
            </div>
            <div className="flex justify-start w-full  font-bold gap-1 items-center">
              <div style={{ fontWeight: "700" }} className="text-[24px]">
                {Deliverd}
              </div>
            </div>
          </div>
        </Card>

        {/*  Accepted Card*/}
        <Card bordered={false} className="w-full flex-1 h-auto flex bg-blue-50">
          <div className="w-full flex-col ">
            <div className="flex justify-start w-full text-[15px] font-semibold ">
              {DASHBOARD_ACCEPTED}
            </div>
            <div className="flex justify-start w-full  font-bold gap-1 items-center">
              <div style={{ fontWeight: "700" }} className="text-[24px]">
                {Accepted}
              </div>
            </div>
          </div>
        </Card>
        {/* </div> */}
        {/* <div className=" w-full h-full"> */}
        {/*  Rejected Card*/}
        <Card bordered={false} className="w-full flex-1 h-auto flex bg-blue-50">
          <div className="w-full flex-col ">
            <div className="flex justify-start w-full text-[15px] font-semibold ">
              {DASHBOARD_REJECTED}
            </div>
            <div className="flex justify-start w-full  font-bold gap-1 items-center">
              <div style={{ fontWeight: "700" }} className="text-[24px]">
                {Rejected}
              </div>
            </div>
          </div>
        </Card>
        {/* Goal Card */}
        {/* <Card bordered={false} className="w-full flex-1 h-auto flex bg-blue-50">
          <div className="w-full flex-col ">
            <div className="flex justify-start w-full text-[15px] font-semibold ">
              {DASHBOARD_GOAL}
            </div>
            <div className="flex justify-start w-full  font-bold gap-1 items-center">
              <div style={{ fontWeight: "700" }} className="text-[24px]">
                {goal}
              </div>
            </div>
          </div>
        </Card> */}
      </div>
    </div>
  );
}

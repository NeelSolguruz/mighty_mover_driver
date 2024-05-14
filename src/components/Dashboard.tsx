import { Card, Modal, Table } from "antd";
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
  DRIVERORDER_DATA_COL,
  //   DASHBOARD_GOAL,
  // PURCHASE_ORDER_STATUS,
  // DELIVERED,
  // INPROGRESS,
  // NOTDELIVERED,
  // MONTHLY_DATA,
  // MONTHLY_TARGET,
} from "../assets/constant/constaint";

import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
// import CountUp from 'react-countup';
import { useDispatch } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { setPage } from "../redux/pageSlice";
import { LiaRupeeSignSolid } from "react-icons/lia";
import http from "../http/http";
import { ProductTableRowProps } from "../assets/dto/data.type";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import {
  DirectionsRenderer,
  GoogleMap,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
// import {
//   DirectionsRenderer,
//   DirectionsService,
//   GoogleMap,
//   InfoWindow,
//   useJsApiLoader,
// } from "../components/GoogleMap";
// import Linechart from './linechart';
export default function Dashboard() {
  const [Revenue, setRevenue] = useState(12345);
  const [Order, setOrder] = useState(0);
  const [Deliverd, setDeliverd] = useState(0);
  const [Accepted, setAccepted] = useState(0);
  const [Rejected, setRejected] = useState(0);
  const [detailModel, setDetailModel] = useState(false);
  const [selectedOrder, setSelectedOrder] =
    useState<ProductTableRowProps | null>(null);
  const [DriverOrderData, setDrivertOrderData] = useState<
    ProductTableRowProps[]
  >([]);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [infoWindowPosition, setInfoWindowPosition] = useState(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAVZWRn7jpEjdxVeIDNo5s6Tz3xJNB_PVE",
    libraries: ["places"],
  });
  const center_coordinates = { lat: 23.0225, lng: 72.5714 };
  // const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    //  setLoading(true);
    try {
      //  const skip = (page - 1) * 10;
      const response = await http.get(`/api/v1/driver-order/history`);
      //  console.log();
      // console.log(response.data.data);
      setDrivertOrderData(response.data.data);
      // console.log(total);
      //  setCurrentPage(page);
      toast.success(response.data.message);

      //  setTotal(response.data.total);
      //  setLoading(false);
    } catch (error) {
      handleError(error as Error);
    } finally {
      //  setLoading(false);
    }
  }, []);

  const handleCloseDetailModel = () => {
    setDetailModel(false);
    setSelectedOrder(null);
  };
  const handleError = (error: Error) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{
        status: number;
        message: string;
      }>;
      if (axiosError.response) {
        console.log("Response Error", axiosError.response);
        toast.error(axiosError.response.data.message);
      } else if (axiosError.request) {
        console.log("Request Error", axiosError.request);
      } else {
        console.log("Error", axiosError.message);
      }
    }
  };
  useEffect(() => {
    //  dispatch(setPage("Category"));
    void fetchData();
  }, [fetchData]);

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
      setOrder(response.data.data.InProgress || 0);
      setDeliverd(response.data.data.Delivered || 0);
      setAccepted(response.data.data.Accepted || 0);
      setRejected(response.data.data.Cancel || 0);
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

  const handleMapButtonClick = async (item: ProductTableRowProps) => {
    console.log(item.pickup_latitude);
    setSelectedOrder(item);
    const directionsService = new google.maps.DirectionsService();
    // const pickupLocation = {
    //   lat: parseFloat(item.pickup_latitude),
    //   lng: parseFloat(item.pickup_longitude),
    // };
    // const deliveryLocation = {
    //   lat: parseFloat(item.delivery_latitude),
    //   lng: parseFloat(item.delivery_longitude),
    // };
    const results = await directionsService.route({
      origin: item.Pickup,
      destination: item.Delivery,
      travelMode: google.maps.TravelMode.DRIVING,
    });
    console.log(results);
    setDirectionsResponse(results);

    setDetailModel(true);
  };
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
      <div>
        <Card title="Driver Orders History" className="m-2">
          <Table
            rowClassName="text-center"
            dataSource={DriverOrderData}
            // pagination={{
            //   pageSize: 10,
            //   total: total,
            //   current: currentPage,
            //   onChange: (page) => {
            //     fetchData(page);
            //   },
            // }}
            // pagination={false}
            columns={DRIVERORDER_DATA_COL()}
            // bordered
            onRow={(record) => ({
              onClick: () => handleMapButtonClick(record), // Call handleMapButtonClick with the clicked record
            })}
            sticky
            className="w-full"
          ></Table>
        </Card>
      </div>
      <div>
        {selectedOrder && (
          <div className="fixed inset-0 w-full flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
            <Modal
              open={detailModel}
              onCancel={handleCloseDetailModel}
              footer={null}
              className="bg-white rounded-lg w-auto h-auto"
            >
              <div className="w-full h-full flex flex-col">
                {/* Header */}
                <div className="w-full px-3 py-3 flex justify-start">
                  <h2 className="text-xl font-semibold">Order Details</h2>
                </div>

                {/* Content */}
                <div className="flex-grow w-full gap-4 p-4 border border-green-500 flex flex-col md:flex-row">
                  {/* Order Details */}
                  <div className="w-auto h-auto">
                    <p>Order ID: {selectedOrder.orderId}</p>
                    <p>
                      Customer Name:{" "}
                      {`${selectedOrder.firstName} ${selectedOrder.lastName}`}
                    </p>
                    <p>Pickup Location: {selectedOrder.Pickup}</p>
                    <p>Delivery Location: {selectedOrder.Delivery}</p>
                    <p>Payment Type: {selectedOrder.Payment_type}</p>
                    <p>Payment Status: {selectedOrder.Payment_status}</p>
                    <p>Amount Collect: {selectedOrder.Amount_collect}</p>
                  </div>

                  {/* Map */}
                  {isLoaded ? (
                    <div className="w-full md:w-1/2 h-auto md:h-96 px-1 py-1 shadow-sm rounded border border-red-500">
                      <GoogleMap
                        center={center_coordinates}
                        zoom={15}
                        mapContainerStyle={{
                          height: "100%",
                          width: "100%",
                          borderRadius: "10px",
                        }}
                        options={{
                          zoomControl: false,
                          mapTypeControl: false,
                          fullscreenControl: false,
                        }}
                      >
                        {directionsResponse && (
                          <DirectionsRenderer
                            options={{
                              polylineOptions: {
                                strokeColor: "#2967ff",
                                strokeOpacity: 1,
                                strokeWeight: 6,
                              },
                            }}
                            directions={directionsResponse}
                          />
                        )}
                        {infoWindowPosition && (
                          <InfoWindow
                            position={infoWindowPosition}
                            onCloseClick={() => setInfoWindowPosition(null)}
                          >
                            <div
                              dangerouslySetInnerHTML={{ __html: InfoWindow }}
                            />
                          </InfoWindow>
                        )}
                      </GoogleMap>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </Modal>
          </div>
        )}
      </div>
      {/* {isLoaded ? (
        <div className="w-full h-full px-1 py-1 shadow-sm rounded ">
          <GoogleMap
            center={center_coordinates}
            zoom={15}
            mapContainerStyle={{
              height: "100%",
              width: "100%",
              borderRadius: "10px",
              // border: "1px solid #2967ff",   
            }}
            options={{
              zoomControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            {directionsResponse && (
              <DirectionsRenderer
                options={{
                  polylineOptions: {
                    strokeColor: "#2967ff",
                    strokeOpacity: 1,
                    strokeWeight: 6,
                  },
                }}
                directions={directionsResponse}
              />
            )}
            {infoWindowPosition && (
              <InfoWindow
                position={infoWindowPosition}
                onCloseClick={() => setInfoWindowPosition(null)}
              >
                <div dangerouslySetInnerHTML={{ __html: InfoWindow }} />
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
      ) : (
        <></>
      )} */}
    </div>
  );
}

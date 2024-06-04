import { Card, List, Modal, Spin, Table } from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  DollarOutlined,
} from "@ant-design/icons";

import {
  DASHBOARD_STATS_PROFIT_VAL,
  DASHBOARD_TOTAL_EARNING,
  DASHBOARD_IN_PROGRESS,
  DASHBOARD_DELIVERED,
  DASHBOARD_ACCEPTED,
  // DASHBOARD_REJECTED,
  DRIVERORDER_DATA_COL,
  DASHBOARD_TOTAL,
} from "../assets/constant/constaint";

import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
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
import { RiMoneyRupeeCircleLine } from "react-icons/ri";

export default function Dashboard() {
  const [Revenue, setRevenue] = useState(12345);
  const [Order, setOrder] = useState(0);
  const [Deliverd, setDeliverd] = useState(0);
  const [Accepted, setAccepted] = useState(0);
  // const [Rejected, setRejected] = useState(0);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [Totalorder, setTotalorder] = useState(0);
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

  const fetchData = useCallback(async (page: number) => {
    try {
      const skip = (page - 1) * 10;
      const response = await http.get(
        `/api/v1/driver-order/history?limit=10&offset=${skip}`
      );
      setCurrentPage(page);
      setDrivertOrderData(response.data.data);
      setTotal(response.data.total);
      toast.success(response.data.message);
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
      // console.log(response.data.data[0].accepted );
      setOrder(response.data.data[0].in_progress || 0);
      setTotalorder(response.data.data[0].total || 0);
      setDeliverd(response.data.data[0].delivered || 0);
      setAccepted(response.data.data[0].accepted || 0);
      // setRejected(response.data.data[0].cancel || 0);
    } catch (error) {
      console.log(error);
    }
  };

  const dispatch = useDispatch();
  useEffect(() => {
    TotalEarning();
    driverOrder();
    dispatch(setPage("Dashboard"));
    void fetchData(currentPage);
    // dummy();
  }, [dispatch, fetchData, currentPage]);

  const handleMapButtonClick = async (item: ProductTableRowProps) => {
    console.log(item.pickup_latitude);
    setSelectedOrder(item);
    const directionsService = new google.maps.DirectionsService();

    const results = await directionsService.route({
      origin: item.pickup,
      destination: item.delivery,
      travelMode: google.maps.TravelMode.DRIVING,
    });
    console.log(results);
    setDirectionsResponse(results);

    setDetailModel(true);
  };

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

        {/* Total Number Of Number */}
        <Card bordered={false} className="w-full flex-1 h-auto flex bg-blue-50">
          <div className="w-full flex-col ">
            <div className="flex justify-start w-full text-[15px] font-semibold ">
              {DASHBOARD_TOTAL}
            </div>
            <div className="flex justify-start w-full  font-bold gap-1 items-center">
              <div style={{ fontWeight: "700" }} className="text-[24px]">
                {Totalorder}
              </div>
            </div>
          </div>
        </Card>

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

        {/*  Rejected Card*/}
        {/* <Card bordered={false} className="w-full flex-1 h-auto flex bg-blue-50">
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
        </Card> */}
        {/* Goal Card */}
      </div>
      <div>
        <Card title="Driver Orders History" className="m-2">
          <Table
            rowClassName="text-center"
            dataSource={DriverOrderData}
            pagination={{
              pageSize: 10,
              total: total,
              current: currentPage,
              onChange: (page) => {
                fetchData(page);
              },
            }}
            // pagination={false}
            columns={DRIVERORDER_DATA_COL(currentPage, 10)}
            // bordered
            onRow={(record: ProductTableRowProps) => ({
              onClick: () => handleMapButtonClick(record),
            })}
            sticky
            className="w-full"
          ></Table>
        </Card>
      </div>
      <div>
        {selectedOrder && (
          <div className="fixed inset-0 w-full flex justify-center items-center bg-gray-500 bg-opacity-50 z-50 ">
            <Modal
              // className="rounded-lg w-full max-w-4xl"
              closeIcon={<span className="text-2xl rotate-45">&#10009;</span>}
              centered
              open={detailModel}
              onCancel={handleCloseDetailModel}
              footer={null}
              width={900}
              className=" rounded-lg w-auto h-auto md:w-auto max-md:w-full max-md:h-full"
            >
              <div className="w-full h-full flex flex-col">
                {/* Header */}
                <div className="w-full px-3 py-3 flex justify-start">
                  <h2 className="text-xl font-semibold">Order Details</h2>
                </div>

                {/* Content */}
                <div className="flex-grow w-full gap-4 p-4  flex flex-col md:flex-row max-md:flex-col-reverse">
                  {/* Order Details */}
                  <div className="w-full md:w-1/2 h-auto flex flex-col  gap-2 bg-white p-3 rounded shadow-md">
                    <List
                      itemLayout="horizontal"
                      dataSource={[
                        {
                          title: "Customer Name",
                          description: `${selectedOrder.first_name} ${selectedOrder.last_name}`,
                        },
                        {
                          title: "Contact",
                          description: selectedOrder.contact,
                        },
                        {
                          title: "Pickup Location",
                          description: selectedOrder.pickup,
                        },
                        {
                          title: "Delivery Location",
                          description: selectedOrder.delivery,
                        },
                        {
                          title: "Payment Type",
                          description: selectedOrder.payment_type,
                        },
                        {
                          title: "Order Status",
                          description: selectedOrder.status,
                        },
                        {
                          title: "Billing Amount",
                          description: selectedOrder.amount_collect,
                        },
                      ]}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              item.title === "Customer Name" ? (
                                <UserOutlined />
                              ) : item.title === "Contact" ? (
                                <PhoneOutlined />
                              ) : item.title === "Pickup Location" ? (
                                <EnvironmentOutlined
                                  style={{ color: "green" }}
                                />
                              ) : item.title === "Delivery Location" ? (
                                <EnvironmentOutlined style={{ color: "red" }} />
                              ) : item.title === "Payment Type" ? (
                                <CreditCardOutlined />
                              ) : item.title === "Order Status" ? (
                                <CheckCircleOutlined />
                              ) : (
                                <RiMoneyRupeeCircleLine  className="text-lg mt-1"/>
                              )
                            }
                            title={item.title}
                            description={item.description}
                          />
                        </List.Item>
                      )}
                    />
                  </div>

                  {/* Map */}
                  {isLoaded ? (
                    <div className="w-full max-md:h-[450px] h-auto px-1 py-1 shadow-sm rounded">
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
                    <>
                      <div className="w-full md:w-1/2 h-96 p-4 bg-white rounded shadow-md flex justify-center items-center">
                        <Spin size="large" />
                      </div>
                    </>
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

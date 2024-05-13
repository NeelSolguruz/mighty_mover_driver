// // import React from "react";
// // import { Button } from "antd";
// import http from "../http/http";
// import { useEffect, useState } from "react";

// function DriverVehical() {
//   const [vehicleData, setVehicleData] = useState<any[]>([]);

//   const fetchData = async () => {
//     try {
//       const response = await fetch("/api/v1/vehicle");
//       const data = await response.json();
//       return data.data; // Extracting the 'data' array from the response
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       return [];
//     }
//   };
//   useEffect(() => {
//     const getData = async () => {
//       const vehicleData = await fetchData();
//       console.log("Vehicle Data:", vehicleData);

//       // Printing data index-wise
//       vehicleData.forEach((vehicle: any, index: number) => {
//         console.log(`Vehicle ${index + 1}:`, vehicle);
//       });
//     };

//     getData();
//   }, []);

//   return (
//     <div>
//       <button onClick={printDataIndexWise}>Print Data</button>
//     </div>
//   );
// }
// export default DriverVehical;

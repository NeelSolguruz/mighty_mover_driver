import { ColumnProps } from "antd/es/table";
import { AlignType, ProductTableRowProps } from "../dto/data.type";

export const OTP_VERIFICATION = "OTP Verification";
export const OTP_SENT_TO_EMAIL = "OTP sent to ";
export const OTP_SENT_DESC =
  "we will send you an one time password on this email";
export const DID_NOT_GET = "Didn't got a code";
export const DRIVER_LOGIN = {
  sign_in: "Sign in as Driver.",
  tagline: "Vehicle hai? #KholdoDhandha",
};

export const LOGIN_DATA_STRING = {
  TITLE: "Login to your account",
  SUBTITLE: "Welcome to Mighty Movers",
  LOGIN: "Login",
  SUBMIT: "Login",
  EMAIL: "Email",
  PASSWORD: "Password",
};
export const LOGIN = {
  account: "Account",
  sign_in: "Sign in to your account",
  tagline: "Enter your credentials to view all insights",
  forgot_text: "Forgot password?",
  forgot_link: "/forgot-password",
  email_label: "Email",
  password_label: "Password",
};

export const POPOVER_PROFILE = "Profile";
export const POPOVER_LOGOUT = "Logout";
export const DASHBOARD_TOTAL_EARNING = "Total Earning";
export const DASHBOARD_IN_PROGRESS = " In Progress";
export const DASHBOARD_DELIVERED = "Delivered";
export const DASHBOARD_ACCEPTED = "Accepted";
export const DASHBOARD_REJECTED = "Rejected";
export const DASHBOARD_TOTAL = "Total Orders";
// export const DASHBOARD_GOAL = "Rejected";
export const DASHBOARD_STATS_REVENUE_VAL = 10000000;
export const DASHBOARD_STATS_COSTS_MONEY_VAL = 1000000;
export const DASHBOARD_STATS_PROFIT_VAL =
  DASHBOARD_STATS_REVENUE_VAL - DASHBOARD_STATS_COSTS_MONEY_VAL;
export const COPYRIGHT = "Copyright © 2024 Mighty Movers All rights reserved.";
export const TERMS = "Term & Conditions | Privacy & Policy";

export const DRIVERORDER_DATA_COL = (
  currentPage: number,
  pageSize: number
): ColumnProps<ProductTableRowProps>[] => [
  {
    title: "Sr.No.",
    dataIndex: "id",
    render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,

    align: "center" as AlignType,
  },
  {
    title: "Name",
    dataIndex: "",
    render: (record: ProductTableRowProps) =>
      `${record.first_name} ${record.last_name}`,
    align: "center" as AlignType,
  },
  {
    title: "Collected Amount",
    dataIndex: "amount_collect",
    align: "center" as AlignType,
  },
  {
    title: "Contact",
    dataIndex: "contact",
    align: "center" as AlignType,
  },
  {
    title: "Pickup Location ",
    dataIndex: "pickup",
    align: "center" as AlignType,
  },
  {
    title: "Delivery",
    dataIndex: "delivery",
    align: "center" as AlignType,
  },
  {
    title: "Payment Type",
    dataIndex: "payment_type",
    align: "center" as AlignType,
  },
  {
    title: "Order Status",
    dataIndex: "status",
    align: "center" as AlignType,
  },
];

export const OK = "OK";
export const CANCEL = "Cancel";
export const BACK_BUTTON = "Back";
export const ADD_ITEM = "Add Item";
export const ADD_USER = "Add User";
export const EDIT_ITEM = "Edit Item";
export const REMOVE_ITEM = "Remove Item";
export const DELETE = "Delete";
export const EDIT_BUTTON = " Edit";
export const DELETE_BUTTON = " Delete";

export const DELETE_CONFIRMATION = "Are you sure you want to delete this item?";

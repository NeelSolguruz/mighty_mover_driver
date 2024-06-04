import { useCallback, useEffect, useState } from "react";
import { Address, AlignType } from "../assets/dto/data.type";
import { ColumnProps } from "antd/es/table";
import { Button, Card, Form, Input, Modal, Table } from "antd";
import { useDispatch } from "react-redux";
import http from "../http/http";
import { toast } from "sonner";
import { setPage } from "../redux/pageSlice";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import {
  ADD_ITEM,
  CANCEL,
  DELETE,
  DELETE_CONFIRMATION,
  EDIT_ITEM,
} from "../assets/constant/constaint";
import axios, { AxiosError } from "axios";
import { useForm } from "antd/es/form/Form";
type FieldType = {
  id: string;
  state: string;
  district: string;
  area: string;
  // status?: string;
};

function DriverAddress() {
  const [AddressData, setAddressData] = useState<Address[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState("");
  const [modal2Open, setModal2Open] = useState(false);
  const [addItem, setAddItem] = useState(false);
  const [CurrentEditValue, setCurrentEditValue] = useState("");
  const dispatch = useDispatch();
  const [form] = useForm();
  const [addForm] = useForm();
  const ADDRESS_DATA_COl = (): ColumnProps<Address>[] => [
    {
      title: "Sr.No.",
      dataIndex: "index",
      render: (_, __, index) => index + 1,
      align: "center" as AlignType,
    },
    {
      title: "State",
      dataIndex: "state",

      align: "center" as AlignType,
    },
    {
      title: "District",
      dataIndex: "district",

      align: "center" as AlignType,
    },
    {
      title: "Area",
      dataIndex: "area",
      align: "center" as AlignType,
    },
    {
      title: "Action",
      key: "action",
      align: "center" as AlignType,
      render: (_, record: Address) => (
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => handleEdit(record, record.id)}
            className="py-3 px-4 bg-blue-500 text-white rounded"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(record.id)}
            className="py-3 px-4 bg-red-500 text-white rounded"
          >
            <MdDelete />
          </button>
        </div>
      ),
    },
  ];

  const handleDelete = async (id: string) => {
    showDeleteModal(id);
  };

  // show delete confirm modal confirmation popup
  const showDeleteModal = (id: string) => {
    setDeleteItemId(id);
    setDeleteModalVisible(true);
  };

  // close delete confirmation modal
  const handleDeleteModalCancel = () => {
    setDeleteModalVisible(false);
  };

  // Function to confirm delete action
  const handleDeleteConfirm = async () => {
    try {
      const deleteRecord = await http.delete(
        `/api/v1/driver/address/${deleteItemId}`
      );
      console.log(deleteRecord.data);
      fetchData();
      setDeleteModalVisible(false);
    } catch (error) {
      handleError(error as Error);
    }
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

  const handleEdit = (record: Address, id: string) => {
    setModal2Open(true);
    form.setFieldsValue(record);
    setCurrentEditValue(id);
  };
  // this const is used for update specific subcategories
  const handleUpdatedata = async () => {
    // console.log(setCurrentEditValue);
    setModal2Open(false);
    try {
      const updateRecord = await http.patch(
        `/api/v1/driver/address/${CurrentEditValue}`,
        form.getFieldsValue({})
      );
      toast.success(updateRecord.data.message);
      setCurrentEditValue("");
      fetchData();
    } catch (error) {
      handleError(error as Error);
    }
  };
  //handle add item
  const handleAdd = () => {
    setAddItem(true);
  };
  const handleAddItemModelClose = () => {
    setAddItem(false);
  };
  const handleAdditems = async (params: Address) => {
    console.log("Formdata:", params);

    // console.log('add item');
    // setAddItem(false);
    try {
      // console.log(radioValue);
      const res = await http.post("/api/v1/driver/address", {
        state: params?.state,
        district: params?.district,
        area: params?.area,
      });

      // if (res.status === 201) {
      toast.success(res.data.message);
      setAddItem(false);
      addForm.resetFields();
      fetchData();
      console.log(res.data.data);
      // } else {
      //   toast.error(res.data.message);
      // }
    } catch (error) {
      handleError(error as Error);
      // toast.error(error);
    }
  };

  // fetchdata use for get all data
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
    dispatch(setPage("Address"));
    void fetchData();
  }, [fetchData, dispatch]);

  return (
    <>
      <div className="flex justify-end mb-2">
        <Button
          onClick={handleAdd}
          style={{ color: "#2967ff", backgroundColor: "#ffffff" }}
        >
          +{ADD_ITEM}
        </Button>
      </div>
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
      <Modal
        title="Add Address"
        open={addItem}
        onCancel={handleAddItemModelClose}
        footer={null}
      >
        <Form
          form={addForm}
          onFinish={handleAdditems}
          autoComplete="off"
          className="w-full "
        >
          <Form.Item
            label="State"
            name="state"
            rules={[{ required: true, message: "Please input state here!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="District"
            name="district"
            rules={[
              {
                required: true,
                message: "Please input district here!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Area"
            name="area"
            rules={[
              {
                required: true,
                message: "Please input area here!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <div className="flex gap-3 justify-end">
            <Button onClick={handleAddItemModelClose}>{CANCEL}</Button>
            <Button htmlType="submit">{ADD_ITEM}</Button>
          </div>
        </Form>
      </Modal>
      <Modal
        title="Edit Address"
        centered
        open={modal2Open}
        onOk={() => form.submit()}
        onCancel={() => setModal2Open(false)}
        footer={null}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 3 }}
          style={{ maxWidth: 600 }}
          //   onFinish={onFinish}
          //   onFinishFailed={onFinishFailed}
          autoComplete="off"
          className="w-full "
        >
          <Form.Item<FieldType>
            label="State"
            name="state"
            rules={[{ required: false, message: "Please input state here!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="District"
            name="district"
            rules={[
              { required: false, message: "Please input district here!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Area"
            name="area"
            rules={[{ required: false, message: "Please input area here !" }]}
          >
            <Input />
          </Form.Item>

          <div className="flex gap-3 justify-end">
            <Button onClick={() => setModal2Open(false)}>{CANCEL}</Button>
            <Button onClick={handleUpdatedata}>{EDIT_ITEM}</Button>
          </div>
        </Form>
      </Modal>
      <Modal
        title="Confirm Deletion"
        open={deleteModalVisible}
        onCancel={handleDeleteModalCancel}
        footer={
          <div className="flex gap-3 justify-end">
            <Button onClick={handleDeleteModalCancel}>{CANCEL}</Button>
            <Button onClick={handleDeleteConfirm}>{DELETE}</Button>
          </div>
        }
      >
        <p>{DELETE_CONFIRMATION}</p>
      </Modal>
    </>
  );
}

export default DriverAddress;

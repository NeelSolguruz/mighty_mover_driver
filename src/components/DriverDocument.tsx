import React, { useEffect, useState } from "react";
import { Upload, message, Button, Modal, Image, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import http from "../http/http";
import formhttp from "../http/formHttp";
import { documentData } from "../assets/dto/data.type";

interface Document {
  id: string;
  internal_path: string;
  document: string;
}

interface Props {}

const { Option } = Select;

const DriverDocument: React.FC<Props> = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocumentType, setSelectedDocumentType] =
    useState<keyof documentData>("aadhar");
  const [documentFormData, setDocumentFormData] = useState<documentData>({
    aadhar: null,
    licence: null,
    pancard: null,
    vehicle: null,
  });
  const [uploading, setUploading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [updateId, setUpdateId] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await http.get("api/v1/document");
      setDocuments(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDocumentChange = (type: keyof documentData) => (info: any) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
      setDocumentFormData({
        ...documentFormData,
        [type]: info.file.originFileObj,
      });
      setSelectedDocumentType(type);
      setPreviewUrl(info.file.thumbUrl);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleUpload = async () => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", documentFormData[selectedDocumentType] as Blob);
      formData.append("type", selectedDocumentType);
      await formhttp.post("api/v1/document", formData);
      message.success("File uploaded successfully");
      fetchDocuments();
    } catch (error) {
      console.log(error);
      message.error("File upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleModalOpen = (document: Document) => {
    setUpdateId(document.id);
    setPreviewUrl(document.document);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setPreviewUrl(undefined);
  };

  const handleSaveChanges = async () => {
    try {
      const formData = new FormData();
      formData.append("image", documentFormData[selectedDocumentType] as Blob);
      formData.append("type", selectedDocumentType);
      await formhttp.patch(`/api/v1/document/update/${updateId}`, formData);
      message.success("Changes saved successfully");
      fetchDocuments();
    } catch (error) {
      console.log(error);
      message.error("Failed to save changes");
    } finally {
      setIsModalVisible(false);
    }
  };

  return (
    <>
      {/* Document Upload Section */}
      <div className="flex flex-col gap-4 w-full">
        <Select
          value={selectedDocumentType}
          onChange={(value) =>
            setSelectedDocumentType(value as keyof documentData)
          }
        >
          <Option value="aadhar">Aadhar Card</Option>
          <Option value="licence">Driving Licence</Option>
          <Option value="pancard">Pancard</Option>
          <Option value="vehicle">Vehicle</Option>
        </Select>
        <Upload
          name="document"
          action="api/v1/document"
          beforeUpload={() => false}
          onChange={handleDocumentChange(selectedDocumentType)}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>Upload Document</Button>
        </Upload>
        {previewUrl && <Image src={previewUrl} alt="Document Preview" />}
        <Button type="primary" onClick={handleUpload} loading={uploading}>
          {uploading ? "Uploading" : "Upload"}
        </Button>
      </div>

      {/* Document Display Section */}
      <div className="flex flex-col gap-4 w-full">
        {documents.map((document) => (
          <div key={document.id}>
            <Image src={document.document} alt="Document Preview" />
            <Button onClick={() => handleModalOpen(document)}>Edit</Button>
          </div>
        ))}
      </div>

      {/* Modal for Editing Document */}
      <Modal
        title="Edit Document"
        visible={isModalVisible}
        onOk={handleSaveChanges}
        onCancel={handleModalClose}
      >
        <Upload
          name="document"
          action={`/api/v1/document/update/${updateId}`}
          beforeUpload={() => false}
          onChange={handleDocumentChange(selectedDocumentType)}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>Upload New Document</Button>
        </Upload>
        {previewUrl && <Image src={previewUrl} alt="Document Preview" />}
      </Modal>
    </>
  );
};

export default DriverDocument;

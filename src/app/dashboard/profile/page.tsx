"use client";

import { useState, useEffect } from "react";
import {
  MenuOutlined,
  DownloadOutlined,
  ReloadOutlined,
  CameraOutlined,
  BellOutlined,
  LockOutlined,
  CreditCardOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Card, Input, Switch, Button, Modal, Form, message } from "antd";
import Sidebar from "../_components/Sidebar";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface Address {
  id: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  instructions?: string;
}

const MAX_ADDRESSES = 3;

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form] = Form.useForm();
  const [addressForm] = Form.useForm();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);

  useEffect(() => {
    // Load saved addresses
    const savedAddresses = localStorage.getItem("userAddresses");
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    }
  }, []);

  const handleAddAddress = (values: Omit<Address, "id">) => {
    if (addresses.length >= MAX_ADDRESSES) {
      message.error(`Maximum ${MAX_ADDRESSES} addresses allowed`);
      return;
    }

    const newAddress: Address = {
      id: Date.now().toString(),
      ...values,
    };

    const updated = [...addresses, newAddress];
    setAddresses(updated);
    localStorage.setItem("userAddresses", JSON.stringify(updated));
    setIsAddAddressModalOpen(false);
    addressForm.resetFields();
    message.success("Address added successfully");
  };

  const handleEditAddress = (values: Omit<Address, "id">) => {
    if (!editingAddress) return;

    const updated = addresses.map((addr) =>
      addr.id === editingAddress.id ? { ...editingAddress, ...values } : addr
    );
    setAddresses(updated);
    localStorage.setItem("userAddresses", JSON.stringify(updated));
    setEditingAddress(null);
    addressForm.resetFields();
    message.success("Address updated successfully");
  };

  const handleDeleteAddress = (id: string) => {
    const updated = addresses.filter((addr) => addr.id !== id);
    setAddresses(updated);
    localStorage.setItem("userAddresses", JSON.stringify(updated));
    message.success("Address deleted successfully");
  };

  return (
    <div className="min-h-screen bg-app_bg flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-text1"
              >
                <MenuOutlined className="text-xl" />
              </button>
              <h1 className="text-2xl font-bold text-text1">Profile</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-text2 hover:text-text1">
                <DownloadOutlined className="text-xl" />
              </button>
              <button className="text-text2 hover:text-text1">
                <ReloadOutlined className="text-xl" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 flex flex-col lg:p-6 gap-6">
          {/* User Profile Summary  */}
          <Card className="shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center text-2xl font-bold text-app_secondary">
                  JD
                </div>
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md">
                  <CameraOutlined className="text-text1" />
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-text1 mb-1">John Doe</h2>
                <p className="text-text2 mb-4">john.doe@example.com</p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-green-50 px-4 py-2 rounded-lg">
                    <p className="text-sm text-text2">Total Orders</p>
                    <p className="text-lg font-bold text-text1">23</p>
                  </div>
                  <div className="bg-orange-50 px-4 py-2 rounded-lg">
                    <p className="text-sm text-text2">Member Since</p>
                    <p className="text-lg font-bold text-text1">Jan 2025</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Personal Information */}
          <Card className="shadow-md">
            <h2 className="text-xl font-bold text-text1 mb-4">
              Personal Information
            </h2>
            <Form form={form} layout="vertical" initialValues={{
              fullName: "John Doe",
              email: "john.doe@example.com",
              phoneNumber: "+234 801 234 5678",
              deliveryAddress: "123 Main Street, Lagos, Nigeria",
            }}>
              <Form.Item name="fullName" label="Full Name">
                <Input />
              </Form.Item>
              <Form.Item name="email" label="Email Address">
                <Input />
              </Form.Item>
              <Form.Item name="phoneNumber" label="Phone Number">
                <Input />
              </Form.Item>
              <Form.Item name="deliveryAddress" label="Delivery Address">
                <Input />
              </Form.Item>
              <Button
                type="primary"
                className="bg-app_secondary border-app_secondary mt-4"
              >
                Save Changes
              </Button>
            </Form>
          </Card>

          {/* Addresses Section */}
          <Card className="shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-text1">Addresses</h2>
              {addresses.length < MAX_ADDRESSES && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setEditingAddress(null);
                    setIsAddAddressModalOpen(true);
                  }}
                  className="bg-app_secondary border-app_secondary"
                >
                  Add Address
                </Button>
              )}
            </div>

            {addresses.length === 0 ? (
              <p className="text-text2 text-center py-8">
                No addresses saved. Add your first address to get started.
              </p>
            ) : (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-text1 mb-1">
                          {address.fullName}
                        </div>
                        <div className="text-sm text-text2 space-y-1">
                          <div>{address.phoneNumber}</div>
                          <div>{address.address}</div>
                          {address.instructions && (
                            <div className="italic">{address.instructions}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          onClick={() => {
                            setEditingAddress(address);
                            addressForm.setFieldsValue(address);
                            setIsAddAddressModalOpen(true);
                          }}
                        />
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeleteAddress(address.id)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Preferences */}
          <Card className="shadow-md">
            <h2 className="text-xl font-bold text-text1 mb-4">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BellOutlined className="text-text2" />
                  <div>
                    <div className="font-semibold text-text1">
                      Push Notifications
                    </div>
                    <div className="text-sm text-text2">
                      Receive notifications about your orders
                    </div>
                  </div>
                </div>
                <Switch
                  checked={pushNotifications}
                  onChange={setPushNotifications}
                  className="bg-app_secondary"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BellOutlined className="text-text2" />
                  <div>
                    <div className="font-semibold text-text1">
                      Email Updates
                    </div>
                    <div className="text-sm text-text2">
                      Receive promotional emails and updates
                    </div>
                  </div>
                </div>
                <Switch
                  checked={emailUpdates}
                  onChange={setEmailUpdates}
                  className="bg-app_secondary"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BellOutlined className="text-text2" />
                  <div>
                    <div className="font-semibold text-text1">Order Updates</div>
                    <div className="text-sm text-text2">
                      Get notified about order status changes
                    </div>
                  </div>
                </div>
                <Switch
                  checked={orderUpdates}
                  onChange={setOrderUpdates}
                  className="bg-app_secondary"
                />
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-md">
            <h2 className="text-xl font-bold text-text1 mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <LockOutlined className="text-text1" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-text1">
                    Privacy & Security
                  </div>
                  <div className="text-sm text-text2">
                    Manage your privacy settings
                  </div>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <CreditCardOutlined className="text-text1" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-text1">Payment Methods</div>
                  <div className="text-sm text-text2">
                    Manage your payment options
                  </div>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <LogoutOutlined className="text-text1" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-text1">Log Out</div>
                  <div className="text-sm text-text2">Sign out of your account</div>
                </div>
              </button>
            </div>
          </Card>
        </main>
      </div>

      {/* Add/Edit Address Modal */}
      <Modal
        title={editingAddress ? "Edit Address" : "Add New Address"}
        open={isAddAddressModalOpen}
        onCancel={() => {
          setIsAddAddressModalOpen(false);
          setEditingAddress(null);
          addressForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={addressForm}
          layout="vertical"
          onFinish={editingAddress ? handleEditAddress : handleAddAddress}
        >
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: "Please enter full name" }]}
          >
            <Input placeholder="Enter your full name" />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input placeholder="Enter your phone number" />
          </Form.Item>
          <Form.Item
            name="address"
            label="Delivery Address"
            rules={[{ required: true, message: "Please enter address" }]}
          >
            <Input placeholder="Enter your delivery address" />
          </Form.Item>
          <Form.Item name="instructions" label="Delivery Instructions (Optional)">
            <Input.TextArea
              placeholder="Any special delivery instructions"
              rows={3}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="bg-app_primary border-app_primary"
            >
              {editingAddress ? "Update Address" : "Add Address"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}


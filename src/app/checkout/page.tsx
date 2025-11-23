"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, Radio, Input, Button, Modal, Form, message } from "antd";
import {
  CheckCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import conts from "@/lib/conts";

interface Address {
  id: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  instructions?: string;
}

const MAX_ADDRESSES = 3;

export default function CheckoutPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [selectedService, setSelectedService] = useState("ingredients");
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("card");

  useEffect(() => {
    // Load saved addresses from localStorage
    const savedAddresses = localStorage.getItem("userAddresses");
    if (savedAddresses) {
      const parsed = JSON.parse(savedAddresses);
      setAddresses(parsed);
      if (parsed.length > 0) {
        setSelectedAddress(parsed[0].id);
      }
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
    setSelectedAddress(newAddress.id);
    setIsAddAddressModalOpen(false);
    form.resetFields();
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
    form.resetFields();
    message.success("Address updated successfully");
  };

  const handleDeleteAddress = (id: string) => {
    const updated = addresses.filter((addr) => addr.id !== id);
    setAddresses(updated);
    localStorage.setItem("userAddresses", JSON.stringify(updated));
    if (selectedAddress === id) {
      setSelectedAddress(updated.length > 0 ? updated[0].id : null);
    }
    message.success("Address deleted successfully");
  };

  const handleCompleteOrder = () => {
    if (!selectedAddress) {
      message.error("Please select or add a delivery address");
      return;
    }
    router.push(conts.paths.orderConfirmed);
  };

  const selectedAddressData = addresses.find(
    (addr) => addr.id === selectedAddress
  );

  return (
    <div className="min-h-screen bg-app_bg p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={conts.paths.timetable}
            className="text-app_primary hover:underline mb-4 inline-block"
          >
            ← Back to Meal Plan
          </Link>
          <h1 className="text-3xl font-bold text-text1 text-center">
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Options */}
            <Card className="shadow-md">
              <h2 className="text-xl font-bold text-text1 mb-4">
                Select Service Option
              </h2>
              <Radio.Group
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full"
              >
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      value: "ingredients",
                      label: "Only Ingredients",
                      desc: "Get all ingredients delivered to your doorstep",
                    },
                    {
                      value: "vendors",
                      label: "Food Vendors",
                      desc: "Order prepared meals from our partner restaurants",
                    },
                    {
                      value: "ingredients-chef",
                      label: "Ingredients + Chef",
                      desc: "Get ingredients and a chef to prepare your meals",
                    },
                    {
                      value: "chef",
                      label: "Chef Only",
                      desc: "Hire a chef to prepare meals with your own ingredients",
                    },
                  ].map((option) => (
                    <Radio.Button
                      key={option.value}
                      value={option.value}
                      className={`h-auto p-4 border-2 rounded-lg ${
                        selectedService === option.value
                          ? "border-app_primary bg-green-50"
                          : "border-gray-300"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {selectedService === option.value && (
                          <CheckCircleOutlined className="text-app_primary mt-1" />
                        )}
                        <div>
                          <div className="font-semibold text-text1">
                            {option.label}
                          </div>
                          <div className="text-sm text-text2 mt-1">
                            {option.desc}
                          </div>
                        </div>
                      </div>
                    </Radio.Button>
                  ))}
                </div>
              </Radio.Group>
            </Card>

            {/* Delivery Information */}
            <Card className="shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-text1">
                  Delivery Information
                </h2>
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

              {/* Saved Addresses */}
              {addresses.length > 0 && (
                <div className="mb-4">
                  <Radio.Group
                    value={selectedAddress}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                    className="w-full"
                  >
                    <div className="space-y-3">
                      {addresses.map((address) => (
                        <Radio.Button
                          key={address.id}
                          value={address.id}
                          className="w-full h-auto p-4 border-2 rounded-lg"
                        >
                          <div className="flex items-start justify-between w-full">
                            <div className="flex-1">
                              <div className="font-semibold text-text1">
                                {address.fullName}
                              </div>
                              <div className="text-sm text-text2">
                                {address.phoneNumber}
                              </div>
                              <div className="text-sm text-text2">
                                {address.address}
                              </div>
                              {address.instructions && (
                                <div className="text-sm text-text2 italic mt-1">
                                  {address.instructions}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                type="text"
                                icon={<EditOutlined />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingAddress(address);
                                  form.setFieldsValue(address);
                                  setIsAddAddressModalOpen(true);
                                }}
                              />
                              <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteAddress(address.id);
                                }}
                              />
                            </div>
                          </div>
                        </Radio.Button>
                      ))}
                    </div>
                  </Radio.Group>
                </div>
              )}

              {/* Form Fields (shown when no address selected or for new address) */}
              {(!selectedAddressData || addresses.length === 0) && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text1 mb-2">
                      Full Name
                    </label>
                    <Input
                      placeholder="Enter your full name"
                      value={selectedAddressData?.fullName || ""}
                      readOnly={!!selectedAddressData}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text1 mb-2">
                      Phone Number
                    </label>
                    <Input
                      placeholder="Enter your phone number"
                      value={selectedAddressData?.phoneNumber || ""}
                      readOnly={!!selectedAddressData}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text1 mb-2">
                      Delivery Address
                    </label>
                    <Input
                      placeholder="Enter your delivery address"
                      value={selectedAddressData?.address || ""}
                      readOnly={!!selectedAddressData}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text1 mb-2">
                      Delivery Instructions (Optional)
                    </label>
                    <Input.TextArea
                      placeholder="Any special delivery instructions"
                      rows={3}
                      value={selectedAddressData?.instructions || ""}
                      readOnly={!!selectedAddressData}
                    />
                  </div>
                </div>
              )}

              {/* Display Selected Address */}
              {selectedAddressData && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-text1 mb-2">
                    Selected Address:
                  </div>
                  <div className="text-sm text-text2 space-y-1">
                    <div>{selectedAddressData.fullName}</div>
                    <div>{selectedAddressData.phoneNumber}</div>
                    <div>{selectedAddressData.address}</div>
                    {selectedAddressData.instructions && (
                      <div className="italic">
                        {selectedAddressData.instructions}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="shadow-md">
              <h2 className="text-xl font-bold text-text1 mb-4">
                Order Summary
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-text1 mb-2">
                    Weekly Meal Plan
                  </h3>
                  <div className="text-sm text-text2 space-y-1">
                    <div>Days: 7 days</div>
                    <div>Total Meals: 21 meals</div>
                    <div>Total Calories: 14,700 kcal</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-text1 mb-2">
                    Includes meals like:
                  </h4>
                  <div className="text-sm text-text2 space-y-1">
                    <div>Monday Breakfast: Oat and Tiger Nuts Pap</div>
                    <div>Wednesday Lunch: Beans and Vegetable Salad</div>
                    <div>Friday Dinner: Amala and Ewedu Soup</div>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-text2">
                    <span>Meal Plan Cost</span>
                    <span>₦45,500</span>
                  </div>
                  <div className="flex justify-between text-text2">
                    <span>Delivery Fee</span>
                    <span>₦1,500</span>
                  </div>
                  <div className="flex justify-between font-bold text-text1 text-lg pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>₦47,000</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="shadow-md">
              <h2 className="text-xl font-bold text-text1 mb-4">
                Payment Method
              </h2>
              <Radio.Group
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <Radio.Button
                  value="card"
                  className="w-full h-auto p-4 border-2 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircleOutlined className="text-app_secondary" />
                    <span className="font-semibold">Pay with Card</span>
                  </div>
                </Radio.Button>
              </Radio.Group>
            </Card>

            {/* Complete Order Button */}
            <Button
              type="primary"
              size="large"
              block
              onClick={handleCompleteOrder}
              className="bg-app_secondary border-app_secondary h-12 text-lg font-semibold"
            >
              Complete Order
            </Button>

            <p className="text-xs text-text2 text-center">
              By completing this order, you agree to our Terms of Service and
              Privacy Policy
            </p>
          </div>
        </div>
      </div>

      {/* Add/Edit Address Modal */}
      <Modal
        title={editingAddress ? "Edit Address" : "Add New Address"}
        open={isAddAddressModalOpen}
        onCancel={() => {
          setIsAddAddressModalOpen(false);
          setEditingAddress(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
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
          <Form.Item
            name="instructions"
            label="Delivery Instructions (Optional)"
          >
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

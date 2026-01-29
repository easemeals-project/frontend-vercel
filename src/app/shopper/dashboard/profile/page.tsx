"use client";

import { useState, useEffect } from "react";
import {
  BellOutlined,
  MenuOutlined,
  DownloadOutlined,
  ReloadOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import { Card, Input, Switch, Button, Form, message } from "antd";
import Sidebar from "../_components/Sidebar";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_MY_PROFILE, GET_NOTIFICATIONS } from "@/graphql/queries";
import {
  UPDATE_PROFILE,
  SET_NOTIFICATION_PREFERENCES,
  UPLOAD_PROFILE_PICTURE,
} from "@/graphql/mutations";
import {
  Address,
  GetNotificationsResult,
  GetMyProfileResult,
  UpdateProfileResult,
  UpdateProfileVariables,
  SetNotificationPreferencesResult,
  SetNotificationPreferencesVariables,
  UploadProfilePictureResult,
  UploadProfilePictureVariables,
} from "@/lib/types";
import { FiLogOut, FiShield } from "react-icons/fi";
import { MdOutlinePayment } from "react-icons/md";

const MAX_ADDRESSES = 3;

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form] = Form.useForm();
  const [addressForm] = Form.useForm();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // GraphQL Hooks
  const {
    data: profileData,
    loading: profileLoading,
    refetch: refetchProfile,
  } = useQuery<GetMyProfileResult>(GET_MY_PROFILE);
  const { data: notificationData, loading: notificationLoading } =
    useQuery<GetNotificationsResult>(GET_NOTIFICATIONS);

  const [updateProfile, { loading: updatingProfile }] = useMutation<
    UpdateProfileResult,
    UpdateProfileVariables
  >(UPDATE_PROFILE);
  const [setNotificationPreferences] = useMutation<
    SetNotificationPreferencesResult,
    SetNotificationPreferencesVariables
  >(SET_NOTIFICATION_PREFERENCES);
  const [uploadProfilePicture] = useMutation<
    UploadProfilePictureResult,
    UploadProfilePictureVariables
  >(UPLOAD_PROFILE_PICTURE);

  // Local state for notifications (synced with API)
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);

  useEffect(() => {
    if (profileData?.myProfile) {
      form.setFieldsValue({
        fullName: profileData.myProfile.name,
        email: profileData.myProfile.email,
        phoneNumber: profileData.myProfile.phone,
        deliveryAddress: profileData.myProfile.deliveryAddress,
      });
    }
  }, [profileData, form]);

  useEffect(() => {
    if (notificationData?.myNotificationPreferences) {
      setPushNotifications(
        notificationData.myNotificationPreferences.pushNotifications
      );
      setEmailUpdates(notificationData.myNotificationPreferences.emailUpdates);
      setOrderUpdates(notificationData.myNotificationPreferences.orderUpdates);
    }
  }, [notificationData]);

  // Address logic (keeping local for now as no API endpoint was found for addresses specifically)
  useEffect(() => {
    const savedAddresses = localStorage.getItem("userAddresses");
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    }
  }, []);

  const handleUpdateProfile = async (values: any) => {
    try {
      await updateProfile({
        variables: {
          input: {
            name: values.fullName,
            email: values.email,
            phone: values.phoneNumber,
            deliveryAddress: values.deliveryAddress,
          },
        },
      });
      message.success("Profile updated successfully");
      refetchProfile();
    } catch (error: any) {
      message.error("Failed to update profile: " + error.message);
    }
  };

  const handleNotificationChange = async (type: string, value: boolean) => {
    // Optimistic update
    if (type === "push") setPushNotifications(value);
    if (type === "email") setEmailUpdates(value);
    if (type === "order") setOrderUpdates(value);

    try {
      await setNotificationPreferences({
        variables: {
          input: {
            pushNotifications: type === "push" ? value : pushNotifications,
            emailUpdates: type === "email" ? value : emailUpdates,
            orderUpdates: type === "order" ? value : orderUpdates,
          },
        },
      });
      message.success("Preferences updated");
    } catch (error: any) {
      message.error("Failed to update preferences");
      // Revert on error
      if (type === "push") setPushNotifications(!value);
      if (type === "email") setEmailUpdates(!value);
      if (type === "order") setOrderUpdates(!value);
    }
  };

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

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white sticky shadow-sm p-4 lg:p-6">
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
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="flex flex-col max-w-4xl mx-auto gap-6">
            {/* User Profile Summary  */}
            <Card className="shadow-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative">
                  {profileData?.myProfile?.pictureURL ? (
                    <img
                      src={profileData.myProfile.pictureURL}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-app_secondary flex items-center justify-center text-2xl font-bold text-white">
                      {profileData?.myProfile?.name
                        ?.substring(0, 2)
                        .toUpperCase() || "JD"}
                    </div>
                  )}
                  <input
                    type="file"
                    id="profile-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      try {
                        await uploadProfilePicture({
                          variables: { file },
                        });
                        message.success("Profile picture updated");
                        refetchProfile();
                      } catch (error: any) {
                        message.error(
                          "Failed to upload profile picture: " + error.message
                        );
                      }
                    }}
                  />
                  <label
                    htmlFor="profile-upload"
                    className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <CameraOutlined className="text-text1" />
                  </label>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-text1 mb-1">
                    {profileData?.myProfile?.name || "User"}
                  </h2>
                  <p className="text-text2 mb-4">
                    {profileData?.myProfile?.email}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-green-50 px-4 py-2 rounded-lg">
                      <p className="text-sm text-text2">Total Orders</p>
                      <p className="text-lg font-bold text-text1">0</p>
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
              <Form
                form={form}
                layout="vertical"
                onFinish={handleUpdateProfile}
              >
                <Form.Item name="fullName" label="Full Name">
                  <Input />
                </Form.Item>
                <Form.Item name="email" label="Email Address">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="phoneNumber" label="Phone Number">
                  <Input />
                </Form.Item>
                <Form.Item name="deliveryAddress" label="Delivery Address">
                  <Input />
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={updatingProfile}
                  className="bg-app_secondary! border-app_secondary mt-4"
                >
                  Save Changes
                </Button>
              </Form>
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
                    onChange={(checked: boolean) =>
                      handleNotificationChange("push", checked)
                    }
                    className="bg-app_secondary!"
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
                    onChange={(checked: boolean) =>
                      handleNotificationChange("email", checked)
                    }
                    className="bg-app_secondary!"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BellOutlined className="text-text2" />
                    <div>
                      <div className="font-semibold text-text1">
                        Order Updates
                      </div>
                      <div className="text-sm text-text2">
                        Get notified about order status changes
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={orderUpdates}
                    onChange={(checked: boolean) =>
                      handleNotificationChange("order", checked)
                    }
                    className="bg-app_secondary!"
                  />
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-md">
              <h2 className="text-xl font-bold text-text1 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-4">
                <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 rounded-lg ring-2 ring-gray-100 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FiShield className="text-blue-600! size-5" />
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
                <button className="w-full flex items-center ring-2 ring-gray-100 gap-3 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <MdOutlinePayment className="text-green-600! size-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-text1">
                      Payment Methods
                    </div>
                    <div className="text-sm text-text2">
                      Manage your payment options
                    </div>
                  </div>
                </button>
                <button className="w-full flex items-center ring-2 ring-gray-100 gap-3 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <FiLogOut className="text-red-600! size-5" />
                  </div>
                  <div className="flex-1 text-left text-red-500">
                    <div className="font-semibold text-text1">Log Out</div>
                    <div className="text-sm text-text2">
                      Sign out of your account
                    </div>
                  </div>
                </button>
              </div>
            </Card>
          </div>
        </main>
      </div>

      {/* Add/Edit Address Modal */}
      {/* <Modal
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
      </Modal> */}
    </div>
  );
}

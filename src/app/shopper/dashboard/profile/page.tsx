"use client";

import { useState, useEffect } from "react";
import {
  BellOutlined,
  MenuOutlined,
  DownloadOutlined,
  ReloadOutlined,
  CameraOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { AutoComplete, Input, Switch, Button, Form, message, Modal, List, Tag, Space, Popconfirm } from "antd";
import Sidebar from "../_components/Sidebar";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client/react";
import { GET_MY_PROFILE, GET_NOTIFICATIONS, SEARCH_ADDRESSES, REVERSE_GEOCODE, GEOCODE_ADDRESS } from "@/graphql/queries";
import {
  UPDATE_PROFILE,
  SET_NOTIFICATION_PREFERENCES,
  UPLOAD_PROFILE_PICTURE,
  ADD_ADDRESS,
  UPDATE_ADDRESS,
  DELETE_ADDRESS,
  SET_DEFAULT_ADDRESS
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
  AddAddressVariables,
  AddAddressResult,
  UpdateAddressVariables,
  UpdateAddressResult,
  DeleteAddressVariables,
  DeleteAddressResult,
  SetDefaultAddressVariables,
  SetDefaultAddressResult,
  SearchAddressesResult,
  SearchAddressesVariables,
  ReverseGeocodeResult,
  ReverseGeocodeVariables,
  GeocodeAddressResult,
  GeocodeAddressVariables
} from "@/lib/types";
import { FiLogOut, FiShield } from "react-icons/fi";
import { MdOutlinePayment } from "react-icons/md";

const MAX_ADDRESSES = 5;

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form] = Form.useForm();
  const [addressForm] = Form.useForm();

  // State
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [localAddressLoading, setLocalAddressLoading] = useState(false);
  const [addressSearchOptions, setAddressSearchOptions] = useState<{ value: string }[]>([]);

  // GraphQL Hooks
  const {
    data: profileData,
    loading: profileLoading,
    refetch: refetchProfile,
  } = useQuery<GetMyProfileResult>(GET_MY_PROFILE);
  const { data: notificationData } = useQuery<GetNotificationsResult>(GET_NOTIFICATIONS);

  const [updateProfile, { loading: updatingProfile }] = useMutation<UpdateProfileResult, UpdateProfileVariables>(UPDATE_PROFILE);
  const [setNotificationPreferences] = useMutation<SetNotificationPreferencesResult, SetNotificationPreferencesVariables>(SET_NOTIFICATION_PREFERENCES);
  const [uploadProfilePicture] = useMutation<UploadProfilePictureResult, UploadProfilePictureVariables>(UPLOAD_PROFILE_PICTURE);

  // Address Mutations
  const [addAddress, { loading: addingAddress }] = useMutation<AddAddressResult, AddAddressVariables>(ADD_ADDRESS);
  const [updateAddress, { loading: updatingAddress }] = useMutation<UpdateAddressResult, UpdateAddressVariables>(UPDATE_ADDRESS);
  const [deleteAddress] = useMutation<DeleteAddressResult, DeleteAddressVariables>(DELETE_ADDRESS);
  const [setDefaultAddress] = useMutation<SetDefaultAddressResult, SetDefaultAddressVariables>(SET_DEFAULT_ADDRESS);

  // Geocode Queries
  const [searchAddresses] = useLazyQuery<SearchAddressesResult, SearchAddressesVariables>(SEARCH_ADDRESSES);
  const [reverseGeocode] = useLazyQuery<ReverseGeocodeResult, ReverseGeocodeVariables>(REVERSE_GEOCODE);
  const [geocodeAddress] = useLazyQuery<GeocodeAddressResult, GeocodeAddressVariables>(GEOCODE_ADDRESS);

  // Notification State
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);

  useEffect(() => {
    if (profileData?.myProfile) {
      form.setFieldsValue({
        fullName: profileData.myProfile.name,
        email: profileData.myProfile.email,
        phoneNumber: profileData.myProfile.phone,
      });
    }
  }, [profileData, form]);

  useEffect(() => {
    if (notificationData?.myNotificationPreferences) {
      setPushNotifications(notificationData.myNotificationPreferences.pushNotifications);
      setEmailUpdates(notificationData.myNotificationPreferences.emailUpdates);
      setOrderUpdates(notificationData.myNotificationPreferences.orderUpdates);
    }
  }, [notificationData]);

  const handleUpdateProfile = async (values: any) => {
    try {
      await updateProfile({
        variables: {
          input: {
            name: values.fullName,
            email: values.email,
            phone: values.phoneNumber,
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
      // Revert logic omitted for brevity
    }
  };

  // Address Handlers
  const handleAddAddress = async (values: any) => {
    try {
      await addAddress({
        variables: {
          input: {
            label: values.label,
            fullAddress: values.fullAddress,
            latitude: values.latitude ? parseFloat(values.latitude) : undefined,
            longitude: values.longitude ? parseFloat(values.longitude) : undefined,
            isDefault: values.isDefault
          }
        }
      });
      message.success("Address added");
      setIsAddAddressModalOpen(false);
      addressForm.resetFields();
      refetchProfile();
    } catch (error: any) {
      message.error("Failed to add address: " + error.message);
    }
  };

  const handleEditAddress = async (values: any) => {
    if (!editingAddress) return;
    try {
      await updateAddress({
        variables: {
          id: editingAddress.id,
          input: {
            label: values.label,
            fullAddress: values.fullAddress,
            latitude: values.latitude ? parseFloat(values.latitude) : undefined,
            longitude: values.longitude ? parseFloat(values.longitude) : undefined,
            isDefault: values.isDefault
          }
        }
      });
      message.success("Address updated");
      setEditingAddress(null);
      setIsAddAddressModalOpen(false);
      addressForm.resetFields();
      refetchProfile();
    } catch (error: any) {
      message.error("Failed to update address: " + error.message);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await deleteAddress({ variables: { id } });
      message.success("Address deleted");
      refetchProfile();
    } catch (error: any) {
      message.error("Failed to delete address: " + error.message);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress({ variables: { id } });
      message.success("Default address updated");
      refetchProfile();
    } catch (error: any) {
      message.error("Failed to set default address: " + error.message);
    }
  };

  const handleSearchAddress = async (searchText: string) => {
    if (!searchText || searchText.length < 3) {
      setAddressSearchOptions([]);
      return;
    }
    try {
      const { data } = await searchAddresses({ variables: { query: searchText } });
      if (data?.searchAddresses) {
        setAddressSearchOptions(data.searchAddresses.map((addr: string) => ({ value: addr })));
      }
    } catch (err) {
      console.error("Address search failed", err);
    }
  };

  const handleAddressSelect = async (address: string) => {
    try {
      const { data } = await geocodeAddress({ variables: { address } });
      if (data?.geocodeAddress) {
        addressForm.setFieldsValue({
          latitude: data.geocodeAddress.latitude,
          longitude: data.geocodeAddress.longitude
        });
      }
    } catch (err) {
      console.error("Geocoding failed", err);
    }
  };

  const handleUseCurrentLocation = () => {
    setLocalAddressLoading(true);
    if (!navigator.geolocation) {
      message.error("Geolocation is not supported by your browser");
      setLocalAddressLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const { data } = await reverseGeocode({ variables: { lat: latitude, lon: longitude } });
          const readableAddress = data?.reverseGeocode || `Lat: ${latitude.toFixed(6)}, Long: ${longitude.toFixed(6)}`;

          addressForm.setFieldsValue({
            latitude,
            longitude,
            fullAddress: readableAddress
          });
          message.success("Location fetched: " + (data?.reverseGeocode ? "Address resolved" : "Coordinates only"));
        } catch (err) {
          addressForm.setFieldsValue({
            latitude,
            longitude,
            fullAddress: `Lat: ${latitude.toFixed(6)}, Long: ${longitude.toFixed(6)}`
          });
          message.warning("Location fetched, but address could not be resolved");
        } finally {
          setLocalAddressLoading(false);
        }
      },
      (error) => {
        message.error("Unable to retrieve location: " + error.message);
        setLocalAddressLoading(false);
      }
    );
  };

  const openAddModal = () => {
    setEditingAddress(null);
    addressForm.resetFields();
    setIsAddAddressModalOpen(true);
  };

  const openEditModal = (addr: Address) => {
    setEditingAddress(addr);
    addressForm.setFieldsValue({
      label: addr.label,
      fullAddress: addr.fullAddress,
      latitude: addr.latitude,
      longitude: addr.longitude,
      isDefault: addr.isDefault
    });
    setIsAddAddressModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-app_bg flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white sticky shadow-sm p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-text1">
                <MenuOutlined className="text-xl" />
              </button>
              <h1 className="text-2xl font-bold text-text1">Profile</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-text2 hover:text-text1"><DownloadOutlined className="text-xl" /></button>
              <button className="text-text2 hover:text-text1"><ReloadOutlined className="text-xl" /></button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="flex flex-col max-w-4xl mx-auto gap-6">

            {/* Profile Summary & Picture Upload */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100/50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative">
                  {profileData?.myProfile?.pictureURL ? (
                    <img src={profileData.myProfile.pictureURL} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-app_secondary flex items-center justify-center text-2xl font-bold text-white">
                      {profileData?.myProfile?.name?.substring(0, 2).toUpperCase() || "JD"}
                    </div>
                  )}
                  <input type="file" id="profile-upload" className="hidden" accept="image/*" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      await uploadProfilePicture({ variables: { file } });
                      message.success("Profile picture updated");
                      refetchProfile();
                    } catch (error: any) {
                      message.error("Failed to upload: " + error.message);
                    }
                  }} />
                  <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-50 transition-colors">
                    <CameraOutlined className="text-text1" />
                  </label>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-text1 mb-1">{profileData?.myProfile?.name || "User"}</h2>
                  <p className="text-text2 mb-4">{profileData?.myProfile?.email}</p>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-green-50 px-4 py-2 rounded-lg">
                      <p className="text-sm text-text2">Total Orders</p>
                      <p className="text-lg font-bold text-text1">{profileData?.myProfile?.totalOrders || 0}</p>
                    </div>
                    <div className="bg-orange-50 px-4 py-2 rounded-lg">
                      <p className="text-sm text-text2">Member Since</p>
                      <p className="text-lg font-bold text-text1">{profileData?.myProfile?.memberSince}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100/50">
              <h2 className="text-xl font-bold text-text1 mb-4">Personal Information</h2>
              <Form form={form} layout="vertical" onFinish={handleUpdateProfile}>
                <Form.Item name="fullName" label="Full Name"><Input /></Form.Item>
                <Form.Item name="email" label="Email Address"><Input disabled /></Form.Item>
                <Form.Item name="phoneNumber" label="Phone Number"><Input /></Form.Item>
                <Button type="primary" htmlType="submit" loading={updatingProfile} className="bg-app_secondary! border-app_secondary mt-4">Save Changes</Button>
              </Form>
            </div>

            {/* Address Management */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100/50">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-text1">Addresses</h2>
                <Button type="dashed" icon={<PlusOutlined />} onClick={openAddModal}>Add New</Button>
              </div>

              <List
                itemLayout="horizontal"
                loading={profileLoading}
                dataSource={profileData?.myProfile?.addresses || []}
                renderItem={(item: Address) => (
                  <List.Item
                    actions={[
                      <Button key="edit" type="text" icon={<EditOutlined />} onClick={() => openEditModal(item)} />,
                      <Popconfirm key="del" title="Delete address?" onConfirm={() => handleDeleteAddress(item.id)}>
                        <Button type="text" danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<EnvironmentOutlined className="text-2xl text-app_secondary" />}
                      title={
                        <Space>
                          <span className="font-semibold">{item.label || "Address"}</span>
                          {item.isDefault && <Tag color="green">Default</Tag>}
                          {!item.isDefault && (
                            <Button type="link" size="small" onClick={() => handleSetDefault(item.id)}>Set Default</Button>
                          )}
                        </Space>
                      }
                      description={item.fullAddress}
                    />
                  </List.Item>
                )}
              />
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100/50">
              <h2 className="text-xl font-bold text-text1 mb-4">Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3"><BellOutlined className="text-text2" /><div><div className="font-semibold text-text1">Push Notifications</div><div className="text-sm text-text2">Receive notifications about your orders</div></div></div>
                  <Switch checked={pushNotifications} onChange={(v: boolean) => handleNotificationChange("push", v)} className="bg-app_secondary!" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3"><BellOutlined className="text-text2" /><div><div className="font-semibold text-text1">Email Updates</div><div className="text-sm text-text2">Receive promotional emails</div></div></div>
                  <Switch checked={emailUpdates} onChange={(v: boolean) => handleNotificationChange("email", v)} className="bg-app_secondary!" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3"><BellOutlined className="text-text2" /><div><div className="font-semibold text-text1">Order Updates</div><div className="text-sm text-text2">Get notified about status changes</div></div></div>
                  <Switch checked={orderUpdates} onChange={(v: boolean) => handleNotificationChange("order", v)} className="bg-app_secondary!" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100/50">
              <h2 className="text-xl font-bold text-text1 mb-4">Quick Actions</h2>
              <div className="space-y-4">
                <button disabled className="w-full flex items-center gap-3 p-4 bg-gray-50/50 cursor-not-allowed rounded-lg ring-2 ring-gray-100 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"><FiShield className="text-blue-600! size-5" /></div>
                  <div className="text-left flex-1"><div className="font-semibold text-text1">Privacy & Security</div><div className="text-sm text-text2">Manage settings</div></div>
                  <Tag color="orange">Coming Soon</Tag>
                </button>
                <button disabled className="w-full flex items-center ring-2 ring-gray-100 bg-gray-50/50 cursor-not-allowed gap-3 p-4 rounded-lg transition-colors">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center"><MdOutlinePayment className="text-green-600! size-5" /></div>
                  <div className="text-left flex-1"><div className="font-semibold text-text1">Payment Methods</div><div className="text-sm text-text2">Manage options</div></div>
                  <Tag color="orange">Coming Soon</Tag>
                </button>
                <button className="w-full flex items-center ring-2 ring-gray-100 gap-3 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"><FiLogOut className="text-red-600! size-5" /></div>
                  <div className="text-left text-red-500"><div className="font-semibold text-text1">Log Out</div><div className="text-sm text-text2">Sign out</div></div>
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>

      <Modal
        title={editingAddress ? "Edit Address" : "Add New Address"}
        open={isAddAddressModalOpen}
        onCancel={() => setIsAddAddressModalOpen(false)}
        footer={null}
      >
        <Form form={addressForm} layout="vertical" onFinish={editingAddress ? handleEditAddress : handleAddAddress}>
          <Form.Item name="label" label="Label (e.g. Home, Work)" rules={[{ required: true }]}>
            <Input placeholder="Home" />
          </Form.Item>
          <Form.Item name="fullAddress" label="Address" rules={[{ required: true }]}>
            <AutoComplete
              options={addressSearchOptions}
              onSearch={handleSearchAddress}
              onSelect={handleAddressSelect}
              placeholder="123 Main St..."
            >
              <Input.TextArea rows={3} />
            </AutoComplete>
          </Form.Item>
          <div className="flex gap-4 mb-4">
            <Form.Item name="latitude" label="Latitude" className="w-1/2">
              <Input disabled />
            </Form.Item>
            <Form.Item name="longitude" label="Longitude" className="w-1/2">
              <Input disabled />
            </Form.Item>
          </div>

          <Button icon={<EnvironmentOutlined />} onClick={handleUseCurrentLocation} loading={localAddressLoading} className="mb-4 w-full">
            Use Current Location
          </Button>

          <Form.Item name="isDefault" valuePropName="checked">
            <Switch checkedChildren="Default" unCheckedChildren="Standard" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={addingAddress || updatingAddress} block className="bg-app_secondary! border-app_secondary">
            {editingAddress ? "Update Address" : "Add Address"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
}

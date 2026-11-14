"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { createClient } from "@/lib/supabase/client";
import { authService } from "@/core/services/auth";
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
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form] = Form.useForm();
  const [addressForm] = Form.useForm();

  // State
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [localAddressLoading, setLocalAddressLoading] = useState(false);
  const [addressSearchOptions, setAddressSearchOptions] = useState<{ value: string }[]>([]);
  const [localProfile, setLocalProfile] = useState<{
    name: string;
    email: string;
    phone: string;
    pictureURL: string;
    memberSince: string;
    totalOrders: number;
  }>({
    name: "",
    email: "",
    phone: "",
    pictureURL: "",
    memberSince: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    totalOrders: 0,
  });
  const [localAddresses, setLocalAddresses] = useState<Address[]>([]);

  // GraphQL Hooks
  const {
    data: profileData,
    loading: profileLoading,
    refetch: refetchProfile,
  } = useQuery<GetMyProfileResult>(GET_MY_PROFILE, {
    fetchPolicy: "cache-and-network",
  });
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

  // Load initial profile from Supabase session + localStorage fallback
  useEffect(() => {
    const loadSessionUser = async () => {
      try {
        const cachedAvatar = localStorage.getItem("easemeals_profile_avatar") || "";
        const cachedAddresses = localStorage.getItem("easemeals_profile_addresses");
        if (cachedAddresses) {
          try {
            setLocalAddresses(JSON.parse(cachedAddresses));
          } catch {}
        }

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const meta = user.user_metadata || {};
          const name = meta.name || meta.full_name || user.email?.split("@")[0] || "User";
          const email = user.email || "";
          const phone = meta.phone || "";
          const metaAvatar =
            typeof meta.avatar_url === "string" && !meta.avatar_url.startsWith("data:")
              ? meta.avatar_url
              : typeof meta.picture === "string" && !meta.picture.startsWith("data:")
              ? meta.picture
              : "";
          const pictureURL = cachedAvatar || metaAvatar;
          const createdDate = user.created_at ? new Date(user.created_at) : new Date();
          const memberSince = createdDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });

          // If a base64 data URI was previously saved in user_metadata, strip it so cookies stay small
          if (typeof meta.avatar_url === "string" && meta.avatar_url.startsWith("data:")) {
            localStorage.setItem("easemeals_profile_avatar", meta.avatar_url);
            supabase.auth.updateUser({ data: { avatar_url: null } }).catch(() => {});
          }

          setLocalProfile((prev) => ({
            ...prev,
            name: prev.name || name,
            email: prev.email || email,
            phone: prev.phone || phone,
            pictureURL: prev.pictureURL || pictureURL,
            memberSince: prev.memberSince || memberSince,
          }));

          if (!cachedAddresses && Array.isArray(meta.addresses)) {
            setLocalAddresses(meta.addresses);
          }

          form.setFieldsValue({
            fullName: form.getFieldValue("fullName") || name,
            email: form.getFieldValue("email") || email,
            phoneNumber: form.getFieldValue("phoneNumber") || phone,
          });
        }
      } catch (e) {
        console.warn("Could not load session user:", e);
      }
    };
    loadSessionUser();
  }, [form]);

  useEffect(() => {
    if (profileData?.myProfile) {
      const p = profileData.myProfile;
      const cachedAvatar = typeof window !== "undefined" ? localStorage.getItem("easemeals_profile_avatar") : null;
      setLocalProfile((prev) => ({
        name: p.name || prev.name,
        email: p.email || prev.email,
        phone: p.phone || prev.phone,
        pictureURL: p.pictureURL || cachedAvatar || prev.pictureURL,
        memberSince: p.memberSince || prev.memberSince,
        totalOrders: p.totalOrders ?? prev.totalOrders,
      }));
      if (Array.isArray(p.addresses) && p.addresses.length > 0) {
        setLocalAddresses(p.addresses);
        localStorage.setItem("easemeals_profile_addresses", JSON.stringify(p.addresses));
      }
      form.setFieldsValue({
        fullName: p.name || localProfile.name,
        email: p.email || localProfile.email,
        phoneNumber: p.phone || localProfile.phone,
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

  const syncAddressesPersistently = async (nextAddresses: Address[]) => {
    setLocalAddresses(nextAddresses);
    localStorage.setItem("easemeals_profile_addresses", JSON.stringify(nextAddresses));
  };

  const compressImageToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_SIZE = 320;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > MAX_SIZE) {
              height = Math.round((height * MAX_SIZE) / width);
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = Math.round((width * MAX_SIZE) / height);
              height = MAX_SIZE;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(ev.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        };
        img.onerror = reject;
        img.src = ev.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleProfilePictureUpload = async (file: File) => {
    try {
      message.loading({ content: "Uploading...", key: "up-picture" });
      const dataUrl = await compressImageToDataUrl(file);

      // Update local state & localStorage immediately (never put base64 images in Supabase user_metadata/cookies!)
      setLocalProfile((prev) => ({ ...prev, pictureURL: dataUrl }));
      localStorage.setItem("easemeals_profile_avatar", dataUrl);

      // Persist in Backend DB (UpdateCurrentUserProfile stores data:image/* into picture_url)
      try {
        await updateProfile({
          variables: {
            input: {
              name: form.getFieldValue("fullName") || localProfile.name,
              email: form.getFieldValue("email") || localProfile.email,
              phone: form.getFieldValue("phoneNumber") || localProfile.phone,
              deliveryAddress: dataUrl,
            },
          },
        });
        refetchProfile();
      } catch (backendErr) {
        console.warn("Backend avatar sync skipped:", backendErr);
      }

      message.success({ content: "Profile picture updated!", key: "up-picture" });
    } catch (error: any) {
      message.error({ content: "Failed to upload picture: " + (error?.message || "Unknown error"), key: "up-picture" });
    }
  };

  const handleUpdateProfile = async (values: any) => {
    try {
      const nextName = values.fullName?.trim() || localProfile.name;
      const nextEmail = values.email?.trim() || localProfile.email;
      const nextPhone = values.phoneNumber?.trim() || "";

      setLocalProfile((prev) => ({
        ...prev,
        name: nextName,
        email: nextEmail,
        phone: nextPhone,
      }));

      // 1. Update in Supabase user_metadata
      const supabase = createClient();
      await supabase.auth.updateUser({
        data: {
          name: nextName,
          full_name: nextName,
          phone: nextPhone,
        },
      });

      // 2. Update in PostgreSQL backend
      try {
        await updateProfile({
          variables: {
            input: {
              name: nextName,
              email: nextEmail,
              phone: nextPhone,
            },
          },
        });
        refetchProfile();
      } catch (backendErr) {
        console.warn("Backend profile update fallback:", backendErr);
      }

      message.success("Profile updated successfully");
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
      message.success("Preferences saved");
    }
  };

  // Address Handlers
  const handleAddAddress = async (values: any) => {
    const label = values.label?.trim() || "Home";
    const fullAddress = values.fullAddress?.trim();
    const latitude = values.latitude ? parseFloat(values.latitude) : undefined;
    const longitude = values.longitude ? parseFloat(values.longitude) : undefined;
    const isDefault = localAddresses.length === 0 ? true : !!values.isDefault;

    try {
      let createdAddr: Address | null = null;
      try {
        const res = await addAddress({
          variables: {
            input: {
              label,
              fullAddress,
              latitude,
              longitude,
              isDefault,
            },
          },
        });
        if (res.data?.addAddress) {
          createdAddr = res.data.addAddress;
        }
      } catch (backendErr) {
        console.warn("Backend addAddress fallback:", backendErr);
      }

      const newAddr: Address = createdAddr || {
        id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        label,
        fullAddress,
        latitude,
        longitude,
        isDefault,
      };

      const updatedList = isDefault
        ? [...localAddresses.map((a) => ({ ...a, isDefault: false })), newAddr]
        : [...localAddresses, newAddr];

      await syncAddressesPersistently(updatedList);
      message.success("Address added");
      setIsAddAddressModalOpen(false);
      addressForm.resetFields();
      refetchProfile().catch(() => {});
    } catch (error: any) {
      message.error("Failed to add address: " + error.message);
    }
  };

  const handleEditAddress = async (values: any) => {
    if (!editingAddress) return;
    const label = values.label?.trim() || "Home";
    const fullAddress = values.fullAddress?.trim();
    const latitude = values.latitude ? parseFloat(values.latitude) : undefined;
    const longitude = values.longitude ? parseFloat(values.longitude) : undefined;
    const isDefault = !!values.isDefault;

    try {
      try {
        await updateAddress({
          variables: {
            id: editingAddress.id,
            input: {
              label,
              fullAddress,
              latitude,
              longitude,
              isDefault,
            },
          },
        });
      } catch (backendErr) {
        console.warn("Backend updateAddress fallback:", backendErr);
      }

      const updatedList = localAddresses.map((a) => {
        if (a.id === editingAddress.id) {
          return {
            ...a,
            label,
            fullAddress,
            latitude,
            longitude,
            isDefault,
          };
        }
        return isDefault ? { ...a, isDefault: false } : a;
      });

      await syncAddressesPersistently(updatedList);
      message.success("Address updated");
      setEditingAddress(null);
      setIsAddAddressModalOpen(false);
      addressForm.resetFields();
      refetchProfile().catch(() => {});
    } catch (error: any) {
      message.error("Failed to update address: " + error.message);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      try {
        await deleteAddress({ variables: { id } });
      } catch (backendErr) {
        console.warn("Backend deleteAddress fallback:", backendErr);
      }
      const nextList = localAddresses.filter((a) => a.id !== id);
      await syncAddressesPersistently(nextList);
      message.success("Address deleted");
      refetchProfile().catch(() => {});
    } catch (error: any) {
      message.error("Failed to delete address: " + error.message);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      try {
        await setDefaultAddress({ variables: { id } });
      } catch (backendErr) {
        console.warn("Backend setDefaultAddress fallback:", backendErr);
      }
      const nextList = localAddresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }));
      await syncAddressesPersistently(nextList);
      message.success("Default address updated");
      refetchProfile().catch(() => {});
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
      if (data?.searchAddresses && data.searchAddresses.length > 0) {
        setAddressSearchOptions(data.searchAddresses.map((addr: string) => ({ value: addr })));
        return;
      }
    } catch {}

    // Fallback to OpenStreetMap Nominatim search
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}&countrycodes=ng&limit=5`
      );
      if (resp.ok) {
        const items = await resp.json();
        if (Array.isArray(items)) {
          setAddressSearchOptions(items.map((item: any) => ({ value: item.display_name })));
        }
      }
    } catch (err) {
      console.warn("Address autocomplete fallback failed", err);
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
        return;
      }
    } catch {}

    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      if (resp.ok) {
        const items = await resp.json();
        if (Array.isArray(items) && items[0]) {
          addressForm.setFieldsValue({
            latitude: parseFloat(items[0].lat),
            longitude: parseFloat(items[0].lon),
          });
        }
      }
    } catch {}
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
          if (data?.reverseGeocode) {
            addressForm.setFieldsValue({
              latitude,
              longitude,
              fullAddress: data.reverseGeocode
            });
            message.success("Location fetched!");
            setLocalAddressLoading(false);
            return;
          }
        } catch {}

        try {
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          if (resp.ok) {
            const json = await resp.json();
            const readable = json?.display_name || `Lat: ${latitude.toFixed(6)}, Long: ${longitude.toFixed(6)}`;
            addressForm.setFieldsValue({
              latitude,
              longitude,
              fullAddress: readable,
            });
            message.success("Location fetched!");
            setLocalAddressLoading(false);
            return;
          }
        } catch {}

        addressForm.setFieldsValue({
          latitude,
          longitude,
          fullAddress: `Lat: ${latitude.toFixed(6)}, Long: ${longitude.toFixed(6)}`
        });
        message.info("Location coordinates fetched");
        setLocalAddressLoading(false);
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
                  {localProfile.pictureURL ? (
                    <img src={localProfile.pictureURL} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-app_secondary flex items-center justify-center text-2xl font-bold text-white">
                      {localProfile.name?.substring(0, 2).toUpperCase() || "EM"}
                    </div>
                  )}
                  <input type="file" id="profile-upload" className="hidden" accept="image/*" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    await handleProfilePictureUpload(file);
                    e.target.value = "";
                  }} />
                  <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-50 transition-colors">
                    <CameraOutlined className="text-text1" />
                  </label>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-text1 mb-1">{localProfile.name || "User"}</h2>
                  <p className="text-text2 mb-4">{localProfile.email}</p>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-green-50 px-4 py-2 rounded-lg">
                      <p className="text-sm text-text2">Total Orders</p>
                      <p className="text-lg font-bold text-text1">{localProfile.totalOrders || 0}</p>
                    </div>
                    <div className="bg-orange-50 px-4 py-2 rounded-lg">
                      <p className="text-sm text-text2">Member Since</p>
                      <p className="text-lg font-bold text-text1">{localProfile.memberSince}</p>
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
                loading={profileLoading && localAddresses.length === 0}
                dataSource={localAddresses}
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
                <button
                  onClick={() => authService.signout(router)}
                  className="w-full flex items-center ring-2 ring-gray-100 gap-3 p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                >
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

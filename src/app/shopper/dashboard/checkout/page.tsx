"use client";

import { useState, useEffect } from "react";
import { Card, Input, Button, message, DatePicker, Modal } from "antd";
import {
  ArrowLeftOutlined,
  CreditCardOutlined,
  CheckCircleFilled,
  DownloadOutlined,
  CompassOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import conts from "@/lib/conts";
import { Address } from "@/lib/types";
import { useMutation, useQuery } from "@apollo/client/react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { BROADCAST_TIMETABLE, SAVE_WEEKLY_MEAL_PLAN, TOP_UP_WALLET, PAY_WITH_WALLET } from "@/graphql/mutations";
import { GET_MY_WALLET } from "@/graphql/queries";
import { loadPaystackScript, initializePaystack } from "@/lib/paystack";
import {
  BroadcastTimetableResult,
  BroadcastTimetableVariables,
  WeeklyMealPlan,
  RAGDailyMealPlan,
  RAGMealComposition,
  RAGMealSlot,
  SaveWeeklyMealPlanResult,
  SaveWeeklyMealPlanVariables
} from "@/lib/types/graphql";
import MapSelector from "./_components/MapSelector";

const serviceOptions = [
  {
    id: "ingredients",
    title: "Only Ingredients",
    description: "Get all ingredients delivered to your doorstep",
  },
  {
    id: "vendors",
    title: "Food Vendors",
    description: "Order prepared meals from our partner restaurants",
  },
  {
    id: "chef_ingredients",
    title: "Ingredients + Chef",
    description: "Get ingredients and a chef to prepare your meals",
  },
  {
    id: "chef_only",
    title: "Chef Only",
    description: "Hire a chef to prepare meals with your own ingredients",
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [serviceOption, setServiceOption] = useState("ingredients");
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [isLoading, setIsLoading] = useState(true);
  const [timetable, setTimetable] = useState<WeeklyMealPlan | null>(null);

  const [broadcastOrder, { loading: isPlacingOrder }] = useMutation<
    BroadcastTimetableResult,
    BroadcastTimetableVariables
  >(BROADCAST_TIMETABLE);
  const [saveTimetable] = useMutation<
    SaveWeeklyMealPlanResult,
    SaveWeeklyMealPlanVariables
  >(SAVE_WEEKLY_MEAL_PLAN);

  // Form states
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [scheduledDate, setScheduledDate] = useState<any>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number, lng: number } | null>(null);

  // Wallet & Payment State
  const { data: walletData, refetch: refetchWallet } = useQuery<{ myWallet: { balance: number } }>(GET_MY_WALLET);
  const [topUpWallet] = useMutation(TOP_UP_WALLET);
  const [payWithWallet] = useMutation(PAY_WITH_WALLET);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(5000);
  const [isProcessingTopUp, setIsProcessingTopUp] = useState(false);

  const walletBalance = walletData?.myWallet?.balance || 0;

  useEffect(() => {
    const savedAddresses = localStorage.getItem("userAddresses");
    if (savedAddresses) {
      const parsed = JSON.parse(savedAddresses);
      setAddresses(parsed);
      if (parsed.length > 0) {
        const defaultAddr = parsed[0];
        setFullName(defaultAddr.fullName);
        setPhoneNumber(defaultAddr.phoneNumber);
        setDeliveryAddress(defaultAddr.address);
        setDeliveryInstructions(defaultAddr.instructions || "");
      }
    }

    const savedTimetable = sessionStorage.getItem("currentTimetable");
    if (savedTimetable) {
      setTimetable(JSON.parse(savedTimetable));
    } else {
      message.error("No active timetable found. Please generate one first.");
      router.push(conts.paths.timetable);
    }

    setIsLoading(false);
  }, []);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      message.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    message.loading({ content: "Getting your location...", key: "locating" });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });

        // Use Reverse Geocoding via Google Maps API
        if (window.google && window.google.maps.Geocoder) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results: any, status: any) => {
            setIsLocating(false);
            if (status === "OK" && results[0]) {
              setDeliveryAddress(results[0].formatted_address);
              message.success({ content: "Location captured and address resolved!", key: "locating" });
            } else {
              setDeliveryAddress(`Located at ${latitude.toFixed(4)}, ${longitude.toFixed(4)} (GPS captured)`);
              message.success({ content: "Location captured, but address resolution failed.", key: "locating" });
            }
          });
        } else {
          setIsLocating(false);
          setDeliveryAddress(`Located at ${latitude.toFixed(4)}, ${longitude.toFixed(4)} (GPS captured)`);
          message.success({ content: "Location captured successfully!", key: "locating" });
        }
      },
      (error) => {
        setIsLocating(false);
        message.error({ content: "Error getting location: " + error.message, key: "locating" });
      }
    );
  };

  const handleTopUp = async () => {
    const amountToTopUp = topUpAmount; // Capture current amount
    if (amountToTopUp <= 0) {
      message.error("Please enter a valid amount");
      return;
    }

    try {
      setIsProcessingTopUp(true);
      await loadPaystackScript();

      const reference = `TUP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      initializePaystack({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
        email: "shopper@easemeals.com", // In real app, use user.email
        amount: amountToTopUp,
        ref: reference,
        onSuccess: async (response) => {
          try {
            message.loading({ content: "Verifying payment...", key: "topup" });
            await topUpWallet({
              variables: {
                amount: amountToTopUp,
                reference: response.reference
              }
            });
            await refetchWallet();
            setIsTopUpModalOpen(false);
            setIsProcessingTopUp(false);
            message.success({ content: "Wallet topped up successfully!", key: "topup" });
          } catch (err: any) {
            setIsProcessingTopUp(false);
            message.error({ content: "Verification failed: " + err.message, key: "topup" });
          }
        },
        onCancel: () => {
          setIsProcessingTopUp(false);
          message.warning("Payment cancelled");
        }
      });
    } catch (err: any) {
      setIsProcessingTopUp(false);
      message.error("Could not initialize Paystack: " + err.message);
    }
  };

  const convertToInput = (plan: WeeklyMealPlan): SaveWeeklyMealPlanVariables["input"] => {
    const convertSlot = (slot: RAGMealSlot) => {
      if (!slot) return undefined;
      return {
        id: slot.id,
        name: slot.name,
        price: slot.price,
        category: slot.category,
        quantity: slot.quantity,
      };
    };

    const convertComposition = (comp: RAGMealComposition) => ({
      base: convertSlot(comp.base),
      protein: convertSlot(comp.protein),
      soup: convertSlot(comp.soup),
      sides: comp.sides?.filter((s): s is NonNullable<typeof s> => s !== null).map(s => ({
        id: s.id,
        name: s.name,
        price: s.price,
        category: s.category,
        quantity: s.quantity,
      })) || [],
    });

    const convertDay = (day: RAGDailyMealPlan) => ({
      breakfast: convertComposition(day.breakfast),
      lunch: convertComposition(day.lunch),
      dinner: convertComposition(day.dinner),
    });

    return {
      monday: convertDay(plan.monday),
      tuesday: convertDay(plan.tuesday),
      wednesday: convertDay(plan.wednesday),
      thursday: convertDay(plan.thursday),
      friday: convertDay(plan.friday),
      saturday: convertDay(plan.saturday),
      sunday: convertDay(plan.sunday),
      weeklyCost: plan.weeklyCost,
      budgetTier: plan.budgetTier,
    };
  };

  const handleDownload = async () => {
    console.log("Download triggered (Checkout)");
    const timetableElement = document.getElementById("order-summary-capture");
    if (!timetableElement) {
      console.error("Summary element not found");
      message.error("Could not find summary element. ID: order-summary-capture");
      return;
    }

    try {
      message.loading({ content: "Generating Summary PDF...", key: "downloading" });

      const canvas = await html2canvas(timetableElement, {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: "#ffffff",
        windowWidth: timetableElement.scrollWidth,
        windowHeight: timetableElement.scrollHeight
      });

      console.log("Canvas generated successfully (Checkout)");
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 portrait width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`EaseMeals-Order-Summary-${new Date().toISOString().split('T')[0]}.pdf`);

      message.success({ content: "Order summary downloaded!", key: "downloading" });
    } catch (error: any) {
      console.error("PDF generation failed", error);
      message.error({ content: "Download failed", key: "downloading" });
    }
  };

  const handlePlaceOrder = async () => {
    if (!timetable) return;
    if (!deliveryAddress) {
      message.error("Please enter a delivery address");
      return;
    }

    try {
      // Step 1: Save the meal plan to the database
      const saveResponse = await saveTimetable({
        variables: {
          input: {
            ...convertToInput(timetable),
            name: `Plan - ${new Date().toLocaleDateString()}`
          }
        }
      });

      if (!saveResponse.data?.saveWeeklyMealPlan.id) {
        throw new Error("Failed to save meal plan");
      }

      const timetableID = saveResponse.data.saveWeeklyMealPlan.id;

      // Step 2: Pay with Wallet
      const totalAmount = (timetable?.weeklyCost || 0) + 1500;
      if (walletBalance < totalAmount) {
        setIsTopUpModalOpen(true);
        throw new Error("Insufficient wallet balance. Please top up your wallet.");
      }

      message.loading({ content: "Processing payment...", key: "order" });
      await payWithWallet({
        variables: {
          amount: totalAmount,
          orderId: timetableID
        }
      });

      // Step 3: Broadcast the order
      // Use selected date or fallback to next Monday if none selected
      const deliveryDate = scheduledDate
        ? scheduledDate.toISOString()
        : new Date(new Date().setDate(new Date().getDate() + (1 + 7 - new Date().getDay()) % 7)).toISOString();

      await broadcastOrder({
        variables: {
          input: {
            timetableID: timetableID,
            deliveryDate: deliveryDate,
            deliveryAddress: deliveryAddress,
            notes: deliveryInstructions,
            expiresInHours: 24
          }
        }
      });

      message.success({ content: "Order placed successfully!", key: "order" });
      router.push(conts.paths.orderConfirmed);
    } catch (err: any) {
      if (err.message.includes("Insufficient")) {
        // Modal already handled
      } else {
        message.error("Failed to place order: " + err.message);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-app_bg font-sans flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-app_secondary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app_bg font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href={conts.paths.timetable}
            className="flex items-center gap-2 text-text2 hover:text-text1 transition-colors"
          >
            <ArrowLeftOutlined />
            <span>Back to Meal Plan</span>
          </Link>
          <h1 className="text-xl font-bold text-text1 absolute left-1/2 transform -translate-x-1/2">
            Checkout
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleDownload}
              className="text-text2 hover:text-text1 transition-colors p-2 rounded-full hover:bg-gray-100"
              title="Download Summary"
            >
              <DownloadOutlined className="text-xl" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="flex flex-col gap-4 lg:col-span-2 space-y-6">
            {/* Service Option */}
            <Card className="shadow-sm border-none rounded-xl">
              <h2 className="text-lg font-bold text-text1 mb-6">
                Select Service Option
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {serviceOptions.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => setServiceOption(option.id)}
                    className={`p-6 rounded-xl border cursor-pointer transition-all relative ${serviceOption === option.id
                      ? "border-green-500 bg-[#E8F5E9]"
                      : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-text1">{option.title}</h3>
                      {serviceOption === option.id ? (
                        <CheckCircleFilled className="text-app_secondary! text-xl" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                    <p className="text-sm text-text2">{option.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Delivery Information */}
            <Card className="shadow-sm border-none rounded-xl">
              <h2 className="text-lg font-bold text-text1 mb-6">
                Delivery Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text1 mb-2">
                    Full Name
                  </label>
                  <Input
                    className="h-12 rounded-lg border-gray-300"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text1 mb-2">
                    Phone Number
                  </label>
                  <Input
                    className="h-12 rounded-lg border-gray-300"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-text1">
                      Delivery Address
                    </label>
                    <div className="flex gap-2">
                      <Button
                        type="link"
                        size="small"
                        icon={<CompassOutlined />}
                        onClick={handleUseMyLocation}
                        loading={isLocating}
                        className="text-app_secondary text-xs p-0 h-auto"
                      >
                        Use My Location
                      </Button>
                      <Button
                        type="link"
                        size="small"
                        icon={<EnvironmentOutlined />}
                        onClick={() => setShowMapModal(true)}
                        className="text-app_secondary text-xs p-0 h-auto"
                      >
                        Select on Map
                      </Button>
                    </div>
                  </div>
                  <Input
                    className="h-12 rounded-lg border-gray-300"
                    placeholder="Enter your delivery address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                  {coordinates && (
                    <p className="mt-1 text-[10px] text-text2 italic">
                      GPS: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text1 mb-2">
                    Schedule Delivery Date
                  </label>
                  <DatePicker
                    className="h-12 w-full rounded-lg border-gray-300"
                    format="YYYY-MM-DD"
                    placeholder="Select delivery date (Default: Next Monday)"
                    onChange={(date) => setScheduledDate(date)}
                    disabledDate={(current) => current && current.valueOf() < Date.now()}
                  />
                  <p className="mt-1 text-[10px] text-text2">
                    Deliveries are usually made on Mondays for weekly plans, but you can request custom scheduling.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text1 mb-2">
                    Delivery Instructions (Optional)
                  </label>
                  <Input.TextArea
                    className="rounded-lg border-gray-300"
                    rows={4}
                    placeholder="Any special delivery instructions"
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1" id="order-summary-capture">
            <Card className="shadow-sm border-none rounded-xl sticky bg-white p-4">
              <div className="mb-4">
                <img src="/easemeals-logo.png" alt="EaseMeals" className="h-6 object-contain mb-2" />
                <h2 className="text-lg font-bold text-text1">Order Summary</h2>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-text2">Weekly Meal Plan</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text2">Days</span>
                  <span className="font-medium text-text1">7 days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text2">Total Meals</span>
                  <span className="font-medium text-text1">21 meals</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text2">Budget Tier</span>
                  <span className="font-medium text-text1">
                    {timetable?.budgetTier || "Standard"}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-8">
                <p className="text-xs text-text2 mb-3">Includes meals like:</p>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded bg-[#FFCCBC] flex items-center justify-center text-[#FF7043] text-xs">
                      🥣
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text1">
                        Monday Breakfast
                      </p>
                      <p className="text-xs text-text2">
                        Oat and Tiger Nuts Pap
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded bg-[#FFCCBC] flex items-center justify-center text-[#FF7043] text-xs">
                      🥗
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text1">
                        Wednesday Lunch
                      </p>
                      <p className="text-xs text-text2">
                        Beans and Vegetable Salad
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded bg-[#FFCCBC] flex items-center justify-center text-[#FF7043] text-xs">
                      🍲
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text1">
                        Friday Dinner
                      </p>
                      <p className="text-xs text-text2">Amala and Ewedu Soup</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text2">Meal Plan Cost</span>
                  <span className="font-medium text-text1">
                    ₦{timetable ? timetable.weeklyCost.toLocaleString() : "0"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text2">Delivery Fee</span>
                  <span className="font-medium text-text1">₦1,500</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-4">
                  <span className="text-text1">Total</span>
                  <span className="text-text1">
                    ₦{timetable ? (timetable.weeklyCost + 1500).toLocaleString() : "0"}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6 space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-text1">
                    EaseMeals Wallet
                  </label>
                  <span className={`text-sm font-bold ${walletBalance < (timetable?.weeklyCost || 0) + 1500 ? 'text-red-500' : 'text-green-600'}`}>
                    Balance: ₦{walletBalance.toLocaleString()}
                  </span>
                </div>

                <div
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === "wallet"
                    ? "border-app_secondary bg-app_secondary/5"
                    : "border-gray-200"
                    }`}
                  onClick={() => setPaymentMethod("wallet")}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircleFilled className={paymentMethod === "wallet" ? "text-app_secondary" : "text-gray-300"} />
                    <span className="font-medium text-text1">
                      Pay with Wallet
                    </span>
                  </div>
                  <Button
                    size="small"
                    type="link"
                    className="text-app_secondary font-bold p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsTopUpModalOpen(true);
                    }}
                  >
                    Top Up
                  </Button>
                </div>
              </div>

              <Button
                type="primary"
                size="large"
                block
                disabled={paymentMethod !== "wallet" || walletBalance < ((timetable?.weeklyCost || 0) + 1500)}
                loading={isPlacingOrder}
                onClick={handlePlaceOrder}
                className="bg-app_secondary! hover:bg-app_secondary/80! border-none h-12 text-lg font-bold rounded-lg disabled:bg-gray-200! disabled:text-gray-400!"
              >
                {walletBalance < ((timetable?.weeklyCost || 0) + 1500) ? "Insufficient Balance" : "Complete Order"}
              </Button>

              <p className="text-[10px] text-text2 text-center mt-4 px-4 leading-tight">
                By completing this order, you agree to our Terms of Service and
                Privacy Policy
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Map Selection Modal - Placeholder */}
      <Modal
        title="Select Location on Map"
        open={showMapModal}
        onCancel={() => setShowMapModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowMapModal(false)}>Cancel</Button>,
          <Button key="confirm" type="primary" className="bg-app_secondary! border-none text-white!" onClick={() => setShowMapModal(false)}>Confirm Selection</Button>
        ]}
      >
        <div className="h-80 my-4 border border-gray-200 rounded-lg overflow-hidden">
          <MapSelector
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
            initialCenter={coordinates || undefined}
            onLocationSelect={(address, lat, lng) => {
              setDeliveryAddress(address);
              setCoordinates({ lat, lng });
            }}
          />
        </div>
        <p className="text-xs text-text2 text-center mt-2 font-medium">
          {deliveryAddress ? `Selected: ${deliveryAddress}` : "Click/Drag the pin to select your address"}
        </p>
      </Modal>

      {/* Wallet Top-Up Modal */}
      <Modal
        title="Top Up EaseMeals Wallet"
        open={isTopUpModalOpen}
        onCancel={() => setIsTopUpModalOpen(false)}
        footer={null}
        width={400}
      >
        <div className="py-4 space-y-6">
          <div className="text-center">
            <p className="text-sm text-text2 mb-1">Current Balance</p>
            <p className="text-3xl font-bold text-text1">₦{walletBalance.toLocaleString()}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text1 mb-2">
              Amount to Top Up (₦)
            </label>
            <Input
              type="number"
              size="large"
              prefix="₦"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(Number(e.target.value))}
              className="rounded-lg h-12"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[2000, 5000, 10000, 20000].map((amt) => (
              <Button
                key={amt}
                onClick={() => setTopUpAmount(amt)}
                className={`h-12 rounded-lg ${topUpAmount === amt ? 'border-app_secondary text-app_secondary bg-app_secondary/5' : ''}`}
              >
                +₦{amt.toLocaleString()}
              </Button>
            ))}
          </div>

          <Button
            type="primary"
            size="large"
            block
            loading={isProcessingTopUp}
            onClick={handleTopUp}
            className="bg-app_secondary! border-none h-12 font-bold rounded-lg mt-4"
          >
            Pay with Paystack
          </Button>
          <div className="text-center">
            <p className="text-[10px] text-text3 mt-4">
              Secure payments powered by Paystack.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 grayscale opacity-50">
            <img src="/paystack-badge.png" alt="Secured by Paystack" className="h-4" />
          </div>
        </div>
      </Modal>
    </div>
  );
}

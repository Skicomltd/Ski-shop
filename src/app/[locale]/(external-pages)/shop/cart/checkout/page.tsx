/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Wrapper } from "@/components/core/layout/wrapper";
import SkiButton from "@/components/shared/button";
import { ReusableDialog } from "@/components/shared/dialog/Dialog";
import { FormField } from "@/components/shared/inputs/FormFields";
import { Locale } from "@/lib/i18n/config";
import { formatCurrency } from "@/lib/i18n/utils";
import { useAppService } from "@/services/externals/app/use-app-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { ProductBreadcrumb } from "../../../(home)/_components/product-breadcrumb";

interface CheckoutFormData {
  pickupStation: string;
  state: string;
}

interface AddressFormData {
  receiverName: string;
  streetAddress: string;
  townCity: string;
  state: string;
  phone: string;
  isDefault: boolean;
}

interface Address {
  id: string;
  receiverName: string;
  streetAddress: string;
  townCity: string;
  state: string;
  phone: string;
  isDefault: boolean;
}

const checkoutSchema = z.object({
  pickupStation: z.string().min(1, "Pickup station is required"),
  state: z.string().min(1, "State is required"),
});

const addressSchema = z.object({
  receiverName: z.string().min(1, "Receiver's name is required"),
  streetAddress: z.string().min(1, "Street address is required"),
  townCity: z.string().min(1, "Town/City is required"),
  state: z.string().min(1, "State is required"),
  phone: z.string().min(1, "Phone number is required"),
  isDefault: z.boolean().default(false),
});

const DEFAULT_PHONE = "081234567890";

// Pickup stations are loaded from API via services

// Addresses are loaded from API via services

const CheckoutPage = () => {
  const locale = useLocale();
  const { data: session } = useSession();
  const [paymentMethod, setPaymentMethod] = useState<"paystack" | "paymentOnDelivery">("paystack");
  const [deliveryMethod, setDeliveryMethod] = useState<"station" | "door">("station");
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [showAddressBookModal, setShowAddressBookModal] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [selectedStation, setSelectedStation] = useState<any | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [selectedStateForStation, setSelectedStateForStation] = useState<string>("");

  const methods = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      pickupStation: "",
      state: "",
    },
  });

  const addressMethods = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      receiverName: "",
      streetAddress: "",
      townCity: "",
      state: "",
      phone: "",
      isDefault: false,
    },
  });

  const { useCheckoutCart, useGetCart } = useAppService();
  const { mutateAsync: checkout, isPending: isCheckingOut } = useCheckoutCart();
  const { useGetDeliveryInfo } = useAppService();
  const { mutateAsync: fetchDeliveryInfo } = useGetDeliveryInfo();
  const { data: cartData, isLoading: isCartLoading, error: cartError } = useGetCart();
  const { useGetAddresses, useCreateAddress, useGetPickupStations, useGetDeliveryStates } = useAppService();

  // Delivery States
  const { data: deliveryStates } = useGetDeliveryStates();
  const _stateOptions: string[] = useMemo(() => {
    const fromData = Array.isArray((deliveryStates as any)?.data)
      ? ((deliveryStates as any).data as unknown as any[])
      : Array.isArray(deliveryStates as any)
        ? (deliveryStates as unknown as any[])
        : [];
    return fromData.map((s: any) => s?.name || s?.state || s).filter((v: any) => typeof v === "string");
  }, [deliveryStates]);

  // Initialize selected state for station modal from delivery states if not set
  useEffect(() => {
    if (!selectedStateForStation && _stateOptions.length > 0) {
      setSelectedStateForStation(_stateOptions[0]);
    }
  }, [selectedStateForStation, _stateOptions]);

  const { data: addressList } = useGetAddresses();
  const { data: pickupStationList } = useGetPickupStations();
  const { mutateAsync: createAddress } = useCreateAddress();
  // const { mutateAsync: updateAddress } = useUpdateAddress();
  // const { mutateAsync: deleteAddress } = useDeleteAddress();

  useEffect(() => {
    // Populate stations from API and normalize (supports paged shape)
    const pickupData = (pickupStationList as any)?.data;
    const rawItems = Array.isArray(pickupData?.items)
      ? (pickupData.items as any[])
      : Array.isArray(pickupData)
        ? (pickupData as any[])
        : [];
    const normalized = rawItems.map((raw: any) => ({
      id: raw?.id ?? raw?._id ?? String(Math.random()),
      place: raw?.place ?? raw?.name ?? "",
      address: raw?.address ?? "",
      state: raw?.state ?? "",
      lga: raw?.lga ?? raw?.localGovt ?? "",
      station: raw?.station ?? raw?.code ?? raw?.slug ?? "",
      price: typeof raw?.price === "number" ? raw.price : Number(raw?.price ?? 0) || 0,
    }));

    setStations(normalized);

    // Only set defaults if user hasn't already selected something.
    if (normalized.length > 0) {
      setSelectedStation((previous: any) => previous ?? normalized[0]);
      setSelectedStateForStation((previous) => previous || normalized[0]?.state || "");
    }
  }, [pickupStationList]);

  // Re-select station when user changes selected state in modal
  useEffect(() => {
    if (!selectedStateForStation) return;
    const inState = stations.filter((s) => s.state === selectedStateForStation);
    if (inState.length === 0) return;

    const next = inState[0];
    setSelectedStation((previous: any) => {
      if (previous?.id && next?.id && previous.id === next.id) return previous;
      return next;
    });
  }, [selectedStateForStation, stations]);

  useEffect(() => {
    // Populate addresses from API and normalize to UI shape
    const addrData = (addressList as any)?.data;
    const apiItems = Array.isArray(addrData?.items) ? (addrData.items as any[]) : [];
    const normalized = apiItems.map((raw: any) => ({
      id: raw?.id ?? String(Math.random()),
      receiverName: raw?.receiverName ?? raw?.name ?? "",
      streetAddress: raw?.streetAddress ?? raw?.address ?? "",
      townCity: raw?.townCity ?? raw?.city ?? "",
      state: raw?.state ?? "",
      phone: raw?.phone ?? raw?.phoneNumber ?? "",
      isDefault: raw?.isDefault ?? raw?.default ?? false,
    }));
    setAddresses(normalized);
    if (!selectedAddress && normalized.length > 0) {
      const defaultAddr = normalized.find((a: any) => a.isDefault) || normalized[0];
      setSelectedAddress(defaultAddr);
    }
  }, [addressList, selectedAddress]);

  // Calculate shipping fee based on delivery method
  const [deliveryCostDoor, setDeliveryCostDoor] = useState<number | null>(null);
  const [deliveryCostStation, setDeliveryCostStation] = useState<number | null>(null);
  const shippingFee =
    deliveryMethod === "door" ? (deliveryCostDoor ?? 300) : (deliveryCostStation ?? selectedStation?.price ?? 0);

  // Calculate totals
  const subtotal =
    cartData?.data?.items?.reduce(
      (sum: number, item: CartItem) => sum + (item.product.discountPrice || item.product.price || 0) * item.quantity,
      0,
    ) || 0;

  const total = subtotal + shippingFee;

  // Helpers
  const now = new Date();
  const addDays = (d: Date, days: number) => {
    const copy = new Date(d);
    copy.setDate(copy.getDate() + days);
    return copy;
  };
  const formatDate = (d: Date) => d.toLocaleDateString(locale, { day: "2-digit", month: "short" });

  // Delivery windows from API (computed in runtime)
  const [stationWindow, setStationWindow] = useState<{ start: Date; end: Date } | null>(null);
  const [doorWindow, setDoorWindow] = useState<{ start: Date; end: Date } | null>(null);

  const computeWindowFromApi = (data: any) => {
    // Prefer explicit ISO datetime ranges from API when available
    const isoStart = data?.startDate || data?.minDate || data?.minDateUtc;
    const isoEnd = data?.endDate || data?.maxDate || data?.maxDateUtc;

    if (isoStart && isoEnd) {
      try {
        const start = new Date(isoStart);
        const end = new Date(isoEnd);
        if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
          return { start, end };
        }
      } catch {
        // fall through to other shapes
      }
    }

    // Offset-based windows
    if (typeof data?.startOffsetDays === "number" && typeof data?.endOffsetDays === "number") {
      return {
        start: addDays(now, data.startOffsetDays),
        end: addDays(now, data.endOffsetDays),
      };
    }

    // ETA-based window
    if (typeof data?.etaDays === "number") {
      return {
        start: addDays(now, data.etaDays),
        end: addDays(now, data.etaDays + 2),
      };
    }

    // Fallback: next week 2-day window
    const nextWeekStart = addDays(now, 7);
    return { start: nextWeekStart, end: addDays(nextWeekStart, 2) };
  };

  // Fetch delivery window for station when station changes
  useEffect(() => {
    if (!selectedStation?.state) return;
    fetchDeliveryInfo({ dropOffState: selectedStation.state })
      .then((response) => {
        // console.log(response);
        setStationWindow(computeWindowFromApi(response?.data));
        const cost = (response as any)?.data?.cost;
        setDeliveryCostStation(typeof cost === "number" ? cost : Number(cost ?? Number.NaN));
      })
      .catch(() => {
        setStationWindow(null);
        setDeliveryCostStation(null);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStation?.id, selectedStation?.state]);

  // Fetch delivery window for door when address changes
  useEffect(() => {
    if (deliveryMethod !== "door") return;
    const state = selectedAddress?.state;
    if (!state) return;
    fetchDeliveryInfo({ dropOffState: state })
      .then((response) => {
        // console.log(response);
        setDoorWindow(computeWindowFromApi(response?.data));
        const cost = (response as any)?.data?.cost;
        setDeliveryCostDoor(typeof cost === "number" ? cost : Number(cost ?? Number.NaN));
      })
      .catch(() => {
        setDoorWindow(null);
        setDeliveryCostDoor(null);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryMethod, selectedAddress?.id, selectedAddress?.state]);

  const handleCheckout = () => {
    if (!deliveryMethod || !paymentMethod) {
      toast.error("Please select both delivery and payment methods");
      return;
    }

    // Build shippingAddress for both delivery types
    const userEmail = session?.user?.email ?? "";
    const userPhone = (session as any)?.user?.phoneNumber ?? DEFAULT_PHONE;
    const shippingAddress =
      deliveryMethod === "door"
        ? selectedAddress
          ? {
              address: `${selectedAddress.streetAddress}${selectedAddress.townCity ? ", " + selectedAddress.townCity : ""}, ${selectedAddress.state}`,
              email: userEmail,
              name: selectedAddress.receiverName,
              phoneNumber: selectedAddress.phone || userPhone || DEFAULT_PHONE,
              state: selectedAddress.state,
            }
          : undefined
        : {
            address: `${selectedStation.place}, ${selectedStation.address}`,
            email: userEmail,
            name: selectedStation.place,
            phoneNumber: userPhone || DEFAULT_PHONE,
            state: selectedStation.state,
          };

    const payload = {
      paymentMethod,
      shippingFee,
      shippingAddress,
    };

    if (paymentMethod === "paystack") {
      checkout(payload, {
        onSuccess: (response) => {
          if (response?.data?.checkoutUrl) {
            toast.success("Checkout successful");
            window.open(response.data.checkoutUrl as string, "_blank", "noopener,noreferrer");
          }
        },
        onError: (error) => {
          toast.error("Checkout failed", {
            description: error.message,
          });
        },
      });
    } else if (paymentMethod === "paymentOnDelivery") {
      checkout(payload, {
        onSuccess: () => {
          toast.success("Payment on delivery selected. Order placed successfully.");
        },
        onError: (error) => {
          toast.error("Checkout failed", {
            description: error.message,
          });
        },
      });
    }
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!deliveryMethod || !paymentMethod) {
      toast.error("Please select both delivery and payment methods");
      return;
    }
    handleCheckout();
  };

  const handleStationSelection = () => {
    setShowPickupModal(false);
    toast.success(`Selected station: ${selectedStation?.station ?? selectedStation?.place ?? "Station"}`);
  };

  const handleAddressSelection = (address: Address) => {
    setSelectedAddress(address);
    setShowAddressBookModal(false);
    toast.success(`Selected address: ${address.receiverName}`);
  };

  const handleAddAddress = async (data: AddressFormData) => {
    try {
      const payload = {
        name: data.receiverName,
        address: data.streetAddress,
        city: data.townCity,
        state: data.state,
        phoneNumber: data.phone,
        default: data.isDefault,
      };
      const created = await createAddress(payload as any);
      // Prefer server response but fall back to local
      const serverAddr = (created as any)?.data || null;
      if (data.isDefault) {
        setAddresses((previous) => previous.map((addr) => ({ ...addr, isDefault: false })));
      }
      if (serverAddr) {
        setAddresses((previous) => [...previous, serverAddr]);
        // Normalize server response to Address shape for local state if needed
        const normalized: Address = {
          id: serverAddr.id ?? String(Date.now()),
          receiverName: serverAddr.name ?? data.receiverName,
          streetAddress: serverAddr.address ?? data.streetAddress,
          townCity: serverAddr.city ?? data.townCity,
          state: serverAddr.state ?? data.state,
          phone: serverAddr.phoneNumber ?? data.phone,
          isDefault: serverAddr.default ?? data.isDefault ?? false,
        };
        setSelectedAddress(normalized);
      }
      setShowAddAddressModal(false);
      addressMethods.reset();
      toast.success("Address added successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to add address");
    }
  };

  return (
    <section className="pt-18 lg:pt-[8rem]">
      <ProductBreadcrumb productTitle={`checkout`} />
      <Wrapper>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Delivery and Payment Section */}
          <div>
            <h4 className="!text-primary dark:!text-accent !text-lg md:!text-2xl">Delivery Method</h4>

            <form onSubmit={handleFormSubmit}>
              <div className="mt-4 space-y-10">
                <label className="block cursor-pointer">
                  <div className={`flex items-start space-y-2`}>
                    <input
                      type="radio"
                      name="delivery-method"
                      value="station"
                      checked={deliveryMethod === "station"}
                      onChange={() => setDeliveryMethod("station")}
                      className="mt-2 mr-2"
                    />
                    <p className={`!text-base font-semibold md:!text-lg`}>Pick-up Station</p>
                  </div>
                  <p className={`my-4 !text-sm md:!text-base`}>
                    Delivery Between <strong>{formatDate(stationWindow?.start ?? addDays(now, 7))}</strong> and
                    <strong> {formatDate(stationWindow?.end ?? addDays(now, 9))}</strong>
                  </p>
                  <div className="overflow-hidden rounded-lg border">
                    <button
                      type="button"
                      disabled={isCartLoading || isCheckingOut || deliveryMethod === "door"}
                      className="bg-muted text-primary flex w-full items-center justify-between p-4 focus:outline-none"
                      onClick={() => setShowPickupModal(true)}
                    >
                      <p className="font-semibold md:!text-lg">Selected Pick-up Station</p>
                      <ChevronRight />
                    </button>
                    {deliveryMethod === "station" && selectedStation && (
                      <div className="p-4">
                        <span className="!text-sm font-semibold md:!text-base">
                          {selectedStation?.place ?? "Select Pick-up Station"}
                        </span>
                        <div className="!text-xs text-gray-500 md:!text-sm">{selectedStation?.address ?? ""}</div>
                        {/* <div className="mt-1 !text-sm font-bold text-[#FF9900] md:!text-base">
                          {formatCurrency(selectedStation?.price ?? 0, locale as Locale)}
                        </div> */}
                      </div>
                    )}
                  </div>
                </label>
                <label className="block cursor-pointer">
                  <div className={`flex items-start space-y-2`}>
                    <input
                      type="radio"
                      name="delivery-method"
                      value="door"
                      checked={deliveryMethod === "door"}
                      onChange={() => setDeliveryMethod("door")}
                      className="mt-2 mr-2"
                    />
                    <p className={`!text-base font-semibold md:!text-lg`}>Door Delivery</p>
                  </div>
                  <p className={`my-4 !text-sm md:!text-base`}>
                    Delivery Between <strong>{formatDate(doorWindow?.start ?? addDays(now, 9))}</strong> and
                    <strong> {formatDate(doorWindow?.end ?? addDays(now, 11))}</strong>
                  </p>
                  {deliveryMethod === "door" && (
                    <div className="mt-4 space-y-4">
                      <div className="overflow-hidden rounded-lg border">
                        <button
                          type="button"
                          disabled={isCartLoading || isCheckingOut || deliveryMethod !== "door"}
                          className="bg-muted text-primary flex w-full items-center justify-between p-4 focus:outline-none"
                          onClick={() => setShowAddressBookModal(true)}
                        >
                          <p className="!text-base font-semibold md:!text-lg">Selected From Address Book</p>
                          <ChevronRight />
                        </button>
                        {selectedAddress ? (
                          <div className="p-4">
                            <span className="!text-sm font-semibold md:!text-base">{selectedAddress.receiverName}</span>
                            <div className="!text-xs text-gray-500 md:!text-sm">{selectedAddress.streetAddress}</div>
                            <div className="mt-1 !text-xs text-gray-500 md:!text-sm">{selectedAddress.phone}</div>
                          </div>
                        ) : (
                          <div className="p-4">
                            <p className="!text-xs md:!text-sm">
                              Make sure you select the right address from your address book.
                            </p>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAddAddressModal(true)}
                        className="dark:!text-accent flex items-center !text-sm font-medium text-blue-600 md:!text-base"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Address
                      </button>
                    </div>
                  )}
                </label>
              </div>

              {/* Payment Method */}
              <div className="mt-20 rounded-lg border p-4">
                <h4 className="!text-primary dark:!text-accent !text-lg md:!text-2xl">Payment Method</h4>
                <div className="mt-2 space-y-2">
                  <label className="flex cursor-pointer items-center gap-3 py-2">
                    <input
                      type="radio"
                      name="payment"
                      value="paystack"
                      checked={paymentMethod === "paystack"}
                      onChange={() => setPaymentMethod("paystack")}
                      className="h-4 w-4"
                    />
                    <Image src="/images/paystack-logo.svg" alt="Paystack" width={100} height={10} className="h-6" />
                    <span className="block !text-sm text-gray-600">Secure online payment</span>
                  </label>

                  {/* <label className="flex cursor-pointer items-start gap-3 py-2">
                    <input
                      type="radio"
                      name="payment"
                      value="paymentOnDelivery"
                      checked={paymentMethod === "paymentOnDelivery"}
                      onChange={() => setPaymentMethod("paymentOnDelivery")}
                      className="mt-1 h-4 w-4"
                    />
                    <div>
                      <p className="!text-sm font-semibold md:!text-base">Pay on Delivery</p>
                      <p className="!text-xs text-gray-600 md:!text-sm">
                        Pay when your order arrives at your door or pickup station.
                      </p>
                    </div>
                  </label> */}
                </div>

                {paymentMethod === "paymentOnDelivery" && (
                  <div className="mt-3 rounded bg-yellow-50 p-3 !text-xs text-yellow-800 md:!text-sm">
                    Cash or transfer on delivery. Please ensure your contact details are correct.
                  </div>
                )}
              </div>

              <SkiButton
                type="submit"
                isLoading={isCheckingOut}
                isDisabled={
                  !deliveryMethod ||
                  !paymentMethod ||
                  isCheckingOut ||
                  isCartLoading ||
                  (deliveryMethod === "door" && !selectedAddress)
                }
                variant={`primary`}
                className={`mt-6 w-full`}
              >
                Proceed to Checkout
              </SkiButton>
            </form>
          </div>

          {/* Order Summary */}
          <div className="h-fit rounded-lg border p-6">
            <h4 className="!text-primary dark:!text-accent mb-6 !text-xl md:!text-2xl">Your order</h4>
            <hr />

            {isCartLoading ? (
              <div className="mt-4 flex justify-center py-8">
                <p className="!text-sm md:!text-base">Loading cart items...</p>
              </div>
            ) : cartError ? (
              <div className="text-destructive mt-4 rounded-lg bg-red-50 p-4 !text-sm md:!text-base">
                Error loading cart items
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="flex justify-between !text-sm font-medium md:!text-base">
                  <span>Product</span>
                  <span>Subtotal</span>
                </div>

                {cartData?.data?.items?.length ? (
                  <>
                    {cartData.data.items.map((item: CartItem) => (
                      <div key={item.id} className="flex items-start justify-between pt-4">
                        <div className="flex flex-1 items-start gap-3">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.product.name}
                              width={50}
                              height={50}
                              className="h-12 w-12 rounded object-cover"
                            />
                          )}
                          <span className="!text-sm md:!text-base">
                            {item.product.name} × {item.quantity}
                          </span>
                        </div>
                        <span>
                          {formatCurrency(
                            (item.product.discountPrice || item.product.price || 0) * item.quantity,
                            locale as Locale,
                          )}
                        </span>
                      </div>
                    ))}

                    <div className="flex justify-between border-t pt-4 !text-sm md:!text-base">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal, locale as Locale)}</span>
                    </div>

                    <div className="flex justify-between pt-4 !text-sm md:!text-base">
                      <span>Shipping</span>
                      <span className="text-right">
                        <span className="text-gray-500">
                          ({deliveryMethod === "door" ? "Door Delivery" : "Pick-up Station"})
                        </span>
                        <br />
                        {formatCurrency(shippingFee, locale as Locale)}
                      </span>
                    </div>

                    <div className="flex justify-between border-t pt-4 !text-sm font-semibold md:!text-base">
                      <span>Total</span>
                      <span className="text-primary dark:!text-accent">{formatCurrency(total, locale as Locale)}</span>
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center !text-sm text-gray-500 md:!text-base">Your cart is empty</div>
                )}
              </div>
            )}
          </div>
        </div>
      </Wrapper>

      {/* Pick-up Station Modal */}
      <ReusableDialog
        open={showPickupModal}
        onOpenChange={setShowPickupModal}
        trigger={<div style={{ display: "none" }} />}
        title="Pick-up Stations Near You"
        hideClose={false}
        className="max-w-md"
        headerClassName={`!text-lg font-semibold md:!text-xl`}
      >
        <FormProvider {...methods}>
          <div className="space-y-4">
            <div className="mb-4 space-y-4">
              <FormField
                label="State"
                name="state"
                type="select"
                placeholder="Select your state"
                required
                options={(Array.isArray(_stateOptions) ? _stateOptions : []).map((s) => ({ value: s, label: s }))}
                onChange={(event_: any) => {
                  const next = typeof event_?.target?.value === "string" ? event_.target.value : event_;
                  setSelectedStateForStation(next);
                }}
              />
              <FormField
                name="pickupStation"
                type="select"
                placeholder="Choose your pickup station"
                required
                options={(Array.isArray(stations) ? stations : []).map((station) => ({
                  value: station.id,
                  label: `${station.place} (${formatCurrency(station.price, locale as Locale)})`,
                }))}
              />
            </div>

            <div className="mb-6 max-h-48 space-y-4 overflow-y-auto">
              {!Array.isArray(stations) || stations.length === 0 ? (
                <div className="!text-sm text-gray-600 md:!text-base">No pickup stations available.</div>
              ) : (
                stations.map((station) => (
                  <label key={station.id} className="flex cursor-pointer items-start gap-2">
                    <input
                      type="radio"
                      name="pickup-station"
                      value={station.id}
                      checked={selectedStation?.id === station.id}
                      onChange={() => setSelectedStation(station)}
                      className="mt-1 accent-blue-600"
                    />
                    <div>
                      <span className="!text-sm font-semibold md:!text-base">{station.place}</span>
                      <div className="!text-xs text-gray-500 md:!text-sm">{station.address}</div>
                      <div className="mt-1 !text-sm font-bold text-[#FF9900] md:!text-base">
                        {formatCurrency(station.price, locale as Locale)}
                      </div>
                    </div>
                  </label>
                ))
              )}
            </div>

            <button
              type="button"
              className="w-full rounded-full bg-[#0090D0] py-2 !text-base font-semibold text-white md:!text-lg"
              disabled={!selectedStation?.id}
              onClick={handleStationSelection}
            >
              Select Station
            </button>

            {/* Display selected station information */}
            {selectedStation?.id && (
              <div className="mt-4 rounded-lg bg-gray-50 p-4">
                <h4 className="!text-lg font-semibold text-gray-800 md:!text-xl">Selected Station:</h4>
                <div className="mt-2 space-y-1 !text-xs text-gray-600 md:!text-sm">
                  <p>
                    <strong>Place:</strong> {selectedStation?.place}
                  </p>
                  <p>
                    <strong>Address:</strong> {selectedStation?.address}
                  </p>
                  <p>
                    <strong>State:</strong> {selectedStation?.state}
                  </p>
                  <p>
                    <strong>LGA:</strong> {selectedStation?.lga}
                  </p>
                  <p>
                    <strong>Station:</strong> {selectedStation?.station}
                  </p>
                  <p className="font-bold text-[#FF9900]">
                    <strong>Price:</strong> {formatCurrency(selectedStation?.price ?? 0, locale as Locale)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </FormProvider>
      </ReusableDialog>

      {/* Address Book Modal */}
      <ReusableDialog
        open={showAddressBookModal}
        onOpenChange={setShowAddressBookModal}
        trigger={<div style={{ display: "none" }} />}
        title="Address Book"
        hideClose={false}
        className="max-w-md"
        headerClassName={`!text-lg font-semibold md:!text-xl`}
      >
        <div className="space-y-4">
          <div className="mb-6 max-h-48 space-y-4 overflow-y-auto">
            {addresses.map((address) => (
              <label key={address.id} className="flex cursor-pointer items-start gap-2">
                <input
                  type="radio"
                  name="address-selection"
                  value={address.id}
                  checked={selectedAddress?.id === address.id}
                  onChange={() => handleAddressSelection(address)}
                  className="mt-1 accent-blue-600"
                />
                <div>
                  <span className="!text-sm font-semibold md:!text-base">{address.receiverName}</span>
                  <div className="!text-xs text-gray-500 md:!text-sm">{address.streetAddress}</div>
                  <div className="mt-1 !text-xs text-gray-500 md:!text-sm">{address.phone}</div>
                </div>
              </label>
            ))}
          </div>

          <SkiButton
            type="button"
            variant="primary"
            className="w-full"
            isDisabled={!selectedAddress}
            onClick={() => {
              if (selectedAddress) {
                handleAddressSelection(selectedAddress);
              }
            }}
          >
            Continue
          </SkiButton>

          <button
            type="button"
            onClick={() => {
              setShowAddressBookModal(false);
              setShowAddAddressModal(true);
            }}
            className="text-primary flex w-full items-center justify-center py-2 !text-sm font-medium md:!text-base"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Address
          </button>

          {/* Display selected address information */}
          {selectedAddress && (
            <div className="bg-muted mt-4 rounded-lg p-4">
              <h4 className="!text-lg font-semibold text-gray-800 md:!text-xl">Selected Address:</h4>
              <div className="mt-2 space-y-1 !text-xs text-gray-600 md:!text-sm">
                <p>
                  <strong>Name:</strong> {selectedAddress.receiverName}
                </p>
                <p>
                  <strong>Address:</strong> {selectedAddress.streetAddress}
                </p>
                <p>
                  <strong>City:</strong> {selectedAddress.townCity}
                </p>
                <p>
                  <strong>State:</strong> {selectedAddress.state}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedAddress.phone}
                </p>
              </div>
            </div>
          )}
        </div>
      </ReusableDialog>

      {/* Add New Address Modal */}
      <ReusableDialog
        open={showAddAddressModal}
        onOpenChange={setShowAddAddressModal}
        trigger={<div style={{ display: "none" }} />}
        title="Add New Address"
        hideClose={false}
        className="max-w-md"
        headerClassName={`!text-lg font-semibold md:!text-xl`}
      >
        <FormProvider {...addressMethods}>
          <form onSubmit={addressMethods.handleSubmit(handleAddAddress)} className="space-y-4">
            <div className="mb-4 space-y-4">
              <FormField
                label="Receiver's Name"
                name="receiverName"
                type="text"
                placeholder="Receiver's Name"
                required
              />

              <FormField
                label="Street Address"
                name="streetAddress"
                type="text"
                placeholder="Street Address"
                required
              />

              <FormField label="Town/City" name="townCity" type="text" placeholder="Town/City" required />

              <FormField
                label="State"
                name="state"
                type="select"
                placeholder="Select state"
                required
                options={(Array.isArray(_stateOptions) ? _stateOptions : []).map((s) => ({ value: s, label: s }))}
              />

              <FormField label="Phone" name="phone" type="text" placeholder="Phone" required />
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="!text-sm font-medium md:!text-base">Set As Default Address</span>
              <input type="checkbox" {...addressMethods.register("isDefault")} className="h-4 w-4 accent-green-600" />
            </div>

            <SkiButton type="submit" variant="primary" className="w-full">
              Save Address
            </SkiButton>
          </form>
        </FormProvider>
      </ReusableDialog>
    </section>
  );
};

export default CheckoutPage;

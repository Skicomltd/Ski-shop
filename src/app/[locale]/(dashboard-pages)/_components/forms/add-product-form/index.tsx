/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { BlurImage } from "@/components/core/miscellaneous/blur-image";
import { BackButton } from "@/components/shared/back-button";
import SkiButton from "@/components/shared/button";
import MainButton from "@/components/shared/button";
import { AlertModal } from "@/components/shared/dialog/alert-modal";
import { FormField } from "@/components/shared/inputs/FormFields";
import { Label } from "@/components/ui/label";
import { Editor } from "@/lib/rich-text-editor";
import { cn } from "@/lib/utils";
import { SimpleProductFormData, simpleProductSchema } from "@/schemas";
import { useDashboardProductService } from "@/services/dashboard/vendor/products/use-product-service";
import { useAppService } from "@/services/externals/app/use-app-service";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, rectSortingStrategy, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import { SerializedEditorState } from "lexical";
import { PaperclipIcon, Trash2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { DashboardHeader } from "../../dashboard-header";

interface SortableImageProperties {
  id: string;
  file: File;
  onRemove: (id: string) => void;
  isMain?: boolean;
  onClick?: (id: string) => void;
  isSelected?: boolean;
}

const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
  event.preventDefault();
};

const extractTextFromEditorState = (editorState: SerializedEditorState): string => {
  try {
    const root = editorState?.root;
    if (!root?.children) return "";

    let text = "";
    const extractTextFromNode = (node: any) => {
      if (node.text) {
        text += node.text;
      }
      if (node.children) {
        for (const child of node.children) {
          extractTextFromNode(child);
        }
      }
    };

    for (const child of root.children) {
      extractTextFromNode(child);
    }
    return text;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error extracting text from editor state:", error);
    return "";
  }
};

const SortableImage = ({ id, file, onRemove, isMain, onClick, isSelected }: SortableImageProperties) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick?.(id)}
      className={`relative ${isMain ? "h-full w-full" : "h-20 w-full"} cursor-pointer rounded-md border ${
        isDragging ? "z-10 shadow-lg" : ""
      } ${isSelected ? "ring-2 ring-blue-500" : ""}`}
    >
      <BlurImage
        src={URL.createObjectURL(file)}
        alt={`Preview ${id}`}
        width={isMain ? 600 : 100}
        height={isMain ? 400 : 100}
        className="h-full w-full object-cover"
      />
      <SkiButton
        type="button"
        isIconOnly
        size={`icon`}
        icon={<Trash2Icon className={`!size-2`} />}
        onClick={(event) => {
          event.stopPropagation();
          onRemove(id);
        }}
        className={cn(
          "bg-mid-danger absolute -top-2 -right-2 text-sm text-white transition-opacity hover:opacity-90",
          isSelected && !isMain && "border-mid-danger border-2",
        )}
      />
    </div>
  );
};

export const AddProductForm = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { useGetAllProductCategory } = useAppService();
  const { useGetStoreInfo, useCreateProduct } = useDashboardProductService();
  const { data: productCategories } = useGetAllProductCategory();
  const { mutateAsync: createProduct, isPending: isCreatingProduct } = useCreateProduct();
  const { data: storeInfo, isLoading: storeInfoLoading } = useGetStoreInfo();
  const methods = useForm<SimpleProductFormData>({
    resolver: zodResolver(simpleProductSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      price: 0,
      category: "",
      stockCount: 0,
      images: [],
      discountPrice: 0,
      description: "",
      status: "published",
      weight: 1,
      fragile: false,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
    setValue,
    watch,
  } = methods;

  const fileInputReference = useRef<HTMLInputElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [descriptionEditorState, setDescriptionEditorState] = useState<SerializedEditorState>();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);
  const images = watch("images");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor),
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.activevent.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      setValue("images", arrayMove(images, oldIndex, newIndex), {
        shouldValidate: true,
      });
    }
    setActiveId(null);
  };

  const handleImageUpload = (files: FileList | null) => {
    if (files && files.length > 0) {
      const newFiles = [...files];

      if (images.length + newFiles.length > 4) {
        toast.error("You can upload a maximum of 4 images");
        return;
      }

      const uploadedFiles = newFiles.map((file) => ({
        id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        file,
      }));
      // const uploadedFiles = newFiles.map((file) => ({
      //   id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      //   file,
      // }));

      const newImages = [...images, ...uploadedFiles];
      setValue("images", newImages, { shouldValidate: true });

      // Set the first image as selected if no image is currently selected
      if (!selectedImageId && newImages.length > 0) {
        setSelectedImageId(newImages[0].id);
      }
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(event.target.files);
    if (event.target) event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleImageUpload(event.dataTransfer.files);
  };

  const handleRemoveImage = (id: string) => {
    const filteredImages = images.filter((img) => img.id !== id);
    setValue("images", filteredImages, { shouldValidate: true });
    // If the removed image was selected, clear the selection
    if (selectedImageId === id) {
      setSelectedImageId(null);
    }
  };

  const handleImageSelect = (id: string) => {
    setSelectedImageId(id);
  };

  const handleSuccessModalConfirm = () => {
    setShowSuccessModal(false);
    setValue("description", "", { shouldValidate: true });
    methods.reset();
    if (createdProductId) {
      if (session?.user?.role.name === "vendor") {
        router.push(`/dashboard/products/${createdProductId}`);
      } else {
        router.push(`/admin/products/${createdProductId}`);
      }
    }
  };

  const handleSubmitForm = async (data: SimpleProductFormData) => {
    try {
      // Validate store info is available
      if (!storeInfo?.data?.id) {
        toast.error("Store information not available");
        return;
      }

      createProduct(
        { productData: data, storeID: storeInfo.data.id },
        {
          onSuccess: (response) => {
            if (response?.success) {
              setCreatedProductId(response?.data.id);
              setShowSuccessModal(true);
            } else {
              toast.error("Failed to create product");
            }
          },
        },
      );
    } catch {
      toast.error("Failed to process product data");
    }
  };

  const activeItem = activeId ? images.find((img) => img.id === activeId) : null;

  return (
    <section className="space-y-8">
      <DashboardHeader
        title="Add Product"
        subtitle={`Add a new product to your store, you can publish it immediately or keep it in your draft folder.`}
        showSubscriptionBanner={session?.user?.role.name !== "admin" && false}
        icon={<BackButton />}
      />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Image upload section - appears first on mobile, right column on desktop */}
          <section className="order-1 lg:order-2 lg:col-span-6">
            <div className="mb-2 gap-2">
              <Label className="text-[16px] font-medium">
                Product Images
                <span className="text-mid-danger ml-1">*</span>
              </Label>
              <span className="text-xs text-gray-500">(At least one image is required)</span>
            </div>
            <div className="space-y-4">
              {/* Main image preview area */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => images.length === 0 && fileInputReference.current?.click()}
                className={`bg-background border-border flex min-h-[30rem] w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-4 hover:bg-gray-100 ${
                  images.length > 0 ? "border-solid p-0" : ""
                }`}
              >
                {images.length > 0 ? (
                  <SortableImage
                    id={
                      selectedImageId
                        ? images.find((img) => img.id === selectedImageId)?.id || images[0].id
                        : images[0].id
                    }
                    file={
                      selectedImageId
                        ? images.find((img) => img.id === selectedImageId)?.file || images[0].file
                        : images[0].file
                    }
                    onRemove={handleRemoveImage}
                    isMain
                  />
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <PaperclipIcon />
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                      </p>
                    </div>
                    <p className="text-[10px] text-gray-500">Supports: JPG, PNG, WEBP (Max 4 images)</p>
                  </>
                )}
              </div>

              {/* Thumbnail grid with drag-and-drop */}
              {images.length > 0 && (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={images.map((img) => img.id)} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-4 gap-2">
                      {images.map((image) => (
                        <SortableImage
                          key={image.id}
                          id={image.id}
                          file={image.file}
                          onRemove={handleRemoveImage}
                          onClick={handleImageSelect}
                          isSelected={selectedImageId === image.id}
                        />
                      ))}
                      {images.length < 4 && (
                        <div
                          onClick={() => fileInputReference.current?.click()}
                          className="bg-background flex h-20 w-full cursor-pointer items-center justify-center rounded-md border border-dashed border-gray-300"
                        >
                          <PaperclipIcon size={16} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                  </SortableContext>
                  <DragOverlay adjustScale={true}>
                    {activeItem ? (
                      <div className="h-20 w-full rounded-md border shadow-lg">
                        <BlurImage
                          src={URL.createObjectURL(activeItem.file)}
                          alt={`Preview ${activeItem.id}`}
                          width={100}
                          height={100}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : null}
                  </DragOverlay>
                </DndContext>
              )}

              <input
                ref={fileInputReference}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileInputChange}
                accept="image/*"
              />
            </div>
          </section>

          {/* Form fields section - appears second on mobile, left column on desktop */}
          <section className="order-2 space-y-4 lg:order-1 lg:col-span-6">
            <FormField placeholder="Enter name" className="h-14 w-full" label="Product Name" name="name" required />
            <div className="grid grid-cols-3 gap-4">
              <FormField placeholder="0.00" className="h-14 w-full" label="Price" name="price" type="number" required />
              <FormField
                placeholder="0.00"
                className="h-14 w-full"
                label="Discount Price"
                name="discountPrice"
                type="number"
              />
              <FormField
                placeholder="0.00"
                className="h-14 w-full"
                label="Stock Quantity"
                name="stockCount"
                type="number"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                placeholder="1"
                className="h-14 w-full"
                label="Weight (kg)"
                name="weight"
                type="number"
                required
              />
              <FormField
                placeholder="Select"
                className="!h-14 w-full"
                label="Fragile"
                name="fragile"
                type="select"
                options={[
                  { value: "false", label: "No" },
                  { value: "true", label: "Yes" },
                ]}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[16px] font-medium">
                Product Description
                <span className="text-mid-danger ml-1">*</span>
              </Label>
              <div>
                <Editor
                  editorSerializedState={descriptionEditorState}
                  onSerializedChange={(value) => {
                    setDescriptionEditorState(value);
                    // Convert rich text content to plain text for form validation
                    const plainText = extractTextFromEditorState(value);
                    setValue("description", plainText, { shouldValidate: true });
                  }}
                />
              </div>
            </div>
            <FormField
              placeholder="Select Category"
              className="!h-14 w-full"
              label="Product Category"
              name="category"
              required
              type={`select`}
              options={productCategories?.data.map((category) => ({
                value: category,
                label: category
                  .replaceAll(/([A-Z])/g, " $1") // Add space before capital letters
                  .replace(/^./, (string_) => string_.toUpperCase()) // Capitalize first letter
                  .trim(), // Remove leading/trailing spaces
              }))}
            />
            <FormField
              placeholder="Select Status"
              className="!h-14 w-full"
              label="Product Status"
              name="status"
              required
              type={`select`}
              options={[
                { value: "published", label: "Published" },
                { value: "draft", label: "Draft" },
              ]}
            />
            <div className="pt-4">
              <MainButton
                type="submit"
                variant="primary"
                isDisabled={isSubmitting || !isValid || storeInfoLoading || isCreatingProduct}
                isLoading={isSubmitting || storeInfoLoading || isCreatingProduct}
                className="w-full"
                size="xl"
              >
                Add Product
              </MainButton>
            </div>
          </section>
        </form>
      </FormProvider>

      {/* Success Modal */}
      <AlertModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onConfirm={handleSuccessModalConfirm}
        type="success"
        title="Product Created Successfully!"
        description="Your product has been created and is now available in your store."
        confirmText="View Product"
        showCancelButton={false}
        autoClose={false}
      />
    </section>
  );
};

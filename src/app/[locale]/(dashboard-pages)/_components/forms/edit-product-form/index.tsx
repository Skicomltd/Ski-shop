/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { BlurImage } from "@/components/core/miscellaneous/blur-image";
import { BackButton } from "@/components/shared/back-button";
import MainButton from "@/components/shared/button";
import { AlertModal } from "@/components/shared/dialog/alert-modal";
import { FormField } from "@/components/shared/inputs/FormFields";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Editor } from "@/lib/rich-text-editor";
import { cn } from "@/lib/utils";
import { useDashboardProductService } from "@/services/dashboard/vendor/products/use-product-service";
// import { useAppService } from "@/services/externals/app/use-app-service";
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
import { EditIcon, MoreVertical, PaperclipIcon, Trash2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { DashboardHeader } from "../../dashboard-header";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required").optional(),
  price: z.number().min(0, "Price must be positive").optional(),
  discountPrice: z.number().min(0, "Discount price must be positive").optional(),
  description: z.string().optional(),
  // category: z.string().optional(),
  stockCount: z.number().min(0, "Stock count must be positive").optional(),
  images: z.array(z.any()).optional(),
  status: z.enum(["published", "draft"]).default("published").optional(),
  weight: z.number().min(0, "Weight must be positive").optional(),
  fragile: z
    .union([z.boolean(), z.string()])
    .transform((value) => {
      if (typeof value === "string") return value === "true";
      return value;
    })
    .optional(),
  replaceIndices: z.array(z.number()).optional(),
});

export type EditProductFormData = z.infer<typeof productSchema>;

interface SortableImageProperties {
  id: string;
  file?: File;
  url?: string;
  onRemove: (id: string) => void;
  onEdit: (id: string) => void;
  isMain?: boolean;
  onClick?: (id: string) => void;
  isSelected?: boolean;
}

interface EditProductFormProperties {
  product: Product;
  onSuccess?: () => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  setIsSubmitting?: (submitting: boolean) => void;
}

interface ProductImage {
  id: string;
  file?: File;
  url?: string;
  isExisting?: boolean;
  replacesIndex?: number; // when at MAX=5, which original slot (0..4) this file replaces
}

const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
  event.preventDefault();
};

const toSerializedEditorState = (description?: string): SerializedEditorState => {
  if (!description) return {} as SerializedEditorState;

  // Prefer Lexical serialized JSON stored as a string.
  try {
    const parsed: unknown = JSON.parse(description);
    if (parsed && typeof parsed === "object" && "root" in parsed) {
      return parsed as SerializedEditorState;
    }
  } catch {
    // fall back to plain text
  }

  // Legacy plain-text description -> wrap into a minimal Lexical state.
  return {
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: description,
              type: "text",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "paragraph",
          version: 1,
        },
      ],
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  } as unknown as SerializedEditorState;
};

const SortableImage = ({ id, file, url, onRemove, onEdit, isMain, onClick, isSelected }: SortableImageProperties) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const imageSource = file ? URL.createObjectURL(file) : url;

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
        src={imageSource || ""}
        alt={`Preview ${id}`}
        width={isMain ? 600 : 100}
        height={isMain ? 400 : 100}
        className="h-full w-full object-cover"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
            }}
            className={cn(
              "bg-primary text-primary-foreground absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-md text-sm shadow-md transition-opacity hover:opacity-90",
              isSelected && !isMain && "border-primary border-2",
            )}
          >
            <MoreVertical className="!size-3" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(event) => event.stopPropagation()}>
          <DropdownMenuItem
            className="!text-sm"
            onClick={(event) => {
              event.stopPropagation();
              onEdit(id);
            }}
          >
            <EditIcon className="size-3" />
            Replace Image
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={(event) => {
              event.stopPropagation();
              onRemove(id);
            }}
          >
            <Trash2Icon className="size-3" />
            Delete Image
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

// Convert existing images to the format expected by the form
const convertExistingImages = (imageUrls: string[]): ProductImage[] => {
  return imageUrls.map((url, index) => ({
    id: `existing-${index}`,
    url,
    isExisting: true,
  }));
};

export const EditProductForm = ({ product, onSuccess, onCancel }: EditProductFormProperties) => {
  // const { useGetAllProductCategory } = useAppService();
  const { data: session } = useSession();
  const { useEditProduct, useEditProductImages, useDeleteProductImage } = useDashboardProductService();
  // const { data: productCategories } = useGetAllProductCategory();
  const { mutateAsync: editProduct, isPending: isEditingProduct } = useEditProduct();
  const { mutateAsync: editProductImages, isPending: isEditingImages } = useEditProductImages();
  const { mutateAsync: deleteProductImage, isPending: isDeletingImage } = useDeleteProductImage();

  const methods = useForm<EditProductFormData>({
    resolver: zodResolver(productSchema),
    mode: "onChange",
    defaultValues: {
      name: product.name,
      price: product.price,
      // category: product.category || "",
      stockCount: product.stockCount,
      images: product.images ? convertExistingImages(product.images) : [],
      discountPrice: product.discountPrice || 0,
      description: product.description || "",
      status: product.status || "published",
      // weight: product.weight || 1,
      // fragile: product.fragile !== undefined ? String(product.fragile) : "false",
    },
  });

  const { handleSubmit, setValue, watch, reset } = methods;

  const fileInputReference = useRef<HTMLInputElement>(null);
  const replaceInputReference = useRef<HTMLInputElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [imageToReplace, setImageToReplace] = useState<{ id: string; url: string } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [descriptionEditorState, setDescriptionEditorState] = useState<SerializedEditorState>(() => {
    return toSerializedEditorState(product.description);
  });
  const images = watch("images") || [];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor),
  );

  // Initialize form with product data when component mounts
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        price: product.price,
        // category: product.category || "",
        stockCount: product.stockCount,
        images: product.images ? convertExistingImages(product.images) : [],
        discountPrice: product.discountPrice || 0,
        description: product.description || "",
        status: product.status || "published",
        // weight: product.weight || 1,
        // fragile: product.fragile !== undefined ? String(product.fragile) : "false",
      });
    }
  }, [product, reset]);

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
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

  const handleImageUpload = async (files: FileList | null, replaceUrl?: string) => {
    if (!files || files.length === 0) return;

    const file = files[0]; // Handle one file at a time
    const temporaryId = `img-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    // If we're replacing an image
    if (replaceUrl) {
      const currentImages = [...images];
      const replaceIndex = currentImages.findIndex((img) => img.url === replaceUrl);

      if (replaceIndex !== -1) {
        const originalImage = currentImages[replaceIndex];

        // Optimistically update UI
        currentImages[replaceIndex] = { id: temporaryId, file, isExisting: false };
        setValue("images", currentImages, { shouldValidate: true });

        try {
          await editProductImages(
            {
              id: product.id,
              data: {
                image: file,
                url: replaceUrl,
              },
            },
            {
              onSuccess: (response) => {
                toast.success("Image replaced successfully");
                // Update with actual URL from response
                if (response?.data.items) {
                  const currentImages = [...images];
                  currentImages[replaceIndex] = {
                    id: temporaryId,
                    url: response.data.items[replaceIndex],
                    isExisting: true,
                  } as any;
                  setValue("images", currentImages, { shouldValidate: true });
                }
              },
              onError: () => {
                // Revert to original image on error
                currentImages[replaceIndex] = originalImage;
                setValue("images", currentImages, { shouldValidate: true });
                toast.error("Failed to replace image");
              },
            },
          );
        } catch {
          // Revert to original image on error
          currentImages[replaceIndex] = originalImage;
          setValue("images", currentImages, { shouldValidate: true });
          toast.error("Failed to replace image");
        }
      }
      return;
    }

    // Adding new images (not replacing)
    const MAX = 5;
    const currentImages = [...images];

    if (currentImages.length >= MAX) {
      toast.error(`Maximum ${MAX} images allowed`);
      return;
    }

    const newImage = { id: temporaryId, file, isExisting: false };

    // Optimistically add to UI
    const updatedImages = [...currentImages, newImage];
    setValue("images", updatedImages, { shouldValidate: true });

    // Note: Backend should handle adding images without URL parameter
    // For now, we'll keep the image in the UI until the full form is submitted
    // or implement a separate "add image" endpoint that doesn't require URL
    toast.info("Image will be uploaded when you save the product");
  };

  const handleEditImage = (id: string) => {
    const imageToEdit = images.find((img) => img.id === id);
    if (imageToEdit?.url) {
      setImageToReplace({ id, url: imageToEdit.url });
      replaceInputReference.current?.click();
    } else {
      toast.error("Cannot replace unsaved images");
    }
  };

  const handleReplaceImageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (imageToReplace) {
      handleImageUpload(event.target.files, imageToReplace.url);
      setImageToReplace(null);
    }
    if (event.target) event.target.value = "";
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(event.target.files);
    if (event.target) event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleImageUpload(event.dataTransfer.files);
  };

  const handleRemoveImage = async (id: string) => {
    const toRemove = images.find((img) => img.id === id);

    // Optimistically update UI
    const next = images.filter((img) => img.id !== id);
    setValue("images", next, { shouldValidate: true });

    // If the removed image was selected, clear the selection
    if (selectedImageId === id) {
      setSelectedImageId(null);
    }

    // If it's an existing image (has URL), delete from backend
    if (toRemove?.url && toRemove.isExisting) {
      try {
        await deleteProductImage(
          { id: product.id, url: toRemove.url },
          {
            onError: () => {
              // Revert optimistic update on error
              setValue("images", images, { shouldValidate: true });
              toast.error("Failed to delete image");
            },
          },
        );
        toast.success("Image deleted successfully");
      } catch {
        // Revert on error
        setValue("images", images, { shouldValidate: true });
        toast.error("Failed to delete image");
      }
    }
  };

  const handleImageSelect = (id: string) => {
    setSelectedImageId(id);
  };

  const handleSuccessModalConfirm = () => {
    setShowSuccessModal(false);
    onSuccess?.();
  };

  const handleSubmitForm = async (data: EditProductFormData) => {
    try {
      // Only submit text fields, images are handled separately
      const submitData: EditProductFormData = {
        name: data.name,
        price: data.price,
        discountPrice: data.discountPrice,
        description: data.description,
        stockCount: data.stockCount,
        status: data.status,
        // Don't include images in main update
      };

      editProduct(
        { id: product.id, data: submitData },
        {
          onSuccess: (response) => {
            if (response?.success) {
              setShowSuccessModal(true);
            } else {
              toast.error("Failed to update product");
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
        title="Edit Product"
        subtitle={`Edit the product ${product.name}`}
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
                    url={
                      selectedImageId
                        ? images.find((img) => img.id === selectedImageId)?.url || images[0].url
                        : images[0].url
                    }
                    onRemove={handleRemoveImage}
                    onEdit={handleEditImage}
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
                    <p className="text-[10px] text-gray-500">Supports: JPG, PNG, WEBP (Max 5 images)</p>
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
                          url={image.url}
                          onRemove={handleRemoveImage}
                          onEdit={handleEditImage}
                          onClick={handleImageSelect}
                          isSelected={selectedImageId === image.id}
                        />
                      ))}
                      {images.length < 5 && (
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
                          src={activeItem.file ? URL.createObjectURL(activeItem.file) : activeItem.url || ""}
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
              <input
                ref={replaceInputReference}
                type="file"
                className="hidden"
                onChange={handleReplaceImageInputChange}
                accept="image/*"
              />
            </div>
          </section>

          {/* Form fields section - appears second on mobile, left column on desktop */}
          <section className="order-2 space-y-4 lg:order-1 lg:col-span-6">
            <FormField placeholder="Enter name" className="h-14 w-full" label="Product Name" name="name" />
            <div className="grid grid-cols-3 gap-4">
              <FormField placeholder="0.00" className="h-14 w-full" label="Price" name="price" type="number" />
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
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                placeholder="1"
                className="h-14 w-full"
                label="Weight (kg)"
                name="weight"
                type="number"
                disabled
              />
              <FormField
                placeholder="Select"
                className="!h-14 w-full"
                label="Fragile"
                name="fragile"
                type="select"
                disabled
                options={[
                  { value: "false", label: "No" },
                  { value: "true", label: "Yes" },
                ]}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[16px] font-medium">Product Description</Label>
              <div>
                <Editor
                  key={`editor-${product.id}-${product.description}`}
                  editorSerializedState={descriptionEditorState}
                  onSerializedChange={(value) => {
                    setDescriptionEditorState(value);
                    // Persist rich text as Lexical serialized JSON string
                    setValue("description", JSON.stringify(value), { shouldValidate: true });
                  }}
                />
              </div>
            </div>
            {/* <FormField
              placeholder="Select Category"
              className="!h-14 w-full"
              label="Product Category"
              name="category"
              type={`select`}
              options={productCategories?.data.map((category) => ({
                value: category,
                label: category
                  .replaceAll(/([A-Z])/g, " $1") // Add space before capital letters
                  .replace(/^./, (string_) => string_.toUpperCase()) // Capitalize first letter
                  .trim(), // Remove leading/trailing spaces
              }))}
            /> */}
            <FormField
              placeholder="Select Status"
              className="!h-14 w-full"
              label="Product Status"
              name="status"
              type={`select`}
              options={[
                { value: "published", label: "Published" },
                { value: "draft", label: "Draft" },
              ]}
            />
            <div className="flex gap-4 pt-4">
              <MainButton type="button" variant="outline" onClick={onCancel} className="flex-1" size="xl">
                Cancel
              </MainButton>
              <MainButton
                type="submit"
                variant="primary"
                isDisabled={isEditingProduct || isEditingImages || isDeletingImage}
                isLoading={isEditingProduct}
                className="flex-1"
                size="xl"
              >
                Update Product
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
        title="Product Updated Successfully!"
        description="Your product has been updated and the changes are now live in your store."
        confirmText="Continue"
        showCancelButton={false}
        autoClose={false}
      />
    </section>
  );
};

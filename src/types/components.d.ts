/**
 * Component prop interfaces for the Ski Shop application
 */

import { ChangeEventHandler, FocusEventHandler, HTMLAttributes, MouseEventHandler, ReactNode } from "react";

declare global {
  // ============================================================================
  // UI COMPONENT INTERFACES
  // ============================================================================

  /** Logo component properties */
  interface LogoProperties {
    logo: string;
    width?: number;
    height?: number;
    className?: string;
    alt?: string;
    href?: string;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
  }

  /** Input field properties */
  interface InputProperties {
    label?: string;
    isRequired?: boolean;
    state?: "default" | "primary" | "error";
    name?: string;
    placeholder: string;
    type?: string;
    value?: string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    onFocus?: FocusEventHandler<HTMLInputElement>;
    isDisabled?: boolean;
    className?: string;
    helpText?: string;
    validate?: (value: string) => boolean;
  }

  /** Form field properties */
  interface FormFieldProperties {
    label?: string;
    labelDetailedNode?: ReactNode;
    name: string;
    type?: "text" | "textarea" | "select" | "number" | "password" | "email";
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    options?: Array<{ value: string; label: string }>;
    className?: string;
    containerClassName?: string;
    leftAddon?: ReactNode;
    rightAddon?: ReactNode;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }

  /** Button properties */
  interface ButtonProperties {
    type?: "submit" | "button" | "reset";
    variant?:
      | "default"
      | "primary"
      | "destructive"
      | "subtle"
      | "loading"
      | "outline"
      | "secondary"
      | "ghost"
      | "link"
      | "accent";
    size?: "default" | "sm" | "lg" | "xl" | "link" | "icon" | "circle";
    icon?: ReactNode;
    children?: ReactNode;
    isLoading?: boolean;
    isIconOnly?: boolean;
    isLeftIconVisible?: boolean;
    isRightIconVisible?: boolean;
    isDisabled?: boolean;
    ariaLabel?: string;
    href?: string;
    className?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
  }

  /** Navigation link structure */
  interface NavLink {
    id: number;
    title: string;
    href: string;
    type: "link" | "dropdown";
    subLinks?: Array<{
      id: number;
      title: string;
      href: string;
      description: string;
    }> | null;
  }

  /** Navbar component properties */
  interface NavbarProperties extends HTMLAttributes<HTMLDivElement> {
    logo?: ReactNode;
    links?: NavLink[];
    cta?: ReactNode;
    user?: ReactNode;
    sticky?: boolean;
    navbarStyle?: string;
  }

  /** Dashboard table column definition */
  interface TableColumnDefinition<T extends DataItem> {
    header: string;
    accessorKey: keyof T;
    render?: (value: T[keyof T], row: T) => ReactNode;
  }

  /** Dashboard table row action */
  interface TableRowAction<T> {
    label: string;
    icon?: ReactNode;
    onClick: (row: T) => void;
    /** Optional visual variant for the action item */
    variant?: "default" | "destructive";
  }

  /** Dashboard table properties */
  interface DashboardTableProperties<T extends DataItem> {
    data: T[];
    columns: TableColumnDefinition<T>[];
    totalPages?: number;
    itemsPerPage?: number;
    hasPreviousPage?: boolean;
    hasNextPage?: boolean;
    rowActions?: (row: T) => TableRowAction<T>[];
    onRowClick?: (row: T) => void;
    showPagination?: boolean;
  }

  /** Universal swiper properties */
  interface UniversalSwiperProperties {
    /** Array of items to render as slides */
    items: unknown[];
    /** Function to render each slide */
    renderItem: (item: unknown, index: number) => ReactNode;
    /** Swiper configuration options */
    swiperOptions?: SwiperOptions;
    /** Whether to show navigation buttons */
    showNavigation?: boolean;
    /** Whether to show pagination dots */
    showPagination?: boolean;
    /** Whether to show scrollbar */
    showScrollbar?: boolean;
    /** Navigation button variant */
    navigationVariant?: "default" | "minimal" | "none";
    /** Navigation button size */
    navigationSize?: number;
    /** Navigation button position offset */
    navigationOffset?: number;
    /** Custom className for the container */
    className?: string;
    /** Custom className for the swiper wrapper */
    swiperClassName?: string;
    /** Custom className for each slide */
    slideClassName?: string;
    /** Thumbs swiper instance for gallery pattern */
    thumbsSwiper?: SwiperType | null;
    /** Breakpoints configuration */
    breakpoints?: SwiperBreakpoints;
    /** Whether to enable free mode */
    freeMode?: boolean;
    /** Callback when swiper is initialized */
    onSwiperInit?: (swiper: SwiperType) => void;
  }

  /** Modal properties */
  interface ModalProperties {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
  }

  /** Alert modal properties */
  interface AlertModalProperties {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    type?: "success" | "warning" | "error" | "info";
    confirmText?: string;
    cancelText?: string;
  }

  /** Dialog content properties */
  interface DialogContentProperties extends React.ComponentProps<typeof DialogPrimitive.Content> {
    className?: string;
    children: ReactNode;
  }

  /** Tooltip properties */
  interface TooltipProperties {
    content: string;
    children: ReactNode;
    position?: "top" | "bottom" | "left" | "right";
    className?: string;
  }

  /** Pagination properties */
  interface PaginationProperties {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
  }

  /** Sidebar context properties */
  interface SidebarContextProperties {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
  }

  /** Chart context properties */
  interface ChartContextProperties {
    data: unknown[];
    options?: unknown;
  }

  /** Loading spinner properties */
  interface LoadingSpinnerProperties {
    size?: "sm" | "md" | "lg";
    className?: string;
  }

  /** File uploader properties */
  interface FileUploaderProperties extends React.HTMLAttributes<HTMLDivElement> {
    onFilesSelected: (files: File[]) => void;
    accept?: string;
    multiple?: boolean;
    maxFiles?: number;
    maxSize?: number;
    className?: string;
  }

  /** File card properties */
  interface FileCardProperties {
    file: File;
    onRemove: () => void;
    className?: string;
  }

  /** Search input properties */
  interface SearchInputProperties {
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
  }

  /** User avatar profile properties */
  interface UserAvatarProfileProperties {
    user?: {
      name?: string;
      email?: string;
      image?: string;
    };
    className?: string;
  }

  /** Wrapper properties */
  interface WrapperProperties extends HtmlHTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    className?: string;
  }

  /** Locale provider properties */
  interface LocaleProviderProperties {
    children: ReactNode;
  }

  /** Banner properties */
  interface BannerProperties extends HtmlHTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    className?: string;
  }

  /** Countdown timer properties */
  interface CountdownTimerProperties {
    endDate: Date;
    className?: string;
  }

  /** Empty state properties */
  interface EmptyStateProperties {
    title: string;
    description?: string;
    icon?: ReactNode;
    action?: ReactNode;
    className?: string;
  }

  /** Error boundary properties */
  interface ErrorBoundaryProperties {
    children: ReactNode;
    fallback?: ReactNode;
  }

  /** Loading context properties */
  interface LoadingContextProperties {
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
  }

  /** Loading provider properties */
  interface LoadingProviderProperties {
    children: ReactNode;
  }

  /** Currency context type */
  interface CurrencyContextType {
    selectedCurrency: string;
    availableCurrencies: Array<{
      code: string;
      symbol: string;
      name: string;
    }>;
  }

  /** Currency dropdown properties */
  interface CurrencyDropdownProperties {
    className?: string;
  }

  /** Component guard properties */
  interface ComponentGuardProperties {
    children: ReactNode;
    fallback?: ReactNode;
  }

  /** Mock service worker provider properties */
  interface MockServiceWorkerProviderProperties {
    children: ReactNode;
  }

  /** Cart button properties */
  interface CartButtonProperties {
    itemCount: number;
    onClick: () => void;
    className?: string;
  }

  /** Custom select properties */
  interface CustomSelectProperties {
    options: Array<{ value: string; label: string }>;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
  }

  /** Combo box properties */
  interface ComboBoxProperties {
    options: Array<{ value: string; label: string }>;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
  }

  /** Rating modal properties */
  interface RatingModalProperties {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => void;
    productId: string;
  }

  /** Ratings properties */
  interface RatingsProperties {
    rating: number;
    maxRating?: number;
    size?: "sm" | "md" | "lg";
    className?: string;
  }

  /** Locale link properties */
  interface LocaleLinkProperties extends Omit<LinkProps, "href"> {
    href: string;
    locale?: string;
    children: ReactNode;
  }

  /** Filter dropdown properties */
  interface FilterDropdownProperties {
    options: Array<{ value: string; label: string }>;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
  }

  /** Phone input properties */
  interface PhoneInputProperties extends Omit<React.ComponentProps<"input">, "onChange" | "value" | "ref"> {
    value: string;
    onChange: (value: string) => void;
    country?: string;
    className?: string;
  }

  /** Country select properties */
  interface CountrySelectProperties {
    value: string;
    onChange: (value: string) => void;
    className?: string;
  }

  /** Country select option properties */
  interface CountrySelectOptionProperties extends RPNInput.FlagProps {
    country: string;
    label: string;
  }

  /** Use countries options */
  interface UseCountriesOptions {
    includeFlags?: boolean;
  }

  /** Breadcrumb item */
  interface BreadcrumbItem {
    title: string;
    link: string;
  }

  /** Mock status interface */
  interface MockStatus {
    isEnabled: boolean;
    setIsEnabled: (enabled: boolean) => void;
  }

  // ============================================================================
  // COMPONENT SPECIFIC TYPES
  // ============================================================================

  /** Category item properties */
  interface CategoryItemProperties {
    category: {
      id: string;
      name: string;
      image: string;
    };
    className?: string;
  }

  /** Product card properties */
  interface ProductCardProperties {
    product: Product;
    className?: string;
  }

  /** Similar products properties */
  interface SimilarProductsProperties {
    productId: string;
    category: string;
    className?: string;
  }

  /** Product breadcrumb properties */
  interface ProductBreadcrumbProperties {
    product: Product;
    className?: string;
  }

  /** Order card properties */
  interface OrderCardProperties extends HTMLAttributes<HTMLDivElement> {
    order: Order;
    className?: string;
  }

  /** Shop card properties */
  interface ShopCardProperties extends HTMLAttributes<HTMLDivElement> {
    product: Product;
    className?: string;
  }

  /** Top bar properties */
  interface TopBarProperties {
    title: string;
    subtitle?: string;
    actions?: ReactNode;
    className?: string;
  }

  /** Overview properties */
  interface OverviewProperties {
    title: string;
    value: string | number;
    change?: number;
    icon?: ReactNode;
    className?: string;
  }

  /** Table properties */
  interface TableProperties<T extends DataItem> {
    data: T[];
    columns: TableColumnDefinition<T>[];
    className?: string;
  }

  /** Sortable image properties */
  interface SortableImageProperties {
    image: ProductImage;
    onRemove: (id: string) => void;
    onReorder: (fromIndex: number, toIndex: number) => void;
    index: number;
    className?: string;
  }

  /** Edit product form properties */
  interface EditProductFormProperties {
    product: Product;
    onSubmit: (data: EditProductFormData) => void;
    onCancel: () => void;
    className?: string;
  }

  /** Promote product modal properties */
  interface PromoteProductModalProperties {
    isOpen: boolean;
    onClose: () => void;
    productId: string;
    className?: string;
  }

  /** Product actions dropdown properties */
  interface ProductActionsDropdownProperties {
    product: Product;
    onEdit: () => void;
    onDelete: () => void;
    onPromote: () => void;
    className?: string;
  }

  /** Order table properties */
  interface OrderTableProperties {
    orders: Order[];
    className?: string;
  }

  /** Mobile order card properties */
  interface MobileOrderCardProperties {
    order: Order;
    className?: string;
  }

  /** Product order detail properties */
  interface ProductOrderDetailProperties {
    orderId: string;
    className?: string;
  }

  /** Selector properties */
  interface SelectorProperties {
    options: Array<{ value: string; label: string }>;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
  }

  /** Google map properties */
  interface GoogleMapProperties {
    center: Location;
    zoom: number;
    className?: string;
  }

  /** Strength properties */
  interface StrengthProperties {
    title: string;
    description: string;
    icon: ReactNode;
    className?: string;
  }

  /** Progress indicator properties */
  interface ProgressIndicatorProperties {
    currentStep: number;
    totalSteps: number;
    className?: string;
  }

  /** Onboarding layout properties */
  interface OnboardingLayoutProperties {
    children: ReactNode;
    currentStep: number;
    totalSteps: number;
    className?: string;
  }

  /** Locale layout properties */
  interface LocaleLayoutProperties {
    children: ReactNode;
    params: { locale: string };
  }

  /** Sidebar properties */
  interface SidebarProperties {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    className?: string;
  }

  /** Tab type */
  type Tab = "description" | "reviews";

  // ============================================================================
  // STORYBOOK TYPES
  // ============================================================================

  /** Story type for Storybook */
  type Story<T> = StoryObj<T>;
}

export {};

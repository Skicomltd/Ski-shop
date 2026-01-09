"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontal, MoreHorizontalIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import React from "react";

import SkiButton from "../button";
import { SetToolTip } from "../tool-tip";

export const DashboardTable = <T extends DataItem>({
  data,
  columns,
  totalPages = 1,
  // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
  itemsPerPage = 10,
  hasNextPage,
  hasPreviousPage,
  rowActions,
  onRowClick,
  showPagination = false,
  pageParameter = "page", // Allow custom page parameter name
}: IDashboardTableProperties<T> & { pageParameter?: string }) => {
  // Use nuqs directly for pagination (same approach as shop page)
  const [currentPage, setCurrentPage] = useQueryState(pageParameter, { defaultValue: "1" });

  const renderColumn = (column: IColumnDefinition<T>, item: T): React.ReactNode => {
    if (!column) return "N/A"; // Handle undefined column
    if (column.render) {
      return column.render(item[column.accessorKey ?? ""], item);
    }

    const value = item[column.accessorKey ?? ""];
    // Convert non-ReactNode values to strings
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "object" && !React.isValidElement(value)) {
      return JSON.stringify(value);
    }
    return String(value);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage.toString());
    window.scrollTo({ top: 0 });
  };

  // Convert currentPage string to number for comparisons
  const currentPageNumber = currentPage ? Number.parseInt(currentPage) : 1;

  return (
    <div className="w-full min-w-0 space-y-4">
      {/* Desktop Table View */}
      <div className="bg-background hidden h-full overflow-x-auto overflow-y-hidden lg:block">
        <Table>
          <TableHeader className={`bg-background`}>
            <TableRow className={`border-border/50`}>
              {columns.map((column, index) => (
                <TableHead key={index} className={`py-4 whitespace-nowrap`}>
                  {column.header}
                </TableHead>
              ))}
              {rowActions && <TableHead className="w-[50px]"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, rowIndex) => (
              <TableRow
                key={rowIndex}
                onClick={() => {
                  if (onRowClick) onRowClick(item);
                }}
                className={cn(
                  "border-border/30 text-mid-grey-II border-b",
                  onRowClick ? "hover:bg-primary/50 dark:hover:bg-low-purple cursor-pointer" : "",
                  "hover:bg-primary/10 !rounded-full text-base transition-all",
                )}
              >
                {columns.map((column, colIndex) => (
                  <TableCell key={`${rowIndex}-${colIndex}`} className={`py-4 align-middle`}>
                    <div className="max-w-[600px] min-w-0 break-words">{renderColumn(column, item)}</div>
                  </TableCell>
                ))}
                {rowActions && (
                  <TableCell>
                    <DropdownMenu>
                      <SetToolTip content={"More actions"}>
                        <DropdownMenuTrigger className={`p-2`}>
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </DropdownMenuTrigger>
                      </SetToolTip>
                      <DropdownMenuContent className={`bg-background`} align="end">
                        {rowActions(item).map((action: IRowAction<T>, actionIndex: number) => (
                          <DropdownMenuItem
                            key={actionIndex}
                            onClick={(event) => {
                              event.stopPropagation();
                              action.onClick(item);
                            }}
                            className={cn(action.variant === "destructive" && "text-destructive")}
                          >
                            {action.icon && <span className="mr-2">{action.icon}</span>}
                            {action.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {data.map((item, index) => (
          <div
            key={index}
            className={cn(
              "group border-default bg-card relative overflow-hidden rounded-lg p-5 transition-all",
              "hover:border-primary/50 hover:shadow-md",
              onRowClick && "cursor-pointer",
            )}
            onClick={() => {
              if (onRowClick) onRowClick(item);
            }}
            aria-label={`View details for item ${item.id || index}`}
          >
            {/* Card Header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-muted-foreground text-sm font-medium">{renderColumn(columns[0], item)}</div>
              </div>
              {rowActions && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="h-8 w-8 p-0" aria-label="Open menu">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className={`bg-background`} align="end">
                    {rowActions(item).map((action: IRowAction<T>, actionIndex: number) => (
                      <DropdownMenuItem
                        key={actionIndex}
                        onClick={(event) => {
                          event.stopPropagation();
                          action.onClick(item);
                        }}
                        className={cn(action.variant === "destructive" && "text-destructive")}
                      >
                        {action.icon && <span className="mr-2">{action.icon}</span>}
                        {action.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Card Content - Other columns */}
            <div className="grid grid-cols-2 gap-4">
              {columns.slice(1, -1).map((column, colIndex) => (
                <div key={colIndex} className="space-y-1">
                  <p className="text-muted-foreground/60 text-xs font-medium uppercase">{column.header}</p>
                  <div className="text-xs font-medium">{renderColumn(column, item)}</div>
                </div>
              ))}
              <span className={`text-xs`}>{columns.at(-1) ? renderColumn(columns.at(-1)!, item) : "N/A"}</span>
            </div>

            {/* Hover Effect Indicator */}
            {onRowClick && (
              <div className="bg-primary/50 absolute inset-x-0 bottom-0 h-0.5 rounded-md opacity-0 transition-opacity group-hover:opacity-100" />
            )}
          </div>
        ))}
      </div>

      {showPagination && (
        <div className="text-muted-foreground flex flex-col-reverse gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className={`flex items-center justify-between md:w-[50%]`}>
            <div>{10} Entries per page</div>
            <div>
              Page {currentPageNumber} of {totalPages}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SkiButton
              variant="primary"
              isLeftIconVisible
              size={`lg`}
              icon={<ChevronLeftIcon />}
              className={cn(currentPageNumber === 1 ? "opacity-50" : "", "w-full rounded-sm sm:w-[137px]")}
              onClick={() => {
                if (hasPreviousPage && currentPageNumber > 1) {
                  handlePageChange(currentPageNumber - 1);
                }
              }}
              isDisabled={!hasPreviousPage || currentPageNumber === 1}
            >
              Previous
            </SkiButton>
            <SkiButton
              variant="primary"
              isRightIconVisible
              size={`lg`}
              icon={<ChevronRightIcon />}
              className={cn(currentPageNumber === totalPages ? "opacity-50" : "", "w-full rounded-sm sm:w-[137px]")}
              onClick={() => {
                if (hasNextPage && currentPageNumber < totalPages) {
                  handlePageChange(currentPageNumber + 1);
                }
              }}
              isDisabled={!hasNextPage || currentPageNumber === totalPages}
            >
              Next
            </SkiButton>
          </div>
        </div>
      )}
    </div>
  );
};

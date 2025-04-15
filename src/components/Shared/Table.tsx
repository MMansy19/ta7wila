"use client"
import { ReactNode } from "react";

export interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  title?: string;
  emptyMessage?: string;
  className?: string;
  rowClassName?: string;
  headerClassName?: string;
  cellClassName?: string;
  keyExtractor?: (item: T) => string | number;
}

export default function Table<T>({
  data,
  columns,
  title,
  emptyMessage = "No data available",
  className = "",
  rowClassName = "transition rounded-lg border-b border-white/10",
  headerClassName = "text-white bg-[#161616]",
  cellClassName = "px-2 py-4",
  keyExtractor = (item: any) => item.id || Math.random().toString(),
}: TableProps<T>) {
  return (
    <div className="grid">
      <div className={`flex overflow-hidden flex-col px-4 py-3 w-full bg-[#1F1F1F] rounded-lg max-md:max-w-full min-h-80 ${className}`}>
        {title && <h2 className="text-2xl px-2 py-2 font-bold mb-2">{title}</h2>}
        <div className="overflow-x-auto">
          <table className="w-full text-start">
            <thead>
              <tr className={headerClassName}>
                {columns.map((column, index) => (
                  <th key={index} className="p-2 text-start">
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr key={keyExtractor(item)} className={rowClassName}>
                    {columns.map((column, index) => (
                      <td key={index} className={`${cellClassName} ${column.className || ""}`}>
                        {typeof column.accessor === "function"
                          ? column.accessor(item)
                          : item[column.accessor] || "-"}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center p-2">
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 
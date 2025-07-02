"use client"
import { ReactNode } from "react";

export interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode | string | number);
  className?: string;
  icon?: ReactNode;
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
  keyExtractorAction?: (item: T) => string | number;
}

export default function Table<T>({
  data,
  columns,
  title,
  emptyMessage = "No data available",
  className = "",
  rowClassName = "group transition-all duration-200 hover:bg-gradient-to-r hover:from-[#2A2A2A] hover:to-[#1F1F1F] border-b border-white/5 hover:border-white/10",
  headerClassName = "text-white/90 bg-gradient-to-r from-[#2A2A2A] to-[#1F1F1F] backdrop-blur-sm",
  cellClassName = "px-4 py-4 text-sm",
  keyExtractorAction = (item: any) => item.id || Math.random().toString(),
}: TableProps<T>) {

  return (
    <div className="grid">
      <div className={`flex overflow-hidden flex-col p-6 w-full bg-gradient-to-br from-[#1F1F1F] via-[#252525] to-[#1A1A1A] rounded-2xl shadow-2xl border border-white/5 backdrop-blur-lg max-md:max-w-full min-h-80 ${className}`}>
        {title && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-2">
              {title}
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-[#53B4AB] to-[#F58C7B] rounded-full"></div>
          </div>
        )}
        
        <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="overflow-x-auto">
            <table className="w-full">
            <thead>
              <tr className={headerClassName}>
                {columns.map((column, index) => (
                    <th key={index} className="px-4 py-4 text-right font-semibold text-sm tracking-wide border-b border-white/10 first:rounded-tl-xl last:rounded-tr-xl">
                      <div className="flex items-center justify-end gap-2 min-h-[24px]">
                        {column.icon && (
                          <span className="text-[#53B4AB] opacity-80">
                            {column.icon}
                          </span>
                        )}
                        <span>{column.header}</span>
                      </div>
                  </th>
                ))}
              </tr>
            </thead>
              <tbody className="divide-y divide-white/5">
              {data.length > 0 ? (
                  data.map((item, rowIndex) => (
                    <tr key={keyExtractorAction(item)} className={`${rowClassName} ${rowIndex === data.length - 1 ? 'last:rounded-b-xl' : ''}`}>
                    {columns.map((column, index) => (
                        <td key={index} className={`${cellClassName} ${column.className || ""} text-right group-hover:text-white/90 transition-colors duration-200`}>
                          <div className="flex items-center justify-end">
                        {typeof column.accessor === "function"
                          ? column.accessor(item)
                          : String(item[column.accessor] || "-")}
                          </div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan={columns.length} className="text-center py-12 text-white/60">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                          <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H6a1 1 0 00-1 1v1m16 0H4"></path>
                          </svg>
                        </div>
                        <span className="text-sm font-medium">{emptyMessage}</span>
                      </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  );
} 
"use client";

import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Eye, Edit, Trash2, Download } from "lucide-react";

export interface DataTableColumn<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

export interface FilterOption {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  searchPlaceholder?: string;
  filterOptions?: FilterOption[];
  onRowClick?: (row: T) => void;
  actions?: {
    onView?: (row: T) => void;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
  };
}

export default function DataTable<T extends { id: string }>({
  columns,
  data,
  searchPlaceholder = "Search...",
  filterOptions = [],
  onRowClick,
  actions,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Filter data
  let filteredData = data.filter((row) => {
    // Search filter
    const searchLower = searchQuery.toLowerCase();
    if (searchLower) {
      const matchesSearch = columns.some((col) => {
        const value = (row as any)[col.key];
        return value && String(value).toLowerCase().includes(searchLower);
      });
      if (!matchesSearch) return false;
    }

    // Custom filters
    for (const [key, value] of Object.entries(filters)) {
      if (value && (row as any)[key] !== value) {
        return false;
      }
    }

    return true;
  });

  // Sort data
  if (sortKey) {
    filteredData = [...filteredData].sort((a, b) => {
      const aVal = (a as any)[sortKey];
      const bVal = (b as any)[sortKey];
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map((row) => row.id)));
    }
  };

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: "var(--ink-faint)" }}
          />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--rule)",
              color: "var(--ink)",
            }}
          />
        </div>
        {filterOptions.map((filter) => (
          <select
            key={filter.key}
            value={filters[filter.key] || ""}
            onChange={(e) => {
              setFilters({ ...filters, [filter.key]: e.target.value });
              setCurrentPage(1);
            }}
            className="px-4 py-2.5 rounded-xl border"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--rule)",
              color: "var(--ink)",
            }}
          >
            <option value="">{filter.label}</option>
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}
      </div>

      {/* Bulk Actions */}
      {selectedRows.size > 0 && (
        <div
          className="flex items-center justify-between p-3 rounded-xl border"
          style={{ backgroundColor: "var(--navy-50)", borderColor: "var(--navy)" }}
        >
          <span className="text-sm font-semibold" style={{ color: "var(--navy)" }}>
            {selectedRows.size} selected
          </span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:opacity-70"
              style={{ backgroundColor: "var(--surface)", color: "var(--ink)" }}
            >
              <Download className="w-4 h-4 inline mr-1" />
              Export
            </button>
            <button
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:opacity-70"
              style={{ backgroundColor: "#FEE2E2", color: "#DC2626" }}
            >
              <Trash2 className="w-4 h-4 inline mr-1" />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border" style={{ borderColor: "var(--rule)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: "var(--surface)", borderBottom: "1px solid var(--rule)" }}>
              <th className="p-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: "var(--navy)" }}
                />
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="p-4 text-left text-sm font-semibold cursor-pointer hover:opacity-70"
                  style={{ color: "var(--ink)" }}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  {col.label}
                  {sortKey === col.key && <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>}
                </th>
              ))}
              {actions && (
                <th className="p-4 text-left text-sm font-semibold" style={{ color: "var(--ink)" }}>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr
                key={row.id}
                className="transition-all cursor-pointer"
                style={{
                  backgroundColor: index % 2 === 0 ? "var(--bg)" : "var(--surface)",
                  borderBottom: "1px solid var(--rule)",
                }}
                onClick={() => onRowClick?.(row)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(30, 58, 138, 0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = index % 2 === 0 ? "var(--bg)" : "var(--surface)";
                }}
              >
                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedRows.has(row.id)}
                    onChange={() => handleSelectRow(row.id)}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: "var(--navy)" }}
                  />
                </td>
                {columns.map((col) => (
                  <td key={col.key} className="p-4 text-sm" style={{ color: "var(--ink-muted)" }}>
                    {col.render ? col.render(row) : String((row as any)[col.key] || "")}
                  </td>
                ))}
                {actions && (
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-2">
                      {actions.onView && (
                        <button
                          onClick={() => actions.onView!(row)}
                          className="p-2 rounded-lg transition-all hover:scale-110"
                          style={{ backgroundColor: "var(--navy-50)", color: "var(--navy)" }}
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {actions.onEdit && (
                        <button
                          onClick={() => actions.onEdit!(row)}
                          className="p-2 rounded-lg transition-all hover:scale-110"
                          style={{ backgroundColor: "var(--gold-50)", color: "#92600A" }}
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {actions.onDelete && (
                        <button
                          onClick={() => actions.onDelete!(row)}
                          className="p-2 rounded-lg transition-all hover:scale-110"
                          style={{ backgroundColor: "#FEE2E2", color: "#DC2626" }}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {paginatedData.map((row) => (
          <div
            key={row.id}
            className="p-4 rounded-xl border"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--rule)" }}
          >
            <div className="flex items-start gap-3 mb-3">
              <input
                type="checkbox"
                checked={selectedRows.has(row.id)}
                onChange={() => handleSelectRow(row.id)}
                className="w-4 h-4 rounded mt-1"
                style={{ accentColor: "var(--navy)" }}
              />
              <div className="flex-1">
                {columns.slice(0, 3).map((col) => (
                  <div key={col.key} className="mb-2">
                    <span className="text-xs font-semibold" style={{ color: "var(--ink-muted)" }}>
                      {col.label}:{" "}
                    </span>
                    <span className="text-sm" style={{ color: "var(--ink)" }}>
                      {col.render ? col.render(row) : String((row as any)[col.key] || "")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {actions && (
              <div className="flex gap-2 pt-2 border-t" style={{ borderColor: "var(--rule)" }}>
                {actions.onView && (
                  <button
                    onClick={() => actions.onView!(row)}
                    className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{ backgroundColor: "var(--navy-50)", color: "var(--navy)" }}
                  >
                    View
                  </button>
                )}
                {actions.onEdit && (
                  <button
                    onClick={() => actions.onEdit!(row)}
                    className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{ backgroundColor: "var(--gold-50)", color: "#92600A" }}
                  >
                    Edit
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: "var(--ink-muted)" }}>
            Rows per page:
          </span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 rounded-lg border"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--rule)", color: "var(--ink)" }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm" style={{ color: "var(--ink-muted)" }}>
            Showing {startIndex + 1}-{Math.min(startIndex + pageSize, filteredData.length)} of {filteredData.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg border transition-all disabled:opacity-40"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--rule)", color: "var(--ink)" }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
            .map((page, index, arr) => (
              <>
                {index > 0 && arr[index - 1] !== page - 1 && (
                  <span key={`ellipsis-${page}`} style={{ color: "var(--ink-muted)" }}>
                    ...
                  </span>
                )}
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className="px-3 py-1.5 rounded-lg border transition-all"
                  style={{
                    backgroundColor: currentPage === page ? "var(--navy)" : "var(--surface)",
                    borderColor: currentPage === page ? "var(--navy)" : "var(--rule)",
                    color: currentPage === page ? "white" : "var(--ink)",
                  }}
                >
                  {page}
                </button>
              </>
            ))}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg border transition-all disabled:opacity-40"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--rule)", color: "var(--ink)" }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useMemo } from "react";
import {
  AttendanceStatusFilter,
  MonitorAttendanceItem,
  MonitorStats,
} from "@/presentation/views/monitoring-presensi/types";
import {
  downloadCsv,
  downloadExcel,
  printOrDownloadPdf,
  buildExportFileName,
} from "@/utils/export.util";

interface UseLiveMonitorProps {
  initialData?: MonitorAttendanceItem[];
  initialDate?: string;
  divisions?: { id: string; name: string }[];
  defaultItemsPerPage?: number;
}

export function useLiveMonitor({
  initialData = [],
  initialDate,
  divisions = [],
  defaultItemsPerPage = 10,
}: UseLiveMonitorProps = {}) {
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [items, setItems] = useState<MonitorAttendanceItem[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState(initialDate || getTodayString());
  const [statusFilter, setStatusFilter] =
    useState<AttendanceStatusFilter>("ALL");
  const [selectedDetail, setSelectedDetail] =
    useState<MonitorAttendanceItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);

  const handleSearchQueryChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleDivisionFilterChange = (val: string) => {
    setDivisionFilter(val);
    setCurrentPage(1);
  };

  const handleDateFilterChange = (val: string) => {
    setDateFilter(val);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (val: AttendanceStatusFilter) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (val: number) => {
    setItemsPerPage(val);
    setCurrentPage(1);
  };

  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return items.filter((item) => {
      if (dateFilter && item.date && item.date !== dateFilter) {
        return false;
      }

      if (divisionFilter !== "ALL" && item.divisionId !== divisionFilter) {
        return false;
      }

      if (statusFilter === "ON_TIME" && item.status !== "on_time") {
        return false;
      }
      if (statusFilter === "LATE" && item.status !== "late") {
        return false;
      }
      if (statusFilter === "NOT_CHECKED_OUT" && item.timeOut) {
        return false;
      }

      if (q) {
        const matchName = item.userName?.toLowerCase().includes(q);
        const matchNik = item.userNik?.toLowerCase().includes(q);
        const matchEmail = item.userEmail?.toLowerCase().includes(q);
        const matchDiv = item.divisionName?.toLowerCase().includes(q);
        if (!matchName && !matchNik && !matchEmail && !matchDiv) {
          return false;
        }
      }

      return true;
    });
  }, [items, searchQuery, divisionFilter, dateFilter, statusFilter]);

  // Derived pagination info
  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Ensure current page doesn't exceed totalPages
  const activePage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (activePage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, activePage, itemsPerPage]);

  const goToPage = (page: number) => {
    const target = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(target);
  };

  const nextPage = () => {
    if (activePage < totalPages) {
      goToPage(activePage + 1);
    }
  };

  const prevPage = () => {
    if (activePage > 1) {
      goToPage(activePage - 1);
    }
  };

  const stats: MonitorStats = useMemo(() => {
    const listForDate = dateFilter
      ? items.filter((it) => it.date === dateFilter)
      : items;

    const total = listForDate.length;
    const onTime = listForDate.filter((it) => it.status === "on_time").length;
    const late = listForDate.filter((it) => it.status === "late").length;
    const notCheckedOut = listForDate.filter((it) => !it.timeOut).length;

    return { total, onTime, late, notCheckedOut };
  }, [items, dateFilter]);

  const handleDownloadAll = (format: "excel" | "csv" | "pdf" = "excel") => {
    const headers = [
      "No",
      "NIK",
      "Nama Karyawan",
      "Email",
      "Divisi",
      "Tanggal",
      "Jam Masuk",
      "Jam Pulang",
      "Durasi Kerja",
      "Status Kehadiran",
    ];

    const rows = filteredItems.map((item, index) => [
      index + 1,
      item.userNik || "-",
      item.userName || "-",
      item.userEmail || "-",
      item.divisionName || "-",
      item.date || "-",
      item.timeIn || "-",
      item.timeOut || "Belum Checkout",
      item.workDurationLabel || "-",
      item.status === "on_time" ? "Tepat Waktu" : "Terlambat",
    ]);

    const activeDivision = divisions.find((d) => d.id === divisionFilter);
    const divisionName = activeDivision ? activeDivision.name : divisionFilter;

    const baseFilename = buildExportFileName({
      dateFilter,
      divisionName,
      statusFilter,
    });

    const reportTitle = "Laporan Rekapitulasi Presensi Karyawan";
    const reportSubtitle = `Periode: ${dateFilter || "Semua Tanggal"} | Divisi: ${divisionName === "ALL" ? "Semua Divisi" : divisionName || "Semua Divisi"} | Total: ${filteredItems.length} Data`;

    if (format === "excel") {
      downloadExcel(baseFilename, reportTitle, reportSubtitle, headers, rows);
    } else if (format === "pdf") {
      printOrDownloadPdf(reportTitle, reportSubtitle, headers, rows);
    } else {
      downloadCsv(baseFilename, headers, rows);
    }
  };

  const handleDownloadSingle = (
    item: MonitorAttendanceItem,
    format: "excel" | "csv" | "pdf" = "csv",
  ) => {
    const headers = [
      "NIK",
      "Nama Karyawan",
      "Email",
      "Divisi",
      "Tanggal",
      "Jam Masuk",
      "Jam Pulang",
      "Durasi Kerja",
      "Status Kehadiran",
    ];

    const rows = [
      [
        item.userNik || "-",
        item.userName || "-",
        item.userEmail || "-",
        item.divisionName || "-",
        item.date || "-",
        item.timeIn || "-",
        item.timeOut || "Belum Checkout",
        item.workDurationLabel || "-",
        item.status === "on_time" ? "Tepat Waktu" : "Terlambat",
      ],
    ];

    const safeName = (item.userName || "karyawan")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_");
    const baseFilename = `Presensi_${safeName}_${item.date}`;
    const reportTitle = `Detail Presensi Karyawan - ${item.userName}`;
    const reportSubtitle = `Tanggal: ${item.date} | Divisi: ${item.divisionName || "Tanpa Divisi"}`;

    if (format === "excel") {
      downloadExcel(baseFilename, reportTitle, reportSubtitle, headers, rows);
    } else if (format === "pdf") {
      printOrDownloadPdf(reportTitle, reportSubtitle, headers, rows);
    } else {
      downloadCsv(baseFilename, headers, rows);
    }
  };

  const openDetail = (item: MonitorAttendanceItem) => {
    setSelectedDetail(item);
    setIsDetailModalOpen(true);
  };

  const closeDetail = () => {
    setSelectedDetail(null);
    setIsDetailModalOpen(false);
  };

  return {
    items,
    setItems,
    filteredItems,
    paginatedItems,
    // Pagination
    currentPage: activePage,
    setCurrentPage: goToPage,
    totalPages,
    totalItems,
    itemsPerPage,
    setItemsPerPage: handleItemsPerPageChange,
    goToPage,
    nextPage,
    prevPage,
    // Stats & Filters
    stats,
    searchQuery,
    setSearchQuery: handleSearchQueryChange,
    divisionFilter,
    setDivisionFilter: handleDivisionFilterChange,
    dateFilter,
    setDateFilter: handleDateFilterChange,
    statusFilter,
    setStatusFilter: handleStatusFilterChange,
    selectedDetail,
    isDetailModalOpen,
    openDetail,
    closeDetail,
    handleDownloadAll,
    handleDownloadSingle,
  };
}

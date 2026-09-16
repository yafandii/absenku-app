import { useState, useMemo } from "react";
import {
  AttendanceStatusFilter,
  MonitorAttendanceItem,
  MonitorStats,
} from "../types";
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
}

export function useLiveMonitor({
  initialData = [],
  initialDate,
  divisions = [],
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
    stats,
    searchQuery,
    setSearchQuery,
    divisionFilter,
    setDivisionFilter,
    dateFilter,
    setDateFilter,
    statusFilter,
    setStatusFilter,
    selectedDetail,
    isDetailModalOpen,
    openDetail,
    closeDetail,
    handleDownloadAll,
    handleDownloadSingle,
  };
}

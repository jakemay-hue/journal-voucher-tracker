import { useState, useEffect } from "react";

export default function JournalVoucherTracker() {
  const STORAGE_KEY = "jv-tracker-entries";

  const [entries, setEntries] = useState<any[]>([]);
  const [form, setForm] = useState({
    date: "",
    jv: "",
    description: "",
    debit: "",
    credit: "",
    preparer: "",
    status: "Pending",
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const addEntry = () => {
    if (!form.jv || !form.date) return;
    setEntries([...entries, { ...form, id: crypto.randomUUID() }]);
    setForm({
      date: "",
      jv: "",
      description: "",
      debit: "",
      credit: "",
      preparer: "",
      status: "Pending",
    });
  };

  const exportToExcel = () => {
    const headers = [
      "Date",
      "JV #",
      "Description",
      "Debit",
      "Credit",
      "Preparer",
      "Status",
    ];

    const rows = entries.map(e => [
      e.date,
      e.jv,
      e.description,
      e.debit,
      e.credit,
      e.preparer,
      e.status,
    ]);

    const csv = [headers, ...rows]
      .map(r => r.map(v => `"${v ?? ""}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Journal_Voucher_Tracker_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: "auto" }}>
      <h1>Journal Voucher Entry Tracker</h1>

      <button onClick={exportToExcel}>Export to Excel</button>

      <div style={{ marginTop: 16 }}>
        <input type="date" value={form.date}
          onChange={e => setForm({ ...form, date: e.target.value })} />
        <input placeholder="JV #" value={form.jv}
          onChange={e => setForm({ ...form, jv: e.target.value })} />

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const STORAGE_KEY = "jv-tracker-entries";

export default function JournalVoucherTracker() {
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

  // Load saved entries
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  // Save entries automatically
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

  const approveEntry = (id: string) => {
    setEntries(entries.map(e => e.id === id ? { ...e, status: "Approved" } : e));
  };

  const exportToExcel = () => {
    const headers = ["Date", "JV #", "Description", "Debit", "Credit", "Preparer", "Status"];
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
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Journal Voucher Entry Tracker</h1>
        <Button variant="outline" onClick={exportToExcel}>
          Export to Excel
        </Button>
      </div>

      <Card>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
          <Input
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
          />
          <Input
            placeholder="JV #"
            value={form.jv}
            onChange={e => setForm({ ...form, jv: e.target.value })}
          />
          <Input
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
          <Input
            placeholder="Debit"
            value={form.debit}
            onChange={e => setForm({ ...form, debit: e.target.value })}
          />
          <Input
            placeholder="Credit"
            value={form.credit}
            onChange={e => setForm({ ...form, credit: e.target.value })}
          />
          <Input
            placeholder="Preparer"
            value={form.preparer}
            onChange={e => setForm({ ...form, preparer: e.target.value })}
          />

          <Button className="col-span-2 md:col-span-4" onClick={addEntry}>
            Add Journal Voucher
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {entries.map(e => (
          <Card key={e.id}>
            <CardContent className="flex justify-between p-4">
              <div>
                <div className="font-medium">
                  JV #{e.jv} – {e.date}
                </div>
                <div className="text-sm text-muted-foreground">
                  {e.description}
                </div>
                <div className="text-sm">
                  Debit: ${e.debit} | Credit: ${e.credit}
                </div>
                <div className="text-sm">Preparer: {e.preparer}</div>
              </div>

              <div className="flex items-center gap-2">
                <Badge>{e.status}</Badge>
                {e.status !== "Approved" && (
                  <Button size="sm" onClick={() => approveEntry(e.id)}>
                    Approve
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        Entries auto-save in your browser and can be exported to Excel for audit
        or month-end support.
      </p>
    </div>
  );
}

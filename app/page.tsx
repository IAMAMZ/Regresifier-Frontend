'use client'

import Button from "@/components/Button";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [xColumns, setXColumns] = useState<string[]>([]);
  const [ySelectOptions,setySelectOptions] = useState<string[]>([]);
  const [yColumn, setYColumn] = useState<string>('');
  const [equation, setEquation] = useState<string>('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) return;
    try {
      const data = new FormData();
      data.set("file", file);

      const res = await fetch("http://localhost:8000/api/uploadCSV", {
        method: "POST",
        body: data,
        credentials:"include",
         headers: {
          'X-Requested-With': 'XMLHttpRequest',
        }
      });

      // handle error
      if (!res.ok) throw new Error(await res.text());

      const result = await res.json();
      setColumns(result.columns);

    } catch (e: any) {
      console.error(e);
    }
  }

  const runRegression = async () => {
    if (xColumns.length === 0 || !yColumn) {
      alert("Please select X and Y variables");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/runRegression", {
        method: "POST",
        credentials:"include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ x_columns: xColumns, y_column: yColumn })
      });

      if (!res.ok) throw new Error(await res.text());

      const result = await res.json();
      setEquation(result.equation);

    } catch (e: any) {
      console.error(e);
    }
  }

  const handleXColumnChange = (column: string) => {
    setXColumns(prev => 
      prev.includes(column) 
        ? prev.filter(c => c !== column) 
        : [...prev, column]
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-10 p-24">
      <div>
        <p>Welcome to Regressifier, where you can quickly run a least squares Linear Regression from your csv file</p>
      </div>
      <form onSubmit={onSubmit}>
        <input
          type="file"
          name="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <Button type="submit" label="Upload" className="text-white" />
      </form>
      {columns.length > 0 && (
        <div>
          <h2 className="font-bold text-xl">Select Variables:</h2>
          <div className="flex items-center gap-4 mt-2">
            <h3 className="font-bold text-lg">X Variables:</h3>
            {columns.map((column, index) => (
              <div className="flex gap-4">
              <label key={index}>
                <input
                  type="checkbox"
                  className="scale-110 mr-2 "
                  checked={xColumns.includes(column)}
                  onChange={() => handleXColumnChange(column)}
                />
                {column}
              </label>
              </div>
            ))}
          </div>
          <div className="flex gap-8 mt-3">
            <h3 className="font-bold">Y Variable:</h3>
            <select value={yColumn} onChange={(e) => setYColumn(e.target.value)}>
              <option value="">Select Y Variable</option>
              {columns.map((column, index) => (
                <option key={index} value={column}>{column}</option>
              ))}
            </select>
          </div>
          <button className="bg-slate-400 rounded-sm p-2 text-white mt-4" onClick={runRegression}>Run Regression</button>
        </div>
      )}
      {equation && (
        <div>
          <h2>Regression Equation:</h2>
          <p>{equation}</p>
        </div>
      )}
    </main>
  );
}
'use client'

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [xColumns, setXColumns] = useState<string[]>([]);
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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form onSubmit={onSubmit}>
        <input
          type="file"
          name="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <input type="submit" value="Upload" />
      </form>
      {columns.length > 0 && (
        <div>
          <h2>Select Variables:</h2>
          <div>
            <h3>X Variables:</h3>
            {columns.map((column, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  checked={xColumns.includes(column)}
                  onChange={() => handleXColumnChange(column)}
                />
                {column}
              </label>
            ))}
          </div>
          <div>
            <h3>Y Variable:</h3>
            <select value={yColumn} onChange={(e) => setYColumn(e.target.value)}>
              <option value="">Select Y Variable</option>
              {columns.map((column, index) => (
                <option key={index} value={column}>{column}</option>
              ))}
            </select>
          </div>
          <button onClick={runRegression}>Run Regression</button>
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
'use client'

import { useState } from "react";

export default function Home() {

  const [file, setFile] = useState<File | null>(null);
  const [columns, setColumns] = useState<string[]>([]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) return;
    try {
      const data = new FormData();
      data.set("file", file);

      const res = await fetch("http://localhost:8000/api/uploadCSV", {
        method: "POST",
        body: data
      });

      // handle error
      if (!res.ok) throw new Error(await res.text());

      const result = await res.json();
      setColumns(result.columns);

    } catch (e: any) {
      console.error(e);
    }
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
          <h2>CSV Columns:</h2>
          <ul>
            {columns.map((column, index) => (
              <li key={index}>{column}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}

"use client"; // Enables client-side state and interactions
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [tool, setTool] = useState({ name: "", description: "", url: "" });
  const [tools, setTools] = useState([]);

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    const { data } = await supabase.from("tools").select("*");
    setTools(data || []);
  };

  const addTool = async (e) => {
    e.preventDefault();
    if (!tool.name || !tool.description || !tool.url) return;

    await supabase.from("tools").insert([tool]);
    setTool({ name: "", description: "", url: "" });
    fetchTools();
  };

  return (
    <div>
      <h1>Bug Bounty Tools</h1>
      <form onSubmit={addTool}>
        <input
          type="text"
          placeholder="Tool Name"
          value={tool.name}
          onChange={(e) => setTool({ ...tool, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={tool.description}
          onChange={(e) => setTool({ ...tool, description: e.target.value })}
          required
        />
        <input
          type="url"
          placeholder="Tool URL"
          value={tool.url}
          onChange={(e) => setTool({ ...tool, url: e.target.value })}
          required
        />
        <button type="submit">Add Tool</button>
      </form>

      <h2>Tools List</h2>
      <ul>
        {tools.map((t) => (
          <li key={t.id}>
            <a href={t.url} target="_blank" rel="noopener noreferrer">
              {t.name}
            </a>: {t.description}
          </li>
        ))}
      </ul>
    </div>
  );
}


import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "../Styles/AdminDashboard.css";

const chip = (label) => <span className="chip" key={label}>{label}</span>;

const AdminDashboard = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.body.className = "dashboard-body";
    return () => { document.body.className = ""; };
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      let q = supabase
        .from("ai_events_flat")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (profile !== "all") q = q.eq("profile", profile);
      const { data, error } = await q;
      if (error) {
        console.error("Dashboard load error:", error);
        setRows([]);
      } else {
        setRows(data || []);
      }
      setLoading(false);
    };
    load();
  }, [profile]);

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) => {
      const hay = [
        r.user_input || "",
        r.advice || "",
        r.profile || "",
        r.gender || "",
        r.age_bracket || "",
        r.role_status || "",
        r.socioeconomic_tier || "",
        (r.tone_labels || []).join(", "),
        (r.harm_taxonomy || []).join(", "),
      ]
        .join(" | ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [rows, query]);

  const exportCSV = () => {
    const header = [
      "created_at","profile","gender","age_bracket","role_status","socioeconomic_tier",
      "tone_labels","harm_taxonomy","user_input","advice"
    ];
    const lines = [header.join(",")].concat(
      filtered.map((r) =>
        header.map((k) => {
          const v = r[k];
          const text = Array.isArray(v) ? v.join("; ") : String(v ?? "");
          return `"${text.replaceAll(`"`,`""`)}"`;
        }).join(",")
      )
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "ai_events_export.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="dash-wrap">
      <div className="dash-bar container">
        <h1 className="dash-title">bias events</h1>
        <div className="dash-controls">
          <label className="dash-label">
            profile:
            <select className="dash-select" value={profile} onChange={(e)=>setProfile(e.target.value)}>
              <option value="all">all</option>
              <option value="anxiety">anxiety</option>
              <option value="adhd">adhd</option>
              <option value="dyslexia">dyslexia</option>
            </select>
          </label>
          <input
            className="dash-search"
            placeholder="search input/advice/tags…"
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
          />
          <button className="dash-btn" onClick={exportCSV}>export csv</button>
        </div>
      </div>

      {loading ? (
        <div className="dash-loading container">loading…</div>
      ) : filtered.length === 0 ? (
        <div className="dash-empty container">no events yet — generate a few in the simulator</div>
      ) : (
        <div className="card-grid container">
          {filtered.map((r) => {
            const created = new Date(r.created_at).toLocaleString();
            const tones = Array.isArray(r.tone_labels) ? r.tone_labels : [];
            const harms = Array.isArray(r.harm_taxonomy) ? r.harm_taxonomy : [];
            return (
              <div className="card" key={r.id}>
                <div className="meta-row top">
                  <span className={`badge badge-${r.profile || "neutral"}`}>{r.profile || "unknown"}</span>
                  <span className="time">{created}</span>
                </div>

                <div className="meta-row chips">
                  {r.gender && <span className="chip">{r.gender}</span>}
                  {r.age_bracket && <span className="chip">{r.age_bracket}</span>}
                  {r.role_status && <span className="chip">{r.role_status}</span>}
                  {r.socioeconomic_tier && <span className="chip">{r.socioeconomic_tier}</span>}
                </div>

                <div className="card-section">
                  <div className="label">TONE</div>
                  <div className="chip-row">{tones.map(chip)}</div>
                </div>

                <div className="card-section">
                  <div className="label">HARMS</div>
                  <div className="chip-row danger">{harms.map(chip)}</div>
                </div>

                <div className="card-section">
                  <div className="label">ADVICE</div>
                  <div className="text clamp">
                    {(r.advice || "")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

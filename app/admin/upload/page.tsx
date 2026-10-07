'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

type Photo = {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: string;
  discipline: string;
  description: string | null;
  imageUrl: string;
};

const DISCIPLINES = [
  'Portrait', 'Editorial', 'Commercial', 'Events',
  'Landscape', 'Architecture', 'Film', 'Product',
];

export default function UploadPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: '', client: 'Personal Project',
    year: new Date().getFullYear().toString(),
    discipline: 'Portrait', description: '',
  });

  useEffect(() => {
    fetch('/api/admin/upload')
      .then((r) => r.json())
      .then(setPhotos)
      .catch(() => {});
  }, []);

  const pickFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setStatus(null);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('image/')) pickFile(f);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !form.title) return;

    setUploading(true);
    setStatus(null);

    const fd = new FormData();
    fd.append('file', file);
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));

    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    if (res.ok) {
      const photo = await res.json();
      setPhotos((prev) => [photo, ...prev]);
      setFile(null);
      setPreview(null);
      setForm({ title: '', client: 'Personal Project', year: new Date().getFullYear().toString(), discipline: 'Portrait', description: '' });
      setStatus({ type: 'success', msg: `"${photo.title}" uploaded successfully.` });
    } else {
      const err = await res.json();
      setStatus({ type: 'error', msg: err.error ?? 'Upload failed.' });
    }
    setUploading(false);
  };

  const handleDelete = async (photo: Photo) => {
    if (!confirm(`Delete "${photo.title}"?`)) return;
    setDeleting(photo.id);
    await fetch('/api/admin/upload', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: photo.id, imageUrl: photo.imageUrl }),
    });
    setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    setDeleting(null);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-12">
      <div>
        <p className="eyebrow mb-2">Admin</p>
        <h1 className="font-display text-4xl font-light text-ink">Upload Photos</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-line bg-bg p-8">
        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          className={`relative flex h-56 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors ${
            dragging ? 'border-accent bg-accent/5' : 'border-line hover:border-accent/50'
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) pickFile(f); }}
          />
          {preview ? (
            <div className="relative h-full w-full overflow-hidden rounded-xl">
              <Image src={preview} alt="preview" fill className="object-contain p-2" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}
                className="absolute right-2 top-2 rounded-full bg-ink/70 px-2 py-0.5 font-mono text-[10px] text-white"
              >
                remove
              </button>
            </div>
          ) : (
            <>
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                Drag & drop or click to select
              </span>
              <span className="mt-2 font-mono text-[10px] text-muted/60">JPG, PNG, WEBP</span>
            </>
          )}
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="eyebrow mb-1 block">Title *</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Golden Hour Portraits"
              className="w-full rounded-lg border border-line bg-surface/50 px-4 py-3 font-body text-sm text-ink placeholder:text-muted/50 focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="eyebrow mb-1 block">Client</label>
            <input
              value={form.client}
              onChange={(e) => setForm({ ...form, client: e.target.value })}
              className="w-full rounded-lg border border-line bg-surface/50 px-4 py-3 font-body text-sm text-ink placeholder:text-muted/50 focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="eyebrow mb-1 block">Year</label>
            <input
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              className="w-full rounded-lg border border-line bg-surface/50 px-4 py-3 font-body text-sm text-ink focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="eyebrow mb-1 block">Discipline</label>
            <select
              value={form.discipline}
              onChange={(e) => setForm({ ...form, discipline: e.target.value })}
              className="w-full rounded-lg border border-line bg-surface/50 px-4 py-3 font-body text-sm text-ink focus:border-accent focus:outline-none"
            >
              {DISCIPLINES.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="eyebrow mb-1 block">Description <span className="text-muted/50">(optional)</span></label>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="A short note about this shoot"
              className="w-full rounded-lg border border-line bg-surface/50 px-4 py-3 font-body text-sm text-ink placeholder:text-muted/50 focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        {status && (
          <p className={`font-mono text-xs ${status.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
            {status.msg}
          </p>
        )}

        <button
          type="submit"
          disabled={uploading || !file}
          className="rounded-full bg-ink px-8 py-3 font-mono text-xs uppercase tracking-[0.18em] text-white transition hover:bg-accent disabled:opacity-40"
        >
          {uploading ? 'Uploading…' : 'Upload Photo'}
        </button>
      </form>

      {/* Existing photos */}
      {photos.length > 0 && (
        <div>
          <p className="eyebrow mb-6">Uploaded Photos ({photos.length})</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {photos.map((p) => (
              <div key={p.id} className="group relative overflow-hidden rounded-xl border border-line">
                <div className="relative aspect-[3/4]">
                  <Image src={p.imageUrl} alt={p.title} fill className="object-cover" sizes="33vw" />
                </div>
                <div className="p-3">
                  <p className="font-body text-sm font-medium text-ink">{p.title}</p>
                  <p className="font-mono text-[10px] text-muted">{p.discipline} · {p.year}</p>
                </div>
                <button
                  onClick={() => handleDelete(p)}
                  disabled={deleting === p.id}
                  className="absolute right-2 top-2 rounded-full bg-ink/70 px-2 py-0.5 font-mono text-[10px] text-white opacity-0 transition group-hover:opacity-100 disabled:opacity-50"
                >
                  {deleting === p.id ? '…' : 'delete'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

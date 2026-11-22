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

type QueueItem = {
  id: string;
  file: File;
  previewUrl: string;
  title: string;
  status: 'idle' | 'uploading' | 'error';
  errorMsg?: string;
};

type UploadResult =
  | { id: string; ok: true; photo: Photo }
  | { id: string; ok: false; errorMsg: string };

const DISCIPLINES = [
  'Portrait', 'Editorial', 'Commercial', 'Events',
  'Landscape', 'Architecture', 'Film', 'Product',
];

function titleFromFilename(name: string): string {
  return name
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin text-accent" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

function QueueRow({
  item,
  onTitleChange,
  onRemove,
}: {
  item: QueueItem;
  onTitleChange: (id: string, title: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-line bg-surface/30 p-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.previewUrl}
        alt=""
        className="h-12 w-12 flex-shrink-0 rounded object-cover"
      />
      <input
        value={item.title}
        onChange={(e) => onTitleChange(item.id, e.target.value)}
        aria-label={`Title for ${item.file.name}`}
        placeholder="Photo title"
        disabled={item.status === 'uploading'}
        className="min-w-0 flex-1 rounded border border-line bg-transparent px-3 py-1.5 font-body text-xs text-ink placeholder:text-muted/50 focus:border-accent focus:outline-none disabled:opacity-50"
      />
      <div className="flex w-20 flex-shrink-0 items-center justify-end gap-2">
        {item.status === 'uploading' && <Spinner />}
        {item.status === 'error' && (
          <span className="font-mono text-[10px] text-red-500" title={item.errorMsg}>✕ {item.errorMsg}</span>
        )}
        {item.status !== 'uploading' && (
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="rounded-full bg-ink/70 px-2 py-0.5 font-mono text-[10px] text-white hover:bg-red-600 transition-colors"
          >
            remove
          </button>
        )}
      </div>
    </div>
  );
}

export default function UploadPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [shared, setShared] = useState({
    client: 'Personal Project',
    year: new Date().getFullYear().toString(),
    discipline: 'Portrait',
    description: '',
  });

  useEffect(() => {
    fetch('/api/admin/upload')
      .then((r) => r.json())
      .then(setPhotos)
      .catch(() => {});
  }, []);

  useEffect(() => {
    return () => {
      queue.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enqueueFiles = useCallback((files: FileList | File[]) => {
    const newItems: QueueItem[] = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .map((f) => ({
        id: crypto.randomUUID(),
        file: f,
        previewUrl: URL.createObjectURL(f),
        title: titleFromFilename(f.name),
        status: 'idle' as const,
      }));
    if (fileRef.current) fileRef.current.value = '';
    setQueue((prev) => [...prev, ...newItems]);
    setSummary(null);
  }, []);

  const removeItem = (id: string) => {
    setQueue((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const updateTitle = (id: string, title: string) => {
    setQueue((prev) => prev.map((i) => (i.id === id ? { ...i, title } : i)));
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    enqueueFiles(e.dataTransfer.files);
  }, [enqueueFiles]);

  const handleUploadAll = async () => {
    const uploadable = queue.filter((i) => i.status === 'idle' || i.status === 'error');
    if (uploadable.length === 0) return;

    setSummary(null);
    setQueue((prev) =>
      prev.map((i) =>
        uploadable.some((u) => u.id === i.id)
          ? { ...i, status: 'uploading' as const, errorMsg: undefined }
          : i
      )
    );

    const results: UploadResult[] = await Promise.all(
      uploadable.map(async (item) => {
        const fd = new FormData();
        fd.append('file', item.file);
        fd.append('title', item.title.trim() || titleFromFilename(item.file.name));
        fd.append('client', shared.client);
        fd.append('year', shared.year);
        fd.append('discipline', shared.discipline);
        fd.append('description', shared.description);

        try {
          const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
          if (!res.ok) {
            const err = await res.json();
            return { id: item.id, ok: false, errorMsg: err.error ?? 'Upload failed.' } as const;
          }
          const photo = await res.json();
          return { id: item.id, ok: true, photo } as const;
        } catch {
          return { id: item.id, ok: false, errorMsg: 'Network error.' } as const;
        }
      })
    );

    const successIds = new Set(results.filter((r) => r.ok).map((r) => r.id));
    const newPhotos = results.filter((r): r is Extract<UploadResult, { ok: true }> => r.ok).map((r) => r.photo);

    queue.filter((i) => successIds.has(i.id)).forEach((i) => URL.revokeObjectURL(i.previewUrl));

    setQueue((prev) =>
      prev
        .filter((i) => !successIds.has(i.id))
        .map((i) => {
          const result = results.find((r) => r.id === i.id);
          if (result && !result.ok) {
            return { ...i, status: 'error' as const, errorMsg: result.errorMsg };
          }
          return i;
        })
    );

    if (newPhotos.length > 0) setPhotos((prev) => [...newPhotos, ...prev]);

    const failed = results.length - successIds.size;
    if (failed === 0) {
      setSummary(`${newPhotos.length} photo${newPhotos.length !== 1 ? 's' : ''} uploaded successfully.`);
    } else {
      setSummary(`${newPhotos.length} uploaded, ${failed} failed — fix errors and retry.`);
    }
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

  const uploadableCount = queue.filter((i) => i.status === 'idle' || i.status === 'error').length;
  const isUploading = queue.some((i) => i.status === 'uploading');

  return (
    <div className="mx-auto max-w-4xl space-y-12">
      <div>
        <p className="eyebrow mb-2">Admin</p>
        <h1 className="font-display text-4xl font-light text-ink">Upload Photos</h1>
      </div>

      <div className="space-y-6 rounded-2xl border border-line bg-bg p-8">
        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors ${
            dragging ? 'border-accent bg-accent/5' : 'border-line hover:border-accent/50'
          } ${queue.length > 0 ? 'h-14' : 'h-56'}`}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => { if (e.target.files) enqueueFiles(e.target.files); }}
          />
          {queue.length > 0 ? (
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted">+ Add more photos</span>
          ) : (
            <>
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                Drag & drop or click to select
              </span>
              <span className="mt-2 font-mono text-[10px] text-muted/60">JPG, PNG, WEBP — select multiple</span>
            </>
          )}
        </div>

        {/* Queue */}
        {queue.length > 0 && (
          <div className="space-y-2">
            <p className="eyebrow">{queue.length} photo{queue.length !== 1 ? 's' : ''} queued</p>
            {queue.map((item) => (
              <QueueRow
                key={item.id}
                item={item}
                onTitleChange={updateTitle}
                onRemove={removeItem}
              />
            ))}
          </div>
        )}

        {/* Shared fields */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="eyebrow mb-1 block">Client</label>
            <input
              value={shared.client}
              onChange={(e) => setShared({ ...shared, client: e.target.value })}
              className="w-full rounded-lg border border-line bg-surface/50 px-4 py-3 font-body text-sm text-ink placeholder:text-muted/50 focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="eyebrow mb-1 block">Year</label>
            <input
              value={shared.year}
              onChange={(e) => setShared({ ...shared, year: e.target.value })}
              className="w-full rounded-lg border border-line bg-surface/50 px-4 py-3 font-body text-sm text-ink focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="eyebrow mb-1 block">Discipline</label>
            <select
              value={shared.discipline}
              onChange={(e) => setShared({ ...shared, discipline: e.target.value })}
              className="w-full rounded-lg border border-line bg-surface/50 px-4 py-3 font-body text-sm text-ink focus:border-accent focus:outline-none"
            >
              {DISCIPLINES.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="eyebrow mb-1 block">Description <span className="text-muted/50">(optional)</span></label>
            <input
              value={shared.description}
              onChange={(e) => setShared({ ...shared, description: e.target.value })}
              placeholder="A short note about this shoot"
              className="w-full rounded-lg border border-line bg-surface/50 px-4 py-3 font-body text-sm text-ink placeholder:text-muted/50 focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        {summary && (
          <p className={`font-mono text-xs ${summary.includes('failed') ? 'text-red-500' : 'text-green-600'}`}>
            {summary}
          </p>
        )}

        <button
          type="button"
          onClick={handleUploadAll}
          disabled={uploadableCount === 0 || isUploading}
          className="rounded-full bg-ink px-8 py-3 font-mono text-xs uppercase tracking-[0.18em] text-white transition hover:bg-accent disabled:opacity-40"
        >
          {isUploading ? 'Uploading…' : `Upload${uploadableCount > 0 ? ` All (${uploadableCount})` : ''}`}
        </button>
      </div>

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

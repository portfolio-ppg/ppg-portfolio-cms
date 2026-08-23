"use client";

import { useActionState, useEffect, useState } from "react";
import { updateAppearanceAction } from "@/lib/actions/appearance";
import { Field, buttonPrimaryClass, Card } from "@/components/admin/ui";
import ImagePicker from "@/components/admin/ImagePicker";
import { useToast } from "@/components/admin/Toast";
import { TEMPLATES, TEMPLATE_DEFAULTS } from "@/lib/templates";
import { LAYOUTS } from "@/lib/layouts";
import { FONT_PAIRS } from "@/lib/fonts";
import type { Appearance, PaletteType, TemplateId, LayoutId } from "@/lib/types";

/** Small illustrative mock of each layout's hero arrangement — purely decorative. */
function LayoutPreview({ id }: { id: LayoutId }) {
  const mirrored = id === "mirrored";
  const centered = id === "centered";
  const sharp = id === "editorial" || id === "bold-lines";
  const thick = id === "bold-lines";
  const banner = id === "split-banner";
  const card = id === "soft-card";
  const compact = id === "compact";

  const textBlock = (
    <div className={`flex flex-col justify-center gap-1.5 ${centered ? "items-center" : ""}`}>
      <div className="h-1.5 w-10 rounded-full bg-gray-400" />
      <div className="h-1.5 w-14 rounded-full bg-gray-300" />
      <div className="h-1.5 w-8 rounded-full bg-gray-300" />
    </div>
  );

  const imageBlock = (
    <div className={`relative flex h-9 w-9 shrink-0 items-center justify-center ${sharp ? "rounded-md" : "rounded-full"} bg-gray-300`}>
      {banner && <span className="absolute -inset-1.5 -z-10 rounded-lg bg-gray-200" />}
    </div>
  );

  return (
    <div
      className={`flex h-16 w-full items-center bg-gray-50 p-3 ${
        card ? "rounded-2xl border border-gray-200 shadow-sm" : sharp ? "rounded-md border border-gray-200" : "rounded-xl border border-gray-200"
      } ${thick ? "border-2 border-gray-400" : ""}`}
    >
      <div
        className={`flex w-full ${compact ? "gap-2" : "gap-3"} ${
          centered
            ? "flex-col items-center justify-center"
            : mirrored
              ? "flex-row-reverse items-center justify-between"
              : "items-center justify-between"
        }`}
      >
        {textBlock}
        {imageBlock}
      </div>
    </div>
  );
}

const PALETTE_OPTIONS: { id: PaletteType; label: string }[] = [
  { id: "solid", label: "Warna Solid" },
  { id: "gradient", label: "Gradasi" },
  { id: "image", label: "Gambar" },
];

export default function AppearanceForm({
  appearance,
  username,
}: {
  appearance: Appearance;
  username: string;
}) {
  const [state, formAction, pending] = useActionState(updateAppearanceAction, undefined);
  const [values, setValues] = useState<Appearance>(appearance);
  const toast = useToast();

  useEffect(() => {
    if (state?.ok) toast("Tampilan berhasil disimpan.");
    if (state?.error) toast(state.error, "error");
  }, [state, toast]);

  function applyTemplate(id: TemplateId) {
    setValues((v) => ({ ...v, templateId: id, ...TEMPLATE_DEFAULTS[id] }));
  }

  function set<K extends keyof Appearance>(key: K, value: Appearance[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="username" value={username} />
      <input type="hidden" name="templateId" value={values.templateId} />
      <input type="hidden" name="layoutId" value={values.layoutId} />
      <input type="hidden" name="fontId" value={values.fontId} />
      <input type="hidden" name="paletteType" value={values.paletteType} />
      <input type="hidden" name="solidColor" value={values.solidColor} />
      <input type="hidden" name="gradientFrom" value={values.gradientFrom} />
      <input type="hidden" name="gradientTo" value={values.gradientTo} />
      <input type="hidden" name="gradientAngle" value={values.gradientAngle} />
      <input type="hidden" name="backgroundColor" value={values.backgroundColor} />
      <input type="hidden" name="backgroundColorDeep" value={values.backgroundColorDeep} />
      <input type="hidden" name="textColor" value={values.textColor} />
      <input type="hidden" name="textColorSoft" value={values.textColorSoft} />
      <input type="hidden" name="borderColor" value={values.borderColor} />
      <input type="hidden" name="surfaceColor" value={values.surfaceColor} />

      <Card>
        <p className="mb-4 text-sm font-semibold text-gray-900">
          Template <span className="font-normal text-gray-400">({TEMPLATES.length} pilihan)</span>
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => applyTemplate(t.id)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                values.templateId === t.id
                  ? "border-gray-900 ring-2 ring-gray-200"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <div className="h-16 w-full rounded-xl" style={{ background: t.preview }} />
              <p className="mt-3 text-sm font-semibold text-gray-900">{t.name}</p>
              <p className="mt-1 text-xs text-gray-500">{t.description}</p>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <p className="mb-4 text-sm font-semibold text-gray-900">
          Layout Halaman <span className="font-normal text-gray-400">({LAYOUTS.length} pilihan)</span>
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LAYOUTS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => set("layoutId", l.id)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                values.layoutId === l.id
                  ? "border-gray-900 ring-2 ring-gray-200"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <LayoutPreview id={l.id} />
              <p className="mt-3 text-sm font-semibold text-gray-900">{l.name}</p>
              <p className="mt-1 text-xs text-gray-500">{l.description}</p>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <p className="mb-4 text-sm font-semibold text-gray-900">
          Tipografi <span className="font-normal text-gray-400">({FONT_PAIRS.length} pilihan)</span>
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FONT_PAIRS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => set("fontId", f.id)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                values.fontId === f.id
                  ? "border-gray-900 ring-2 ring-gray-200"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <div className="flex h-16 w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50 px-2">
                <p className="text-lg text-gray-900" style={{ fontFamily: `var(${f.displayVar})` }}>
                  Aa
                </p>
                <p className="text-[11px] text-gray-500" style={{ fontFamily: `var(${f.bodyVar})` }}>
                  {f.previewBody}
                </p>
              </div>
              <p className="mt-3 text-sm font-semibold text-gray-900">{f.name}</p>
              <p className="mt-1 text-xs text-gray-500">{f.description}</p>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <p className="mb-4 text-sm font-semibold text-gray-900">Palet Warna Aksen</p>
        <div className="mb-5 flex gap-2 rounded-xl bg-gray-100 p-1">
          {PALETTE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => set("paletteType", opt.id)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                values.paletteType === opt.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {values.paletteType === "solid" && (
          <Field label="Warna Aksen">
            <input
              type="color"
              value={values.solidColor}
              onChange={(e) => set("solidColor", e.target.value)}
              className="h-11 w-24 cursor-pointer rounded-lg border border-gray-200"
            />
          </Field>
        )}

        {values.paletteType === "gradient" && (
          <div className="space-y-4">
            <div className="flex gap-6">
              <Field label="Warna Awal">
                <input
                  type="color"
                  value={values.gradientFrom}
                  onChange={(e) => set("gradientFrom", e.target.value)}
                  className="h-11 w-24 cursor-pointer rounded-lg border border-gray-200"
                />
              </Field>
              <Field label="Warna Akhir">
                <input
                  type="color"
                  value={values.gradientTo}
                  onChange={(e) => set("gradientTo", e.target.value)}
                  className="h-11 w-24 cursor-pointer rounded-lg border border-gray-200"
                />
              </Field>
            </div>
            <Field label={`Sudut Gradasi (${values.gradientAngle}°)`}>
              <input
                type="range"
                min={0}
                max={360}
                value={values.gradientAngle}
                onChange={(e) => set("gradientAngle", Number(e.target.value))}
                className="w-full accent-gray-900"
              />
            </Field>
            <div
              className="h-16 w-full rounded-xl"
              style={{
                background: `linear-gradient(${values.gradientAngle}deg, ${values.gradientFrom}, ${values.gradientTo})`,
              }}
            />
          </div>
        )}

        {values.paletteType === "image" && (
          <ImagePicker
            name="backgroundImageUrl"
            label="Gambar Latar Hero"
            value={values.backgroundImageUrl}
            onChange={(v) => set("backgroundImageUrl", v)}
            username={username}
          />
        )}
      </Card>

      <Card>
        <p className="mb-4 text-sm font-semibold text-gray-900">Warna Latar & Teks</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field label="Latar">
            <input
              type="color"
              value={values.backgroundColor}
              onChange={(e) => set("backgroundColor", e.target.value)}
              className="h-11 w-full cursor-pointer rounded-lg border border-gray-200"
            />
          </Field>
          <Field label="Latar (deep)">
            <input
              type="color"
              value={values.backgroundColorDeep}
              onChange={(e) => set("backgroundColorDeep", e.target.value)}
              className="h-11 w-full cursor-pointer rounded-lg border border-gray-200"
            />
          </Field>
          <Field label="Teks">
            <input
              type="color"
              value={values.textColor}
              onChange={(e) => set("textColor", e.target.value)}
              className="h-11 w-full cursor-pointer rounded-lg border border-gray-200"
            />
          </Field>
          <Field label="Teks (soft)">
            <input
              type="color"
              value={values.textColorSoft}
              onChange={(e) => set("textColorSoft", e.target.value)}
              className="h-11 w-full cursor-pointer rounded-lg border border-gray-200"
            />
          </Field>
        </div>
      </Card>

      <Card>
        <p className="mb-1 text-sm font-semibold text-gray-900">Warna Border & Permukaan</p>
        <p className="mb-4 text-xs text-gray-500">
          Dipakai untuk garis pembatas (kartu, footer, tombol outline) dan latar kartu/badge —
          bagian ini yang sebelumnya suka &ldquo;nyangkut&rdquo; di warna lama saat ganti tema.
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field label="Border">
            <input
              type="color"
              value={values.borderColor}
              onChange={(e) => set("borderColor", e.target.value)}
              className="h-11 w-full cursor-pointer rounded-lg border border-gray-200"
            />
          </Field>
          <Field label="Permukaan Kartu">
            <input
              type="color"
              value={values.surfaceColor}
              onChange={(e) => set("surfaceColor", e.target.value)}
              className="h-11 w-full cursor-pointer rounded-lg border border-gray-200"
            />
          </Field>
        </div>
      </Card>

      <button type="submit" disabled={pending} className={buttonPrimaryClass}>
        {pending ? "Menyimpan..." : "Simpan Tampilan"}
      </button>
    </form>
  );
}

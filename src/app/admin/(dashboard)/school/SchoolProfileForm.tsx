"use client";

import { useActionState, useEffect } from "react";
import { updateSchoolProfileAction } from "@/lib/actions/school";
import { Field, inputClass, buttonPrimaryClass, Card } from "@/components/admin/ui";
import ImagePicker from "@/components/admin/ImagePicker";
import { useToast } from "@/components/admin/Toast";
import type { SchoolProfile, MediaItem } from "@/lib/types";

export default function SchoolProfileForm({
  schoolProfile,
  media,
  username,
}: {
  schoolProfile: SchoolProfile;
  media: MediaItem[];
  username: string;
}) {
  const [state, formAction, pending] = useActionState(updateSchoolProfileAction, undefined);
  const toast = useToast();

  useEffect(() => {
    if (state?.ok) toast("Profil sekolah berhasil disimpan.");
    if (state?.error) toast(state.error, "error");
  }, [state, toast]);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="username" value={username} />
      <Card className="space-y-5">
        <ImagePicker
          name="logoUrl"
          defaultValue={schoolProfile.logoUrl}
          label="Logo Sekolah"
          username={username}
          media={media}
        />

        <Field
          label="Nama Sekolah / Instansi"
          hint="Juga dipakai untuk mencari lokasi sekolah di peta pada halaman publik."
        >
          <input
            name="name"
            defaultValue={schoolProfile.name}
            placeholder="Contoh: SD Negeri 1 Jakarta"
            className={inputClass}
          />
        </Field>

        <Field label="Deskripsi Sekolah">
          <textarea
            name="description"
            defaultValue={schoolProfile.description}
            rows={5}
            placeholder="Tuliskan deskripsi singkat sekolah/instansi di sini."
            className={inputClass}
          />
        </Field>
      </Card>

      <button type="submit" disabled={pending} className={buttonPrimaryClass}>
        {pending ? "Menyimpan..." : "Simpan Profil Sekolah"}
      </button>
    </form>
  );
}

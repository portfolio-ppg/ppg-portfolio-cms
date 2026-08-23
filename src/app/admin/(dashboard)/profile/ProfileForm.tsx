"use client";

import { useActionState, useEffect } from "react";
import { updateProfileAction } from "@/lib/actions/profile";
import { Field, inputClass, buttonPrimaryClass, Card } from "@/components/admin/ui";
import ImagePicker from "@/components/admin/ImagePicker";
import { useToast } from "@/components/admin/Toast";
import type { Profile } from "@/lib/types";

export default function ProfileForm({ profile, username }: { profile: Profile; username: string }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, undefined);
  const toast = useToast();

  useEffect(() => {
    if (state?.ok) toast("Profil berhasil disimpan.");
    if (state?.error) toast(state.error, "error");
  }, [state, toast]);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="username" value={username} />
      <Card className="space-y-5">
        <ImagePicker name="avatarUrl" defaultValue={profile.avatarUrl} label="Foto Profil" username={username} shape="arch" />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nama Lengkap">
            <input name="name" defaultValue={profile.name} required className={inputClass} />
          </Field>

          <Field label="Role">
            <select name="role" defaultValue={profile.role} className={inputClass}>
              <option value="Mahasiswa">Mahasiswa</option>
              <option value="Mahasiswi">Mahasiswi</option>
            </select>
          </Field>

          <Field label="Program">
            <input name="program" defaultValue={profile.program} className={inputClass} />
          </Field>

          <Field label="Kampus">
            <input name="campus" defaultValue={profile.campus} className={inputClass} />
          </Field>

          <Field label="Asal Daerah">
            <input name="originRegion" defaultValue={profile.originRegion} className={inputClass} />
          </Field>

          <Field label="Email">
            <input name="email" type="email" defaultValue={profile.email} className={inputClass} />
          </Field>
        </div>

        <Field label="Tagline (kalimat pembuka di halaman utama)">
          <textarea
            name="tagline"
            defaultValue={profile.tagline}
            rows={2}
            className={inputClass}
          />
        </Field>

        <Field label="Deskripsi (bagian &ldquo;Tentang Saya&rdquo;)">
          <textarea
            name="description"
            defaultValue={profile.description}
            rows={5}
            className={inputClass}
          />
        </Field>

        <Field label="Visi &amp; Misi">
          <textarea
            name="visiMisi"
            defaultValue={profile.visiMisi}
            rows={5}
            className={inputClass}
          />
        </Field>
      </Card>

      <button type="submit" disabled={pending} className={buttonPrimaryClass}>
        {pending ? "Menyimpan..." : "Simpan Profil"}
      </button>
    </form>
  );
}

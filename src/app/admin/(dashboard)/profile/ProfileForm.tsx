"use client";

import { useActionState, useEffect } from "react";
import { updateProfileAction } from "@/lib/actions/profile";
import { Field, inputClass, buttonPrimaryClass, Card } from "@/components/admin/ui";
import ImagePicker from "@/components/admin/ImagePicker";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { useToast } from "@/components/admin/Toast";
import type { ContentSection, Profile } from "@/lib/types";

// Not using <Field> (a <label>) around the editor: a click anywhere in a
// label activates its first labelable child — here, a toolbar button.
function EditorField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-gray-400">{hint}</span>}
    </div>
  );
}

function SectionCard({
  heading,
  hint,
  prefix,
  section,
}: {
  heading: string;
  hint: string;
  prefix: string;
  section: ContentSection;
}) {
  return (
    <Card className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-gray-900">{heading}</h2>
        <p className="mt-0.5 text-xs text-gray-500">{hint}</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Label kecil (di atas judul)">
          <input name={`${prefix}Label`} defaultValue={section.label} className={inputClass} />
        </Field>
        <Field label="Judul">
          <input name={`${prefix}Title`} defaultValue={section.title} className={inputClass} />
        </Field>
      </div>
      <EditorField label="Isi">
        <RichTextEditor name={`${prefix}Body`} defaultValue={section.body} />
      </EditorField>
    </Card>
  );
}

const EMPTY_HINT = "Bagian ini hanya tampil di halaman publik jika isinya diisi.";

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

        <div className="grid gap-5 sm:grid-cols-2">
          <ImagePicker name="programLogoUrl" defaultValue={profile.programLogoUrl} label="Logo Program (mis. PPG)" username={username} />
          <ImagePicker name="campusLogoUrl" defaultValue={profile.campusLogoUrl} label="Logo Kampus" username={username} />
        </div>
        <p className="-mt-2 text-xs text-gray-400">
          Logo tampil kecil berdampingan di bawah info Program/Kampus. Kosongkan untuk menyembunyikan.
        </p>

        <Field label="Tagline (kalimat pembuka di halaman utama)">
          <textarea
            name="tagline"
            defaultValue={profile.tagline}
            rows={2}
            className={inputClass}
          />
        </Field>

        <EditorField label="Deskripsi (bagian “Tentang Saya”)">
          <RichTextEditor name="description" defaultValue={profile.description} />
        </EditorField>
      </Card>

      <SectionCard
        heading="Inspirasi & Tujuan Menjadi Guru"
        hint={EMPTY_HINT}
        prefix="inspirasi"
        section={profile.inspirasi}
      />

      <Card className="space-y-5">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Visi</h2>
          <p className="mt-0.5 text-xs text-gray-500">Bagian visi/misi utama di halaman publik.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Label kecil (di atas judul)">
            <input name="visiMisiLabel" defaultValue={profile.visiMisiLabel} className={inputClass} />
          </Field>
          <Field label="Judul">
            <input name="visiMisiTitle" defaultValue={profile.visiMisiTitle} className={inputClass} />
          </Field>
        </div>
        <EditorField label="Isi">
          <RichTextEditor name="visiMisi" defaultValue={profile.visiMisi} />
        </EditorField>
      </Card>

      <SectionCard
        heading="Visi Pribadi sebagai Calon Guru"
        hint={EMPTY_HINT}
        prefix="visiPribadi"
        section={profile.visiPribadi}
      />

      <SectionCard
        heading="Komitmen Mewujudkan Visi Pendidikan"
        hint={EMPTY_HINT}
        prefix="komitmen"
        section={profile.komitmen}
      />

      <button type="submit" disabled={pending} className={buttonPrimaryClass}>
        {pending ? "Menyimpan..." : "Simpan Profil"}
      </button>
    </form>
  );
}

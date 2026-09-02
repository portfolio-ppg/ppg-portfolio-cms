import Image from "next/image";

export default function ProfileAvatar({
  src = "/profile/elva-arini-mardatillah.png",
  alt,
  shadowClassName = "shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]",
}: {
  src?: string;
  alt: string;
  /** From Tampilan → Bayangan Foto Profil (see src/lib/avatar-effects.ts). */
  shadowClassName?: string;
}) {
  return (
    // Fixed arch shape (rounded top, flat bottom) is enforced here via CSS —
    // overflow-hidden + rounded-t-full + object-cover — so ANY uploaded
    // photo (portrait or landscape) is cropped/centered to fit this exact
    // frame, regardless of its original shape or aspect ratio.
    <div className={`relative h-full w-full overflow-hidden rounded-t-full ${shadowClassName}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="(min-width: 768px) 384px, 90vw"
        className="object-cover object-top"
      />
    </div>
  );
}

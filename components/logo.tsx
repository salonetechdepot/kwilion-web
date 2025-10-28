import Image from "next/image";

export function Logo({
  className = "",
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/kwilion-logo.png"
        alt="Kwilion"
        width={160}
        height={160}
        className="h-10 w-auto"
        priority
      />
    </div>
  );
}

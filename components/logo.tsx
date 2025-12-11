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
        src="/roarbyte-logo.png"
        alt="Roar Byte Company Logo"
        width={160}
        height={160}
        className="h-14 w-auto"
        priority
      />
      <h1 className="text-xl">RoarByte</h1>
    </div>
  );
}

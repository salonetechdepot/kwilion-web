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
        alt="Roar Byte Tech Solutions Company Logo"
        width={160}
        height={160}
        className="h-6 w-auto sm:h-6 md:h-8 lg:h-10 rounded-full"
        priority
      />
    </div>
  );
}

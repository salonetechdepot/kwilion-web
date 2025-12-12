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
        className="h-6 w-auto sm:h-8 md:h-10 lg:h-12 bg-primary rounded-full"
        priority
      />
    </div>
  );
}

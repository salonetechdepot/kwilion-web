import Image from "next/image";

export function LogoText({
  className = "",
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <div className={`flex items-center ${className}`}>
      <h2 className="text-xl md:text-2xl font-bold text-balance drop-shadow-lg">
        RoarByte
      </h2>
    </div>
  );
}

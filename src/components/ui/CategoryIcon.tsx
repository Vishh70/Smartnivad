import {
  Laptop,
  Smartphone,
  Headphones,
  Gamepad2,
  Tag,
  Monitor,
  Watch,
  Camera,
  Cpu,
  Wifi,
} from "lucide-react";

interface CategoryIconProps {
  iconName: string | null;
  size?: number;
}

const ICON_MAP: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  Laptop,
  Smartphone,
  Headphones,
  Gamepad2,
  Monitor,
  Watch,
  Camera,
  Cpu,
  Wifi,
  Tag,
};

const GRADIENT_MAP: Record<string, string> = {
  Laptop: "from-blue-500 to-cyan-400",
  Smartphone: "from-purple-500 to-pink-400",
  Headphones: "from-emerald-500 to-teal-400",
  Gamepad2: "from-orange-500 to-amber-400",
  Monitor: "from-indigo-500 to-blue-400",
  Watch: "from-rose-500 to-pink-400",
  Camera: "from-sky-500 to-cyan-400",
  Cpu: "from-violet-500 to-purple-400",
  Wifi: "from-teal-500 to-emerald-400",
  Tag: "from-slate-500 to-gray-400",
};

export function CategoryIcon({ iconName, size = 28 }: CategoryIconProps) {
  const Icon = ICON_MAP[iconName || ""] || Tag;
  const gradient = GRADIENT_MAP[iconName || ""] || "from-blue-500 to-cyan-400";
  const colorClasses = `bg-gradient-to-br ${gradient}`;

  return (
    <div
      className={`relative w-16 h-16 rounded-2xl ${colorClasses} shadow-sm group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-[1.12] group-hover:rotate-[8deg] flex items-center justify-center will-change-transform`}
    >
      {/* Inner glass reflection */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 to-white/40 opacity-50" />
      <Icon size={size} className="text-white drop-shadow-md relative z-10" />
      {/* Glow effect */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 -z-10 scale-150`}
      />
    </div>
  );
}

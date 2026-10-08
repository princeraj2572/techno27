import {
  Bot, Brain, Camera, ChefHat, Code2, Compass, FlaskConical, Flame, Lightbulb,
  Mic, Music, Palette, PenTool, Shirt, Star, Terminal, TrendingUp,
  type LucideIcon,
} from "lucide-react";

export const EVENT_ICONS: Record<string, LucideIcon> = {
  terminal: Terminal,
  palette: Palette,
  bot: Bot,
  chef: ChefHat,
  flame: Flame,
  bulb: Lightbulb,
  music: Music,
  flask: FlaskConical,
  trend: TrendingUp,
  shirt: Shirt,
  compass: Compass,
  mic: Mic,
  brain: Brain,
  code: Code2,
  pen: PenTool,
  camera: Camera,
  star: Star,
};

export function EventIcon({ name, className }: { name: string; className?: string }) {
  const Icon = EVENT_ICONS[name] ?? Star;
  return <Icon className={className} />;
}

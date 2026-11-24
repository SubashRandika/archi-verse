import {
  AppWindow,
  Blocks,
  Cable,
  Compass,
  Component,
  Container,
  FlaskConical,
  Gauge,
  Layers,
  LayoutTemplate,
  LifeBuoy,
  type LucideIcon,
  type LucideProps,
  Palette,
  Server,
  ShieldCheck,
  Telescope,
  Waypoints,
} from "lucide-react";
import type { CategoryIcon as CategoryIconKey } from "@/content/catalog/categories";

const ICONS: Record<CategoryIconKey, LucideIcon> = {
  "front-end": LayoutTemplate,
  "micro-frontends": Blocks,
  components: Component,
  state: Waypoints,
  rendering: AppWindow,
  performance: Gauge,
  api: Cable,
  security: ShieldCheck,
  caching: Layers,
  resilience: LifeBuoy,
  "design-systems": Palette,
  testing: FlaskConical,
  devops: Container,
  backend: Server,
  leadership: Compass,
  emerging: Telescope,
};

export function CategoryIcon({ icon, ...props }: LucideProps & { icon: CategoryIconKey }) {
  const Icon = ICONS[icon];
  return <Icon aria-hidden="true" {...props} />;
}

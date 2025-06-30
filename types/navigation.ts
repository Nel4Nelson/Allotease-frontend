import { ServiceType } from "./services";

export interface NavigationTab {
  id: ServiceType;
  name: string;
  href: string;
  count?: number;
}

export interface ServiceTabsProps {
  activeTab: ServiceType;
  onTabChange: (tab: ServiceType) => void;
  showCounts?: boolean;
}

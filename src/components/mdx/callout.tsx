import { ReactNode } from "react";
import {
  Info,
  AlertTriangle,
  Lightbulb,
  AlertOctagon,
  FileText,
} from "lucide-react";

type CalloutType = "info" | "warning" | "tip" | "danger" | "note";

interface CalloutProps {
  type?: CalloutType;
  children: ReactNode;
  title?: string;
}

const calloutConfig = {
  info: {
    icon: Info,
    borderColor: "border-l-accent",
    bgColor: "bg-accent/10",
    iconColor: "text-accent",
    titleColor: "text-accent",
  },
  warning: {
    icon: AlertTriangle,
    borderColor: "border-l-[oklch(0.828_0.189_84.429)]",
    bgColor: "bg-[oklch(0.828_0.189_84.429)]/10",
    iconColor: "text-[oklch(0.828_0.189_84.429)]",
    titleColor: "text-[oklch(0.828_0.189_84.429)]",
  },
  tip: {
    icon: Lightbulb,
    borderColor: "border-l-[oklch(0.646_0.222_142)]",
    bgColor: "bg-[oklch(0.646_0.222_142)]/10",
    iconColor: "text-[oklch(0.646_0.222_142)]",
    titleColor: "text-[oklch(0.646_0.222_142)]",
  },
  danger: {
    icon: AlertOctagon,
    borderColor: "border-l-destructive",
    bgColor: "bg-destructive/10",
    iconColor: "text-destructive",
    titleColor: "text-destructive",
  },
  note: {
    icon: FileText,
    borderColor: "border-l-primary",
    bgColor: "bg-primary/10",
    iconColor: "text-primary",
    titleColor: "text-primary",
  },
};

const defaultTitles: Record<CalloutType, string> = {
  info: "Info",
  warning: "Warning",
  tip: "Tip",
  danger: "Danger",
  note: "Note",
};

export function Callout({
  type = "info",
  children,
  title,
}: CalloutProps) {
  const config = calloutConfig[type];
  const Icon = config.icon;
  const displayTitle = title || defaultTitles[type];

  return (
    <div
      className={`my-6 border-l-4 ${config.borderColor} ${config.bgColor} p-4 rounded-r-lg`}
    >
      <div className="flex gap-3">
        <div className={`flex-shrink-0 ${config.iconColor} mt-0.5`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          {displayTitle && (
            <p
              className={`font-medium ${config.titleColor} mb-2 text-sm uppercase tracking-wide`}
            >
              {displayTitle}
            </p>
          )}
          <div className="text-sm text-foreground/90 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

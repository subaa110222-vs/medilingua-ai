import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "warning" | "success";
  title?: string;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", title, children, ...props }, ref) => {
    const Icon = {
      default: Info,
      destructive: XCircle,
      warning: AlertCircle,
      success: CheckCircle,
    }[variant];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative w-full rounded-xl border p-4 flex items-start gap-3 glass-panel",
          {
            "border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400": variant === "default",
            "border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400": variant === "destructive",
            "border-yellow-500/20 bg-yellow-500/5 text-yellow-600 dark:text-yellow-400": variant === "warning",
            "border-green-500/20 bg-green-500/5 text-green-600 dark:text-green-400": variant === "success",
          },
          className
        )}
        {...props}
      >
        <Icon className="h-5 w-5 shrink-0 mt-0.5" />
        <div className="flex-1 flex flex-col gap-1 text-sm">
          {title && <h5 className="font-bold leading-none tracking-tight">{title}</h5>}
          <div className="text-foreground/90">{children}</div>
        </div>
      </div>
    );
  }
);
Alert.displayName = "Alert";

export { Alert };

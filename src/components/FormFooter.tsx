import { version } from "../../package.json";

export function FormFooter() {
  return (
    <div className="border-t pt-4 mt-4">
      <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
        <span>V.{version}</span>
        <span>Powered by: PROSKë</span>
      </div>
    </div>
  );
}

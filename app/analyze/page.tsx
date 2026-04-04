import { ChartUploadPanel } from "@/components/chart-upload-panel";
import { PageHeader } from "@/components/ui/page-header";

export default function AnalyzePage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Analyze"
        title="Upload a chart screenshot"
        description="Drop in a chart image or browse from your device to prepare the future analysis flow. This page only implements the frontend upload experience for now."
      />
      <ChartUploadPanel />
    </div>
  );
}

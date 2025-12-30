import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { QuickStats } from "@/components/dashboard/quick-stats";
import { ResourceMonitor } from "@/components/dashboard/resource-monitor";
import { BatchCreationForm } from "@/components/dashboard/batch-creation-form";
import { BatchProgressCard } from "@/components/dashboard/batch-progress-card";
import { ActiveTasksList } from "@/components/dashboard/active-tasks-list";
import { BatchControls } from "@/components/dashboard/batch-controls";

export default function Dashboard() {
	return (
		<DashboardLayout>
			<div className="space-y-6">
				<QuickStats />
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
					<ResourceMonitor />
					<BatchCreationForm />
					<BatchControls />
					<div className="md:col-span-2">
						<BatchProgressCard />
					</div>
					<div className="md:col-span-2 xl:col-span-1">
						<ActiveTasksList />
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
}

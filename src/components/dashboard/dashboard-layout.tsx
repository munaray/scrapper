"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { LayoutDashboard, Briefcase } from "lucide-react";

interface DashboardLayoutProps {
	children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
	const pathname = usePathname();

	const navItems = [
		{
			name: "Dashboard",
			href: "/",
			icon: LayoutDashboard,
		},
		{
			name: "Jobs",
			href: "/jobs",
			icon: Briefcase,
		},
	];

	return (
		<div className="min-h-screen bg-background">
			<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container flex h-16 items-center">
					<div className="flex items-center justify-between gap-8 max-w-7xl mx-auto w-full px-4">
						<h1 className="text-2xl font-bold">
							Scraper Dashboard
						</h1>
						<nav className="flex items-center gap-2">
							{navItems.map((item) => {
								const Icon = item.icon;
								const isActive = pathname === item.href;
								return (
									<Link
										key={item.href}
										href={item.href}
										className={cn(
											"flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
											isActive
												? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50"
												: "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
										)}
									>
										<Icon className="h-4 w-4" />
										{item.name}
									</Link>
								);
							})}
						</nav>
					</div>
				</div>
			</header>
			<main className="container py-6 max-w-400 mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}>
					{children}
				</motion.div>
			</main>
		</div>
	);
}

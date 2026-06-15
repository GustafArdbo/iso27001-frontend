"use client";

import { useDashboardContext } from "@/components/DashboardContext";

export default function OrganizationName() {
    const { organizationName } = useDashboardContext();

    if (!organizationName) {
        return null;
    }

    return <span>{organizationName}</span>;
}
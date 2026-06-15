"use client";

import { useEffect, useState } from "react";
import { getCurrentAuthUser } from "@/lib/auth";
import { getOrganization } from "@/lib/organizations";

export default function OrganizationName() {
    const [organizationName, setOrganizationName] = useState("Workspace");

    useEffect(() => {
        async function loadOrganizationName() {
            try {
                const me = await getCurrentAuthUser();
                const firstMembership = me.memberships?.[0];

                if (!firstMembership?.organizationId) {
                    setOrganizationName("Workspace");
                    return;
                }

                const organization = await getOrganization(firstMembership.organizationId);
                setOrganizationName(organization.name);
            } catch (error) {
                console.error(error);
                setOrganizationName("Workspace");
            }
        }

        void loadOrganizationName();
    }, []);

    return <span>{organizationName}</span>;
}
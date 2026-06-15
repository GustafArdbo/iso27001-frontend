"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import { getCurrentAuthUser } from "@/lib/auth";
import { getOrganization, type Organization } from "@/lib/organizations";

type CurrentAuthUser = Awaited<ReturnType<typeof getCurrentAuthUser>>;

type DashboardContextValue = {
    user: CurrentAuthUser | null;
    organization: Organization | null;
    organizationId: string;
    organizationName: string | null;
    isLoading: boolean;
    error: string;
    refreshDashboardContext: () => Promise<void>;
};

const DashboardContext = createContext<DashboardContextValue | undefined>(
    undefined
);

const ORGANIZATION_ID_CACHE_KEY = "complypilot:organizationId";
const ORGANIZATION_NAME_CACHE_KEY = "complypilot:organizationName";

export function DashboardProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<CurrentAuthUser | null>(null);
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [organizationId, setOrganizationId] = useState("");
    const [organizationName, setOrganizationName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDashboardContext = useCallback(async () => {
        try {
            setIsLoading(true);
            setError("");

            const me = await getCurrentAuthUser();
            const firstMembership = me.memberships?.[0];

            setUser(me);

            if (!firstMembership?.organizationId) {
                setOrganization(null);
                setOrganizationId("");
                setOrganizationName(null);

                window.sessionStorage.removeItem(ORGANIZATION_ID_CACHE_KEY);
                window.sessionStorage.removeItem(ORGANIZATION_NAME_CACHE_KEY);

                return;
            }

            const currentOrganization = await getOrganization(
                firstMembership.organizationId
            );

            setOrganization(currentOrganization);
            setOrganizationId(currentOrganization.id);
            setOrganizationName(currentOrganization.name);

            window.sessionStorage.setItem(
                ORGANIZATION_ID_CACHE_KEY,
                currentOrganization.id
            );
            window.sessionStorage.setItem(
                ORGANIZATION_NAME_CACHE_KEY,
                currentOrganization.name
            );
        } catch (loadError) {
            console.error(loadError);
            setError(
                loadError instanceof Error
                    ? loadError.message
                    : "Could not load dashboard context."
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const cachedOrganizationId = window.sessionStorage.getItem(
            ORGANIZATION_ID_CACHE_KEY
        );
        const cachedOrganizationName = window.sessionStorage.getItem(
            ORGANIZATION_NAME_CACHE_KEY
        );

        if (cachedOrganizationId) {
            setOrganizationId(cachedOrganizationId);
        }

        if (cachedOrganizationName) {
            setOrganizationName(cachedOrganizationName);
        }

        void loadDashboardContext();
    }, [loadDashboardContext]);

    const value = useMemo<DashboardContextValue>(
        () => ({
            user,
            organization,
            organizationId,
            organizationName,
            isLoading,
            error,
            refreshDashboardContext: loadDashboardContext,
        }),
        [
            user,
            organization,
            organizationId,
            organizationName,
            isLoading,
            error,
            loadDashboardContext,
        ]
    );

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboardContext() {
    const context = useContext(DashboardContext);

    if (!context) {
        throw new Error("useDashboardContext must be used inside DashboardProvider.");
    }

    return context;
}
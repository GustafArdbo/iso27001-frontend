type AppDataStateProps = {
    title: string;
    message?: string;
};

export function AppLoadingState({ title, message }: AppDataStateProps) {
    return (
        <section className="app-card app-state-card">
            <h2>{title}</h2>
            <p>{message ?? "Loading workspace data..."}</p>
        </section>
    );
}

export function AppErrorState({ title, message }: AppDataStateProps) {
    return (
        <section className="app-card app-state-card app-state-error">
            <h2>{title}</h2>
            <p>{message ?? "Could not load workspace data."}</p>
        </section>
    );
}

export function AppEmptyState({ title, message }: AppDataStateProps) {
    return (
        <section className="app-card app-state-card">
            <h2>{title}</h2>
            <p>{message ?? "No data is available yet."}</p>
        </section>
    );
}

export type SupportTicketStatus = "OPEN" | "CLOSED";

export type SupportTicket = {
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    organizationId: string;
    organizationName: string;
    status: SupportTicketStatus;
    createdAt: string;
};

export type CreateSupportTicketPayload = {
    name: string;
    email: string;
    phone: string;
    message: string;
    organizationId?: string;
    organizationName?: string | null;
};

const SUPPORT_TICKETS_KEY = "complypilot:supportTickets";

function readTickets() {
    if (typeof window === "undefined") {
        return [];
    }

    const stored = window.localStorage.getItem(SUPPORT_TICKETS_KEY);

    if (!stored) {
        return [];
    }

    try {
        return JSON.parse(stored) as SupportTicket[];
    } catch {
        return [];
    }
}

function writeTickets(tickets: SupportTicket[]) {
    window.localStorage.setItem(SUPPORT_TICKETS_KEY, JSON.stringify(tickets));
}

export function listSupportTickets() {
    return readTickets().sort(
        (left, right) =>
            new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
    );
}

export function createSupportTicket(payload: CreateSupportTicketPayload) {
    const ticket: SupportTicket = {
        id: crypto.randomUUID(),
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        message: payload.message,
        organizationId: payload.organizationId ?? "",
        organizationName: payload.organizationName ?? "",
        status: "OPEN",
        createdAt: new Date().toISOString(),
    };
    const tickets = listSupportTickets();

    writeTickets([ticket, ...tickets]);

    return ticket;
}

export function updateSupportTicketStatus(
    id: string,
    status: SupportTicketStatus
) {
    const tickets = listSupportTickets().map((ticket) =>
        ticket.id === id ? { ...ticket, status } : ticket
    );

    writeTickets(tickets);

    return tickets.find((ticket) => ticket.id === id) ?? null;
}

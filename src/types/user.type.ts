export type User = {
    id: string;
    role: "user" | "admin";
    email: string;
    firstName: string;
    lastName: string;
    isConfirmed: boolean;
    createdAt: string;
    updatedAt: string;
    registerCode: string | null;
    loyaltyCard: LoyaltyCard | null;
}

export type LoyaltyCard = {
    id: string,
    number: string,
    isBlocked: boolean,
    createdAt: string,
    updatedAt: string,
    accountId: string
}

export type UserCreate = Pick<User, "firstName" | "lastName">;
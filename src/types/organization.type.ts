import {Offer} from "./offer.type";

export type Organization = {
    id: string
    title: string
    description: string
    category: string
    icon: string,
    specialCardImageUrl: string | null,
    address: string,
    latitude: number,
    longitude: number,
    offers?: Offer[]
}

export type OrganizationNew = Omit<Organization, "icon" | "specialCardImageUrl"> & {
    icon: FileList;
    specialCardImage: FileList | null
}
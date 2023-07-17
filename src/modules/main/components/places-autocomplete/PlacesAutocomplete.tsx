import React, {FC} from "react";
import usePlacesAutocomplete, {getGeocode, getLatLng} from "use-places-autocomplete";
import {UseFormRegister} from "react-hook-form";
import {OrganizationNew} from "../../../../types/organization.type.ts";

export type PlaceAutocompleteProps = {
    onSelected: any,
    register: UseFormRegister<OrganizationNew>
}

const PlacesAutocomplete: FC<PlaceAutocompleteProps> = (onSelected, register) => {
    const {
        ready,
        value,
        setValue,
        suggestions: {status, data},
        clearSuggestions,
    } = usePlacesAutocomplete();

    const handleSelect = async (address: string) => {
        setValue(address, false);
        clearSuggestions();

        const results = await getGeocode({address});
        const {lat, lng} = await getLatLng(results[0]);
        console.log({lat, lng});
    };

    return (<>
        <label>Адрес</label>
        <input
            type="text"
            className='w-full rounded-md focus:border-black focus:outline-none px-2 text-black py-2 border border-blue-400'
            placeholder="Город, улица, дом..."
            disabled={!ready}
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
        {status === "OK" &&
            <div
                className="w-full rounded-md focus:border-black focus:outline-none px-2 text-black py-2 border border-blue-400">
                {data.map(({place_id, description}) => (
                    <option className="cursor-pointer"
                            value={description}
                            key={place_id}
                            onClick={(description) => handleSelect}>{description}</option>
                ))}
            </div>}
    </>)
}

export default PlacesAutocomplete;
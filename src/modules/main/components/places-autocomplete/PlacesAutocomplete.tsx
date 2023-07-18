import React, {FC, useEffect} from "react";
import usePlacesAutocomplete, {getGeocode, getLatLng} from "use-places-autocomplete";
import {UseFormRegister, UseFormSetValue} from "react-hook-form";
import {OrganizationNew} from "../../../../types/organization.type.ts";
import {Location} from "../OrganizationForm.tsx"

export type PlaceAutocompleteProps = {
    onSelected: (location: Location) => void,
    register: UseFormRegister<OrganizationNew>,
    setFieldValue: UseFormSetValue<OrganizationNew>,
    defaultValue?: string
}

const PlacesAutocomplete: FC<PlaceAutocompleteProps> = ({onSelected, register, setFieldValue, defaultValue}) => {
    const {
        ready,
        value,
        setValue,
        suggestions: {status, data},
        clearSuggestions,
    } = usePlacesAutocomplete();

    useEffect(() => {
        if (defaultValue) {
            setValue(defaultValue, false);
        } else {
            setValue("", false);
        }
    }, [defaultValue])

    const handleSelect = async (address: string) => {
        setValue(address, false);
        clearSuggestions();

        const results = await getGeocode({address});
        try {
            const {lng, lat} = await getLatLng(results[0]);
            onSelected({
                latitude: lat,
                longitude: lng
            });
            setFieldValue("address", address);

        } catch (e) {
            console.log("0 search results")
        }
    };

    return (<>
        <label>Адрес</label>
        <input
            className='w-full rounded-md focus:border-black focus:outline-none px-2 text-black py-2 border border-[#123094]'
            placeholder="Город, улица, дом..."
            disabled={!ready}
            value={value}
            onChange={(e) => {
                setValue(e.target.value)
                setFieldValue("address", "");
            }}
        />
        <input
            {...register('address', {
                required: "Укажите адрес(выберите из списка)"
            })}
            type="text"
            className="absolute h-0 w-0 hidden"
        />
        {status === "OK" &&
            <div
                className="w-full rounded-md focus:border-black focus:outline-none px-2 text-black py-2 border border-blue-400">
                {data.map(({place_id, description}) => (
                    <option className="cursor-pointer hover:opacity-50"
                            value={description}
                            key={place_id}
                            onClick={() => handleSelect(description)}>{description}</option>
                ))}
            </div>}
    </>)
}

export default PlacesAutocomplete;
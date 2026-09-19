"use client";

import {
  LOCATION_COUNTRIES,
  LOCATION_OTHER,
  areasForCity,
  citiesForCountry,
  countrySelectValue,
  defaultCityForCountry,
  isKnownArea,
  isKnownCity,
  normalizeCity,
} from "@/lib/locations";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";

export type LocationValue = {
  country: string;
  city: string;
  area: string;
};

type LocationFieldsProps = {
  value: LocationValue;
  onChange: (next: LocationValue) => void;
  controlClassName?: string;
  showArea?: boolean;
  areaOptional?: boolean;
  required?: boolean;
  compact?: boolean;
};

/**
 * Country → city → area dropdowns from the shared locations dataset.
 * Unknown saved values surface as "Other" with a free-text field.
 */
export function LocationFields({
  value,
  onChange,
  controlClassName,
  showArea = true,
  areaOptional = true,
  required = true,
  compact = true,
}: LocationFieldsProps) {
  const countrySelect = countrySelectValue(value.country);
  const datasetCountry =
    countrySelect === LOCATION_OTHER ? "Other" : countrySelect;
  const cities = citiesForCountry(datasetCountry);

  const [cityOther, setCityOther] = useState(
    () =>
      Boolean(value.city.trim()) &&
      !isKnownCity(value.city, datasetCountry),
  );
  const [areaOther, setAreaOther] = useState(
    () =>
      Boolean(value.area.trim()) &&
      !isKnownArea(value.area, value.city),
  );

  // Sync Other-mode when parent preloads a value not in the dataset
  useEffect(() => {
    const dc =
      countrySelectValue(value.country) === LOCATION_OTHER
        ? "Other"
        : countrySelectValue(value.country);
    if (value.city.trim() && !isKnownCity(value.city, dc)) {
      setCityOther(true);
    } else if (value.city.trim() && isKnownCity(value.city, dc)) {
      setCityOther(false);
    }
  }, [value.city, value.country]);

  useEffect(() => {
    const cityKey = cityOther
      ? ""
      : isKnownCity(value.city, datasetCountry)
        ? normalizeCity(value.city, datasetCountry)
        : "";
    if (value.area.trim() && cityKey && !isKnownArea(value.area, cityKey)) {
      setAreaOther(true);
    } else if (value.area.trim() && cityKey && isKnownArea(value.area, cityKey)) {
      setAreaOther(false);
    }
  }, [value.area, value.city, cityOther, datasetCountry]);

  const citySelect = cityOther
    ? LOCATION_OTHER
    : isKnownCity(value.city, datasetCountry)
      ? normalizeCity(value.city, datasetCountry)
      : (cities[0] ?? LOCATION_OTHER);

  const areas = areasForCity(citySelect === LOCATION_OTHER ? "" : citySelect);

  const areaSelect = areaOther
    ? LOCATION_OTHER
    : !value.area.trim()
      ? ""
      : isKnownArea(value.area, citySelect)
        ? areas.find(
            (a) => a.toLowerCase() === value.area.trim().toLowerCase(),
          ) || value.area
        : LOCATION_OTHER;

  const ctrl = cn(controlClassName);

  function setCountry(nextSelect: string) {
    setCityOther(false);
    setAreaOther(false);
    if (nextSelect === LOCATION_OTHER) {
      onChange({ country: "", city: "", area: "" });
      return;
    }
    onChange({
      country: nextSelect,
      city: defaultCityForCountry(nextSelect),
      area: "",
    });
  }

  function setCity(nextSelect: string) {
    setAreaOther(false);
    if (nextSelect === LOCATION_OTHER) {
      setCityOther(true);
      onChange({ ...value, city: "", area: "" });
      return;
    }
    setCityOther(false);
    onChange({ ...value, city: nextSelect, area: "" });
  }

  function setArea(nextSelect: string) {
    if (nextSelect === LOCATION_OTHER) {
      setAreaOther(true);
      onChange({ ...value, area: "" });
      return;
    }
    setAreaOther(false);
    onChange({ ...value, area: nextSelect });
  }

  return (
    <div className="space-y-4">
      <div className={cn(compact ? "grid grid-cols-2 gap-3" : "space-y-4")}>
        <label className="block">
          <span className="text-[13px] font-semibold text-ink">Country</span>
          <select
            required={required}
            value={countrySelect}
            onChange={(e) => setCountry(e.target.value)}
            className={ctrl}
          >
            {LOCATION_COUNTRIES.filter((c) => c !== "Other").map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            <option value={LOCATION_OTHER}>Other</option>
          </select>
          {countrySelect === LOCATION_OTHER && (
            <input
              type="text"
              required={required}
              value={value.country}
              onChange={(e) =>
                onChange({ ...value, country: e.target.value })
              }
              placeholder="Your country"
              className={cn(ctrl, "mt-2")}
              autoComplete="country-name"
            />
          )}
        </label>

        <label className="block">
          <span className="text-[13px] font-semibold text-ink">City</span>
          <select
            required={required && !cityOther}
            value={citySelect}
            onChange={(e) => setCity(e.target.value)}
            className={ctrl}
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            <option value={LOCATION_OTHER}>Other</option>
          </select>
          {cityOther && (
            <input
              type="text"
              required={required}
              value={value.city}
              onChange={(e) => onChange({ ...value, city: e.target.value })}
              placeholder="Your city"
              className={cn(ctrl, "mt-2")}
              autoComplete="address-level2"
            />
          )}
        </label>
      </div>

      {showArea && (
        <label className="block">
          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink">
            <MapPin className="h-3.5 w-3.5 text-muted" />
            Area / locality
            {areaOptional && (
              <span className="font-normal text-muted">(optional)</span>
            )}
          </span>
          {areas.length > 0 ? (
            <>
              <select
                required={required && !areaOptional && !areaOther}
                value={areaSelect}
                onChange={(e) => setArea(e.target.value)}
                className={ctrl}
              >
                <option value="">
                  {areaOptional ? "Select area (optional)" : "Select area"}
                </option>
                {areas.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
                <option value={LOCATION_OTHER}>Other</option>
              </select>
              {areaOther && (
                <input
                  type="text"
                  required={required && !areaOptional}
                  value={value.area}
                  onChange={(e) =>
                    onChange({ ...value, area: e.target.value })
                  }
                  placeholder="Your area / locality"
                  className={cn(ctrl, "mt-2")}
                  autoComplete="address-level3"
                />
              )}
            </>
          ) : (
            <input
              type="text"
              required={required && !areaOptional}
              value={value.area}
              onChange={(e) => onChange({ ...value, area: e.target.value })}
              placeholder={
                citySelect === "Online / remote"
                  ? "Optional — leave blank for online"
                  : "e.g. neighbourhood or suburb"
              }
              className={ctrl}
              autoComplete="address-level3"
            />
          )}
        </label>
      )}
    </div>
  );
}

import { useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import clsx from "clsx";
import type { Asset } from "@prisma/client";

export default function DropdownSelector({
  assets,
  assetIndex,
  name,
}: {
  assets: Asset[];
  assetIndex: number;
  name: string;
}) {
  const [query, setQuery] = useState("");
  const [selectedasset, setSelectedasset] = useState(assets[assetIndex]);

  const filteredAssets =
    query === ""
      ? assets
      : assets.filter((asset) => {
          return asset.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox value={selectedasset} onChange={setSelectedasset}>
      <Combobox.Label className="block text-sm font-medium text-gray-700">
        Asset #{assetIndex + 1}
      </Combobox.Label>
      <div className="relative mt-1">
        <Combobox.Input
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={() => selectedasset.name}
        />
        <input type="hidden" name={name} value={selectedasset.id} />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        {filteredAssets.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredAssets.map((asset) => (
              <Combobox.Option
                key={asset.id}
                value={asset}
                className={({ active }) =>
                  clsx(
                    "relative cursor-default select-none py-2 pl-3 pr-9",
                    active ? "bg-teal-600 text-white" : "text-gray-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <div className="flex items-center">
                      <img
                        src={asset.image}
                        alt="assetImg"
                        className="h-6 w-6 flex-shrink-0 rounded-full"
                      />
                      <span
                        className={clsx(
                          "ml-3 truncate",
                          selected && "font-semibold"
                        )}
                      >
                        {asset.name}
                      </span>
                    </div>
                    {selected && (
                      <span
                        className={clsx(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-teal-600"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}

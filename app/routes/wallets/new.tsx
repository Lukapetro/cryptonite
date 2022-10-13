import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { PlusIcon, XCircleIcon } from "@heroicons/react/24/outline";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import * as React from "react";
import Alert from "~/components/alert";
import DropdownSelector from "~/components/dropdownselector";
import { getAllAsset } from "~/models/asset.server";
import { createWallet, IAssetWithAllocation } from "~/models/wallet.server";

import { requireUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const assetLits = await getAllAsset();
  return json({ assetLits });
}

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();

  const values = Object.fromEntries(formData);

  const { title, description, ...assetsWithAllocation } = values;

  const assets: IAssetWithAllocation[] = [];

  Object.entries(assetsWithAllocation).forEach(([key, value]) => {
    if (key.startsWith("asset")) {
      const index = key.substring(key.indexOf("_") + 1);
      assets.push({
        assetId: value as string,
        percentage: Number(values[`allocation_${index}`]),
      });
    }
  });

  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { title: "Il nome è obbligatorio", description: null } },
      { status: 400 }
    );
  }

  if (typeof description !== "string" || description.length === 0) {
    return json(
      { errors: { title: null, description: "Description is required" } },
      { status: 400 }
    );
  }

  //return null;

  await createWallet({ title, description, userId, assets });

  return redirect(`/wallets`);
}

export default function NewWalletPage() {
  const actionData = useActionData<typeof action>();
  const data = useLoaderData<typeof loader>();
  const [assets, setAssets] = React.useState(1);
  const [totalAllocation, setTotalAllocation] = React.useState(0);

  const [values, setValues] = React.useState({
    allocation_0: 0,
    allocation_1: 0,
    allocation_2: 0,
    allocation_3: 0,
  });

  const valuesHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const { value } = e.target;

    const parsedValue = value === "" ? 0 : Number(value);

    const newValues = {
      ...values,
      [name]: parsedValue,
    };
    setValues(newValues);
    calcTotal(newValues);
  };

  const calcTotal = (newValues: any) => {
    const { allocation_0, allocation_1 } = newValues;
    const newTotal = parseInt(allocation_0) + parseInt(allocation_1);
    setTotalAllocation(newTotal);
  };

  console.log("totalAllocation", totalAllocation);

  return (
    <Form method="post" className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <div className="space-y-6 sm:space-y-5">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Generale
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Informazioni generali su questo wallet.
            </p>
          </div>

          <div className="space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Nome
              </label>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <div className="relative  flex max-w-lg rounded-md shadow-sm">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    className="block w-full min-w-0 flex-1 rounded-md border-gray-300 invalid:border-red-500 focus:border-teal-500 focus:ring-teal-500 invalid:focus:ring-red-500 sm:text-sm"
                  />
                  {actionData?.errors?.title ? (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <ExclamationCircleIcon
                        className="h-5 w-5 text-red-500"
                        aria-hidden="true"
                      />
                    </div>
                  ) : null}
                </div>
                {actionData?.errors?.title ? (
                  <p className="mt-2 text-sm text-red-500">
                    {actionData.errors.title}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Descrizione
              </label>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  defaultValue={""}
                />
                <p className="mt-2 text-sm text-gray-500">
                  Un paio di righe di info su questo wallet.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 pt-8 sm:space-y-5 sm:pt-10">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Composizione
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Seleziona <span className="font-semibold"> fino a 10 asset </span>{" "}
              e la loro allocazione all'interno di questo wallet.
            </p>
          </div>

          {totalAllocation > 100 ? <Alert /> : null}

          {Array.from({ length: assets }, (_, index) => {
            return (
              <React.Fragment key={index}>
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <DropdownSelector
                      assets={data.assetLits}
                      assetIndex={index}
                      name={`asset_${index}`}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="last-name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Allocazione
                    </label>
                    <div className="mt-1">
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <div className="flex max-w-lg rounded-md shadow-sm">
                          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                            %
                          </span>
                          <input
                            onChange={valuesHandler}
                            type="number"
                            min={1}
                            max={100}
                            name={`allocation_${index}`}
                            id={`allocation_${index}`}
                            className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {index === 0 ? null : (
                    <div className="mt-6">
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <button
                          onClick={() => {
                            const currentAllocation = `allocation_${index}`;
                            console.log("currentAllocation", currentAllocation);
                            setValues((current) => {
                              const copy = { ...current };

                              // 👇️ remove salary key from object
                              delete copy[currentAllocation];
                              calcTotal(copy);

                              return copy;
                            });
                            setAssets(assets - 1);
                          }}
                          type="button"
                          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-red-500 hover:bg-gray-50 focus:z-10 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        >
                          <span className="sr-only">Delete</span>
                          <XCircleIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
        {assets < 10 ? (
          <button
            type="button"
            onClick={() => setAssets(assets + 1)}
            className="inline-flex items-center rounded-full border border-transparent bg-teal-600 p-1 text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            <PlusIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <Link
            to="/wallets"
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Annulla
          </Link>
          <button
            type="submit"
            disabled={totalAllocation > 100}
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-teal-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Crea
          </button>
        </div>
      </div>
    </Form>
  );
}

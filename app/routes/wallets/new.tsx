import { PlusIcon, XCircleIcon } from "@heroicons/react/24/outline";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import * as React from "react";
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
      { errors: { title: "Title is required", description: null } },
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
                <div className="flex max-w-lg rounded-md shadow-sm">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    className="block w-full min-w-0 flex-1 rounded-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  />
                  {/* {actionData.errors?.title ? (
                    <em className="text-red-600">{actionData.errors.title}</em>
                  ) : null} */}
                </div>
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

          {Array.from({ length: assets }, (_, index) => {
            return (
              <React.Fragment key={index}>
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <DropdownSelector
                      assets={data.assetLits}
                      assetIndex={index}
                      //id={`asset_${index}`}
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
                            type="number"
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
                          onClick={() => setAssets(assets - 1)}
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
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-teal-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Crea
          </button>
        </div>
      </div>
    </Form>
  );
}

import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import * as React from "react";
import DropdownSelector from "~/components/dropdownselector";
import { getAllAsset } from "~/models/asset.server";

import { createWallet } from "~/models/wallet.server";
import { requireUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const assetLits = await getAllAsset();
  return json({ assetLits });
}

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description");
  const asset = formData.get("asset");
  const allocation = formData.get("allocation");

  console.log("allocation", allocation);

  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { title: "Title is required", description: null } },
      { status: 400 }
    );
  }

  if (typeof description !== "string" || description.length === 0) {
    return json(
      { errors: { title: null, description: "Body is required" } },
      { status: 400 }
    );
  }

  await createWallet({ title, description, userId });

  return redirect(`/wallets`);
}

export default function NewWalletPage() {
  const actionData = useActionData<typeof action>();
  const data = useLoaderData<typeof loader>();

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
              Seleziona gli asset e la loro allocazione all'interno di questo
              wallet.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <DropdownSelector assets={data.assetLits} />
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
                      name="allocation"
                      id="allocation"
                      className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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

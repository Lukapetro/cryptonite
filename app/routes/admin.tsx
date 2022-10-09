import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import clsx from "clsx";
import { Fragment, useMemo } from "react";
import { CSVLink } from "react-csv";
import Layout from "~/components/layout";
import { getAllUsers } from "~/models/user.server";
import { getAllWallets } from "~/models/wallet.server";

export async function loader({ request }: LoaderArgs) {
  const wallets = await getAllWallets();
  const users = await getAllUsers();
  return json({ wallets, users });
}

export default function AdminPage() {
  const data = useLoaderData<typeof loader>();
  const { users, wallets } = data;

  const formattedDataForDownload = useMemo(() => {
    return wallets.map((wallet) => ({
      user: wallet.user.email,
      wallet: wallet.assets.map(
        (asset) => `${asset.assetId} - ${asset.percentage}%`
      ),
    }));
  }, [wallets]);

  return (
    <Layout>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Utenti</h1>
          <p className="mt-2 text-sm text-gray-700">
            Una lista di tutti gli utenti con i relativi wallet.
          </p>
        </div>
        <CSVLink
          data={formattedDataForDownload}
          filename={"cryptonite-userdata.csv"}
        >
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            <ArrowDownTrayIcon
              className="-ml-1 mr-2 h-5 w-5"
              aria-hidden="true"
            />
            Download CSV
          </button>
        </CSVLink>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full">
                <thead className="bg-white">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      # Asset
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Data creazione
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {users.map((user) => (
                    <Fragment key={user.id}>
                      <tr className="border-t border-gray-200">
                        <th
                          colSpan={5}
                          scope="colgroup"
                          className="bg-gray-100 px-4 py-2 text-left text-sm font-semibold text-gray-900 sm:px-6"
                        >
                          {user.email}
                        </th>
                      </tr>
                      {user.wallets.map((wallet, walletIdx) => (
                        <tr
                          key={wallet.id}
                          className={clsx(
                            walletIdx === 0
                              ? "border-gray-300"
                              : "border-gray-200",
                            "border-t"
                          )}
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            #{walletIdx + 1} wallet
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {wallet.status}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {wallet._count.assets}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {wallet.createdAt}
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

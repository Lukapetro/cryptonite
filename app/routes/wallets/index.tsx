import { ChevronRightIcon, DocumentTextIcon } from "@heroicons/react/20/solid";
import { WalletIcon } from "@heroicons/react/24/outline";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import { Badge } from "~/components/badge";
import NoWalletFound from "~/components/wallets/nowalletfound";
import { getWalletListItems } from "~/models/wallet.server";
import { requireUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const walletListItems = await getWalletListItems({ userId });
  return json({ walletListItems });
}

export default function WalletIndexPage() {
  const data = useLoaderData<typeof loader>();

  function getWalletStatusAndText(status: string) {
    switch (status) {
      case "Completed":
        return { color: Badge.variant.GREEN, text: "Completato" };
      case "Empty":
        return { color: Badge.variant.RED, text: "Vuoto" };
      case "Partial":
        return { color: Badge.variant.YELLOW, text: "Parziale" };

      default:
        return { color: Badge.variant.RED, text: "Completato" };
    }
  }

  return (
    <>
      {data.walletListItems.length === 0 ? (
        <NoWalletFound />
      ) : (
        <div className="overflow-hidden bg-white shadow sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {data.walletListItems.map((wallet) => (
              <li key={wallet.id}>
                <Link to={wallet.id} className="block hover:bg-gray-50">
                  <div className="flex items-center px-4 py-4 sm:px-6">
                    <div className="flex min-w-0 flex-1 items-center">
                      <div className="flex-shrink-0">
                        <WalletIcon className="h-8 w-8 text-gray-600 " />
                      </div>
                      <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                        <div>
                          <p className="truncate text-sm font-medium text-teal-600">
                            {wallet.title}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500">
                            <DocumentTextIcon
                              className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                              aria-hidden="true"
                            />
                            <span className="truncate">
                              {wallet.description}
                            </span>
                          </p>
                        </div>

                        <div className="hidden md:block">
                          <div>
                            <p className="text-sm text-gray-900">
                              Creato il{" "}
                              <time dateTime={wallet.createdAt}>
                                {dayjs(wallet.createdAt).format("DD/MM/YYYY")}
                              </time>
                            </p>

                            <div className="mt-2 flex">
                              <Badge
                                variant={
                                  getWalletStatusAndText(wallet.status).color
                                }
                              >
                                {getWalletStatusAndText(wallet.status).text}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <ChevronRightIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

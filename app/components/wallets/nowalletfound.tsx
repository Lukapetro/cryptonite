import { PlusIcon } from "@heroicons/react/24/outline";
import { Link } from "@remix-run/react";

export default function NoWalletFound() {
  return (
    <div className="text-center">
      <svg
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
        className="mx-auto h-12 w-12 text-gray-400"
      >
        <path
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">
        Nessun wallet presente
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Inizia creando il tuo primo wallet.
      </p>
      <div className="mt-6">
        <Link
          to="new"
          className="inline-flex items-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Nuovo wallet
        </Link>
      </div>
    </div>
  );
}

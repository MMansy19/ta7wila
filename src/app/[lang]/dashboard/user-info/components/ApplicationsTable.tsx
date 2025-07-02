import { faGlobe, faMobile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";
import { Application } from "../types";

interface ApplicationsTableProps {
  applications: Application[];
  translations: any;
}

export const ApplicationsTable = ({ applications, translations }: ApplicationsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const totalPages = Math.ceil((applications?.length || 0) / itemsPerPage);

  if (!applications?.length) {
    return (
      <div className="bg-neutral-900 rounded-xl p-6">
        <p className="text-neutral-400 text-center">{translations.applications.noApplications}</p>
      </div>
    );
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentApplications = applications.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="bg-neutral-900 rounded-xl p-6 space-y-6">
      <h3 className="text-xl font-semibold text-white">{translations.applications.title}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentApplications.map((app) => (
          <div key={app.id} className="bg-neutral-800 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {app.logo ? (
                  <Image
                    src={`https://api.ta7wila.com/${app.logo}`}
                    alt={app.name}
                    width={40}
                    height={40}
                    className="rounded-lg"
                  />
                ) : (
                  <div className="w-10 h-10 bg-neutral-700 rounded-lg flex items-center justify-center">
                    <span className="text-neutral-400 text-lg font-medium">
                      {app.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-white">{app.name}</h4>
                  <p className="text-sm text-neutral-400">{app.subdomain}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                app.status === 'active' 
                  ? 'bg-green-400/20 text-green-300 border border-green-400/30' 
                  : 'bg-red-400/20 text-red-300 border border-red-400/30'
              }`}>
                {app.status === 'active' ? translations.applications.status.active : translations.applications.status.inactive}
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              {app.website && (
                <a
                  href={app.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 px-3 py-1.5 bg-blue-400/10 rounded-lg hover:bg-blue-400/20 transition-colors"
                >
                  <FontAwesomeIcon icon={faGlobe} className="w-4 h-4 text-blue-300" />
                  <span className="text-sm text-blue-300">{translations.applications.website}</span>
                </a>
              )}
              {app.mobile && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-400/10 rounded-lg">
                  <FontAwesomeIcon icon={faMobile} className="w-4 h-4 text-purple-300" />
                  <span className="text-sm text-purple-300"  style={{
                          direction: "ltr",
                          textAlign: "left",
                          display: "inline-block",
                        }}>{app.mobile}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h5 className="text-sm font-medium text-neutral-300">{translations.applications.paymentOptions}</h5>
              <div className="flex flex-wrap gap-2">
                {app.payment_options.map((option) => (
                  <span
                    key={option}
                    className="px-2.5 py-1 bg-neutral-700 rounded-md text-xs text-neutral-300"
                  >
                    {option.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-sm font-medium text-neutral-300">{translations.applications.activePaymentMethods}</h5>
              <div className="space-y-2">
                {app.payments
                  .filter(payment => payment.status === 'active')
                  .map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-2 bg-neutral-700/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src={`/${payment.payment_option}.svg`}
                        alt={payment.payment_option}
                        width={20}
                        height={20}
                      />
                      <span className="text-sm text-neutral-300">{payment.value}</span>
                    </div>
                    {payment.is_public && (
                      <span className="text-xs text-neutral-400">{translations.applications.public}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors
              ${currentPage === 1 
                ? 'bg-neutral-700/50 text-neutral-500 cursor-not-allowed' 
                : 'bg-neutral-700 text-white hover:bg-neutral-600'}`}
          >
            {translations.common.previous}
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors
                  ${currentPage === pageNum
                    ? 'bg-blue-500 text-white'
                    : 'bg-neutral-700 text-white hover:bg-neutral-600'}`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors
              ${currentPage === totalPages
                ? 'bg-neutral-700/50 text-neutral-500 cursor-not-allowed'
                : 'bg-neutral-700 text-white hover:bg-neutral-600'}`}
          >
            {translations.common.next}
          </button>
        </div>
      )}
    </div>
  );
};
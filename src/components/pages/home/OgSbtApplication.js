import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../../../utils/supabase';
import { GrFormAdd } from 'react-icons/gr';
import { AiOutlineSync } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { wallet } from '../../..';
import { ShowSbtDetails } from './ObSbtApplication/showSbtDetails';
import { log_event } from '../../../utils/utilityFunctions';
import { super_admins, useSuperAdmin } from '../../../utils/super-admins';

export function OgSBTApplicationsTable() {
  const [allApplications, setAllApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(undefined);

  const fetchUserApplications = useCallback(async () => {
    setLoading(true);
    try {
      const { error, data } = await supabase.select('users');
      if (error) {
        throw new Error('');
      }
      setAllApplications(
        data?.filter((item) => item.og_sbt_application !== null) ?? []
      );
    } catch (e) {
      console.log(e);
      toast.error('An error occured while fetching applications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserApplications();
  }, [fetchUserApplications]);

  const applicationStatus = ['Application Submitted', 'Approved', 'Rejected'];
  const [selectedStatus, setSelectedStatus] = useState(applicationStatus);
  const filteredApplications = [...allApplications]?.filter((item) =>
    selectedStatus?.includes(item?.og_sbt_application)
  );

  const { isSuperAdmin: is_super_admin } = useSuperAdmin();
  console.log(is_super_admin, 'is_super_admin');

  return (
    <div className="px-6 lg:px-8 mt-4">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-medium text-gray-900">
              Og Sbt Applications
            </h1>
            <button
              onClick={fetchUserApplications}
              className="bg-indigo-100 rounded-full p-2 text-sm"
            >
              <AiOutlineSync className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-700">
            A list of all og sbt applications.
          </p>
        </div>
        <div className="space-x-2 flex">
          <p>Application Status</p>
          {applicationStatus.map((item) => {
            const isIncluded = selectedStatus.includes(item);
            return (
              <span
                className={`inline-flex items-center rounded-full py-0.5 pl-2 pr-0.5 text-xs ${
                  isIncluded
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'border-indigo-100 border'
                }`}
              >
                {item}
                <button
                  type="button"
                  className="ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:bg-indigo-500 focus:text-white focus:outline-none"
                >
                  <span className="sr-only">Remove small option</span>
                  {selectedStatus.includes(item) ? (
                    <button
                      onClick={() => {
                        setSelectedStatus((d) => {
                          return d.filter((_) => _ !== item);
                        });
                      }}
                    >
                      <svg
                        className="h-2 w-2"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 8 8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeWidth="1.5"
                          d="M1 1l6 6m0-6L1 7"
                        />
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedStatus((d) => [...d, item]);
                      }}
                    >
                      <GrFormAdd />
                    </button>
                  )}
                </button>
              </span>
            );
          })}
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-my-2 -mx-6 overflow-x-auto lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-6 pr-3 text-left text-sm font-medium text-gray-900 sm:pl-3"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-medium text-gray-900"
                  >
                    Wallet Address
                  </th>
                  {is_super_admin && (
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-medium text-gray-900"
                    >
                      Telegram Number
                    </th>
                  )}
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-medium text-gray-900"
                  >
                    Application Status
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-sm font-medium text-gray-900"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {!loading && filteredApplications.length === 0 && (
                  <tr>
                    <td className="py-4 pl-3" colSpan={6}>
                      No Applications Found
                    </td>
                  </tr>
                )}
                {filteredApplications.map((person, personIdx) => (
                  <tr
                    key={person.wallet_identifier}
                    className={personIdx % 2 === 0 ? undefined : 'bg-gray-50'}
                  >
                    <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                      {person?.name ?? 'N/A'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {person.wallet_identifier}
                    </td>
                    {is_super_admin && (
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {person.telegram_number}
                      </td>
                    )}
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {person.og_sbt_application}
                    </td>
                    <td className="relative space-x-4 whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium sm:pr-3">
                      {person.og_sbt_application ===
                        'Application Submitted' && (
                        <>
                          <button
                            onClick={async () => {
                              try {
                                await supabase.update(
                                  'users',
                                  {
                                    og_sbt_application: 'Approved',
                                    og_sbt_approved_by: wallet.accountId,
                                  },
                                  {
                                    wallet_identifier: person.wallet_identifier,
                                  }
                                );
                                await wallet.callMethod({
                                  contractId: 'og-sbt-1.i-am-human.testnet',
                                  method: 'sbt_mint',
                                  args: {
                                    receiver: person.wallet_identifier,
                                    metadata: {
                                      ttl: '',
                                      memo: '',
                                    },
                                  },
                                });
                                log_event({
                                  event_log: `${wallet.accountId} approved OG SBT for ${person.wallet_identifier}`,
                                  effected_wallet: person.wallet_identifier,
                                });
                                toast.success('Successfully minted tokers');
                              } catch {
                                toast.error(
                                  'An error occurred while minting tokens'
                                );
                              } finally {
                                fetchUserApplications();
                              }
                            }}
                            className="text-indigo-600 p-2 hover:bg-indigo-100 transition-all rounded"
                          >
                            MINT OG SBT
                          </button>
                          <button
                            onClick={async () => {
                              await supabase.update(
                                'users',
                                {
                                  og_sbt_application: 'Rejected',
                                },
                                {
                                  wallet_identifier: person.wallet_identifier,
                                }
                              );
                              log_event({
                                event_log: `${wallet.accountId} rejected OG SBT for ${person.wallet_identifier}`,
                                effected_wallet: person.wallet_identifier,
                              });
                              fetchUserApplications();
                            }}
                            className="text-red-600 p-2 hover:bg-red-100 transition-all rounded"
                          >
                            REJECT APPLICATION
                          </button>
                        </>
                      )}
                      {person.og_sbt_application === 'Approved' && (
                        <button
                          onClick={async () => {
                            setSelectedUser(person);
                            setOpen(true);
                          }}
                          className="text-indigo-600 p-2 hover:bg-indigo-100 transition-all rounded"
                        >
                          Show SBT Details
                        </button>
                      )}
                      {person.og_sbt_application === 'Rejected' && (
                        <button
                          onClick={async () => {
                            await supabase.update(
                              'users',
                              {
                                og_sbt_application: 'Approved',
                                og_sbt_approved_by: wallet.accountId,
                              },
                              {
                                wallet_identifier: person.wallet_identifier,
                              }
                            );
                            await wallet.callMethod({
                              contractId: 'og-sbt-1.i-am-human.testnet',
                              method: 'sbt_mint',
                              args: {
                                receiver: person.wallet_identifier,
                                metadata: {
                                  ttl: '',
                                  memo: '',
                                },
                              },
                            });
                            log_event({
                              event_log: `${wallet.accountId} approved OG SBT for ${person.wallet_identifier}`,
                              effected_wallet: person.wallet_identifier,
                            });
                            fetchUserApplications();
                          }}
                          className="text-indigo-600 p-2 hover:bg-indigo-100 transition-all rounded"
                        >
                          MINT OG SBT
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ShowSbtDetails
        open={open}
        selectedUser={selectedUser}
        setOpen={setOpen}
      />
    </div>
  );
}

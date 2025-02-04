'use client';

import AddIcon from '@icons/AddIcon';
import { SessionEntry } from '../gameSessions/page';
import { useState } from 'react';
import CloseIcon from '@icons/CancelIcon';
import EditableRow from './EditableRow';
import SaveIcon from '@icons/SaveIcon';

type SessionTableProps = {
  participants: Array<SessionEntry>;
  sessionName: string;
  deleteSession: (id: number) => void;
  updateSession: (
    id: number,
    updatedEntry: { vorname: string; nachname: string; email: string },
  ) => void;
  addSession: (
    sessionName: string,
    newEntry: { vorname: string; nachname: string; email: string },
  ) => void;
};

const SessionTable: React.FC<SessionTableProps> = ({
  participants,
  sessionName,
  deleteSession,
  addSession,
  updateSession,
}) => {
  const [displayNewEntry, setDisplayNewEntry] = useState<boolean>(false);
  const [newEntry, setNewEntry] = useState<{
    vorname: string;
    nachname: string;
    email: string;
  }>({
    vorname: '',
    nachname: '',
    email: '',
  });

  return (
    <div
      key={sessionName}
      className="mb-8 rounded-lg border border-gray-300 bg-white p-4 shadow-md"
    >
      <h3 className="mb-3 text-lg font-semibold">{sessionName}</h3>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse bg-white shadow-sm">
          <thead>
            <tr className="border-b-2 border-gray-300 bg-gray-100">
              <th className="p-3 text-left font-semibold">Name</th>
              <th className="p-3 text-left font-semibold">E-Mail</th>
              <th className="p-3 text-left font-semibold">Aktion</th>
              <th className="hidden p-3 text-left font-semibold md:block">
                Anmeldedatum
              </th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant) => (
              <EditableRow
                key={participant.id}
                participant={participant}
                deleteSession={deleteSession}
                updateSession={updateSession}
              />
            ))}

            {displayNewEntry ? (
              <tr className="h-32">
                <td className="p-3 pl-0">
                  <input
                    type="text"
                    placeholder="Vorname"
                    className="mb-2 mr-2 w-full rounded-full border p-2 pl-3 outline-none focus:ring-0"
                    value={newEntry.vorname}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, vorname: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Nachname"
                    className="w-full rounded-full border p-2 pl-3 outline-none focus:ring-0"
                    value={newEntry.nachname}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, nachname: e.target.value })
                    }
                  />
                </td>
                <td className="p-3 pl-0">
                  <input
                    type="email"
                    placeholder="E-Mail"
                    className="w-full rounded-full border p-2 pl-3 outline-none focus:ring-0"
                    value={newEntry.email}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, email: e.target.value })
                    }
                  />
                </td>
                <td className="pt-3">
                  <button
                    onClick={() => setDisplayNewEntry(false)}
                    className="mb-2 mr-2 rounded-xl bg-status p-3 text-white shadow-md transition hover:bg-sky-700"
                  >
                    <CloseIcon tailwindColor="text-white" className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => {
                      addSession(sessionName, newEntry);
                    }}
                    className="mb-2 rounded-xl bg-quaternary p-3 text-white shadow-md transition hover:bg-green-700"
                  >
                    <SaveIcon tailwindColor="text-white" className="h-6 w-6" />
                  </button>
                </td>
              </tr>
            ) : (
              <tr className="h-32">
                <td className="h-8 p-3">
                  <button
                    onClick={() => setDisplayNewEntry(true)}
                    className="rounded-xl bg-quaternary p-3 text-white shadow-md transition hover:bg-green-700"
                  >
                    <AddIcon tailwindColor="text-white" className="h-6 w-6" />
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SessionTable;

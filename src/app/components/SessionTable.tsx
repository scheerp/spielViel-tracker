'use client';

import AddIcon from '@icons/AddIcon';
import { NewSessionEntry, SessionEntry } from '../helperUser/gameSessions/page';
import { useState } from 'react';
import EditableRow from './EditableRow';
import CloseIcon from '@icons/CancelIcon';
import SaveIcon from '@icons/SaveIcon';

type SessionTableProps = {
  participants: Array<SessionEntry>;
  sessionName: string;
  deleteSession: (id: number) => void;
  updateSession: (
    id: number,
    updatedEntry: NewSessionEntry,
    originalEntry: SessionEntry,
  ) => void;
  addSession: (sessionName: string, newEntry: NewSessionEntry) => void;
};

const SessionTable: React.FC<SessionTableProps> = ({
  participants,
  sessionName,
  deleteSession,
  addSession,
  updateSession,
}) => {
  const [displayNewEntry, setDisplayNewEntry] = useState<boolean>(false);
  const [newEntry, setNewEntry] = useState<NewSessionEntry>({
    vorname: '',
    nachname: '',
    email: '',
    handynummer: '',
  });

  const sortedParticipants = [...participants].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  return (
    <div
      key={sessionName}
      className="mb-8 rounded-xl border border-gray-300 bg-white p-4 shadow-md"
    >
      <h3 className="mb-3 text-lg font-semibold">{sessionName}</h3>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse bg-white shadow-sm">
          <thead>
            <tr className="border-b-2 border-gray-300 bg-gray-100">
              <th className="p-3 text-left font-semibold">Name</th>
              <th className="p-3 text-left font-semibold">Anmeldedaten</th>
              <th className="p-3 text-left font-semibold">Aktion</th>
              <th className="hidden p-3 text-left font-semibold md:block">
                Anmeldedatum
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedParticipants.map((participant) => (
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
                    className="mb-2 ml-1 mr-2 w-full rounded-full border p-2 pl-4 outline-none focus:ring-2 focus:ring-primary"
                    value={newEntry.vorname}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, vorname: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Nachname"
                    className="ml-1 w-full rounded-full border p-2 pl-4 outline-none focus:ring-2 focus:ring-primary"
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
                    className="mb-2 ml-1 mr-2 w-full rounded-full border p-2 pl-4 outline-none focus:ring-2 focus:ring-primary"
                    value={newEntry.email}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, email: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    placeholder="Handynummer"
                    className="ml-1 w-full rounded-full border p-2 pl-4 outline-none [appearance:textfield] focus:ring-2 focus:ring-primary [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    value={newEntry.handynummer}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, handynummer: e.target.value })
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

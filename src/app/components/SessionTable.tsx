/* 'use client';

import AddIcon from '@icons/AddIcon';
import {
  NewSessionEntry,
  Session,
  SessionEntry,
} from '../helperUser/gameSessions/page';
import { useState, useMemo } from 'react';
import EditableRow from './EditableRow';
import CloseIcon from '@icons/CancelIcon';
import SaveIcon from '@icons/SaveIcon';
import Image from 'next/image';

type SessionTableProps = {
  session: Session;
  deleteSession: (id: number) => void;
  updateSession: (
    id: number,
    updatedEntry: NewSessionEntry,
    originalEntry: SessionEntry,
  ) => void;
  addSession: (sessionName: string, newEntry: NewSessionEntry) => void;
};

const SessionTable: React.FC<SessionTableProps> = ({
  session,
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

  const sortedParticipants = useMemo(
    () =>
      [...session.participants].sort(
        (a, b) =>
          (new Date(a.created_at).getTime() || 0) -
          (new Date(b.created_at).getTime() || 0),
      ),
    [session.participants],
  );

  return (
    <div
      key={session.id}
      className="mb-4 rounded-xl border border-gray-300 bg-white p-4 shadow-md"
    >
      <div className="mb-8 flex">
        <div className="relative mr-4 h-32 w-36 md:h-44 md:w-44">
          <Image
            src={session.imageUrl ? session.imageUrl : '/placeholder.png'}
            alt={session.name}
            priority
            fill
            sizes="(max-width: 640px) 26vw, (max-width: 768px) 50vw, 26vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="flex flex-col justify-between">
          <div className="text-wrap text-xl md:text-2xl">
            <h2 className="clamp-custom-1">
              {session.name} <br />
            </h2>
            <p>ab {session.time} Uhr</p>
          </div>
          <div className="text-md text-wrap text-gray-500">
            {session.maxPlayers && session.maxPlayers > 0 && (
              <p>Mitspieler*innen: {session.maxPlayers}</p>
            )}
            {session.location && <p>Ort: {session.location}</p>}
            {session.duration && session.duration > 0 && (
              <p>Dauer: {session.duration} Min</p>
            )}
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse bg-white shadow-sm">
          <thead>
            <tr className="border-b-2 border-gray-300 bg-gray-100">
              <th className="p-3 text-left font-semibold">Name</th>
              <th className="p-3 text-left font-semibold">Daten</th>
              <th className="hidden p-3 text-left font-semibold md:table-cell">
                Anmeldedatum
              </th>
              <th className="w-[6.5rem] p-3 text-center font-semibold md:w-28">
                Aktion
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedParticipants.length > 0 ? (
              sortedParticipants.map((participant, index) => (
                <EditableRow
                  key={participant.id}
                  isApproved={index < session.maxPlayers}
                  isNextInline={index < session.maxPlayers + 2}
                  participant={participant}
                  deleteSession={deleteSession}
                  updateSession={updateSession}
                />
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-3 text-center text-gray-500">
                  Keine Teilnehmer vorhanden
                </td>
              </tr>
            )}

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
                <td className="p-3 pl-0"></td>
                <td className="flex justify-around p-3 px-0">
                  <button
                    onClick={() => setDisplayNewEntry(false)}
                    className="mb-2 mr-1 rounded-full bg-status p-3 text-white shadow-md transition hover:bg-sky-700"
                  >
                    <CloseIcon tailwindColor="text-white" className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => {
                      addSession(session.oldFormat, newEntry);
                      setDisplayNewEntry(false);
                      setNewEntry({
                        vorname: '',
                        nachname: '',
                        email: '',
                        handynummer: '',
                      });
                    }}
                    className="mb-2 rounded-full bg-quaternary p-3 text-white shadow-md transition hover:bg-green-700"
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
                    className="rounded-full bg-quaternary p-3 text-white shadow-md transition hover:bg-green-700"
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
 */

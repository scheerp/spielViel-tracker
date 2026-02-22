/* 'use client';

import { useState } from 'react';
import CloseIcon from '@icons/CancelIcon';
import TrashIcon from '@icons/TrashIcon';
import SaveIcon from '@icons/SaveIcon';
import EditIcon from '@icons/EditIcon';
import { useModal } from '@context/ModalContext';
import Loading from './Loading';

type EditableRowProps = {
  participant: {
    id: number;
    vorname: string;
    nachname: string;
    email: string;
    handynummer: string;
    created_at: string;
  };
  isApproved: boolean;
  isNextInline: boolean;
  deleteSession: (id: number) => void;
  updateSession: (
    id: number,
    updatedEntry: NewSessionEntry,
    originalEntry: SessionEntry,
  ) => void;
};

const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const EditableRow: React.FC<EditableRowProps> = ({
  participant,
  deleteSession,
  updateSession,
  isApproved,
  isNextInline,
}) => {
  const { openModal } = useModal();
  const [isEditing, setIsEditing] = useState(false);
  const [editedEntry, setEditedEntry] = useState({
    vorname: participant.vorname,
    nachname: participant.nachname,
    email: participant.email,
    handynummer: participant.handynummer,
  });

  return (
    <tr
      className={`border-b border-gray-200 hover:bg-gray-50 ${!isApproved && 'bg-gray-200'} ${!isNextInline && 'bg-gray-300'}`}
    >
      {isEditing ? (
        <>
          <td className="p-3 pl-0">
            <input
              type="text"
              placeholder="Vorname"
              className="mb-2 ml-1 mr-2 w-full rounded-full border p-2 pl-4 outline-none focus:ring-2 focus:ring-primary"
              value={editedEntry.vorname}
              onChange={(e) =>
                setEditedEntry({ ...editedEntry, vorname: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Nachname"
              className="ml-1 mr-2 w-full rounded-full border p-2 pl-4 outline-none focus:ring-2 focus:ring-primary"
              value={editedEntry.nachname}
              onChange={(e) =>
                setEditedEntry({ ...editedEntry, nachname: e.target.value })
              }
            />
          </td>
          <td className="p-3 pl-0">
            <input
              type="email"
              placeholder="E-Mail"
              className="mb-2 ml-1 mr-2 w-full rounded-full border p-2 pl-4 outline-none focus:ring-2 focus:ring-primary"
              value={editedEntry.email}
              onChange={(e) =>
                setEditedEntry({ ...editedEntry, email: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Handynummer"
              className="ml-1 w-full rounded-full border p-2 pl-4 outline-none [appearance:textfield] focus:ring-2 focus:ring-primary [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              value={editedEntry.handynummer || ''}
              onChange={(e) =>
                setEditedEntry({ ...editedEntry, handynummer: e.target.value })
              }
            />
          </td>
          <td className="hidden p-3 md:table-cell">
            {formatDate(participant.created_at)}
          </td>
          <td className="flex justify-around p-3 px-0">
            <button
              onClick={() => {
                setEditedEntry({
                  vorname: participant.vorname,
                  nachname: participant.nachname,
                  email: participant.email,
                  handynummer: participant.handynummer,
                });
                setIsEditing(false);
              }}
              className="rounded-full bg-status p-3 text-white shadow-md transition hover:bg-sky-700"
            >
              <CloseIcon tailwindColor="text-white" className="h-6 w-6" />
            </button>
            <button
              onClick={() => {
                updateSession(participant.id, editedEntry, participant);
              }}
              className="rounded-full bg-quaternary p-3 text-white shadow-md transition hover:bg-green-700"
            >
              <SaveIcon tailwindColor="text-white" className="h-6 w-6" />
            </button>
          </td>
        </>
      ) : (
        <>
          <td className="truncate p-3">
            {participant.vorname}
            <span className="block md:hidden"></span> {participant.nachname}
          </td>
          <td className="truncate p-3">
            {participant.email && participant.email}
            {participant.handynummer && <p>{participant.handynummer}</p>}
          </td>
          <td className="hidden p-3 md:table-cell">
            {formatDate(participant.created_at)}
          </td>
          <td className="flex justify-around p-3 px-0">
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-full bg-status p-3 text-white shadow-md transition hover:bg-sky-700"
            >
              <EditIcon tailwindColor="text-white" className="h-6 w-6" />
            </button>

            <button
              onClick={() =>
                openModal((loadingFromContext) => (
                  <div className="mt-6 flex flex-col justify-center text-center">
                    Session Anmeldung von
                    <b>
                      {participant.vorname} {participant.nachname}
                    </b>
                    wirklich löschen?
                    <button
                      onClick={() => deleteSession(participant.id)}
                      disabled={loadingFromContext}
                      className={`btn mt-6 rounded-full bg-primary px-3 py-2.5 font-bold text-white shadow-sm ${
                        loadingFromContext
                          ? 'cursor-not-allowed opacity-50'
                          : ''
                      }`}
                    >
                      löschen!
                    </button>
                    {loadingFromContext && <Loading />}
                  </div>
                ))
              }
              className="rounded-full bg-error p-3 text-white shadow-md transition hover:bg-orange-700"
            >
              <TrashIcon tailwindColor="text-white" className="h-6 w-6" />
            </button>
          </td>
        </>
      )}
    </tr>
  );
};

export default EditableRow;
 */

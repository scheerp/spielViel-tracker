'use client';

import { useState } from 'react';
import CloseIcon from '@icons/CancelIcon';
import TrashIcon from '@icons/TrashIcon';
import SaveIcon from '@icons/SaveIcon';
import EditIcon from '@icons/EditIcon';

type EditableRowProps = {
  participant: {
    id: number;
    vorname: string;
    nachname: string;
    email: string;
    created_at: string;
  };
  deleteSession: (id: number) => void;
  updateSession: (
    id: number,
    updatedEntry: { vorname: string; nachname: string; email: string },
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
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEntry, setEditedEntry] = useState({
    vorname: participant.vorname,
    nachname: participant.nachname,
    email: participant.email,
  });

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      {isEditing ? (
        <>
          <td className="w-1/3 p-3 md:w-1/4">
            <input
              type="text"
              className="mb-2 w-full max-w-[100px] rounded-full border p-2 outline-none focus:ring-0 md:max-w-[180px]"
              value={editedEntry.vorname}
              onChange={(e) =>
                setEditedEntry({ ...editedEntry, vorname: e.target.value })
              }
            />
            <input
              type="text"
              className="w-full max-w-[100px] rounded-full border p-2 outline-none focus:ring-0 md:max-w-[180px]"
              value={editedEntry.nachname}
              onChange={(e) =>
                setEditedEntry({ ...editedEntry, nachname: e.target.value })
              }
            />
          </td>
          <td className="w-1/3 p-3 md:w-1/4">
            <input
              type="email"
              className="w-full max-w-[160px] rounded-full border p-2 outline-none focus:ring-0"
              value={editedEntry.email}
              onChange={(e) =>
                setEditedEntry({ ...editedEntry, email: e.target.value })
              }
            />
          </td>
          <td className="w-1/3 pt-3 md:w-1/4">
            <button
              onClick={() => {
                setEditedEntry({
                  vorname: participant.vorname,
                  nachname: participant.nachname,
                  email: participant.email,
                });
                setIsEditing(false);
              }}
              className="mb-2 mr-2 rounded-xl bg-status p-3 text-white shadow-md transition hover:bg-sky-700"
            >
              <CloseIcon tailwindColor="text-white" className="h-6 w-6" />
            </button>

            <button
              onClick={() => {
                updateSession(participant.id, editedEntry);
              }}
              className="rounded-xl bg-quaternary p-3 text-white shadow-md transition hover:bg-green-700"
            >
              <SaveIcon tailwindColor="text-white" className="h-6 w-6" />
            </button>
          </td>
          <td className="w-1/3 p-3 md:w-1/4"></td>
        </>
      ) : (
        <>
          <td className="w-1/3 truncate p-3 md:w-1/4">
            {participant.vorname}
            <span className="block md:hidden"></span> {participant.nachname}
          </td>
          <td className="w-1/3 truncate p-3 md:w-1/4">{participant.email}</td>
          <td className="w-1/3 pt-3 md:w-1/4">
            <button
              onClick={() => setIsEditing(true)}
              className="mb-2 mr-2 rounded-xl bg-status p-3 text-white shadow-md transition hover:bg-sky-700"
            >
              <EditIcon tailwindColor="text-white" className="h-6 w-6" />
            </button>

            <button
              onClick={() => deleteSession(participant.id)}
              className="rounded-xl bg-error p-3 text-white shadow-md transition hover:bg-orange-700"
            >
              <TrashIcon tailwindColor="text-white" className="h-6 w-6" />
            </button>
          </td>
          <td className="hidden w-1/3 p-3 md:block md:w-1/4">
            {formatDate(participant.created_at)}
          </td>
        </>
      )}
    </tr>
  );
};

export default EditableRow;

import { Session } from '@components/ProgramCard';

type ProgramApiResponse = {
  data?: Record<string, Session>;
};

type StaticProgramPayload = {
  sessions?: Session['content'][];
};

const PROGRAM_API_URL = 'https://spielviel.net/programm/api_availability.php';
const PROGRAM_JSON_URL = '/program/program.json';
const PROGRAM_API_TIMEOUT_MS = 3500;

export const mapStaticSessionsToProgramSessions = (
  staticSessions: Session['content'][],
): Session[] =>
  staticSessions.map((session) => ({
    content: {
      ...session,
    },
    available: 0,
    occupied: 0,
    status: 'fallback',
    title: session?.title ?? '',
    total: session?.total ?? 0,
    hasAvailabilityData: false,
  }));

const loadProgramSessionsFromStaticJson = async (): Promise<Session[]> => {
  const response = await fetch(PROGRAM_JSON_URL);

  if (!response.ok) {
    throw new Error(`Fehler beim Laden des Programms: ${response.status}`);
  }

  const data: StaticProgramPayload = await response.json();
  const staticSessions = Array.isArray(data?.sessions) ? data.sessions : [];

  return mapStaticSessionsToProgramSessions(staticSessions);
};

export const loadProgramSessions = async (): Promise<Session[]> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, PROGRAM_API_TIMEOUT_MS);

    let response: Response;

    try {
      response = await fetch(PROGRAM_API_URL, {
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      throw new Error(`Fehler beim Laden des Programms: ${response.status}`);
    }

    const data: ProgramApiResponse = await response.json();
    const apiSessions = data?.data ?? {};

    return Object.values(apiSessions);
  } catch (apiError) {
    console.error(
      'Programm-API fehlgeschlagen, nutze statisches Fallback.',
      apiError,
    );

    return loadProgramSessionsFromStaticJson();
  }
};

export const toProgramRecord = (sessions: Session[]): Record<string, Session> =>
  sessions.reduce<Record<string, Session>>((acc, session, index) => {
    const key = session.content.id ?? `session-${index}`;
    acc[key] = session;
    return acc;
  }, {});

/** UID as document ID. */
export interface User {
  name: string;
  email: string;
  lastTimeOnline: number;
}

/** UID as document ID. */
export interface ContactsList {
  [uid: string]: true;
}

export interface Invitation {
  from: string;
  to: string;
  sessionId: string;
}

export interface Session {
  host: string;
  started: boolean;
  signal: 'start'|'pause'|'resume'|'stop'|`time-${number}`;
  watchTargetLength: number;
  members: {
    [uid: string]: {
      selectedTargetLength: number;
      status: 'ready'|'mismatch'|'not-ready';
    };
  };
}

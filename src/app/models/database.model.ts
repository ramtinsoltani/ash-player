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
  session: string;
}

export interface Session {
  host: string;
  started: boolean;
  signal?: 'start'|'pause'|'resume'|'stop'|`time:${number}`|'end';
  targetLength: number;
  members: {
    [uid: string]: {
      targetLength?: number;
      status: SessionMemberStatus;
    };
  };
}

export enum SessionMemberStatus {

  NotReady = 'not-ready',
  Ready = 'ready',
  Mismatch = 'mismatch'

}

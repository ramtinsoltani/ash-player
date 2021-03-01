/** UID as document ID. */
export interface User {
  name: string;
  email: string;
  lastTimeOnline: number;
}

export interface UserWithUID extends User {
  uid: string;
}

/** UID as document ID. */
export interface ContactsList {
  [uid: string]: true;
}

export interface Invitation {
  id: string;
  from: string;
  to: string;
  session: string;
}

export interface Session {
  host: string;
  started: boolean;
  signal?: SessionStaticSignal|SessionTimeSignal;
  signalTime?: number;
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

export enum SessionStaticSignal {
  Start = 'start',
  Pause = 'pause',
  Resume = 'resume',
  Stop = 'stop',
  End = 'end'
}

export type SessionTimeSignal = `time:${number}`;

export function toSessionTimeSignal(milliseconds: number) {

  return `time:${milliseconds}`;

}

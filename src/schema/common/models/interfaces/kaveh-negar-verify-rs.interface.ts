export interface KavehNegarVerifyRS {
  return: KavehNegarVerifyReturn;
  entries: KavehNegarVerifyEntries[];
}

export interface KavehNegarVerifyReturn {
  status: number,
  message: string
}

export interface KavehNegarVerifyEntries {
  messageid: number,
  message: string,
  status: number,
  statustext: string,
  sender: string,
  receptor: string,
  date: number,
  cost: number
}

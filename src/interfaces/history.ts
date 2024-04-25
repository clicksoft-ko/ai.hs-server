export interface IHistory {
  n1?: IHistoryN1;
  n2?: IHistoryN2;
  n3: EHistoryN3;
}

export interface IHistoryN1 {
  /** 뇌졸증 */
  stroke?: IHistoryN1Result;
  /** 협심증 */
  angina?: IHistoryN1Result;
  /** 고혈압 */
  hypertension?: IHistoryN1Result;
  /** 당뇨병 */
  diabetes?: IHistoryN1Result;
  /** 이상지질혈증 */
  dyslipidemia?: IHistoryN1Result;
  /** 폐결핵(Pulmonary Tuberculosis) */
  PT?: IHistoryN1Result;
  /** 기타 */
  others?: IHistoryN1Result;
}

export interface IHistoryN1Result {
  /** 진단 */
  diagnosis?: boolean;
  /** 약물치료 */
  drugTherapy?: boolean;
}

export interface IHistoryN2 {
  /** 뇌졸증 */
  stroke?: boolean;
  /** 협심증 */
  angina?: boolean;
  /** 고혈압 */
  hypertension?: boolean;
  /** 당뇨병 */
  diabetes?: boolean;
  /** 기타 */
  others?: boolean;
}

export enum EHistoryN3 {
  yes = 1,
  no = 2,
  doNotKnown = 3,
}

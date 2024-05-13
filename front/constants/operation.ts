export enum OperationType {
  Out = 'out',
  In = 'in'
}

export const operationTypeText =  {
  [OperationType.Out]: 'Расходы',
  [OperationType.In]: 'Доходы',
}

export const operationTypes = Object.keys(OperationType).map(code => ({
  code: OperationType[code],
  text: operationTypeText[OperationType[code]]
}))
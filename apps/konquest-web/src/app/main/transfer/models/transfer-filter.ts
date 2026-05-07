import { FetchTransfersParams } from './fetch-transfer-params';

export type TransferFilter = Pick<FetchTransfersParams, 'source' | 'owner' | 'date' | 'action'>;

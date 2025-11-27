import { AppModalData } from '../modals/app-modals.model';
import { ICommonError } from '../../models/api.model';

export type AppErrorAlertData = AppModalData & ICommonError;

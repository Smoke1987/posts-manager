import { DialogConfig } from '@angular/cdk/dialog';

export type AppModalConfig = Omit<DialogConfig, 'data' | 'providers' | 'container'>;

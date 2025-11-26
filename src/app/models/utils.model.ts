import { FormControl } from '@angular/forms';

export type AppFormGroup<Model> = {
  [Property in keyof Model]: FormControl<Required<Model[Property]>>;
};

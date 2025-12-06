import { FormControl } from '@angular/forms';

export type AppFormGroup<Model> = {
  [Property in keyof Model]: FormControl<Required<Model[Property]>>;
};

export type AppFormGroupWithOptional<Model> = {
  [Property in keyof Model]?: FormControl<Model[Property]>;
};

// Все поля типа <T> опциональны, за исключением <TRequired>
export type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> & Pick<T, TRequired>;

// Модифицируем только числовые свойства
export type ModifyNumberToNullable<T> = {
  [K in keyof T]: T[K] extends number ? number | null : T[K]
};

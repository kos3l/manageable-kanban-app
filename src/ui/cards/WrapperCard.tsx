import { ReactNode } from "react";

interface IProps<T> {
  name: string;
  displayEntities: T[];
  displayComponent: (entity: T) => ReactNode;
}

export default function WrapperCard<T>(props: IProps<T>) {
  const { name, displayEntities, displayComponent } = props;

  return (
    <div className="flex h-max w-full flex-col gap-3 rounded-lg border border-neutral-600 p-3 sm:grow sm:basis-44">
      <div className="flex w-full items-center justify-between">
        <p className="font-serif tracking-wider">{name}</p>
        <p className="text-xl font-medium text-indigo-500">
          {displayEntities.length}
        </p>
      </div>
      <div className="flex w-full flex-col gap-3">
        {displayEntities.map((entity, index) => {
          return displayComponent(entity);
        })}
      </div>
    </div>
  );
}

import type { PropsWithChildren } from 'react';

export default (props: PropsWithChildren) => {
  const { children } = props;

  return (
    <div className="my-4 box-border px-4">
      {children}
    </div>
  );
};

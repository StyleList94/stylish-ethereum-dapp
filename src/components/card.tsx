import type { PropsWithChildren } from 'react';

const CardSection = ({ children }: PropsWithChildren) => (
  <section className="flex flex-col w-full max-w-[375px] p-4 border border-solid border-[#e9ecef] rounded-xl shadow-md">
    {children}
  </section>
);

const CardTitle = ({ children }: PropsWithChildren) => (
  <h2 className="mb-4 text-xl text-center">{children}</h2>
);

const CardContentList = ({ children }: PropsWithChildren) => (
  <div className="flex flex-col gap-5 py-4">{children}</div>
);

const CardContentItem = ({ children }: PropsWithChildren) => (
  <section className="flex flex-col gap-1">{children}</section>
);

const CardContentItemTitle = ({ children }: PropsWithChildren) => (
  <h3 className="font-normal text-[#adb5bd]">{children}</h3>
);

const CardContentItemValue = ({ children }: PropsWithChildren) => (
  <p className="overflow-x-auto font-mono text-xl">{children}</p>
);

const CardActionGroup = ({ children }: PropsWithChildren) => (
  <div className="flex flex-col gap-4 p-4 border border-solid border-[#f1f3f5] rounded-xl">
    {children}
  </div>
);

const CardResultBox = ({ children }: PropsWithChildren) => (
  <div className="flex flex-col gap-1">{children}</div>
);

const CardResultValue = ({ children }: PropsWithChildren) => (
  <p className="overflow-x-auto font-mono text-sm">{children}</p>
);

const Card = {
  ActionGroup: CardActionGroup,
  ContentItem: CardContentItem,
  ItemTitle: CardContentItemTitle,
  ItemValue: CardContentItemValue,
  ContentList: CardContentList,
  Section: CardSection,
  Title: CardTitle,
  ResultBox: CardResultBox,
  ResultValue: CardResultValue,
};

export default Card;

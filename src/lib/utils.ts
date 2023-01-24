export const addressRegex = /^0x[a-fA-F0-9]{40}/;

export const shortenAddress = (account: string) =>
  `${account.substring(0, 10)}...${account.substring(32)}`;

export const getElementToEmotionCssName = (
  container: HTMLElement,
  cssName: string,
  tagName = 'div',
): Element | undefined =>
  Array.from(container.getElementsByTagName(tagName)).find((element) =>
    element.className.match(new RegExp(cssName)),
  );

export const shortenKaikasRpcErrorMessage = (message: string): string =>
  message.split('\n')[0];

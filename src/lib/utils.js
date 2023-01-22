export const addressRegex = /^0x[a-fA-F0-9]{40}/;

export const shortenAddress = (account) =>
  `${account.substring(0, 10)}...${account.substring(32)}`;

export const getElementToEmotionCssName = (
  container,
  tagName = 'div',
  cssName,
) =>
  Array.from(container.getElementsByTagName(tagName)).find((element) =>
    element.className.match(new RegExp(cssName)),
  );

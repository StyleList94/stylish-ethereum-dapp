import { shortenAddress } from './utils';

describe('util', () => {
  describe('shortenAddress', () => {
    it('should be return shorten address', () => {
      expect(
        shortenAddress('0x29072219f93D6893F9201Adfc31246169e785252'),
      ).toEqual('0x29072219...169e785252');
    });
  });
});

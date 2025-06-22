import {
  cn,
  convertToAbiTypedValue,
  convertUnits,
  parseAbiFileToJSON,
  replacer,
  separateFunctionInput,
  shortenAddress,
} from './utils';

describe('shortenAddress', () => {
  it('should be return shorten address', () => {
    expect(
      shortenAddress('0x29072219f93D6893F9201Adfc31246169e785252'),
    ).toEqual('0x29072219...169e785252');
  });
});

describe('replacer', () => {
  it('should convert BigInt to string', () => {
    const bigIntValue = 9007199254740991n;
    expect(replacer('test', bigIntValue)).toBe('9007199254740991');
  });

  it('should return other types as is', () => {
    expect(replacer('test', 42)).toBe(42);
    expect(replacer('test', 'hello')).toBe('hello');
    expect(replacer('test', true)).toBe(true);
    expect(replacer('test', null)).toBe(null);
    expect(replacer('test', undefined)).toBe(undefined);

    const obj = { a: 1 };
    expect(replacer('test', obj)).toBe(obj);
  });
});

describe('cn', () => {
  it('merges class names correctly', () => {
    const result = cn('btn', 'btn-primary');
    expect(result).toBe('btn btn-primary');
  });

  it('handles conditional class names correctly', () => {
    const isTrue = 6 + 24 === 30;
    const result = cn(
      'btn',
      isTrue && 'btn-primary',
      !isTrue && 'btn-secondary',
    );
    expect(result).toBe('btn btn-primary');
  });

  it('removes duplicate class names using tailwind-merge', () => {
    const result = cn('p-4', 'p-2');
    expect(result).toBe('p-2'); // tailwind-merge should keep only the last class
  });

  it('handles empty and undefined values correctly', () => {
    const result = cn('btn', undefined, null, '', 'btn-primary');
    expect(result).toBe('btn btn-primary');
  });

  it('merges array and object syntax correctly', () => {
    const result = cn(['btn', { 'btn-primary': true, 'btn-secondary': false }]);
    expect(result).toBe('btn btn-primary');
  });

  it('returns an empty string if no valid class names are provided', () => {
    const result = cn(undefined, null, false, '');
    expect(result).toBe('');
  });
});

describe('parseAbiFileToJSON', () => {
  it('should parse a valid JSON file correctly', async () => {
    const mockFile = new File(
      ['{"abi": [{"type": "function", "name": "test"}]}'],
      'test.json',
      { type: 'application/json' },
    );

    const result = await parseAbiFileToJSON(mockFile);
    expect(result).toEqual([{ type: 'function', name: 'test' }]);
  });

  it('should handle invalid JSON', async () => {
    const mockFile = new File(['{"abi": [invalid json]}'], 'invalid.json', {
      type: 'application/json',
    });

    await expect(parseAbiFileToJSON(mockFile)).rejects.toThrow();
  });

  it('should handle file reading errors', async () => {
    const mockFile = new File([''], 'error.json', {
      type: 'application/json',
    });

    const parsePromise = parseAbiFileToJSON(mockFile);

    await expect(parsePromise).rejects.toThrow();
  });
});

describe('separateFunctionInput', () => {
  it('returns function name and length of argument', () => {
    const [functionName, argumentLength] = separateFunctionInput(
      'safeTransferFrom[3]',
    );

    expect(functionName).toBe('safeTransferFrom');
    expect(argumentLength).toBe(3);
  });

  it('throws on invalid argument', () => {
    expect(() => {
      separateFunctionInput('safeTransferFrom(3)');
    }).toThrow();

    expect(() => {
      separateFunctionInput('x-rated');
    }).toThrow();
  });
});

describe('convertToAbiTypedValue', () => {
  it('converts to BigInt', () => {
    expect(convertToAbiTypedValue('10', 'uint256')).toBe(10n);
    expect(convertToAbiTypedValue('-100', 'uint')).toBe(-100n);
    expect(convertToAbiTypedValue('1024', 'int')).toBe(1024n);
    expect(convertToAbiTypedValue('one', 'int')).toBe('one');
  });

  it('converts to boolean', () => {
    expect(convertToAbiTypedValue('true', 'bool')).toBe(true);
    expect(convertToAbiTypedValue('false', 'bool')).toBe(false);
  });

  it('converts to Array of BigInt', () => {
    expect(convertToAbiTypedValue('1,2,3,4', 'uint256[]')).toStrictEqual([
      1n,
      2n,
      3n,
      4n,
    ]);
    expect(convertToAbiTypedValue('5,6,7,8', 'uint[]')).toStrictEqual([
      5n,
      6n,
      7n,
      8n,
    ]);
    expect(convertToAbiTypedValue('0, 1, 2, 3', 'int[]')).toStrictEqual([
      0n,
      1n,
      2n,
      3n,
    ]);

    expect(convertToAbiTypedValue('0,1,2,*', 'uint[]')).toStrictEqual([]);
  });

  it('converts to Array of String', () => {
    expect(convertToAbiTypedValue('sexy,rated', 'string[]')).toStrictEqual([
      'sexy',
      'rated',
    ]);

    expect(
      convertToAbiTypedValue(
        '0x29072219f93D6893F9201Adfc31246169e785252, 0x7b79995e5f793a07bc00c21412e50ecae098e7f9',
        'address[]',
      ),
    ).toStrictEqual([
      '0x29072219f93D6893F9201Adfc31246169e785252',
      '0x7b79995e5f793a07bc00c21412e50ecae098e7f9',
    ]);
  });

  it('should not converted', () => {
    expect(
      convertToAbiTypedValue(
        '0x29072219f93D6893F9201Adfc31246169e785252',
        'address',
      ),
    ).toBe('0x29072219f93D6893F9201Adfc31246169e785252');

    expect(convertToAbiTypedValue('ethereum', 'string')).toBe('ethereum');
  });
});

describe('convertUnits', () => {
  it('should be converted value', () => {
    expect(convertUnits('1', 18)).toBe('0.000000000000000001');
    expect(convertUnits('1', 9)).toBe('0.000000001');
    expect(convertUnits('1', 0)).toBe('1');

    expect(convertUnits('1234000000000000000', 18)).toBe('1.234');
    expect(convertUnits('5678000009', 9)).toBe('5.678000009');
  });
});

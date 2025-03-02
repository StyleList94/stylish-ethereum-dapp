'use client';

import { type ChangeEvent, useState } from 'react';

import { convertUnits } from '@/lib/utils';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Label from '@/components/ui/label';
import Input from '@/components/ui/input';

type Unit = 'ether' | 'gwei' | 'wei';

const initialValues = {
  ether: '',
  gwei: '',
  wei: '',
};

const UnitConverter = () => {
  const [inputValues, setInputValues] = useState<Record<Unit, string>>({
    ...initialValues,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name: unit, value } = e.target;

    if (value && !/^\d+\.?\d*$/.test(value)) {
      return;
    }

    if (unit === 'ether') {
      setInputValues({
        ether: value,
        gwei: convertUnits(value || '0', -9),
        wei: convertUnits(value || '0', -18),
      });
    }

    if (unit === 'gwei') {
      setInputValues({
        ether: convertUnits(value || '0', 9),
        gwei: value,
        wei: convertUnits(value || '0', -9),
      });
    }

    if (unit === 'wei') {
      setInputValues({
        ether: convertUnits(value || '0', 18),
        gwei: convertUnits(value || '0', 9),
        wei: value,
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Unit Converter</CardTitle>
        <CardDescription>Ether to Wei</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-2.5 w-full">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="ether">Ether</Label>
            <Input
              id="ether"
              type="text"
              placeholder="Ether"
              name="ether"
              onChange={handleChange}
              value={inputValues.ether}
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="gwei">Gwei</Label>
            <Input
              id="gwei"
              type="text"
              placeholder="Gwei"
              name="gwei"
              onChange={handleChange}
              value={inputValues.gwei}
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="wei">Wei</Label>
            <Input
              id="wei"
              type="text"
              placeholder="Wei"
              name="wei"
              onChange={handleChange}
              value={inputValues.wei}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnitConverter;

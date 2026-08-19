import { Transform } from 'class-transformer';

export function TransformQueryBoolean() {
  return Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  });
}

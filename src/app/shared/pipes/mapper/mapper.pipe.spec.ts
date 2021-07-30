import { MapperPipe } from './mapper.pipe';

describe('Mapper pipe', () => {
  const mapperPipe = new MapperPipe();
  it('should return value from function', () => {
    const value = 'value';
    const fn = (val: string) => val;

    expect(mapperPipe.transform(fn, value)).toEqual(value);
  });
});

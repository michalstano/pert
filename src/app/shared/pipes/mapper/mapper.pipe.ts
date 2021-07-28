/* eslint-disable @typescript-eslint/no-explicit-any */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapper'
})
export class MapperPipe implements PipeTransform {
  transform<T extends (...args: any[]) => any>(
    mapper: T,
    ...args: Parameters<T>
  ): ReturnType<T> {
    return mapper(...args);
  }
}

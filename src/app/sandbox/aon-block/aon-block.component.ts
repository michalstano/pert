import {
  ChangeDetectionStrategy,
  Component,
  Input,
  HostBinding
} from '@angular/core';
import { AoNData } from '../+state/sandbox.model';

@Component({
  selector: '[aon-block]',
  template: `
    <div class="earliest-start">{{ aonData?.earliestStart }}</div>
    <div class="duration">{{ aonData?.duration }}</div>
    <div class="earliest-finish">{{ aonData?.earliestFinish }}</div>
    <div class="name">{{ aonData?.name }}</div>
    <div class="latest-start">{{ aonData?.latestStart }}</div>
    <div class="float">{{ aonData?.float }}</div>
    <div class="latest-finish">{{ aonData?.latestFinish }}</div>
  `,
  styleUrls: ['./aon-block.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AonBlockComponent {
  @Input() aonData?: AoNData;
  @Input() isConnecting: boolean = false;
  @HostBinding('class.selected') @Input() isSelected: boolean = false;

  @HostBinding('class.unused')
  public get isUnused(): boolean {
    return this.isConnecting && !this.isSelected;
  }
}

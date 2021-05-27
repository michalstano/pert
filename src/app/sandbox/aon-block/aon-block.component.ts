import {
  ChangeDetectionStrategy,
  Component,
  Input,
  HostBinding,
  ViewChild,
  ElementRef,
  OnInit
} from '@angular/core';
import { AoNData } from '../+state/sandbox.model';

@Component({
  selector: '[aon-block]',
  template: `
    <div class="earliest-start">
      <input
        #earliestStartInput
        [value]="aonData?.earliestStart"
        [readonly]="!isBeingEdited"
      />
    </div>
    <div class="duration">
      <input
        [value]="aonData?.duration"
        [readonly]="!isBeingEdited"
        [disabled]="!isBeingEdited"
      />
    </div>
    <div class="earliest-finish">
      <input
        [value]="aonData?.earliestFinish"
        [readonly]="!isBeingEdited"
        [disabled]="!isBeingEdited"
      />
    </div>
    <div class="name">
      <input
        [value]="aonData?.name"
        [readonly]="!isBeingEdited"
        [disabled]="!isBeingEdited"
      />
    </div>
    <div class="latest-start">
      <input
        [value]="aonData?.latestStart"
        [readonly]="!isBeingEdited"
        [disabled]="!isBeingEdited"
      />
    </div>
    <div class="float">
      <input
        [value]="aonData?.float"
        [readonly]="!isBeingEdited"
        [disabled]="!isBeingEdited"
      />
    </div>
    <div class="latest-finish">
      <input
        [value]="aonData?.latestFinish"
        [readonly]="!isBeingEdited"
        [disabled]="!isBeingEdited"
      />
    </div>
  `,
  styleUrls: ['./aon-block.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AonBlockComponent implements OnInit {
  @ViewChild('earliestStartInput') earliestStartInput: ElementRef;

  @Input() aonData?: AoNData;
  @Input() isConnectionMode: boolean = false;
  @HostBinding('class.selected') @Input() isSelected: boolean = false;
  @HostBinding('class.selected-in-connection')
  @Input()
  isSelectedInConnectionMode: boolean = false;
  @HostBinding('class.edit')
  @Input()
  get isBeingEdited(): boolean {
    return this._isBeingEdited;
  }
  set isBeingEdited(value: boolean) {
    if (this.isDashboardNode) {
      if (value) { this.focusFirstField(); }
      this._isBeingEdited = value;
    }
  }
  @HostBinding('class.unused')
  public get isUnused(): boolean {
    return this.isConnectionMode && !this.isSelected;
  }

  private _isBeingEdited: boolean = false;
  private isDashboardNode: boolean; /* to distuingish dashboard node and minimap node */

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.setIsDashboardNode();
  }

  private setIsDashboardNode(): void {
    this.isDashboardNode = !this.elementRef.nativeElement.parentElement.parentElement.parentElement.parentElement.classList.contains(
      'minimap-nodes'
    );
  }

  private focusFirstField(): void {
    this.earliestStartInput.nativeElement.focus();
  }
}

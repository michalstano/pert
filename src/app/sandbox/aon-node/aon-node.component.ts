import {
  ChangeDetectionStrategy,
  Component,
  Input,
  HostBinding,
  ViewChild,
  ElementRef,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { isEqual } from 'lodash';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AoNData } from '../+state/sandbox.model';

@UntilDestroy()
@Component({
  selector: '[aon-node]',
  template: `
    <div class="earliest-start">
      <input
        #earliestStartInput
        [formControl]="earliestStartCtrl"
        [readonly]="!isBeingEdited"
      />
    </div>
    <div class="duration">
      <input
        [formControl]="durationCtrl"
        [readonly]="!isBeingEdited"
        [disableControl]="!isBeingEdited"
      />
    </div>
    <div class="earliest-finish">
      <input
        [formControl]="earliestFinishCtrl"
        [readonly]="!isBeingEdited"
        [disableControl]="!isBeingEdited"
      />
    </div>
    <div class="name">
      <input
        [formControl]="nameCtrl"
        [readonly]="!isBeingEdited"
        [disableControl]="!isBeingEdited"
      />
    </div>
    <div class="latest-start">
      <input
        [formControl]="latestStartCtrl"
        [readonly]="!isBeingEdited"
        [disableControl]="!isBeingEdited"
      />
    </div>
    <div class="float">
      <input
        [formControl]="floatCtrl"
        [readonly]="!isBeingEdited"
        [disableControl]="!isBeingEdited"
      />
    </div>
    <div class="latest-finish">
      <input
        [formControl]="latestFinishCtrl"
        [readonly]="!isBeingEdited"
        [disableControl]="!isBeingEdited"
      />
    </div>
  `,
  styleUrls: ['./aon-node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AonNodeComponent implements OnInit {
  /* ViewChildren */
  @ViewChild('earliestStartInput') earliestStartInput: ElementRef;

  /* Inputs, outputs and hostbindings */
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
      if (value) {
        this.focusFirstField();
      }
      this._isBeingEdited = value;
    }
  }
  @HostBinding('class.unused')
  public get isUnused(): boolean {
    return this.isConnectionMode && !this.isSelected;
  }

  @Output() valueChanges = new EventEmitter<AoNData>();

  /* Variables */
  private config = {
    formDebounceTime: 200
  };
  private _isBeingEdited: boolean = false;
  private isDashboardNode: boolean; /* to distuingish dashboard node and minimap node */

  /* Form controls */
  readonly earliestStartCtrl = new FormControl<number>(0);
  readonly durationCtrl = new FormControl<number>(0);
  readonly earliestFinishCtrl = new FormControl<number>(0);
  readonly nameCtrl = new FormControl<string>('');
  readonly latestStartCtrl = new FormControl<number>(0);
  readonly floatCtrl = new FormControl<number>(0);
  readonly latestFinishCtrl = new FormControl<number>(0);

  form = new FormGroup<AoNData>({
    earliestStart: this.earliestStartCtrl,
    duration: this.durationCtrl,
    earliestFinish: this.earliestFinishCtrl,
    name: this.nameCtrl,
    latestStart: this.latestStartCtrl,
    float: this.floatCtrl,
    latestFinish: this.latestFinishCtrl
  });

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.setIsDashboardNode();
    if (this.isDashboardNode) {
      this.emitValueChanges();
    }
  }

  private setIsDashboardNode(): void {
    this.isDashboardNode = !this.elementRef.nativeElement.parentElement.parentElement.parentElement.parentElement.classList.contains(
      'minimap-nodes'
    );
  }

  private emitValueChanges(): void {
    this.form.value$
      .pipe(
        distinctUntilChanged(isEqual),
        debounceTime(this.config.formDebounceTime),
        untilDestroyed(this)
      )
      .subscribe(this.valueChanges);
  }

  private focusFirstField(): void {
    this.earliestStartInput.nativeElement.focus();
  }
}

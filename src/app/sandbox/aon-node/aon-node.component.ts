import {
  ChangeDetectionStrategy,
  Component,
  Input,
  HostBinding,
  ViewChild,
  ElementRef,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { isEqual } from 'lodash';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';
import { correctNodeValidator, requiredValidator } from './aon-node.validators';
import { AoNData, AoNDataString } from '../+state/sandbox.model';
import { AonBlockInputComponent } from '../aon-block-input/aon-block-input.component';
import {
  convertAoNDataToNumbers,
  convertAoNDataToStrings
} from './aon-node.utils';

export interface NodeData {
  aonData: AoNData;
  isValid: boolean;
}

@UntilDestroy()
@Component({
  selector: '[aon-node]',
  template: `
    <div
      class="earliest-start"
      aon-block-input
      #earliestStartInput
      [isBeingEdited]="isBeingEdited"
      [isFirstItem]="true"
      [control]="earliestStartCtrl"
    ></div>
    <div
      class="duration"
      aon-block-input
      [isBeingEdited]="isBeingEdited"
      [control]="durationCtrl"
    ></div>
    <div
      class="earliest-finish"
      aon-block-input
      [isBeingEdited]="isBeingEdited"
      [control]="earliestFinishCtrl"
    ></div>
    <div
      class="name"
      aon-block-input
      [isBeingEdited]="isBeingEdited"
      [control]="nameCtrl"
      [isTextField]="true"
    ></div>
    <div
      class="latest-start"
      aon-block-input
      [isBeingEdited]="isBeingEdited"
      [control]="latestStartCtrl"
    ></div>
    <div
      class="float"
      aon-block-input
      [isBeingEdited]="isBeingEdited"
      [control]="floatCtrl"
    ></div>
    <div
      class="latest-finish"
      aon-block-input
      [isBeingEdited]="isBeingEdited"
      [control]="latestFinishCtrl"
    ></div>
  `,
  styleUrls: ['./aon-node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AonNodeComponent implements OnInit {
  /* ViewChildren */
  @ViewChild('earliestStartInput') earliestStartInput: AonBlockInputComponent;

  /* Inputs, outputs and hostbindings */
  private _aonData?: AoNData;
  @Input()
  public get aonData(): AoNData {
    return this._aonData;
  }
  public set aonData(value: AoNData) {
    if (!isEqual(value, this.aonData)) {
      this.form.patchValue(convertAoNDataToStrings(value));
      this._aonData = value;
    }
  }
  @Input() isConnectionMode = false;
  @HostBinding('class.selected') @Input() isSelected = false;
  @HostBinding('class.critical') @Input() isCritical: boolean;
  @HostBinding('class.selected-in-connection')
  @Input()
  isSelectedInConnectionMode = false;
  @HostBinding('class.edit')
  @Input()
  get isBeingEdited(): boolean {
    return this._isBeingEdited;
  }
  set isBeingEdited(value: boolean) {
    if (this.isDashboardNode) {
      if (value) {
        this.focusFirstField();
      } else {
        this.makeAllControlsTouched();
      }
      this._isBeingEdited = value;
    }
  }
  @HostBinding('class.unused')
  public get isUnused(): boolean {
    return this.isConnectionMode && !this.isSelected;
  }
  @HostBinding('class.invalid')
  public get isInvalid(): boolean {
    return this.form.invalid && !this.isBeingEdited;
  }

  @Output() valueChanges = new EventEmitter<NodeData>();

  /* Variables */
  private config = {
    formDebounceTime: 100
  };
  private _isBeingEdited = false;
  private isDashboardNode: boolean; /* to distuingish dashboard node and minimap node */

  /* Form controls */
  readonly earliestStartCtrl = new FormControl<string>(undefined, {
    validators: [requiredValidator()]
  });
  readonly durationCtrl = new FormControl<string>(undefined, {
    validators: [requiredValidator()]
  });
  readonly earliestFinishCtrl = new FormControl<string>(undefined, {
    validators: [requiredValidator()]
  });
  readonly nameCtrl = new FormControl<string>(undefined, {
    validators: [requiredValidator()]
  });
  readonly latestStartCtrl = new FormControl<string>(undefined, {
    validators: [requiredValidator()]
  });
  readonly floatCtrl = new FormControl<string>(undefined, {
    validators: [requiredValidator()]
  });
  readonly latestFinishCtrl = new FormControl<string>(undefined, {
    validators: [requiredValidator()]
  });

  form = new FormGroup<AoNDataString>(
    {
      earliestStart: this.earliestStartCtrl,
      duration: this.durationCtrl,
      earliestFinish: this.earliestFinishCtrl,
      name: this.nameCtrl,
      latestStart: this.latestStartCtrl,
      float: this.floatCtrl,
      latestFinish: this.latestFinishCtrl
    },
    { validators: [correctNodeValidator()] }
  );

  constructor(private elementRef: ElementRef, private cdr: ChangeDetectorRef) {}

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
        skip(1),
        distinctUntilChanged(isEqual),
        debounceTime(this.config.formDebounceTime),
        untilDestroyed(this)
      )
      .subscribe((aonData: AoNDataString) => {
        this.valueChanges.emit({
          aonData: convertAoNDataToNumbers(aonData),
          isValid: this.form.valid
        });
      });
  }

  private focusFirstField(): void {
    this.earliestStartInput.focus();
  }

  private makeAllControlsTouched(): void {
    this.form.markAllAsTouched();
    Object.keys(this.form.controls).forEach((key: string) => {
      this.form.get(key).updateValueAndValidity();
    });
  }
}

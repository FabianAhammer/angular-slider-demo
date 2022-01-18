import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
})
export class SliderComponent implements OnInit, AfterViewInit {
  constructor() {}

  knobOneHeight: number = 0;
  knobTwoHeight: number = 20;

  knobHeight = 20;

  minHeight: number;
  maxHeight: number;

  @Input()
  maxValue: number = 16;

  @Input()
  minValue: number = 0;

  stepsArray = [];

  firstValue: number = null;
  secondValue: number = null;

  scale = null;
  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.minHeight = this.sliderRef.nativeElement.getClientRects()[0].x;
    this.maxHeight = this.minHeight + this.sliderRef.nativeElement.offsetHeight;
    if (this.maxValue > this.minValue) {
      this.firstValue = this.minValue;
      this.secondValue = this.maxValue;
      this.scale = this.maxValue - this.minValue;
      this.stepsArray = new Array(this.scale).fill(0);
    }
  }

  firstKnobMove = false;
  secondKnobMove = false;

  @ViewChild('sliderRef')
  sliderRef: ElementRef = null;

  firstKnobMouseDown(event: MouseEvent): void {
    this.firstKnobMove = true;
    this.secondKnobMove = false;
  }

  secondKnobMouseDown(event: MouseEvent): void {
    this.firstKnobMove = false;
    this.secondKnobMove = true;
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    this.firstKnobMove = false;
    this.secondKnobMove = false;
  }

  calculteCord(valueCord: number): number {
    return (valueCord / this.scale) * this.knobHeight;
  }

  @HostListener('document:mousemove', ['$event'])
  mouseMovement(event: MouseEvent): void {
    if (this.firstKnobMove) {
      if (event.clientY < this.minHeight) {
        this.knobOneHeight = 0;
      } else if (event.clientY > this.maxHeight) {
        this.knobOneHeight =
          this.knobTwoHeight - (1 / this.scale) * this.knobHeight;
      } else {
        let valueCord = Math.round(
          ((event.clientY - this.minHeight) /
            this.sliderRef.nativeElement.offsetHeight) *
            this.scale
        );

        if (valueCord < this.secondValue) {
          this.firstValue = valueCord;
          this.knobOneHeight = this.calculteCord(valueCord);
        }
      }
    }
    if (this.secondKnobMove) {
      if (event.clientY < this.minHeight) {
        this.knobTwoHeight =
          this.knobOneHeight + (1 / this.scale) * this.knobHeight;
      } else if (event.clientY > this.maxHeight) {
        this.knobTwoHeight = this.knobHeight;
      } else {
        let valueCord = Math.round(
          ((event.clientY - this.minHeight) /
            this.sliderRef.nativeElement.offsetHeight) *
            this.scale
        );
        console.log({ valueCord });

        if (valueCord > this.firstValue) {
          this.secondValue = valueCord - this.minValue;
          this.knobTwoHeight = this.calculteCord(valueCord);
        }
      }
    }
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';
import { LoaderComponent } from './loader/loader.component';
import { ChartsModule } from 'ng2-charts';
import { LineChartComponent } from '../line-chart/line-chart.component';

@NgModule({
  imports: [FlexLayoutModule, MaterialModule, CommonModule, ChartsModule],
  declarations: [LoaderComponent, LineChartComponent],
  exports: [LoaderComponent, LineChartComponent]
})
export class SharedModule {}

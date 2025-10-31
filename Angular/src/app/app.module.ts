import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DxSchedulerModule } from 'devextreme-angular/ui/scheduler';
import { DxTemplateModule } from 'devextreme-angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DxSchedulerModule,
    DxTemplateModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }

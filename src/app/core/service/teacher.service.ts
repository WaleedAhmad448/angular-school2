import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ApiService } from './api.service';
import { Teacher } from '../model/teacher.model';
import { EntitiesNames, ModulesNames } from '../model/enums.model';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private _settings: BehaviorSubject<Teacher> = new BehaviorSubject({} as Teacher);
  settings!: Teacher;

  get settings$() {
    return this._settings.asObservable();
  }

  constructor(private api: ApiService) {
    // تهيئة خدمة الـ API للمسار المناسب
    this.api._initService(ModulesNames.school, EntitiesNames.teacher, 'v1');

    // تحميل الإعدادات الأولية
    if (!this.settings) {
      this.getSetting();
    }
  }

  getSetting() {
    this.getSettingsCombined().subscribe({
      next: (response) => {
        this.settings = response;
        this._settings.next(this.settings);
      },
    });
  }

  forceUpdateSetting() {
    this.getSettingsCombined(true).subscribe({
      next: (response) => {
        this.settings = response;
        this._settings.next(this.settings);
      },
    });
  }

  getSettingsCombined(forceUpdate: boolean = false): Observable<Teacher> {
    return forkJoin({
      teacherSettings: this.api.fetchData('POST', 'get-teacher-settings', {}),
      dimensionSettings: this.api.fetchData('POST', 'get-dimensions-settings', {})
    }).pipe(
      map((res) => {
        const combined: Teacher = {
          ...res.teacherSettings,
          ...res.dimensionSettings,
        };
        return combined;
      }),
      catchError((error) => {
        console.error('Error loading settings:', error);
        return of({} as Teacher);
      })
    );
  }
}

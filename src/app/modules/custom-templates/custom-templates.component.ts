import {
    Component,
    EventEmitter,
    OnInit,
    Output,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { environment } from 'src/environments/environment';
import { getBaseUrl } from 'src/app/core/model/http-response.model';
import { ContextService } from 'src/app/core/service/context.service';

@Component({
    selector: 'app-custom-templates',
    templateUrl: './custom-templates.component.html',
    styles: [],
})
export class CustomTemplatesComponent implements OnInit {
    @ViewChild('testPageTableEmptyRef', { static: true })
    myTemplateRef!: TemplateRef<any>;
    @ViewChild('imageCustomTemplateRef', { static: true })
    imageCustomTemplateRef!: TemplateRef<any>;
    @ViewChild('statuscustomTemplateRef', { static: true })
    statuscustomTemplateRef!: TemplateRef<any>;
    @ViewChild('testRef', { static: true }) testRef!: TemplateRef<any>;
    @ViewChild('assetImageCustomTemplateRef', { static: true })
    assetImageCustomTemplateRef!: TemplateRef<any>;
    @ViewChild('assetStatusCustomTemplateRef', { static: true })
    assetStatusCustomTemplateRef!: TemplateRef<any>;
    @ViewChild('pastHistoryTemplateRef', { static: true })
    pastHistoryTemplateRef!: TemplateRef<any>;
    @ViewChild('yesNoCustomTemplateRef', { static: true })
    yesNoCustomTemplateRef!: TemplateRef<any>;
    @ViewChild('nullValueCustomTemplateRef', { static: true })
    nullValueCustomTemplateRef!: TemplateRef<any>;
    @Output() ready: EventEmitter<boolean> = new EventEmitter();
    apiBaseUrl = environment.production ? '' : getBaseUrl();
    constructor(private ctx: ContextService) {
        console.log('%%%%%%%%%%%%%%CustomTemplate Component%%%%%%%%%%%%%%%%%');
    }
    ngOnInit(): void {
        this.ctx.set('CUSTOM_TEMPLATE:testTempRef', this.myTemplateRef);
        this.ctx.set(
            'CUSTOM_TEMPLATE:imageTempRef',
            this.imageCustomTemplateRef
        );
        this.ctx.set(
            'CUSTOM_TEMPLATE:statusTempRef',
            this.statuscustomTemplateRef
        );
        this.ctx.set(
            'CUSTOM_TEMPLATE:assetImageTempRef',
            this.assetImageCustomTemplateRef
        );
        this.ctx.set(
            'CUSTOM_TEMPLATE:assetStatusTempRef',
            this.assetStatusCustomTemplateRef
        );
        this.ctx.set(
            'CUSTOM_TEMPLATE:clinicPastHistoryTempRef',
            this.pastHistoryTemplateRef
        );
        this.ctx.set(
            'CUSTOM_TEMPLATE:clinicYesNoTempRef',
            this.yesNoCustomTemplateRef
        );
        this.ctx.set(
            'CUSTOM_TEMPLATE:clinicNullValueTempRef',
            this.nullValueCustomTemplateRef
        );
        this.ready.next(true);
    }
}

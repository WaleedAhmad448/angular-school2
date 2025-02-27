import { Component, Input } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { TenantService } from 'src/app/core/service/tenant.service';
import { AuthService } from 'src/app/core/service/auth.service';
import { getBaseUrl } from 'src/app/core/model/http-response.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  items!: MenuItem[];
  user: any;
  @Input() withMenu = true;
  constructor (
    private router: Router,
    private authService: AuthService,
    private tenantService: TenantService
  ){}
    ngOnInit() {
        this.authService.getUser().subscribe((user)=>{
            this.user = user;
        });
        this.items = [
          {
              label: 'Profile',
              icon: 'pi pi-user-edit',
              command: () => {

                this.router.navigate(['/profile'],{
                  relativeTo:null
                })
              }
          },
          {
              label: 'Log Out',
              icon: 'pi pi-sign-out',
              command: () => {
                this.logout();
                //   console.log("delete");
              }
          }
        ];
        if(!environment.production){
          // TODO THIS CODE BLOCK JUST FOR DEVLOPMENT (TO REMOVE)
          var tokens=[
            {
              label:'switch-to-admin',
              exec:`(()=>{
                localStorage.setItem("devToken","eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ4ZldQN2lBcTRrdUpjRndwY3J6T3dwT3RGR3dGVHVQT1NGbFBmNHQzS1RvIn0.eyJleHAiOjE3OTU1NDg5OTAsImlhdCI6MTcwOTE0ODk5MCwianRpIjoiZDNkNmZlNDUtOTNiMy00ZTgwLWJkZTEtYTM2MjFlZmNlZjMzIiwiaXNzIjoiaHR0cHM6Ly9hdXRoLnNhbmVkLmtpdHN5cy5jbzoxODQ0My9yZWFsbXMvc2FuZWQtZGV2LXRlbmFudC0yIiwic3ViIjoiMGZkODA2NGYtZjNmNy00NzdhLWE4MzItNzg4YWY0NjczZjFiIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2FuZWQtYXBpLWdhdGV3YXktY2xpZW50Iiwic2Vzc2lvbl9zdGF0ZSI6ImRkNWMzNjAyLThhYWUtNDU2MS1hNTIwLTY3NzIzZmM1ZWY1MiIsImFjciI6IjEiLCJzY29wZSI6Im9wZW5pZCByb2xlcyBlbWFpbCIsInNpZCI6ImRkNWMzNjAyLThhYWUtNDU2MS1hNTIwLTY3NzIzZmM1ZWY1MiIsInJvbGVzIjpbIkhEX0FETUlOIiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiIsImRlZmF1bHQtcm9sZXMtc2FuZWQtZGV2LXRlbmFudC0yIl0sImVtYWlsIjoiZGV2LWFkbWluQGtpdHN5cy5jbyJ9.pQbpSgRnVle2olTFQka--KBghzq2KCPMZiZOoML3DpUOle_qiC-gzibp64-kQVrLwlO5OmkouM0xOGJnE3sdD3QQrOiXXG7gvAe6MCNNlUMIJIOuUNdWYzZ8xTJO8Unoho00HChBXFZlMNz0sb2BYHUqmfL8jCPG3kWo9fLNMsSjpV0-F5KCJqJsrHqTppqhbi_bLBtma_T3AaUUvbCRRt3KLCqv2Epz4E28R0mBR7vRS1MQIc2tb8-vb0OKiVb9aR3p0uE-yS7xwz_afppHNBa6fQof-hq55tdyspYlTNVq4vV9T2s4G2FbWM7c2GRCb3qZ-MTq4CX86FgUm0bMjg");
                window.location.reload();
              })()`
            },
            {
              label:'switch-to-requester',
              exec:`(()=>{
                localStorage.setItem("devToken","eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ4ZldQN2lBcTRrdUpjRndwY3J6T3dwT3RGR3dGVHVQT1NGbFBmNHQzS1RvIn0.eyJleHAiOjE3OTU1NDkxMjAsImlhdCI6MTcwOTE0OTEyMCwianRpIjoiNWIxMTk3ZjEtYTNkMS00YmI5LWE0NmItNmE4NTVlOTA0Y2I4IiwiaXNzIjoiaHR0cHM6Ly9hdXRoLnNhbmVkLmtpdHN5cy5jbzoxODQ0My9yZWFsbXMvc2FuZWQtZGV2LXRlbmFudC0yIiwic3ViIjoiMzA0ODIzZGEtZjA0ZC00MWQ4LWEyM2YtODFlZWY0ZGNmMDJhIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2FuZWQtYXBpLWdhdGV3YXktY2xpZW50Iiwic2Vzc2lvbl9zdGF0ZSI6IjMzNWY5Yzg1LTg1MjYtNDk0Yi04YWM5LTdiZWFhYTk5ZTQ2OSIsImFjciI6IjEiLCJzY29wZSI6Im9wZW5pZCByb2xlcyBlbWFpbCIsInNpZCI6IjMzNWY5Yzg1LTg1MjYtNDk0Yi04YWM5LTdiZWFhYTk5ZTQ2OSIsInJvbGVzIjpbIkhEX1JFUVVFU1RFUiIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJkZWZhdWx0LXJvbGVzLXNhbmVkLWRldi10ZW5hbnQtMiJdLCJlbWFpbCI6ImRldi1kZW1vLTJAa2l0c3lzLmNvIn0.EFaQIfOTz1e_jKji1p_1f4AgjK60K-qQpuEJQN5ykiaSJRXDe4nDOuYvStZZiVerPS8F3br13QR6erkls0_pTqKjNSZGbwAKWKyllJXtXCzocS2LqWDs9InT3QtMo--XoeY2c562BAhgQ2RpQo_6CfeEUEZB__86ds-4ZK3AeiNxNPdlRaIeFFXZrgte730zhoRhmnxHJgLXdqvKBci0XhuhfVTbG9OsuHVdxZK9kj2YGCj5GGnNLc781rUpTd5SFsBC0Lo2rpvxgc2_YpK5Pf2g_hRBxttkANKO57Iy6vGx1oXpf2FXzNtM9nMEvN8zGEUFX7JRr9T8U3RWYWsAig");
                window.location.reload();
              })()`
            },
            {
              label:'switch-to-tech',
              exec:`(()=>{
                localStorage.setItem("devToken","eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ4ZldQN2lBcTRrdUpjRndwY3J6T3dwT3RGR3dGVHVQT1NGbFBmNHQzS1RvIn0.eyJleHAiOjE3OTU1NDkwNzMsImlhdCI6MTcwOTE0OTA3MywianRpIjoiNWE3MTAzMjEtMDdmMi00ZTVmLWFiZmQtOTE3YzhmNWM4Y2ZlIiwiaXNzIjoiaHR0cHM6Ly9hdXRoLnNhbmVkLmtpdHN5cy5jbzoxODQ0My9yZWFsbXMvc2FuZWQtZGV2LXRlbmFudC0yIiwic3ViIjoiZjIxMzdkNTQtMmNkYi00ZmI4LThiNmEtYjI1OTRhOGY5MjcwIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2FuZWQtYXBpLWdhdGV3YXktY2xpZW50Iiwic2Vzc2lvbl9zdGF0ZSI6ImY4NzJmZjBlLTUxNjUtNGY4MC04NDM1LTIwZmVlYmNmYjQ1YSIsImFjciI6IjEiLCJzY29wZSI6Im9wZW5pZCByb2xlcyBlbWFpbCIsInNpZCI6ImY4NzJmZjBlLTUxNjUtNGY4MC04NDM1LTIwZmVlYmNmYjQ1YSIsInJvbGVzIjpbIkhEX1RFQ0giLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIiwiZGVmYXVsdC1yb2xlcy1zYW5lZC1kZXYtdGVuYW50LTIiXSwiZW1haWwiOiJkZXYtZGVtby0xQGtpdHN5cy5jbyJ9.JKqKjNMv25nZB44n_T7v2OR9iRzc5NBOK4UYMlTOdH6vnRPXn14nuW7U5IfkGQZ0AU8vJhHrCXXmu-sNDJhhyZePJA0DK1GJflpEkSgfgwafzHrWZmNTgwr8KZ2GRA1Fr0AwY9ZTwInJOrGbVQ86PHgjaZ_mV4qTLc1T9S9Vop5ijmZ0DzQH3Y87tBd9BDb0xgmD8j6s-E6vLpJqySm5Va_6WzW9TIIF1cj6af3jxrHbBf98bxsq_FMIPMjDMsgEtPORywg8vQWjt3fLdTiLUnD7gcUs2xMxsbfzS7aoK-Z9pevltd53d36fxc3lHbhWRkB5i8mc4qxtvoJr4MuIdQ");
                window.location.reload();;
              })()`
            },
          ];
          localStorage.setItem("devTokens",JSON.stringify(tokens));
          if(localStorage.getItem("devTokens")){
            try{
              JSON.parse(localStorage.getItem("devTokens")!).map?.((info:any,i:any)=>{

                this.items.push(
                  {
                    label: info.label??("custom item " + i),
                    icon: info.icon??'pi pi-user-edit',
                    command: () => {
                      eval(info.exec);
                      // console.log('update');
                    }
                  },
                  );
                });
              }
              catch{

              }
            }
        }
    }
    logout(){
        const originUrl = getBaseUrl();
        const redirectUrl = this.getRedirectUrl();
        const tenant = this.tenantService.tenant;
        const loginUrl = `${originUrl}/api/${tenant}/OAuth/Logout?redirectUri=${redirectUrl}`;
        console.log('Logout');
        window.location.href = loginUrl;
        // this.authService.logout().subscribe({
        //     next: (value) => {
        //         this.authService.getUser().subscribe({next:()=>{}});
        //     },
        //     error: (err) => {
        //         this.authService.getUser().subscribe({next:()=>{}});
        //     },
        // });
    }
    private getRedirectUrl() {
      return window.location.origin;
    }
    initials(fullName: string): any {
      if (fullName) {
        const splittedName = fullName.trim().split(' ');
        if (splittedName.length > 1) {
          const fName = splittedName[0].charAt(0).toUpperCase();
          const lName = splittedName[splittedName.length - 1].charAt(0).toUpperCase();
          return fName+lName;
        }else{
          return fullName.trim().charAt(0).toUpperCase();
        }
      }else{
        return '';
      }
    }
}

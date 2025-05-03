import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, effect, Signal, WritableSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { KeycloakService } from 'keycloak-angular';


@Component({
  selector: 'app-root',
  template: `
    TEEXT
    <h1>{{ title() }}</h1>
    @for (item of content(); track item.id) {
      <p>{{ item.id}} | {{item.name}} | {{item.price}}</p>
    }
    <p></p>
  `,
})
export class AppComponent {
  httpClient = inject(HttpClient);

  keycloakService = inject(KeycloakService);

  content = toSignal(this.httpClient.get<Product[]>("/api/"));

  secure = toSignal(this.httpClient.get<string>("/api/secure"));

  title = computed(() => "User token:" /*+ this.token()*/);
}

type Product =
  {
    id: number,
    name: string,
    price: number,
  }


